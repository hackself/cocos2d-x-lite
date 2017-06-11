#include "manualyunvasdkbindings.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/manual/js_manual_conversions.h"
#include "mozilla/Maybe.h"
//#include "JSBRelation.h"
#include "SDK/IMDispatchMsgNode.h"

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

class IMDispatchMsgListener : public IMDispatchMsgNode::Delegate
{
public:
    IMDispatchMsgListener()
    {
    }
    ~IMDispatchMsgListener()
    {
        printf("on IMDispatchMsgListener ~listener");
        _jsCallback.destroyIfConstructed();
        _jsThisObj.destroyIfConstructed();
        _ctxObj.destroyIfConstructed();
    }
    virtual void onMessage(IMDispatchMsgNode* node, const std::string& data)
    {
		printf("IMDispatchMsgNode onMessage: data: %s.", data.c_str());
        JS::RootedObject thisObj(_ctx, _jsThisObj.ref().get().toObjectOrNull());
        JSAutoCompartment ac(_ctx, _ctxObj.ref());
        
        JS::RootedValue retval(_ctx);
        if (!_jsCallback.ref().get().isNullOrUndefined())
        {
            JS::AutoValueVector valArr(_ctx);
            valArr.append( std_string_to_jsval(_ctx, data) );
            
            JS::HandleValueArray args = JS::HandleValueArray::fromMarkedLocation(1, valArr.begin());
            JS_CallFunctionValue(_ctx, thisObj, _jsCallback.ref(), args, &retval);
        }
    }
    
    void setJSCallbackThis(JSContext *cx, JS::HandleValue jsThisObj)
    {
        _jsThisObj.construct(cx, jsThisObj);
    }
    void setJSCallbackFunc(JSContext *cx, JS::HandleValue func) {
        _jsCallback.construct(cx, func);
    }
    void setJSCallbackCtx(JSContext *ctx, JS::HandleObject ctxObj) {
        _ctx = ctx;
        _ctxObj.construct(ctx, ctxObj);
    }
    
    static IMDispatchMsgListener* _instance;
    static IMDispatchMsgListener* getInstance()
    {
        if (_instance == NULL)
        {
            _instance = new IMDispatchMsgListener();
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != NULL)
        {
            delete _instance;
            _instance = NULL;
        }
    }
private:
    mozilla::Maybe<JS::PersistentRootedValue> _jsCallback;
    mozilla::Maybe<JS::PersistentRootedValue> _jsThisObj;
    mozilla::Maybe<JS::PersistentRootedObject> _ctxObj;
    JSContext* _ctx;
};
IMDispatchMsgListener* IMDispatchMsgListener::_instance = NULL;


JSClass  *jsb_yunvasdk_IMDispatchMsgNode_class;
JSObject *jsb_yunvasdk_IMDispatchMsgNode_prototype;

bool js_yunvasdk_IMDispatchMsgNode_getInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        IMDispatchMsgNode* ret = new IMDispatchMsgNode();
        ret->init(*IMDispatchMsgListener::getInstance());
        jsval jsret = JSVAL_NULL;
        if (ret) {
			jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<IMDispatchMsgNode>(cx, (IMDispatchMsgNode*)ret));
    } else {
        jsret = JSVAL_NULL;
    };
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_getInstance : wrong number of arguments");
    return false;
}

bool js_yunvasdk_IMDispatchMsgNode_initSDK(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    IMDispatchMsgNode* cobj = (IMDispatchMsgNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_yunvasdk_IMDispatchMsgNode_initSDK : Invalid Native Object");
    if (argc == 1) {
        unsigned long arg0;
        ok &= jsval_to_ulong(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_yunvasdk_IMDispatchMsgNode_initSDK : Error processing arguments");
        cobj->initSDK(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_initSDK : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static bool jsb_yunvasdk_IMDispatchMsgNode_setListener(JSContext *cx, uint32_t argc, jsval *vp)
{
    // JS_ReportError(cx, "in jsb_yunvasdk_IMDispatchMsgNode_setListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    IMDispatchMsgNode* cobj = (IMDispatchMsgNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object jsb_yunvasdk_IMDispatchMsgNode_setListener");
    if (argc != 2)
    {
		JS_ReportError(cx, "jsb_yunvasdk_IMDispatchMsgNode_setListener : wrong number of arguments: %d, was expecting %d", argc, 2);
    	return false;
    }
    IMDispatchMsgListener* listener = IMDispatchMsgListener::getInstance();
    listener->setJSCallbackFunc( cx, args.get(0) );
    listener->setJSCallbackThis( cx, args.get(1) );
    listener->setJSCallbackCtx( cx, obj );
	return true;
}

bool js_yunvasdk_IMDispatchMsgNode_cpLogin(JSContext *cx, uint32_t argc, jsval *vp)
{
    // JS_ReportError(cx, "in js_yunvasdk_IMDispatchMsgNode_cpLogin, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    IMDispatchMsgNode* cobj = (IMDispatchMsgNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object js_yunvasdk_IMDispatchMsgNode_cpLogin");
    if (argc != 2)
    {
		JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_cpLogin : wrong number of arguments: %d, was expecting %d", argc, 2);
    	return false;
    }
	std::string arg0;
	std::string arg1;
	bool ok = true;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    ok &= jsval_to_std_string(cx, args.get(1), &arg1);
    JSB_PRECONDITION2(ok, cx, false, "js_yunvasdk_IMDispatchMsgNode_cpLogin : Error processing arguments");
    cobj->cpLogin(arg0, arg1);
    args.rval().setUndefined();
	return true;
}

bool js_yunvasdk_IMDispatchMsgNode_startRecord(JSContext *cx, uint32_t argc, jsval *vp) {
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    IMDispatchMsgNode* cobj = (IMDispatchMsgNode* )(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_yunvasdk_IMDispatchMsgNode_startRecord : Invalid Native Object");
    if (argc == 0) {
        cobj->startRecord();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_startRecord : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_yunvasdk_IMDispatchMsgNode_stopRecord(JSContext *cx, uint32_t argc, jsval *vp) {
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    IMDispatchMsgNode* cobj = (IMDispatchMsgNode* )(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_yunvasdk_IMDispatchMsgNode_stopRecord : Invalid Native Object");
    if (argc == 0) {
        cobj->stopRecord();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_stopRecord : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_yunvasdk_IMDispatchMsgNode_playRecord(JSContext *cx, uint32_t argc, jsval *vp) {
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	IMDispatchMsgNode* cobj = (IMDispatchMsgNode*)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "js_yunvasdk_IMDispatchMsgNode_playRecord : Invalid Native Object");
	if (argc == 0) {
		cobj->playRecord();
		args.rval().setUndefined();
		return true;
	}
	JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_playRecord : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_yunvasdk_IMDispatchMsgNode_playFromUrl(JSContext *cx, uint32_t argc, jsval *vp) {
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    IMDispatchMsgNode* cobj = (IMDispatchMsgNode* )(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_yunvasdk_IMDispatchMsgNode_playFromUrl : Invalid Native Object");
     if (argc == 1) {
     	std::string arg0;
		bool ok = true;
   		ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_yunvasdk_IMDispatchMsgNode_playFromUrl : Error processing arguments");
        cobj->playFromUrl(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_yunvasdk_IMDispatchMsgNode_playFromUrl : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_yunvasdkbindings_IMDispatchMsgNode(JSContext *cx, JS::HandleObject global) {
	jsb_yunvasdk_IMDispatchMsgNode_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_yunvasdk_IMDispatchMsgNode_class->name = "IMDispatchMsgNode";
    jsb_yunvasdk_IMDispatchMsgNode_class->addProperty = JS_PropertyStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->delProperty = JS_DeletePropertyStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->getProperty = JS_PropertyStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->setProperty = JS_StrictPropertyStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->enumerate = JS_EnumerateStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->resolve = JS_ResolveStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->convert = JS_ConvertStub;
    jsb_yunvasdk_IMDispatchMsgNode_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("initSDK", js_yunvasdk_IMDispatchMsgNode_initSDK, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setListener", jsb_yunvasdk_IMDispatchMsgNode_setListener, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("cpLogin", js_yunvasdk_IMDispatchMsgNode_cpLogin, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("startRecord", js_yunvasdk_IMDispatchMsgNode_startRecord, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopRecord", js_yunvasdk_IMDispatchMsgNode_stopRecord, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("playRecord", js_yunvasdk_IMDispatchMsgNode_playRecord, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("playFromUrl", js_yunvasdk_IMDispatchMsgNode_playFromUrl, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getInstance", js_yunvasdk_IMDispatchMsgNode_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_yunvasdk_IMDispatchMsgNode_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_yunvasdk_IMDispatchMsgNode_class,
        empty_constructor, 0,
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_yunvasdk_IMDispatchMsgNode_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "IMDispatchMsgNode"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<IMDispatchMsgNode>(cx, jsb_yunvasdk_IMDispatchMsgNode_class, proto, JS::NullPtr());
}




void register_all_yunvasdk_manual(JSContext* cx, JS::HandleObject obj) {
    JS::RootedObject anysdkObj(cx);
    JS::RootedObject proto(cx);
    get_or_create_js_obj(cx, obj, "yunvasdk", &anysdkObj);

    js_register_yunvasdkbindings_IMDispatchMsgNode(cx, anysdkObj);
}


