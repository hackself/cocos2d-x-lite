#include "AppDelegate.h"

#include "platform/CCGLView.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "platform/ios/CCGLViewImpl-ios.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/CCGLViewImpl-android.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "platform/desktop/CCGLViewImpl-desktop.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
#include "platform/desktop/CCGLViewImpl-desktop.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_MAC

#include "base/CCDirector.h"
#include "base/CCEventDispatcher.h"

#include "ide-support/CodeIDESupport.h"
#include "runtime/Runtime.h"
#include "ide-support/RuntimeJsImpl.h"

USING_NS_CC;
using namespace std;
class DispatchMsgNode : public cocos2d::Node
{
public:
	bool init()
	{
		isschedule = false;
		return  Node::init();
	}
	CREATE_FUNC(DispatchMsgNode);
	void startDispatch()
	{
		if (isschedule) return;
		isschedule = true;
		Director::getInstance()->getScheduler()->scheduleUpdate(this, 0, false);
	}
	void stopDispatch()
	{
		if (!isschedule) return;
		isschedule = false;
		Director::getInstance()->getScheduler()->unscheduleUpdate(this);
	}
	void update(float dt)
	{
		YVTool::getInstance()->dispatchMsg(dt);
	}
private:
	bool isschedule;

};
AppDelegate::AppDelegate()
{
	m_dispatchMsgNode = NULL;
}

AppDelegate::~AppDelegate()
{
    // NOTE:Please don't remove this call if you want to debug with Cocos Code IDE
    RuntimeEngine::getInstance()->end();
	if (m_dispatchMsgNode != NULL)
	{
		m_dispatchMsgNode->stopDispatch();
		m_dispatchMsgNode->release();
		m_dispatchMsgNode = NULL;
	}
}

//if you want a different context,just modify the value of glContextAttrs
//it will takes effect on all platforms
void AppDelegate::initGLContextAttrs()
{
    //set OpenGL context attributions,now can only set six attributions:
    //red,green,blue,alpha,depth,stencil
    GLContextAttrs glContextAttrs = {8, 8, 8, 8, 24, 8};

    GLView::setGLContextAttrs(glContextAttrs);
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // set default FPS
    Director::getInstance()->setAnimationInterval(1.0 / 60.0f);
    
    auto runtimeEngine = RuntimeEngine::getInstance();
    runtimeEngine->setEventTrackingEnable(true);
    auto jsRuntime = RuntimeJsImpl::create();
    runtimeEngine->addRuntime(jsRuntime, kRuntimeEngineJs);
    runtimeEngine->start();
	if (m_dispatchMsgNode == NULL)
	{
		m_dispatchMsgNode = DispatchMsgNode::create();
		m_dispatchMsgNode->retain();
		m_dispatchMsgNode->startDispatch();
	}
    // Runtime end
    cocos2d::log("iShow!");
    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    auto director = Director::getInstance();
    director->stopAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_hide");
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    auto director = Director::getInstance();
    director->startAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_show");
}
