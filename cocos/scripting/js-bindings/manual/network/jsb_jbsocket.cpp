#include "jsb_jbsocket.h"
#include  "network/JBSocket.h"

#include "base/ccUTF8.h"
#include "base/CCDirector.h"
#include "network/WebSocket.h"
#include "platform/CCPlatformMacros.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/manual/spidermonkey_specifics.h"

class JSB_JBSocketDelegate : public JBSocket::JBSocketDelegate
{
public:

	JSB_JBSocketDelegate()
	{
		JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
		_JSDelegate.construct(cx);
	}

	~JSB_JBSocketDelegate()
	{
		_JSDelegate.destroyIfConstructed();
	}

	virtual void onOpen(JBSocket* jb)
	{
		//js_proxy_t * p = jsb_get_native_proxy(jb);
		//if (!p) return;

		if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
			return;

		JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET

			//JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();

		// Set the protocol which server selects.
		//JS::RootedValue jsprotocol(cx, std_string_to_jsval(cx, jb->getProtocol()));
		//JS::RootedObject wsObj(cx, p->obj);
		//JS_SetProperty(cx, wsObj, "protocol", jsprotocol);

		//JS::RootedObject jsobj(cx, JS_NewObject(cx, NULL, JS::NullPtr(), JS::NullPtr()));
		//JS::RootedValue vp(cx);
		//vp = c_string_to_jsval(cx, "open");
		//JS_SetProperty(cx, jsobj, "type", vp);

		//jsval args = OBJECT_TO_JSVAL(jsobj);

		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(_JSDelegate.ref()), "onopen", 0, nullptr);
	}

	virtual void onMessage(JBSocket* ws, int msgid , const PACKAGE& data)
	{
		js_proxy_t * p = jsb_get_native_proxy(ws);
		if (p == nullptr) return;

		if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
			return;

		JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET

		JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
		JS::RootedObject jsobj(cx, JS_NewObject(cx, NULL, JS::NullPtr(), JS::NullPtr()));
		JS::RootedValue vp(cx);
		vp = int32_to_jsval(cx, msgid);
		JS_SetProperty(cx, jsobj, "msgid", vp);

		JS::RootedValue args(cx, OBJECT_TO_JSVAL(jsobj));
		JS::RootedObject buffer(cx, JS_NewArrayBuffer(cx, static_cast<uint32_t>(data.size())));
		if (data.size() > 0)
		{
			uint8_t* bufdata = JS_GetArrayBufferData(buffer);
			memcpy((void*)bufdata, (void*)&(data[0]), data.size());
		}
		JS::RootedValue dataVal(cx);
		dataVal = OBJECT_TO_JSVAL(buffer);
		JS_SetProperty(cx, jsobj, "msg", dataVal);

		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(_JSDelegate.ref()), "onmessage", 1, args.address());
	}

	virtual void onError(JBSocket* jb, JBSocketError error)
	{
		js_proxy_t * p = jsb_get_native_proxy(jb);
		if (!p) return;

		if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
			return;

		JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET

		JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
		JS::RootedObject jsobj(cx, JS_NewObject(cx, NULL, JS::NullPtr(), JS::NullPtr()));
		JS::RootedValue vp(cx);
		vp = int32_to_jsval(cx, error);
		JS_SetProperty(cx, jsobj, "errorid", vp);

		JS::RootedValue args(cx, OBJECT_TO_JSVAL(jsobj));

		ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(_JSDelegate.ref()), "onerror", 1, args.address());
	}

	void setJSDelegate(JS::HandleObject pJSDelegate)
	{
		_JSDelegate.ref() = pJSDelegate;
	}
private:
	mozilla::Maybe<JS::PersistentRootedObject> _JSDelegate;
};

JSClass  *js_cocos2dx_jbsocket_class;
JSObject *js_cocos2dx_jbsocket_prototype;

void js_cocos2dx_jbsocket_finalize(JSFreeOp *fop, JSObject *obj) {
	CCLOG("jsbindings: finalizing JS object %p (JBSocket)", obj);
}

bool js_cocos2dx_extension_jbsocket_send(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs argv = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, argv.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	JBSocket* cobj = (JBSocket *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "Invalid Native Object");

	if (argc == 2)
	{
		if (argv[0].isNumber())
		{
			GLsizei size;
			void* p;
			if (JSB_get_arraybufferview_dataptr(cx, argv[1], &size, &p))
			{
				cobj->Send(argv[0].toInt32(), PACKAGE((char*)p,(size_t)size));
			}
		}
		else
		{
			JS_ReportError(cx, "data type to be sent is unsupported.");
			return false;
		}

		argv.rval().setUndefined();

		return true;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return true;
}

bool js_cocos2dx_extension_jbsocket_connect(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs argv = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, argv.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	JBSocket* cobj = (JBSocket *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "Invalid Native Object");

	if (argc == 2)
	{
		if (argv[1].isNumber() && argv[0].isString())
		{
			std::string ip;
			jsval_to_std_string(cx, argv[0], &ip);
			cobj->Connect(ip, argv[1].toPrivateUint32());
		}
		else
		{
			JS_ReportError(cx, "data type to be sent is unsupported.");
			return false;
		}

		argv.rval().setUndefined();

		return true;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return true;
}

bool js_cocos2dx_extension_jbsocket_close(JSContext *cx, uint32_t argc, jsval *vp) {
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	JBSocket* cobj = (JBSocket *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2(cobj, cx, false, "Invalid Native Object");

	if (argc == 0) {
		cobj->Close();
		JS::RemoveObjectRoot(cx, &proxy->obj);
		jsb_remove_proxy(proxy);
		args.rval().setUndefined();
		return true;
	}
	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}

bool js_cocos2dx_extension_jbsocket_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

	if (argc == 0)
	{
		JS::RootedObject proto(cx, js_cocos2dx_jbsocket_prototype);
		JS::RootedObject obj(cx, JS_NewObject(cx, js_cocos2dx_jbsocket_class, proto, JS::NullPtr()));
		auto cobj = new (std::nothrow) JBSocket();
		JSB_JBSocketDelegate* delegate = new (std::nothrow) JSB_JBSocketDelegate();
		delegate->setJSDelegate(obj);
		cobj->SetDelegate(delegate);
				// link the native object with the javascript object
		js_proxy_t *p = jsb_new_proxy(cobj, obj);
		JS::AddNamedObjectRoot(cx, &p->obj, "JBSocket");

		args.rval().set(OBJECT_TO_JSVAL(obj));
		return true;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
void register_jsb_jbsocket(JSContext* cx, JS::HandleObject global)
{
#if _WIN32
	JBSocket::Init();
#endif
	js_cocos2dx_jbsocket_class = (JSClass *)calloc(1, sizeof(JSClass));
	js_cocos2dx_jbsocket_class->name = "JBSocket";
	js_cocos2dx_jbsocket_class->addProperty = JS_PropertyStub;
	js_cocos2dx_jbsocket_class->delProperty = JS_DeletePropertyStub;
	js_cocos2dx_jbsocket_class->getProperty = JS_PropertyStub;
	js_cocos2dx_jbsocket_class->setProperty = JS_StrictPropertyStub;
	js_cocos2dx_jbsocket_class->enumerate = JS_EnumerateStub;
	js_cocos2dx_jbsocket_class->resolve = JS_ResolveStub;
	js_cocos2dx_jbsocket_class->convert = JS_ConvertStub;
	js_cocos2dx_jbsocket_class->finalize = js_cocos2dx_jbsocket_finalize;
	js_cocos2dx_jbsocket_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	static JSPropertySpec properties[] = {
		JS_PS_END
	};

	static JSFunctionSpec funcs[] = {
		JS_FN("send",js_cocos2dx_extension_jbsocket_send, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("close",js_cocos2dx_extension_jbsocket_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("connect",js_cocos2dx_extension_jbsocket_connect, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	static JSFunctionSpec st_funcs[] = {
		JS_FS_END
	};

	js_cocos2dx_jbsocket_prototype = JS_InitClass(
		cx, global,
		JS::NullPtr(),
		js_cocos2dx_jbsocket_class,
		js_cocos2dx_extension_jbsocket_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);

	JS::RootedObject jsclassObj(cx, anonEvaluate(cx, global, "(function () { return JBSocket; })()").toObjectOrNull());

	JS_DefineProperty(cx, jsclassObj, "None", (int)JBSocketError::None, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
	JS_DefineProperty(cx, jsclassObj, "ConnectError", (int)JBSocketError::ConnectError, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
	JS_DefineProperty(cx, jsclassObj, "SendError", (int)JBSocketError::SendError, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
	JS_DefineProperty(cx, jsclassObj, "BufOverflow", (int)JBSocketError::BufOverflow, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
	JS_DefineProperty(cx, jsclassObj, "RecvError", (int)JBSocketError::RecvError, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
	JS_DefineProperty(cx, jsclassObj, "SelectError", (int)JBSocketError::SelectError, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
}