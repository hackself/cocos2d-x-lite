/************************************************************************/
/*   c++ jbsocket  (基吧专用)
/*   by:ruanban
/************************************************************************/


#include "JBSocket.h"
#include <thread>

#ifdef _WIN32
#define CloseSocket closesocket
#define SHUT_RDWR 2
#else
#define CloseSocket close
#endif

bool IsSmallEndian()
{
	union my
	{
		int a;
		char b;
	};
	my t;
	t.a = 1;
	return(t.b == 1);
}

#ifdef WIN32
void JBSocket::Init()
{
	WSADATA wsaData;
	// #define MAKEWORD(a,b) ((WORD) (((BYTE) (a)) | ((WORD) ((BYTE) (b))) << 8))
	WORD version = MAKEWORD(2, 0);
	WSAStartup(version, &wsaData);
}

void JBSocket::DeInit()
{
	WSACleanup();
}
#endif

JBSocket::JBSocket()
{
	_threadExit[(int)ThreadType::Recv] = false;
	_threadExit[(int)ThreadType::Send] = false;
	_sock = INVALID_SOCKET;
	_bufIndex = 0;
	_delegate = nullptr;
	_isSmallEndian = IsSmallEndian();
}

void JBSocket::Connect(const std::string& ip, unsigned short port)
{
	this->serverName = ip;
	this->serverPort = port;
	std::thread([this]()->void {this->ConnectThread(); }).detach();
}

void JBSocket::SetDelegate(JBSocketDelegate* delegate)
{
	if (this->_delegate != nullptr)
		delete this->_delegate;
	this->_delegate = delegate;
}

void JBSocket::Send(int msgid,const PACKAGE& data)
{
	PACKAGE str;
	str.resize(HEADSIZE * 2 + data.size());
	int* sz = reinterpret_cast<int*>(&(str[0]));
	int* id = reinterpret_cast<int*>(&(str[HEADSIZE]));
	*sz = ToSmallEndian<int>(data.size() + HEADSIZE);
	*id = ToSmallEndian<int>(msgid);
	std::copy(&data[0], &data[0] + data.size(), &(str[HEADSIZE * 2]));
	_sendMutex.lock();
	_sendQueue.emplace(str);
	_sendMutex.unlock();
}

void JBSocket::Close()
{
	if (this->_delegate != nullptr)
	{
		delete this->_delegate;
		this->_delegate = nullptr;
	}
	this->Disconnect();
	this->SafeDestory();
}

void JBSocket::ConnectThread()
{
	if (this->ConnectSyn(serverName, this->serverPort))
	{
		SEND_SOCKET_EVENT(&JBSocketDelegate::onOpen);

		//开启收发线程
		std::thread([this]()->void {this->SendThread(); }).detach();
		std::thread([this]()->void {this->RecvThread(); }).detach();

	}
	else
	{
		SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::ConnectError);
	}
}

int JBSocket::Select()
{
	if (_sock == INVALID_SOCKET) {
		return -1;
	}
	FD_ZERO(&_fdR);
	FD_SET(_sock, &_fdR);;
	//	struct timeval mytimeout;
	//	mytimeout.tv_sec = 3;
	//	mytimeout.tv_usec = 0;
	int result = select(_sock + 1, &_fdR, NULL, NULL, NULL);
	if (result == -1) {
		return -1;
	}
	else {
		if (FD_ISSET(_sock, &_fdR)) {
			return -2;
		}
		else {
			return -3;
		}
	}
}

void JBSocket::SendThread()
{
	while (this->_isConnected)
	{
		if (_sendQueue.size() > 0)
		{
			_sendMutex.lock();
			PACKAGE pack = std::move(_sendQueue.back());
			_sendQueue.pop();
			_sendMutex.unlock();

			if (!SendSyn(pack))
			{
				this->Disconnect();
				SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::SendError);
				break;
			}
		}
		else
		{
			std::chrono::milliseconds dura(1);
			std::this_thread::sleep_for(dura);
		}
	}
	OnThreadExit(ThreadType::Send);
}

void JBSocket::RecvThread()
{
	while (this->_isConnected)
	{
		int selectRes = this->Select();
		if (selectRes == -2) 
		{
			if (!this->RecvSyn())
			{
				this->Disconnect();
				break;
			}
		}
		else
		{
			SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::SelectError);
		}
	}
	OnThreadExit(ThreadType::Recv);
}


bool JBSocket::ConnectSyn(const std::string & hostname, unsigned short port)
{
	_sock = socket(AF_INET, SOCK_STREAM, 0);
	if (_sock != INVALID_SOCKET) {
		struct hostent *he;
		struct sockaddr_in svraddr;
		he = gethostbyname(hostname.c_str());
		memcpy(&svraddr.sin_addr, he->h_addr_list[0], (size_t)he->h_length);
		svraddr.sin_family = AF_INET;
		svraddr.sin_port = htons(port);
		int ret = connect(_sock, (struct sockaddr*) &svraddr, sizeof(svraddr));
		he = nullptr;
		_isConnected = (ret != SOCKET_ERROR);

		if (!_isConnected)
		{ 
			CloseSocket(_sock);
			_sock = INVALID_SOCKET;
		}
	}
	return _isConnected;
}

bool JBSocket::SendSyn(const PACKAGE& pack)
{
	long bytes;
	int count = 0;
	int len = pack.size();
	while (count < len) {
		bytes = send(_sock, &(pack[count]), (size_t)(len - count), 0);
		if (bytes == -1 || bytes == 0)
			break;
		count += bytes;
	}
	return count == len;
}


bool JBSocket::RecvSyn()
{
	int bufSize = sizeof(_buf);
	do
	{
		int size = recv(_sock, &_buf[_bufIndex], bufSize - _bufIndex, 0);
		if (size <= 0)
		{
			SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::RecvError);
			return false;
		}
		_bufIndex += size;
		if (_bufIndex > bufSize)
		{
			SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::BufOverflow);
			return false;
		}
		while (_bufIndex >= 2 * HEADSIZE)
		{
			int* sz = reinterpret_cast<int*>(&(_buf[0]));
			int packSize = ToSmallEndian<int>(*sz);
			int packFullSize = packSize + HEADSIZE;
			if (_bufIndex >= packFullSize)
			{
				int* id = reinterpret_cast<int*>(&(_buf[HEADSIZE]));
				PACKAGE pack(&(_buf[HEADSIZE * 2]), packSize - HEADSIZE);
				SEND_SOCKET_EVENT(&JBSocketDelegate::onMessage, ToSmallEndian(*id), pack);
				if (_bufIndex > packFullSize)
				{
					_bufIndex = _bufIndex - packFullSize;
					std::copy(&(_buf[packFullSize]), &(_buf[packFullSize + _bufIndex]),&(_buf[0]));
				}
				else
				{
					_bufIndex = 0;
				}
			}
			else
				break;
		}
	} while (_bufIndex > 0);

	return true;
}

void JBSocket::Disconnect()
{
	if (_sock != INVALID_SOCKET)
	{
		shutdown(_sock, SHUT_RDWR);
		CloseSocket(_sock);
		this->_isConnected = false;
		_sock = INVALID_SOCKET;
	}
}

void JBSocket::OnThreadExit(ThreadType type)
{
	_threadExit[(int)type] = true;
	this->SafeDestory();
}

void JBSocket::SafeDestory()
{
	if (this->_delegate == nullptr && _threadExit[(int)ThreadType::Recv] && _threadExit[(int)ThreadType::Send])
	{
		auto scheduler = cocos2d::Director::getInstance()->getScheduler();
		if (scheduler != nullptr)
		{
			scheduler->performFunctionInCocosThread([=]()->void {
				delete this;
			});
		}
		else
		{
			delete this;
		}
	}
}

JBSocket::~JBSocket()
{
	CCLOG("JBSocket::~JBSocket");
}