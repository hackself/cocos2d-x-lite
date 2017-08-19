/************************************************************************/
/*   c++ jbsocket  (ª˘∞…◊®”√)
/*   by:ruanban
/************************************************************************/


#include "JBSocket.h"
#include <thread>
#include "Platform/CCPlatformConfig.h"
#ifdef _WIN32
#define CloseSocket closesocket
#define SHUT_RDWR 2
#else
#define CloseSocket close
#endif

SOCKET _old_sock = INVALID_SOCKET;

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
	_threadExit[(int)ThreadType::Recv] = true;
	_threadExit[(int)ThreadType::Send] = true;
    _threadExit[(int)ThreadType::Connect] = true;
	_sock = INVALID_SOCKET;
	_bufIndex = 0;
	_delegate = nullptr;
	_isSmallEndian = IsSmallEndian();
}

void JBSocket::Connect(const std::string& hostname, unsigned short port)
{
	this->serverName = hostname;
	this->serverPort = port;
    _threadExit[(int)ThreadType::Connect] = false;
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    char ip[128];
    memset(ip, 0, sizeof(ip));
    strcpy(ip, hostname.c_str());
    getaddrinfo(ip, NULL, NULL, &result);
#endif
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
    if (!_isConnected) return;
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
		//delete this->_delegate;
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

        _threadExit[(int)ThreadType::Send] = false;
        _threadExit[(int)ThreadType::Recv] = false;
		//ø™∆Ù ’∑¢œﬂ≥Ã
		std::thread([this]()->void {this->SendThread(); }).detach();
		std::thread([this]()->void {this->RecvThread(); }).detach();

	}
	else
	{
		SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::ConnectError);
	}
    OnThreadExit(ThreadType::Connect);
}

int JBSocket::Select()
{
	if (_sock == INVALID_SOCKET) {
		return -1;
	}
	FD_ZERO(&_fdR);
	FD_SET(_sock, &_fdR);;
	struct timeval to;
	to.tv_sec = 5;
	to.tv_usec = 0;
	int result = select(_sock + 1, &_fdR, NULL, NULL, &to);
	if (result == -1) {
		return -1;
	}
	else if (result == 0){
       return 0;
    }
    else
    {
        if (FD_ISSET(_sock, &_fdR)) {
			return 1;
        }
        else
        {
            return -1;
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
				//this->Disconnect();
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
        if (selectRes == 0 || selectRes == 1)
		{
			if (!this->RecvSyn())
			{
				//this->Disconnect();
				break;
			}
		}
		else
		{
			SEND_SOCKET_EVENT(&JBSocketDelegate::onError, JBSocketError::SelectError);
            break;
		}
	}
	OnThreadExit(ThreadType::Recv);
}


bool JBSocket::ConnectSyn(const std::string & hostname, unsigned short port)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    
    char ip[128];
    memset(ip, 0, sizeof(ip));
    strcpy(ip, hostname.c_str());
    
    void* svraddr = nullptr;
    int error=-1, svraddr_len;
    bool ret = true;
    struct sockaddr_in svraddr_4;
    struct sockaddr_in6 svraddr_6;
    
    //获取网络协议
   // struct addrinfo *result;

    if (result == nullptr || result->ai_addr == nullptr)
    {
        return false;
    }
    const struct sockaddr *sa = result->ai_addr;
    socklen_t maxlen = 128;
    switch(sa->sa_family) {
        case AF_INET://ipv4
            if ((_sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
                perror("socket create failed");
                ret = false;
                break;
            }
            
            if (_sock == _old_sock)
            {
                if ((_sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
                    perror("socket create failed");
                    ret = false;
                    break;
                }
            }
            
            if(inet_ntop(AF_INET, &(((struct sockaddr_in *)sa)->sin_addr),
                         ip, maxlen) < 0){
                perror(ip);
                ret = false;
                break;
            }
            svraddr_4.sin_family = AF_INET;
            svraddr_4.sin_addr.s_addr = inet_addr(ip);
            svraddr_4.sin_port = htons(port);
            svraddr_len = sizeof(svraddr_4);
            svraddr = &svraddr_4;
            break;
        case AF_INET6://ipv6
            if ((_sock = socket(AF_INET6, SOCK_STREAM, 0)) < 0) {
                perror("socket create failed");
                ret = false;
                break;
            }
            if (_sock == _old_sock)
            {
                if ((_sock = socket(AF_INET6, SOCK_STREAM, 0)) < 0) {
                    perror("socket create failed");
                    ret = false;
                    break;
                }
            }
            inet_ntop(AF_INET6, &(((struct sockaddr_in6 *)sa)->sin6_addr),
                      ip, maxlen);
            
            printf("socket created ipv6/n");
            
            bzero(&svraddr_6, sizeof(svraddr_6));
            svraddr_6.sin6_family = AF_INET6;
            svraddr_6.sin6_port = htons(port);
            if ( inet_pton(AF_INET6, ip, &svraddr_6.sin6_addr) < 0 ) {
                perror(ip);
                ret = false;
                break;
            }
            svraddr_len = sizeof(svraddr_6);
            svraddr = &svraddr_6;
            break;
            
        default:
            printf("Unknown AF\ns");
            ret = false;
    }
    freeaddrinfo(result);
    if(!ret)
    {
        fprintf(stderr , "Cannot Connect the server!n");
        return false;
    }
    int nret = connect(_sock, (struct sockaddr*)svraddr, svraddr_len);
    _isConnected = (nret != SOCKET_ERROR);
    
    if (!_isConnected)
    {
        CloseSocket(_sock);
        _sock = INVALID_SOCKET;
    }
    
    return _isConnected;
#else
    _sock = socket(AF_INET, SOCK_STREAM, 0);
    if (_sock == _old_sock)
    {
        if ((_sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
            return false;
        }
    }
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
#endif
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
        _sendMutex.lock();
        _old_sock = _sock;

        if (_sock !=INVALID_SOCKET)
        {
            shutdown(_sock, SHUT_RDWR);
            CloseSocket(_sock);
        }

        this->_isConnected = false;
        _sock = INVALID_SOCKET;
       _sendMutex.unlock();
    }
}

void JBSocket::OnThreadExit(ThreadType type)
{
    _threadExit[(int)type] = true;
    this->SafeDestory();
}

void JBSocket::SafeDestory()
{
    if (this->_delegate == nullptr &&
        _threadExit[(int)ThreadType::Recv] &&
        _threadExit[(int)ThreadType::Send] &&
        _threadExit[(int)ThreadType::Connect])
    {
       // delete this;
        /*auto scheduler = cocos2d::Director::getInstance()->getScheduler();
		if (scheduler != nullptr)
		{
			scheduler->performFunctionInCocosThread([=]()->void {
				delete this;
			});
		}
		else
		{
			delete this;
		}*/
	}
}

JBSocket::~JBSocket()
{
	CCLOG("JBSocket::~JBSocket");
}
