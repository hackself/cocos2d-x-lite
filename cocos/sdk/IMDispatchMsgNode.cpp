#include "IMDispatchMsgNode.h"
// #include 
#include "base/CCEventDispatcher.h"
#include "base/CCEventListenerCustom.h"
// #if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
// #include 
// #include 
// #include 
// #include 
// #endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include <stdlib.h>
#include <string.h>
#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#define RECODEPATH ("C:/imsdkk/path/test.amr")
#define DOWNPATH ("C:/imsdkk/path/http.amr")

#else

#define RECODEPATH (FileUtils::getInstance()->getWritablePath() +"test.amr")
#define DOWNPATH (FileUtils::getInstance()->getWritablePath()+"dwtest.amr")

#endif
USING_NS_CC;
// using namespace CocosDenshion;
using namespace std;
using namespace cocos2d;
#define BUFFER_SIZE  8192
#define MAX_FILENAME 512
CC_DEPRECATED(4.0)
int IMDispatchMsgNode::time = 0;
IMDispatchMsgNode::IMDispatchMsgNode()
:_delegate(nullptr)
,_sdk_inited(false)
{
}
IMDispatchMsgNode::~IMDispatchMsgNode(){
}
bool IMDispatchMsgNode::init(const Delegate& delegate) {
    _delegate = const_cast<Delegate*>(&delegate);
    if(!Node::init()){
        return false;
    }
    addListern();
    return true;
}
void IMDispatchMsgNode::addListern() {
    YVTool::getInstance()->addRecordVoiceListern(this);
    YVTool::getInstance()->addDownLoadFileListern(this);
    YVTool::getInstance()->addFinishPlayListern(this);
    YVTool::getInstance()->addLoginListern(this);
    YVTool::getInstance()->addStopRecordListern(this);
    YVTool::getInstance()->addUpLoadFileListern(this);
    
}

void IMDispatchMsgNode::destroy(){
    YVTool::getInstance()->delRecordVoiceListern(this);
    YVTool::getInstance()->delDownLoadFileListern(this);
    YVTool::getInstance()->delFinishPlayListern(this);
    YVTool::getInstance()->delLoginListern(this);
    YVTool::getInstance()->delStopRecordListern(this);
    YVTool::getInstance()->delUpLoadFileListern(this);
    
    YVTool::getInstance()->cpLogout();
    YVTool::getInstance()->releaseSDK();
    Director::getInstance()->end();
} 

void IMDispatchMsgNode::initSDK(unsigned long appid){
    auto director = Director::getInstance();
    if(_sdk_inited)return; _sdk_inited=true;
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
    std::string path = "C:/imsdkk/path/";
#else
    std::string path = FileUtils::getInstance()->getWritablePath();
#endif
    YVTool::getInstance()->initSDK(appid, path, false, false);
    
    std::thread([this]()->void {this->SendThread(); }).detach();
    //m_length = length;
}

void IMDispatchMsgNode::SendThread()
{
    
    while (true)
    {
        CMD cmd;
        _sendMutex.lock();
        if (_cmds.size() > 0)
        {
            cmd = _cmds.back();
            _cmds.pop();
        }
        _sendMutex.unlock();
        switch (cmd.type)
        {
            case CMDType::Start:
                YVTool::getInstance()->startRecord(RECODEPATH,2);//2:边录音边上传
                break;
            case CMDType::Stop:
                YVTool::getInstance()->stopRecord();
                break;
            case CMDType::PlayRecord:
                YVTool::getInstance()->playRecord("", RECODEPATH, "");
                break;
            case CMDType::PlayURL:
                YVTool::getInstance()->playRecord(cmd.data,"");
                break;
            case CMDType::None:
            {
                std::chrono::milliseconds dura(1);
                std::this_thread::sleep_for(dura);
            }
            break;
        }
        
    }
    
}

bool IMDispatchMsgNode::Send(CMDType type,std::string data)
{
    _sendMutex.lock();
    CMD cmd;
    cmd.type = type;
    cmd.data = data;
    _cmds.emplace(cmd);
    _sendMutex.unlock();
    return true;
}

void IMDispatchMsgNode::cpLogin(std::string nickname,std::string uid){
    YVTool::getInstance()->cpLogin(nickname, uid);
}

bool IMDispatchMsgNode::startRecord(){
    return Send(CMDType::Start);
}
void IMDispatchMsgNode::stopRecord(){
    Send(CMDType::Stop);
}
bool IMDispatchMsgNode::playRecord(){
    return Send(CMDType::PlayRecord);
}
void IMDispatchMsgNode::playFromUrl(std::string url){
// #if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
    // if (FileUtils::getInstance()->isFileExist(DOWNPATH))
    // {
        // rmdir(DOWNPATH.c_str());
    // }
// #else
    // if (isFileExist(DOWNPATH))
    // {
        // remove(DOWNPATH.c_str());
    // }
// #endif
    
    Send(CMDType::PlayURL,url);
}

void IMDispatchMsgNode::stopPlay(){
    YVTool::getInstance()->stopPlay();
}
void IMDispatchMsgNode::upLoadFile(std::string path){
    YVTool::getInstance()->upLoadFile(RECODEPATH);
}

void IMDispatchMsgNode::onLoginListern(CPLoginResponce* r){
    //auto  event = new EventCustom("YVSDK_LOGIN_COMPLETED");
    if (r->result == 0) {
        printf("语音模块登录成功");
        YVTool::getInstance()->setRecord(10, true);
        _delegate->onMessage(this, "{\"name\":\"YVSDK_LOGIN_COMPLETED\",\"result\":0}");
    }else{
        
		printf("登录失败");
    _delegate->onMessage(this, "{\"name\":\"YVSDK_LOGIN_COMPLETED\",\"result\":1}");
    }
}
void IMDispatchMsgNode::onStopRecordListern(RecordStopNotify* r){
	printf("yvsdk onStopRecordListern");
	printf("time:%d,path:%s", r->time, r->strfilepath.c_str());
    char ttStr1[500] = { 0 };
    const char* ttFormat = "{\"name\":\"YVSDK_STOP_RECORD\",\"time\":%d,\"path\":\"%s\"}";
    IMDispatchMsgNode::time = r->time;
    sprintf(ttStr1, ttFormat, r->time, r->strfilepath.c_str());
    _delegate->onMessage(this, ttStr1);
}
void IMDispatchMsgNode::onFinishPlayListern(StartPlayVoiceRespond* r){
	printf("播放完成");
    _delegate->onMessage(this, "{\"name\":\"YVSDK_PLAY_COMPLETED\",\"result\":0}");
}
void IMDispatchMsgNode::onUpLoadFileListern(UpLoadFileRespond* r){
    char ttStr1[200] = { 0 };
    if(r->result == 0){
		printf("yvsdk upfile successful:%s", r->fileurl.c_str());
        const char* ttFormat = "{\"name\":\"YVSDK_UPLOAD_COMPLETED\",\"result\":%d,\"url\":\"%s\"}";
        sprintf(ttStr1, ttFormat, r->result, r->fileurl.c_str());
        //event->setUserData(ttStr1);
    }else{
		printf("yvsdk upfile fail:%s", r->msg.c_str());
        //char ttStr1[200] = { 0 };
        const char* ttFormat = "{\"name\":\"YVSDK_UPLOAD_COMPLETED\",\"result\":%d,\"url\":\"%s\"}";
        sprintf(ttStr1, ttFormat, r->result, r->msg.c_str());
        //event->setUserData(ttStr1);
    }
    //Director::getInstance()->getEventDispatcher()->dispatchEvent(event);
    _delegate->onMessage(this, ttStr1);
}
void IMDispatchMsgNode::onDownLoadFileListern(DownLoadFileRespond* r){
    //auto  event = new EventCustom("YVSDK_DOWNLOAD");
    char ttStr1[200] = { 0 };
    const char* ttFormat = "{\"name\":\"YVSDK_DOWNLOAD\",\"result\":%s,\"localpath\":\"%s\",\"percent\":%s}";
    if(r->result == 0){
		printf("yvsdk DownLoadFile success");
    }
    else{
		printf("yvsdk DownLoadFile failed");
    }
    sprintf(ttStr1, ttFormat, r->result, r->filename.c_str(),r->percent);
    _delegate->onMessage(this, ttStr1);
}
void IMDispatchMsgNode::onRecordVoiceListern(RecordVoiceNotify* r)
{
	printf("音量变化回调");
    char ttStr1[200] = { 0 };
    const char* ttFormat = "{\"name\":\"YVSDK_VOICE_CHANGE\",\"volume\":%d}";
    sprintf(ttStr1, ttFormat, r->volume);
    _delegate->onMessage(this, ttStr1);
}
