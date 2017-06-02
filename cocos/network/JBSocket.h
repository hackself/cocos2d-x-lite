/************************************************************************/
/*   c++ jbsocket  (基吧专用)
/*   by:ruanban
/************************************************************************/

#ifndef _JBSOCKET_H_
#define _JBSOCKET_H_
#include <string>
#include <vector>
#include <queue>
#include <mutex>
#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#ifdef WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
typedef int				socklen_t;
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <string>
typedef int				SOCKET;

//#pragma region define win32 const variable in linux
#define INVALID_SOCKET	-1
#define SOCKET_ERROR	-1
//#pragma endregion
#endif

typedef unsigned char BYTE;
typedef std::string PACKAGE;


enum JBSocketError
{
	None = 0,
	ConnectError = 1,
	SendError = 2,
	BufOverflow = 3,
	RecvError = 4,
	SelectError = 5,
};

enum ThreadType
{
	Send = 0,
	Recv = 1,
};

extern bool IsSmallEndian();

template<typename T>
T ChangeEndian(T value)
{
	unsigned char* p = reinterpret_cast<unsigned char*>(&value);
	std::reverse(p, p + sizeof(T));
	return value;
}

class CC_DLL JBSocket
{
public:
	class JBSocketDelegate
	{
	public:
		//链接成功
		virtual void onOpen(JBSocket* jbs) = 0;
		//收到消息
		virtual void onMessage(JBSocket* jbs,int msgid, const PACKAGE& msg) = 0;
		//出错
		virtual void onError(JBSocket* jbs, JBSocketError error) = 0;
	};

public:

	JBSocket();

	//异步
	void Connect(const std::string& ip, unsigned short port);

	void SetDelegate(JBSocket::JBSocketDelegate* delegate);

	void Send(int msgid,const PACKAGE& msg);

	void Close();

	~JBSocket();

#ifdef _WIN32
	static void Init();
	static void DeInit();
#endif

private:
	void SendThread();
	void RecvThread();
	void ConnectThread();
	int Select();
	bool ConnectSyn(const std::string& ip, unsigned short port);
	bool SendSyn(const PACKAGE& pack);
	bool RecvSyn();
	void Disconnect();
	void OnThreadExit(ThreadType type);
	void SafeDestory();

	template <typename T, typename... P>
	void SEND_SOCKET_EVENT(T func, P... param)
	{
		if (this->_delegate != nullptr)
		{
			auto scheduler = cocos2d::Director::getInstance()->getScheduler();
			if (scheduler != nullptr)
			{
				scheduler->performFunctionInCocosThread([=]()->void {
					(this->_delegate->*func)(this, param...);
				});
			}
		}
	}

	template <typename T>
	T ToSmallEndian(T a)
	{
		if (!_isSmallEndian)
		{
			return ChangeEndian(a);
		}
		return a;
	}

private:
	const int HEADSIZE = 4;
	bool _isConnected;
	JBSocketDelegate* _delegate;
	SOCKET _sock;
    fd_set _fdR;
	std::mutex _sendMutex;
	std::queue<PACKAGE> _sendQueue;
	std::string serverName;
	char _buf[32 * 1024];
	int _bufIndex;
	unsigned short serverPort;
	bool _isSmallEndian;
	bool _threadExit[2];
};
#endif