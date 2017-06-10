#ifndef IMDispatchMsgNode_h
#define IMDispatchMsgNode_h
// #include 
// #include 
#include "cocos2d.h"
#include "YunVaSDK/YVTool.h"

using namespace YVSDK;

class CC_DLL IMDispatchMsgNode : public cocos2d::Node,
public YVListern::YVUpLoadFileListern,
public YVListern::YVFinishPlayListern,
public YVListern::YVStopRecordListern,
public YVListern::YVLoginListern,
public YVListern::YVDownLoadFileListern,
public YVListern::YVRecordVoiceListern

{
public:
    IMDispatchMsgNode();
    ~IMDispatchMsgNode();
	
	class Delegate{
	public:
		virtual ~Delegate() {}
		virtual void onMessage(IMDispatchMsgNode* node, const std::string& data) = 0;
	};
    bool init(const Delegate& delegate);
    void addListern();
	
	void initSDK(unsigned long appid);
	void cpLogin(std::string nickname,std::string uid);
	void destroy();
    bool startRecord();
    void stopRecord();
    bool playRecord();
    void playFromUrl(std::string url);
    void stopPlay();
    void upLoadFile(std::string path);
    
    void onLoginListern(CPLoginResponce* r);
    void onStopRecordListern(RecordStopNotify* r);
    void onFinishPlayListern(StartPlayVoiceRespond* r);
    void onUpLoadFileListern(UpLoadFileRespond* r);
    void onDownLoadFileListern(DownLoadFileRespond* r);
    void onRecordVoiceListern(RecordVoiceNotify*);
	// static IMDispatchMsgNode getInstance();
    
private:
    bool _sdk_inited;
    static int time;
	unsigned int m_length;
	Delegate* _delegate;
	// static IMDispatchMsgNode m_instance;
};

#endif /* IMDispatchMsgNode_h */
