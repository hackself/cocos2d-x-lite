require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AudioMgr":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd2df2LGO/FCOJQCrG5T+a4t', 'AudioMgr');
// Scripts\Manager\AudioMgr.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bgmVolume: 1.0,
        sfxVolume: 1.0,
        bgmAudioID: -1
    },

    // use this for initialization
    init: function init() {
        var t = cc.sys.localStorage.getItem("gbmVolume");
        if (t != null) {
            this.bgmVolume = parseFloat(t);
        }

        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.sfxVolume = parseFloat(t);
        }

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    getUrl: function getUrl(url) {
        return cc.url.raw("rel/Sound/" + url);
    },

    playBGM: function playBGM(url) {
        var auidoUrl = this.getUrl(url);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    },

    playSFX: function playSFX(url) {
        var audioUrl = this.getUrl(url);
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },

    setBGMVolume: function setBGMVolume(v, force) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            } else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
        }
        if (this.bgmVolume != v || force) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function resumeAll() {
        cc.audioEngine.resumeAll();
    }

});

cc._RF.pop();
},{}],1:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"DataManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, '2307bIa+iBNorYNK5W+/1D1', 'DataManager');
// Scripts\Manager\DataManager.js

"use strict";

//数据管理器，存储全局数据
var M = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc.datamanager = new M();

cc._RF.pop();
},{}],"GameManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ba526NcqlNN2qgcNxBxFSq7', 'GameManager');
// Scripts\Manager\GameManager.js

"use strict";

//游戏管理器，进入房间后的数据和逻辑管理
var M = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc.gamemanager = new M();

cc._RF.pop();
},{}],"GuiManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'bc58aNIfmBAPaAtobwrO1iF', 'GuiManager');
// Scripts\Manager\GuiManager.js

'use strict';

var M = cc.Class({

    ctor: function ctor() {
        this.panels = {};
    },

    dispachMsg: function dispachMsg(name, msgdata) {
        for (var key in this.panels) {
            var list = this.panels[key];
            for (var i = 0; i < list.length; ++i) {
                var p = list[i];
                if (typeof p[name] == 'function') {
                    p[name](msgdata);
                }
            }
        }
    },

    open: function open(name, bvisible, call) {
        var self = this;
        cc.loader.loadRes('Gui/' + name, function (err, prefab) {
            if (prefab != null) {
                var obj = cc.instantiate(prefab);
                obj.parent = cc.director.getScene();
                var panel = obj.getComponent(cc.uipanel);
                if (call != null) call(panel);
                var list = self.panels[name];
                if (list == null) {
                    list = [];
                    self.panels[name] = list;
                }
                panel.onCreate();
                if (bvisible == undefined) panel.setVisible(true);else {
                    panel.setVisible(bvisible);
                }

                list.push(panel);
                return panel;
            } else {
                cc.log('open panel fail:' + name);
            }
        });
    },

    destroyPanel: function destroyPanel(panel) {
        panel.onClose();
        panel.node.destroy();
    },

    close: function close(panel) {
        for (var key in this.panels) {
            var list = this.panels[key];
            for (var i = list.length - 1; i >= 0; --i) {
                if (list[i] == panel) {
                    this.destroyPanel(panel);
                    list.slice(i, 1);
                    return;
                }
            }
        }
    },

    closeByName: function closeByName(panelName) {
        var list = this.panels[panelName];
        if (list != null) {
            for (var i = 0; i < list.lenght; ++i) {
                this.destroyPanel(list[i]);
            }
            this.panels[panelName] = null;
        }
    },

    closeAll: function closeAll() {
        for (var key in this.panels) {
            var list = this.panels[key];
            for (var i = 0; i < list.lenght; ++i) {
                this.destroyPanel(list[i]);
            }
        }
        this.panels = {};
    }
});
cc.guimanager = new M();

cc._RF.pop();
},{}],"NetManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ba6d9dJZGBATpJFt+e5rKLY', 'NetManager');
// Scripts\Manager\NetManager.js

'use strict';

var M = cc.Class({
    ctor: function ctor() {
        require('long');
        require('bytebuffer');
        this.ProtoBuf = require('protobuf');
        this.handler = [];
    },

    init: function init() {

        this.messages = {};
        var self = this;
        this.loadProto('Proto/client', function (builder) {
            self.buildMessage(builder, 'PublicProto.C_Login');
            self.buildMessage(builder, 'PublicProto.S_LoginRet');
            self.buildMessage(builder, 'PublicProto.C_G13_JionGame');
            self.buildMessage(builder, 'PublicProto.C_G13_CreateGame');
            self.buildMessage(builder, 'PublicProto.C_G13_JionGame');
            self.buildMessage(builder, 'PublicProto.S_G13_RoomAttr');
            self.buildMessage(builder, 'PublicProto.C_G13_GiveUp');
            self.buildMessage(builder, 'PublicProto.S_G13_AbortGameOrNot');
            self.buildMessage(builder, 'PublicProto.S_G13_VoteFoAbortGame');
            self.buildMessage(builder, 'PublicProto.S_G13_Quited');
            self.buildMessage(builder, 'PublicProto.C_G13_ReadySwitch');
            self.buildMessage(builder, 'PublicProto.S_G13_PlayersInRoom');
            self.buildMessage(builder, 'PublicProto.S_G13_Hand');
            self.buildMessage(builder, 'PublicProto.C_G13_BringOut');
            self.buildMessage(builder, 'PublicProto.S_G13_AllHands');
        });
        this.loadProtoID();
    },

    loadProto: function loadProto(path, call) {
        var self = this;
        cc.loader.loadRes(path, function (err, proto) {
            var builder = self.ProtoBuf.protoFromString(proto);
            call(builder);
        });
    },

    buildMessage: function buildMessage(builder, name) {
        this.messages[name] = builder.build(name);
    },

    loadProtoID: function loadProtoID() {
        var self = this;
        cc.loader.loadRes('Proto/protoid', function (err, protoid) {
            self.id_name_map = JSON.parse(protoid);
        });
    },

    id_name_convert: function id_name_convert(id_or_name) {
        return this.proto_id_name_map[id_or_name];
    },

    connect: function connect(ip, port, func) {
        if (this.jbsocket == null) this.jbsocket = new JBSocket();

        this.jbsocket.onopen = function () {
            func(true);
        };

        var self = this;
        this.jbsocket.onerror = function (data) {
            if (data.errorid == JBSocket.ConnectError) func(false);else self.close();
        };
        this.jbsocket.onmessage = function (data) {
            cc.log('data.msgid:' + data.msgid);
            self.dispachMsg(data.msgid, data.msg);
        };
        this.jbsocket.connect(ip, port);
    },

    //关闭网络
    close: function close() {
        if (this.jbsocket != null) {
            this.jbsocket.close();
            this.jbsocket = null;
        }
    },

    //分发消息
    dispachMsg: function dispachMsg(msgid, msg) {
        var msgname = this.id_name_map[String(msgid)];
        var msgdata = this.messages[msgname].decode(msg);
        var msghandlername = msgname.replace('.', '_');
        cc.log('recv:' + msgname);
        for (var i = 0; i < this.handler.length; ++i) {
            this.handler[i].dispachMsg(msghandlername, msgdata);
        }
    },

    //申请一个 msg
    msg: function msg(msgname) {
        var message = this.messages[msgname];
        if (message) {
            var ret = new message();
            ret.__msgid = this.id_name_map[msgname];
            return ret;
        }
        return null;
    },

    //发送msg
    send: function send(msg) {
        if (this.jbsocket != null) {
            var id = msg.__msgid;
            this.jbsocket.send(id, String.fromCharCode.apply(null, new Uint8Array(msg.toBuffer())));
        }
    },

    registerHandler: function registerHandler(handler) {
        var self = this;
        if (handler != null && typeof handler.dispachMsg == 'function') {
            self.handler.push(handler);
        }
    }
});
cc.netmanager = new M();

cc._RF.pop();
},{"bytebuffer":"bytebuffer","long":"long","protobuf":"protobuf"}],"SceneManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5c8f0oxxLpE/6xiGrgxAiIh', 'SceneManager');
// Scripts\Manager\SceneManager.js

'use strict';

var M = cc.Class({
    loadScene: function loadScene(name, call) {
        cc.log('test');
        cc.director.loadScene(name, call);
        cc.guimanager.closeAll();
    },
    loadMainScene: function loadMainScene() {
        this.loadScene('Main', function () {
            cc.guimanager.open('UIMain');
        });
    },

    loadLoginScene: function loadLoginScene() {
        cc.log('loadlogin');
        this.loadScene('Login', function () {
            cc.guimanager.open('UILogin');
        });
    }
});

cc.scenemanager = new M();

cc._RF.pop();
},{}],"UIJoinRoom":[function(require,module,exports){
"use strict";
cc._RF.push(module, '973adVbE99DMqXsT6KyvjKG', 'UIJoinRoom');
// Scripts\Gui\UIJoinRoom.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        btnClose: cc.Button,
        btnComfire: cc.Button,
        spCursor: cc.Node,
        curIndex: 0
    },

    updateCursor: function updateCursor() {
        if (this.curIndex < 0) this.curIndex = 0;
        if (this.curIndex < 6) {
            var room = this.node.getChildByName('roomid');
            this.spCursor.parent = room.children[this.curIndex];
            this.spCursor.position = cc.p(0, 0);
        }

        this.btnClose.interactable = this.isfull();
    },

    getValue: function getValue(node) {
        return node.getChildByName('num').getComponent(cc.Label).string;
    },

    getRoomID: function getRoomID() {
        var room = this.node.getChildByName('roomid');
        var cs = room.children;
        var ids = [];
        for (var i = 0; i < room.childrenCount; ++i) {
            ids[i] = this.getValue(cs[i]);
        }
        return parseInt(ids.join(""));
    },

    setValue: function setValue(node, str) {
        node.getChildByName('num').getComponent(cc.Label).string = str;
    },

    setCurIndexValue: function setCurIndexValue(str) {
        if (!this.isfull()) {
            var room = this.node.getChildByName('roomid');
            this.setValue(room.children[this.curIndex], str);
        }
    },

    isfull: function isfull() {
        return this.curIndex == 6;
    },

    resetValue: function resetValue() {
        var room = this.node.getChildByName('roomid');
        var cs = room.children;
        for (var i = 0; i < this.curIndex; ++i) {
            this.setValue(cs[i], "");
        }
        this.curIndex = 0;
        this.updateCursor();
    },

    deleteValue: function deleteValue() {
        if (this.curIndex >= 0) {
            --this.curIndex;
            if (this.curIndex < 0) this.curIndex = 0;
            this.setCurIndexValue("");
            this.updateCursor();
        }
    },

    inputValue: function inputValue(num) {
        if (!this.isfull()) {
            this.setCurIndexValue(num);
            ++this.curIndex;
            this.updateCursor();
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var keyboard = this.node.getChildByName('keyboard');
        var cs = keyboard.children;
        for (var i = 0; i < keyboard.childrenCount; ++i) {
            var btn = cs[i].getComponent(cc.Button);
            var self = this;
            btn.node.on('click', function (event) {
                var node = event.target;
                if (node.name == "btn_reset") {
                    self.resetValue();
                } else if (node.name == "btn_delete") {
                    self.deleteValue();
                } else {
                    self.inputValue(node.getChildByName('num').getComponent(cc.Label).string);
                }
            });
        }
        this.btnClose.interactable = this.isfull();
    },

    onClick_btnClose: function onClick_btnClose() {
        this.close();
    },

    onclick_btnComfire: function onclick_btnComfire() {
        var msg = cc.netmanager.msg('PublicProto.C_G13_JionGame');
        msg.room_code = this.getRoomID();
        cc.netmanager.send(msg);
        console.log('require join room:' + msg.room_code);
        this.close();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UILogin":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'fe480vPekNN7KUEzU8UAhgP', 'UILogin');
// Scripts\Gui\UILogin.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        btnWXLogin: cc.Button,
        btnGuestLogin: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.initMgr();
    },

    //init managers
    initMgr: function initMgr() {
        cc.mgr = {};

        //init audio manager
        var AudioMgr = require("AudioMgr");
        cc.mgr.AudioMgr = new AudioMgr();
        cc.mgr.AudioMgr.init();
    },

    lockUI: function lockUI(bLock) {
        var interactable = !bLock;
        this.btnWXLogin.interactable = interactable;
        this.btnGuestLogin.interactable = interactable;

        //TO:转菊花 
    },

    login: function login(type) {
        this.lockUI(true);
        var self = this;
        cc.netmanager.connect('10.173.32.52', 7000, function (ok) {
            if (ok) {
                cc.log('connected!');
                var msg = cc.netmanager.msg('PublicProto.C_Login');
                msg.login_type = type;
                msg.openid = '1';
                msg.token = 'xxxxx';
                msg.nick_name = 'ruanban';
                cc.netmanager.send(msg);
            } else {
                self.lockUI(false);
                cc.log('connect fail!');
            }
        });
    },

    //wechat login
    onClick_btnWXLogin: function onClick_btnWXLogin(event) {
        this.login(0);
    },

    //返回协议 
    PublicProto_S_LoginRet: function PublicProto_S_LoginRet(msg) {
        this.lockUI(false);
        if (msg.ret_code == 1) {
            cc.log('login success! cuid:' + msg.cuid);
            cc.scenemanager.loadMainScene();
        } else {
            cc.log('login fail!');
        }
    },

    onMessageError: function onMessageError(errorid) {
        this.lockUI(false);
    },

    //guest login
    onClick_btnGuestLogin: function onClick_btnGuestLogin() {
        this.login(1);
    }

});

cc._RF.pop();
},{"AudioMgr":"AudioMgr","UIPanel":"UIPanel"}],"UIMain":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'bcb68jCR6NKyZZhF+bNoMrU', 'UIMain');
// Scripts\Gui\UIMain.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        btnNotice: cc.Button,
        btnCreateRoom: cc.Button,
        btnJoinRoom: cc.Button,
        funcNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},

    update: function update() {
        cc.log(this.funcNode.width);
        this.funcNode.scaleY = this.funcNode.width / 840.0;
    },

    onClick_btnNotice: function onClick_btnNotice() {
        cc.guimanager.open('UINotice');
    },

    onClick_btnCreateRoom: function onClick_btnCreateRoom() {},

    onClick_btnJoinRoom: function onClick_btnJoinRoom() {
        cc.guimanager.open('UIJoinRoom');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UINotice":[function(require,module,exports){
"use strict";
cc._RF.push(module, '4ef4dTBL2VHV5Z7HFbNfVNc', 'UINotice');
// Scripts\Gui\UINotice.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        btnClose: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onBtnCloseClicked: function onBtnCloseClicked() {
        this.close();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIPanel":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f6431fstrhNK5MN2iz1NYLe', 'UIPanel');
// Scripts\Gui\UIPanel.js

'use strict';

if (cc.uipanel == undefined) {
    cc.log('uipanel init');
    cc.uipanel = cc.Class({
        extends: cc.Component,
        ctor: function ctor() {
            this.isModel = true;
        },
        setVisible: function setVisible(bVisible) {
            this.node.activeSelf = bVisible;
            if (bVisible) {
                this.onShow();
            } else {
                this.onHide();
            }
        },

        onCreate: function onCreate() {
            if (this.isModel) {
                var self = this;
                cc.loader.loadRes('Gui/ModalBg', function (err, prefab) {
                    cc.log('load');
                    self.bg = cc.instantiate(prefab);
                    self.bg.parent = self.node;
                    self.bg.setSiblingIndex(0);
                    self.bg.on(cc.Node.EventType.TOUCH_START, function (event) {
                        event.stopPropagationImmediate();
                    });
                });
            }
        },

        onClose: function onClose() {
            if (this.bg) {
                this.bg.off(cc.Node.EventType.TOUCH_START);
            }
        },

        onShow: function onShow() {},

        onHide: function onHide() {},

        close: function close() {
            cc.guimanager.close(this);
        }
    });
}

cc._RF.pop();
},{}],"bytebuffer":[function(require,module,exports){
"use strict";
cc._RF.push(module, '370a1Icrw1Ltpqrh3NzRfir', 'bytebuffer');
// Scripts\Lib\bytebuffer.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
 Backing buffer: ArrayBuffer, Accessor: Uint8Array
 Released under the Apache License, Version 2.0
 see: https://github.com/dcodeIO/bytebuffer.js for details
*/
(function (k, m) {
  if ("function" === typeof define && define.amd) define(["long"], m);else if ("function" === typeof require && "object" === (typeof module === "undefined" ? "undefined" : _typeof(module)) && module && module.exports) {
    var r = module,
        s;try {
      s = require("long");
    } catch (u) {}s = m(s);r.exports = s;
  } else (k.dcodeIO = k.dcodeIO || {}).ByteBuffer = m(k.dcodeIO.Long);
})(undefined, function (k) {
  function m(a) {
    var b = 0;return function () {
      return b < a.length ? a.charCodeAt(b++) : null;
    };
  }function r() {
    var a = [],
        b = [];return function () {
      if (0 === arguments.length) return b.join("") + w.apply(String, a);1024 < a.length + arguments.length && (b.push(w.apply(String, a)), a.length = 0);Array.prototype.push.apply(a, arguments);
    };
  }function s(a, b, c, d, f) {
    var l;l = 8 * f - d - 1;var g = (1 << l) - 1,
        e = g >> 1,
        h = -7;f = c ? f - 1 : 0;var k = c ? -1 : 1,
        p = a[b + f];f += k;c = p & (1 << -h) - 1;p >>= -h;for (h += l; 0 < h; c = 256 * c + a[b + f], f += k, h -= 8) {}l = c & (1 << -h) - 1;c >>= -h;for (h += d; 0 < h; l = 256 * l + a[b + f], f += k, h -= 8) {}if (0 === c) c = 1 - e;else {
      if (c === g) return l ? NaN : Infinity * (p ? -1 : 1);l += Math.pow(2, d);c -= e;
    }return (p ? -1 : 1) * l * Math.pow(2, c - d);
  }function u(a, b, c, d, f, l) {
    var g,
        e = 8 * l - f - 1,
        h = (1 << e) - 1,
        k = h >> 1,
        p = 23 === f ? Math.pow(2, -24) - Math.pow(2, -77) : 0;l = d ? 0 : l - 1;var m = d ? 1 : -1,
        n = 0 > b || 0 === b && 0 > 1 / b ? 1 : 0;b = Math.abs(b);isNaN(b) || Infinity === b ? (b = isNaN(b) ? 1 : 0, d = h) : (d = Math.floor(Math.log(b) / Math.LN2), 1 > b * (g = Math.pow(2, -d)) && (d--, g *= 2), b = 1 <= d + k ? b + p / g : b + p * Math.pow(2, 1 - k), 2 <= b * g && (d++, g /= 2), d + k >= h ? (b = 0, d = h) : 1 <= d + k ? (b = (b * g - 1) * Math.pow(2, f), d += k) : (b = b * Math.pow(2, k - 1) * Math.pow(2, f), d = 0));for (; 8 <= f; a[c + l] = b & 255, l += m, b /= 256, f -= 8) {}d = d << f | b;for (e += f; 0 < e; a[c + l] = d & 255, l += m, d /= 256, e -= 8) {}a[c + l - m] |= 128 * n;
  }var h = function h(a, b, c) {
    "undefined" === typeof a && (a = h.DEFAULT_CAPACITY);"undefined" === typeof b && (b = h.DEFAULT_ENDIAN);"undefined" === typeof c && (c = h.DEFAULT_NOASSERT);if (!c) {
      a |= 0;if (0 > a) throw RangeError("Illegal capacity");b = !!b;c = !!c;
    }this.buffer = 0 === a ? v : new ArrayBuffer(a);this.view = 0 === a ? null : new Uint8Array(this.buffer);this.offset = 0;this.markedOffset = -1;this.limit = a;this.littleEndian = b;this.noAssert = c;
  };h.VERSION = "5.0.1";h.LITTLE_ENDIAN = !0;h.BIG_ENDIAN = !1;h.DEFAULT_CAPACITY = 16;h.DEFAULT_ENDIAN = h.BIG_ENDIAN;h.DEFAULT_NOASSERT = !1;h.Long = k || null;var e = h.prototype;Object.defineProperty(e, "__isByteBuffer__", { value: !0, enumerable: !1, configurable: !1 });var v = new ArrayBuffer(0),
      w = String.fromCharCode;h.accessor = function () {
    return Uint8Array;
  };h.allocate = function (a, b, c) {
    return new h(a, b, c);
  };h.concat = function (a, b, c, d) {
    if ("boolean" === typeof b || "string" !== typeof b) d = c, c = b, b = void 0;for (var f = 0, l = 0, g = a.length, e; l < g; ++l) {
      h.isByteBuffer(a[l]) || (a[l] = h.wrap(a[l], b)), e = a[l].limit - a[l].offset, 0 < e && (f += e);
    }if (0 === f) return new h(0, c, d);b = new h(f, c, d);for (l = 0; l < g;) {
      c = a[l++], e = c.limit - c.offset, 0 >= e || (b.view.set(c.view.subarray(c.offset, c.limit), b.offset), b.offset += e);
    }b.limit = b.offset;b.offset = 0;return b;
  };h.isByteBuffer = function (a) {
    return !0 === (a && a.__isByteBuffer__);
  };h.type = function () {
    return ArrayBuffer;
  };h.wrap = function (a, b, c, d) {
    "string" !== typeof b && (d = c, c = b, b = void 0);if ("string" === typeof a) switch ("undefined" === typeof b && (b = "utf8"), b) {case "base64":
        return h.fromBase64(a, c);case "hex":
        return h.fromHex(a, c);case "binary":
        return h.fromBinary(a, c);case "utf8":
        return h.fromUTF8(a, c);case "debug":
        return h.fromDebug(a, c);default:
        throw Error("Unsupported encoding: " + b);}if (null === a || "object" !== (typeof a === "undefined" ? "undefined" : _typeof(a))) throw TypeError("Illegal buffer");if (h.isByteBuffer(a)) return b = e.clone.call(a), b.markedOffset = -1, b;if (a instanceof Uint8Array) b = new h(0, c, d), 0 < a.length && (b.buffer = a.buffer, b.offset = a.byteOffset, b.limit = a.byteOffset + a.byteLength, b.view = new Uint8Array(a.buffer));else if (a instanceof ArrayBuffer) b = new h(0, c, d), 0 < a.byteLength && (b.buffer = a, b.offset = 0, b.limit = a.byteLength, b.view = 0 < a.byteLength ? new Uint8Array(a) : null);else if ("[object Array]" === Object.prototype.toString.call(a)) for (b = new h(a.length, c, d), b.limit = a.length, c = 0; c < a.length; ++c) {
      b.view[c] = a[c];
    } else throw TypeError("Illegal buffer");return b;
  };e.writeBitSet = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if (!(a instanceof Array)) throw TypeError("Illegal BitSet: Not an array");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = b,
        f = a.length,
        e = f >> 3,
        g = 0,
        h;for (b += this.writeVarint32(f, b); e--;) {
      h = !!a[g++] & 1 | (!!a[g++] & 1) << 1 | (!!a[g++] & 1) << 2 | (!!a[g++] & 1) << 3 | (!!a[g++] & 1) << 4 | (!!a[g++] & 1) << 5 | (!!a[g++] & 1) << 6 | (!!a[g++] & 1) << 7, this.writeByte(h, b++);
    }if (g < f) {
      for (h = e = 0; g < f;) {
        h |= (!!a[g++] & 1) << e++;
      }this.writeByte(h, b++);
    }return c ? (this.offset = b, this) : b - d;
  };e.readBitSet = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);var c = this.readVarint32(a),
        d = c.value,
        f = d >> 3,
        e = 0,
        g = [];for (a += c.length; f--;) {
      c = this.readByte(a++), g[e++] = !!(c & 1), g[e++] = !!(c & 2), g[e++] = !!(c & 4), g[e++] = !!(c & 8), g[e++] = !!(c & 16), g[e++] = !!(c & 32), g[e++] = !!(c & 64), g[e++] = !!(c & 128);
    }if (e < d) for (f = 0, c = this.readByte(a++); e < d;) {
      g[e++] = !!(c >> f++ & 1);
    }b && (this.offset = a);return g;
  };e.readBytes = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+" + a + ") <= " + this.buffer.byteLength);
    }var d = this.slice(b, b + a);c && (this.offset += a);return d;
  };e.writeBytes = e.append;e.writeInt8 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 1;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);this.view[b - 1] = a;c && (this.offset += 1);return this;
  };e.writeByte = e.writeInt8;e.readInt8 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }a = this.view[a];128 === (a & 128) && (a = -(255 - a + 1));b && (this.offset += 1);return a;
  };e.readByte = e.readInt8;e.writeUint8 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 1;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);
    this.view[b - 1] = a;c && (this.offset += 1);return this;
  };e.writeUInt8 = e.writeUint8;e.readUint8 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }a = this.view[a];b && (this.offset += 1);return a;
  };e.readUInt8 = e.readUint8;e.writeInt16 = function (a, b) {
    var c = "undefined" === typeof b;
    c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 2;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 2;this.littleEndian ? (this.view[b + 1] = (a & 65280) >>> 8, this.view[b] = a & 255) : (this.view[b] = (a & 65280) >>> 8, this.view[b + 1] = a & 255);c && (this.offset += 2);return this;
  };e.writeShort = e.writeInt16;e.readInt16 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a], c |= this.view[a + 1] << 8) : (c = this.view[a] << 8, c |= this.view[a + 1]);32768 === (c & 32768) && (c = -(65535 - c + 1));b && (this.offset += 2);return c;
  };e.readShort = e.readInt16;e.writeUint16 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 2;var d = this.buffer.byteLength;
    b > d && this.resize((d *= 2) > b ? d : b);b -= 2;this.littleEndian ? (this.view[b + 1] = (a & 65280) >>> 8, this.view[b] = a & 255) : (this.view[b] = (a & 65280) >>> 8, this.view[b + 1] = a & 255);c && (this.offset += 2);return this;
  };e.writeUInt16 = e.writeUint16;e.readUint16 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a], c |= this.view[a + 1] << 8) : (c = this.view[a] << 8, c |= this.view[a + 1]);b && (this.offset += 2);return c;
  };e.readUInt16 = e.readUint16;e.writeInt32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 4;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 4;this.littleEndian ? (this.view[b + 3] = a >>> 24 & 255, this.view[b + 2] = a >>> 16 & 255, this.view[b + 1] = a >>> 8 & 255, this.view[b] = a & 255) : (this.view[b] = a >>> 24 & 255, this.view[b + 1] = a >>> 16 & 255, this.view[b + 2] = a >>> 8 & 255, this.view[b + 3] = a & 255);c && (this.offset += 4);return this;
  };e.writeInt = e.writeInt32;e.readInt32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0) : (c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);b && (this.offset += 4);return c | 0;
  };e.readInt = e.readInt32;e.writeUint32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 4;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 4;this.littleEndian ? (this.view[b + 3] = a >>> 24 & 255, this.view[b + 2] = a >>> 16 & 255, this.view[b + 1] = a >>> 8 & 255, this.view[b] = a & 255) : (this.view[b] = a >>> 24 & 255, this.view[b + 1] = a >>> 16 & 255, this.view[b + 2] = a >>> 8 & 255, this.view[b + 3] = a & 255);c && (this.offset += 4);return this;
  };e.writeUInt32 = e.writeUint32;e.readUint32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0) : (c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);b && (this.offset += 4);return c;
  };e.readUInt32 = e.readUint32;k && (e.writeInt64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" === typeof a) a = k.fromNumber(a);else if ("string" === typeof a) a = k.fromString(a);else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }"number" === typeof a ? a = k.fromNumber(a) : "string" === typeof a && (a = k.fromString(a));b += 8;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 8;var d = a.low,
        f = a.high;this.littleEndian ? (this.view[b + 3] = d >>> 24 & 255, this.view[b + 2] = d >>> 16 & 255, this.view[b + 1] = d >>> 8 & 255, this.view[b] = d & 255, b += 4, this.view[b + 3] = f >>> 24 & 255, this.view[b + 2] = f >>> 16 & 255, this.view[b + 1] = f >>> 8 & 255, this.view[b] = f & 255) : (this.view[b] = f >>> 24 & 255, this.view[b + 1] = f >>> 16 & 255, this.view[b + 2] = f >>> 8 & 255, this.view[b + 3] = f & 255, b += 4, this.view[b] = d >>> 24 & 255, this.view[b + 1] = d >>> 16 & 255, this.view[b + 2] = d >>> 8 & 255, this.view[b + 3] = d & 255);c && (this.offset += 8);return this;
  }, e.writeLong = e.writeInt64, e.readInt64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
      a >>>= 0;if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
    }var c = 0,
        d = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0, a += 4, d = this.view[a + 2] << 16, d |= this.view[a + 1] << 8, d |= this.view[a], d += this.view[a + 3] << 24 >>> 0) : (d = this.view[a + 1] << 16, d |= this.view[a + 2] << 8, d |= this.view[a + 3], d += this.view[a] << 24 >>> 0, a += 4, c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);
    a = new k(c, d, !1);b && (this.offset += 8);return a;
  }, e.readLong = e.readInt64, e.writeUint64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" === typeof a) a = k.fromNumber(a);else if ("string" === typeof a) a = k.fromString(a);else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }"number" === typeof a ? a = k.fromNumber(a) : "string" === typeof a && (a = k.fromString(a));b += 8;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 8;var d = a.low,
        f = a.high;this.littleEndian ? (this.view[b + 3] = d >>> 24 & 255, this.view[b + 2] = d >>> 16 & 255, this.view[b + 1] = d >>> 8 & 255, this.view[b] = d & 255, b += 4, this.view[b + 3] = f >>> 24 & 255, this.view[b + 2] = f >>> 16 & 255, this.view[b + 1] = f >>> 8 & 255, this.view[b] = f & 255) : (this.view[b] = f >>> 24 & 255, this.view[b + 1] = f >>> 16 & 255, this.view[b + 2] = f >>> 8 & 255, this.view[b + 3] = f & 255, b += 4, this.view[b] = d >>> 24 & 255, this.view[b + 1] = d >>> 16 & 255, this.view[b + 2] = d >>> 8 & 255, this.view[b + 3] = d & 255);c && (this.offset += 8);return this;
  }, e.writeUInt64 = e.writeUint64, e.readUint64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
    }var c = 0,
        d = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0, a += 4, d = this.view[a + 2] << 16, d |= this.view[a + 1] << 8, d |= this.view[a], d += this.view[a + 3] << 24 >>> 0) : (d = this.view[a + 1] << 16, d |= this.view[a + 2] << 8, d |= this.view[a + 3], d += this.view[a] << 24 >>> 0, a += 4, c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);a = new k(c, d, !0);b && (this.offset += 8);return a;
  }, e.readUInt64 = e.readUint64);e.writeFloat32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a) throw TypeError("Illegal value: " + a + " (not a number)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 4;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);u(this.view, a, b - 4, this.littleEndian, 23, 4);c && (this.offset += 4);return this;
  };e.writeFloat = e.writeFloat32;e.readFloat32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }a = s(this.view, a, this.littleEndian, 23, 4);b && (this.offset += 4);return a;
  };e.readFloat = e.readFloat32;e.writeFloat64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a) throw TypeError("Illegal value: " + a + " (not a number)");
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 8;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);u(this.view, a, b - 8, this.littleEndian, 52, 8);c && (this.offset += 8);return this;
  };e.writeDouble = e.writeFloat64;e.readFloat64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
    }a = s(this.view, a, this.littleEndian, 52, 8);b && (this.offset += 8);return a;
  };e.readDouble = e.readFloat64;h.MAX_VARINT32_BYTES = 5;h.calculateVarint32 = function (a) {
    a >>>= 0;return 128 > a ? 1 : 16384 > a ? 2 : 2097152 > a ? 3 : 268435456 > a ? 4 : 5;
  };h.zigZagEncode32 = function (a) {
    return ((a |= 0) << 1 ^ a >> 31) >>> 0;
  };h.zigZagDecode32 = function (a) {
    return a >>> 1 ^ -(a & 1) | 0;
  };e.writeVarint32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = h.calculateVarint32(a),
        f;b += d;f = this.buffer.byteLength;b > f && this.resize((f *= 2) > b ? f : b);
    b -= d;for (a >>>= 0; 128 <= a;) {
      f = a & 127 | 128, this.view[b++] = f, a >>>= 7;
    }this.view[b++] = a;return c ? (this.offset = b, this) : d;
  };e.writeVarint32ZigZag = function (a, b) {
    return this.writeVarint32(h.zigZagEncode32(a), b);
  };e.readVarint32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = 0,
        d = 0,
        f;do {
      if (!this.noAssert && a > this.limit) throw a = Error("Truncated"), a.truncated = !0, a;f = this.view[a++];5 > c && (d |= (f & 127) << 7 * c);++c;
    } while (0 !== (f & 128));d |= 0;return b ? (this.offset = a, d) : { value: d, length: c };
  };e.readVarint32ZigZag = function (a) {
    a = this.readVarint32(a);"object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) ? a.value = h.zigZagDecode32(a.value) : a = h.zigZagDecode32(a);return a;
  };k && (h.MAX_VARINT64_BYTES = 10, h.calculateVarint64 = function (a) {
    "number" === typeof a ? a = k.fromNumber(a) : "string" === typeof a && (a = k.fromString(a));var b = a.toInt() >>> 0,
        c = a.shiftRightUnsigned(28).toInt() >>> 0;a = a.shiftRightUnsigned(56).toInt() >>> 0;return 0 == a ? 0 == c ? 16384 > b ? 128 > b ? 1 : 2 : 2097152 > b ? 3 : 4 : 16384 > c ? 128 > c ? 5 : 6 : 2097152 > c ? 7 : 8 : 128 > a ? 9 : 10;
  }, h.zigZagEncode64 = function (a) {
    "number" === typeof a ? a = k.fromNumber(a, !1) : "string" === typeof a ? a = k.fromString(a, !1) : !1 !== a.unsigned && (a = a.toSigned());return a.shiftLeft(1).xor(a.shiftRight(63)).toUnsigned();
  }, h.zigZagDecode64 = function (a) {
    "number" === typeof a ? a = k.fromNumber(a, !1) : "string" === typeof a ? a = k.fromString(a, !1) : !1 !== a.unsigned && (a = a.toSigned());return a.shiftRightUnsigned(1).xor(a.and(k.ONE).toSigned().negate()).toSigned();
  }, e.writeVarint64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" === typeof a) a = k.fromNumber(a);else if ("string" === typeof a) a = k.fromString(a);else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }"number" === typeof a ? a = k.fromNumber(a, !1) : "string" === typeof a ? a = k.fromString(a, !1) : !1 !== a.unsigned && (a = a.toSigned());var d = h.calculateVarint64(a),
        f = a.toInt() >>> 0,
        e = a.shiftRightUnsigned(28).toInt() >>> 0,
        g = a.shiftRightUnsigned(56).toInt() >>> 0;b += d;var t = this.buffer.byteLength;b > t && this.resize((t *= 2) > b ? t : b);b -= d;switch (d) {case 10:
        this.view[b + 9] = g >>> 7 & 1;case 9:
        this.view[b + 8] = 9 !== d ? g | 128 : g & 127;case 8:
        this.view[b + 7] = 8 !== d ? e >>> 21 | 128 : e >>> 21 & 127;case 7:
        this.view[b + 6] = 7 !== d ? e >>> 14 | 128 : e >>> 14 & 127;case 6:
        this.view[b + 5] = 6 !== d ? e >>> 7 | 128 : e >>> 7 & 127;case 5:
        this.view[b + 4] = 5 !== d ? e | 128 : e & 127;case 4:
        this.view[b + 3] = 4 !== d ? f >>> 21 | 128 : f >>> 21 & 127;case 3:
        this.view[b + 2] = 3 !== d ? f >>> 14 | 128 : f >>> 14 & 127;case 2:
        this.view[b + 1] = 2 !== d ? f >>> 7 | 128 : f >>> 7 & 127;case 1:
        this.view[b] = 1 !== d ? f | 128 : f & 127;}return c ? (this.offset += d, this) : d;
  }, e.writeVarint64ZigZag = function (a, b) {
    return this.writeVarint64(h.zigZagEncode64(a), b);
  }, e.readVarint64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = a,
        d = 0,
        f = 0,
        e = 0,
        g = 0,
        g = this.view[a++],
        d = g & 127;if (g & 128 && (g = this.view[a++], d |= (g & 127) << 7, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], d |= (g & 127) << 14, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], d |= (g & 127) << 21, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f = g & 127, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f |= (g & 127) << 7, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f |= (g & 127) << 14, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f |= (g & 127) << 21, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], e = g & 127, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], e |= (g & 127) << 7, g & 128 || this.noAssert && "undefined" === typeof g)) throw Error("Buffer overrun");d = k.fromBits(d | f << 28, f >>> 4 | e << 24, !1);return b ? (this.offset = a, d) : { value: d, length: a - c };
  }, e.readVarint64ZigZag = function (a) {
    (a = this.readVarint64(a)) && a.value instanceof k ? a.value = h.zigZagDecode64(a.value) : a = h.zigZagDecode64(a);return a;
  });e.writeCString = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);var d,
        f = a.length;if (!this.noAssert) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");for (d = 0; d < f; ++d) {
        if (0 === a.charCodeAt(d)) throw RangeError("Illegal str: Contains NULL-characters");
      }if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }f = n.calculateUTF16asUTF8(m(a))[1];b += f + 1;d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= f + 1;n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));this.view[b++] = 0;return c ? (this.offset = b, this) : f;
  };e.readCString = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = a,
        d,
        f = -1;n.decodeUTF8toUTF16(function () {
      if (0 === f) return null;if (a >= this.limit) throw RangeError("Illegal range: Truncated data, " + a + " < " + this.limit);f = this.view[a++];return 0 === f ? null : f;
    }.bind(this), d = r(), !0);return b ? (this.offset = a, d()) : { string: d(), length: a - c };
  };e.writeIString = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = b,
        f;f = n.calculateUTF16asUTF8(m(a), this.noAssert)[1];b += 4 + f;var e = this.buffer.byteLength;b > e && this.resize((e *= 2) > b ? e : b);b -= 4 + f;this.littleEndian ? (this.view[b + 3] = f >>> 24 & 255, this.view[b + 2] = f >>> 16 & 255, this.view[b + 1] = f >>> 8 & 255, this.view[b] = f & 255) : (this.view[b] = f >>> 24 & 255, this.view[b + 1] = f >>> 16 & 255, this.view[b + 2] = f >>> 8 & 255, this.view[b + 3] = f & 255);b += 4;n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));if (b !== d + 4 + f) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + 4 + f));return c ? (this.offset = b, this) : b - d;
  };e.readIString = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }var c = a,
        d = this.readUint32(a),
        d = this.readUTF8String(d, h.METRICS_BYTES, a += 4);a += d.length;return b ? (this.offset = a, d.string) : { string: d.string, length: a - c };
  };h.METRICS_CHARS = "c";h.METRICS_BYTES = "b";e.writeUTF8String = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d,
        f = b;d = n.calculateUTF16asUTF8(m(a))[1];b += d;var e = this.buffer.byteLength;b > e && this.resize((e *= 2) > b ? e : b);b -= d;n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));return c ? (this.offset = b, this) : b - f;
  };e.writeString = e.writeUTF8String;h.calculateUTF8Chars = function (a) {
    return n.calculateUTF16asUTF8(m(a))[0];
  };h.calculateUTF8Bytes = function (a) {
    return n.calculateUTF16asUTF8(m(a))[1];
  };
  h.calculateString = h.calculateUTF8Bytes;e.readUTF8String = function (a, b, c) {
    "number" === typeof b && (c = b, b = void 0);var d = "undefined" === typeof c;d && (c = this.offset);"undefined" === typeof b && (b = h.METRICS_CHARS);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");a |= 0;if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
    }var f = 0,
        e = c,
        g;if (b === h.METRICS_CHARS) {
      g = r();n.decodeUTF8(function () {
        return f < a && c < this.limit ? this.view[c++] : null;
      }.bind(this), function (a) {
        ++f;n.UTF8toUTF16(a, g);
      });if (f !== a) throw RangeError("Illegal range: Truncated data, " + f + " == " + a);return d ? (this.offset = c, g()) : { string: g(), length: c - e };
    }if (b === h.METRICS_BYTES) {
      if (!this.noAssert) {
        if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+" + a + ") <= " + this.buffer.byteLength);
      }var k = c + a;n.decodeUTF8toUTF16(function () {
        return c < k ? this.view[c++] : null;
      }.bind(this), g = r(), this.noAssert);if (c !== k) throw RangeError("Illegal range: Truncated data, " + c + " == " + k);return d ? (this.offset = c, g()) : { string: g(), length: c - e };
    }throw TypeError("Unsupported metrics: " + b);
  };e.readString = e.readUTF8String;e.writeVString = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = b,
        f,
        e;f = n.calculateUTF16asUTF8(m(a), this.noAssert)[1];e = h.calculateVarint32(f);b += e + f;var g = this.buffer.byteLength;b > g && this.resize((g *= 2) > b ? g : b);b -= e + f;b += this.writeVarint32(f, b);n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));if (b !== d + f + e) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + f + e));return c ? (this.offset = b, this) : b - d;
  };e.readVString = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = a,
        d = this.readVarint32(a),
        d = this.readUTF8String(d.value, h.METRICS_BYTES, a += d.length);a += d.length;return b ? (this.offset = a, d.string) : { string: d.string,
      length: a - c };
  };e.append = function (a, b, c) {
    if ("number" === typeof b || "string" !== typeof b) c = b, b = void 0;var d = "undefined" === typeof c;d && (c = this.offset);if (!this.noAssert) {
      if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
    }a instanceof h || (a = h.wrap(a, b));b = a.limit - a.offset;if (0 >= b) return this;c += b;var f = this.buffer.byteLength;c > f && this.resize((f *= 2) > c ? f : c);c -= b;this.view.set(a.view.subarray(a.offset, a.limit), c);a.offset += b;d && (this.offset += b);return this;
  };e.appendTo = function (a, b) {
    a.append(this, b);return this;
  };e.assert = function (a) {
    this.noAssert = !a;return this;
  };e.capacity = function () {
    return this.buffer.byteLength;
  };e.clear = function () {
    this.offset = 0;this.limit = this.buffer.byteLength;this.markedOffset = -1;return this;
  };e.clone = function (a) {
    var b = new h(0, this.littleEndian, this.noAssert);a ? (b.buffer = new ArrayBuffer(this.buffer.byteLength), b.view = new Uint8Array(b.buffer)) : (b.buffer = this.buffer, b.view = this.view);b.offset = this.offset;b.markedOffset = this.markedOffset;b.limit = this.limit;return b;
  };e.compact = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }if (0 === a && b === this.buffer.byteLength) return this;var c = b - a;if (0 === c) return this.buffer = v, this.view = null, 0 <= this.markedOffset && (this.markedOffset -= a), this.limit = this.offset = 0, this;var d = new ArrayBuffer(c),
        f = new Uint8Array(d);f.set(this.view.subarray(a, b));this.buffer = d;this.view = f;0 <= this.markedOffset && (this.markedOffset -= a);this.offset = 0;this.limit = c;return this;
  };e.copy = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }if (a === b) return new h(0, this.littleEndian, this.noAssert);var c = b - a,
        d = new h(c, this.littleEndian, this.noAssert);d.offset = 0;d.limit = c;0 <= d.markedOffset && (d.markedOffset -= a);this.copyTo(d, 0, a, b);return d;
  };e.copyTo = function (a, b, c, d) {
    var f, e;if (!this.noAssert && !h.isByteBuffer(a)) throw TypeError("Illegal target: Not a ByteBuffer");b = (e = "undefined" === typeof b) ? a.offset : b | 0;c = (f = "undefined" === typeof c) ? this.offset : c | 0;d = "undefined" === typeof d ? this.limit : d | 0;if (0 > b || b > a.buffer.byteLength) throw RangeError("Illegal target range: 0 <= " + b + " <= " + a.buffer.byteLength);if (0 > c || d > this.buffer.byteLength) throw RangeError("Illegal source range: 0 <= " + c + " <= " + this.buffer.byteLength);var g = d - c;if (0 === g) return a;a.ensureCapacity(b + g);
    a.view.set(this.view.subarray(c, d), b);f && (this.offset += g);e && (a.offset += g);return this;
  };e.ensureCapacity = function (a) {
    var b = this.buffer.byteLength;return b < a ? this.resize((b *= 2) > a ? b : a) : this;
  };e.fill = function (a, b, c) {
    var d = "undefined" === typeof b;d && (b = this.offset);"string" === typeof a && 0 < a.length && (a = a.charCodeAt(0));"undefined" === typeof b && (b = this.offset);"undefined" === typeof c && (c = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal begin: Not an integer");b >>>= 0;if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal end: Not an integer");c >>>= 0;if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
    }if (b >= c) return this;for (; b < c;) {
      this.view[b++] = a;
    }d && (this.offset = b);return this;
  };e.flip = function () {
    this.limit = this.offset;this.offset = 0;return this;
  };e.mark = function (a) {
    a = "undefined" === typeof a ? this.offset : a;
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+0) <= " + this.buffer.byteLength);
    }this.markedOffset = a;return this;
  };e.order = function (a) {
    if (!this.noAssert && "boolean" !== typeof a) throw TypeError("Illegal littleEndian: Not a boolean");this.littleEndian = !!a;return this;
  };e.LE = function (a) {
    this.littleEndian = "undefined" !== typeof a ? !!a : !0;return this;
  };e.BE = function (a) {
    this.littleEndian = "undefined" !== typeof a ? !a : !1;return this;
  };e.prepend = function (a, b, c) {
    if ("number" === typeof b || "string" !== typeof b) c = b, b = void 0;var d = "undefined" === typeof c;d && (c = this.offset);if (!this.noAssert) {
      if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
    }a instanceof h || (a = h.wrap(a, b));b = a.limit - a.offset;if (0 >= b) return this;var f = b - c;if (0 < f) {
      var e = new ArrayBuffer(this.buffer.byteLength + f),
          g = new Uint8Array(e);g.set(this.view.subarray(c, this.buffer.byteLength), b);this.buffer = e;this.view = g;this.offset += f;0 <= this.markedOffset && (this.markedOffset += f);this.limit += f;c += f;
    } else new Uint8Array(this.buffer);this.view.set(a.view.subarray(a.offset, a.limit), c - b);a.offset = a.limit;d && (this.offset -= b);return this;
  };e.prependTo = function (a, b) {
    a.prepend(this, b);return this;
  };e.printDebug = function (a) {
    "function" !== typeof a && (a = console.log.bind(console));a(this.toString() + "\n-------------------------------------------------------------------\n" + this.toDebug(!0));
  };e.remaining = function () {
    return this.limit - this.offset;
  };e.reset = function () {
    0 <= this.markedOffset ? (this.offset = this.markedOffset, this.markedOffset = -1) : this.offset = 0;return this;
  };e.resize = function (a) {
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal capacity: " + a + " (not an integer)");a |= 0;if (0 > a) throw RangeError("Illegal capacity: 0 <= " + a);
    }if (this.buffer.byteLength < a) {
      a = new ArrayBuffer(a);var b = new Uint8Array(a);b.set(this.view);this.buffer = a;this.view = b;
    }return this;
  };
  e.reverse = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }if (a === b) return this;Array.prototype.reverse.call(this.view.subarray(a, b));return this;
  };
  e.skip = function (a) {
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");a |= 0;
    }var b = this.offset + a;if (!this.noAssert && (0 > b || b > this.buffer.byteLength)) throw RangeError("Illegal length: 0 <= " + this.offset + " + " + a + " <= " + this.buffer.byteLength);this.offset = b;return this;
  };e.slice = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
      a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }var c = this.clone();c.offset = a;c.limit = b;return c;
  };e.toBuffer = function (a) {
    var b = this.offset,
        c = this.limit;if (!this.noAssert) {
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: Not an integer");b >>>= 0;if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal limit: Not an integer");
      c >>>= 0;if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
    }if (!a && 0 === b && c === this.buffer.byteLength) return this.buffer;if (b === c) return v;a = new ArrayBuffer(c - b);new Uint8Array(a).set(new Uint8Array(this.buffer).subarray(b, c), 0);return a;
  };e.toArrayBuffer = e.toBuffer;e.toString = function (a, b, c) {
    if ("undefined" === typeof a) return "ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";"number" === typeof a && (c = b = a = "utf8");switch (a) {case "utf8":
        return this.toUTF8(b, c);case "base64":
        return this.toBase64(b, c);case "hex":
        return this.toHex(b, c);case "binary":
        return this.toBinary(b, c);case "debug":
        return this.toDebug();case "columns":
        return this.toColumns();default:
        throw Error("Unsupported encoding: " + a);}
  };var x = function () {
    for (var a = {}, b = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47], c = [], d = 0, f = b.length; d < f; ++d) {
      c[b[d]] = d;
    }a.encode = function (a, c) {
      for (var d, f; null !== (d = a());) {
        c(b[d >> 2 & 63]), f = (d & 3) << 4, null !== (d = a()) ? (f |= d >> 4 & 15, c(b[(f | d >> 4 & 15) & 63]), f = (d & 15) << 2, null !== (d = a()) ? (c(b[(f | d >> 6 & 3) & 63]), c(b[d & 63])) : (c(b[f & 63]), c(61))) : (c(b[f & 63]), c(61), c(61));
      }
    };a.decode = function (a, b) {
      function d(a) {
        throw Error("Illegal character code: " + a);
      }for (var f, e, h; null !== (f = a());) {
        if (e = c[f], "undefined" === typeof e && d(f), null !== (f = a()) && (h = c[f], "undefined" === typeof h && d(f), b(e << 2 >>> 0 | (h & 48) >> 4), null !== (f = a()))) {
          e = c[f];if ("undefined" === typeof e) if (61 === f) break;else d(f);b((h & 15) << 4 >>> 0 | (e & 60) >> 2);if (null !== (f = a())) {
            h = c[f];if ("undefined" === typeof h) if (61 === f) break;else d(f);b((e & 3) << 6 >>> 0 | h);
          }
        }
      }
    };a.test = function (a) {
      return (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a)
      );
    };return a;
  }();e.toBase64 = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);a |= 0;b |= 0;if (0 > a || b > this.capacity || a > b) throw RangeError("begin, end");var c;x.encode(function () {
      return a < b ? this.view[a++] : null;
    }.bind(this), c = r());return c();
  };h.fromBase64 = function (a, b) {
    if ("string" !== typeof a) throw TypeError("str");var c = new h(a.length / 4 * 3, b),
        d = 0;x.decode(m(a), function (a) {
      c.view[d++] = a;
    });c.limit = d;return c;
  };h.btoa = function (a) {
    return h.fromBinary(a).toBase64();
  };h.atob = function (a) {
    return h.fromBase64(a).toBinary();
  };e.toBinary = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);
    a |= 0;b |= 0;if (0 > a || b > this.capacity() || a > b) throw RangeError("begin, end");if (a === b) return "";for (var c = [], d = []; a < b;) {
      c.push(this.view[a++]), 1024 <= c.length && (d.push(String.fromCharCode.apply(String, c)), c = []);
    }return d.join("") + String.fromCharCode.apply(String, c);
  };h.fromBinary = function (a, b) {
    if ("string" !== typeof a) throw TypeError("str");for (var c = 0, d = a.length, f, e = new h(d, b); c < d;) {
      f = a.charCodeAt(c);if (255 < f) throw RangeError("illegal char code: " + f);e.view[c++] = f;
    }e.limit = d;return e;
  };e.toDebug = function (a) {
    for (var b = -1, c = this.buffer.byteLength, d, f = "", e = "", g = ""; b < c;) {
      -1 !== b && (d = this.view[b], f = 16 > d ? f + ("0" + d.toString(16).toUpperCase()) : f + d.toString(16).toUpperCase(), a && (e += 32 < d && 127 > d ? String.fromCharCode(d) : "."));++b;if (a && 0 < b && 0 === b % 16 && b !== c) {
        for (; 51 > f.length;) {
          f += " ";
        }g += f + e + "\n";f = e = "";
      }f = b === this.offset && b === this.limit ? f + (b === this.markedOffset ? "!" : "|") : b === this.offset ? f + (b === this.markedOffset ? "[" : "<") : b === this.limit ? f + (b === this.markedOffset ? "]" : ">") : f + (b === this.markedOffset ? "'" : a || 0 !== b && b !== c ? " " : "");
    }if (a && " " !== f) {
      for (; 51 > f.length;) {
        f += " ";
      }g += f + e + "\n";
    }return a ? g : f;
  };h.fromDebug = function (a, b, c) {
    var d = a.length;b = new h((d + 1) / 3 | 0, b, c);for (var f = 0, e = 0, g, k = !1, m = !1, n = !1, p = !1, q = !1; f < d;) {
      switch (g = a.charAt(f++)) {case "!":
          if (!c) {
            if (m || n || p) {
              q = !0;break;
            }m = n = p = !0;
          }b.offset = b.markedOffset = b.limit = e;k = !1;break;case "|":
          if (!c) {
            if (m || p) {
              q = !0;break;
            }m = p = !0;
          }b.offset = b.limit = e;k = !1;break;case "[":
          if (!c) {
            if (m || n) {
              q = !0;break;
            }m = n = !0;
          }b.offset = b.markedOffset = e;k = !1;break;case "<":
          if (!c) {
            if (m) {
              q = !0;break;
            }m = !0;
          }b.offset = e;k = !1;break;case "]":
          if (!c) {
            if (p || n) {
              q = !0;break;
            }p = n = !0;
          }b.limit = b.markedOffset = e;k = !1;break;case ">":
          if (!c) {
            if (p) {
              q = !0;break;
            }p = !0;
          }b.limit = e;k = !1;break;case "'":
          if (!c) {
            if (n) {
              q = !0;break;
            }n = !0;
          }b.markedOffset = e;k = !1;break;case " ":
          k = !1;break;default:
          if (!c && k) {
            q = !0;break;
          }g = parseInt(g + a.charAt(f++), 16);if (!c && (isNaN(g) || 0 > g || 255 < g)) throw TypeError("Illegal str: Not a debug encoded string");b.view[e++] = g;k = !0;}if (q) throw TypeError("Illegal str: Invalid symbol at " + f);
    }if (!c) {
      if (!m || !p) throw TypeError("Illegal str: Missing offset or limit");
      if (e < b.buffer.byteLength) throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + e + " < " + d);
    }return b;
  };e.toHex = function (a, b) {
    a = "undefined" === typeof a ? this.offset : a;b = "undefined" === typeof b ? this.limit : b;if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }for (var c = Array(b - a), d; a < b;) {
      d = this.view[a++], 16 > d ? c.push("0", d.toString(16)) : c.push(d.toString(16));
    }return c.join("");
  };h.fromHex = function (a, b, c) {
    if (!c) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");if (0 !== a.length % 2) throw TypeError("Illegal str: Length not a multiple of 2");
    }var d = a.length;b = new h(d / 2 | 0, b);for (var f, e = 0, g = 0; e < d; e += 2) {
      f = parseInt(a.substring(e, e + 2), 16);if (!c && (!isFinite(f) || 0 > f || 255 < f)) throw TypeError("Illegal str: Contains non-hex characters");
      b.view[g++] = f;
    }b.limit = g;return b;
  };var n = function () {
    var a = { MAX_CODEPOINT: 1114111, encodeUTF8: function encodeUTF8(a, c) {
        var d = null;"number" === typeof a && (d = a, a = function a() {
          return null;
        });for (; null !== d || null !== (d = a());) {
          128 > d ? c(d & 127) : (2048 > d ? c(d >> 6 & 31 | 192) : (65536 > d ? c(d >> 12 & 15 | 224) : (c(d >> 18 & 7 | 240), c(d >> 12 & 63 | 128)), c(d >> 6 & 63 | 128)), c(d & 63 | 128)), d = null;
        }
      }, decodeUTF8: function decodeUTF8(a, c) {
        for (var d, f, e, g, h = function h(a) {
          a = a.slice(0, a.indexOf(null));var b = Error(a.toString());b.name = "TruncatedError";b.bytes = a;throw b;
        }; null !== (d = a());) {
          if (0 === (d & 128)) c(d);else if (192 === (d & 224)) null === (f = a()) && h([d, f]), c((d & 31) << 6 | f & 63);else if (224 === (d & 240)) null !== (f = a()) && null !== (e = a()) || h([d, f, e]), c((d & 15) << 12 | (f & 63) << 6 | e & 63);else if (240 === (d & 248)) null !== (f = a()) && null !== (e = a()) && null !== (g = a()) || h([d, f, e, g]), c((d & 7) << 18 | (f & 63) << 12 | (e & 63) << 6 | g & 63);else throw RangeError("Illegal starting byte: " + d);
        }
      }, UTF16toUTF8: function UTF16toUTF8(a, c) {
        for (var d, e = null; null !== (d = null !== e ? e : a());) {
          55296 <= d && 57343 >= d && null !== (e = a()) && 56320 <= e && 57343 >= e ? (c(1024 * (d - 55296) + e - 56320 + 65536), e = null) : c(d);
        }null !== e && c(e);
      }, UTF8toUTF16: function UTF8toUTF16(a, c) {
        var d = null;"number" === typeof a && (d = a, a = function a() {
          return null;
        });for (; null !== d || null !== (d = a());) {
          65535 >= d ? c(d) : (d -= 65536, c((d >> 10) + 55296), c(d % 1024 + 56320)), d = null;
        }
      }, encodeUTF16toUTF8: function encodeUTF16toUTF8(b, c) {
        a.UTF16toUTF8(b, function (b) {
          a.encodeUTF8(b, c);
        });
      }, decodeUTF8toUTF16: function decodeUTF8toUTF16(b, c) {
        a.decodeUTF8(b, function (b) {
          a.UTF8toUTF16(b, c);
        });
      }, calculateCodePoint: function calculateCodePoint(a) {
        return 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
      }, calculateUTF8: function calculateUTF8(a) {
        for (var c, d = 0; null !== (c = a());) {
          d += 128 > c ? 1 : 2048 > c ? 2 : 65536 > c ? 3 : 4;
        }return d;
      }, calculateUTF16asUTF8: function calculateUTF16asUTF8(b) {
        var c = 0,
            d = 0;a.UTF16toUTF8(b, function (a) {
          ++c;d += 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
        });return [c, d];
      } };return a;
  }();e.toUTF8 = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }var c;try {
      n.decodeUTF8toUTF16(function () {
        return a < b ? this.view[a++] : null;
      }.bind(this), c = r());
    } catch (d) {
      if (a !== b) throw RangeError("Illegal range: Truncated data, " + a + " != " + b);
    }return c();
  };h.fromUTF8 = function (a, b, c) {
    if (!c && "string" !== typeof a) throw TypeError("Illegal str: Not a string");var d = new h(n.calculateUTF16asUTF8(m(a), !0)[1], b, c),
        e = 0;n.encodeUTF16toUTF8(m(a), function (a) {
      d.view[e++] = a;
    });d.limit = e;return d;
  };return h;
});

cc._RF.pop();
},{"long":"long"}],"init":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'b5713OFGZhA+Jt7gBxhwNe/', 'init');
// Scripts\init.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.netmanager.init();
        cc.netmanager.registerHandler(cc.guimanager);
        cc.scenemanager.loadLoginScene();
    }

});

cc._RF.pop();
},{}],"long":[function(require,module,exports){
"use strict";
cc._RF.push(module, '2c847wd+iJEZZInKRIzLwWs', 'long');
// Scripts\Lib\long.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 Copyright 2009 The Closure Library Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS-IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/long.js for details
 */
(function (global, factory) {

    /* AMD */if (typeof define === 'function' && define["amd"]) define([], factory);
    /* CommonJS */else if (typeof require === 'function' && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object" && module && module["exports"]) module["exports"] = factory();
        /* Global */else (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();
})(undefined, function () {
    "use strict";

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */

    function Long(low, high, unsigned) {

        /**
         * The low 32 bits as a signed value.
         * @type {number}
         * @expose
         */
        this.low = low | 0;

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         * @expose
         */
        this.high = high | 0;

        /**
         * Whether unsigned or not.
         * @type {boolean}
         * @expose
         */
        this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @expose
     * @private
     */
    Long.prototype.__isLong__;

    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @expose
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache) UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache) INT_CACHE[value] = obj;
            return obj;
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
        if (isNaN(value) || !isFinite(value)) return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0) return UZERO;
            if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
        }
        if (value < 0) return fromNumber(-value, unsigned).neg();
        return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
        if (str.length === 0) throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return ZERO;
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned, unsigned = false;
        } else {
            unsigned = !!unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError('radix');

        var p;
        if ((p = str.indexOf('-')) > 0) throw Error('interior hyphen');else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));

        var result = ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue(val) {
        if (val /* is compatible */ instanceof Long) return val;
        if (typeof val === 'number') return fromNumber(val);
        if (typeof val === 'string') return fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned);
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     * @expose
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     * @expose
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     * @expose
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     * @expose
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     * @expose
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     * @expose
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     * @expose
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     * @expose
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     * @expose
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     * @expose
     */
    LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     * @expose
     */
    LongPrototype.toNumber = function toNumber() {
        if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     * @expose
     */
    LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError('radix');
        if (this.isZero()) return '0';
        if (this.isNegative()) {
            // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else return '-' + this.neg().toString(radix);
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
            rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) return digits + result;else {
                while (digits.length < 6) {
                    digits = '0' + digits;
                }result = '' + digits + result;
            }
        }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     * @expose
     */
    LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     * @expose
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     * @expose
     */
    LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     * @expose
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     * @expose
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--) {
            if ((val & 1 << bit) != 0) break;
        }return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.equals = function equals(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
        return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.notEquals = function notEquals(other) {
        return !this.eq( /* validates */other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lessThan = function lessThan(other) {
        return this.comp( /* validates */other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp( /* validates */other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp( /* validates */other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp( /* validates */other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */
    LongPrototype.compare = function compare(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.eq(other)) return 0;
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative();
        if (thisNeg && !otherNeg) return -1;
        if (!thisNeg && otherNeg) return 1;
        // At this point the sign bits are the same
        if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     * @expose
     */
    LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
        return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     * @expose
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     * @expose
     */
    LongPrototype.add = function add(addend) {
        if (!isLong(addend)) addend = fromValue(addend);

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;

        var c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     * @expose
     */
    LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     * @expose
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     * @expose
     */
    LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero()) return ZERO;
        if (!isLong(multiplier)) multiplier = fromValue(multiplier);
        if (multiplier.isZero()) return ZERO;
        if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;

        if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());else return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;

        var c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     * @expose
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     * @expose
     */
    LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        if (divisor.isZero()) throw Error('division by zero');
        if (this.isZero()) return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE)) return ONE;else {
                        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                        var halfThis = this.shr(1);
                        approx = halfThis.div(divisor).shl(1);
                        if (approx.eq(ZERO)) {
                            return divisor.isNegative() ? ONE : NEG_ONE;
                        } else {
                            rem = this.sub(divisor.mul(approx));
                            res = approx.add(rem.div(divisor));
                            return res;
                        }
                    }
            } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned) divisor = divisor.toUnsigned();
            if (divisor.gt(this)) return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return UONE;
            res = UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48),


            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
                approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) approxRes = ONE;

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     * @expose
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     * @expose
     */
    LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     * @expose
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     * @expose
     */
    LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.and = function and(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.or = function or(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.xor = function xor(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);else return fromBits(0, this.low << numBits - 32, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0) return this;else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
            } else if (numBits === 32) return fromBits(high, 0, this.unsigned);else return fromBits(high >>> numBits - 32, 0, this.unsigned);
        }
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     * @expose
     */
    LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned) return this;
        return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     * @expose
     */
    LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned) return this;
        return fromBits(this.low, this.high, true);
    };

    return Long;
});

cc._RF.pop();
},{}],"protobuf":[function(require,module,exports){
(function (process){
"use strict";
cc._RF.push(module, 'e6691hW/mRNZZdi3yfy4y8r', 'protobuf');
// Scripts\Lib\protobuf.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license protobuf.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/protobuf.js for details
 */
(function (global, factory) {

    /* AMD */if (typeof define === 'function' && define["amd"]) define(["bytebuffer"], factory);
    /* CommonJS */else if (typeof require === "function" && (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module && module["exports"]) module["exports"] = factory(require("bytebuffer"), true);
        /* Global */else (global["dcodeIO"] = global["dcodeIO"] || {})["ProtoBuf"] = factory(global["dcodeIO"]["ByteBuffer"]);
})(undefined, function (ByteBuffer, isCommonJS) {
    "use strict";

    /**
     * The ProtoBuf namespace.
     * @exports ProtoBuf
     * @namespace
     * @expose
     */

    var ProtoBuf = {};

    /**
     * @type {!function(new: ByteBuffer, ...[*])}
     * @expose
     */
    ProtoBuf.ByteBuffer = ByteBuffer;

    /**
     * @type {?function(new: Long, ...[*])}
     * @expose
     */
    ProtoBuf.Long = ByteBuffer.Long || null;

    /**
     * ProtoBuf.js version.
     * @type {string}
     * @const
     * @expose
     */
    ProtoBuf.VERSION = "5.0.1";

    /**
     * Wire types.
     * @type {Object.<string,number>}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES = {};

    /**
     * Varint wire type.
     * @type {number}
     * @expose
     */
    ProtoBuf.WIRE_TYPES.VARINT = 0;

    /**
     * Fixed 64 bits wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.BITS64 = 1;

    /**
     * Length delimited wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.LDELIM = 2;

    /**
     * Start group wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.STARTGROUP = 3;

    /**
     * End group wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.ENDGROUP = 4;

    /**
     * Fixed 32 bits wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.BITS32 = 5;

    /**
     * Packable wire types.
     * @type {!Array.<number>}
     * @const
     * @expose
     */
    ProtoBuf.PACKABLE_WIRE_TYPES = [ProtoBuf.WIRE_TYPES.VARINT, ProtoBuf.WIRE_TYPES.BITS64, ProtoBuf.WIRE_TYPES.BITS32];

    /**
     * Types.
     * @dict
     * @type {!Object.<string,{name: string, wireType: number, defaultValue: *}>}
     * @const
     * @expose
     */
    ProtoBuf.TYPES = {
        // According to the protobuf spec.
        "int32": {
            name: "int32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "uint32": {
            name: "uint32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "sint32": {
            name: "sint32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "int64": {
            name: "int64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "uint64": {
            name: "uint64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
        },
        "sint64": {
            name: "sint64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "bool": {
            name: "bool",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: false
        },
        "double": {
            name: "double",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: 0
        },
        "string": {
            name: "string",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: ""
        },
        "bytes": {
            name: "bytes",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: null // overridden in the code, must be a unique instance
        },
        "fixed32": {
            name: "fixed32",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "sfixed32": {
            name: "sfixed32",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "fixed64": {
            name: "fixed64",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
        },
        "sfixed64": {
            name: "sfixed64",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "float": {
            name: "float",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "enum": {
            name: "enum",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "message": {
            name: "message",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: null
        },
        "group": {
            name: "group",
            wireType: ProtoBuf.WIRE_TYPES.STARTGROUP,
            defaultValue: null
        }
    };

    /**
     * Valid map key types.
     * @type {!Array.<!Object.<string,{name: string, wireType: number, defaultValue: *}>>}
     * @const
     * @expose
     */
    ProtoBuf.MAP_KEY_TYPES = [ProtoBuf.TYPES["int32"], ProtoBuf.TYPES["sint32"], ProtoBuf.TYPES["sfixed32"], ProtoBuf.TYPES["uint32"], ProtoBuf.TYPES["fixed32"], ProtoBuf.TYPES["int64"], ProtoBuf.TYPES["sint64"], ProtoBuf.TYPES["sfixed64"], ProtoBuf.TYPES["uint64"], ProtoBuf.TYPES["fixed64"], ProtoBuf.TYPES["bool"], ProtoBuf.TYPES["string"], ProtoBuf.TYPES["bytes"]];

    /**
     * Minimum field id.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.ID_MIN = 1;

    /**
     * Maximum field id.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.ID_MAX = 0x1FFFFFFF;

    /**
     * If set to `true`, field names will be converted from underscore notation to camel case. Defaults to `false`.
     *  Must be set prior to parsing.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.convertFieldsToCamelCase = false;

    /**
     * By default, messages are populated with (setX, set_x) accessors for each field. This can be disabled by
     *  setting this to `false` prior to building messages.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.populateAccessors = true;

    /**
     * By default, messages are populated with default values if a field is not present on the wire. To disable
     *  this behavior, set this setting to `false`.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.populateDefaults = true;

    /**
     * @alias ProtoBuf.Util
     * @expose
     */
    ProtoBuf.Util = function () {
        "use strict";

        /**
         * ProtoBuf utilities.
         * @exports ProtoBuf.Util
         * @namespace
         */

        var Util = {};

        /**
         * Flag if running in node or not.
         * @type {boolean}
         * @const
         * @expose
         */
        Util.IS_NODE = !!((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && process + '' === '[object process]' && !process['browser']);

        /**
         * Constructs a XMLHttpRequest object.
         * @return {XMLHttpRequest}
         * @throws {Error} If XMLHttpRequest is not supported
         * @expose
         */
        Util.XHR = function () {
            // No dependencies please, ref: http://www.quirksmode.org/js/xmlhttp.html
            var XMLHttpFactories = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }, function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }, function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }];
            /** @type {?XMLHttpRequest} */
            var xhr = null;
            for (var i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xhr = XMLHttpFactories[i]();
                } catch (e) {
                    continue;
                }
                break;
            }
            if (!xhr) throw Error("XMLHttpRequest is not supported");
            return xhr;
        };

        /**
         * Fetches a resource.
         * @param {string} path Resource path
         * @param {function(?string)=} callback Callback receiving the resource's contents. If omitted the resource will
         *   be fetched synchronously. If the request failed, contents will be null.
         * @return {?string|undefined} Resource contents if callback is omitted (null if the request failed), else undefined.
         * @expose
         */
        Util.fetch = function (path, callback) {
            if (callback && typeof callback != 'function') callback = null;
            if (Util.IS_NODE) {
                var fs = require("fs");
                if (callback) {
                    fs.readFile(path, function (err, data) {
                        if (err) callback(null);else callback("" + data);
                    });
                } else try {
                    return fs.readFileSync(path);
                } catch (e) {
                    return null;
                }
            } else {
                var xhr = Util.XHR();
                xhr.open('GET', path, callback ? true : false);
                // xhr.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                xhr.setRequestHeader('Accept', 'text/plain');
                if (typeof xhr.overrideMimeType === 'function') xhr.overrideMimeType('text/plain');
                if (callback) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState != 4) return;
                        if ( /* remote */xhr.status == 200 || /* local */xhr.status == 0 && typeof xhr.responseText === 'string') callback(xhr.responseText);else callback(null);
                    };
                    if (xhr.readyState == 4) return;
                    xhr.send(null);
                } else {
                    xhr.send(null);
                    if ( /* remote */xhr.status == 200 || /* local */xhr.status == 0 && typeof xhr.responseText === 'string') return xhr.responseText;
                    return null;
                }
            }
        };

        /**
         * Converts a string to camel case.
         * @param {string} str
         * @returns {string}
         * @expose
         */
        Util.toCamelCase = function (str) {
            return str.replace(/_([a-zA-Z])/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };

        return Util;
    }();

    /**
     * Language expressions.
     * @type {!Object.<string,!RegExp>}
     * @expose
     */
    ProtoBuf.Lang = {

        // Characters always ending a statement
        DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,

        // Field rules
        RULE: /^(?:required|optional|repeated|map)$/,

        // Field types
        TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,

        // Names
        NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,

        // Type definitions
        TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,

        // Type references
        TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,

        // Fully qualified type references
        FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,

        // All numbers
        NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,

        // Decimal numbers
        NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,

        // Hexadecimal numbers
        NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,

        // Octal numbers
        NUMBER_OCT: /^0[0-7]+$/,

        // Floating point numbers
        NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,

        // Booleans
        BOOL: /^(?:true|false)$/i,

        // Id numbers
        ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

        // Negative id numbers (enum values)
        NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

        // Whitespaces
        WHITESPACE: /\s/,

        // All strings
        STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,

        // Double quoted strings
        STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,

        // Single quoted strings
        STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g
    };

    /**
     * @alias ProtoBuf.DotProto
     * @expose
     */
    ProtoBuf.DotProto = function (ProtoBuf, Lang) {
        "use strict";

        /**
         * Utilities to parse .proto files.
         * @exports ProtoBuf.DotProto
         * @namespace
         */

        var DotProto = {};

        /**
         * Constructs a new Tokenizer.
         * @exports ProtoBuf.DotProto.Tokenizer
         * @class prototype tokenizer
         * @param {string} proto Proto to tokenize
         * @constructor
         */
        var Tokenizer = function Tokenizer(proto) {

            /**
             * Source to parse.
             * @type {string}
             * @expose
             */
            this.source = proto + "";

            /**
             * Current index.
             * @type {number}
             * @expose
             */
            this.index = 0;

            /**
             * Current line.
             * @type {number}
             * @expose
             */
            this.line = 1;

            /**
             * Token stack.
             * @type {!Array.<string>}
             * @expose
             */
            this.stack = [];

            /**
             * Opening character of the current string read, if any.
             * @type {?string}
             * @private
             */
            this._stringOpen = null;
        };

        /**
         * @alias ProtoBuf.DotProto.Tokenizer.prototype
         * @inner
         */
        var TokenizerPrototype = Tokenizer.prototype;

        /**
         * Reads a string beginning at the current index.
         * @return {string}
         * @private
         */
        TokenizerPrototype._readString = function () {
            var re = this._stringOpen === '"' ? Lang.STRING_DQ : Lang.STRING_SQ;
            re.lastIndex = this.index - 1; // Include the open quote
            var match = re.exec(this.source);
            if (!match) throw Error("unterminated string");
            this.index = re.lastIndex;
            this.stack.push(this._stringOpen);
            this._stringOpen = null;
            return match[1];
        };

        /**
         * Gets the next token and advances by one.
         * @return {?string} Token or `null` on EOF
         * @expose
         */
        TokenizerPrototype.next = function () {
            if (this.stack.length > 0) return this.stack.shift();
            if (this.index >= this.source.length) return null;
            if (this._stringOpen !== null) return this._readString();

            var repeat, prev, next;
            do {
                repeat = false;

                // Strip white spaces
                while (Lang.WHITESPACE.test(next = this.source.charAt(this.index))) {
                    if (next === '\n') ++this.line;
                    if (++this.index === this.source.length) return null;
                }

                // Strip comments
                if (this.source.charAt(this.index) === '/') {
                    ++this.index;
                    if (this.source.charAt(this.index) === '/') {
                        // Line
                        while (this.source.charAt(++this.index) !== '\n') {
                            if (this.index == this.source.length) return null;
                        }++this.index;
                        ++this.line;
                        repeat = true;
                    } else if ((next = this.source.charAt(this.index)) === '*') {
                        /* Block */
                        do {
                            if (next === '\n') ++this.line;
                            if (++this.index === this.source.length) return null;
                            prev = next;
                            next = this.source.charAt(this.index);
                        } while (prev !== '*' || next !== '/');
                        ++this.index;
                        repeat = true;
                    } else return '/';
                }
            } while (repeat);

            if (this.index === this.source.length) return null;

            // Read the next token
            var end = this.index;
            Lang.DELIM.lastIndex = 0;
            var delim = Lang.DELIM.test(this.source.charAt(end++));
            if (!delim) while (end < this.source.length && !Lang.DELIM.test(this.source.charAt(end))) {
                ++end;
            }var token = this.source.substring(this.index, this.index = end);
            if (token === '"' || token === "'") this._stringOpen = token;
            return token;
        };

        /**
         * Peeks for the next token.
         * @return {?string} Token or `null` on EOF
         * @expose
         */
        TokenizerPrototype.peek = function () {
            if (this.stack.length === 0) {
                var token = this.next();
                if (token === null) return null;
                this.stack.push(token);
            }
            return this.stack[0];
        };

        /**
         * Skips a specific token and throws if it differs.
         * @param {string} expected Expected token
         * @throws {Error} If the actual token differs
         */
        TokenizerPrototype.skip = function (expected) {
            var actual = this.next();
            if (actual !== expected) throw Error("illegal '" + actual + "', '" + expected + "' expected");
        };

        /**
         * Omits an optional token.
         * @param {string} expected Expected optional token
         * @returns {boolean} `true` if the token exists
         */
        TokenizerPrototype.omit = function (expected) {
            if (this.peek() === expected) {
                this.next();
                return true;
            }
            return false;
        };

        /**
         * Returns a string representation of this object.
         * @return {string} String representation as of "Tokenizer(index/length)"
         * @expose
         */
        TokenizerPrototype.toString = function () {
            return "Tokenizer (" + this.index + "/" + this.source.length + " at line " + this.line + ")";
        };

        /**
         * @alias ProtoBuf.DotProto.Tokenizer
         * @expose
         */
        DotProto.Tokenizer = Tokenizer;

        /**
         * Constructs a new Parser.
         * @exports ProtoBuf.DotProto.Parser
         * @class prototype parser
         * @param {string} source Source
         * @constructor
         */
        var Parser = function Parser(source) {

            /**
             * Tokenizer.
             * @type {!ProtoBuf.DotProto.Tokenizer}
             * @expose
             */
            this.tn = new Tokenizer(source);

            /**
             * Whether parsing proto3 or not.
             * @type {boolean}
             */
            this.proto3 = false;
        };

        /**
         * @alias ProtoBuf.DotProto.Parser.prototype
         * @inner
         */
        var ParserPrototype = Parser.prototype;

        /**
         * Parses the source.
         * @returns {!Object}
         * @throws {Error} If the source cannot be parsed
         * @expose
         */
        ParserPrototype.parse = function () {
            var topLevel = {
                "name": "[ROOT]", // temporary
                "package": null,
                "messages": [],
                "enums": [],
                "imports": [],
                "options": {},
                "services": []
                // "syntax": undefined
            };
            var token,
                head = true,
                weak;
            try {
                while (token = this.tn.next()) {
                    switch (token) {
                        case 'package':
                            if (!head || topLevel["package"] !== null) throw Error("unexpected 'package'");
                            token = this.tn.next();
                            if (!Lang.TYPEREF.test(token)) throw Error("illegal package name: " + token);
                            this.tn.skip(";");
                            topLevel["package"] = token;
                            break;
                        case 'import':
                            if (!head) throw Error("unexpected 'import'");
                            token = this.tn.peek();
                            if (token === "public" || (weak = token === "weak")) // token ignored
                                this.tn.next();
                            token = this._readString();
                            this.tn.skip(";");
                            if (!weak) // import ignored
                                topLevel["imports"].push(token);
                            break;
                        case 'syntax':
                            if (!head) throw Error("unexpected 'syntax'");
                            this.tn.skip("=");
                            if ((topLevel["syntax"] = this._readString()) === "proto3") this.proto3 = true;
                            this.tn.skip(";");
                            break;
                        case 'message':
                            this._parseMessage(topLevel, null);
                            head = false;
                            break;
                        case 'enum':
                            this._parseEnum(topLevel);
                            head = false;
                            break;
                        case 'option':
                            this._parseOption(topLevel);
                            break;
                        case 'service':
                            this._parseService(topLevel);
                            break;
                        case 'extend':
                            this._parseExtend(topLevel);
                            break;
                        default:
                            throw Error("unexpected '" + token + "'");
                    }
                }
            } catch (e) {
                e.message = "Parse error at line " + this.tn.line + ": " + e.message;
                throw e;
            }
            delete topLevel["name"];
            return topLevel;
        };

        /**
         * Parses the specified source.
         * @returns {!Object}
         * @throws {Error} If the source cannot be parsed
         * @expose
         */
        Parser.parse = function (source) {
            return new Parser(source).parse();
        };

        // ----- Conversion ------

        /**
         * Converts a numerical string to an id.
         * @param {string} value
         * @param {boolean=} mayBeNegative
         * @returns {number}
         * @inner
         */
        function mkId(value, mayBeNegative) {
            var id = -1,
                sign = 1;
            if (value.charAt(0) == '-') {
                sign = -1;
                value = value.substring(1);
            }
            if (Lang.NUMBER_DEC.test(value)) id = parseInt(value);else if (Lang.NUMBER_HEX.test(value)) id = parseInt(value.substring(2), 16);else if (Lang.NUMBER_OCT.test(value)) id = parseInt(value.substring(1), 8);else throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
            id = sign * id | 0; // Force to 32bit
            if (!mayBeNegative && id < 0) throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
            return id;
        }

        /**
         * Converts a numerical string to a number.
         * @param {string} val
         * @returns {number}
         * @inner
         */
        function mkNumber(val) {
            var sign = 1;
            if (val.charAt(0) == '-') {
                sign = -1;
                val = val.substring(1);
            }
            if (Lang.NUMBER_DEC.test(val)) return sign * parseInt(val, 10);else if (Lang.NUMBER_HEX.test(val)) return sign * parseInt(val.substring(2), 16);else if (Lang.NUMBER_OCT.test(val)) return sign * parseInt(val.substring(1), 8);else if (val === 'inf') return sign * Infinity;else if (val === 'nan') return NaN;else if (Lang.NUMBER_FLT.test(val)) return sign * parseFloat(val);
            throw Error("illegal number value: " + (sign < 0 ? '-' : '') + val);
        }

        // ----- Reading ------

        /**
         * Reads a string.
         * @returns {string}
         * @private
         */
        ParserPrototype._readString = function () {
            var value = "",
                token,
                delim;
            do {
                delim = this.tn.next();
                if (delim !== "'" && delim !== '"') throw Error("illegal string delimiter: " + delim);
                value += this.tn.next();
                this.tn.skip(delim);
                token = this.tn.peek();
            } while (token === '"' || token === '"'); // multi line?
            return value;
        };

        /**
         * Reads a value.
         * @param {boolean=} mayBeTypeRef
         * @returns {number|boolean|string}
         * @private
         */
        ParserPrototype._readValue = function (mayBeTypeRef) {
            var token = this.tn.peek(),
                value;
            if (token === '"' || token === "'") return this._readString();
            this.tn.next();
            if (Lang.NUMBER.test(token)) return mkNumber(token);
            if (Lang.BOOL.test(token)) return token.toLowerCase() === 'true';
            if (mayBeTypeRef && Lang.TYPEREF.test(token)) return token;
            throw Error("illegal value: " + token);
        };

        // ----- Parsing constructs -----

        /**
         * Parses a namespace option.
         * @param {!Object} parent Parent definition
         * @param {boolean=} isList
         * @private
         */
        ParserPrototype._parseOption = function (parent, isList) {
            var token = this.tn.next(),
                custom = false;
            if (token === '(') {
                custom = true;
                token = this.tn.next();
            }
            if (!Lang.TYPEREF.test(token))
                // we can allow options of the form google.protobuf.* since they will just get ignored anyways
                // if (!/google\.protobuf\./.test(token)) // FIXME: Why should that not be a valid typeref?
                throw Error("illegal option name: " + token);
            var name = token;
            if (custom) {
                // (my_method_option).foo, (my_method_option), some_method_option, (foo.my_option).bar
                this.tn.skip(')');
                name = '(' + name + ')';
                token = this.tn.peek();
                if (Lang.FQTYPEREF.test(token)) {
                    name += token;
                    this.tn.next();
                }
            }
            this.tn.skip('=');
            this._parseOptionValue(parent, name);
            if (!isList) this.tn.skip(";");
        };

        /**
         * Sets an option on the specified options object.
         * @param {!Object.<string,*>} options
         * @param {string} name
         * @param {string|number|boolean} value
         * @inner
         */
        function setOption(options, name, value) {
            if (typeof options[name] === 'undefined') options[name] = value;else {
                if (!Array.isArray(options[name])) options[name] = [options[name]];
                options[name].push(value);
            }
        }

        /**
         * Parses an option value.
         * @param {!Object} parent
         * @param {string} name
         * @private
         */
        ParserPrototype._parseOptionValue = function (parent, name) {
            var token = this.tn.peek();
            if (token !== '{') {
                // Plain value
                setOption(parent["options"], name, this._readValue(true));
            } else {
                // Aggregate options
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (!Lang.NAME.test(token)) throw Error("illegal option name: " + name + "." + token);
                    if (this.tn.omit(":")) setOption(parent["options"], name + "." + token, this._readValue(true));else this._parseOptionValue(parent, name + "." + token);
                }
            }
        };

        /**
         * Parses a service definition.
         * @param {!Object} parent Parent definition
         * @private
         */
        ParserPrototype._parseService = function (parent) {
            var token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal service name at line " + this.tn.line + ": " + token);
            var name = token;
            var svc = {
                "name": name,
                "rpc": {},
                "options": {}
            };
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (token === "option") this._parseOption(svc);else if (token === 'rpc') this._parseServiceRPC(svc);else throw Error("illegal service token: " + token);
            }
            this.tn.omit(";");
            parent["services"].push(svc);
        };

        /**
         * Parses a RPC service definition of the form ['rpc', name, (request), 'returns', (response)].
         * @param {!Object} svc Service definition
         * @private
         */
        ParserPrototype._parseServiceRPC = function (svc) {
            var type = "rpc",
                token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal rpc service method name: " + token);
            var name = token;
            var method = {
                "request": null,
                "response": null,
                "request_stream": false,
                "response_stream": false,
                "options": {}
            };
            this.tn.skip("(");
            token = this.tn.next();
            if (token.toLowerCase() === "stream") {
                method["request_stream"] = true;
                token = this.tn.next();
            }
            if (!Lang.TYPEREF.test(token)) throw Error("illegal rpc service request type: " + token);
            method["request"] = token;
            this.tn.skip(")");
            token = this.tn.next();
            if (token.toLowerCase() !== "returns") throw Error("illegal rpc service request type delimiter: " + token);
            this.tn.skip("(");
            token = this.tn.next();
            if (token.toLowerCase() === "stream") {
                method["response_stream"] = true;
                token = this.tn.next();
            }
            method["response"] = token;
            this.tn.skip(")");
            token = this.tn.peek();
            if (token === '{') {
                this.tn.next();
                while ((token = this.tn.next()) !== '}') {
                    if (token === 'option') this._parseOption(method);else throw Error("illegal rpc service token: " + token);
                }
                this.tn.omit(";");
            } else this.tn.skip(";");
            if (typeof svc[type] === 'undefined') svc[type] = {};
            svc[type][name] = method;
        };

        /**
         * Parses a message definition.
         * @param {!Object} parent Parent definition
         * @param {!Object=} fld Field definition if this is a group
         * @returns {!Object}
         * @private
         */
        ParserPrototype._parseMessage = function (parent, fld) {
            var isGroup = !!fld,
                token = this.tn.next();
            var msg = {
                "name": "",
                "fields": [],
                "enums": [],
                "messages": [],
                "options": {},
                "services": [],
                "oneofs": {}
                // "extensions": undefined
            };
            if (!Lang.NAME.test(token)) throw Error("illegal " + (isGroup ? "group" : "message") + " name: " + token);
            msg["name"] = token;
            if (isGroup) {
                this.tn.skip("=");
                fld["id"] = mkId(this.tn.next());
                msg["isGroup"] = true;
            }
            token = this.tn.peek();
            if (token === '[' && fld) this._parseFieldOptions(fld);
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (Lang.RULE.test(token)) this._parseMessageField(msg, token);else if (token === "oneof") this._parseMessageOneOf(msg);else if (token === "enum") this._parseEnum(msg);else if (token === "message") this._parseMessage(msg);else if (token === "option") this._parseOption(msg);else if (token === "service") this._parseService(msg);else if (token === "extensions") {
                    if (msg.hasOwnProperty("extensions")) {
                        msg["extensions"] = msg["extensions"].concat(this._parseExtensionRanges());
                    } else {
                        msg["extensions"] = this._parseExtensionRanges();
                    }
                } else if (token === "reserved") this._parseIgnored(); // TODO
                else if (token === "extend") this._parseExtend(msg);else if (Lang.TYPEREF.test(token)) {
                        if (!this.proto3) throw Error("illegal field rule: " + token);
                        this._parseMessageField(msg, "optional", token);
                    } else throw Error("illegal message token: " + token);
            }
            this.tn.omit(";");
            parent["messages"].push(msg);
            return msg;
        };

        /**
         * Parses an ignored statement.
         * @private
         */
        ParserPrototype._parseIgnored = function () {
            while (this.tn.peek() !== ';') {
                this.tn.next();
            }this.tn.skip(";");
        };

        /**
         * Parses a message field.
         * @param {!Object} msg Message definition
         * @param {string} rule Field rule
         * @param {string=} type Field type if already known (never known for maps)
         * @returns {!Object} Field descriptor
         * @private
         */
        ParserPrototype._parseMessageField = function (msg, rule, type) {
            if (!Lang.RULE.test(rule)) throw Error("illegal message field rule: " + rule);
            var fld = {
                "rule": rule,
                "type": "",
                "name": "",
                "options": {},
                "id": 0
            };
            var token;
            if (rule === "map") {

                if (type) throw Error("illegal type: " + type);
                this.tn.skip('<');
                token = this.tn.next();
                if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token)) throw Error("illegal message field type: " + token);
                fld["keytype"] = token;
                this.tn.skip(',');
                token = this.tn.next();
                if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token)) throw Error("illegal message field: " + token);
                fld["type"] = token;
                this.tn.skip('>');
                token = this.tn.next();
                if (!Lang.NAME.test(token)) throw Error("illegal message field name: " + token);
                fld["name"] = token;
                this.tn.skip("=");
                fld["id"] = mkId(this.tn.next());
                token = this.tn.peek();
                if (token === '[') this._parseFieldOptions(fld);
                this.tn.skip(";");
            } else {

                type = typeof type !== 'undefined' ? type : this.tn.next();

                if (type === "group") {

                    // "A [legacy] group simply combines a nested message type and a field into a single declaration. In your
                    // code, you can treat this message just as if it had a Result type field called result (the latter name is
                    // converted to lower-case so that it does not conflict with the former)."
                    var grp = this._parseMessage(msg, fld);
                    if (!/^[A-Z]/.test(grp["name"])) throw Error('illegal group name: ' + grp["name"]);
                    fld["type"] = grp["name"];
                    fld["name"] = grp["name"].toLowerCase();
                    this.tn.omit(";");
                } else {

                    if (!Lang.TYPE.test(type) && !Lang.TYPEREF.test(type)) throw Error("illegal message field type: " + type);
                    fld["type"] = type;
                    token = this.tn.next();
                    if (!Lang.NAME.test(token)) throw Error("illegal message field name: " + token);
                    fld["name"] = token;
                    this.tn.skip("=");
                    fld["id"] = mkId(this.tn.next());
                    token = this.tn.peek();
                    if (token === "[") this._parseFieldOptions(fld);
                    this.tn.skip(";");
                }
            }
            msg["fields"].push(fld);
            return fld;
        };

        /**
         * Parses a message oneof.
         * @param {!Object} msg Message definition
         * @private
         */
        ParserPrototype._parseMessageOneOf = function (msg) {
            var token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal oneof name: " + token);
            var name = token,
                fld;
            var fields = [];
            this.tn.skip("{");
            while ((token = this.tn.next()) !== "}") {
                fld = this._parseMessageField(msg, "optional", token);
                fld["oneof"] = name;
                fields.push(fld["id"]);
            }
            this.tn.omit(";");
            msg["oneofs"][name] = fields;
        };

        /**
         * Parses a set of field option definitions.
         * @param {!Object} fld Field definition
         * @private
         */
        ParserPrototype._parseFieldOptions = function (fld) {
            this.tn.skip("[");
            var token,
                first = true;
            while ((token = this.tn.peek()) !== ']') {
                if (!first) this.tn.skip(",");
                this._parseOption(fld, true);
                first = false;
            }
            this.tn.next();
        };

        /**
         * Parses an enum.
         * @param {!Object} msg Message definition
         * @private
         */
        ParserPrototype._parseEnum = function (msg) {
            var enm = {
                "name": "",
                "values": [],
                "options": {}
            };
            var token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal name: " + token);
            enm["name"] = token;
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (token === "option") this._parseOption(enm);else {
                    if (!Lang.NAME.test(token)) throw Error("illegal name: " + token);
                    this.tn.skip("=");
                    var val = {
                        "name": token,
                        "id": mkId(this.tn.next(), true)
                    };
                    token = this.tn.peek();
                    if (token === "[") this._parseFieldOptions({ "options": {} });
                    this.tn.skip(";");
                    enm["values"].push(val);
                }
            }
            this.tn.omit(";");
            msg["enums"].push(enm);
        };

        /**
         * Parses extension / reserved ranges.
         * @returns {!Array.<!Array.<number>>}
         * @private
         */
        ParserPrototype._parseExtensionRanges = function () {
            var ranges = [];
            var token, range, value;
            do {
                range = [];
                while (true) {
                    token = this.tn.next();
                    switch (token) {
                        case "min":
                            value = ProtoBuf.ID_MIN;
                            break;
                        case "max":
                            value = ProtoBuf.ID_MAX;
                            break;
                        default:
                            value = mkNumber(token);
                            break;
                    }
                    range.push(value);
                    if (range.length === 2) break;
                    if (this.tn.peek() !== "to") {
                        range.push(value);
                        break;
                    }
                    this.tn.next();
                }
                ranges.push(range);
            } while (this.tn.omit(","));
            this.tn.skip(";");
            return ranges;
        };

        /**
         * Parses an extend block.
         * @param {!Object} parent Parent object
         * @private
         */
        ParserPrototype._parseExtend = function (parent) {
            var token = this.tn.next();
            if (!Lang.TYPEREF.test(token)) throw Error("illegal extend reference: " + token);
            var ext = {
                "ref": token,
                "fields": []
            };
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (Lang.RULE.test(token)) this._parseMessageField(ext, token);else if (Lang.TYPEREF.test(token)) {
                    if (!this.proto3) throw Error("illegal field rule: " + token);
                    this._parseMessageField(ext, "optional", token);
                } else throw Error("illegal extend token: " + token);
            }
            this.tn.omit(";");
            parent["messages"].push(ext);
            return ext;
        };

        // ----- General -----

        /**
         * Returns a string representation of this parser.
         * @returns {string}
         */
        ParserPrototype.toString = function () {
            return "Parser at line " + this.tn.line;
        };

        /**
         * @alias ProtoBuf.DotProto.Parser
         * @expose
         */
        DotProto.Parser = Parser;

        return DotProto;
    }(ProtoBuf, ProtoBuf.Lang);

    /**
     * @alias ProtoBuf.Reflect
     * @expose
     */
    ProtoBuf.Reflect = function (ProtoBuf) {
        "use strict";

        /**
         * Reflection types.
         * @exports ProtoBuf.Reflect
         * @namespace
         */

        var Reflect = {};

        /**
         * Constructs a Reflect base class.
         * @exports ProtoBuf.Reflect.T
         * @constructor
         * @abstract
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {?ProtoBuf.Reflect.T} parent Parent object
         * @param {string} name Object name
         */
        var T = function T(builder, parent, name) {

            /**
             * Builder reference.
             * @type {!ProtoBuf.Builder}
             * @expose
             */
            this.builder = builder;

            /**
             * Parent object.
             * @type {?ProtoBuf.Reflect.T}
             * @expose
             */
            this.parent = parent;

            /**
             * Object name in namespace.
             * @type {string}
             * @expose
             */
            this.name = name;

            /**
             * Fully qualified class name
             * @type {string}
             * @expose
             */
            this.className;
        };

        /**
         * @alias ProtoBuf.Reflect.T.prototype
         * @inner
         */
        var TPrototype = T.prototype;

        /**
         * Returns the fully qualified name of this object.
         * @returns {string} Fully qualified name as of ".PATH.TO.THIS"
         * @expose
         */
        TPrototype.fqn = function () {
            var name = this.name,
                ptr = this;
            do {
                ptr = ptr.parent;
                if (ptr == null) break;
                name = ptr.name + "." + name;
            } while (true);
            return name;
        };

        /**
         * Returns a string representation of this Reflect object (its fully qualified name).
         * @param {boolean=} includeClass Set to true to include the class name. Defaults to false.
         * @return String representation
         * @expose
         */
        TPrototype.toString = function (includeClass) {
            return (includeClass ? this.className + " " : "") + this.fqn();
        };

        /**
         * Builds this type.
         * @throws {Error} If this type cannot be built directly
         * @expose
         */
        TPrototype.build = function () {
            throw Error(this.toString(true) + " cannot be built directly");
        };

        /**
         * @alias ProtoBuf.Reflect.T
         * @expose
         */
        Reflect.T = T;

        /**
         * Constructs a new Namespace.
         * @exports ProtoBuf.Reflect.Namespace
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {?ProtoBuf.Reflect.Namespace} parent Namespace parent
         * @param {string} name Namespace name
         * @param {Object.<string,*>=} options Namespace options
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Namespace = function Namespace(builder, parent, name, options, syntax) {
            T.call(this, builder, parent, name);

            /**
             * @override
             */
            this.className = "Namespace";

            /**
             * Children inside the namespace.
             * @type {!Array.<ProtoBuf.Reflect.T>}
             */
            this.children = [];

            /**
             * Options.
             * @type {!Object.<string, *>}
             */
            this.options = options || {};

            /**
             * Syntax level (e.g., proto2 or proto3).
             * @type {!string}
             */
            this.syntax = syntax || "proto2";
        };

        /**
         * @alias ProtoBuf.Reflect.Namespace.prototype
         * @inner
         */
        var NamespacePrototype = Namespace.prototype = Object.create(T.prototype);

        /**
         * Returns an array of the namespace's children.
         * @param {ProtoBuf.Reflect.T=} type Filter type (returns instances of this type only). Defaults to null (all children).
         * @return {Array.<ProtoBuf.Reflect.T>}
         * @expose
         */
        NamespacePrototype.getChildren = function (type) {
            type = type || null;
            if (type == null) return this.children.slice();
            var children = [];
            for (var i = 0, k = this.children.length; i < k; ++i) {
                if (this.children[i] instanceof type) children.push(this.children[i]);
            }return children;
        };

        /**
         * Adds a child to the namespace.
         * @param {ProtoBuf.Reflect.T} child Child
         * @throws {Error} If the child cannot be added (duplicate)
         * @expose
         */
        NamespacePrototype.addChild = function (child) {
            var other;
            if (other = this.getChild(child.name)) {
                // Try to revert camelcase transformation on collision
                if (other instanceof Message.Field && other.name !== other.originalName && this.getChild(other.originalName) === null) other.name = other.originalName; // Revert previous first (effectively keeps both originals)
                else if (child instanceof Message.Field && child.name !== child.originalName && this.getChild(child.originalName) === null) child.name = child.originalName;else throw Error("Duplicate name in namespace " + this.toString(true) + ": " + child.name);
            }
            this.children.push(child);
        };

        /**
         * Gets a child by its name or id.
         * @param {string|number} nameOrId Child name or id
         * @return {?ProtoBuf.Reflect.T} The child or null if not found
         * @expose
         */
        NamespacePrototype.getChild = function (nameOrId) {
            var key = typeof nameOrId === 'number' ? 'id' : 'name';
            for (var i = 0, k = this.children.length; i < k; ++i) {
                if (this.children[i][key] === nameOrId) return this.children[i];
            }return null;
        };

        /**
         * Resolves a reflect object inside of this namespace.
         * @param {string|!Array.<string>} qn Qualified name to resolve
         * @param {boolean=} excludeNonNamespace Excludes non-namespace types, defaults to `false`
         * @return {?ProtoBuf.Reflect.Namespace} The resolved type or null if not found
         * @expose
         */
        NamespacePrototype.resolve = function (qn, excludeNonNamespace) {
            var part = typeof qn === 'string' ? qn.split(".") : qn,
                ptr = this,
                i = 0;
            if (part[i] === "") {
                // Fully qualified name, e.g. ".My.Message'
                while (ptr.parent !== null) {
                    ptr = ptr.parent;
                }i++;
            }
            var child;
            do {
                do {
                    if (!(ptr instanceof Reflect.Namespace)) {
                        ptr = null;
                        break;
                    }
                    child = ptr.getChild(part[i]);
                    if (!child || !(child instanceof Reflect.T) || excludeNonNamespace && !(child instanceof Reflect.Namespace)) {
                        ptr = null;
                        break;
                    }
                    ptr = child;i++;
                } while (i < part.length);
                if (ptr != null) break; // Found
                // Else search the parent
                if (this.parent !== null) return this.parent.resolve(qn, excludeNonNamespace);
            } while (ptr != null);
            return ptr;
        };

        /**
         * Determines the shortest qualified name of the specified type, if any, relative to this namespace.
         * @param {!ProtoBuf.Reflect.T} t Reflection type
         * @returns {string} The shortest qualified name or, if there is none, the fqn
         * @expose
         */
        NamespacePrototype.qn = function (t) {
            var part = [],
                ptr = t;
            do {
                part.unshift(ptr.name);
                ptr = ptr.parent;
            } while (ptr !== null);
            for (var len = 1; len <= part.length; len++) {
                var qn = part.slice(part.length - len);
                if (t === this.resolve(qn, t instanceof Reflect.Namespace)) return qn.join(".");
            }
            return t.fqn();
        };

        /**
         * Builds the namespace and returns the runtime counterpart.
         * @return {Object.<string,Function|Object>} Runtime namespace
         * @expose
         */
        NamespacePrototype.build = function () {
            /** @dict */
            var ns = {};
            var children = this.children;
            for (var i = 0, k = children.length, child; i < k; ++i) {
                child = children[i];
                if (child instanceof Namespace) ns[child.name] = child.build();
            }
            if (Object.defineProperty) Object.defineProperty(ns, "$options", { "value": this.buildOpt() });
            return ns;
        };

        /**
         * Builds the namespace's '$options' property.
         * @return {Object.<string,*>}
         */
        NamespacePrototype.buildOpt = function () {
            var opt = {},
                keys = Object.keys(this.options);
            for (var i = 0, k = keys.length; i < k; ++i) {
                var key = keys[i],
                    val = this.options[keys[i]];
                // TODO: Options are not resolved, yet.
                // if (val instanceof Namespace) {
                //     opt[key] = val.build();
                // } else {
                opt[key] = val;
                // }
            }
            return opt;
        };

        /**
         * Gets the value assigned to the option with the specified name.
         * @param {string=} name Returns the option value if specified, otherwise all options are returned.
         * @return {*|Object.<string,*>}null} Option value or NULL if there is no such option
         */
        NamespacePrototype.getOption = function (name) {
            if (typeof name === 'undefined') return this.options;
            return typeof this.options[name] !== 'undefined' ? this.options[name] : null;
        };

        /**
         * @alias ProtoBuf.Reflect.Namespace
         * @expose
         */
        Reflect.Namespace = Namespace;

        /**
         * Constructs a new Element implementation that checks and converts values for a
         * particular field type, as appropriate.
         *
         * An Element represents a single value: either the value of a singular field,
         * or a value contained in one entry of a repeated field or map field. This
         * class does not implement these higher-level concepts; it only encapsulates
         * the low-level typechecking and conversion.
         *
         * @exports ProtoBuf.Reflect.Element
         * @param {{name: string, wireType: number}} type Resolved data type
         * @param {ProtoBuf.Reflect.T|null} resolvedType Resolved type, if relevant
         * (e.g. submessage field).
         * @param {boolean} isMapKey Is this element a Map key? The value will be
         * converted to string form if so.
         * @param {string} syntax Syntax level of defining message type, e.g.,
         * proto2 or proto3.
         * @param {string} name Name of the field containing this element (for error
         * messages)
         * @constructor
         */
        var Element = function Element(type, resolvedType, isMapKey, syntax, name) {

            /**
             * Element type, as a string (e.g., int32).
             * @type {{name: string, wireType: number}}
             */
            this.type = type;

            /**
             * Element type reference to submessage or enum definition, if needed.
             * @type {ProtoBuf.Reflect.T|null}
             */
            this.resolvedType = resolvedType;

            /**
             * Element is a map key.
             * @type {boolean}
             */
            this.isMapKey = isMapKey;

            /**
             * Syntax level of defining message type, e.g., proto2 or proto3.
             * @type {string}
             */
            this.syntax = syntax;

            /**
             * Name of the field containing this element (for error messages)
             * @type {string}
             */
            this.name = name;

            if (isMapKey && ProtoBuf.MAP_KEY_TYPES.indexOf(type) < 0) throw Error("Invalid map key type: " + type.name);
        };

        var ElementPrototype = Element.prototype;

        /**
         * Obtains a (new) default value for the specified type.
         * @param type {string|{name: string, wireType: number}} Field type
         * @returns {*} Default value
         * @inner
         */
        function mkDefault(type) {
            if (typeof type === 'string') type = ProtoBuf.TYPES[type];
            if (typeof type.defaultValue === 'undefined') throw Error("default value for type " + type.name + " is not supported");
            if (type == ProtoBuf.TYPES["bytes"]) return new ByteBuffer(0);
            return type.defaultValue;
        }

        /**
         * Returns the default value for this field in proto3.
         * @function
         * @param type {string|{name: string, wireType: number}} the field type
         * @returns {*} Default value
         */
        Element.defaultFieldValue = mkDefault;

        /**
         * Makes a Long from a value.
         * @param {{low: number, high: number, unsigned: boolean}|string|number} value Value
         * @param {boolean=} unsigned Whether unsigned or not, defaults to reuse it from Long-like objects or to signed for
         *  strings and numbers
         * @returns {!Long}
         * @throws {Error} If the value cannot be converted to a Long
         * @inner
         */
        function mkLong(value, unsigned) {
            if (value && typeof value.low === 'number' && typeof value.high === 'number' && typeof value.unsigned === 'boolean' && value.low === value.low && value.high === value.high) return new ProtoBuf.Long(value.low, value.high, typeof unsigned === 'undefined' ? value.unsigned : unsigned);
            if (typeof value === 'string') return ProtoBuf.Long.fromString(value, unsigned || false, 10);
            if (typeof value === 'number') return ProtoBuf.Long.fromNumber(value, unsigned || false);
            throw Error("not convertible to Long");
        }

        ElementPrototype.toString = function () {
            return (this.name || '') + (this.isMapKey ? 'map' : 'value') + ' element';
        };

        /**
         * Checks if the given value can be set for an element of this type (singular
         * field or one element of a repeated field or map).
         * @param {*} value Value to check
         * @return {*} Verified, maybe adjusted, value
         * @throws {Error} If the value cannot be verified for this element slot
         * @expose
         */
        ElementPrototype.verifyValue = function (value) {
            var self = this;
            function fail(val, msg) {
                throw Error("Illegal value for " + self.toString(true) + " of type " + self.type.name + ": " + val + " (" + msg + ")");
            }
            switch (this.type) {
                // Signed 32bit
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                    // Account for !NaN: value === value
                    if (typeof value !== 'number' || value === value && value % 1 !== 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not an integer");
                    return value > 4294967295 ? value | 0 : value;

                // Unsigned 32bit
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    if (typeof value !== 'number' || value === value && value % 1 !== 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not an integer");
                    return value < 0 ? value >>> 0 : value;

                // Signed 64bit
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                    {
                        if (ProtoBuf.Long) try {
                            return mkLong(value, false);
                        } catch (e) {
                            fail(typeof value === "undefined" ? "undefined" : _typeof(value), e.message);
                        } else fail(typeof value === "undefined" ? "undefined" : _typeof(value), "requires Long.js");
                    }

                // Unsigned 64bit
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    {
                        if (ProtoBuf.Long) try {
                            return mkLong(value, true);
                        } catch (e) {
                            fail(typeof value === "undefined" ? "undefined" : _typeof(value), e.message);
                        } else fail(typeof value === "undefined" ? "undefined" : _typeof(value), "requires Long.js");
                    }

                // Bool
                case ProtoBuf.TYPES["bool"]:
                    if (typeof value !== 'boolean') fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not a boolean");
                    return value;

                // Float
                case ProtoBuf.TYPES["float"]:
                case ProtoBuf.TYPES["double"]:
                    if (typeof value !== 'number') fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not a number");
                    return value;

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    if (typeof value !== 'string' && !(value && value instanceof String)) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not a string");
                    return "" + value; // Convert String object to string

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    if (ByteBuffer.isByteBuffer(value)) return value;
                    return ByteBuffer.wrap(value, "base64");

                // Constant enum value
                case ProtoBuf.TYPES["enum"]:
                    {
                        var values = this.resolvedType.getChildren(ProtoBuf.Reflect.Enum.Value);
                        for (i = 0; i < values.length; i++) {
                            if (values[i].name == value) return values[i].id;else if (values[i].id == value) return values[i].id;
                        }if (this.syntax === 'proto3') {
                            // proto3: just make sure it's an integer.
                            if (typeof value !== 'number' || value === value && value % 1 !== 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not an integer");
                            if (value > 4294967295 || value < 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not in range for uint32");
                            return value;
                        } else {
                            // proto2 requires enum values to be valid.
                            fail(value, "not a valid enum value");
                        }
                    }
                // Embedded message
                case ProtoBuf.TYPES["group"]:
                case ProtoBuf.TYPES["message"]:
                    {
                        if (!value || (typeof value === "undefined" ? "undefined" : _typeof(value)) !== 'object') fail(typeof value === "undefined" ? "undefined" : _typeof(value), "object expected");
                        if (value instanceof this.resolvedType.clazz) return value;
                        if (value instanceof ProtoBuf.Builder.Message) {
                            // Mismatched type: Convert to object (see: https://github.com/dcodeIO/ProtoBuf.js/issues/180)
                            var obj = {};
                            for (var i in value) {
                                if (value.hasOwnProperty(i)) obj[i] = value[i];
                            }value = obj;
                        }
                        // Else let's try to construct one from a key-value object
                        return new this.resolvedType.clazz(value); // May throw for a hundred of reasons
                    }
            }

            // We should never end here
            throw Error("[INTERNAL] Illegal value for " + this.toString(true) + ": " + value + " (undefined type " + this.type + ")");
        };

        /**
         * Calculates the byte length of an element on the wire.
         * @param {number} id Field number
         * @param {*} value Field value
         * @returns {number} Byte length
         * @throws {Error} If the value cannot be calculated
         * @expose
         */
        ElementPrototype.calculateLength = function (id, value) {
            if (value === null) return 0; // Nothing to encode
            // Tag has already been written
            var n;
            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                    return value < 0 ? ByteBuffer.calculateVarint64(value) : ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["uint32"]:
                    return ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["sint32"]:
                    return ByteBuffer.calculateVarint32(ByteBuffer.zigZagEncode32(value));
                case ProtoBuf.TYPES["fixed32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["float"]:
                    return 4;
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["uint64"]:
                    return ByteBuffer.calculateVarint64(value);
                case ProtoBuf.TYPES["sint64"]:
                    return ByteBuffer.calculateVarint64(ByteBuffer.zigZagEncode64(value));
                case ProtoBuf.TYPES["fixed64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                    return 8;
                case ProtoBuf.TYPES["bool"]:
                    return 1;
                case ProtoBuf.TYPES["enum"]:
                    return ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["double"]:
                    return 8;
                case ProtoBuf.TYPES["string"]:
                    n = ByteBuffer.calculateUTF8Bytes(value);
                    return ByteBuffer.calculateVarint32(n) + n;
                case ProtoBuf.TYPES["bytes"]:
                    if (value.remaining() < 0) throw Error("Illegal value for " + this.toString(true) + ": " + value.remaining() + " bytes remaining");
                    return ByteBuffer.calculateVarint32(value.remaining()) + value.remaining();
                case ProtoBuf.TYPES["message"]:
                    n = this.resolvedType.calculate(value);
                    return ByteBuffer.calculateVarint32(n) + n;
                case ProtoBuf.TYPES["group"]:
                    n = this.resolvedType.calculate(value);
                    return n + ByteBuffer.calculateVarint32(id << 3 | ProtoBuf.WIRE_TYPES.ENDGROUP);
            }
            // We should never end here
            throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + value + " (unknown type)");
        };

        /**
         * Encodes a value to the specified buffer. Does not encode the key.
         * @param {number} id Field number
         * @param {*} value Field value
         * @param {ByteBuffer} buffer ByteBuffer to encode to
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If the value cannot be encoded
         * @expose
         */
        ElementPrototype.encodeValue = function (id, value, buffer) {
            if (value === null) return buffer; // Nothing to encode
            // Tag has already been written

            switch (this.type) {
                // 32bit signed varint
                case ProtoBuf.TYPES["int32"]:
                    // "If you use int32 or int64 as the type for a negative number, the resulting varint is always ten bytes
                    // long – it is, effectively, treated like a very large unsigned integer." (see #122)
                    if (value < 0) buffer.writeVarint64(value);else buffer.writeVarint32(value);
                    break;

                // 32bit unsigned varint
                case ProtoBuf.TYPES["uint32"]:
                    buffer.writeVarint32(value);
                    break;

                // 32bit varint zig-zag
                case ProtoBuf.TYPES["sint32"]:
                    buffer.writeVarint32ZigZag(value);
                    break;

                // Fixed unsigned 32bit
                case ProtoBuf.TYPES["fixed32"]:
                    buffer.writeUint32(value);
                    break;

                // Fixed signed 32bit
                case ProtoBuf.TYPES["sfixed32"]:
                    buffer.writeInt32(value);
                    break;

                // 64bit varint as-is
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["uint64"]:
                    buffer.writeVarint64(value); // throws
                    break;

                // 64bit varint zig-zag
                case ProtoBuf.TYPES["sint64"]:
                    buffer.writeVarint64ZigZag(value); // throws
                    break;

                // Fixed unsigned 64bit
                case ProtoBuf.TYPES["fixed64"]:
                    buffer.writeUint64(value); // throws
                    break;

                // Fixed signed 64bit
                case ProtoBuf.TYPES["sfixed64"]:
                    buffer.writeInt64(value); // throws
                    break;

                // Bool
                case ProtoBuf.TYPES["bool"]:
                    if (typeof value === 'string') buffer.writeVarint32(value.toLowerCase() === 'false' ? 0 : !!value);else buffer.writeVarint32(value ? 1 : 0);
                    break;

                // Constant enum value
                case ProtoBuf.TYPES["enum"]:
                    buffer.writeVarint32(value);
                    break;

                // 32bit float
                case ProtoBuf.TYPES["float"]:
                    buffer.writeFloat32(value);
                    break;

                // 64bit float
                case ProtoBuf.TYPES["double"]:
                    buffer.writeFloat64(value);
                    break;

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    buffer.writeVString(value);
                    break;

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    if (value.remaining() < 0) throw Error("Illegal value for " + this.toString(true) + ": " + value.remaining() + " bytes remaining");
                    var prevOffset = value.offset;
                    buffer.writeVarint32(value.remaining());
                    buffer.append(value);
                    value.offset = prevOffset;
                    break;

                // Embedded message
                case ProtoBuf.TYPES["message"]:
                    var bb = new ByteBuffer().LE();
                    this.resolvedType.encode(value, bb);
                    buffer.writeVarint32(bb.offset);
                    buffer.append(bb.flip());
                    break;

                // Legacy group
                case ProtoBuf.TYPES["group"]:
                    this.resolvedType.encode(value, buffer);
                    buffer.writeVarint32(id << 3 | ProtoBuf.WIRE_TYPES.ENDGROUP);
                    break;

                default:
                    // We should never end here
                    throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + value + " (unknown type)");
            }
            return buffer;
        };

        /**
         * Decode one element value from the specified buffer.
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {number} wireType The field wire type
         * @param {number} id The field number
         * @return {*} Decoded value
         * @throws {Error} If the field cannot be decoded
         * @expose
         */
        ElementPrototype.decode = function (buffer, wireType, id) {
            if (wireType != this.type.wireType) throw Error("Unexpected wire type for element");

            var value, nBytes;
            switch (this.type) {
                // 32bit signed varint
                case ProtoBuf.TYPES["int32"]:
                    return buffer.readVarint32() | 0;

                // 32bit unsigned varint
                case ProtoBuf.TYPES["uint32"]:
                    return buffer.readVarint32() >>> 0;

                // 32bit signed varint zig-zag
                case ProtoBuf.TYPES["sint32"]:
                    return buffer.readVarint32ZigZag() | 0;

                // Fixed 32bit unsigned
                case ProtoBuf.TYPES["fixed32"]:
                    return buffer.readUint32() >>> 0;

                case ProtoBuf.TYPES["sfixed32"]:
                    return buffer.readInt32() | 0;

                // 64bit signed varint
                case ProtoBuf.TYPES["int64"]:
                    return buffer.readVarint64();

                // 64bit unsigned varint
                case ProtoBuf.TYPES["uint64"]:
                    return buffer.readVarint64().toUnsigned();

                // 64bit signed varint zig-zag
                case ProtoBuf.TYPES["sint64"]:
                    return buffer.readVarint64ZigZag();

                // Fixed 64bit unsigned
                case ProtoBuf.TYPES["fixed64"]:
                    return buffer.readUint64();

                // Fixed 64bit signed
                case ProtoBuf.TYPES["sfixed64"]:
                    return buffer.readInt64();

                // Bool varint
                case ProtoBuf.TYPES["bool"]:
                    return !!buffer.readVarint32();

                // Constant enum value (varint)
                case ProtoBuf.TYPES["enum"]:
                    // The following Builder.Message#set will already throw
                    return buffer.readVarint32();

                // 32bit float
                case ProtoBuf.TYPES["float"]:
                    return buffer.readFloat();

                // 64bit float
                case ProtoBuf.TYPES["double"]:
                    return buffer.readDouble();

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    return buffer.readVString();

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    {
                        nBytes = buffer.readVarint32();
                        if (buffer.remaining() < nBytes) throw Error("Illegal number of bytes for " + this.toString(true) + ": " + nBytes + " required but got only " + buffer.remaining());
                        value = buffer.clone(); // Offset already set
                        value.limit = value.offset + nBytes;
                        buffer.offset += nBytes;
                        return value;
                    }

                // Length-delimited embedded message
                case ProtoBuf.TYPES["message"]:
                    {
                        nBytes = buffer.readVarint32();
                        return this.resolvedType.decode(buffer, nBytes);
                    }

                // Legacy group
                case ProtoBuf.TYPES["group"]:
                    return this.resolvedType.decode(buffer, -1, id);
            }

            // We should never end here
            throw Error("[INTERNAL] Illegal decode type");
        };

        /**
         * Converts a value from a string to the canonical element type.
         *
         * Legal only when isMapKey is true.
         *
         * @param {string} str The string value
         * @returns {*} The value
         */
        ElementPrototype.valueFromString = function (str) {
            if (!this.isMapKey) {
                throw Error("valueFromString() called on non-map-key element");
            }

            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    return this.verifyValue(parseInt(str));

                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    // Long-based fields support conversions from string already.
                    return this.verifyValue(str);

                case ProtoBuf.TYPES["bool"]:
                    return str === "true";

                case ProtoBuf.TYPES["string"]:
                    return this.verifyValue(str);

                case ProtoBuf.TYPES["bytes"]:
                    return ByteBuffer.fromBinary(str);
            }
        };

        /**
         * Converts a value from the canonical element type to a string.
         *
         * It should be the case that `valueFromString(valueToString(val))` returns
         * a value equivalent to `verifyValue(val)` for every legal value of `val`
         * according to this element type.
         *
         * This may be used when the element must be stored or used as a string,
         * e.g., as a map key on an Object.
         *
         * Legal only when isMapKey is true.
         *
         * @param {*} val The value
         * @returns {string} The string form of the value.
         */
        ElementPrototype.valueToString = function (value) {
            if (!this.isMapKey) {
                throw Error("valueToString() called on non-map-key element");
            }

            if (this.type === ProtoBuf.TYPES["bytes"]) {
                return value.toString("binary");
            } else {
                return value.toString();
            }
        };

        /**
         * @alias ProtoBuf.Reflect.Element
         * @expose
         */
        Reflect.Element = Element;

        /**
         * Constructs a new Message.
         * @exports ProtoBuf.Reflect.Message
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Namespace} parent Parent message or namespace
         * @param {string} name Message name
         * @param {Object.<string,*>=} options Message options
         * @param {boolean=} isGroup `true` if this is a legacy group
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Message = function Message(builder, parent, name, options, isGroup, syntax) {
            Namespace.call(this, builder, parent, name, options, syntax);

            /**
             * @override
             */
            this.className = "Message";

            /**
             * Extensions range.
             * @type {!Array.<number>|undefined}
             * @expose
             */
            this.extensions = undefined;

            /**
             * Runtime message class.
             * @type {?function(new:ProtoBuf.Builder.Message)}
             * @expose
             */
            this.clazz = null;

            /**
             * Whether this is a legacy group or not.
             * @type {boolean}
             * @expose
             */
            this.isGroup = !!isGroup;

            // The following cached collections are used to efficiently iterate over or look up fields when decoding.

            /**
             * Cached fields.
             * @type {?Array.<!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fields = null;

            /**
             * Cached fields by id.
             * @type {?Object.<number,!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fieldsById = null;

            /**
             * Cached fields by name.
             * @type {?Object.<string,!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fieldsByName = null;
        };

        /**
         * @alias ProtoBuf.Reflect.Message.prototype
         * @inner
         */
        var MessagePrototype = Message.prototype = Object.create(Namespace.prototype);

        /**
         * Builds the message and returns the runtime counterpart, which is a fully functional class.
         * @see ProtoBuf.Builder.Message
         * @param {boolean=} rebuild Whether to rebuild or not, defaults to false
         * @return {ProtoBuf.Reflect.Message} Message class
         * @throws {Error} If the message cannot be built
         * @expose
         */
        MessagePrototype.build = function (rebuild) {
            if (this.clazz && !rebuild) return this.clazz;

            // Create the runtime Message class in its own scope
            var clazz = function (ProtoBuf, T) {

                var fields = T.getChildren(ProtoBuf.Reflect.Message.Field),
                    oneofs = T.getChildren(ProtoBuf.Reflect.Message.OneOf);

                /**
                 * Constructs a new runtime Message.
                 * @name ProtoBuf.Builder.Message
                 * @class Barebone of all runtime messages.
                 * @param {!Object.<string,*>|string} values Preset values
                 * @param {...string} var_args
                 * @constructor
                 * @throws {Error} If the message cannot be created
                 */
                var Message = function Message(values, var_args) {
                    ProtoBuf.Builder.Message.call(this);

                    // Create virtual oneof properties
                    for (var i = 0, k = oneofs.length; i < k; ++i) {
                        this[oneofs[i].name] = null;
                    } // Create fields and set default values
                    for (i = 0, k = fields.length; i < k; ++i) {
                        var field = fields[i];
                        this[field.name] = field.repeated ? [] : field.map ? new ProtoBuf.Map(field) : null;
                        if ((field.required || T.syntax === 'proto3') && field.defaultValue !== null) this[field.name] = field.defaultValue;
                    }

                    if (arguments.length > 0) {
                        var value;
                        // Set field values from a values object
                        if (arguments.length === 1 && values !== null && (typeof values === "undefined" ? "undefined" : _typeof(values)) === 'object' && (
                        /* not _another_ Message */typeof values.encode !== 'function' || values instanceof Message) &&
                        /* not a repeated field */!Array.isArray(values) &&
                        /* not a Map */!(values instanceof ProtoBuf.Map) &&
                        /* not a ByteBuffer */!ByteBuffer.isByteBuffer(values) &&
                        /* not an ArrayBuffer */!(values instanceof ArrayBuffer) &&
                        /* not a Long */!(ProtoBuf.Long && values instanceof ProtoBuf.Long)) {
                            this.$set(values);
                        } else // Set field values from arguments, in declaration order
                            for (i = 0, k = arguments.length; i < k; ++i) {
                                if (typeof (value = arguments[i]) !== 'undefined') this.$set(fields[i].name, value);
                            } // May throw
                    }
                };

                /**
                 * @alias ProtoBuf.Builder.Message.prototype
                 * @inner
                 */
                var MessagePrototype = Message.prototype = Object.create(ProtoBuf.Builder.Message.prototype);

                /**
                 * Adds a value to a repeated field.
                 * @name ProtoBuf.Builder.Message#add
                 * @function
                 * @param {string} key Field name
                 * @param {*} value Value to add
                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be added
                 * @expose
                 */
                MessagePrototype.add = function (key, value, noAssert) {
                    var field = T._fieldsByName[key];
                    if (!noAssert) {
                        if (!field) throw Error(this + "#" + key + " is undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + key + " is not a field: " + field.toString(true)); // May throw if it's an enum or embedded message
                        if (!field.repeated) throw Error(this + "#" + key + " is not a repeated field");
                        value = field.verifyValue(value, true);
                    }
                    if (this[key] === null) this[key] = [];
                    this[key].push(value);
                    return this;
                };

                /**
                 * Adds a value to a repeated field. This is an alias for {@link ProtoBuf.Builder.Message#add}.
                 * @name ProtoBuf.Builder.Message#$add
                 * @function
                 * @param {string} key Field name
                 * @param {*} value Value to add
                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be added
                 * @expose
                 */
                MessagePrototype.$add = MessagePrototype.add;

                /**
                 * Sets a field's value.
                 * @name ProtoBuf.Builder.Message#set
                 * @function
                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                 * @param {boolean=} noAssert Whether to not assert for an actual field / proper value type, defaults to `false`
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be set
                 * @expose
                 */
                MessagePrototype.set = function (keyOrObj, value, noAssert) {
                    if (keyOrObj && (typeof keyOrObj === "undefined" ? "undefined" : _typeof(keyOrObj)) === 'object') {
                        noAssert = value;
                        for (var ikey in keyOrObj) {
                            if (keyOrObj.hasOwnProperty(ikey) && typeof (value = keyOrObj[ikey]) !== 'undefined') this.$set(ikey, value, noAssert);
                        }return this;
                    }
                    var field = T._fieldsByName[keyOrObj];
                    if (!noAssert) {
                        if (!field) throw Error(this + "#" + keyOrObj + " is not a field: undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + keyOrObj + " is not a field: " + field.toString(true));
                        this[field.name] = value = field.verifyValue(value); // May throw
                    } else this[keyOrObj] = value;
                    if (field && field.oneof) {
                        // Field is part of an OneOf (not a virtual OneOf field)
                        var currentField = this[field.oneof.name]; // Virtual field references currently set field
                        if (value !== null) {
                            if (currentField !== null && currentField !== field.name) this[currentField] = null; // Clear currently set field
                            this[field.oneof.name] = field.name; // Point virtual field at this field
                        } else if ( /* value === null && */currentField === keyOrObj) this[field.oneof.name] = null; // Clear virtual field (current field explicitly cleared)
                    }
                    return this;
                };

                /**
                 * Sets a field's value. This is an alias for [@link ProtoBuf.Builder.Message#set}.
                 * @name ProtoBuf.Builder.Message#$set
                 * @function
                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                 * @throws {Error} If the value cannot be set
                 * @expose
                 */
                MessagePrototype.$set = MessagePrototype.set;

                /**
                 * Gets a field's value.
                 * @name ProtoBuf.Builder.Message#get
                 * @function
                 * @param {string} key Key
                 * @param {boolean=} noAssert Whether to not assert for an actual field, defaults to `false`
                 * @return {*} Value
                 * @throws {Error} If there is no such field
                 * @expose
                 */
                MessagePrototype.get = function (key, noAssert) {
                    if (noAssert) return this[key];
                    var field = T._fieldsByName[key];
                    if (!field || !(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + key + " is not a field: undefined");
                    if (!(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + key + " is not a field: " + field.toString(true));
                    return this[field.name];
                };

                /**
                 * Gets a field's value. This is an alias for {@link ProtoBuf.Builder.Message#$get}.
                 * @name ProtoBuf.Builder.Message#$get
                 * @function
                 * @param {string} key Key
                 * @return {*} Value
                 * @throws {Error} If there is no such field
                 * @expose
                 */
                MessagePrototype.$get = MessagePrototype.get;

                // Getters and setters

                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    // no setters for extension fields as these are named by their fqn
                    if (field instanceof ProtoBuf.Reflect.Message.ExtensionField) continue;

                    if (T.builder.options['populateAccessors']) (function (field) {
                        // set/get[SomeValue]
                        var Name = field.originalName.replace(/(_[a-zA-Z])/g, function (match) {
                            return match.toUpperCase().replace('_', '');
                        });
                        Name = Name.substring(0, 1).toUpperCase() + Name.substring(1);

                        // set/get_[some_value] FIXME: Do we really need these?
                        var name = field.originalName.replace(/([A-Z])/g, function (match) {
                            return "_" + match;
                        });

                        /**
                         * The current field's unbound setter function.
                         * @function
                         * @param {*} value
                         * @param {boolean=} noAssert
                         * @returns {!ProtoBuf.Builder.Message}
                         * @inner
                         */
                        var setter = function setter(value, noAssert) {
                            this[field.name] = noAssert ? value : field.verifyValue(value);
                            return this;
                        };

                        /**
                         * The current field's unbound getter function.
                         * @function
                         * @returns {*}
                         * @inner
                         */
                        var getter = function getter() {
                            return this[field.name];
                        };

                        if (T.getChild("set" + Name) === null)
                            /**
                             * Sets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#set[SomeField]
                             * @function
                             * @param {*} value Value to set
                             * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                             * @returns {!ProtoBuf.Builder.Message} this
                             * @abstract
                             * @throws {Error} If the value cannot be set
                             */
                            MessagePrototype["set" + Name] = setter;

                        if (T.getChild("set_" + name) === null)
                            /**
                             * Sets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#set_[some_field]
                             * @function
                             * @param {*} value Value to set
                             * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                             * @returns {!ProtoBuf.Builder.Message} this
                             * @abstract
                             * @throws {Error} If the value cannot be set
                             */
                            MessagePrototype["set_" + name] = setter;

                        if (T.getChild("get" + Name) === null)
                            /**
                             * Gets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#get[SomeField]
                             * @function
                             * @abstract
                             * @return {*} The value
                             */
                            MessagePrototype["get" + Name] = getter;

                        if (T.getChild("get_" + name) === null)
                            /**
                             * Gets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#get_[some_field]
                             * @function
                             * @return {*} The value
                             * @abstract
                             */
                            MessagePrototype["get_" + name] = getter;
                    })(field);
                }

                // En-/decoding

                /**
                 * Encodes the message.
                 * @name ProtoBuf.Builder.Message#$encode
                 * @function
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
                 * @expose
                 * @see ProtoBuf.Builder.Message#encode64
                 * @see ProtoBuf.Builder.Message#encodeHex
                 * @see ProtoBuf.Builder.Message#encodeAB
                 */
                MessagePrototype.encode = function (buffer, noVerify) {
                    if (typeof buffer === 'boolean') noVerify = buffer, buffer = undefined;
                    var isNew = false;
                    if (!buffer) buffer = new ByteBuffer(), isNew = true;
                    var le = buffer.littleEndian;
                    try {
                        T.encode(this, buffer.LE(), noVerify);
                        return (isNew ? buffer.flip() : buffer).LE(le);
                    } catch (e) {
                        buffer.LE(le);
                        throw e;
                    }
                };

                /**
                 * Encodes a message using the specified data payload.
                 * @param {!Object.<string,*>} data Data payload
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @expose
                 */
                Message.encode = function (data, buffer, noVerify) {
                    return new Message(data).encode(buffer, noVerify);
                };

                /**
                 * Calculates the byte length of the message.
                 * @name ProtoBuf.Builder.Message#calculate
                 * @function
                 * @returns {number} Byte length
                 * @throws {Error} If the message cannot be calculated or if required fields are missing.
                 * @expose
                 */
                MessagePrototype.calculate = function () {
                    return T.calculate(this);
                };

                /**
                 * Encodes the varint32 length-delimited message.
                 * @name ProtoBuf.Builder.Message#encodeDelimited
                 * @function
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeDelimited = function (buffer, noVerify) {
                    var isNew = false;
                    if (!buffer) buffer = new ByteBuffer(), isNew = true;
                    var enc = new ByteBuffer().LE();
                    T.encode(this, enc, noVerify).flip();
                    buffer.writeVarint32(enc.remaining());
                    buffer.append(enc);
                    return isNew ? buffer.flip() : buffer;
                };

                /**
                 * Directly encodes the message to an ArrayBuffer.
                 * @name ProtoBuf.Builder.Message#encodeAB
                 * @function
                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeAB = function () {
                    try {
                        return this.encode().toArrayBuffer();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toArrayBuffer();
                        throw e;
                    }
                };

                /**
                 * Returns the message as an ArrayBuffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeAB}.
                 * @name ProtoBuf.Builder.Message#toArrayBuffer
                 * @function
                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toArrayBuffer = MessagePrototype.encodeAB;

                /**
                 * Directly encodes the message to a node Buffer.
                 * @name ProtoBuf.Builder.Message#encodeNB
                 * @function
                 * @return {!Buffer}
                 * @throws {Error} If the message cannot be encoded, not running under node.js or if required fields are
                 *  missing. The later still returns the encoded node Buffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeNB = function () {
                    try {
                        return this.encode().toBuffer();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toBuffer();
                        throw e;
                    }
                };

                /**
                 * Returns the message as a node Buffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeNB}.
                 * @name ProtoBuf.Builder.Message#toBuffer
                 * @function
                 * @return {!Buffer}
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded node Buffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toBuffer = MessagePrototype.encodeNB;

                /**
                 * Directly encodes the message to a base64 encoded string.
                 * @name ProtoBuf.Builder.Message#encode64
                 * @function
                 * @return {string} Base64 encoded string
                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                 *  still returns the encoded base64 string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encode64 = function () {
                    try {
                        return this.encode().toBase64();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toBase64();
                        throw e;
                    }
                };

                /**
                 * Returns the message as a base64 encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encode64}.
                 * @name ProtoBuf.Builder.Message#toBase64
                 * @function
                 * @return {string} Base64 encoded string
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded base64 string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toBase64 = MessagePrototype.encode64;

                /**
                 * Directly encodes the message to a hex encoded string.
                 * @name ProtoBuf.Builder.Message#encodeHex
                 * @function
                 * @return {string} Hex encoded string
                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                 *  still returns the encoded hex string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeHex = function () {
                    try {
                        return this.encode().toHex();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toHex();
                        throw e;
                    }
                };

                /**
                 * Returns the message as a hex encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encodeHex}.
                 * @name ProtoBuf.Builder.Message#toHex
                 * @function
                 * @return {string} Hex encoded string
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded hex string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toHex = MessagePrototype.encodeHex;

                /**
                 * Clones a message object or field value to a raw object.
                 * @param {*} obj Object to clone
                 * @param {boolean} binaryAsBase64 Whether to include binary data as base64 strings or as a buffer otherwise
                 * @param {boolean} longsAsStrings Whether to encode longs as strings
                 * @param {!ProtoBuf.Reflect.T=} resolvedType The resolved field type if a field
                 * @returns {*} Cloned object
                 * @inner
                 */
                function cloneRaw(obj, binaryAsBase64, longsAsStrings, resolvedType) {
                    if (obj === null || (typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object') {
                        // Convert enum values to their respective names
                        if (resolvedType && resolvedType instanceof ProtoBuf.Reflect.Enum) {
                            var name = ProtoBuf.Reflect.Enum.getName(resolvedType.object, obj);
                            if (name !== null) return name;
                        }
                        // Pass-through string, number, boolean, null...
                        return obj;
                    }
                    // Convert ByteBuffers to raw buffer or strings
                    if (ByteBuffer.isByteBuffer(obj)) return binaryAsBase64 ? obj.toBase64() : obj.toBuffer();
                    // Convert Longs to proper objects or strings
                    if (ProtoBuf.Long.isLong(obj)) return longsAsStrings ? obj.toString() : ProtoBuf.Long.fromValue(obj);
                    var clone;
                    // Clone arrays
                    if (Array.isArray(obj)) {
                        clone = [];
                        obj.forEach(function (v, k) {
                            clone[k] = cloneRaw(v, binaryAsBase64, longsAsStrings, resolvedType);
                        });
                        return clone;
                    }
                    clone = {};
                    // Convert maps to objects
                    if (obj instanceof ProtoBuf.Map) {
                        var it = obj.entries();
                        for (var e = it.next(); !e.done; e = it.next()) {
                            clone[obj.keyElem.valueToString(e.value[0])] = cloneRaw(e.value[1], binaryAsBase64, longsAsStrings, obj.valueElem.resolvedType);
                        }return clone;
                    }
                    // Everything else is a non-null object
                    var type = obj.$type,
                        field = undefined;
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (type && (field = type.getChild(i))) clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings, field.resolvedType);else clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings);
                        }
                    }return clone;
                }

                /**
                 * Returns the message's raw payload.
                 * @param {boolean=} binaryAsBase64 Whether to include binary data as base64 strings instead of Buffers, defaults to `false`
                 * @param {boolean} longsAsStrings Whether to encode longs as strings
                 * @returns {Object.<string,*>} Raw payload
                 * @expose
                 */
                MessagePrototype.toRaw = function (binaryAsBase64, longsAsStrings) {
                    return cloneRaw(this, !!binaryAsBase64, !!longsAsStrings, this.$type);
                };

                /**
                 * Encodes a message to JSON.
                 * @returns {string} JSON string
                 * @expose
                 */
                MessagePrototype.encodeJSON = function () {
                    return JSON.stringify(cloneRaw(this,
                    /* binary-as-base64 */true,
                    /* longs-as-strings */true, this.$type));
                };

                /**
                 * Decodes a message from the specified buffer or string.
                 * @name ProtoBuf.Builder.Message.decode
                 * @function
                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                 * @param {(number|string)=} length Message length. Defaults to decode all the remainig data.
                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 * @see ProtoBuf.Builder.Message.decode64
                 * @see ProtoBuf.Builder.Message.decodeHex
                 */
                Message.decode = function (buffer, length, enc) {
                    if (typeof length === 'string') enc = length, length = -1;
                    if (typeof buffer === 'string') buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");else if (!ByteBuffer.isByteBuffer(buffer)) buffer = ByteBuffer.wrap(buffer); // May throw
                    var le = buffer.littleEndian;
                    try {
                        var msg = T.decode(buffer.LE(), length);
                        buffer.LE(le);
                        return msg;
                    } catch (e) {
                        buffer.LE(le);
                        throw e;
                    }
                };

                /**
                 * Decodes a varint32 length-delimited message from the specified buffer or string.
                 * @name ProtoBuf.Builder.Message.decodeDelimited
                 * @function
                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                 * @return {ProtoBuf.Builder.Message} Decoded message or `null` if not enough bytes are available yet
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decodeDelimited = function (buffer, enc) {
                    if (typeof buffer === 'string') buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");else if (!ByteBuffer.isByteBuffer(buffer)) buffer = ByteBuffer.wrap(buffer); // May throw
                    if (buffer.remaining() < 1) return null;
                    var off = buffer.offset,
                        len = buffer.readVarint32();
                    if (buffer.remaining() < len) {
                        buffer.offset = off;
                        return null;
                    }
                    try {
                        var msg = T.decode(buffer.slice(buffer.offset, buffer.offset + len).LE());
                        buffer.offset += len;
                        return msg;
                    } catch (err) {
                        buffer.offset += len;
                        throw err;
                    }
                };

                /**
                 * Decodes the message from the specified base64 encoded string.
                 * @name ProtoBuf.Builder.Message.decode64
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decode64 = function (str) {
                    return Message.decode(str, "base64");
                };

                /**
                 * Decodes the message from the specified hex encoded string.
                 * @name ProtoBuf.Builder.Message.decodeHex
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decodeHex = function (str) {
                    return Message.decode(str, "hex");
                };

                /**
                 * Decodes the message from a JSON string.
                 * @name ProtoBuf.Builder.Message.decodeJSON
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are
                 * missing.
                 * @expose
                 */
                Message.decodeJSON = function (str) {
                    return new Message(JSON.parse(str));
                };

                // Utility

                /**
                 * Returns a string representation of this Message.
                 * @name ProtoBuf.Builder.Message#toString
                 * @function
                 * @return {string} String representation as of ".Fully.Qualified.MessageName"
                 * @expose
                 */
                MessagePrototype.toString = function () {
                    return T.toString();
                };

                // Properties

                /**
                 * Message options.
                 * @name ProtoBuf.Builder.Message.$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $optionsS; // cc needs this

                /**
                 * Message options.
                 * @name ProtoBuf.Builder.Message#$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $options;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Message.$type
                 * @type {!ProtoBuf.Reflect.Message}
                 * @expose
                 */
                var $typeS;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Message#$type
                 * @type {!ProtoBuf.Reflect.Message}
                 * @expose
                 */
                var $type;

                if (Object.defineProperty) Object.defineProperty(Message, '$options', { "value": T.buildOpt() }), Object.defineProperty(MessagePrototype, "$options", { "value": Message["$options"] }), Object.defineProperty(Message, "$type", { "value": T }), Object.defineProperty(MessagePrototype, "$type", { "value": T });

                return Message;
            }(ProtoBuf, this);

            // Static enums and prototyped sub-messages / cached collections
            this._fields = [];
            this._fieldsById = {};
            this._fieldsByName = {};
            for (var i = 0, k = this.children.length, child; i < k; i++) {
                child = this.children[i];
                if (child instanceof Enum || child instanceof Message || child instanceof Service) {
                    if (clazz.hasOwnProperty(child.name)) throw Error("Illegal reflect child of " + this.toString(true) + ": " + child.toString(true) + " cannot override static property '" + child.name + "'");
                    clazz[child.name] = child.build();
                } else if (child instanceof Message.Field) child.build(), this._fields.push(child), this._fieldsById[child.id] = child, this._fieldsByName[child.name] = child;else if (!(child instanceof Message.OneOf) && !(child instanceof Extension)) // Not built
                    throw Error("Illegal reflect child of " + this.toString(true) + ": " + this.children[i].toString(true));
            }

            return this.clazz = clazz;
        };

        /**
         * Encodes a runtime message's contents to the specified buffer.
         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
         * @param {ByteBuffer} buffer ByteBuffer to write to
         * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If required fields are missing or the message cannot be encoded for another reason
         * @expose
         */
        MessagePrototype.encode = function (message, buffer, noVerify) {
            var fieldMissing = null,
                field;
            for (var i = 0, k = this._fields.length, val; i < k; ++i) {
                field = this._fields[i];
                val = message[field.name];
                if (field.required && val === null) {
                    if (fieldMissing === null) fieldMissing = field;
                } else field.encode(noVerify ? val : field.verifyValue(val), buffer, message);
            }
            if (fieldMissing !== null) {
                var err = Error("Missing at least one required field for " + this.toString(true) + ": " + fieldMissing);
                err["encoded"] = buffer; // Still expose what we got
                throw err;
            }
            return buffer;
        };

        /**
         * Calculates a runtime message's byte length.
         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
         * @returns {number} Byte length
         * @throws {Error} If required fields are missing or the message cannot be calculated for another reason
         * @expose
         */
        MessagePrototype.calculate = function (message) {
            for (var n = 0, i = 0, k = this._fields.length, field, val; i < k; ++i) {
                field = this._fields[i];
                val = message[field.name];
                if (field.required && val === null) throw Error("Missing at least one required field for " + this.toString(true) + ": " + field);else n += field.calculate(val, message);
            }
            return n;
        };

        /**
         * Skips all data until the end of the specified group has been reached.
         * @param {number} expectedId Expected GROUPEND id
         * @param {!ByteBuffer} buf ByteBuffer
         * @returns {boolean} `true` if a value as been skipped, `false` if the end has been reached
         * @throws {Error} If it wasn't possible to find the end of the group (buffer overrun or end tag mismatch)
         * @inner
         */
        function skipTillGroupEnd(expectedId, buf) {
            var tag = buf.readVarint32(),
                // Throws on OOB
            wireType = tag & 0x07,
                id = tag >>> 3;
            switch (wireType) {
                case ProtoBuf.WIRE_TYPES.VARINT:
                    do {
                        tag = buf.readUint8();
                    } while ((tag & 0x80) === 0x80);
                    break;
                case ProtoBuf.WIRE_TYPES.BITS64:
                    buf.offset += 8;
                    break;
                case ProtoBuf.WIRE_TYPES.LDELIM:
                    tag = buf.readVarint32(); // reads the varint
                    buf.offset += tag; // skips n bytes
                    break;
                case ProtoBuf.WIRE_TYPES.STARTGROUP:
                    skipTillGroupEnd(id, buf);
                    break;
                case ProtoBuf.WIRE_TYPES.ENDGROUP:
                    if (id === expectedId) return false;else throw Error("Illegal GROUPEND after unknown group: " + id + " (" + expectedId + " expected)");
                case ProtoBuf.WIRE_TYPES.BITS32:
                    buf.offset += 4;
                    break;
                default:
                    throw Error("Illegal wire type in unknown group " + expectedId + ": " + wireType);
            }
            return true;
        }

        /**
         * Decodes an encoded message and returns the decoded message.
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {number=} length Message length. Defaults to decode all remaining data.
         * @param {number=} expectedGroupEndId Expected GROUPEND id if this is a legacy group
         * @return {ProtoBuf.Builder.Message} Decoded message
         * @throws {Error} If the message cannot be decoded
         * @expose
         */
        MessagePrototype.decode = function (buffer, length, expectedGroupEndId) {
            if (typeof length !== 'number') length = -1;
            var start = buffer.offset,
                msg = new this.clazz(),
                tag,
                wireType,
                id,
                field;
            while (buffer.offset < start + length || length === -1 && buffer.remaining() > 0) {
                tag = buffer.readVarint32();
                wireType = tag & 0x07;
                id = tag >>> 3;
                if (wireType === ProtoBuf.WIRE_TYPES.ENDGROUP) {
                    if (id !== expectedGroupEndId) throw Error("Illegal group end indicator for " + this.toString(true) + ": " + id + " (" + (expectedGroupEndId ? expectedGroupEndId + " expected" : "not a group") + ")");
                    break;
                }
                if (!(field = this._fieldsById[id])) {
                    // "messages created by your new code can be parsed by your old code: old binaries simply ignore the new field when parsing."
                    switch (wireType) {
                        case ProtoBuf.WIRE_TYPES.VARINT:
                            buffer.readVarint32();
                            break;
                        case ProtoBuf.WIRE_TYPES.BITS32:
                            buffer.offset += 4;
                            break;
                        case ProtoBuf.WIRE_TYPES.BITS64:
                            buffer.offset += 8;
                            break;
                        case ProtoBuf.WIRE_TYPES.LDELIM:
                            var len = buffer.readVarint32();
                            buffer.offset += len;
                            break;
                        case ProtoBuf.WIRE_TYPES.STARTGROUP:
                            while (skipTillGroupEnd(id, buffer)) {}
                            break;
                        default:
                            throw Error("Illegal wire type for unknown field " + id + " in " + this.toString(true) + "#decode: " + wireType);
                    }
                    continue;
                }
                if (field.repeated && !field.options["packed"]) {
                    msg[field.name].push(field.decode(wireType, buffer));
                } else if (field.map) {
                    var keyval = field.decode(wireType, buffer);
                    msg[field.name].set(keyval[0], keyval[1]);
                } else {
                    msg[field.name] = field.decode(wireType, buffer);
                    if (field.oneof) {
                        // Field is part of an OneOf (not a virtual OneOf field)
                        var currentField = msg[field.oneof.name]; // Virtual field references currently set field
                        if (currentField !== null && currentField !== field.name) msg[currentField] = null; // Clear currently set field
                        msg[field.oneof.name] = field.name; // Point virtual field at this field
                    }
                }
            }

            // Check if all required fields are present and set default values for optional fields that are not
            for (var i = 0, k = this._fields.length; i < k; ++i) {
                field = this._fields[i];
                if (msg[field.name] === null) {
                    if (this.syntax === "proto3") {
                        // Proto3 sets default values by specification
                        msg[field.name] = field.defaultValue;
                    } else if (field.required) {
                        var err = Error("Missing at least one required field for " + this.toString(true) + ": " + field.name);
                        err["decoded"] = msg; // Still expose what we got
                        throw err;
                    } else if (ProtoBuf.populateDefaults && field.defaultValue !== null) msg[field.name] = field.defaultValue;
                }
            }
            return msg;
        };

        /**
         * @alias ProtoBuf.Reflect.Message
         * @expose
         */
        Reflect.Message = Message;

        /**
         * Constructs a new Message Field.
         * @exports ProtoBuf.Reflect.Message.Field
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} rule Rule, one of requried, optional, repeated
         * @param {string?} keytype Key data type, if any.
         * @param {string} type Data type, e.g. int32
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @param {Object.<string,*>=} options Options
         * @param {!ProtoBuf.Reflect.Message.OneOf=} oneof Enclosing OneOf
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Field = function Field(builder, message, rule, keytype, type, name, id, options, oneof, syntax) {
            T.call(this, builder, message, name);

            /**
             * @override
             */
            this.className = "Message.Field";

            /**
             * Message field required flag.
             * @type {boolean}
             * @expose
             */
            this.required = rule === "required";

            /**
             * Message field repeated flag.
             * @type {boolean}
             * @expose
             */
            this.repeated = rule === "repeated";

            /**
             * Message field map flag.
             * @type {boolean}
             * @expose
             */
            this.map = rule === "map";

            /**
             * Message field key type. Type reference string if unresolved, protobuf
             * type if resolved. Valid only if this.map === true, null otherwise.
             * @type {string|{name: string, wireType: number}|null}
             * @expose
             */
            this.keyType = keytype || null;

            /**
             * Message field type. Type reference string if unresolved, protobuf type if
             * resolved. In a map field, this is the value type.
             * @type {string|{name: string, wireType: number}}
             * @expose
             */
            this.type = type;

            /**
             * Resolved type reference inside the global namespace.
             * @type {ProtoBuf.Reflect.T|null}
             * @expose
             */
            this.resolvedType = null;

            /**
             * Unique message field id.
             * @type {number}
             * @expose
             */
            this.id = id;

            /**
             * Message field options.
             * @type {!Object.<string,*>}
             * @dict
             * @expose
             */
            this.options = options || {};

            /**
             * Default value.
             * @type {*}
             * @expose
             */
            this.defaultValue = null;

            /**
             * Enclosing OneOf.
             * @type {?ProtoBuf.Reflect.Message.OneOf}
             * @expose
             */
            this.oneof = oneof || null;

            /**
             * Syntax level of this definition (e.g., proto3).
             * @type {string}
             * @expose
             */
            this.syntax = syntax || 'proto2';

            /**
             * Original field name.
             * @type {string}
             * @expose
             */
            this.originalName = this.name; // Used to revert camelcase transformation on naming collisions

            /**
             * Element implementation. Created in build() after types are resolved.
             * @type {ProtoBuf.Element}
             * @expose
             */
            this.element = null;

            /**
             * Key element implementation, for map fields. Created in build() after
             * types are resolved.
             * @type {ProtoBuf.Element}
             * @expose
             */
            this.keyElement = null;

            // Convert field names to camel case notation if the override is set
            if (this.builder.options['convertFieldsToCamelCase'] && !(this instanceof Message.ExtensionField)) this.name = ProtoBuf.Util.toCamelCase(this.name);
        };

        /**
         * @alias ProtoBuf.Reflect.Message.Field.prototype
         * @inner
         */
        var FieldPrototype = Field.prototype = Object.create(T.prototype);

        /**
         * Builds the field.
         * @override
         * @expose
         */
        FieldPrototype.build = function () {
            this.element = new Element(this.type, this.resolvedType, false, this.syntax, this.name);
            if (this.map) this.keyElement = new Element(this.keyType, undefined, true, this.syntax, this.name);

            // In proto3, fields do not have field presence, and every field is set to
            // its type's default value ("", 0, 0.0, or false).
            if (this.syntax === 'proto3' && !this.repeated && !this.map) this.defaultValue = Element.defaultFieldValue(this.type);

            // Otherwise, default values are present when explicitly specified
            else if (typeof this.options['default'] !== 'undefined') this.defaultValue = this.verifyValue(this.options['default']);
        };

        /**
         * Checks if the given value can be set for this field.
         * @param {*} value Value to check
         * @param {boolean=} skipRepeated Whether to skip the repeated value check or not. Defaults to false.
         * @return {*} Verified, maybe adjusted, value
         * @throws {Error} If the value cannot be set for this field
         * @expose
         */
        FieldPrototype.verifyValue = function (value, skipRepeated) {
            skipRepeated = skipRepeated || false;
            var self = this;
            function fail(val, msg) {
                throw Error("Illegal value for " + self.toString(true) + " of type " + self.type.name + ": " + val + " (" + msg + ")");
            }
            if (value === null) {
                // NULL values for optional fields
                if (this.required) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "required");
                if (this.syntax === 'proto3' && this.type !== ProtoBuf.TYPES["message"]) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "proto3 field without field presence cannot be null");
                return null;
            }
            var i;
            if (this.repeated && !skipRepeated) {
                // Repeated values as arrays
                if (!Array.isArray(value)) value = [value];
                var res = [];
                for (i = 0; i < value.length; i++) {
                    res.push(this.element.verifyValue(value[i]));
                }return res;
            }
            if (this.map && !skipRepeated) {
                // Map values as objects
                if (!(value instanceof ProtoBuf.Map)) {
                    // If not already a Map, attempt to convert.
                    if (!(value instanceof Object)) {
                        fail(typeof value === "undefined" ? "undefined" : _typeof(value), "expected ProtoBuf.Map or raw object for map field");
                    }
                    return new ProtoBuf.Map(this, value);
                } else {
                    return value;
                }
            }
            // All non-repeated fields expect no array
            if (!this.repeated && Array.isArray(value)) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "no array expected");

            return this.element.verifyValue(value);
        };

        /**
         * Determines whether the field will have a presence on the wire given its
         * value.
         * @param {*} value Verified field value
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @return {boolean} Whether the field will be present on the wire
         */
        FieldPrototype.hasWirePresence = function (value, message) {
            if (this.syntax !== 'proto3') return value !== null;
            if (this.oneof && message[this.oneof.name] === this.name) return true;
            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    return value !== 0;

                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    return value.low !== 0 || value.high !== 0;

                case ProtoBuf.TYPES["bool"]:
                    return value;

                case ProtoBuf.TYPES["float"]:
                case ProtoBuf.TYPES["double"]:
                    return value !== 0.0;

                case ProtoBuf.TYPES["string"]:
                    return value.length > 0;

                case ProtoBuf.TYPES["bytes"]:
                    return value.remaining() > 0;

                case ProtoBuf.TYPES["enum"]:
                    return value !== 0;

                case ProtoBuf.TYPES["message"]:
                    return value !== null;
                default:
                    return true;
            }
        };

        /**
         * Encodes the specified field value to the specified buffer.
         * @param {*} value Verified field value
         * @param {ByteBuffer} buffer ByteBuffer to encode to
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If the field cannot be encoded
         * @expose
         */
        FieldPrototype.encode = function (value, buffer, message) {
            if (this.type === null || _typeof(this.type) !== 'object') throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type);
            if (value === null || this.repeated && value.length == 0) return buffer; // Optional omitted
            try {
                if (this.repeated) {
                    var i;
                    // "Only repeated fields of primitive numeric types (types which use the varint, 32-bit, or 64-bit wire
                    // types) can be declared 'packed'."
                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        // "All of the elements of the field are packed into a single key-value pair with wire type 2
                        // (length-delimited). Each element is encoded the same way it would be normally, except without a
                        // tag preceding it."
                        buffer.writeVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        buffer.ensureCapacity(buffer.offset += 1); // We do not know the length yet, so let's assume a varint of length 1
                        var start = buffer.offset; // Remember where the contents begin
                        for (i = 0; i < value.length; i++) {
                            this.element.encodeValue(this.id, value[i], buffer);
                        }var len = buffer.offset - start,
                            varintLen = ByteBuffer.calculateVarint32(len);
                        if (varintLen > 1) {
                            // We need to move the contents
                            var contents = buffer.slice(start, buffer.offset);
                            start += varintLen - 1;
                            buffer.offset = start;
                            buffer.append(contents);
                        }
                        buffer.writeVarint32(len, start - varintLen);
                    } else {
                        // "If your message definition has repeated elements (without the [packed=true] option), the encoded
                        // message has zero or more key-value pairs with the same tag number"
                        for (i = 0; i < value.length; i++) {
                            buffer.writeVarint32(this.id << 3 | this.type.wireType), this.element.encodeValue(this.id, value[i], buffer);
                        }
                    }
                } else if (this.map) {
                    // Write out each map entry as a submessage.
                    value.forEach(function (val, key, m) {
                        // Compute the length of the submessage (key, val) pair.
                        var length = ByteBuffer.calculateVarint32(1 << 3 | this.keyType.wireType) + this.keyElement.calculateLength(1, key) + ByteBuffer.calculateVarint32(2 << 3 | this.type.wireType) + this.element.calculateLength(2, val);

                        // Submessage with wire type of length-delimited.
                        buffer.writeVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        buffer.writeVarint32(length);

                        // Write out the key and val.
                        buffer.writeVarint32(1 << 3 | this.keyType.wireType);
                        this.keyElement.encodeValue(1, key, buffer);
                        buffer.writeVarint32(2 << 3 | this.type.wireType);
                        this.element.encodeValue(2, val, buffer);
                    }, this);
                } else {
                    if (this.hasWirePresence(value, message)) {
                        buffer.writeVarint32(this.id << 3 | this.type.wireType);
                        this.element.encodeValue(this.id, value, buffer);
                    }
                }
            } catch (e) {
                throw Error("Illegal value for " + this.toString(true) + ": " + value + " (" + e + ")");
            }
            return buffer;
        };

        /**
         * Calculates the length of this field's value on the network level.
         * @param {*} value Field value
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @returns {number} Byte length
         * @expose
         */
        FieldPrototype.calculate = function (value, message) {
            value = this.verifyValue(value); // May throw
            if (this.type === null || _typeof(this.type) !== 'object') throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type);
            if (value === null || this.repeated && value.length == 0) return 0; // Optional omitted
            var n = 0;
            try {
                if (this.repeated) {
                    var i, ni;
                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        n += ByteBuffer.calculateVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        ni = 0;
                        for (i = 0; i < value.length; i++) {
                            ni += this.element.calculateLength(this.id, value[i]);
                        }n += ByteBuffer.calculateVarint32(ni);
                        n += ni;
                    } else {
                        for (i = 0; i < value.length; i++) {
                            n += ByteBuffer.calculateVarint32(this.id << 3 | this.type.wireType), n += this.element.calculateLength(this.id, value[i]);
                        }
                    }
                } else if (this.map) {
                    // Each map entry becomes a submessage.
                    value.forEach(function (val, key, m) {
                        // Compute the length of the submessage (key, val) pair.
                        var length = ByteBuffer.calculateVarint32(1 << 3 | this.keyType.wireType) + this.keyElement.calculateLength(1, key) + ByteBuffer.calculateVarint32(2 << 3 | this.type.wireType) + this.element.calculateLength(2, val);

                        n += ByteBuffer.calculateVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        n += ByteBuffer.calculateVarint32(length);
                        n += length;
                    }, this);
                } else {
                    if (this.hasWirePresence(value, message)) {
                        n += ByteBuffer.calculateVarint32(this.id << 3 | this.type.wireType);
                        n += this.element.calculateLength(this.id, value);
                    }
                }
            } catch (e) {
                throw Error("Illegal value for " + this.toString(true) + ": " + value + " (" + e + ")");
            }
            return n;
        };

        /**
         * Decode the field value from the specified buffer.
         * @param {number} wireType Leading wire type
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {boolean=} skipRepeated Whether to skip the repeated check or not. Defaults to false.
         * @return {*} Decoded value: array for packed repeated fields, [key, value] for
         *             map fields, or an individual value otherwise.
         * @throws {Error} If the field cannot be decoded
         * @expose
         */
        FieldPrototype.decode = function (wireType, buffer, skipRepeated) {
            var value, nBytes;

            // We expect wireType to match the underlying type's wireType unless we see
            // a packed repeated field, or unless this is a map field.
            var wireTypeOK = !this.map && wireType == this.type.wireType || !skipRepeated && this.repeated && this.options["packed"] && wireType == ProtoBuf.WIRE_TYPES.LDELIM || this.map && wireType == ProtoBuf.WIRE_TYPES.LDELIM;
            if (!wireTypeOK) throw Error("Illegal wire type for field " + this.toString(true) + ": " + wireType + " (" + this.type.wireType + " expected)");

            // Handle packed repeated fields.
            if (wireType == ProtoBuf.WIRE_TYPES.LDELIM && this.repeated && this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                if (!skipRepeated) {
                    nBytes = buffer.readVarint32();
                    nBytes = buffer.offset + nBytes; // Limit
                    var values = [];
                    while (buffer.offset < nBytes) {
                        values.push(this.decode(this.type.wireType, buffer, true));
                    }return values;
                }
                // Read the next value otherwise...
            }

            // Handle maps.
            if (this.map) {
                // Read one (key, value) submessage, and return [key, value]
                var key = Element.defaultFieldValue(this.keyType);
                value = Element.defaultFieldValue(this.type);

                // Read the length
                nBytes = buffer.readVarint32();
                if (buffer.remaining() < nBytes) throw Error("Illegal number of bytes for " + this.toString(true) + ": " + nBytes + " required but got only " + buffer.remaining());

                // Get a sub-buffer of this key/value submessage
                var msgbuf = buffer.clone();
                msgbuf.limit = msgbuf.offset + nBytes;
                buffer.offset += nBytes;

                while (msgbuf.remaining() > 0) {
                    var tag = msgbuf.readVarint32();
                    wireType = tag & 0x07;
                    var id = tag >>> 3;
                    if (id === 1) {
                        key = this.keyElement.decode(msgbuf, wireType, id);
                    } else if (id === 2) {
                        value = this.element.decode(msgbuf, wireType, id);
                    } else {
                        throw Error("Unexpected tag in map field key/value submessage");
                    }
                }

                return [key, value];
            }

            // Handle singular and non-packed repeated field values.
            return this.element.decode(buffer, wireType, this.id);
        };

        /**
         * @alias ProtoBuf.Reflect.Message.Field
         * @expose
         */
        Reflect.Message.Field = Field;

        /**
         * Constructs a new Message ExtensionField.
         * @exports ProtoBuf.Reflect.Message.ExtensionField
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} rule Rule, one of requried, optional, repeated
         * @param {string} type Data type, e.g. int32
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @param {!Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Message.Field
         */
        var ExtensionField = function ExtensionField(builder, message, rule, type, name, id, options) {
            Field.call(this, builder, message, rule, /* keytype = */null, type, name, id, options);

            /**
             * Extension reference.
             * @type {!ProtoBuf.Reflect.Extension}
             * @expose
             */
            this.extension;
        };

        // Extends Field
        ExtensionField.prototype = Object.create(Field.prototype);

        /**
         * @alias ProtoBuf.Reflect.Message.ExtensionField
         * @expose
         */
        Reflect.Message.ExtensionField = ExtensionField;

        /**
         * Constructs a new Message OneOf.
         * @exports ProtoBuf.Reflect.Message.OneOf
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} name OneOf name
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var OneOf = function OneOf(builder, message, name) {
            T.call(this, builder, message, name);

            /**
             * Enclosed fields.
             * @type {!Array.<!ProtoBuf.Reflect.Message.Field>}
             * @expose
             */
            this.fields = [];
        };

        /**
         * @alias ProtoBuf.Reflect.Message.OneOf
         * @expose
         */
        Reflect.Message.OneOf = OneOf;

        /**
         * Constructs a new Enum.
         * @exports ProtoBuf.Reflect.Enum
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.T} parent Parent Reflect object
         * @param {string} name Enum name
         * @param {Object.<string,*>=} options Enum options
         * @param {string?} syntax The syntax level (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Enum = function Enum(builder, parent, name, options, syntax) {
            Namespace.call(this, builder, parent, name, options, syntax);

            /**
             * @override
             */
            this.className = "Enum";

            /**
             * Runtime enum object.
             * @type {Object.<string,number>|null}
             * @expose
             */
            this.object = null;
        };

        /**
         * Gets the string name of an enum value.
         * @param {!ProtoBuf.Builder.Enum} enm Runtime enum
         * @param {number} value Enum value
         * @returns {?string} Name or `null` if not present
         * @expose
         */
        Enum.getName = function (enm, value) {
            var keys = Object.keys(enm);
            for (var i = 0, key; i < keys.length; ++i) {
                if (enm[key = keys[i]] === value) return key;
            }return null;
        };

        /**
         * @alias ProtoBuf.Reflect.Enum.prototype
         * @inner
         */
        var EnumPrototype = Enum.prototype = Object.create(Namespace.prototype);

        /**
         * Builds this enum and returns the runtime counterpart.
         * @param {boolean} rebuild Whether to rebuild or not, defaults to false
         * @returns {!Object.<string,number>}
         * @expose
         */
        EnumPrototype.build = function (rebuild) {
            if (this.object && !rebuild) return this.object;
            var enm = new ProtoBuf.Builder.Enum(),
                values = this.getChildren(Enum.Value);
            for (var i = 0, k = values.length; i < k; ++i) {
                enm[values[i]['name']] = values[i]['id'];
            }if (Object.defineProperty) Object.defineProperty(enm, '$options', {
                "value": this.buildOpt(),
                "enumerable": false
            });
            return this.object = enm;
        };

        /**
         * @alias ProtoBuf.Reflect.Enum
         * @expose
         */
        Reflect.Enum = Enum;

        /**
         * Constructs a new Enum Value.
         * @exports ProtoBuf.Reflect.Enum.Value
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Enum} enm Enum reference
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Value = function Value(builder, enm, name, id) {
            T.call(this, builder, enm, name);

            /**
             * @override
             */
            this.className = "Enum.Value";

            /**
             * Unique enum value id.
             * @type {number}
             * @expose
             */
            this.id = id;
        };

        // Extends T
        Value.prototype = Object.create(T.prototype);

        /**
         * @alias ProtoBuf.Reflect.Enum.Value
         * @expose
         */
        Reflect.Enum.Value = Value;

        /**
         * An extension (field).
         * @exports ProtoBuf.Reflect.Extension
         * @constructor
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.T} parent Parent object
         * @param {string} name Object name
         * @param {!ProtoBuf.Reflect.Message.Field} field Extension field
         */
        var Extension = function Extension(builder, parent, name, field) {
            T.call(this, builder, parent, name);

            /**
             * Extended message field.
             * @type {!ProtoBuf.Reflect.Message.Field}
             * @expose
             */
            this.field = field;
        };

        // Extends T
        Extension.prototype = Object.create(T.prototype);

        /**
         * @alias ProtoBuf.Reflect.Extension
         * @expose
         */
        Reflect.Extension = Extension;

        /**
         * Constructs a new Service.
         * @exports ProtoBuf.Reflect.Service
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Namespace} root Root
         * @param {string} name Service name
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Service = function Service(builder, root, name, options) {
            Namespace.call(this, builder, root, name, options);

            /**
             * @override
             */
            this.className = "Service";

            /**
             * Built runtime service class.
             * @type {?function(new:ProtoBuf.Builder.Service)}
             */
            this.clazz = null;
        };

        /**
         * @alias ProtoBuf.Reflect.Service.prototype
         * @inner
         */
        var ServicePrototype = Service.prototype = Object.create(Namespace.prototype);

        /**
         * Builds the service and returns the runtime counterpart, which is a fully functional class.
         * @see ProtoBuf.Builder.Service
         * @param {boolean=} rebuild Whether to rebuild or not
         * @return {Function} Service class
         * @throws {Error} If the message cannot be built
         * @expose
         */
        ServicePrototype.build = function (rebuild) {
            if (this.clazz && !rebuild) return this.clazz;

            // Create the runtime Service class in its own scope
            return this.clazz = function (ProtoBuf, T) {

                /**
                 * Constructs a new runtime Service.
                 * @name ProtoBuf.Builder.Service
                 * @param {function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))=} rpcImpl RPC implementation receiving the method name and the message
                 * @class Barebone of all runtime services.
                 * @constructor
                 * @throws {Error} If the service cannot be created
                 */
                var Service = function Service(rpcImpl) {
                    ProtoBuf.Builder.Service.call(this);

                    /**
                     * Service implementation.
                     * @name ProtoBuf.Builder.Service#rpcImpl
                     * @type {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))}
                     * @expose
                     */
                    this.rpcImpl = rpcImpl || function (name, msg, callback) {
                        // This is what a user has to implement: A function receiving the method name, the actual message to
                        // send (type checked) and the callback that's either provided with the error as its first
                        // argument or null and the actual response message.
                        setTimeout(callback.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0); // Must be async!
                    };
                };

                /**
                 * @alias ProtoBuf.Builder.Service.prototype
                 * @inner
                 */
                var ServicePrototype = Service.prototype = Object.create(ProtoBuf.Builder.Service.prototype);

                /**
                 * Asynchronously performs an RPC call using the given RPC implementation.
                 * @name ProtoBuf.Builder.Service.[Method]
                 * @function
                 * @param {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))} rpcImpl RPC implementation
                 * @param {ProtoBuf.Builder.Message} req Request
                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
                 * @abstract
                 */

                /**
                 * Asynchronously performs an RPC call using the instance's RPC implementation.
                 * @name ProtoBuf.Builder.Service#[Method]
                 * @function
                 * @param {ProtoBuf.Builder.Message} req Request
                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
                 * @abstract
                 */

                var rpc = T.getChildren(ProtoBuf.Reflect.Service.RPCMethod);
                for (var i = 0; i < rpc.length; i++) {
                    (function (method) {

                        // service#Method(message, callback)
                        ServicePrototype[method.name] = function (req, callback) {
                            try {
                                try {
                                    // If given as a buffer, decode the request. Will throw a TypeError if not a valid buffer.
                                    req = method.resolvedRequestType.clazz.decode(ByteBuffer.wrap(req));
                                } catch (err) {
                                    if (!(err instanceof TypeError)) throw err;
                                }
                                if (req === null || (typeof req === "undefined" ? "undefined" : _typeof(req)) !== 'object') throw Error("Illegal arguments");
                                if (!(req instanceof method.resolvedRequestType.clazz)) req = new method.resolvedRequestType.clazz(req);
                                this.rpcImpl(method.fqn(), req, function (err, res) {
                                    // Assumes that this is properly async
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    // Coalesce to empty string when service response has empty content
                                    if (res === null) res = '';
                                    try {
                                        res = method.resolvedResponseType.clazz.decode(res);
                                    } catch (notABuffer) {}
                                    if (!res || !(res instanceof method.resolvedResponseType.clazz)) {
                                        callback(Error("Illegal response type received in service method " + T.name + "#" + method.name));
                                        return;
                                    }
                                    callback(null, res);
                                });
                            } catch (err) {
                                setTimeout(callback.bind(this, err), 0);
                            }
                        };

                        // Service.Method(rpcImpl, message, callback)
                        Service[method.name] = function (rpcImpl, req, callback) {
                            new Service(rpcImpl)[method.name](req, callback);
                        };

                        if (Object.defineProperty) Object.defineProperty(Service[method.name], "$options", { "value": method.buildOpt() }), Object.defineProperty(ServicePrototype[method.name], "$options", { "value": Service[method.name]["$options"] });
                    })(rpc[i]);
                }

                // Properties

                /**
                 * Service options.
                 * @name ProtoBuf.Builder.Service.$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $optionsS; // cc needs this

                /**
                 * Service options.
                 * @name ProtoBuf.Builder.Service#$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $options;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Service.$type
                 * @type {!ProtoBuf.Reflect.Service}
                 * @expose
                 */
                var $typeS;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Service#$type
                 * @type {!ProtoBuf.Reflect.Service}
                 * @expose
                 */
                var $type;

                if (Object.defineProperty) Object.defineProperty(Service, "$options", { "value": T.buildOpt() }), Object.defineProperty(ServicePrototype, "$options", { "value": Service["$options"] }), Object.defineProperty(Service, "$type", { "value": T }), Object.defineProperty(ServicePrototype, "$type", { "value": T });

                return Service;
            }(ProtoBuf, this);
        };

        /**
         * @alias ProtoBuf.Reflect.Service
         * @expose
         */
        Reflect.Service = Service;

        /**
         * Abstract service method.
         * @exports ProtoBuf.Reflect.Service.Method
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Service} svc Service
         * @param {string} name Method name
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Method = function Method(builder, svc, name, options) {
            T.call(this, builder, svc, name);

            /**
             * @override
             */
            this.className = "Service.Method";

            /**
             * Options.
             * @type {Object.<string, *>}
             * @expose
             */
            this.options = options || {};
        };

        /**
         * @alias ProtoBuf.Reflect.Service.Method.prototype
         * @inner
         */
        var MethodPrototype = Method.prototype = Object.create(T.prototype);

        /**
         * Builds the method's '$options' property.
         * @name ProtoBuf.Reflect.Service.Method#buildOpt
         * @function
         * @return {Object.<string,*>}
         */
        MethodPrototype.buildOpt = NamespacePrototype.buildOpt;

        /**
         * @alias ProtoBuf.Reflect.Service.Method
         * @expose
         */
        Reflect.Service.Method = Method;

        /**
         * RPC service method.
         * @exports ProtoBuf.Reflect.Service.RPCMethod
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Service} svc Service
         * @param {string} name Method name
         * @param {string} request Request message name
         * @param {string} response Response message name
         * @param {boolean} request_stream Whether requests are streamed
         * @param {boolean} response_stream Whether responses are streamed
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Service.Method
         */
        var RPCMethod = function RPCMethod(builder, svc, name, request, response, request_stream, response_stream, options) {
            Method.call(this, builder, svc, name, options);

            /**
             * @override
             */
            this.className = "Service.RPCMethod";

            /**
             * Request message name.
             * @type {string}
             * @expose
             */
            this.requestName = request;

            /**
             * Response message name.
             * @type {string}
             * @expose
             */
            this.responseName = response;

            /**
             * Whether requests are streamed
             * @type {bool}
             * @expose
             */
            this.requestStream = request_stream;

            /**
             * Whether responses are streamed
             * @type {bool}
             * @expose
             */
            this.responseStream = response_stream;

            /**
             * Resolved request message type.
             * @type {ProtoBuf.Reflect.Message}
             * @expose
             */
            this.resolvedRequestType = null;

            /**
             * Resolved response message type.
             * @type {ProtoBuf.Reflect.Message}
             * @expose
             */
            this.resolvedResponseType = null;
        };

        // Extends Method
        RPCMethod.prototype = Object.create(Method.prototype);

        /**
         * @alias ProtoBuf.Reflect.Service.RPCMethod
         * @expose
         */
        Reflect.Service.RPCMethod = RPCMethod;

        return Reflect;
    }(ProtoBuf);

    /**
     * @alias ProtoBuf.Builder
     * @expose
     */
    ProtoBuf.Builder = function (ProtoBuf, Lang, Reflect) {
        "use strict";

        /**
         * Constructs a new Builder.
         * @exports ProtoBuf.Builder
         * @class Provides the functionality to build protocol messages.
         * @param {Object.<string,*>=} options Options
         * @constructor
         */

        var Builder = function Builder(options) {

            /**
             * Namespace.
             * @type {ProtoBuf.Reflect.Namespace}
             * @expose
             */
            this.ns = new Reflect.Namespace(this, null, ""); // Global namespace

            /**
             * Namespace pointer.
             * @type {ProtoBuf.Reflect.T}
             * @expose
             */
            this.ptr = this.ns;

            /**
             * Resolved flag.
             * @type {boolean}
             * @expose
             */
            this.resolved = false;

            /**
             * The current building result.
             * @type {Object.<string,ProtoBuf.Builder.Message|Object>|null}
             * @expose
             */
            this.result = null;

            /**
             * Imported files.
             * @type {Array.<string>}
             * @expose
             */
            this.files = {};

            /**
             * Import root override.
             * @type {?string}
             * @expose
             */
            this.importRoot = null;

            /**
             * Options.
             * @type {!Object.<string, *>}
             * @expose
             */
            this.options = options || {};
        };

        /**
         * @alias ProtoBuf.Builder.prototype
         * @inner
         */
        var BuilderPrototype = Builder.prototype;

        // ----- Definition tests -----

        /**
         * Tests if a definition most likely describes a message.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isMessage = function (def) {
            // Messages require a string name
            if (typeof def["name"] !== 'string') return false;
            // Messages do not contain values (enum) or rpc methods (service)
            if (typeof def["values"] !== 'undefined' || typeof def["rpc"] !== 'undefined') return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes a message field.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isMessageField = function (def) {
            // Message fields require a string rule, name and type and an id
            if (typeof def["rule"] !== 'string' || typeof def["name"] !== 'string' || typeof def["type"] !== 'string' || typeof def["id"] === 'undefined') return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes an enum.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isEnum = function (def) {
            // Enums require a string name
            if (typeof def["name"] !== 'string') return false;
            // Enums require at least one value
            if (typeof def["values"] === 'undefined' || !Array.isArray(def["values"]) || def["values"].length === 0) return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes a service.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isService = function (def) {
            // Services require a string name and an rpc object
            if (typeof def["name"] !== 'string' || _typeof(def["rpc"]) !== 'object' || !def["rpc"]) return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes an extended message
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isExtend = function (def) {
            // Extends rquire a string ref
            if (typeof def["ref"] !== 'string') return false;
            return true;
        };

        // ----- Building -----

        /**
         * Resets the pointer to the root namespace.
         * @returns {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.reset = function () {
            this.ptr = this.ns;
            return this;
        };

        /**
         * Defines a namespace on top of the current pointer position and places the pointer on it.
         * @param {string} namespace
         * @return {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.define = function (namespace) {
            if (typeof namespace !== 'string' || !Lang.TYPEREF.test(namespace)) throw Error("illegal namespace: " + namespace);
            namespace.split(".").forEach(function (part) {
                var ns = this.ptr.getChild(part);
                if (ns === null) // Keep existing
                    this.ptr.addChild(ns = new Reflect.Namespace(this, this.ptr, part));
                this.ptr = ns;
            }, this);
            return this;
        };

        /**
         * Creates the specified definitions at the current pointer position.
         * @param {!Array.<!Object>} defs Messages, enums or services to create
         * @returns {!ProtoBuf.Builder} this
         * @throws {Error} If a message definition is invalid
         * @expose
         */
        BuilderPrototype.create = function (defs) {
            if (!defs) return this; // Nothing to create
            if (!Array.isArray(defs)) defs = [defs];else {
                if (defs.length === 0) return this;
                defs = defs.slice();
            }

            // It's quite hard to keep track of scopes and memory here, so let's do this iteratively.
            var stack = [defs];
            while (stack.length > 0) {
                defs = stack.pop();

                if (!Array.isArray(defs)) // Stack always contains entire namespaces
                    throw Error("not a valid namespace: " + JSON.stringify(defs));

                while (defs.length > 0) {
                    var def = defs.shift(); // Namespaces always contain an array of messages, enums and services

                    if (Builder.isMessage(def)) {
                        var obj = new Reflect.Message(this, this.ptr, def["name"], def["options"], def["isGroup"], def["syntax"]);

                        // Create OneOfs
                        var oneofs = {};
                        if (def["oneofs"]) Object.keys(def["oneofs"]).forEach(function (name) {
                            obj.addChild(oneofs[name] = new Reflect.Message.OneOf(this, obj, name));
                        }, this);

                        // Create fields
                        if (def["fields"]) def["fields"].forEach(function (fld) {
                            if (obj.getChild(fld["id"] | 0) !== null) throw Error("duplicate or invalid field id in " + obj.name + ": " + fld['id']);
                            if (fld["options"] && _typeof(fld["options"]) !== 'object') throw Error("illegal field options in " + obj.name + "#" + fld["name"]);
                            var oneof = null;
                            if (typeof fld["oneof"] === 'string' && !(oneof = oneofs[fld["oneof"]])) throw Error("illegal oneof in " + obj.name + "#" + fld["name"] + ": " + fld["oneof"]);
                            fld = new Reflect.Message.Field(this, obj, fld["rule"], fld["keytype"], fld["type"], fld["name"], fld["id"], fld["options"], oneof, def["syntax"]);
                            if (oneof) oneof.fields.push(fld);
                            obj.addChild(fld);
                        }, this);

                        // Push children to stack
                        var subObj = [];
                        if (def["enums"]) def["enums"].forEach(function (enm) {
                            subObj.push(enm);
                        });
                        if (def["messages"]) def["messages"].forEach(function (msg) {
                            subObj.push(msg);
                        });
                        if (def["services"]) def["services"].forEach(function (svc) {
                            subObj.push(svc);
                        });

                        // Set extension ranges
                        if (def["extensions"]) {
                            if (typeof def["extensions"][0] === 'number') // pre 5.0.1
                                obj.extensions = [def["extensions"]];else obj.extensions = def["extensions"];
                        }

                        // Create on top of current namespace
                        this.ptr.addChild(obj);
                        if (subObj.length > 0) {
                            stack.push(defs); // Push the current level back
                            defs = subObj; // Continue processing sub level
                            subObj = null;
                            this.ptr = obj; // And move the pointer to this namespace
                            obj = null;
                            continue;
                        }
                        subObj = null;
                    } else if (Builder.isEnum(def)) {

                        obj = new Reflect.Enum(this, this.ptr, def["name"], def["options"], def["syntax"]);
                        def["values"].forEach(function (val) {
                            obj.addChild(new Reflect.Enum.Value(this, obj, val["name"], val["id"]));
                        }, this);
                        this.ptr.addChild(obj);
                    } else if (Builder.isService(def)) {

                        obj = new Reflect.Service(this, this.ptr, def["name"], def["options"]);
                        Object.keys(def["rpc"]).forEach(function (name) {
                            var mtd = def["rpc"][name];
                            obj.addChild(new Reflect.Service.RPCMethod(this, obj, name, mtd["request"], mtd["response"], !!mtd["request_stream"], !!mtd["response_stream"], mtd["options"]));
                        }, this);
                        this.ptr.addChild(obj);
                    } else if (Builder.isExtend(def)) {

                        obj = this.ptr.resolve(def["ref"], true);
                        if (obj) {
                            def["fields"].forEach(function (fld) {
                                if (obj.getChild(fld['id'] | 0) !== null) throw Error("duplicate extended field id in " + obj.name + ": " + fld['id']);
                                // Check if field id is allowed to be extended
                                if (obj.extensions) {
                                    var valid = false;
                                    obj.extensions.forEach(function (range) {
                                        if (fld["id"] >= range[0] && fld["id"] <= range[1]) valid = true;
                                    });
                                    if (!valid) throw Error("illegal extended field id in " + obj.name + ": " + fld['id'] + " (not within valid ranges)");
                                }
                                // Convert extension field names to camel case notation if the override is set
                                var name = fld["name"];
                                if (this.options['convertFieldsToCamelCase']) name = ProtoBuf.Util.toCamelCase(name);
                                // see #161: Extensions use their fully qualified name as their runtime key and...
                                var field = new Reflect.Message.ExtensionField(this, obj, fld["rule"], fld["type"], this.ptr.fqn() + '.' + name, fld["id"], fld["options"]);
                                // ...are added on top of the current namespace as an extension which is used for
                                // resolving their type later on (the extension always keeps the original name to
                                // prevent naming collisions)
                                var ext = new Reflect.Extension(this, this.ptr, fld["name"], field);
                                field.extension = ext;
                                this.ptr.addChild(ext);
                                obj.addChild(field);
                            }, this);
                        } else if (!/\.?google\.protobuf\./.test(def["ref"])) // Silently skip internal extensions
                            throw Error("extended message " + def["ref"] + " is not defined");
                    } else throw Error("not a valid definition: " + JSON.stringify(def));

                    def = null;
                    obj = null;
                }
                // Break goes here
                defs = null;
                this.ptr = this.ptr.parent; // Namespace done, continue at parent
            }
            this.resolved = false; // Require re-resolve
            this.result = null; // Require re-build
            return this;
        };

        /**
         * Propagates syntax to all children.
         * @param {!Object} parent
         * @inner
         */
        function propagateSyntax(parent) {
            if (parent['messages']) {
                parent['messages'].forEach(function (child) {
                    child["syntax"] = parent["syntax"];
                    propagateSyntax(child);
                });
            }
            if (parent['enums']) {
                parent['enums'].forEach(function (child) {
                    child["syntax"] = parent["syntax"];
                });
            }
        }

        /**
         * Imports another definition into this builder.
         * @param {Object.<string,*>} json Parsed import
         * @param {(string|{root: string, file: string})=} filename Imported file name
         * @returns {!ProtoBuf.Builder} this
         * @throws {Error} If the definition or file cannot be imported
         * @expose
         */
        BuilderPrototype["import"] = function (json, filename) {
            var delim = '/';

            // Make sure to skip duplicate imports

            if (typeof filename === 'string') {

                if (ProtoBuf.Util.IS_NODE) filename = require("path")['resolve'](filename);
                if (this.files[filename] === true) return this.reset();
                this.files[filename] = true;
            } else if ((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object') {
                // Object with root, file.

                var root = filename.root;
                if (ProtoBuf.Util.IS_NODE) root = require("path")['resolve'](root);
                if (root.indexOf("\\") >= 0 || filename.file.indexOf("\\") >= 0) delim = '\\';
                var fname = root + delim + filename.file;
                if (this.files[fname] === true) return this.reset();
                this.files[fname] = true;
            }

            // Import imports

            if (json['imports'] && json['imports'].length > 0) {
                var importRoot,
                    resetRoot = false;

                if ((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object') {
                    // If an import root is specified, override

                    this.importRoot = filename["root"];resetRoot = true; // ... and reset afterwards
                    importRoot = this.importRoot;
                    filename = filename["file"];
                    if (importRoot.indexOf("\\") >= 0 || filename.indexOf("\\") >= 0) delim = '\\';
                } else if (typeof filename === 'string') {

                    if (this.importRoot) // If import root is overridden, use it
                        importRoot = this.importRoot;else {
                        // Otherwise compute from filename
                        if (filename.indexOf("/") >= 0) {
                            // Unix
                            importRoot = filename.replace(/\/[^\/]*$/, "");
                            if ( /* /file.proto */importRoot === "") importRoot = "/";
                        } else if (filename.indexOf("\\") >= 0) {
                            // Windows
                            importRoot = filename.replace(/\\[^\\]*$/, "");
                            delim = '\\';
                        } else importRoot = ".";
                    }
                } else importRoot = null;

                for (var i = 0; i < json['imports'].length; i++) {
                    if (typeof json['imports'][i] === 'string') {
                        // Import file
                        if (!importRoot) throw Error("cannot determine import root");
                        var importFilename = json['imports'][i];
                        if (importFilename === "google/protobuf/descriptor.proto") continue; // Not needed and therefore not used
                        importFilename = importRoot + delim + importFilename;
                        if (this.files[importFilename] === true) continue; // Already imported
                        if (/\.proto$/i.test(importFilename) && !ProtoBuf.DotProto) // If this is a light build
                            importFilename = importFilename.replace(/\.proto$/, ".json"); // always load the JSON file
                        var contents = ProtoBuf.Util.fetch(importFilename);
                        if (contents === null) throw Error("failed to import '" + importFilename + "' in '" + filename + "': file not found");
                        if (/\.json$/i.test(importFilename)) // Always possible
                            this["import"](JSON.parse(contents + ""), importFilename); // May throw
                        else this["import"](ProtoBuf.DotProto.Parser.parse(contents), importFilename); // May throw
                    } else // Import structure
                        if (!filename) this["import"](json['imports'][i]);else if (/\.(\w+)$/.test(filename)) // With extension: Append _importN to the name portion to make it unique
                            this["import"](json['imports'][i], filename.replace(/^(.+)\.(\w+)$/, function ($0, $1, $2) {
                                return $1 + "_import" + i + "." + $2;
                            }));else // Without extension: Append _importN to make it unique
                            this["import"](json['imports'][i], filename + "_import" + i);
                }
                if (resetRoot) // Reset import root override when all imports are done
                    this.importRoot = null;
            }

            // Import structures

            if (json['package']) this.define(json['package']);
            if (json['syntax']) propagateSyntax(json);
            var base = this.ptr;
            if (json['options']) Object.keys(json['options']).forEach(function (key) {
                base.options[key] = json['options'][key];
            });
            if (json['messages']) this.create(json['messages']), this.ptr = base;
            if (json['enums']) this.create(json['enums']), this.ptr = base;
            if (json['services']) this.create(json['services']), this.ptr = base;
            if (json['extends']) this.create(json['extends']);

            return this.reset();
        };

        /**
         * Resolves all namespace objects.
         * @throws {Error} If a type cannot be resolved
         * @returns {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.resolveAll = function () {
            // Resolve all reflected objects
            var res;
            if (this.ptr == null || _typeof(this.ptr.type) === 'object') return this; // Done (already resolved)

            if (this.ptr instanceof Reflect.Namespace) {
                // Resolve children

                this.ptr.children.forEach(function (child) {
                    this.ptr = child;
                    this.resolveAll();
                }, this);
            } else if (this.ptr instanceof Reflect.Message.Field) {
                // Resolve type

                if (!Lang.TYPE.test(this.ptr.type)) {
                    if (!Lang.TYPEREF.test(this.ptr.type)) throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);
                    res = (this.ptr instanceof Reflect.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);
                    if (!res) throw Error("unresolvable type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);
                    this.ptr.resolvedType = res;
                    if (res instanceof Reflect.Enum) {
                        this.ptr.type = ProtoBuf.TYPES["enum"];
                        if (this.ptr.syntax === 'proto3' && res.syntax !== 'proto3') throw Error("proto3 message cannot reference proto2 enum");
                    } else if (res instanceof Reflect.Message) this.ptr.type = res.isGroup ? ProtoBuf.TYPES["group"] : ProtoBuf.TYPES["message"];else throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);
                } else this.ptr.type = ProtoBuf.TYPES[this.ptr.type];

                // If it's a map field, also resolve the key type. The key type can be only a numeric, string, or bool type
                // (i.e., no enums or messages), so we don't need to resolve against the current namespace.
                if (this.ptr.map) {
                    if (!Lang.TYPE.test(this.ptr.keyType)) throw Error("illegal key type for map field in " + this.ptr.toString(true) + ": " + this.ptr.keyType);
                    this.ptr.keyType = ProtoBuf.TYPES[this.ptr.keyType];
                }
            } else if (this.ptr instanceof ProtoBuf.Reflect.Service.Method) {

                if (this.ptr instanceof ProtoBuf.Reflect.Service.RPCMethod) {
                    res = this.ptr.parent.resolve(this.ptr.requestName, true);
                    if (!res || !(res instanceof ProtoBuf.Reflect.Message)) throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.requestName);
                    this.ptr.resolvedRequestType = res;
                    res = this.ptr.parent.resolve(this.ptr.responseName, true);
                    if (!res || !(res instanceof ProtoBuf.Reflect.Message)) throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.responseName);
                    this.ptr.resolvedResponseType = res;
                } else // Should not happen as nothing else is implemented
                    throw Error("illegal service type in " + this.ptr.toString(true));
            } else if (!(this.ptr instanceof ProtoBuf.Reflect.Message.OneOf) && // Not built
            !(this.ptr instanceof ProtoBuf.Reflect.Extension) && // Not built
            !(this.ptr instanceof ProtoBuf.Reflect.Enum.Value) // Built in enum
            ) throw Error("illegal object in namespace: " + _typeof(this.ptr) + ": " + this.ptr);

            return this.reset();
        };

        /**
         * Builds the protocol. This will first try to resolve all definitions and, if this has been successful,
         * return the built package.
         * @param {(string|Array.<string>)=} path Specifies what to return. If omitted, the entire namespace will be returned.
         * @returns {!ProtoBuf.Builder.Message|!Object.<string,*>}
         * @throws {Error} If a type could not be resolved
         * @expose
         */
        BuilderPrototype.build = function (path) {
            this.reset();
            if (!this.resolved) this.resolveAll(), this.resolved = true, this.result = null; // Require re-build
            if (this.result === null) // (Re-)Build
                this.result = this.ns.build();
            if (!path) return this.result;
            var part = typeof path === 'string' ? path.split(".") : path,
                ptr = this.result; // Build namespace pointer (no hasChild etc.)
            for (var i = 0; i < part.length; i++) {
                if (ptr[part[i]]) ptr = ptr[part[i]];else {
                    ptr = null;
                    break;
                }
            }return ptr;
        };

        /**
         * Similar to {@link ProtoBuf.Builder#build}, but looks up the internal reflection descriptor.
         * @param {string=} path Specifies what to return. If omitted, the entire namespace wiil be returned.
         * @param {boolean=} excludeNonNamespace Excludes non-namespace types like fields, defaults to `false`
         * @returns {?ProtoBuf.Reflect.T} Reflection descriptor or `null` if not found
         */
        BuilderPrototype.lookup = function (path, excludeNonNamespace) {
            return path ? this.ns.resolve(path, excludeNonNamespace) : this.ns;
        };

        /**
         * Returns a string representation of this object.
         * @return {string} String representation as of "Builder"
         * @expose
         */
        BuilderPrototype.toString = function () {
            return "Builder";
        };

        // ----- Base classes -----
        // Exist for the sole purpose of being able to "... instanceof ProtoBuf.Builder.Message" etc.

        /**
         * @alias ProtoBuf.Builder.Message
         */
        Builder.Message = function () {};

        /**
         * @alias ProtoBuf.Builder.Enum
         */
        Builder.Enum = function () {};

        /**
         * @alias ProtoBuf.Builder.Message
         */
        Builder.Service = function () {};

        return Builder;
    }(ProtoBuf, ProtoBuf.Lang, ProtoBuf.Reflect);

    /**
     * @alias ProtoBuf.Map
     * @expose
     */
    ProtoBuf.Map = function (ProtoBuf, Reflect) {
        "use strict";

        /**
         * Constructs a new Map. A Map is a container that is used to implement map
         * fields on message objects. It closely follows the ES6 Map API; however,
         * it is distinct because we do not want to depend on external polyfills or
         * on ES6 itself.
         *
         * @exports ProtoBuf.Map
         * @param {!ProtoBuf.Reflect.Field} field Map field
         * @param {Object.<string,*>=} contents Initial contents
         * @constructor
         */

        var Map = function Map(field, contents) {
            if (!field.map) throw Error("field is not a map");

            /**
             * The field corresponding to this map.
             * @type {!ProtoBuf.Reflect.Field}
             */
            this.field = field;

            /**
             * Element instance corresponding to key type.
             * @type {!ProtoBuf.Reflect.Element}
             */
            this.keyElem = new Reflect.Element(field.keyType, null, true, field.syntax);

            /**
             * Element instance corresponding to value type.
             * @type {!ProtoBuf.Reflect.Element}
             */
            this.valueElem = new Reflect.Element(field.type, field.resolvedType, false, field.syntax);

            /**
             * Internal map: stores mapping of (string form of key) -> (key, value)
             * pair.
             *
             * We provide map semantics for arbitrary key types, but we build on top
             * of an Object, which has only string keys. In order to avoid the need
             * to convert a string key back to its native type in many situations,
             * we store the native key value alongside the value. Thus, we only need
             * a one-way mapping from a key type to its string form that guarantees
             * uniqueness and equality (i.e., str(K1) === str(K2) if and only if K1
             * === K2).
             *
             * @type {!Object<string, {key: *, value: *}>}
             */
            this.map = {};

            /**
             * Returns the number of elements in the map.
             */
            Object.defineProperty(this, "size", {
                get: function get() {
                    return Object.keys(this.map).length;
                }
            });

            // Fill initial contents from a raw object.
            if (contents) {
                var keys = Object.keys(contents);
                for (var i = 0; i < keys.length; i++) {
                    var key = this.keyElem.valueFromString(keys[i]);
                    var val = this.valueElem.verifyValue(contents[keys[i]]);
                    this.map[this.keyElem.valueToString(key)] = { key: key, value: val };
                }
            }
        };

        var MapPrototype = Map.prototype;

        /**
         * Helper: return an iterator over an array.
         * @param {!Array<*>} arr the array
         * @returns {!Object} an iterator
         * @inner
         */
        function arrayIterator(arr) {
            var idx = 0;
            return {
                next: function next() {
                    if (idx < arr.length) return { done: false, value: arr[idx++] };
                    return { done: true };
                }
            };
        }

        /**
         * Clears the map.
         */
        MapPrototype.clear = function () {
            this.map = {};
        };

        /**
         * Deletes a particular key from the map.
         * @returns {boolean} Whether any entry with this key was deleted.
         */
        MapPrototype["delete"] = function (key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            var hadKey = keyValue in this.map;
            delete this.map[keyValue];
            return hadKey;
        };

        /**
         * Returns an iterator over [key, value] pairs in the map.
         * @returns {Object} The iterator
         */
        MapPrototype.entries = function () {
            var entries = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0, entry; i < strKeys.length; i++) {
                entries.push([(entry = this.map[strKeys[i]]).key, entry.value]);
            }return arrayIterator(entries);
        };

        /**
         * Returns an iterator over keys in the map.
         * @returns {Object} The iterator
         */
        MapPrototype.keys = function () {
            var keys = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0; i < strKeys.length; i++) {
                keys.push(this.map[strKeys[i]].key);
            }return arrayIterator(keys);
        };

        /**
         * Returns an iterator over values in the map.
         * @returns {!Object} The iterator
         */
        MapPrototype.values = function () {
            var values = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0; i < strKeys.length; i++) {
                values.push(this.map[strKeys[i]].value);
            }return arrayIterator(values);
        };

        /**
         * Iterates over entries in the map, calling a function on each.
         * @param {function(this:*, *, *, *)} cb The callback to invoke with value, key, and map arguments.
         * @param {Object=} thisArg The `this` value for the callback
         */
        MapPrototype.forEach = function (cb, thisArg) {
            var strKeys = Object.keys(this.map);
            for (var i = 0, entry; i < strKeys.length; i++) {
                cb.call(thisArg, (entry = this.map[strKeys[i]]).value, entry.key, this);
            }
        };

        /**
         * Sets a key in the map to the given value.
         * @param {*} key The key
         * @param {*} value The value
         * @returns {!ProtoBuf.Map} The map instance
         */
        MapPrototype.set = function (key, value) {
            var keyValue = this.keyElem.verifyValue(key);
            var valValue = this.valueElem.verifyValue(value);
            this.map[this.keyElem.valueToString(keyValue)] = { key: keyValue, value: valValue };
            return this;
        };

        /**
         * Gets the value corresponding to a key in the map.
         * @param {*} key The key
         * @returns {*|undefined} The value, or `undefined` if key not present
         */
        MapPrototype.get = function (key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            if (!(keyValue in this.map)) return undefined;
            return this.map[keyValue].value;
        };

        /**
         * Determines whether the given key is present in the map.
         * @param {*} key The key
         * @returns {boolean} `true` if the key is present
         */
        MapPrototype.has = function (key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            return keyValue in this.map;
        };

        return Map;
    }(ProtoBuf, ProtoBuf.Reflect);

    /**
     * Loads a .proto string and returns the Builder.
     * @param {string} proto .proto file contents
     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.loadProto = function (proto, builder, filename) {
        if (typeof builder === 'string' || builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string') filename = builder, builder = undefined;
        return ProtoBuf.loadJson(ProtoBuf.DotProto.Parser.parse(proto), builder, filename);
    };

    /**
     * Loads a .proto string and returns the Builder. This is an alias of {@link ProtoBuf.loadProto}.
     * @function
     * @param {string} proto .proto file contents
     * @param {(ProtoBuf.Builder|string)=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.protoFromString = ProtoBuf.loadProto; // Legacy

    /**
     * Loads a .proto file and returns the Builder.
     * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.loadProtoFile = function (filename, callback, builder) {
        if (callback && (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === 'object') builder = callback, callback = null;else if (!callback || typeof callback !== 'function') callback = null;
        if (callback) return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"] + "/" + filename["file"], function (contents) {
            if (contents === null) {
                callback(Error("Failed to fetch file"));
                return;
            }
            try {
                callback(null, ProtoBuf.loadProto(contents, builder, filename));
            } catch (e) {
                callback(e);
            }
        });
        var contents = ProtoBuf.Util.fetch((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object' ? filename["root"] + "/" + filename["file"] : filename);
        return contents === null ? null : ProtoBuf.loadProto(contents, builder, filename);
    };

    /**
     * Loads a .proto file and returns the Builder. This is an alias of {@link ProtoBuf.loadProtoFile}.
     * @function
     * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {!ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.protoFromFile = ProtoBuf.loadProtoFile; // Legacy


    /**
     * Constructs a new empty Builder.
     * @param {Object.<string,*>=} options Builder options, defaults to global options set on ProtoBuf
     * @return {!ProtoBuf.Builder} Builder
     * @expose
     */
    ProtoBuf.newBuilder = function (options) {
        options = options || {};
        if (typeof options['convertFieldsToCamelCase'] === 'undefined') options['convertFieldsToCamelCase'] = ProtoBuf.convertFieldsToCamelCase;
        if (typeof options['populateAccessors'] === 'undefined') options['populateAccessors'] = ProtoBuf.populateAccessors;
        return new ProtoBuf.Builder(options);
    };

    /**
     * Loads a .json definition and returns the Builder.
     * @param {!*|string} json JSON definition
     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.loadJson = function (json, builder, filename) {
        if (typeof builder === 'string' || builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string') filename = builder, builder = null;
        if (!builder || (typeof builder === "undefined" ? "undefined" : _typeof(builder)) !== 'object') builder = ProtoBuf.newBuilder();
        if (typeof json === 'string') json = JSON.parse(json);
        builder["import"](json, filename);
        builder.resolveAll();
        return builder;
    };

    /**
     * Loads a .json file and returns the Builder.
     * @param {string|!{root: string, file: string}} filename Path to json file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.loadJsonFile = function (filename, callback, builder) {
        if (callback && (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === 'object') builder = callback, callback = null;else if (!callback || typeof callback !== 'function') callback = null;
        if (callback) return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"] + "/" + filename["file"], function (contents) {
            if (contents === null) {
                callback(Error("Failed to fetch file"));
                return;
            }
            try {
                callback(null, ProtoBuf.loadJson(JSON.parse(contents), builder, filename));
            } catch (e) {
                callback(e);
            }
        });
        var contents = ProtoBuf.Util.fetch((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object' ? filename["root"] + "/" + filename["file"] : filename);
        return contents === null ? null : ProtoBuf.loadJson(JSON.parse(contents), builder, filename);
    };

    return ProtoBuf;
});

cc._RF.pop();
}).call(this,require('_process'))

},{"_process":2,"bytebuffer":"bytebuffer","fs":undefined,"path":1}]},{},["UIJoinRoom","UILogin","UIMain","UINotice","UIPanel","bytebuffer","long","protobuf","AudioMgr","DataManager","GameManager","GuiManager","NetManager","SceneManager","init"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvQXVkaW9NZ3IuanMiLCJhc3NldHMvU2NyaXB0cy9NYW5hZ2VyL0RhdGFNYW5hZ2VyLmpzIiwiYXNzZXRzL1NjcmlwdHMvTWFuYWdlci9HYW1lTWFuYWdlci5qcyIsImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvR3VpTWFuYWdlci5qcyIsImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvTmV0TWFuYWdlci5qcyIsImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvU2NlbmVNYW5hZ2VyLmpzIiwiYXNzZXRzL1NjcmlwdHMvR3VpL1VJSm9pblJvb20uanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvVUlMb2dpbi5qcyIsImFzc2V0cy9TY3JpcHRzL0d1aS9VSU1haW4uanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvVUlOb3RpY2UuanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvVUlQYW5lbC5qcyIsImFzc2V0cy9TY3JpcHRzL0xpYi9ieXRlYnVmZmVyLmpzIiwiYXNzZXRzL1NjcmlwdHMvaW5pdC5qcyIsImFzc2V0cy9TY3JpcHRzL0xpYi9sb25nLmpzIiwiYXNzZXRzL1NjcmlwdHMvTGliL3Byb3RvYnVmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFiUTs7QUFnQlo7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBbkZJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTs7QUFqQmE7O0FBMkJqQjs7Ozs7Ozs7OztBQzVCQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7O0FBakJhOztBQTJCakI7Ozs7Ozs7Ozs7QUMzQkE7O0FBRUk7QUFDSTtBQUNIOztBQUVGO0FBQ0s7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBQ0g7QUFDSjtBQUNKO0FBQ0w7O0FBRUQ7QUFDQztBQUNBO0FBQ0k7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBSUk7QUFDSDs7QUFFRDtBQUNBO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDs7QUFFRDtBQUNLO0FBQ0E7QUFDSjs7QUFFRDtBQUNDO0FBQ0k7QUFDQTtBQUNJO0FBRUk7QUFDQTtBQUNBO0FBQ0g7QUFOTDtBQU9DO0FBQ0o7O0FBRUY7QUFDSztBQUNBO0FBRUk7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNMOztBQUVEO0FBQ0M7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQTVGYTtBQThGakI7Ozs7Ozs7Ozs7QUM5RkE7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUU7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFDRDtBQUNEOztBQUVEO0FBQ0k7QUFDRDtBQUNHO0FBQ0E7QUFDRjtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNFO0FBQ0E7QUFDRTtBQUNEO0FBQ0Y7O0FBRUQ7QUFDRTtBQUNEOztBQUVEO0FBQ0k7O0FBR0E7QUFDRTtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUlDO0FBQ0Q7QUFDSTtBQUNGO0FBQ0Q7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUVFO0FBQ0E7QUFDRDtBQUNKOztBQUVEO0FBQ0E7QUFDRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUU7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDRTtBQUNBO0FBRUU7QUFDQTtBQUNBO0FBQ0Q7QUFDRDtBQUNEOztBQUVEO0FBQ0E7QUFDRTtBQUVFO0FBQ0E7QUFDRDtBQUNGOztBQUVEO0FBQ0U7QUFDQTtBQUVJO0FBQ0g7QUFDRjtBQTdIWTtBQStIakI7Ozs7Ozs7Ozs7QUNoSUE7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFqQlk7O0FBb0JqQjs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0k7O0FBRUE7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUpTOztBQU9aO0FBQ0k7QUFDQTtBQUVJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFFSTtBQUVJO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0c7QUFDQTtBQUNBO0FBRUs7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUVNO0FBQ0w7QUFHRztBQUNIO0FBR0c7QUFDSDtBQUVGO0FBQ0w7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUEvSEs7Ozs7Ozs7Ozs7QUNEVDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBRlE7O0FBS1o7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDSztBQUNBO0FBQ0Q7QUFDRztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0M7QUFDRDtBQUNKOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFqRkk7Ozs7Ozs7Ozs7QUNEVDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUpROztBQU9aO0FBQ0E7O0FBSUE7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDRztBQUNGOztBQUVEOztBQUlBO0FBQ0k7QUFDSDs7QUFHRDtBQUNBOztBQUVBO0FBcENLOzs7Ozs7Ozs7O0FDRFQ7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFEUTs7QUFJWjtBQUNBOztBQUlBO0FBQ1E7QUFDSDs7QUFFTDtBQUNBOztBQUVBO0FBbkJLOzs7Ozs7Ozs7O0FDRFQ7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFFSTtBQUNIO0FBR0c7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUVJO0FBQ0g7QUFDSjs7QUFFRDs7QUFJQTs7QUFJQTtBQUNJO0FBQ0g7QUFsRGlCO0FBb0R6Qjs7Ozs7Ozs7Ozs7O0FDdkREOzs7Ozs7QUFNQTtBQUFlO0FBQW9KO0FBQUE7QUFBbUI7QUFBa0I7QUFBNkI7QUFBMkQ7QUFBbUI7QUFBYztBQUEwQjtBQUF5QztBQUFDO0FBQWE7QUFBQTtBQUFnQztBQUNqVjtBQUFDO0FBQXNCO0FBQWdCO0FBQUE7QUFBcUM7QUFBdUs7QUFBOEQ7QUFBaUM7QUFBd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMvWjtBQUEwYTtBQUFzQjtBQUN4VztBQUE2RDtBQUE0SztBQUNqUTtBQUFxRTtBQUFrQjtBQUE0QjtBQUFvQjtBQUE0QjtBQUFtRztBQUFyQztBQUN0VTtBQUR3ZTtBQUM1VjtBQUE0QjtBQUFtQztBQUFtQjtBQUFtQjtBQUEwQjtBQUEwSDtBQUFvQztBQUFvQztBQUFxQztBQUN6ZTtBQUFnQztBQUNnSDtBQUE5RDtBQUE2SDtBQUE2QjtBQUFtRTtBQUN4TjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW9FO0FBQXBDO0FBQStMO0FBQWU7QUFBZjtBQUEwRDtBQUFrQztBQUEwQjtBQUFnRDtBQUFBO0FBQUE7QUFBQTtBQUM3YjtBQUFyQjtBQUFnTjtBQUFsQztBQUFrRjtBQUEyQjtBQUFtRTtBQUM3VTtBQUFxRDtBQUFpRDtBQUFtRTtBQUNuTjtBQUFrSDtBQUFnRDtBQUFtRTtBQUFvTjtBQUM5YTtBQUFrRDtBQUFtRTtBQUFvVDtBQUNyYjtBQUFpRDtBQUFtRDtBQUFtRTtBQUFvTjtBQUE0QztBQUFvRDtBQUMzZDtBQUFzQztBQUFrVDtBQUNoUztBQUFtRDtBQUFtRTtBQUFvTjtBQUNwVjtBQUFxRDtBQUFtRTtBQUFvVDtBQUMxZDtBQUEwTDtBQUFzRDtBQUFtRTtBQUNsVDtBQUFtSTtBQUFzRDtBQUFtRTtBQUN0TjtBQUE0VDtBQUFpRDtBQUFtRTtBQUNqUztBQUFxTztBQUFtRDtBQUM5YztBQUFtQjtBQUFvVDtBQUM5TDtBQUFzRDtBQUFtRTtBQUFvTjtBQUM1UjtBQUEwRDtBQUFtRTtBQUNqSDtBQUFxSjtBQUNsQztBQUFrRDtBQUFtRTtBQUM5YTtBQUEwSDtBQUFBO0FBQzFIO0FBQTZDO0FBQW9EO0FBQW1FO0FBQzdIO0FBQXFKO0FBQ2pDO0FBQXNEO0FBQW1FO0FBQW9OO0FBQUE7QUFDN0Y7QUFBeUQ7QUFBbUU7QUFDblA7QUFBMkk7QUFBdUQ7QUFDbmI7QUFBb047QUFBcUU7QUFBd0Q7QUFBbUU7QUFDdmI7QUFBb047QUFBMkk7QUFBd0Q7QUFBbUU7QUFDbFM7QUFBcUU7QUFBbUY7QUFBNEQ7QUFBOEI7QUFBNEI7QUFBOEI7QUFDL2Q7QUFBK0I7QUFBbUU7QUFBa1Q7QUFBQTtBQUN6WjtBQUF3QjtBQUFuQjtBQUF3RztBQUFxQztBQUFpRDtBQUE0QjtBQUFtRTtBQUNqUztBQUFBO0FBQUE7QUFBaUI7QUFBd0g7QUFBc0U7QUFBa0M7QUFBNEc7QUFBNkQ7QUFBK0U7QUFDOVQ7QUFBOEI7QUFBNks7QUFBOEI7QUFDcFQ7QUFBK0I7QUFBbUU7QUFDNUo7QUFBb0g7QUFBQTtBQUFBO0FBQW1OO0FBQThCO0FBQXdDO0FBQWtEO0FBQ25jO0FBQWdEO0FBQXdDO0FBQWtEO0FBQWtEO0FBQWdEO0FBQWdFO0FBQXFDO0FBQWlEO0FBQTRCO0FBQW1FO0FBQzlUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTVJO0FBQWtDO0FBQWdIO0FBQStCO0FBQWdEO0FBQW9DO0FBQW9GO0FBQWhCO0FBQ3ZNO0FBQTZJO0FBQWlCO0FBQThEO0FBQTJCO0FBQW1FO0FBQ2hUO0FBQUE7QUFBQTtBQUE4QztBQUFrSjtBQUEyRTtBQUE4QjtBQUNsYjtBQUF3UjtBQUFBO0FBQ3BIO0FBQWlCO0FBQWlJO0FBQTJCO0FBQW1FO0FBQ2hVO0FBQUE7QUFBQTtBQUFzSjtBQUF5RTtBQUFtRTtBQUNsUztBQUFBO0FBQXVKO0FBQWlCO0FBQStDO0FBQWtFO0FBQXVDO0FBQWtDO0FBQXVDO0FBQzFoQjtBQUF3RTtBQUFtSjtBQUNsTTtBQUFBO0FBQUE7QUFBc0M7QUFBOEI7QUFBNkM7QUFBd0I7QUFBdUI7QUFBK0g7QUFBd0I7QUFBbUI7QUFDeFQ7QUFBeUM7QUFBK0I7QUFBOEo7QUFBNEM7QUFBNEQ7QUFBbUU7QUFDNWI7QUFBb047QUFBQTtBQUFBO0FBQStOO0FBQWlCO0FBQ2haO0FBQTJCO0FBQW1FO0FBQW9OO0FBQUE7QUFBQTtBQUN0VztBQUFZO0FBQTBCO0FBQTRIO0FBQW9OO0FBQzNRO0FBQTBCO0FBQTZCO0FBQXNCO0FBQTZCO0FBQXVCO0FBQThCO0FBQW9CO0FBQWlGO0FBQXFCO0FBQzFRO0FBQXlCO0FBQWtHO0FBQ25OO0FBQW1MO0FBQTBMO0FBQXNCO0FBQWtHO0FBQzlPO0FBQXlEO0FBQStJO0FBQzFkO0FBQ1A7QUFBdUY7QUFBOEI7QUFBdUU7QUFBd0I7QUFBdU07QUFDbEg7QUFBOEI7QUFBVjtBQUEwRDtBQUFtQjtBQUFpRDtBQUFvQjtBQUMvYztBQUFtQjtBQUFvTjtBQUFnQztBQUFxQjtBQUFpSTtBQUFrQjtBQUE0RDtBQUFrQjtBQUNwZDtBQUEyQjtBQUE0SDtBQUFvTjtBQUF5RjtBQUFBO0FBQ3ZUO0FBQXVJO0FBQTJCO0FBQThCO0FBQTBCO0FBQzlYO0FBQXdCO0FBQThCO0FBQW9CO0FBQW9HO0FBQXNCO0FBQW1CO0FBQXVKO0FBQTZCO0FBQXdGO0FBQVk7QUFDamdCO0FBQXdCO0FBQWtHO0FBQXVTO0FBQXVGO0FBQ3hmO0FBQW1CO0FBQW1CO0FBQStGO0FBQTZMO0FBQXVCO0FBQWtHO0FBQzNiO0FBQXNOO0FBQWlEO0FBQXdCO0FBQUE7QUFBa0Q7QUFDalY7QUFBZ0k7QUFBcUw7QUFBdUQ7QUFDOVM7QUFBc0M7QUFBcUM7QUFBcUM7QUFBdUM7QUFBcUM7QUFBZ0M7QUFBMEM7QUFBa0I7QUFDalA7QUFEaVA7QUFDaE47QUFBNEI7QUFBNUI7QUFBOE07QUFBd0I7QUFBYztBQUEyQztBQUE4QjtBQUN2WDtBQUF5RztBQUE2RTtBQUFDO0FBRGtLO0FBQ2pLO0FBQW9CO0FBQUE7QUFBaUY7QUFBVTtBQUE0QjtBQUNsVjtBQUErQjtBQUE4QjtBQUE0QjtBQUE4QztBQUEwRDtBQUFjO0FBQXFCO0FBQW9CO0FBQWtDO0FBQW9CO0FBQWtDO0FBQTBCO0FBQ3ZhO0FBQWlIO0FBQXZCO0FBQXVLO0FBQTRCO0FBQTBGO0FBQW1GO0FBQW1CO0FBQXVCO0FBQ2pjO0FBQW1MO0FBQWtCO0FBQWxCO0FBQTRDO0FBQTROO0FBQzNlO0FBQWtCO0FBQWxCO0FBQXFDO0FBQWE7QUFBNkI7QUFBdUY7QUFBaUM7QUFBTztBQUFZO0FBQVc7QUFBUztBQUFzRDtBQUFPO0FBQVM7QUFBVztBQUFPO0FBQXVDO0FBQU87QUFBUztBQUFXO0FBQU87QUFBOEM7QUFBTztBQUFNO0FBQVc7QUFBSztBQUErQjtBQUFPO0FBQ2hnQjtBQUFXO0FBQU87QUFBNkM7QUFBTztBQUFNO0FBQVc7QUFBSztBQUE4QjtBQUFPO0FBQU07QUFBVztBQUFLO0FBQXFDO0FBQW1CO0FBQVU7QUFBVztBQUFzTTtBQUFPO0FBQ3BiO0FBQTZHO0FBQVM7QUFBdUI7QUFBZ0c7QUFDcE47QUFBNEI7QUFBNUI7QUFBc0g7QUFBMkI7QUFBTztBQUFrSjtBQUE0RDtBQUMvWDtBQUFjO0FBQW1CO0FBQWtCO0FBQXNEO0FBQWtEO0FBQVk7QUFBaUM7QUFBL0I7QUFBbUs7QUFBMEI7QUFBOEI7QUFBa0c7QUFBaUI7QUFBako7QUFDWjtBQUEyQjtBQUE0QztBQUE1QztBQUN6VjtBQUEyQjtBQUFrRDtBQUFZO0FBQWlDO0FBQS9CO0FBQWdHO0FBQWlDO0FBQTRCO0FBQWtCO0FBQUU7QUFBaUM7QUFBMkI7QUFBbUI7QUFBRTtBQUFnQztBQUFvQztBQUEyQjtBQUE4QjtBQUE5QjtBQUNsYjtBQUFrQztBQUFBO0FBQXdDO0FBQW9DO0FBQWM7QUFBVztBQUEwQjtBQUFrRztBQUM5UDtBQUFVO0FBQStCO0FBQStCO0FBQW1CO0FBQVM7QUFBeUU7QUFBVztBQUE0QjtBQUF3RTtBQUE2RjtBQUFjO0FBQXFCO0FBQVU7Ozs7Ozs7Ozs7QUM1RmpkO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFyQkk7Ozs7Ozs7Ozs7OztBQ0FUOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTs7Ozs7QUFLQTs7QUFFSTtBQUVBO0FBRUE7QUFHSDtBQUNHOztBQUVBOzs7Ozs7Ozs7OztBQVVBOztBQUVJOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUhnRDs7QUFNcEQ7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBQ0Q7QUFDQTtBQUVBO0FBQ0g7QUFDRztBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBQ0Q7QUFDQTtBQUVBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7QUFRQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQ0k7QUFFQTtBQUVIO0FBQ0c7QUFFQTtBQUVIO0FBQ0Q7QUFFQTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBOztBQUVBOzs7Ozs7O0FBT0E7QUFDSTtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBVUE7O0FBRUE7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0k7QUFFQTtBQUVBO0FBQ0k7QUFDQTtBQUVIO0FBQ0c7QUFDSDtBQUNEO0FBQ0E7O0FBR0E7QUFDQTtBQUdJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUFBO0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBRUE7QUFFQTtBQUF5QjtBQUNyQjtBQUNJO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNIO0FBRUo7O0FBRUQ7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0k7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUdJO0FBQ0k7QUFESjtBQUdIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNJO0FBQ0o7QUFDQTtBQUNJO0FBREo7QUFJSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFFQTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0k7QUFFQTtBQUVBO0FBQUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQTs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBRUE7QUFFQTtBQUVBOztBQUdBO0FBQ0k7QUFJSDs7QUFHRDtBQUNBOztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7O0FBT0E7QUFDSTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFBQTtBQUtJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUVEO0FBQ0k7QUFFQTtBQUNIO0FBRUQ7QUFDSDtBQUNHO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDSTtBQUNKO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7OztBQUdBO0FBQ0E7QUFDSTtBQUxKO0FBT0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBTUg7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBTUg7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQ0E7QUFHSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBSUo7QUFDSjs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7OztBQUtBO0FBQ0k7QUFFQTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFFQTtBQUNIOztBQUVEO0FBQ0g7Ozs7Ozs7Ozs7Ozs7QUM3c0NEOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7OztBQUtBOztBQUVJO0FBRUE7QUFFQTtBQUdIO0FBQ0c7O0FBRUE7Ozs7Ozs7QUFNQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFNQTs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhLO0FBS1Q7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSE07QUFLVjtBQUNJO0FBQ0E7QUFDQTtBQUhLO0FBS1Q7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSE07QUFLVjtBQUNJO0FBQ0E7QUFDQTtBQUhJO0FBS1I7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSE07QUFLVjtBQUNJO0FBQ0E7QUFDQTtBQUhLO0FBS1Q7QUFDSTtBQUNBO0FBQ0E7QUFITztBQUtYO0FBQ0k7QUFDQTtBQUNBO0FBSFE7QUFLWjtBQUNJO0FBQ0E7QUFDQTtBQUhPO0FBS1g7QUFDSTtBQUNBO0FBQ0E7QUFIUTtBQUtaO0FBQ0k7QUFDQTtBQUNBO0FBSEs7QUFLVDtBQUNJO0FBQ0E7QUFDQTtBQUhJO0FBS1I7QUFDSTtBQUNBO0FBQ0E7QUFITztBQUtYO0FBQ0k7QUFDQTtBQUNBO0FBSEs7QUF2Rkk7O0FBOEZqQjs7Ozs7O0FBTUE7O0FBZ0JBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7QUFJQTtBQUNJOztBQUVBOzs7Ozs7QUFLQTs7QUFFQTs7Ozs7O0FBTUE7O0FBSUE7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNpQjtBQUE0QjtBQUM1QjtBQUEyQztBQUMzQztBQUEyQztBQUMzQztBQUE4QztBQUUvRDtBQUNBO0FBQ0E7QUFDSTtBQUFNO0FBQThCO0FBQ3hCO0FBQVc7QUFDdkI7QUFDSDtBQUNEO0FBRUE7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBRUE7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUlIO0FBQ0o7QUFFTztBQUNIO0FBQ0c7QUFDSDtBQUNSO0FBQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBSUg7QUFDRDtBQUVBO0FBQ0g7QUFDRztBQUNBO0FBRUE7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSDs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBekRZOztBQTREaEI7Ozs7QUFJQTtBQUNJOztBQUVBOzs7Ozs7QUFLQTs7QUFFQTs7Ozs7OztBQU9BOztBQUVJOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBRUE7QUFFQTs7QUFHQTtBQUdBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBRUE7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUE4QztBQUMxQztBQUNJO0FBREo7QUFJQTtBQUNBO0FBQ0g7QUFBNkQ7QUFDMUQ7QUFDSTtBQUVBO0FBRUE7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBRUo7QUFDSjs7QUFFRDs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRVE7QUFESjtBQUdKO0FBRUE7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUVBO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUVIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7O0FBT0E7O0FBRUk7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUlc7QUFVZjtBQUFBO0FBQUE7QUFHQTtBQUNJO0FBQ0k7QUFDSTtBQUNJO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFFQTtBQUNBO0FBQ0k7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0o7QUFDSTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUEvQ1I7QUFpREg7QUFDSjtBQUNHO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOztBQUVBOzs7Ozs7O0FBT0E7QUFDSTtBQUFBO0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQVFBO0FBQ0E7QUFFQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQVlBO0FBQ0g7O0FBRUQ7O0FBRUE7Ozs7O0FBS0E7QUFDSTtBQUFBO0FBQUE7QUFHQTtBQUNJO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUVIOztBQUVEOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ1I7QUFDQTtBQUFjO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUVIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUdJO0FBRUE7QUFDSDtBQUNKOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFBcUI7QUFDakI7QUFDSDtBQUFRO0FBQ0w7QUFDQTtBQUNJO0FBRUE7QUFJSDtBQUNKO0FBQ0o7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhNO0FBS1Y7QUFDQTtBQUNJO0FBTUg7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxTO0FBT2I7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUNEO0FBQ0Q7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNFO0FBQ0E7QUFDRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBSUg7QUFDRDtBQUNIO0FBRUQ7QUFFQTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUFBO0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUk07QUFVVjtBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFFQTtBQUNBO0FBQ0k7QUFhSTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBTEE7QUFNQTtBQUtEO0FBRUE7QUFDSDtBQUVKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0k7QUFESjtBQUdIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMTTtBQU9WO0FBQ0E7O0FBRUk7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUg7O0FBRUc7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVIOztBQUVHO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUg7QUFDSjtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFFQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQUE7QUFFQTtBQUNJO0FBRUE7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBSE07QUFLVjtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFHSTtBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNBO0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQVRSO0FBV0E7QUFDQTtBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBRUE7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNBO0FBQ0k7QUFHSTtBQUVBO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7QUFDQTtBQUNIOztBQUVEOztBQUVBOzs7O0FBSUE7QUFDSTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7QUFFSDs7QUFFRDs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7OztBQUtBOztBQUVBOzs7Ozs7Ozs7QUFTQTs7QUFFSTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7QUFDSTtBQUFBO0FBRUE7QUFDSTtBQUNBO0FBRUE7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNJOztBQUVBOzs7QUFHQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUVBO0FBQ0E7QUFDSTtBQURKO0FBSUg7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFBQTtBQU1IO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0k7QUFESjtBQUlIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUFBO0FBQUE7QUFHQTtBQUFzQjtBQUNsQjtBQUNJO0FBREo7QUFHSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUVBO0FBQ0E7QUFFSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFBQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUVBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOztBQUVJOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTtBQUVIOztBQUVEOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFFQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BOztBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBR0E7QUFFQTtBQUVBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUVBOztBQUVKO0FBQ0E7QUFDQTtBQUNJO0FBRUE7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFBaUM7QUFDN0I7QUFFUTtBQUNIO0FBQ0c7QUFDSDtBQUdSOztBQUVEO0FBQ0E7QUFDQTtBQUFnQztBQUM1QjtBQUVRO0FBQ0g7QUFDRztBQUNIO0FBR1I7O0FBRUQ7QUFDQTtBQUNJO0FBRUE7O0FBRUo7QUFDQTtBQUNBO0FBQ0k7QUFFQTs7QUFFSjtBQUNBO0FBQ0k7QUFFQTs7QUFFSjtBQUNBO0FBQ0k7QUFFQTs7QUFFSjtBQUNBO0FBQTZCO0FBQ3pCO0FBQ0E7QUFDSTtBQURKO0FBT0k7QUFDQTtBQUVBO0FBRUE7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQWdDO0FBQzVCO0FBRUE7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBREo7QUFJSDtBQUNEO0FBQ0E7QUFDSDtBQTNHTDs7QUE4R0E7QUFDQTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBRUE7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFyQ1I7QUF1Q0E7QUFDQTtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSUE7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7O0FBRUo7QUFDQTtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFJQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUo7QUFDSTtBQUNBO0FBMUdSO0FBNEdBO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7O0FBR0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFBOEI7QUFDMUI7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUFnQztBQUM1QjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBaEZSOztBQW1GQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNNO0FBQ0E7O0FBRU47QUFDTTs7QUFFTjtBQUNNOztBQUVOO0FBQ007QUF2QlY7QUF5Qkg7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztBQWVBO0FBQ0k7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNJOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7O0FBUUE7QUFDSTs7QUFHQTtBQUNBOztBQUVJO0FBQUE7O0FBR0E7Ozs7Ozs7OztBQVNBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBREo7QUFHQTtBQUNJO0FBQ0E7QUFHQTtBQUdIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0k7QUFESjtBQUdQO0FBQ0o7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNJO0FBQ0E7QUFDSTtBQUVBO0FBRUE7QUFFQTtBQUNIO0FBQ0Q7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQURKO0FBSUg7QUFDRDtBQUNBO0FBQ0k7QUFFQTtBQUVBO0FBQ0g7QUFFRDtBQUE0QjtBQUN4QjtBQUNBO0FBQ0k7QUFFQTtBQUNIO0FBRUo7QUFDRDtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBVUE7O0FBRUE7Ozs7Ozs7Ozs7QUFVQTtBQUNJO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7O0FBR0E7QUFFUTtBQUNBO0FBQ0k7QUFDSDtBQUNEOztBQUVBO0FBQ0E7QUFDSTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFSjtBQUNJOzs7Ozs7Ozs7OztBQVdBOztBQUVKO0FBQ0k7Ozs7Ozs7O0FBUUE7O0FBRUo7QUFDSTs7Ozs7Ozs7QUFRQTtBQUVQO0FBQ1I7O0FBRUQ7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7QUFDSTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQTtBQUNJO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7OztBQVNBOztBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0k7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7QUFTQTs7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBU0E7O0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7OztBQVNBOztBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBREo7QUFHSDtBQUNEO0FBQ0E7QUFBQTtBQUVBO0FBQ0k7QUFDSTtBQUlIO0FBTkw7QUFRSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBRVM7QUFDQTtBQUlaOztBQUVEOzs7Ozs7Ozs7Ozs7OztBQWNBO0FBQ0k7QUFHQTtBQUlBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7OztBQVdBO0FBQ0k7QUFJQTtBQUVBO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7OztBQVVBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQVVBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQVVBO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTs7Ozs7OztBQU9BO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7O0FBTUE7QUFFSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBRUE7QUFDSDtBQU1HO0FBQ1A7O0FBRUQ7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUFBO0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUVIO0FBRUo7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFJSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUFBO0FBQ0k7QUFESjtBQUdBO0FBQ0k7QUFDSTtBQUFHO0FBQUg7QUFFQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUlKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUF4QlI7QUEwQkE7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFsQlI7QUFvQkE7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFBbUI7QUFDZjtBQUNBO0FBRUE7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUFnQztBQUM1QjtBQUNIO0FBQ0c7QUFDQTtBQUNBO0FBQ0g7QUFFSjtBQUNKO0FBQ0Q7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTtBQUNBO0FBRUg7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBQ0E7O0FBR0E7QUFDQTtBQUNBOztBQUdBO0FBSEE7QUFNSDs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUFzQjtBQUNsQjtBQUVBO0FBRUE7QUFDSDtBQUNEO0FBQ0E7QUFBc0M7QUFDbEM7QUFFQTtBQUNBO0FBQ0k7QUFESjtBQUdIO0FBQ0Q7QUFBaUM7QUFDN0I7QUFDSTtBQUNBO0FBQ0k7QUFFSDtBQUNEO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDRDtBQUNBOztBQUdBO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBRUE7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUo7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDSTs7QUFFSjtBQUNJOztBQUVKO0FBQ0k7O0FBRUo7QUFDSTtBQUNKO0FBQ0k7QUFsQ1I7QUFvQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFFQTtBQUVBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFESjtBQUVBO0FBRUE7QUFBcUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRztBQUNBO0FBQ0E7QUFDSTtBQURKO0FBR0g7QUFDSjtBQUNHO0FBQ0E7QUFDSTtBQUNBOztBQU1BO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNHO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFESjtBQUdBO0FBQ0g7QUFDRztBQUNJO0FBREo7QUFHSDtBQUNKO0FBQ0c7QUFDQTtBQUNJO0FBQ0E7O0FBTUE7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNHO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBVUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFLQTs7QUFHQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBREo7QUFHSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUVEO0FBQ0g7O0FBRUQ7QUFDQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQTtBQUNJOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNJOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNJOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNBO0FBQ0k7QUFESjtBQUlIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUFBO0FBRUE7QUFDSTtBQURKO0FBSVE7QUFDQTtBQUZtQztBQUkzQztBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7QUFVQTtBQUNJOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDSTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7OztBQVVBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7O0FBSUE7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7OztBQVFBO0FBQ0k7O0FBR0E7QUFDQTs7QUFFSTs7Ozs7Ozs7QUFRQTtBQUNJOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7O0FBVUE7QUFDQTtBQUNJOztBQUVJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFFSDtBQUNEO0FBRUE7QUFFQTtBQUFxRDtBQUNqRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFFQTtBQUFNO0FBQXNEO0FBQzVEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0c7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBR0g7QUFDSjs7QUFFRDs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7O0FBTUE7QUFFSDtBQUNKOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7QUFVQTtBQUNJOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBY0E7QUFDSTs7QUFFQTs7O0FBR0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBOzs7O0FBSUE7O0FBRUE7QUFFSDs7QUFFRDs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7Ozs7O0FBT0E7O0FBRUk7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUVBO0FBQ0g7O0FBRUQ7O0FBRUE7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUNJO0FBQ0E7QUFDSTtBQUNKO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUVBO0FBR0k7QUFFQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7O0FBRUo7QUFDSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUVRO0FBQ0g7O0FBRUw7QUFDQTtBQUVRO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0g7O0FBRUw7QUFDQTtBQUNBO0FBRVE7QUFDSDtBQUNMO0FBRVE7QUFDSDtBQUNMO0FBRVE7QUFDSDs7QUFFTDtBQUNBO0FBQ0k7QUFDSTtBQUdQOztBQUVEO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFFSDs7QUFFRztBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBRUg7O0FBRUc7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBRUg7O0FBRUc7QUFDQTtBQUNJO0FBQ0k7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBRUg7QUFDRDtBQUVIO0FBQ0Q7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFSjtBQUNHO0FBRVA7O0FBR0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJOztBQUVBOztBQUVBOztBQUVJO0FBRUE7QUFFQTtBQUVIO0FBQTBDOztBQUV2QztBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQUE7O0FBR0E7QUFBb0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBR0g7O0FBRUc7QUFDSTtBQUNHO0FBQ0g7QUFBa0M7QUFDOUI7QUFDQTtBQUVIO0FBQXlDO0FBQ3RDO0FBQ0E7QUFDSDtBQUVKO0FBRUo7O0FBR0Q7QUFDSTtBQUE4QztBQUMxQztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDSTtBQUNKO0FBQ0E7QUFFQTtBQUNJO0FBREo7QUFJSDtBQUNHO0FBR0k7QUFBNEY7QUFBK0I7QUFFM0g7QUFDWDtBQUNEO0FBQ0k7QUFDUDs7QUFFRDs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVRO0FBQ0g7QUFDTDtBQUdBO0FBR0E7QUFHQTs7QUFHQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTs7QUFHQTtBQUE2Qzs7QUFFekM7QUFDSTtBQUNBO0FBQ0g7QUFFSjtBQUF1RDs7QUFFcEQ7QUFDSTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBS0o7O0FBR0Q7QUFDQTtBQUNBO0FBQ0k7QUFFQTtBQUNIO0FBRUo7O0FBRUc7QUFDSTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDSDtBQUNHO0FBRVA7QUFFRztBQUNBO0FBSEc7O0FBT1A7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFJQTtBQUNJO0FBQ0o7QUFFQTtBQUFBO0FBRUE7QUFDSTtBQUdJO0FBQ0E7QUFDSDtBQU5MO0FBUUg7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTs7O0FBR0E7O0FBRUE7OztBQUdBOztBQUVBOzs7QUFHQTs7QUFFQTtBQUVIOztBQUVEOzs7O0FBSUE7QUFDSTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBV0E7QUFDSTs7QUFHQTs7OztBQUlBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFjQTs7QUFFQTs7O0FBR0E7QUFDSTtBQUFrQjtBQUFzQztBQUR4Qjs7QUFJcEM7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSDtBQUNKO0FBQ0o7O0FBRUQ7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFFQTtBQUNIO0FBTEU7QUFPVjs7QUFFRDs7O0FBR0E7QUFDSTtBQUNIOztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQURKO0FBR0g7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBREo7QUFHSDs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFESjtBQUdIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNJO0FBREo7QUFFSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0E7QUFFQTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSDs7QUFHRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUdBO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUE7QUFDSTtBQUtBO0FBRVE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDTDtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFhQTs7O0FBR0E7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUVBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUdBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7O0FBWUE7QUFDSTtBQUtBO0FBRVE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDTDtBQUNBO0FBQ0g7O0FBRUQ7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBiZ21Wb2x1bWU6MS4wLFxyXG4gICAgICAgIHNmeFZvbHVtZToxLjAsXHJcbiAgICAgICAgYmdtQXVkaW9JRDotMSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYm1Wb2x1bWVcIik7XHJcbiAgICAgICAgaWYodCAhPSBudWxsKXtcclxuICAgICAgICAgICAgdGhpcy5iZ21Wb2x1bWUgPSBwYXJzZUZsb2F0KHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZnhWb2x1bWVcIik7XHJcbiAgICAgICAgaWYodCAhPSBudWxsKXtcclxuICAgICAgICAgICAgdGhpcy5zZnhWb2x1bWUgPSBwYXJzZUZsb2F0KHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2MuZ2FtZS5vbihjYy5nYW1lLkVWRU5UX0hJREUsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2MuYXVkaW9FbmdpbmUucGF1c2VBbGxcIik7XHJcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBhdXNlQWxsKCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY2MuZ2FtZS5vbihjYy5nYW1lLkVWRU5UX1NIT1csIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2MuYXVkaW9FbmdpbmUucmVzdW1lQWxsXCIpO1xyXG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5yZXN1bWVBbGwoKTtcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRVcmwgOiBmdW5jdGlvbih1cmwpe1xyXG4gICAgICAgIHJldHVybiBjYy51cmwucmF3KFwicmVsL1NvdW5kL1wiICsgdXJsKTtcclxuICAgIH0sXHJcblxyXG4gICAgcGxheUJHTSA6IGZ1bmN0aW9uKHVybCl7XHJcbiAgICAgICAgdmFyIGF1aWRvVXJsID0gdGhpcy5nZXRVcmwodXJsKTtcclxuICAgICAgICBpZih0aGlzLmJnbUF1ZGlvSUQgPj0gMCl7XHJcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3AodGhpcy5iZ21BdWRpb0lEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5iZ21BdWRpb0lEID0gY2MuYXVkaW9FbmdpbmUucGxheShhdWRpb1VybCwgdHJ1ZSwgdGhpcy5iZ21Wb2x1bWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBwbGF5U0ZYIDogZnVuY3Rpb24odXJsKXtcclxuICAgICAgICB2YXIgYXVkaW9VcmwgPSB0aGlzLmdldFVybCh1cmwpO1xyXG4gICAgICAgIGlmKHRoaXMuc2Z4Vm9sdW1lID4gMCl7XHJcbiAgICAgICAgICAgIHZhciBhdWRpb0lkID0gY2MuYXVkaW9FbmdpbmUucGxheShhdWRpb1VybCwgZmFsc2UsIHRoaXMuc2Z4Vm9sdW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEJHTVZvbHVtZSA6IGZ1bmN0aW9uKHYsIGZvcmNlKXtcclxuICAgICAgICBpZih0aGlzLmJnbUF1ZGlvSUQgPj0gMCl7XHJcbiAgICAgICAgICAgIGlmKCB2ID4gMCl7XHJcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5yZXN1bWUodGhpcy5iZ21BdWRpb0lEKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2UodGhpcy5iZ21BdWRpb0lEKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmJnbVZvbHVtZSAhPSB2IHx8IGZvcmNlKXtcclxuICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYmdtVm9sdW1lXCIsIHYpO1xyXG4gICAgICAgICAgICB0aGlzLmJnbVZvbHVtZSA9IHY7XHJcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnNldFZvbHVtZSh0aGlzLmJnbUF1ZGlvSUQsIHYpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGF1c2VBbGwgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBhdXNlQWxsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc3VtZUFsbCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucmVzdW1lQWxsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCIvL+aVsOaNrueuoeeQhuWZqO+8jOWtmOWCqOWFqOWxgOaVsOaNrlxyXG52YXIgTSA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG5cclxuY2MuZGF0YW1hbmFnZXIgPSBuZXcgTSgpXHJcbiIsIi8v5ri45oiP566h55CG5Zmo77yM6L+b5YWl5oi/6Ze05ZCO55qE5pWw5o2u5ZKM6YC76L6R566h55CGXHJcbnZhciBNID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcblxyXG5jYy5nYW1lbWFuYWdlciA9IG5ldyBNKClcclxuIiwiXHJcbnZhciBNID0gY2MuQ2xhc3Moe1xyXG5cclxuICAgIGN0b3IgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMucGFuZWxzID0ge31cclxuICAgIH0sXHJcbiAgICBcclxuICAgZGlzcGFjaE1zZzpmdW5jdGlvbihuYW1lLG1zZ2RhdGEpe1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnBhbmVscyl7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5wYW5lbHNba2V5XVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8bGlzdC5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBsaXN0W2ldXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBbbmFtZV0gPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwW25hbWVdKG1zZ2RhdGEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICBvcGVuOmZ1bmN0aW9uKG5hbWUsYnZpc2libGUsY2FsbCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgIGNjLmxvYWRlci5sb2FkUmVzKCdHdWkvJyArIG5hbWUsZnVuY3Rpb24oZXJyLHByZWZhYikge1xyXG4gICAgICAgIGlmIChwcmVmYWIgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpXHJcbiAgICAgICAgICAgIG9iai5wYXJlbnQgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpXHJcbiAgICAgICAgICAgIHZhciBwYW5lbCA9IG9iai5nZXRDb21wb25lbnQoY2MudWlwYW5lbCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxsICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjYWxsKHBhbmVsKVxyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IHNlbGYucGFuZWxzW25hbWVdXHJcbiAgICAgICAgICAgIGlmIChsaXN0ID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBbXVxyXG4gICAgICAgICAgICAgICAgc2VsZi5wYW5lbHNbbmFtZV0gPSBsaXN0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFuZWwub25DcmVhdGUoKVxyXG4gICAgICAgICAgICBpZiAoYnZpc2libGUgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcGFuZWwuc2V0VmlzaWJsZSh0cnVlKVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBhbmVsLnNldFZpc2libGUoYnZpc2libGUpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxpc3QucHVzaChwYW5lbClcclxuICAgICAgICAgICAgcmV0dXJuIHBhbmVsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNjLmxvZygnb3BlbiBwYW5lbCBmYWlsOicgKyBuYW1lKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgIH0sXHJcblxyXG4gICBkZXN0cm95UGFuZWw6ZnVuY3Rpb24ocGFuZWwpe1xyXG4gICAgICAgIHBhbmVsLm9uQ2xvc2UoKVxyXG4gICAgICAgIHBhbmVsLm5vZGUuZGVzdHJveSgpXHJcbiAgIH0sXHJcblxyXG4gICBjbG9zZTpmdW5jdGlvbihwYW5lbCl7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wYW5lbHMpe1xyXG4gICAgICAgIHZhciBsaXN0ID0gdGhpcy5wYW5lbHNba2V5XVxyXG4gICAgICAgIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aCAtIDE7aSA+PSAwOyAtLWkpXHJcbiAgICAgICAgICAgIGlmIChsaXN0W2ldID09IHBhbmVsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3lQYW5lbChwYW5lbClcclxuICAgICAgICAgICAgICAgIGxpc3Quc2xpY2UoaSwxKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgY2xvc2VCeU5hbWU6ZnVuY3Rpb24ocGFuZWxOYW1lKXtcclxuICAgICAgICB2YXIgbGlzdCA9IHRoaXMucGFuZWxzW3BhbmVsTmFtZV1cclxuICAgICAgICBpZiAobGlzdCAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGxpc3QubGVuZ2h0OyArK2kpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveVBhbmVsKGxpc3RbaV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wYW5lbHNbcGFuZWxOYW1lXSA9IG51bGxcclxuICAgICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICBjbG9zZUFsbDpmdW5jdGlvbigpe1xyXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMucGFuZWxzKXtcclxuICAgICAgICB2YXIgbGlzdCA9IHRoaXMucGFuZWxzW2tleV1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgbGlzdC5sZW5naHQ7ICsraSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveVBhbmVsKGxpc3RbaV0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5wYW5lbHMgPSB7fVxyXG4gICB9XHJcbn0pO1xyXG5jYy5ndWltYW5hZ2VyID0gbmV3IE0oKTtcclxuXHJcblxyXG4iLCJcclxudmFyIE0gPSBjYy5DbGFzcyh7XHJcbiAgICBjdG9yOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmVxdWlyZSgnbG9uZycpXHJcbiAgICAgICAgcmVxdWlyZSgnYnl0ZWJ1ZmZlcicpXHJcbiAgICAgICAgdGhpcy5Qcm90b0J1ZiA9IHJlcXVpcmUoJ3Byb3RvYnVmJylcclxuICAgICAgICB0aGlzLmhhbmRsZXIgPSBbXVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgaW5pdDpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgdGhpcy5tZXNzYWdlcyA9IHt9O1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHRoaXMubG9hZFByb3RvKCdQcm90by9jbGllbnQnLGZ1bmN0aW9uKGJ1aWxkZXIpe1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLkNfTG9naW4nKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0xvZ2luUmV0Jyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uQ19HMTNfSmlvbkdhbWUnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5DX0cxM19DcmVhdGVHYW1lJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uQ19HMTNfSmlvbkdhbWUnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0cxM19Sb29tQXR0cicpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLkNfRzEzX0dpdmVVcCcpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLlNfRzEzX0Fib3J0R2FtZU9yTm90Jyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uU19HMTNfVm90ZUZvQWJvcnRHYW1lJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uU19HMTNfUXVpdGVkJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uQ19HMTNfUmVhZHlTd2l0Y2gnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0cxM19QbGF5ZXJzSW5Sb29tJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uU19HMTNfSGFuZCcpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLkNfRzEzX0JyaW5nT3V0Jyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uU19HMTNfQWxsSGFuZHMnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMubG9hZFByb3RvSUQoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGxvYWRQcm90bzpmdW5jdGlvbihwYXRoLGNhbGwpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICAgY2MubG9hZGVyLmxvYWRSZXMocGF0aCxmdW5jdGlvbihlcnIscHJvdG8pe1xyXG4gICAgICAgICAgdmFyIGJ1aWxkZXIgPSBzZWxmLlByb3RvQnVmLnByb3RvRnJvbVN0cmluZyhwcm90byk7XHJcbiAgICAgICAgICBjYWxsKGJ1aWxkZXIpXHJcbiAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGRNZXNzYWdlOmZ1bmN0aW9uKGJ1aWxkZXIsbmFtZSl7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlc1tuYW1lXSA9IGJ1aWxkZXIuYnVpbGQobmFtZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvYWRQcm90b0lEOmZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICBjYy5sb2FkZXIubG9hZFJlcygnUHJvdG8vcHJvdG9pZCcsZnVuY3Rpb24oZXJyLHByb3RvaWQpe1xyXG4gICAgICAgIHNlbGYuaWRfbmFtZV9tYXAgPSBKU09OLnBhcnNlKHByb3RvaWQpXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpZF9uYW1lX2NvbnZlcnQ6ZnVuY3Rpb24oaWRfb3JfbmFtZSl7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3RvX2lkX25hbWVfbWFwW2lkX29yX25hbWVdXHJcbiAgICB9LFxyXG5cclxuICAgIGNvbm5lY3Q6ZnVuY3Rpb24oaXAscG9ydCxmdW5jKXtcclxuICAgICAgICBpZiAodGhpcy5qYnNvY2tldCA9PSBudWxsKVxyXG4gICAgICAgICAgdGhpcy5qYnNvY2tldCA9IG5ldyBKQlNvY2tldCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuamJzb2NrZXQub25vcGVuID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGZ1bmModHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5qYnNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgaWYgKGRhdGEuZXJyb3JpZCA9PSBKQlNvY2tldC5Db25uZWN0RXJyb3IpXHJcbiAgICAgICAgICAgIGZ1bmMoZmFsc2UpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5qYnNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgY2MubG9nKCdkYXRhLm1zZ2lkOicgKyBkYXRhLm1zZ2lkKVxyXG4gICAgICAgICAgc2VsZi5kaXNwYWNoTXNnKGRhdGEubXNnaWQsZGF0YS5tc2cpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuamJzb2NrZXQuY29ubmVjdChpcCxwb3J0KTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/lhbPpl63nvZHnu5xcclxuICAgIGNsb3NlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuamJzb2NrZXQgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aGlzLmpic29ja2V0LmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmpic29ja2V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5YiG5Y+R5raI5oGvXHJcbiAgICBkaXNwYWNoTXNnOmZ1bmN0aW9uKG1zZ2lkLG1zZykge1xyXG4gICAgICB2YXIgbXNnbmFtZSA9IHRoaXMuaWRfbmFtZV9tYXBbU3RyaW5nKG1zZ2lkKV1cclxuICAgICAgdmFyIG1zZ2RhdGEgPSB0aGlzLm1lc3NhZ2VzW21zZ25hbWVdLmRlY29kZShtc2cpXHJcbiAgICAgIHZhciBtc2doYW5kbGVybmFtZSA9IG1zZ25hbWUucmVwbGFjZSgnLicsJ18nKVxyXG4gICAgICBjYy5sb2coJ3JlY3Y6JyArIG1zZ25hbWUpXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oYW5kbGVyLmxlbmd0aDsrK2kpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXJbaV0uZGlzcGFjaE1zZyhtc2doYW5kbGVybmFtZSxtc2dkYXRhKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v55Sz6K+35LiA5LiqIG1zZ1xyXG4gICAgbXNnOmZ1bmN0aW9uKG1zZ25hbWUpe1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWVzc2FnZXNbbXNnbmFtZV07XHJcbiAgICAgIGlmIChtZXNzYWdlKVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBtZXNzYWdlKCk7XHJcbiAgICAgICAgcmV0Ll9fbXNnaWQgPSB0aGlzLmlkX25hbWVfbWFwW21zZ25hbWVdXHJcbiAgICAgICAgcmV0dXJuIHJldFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5Y+R6YCBbXNnXHJcbiAgICBzZW5kOmZ1bmN0aW9uKG1zZyl7XHJcbiAgICAgIGlmICh0aGlzLmpic29ja2V0ICE9IG51bGwpXHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgaWQgPSBtc2cuX19tc2dpZFxyXG4gICAgICAgIHRoaXMuamJzb2NrZXQuc2VuZChpZCxTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50OEFycmF5KG1zZy50b0J1ZmZlcigpKSkpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcmVnaXN0ZXJIYW5kbGVyOmZ1bmN0aW9uKGhhbmRsZXIpe1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgICAgaWYgKGhhbmRsZXIgIT0gbnVsbCAmJiB0eXBlb2YgaGFuZGxlci5kaXNwYWNoTXNnID09ICdmdW5jdGlvbicpXHJcbiAgICAgIHtcclxuICAgICAgICAgIHNlbGYuaGFuZGxlci5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5jYy5uZXRtYW5hZ2VyID0gbmV3IE0oKTtcclxuXHJcblxyXG4iLCJ2YXIgTSA9IGNjLkNsYXNzKHtcclxuICAgIGxvYWRTY2VuZTpmdW5jdGlvbihuYW1lLGNhbGwpe1xyXG4gICAgICAgIGNjLmxvZygndGVzdCcpXHJcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKG5hbWUsY2FsbCk7XHJcbiAgICAgICAgY2MuZ3VpbWFuYWdlci5jbG9zZUFsbCgpXHJcbiAgICB9LFxyXG4gICAgbG9hZE1haW5TY2VuZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubG9hZFNjZW5lKCdNYWluJyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjYy5ndWltYW5hZ2VyLm9wZW4oJ1VJTWFpbicpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGxvYWRMb2dpblNjZW5lOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2MubG9nKCdsb2FkbG9naW4nKVxyXG4gICAgICAgIHRoaXMubG9hZFNjZW5lKCdMb2dpbicsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY2MuZ3VpbWFuYWdlci5vcGVuKCdVSUxvZ2luJylcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59KTtcclxuXHJcbmNjLnNjZW5lbWFuYWdlciA9IG5ldyBNKCkiLCJyZXF1aXJlKCdVSVBhbmVsJylcclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MudWlwYW5lbCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICBidG5DbG9zZTpjYy5CdXR0b24sXHJcbiAgICAgICBidG5Db21maXJlOmNjLkJ1dHRvbixcclxuICAgICAgIHNwQ3Vyc29yOmNjLk5vZGUsXHJcbiAgICAgICBjdXJJbmRleDowXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB1cGRhdGVDdXJzb3I6ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJJbmRleCA8IDApIHRoaXMuY3VySW5kZXggPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmN1ckluZGV4IDwgNilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByb29tID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdyb29taWQnKTtcclxuICAgICAgICAgICAgdGhpcy5zcEN1cnNvci5wYXJlbnQgPSByb29tLmNoaWxkcmVuW3RoaXMuY3VySW5kZXhdO1xyXG4gICAgICAgICAgICB0aGlzLnNwQ3Vyc29yLnBvc2l0aW9uID0gY2MucCgwLDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmJ0bkNsb3NlLmludGVyYWN0YWJsZSA9IHRoaXMuaXNmdWxsKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBnZXRWYWx1ZTpmdW5jdGlvbihub2RlKXtcclxuICAgICAgICByZXR1cm4gbm9kZS5nZXRDaGlsZEJ5TmFtZSgnbnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmdcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGdldFJvb21JRDpmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJvb20gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ3Jvb21pZCcpO1xyXG4gICAgICAgIHZhciBjcyA9IHJvb20uY2hpbGRyZW47XHJcbiAgICAgICAgdmFyIGlkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9vbS5jaGlsZHJlbkNvdW50OyArK2kpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZHNbaV0gPSB0aGlzLmdldFZhbHVlKGNzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlkcy5qb2luKFwiXCIpKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNldFZhbHVlOmZ1bmN0aW9uKG5vZGUsc3RyKXtcclxuICAgICAgICBub2RlLmdldENoaWxkQnlOYW1lKCdudW0nKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHN0cjtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNldEN1ckluZGV4VmFsdWU6ZnVuY3Rpb24oc3RyKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghdGhpcy5pc2Z1bGwoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByb29tID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdyb29taWQnKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShyb29tLmNoaWxkcmVuW3RoaXMuY3VySW5kZXhdLHN0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgaXNmdWxsOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VySW5kZXggPT0gNjtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHJlc2V0VmFsdWUgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcm9vbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgncm9vbWlkJyk7XHJcbiAgICAgICAgdmFyIGNzID0gcm9vbS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VySW5kZXg7ICsraSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoY3NbaV0sXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VySW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ3Vyc29yKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBkZWxldGVWYWx1ZSA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1ckluZGV4ID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAtLXRoaXMuY3VySW5kZXg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1ckluZGV4IDwgMCkgdGhpcy5jdXJJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q3VySW5kZXhWYWx1ZShcIlwiKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJzb3IoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBpbnB1dFZhbHVlIDogZnVuY3Rpb24obnVtKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzZnVsbCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRDdXJJbmRleFZhbHVlKG51bSk7XHJcbiAgICAgICAgICAgICsrdGhpcy5jdXJJbmRleDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJzb3IoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgdmFyIGtleWJvYXJkID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdrZXlib2FyZCcpO1xyXG4gICAgICAgdmFyIGNzID0ga2V5Ym9hcmQuY2hpbGRyZW47XHJcbiAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleWJvYXJkLmNoaWxkcmVuQ291bnQ7KytpKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgICB2YXIgYnRuID0gY3NbaV0uZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbik7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgYnRuLm5vZGUub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgaWYgKG5vZGUubmFtZSA9PSBcImJ0bl9yZXNldFwiKVxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlc2V0VmFsdWUoKTsgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUubmFtZSA9PSBcImJ0bl9kZWxldGVcIilcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlVmFsdWUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dFZhbHVlKG5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ251bScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgICB0aGlzLmJ0bkNsb3NlLmludGVyYWN0YWJsZSA9IHRoaXMuaXNmdWxsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uQ2xpY2tfYnRuQ2xvc2U6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbmNsaWNrX2J0bkNvbWZpcmU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIG1zZyA9IGNjLm5ldG1hbmFnZXIubXNnKCdQdWJsaWNQcm90by5DX0cxM19KaW9uR2FtZScpXHJcbiAgICAgICAgbXNnLnJvb21fY29kZSA9IHRoaXMuZ2V0Um9vbUlEKClcclxuICAgICAgICBjYy5uZXRtYW5hZ2VyLnNlbmQobXNnKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXF1aXJlIGpvaW4gcm9vbTonICsgbXNnLnJvb21fY29kZSk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpXHJcbiAgICB9XHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwicmVxdWlyZSgnVUlQYW5lbCcpXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLnVpcGFuZWwsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGJ0bldYTG9naW46Y2MuQnV0dG9uLFxyXG4gICAgICAgIGJ0bkd1ZXN0TG9naW46Y2MuQnV0dG9uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdE1ncigpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9pbml0IG1hbmFnZXJzXHJcbiAgICBpbml0TWdyIDogZnVuY3Rpb24oKXtcclxuICAgICAgICBjYy5tZ3IgPSB7fTtcclxuXHJcbiAgICAgICAgLy9pbml0IGF1ZGlvIG1hbmFnZXJcclxuICAgICAgICB2YXIgQXVkaW9NZ3IgPSByZXF1aXJlKFwiQXVkaW9NZ3JcIik7XHJcbiAgICAgICAgY2MubWdyLkF1ZGlvTWdyID0gbmV3IEF1ZGlvTWdyKCk7XHJcbiAgICAgICAgY2MubWdyLkF1ZGlvTWdyLmluaXQoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGxvY2tVSTpmdW5jdGlvbihiTG9jayl7XHJcbiAgICAgICAgdmFyIGludGVyYWN0YWJsZSA9ICFiTG9ja1xyXG4gICAgICAgIHRoaXMuYnRuV1hMb2dpbi5pbnRlcmFjdGFibGUgPSBpbnRlcmFjdGFibGVcclxuICAgICAgICB0aGlzLmJ0bkd1ZXN0TG9naW4uaW50ZXJhY3RhYmxlID0gaW50ZXJhY3RhYmxlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UTzrovazoj4roirEgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBsb2dpbjpmdW5jdGlvbih0eXBlKXtcclxuICAgICAgICAgdGhpcy5sb2NrVUkodHJ1ZSlcclxuICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNjLm5ldG1hbmFnZXIuY29ubmVjdCgnMTAuMTczLjMyLjUyJyw3MDAwLGZ1bmN0aW9uKG9rKXtcclxuICAgICAgICAgICBpZiAob2spXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICBjYy5sb2coJ2Nvbm5lY3RlZCEnKTtcclxuICAgICAgICAgICAgICAgdmFyIG1zZyA9IGNjLm5ldG1hbmFnZXIubXNnKCdQdWJsaWNQcm90by5DX0xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgIG1zZy5sb2dpbl90eXBlID0gdHlwZVxyXG4gICAgICAgICAgICAgICBtc2cub3BlbmlkID0gJzEnXHJcbiAgICAgICAgICAgICAgIG1zZy50b2tlbiA9ICd4eHh4eCdcclxuICAgICAgICAgICAgICAgbXNnLm5pY2tfbmFtZSA9ICdydWFuYmFuJ1xyXG4gICAgICAgICAgICAgICBjYy5uZXRtYW5hZ2VyLnNlbmQobXNnKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgc2VsZi5sb2NrVUkoZmFsc2UpXHJcbiAgICAgICAgICAgICAgIGNjLmxvZygnY29ubmVjdCBmYWlsIScpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vd2VjaGF0IGxvZ2luXHJcbiAgICBvbkNsaWNrX2J0bldYTG9naW46ZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIHRoaXMubG9naW4oMClcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8v6L+U5Zue5Y2P6K6uIFxyXG4gICAgUHVibGljUHJvdG9fU19Mb2dpblJldDpmdW5jdGlvbihtc2cpe1xyXG4gICAgICAgIHRoaXMubG9ja1VJKGZhbHNlKVxyXG4gICAgICAgIGlmIChtc2cucmV0X2NvZGUgPT0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNjLmxvZygnbG9naW4gc3VjY2VzcyEgY3VpZDonICsgbXNnLmN1aWQpO1xyXG4gICAgICAgICAgICBjYy5zY2VuZW1hbmFnZXIubG9hZE1haW5TY2VuZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY2MubG9nKCdsb2dpbiBmYWlsIScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uTWVzc2FnZUVycm9yOmZ1bmN0aW9uKGVycm9yaWQpe1xyXG4gICAgICAgIHRoaXMubG9ja1VJKGZhbHNlKVxyXG4gICAgfSxcclxuXHJcbiAgICAvL2d1ZXN0IGxvZ2luXHJcbiAgICBvbkNsaWNrX2J0bkd1ZXN0TG9naW4gOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubG9naW4oMSlcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsInJlcXVpcmUoJ1VJUGFuZWwnKVxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy51aXBhbmVsLFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBidG5Ob3RpY2U6Y2MuQnV0dG9uLFxyXG4gICAgICAgIGJ0bkNyZWF0ZVJvb206Y2MuQnV0dG9uLFxyXG4gICAgICAgIGJ0bkpvaW5Sb29tOmNjLkJ1dHRvbixcclxuICAgICAgICBmdW5jTm9kZTpjYy5Ob2RlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjYy5sb2codGhpcy5mdW5jTm9kZS53aWR0aClcclxuICAgICAgICB0aGlzLmZ1bmNOb2RlLnNjYWxlWSA9IHRoaXMuZnVuY05vZGUud2lkdGgvIDg0MC4wO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25DbGlja19idG5Ob3RpY2U6ZnVuY3Rpb24oKXtcclxuICAgICAgIGNjLmd1aW1hbmFnZXIub3BlbignVUlOb3RpY2UnKVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25DbGlja19idG5DcmVhdGVSb29tOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkNsaWNrX2J0bkpvaW5Sb29tIDogZnVuY3Rpb24oKXtcclxuICAgICAgICBjYy5ndWltYW5hZ2VyLm9wZW4oJ1VJSm9pblJvb20nKVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsInJlcXVpcmUoJ1VJUGFuZWwnKVxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy51aXBhbmVsLFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBidG5DbG9zZTpjYy5CdXR0b25cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkJ0bkNsb3NlQ2xpY2tlZDpmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJpZiAoY2MudWlwYW5lbCA9PSB1bmRlZmluZWQpXG57XG4gICAgY2MubG9nKCd1aXBhbmVsIGluaXQnKVxuICAgIGNjLnVpcGFuZWwgPSBjYy5DbGFzcyh7XG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICAgICAgY3RvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5pc01vZGVsID0gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBzZXRWaXNpYmxlOmZ1bmN0aW9uKGJWaXNpYmxlKXtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmVTZWxmID0gYlZpc2libGVcbiAgICAgICAgICAgIGlmIChiVmlzaWJsZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBvbkNyZWF0ZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2RlbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgICAgICAgICBjYy5sb2FkZXIubG9hZFJlcygnR3VpL01vZGFsQmcnLGZ1bmN0aW9uKGVycixwcmVmYWIpe1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2xvYWQnKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnLnBhcmVudCA9IHNlbGYubm9kZVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnLnNldFNpYmxpbmdJbmRleCgwKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb25JbW1lZGlhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIG9uQ2xvc2U6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICh0aGlzLmJnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuYmcub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJUKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgb25TaG93OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIG9uSGlkZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBjbG9zZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgY2MuZ3VpbWFuYWdlci5jbG9zZSh0aGlzKVxuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCIvKlxyXG4gYnl0ZWJ1ZmZlci5qcyAoYykgMjAxNSBEYW5pZWwgV2lydHogPGRjb2RlQGRjb2RlLmlvPlxyXG4gQmFja2luZyBidWZmZXI6IEFycmF5QnVmZmVyLCBBY2Nlc3NvcjogVWludDhBcnJheVxyXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMFxyXG4gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGNvZGVJTy9ieXRlYnVmZmVyLmpzIGZvciBkZXRhaWxzXHJcbiovXHJcbihmdW5jdGlvbihrLG0pe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtcImxvbmdcIl0sbSk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgcmVxdWlyZSYmXCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGUmJm1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe3ZhciByPW1vZHVsZSxzO3RyeXtzPXJlcXVpcmUoXCJsb25nXCIpfWNhdGNoKHUpe31zPW0ocyk7ci5leHBvcnRzPXN9ZWxzZShrLmRjb2RlSU89ay5kY29kZUlPfHx7fSkuQnl0ZUJ1ZmZlcj1tKGsuZGNvZGVJTy5Mb25nKX0pKHRoaXMsZnVuY3Rpb24oayl7ZnVuY3Rpb24gbShhKXt2YXIgYj0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBiPGEubGVuZ3RoP2EuY2hhckNvZGVBdChiKyspOm51bGx9fWZ1bmN0aW9uIHIoKXt2YXIgYT1bXSxiPVtdO3JldHVybiBmdW5jdGlvbigpe2lmKDA9PT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBiLmpvaW4oXCJcIikrdy5hcHBseShTdHJpbmcsYSk7MTAyNDxhLmxlbmd0aCtcclxuYXJndW1lbnRzLmxlbmd0aCYmKGIucHVzaCh3LmFwcGx5KFN0cmluZyxhKSksYS5sZW5ndGg9MCk7QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYSxhcmd1bWVudHMpfX1mdW5jdGlvbiBzKGEsYixjLGQsZil7dmFyIGw7bD04KmYtZC0xO3ZhciBnPSgxPDxsKS0xLGU9Zz4+MSxoPS03O2Y9Yz9mLTE6MDt2YXIgaz1jPy0xOjEscD1hW2IrZl07Zis9aztjPXAmKDE8PC1oKS0xO3A+Pj0taDtmb3IoaCs9bDswPGg7Yz0yNTYqYythW2IrZl0sZis9ayxoLT04KTtsPWMmKDE8PC1oKS0xO2M+Pj0taDtmb3IoaCs9ZDswPGg7bD0yNTYqbCthW2IrZl0sZis9ayxoLT04KTtpZigwPT09YyljPTEtZTtlbHNle2lmKGM9PT1nKXJldHVybiBsP05hTjpJbmZpbml0eSoocD8tMToxKTtsKz1NYXRoLnBvdygyLGQpO2MtPWV9cmV0dXJuKHA/LTE6MSkqbCpNYXRoLnBvdygyLGMtZCl9ZnVuY3Rpb24gdShhLGIsYyxkLGYsbCl7dmFyIGcsZT04KmwtZi0xLGg9KDE8PGUpLTEsaz1oPj4xLHA9MjM9PT1mP1xyXG5NYXRoLnBvdygyLC0yNCktTWF0aC5wb3coMiwtNzcpOjA7bD1kPzA6bC0xO3ZhciBtPWQ/MTotMSxuPTA+Ynx8MD09PWImJjA+MS9iPzE6MDtiPU1hdGguYWJzKGIpO2lzTmFOKGIpfHxJbmZpbml0eT09PWI/KGI9aXNOYU4oYik/MTowLGQ9aCk6KGQ9TWF0aC5mbG9vcihNYXRoLmxvZyhiKS9NYXRoLkxOMiksMT5iKihnPU1hdGgucG93KDIsLWQpKSYmKGQtLSxnKj0yKSxiPTE8PWQraz9iK3AvZzpiK3AqTWF0aC5wb3coMiwxLWspLDI8PWIqZyYmKGQrKyxnLz0yKSxkK2s+PWg/KGI9MCxkPWgpOjE8PWQraz8oYj0oYipnLTEpKk1hdGgucG93KDIsZiksZCs9ayk6KGI9YipNYXRoLnBvdygyLGstMSkqTWF0aC5wb3coMixmKSxkPTApKTtmb3IoOzg8PWY7YVtjK2xdPWImMjU1LGwrPW0sYi89MjU2LGYtPTgpO2Q9ZDw8ZnxiO2ZvcihlKz1mOzA8ZTthW2MrbF09ZCYyNTUsbCs9bSxkLz0yNTYsZS09OCk7YVtjK2wtbV18PTEyOCpufXZhciBoPWZ1bmN0aW9uKGEsYixjKXtcInVuZGVmaW5lZFwiPT09XHJcbnR5cGVvZiBhJiYoYT1oLkRFRkFVTFRfQ0FQQUNJVFkpO1widW5kZWZpbmVkXCI9PT10eXBlb2YgYiYmKGI9aC5ERUZBVUxUX0VORElBTik7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjJiYoYz1oLkRFRkFVTFRfTk9BU1NFUlQpO2lmKCFjKXthfD0wO2lmKDA+YSl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBjYXBhY2l0eVwiKTtiPSEhYjtjPSEhY310aGlzLmJ1ZmZlcj0wPT09YT92Om5ldyBBcnJheUJ1ZmZlcihhKTt0aGlzLnZpZXc9MD09PWE/bnVsbDpuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlcik7dGhpcy5vZmZzZXQ9MDt0aGlzLm1hcmtlZE9mZnNldD0tMTt0aGlzLmxpbWl0PWE7dGhpcy5saXR0bGVFbmRpYW49Yjt0aGlzLm5vQXNzZXJ0PWN9O2guVkVSU0lPTj1cIjUuMC4xXCI7aC5MSVRUTEVfRU5ESUFOPSEwO2guQklHX0VORElBTj0hMTtoLkRFRkFVTFRfQ0FQQUNJVFk9MTY7aC5ERUZBVUxUX0VORElBTj1oLkJJR19FTkRJQU47aC5ERUZBVUxUX05PQVNTRVJUPSExO2guTG9uZz1rfHxcclxubnVsbDt2YXIgZT1oLnByb3RvdHlwZTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9faXNCeXRlQnVmZmVyX19cIix7dmFsdWU6ITAsZW51bWVyYWJsZTohMSxjb25maWd1cmFibGU6ITF9KTt2YXIgdj1uZXcgQXJyYXlCdWZmZXIoMCksdz1TdHJpbmcuZnJvbUNoYXJDb2RlO2guYWNjZXNzb3I9ZnVuY3Rpb24oKXtyZXR1cm4gVWludDhBcnJheX07aC5hbGxvY2F0ZT1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIG5ldyBoKGEsYixjKX07aC5jb25jYXQ9ZnVuY3Rpb24oYSxiLGMsZCl7aWYoXCJib29sZWFuXCI9PT10eXBlb2YgYnx8XCJzdHJpbmdcIiE9PXR5cGVvZiBiKWQ9YyxjPWIsYj12b2lkIDA7Zm9yKHZhciBmPTAsbD0wLGc9YS5sZW5ndGgsZTtsPGc7KytsKWguaXNCeXRlQnVmZmVyKGFbbF0pfHwoYVtsXT1oLndyYXAoYVtsXSxiKSksZT1hW2xdLmxpbWl0LWFbbF0ub2Zmc2V0LDA8ZSYmKGYrPWUpO2lmKDA9PT1mKXJldHVybiBuZXcgaCgwLGMsZCk7Yj1uZXcgaChmLGMsZCk7Zm9yKGw9XHJcbjA7bDxnOyljPWFbbCsrXSxlPWMubGltaXQtYy5vZmZzZXQsMD49ZXx8KGIudmlldy5zZXQoYy52aWV3LnN1YmFycmF5KGMub2Zmc2V0LGMubGltaXQpLGIub2Zmc2V0KSxiLm9mZnNldCs9ZSk7Yi5saW1pdD1iLm9mZnNldDtiLm9mZnNldD0wO3JldHVybiBifTtoLmlzQnl0ZUJ1ZmZlcj1mdW5jdGlvbihhKXtyZXR1cm4hMD09PShhJiZhLl9faXNCeXRlQnVmZmVyX18pfTtoLnR5cGU9ZnVuY3Rpb24oKXtyZXR1cm4gQXJyYXlCdWZmZXJ9O2gud3JhcD1mdW5jdGlvbihhLGIsYyxkKXtcInN0cmluZ1wiIT09dHlwZW9mIGImJihkPWMsYz1iLGI9dm9pZCAwKTtpZihcInN0cmluZ1wiPT09dHlwZW9mIGEpc3dpdGNoKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgYiYmKGI9XCJ1dGY4XCIpLGIpe2Nhc2UgXCJiYXNlNjRcIjpyZXR1cm4gaC5mcm9tQmFzZTY0KGEsYyk7Y2FzZSBcImhleFwiOnJldHVybiBoLmZyb21IZXgoYSxjKTtjYXNlIFwiYmluYXJ5XCI6cmV0dXJuIGguZnJvbUJpbmFyeShhLGMpO2Nhc2UgXCJ1dGY4XCI6cmV0dXJuIGguZnJvbVVURjgoYSxcclxuYyk7Y2FzZSBcImRlYnVnXCI6cmV0dXJuIGguZnJvbURlYnVnKGEsYyk7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVuc3VwcG9ydGVkIGVuY29kaW5nOiBcIitiKTt9aWYobnVsbD09PWF8fFwib2JqZWN0XCIhPT10eXBlb2YgYSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJ1ZmZlclwiKTtpZihoLmlzQnl0ZUJ1ZmZlcihhKSlyZXR1cm4gYj1lLmNsb25lLmNhbGwoYSksYi5tYXJrZWRPZmZzZXQ9LTEsYjtpZihhIGluc3RhbmNlb2YgVWludDhBcnJheSliPW5ldyBoKDAsYyxkKSwwPGEubGVuZ3RoJiYoYi5idWZmZXI9YS5idWZmZXIsYi5vZmZzZXQ9YS5ieXRlT2Zmc2V0LGIubGltaXQ9YS5ieXRlT2Zmc2V0K2EuYnl0ZUxlbmd0aCxiLnZpZXc9bmV3IFVpbnQ4QXJyYXkoYS5idWZmZXIpKTtlbHNlIGlmKGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciliPW5ldyBoKDAsYyxkKSwwPGEuYnl0ZUxlbmd0aCYmKGIuYnVmZmVyPWEsYi5vZmZzZXQ9MCxiLmxpbWl0PWEuYnl0ZUxlbmd0aCxiLnZpZXc9MDxcclxuYS5ieXRlTGVuZ3RoP25ldyBVaW50OEFycmF5KGEpOm51bGwpO2Vsc2UgaWYoXCJbb2JqZWN0IEFycmF5XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpKWZvcihiPW5ldyBoKGEubGVuZ3RoLGMsZCksYi5saW1pdD1hLmxlbmd0aCxjPTA7YzxhLmxlbmd0aDsrK2MpYi52aWV3W2NdPWFbY107ZWxzZSB0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJ1ZmZlclwiKTtyZXR1cm4gYn07ZS53cml0ZUJpdFNldD1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKCEoYSBpbnN0YW5jZW9mIEFycmF5KSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIEJpdFNldDogTm90IGFuIGFycmF5XCIpO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD5cclxudGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1iLGY9YS5sZW5ndGgsZT1mPj4zLGc9MCxoO2ZvcihiKz10aGlzLndyaXRlVmFyaW50MzIoZixiKTtlLS07KWg9ISFhW2crK10mMXwoISFhW2crK10mMSk8PDF8KCEhYVtnKytdJjEpPDwyfCghIWFbZysrXSYxKTw8M3woISFhW2crK10mMSk8PDR8KCEhYVtnKytdJjEpPDw1fCghIWFbZysrXSYxKTw8NnwoISFhW2crK10mMSk8PDcsdGhpcy53cml0ZUJ5dGUoaCxiKyspO2lmKGc8Zil7Zm9yKGg9ZT0wO2c8ZjspaHw9KCEhYVtnKytdJjEpPDxlKys7dGhpcy53cml0ZUJ5dGUoaCxiKyspfXJldHVybiBjPyh0aGlzLm9mZnNldD1iLHRoaXMpOmItZH07ZS5yZWFkQml0U2V0PWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7dmFyIGM9dGhpcy5yZWFkVmFyaW50MzIoYSksXHJcbmQ9Yy52YWx1ZSxmPWQ+PjMsZT0wLGc9W107Zm9yKGErPWMubGVuZ3RoO2YtLTspYz10aGlzLnJlYWRCeXRlKGErKyksZ1tlKytdPSEhKGMmMSksZ1tlKytdPSEhKGMmMiksZ1tlKytdPSEhKGMmNCksZ1tlKytdPSEhKGMmOCksZ1tlKytdPSEhKGMmMTYpLGdbZSsrXT0hIShjJjMyKSxnW2UrK109ISEoYyY2NCksZ1tlKytdPSEhKGMmMTI4KTtpZihlPGQpZm9yKGY9MCxjPXRoaXMucmVhZEJ5dGUoYSsrKTtlPGQ7KWdbZSsrXT0hIShjPj5mKysmMSk7YiYmKHRoaXMub2Zmc2V0PWEpO3JldHVybiBnfTtlLnJlYWRCeXRlcz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrYT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitcclxuYitcIiAoK1wiK2ErXCIpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD10aGlzLnNsaWNlKGIsYithKTtjJiYodGhpcy5vZmZzZXQrPWEpO3JldHVybiBkfTtlLndyaXRlQnl0ZXM9ZS5hcHBlbmQ7ZS53cml0ZUludDg9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxufWIrPTE7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmQmJnRoaXMucmVzaXplKChkKj0yKT5iP2Q6Yik7dGhpcy52aWV3W2ItMV09YTtjJiYodGhpcy5vZmZzZXQrPTEpO3JldHVybiB0aGlzfTtlLndyaXRlQnl0ZT1lLndyaXRlSW50ODtlLnJlYWRJbnQ4PWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMSkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWE9dGhpcy52aWV3W2FdOzEyOD09PShhJjEyOCkmJihhPS0oMjU1LWErMSkpO2ImJih0aGlzLm9mZnNldCs9XHJcbjEpO3JldHVybiBhfTtlLnJlYWRCeXRlPWUucmVhZEludDg7ZS53cml0ZVVpbnQ4PWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9MTt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTtcclxudGhpcy52aWV3W2ItMV09YTtjJiYodGhpcy5vZmZzZXQrPTEpO3JldHVybiB0aGlzfTtlLndyaXRlVUludDg9ZS53cml0ZVVpbnQ4O2UucmVhZFVpbnQ4PWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMSkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWE9dGhpcy52aWV3W2FdO2ImJih0aGlzLm9mZnNldCs9MSk7cmV0dXJuIGF9O2UucmVhZFVJbnQ4PWUucmVhZFVpbnQ4O2Uud3JpdGVJbnQxNj1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtcclxuYyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9Mjt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTtiLT0yO3RoaXMubGl0dGxlRW5kaWFuPyh0aGlzLnZpZXdbYisxXT0oYSY2NTI4MCk+Pj44LHRoaXMudmlld1tiXT1hJjI1NSk6KHRoaXMudmlld1tiXT0oYSY2NTI4MCk+Pj5cclxuOCx0aGlzLnZpZXdbYisxXT1hJjI1NSk7YyYmKHRoaXMub2Zmc2V0Kz0yKTtyZXR1cm4gdGhpc307ZS53cml0ZVNob3J0PWUud3JpdGVJbnQxNjtlLnJlYWRJbnQxNj1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzIpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz0wO3RoaXMubGl0dGxlRW5kaWFuPyhjPXRoaXMudmlld1thXSxjfD10aGlzLnZpZXdbYSsxXTw8OCk6KGM9dGhpcy52aWV3W2FdPDw4LGN8PXRoaXMudmlld1thKzFdKTszMjc2OD09PShjJjMyNzY4KSYmXHJcbihjPS0oNjU1MzUtYysxKSk7YiYmKHRoaXMub2Zmc2V0Kz0yKTtyZXR1cm4gY307ZS5yZWFkU2hvcnQ9ZS5yZWFkSW50MTY7ZS53cml0ZVVpbnQxNj1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitiK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWIrPTI7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtcclxuYj5kJiZ0aGlzLnJlc2l6ZSgoZCo9Mik+Yj9kOmIpO2ItPTI7dGhpcy5saXR0bGVFbmRpYW4/KHRoaXMudmlld1tiKzFdPShhJjY1MjgwKT4+PjgsdGhpcy52aWV3W2JdPWEmMjU1KToodGhpcy52aWV3W2JdPShhJjY1MjgwKT4+PjgsdGhpcy52aWV3W2IrMV09YSYyNTUpO2MmJih0aGlzLm9mZnNldCs9Mik7cmV0dXJuIHRoaXN9O2Uud3JpdGVVSW50MTY9ZS53cml0ZVVpbnQxNjtlLnJlYWRVaW50MTY9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsyPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsyKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxufXZhciBjPTA7dGhpcy5saXR0bGVFbmRpYW4/KGM9dGhpcy52aWV3W2FdLGN8PXRoaXMudmlld1thKzFdPDw4KTooYz10aGlzLnZpZXdbYV08PDgsY3w9dGhpcy52aWV3W2ErMV0pO2ImJih0aGlzLm9mZnNldCs9Mik7cmV0dXJuIGN9O2UucmVhZFVJbnQxNj1lLnJlYWRVaW50MTY7ZS53cml0ZUludDMyPWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthfD0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitcclxuYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31iKz00O3ZhciBkPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5kJiZ0aGlzLnJlc2l6ZSgoZCo9Mik+Yj9kOmIpO2ItPTQ7dGhpcy5saXR0bGVFbmRpYW4/KHRoaXMudmlld1tiKzNdPWE+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMl09YT4+PjE2JjI1NSx0aGlzLnZpZXdbYisxXT1hPj4+OCYyNTUsdGhpcy52aWV3W2JdPWEmMjU1KToodGhpcy52aWV3W2JdPWE+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMV09YT4+PjE2JjI1NSx0aGlzLnZpZXdbYisyXT1hPj4+OCYyNTUsdGhpcy52aWV3W2IrM109YSYyNTUpO2MmJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIHRoaXN9O2Uud3JpdGVJbnQ9ZS53cml0ZUludDMyO2UucmVhZEludDMyPWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElXHJcbjEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzQ+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzQpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz0wO3RoaXMubGl0dGxlRW5kaWFuPyhjPXRoaXMudmlld1thKzJdPDwxNixjfD10aGlzLnZpZXdbYSsxXTw8OCxjfD10aGlzLnZpZXdbYV0sYys9dGhpcy52aWV3W2ErM108PDI0Pj4+MCk6KGM9dGhpcy52aWV3W2ErMV08PDE2LGN8PXRoaXMudmlld1thKzJdPDw4LGN8PXRoaXMudmlld1thKzNdLGMrPXRoaXMudmlld1thXTw8MjQ+Pj4wKTtiJiYodGhpcy5vZmZzZXQrPTQpO3JldHVybiBjfDB9O2UucmVhZEludD1lLnJlYWRJbnQzMjtlLndyaXRlVWludDMyPWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtcclxuaWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitiK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWIrPTQ7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmQmJnRoaXMucmVzaXplKChkKj0yKT5iP2Q6Yik7Yi09NDt0aGlzLmxpdHRsZUVuZGlhbj8odGhpcy52aWV3W2IrM109YT4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1hPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWE+Pj44JjI1NSx0aGlzLnZpZXdbYl09XHJcbmEmMjU1KToodGhpcy52aWV3W2JdPWE+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMV09YT4+PjE2JjI1NSx0aGlzLnZpZXdbYisyXT1hPj4+OCYyNTUsdGhpcy52aWV3W2IrM109YSYyNTUpO2MmJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIHRoaXN9O2Uud3JpdGVVSW50MzI9ZS53cml0ZVVpbnQzMjtlLnJlYWRVaW50MzI9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSs0PnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCs0KSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGM9MDt0aGlzLmxpdHRsZUVuZGlhbj8oYz10aGlzLnZpZXdbYStcclxuMl08PDE2LGN8PXRoaXMudmlld1thKzFdPDw4LGN8PXRoaXMudmlld1thXSxjKz10aGlzLnZpZXdbYSszXTw8MjQ+Pj4wKTooYz10aGlzLnZpZXdbYSsxXTw8MTYsY3w9dGhpcy52aWV3W2ErMl08PDgsY3w9dGhpcy52aWV3W2ErM10sYys9dGhpcy52aWV3W2FdPDwyND4+PjApO2ImJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIGN9O2UucmVhZFVJbnQzMj1lLnJlYWRVaW50MzI7ayYmKGUud3JpdGVJbnQ2ND1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCI9PT10eXBlb2YgYSlhPWsuZnJvbU51bWJlcihhKTtlbHNlIGlmKFwic3RyaW5nXCI9PT10eXBlb2YgYSlhPWsuZnJvbVN0cmluZyhhKTtlbHNlIGlmKCEoYSYmYSBpbnN0YW5jZW9mIGspKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyIG9yIExvbmcpXCIpO2lmKFwibnVtYmVyXCIhPT1cclxudHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31cIm51bWJlclwiPT09dHlwZW9mIGE/YT1rLmZyb21OdW1iZXIoYSk6XCJzdHJpbmdcIj09PXR5cGVvZiBhJiYoYT1rLmZyb21TdHJpbmcoYSkpO2IrPTg7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmQmJnRoaXMucmVzaXplKChkKj0yKT5iP2Q6Yik7Yi09ODt2YXIgZD1hLmxvdyxmPWEuaGlnaDt0aGlzLmxpdHRsZUVuZGlhbj8odGhpcy52aWV3W2IrM109ZD4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1kPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWQ+Pj44JjI1NSx0aGlzLnZpZXdbYl09ZCYyNTUsYis9NCx0aGlzLnZpZXdbYiszXT1cclxuZj4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWY+Pj44JjI1NSx0aGlzLnZpZXdbYl09ZiYyNTUpOih0aGlzLnZpZXdbYl09Zj4+PjI0JjI1NSx0aGlzLnZpZXdbYisxXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzJdPWY+Pj44JjI1NSx0aGlzLnZpZXdbYiszXT1mJjI1NSxiKz00LHRoaXMudmlld1tiXT1kPj4+MjQmMjU1LHRoaXMudmlld1tiKzFdPWQ+Pj4xNiYyNTUsdGhpcy52aWV3W2IrMl09ZD4+PjgmMjU1LHRoaXMudmlld1tiKzNdPWQmMjU1KTtjJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiB0aGlzfSxlLndyaXRlTG9uZz1lLndyaXRlSW50NjQsZS5yZWFkSW50NjQ9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7XHJcbmE+Pj49MDtpZigwPmF8fGErOD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrOCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjPTAsZD0wO3RoaXMubGl0dGxlRW5kaWFuPyhjPXRoaXMudmlld1thKzJdPDwxNixjfD10aGlzLnZpZXdbYSsxXTw8OCxjfD10aGlzLnZpZXdbYV0sYys9dGhpcy52aWV3W2ErM108PDI0Pj4+MCxhKz00LGQ9dGhpcy52aWV3W2ErMl08PDE2LGR8PXRoaXMudmlld1thKzFdPDw4LGR8PXRoaXMudmlld1thXSxkKz10aGlzLnZpZXdbYSszXTw8MjQ+Pj4wKTooZD10aGlzLnZpZXdbYSsxXTw8MTYsZHw9dGhpcy52aWV3W2ErMl08PDgsZHw9dGhpcy52aWV3W2ErM10sZCs9dGhpcy52aWV3W2FdPDwyND4+PjAsYSs9NCxjPXRoaXMudmlld1thKzFdPDwxNixjfD10aGlzLnZpZXdbYSsyXTw8OCxjfD10aGlzLnZpZXdbYSszXSxjKz10aGlzLnZpZXdbYV08PDI0Pj4+MCk7XHJcbmE9bmV3IGsoYyxkLCExKTtiJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiBhfSxlLnJlYWRMb25nPWUucmVhZEludDY0LGUud3JpdGVVaW50NjQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiPT09dHlwZW9mIGEpYT1rLmZyb21OdW1iZXIoYSk7ZWxzZSBpZihcInN0cmluZ1wiPT09dHlwZW9mIGEpYT1rLmZyb21TdHJpbmcoYSk7ZWxzZSBpZighKGEmJmEgaW5zdGFuY2VvZiBrKSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlciBvciBMb25nKVwiKTtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrXHJcbmIrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9XCJudW1iZXJcIj09PXR5cGVvZiBhP2E9ay5mcm9tTnVtYmVyKGEpOlwic3RyaW5nXCI9PT10eXBlb2YgYSYmKGE9ay5mcm9tU3RyaW5nKGEpKTtiKz04O3ZhciBkPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5kJiZ0aGlzLnJlc2l6ZSgoZCo9Mik+Yj9kOmIpO2ItPTg7dmFyIGQ9YS5sb3csZj1hLmhpZ2g7dGhpcy5saXR0bGVFbmRpYW4/KHRoaXMudmlld1tiKzNdPWQ+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMl09ZD4+PjE2JjI1NSx0aGlzLnZpZXdbYisxXT1kPj4+OCYyNTUsdGhpcy52aWV3W2JdPWQmMjU1LGIrPTQsdGhpcy52aWV3W2IrM109Zj4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWY+Pj44JjI1NSx0aGlzLnZpZXdbYl09ZiYyNTUpOih0aGlzLnZpZXdbYl09Zj4+PjI0JjI1NSx0aGlzLnZpZXdbYisxXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzJdPWY+Pj44JjI1NSxcclxudGhpcy52aWV3W2IrM109ZiYyNTUsYis9NCx0aGlzLnZpZXdbYl09ZD4+PjI0JjI1NSx0aGlzLnZpZXdbYisxXT1kPj4+MTYmMjU1LHRoaXMudmlld1tiKzJdPWQ+Pj44JjI1NSx0aGlzLnZpZXdbYiszXT1kJjI1NSk7YyYmKHRoaXMub2Zmc2V0Kz04KTtyZXR1cm4gdGhpc30sZS53cml0ZVVJbnQ2ND1lLndyaXRlVWludDY0LGUucmVhZFVpbnQ2ND1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzg+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzgpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz0wLGQ9MDt0aGlzLmxpdHRsZUVuZGlhbj9cclxuKGM9dGhpcy52aWV3W2ErMl08PDE2LGN8PXRoaXMudmlld1thKzFdPDw4LGN8PXRoaXMudmlld1thXSxjKz10aGlzLnZpZXdbYSszXTw8MjQ+Pj4wLGErPTQsZD10aGlzLnZpZXdbYSsyXTw8MTYsZHw9dGhpcy52aWV3W2ErMV08PDgsZHw9dGhpcy52aWV3W2FdLGQrPXRoaXMudmlld1thKzNdPDwyND4+PjApOihkPXRoaXMudmlld1thKzFdPDwxNixkfD10aGlzLnZpZXdbYSsyXTw8OCxkfD10aGlzLnZpZXdbYSszXSxkKz10aGlzLnZpZXdbYV08PDI0Pj4+MCxhKz00LGM9dGhpcy52aWV3W2ErMV08PDE2LGN8PXRoaXMudmlld1thKzJdPDw4LGN8PXRoaXMudmlld1thKzNdLGMrPXRoaXMudmlld1thXTw8MjQ+Pj4wKTthPW5ldyBrKGMsZCwhMCk7YiYmKHRoaXMub2Zmc2V0Kz04KTtyZXR1cm4gYX0sZS5yZWFkVUludDY0PWUucmVhZFVpbnQ2NCk7ZS53cml0ZUZsb2F0MzI9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09XHJcbnR5cGVvZiBhKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhIG51bWJlcilcIik7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9NDt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTt1KHRoaXMudmlldyxhLGItNCx0aGlzLmxpdHRsZUVuZGlhbiwyMyw0KTtjJiYodGhpcy5vZmZzZXQrPTQpO3JldHVybiB0aGlzfTtlLndyaXRlRmxvYXQ9ZS53cml0ZUZsb2F0MzI7ZS5yZWFkRmxvYXQzMj1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmXHJcbihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSs0PnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCs0KSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9YT1zKHRoaXMudmlldyxhLHRoaXMubGl0dGxlRW5kaWFuLDIzLDQpO2ImJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIGF9O2UucmVhZEZsb2F0PWUucmVhZEZsb2F0MzI7ZS53cml0ZUZsb2F0NjQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGEgbnVtYmVyKVwiKTtcclxuaWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9ODt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTt1KHRoaXMudmlldyxhLGItOCx0aGlzLmxpdHRsZUVuZGlhbiw1Miw4KTtjJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiB0aGlzfTtlLndyaXRlRG91YmxlPWUud3JpdGVGbG9hdDY0O2UucmVhZEZsb2F0NjQ9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09XHJcbmElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErOD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrOCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWE9cyh0aGlzLnZpZXcsYSx0aGlzLmxpdHRsZUVuZGlhbiw1Miw4KTtiJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiBhfTtlLnJlYWREb3VibGU9ZS5yZWFkRmxvYXQ2NDtoLk1BWF9WQVJJTlQzMl9CWVRFUz01O2guY2FsY3VsYXRlVmFyaW50MzI9ZnVuY3Rpb24oYSl7YT4+Pj0wO3JldHVybiAxMjg+YT8xOjE2Mzg0PmE/MjoyMDk3MTUyPmE/MzoyNjg0MzU0NTY+YT80OjV9O2guemlnWmFnRW5jb2RlMzI9ZnVuY3Rpb24oYSl7cmV0dXJuKChhfD0wKTw8MV5hPj4zMSk+Pj4wfTtoLnppZ1phZ0RlY29kZTMyPWZ1bmN0aW9uKGEpe3JldHVybiBhPj4+MV4tKGEmXHJcbjEpfDB9O2Uud3JpdGVWYXJpbnQzMj1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YXw9MDtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1oLmNhbGN1bGF0ZVZhcmludDMyKGEpLGY7Yis9ZDtmPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5mJiZ0aGlzLnJlc2l6ZSgoZio9Mik+Yj9mOmIpO1xyXG5iLT1kO2ZvcihhPj4+PTA7MTI4PD1hOylmPWEmMTI3fDEyOCx0aGlzLnZpZXdbYisrXT1mLGE+Pj49Nzt0aGlzLnZpZXdbYisrXT1hO3JldHVybiBjPyh0aGlzLm9mZnNldD1iLHRoaXMpOmR9O2Uud3JpdGVWYXJpbnQzMlppZ1phZz1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLndyaXRlVmFyaW50MzIoaC56aWdaYWdFbmNvZGUzMihhKSxiKX07ZS5yZWFkVmFyaW50MzI9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsxPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsxKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxufXZhciBjPTAsZD0wLGY7ZG97aWYoIXRoaXMubm9Bc3NlcnQmJmE+dGhpcy5saW1pdCl0aHJvdyBhPUVycm9yKFwiVHJ1bmNhdGVkXCIpLGEudHJ1bmNhdGVkPSEwLGE7Zj10aGlzLnZpZXdbYSsrXTs1PmMmJihkfD0oZiYxMjcpPDw3KmMpOysrY313aGlsZSgwIT09KGYmMTI4KSk7ZHw9MDtyZXR1cm4gYj8odGhpcy5vZmZzZXQ9YSxkKTp7dmFsdWU6ZCxsZW5ndGg6Y319O2UucmVhZFZhcmludDMyWmlnWmFnPWZ1bmN0aW9uKGEpe2E9dGhpcy5yZWFkVmFyaW50MzIoYSk7XCJvYmplY3RcIj09PXR5cGVvZiBhP2EudmFsdWU9aC56aWdaYWdEZWNvZGUzMihhLnZhbHVlKTphPWguemlnWmFnRGVjb2RlMzIoYSk7cmV0dXJuIGF9O2smJihoLk1BWF9WQVJJTlQ2NF9CWVRFUz0xMCxoLmNhbGN1bGF0ZVZhcmludDY0PWZ1bmN0aW9uKGEpe1wibnVtYmVyXCI9PT10eXBlb2YgYT9hPWsuZnJvbU51bWJlcihhKTpcInN0cmluZ1wiPT09dHlwZW9mIGEmJihhPWsuZnJvbVN0cmluZyhhKSk7dmFyIGI9YS50b0ludCgpPj4+XHJcbjAsYz1hLnNoaWZ0UmlnaHRVbnNpZ25lZCgyOCkudG9JbnQoKT4+PjA7YT1hLnNoaWZ0UmlnaHRVbnNpZ25lZCg1NikudG9JbnQoKT4+PjA7cmV0dXJuIDA9PWE/MD09Yz8xNjM4ND5iPzEyOD5iPzE6MjoyMDk3MTUyPmI/Mzo0OjE2Mzg0PmM/MTI4PmM/NTo2OjIwOTcxNTI+Yz83Ojg6MTI4PmE/OToxMH0saC56aWdaYWdFbmNvZGU2ND1mdW5jdGlvbihhKXtcIm51bWJlclwiPT09dHlwZW9mIGE/YT1rLmZyb21OdW1iZXIoYSwhMSk6XCJzdHJpbmdcIj09PXR5cGVvZiBhP2E9ay5mcm9tU3RyaW5nKGEsITEpOiExIT09YS51bnNpZ25lZCYmKGE9YS50b1NpZ25lZCgpKTtyZXR1cm4gYS5zaGlmdExlZnQoMSkueG9yKGEuc2hpZnRSaWdodCg2MykpLnRvVW5zaWduZWQoKX0saC56aWdaYWdEZWNvZGU2ND1mdW5jdGlvbihhKXtcIm51bWJlclwiPT09dHlwZW9mIGE/YT1rLmZyb21OdW1iZXIoYSwhMSk6XCJzdHJpbmdcIj09PXR5cGVvZiBhP2E9ay5mcm9tU3RyaW5nKGEsITEpOiExIT09YS51bnNpZ25lZCYmXHJcbihhPWEudG9TaWduZWQoKSk7cmV0dXJuIGEuc2hpZnRSaWdodFVuc2lnbmVkKDEpLnhvcihhLmFuZChrLk9ORSkudG9TaWduZWQoKS5uZWdhdGUoKSkudG9TaWduZWQoKX0sZS53cml0ZVZhcmludDY0PWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIj09PXR5cGVvZiBhKWE9ay5mcm9tTnVtYmVyKGEpO2Vsc2UgaWYoXCJzdHJpbmdcIj09PXR5cGVvZiBhKWE9ay5mcm9tU3RyaW5nKGEpO2Vsc2UgaWYoIShhJiZhIGluc3RhbmNlb2YgaykpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGFuIGludGVnZXIgb3IgTG9uZylcIik7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK1xyXG5iK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fVwibnVtYmVyXCI9PT10eXBlb2YgYT9hPWsuZnJvbU51bWJlcihhLCExKTpcInN0cmluZ1wiPT09dHlwZW9mIGE/YT1rLmZyb21TdHJpbmcoYSwhMSk6ITEhPT1hLnVuc2lnbmVkJiYoYT1hLnRvU2lnbmVkKCkpO3ZhciBkPWguY2FsY3VsYXRlVmFyaW50NjQoYSksZj1hLnRvSW50KCk+Pj4wLGU9YS5zaGlmdFJpZ2h0VW5zaWduZWQoMjgpLnRvSW50KCk+Pj4wLGc9YS5zaGlmdFJpZ2h0VW5zaWduZWQoNTYpLnRvSW50KCk+Pj4wO2IrPWQ7dmFyIHQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPnQmJnRoaXMucmVzaXplKCh0Kj0yKT5iP3Q6Yik7Yi09ZDtzd2l0Y2goZCl7Y2FzZSAxMDp0aGlzLnZpZXdbYis5XT1nPj4+NyYxO2Nhc2UgOTp0aGlzLnZpZXdbYis4XT05IT09ZD9nfDEyODpnJjEyNztjYXNlIDg6dGhpcy52aWV3W2IrN109OCE9PWQ/ZT4+PjIxfDEyODplPj4+MjEmMTI3O2Nhc2UgNzp0aGlzLnZpZXdbYis2XT1cclxuNyE9PWQ/ZT4+PjE0fDEyODplPj4+MTQmMTI3O2Nhc2UgNjp0aGlzLnZpZXdbYis1XT02IT09ZD9lPj4+N3wxMjg6ZT4+PjcmMTI3O2Nhc2UgNTp0aGlzLnZpZXdbYis0XT01IT09ZD9lfDEyODplJjEyNztjYXNlIDQ6dGhpcy52aWV3W2IrM109NCE9PWQ/Zj4+PjIxfDEyODpmPj4+MjEmMTI3O2Nhc2UgMzp0aGlzLnZpZXdbYisyXT0zIT09ZD9mPj4+MTR8MTI4OmY+Pj4xNCYxMjc7Y2FzZSAyOnRoaXMudmlld1tiKzFdPTIhPT1kP2Y+Pj43fDEyODpmPj4+NyYxMjc7Y2FzZSAxOnRoaXMudmlld1tiXT0xIT09ZD9mfDEyODpmJjEyN31yZXR1cm4gYz8odGhpcy5vZmZzZXQrPWQsdGhpcyk6ZH0sZS53cml0ZVZhcmludDY0WmlnWmFnPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMud3JpdGVWYXJpbnQ2NChoLnppZ1phZ0VuY29kZTY0KGEpLGIpfSxlLnJlYWRWYXJpbnQ2ND1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09XHJcbnR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsxPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsxKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGM9YSxkPTAsZj0wLGU9MCxnPTAsZz10aGlzLnZpZXdbYSsrXSxkPWcmMTI3O2lmKGcmMTI4JiYoZz10aGlzLnZpZXdbYSsrXSxkfD0oZyYxMjcpPDw3LGcmMTI4fHx0aGlzLm5vQXNzZXJ0JiZcInVuZGVmaW5lZFwiPT09dHlwZW9mIGcpJiYoZz10aGlzLnZpZXdbYSsrXSxkfD0oZyYxMjcpPDwxNCxnJjEyOHx8dGhpcy5ub0Fzc2VydCYmXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBnKSYmKGc9dGhpcy52aWV3W2ErK10sZHw9KGcmMTI3KTw8MjEsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykmJihnPXRoaXMudmlld1thKytdLFxyXG5mPWcmMTI3LGcmMTI4fHx0aGlzLm5vQXNzZXJ0JiZcInVuZGVmaW5lZFwiPT09dHlwZW9mIGcpJiYoZz10aGlzLnZpZXdbYSsrXSxmfD0oZyYxMjcpPDw3LGcmMTI4fHx0aGlzLm5vQXNzZXJ0JiZcInVuZGVmaW5lZFwiPT09dHlwZW9mIGcpJiYoZz10aGlzLnZpZXdbYSsrXSxmfD0oZyYxMjcpPDwxNCxnJjEyOHx8dGhpcy5ub0Fzc2VydCYmXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBnKSYmKGc9dGhpcy52aWV3W2ErK10sZnw9KGcmMTI3KTw8MjEsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykmJihnPXRoaXMudmlld1thKytdLGU9ZyYxMjcsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykmJihnPXRoaXMudmlld1thKytdLGV8PShnJjEyNyk8PDcsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykpdGhyb3cgRXJyb3IoXCJCdWZmZXIgb3ZlcnJ1blwiKTtkPWsuZnJvbUJpdHMoZHxmPDwyOCxmPj4+NHxcclxuZTw8MjQsITEpO3JldHVybiBiPyh0aGlzLm9mZnNldD1hLGQpOnt2YWx1ZTpkLGxlbmd0aDphLWN9fSxlLnJlYWRWYXJpbnQ2NFppZ1phZz1mdW5jdGlvbihhKXsoYT10aGlzLnJlYWRWYXJpbnQ2NChhKSkmJmEudmFsdWUgaW5zdGFuY2VvZiBrP2EudmFsdWU9aC56aWdaYWdEZWNvZGU2NChhLnZhbHVlKTphPWguemlnWmFnRGVjb2RlNjQoYSk7cmV0dXJuIGF9KTtlLndyaXRlQ1N0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7dmFyIGQsZj1hLmxlbmd0aDtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBOb3QgYSBzdHJpbmdcIik7Zm9yKGQ9MDtkPGY7KytkKWlmKDA9PT1hLmNoYXJDb2RlQXQoZCkpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgc3RyOiBDb250YWlucyBOVUxMLWNoYXJhY3RlcnNcIik7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHxcclxuMCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitiK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWY9bi5jYWxjdWxhdGVVVEYxNmFzVVRGOChtKGEpKVsxXTtiKz1mKzE7ZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTtiLT1mKzE7bi5lbmNvZGVVVEYxNnRvVVRGOChtKGEpLGZ1bmN0aW9uKGEpe3RoaXMudmlld1tiKytdPWF9LmJpbmQodGhpcykpO3RoaXMudmlld1tiKytdPTA7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Zn07ZS5yZWFkQ1N0cmluZz1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09XHJcbnR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsxPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsxKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGM9YSxkLGY9LTE7bi5kZWNvZGVVVEY4dG9VVEYxNihmdW5jdGlvbigpe2lmKDA9PT1mKXJldHVybiBudWxsO2lmKGE+PXRoaXMubGltaXQpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IFRydW5jYXRlZCBkYXRhLCBcIithK1wiIDwgXCIrdGhpcy5saW1pdCk7Zj10aGlzLnZpZXdbYSsrXTtyZXR1cm4gMD09PWY/bnVsbDpmfS5iaW5kKHRoaXMpLGQ9cigpLCEwKTtyZXR1cm4gYj8odGhpcy5vZmZzZXQ9YSxkKCkpOntzdHJpbmc6ZCgpLGxlbmd0aDphLWN9fTtlLndyaXRlSVN0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVxyXG5cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IE5vdCBhIHN0cmluZ1wiKTtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1iLGY7Zj1uLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSksdGhpcy5ub0Fzc2VydClbMV07Yis9NCtmO3ZhciBlPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5lJiZ0aGlzLnJlc2l6ZSgoZSo9Mik+Yj9lOmIpO2ItPTQrZjt0aGlzLmxpdHRsZUVuZGlhbj8odGhpcy52aWV3W2IrXHJcbjNdPWY+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMl09Zj4+PjE2JjI1NSx0aGlzLnZpZXdbYisxXT1mPj4+OCYyNTUsdGhpcy52aWV3W2JdPWYmMjU1KToodGhpcy52aWV3W2JdPWY+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMV09Zj4+PjE2JjI1NSx0aGlzLnZpZXdbYisyXT1mPj4+OCYyNTUsdGhpcy52aWV3W2IrM109ZiYyNTUpO2IrPTQ7bi5lbmNvZGVVVEYxNnRvVVRGOChtKGEpLGZ1bmN0aW9uKGEpe3RoaXMudmlld1tiKytdPWF9LmJpbmQodGhpcykpO2lmKGIhPT1kKzQrZil0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogVHJ1bmNhdGVkIGRhdGEsIFwiK2IrXCIgPT0gXCIrKGIrNCtmKSk7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Yi1kfTtlLnJlYWRJU3RyaW5nPWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrXHJcbmErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzQ+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzQpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz1hLGQ9dGhpcy5yZWFkVWludDMyKGEpLGQ9dGhpcy5yZWFkVVRGOFN0cmluZyhkLGguTUVUUklDU19CWVRFUyxhKz00KTthKz1kLmxlbmd0aDtyZXR1cm4gYj8odGhpcy5vZmZzZXQ9YSxkLnN0cmluZyk6e3N0cmluZzpkLnN0cmluZyxsZW5ndGg6YS1jfX07aC5NRVRSSUNTX0NIQVJTPVwiY1wiO2guTUVUUklDU19CWVRFUz1cImJcIjtlLndyaXRlVVRGOFN0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrXHJcbmIrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZCxmPWI7ZD1uLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSkpWzFdO2IrPWQ7dmFyIGU9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmUmJnRoaXMucmVzaXplKChlKj0yKT5iP2U6Yik7Yi09ZDtuLmVuY29kZVVURjE2dG9VVEY4KG0oYSksZnVuY3Rpb24oYSl7dGhpcy52aWV3W2IrK109YX0uYmluZCh0aGlzKSk7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Yi1mfTtlLndyaXRlU3RyaW5nPWUud3JpdGVVVEY4U3RyaW5nO2guY2FsY3VsYXRlVVRGOENoYXJzPWZ1bmN0aW9uKGEpe3JldHVybiBuLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSkpWzBdfTtoLmNhbGN1bGF0ZVVURjhCeXRlcz1mdW5jdGlvbihhKXtyZXR1cm4gbi5jYWxjdWxhdGVVVEYxNmFzVVRGOChtKGEpKVsxXX07XHJcbmguY2FsY3VsYXRlU3RyaW5nPWguY2FsY3VsYXRlVVRGOEJ5dGVzO2UucmVhZFVURjhTdHJpbmc9ZnVuY3Rpb24oYSxiLGMpe1wibnVtYmVyXCI9PT10eXBlb2YgYiYmKGM9YixiPXZvaWQgMCk7dmFyIGQ9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjO2QmJihjPXRoaXMub2Zmc2V0KTtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGImJihiPWguTUVUUklDU19DSEFSUyk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGxlbmd0aDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBjfHwwIT09YyUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitjK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yz4+Pj0wO2lmKDA+Y3x8YyswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2MrXCIgKCswKSA8PSBcIitcclxudGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBmPTAsZT1jLGc7aWYoYj09PWguTUVUUklDU19DSEFSUyl7Zz1yKCk7bi5kZWNvZGVVVEY4KGZ1bmN0aW9uKCl7cmV0dXJuIGY8YSYmYzx0aGlzLmxpbWl0P3RoaXMudmlld1tjKytdOm51bGx9LmJpbmQodGhpcyksZnVuY3Rpb24oYSl7KytmO24uVVRGOHRvVVRGMTYoYSxnKX0pO2lmKGYhPT1hKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHJhbmdlOiBUcnVuY2F0ZWQgZGF0YSwgXCIrZitcIiA9PSBcIithKTtyZXR1cm4gZD8odGhpcy5vZmZzZXQ9YyxnKCkpOntzdHJpbmc6ZygpLGxlbmd0aDpjLWV9fWlmKGI9PT1oLk1FVFJJQ1NfQllURVMpe2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGN8fDAhPT1jJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2MrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtjPj4+PTA7aWYoMD5jfHxjK2E+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrXHJcbmMrXCIgKCtcIithK1wiKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGs9YythO24uZGVjb2RlVVRGOHRvVVRGMTYoZnVuY3Rpb24oKXtyZXR1cm4gYzxrP3RoaXMudmlld1tjKytdOm51bGx9LmJpbmQodGhpcyksZz1yKCksdGhpcy5ub0Fzc2VydCk7aWYoYyE9PWspdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IFRydW5jYXRlZCBkYXRhLCBcIitjK1wiID09IFwiK2spO3JldHVybiBkPyh0aGlzLm9mZnNldD1jLGcoKSk6e3N0cmluZzpnKCksbGVuZ3RoOmMtZX19dGhyb3cgVHlwZUVycm9yKFwiVW5zdXBwb3J0ZWQgbWV0cmljczogXCIrYik7fTtlLnJlYWRTdHJpbmc9ZS5yZWFkVVRGOFN0cmluZztlLndyaXRlVlN0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHN0cjogTm90IGEgc3RyaW5nXCIpO1xyXG5pZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1iLGYsZTtmPW4uY2FsY3VsYXRlVVRGMTZhc1VURjgobShhKSx0aGlzLm5vQXNzZXJ0KVsxXTtlPWguY2FsY3VsYXRlVmFyaW50MzIoZik7Yis9ZStmO3ZhciBnPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5nJiZ0aGlzLnJlc2l6ZSgoZyo9Mik+Yj9nOmIpO2ItPWUrZjtiKz10aGlzLndyaXRlVmFyaW50MzIoZixiKTtuLmVuY29kZVVURjE2dG9VVEY4KG0oYSksZnVuY3Rpb24oYSl7dGhpcy52aWV3W2IrK109YX0uYmluZCh0aGlzKSk7aWYoYiE9PWQrZitlKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHJhbmdlOiBUcnVuY2F0ZWQgZGF0YSwgXCIrXHJcbmIrXCIgPT0gXCIrKGIrZitlKSk7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Yi1kfTtlLnJlYWRWU3RyaW5nPWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMSkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjPWEsZD10aGlzLnJlYWRWYXJpbnQzMihhKSxkPXRoaXMucmVhZFVURjhTdHJpbmcoZC52YWx1ZSxoLk1FVFJJQ1NfQllURVMsYSs9ZC5sZW5ndGgpO2ErPWQubGVuZ3RoO3JldHVybiBiPyh0aGlzLm9mZnNldD1hLGQuc3RyaW5nKTp7c3RyaW5nOmQuc3RyaW5nLFxyXG5sZW5ndGg6YS1jfX07ZS5hcHBlbmQ9ZnVuY3Rpb24oYSxiLGMpe2lmKFwibnVtYmVyXCI9PT10eXBlb2YgYnx8XCJzdHJpbmdcIiE9PXR5cGVvZiBiKWM9YixiPXZvaWQgMDt2YXIgZD1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGM7ZCYmKGM9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGN8fDAhPT1jJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2MrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtjPj4+PTA7aWYoMD5jfHxjKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYytcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31hIGluc3RhbmNlb2YgaHx8KGE9aC53cmFwKGEsYikpO2I9YS5saW1pdC1hLm9mZnNldDtpZigwPj1iKXJldHVybiB0aGlzO2MrPWI7dmFyIGY9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtjPmYmJnRoaXMucmVzaXplKChmKj0yKT5cclxuYz9mOmMpO2MtPWI7dGhpcy52aWV3LnNldChhLnZpZXcuc3ViYXJyYXkoYS5vZmZzZXQsYS5saW1pdCksYyk7YS5vZmZzZXQrPWI7ZCYmKHRoaXMub2Zmc2V0Kz1iKTtyZXR1cm4gdGhpc307ZS5hcHBlbmRUbz1mdW5jdGlvbihhLGIpe2EuYXBwZW5kKHRoaXMsYik7cmV0dXJuIHRoaXN9O2UuYXNzZXJ0PWZ1bmN0aW9uKGEpe3RoaXMubm9Bc3NlcnQ9IWE7cmV0dXJuIHRoaXN9O2UuY2FwYWNpdHk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aH07ZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMub2Zmc2V0PTA7dGhpcy5saW1pdD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO3RoaXMubWFya2VkT2Zmc2V0PS0xO3JldHVybiB0aGlzfTtlLmNsb25lPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBoKDAsdGhpcy5saXR0bGVFbmRpYW4sdGhpcy5ub0Fzc2VydCk7YT8oYi5idWZmZXI9bmV3IEFycmF5QnVmZmVyKHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpLGIudmlldz1uZXcgVWludDhBcnJheShiLmJ1ZmZlcikpOlxyXG4oYi5idWZmZXI9dGhpcy5idWZmZXIsYi52aWV3PXRoaXMudmlldyk7Yi5vZmZzZXQ9dGhpcy5vZmZzZXQ7Yi5tYXJrZWRPZmZzZXQ9dGhpcy5tYXJrZWRPZmZzZXQ7Yi5saW1pdD10aGlzLmxpbWl0O3JldHVybiBifTtlLmNvbXBhY3Q9ZnVuY3Rpb24oYSxiKXtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGEmJihhPXRoaXMub2Zmc2V0KTtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGImJihiPXRoaXMubGltaXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBiZWdpbjogTm90IGFuIGludGVnZXJcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGVuZDogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKDA+YXx8YT5ifHxiPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYStcIiA8PSBcIitcclxuYitcIiA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9aWYoMD09PWEmJmI9PT10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXJldHVybiB0aGlzO3ZhciBjPWItYTtpZigwPT09YylyZXR1cm4gdGhpcy5idWZmZXI9dix0aGlzLnZpZXc9bnVsbCwwPD10aGlzLm1hcmtlZE9mZnNldCYmKHRoaXMubWFya2VkT2Zmc2V0LT1hKSx0aGlzLmxpbWl0PXRoaXMub2Zmc2V0PTAsdGhpczt2YXIgZD1uZXcgQXJyYXlCdWZmZXIoYyksZj1uZXcgVWludDhBcnJheShkKTtmLnNldCh0aGlzLnZpZXcuc3ViYXJyYXkoYSxiKSk7dGhpcy5idWZmZXI9ZDt0aGlzLnZpZXc9ZjswPD10aGlzLm1hcmtlZE9mZnNldCYmKHRoaXMubWFya2VkT2Zmc2V0LT1hKTt0aGlzLm9mZnNldD0wO3RoaXMubGltaXQ9YztyZXR1cm4gdGhpc307ZS5jb3B5PWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PVxyXG50eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJlZ2luOiBOb3QgYW4gaW50ZWdlclwiKTthPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgZW5kOiBOb3QgYW4gaW50ZWdlclwiKTtiPj4+PTA7aWYoMD5hfHxhPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogMCA8PSBcIithK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWlmKGE9PT1iKXJldHVybiBuZXcgaCgwLHRoaXMubGl0dGxlRW5kaWFuLHRoaXMubm9Bc3NlcnQpO3ZhciBjPWItYSxkPW5ldyBoKGMsdGhpcy5saXR0bGVFbmRpYW4sdGhpcy5ub0Fzc2VydCk7ZC5vZmZzZXQ9MDtkLmxpbWl0PWM7MDw9ZC5tYXJrZWRPZmZzZXQmJihkLm1hcmtlZE9mZnNldC09YSk7dGhpcy5jb3B5VG8oZCwwLGEsYik7cmV0dXJuIGR9O2UuY29weVRvPWZ1bmN0aW9uKGEsXHJcbmIsYyxkKXt2YXIgZixlO2lmKCF0aGlzLm5vQXNzZXJ0JiYhaC5pc0J5dGVCdWZmZXIoYSkpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB0YXJnZXQ6IE5vdCBhIEJ5dGVCdWZmZXJcIik7Yj0oZT1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGIpP2Eub2Zmc2V0OmJ8MDtjPShmPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYyk/dGhpcy5vZmZzZXQ6Y3wwO2Q9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBkP3RoaXMubGltaXQ6ZHwwO2lmKDA+Ynx8Yj5hLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHRhcmdldCByYW5nZTogMCA8PSBcIitiK1wiIDw9IFwiK2EuYnVmZmVyLmJ5dGVMZW5ndGgpO2lmKDA+Y3x8ZD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHNvdXJjZSByYW5nZTogMCA8PSBcIitjK1wiIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO3ZhciBnPWQtYztpZigwPT09ZylyZXR1cm4gYTthLmVuc3VyZUNhcGFjaXR5KGIrZyk7XHJcbmEudmlldy5zZXQodGhpcy52aWV3LnN1YmFycmF5KGMsZCksYik7ZiYmKHRoaXMub2Zmc2V0Kz1nKTtlJiYoYS5vZmZzZXQrPWcpO3JldHVybiB0aGlzfTtlLmVuc3VyZUNhcGFjaXR5PWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7cmV0dXJuIGI8YT90aGlzLnJlc2l6ZSgoYio9Mik+YT9iOmEpOnRoaXN9O2UuZmlsbD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2QmJihiPXRoaXMub2Zmc2V0KTtcInN0cmluZ1wiPT09dHlwZW9mIGEmJjA8YS5sZW5ndGgmJihhPWEuY2hhckNvZGVBdCgwKSk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjJiYoYz10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthfD1cclxuMDtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBiZWdpbjogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgY3x8MCE9PWMlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGVuZDogTm90IGFuIGludGVnZXJcIik7Yz4+Pj0wO2lmKDA+Ynx8Yj5jfHxjPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYitcIiA8PSBcIitjK1wiIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31pZihiPj1jKXJldHVybiB0aGlzO2Zvcig7YjxjOyl0aGlzLnZpZXdbYisrXT1hO2QmJih0aGlzLm9mZnNldD1iKTtyZXR1cm4gdGhpc307ZS5mbGlwPWZ1bmN0aW9uKCl7dGhpcy5saW1pdD10aGlzLm9mZnNldDt0aGlzLm9mZnNldD0wO3JldHVybiB0aGlzfTtlLm1hcms9ZnVuY3Rpb24oYSl7YT1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE/dGhpcy5vZmZzZXQ6YTtcclxuaWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXRoaXMubWFya2VkT2Zmc2V0PWE7cmV0dXJuIHRoaXN9O2Uub3JkZXI9ZnVuY3Rpb24oYSl7aWYoIXRoaXMubm9Bc3NlcnQmJlwiYm9vbGVhblwiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBsaXR0bGVFbmRpYW46IE5vdCBhIGJvb2xlYW5cIik7dGhpcy5saXR0bGVFbmRpYW49ISFhO3JldHVybiB0aGlzfTtlLkxFPWZ1bmN0aW9uKGEpe3RoaXMubGl0dGxlRW5kaWFuPVwidW5kZWZpbmVkXCIhPT10eXBlb2YgYT8hIWE6ITA7cmV0dXJuIHRoaXN9O2UuQkU9ZnVuY3Rpb24oYSl7dGhpcy5saXR0bGVFbmRpYW49XHJcblwidW5kZWZpbmVkXCIhPT10eXBlb2YgYT8hYTohMTtyZXR1cm4gdGhpc307ZS5wcmVwZW5kPWZ1bmN0aW9uKGEsYixjKXtpZihcIm51bWJlclwiPT09dHlwZW9mIGJ8fFwic3RyaW5nXCIhPT10eXBlb2YgYiljPWIsYj12b2lkIDA7dmFyIGQ9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjO2QmJihjPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBjfHwwIT09YyUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitjK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yz4+Pj0wO2lmKDA+Y3x8YyswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2MrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9YSBpbnN0YW5jZW9mIGh8fChhPWgud3JhcChhLGIpKTtiPWEubGltaXQtYS5vZmZzZXQ7aWYoMD49YilyZXR1cm4gdGhpczt2YXIgZj1iLWM7aWYoMDxmKXt2YXIgZT1uZXcgQXJyYXlCdWZmZXIodGhpcy5idWZmZXIuYnl0ZUxlbmd0aCtcclxuZiksZz1uZXcgVWludDhBcnJheShlKTtnLnNldCh0aGlzLnZpZXcuc3ViYXJyYXkoYyx0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSxiKTt0aGlzLmJ1ZmZlcj1lO3RoaXMudmlldz1nO3RoaXMub2Zmc2V0Kz1mOzA8PXRoaXMubWFya2VkT2Zmc2V0JiYodGhpcy5tYXJrZWRPZmZzZXQrPWYpO3RoaXMubGltaXQrPWY7Yys9Zn1lbHNlIG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyKTt0aGlzLnZpZXcuc2V0KGEudmlldy5zdWJhcnJheShhLm9mZnNldCxhLmxpbWl0KSxjLWIpO2Eub2Zmc2V0PWEubGltaXQ7ZCYmKHRoaXMub2Zmc2V0LT1iKTtyZXR1cm4gdGhpc307ZS5wcmVwZW5kVG89ZnVuY3Rpb24oYSxiKXthLnByZXBlbmQodGhpcyxiKTtyZXR1cm4gdGhpc307ZS5wcmludERlYnVnPWZ1bmN0aW9uKGEpe1wiZnVuY3Rpb25cIiE9PXR5cGVvZiBhJiYoYT1jb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpKTthKHRoaXMudG9TdHJpbmcoKStcIlxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cIitcclxudGhpcy50b0RlYnVnKCEwKSl9O2UucmVtYWluaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubGltaXQtdGhpcy5vZmZzZXR9O2UucmVzZXQ9ZnVuY3Rpb24oKXswPD10aGlzLm1hcmtlZE9mZnNldD8odGhpcy5vZmZzZXQ9dGhpcy5tYXJrZWRPZmZzZXQsdGhpcy5tYXJrZWRPZmZzZXQ9LTEpOnRoaXMub2Zmc2V0PTA7cmV0dXJuIHRoaXN9O2UucmVzaXplPWZ1bmN0aW9uKGEpe2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBjYXBhY2l0eTogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoMD5hKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIGNhcGFjaXR5OiAwIDw9IFwiK2EpO31pZih0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoPGEpe2E9bmV3IEFycmF5QnVmZmVyKGEpO3ZhciBiPW5ldyBVaW50OEFycmF5KGEpO2Iuc2V0KHRoaXMudmlldyk7dGhpcy5idWZmZXI9YTt0aGlzLnZpZXc9Yn1yZXR1cm4gdGhpc307XHJcbmUucmV2ZXJzZT1mdW5jdGlvbihhLGIpe1widW5kZWZpbmVkXCI9PT10eXBlb2YgYSYmKGE9dGhpcy5vZmZzZXQpO1widW5kZWZpbmVkXCI9PT10eXBlb2YgYiYmKGI9dGhpcy5saW1pdCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJlZ2luOiBOb3QgYW4gaW50ZWdlclwiKTthPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgZW5kOiBOb3QgYW4gaW50ZWdlclwiKTtiPj4+PTA7aWYoMD5hfHxhPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogMCA8PSBcIithK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWlmKGE9PT1iKXJldHVybiB0aGlzO0FycmF5LnByb3RvdHlwZS5yZXZlcnNlLmNhbGwodGhpcy52aWV3LnN1YmFycmF5KGEsYikpO3JldHVybiB0aGlzfTtcclxuZS5za2lwPWZ1bmN0aW9uKGEpe2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBsZW5ndGg6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthfD0wfXZhciBiPXRoaXMub2Zmc2V0K2E7aWYoIXRoaXMubm9Bc3NlcnQmJigwPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgbGVuZ3RoOiAwIDw9IFwiK3RoaXMub2Zmc2V0K1wiICsgXCIrYStcIiA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt0aGlzLm9mZnNldD1iO3JldHVybiB0aGlzfTtlLnNsaWNlPWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgYmVnaW46IE5vdCBhbiBpbnRlZ2VyXCIpO1xyXG5hPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgZW5kOiBOb3QgYW4gaW50ZWdlclwiKTtiPj4+PTA7aWYoMD5hfHxhPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogMCA8PSBcIithK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjPXRoaXMuY2xvbmUoKTtjLm9mZnNldD1hO2MubGltaXQ9YjtyZXR1cm4gY307ZS50b0J1ZmZlcj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLm9mZnNldCxjPXRoaXMubGltaXQ7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgY3x8MCE9PWMlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGxpbWl0OiBOb3QgYW4gaW50ZWdlclwiKTtcclxuYz4+Pj0wO2lmKDA+Ynx8Yj5jfHxjPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYitcIiA8PSBcIitjK1wiIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31pZighYSYmMD09PWImJmM9PT10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXJldHVybiB0aGlzLmJ1ZmZlcjtpZihiPT09YylyZXR1cm4gdjthPW5ldyBBcnJheUJ1ZmZlcihjLWIpOyhuZXcgVWludDhBcnJheShhKSkuc2V0KChuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlcikpLnN1YmFycmF5KGIsYyksMCk7cmV0dXJuIGF9O2UudG9BcnJheUJ1ZmZlcj1lLnRvQnVmZmVyO2UudG9TdHJpbmc9ZnVuY3Rpb24oYSxiLGMpe2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgYSlyZXR1cm5cIkJ5dGVCdWZmZXJBQihvZmZzZXQ9XCIrdGhpcy5vZmZzZXQrXCIsbWFya2VkT2Zmc2V0PVwiK3RoaXMubWFya2VkT2Zmc2V0K1wiLGxpbWl0PVwiK3RoaXMubGltaXQrXCIsY2FwYWNpdHk9XCIrdGhpcy5jYXBhY2l0eSgpK1xyXG5cIilcIjtcIm51bWJlclwiPT09dHlwZW9mIGEmJihjPWI9YT1cInV0ZjhcIik7c3dpdGNoKGEpe2Nhc2UgXCJ1dGY4XCI6cmV0dXJuIHRoaXMudG9VVEY4KGIsYyk7Y2FzZSBcImJhc2U2NFwiOnJldHVybiB0aGlzLnRvQmFzZTY0KGIsYyk7Y2FzZSBcImhleFwiOnJldHVybiB0aGlzLnRvSGV4KGIsYyk7Y2FzZSBcImJpbmFyeVwiOnJldHVybiB0aGlzLnRvQmluYXJ5KGIsYyk7Y2FzZSBcImRlYnVnXCI6cmV0dXJuIHRoaXMudG9EZWJ1ZygpO2Nhc2UgXCJjb2x1bW5zXCI6cmV0dXJuIHRoaXMudG9Db2x1bW5zKCk7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVuc3VwcG9ydGVkIGVuY29kaW5nOiBcIithKTt9fTt2YXIgeD1mdW5jdGlvbigpe2Zvcih2YXIgYT17fSxiPVs2NSw2Niw2Nyw2OCw2OSw3MCw3MSw3Miw3Myw3NCw3NSw3Niw3Nyw3OCw3OSw4MCw4MSw4Miw4Myw4NCw4NSw4Niw4Nyw4OCw4OSw5MCw5Nyw5OCw5OSwxMDAsMTAxLDEwMiwxMDMsMTA0LDEwNSwxMDYsMTA3LDEwOCwxMDksMTEwLDExMSwxMTIsMTEzLFxyXG4xMTQsMTE1LDExNiwxMTcsMTE4LDExOSwxMjAsMTIxLDEyMiw0OCw0OSw1MCw1MSw1Miw1Myw1NCw1NSw1Niw1Nyw0Myw0N10sYz1bXSxkPTAsZj1iLmxlbmd0aDtkPGY7KytkKWNbYltkXV09ZDthLmVuY29kZT1mdW5jdGlvbihhLGMpe2Zvcih2YXIgZCxmO251bGwhPT0oZD1hKCkpOyljKGJbZD4+MiY2M10pLGY9KGQmMyk8PDQsbnVsbCE9PShkPWEoKSk/KGZ8PWQ+PjQmMTUsYyhiWyhmfGQ+PjQmMTUpJjYzXSksZj0oZCYxNSk8PDIsbnVsbCE9PShkPWEoKSk/KGMoYlsoZnxkPj42JjMpJjYzXSksYyhiW2QmNjNdKSk6KGMoYltmJjYzXSksYyg2MSkpKTooYyhiW2YmNjNdKSxjKDYxKSxjKDYxKSl9O2EuZGVjb2RlPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZChhKXt0aHJvdyBFcnJvcihcIklsbGVnYWwgY2hhcmFjdGVyIGNvZGU6IFwiK2EpO31mb3IodmFyIGYsZSxoO251bGwhPT0oZj1hKCkpOylpZihlPWNbZl0sXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBlJiZkKGYpLG51bGwhPT0oZj1hKCkpJiZcclxuKGg9Y1tmXSxcInVuZGVmaW5lZFwiPT09dHlwZW9mIGgmJmQoZiksYihlPDwyPj4+MHwoaCY0OCk+PjQpLG51bGwhPT0oZj1hKCkpKSl7ZT1jW2ZdO2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgZSlpZig2MT09PWYpYnJlYWs7ZWxzZSBkKGYpO2IoKGgmMTUpPDw0Pj4+MHwoZSY2MCk+PjIpO2lmKG51bGwhPT0oZj1hKCkpKXtoPWNbZl07aWYoXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBoKWlmKDYxPT09ZilicmVhaztlbHNlIGQoZik7YigoZSYzKTw8Nj4+PjB8aCl9fX07YS50ZXN0PWZ1bmN0aW9uKGEpe3JldHVybi9eKD86W0EtWmEtejAtOSsvXXs0fSkqKD86W0EtWmEtejAtOSsvXXsyfT09fFtBLVphLXowLTkrL117M309KT8kLy50ZXN0KGEpfTtyZXR1cm4gYX0oKTtlLnRvQmFzZTY0PWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTthfD0wO2J8PTA7aWYoMD5hfHxiPnRoaXMuY2FwYWNpdHl8fFxyXG5hPmIpdGhyb3cgUmFuZ2VFcnJvcihcImJlZ2luLCBlbmRcIik7dmFyIGM7eC5lbmNvZGUoZnVuY3Rpb24oKXtyZXR1cm4gYTxiP3RoaXMudmlld1thKytdOm51bGx9LmJpbmQodGhpcyksYz1yKCkpO3JldHVybiBjKCl9O2guZnJvbUJhc2U2ND1mdW5jdGlvbihhLGIpe2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYSl0aHJvdyBUeXBlRXJyb3IoXCJzdHJcIik7dmFyIGM9bmV3IGgoYS5sZW5ndGgvNCozLGIpLGQ9MDt4LmRlY29kZShtKGEpLGZ1bmN0aW9uKGEpe2Mudmlld1tkKytdPWF9KTtjLmxpbWl0PWQ7cmV0dXJuIGN9O2guYnRvYT1mdW5jdGlvbihhKXtyZXR1cm4gaC5mcm9tQmluYXJ5KGEpLnRvQmFzZTY0KCl9O2guYXRvYj1mdW5jdGlvbihhKXtyZXR1cm4gaC5mcm9tQmFzZTY0KGEpLnRvQmluYXJ5KCl9O2UudG9CaW5hcnk9ZnVuY3Rpb24oYSxiKXtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGEmJihhPXRoaXMub2Zmc2V0KTtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGImJihiPXRoaXMubGltaXQpO1xyXG5hfD0wO2J8PTA7aWYoMD5hfHxiPnRoaXMuY2FwYWNpdHkoKXx8YT5iKXRocm93IFJhbmdlRXJyb3IoXCJiZWdpbiwgZW5kXCIpO2lmKGE9PT1iKXJldHVyblwiXCI7Zm9yKHZhciBjPVtdLGQ9W107YTxiOyljLnB1c2godGhpcy52aWV3W2ErK10pLDEwMjQ8PWMubGVuZ3RoJiYoZC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGMpKSxjPVtdKTtyZXR1cm4gZC5qb2luKFwiXCIpK1N0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGMpfTtoLmZyb21CaW5hcnk9ZnVuY3Rpb24oYSxiKXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwic3RyXCIpO2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGgsZixlPW5ldyBoKGQsYik7YzxkOyl7Zj1hLmNoYXJDb2RlQXQoYyk7aWYoMjU1PGYpdGhyb3cgUmFuZ2VFcnJvcihcImlsbGVnYWwgY2hhciBjb2RlOiBcIitmKTtlLnZpZXdbYysrXT1mfWUubGltaXQ9ZDtyZXR1cm4gZX07ZS50b0RlYnVnPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1cclxuLTEsYz10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoLGQsZj1cIlwiLGU9XCJcIixnPVwiXCI7YjxjOyl7LTEhPT1iJiYoZD10aGlzLnZpZXdbYl0sZj0xNj5kP2YrKFwiMFwiK2QudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkpOmYrZC50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSxhJiYoZSs9MzI8ZCYmMTI3PmQ/U3RyaW5nLmZyb21DaGFyQ29kZShkKTpcIi5cIikpOysrYjtpZihhJiYwPGImJjA9PT1iJTE2JiZiIT09Yyl7Zm9yKDs1MT5mLmxlbmd0aDspZis9XCIgXCI7Zys9ZitlK1wiXFxuXCI7Zj1lPVwiXCJ9Zj1iPT09dGhpcy5vZmZzZXQmJmI9PT10aGlzLmxpbWl0P2YrKGI9PT10aGlzLm1hcmtlZE9mZnNldD9cIiFcIjpcInxcIik6Yj09PXRoaXMub2Zmc2V0P2YrKGI9PT10aGlzLm1hcmtlZE9mZnNldD9cIltcIjpcIjxcIik6Yj09PXRoaXMubGltaXQ/ZisoYj09PXRoaXMubWFya2VkT2Zmc2V0P1wiXVwiOlwiPlwiKTpmKyhiPT09dGhpcy5tYXJrZWRPZmZzZXQ/XCInXCI6YXx8MCE9PWImJmIhPT1jP1wiIFwiOlwiXCIpfWlmKGEmJlwiIFwiIT09XHJcbmYpe2Zvcig7NTE+Zi5sZW5ndGg7KWYrPVwiIFwiO2crPWYrZStcIlxcblwifXJldHVybiBhP2c6Zn07aC5mcm9tRGVidWc9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEubGVuZ3RoO2I9bmV3IGgoKGQrMSkvM3wwLGIsYyk7Zm9yKHZhciBmPTAsZT0wLGcsaz0hMSxtPSExLG49ITEscD0hMSxxPSExO2Y8ZDspe3N3aXRjaChnPWEuY2hhckF0KGYrKykpe2Nhc2UgXCIhXCI6aWYoIWMpe2lmKG18fG58fHApe3E9ITA7YnJlYWt9bT1uPXA9ITB9Yi5vZmZzZXQ9Yi5tYXJrZWRPZmZzZXQ9Yi5saW1pdD1lO2s9ITE7YnJlYWs7Y2FzZSBcInxcIjppZighYyl7aWYobXx8cCl7cT0hMDticmVha31tPXA9ITB9Yi5vZmZzZXQ9Yi5saW1pdD1lO2s9ITE7YnJlYWs7Y2FzZSBcIltcIjppZighYyl7aWYobXx8bil7cT0hMDticmVha31tPW49ITB9Yi5vZmZzZXQ9Yi5tYXJrZWRPZmZzZXQ9ZTtrPSExO2JyZWFrO2Nhc2UgXCI8XCI6aWYoIWMpe2lmKG0pe3E9ITA7YnJlYWt9bT0hMH1iLm9mZnNldD1lO2s9ITE7YnJlYWs7Y2FzZSBcIl1cIjppZighYyl7aWYocHx8XHJcbm4pe3E9ITA7YnJlYWt9cD1uPSEwfWIubGltaXQ9Yi5tYXJrZWRPZmZzZXQ9ZTtrPSExO2JyZWFrO2Nhc2UgXCI+XCI6aWYoIWMpe2lmKHApe3E9ITA7YnJlYWt9cD0hMH1iLmxpbWl0PWU7az0hMTticmVhaztjYXNlIFwiJ1wiOmlmKCFjKXtpZihuKXtxPSEwO2JyZWFrfW49ITB9Yi5tYXJrZWRPZmZzZXQ9ZTtrPSExO2JyZWFrO2Nhc2UgXCIgXCI6az0hMTticmVhaztkZWZhdWx0OmlmKCFjJiZrKXtxPSEwO2JyZWFrfWc9cGFyc2VJbnQoZythLmNoYXJBdChmKyspLDE2KTtpZighYyYmKGlzTmFOKGcpfHwwPmd8fDI1NTxnKSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHN0cjogTm90IGEgZGVidWcgZW5jb2RlZCBzdHJpbmdcIik7Yi52aWV3W2UrK109ZztrPSEwfWlmKHEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IEludmFsaWQgc3ltYm9sIGF0IFwiK2YpO31pZighYyl7aWYoIW18fCFwKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBNaXNzaW5nIG9mZnNldCBvciBsaW1pdFwiKTtcclxuaWYoZTxiLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBOb3QgYSBkZWJ1ZyBlbmNvZGVkIHN0cmluZyAoaXMgaXQgaGV4PykgXCIrZStcIiA8IFwiK2QpO31yZXR1cm4gYn07ZS50b0hleD1mdW5jdGlvbihhLGIpe2E9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhP3RoaXMub2Zmc2V0OmE7Yj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI/dGhpcy5saW1pdDpiO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBiZWdpbjogTm90IGFuIGludGVnZXJcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGVuZDogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKDA+YXx8YT5ifHxiPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYStcIiA8PSBcIitiK1wiIDw9IFwiK1xyXG50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Zm9yKHZhciBjPUFycmF5KGItYSksZDthPGI7KWQ9dGhpcy52aWV3W2ErK10sMTY+ZD9jLnB1c2goXCIwXCIsZC50b1N0cmluZygxNikpOmMucHVzaChkLnRvU3RyaW5nKDE2KSk7cmV0dXJuIGMuam9pbihcIlwiKX07aC5mcm9tSGV4PWZ1bmN0aW9uKGEsYixjKXtpZighYyl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBOb3QgYSBzdHJpbmdcIik7aWYoMCE9PWEubGVuZ3RoJTIpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IExlbmd0aCBub3QgYSBtdWx0aXBsZSBvZiAyXCIpO312YXIgZD1hLmxlbmd0aDtiPW5ldyBoKGQvMnwwLGIpO2Zvcih2YXIgZixlPTAsZz0wO2U8ZDtlKz0yKXtmPXBhcnNlSW50KGEuc3Vic3RyaW5nKGUsZSsyKSwxNik7aWYoIWMmJighaXNGaW5pdGUoZil8fDA+Znx8MjU1PGYpKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBDb250YWlucyBub24taGV4IGNoYXJhY3RlcnNcIik7XHJcbmIudmlld1tnKytdPWZ9Yi5saW1pdD1nO3JldHVybiBifTt2YXIgbj1mdW5jdGlvbigpe3ZhciBhPXtNQVhfQ09ERVBPSU5UOjExMTQxMTEsZW5jb2RlVVRGODpmdW5jdGlvbihhLGMpe3ZhciBkPW51bGw7XCJudW1iZXJcIj09PXR5cGVvZiBhJiYoZD1hLGE9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0pO2Zvcig7bnVsbCE9PWR8fG51bGwhPT0oZD1hKCkpOykxMjg+ZD9jKGQmMTI3KTooMjA0OD5kP2MoZD4+NiYzMXwxOTIpOig2NTUzNj5kP2MoZD4+MTImMTV8MjI0KTooYyhkPj4xOCY3fDI0MCksYyhkPj4xMiY2M3wxMjgpKSxjKGQ+PjYmNjN8MTI4KSksYyhkJjYzfDEyOCkpLGQ9bnVsbH0sZGVjb2RlVVRGODpmdW5jdGlvbihhLGMpe2Zvcih2YXIgZCxmLGUsZyxoPWZ1bmN0aW9uKGEpe2E9YS5zbGljZSgwLGEuaW5kZXhPZihudWxsKSk7dmFyIGI9RXJyb3IoYS50b1N0cmluZygpKTtiLm5hbWU9XCJUcnVuY2F0ZWRFcnJvclwiO2IuYnl0ZXM9YTt0aHJvdyBiO307bnVsbCE9PShkPWEoKSk7KWlmKDA9PT1cclxuKGQmMTI4KSljKGQpO2Vsc2UgaWYoMTkyPT09KGQmMjI0KSludWxsPT09KGY9YSgpKSYmaChbZCxmXSksYygoZCYzMSk8PDZ8ZiY2Myk7ZWxzZSBpZigyMjQ9PT0oZCYyNDApKW51bGwhPT0oZj1hKCkpJiZudWxsIT09KGU9YSgpKXx8aChbZCxmLGVdKSxjKChkJjE1KTw8MTJ8KGYmNjMpPDw2fGUmNjMpO2Vsc2UgaWYoMjQwPT09KGQmMjQ4KSludWxsIT09KGY9YSgpKSYmbnVsbCE9PShlPWEoKSkmJm51bGwhPT0oZz1hKCkpfHxoKFtkLGYsZSxnXSksYygoZCY3KTw8MTh8KGYmNjMpPDwxMnwoZSY2Myk8PDZ8ZyY2Myk7ZWxzZSB0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBzdGFydGluZyBieXRlOiBcIitkKTt9LFVURjE2dG9VVEY4OmZ1bmN0aW9uKGEsYyl7Zm9yKHZhciBkLGU9bnVsbDtudWxsIT09KGQ9bnVsbCE9PWU/ZTphKCkpOyk1NTI5Njw9ZCYmNTczNDM+PWQmJm51bGwhPT0oZT1hKCkpJiY1NjMyMDw9ZSYmNTczNDM+PWU/KGMoMTAyNCooZC01NTI5NikrZS01NjMyMCs2NTUzNiksXHJcbmU9bnVsbCk6YyhkKTtudWxsIT09ZSYmYyhlKX0sVVRGOHRvVVRGMTY6ZnVuY3Rpb24oYSxjKXt2YXIgZD1udWxsO1wibnVtYmVyXCI9PT10eXBlb2YgYSYmKGQ9YSxhPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9KTtmb3IoO251bGwhPT1kfHxudWxsIT09KGQ9YSgpKTspNjU1MzU+PWQ/YyhkKTooZC09NjU1MzYsYygoZD4+MTApKzU1Mjk2KSxjKGQlMTAyNCs1NjMyMCkpLGQ9bnVsbH0sZW5jb2RlVVRGMTZ0b1VURjg6ZnVuY3Rpb24oYixjKXthLlVURjE2dG9VVEY4KGIsZnVuY3Rpb24oYil7YS5lbmNvZGVVVEY4KGIsYyl9KX0sZGVjb2RlVVRGOHRvVVRGMTY6ZnVuY3Rpb24oYixjKXthLmRlY29kZVVURjgoYixmdW5jdGlvbihiKXthLlVURjh0b1VURjE2KGIsYyl9KX0sY2FsY3VsYXRlQ29kZVBvaW50OmZ1bmN0aW9uKGEpe3JldHVybiAxMjg+YT8xOjIwNDg+YT8yOjY1NTM2PmE/Mzo0fSxjYWxjdWxhdGVVVEY4OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxkPTA7bnVsbCE9PShjPWEoKSk7KWQrPVxyXG4xMjg+Yz8xOjIwNDg+Yz8yOjY1NTM2PmM/Mzo0O3JldHVybiBkfSxjYWxjdWxhdGVVVEYxNmFzVVRGODpmdW5jdGlvbihiKXt2YXIgYz0wLGQ9MDthLlVURjE2dG9VVEY4KGIsZnVuY3Rpb24oYSl7KytjO2QrPTEyOD5hPzE6MjA0OD5hPzI6NjU1MzY+YT8zOjR9KTtyZXR1cm5bYyxkXX19O3JldHVybiBhfSgpO2UudG9VVEY4PWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgYmVnaW46IE5vdCBhbiBpbnRlZ2VyXCIpO2E+Pj49MDtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBlbmQ6IE5vdCBhbiBpbnRlZ2VyXCIpO2I+Pj49MDtpZigwPmF8fGE+Ynx8Yj50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHJhbmdlOiAwIDw9IFwiK1xyXG5hK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjO3RyeXtuLmRlY29kZVVURjh0b1VURjE2KGZ1bmN0aW9uKCl7cmV0dXJuIGE8Yj90aGlzLnZpZXdbYSsrXTpudWxsfS5iaW5kKHRoaXMpLGM9cigpKX1jYXRjaChkKXtpZihhIT09Yil0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogVHJ1bmNhdGVkIGRhdGEsIFwiK2ErXCIgIT0gXCIrYik7fXJldHVybiBjKCl9O2guZnJvbVVURjg9ZnVuY3Rpb24oYSxiLGMpe2lmKCFjJiZcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IE5vdCBhIHN0cmluZ1wiKTt2YXIgZD1uZXcgaChuLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSksITApWzFdLGIsYyksZT0wO24uZW5jb2RlVVRGMTZ0b1VURjgobShhKSxmdW5jdGlvbihhKXtkLnZpZXdbZSsrXT1hfSk7ZC5saW1pdD1lO3JldHVybiBkfTtyZXR1cm4gaH0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2MubmV0bWFuYWdlci5pbml0KCk7XHJcbiAgICAgICAgY2MubmV0bWFuYWdlci5yZWdpc3RlckhhbmRsZXIoY2MuZ3VpbWFuYWdlcik7XHJcbiAgICAgICAgY2Muc2NlbmVtYW5hZ2VyLmxvYWRMb2dpblNjZW5lKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCIvKlxyXG4gQ29weXJpZ2h0IDIwMTMgRGFuaWVsIFdpcnR6IDxkY29kZUBkY29kZS5pbz5cclxuIENvcHlyaWdodCAyMDA5IFRoZSBDbG9zdXJlIExpYnJhcnkgQXV0aG9ycy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuXHJcbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcblxyXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUy1JU1wiIEJBU0lTLFxyXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG4vKipcclxuICogQGxpY2Vuc2UgbG9uZy5qcyAoYykgMjAxMyBEYW5pZWwgV2lydHogPGRjb2RlQGRjb2RlLmlvPlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wXHJcbiAqIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Rjb2RlSU8vbG9uZy5qcyBmb3IgZGV0YWlsc1xyXG4gKi9cclxuKGZ1bmN0aW9uKGdsb2JhbCwgZmFjdG9yeSkge1xyXG5cclxuICAgIC8qIEFNRCAqLyBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbXCJhbWRcIl0pXHJcbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcclxuICAgIC8qIENvbW1vbkpTICovIGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlICYmIG1vZHVsZVtcImV4cG9ydHNcIl0pXHJcbiAgICAgICAgbW9kdWxlW1wiZXhwb3J0c1wiXSA9IGZhY3RvcnkoKTtcclxuICAgIC8qIEdsb2JhbCAqLyBlbHNlXHJcbiAgICAgICAgKGdsb2JhbFtcImRjb2RlSU9cIl0gPSBnbG9iYWxbXCJkY29kZUlPXCJdIHx8IHt9KVtcIkxvbmdcIl0gPSBmYWN0b3J5KCk7XHJcblxyXG59KSh0aGlzLCBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIDY0IGJpdCB0d28ncy1jb21wbGVtZW50IGludGVnZXIsIGdpdmVuIGl0cyBsb3cgYW5kIGhpZ2ggMzIgYml0IHZhbHVlcyBhcyAqc2lnbmVkKiBpbnRlZ2Vycy5cclxuICAgICAqICBTZWUgdGhlIGZyb20qIGZ1bmN0aW9ucyBiZWxvdyBmb3IgbW9yZSBjb252ZW5pZW50IHdheXMgb2YgY29uc3RydWN0aW5nIExvbmdzLlxyXG4gICAgICogQGV4cG9ydHMgTG9uZ1xyXG4gICAgICogQGNsYXNzIEEgTG9uZyBjbGFzcyBmb3IgcmVwcmVzZW50aW5nIGEgNjQgYml0IHR3bydzLWNvbXBsZW1lbnQgaW50ZWdlciB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb3cgVGhlIGxvdyAoc2lnbmVkKSAzMiBiaXRzIG9mIHRoZSBsb25nXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGlnaCBUaGUgaGlnaCAoc2lnbmVkKSAzMiBiaXRzIG9mIHRoZSBsb25nXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZCBXaGV0aGVyIHVuc2lnbmVkIG9yIG5vdCwgZGVmYXVsdHMgdG8gYGZhbHNlYCBmb3Igc2lnbmVkXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTG9uZyhsb3csIGhpZ2gsIHVuc2lnbmVkKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBsb3cgMzIgYml0cyBhcyBhIHNpZ25lZCB2YWx1ZS5cclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxvdyA9IGxvdyB8IDA7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBoaWdoIDMyIGJpdHMgYXMgYSBzaWduZWQgdmFsdWUuXHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5oaWdoID0gaGlnaCB8IDA7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LlxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuc2lnbmVkID0gISF1bnNpZ25lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGUgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgYSBsb25nIGlzIHRoZSB0d28gZ2l2ZW4gc2lnbmVkLCAzMi1iaXQgdmFsdWVzLlxyXG4gICAgLy8gV2UgdXNlIDMyLWJpdCBwaWVjZXMgYmVjYXVzZSB0aGVzZSBhcmUgdGhlIHNpemUgb2YgaW50ZWdlcnMgb24gd2hpY2hcclxuICAgIC8vIEphdmFzY3JpcHQgcGVyZm9ybXMgYml0LW9wZXJhdGlvbnMuICBGb3Igb3BlcmF0aW9ucyBsaWtlIGFkZGl0aW9uIGFuZFxyXG4gICAgLy8gbXVsdGlwbGljYXRpb24sIHdlIHNwbGl0IGVhY2ggbnVtYmVyIGludG8gMTYgYml0IHBpZWNlcywgd2hpY2ggY2FuIGVhc2lseSBiZVxyXG4gICAgLy8gbXVsdGlwbGllZCB3aXRoaW4gSmF2YXNjcmlwdCdzIGZsb2F0aW5nLXBvaW50IHJlcHJlc2VudGF0aW9uIHdpdGhvdXQgb3ZlcmZsb3dcclxuICAgIC8vIG9yIGNoYW5nZSBpbiBzaWduLlxyXG4gICAgLy9cclxuICAgIC8vIEluIHRoZSBhbGdvcml0aG1zIGJlbG93LCB3ZSBmcmVxdWVudGx5IHJlZHVjZSB0aGUgbmVnYXRpdmUgY2FzZSB0byB0aGVcclxuICAgIC8vIHBvc2l0aXZlIGNhc2UgYnkgbmVnYXRpbmcgdGhlIGlucHV0KHMpIGFuZCB0aGVuIHBvc3QtcHJvY2Vzc2luZyB0aGUgcmVzdWx0LlxyXG4gICAgLy8gTm90ZSB0aGF0IHdlIG11c3QgQUxXQVlTIGNoZWNrIHNwZWNpYWxseSB3aGV0aGVyIHRob3NlIHZhbHVlcyBhcmUgTUlOX1ZBTFVFXHJcbiAgICAvLyAoLTJeNjMpIGJlY2F1c2UgLU1JTl9WQUxVRSA9PSBNSU5fVkFMVUUgKHNpbmNlIDJeNjMgY2Fubm90IGJlIHJlcHJlc2VudGVkIGFzXHJcbiAgICAvLyBhIHBvc2l0aXZlIG51bWJlciwgaXQgb3ZlcmZsb3dzIGJhY2sgaW50byBhIG5lZ2F0aXZlKS4gIE5vdCBoYW5kbGluZyB0aGlzXHJcbiAgICAvLyBjYXNlIHdvdWxkIG9mdGVuIHJlc3VsdCBpbiBpbmZpbml0ZSByZWN1cnNpb24uXHJcbiAgICAvL1xyXG4gICAgLy8gQ29tbW9uIGNvbnN0YW50IHZhbHVlcyBaRVJPLCBPTkUsIE5FR19PTkUsIGV0Yy4gYXJlIGRlZmluZWQgYmVsb3cgdGhlIGZyb20qXHJcbiAgICAvLyBtZXRob2RzIG9uIHdoaWNoIHRoZXkgZGVwZW5kLlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gaW5kaWNhdG9yIHVzZWQgdG8gcmVsaWFibHkgZGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIExvbmcgb3Igbm90LlxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIExvbmcucHJvdG90eXBlLl9faXNMb25nX187XHJcblxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExvbmcucHJvdG90eXBlLCBcIl9faXNMb25nX19cIiwge1xyXG4gICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyp9IG9iaiBPYmplY3RcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGlzTG9uZyhvYmopIHtcclxuICAgICAgICByZXR1cm4gKG9iaiAmJiBvYmpbXCJfX2lzTG9uZ19fXCJdKSA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGlzIGEgTG9uZy5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHsqfSBvYmogT2JqZWN0XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5pc0xvbmcgPSBpc0xvbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIGNhY2hlIG9mIHRoZSBMb25nIHJlcHJlc2VudGF0aW9ucyBvZiBzbWFsbCBpbnRlZ2VyIHZhbHVlcy5cclxuICAgICAqIEB0eXBlIHshT2JqZWN0fVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBJTlRfQ0FDSEUgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgY2FjaGUgb2YgdGhlIExvbmcgcmVwcmVzZW50YXRpb25zIG9mIHNtYWxsIHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLlxyXG4gICAgICogQHR5cGUgeyFPYmplY3R9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFVJTlRfQ0FDSEUgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWRcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmcm9tSW50KHZhbHVlLCB1bnNpZ25lZCkge1xyXG4gICAgICAgIHZhciBvYmosIGNhY2hlZE9iaiwgY2FjaGU7XHJcbiAgICAgICAgaWYgKHVuc2lnbmVkKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID4+Pj0gMDtcclxuICAgICAgICAgICAgaWYgKGNhY2hlID0gKDAgPD0gdmFsdWUgJiYgdmFsdWUgPCAyNTYpKSB7XHJcbiAgICAgICAgICAgICAgICBjYWNoZWRPYmogPSBVSU5UX0NBQ0hFW3ZhbHVlXTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZWRPYmopXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlZE9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvYmogPSBmcm9tQml0cyh2YWx1ZSwgKHZhbHVlIHwgMCkgPCAwID8gLTEgOiAwLCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlKVxyXG4gICAgICAgICAgICAgICAgVUlOVF9DQUNIRVt2YWx1ZV0gPSBvYmo7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsdWUgfD0gMDtcclxuICAgICAgICAgICAgaWYgKGNhY2hlID0gKC0xMjggPD0gdmFsdWUgJiYgdmFsdWUgPCAxMjgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYWNoZWRPYmogPSBJTlRfQ0FDSEVbdmFsdWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlZE9iailcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVkT2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9iaiA9IGZyb21CaXRzKHZhbHVlLCB2YWx1ZSA8IDAgPyAtMSA6IDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlKVxyXG4gICAgICAgICAgICAgICAgSU5UX0NBQ0hFW3ZhbHVlXSA9IG9iajtcclxuICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgTG9uZyByZXByZXNlbnRpbmcgdGhlIGdpdmVuIDMyIGJpdCBpbnRlZ2VyIHZhbHVlLlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgVGhlIDMyIGJpdCBpbnRlZ2VyIGluIHF1ZXN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZCBXaGV0aGVyIHVuc2lnbmVkIG9yIG5vdCwgZGVmYXVsdHMgdG8gYGZhbHNlYCBmb3Igc2lnbmVkXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFRoZSBjb3JyZXNwb25kaW5nIExvbmcgdmFsdWVcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5mcm9tSW50ID0gZnJvbUludDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWRcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmcm9tTnVtYmVyKHZhbHVlLCB1bnNpZ25lZCkge1xyXG4gICAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHVuc2lnbmVkID8gVVpFUk8gOiBaRVJPO1xyXG4gICAgICAgIGlmICh1bnNpZ25lZCkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVaRVJPO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPj0gVFdPX1BXUl82NF9EQkwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTUFYX1VOU0lHTkVEX1ZBTFVFO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8PSAtVFdPX1BXUl82M19EQkwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTUlOX1ZBTFVFO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgKyAxID49IFRXT19QV1JfNjNfREJMKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1BWF9WQUxVRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMClcclxuICAgICAgICAgICAgcmV0dXJuIGZyb21OdW1iZXIoLXZhbHVlLCB1bnNpZ25lZCkubmVnKCk7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKCh2YWx1ZSAlIFRXT19QV1JfMzJfREJMKSB8IDAsICh2YWx1ZSAvIFRXT19QV1JfMzJfREJMKSB8IDAsIHVuc2lnbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBMb25nIHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gdmFsdWUsIHByb3ZpZGVkIHRoYXQgaXQgaXMgYSBmaW5pdGUgbnVtYmVyLiBPdGhlcndpc2UsIHplcm8gaXMgcmV0dXJuZWQuXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBUaGUgbnVtYmVyIGluIHF1ZXN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZCBXaGV0aGVyIHVuc2lnbmVkIG9yIG5vdCwgZGVmYXVsdHMgdG8gYGZhbHNlYCBmb3Igc2lnbmVkXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFRoZSBjb3JyZXNwb25kaW5nIExvbmcgdmFsdWVcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5mcm9tTnVtYmVyID0gZnJvbU51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb3dCaXRzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGlnaEJpdHNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZnJvbUJpdHMobG93Qml0cywgaGlnaEJpdHMsIHVuc2lnbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMb25nKGxvd0JpdHMsIGhpZ2hCaXRzLCB1bnNpZ25lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgTG9uZyByZXByZXNlbnRpbmcgdGhlIDY0IGJpdCBpbnRlZ2VyIHRoYXQgY29tZXMgYnkgY29uY2F0ZW5hdGluZyB0aGUgZ2l2ZW4gbG93IGFuZCBoaWdoIGJpdHMuIEVhY2ggaXNcclxuICAgICAqICBhc3N1bWVkIHRvIHVzZSAzMiBiaXRzLlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG93Qml0cyBUaGUgbG93IDMyIGJpdHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoaWdoQml0cyBUaGUgaGlnaCAzMiBiaXRzXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZCBXaGV0aGVyIHVuc2lnbmVkIG9yIG5vdCwgZGVmYXVsdHMgdG8gYGZhbHNlYCBmb3Igc2lnbmVkXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFRoZSBjb3JyZXNwb25kaW5nIExvbmcgdmFsdWVcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5mcm9tQml0cyA9IGZyb21CaXRzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmFzZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGV4cG9uZW50XHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBwb3dfZGJsID0gTWF0aC5wb3c7IC8vIFVzZWQgNCB0aW1lcyAoNCo4IHRvIDE1KzQpXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgICAgKiBAcGFyYW0geyhib29sZWFufG51bWJlcik9fSB1bnNpZ25lZFxyXG4gICAgICogQHBhcmFtIHtudW1iZXI9fSByYWRpeFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZyb21TdHJpbmcoc3RyLCB1bnNpZ25lZCwgcmFkaXgpIHtcclxuICAgICAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2VtcHR5IHN0cmluZycpO1xyXG4gICAgICAgIGlmIChzdHIgPT09IFwiTmFOXCIgfHwgc3RyID09PSBcIkluZmluaXR5XCIgfHwgc3RyID09PSBcIitJbmZpbml0eVwiIHx8IHN0ciA9PT0gXCItSW5maW5pdHlcIilcclxuICAgICAgICAgICAgcmV0dXJuIFpFUk87XHJcbiAgICAgICAgaWYgKHR5cGVvZiB1bnNpZ25lZCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgLy8gRm9yIGdvb2cubWF0aC5sb25nIGNvbXBhdGliaWxpdHlcclxuICAgICAgICAgICAgcmFkaXggPSB1bnNpZ25lZCxcclxuICAgICAgICAgICAgdW5zaWduZWQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1bnNpZ25lZCA9ICEhIHVuc2lnbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByYWRpeCA9IHJhZGl4IHx8IDEwO1xyXG4gICAgICAgIGlmIChyYWRpeCA8IDIgfHwgMzYgPCByYWRpeClcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcigncmFkaXgnKTtcclxuXHJcbiAgICAgICAgdmFyIHA7XHJcbiAgICAgICAgaWYgKChwID0gc3RyLmluZGV4T2YoJy0nKSkgPiAwKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignaW50ZXJpb3IgaHlwaGVuJyk7XHJcbiAgICAgICAgZWxzZSBpZiAocCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnJvbVN0cmluZyhzdHIuc3Vic3RyaW5nKDEpLCB1bnNpZ25lZCwgcmFkaXgpLm5lZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRG8gc2V2ZXJhbCAoOCkgZGlnaXRzIGVhY2ggdGltZSB0aHJvdWdoIHRoZSBsb29wLCBzbyBhcyB0b1xyXG4gICAgICAgIC8vIG1pbmltaXplIHRoZSBjYWxscyB0byB0aGUgdmVyeSBleHBlbnNpdmUgZW11bGF0ZWQgZGl2LlxyXG4gICAgICAgIHZhciByYWRpeFRvUG93ZXIgPSBmcm9tTnVtYmVyKHBvd19kYmwocmFkaXgsIDgpKTtcclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFpFUk87XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpICs9IDgpIHtcclxuICAgICAgICAgICAgdmFyIHNpemUgPSBNYXRoLm1pbig4LCBzdHIubGVuZ3RoIC0gaSksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoaSwgaSArIHNpemUpLCByYWRpeCk7XHJcbiAgICAgICAgICAgIGlmIChzaXplIDwgOCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvd2VyID0gZnJvbU51bWJlcihwb3dfZGJsKHJhZGl4LCBzaXplKSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQubXVsKHBvd2VyKS5hZGQoZnJvbU51bWJlcih2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Lm11bChyYWRpeFRvUG93ZXIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmFkZChmcm9tTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0LnVuc2lnbmVkID0gdW5zaWduZWQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBMb25nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBzdHJpbmcsIHdyaXR0ZW4gdXNpbmcgdGhlIHNwZWNpZmllZCByYWRpeC5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgTG9uZ1xyXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxudW1iZXIpPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIHNpZ25lZFxyXG4gICAgICogQHBhcmFtIHtudW1iZXI9fSByYWRpeCBUaGUgcmFkaXggaW4gd2hpY2ggdGhlIHRleHQgaXMgd3JpdHRlbiAoMi0zNiksIGRlZmF1bHRzIHRvIDEwXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFRoZSBjb3JyZXNwb25kaW5nIExvbmcgdmFsdWVcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5mcm9tU3RyaW5nID0gZnJvbVN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfCF7bG93OiBudW1iZXIsIGhpZ2g6IG51bWJlciwgdW5zaWduZWQ6IGJvb2xlYW59fSB2YWxcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmcm9tVmFsdWUodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbCAvKiBpcyBjb21wYXRpYmxlICovIGluc3RhbmNlb2YgTG9uZylcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tTnVtYmVyKHZhbCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICByZXR1cm4gZnJvbVN0cmluZyh2YWwpO1xyXG4gICAgICAgIC8vIFRocm93cyBmb3Igbm9uLW9iamVjdHMsIGNvbnZlcnRzIG5vbi1pbnN0YW5jZW9mIExvbmc6XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKHZhbC5sb3csIHZhbC5oaWdoLCB2YWwudW5zaWduZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhlIHNwZWNpZmllZCB2YWx1ZSB0byBhIExvbmcuXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ3whe2xvdzogbnVtYmVyLCBoaWdoOiBudW1iZXIsIHVuc2lnbmVkOiBib29sZWFufX0gdmFsIFZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuZnJvbVZhbHVlID0gZnJvbVZhbHVlO1xyXG5cclxuICAgIC8vIE5PVEU6IHRoZSBjb21waWxlciBzaG91bGQgaW5saW5lIHRoZXNlIGNvbnN0YW50IHZhbHVlcyBiZWxvdyBhbmQgdGhlbiByZW1vdmUgdGhlc2UgdmFyaWFibGVzLCBzbyB0aGVyZSBzaG91bGQgYmVcclxuICAgIC8vIG5vIHJ1bnRpbWUgcGVuYWx0eSBmb3IgdGhlc2UuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFRXT19QV1JfMTZfREJMID0gMSA8PCAxNjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgVFdPX1BXUl8yNF9EQkwgPSAxIDw8IDI0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBUV09fUFdSXzMyX0RCTCA9IFRXT19QV1JfMTZfREJMICogVFdPX1BXUl8xNl9EQkw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFRXT19QV1JfNjRfREJMID0gVFdPX1BXUl8zMl9EQkwgKiBUV09fUFdSXzMyX0RCTDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgVFdPX1BXUl82M19EQkwgPSBUV09fUFdSXzY0X0RCTCAvIDI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgVFdPX1BXUl8yNCA9IGZyb21JbnQoVFdPX1BXUl8yNF9EQkwpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBaRVJPID0gZnJvbUludCgwKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNpZ25lZCB6ZXJvLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLlpFUk8gPSBaRVJPO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBVWkVSTyA9IGZyb21JbnQoMCwgdHJ1ZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnNpZ25lZCB6ZXJvLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLlVaRVJPID0gVVpFUk87XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIE9ORSA9IGZyb21JbnQoMSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaWduZWQgb25lLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLk9ORSA9IE9ORTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgVU9ORSA9IGZyb21JbnQoMSwgdHJ1ZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnNpZ25lZCBvbmUuXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuVU9ORSA9IFVPTkU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIE5FR19PTkUgPSBmcm9tSW50KC0xKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNpZ25lZCBuZWdhdGl2ZSBvbmUuXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuTkVHX09ORSA9IE5FR19PTkU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIE1BWF9WQUxVRSA9IGZyb21CaXRzKDB4RkZGRkZGRkZ8MCwgMHg3RkZGRkZGRnwwLCBmYWxzZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXhpbXVtIHNpZ25lZCB2YWx1ZS5cclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5NQVhfVkFMVUUgPSBNQVhfVkFMVUU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIE1BWF9VTlNJR05FRF9WQUxVRSA9IGZyb21CaXRzKDB4RkZGRkZGRkZ8MCwgMHhGRkZGRkZGRnwwLCB0cnVlKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1heGltdW0gdW5zaWduZWQgdmFsdWUuXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuTUFYX1VOU0lHTkVEX1ZBTFVFID0gTUFYX1VOU0lHTkVEX1ZBTFVFO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBNSU5fVkFMVUUgPSBmcm9tQml0cygwLCAweDgwMDAwMDAwfDAsIGZhbHNlKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1pbmltdW0gc2lnbmVkIHZhbHVlLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLk1JTl9WQUxVRSA9IE1JTl9WQUxVRTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBhbGlhcyBMb25nLnByb3RvdHlwZVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBMb25nUHJvdG90eXBlID0gTG9uZy5wcm90b3R5cGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGUgTG9uZyB0byBhIDMyIGJpdCBpbnRlZ2VyLCBhc3N1bWluZyBpdCBpcyBhIDMyIGJpdCBpbnRlZ2VyLlxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS50b0ludCA9IGZ1bmN0aW9uIHRvSW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuc2lnbmVkID8gdGhpcy5sb3cgPj4+IDAgOiB0aGlzLmxvdztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGUgTG9uZyB0byBhIHRoZSBuZWFyZXN0IGZsb2F0aW5nLXBvaW50IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdmFsdWUgKGRvdWJsZSwgNTMgYml0IG1hbnRpc3NhKS5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUudG9OdW1iZXIgPSBmdW5jdGlvbiB0b051bWJlcigpIHtcclxuICAgICAgICBpZiAodGhpcy51bnNpZ25lZClcclxuICAgICAgICAgICAgcmV0dXJuICgodGhpcy5oaWdoID4+PiAwKSAqIFRXT19QV1JfMzJfREJMKSArICh0aGlzLmxvdyA+Pj4gMCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaCAqIFRXT19QV1JfMzJfREJMICsgKHRoaXMubG93ID4+PiAwKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGUgTG9uZyB0byBhIHN0cmluZyB3cml0dGVuIGluIHRoZSBzcGVjaWZpZWQgcmFkaXguXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcj19IHJhZGl4IFJhZGl4ICgyLTM2KSwgZGVmYXVsdHMgdG8gMTBcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IElmIGByYWRpeGAgaXMgb3V0IG9mIHJhbmdlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhyYWRpeCkge1xyXG4gICAgICAgIHJhZGl4ID0gcmFkaXggfHwgMTA7XHJcbiAgICAgICAgaWYgKHJhZGl4IDwgMiB8fCAzNiA8IHJhZGl4KVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdyYWRpeCcpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzWmVybygpKVxyXG4gICAgICAgICAgICByZXR1cm4gJzAnO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTmVnYXRpdmUoKSkgeyAvLyBVbnNpZ25lZCBMb25ncyBhcmUgbmV2ZXIgbmVnYXRpdmVcclxuICAgICAgICAgICAgaWYgKHRoaXMuZXEoTUlOX1ZBTFVFKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBjaGFuZ2UgdGhlIExvbmcgdmFsdWUgYmVmb3JlIGl0IGNhbiBiZSBuZWdhdGVkLCBzbyB3ZSByZW1vdmVcclxuICAgICAgICAgICAgICAgIC8vIHRoZSBib3R0b20tbW9zdCBkaWdpdCBpbiB0aGlzIGJhc2UgYW5kIHRoZW4gcmVjdXJzZSB0byBkbyB0aGUgcmVzdC5cclxuICAgICAgICAgICAgICAgIHZhciByYWRpeExvbmcgPSBmcm9tTnVtYmVyKHJhZGl4KSxcclxuICAgICAgICAgICAgICAgICAgICBkaXYgPSB0aGlzLmRpdihyYWRpeExvbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbTEgPSBkaXYubXVsKHJhZGl4TG9uZykuc3ViKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpdi50b1N0cmluZyhyYWRpeCkgKyByZW0xLnRvSW50KCkudG9TdHJpbmcocmFkaXgpO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiAnLScgKyB0aGlzLm5lZygpLnRvU3RyaW5nKHJhZGl4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERvIHNldmVyYWwgKDYpIGRpZ2l0cyBlYWNoIHRpbWUgdGhyb3VnaCB0aGUgbG9vcCwgc28gYXMgdG9cclxuICAgICAgICAvLyBtaW5pbWl6ZSB0aGUgY2FsbHMgdG8gdGhlIHZlcnkgZXhwZW5zaXZlIGVtdWxhdGVkIGRpdi5cclxuICAgICAgICB2YXIgcmFkaXhUb1Bvd2VyID0gZnJvbU51bWJlcihwb3dfZGJsKHJhZGl4LCA2KSwgdGhpcy51bnNpZ25lZCksXHJcbiAgICAgICAgICAgIHJlbSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciByZW1EaXYgPSByZW0uZGl2KHJhZGl4VG9Qb3dlciksXHJcbiAgICAgICAgICAgICAgICBpbnR2YWwgPSByZW0uc3ViKHJlbURpdi5tdWwocmFkaXhUb1Bvd2VyKSkudG9JbnQoKSA+Pj4gMCxcclxuICAgICAgICAgICAgICAgIGRpZ2l0cyA9IGludHZhbC50b1N0cmluZyhyYWRpeCk7XHJcbiAgICAgICAgICAgIHJlbSA9IHJlbURpdjtcclxuICAgICAgICAgICAgaWYgKHJlbS5pc1plcm8oKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWdpdHMgKyByZXN1bHQ7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGRpZ2l0cy5sZW5ndGggPCA2KVxyXG4gICAgICAgICAgICAgICAgICAgIGRpZ2l0cyA9ICcwJyArIGRpZ2l0cztcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICcnICsgZGlnaXRzICsgcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGhpZ2ggMzIgYml0cyBhcyBhIHNpZ25lZCBpbnRlZ2VyLlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gU2lnbmVkIGhpZ2ggYml0c1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmdldEhpZ2hCaXRzID0gZnVuY3Rpb24gZ2V0SGlnaEJpdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBoaWdoIDMyIGJpdHMgYXMgYW4gdW5zaWduZWQgaW50ZWdlci5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFVuc2lnbmVkIGhpZ2ggYml0c1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmdldEhpZ2hCaXRzVW5zaWduZWQgPSBmdW5jdGlvbiBnZXRIaWdoQml0c1Vuc2lnbmVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2ggPj4+IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbG93IDMyIGJpdHMgYXMgYSBzaWduZWQgaW50ZWdlci5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFNpZ25lZCBsb3cgYml0c1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmdldExvd0JpdHMgPSBmdW5jdGlvbiBnZXRMb3dCaXRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvdztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBsb3cgMzIgYml0cyBhcyBhbiB1bnNpZ25lZCBpbnRlZ2VyLlxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gVW5zaWduZWQgbG93IGJpdHNcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5nZXRMb3dCaXRzVW5zaWduZWQgPSBmdW5jdGlvbiBnZXRMb3dCaXRzVW5zaWduZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG93ID4+PiAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIG51bWJlciBvZiBiaXRzIG5lZWRlZCB0byByZXByZXNlbnQgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgTG9uZy5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuZ2V0TnVtQml0c0FicyA9IGZ1bmN0aW9uIGdldE51bUJpdHNBYnMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNOZWdhdGl2ZSgpKSAvLyBVbnNpZ25lZCBMb25ncyBhcmUgbmV2ZXIgbmVnYXRpdmVcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXEoTUlOX1ZBTFVFKSA/IDY0IDogdGhpcy5uZWcoKS5nZXROdW1CaXRzQWJzKCk7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuaGlnaCAhPSAwID8gdGhpcy5oaWdoIDogdGhpcy5sb3c7XHJcbiAgICAgICAgZm9yICh2YXIgYml0ID0gMzE7IGJpdCA+IDA7IGJpdC0tKVxyXG4gICAgICAgICAgICBpZiAoKHZhbCAmICgxIDw8IGJpdCkpICE9IDApXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICByZXR1cm4gdGhpcy5oaWdoICE9IDAgPyBiaXQgKyAzMyA6IGJpdCArIDE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZXF1YWxzIHplcm8uXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5pc1plcm8gPSBmdW5jdGlvbiBpc1plcm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaCA9PT0gMCAmJiB0aGlzLmxvdyA9PT0gMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBuZWdhdGl2ZS5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmlzTmVnYXRpdmUgPSBmdW5jdGlvbiBpc05lZ2F0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy51bnNpZ25lZCAmJiB0aGlzLmhpZ2ggPCAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIHBvc2l0aXZlLlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuaXNQb3NpdGl2ZSA9IGZ1bmN0aW9uIGlzUG9zaXRpdmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudW5zaWduZWQgfHwgdGhpcy5oaWdoID49IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgb2RkLlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuaXNPZGQgPSBmdW5jdGlvbiBpc09kZCgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMubG93ICYgMSkgPT09IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgZXZlbi5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmlzRXZlbiA9IGZ1bmN0aW9uIGlzRXZlbigpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMubG93ICYgMSkgPT09IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZXF1YWxzIHRoZSBzcGVjaWZpZWQncy5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xyXG4gICAgICAgIGlmICghaXNMb25nKG90aGVyKSlcclxuICAgICAgICAgICAgb3RoZXIgPSBmcm9tVmFsdWUob3RoZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLnVuc2lnbmVkICE9PSBvdGhlci51bnNpZ25lZCAmJiAodGhpcy5oaWdoID4+PiAzMSkgPT09IDEgJiYgKG90aGVyLmhpZ2ggPj4+IDMxKSA9PT0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2ggPT09IG90aGVyLmhpZ2ggJiYgdGhpcy5sb3cgPT09IG90aGVyLmxvdztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBlcXVhbHMgdGhlIHNwZWNpZmllZCdzLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2VxdWFsc30uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmVxID0gTG9uZ1Byb3RvdHlwZS5lcXVhbHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBkaWZmZXJzIGZyb20gdGhlIHNwZWNpZmllZCdzLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubm90RXF1YWxzID0gZnVuY3Rpb24gbm90RXF1YWxzKG90aGVyKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmVxKC8qIHZhbGlkYXRlcyAqLyBvdGhlcik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZGlmZmVycyBmcm9tIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNub3RFcXVhbHN9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5uZXEgPSBMb25nUHJvdG90eXBlLm5vdEVxdWFscztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGxlc3MgdGhhbiB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbiA9IGZ1bmN0aW9uIGxlc3NUaGFuKG90aGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcCgvKiB2YWxpZGF0ZXMgKi8gb3RoZXIpIDwgMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIHNwZWNpZmllZCdzLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2xlc3NUaGFufS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubHQgPSBMb25nUHJvdG90eXBlLmxlc3NUaGFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRoZSBzcGVjaWZpZWQncy5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmxlc3NUaGFuT3JFcXVhbCA9IGZ1bmN0aW9uIGxlc3NUaGFuT3JFcXVhbChvdGhlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXAoLyogdmFsaWRhdGVzICovIG90aGVyKSA8PSAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbGVzc1RoYW5PckVxdWFsfS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubHRlID0gTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbk9yRXF1YWw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gdGhlIHNwZWNpZmllZCdzLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuZ3JlYXRlclRoYW4gPSBmdW5jdGlvbiBncmVhdGVyVGhhbihvdGhlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXAoLyogdmFsaWRhdGVzICovIG90aGVyKSA+IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNncmVhdGVyVGhhbn0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmd0ID0gTG9uZ1Byb3RvdHlwZS5ncmVhdGVyVGhhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5ncmVhdGVyVGhhbk9yRXF1YWwgPSBmdW5jdGlvbiBncmVhdGVyVGhhbk9yRXF1YWwob3RoZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wKC8qIHZhbGlkYXRlcyAqLyBvdGhlcikgPj0gMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdGhlIHNwZWNpZmllZCdzLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2dyZWF0ZXJUaGFuT3JFcXVhbH0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmd0ZSA9IExvbmdQcm90b3R5cGUuZ3JlYXRlclRoYW5PckVxdWFsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcGFyZXMgdGhpcyBMb25nJ3MgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAwIGlmIHRoZXkgYXJlIHRoZSBzYW1lLCAxIGlmIHRoZSB0aGlzIGlzIGdyZWF0ZXIgYW5kIC0xXHJcbiAgICAgKiAgaWYgdGhlIGdpdmVuIG9uZSBpcyBncmVhdGVyXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUob3RoZXIpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhvdGhlcikpXHJcbiAgICAgICAgICAgIG90aGVyID0gZnJvbVZhbHVlKG90aGVyKTtcclxuICAgICAgICBpZiAodGhpcy5lcShvdGhlcikpXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHZhciB0aGlzTmVnID0gdGhpcy5pc05lZ2F0aXZlKCksXHJcbiAgICAgICAgICAgIG90aGVyTmVnID0gb3RoZXIuaXNOZWdhdGl2ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzTmVnICYmICFvdGhlck5lZylcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIGlmICghdGhpc05lZyAmJiBvdGhlck5lZylcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB0aGUgc2lnbiBiaXRzIGFyZSB0aGUgc2FtZVxyXG4gICAgICAgIGlmICghdGhpcy51bnNpZ25lZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5pc05lZ2F0aXZlKCkgPyAtMSA6IDE7XHJcbiAgICAgICAgLy8gQm90aCBhcmUgcG9zaXRpdmUgaWYgYXQgbGVhc3Qgb25lIGlzIHVuc2lnbmVkXHJcbiAgICAgICAgcmV0dXJuIChvdGhlci5oaWdoID4+PiAwKSA+ICh0aGlzLmhpZ2ggPj4+IDApIHx8IChvdGhlci5oaWdoID09PSB0aGlzLmhpZ2ggJiYgKG90aGVyLmxvdyA+Pj4gMCkgPiAodGhpcy5sb3cgPj4+IDApKSA/IC0xIDogMTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wYXJlcyB0aGlzIExvbmcncyB2YWx1ZSB3aXRoIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNjb21wYXJlfS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gMCBpZiB0aGV5IGFyZSB0aGUgc2FtZSwgMSBpZiB0aGUgdGhpcyBpcyBncmVhdGVyIGFuZCAtMVxyXG4gICAgICogIGlmIHRoZSBnaXZlbiBvbmUgaXMgZ3JlYXRlclxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmNvbXAgPSBMb25nUHJvdG90eXBlLmNvbXBhcmU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOZWdhdGVzIHRoaXMgTG9uZydzIHZhbHVlLlxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBOZWdhdGVkIExvbmdcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbiBuZWdhdGUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVuc2lnbmVkICYmIHRoaXMuZXEoTUlOX1ZBTFVFKSlcclxuICAgICAgICAgICAgcmV0dXJuIE1JTl9WQUxVRTtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3QoKS5hZGQoT05FKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOZWdhdGVzIHRoaXMgTG9uZydzIHZhbHVlLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI25lZ2F0ZX0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gTmVnYXRlZCBMb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubmVnID0gTG9uZ1Byb3RvdHlwZS5uZWdhdGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBzdW0gb2YgdGhpcyBhbmQgdGhlIHNwZWNpZmllZCBMb25nLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBhZGRlbmQgQWRkZW5kXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFN1bVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChhZGRlbmQpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhhZGRlbmQpKVxyXG4gICAgICAgICAgICBhZGRlbmQgPSBmcm9tVmFsdWUoYWRkZW5kKTtcclxuXHJcbiAgICAgICAgLy8gRGl2aWRlIGVhY2ggbnVtYmVyIGludG8gNCBjaHVua3Mgb2YgMTYgYml0cywgYW5kIHRoZW4gc3VtIHRoZSBjaHVua3MuXHJcblxyXG4gICAgICAgIHZhciBhNDggPSB0aGlzLmhpZ2ggPj4+IDE2O1xyXG4gICAgICAgIHZhciBhMzIgPSB0aGlzLmhpZ2ggJiAweEZGRkY7XHJcbiAgICAgICAgdmFyIGExNiA9IHRoaXMubG93ID4+PiAxNjtcclxuICAgICAgICB2YXIgYTAwID0gdGhpcy5sb3cgJiAweEZGRkY7XHJcblxyXG4gICAgICAgIHZhciBiNDggPSBhZGRlbmQuaGlnaCA+Pj4gMTY7XHJcbiAgICAgICAgdmFyIGIzMiA9IGFkZGVuZC5oaWdoICYgMHhGRkZGO1xyXG4gICAgICAgIHZhciBiMTYgPSBhZGRlbmQubG93ID4+PiAxNjtcclxuICAgICAgICB2YXIgYjAwID0gYWRkZW5kLmxvdyAmIDB4RkZGRjtcclxuXHJcbiAgICAgICAgdmFyIGM0OCA9IDAsIGMzMiA9IDAsIGMxNiA9IDAsIGMwMCA9IDA7XHJcbiAgICAgICAgYzAwICs9IGEwMCArIGIwMDtcclxuICAgICAgICBjMTYgKz0gYzAwID4+PiAxNjtcclxuICAgICAgICBjMDAgJj0gMHhGRkZGO1xyXG4gICAgICAgIGMxNiArPSBhMTYgKyBiMTY7XHJcbiAgICAgICAgYzMyICs9IGMxNiA+Pj4gMTY7XHJcbiAgICAgICAgYzE2ICY9IDB4RkZGRjtcclxuICAgICAgICBjMzIgKz0gYTMyICsgYjMyO1xyXG4gICAgICAgIGM0OCArPSBjMzIgPj4+IDE2O1xyXG4gICAgICAgIGMzMiAmPSAweEZGRkY7XHJcbiAgICAgICAgYzQ4ICs9IGE0OCArIGI0ODtcclxuICAgICAgICBjNDggJj0gMHhGRkZGO1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cygoYzE2IDw8IDE2KSB8IGMwMCwgKGM0OCA8PCAxNikgfCBjMzIsIHRoaXMudW5zaWduZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGRpZmZlcmVuY2Ugb2YgdGhpcyBhbmQgdGhlIHNwZWNpZmllZCBMb25nLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBzdWJ0cmFoZW5kIFN1YnRyYWhlbmRcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gRGlmZmVyZW5jZVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3Qoc3VidHJhaGVuZCkge1xyXG4gICAgICAgIGlmICghaXNMb25nKHN1YnRyYWhlbmQpKVxyXG4gICAgICAgICAgICBzdWJ0cmFoZW5kID0gZnJvbVZhbHVlKHN1YnRyYWhlbmQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZChzdWJ0cmFoZW5kLm5lZygpKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNzdWJ0cmFjdH0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gc3VidHJhaGVuZCBTdWJ0cmFoZW5kXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IERpZmZlcmVuY2VcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5zdWIgPSBMb25nUHJvdG90eXBlLnN1YnRyYWN0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcHJvZHVjdCBvZiB0aGlzIGFuZCB0aGUgc3BlY2lmaWVkIExvbmcuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG11bHRpcGxpZXIgTXVsdGlwbGllclxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBQcm9kdWN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiBtdWx0aXBseShtdWx0aXBsaWVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNaZXJvKCkpXHJcbiAgICAgICAgICAgIHJldHVybiBaRVJPO1xyXG4gICAgICAgIGlmICghaXNMb25nKG11bHRpcGxpZXIpKVxyXG4gICAgICAgICAgICBtdWx0aXBsaWVyID0gZnJvbVZhbHVlKG11bHRpcGxpZXIpO1xyXG4gICAgICAgIGlmIChtdWx0aXBsaWVyLmlzWmVybygpKVxyXG4gICAgICAgICAgICByZXR1cm4gWkVSTztcclxuICAgICAgICBpZiAodGhpcy5lcShNSU5fVkFMVUUpKVxyXG4gICAgICAgICAgICByZXR1cm4gbXVsdGlwbGllci5pc09kZCgpID8gTUlOX1ZBTFVFIDogWkVSTztcclxuICAgICAgICBpZiAobXVsdGlwbGllci5lcShNSU5fVkFMVUUpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc09kZCgpID8gTUlOX1ZBTFVFIDogWkVSTztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNOZWdhdGl2ZSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChtdWx0aXBsaWVyLmlzTmVnYXRpdmUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5lZygpLm11bChtdWx0aXBsaWVyLm5lZygpKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmVnKCkubXVsKG11bHRpcGxpZXIpLm5lZygpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobXVsdGlwbGllci5pc05lZ2F0aXZlKCkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bChtdWx0aXBsaWVyLm5lZygpKS5uZWcoKTtcclxuXHJcbiAgICAgICAgLy8gSWYgYm90aCBsb25ncyBhcmUgc21hbGwsIHVzZSBmbG9hdCBtdWx0aXBsaWNhdGlvblxyXG4gICAgICAgIGlmICh0aGlzLmx0KFRXT19QV1JfMjQpICYmIG11bHRpcGxpZXIubHQoVFdPX1BXUl8yNCkpXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tTnVtYmVyKHRoaXMudG9OdW1iZXIoKSAqIG11bHRpcGxpZXIudG9OdW1iZXIoKSwgdGhpcy51bnNpZ25lZCk7XHJcblxyXG4gICAgICAgIC8vIERpdmlkZSBlYWNoIGxvbmcgaW50byA0IGNodW5rcyBvZiAxNiBiaXRzLCBhbmQgdGhlbiBhZGQgdXAgNHg0IHByb2R1Y3RzLlxyXG4gICAgICAgIC8vIFdlIGNhbiBza2lwIHByb2R1Y3RzIHRoYXQgd291bGQgb3ZlcmZsb3cuXHJcblxyXG4gICAgICAgIHZhciBhNDggPSB0aGlzLmhpZ2ggPj4+IDE2O1xyXG4gICAgICAgIHZhciBhMzIgPSB0aGlzLmhpZ2ggJiAweEZGRkY7XHJcbiAgICAgICAgdmFyIGExNiA9IHRoaXMubG93ID4+PiAxNjtcclxuICAgICAgICB2YXIgYTAwID0gdGhpcy5sb3cgJiAweEZGRkY7XHJcblxyXG4gICAgICAgIHZhciBiNDggPSBtdWx0aXBsaWVyLmhpZ2ggPj4+IDE2O1xyXG4gICAgICAgIHZhciBiMzIgPSBtdWx0aXBsaWVyLmhpZ2ggJiAweEZGRkY7XHJcbiAgICAgICAgdmFyIGIxNiA9IG11bHRpcGxpZXIubG93ID4+PiAxNjtcclxuICAgICAgICB2YXIgYjAwID0gbXVsdGlwbGllci5sb3cgJiAweEZGRkY7XHJcblxyXG4gICAgICAgIHZhciBjNDggPSAwLCBjMzIgPSAwLCBjMTYgPSAwLCBjMDAgPSAwO1xyXG4gICAgICAgIGMwMCArPSBhMDAgKiBiMDA7XHJcbiAgICAgICAgYzE2ICs9IGMwMCA+Pj4gMTY7XHJcbiAgICAgICAgYzAwICY9IDB4RkZGRjtcclxuICAgICAgICBjMTYgKz0gYTE2ICogYjAwO1xyXG4gICAgICAgIGMzMiArPSBjMTYgPj4+IDE2O1xyXG4gICAgICAgIGMxNiAmPSAweEZGRkY7XHJcbiAgICAgICAgYzE2ICs9IGEwMCAqIGIxNjtcclxuICAgICAgICBjMzIgKz0gYzE2ID4+PiAxNjtcclxuICAgICAgICBjMTYgJj0gMHhGRkZGO1xyXG4gICAgICAgIGMzMiArPSBhMzIgKiBiMDA7XHJcbiAgICAgICAgYzQ4ICs9IGMzMiA+Pj4gMTY7XHJcbiAgICAgICAgYzMyICY9IDB4RkZGRjtcclxuICAgICAgICBjMzIgKz0gYTE2ICogYjE2O1xyXG4gICAgICAgIGM0OCArPSBjMzIgPj4+IDE2O1xyXG4gICAgICAgIGMzMiAmPSAweEZGRkY7XHJcbiAgICAgICAgYzMyICs9IGEwMCAqIGIzMjtcclxuICAgICAgICBjNDggKz0gYzMyID4+PiAxNjtcclxuICAgICAgICBjMzIgJj0gMHhGRkZGO1xyXG4gICAgICAgIGM0OCArPSBhNDggKiBiMDAgKyBhMzIgKiBiMTYgKyBhMTYgKiBiMzIgKyBhMDAgKiBiNDg7XHJcbiAgICAgICAgYzQ4ICY9IDB4RkZGRjtcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHMoKGMxNiA8PCAxNikgfCBjMDAsIChjNDggPDwgMTYpIHwgYzMyLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBwcm9kdWN0IG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNtdWx0aXBseX0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gbXVsdGlwbGllciBNdWx0aXBsaWVyXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFByb2R1Y3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5tdWwgPSBMb25nUHJvdG90eXBlLm11bHRpcGx5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgZGl2aWRlZCBieSB0aGUgc3BlY2lmaWVkLiBUaGUgcmVzdWx0IGlzIHNpZ25lZCBpZiB0aGlzIExvbmcgaXMgc2lnbmVkIG9yXHJcbiAgICAgKiAgdW5zaWduZWQgaWYgdGhpcyBMb25nIGlzIHVuc2lnbmVkLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gUXVvdGllbnRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5kaXZpZGUgPSBmdW5jdGlvbiBkaXZpZGUoZGl2aXNvcikge1xyXG4gICAgICAgIGlmICghaXNMb25nKGRpdmlzb3IpKVxyXG4gICAgICAgICAgICBkaXZpc29yID0gZnJvbVZhbHVlKGRpdmlzb3IpO1xyXG4gICAgICAgIGlmIChkaXZpc29yLmlzWmVybygpKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignZGl2aXNpb24gYnkgemVybycpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzWmVybygpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51bnNpZ25lZCA/IFVaRVJPIDogWkVSTztcclxuICAgICAgICB2YXIgYXBwcm94LCByZW0sIHJlcztcclxuICAgICAgICBpZiAoIXRoaXMudW5zaWduZWQpIHtcclxuICAgICAgICAgICAgLy8gVGhpcyBzZWN0aW9uIGlzIG9ubHkgcmVsZXZhbnQgZm9yIHNpZ25lZCBsb25ncyBhbmQgaXMgZGVyaXZlZCBmcm9tIHRoZVxyXG4gICAgICAgICAgICAvLyBjbG9zdXJlIGxpYnJhcnkgYXMgYSB3aG9sZS5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZXEoTUlOX1ZBTFVFKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpdmlzb3IuZXEoT05FKSB8fCBkaXZpc29yLmVxKE5FR19PTkUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNSU5fVkFMVUU7ICAvLyByZWNhbGwgdGhhdCAtTUlOX1ZBTFVFID09IE1JTl9WQUxVRVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGl2aXNvci5lcShNSU5fVkFMVUUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPTkU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB3ZSBoYXZlIHxvdGhlcnwgPj0gMiwgc28gfHRoaXMvb3RoZXJ8IDwgfE1JTl9WQUxVRXwuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbGZUaGlzID0gdGhpcy5zaHIoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwcm94ID0gaGFsZlRoaXMuZGl2KGRpdmlzb3IpLnNobCgxKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXBwcm94LmVxKFpFUk8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXZpc29yLmlzTmVnYXRpdmUoKSA/IE9ORSA6IE5FR19PTkU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtID0gdGhpcy5zdWIoZGl2aXNvci5tdWwoYXBwcm94KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IGFwcHJveC5hZGQocmVtLmRpdihkaXZpc29yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpdmlzb3IuZXEoTUlOX1ZBTFVFKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVuc2lnbmVkID8gVVpFUk8gOiBaRVJPO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc05lZ2F0aXZlKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXZpc29yLmlzTmVnYXRpdmUoKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uZWcoKS5kaXYoZGl2aXNvci5uZWcoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uZWcoKS5kaXYoZGl2aXNvcikubmVnKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGl2aXNvci5pc05lZ2F0aXZlKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kaXYoZGl2aXNvci5uZWcoKSkubmVnKCk7XHJcbiAgICAgICAgICAgIHJlcyA9IFpFUk87XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGhlIGFsZ29yaXRobSBiZWxvdyBoYXMgbm90IGJlZW4gbWFkZSBmb3IgdW5zaWduZWQgbG9uZ3MuIEl0J3MgdGhlcmVmb3JlXHJcbiAgICAgICAgICAgIC8vIHJlcXVpcmVkIHRvIHRha2Ugc3BlY2lhbCBjYXJlIG9mIHRoZSBNU0IgcHJpb3IgdG8gcnVubmluZyBpdC5cclxuICAgICAgICAgICAgaWYgKCFkaXZpc29yLnVuc2lnbmVkKVxyXG4gICAgICAgICAgICAgICAgZGl2aXNvciA9IGRpdmlzb3IudG9VbnNpZ25lZCgpO1xyXG4gICAgICAgICAgICBpZiAoZGl2aXNvci5ndCh0aGlzKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBVWkVSTztcclxuICAgICAgICAgICAgaWYgKGRpdmlzb3IuZ3QodGhpcy5zaHJ1KDEpKSkgLy8gMTUgPj4+IDEgPSA3IDsgd2l0aCBkaXZpc29yID0gOCA7IHRydWVcclxuICAgICAgICAgICAgICAgIHJldHVybiBVT05FO1xyXG4gICAgICAgICAgICByZXMgPSBVWkVSTztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlcGVhdCB0aGUgZm9sbG93aW5nIHVudGlsIHRoZSByZW1haW5kZXIgaXMgbGVzcyB0aGFuIG90aGVyOiAgZmluZCBhXHJcbiAgICAgICAgLy8gZmxvYXRpbmctcG9pbnQgdGhhdCBhcHByb3hpbWF0ZXMgcmVtYWluZGVyIC8gb3RoZXIgKmZyb20gYmVsb3cqLCBhZGQgdGhpc1xyXG4gICAgICAgIC8vIGludG8gdGhlIHJlc3VsdCwgYW5kIHN1YnRyYWN0IGl0IGZyb20gdGhlIHJlbWFpbmRlci4gIEl0IGlzIGNyaXRpY2FsIHRoYXRcclxuICAgICAgICAvLyB0aGUgYXBwcm94aW1hdGUgdmFsdWUgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSByZWFsIHZhbHVlIHNvIHRoYXQgdGhlXHJcbiAgICAgICAgLy8gcmVtYWluZGVyIG5ldmVyIGJlY29tZXMgbmVnYXRpdmUuXHJcbiAgICAgICAgcmVtID0gdGhpcztcclxuICAgICAgICB3aGlsZSAocmVtLmd0ZShkaXZpc29yKSkge1xyXG4gICAgICAgICAgICAvLyBBcHByb3hpbWF0ZSB0aGUgcmVzdWx0IG9mIGRpdmlzaW9uLiBUaGlzIG1heSBiZSBhIGxpdHRsZSBncmVhdGVyIG9yXHJcbiAgICAgICAgICAgIC8vIHNtYWxsZXIgdGhhbiB0aGUgYWN0dWFsIHZhbHVlLlxyXG4gICAgICAgICAgICBhcHByb3ggPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKHJlbS50b051bWJlcigpIC8gZGl2aXNvci50b051bWJlcigpKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBXZSB3aWxsIHR3ZWFrIHRoZSBhcHByb3hpbWF0ZSByZXN1bHQgYnkgY2hhbmdpbmcgaXQgaW4gdGhlIDQ4LXRoIGRpZ2l0IG9yXHJcbiAgICAgICAgICAgIC8vIHRoZSBzbWFsbGVzdCBub24tZnJhY3Rpb25hbCBkaWdpdCwgd2hpY2hldmVyIGlzIGxhcmdlci5cclxuICAgICAgICAgICAgdmFyIGxvZzIgPSBNYXRoLmNlaWwoTWF0aC5sb2coYXBwcm94KSAvIE1hdGguTE4yKSxcclxuICAgICAgICAgICAgICAgIGRlbHRhID0gKGxvZzIgPD0gNDgpID8gMSA6IHBvd19kYmwoMiwgbG9nMiAtIDQ4KSxcclxuXHJcbiAgICAgICAgICAgIC8vIERlY3JlYXNlIHRoZSBhcHByb3hpbWF0aW9uIHVudGlsIGl0IGlzIHNtYWxsZXIgdGhhbiB0aGUgcmVtYWluZGVyLiAgTm90ZVxyXG4gICAgICAgICAgICAvLyB0aGF0IGlmIGl0IGlzIHRvbyBsYXJnZSwgdGhlIHByb2R1Y3Qgb3ZlcmZsb3dzIGFuZCBpcyBuZWdhdGl2ZS5cclxuICAgICAgICAgICAgICAgIGFwcHJveFJlcyA9IGZyb21OdW1iZXIoYXBwcm94KSxcclxuICAgICAgICAgICAgICAgIGFwcHJveFJlbSA9IGFwcHJveFJlcy5tdWwoZGl2aXNvcik7XHJcbiAgICAgICAgICAgIHdoaWxlIChhcHByb3hSZW0uaXNOZWdhdGl2ZSgpIHx8IGFwcHJveFJlbS5ndChyZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBhcHByb3ggLT0gZGVsdGE7XHJcbiAgICAgICAgICAgICAgICBhcHByb3hSZXMgPSBmcm9tTnVtYmVyKGFwcHJveCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgICAgICAgICBhcHByb3hSZW0gPSBhcHByb3hSZXMubXVsKGRpdmlzb3IpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBXZSBrbm93IHRoZSBhbnN3ZXIgY2FuJ3QgYmUgemVyby4uLiBhbmQgYWN0dWFsbHksIHplcm8gd291bGQgY2F1c2VcclxuICAgICAgICAgICAgLy8gaW5maW5pdGUgcmVjdXJzaW9uIHNpbmNlIHdlIHdvdWxkIG1ha2Ugbm8gcHJvZ3Jlc3MuXHJcbiAgICAgICAgICAgIGlmIChhcHByb3hSZXMuaXNaZXJvKCkpXHJcbiAgICAgICAgICAgICAgICBhcHByb3hSZXMgPSBPTkU7XHJcblxyXG4gICAgICAgICAgICByZXMgPSByZXMuYWRkKGFwcHJveFJlcyk7XHJcbiAgICAgICAgICAgIHJlbSA9IHJlbS5zdWIoYXBwcm94UmVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoaXMgTG9uZyBkaXZpZGVkIGJ5IHRoZSBzcGVjaWZpZWQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjZGl2aWRlfS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gUXVvdGllbnRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5kaXYgPSBMb25nUHJvdG90eXBlLmRpdmlkZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhpcyBMb25nIG1vZHVsbyB0aGUgc3BlY2lmaWVkLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gUmVtYWluZGVyXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubW9kdWxvID0gZnVuY3Rpb24gbW9kdWxvKGRpdmlzb3IpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhkaXZpc29yKSlcclxuICAgICAgICAgICAgZGl2aXNvciA9IGZyb21WYWx1ZShkaXZpc29yKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIodGhpcy5kaXYoZGl2aXNvcikubXVsKGRpdmlzb3IpKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoaXMgTG9uZyBtb2R1bG8gdGhlIHNwZWNpZmllZC4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNtb2R1bG99LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IGRpdmlzb3IgRGl2aXNvclxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBSZW1haW5kZXJcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5tb2QgPSBMb25nUHJvdG90eXBlLm1vZHVsbztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGJpdHdpc2UgTk9UIG9mIHRoaXMgTG9uZy5cclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5ub3QgPSBmdW5jdGlvbiBub3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKH50aGlzLmxvdywgfnRoaXMuaGlnaCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYml0d2lzZSBBTkQgb2YgdGhpcyBMb25nIGFuZCB0aGUgc3BlY2lmaWVkLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciBMb25nXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuYW5kID0gZnVuY3Rpb24gYW5kKG90aGVyKSB7XHJcbiAgICAgICAgaWYgKCFpc0xvbmcob3RoZXIpKVxyXG4gICAgICAgICAgICBvdGhlciA9IGZyb21WYWx1ZShvdGhlcik7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKHRoaXMubG93ICYgb3RoZXIubG93LCB0aGlzLmhpZ2ggJiBvdGhlci5oaWdoLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBiaXR3aXNlIE9SIG9mIHRoaXMgTG9uZyBhbmQgdGhlIHNwZWNpZmllZC5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgTG9uZ1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLm9yID0gZnVuY3Rpb24gb3Iob3RoZXIpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhvdGhlcikpXHJcbiAgICAgICAgICAgIG90aGVyID0gZnJvbVZhbHVlKG90aGVyKTtcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3cgfCBvdGhlci5sb3csIHRoaXMuaGlnaCB8IG90aGVyLmhpZ2gsIHRoaXMudW5zaWduZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGJpdHdpc2UgWE9SIG9mIHRoaXMgTG9uZyBhbmQgdGhlIGdpdmVuIG9uZS5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgTG9uZ1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnhvciA9IGZ1bmN0aW9uIHhvcihvdGhlcikge1xyXG4gICAgICAgIGlmICghaXNMb25nKG90aGVyKSlcclxuICAgICAgICAgICAgb3RoZXIgPSBmcm9tVmFsdWUob3RoZXIpO1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmxvdyBeIG90aGVyLmxvdywgdGhpcy5oaWdoIF4gb3RoZXIuaGlnaCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIHNoaWZ0ZWQgdG8gdGhlIGxlZnQgYnkgdGhlIGdpdmVuIGFtb3VudC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnNoaWZ0TGVmdCA9IGZ1bmN0aW9uIHNoaWZ0TGVmdChudW1CaXRzKSB7XHJcbiAgICAgICAgaWYgKGlzTG9uZyhudW1CaXRzKSlcclxuICAgICAgICAgICAgbnVtQml0cyA9IG51bUJpdHMudG9JbnQoKTtcclxuICAgICAgICBpZiAoKG51bUJpdHMgJj0gNjMpID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBlbHNlIGlmIChudW1CaXRzIDwgMzIpXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmxvdyA8PCBudW1CaXRzLCAodGhpcy5oaWdoIDw8IG51bUJpdHMpIHwgKHRoaXMubG93ID4+PiAoMzIgLSBudW1CaXRzKSksIHRoaXMudW5zaWduZWQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIGZyb21CaXRzKDAsIHRoaXMubG93IDw8IChudW1CaXRzIC0gMzIpLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoaXMgTG9uZyB3aXRoIGJpdHMgc2hpZnRlZCB0byB0aGUgbGVmdCBieSB0aGUgZ2l2ZW4gYW1vdW50LiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI3NoaWZ0TGVmdH0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnNobCA9IExvbmdQcm90b3R5cGUuc2hpZnRMZWZ0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIGFyaXRobWV0aWNhbGx5IHNoaWZ0ZWQgdG8gdGhlIHJpZ2h0IGJ5IHRoZSBnaXZlbiBhbW91bnQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBTaGlmdGVkIExvbmdcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5zaGlmdFJpZ2h0ID0gZnVuY3Rpb24gc2hpZnRSaWdodChudW1CaXRzKSB7XHJcbiAgICAgICAgaWYgKGlzTG9uZyhudW1CaXRzKSlcclxuICAgICAgICAgICAgbnVtQml0cyA9IG51bUJpdHMudG9JbnQoKTtcclxuICAgICAgICBpZiAoKG51bUJpdHMgJj0gNjMpID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBlbHNlIGlmIChudW1CaXRzIDwgMzIpXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tQml0cygodGhpcy5sb3cgPj4+IG51bUJpdHMpIHwgKHRoaXMuaGlnaCA8PCAoMzIgLSBudW1CaXRzKSksIHRoaXMuaGlnaCA+PiBudW1CaXRzLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmhpZ2ggPj4gKG51bUJpdHMgLSAzMiksIHRoaXMuaGlnaCA+PSAwID8gMCA6IC0xLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoaXMgTG9uZyB3aXRoIGJpdHMgYXJpdGhtZXRpY2FsbHkgc2hpZnRlZCB0byB0aGUgcmlnaHQgYnkgdGhlIGdpdmVuIGFtb3VudC4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNzaGlmdFJpZ2h0fS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ8IUxvbmd9IG51bUJpdHMgTnVtYmVyIG9mIGJpdHNcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gU2hpZnRlZCBMb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuc2hyID0gTG9uZ1Byb3RvdHlwZS5zaGlmdFJpZ2h0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIGxvZ2ljYWxseSBzaGlmdGVkIHRvIHRoZSByaWdodCBieSB0aGUgZ2l2ZW4gYW1vdW50LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ8IUxvbmd9IG51bUJpdHMgTnVtYmVyIG9mIGJpdHNcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gU2hpZnRlZCBMb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuc2hpZnRSaWdodFVuc2lnbmVkID0gZnVuY3Rpb24gc2hpZnRSaWdodFVuc2lnbmVkKG51bUJpdHMpIHtcclxuICAgICAgICBpZiAoaXNMb25nKG51bUJpdHMpKVxyXG4gICAgICAgICAgICBudW1CaXRzID0gbnVtQml0cy50b0ludCgpO1xyXG4gICAgICAgIG51bUJpdHMgJj0gNjM7XHJcbiAgICAgICAgaWYgKG51bUJpdHMgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgaGlnaCA9IHRoaXMuaGlnaDtcclxuICAgICAgICAgICAgaWYgKG51bUJpdHMgPCAzMikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvdyA9IHRoaXMubG93O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb21CaXRzKChsb3cgPj4+IG51bUJpdHMpIHwgKGhpZ2ggPDwgKDMyIC0gbnVtQml0cykpLCBoaWdoID4+PiBudW1CaXRzLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChudW1CaXRzID09PSAzMilcclxuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tQml0cyhoaWdoLCAwLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb21CaXRzKGhpZ2ggPj4+IChudW1CaXRzIC0gMzIpLCAwLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIGxvZ2ljYWxseSBzaGlmdGVkIHRvIHRoZSByaWdodCBieSB0aGUgZ2l2ZW4gYW1vdW50LiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI3NoaWZ0UmlnaHRVbnNpZ25lZH0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnNocnUgPSBMb25nUHJvdG90eXBlLnNoaWZ0UmlnaHRVbnNpZ25lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgTG9uZyB0byBzaWduZWQuXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFNpZ25lZCBsb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUudG9TaWduZWQgPSBmdW5jdGlvbiB0b1NpZ25lZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudW5zaWduZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmxvdywgdGhpcy5oaWdoLCBmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhpcyBMb25nIHRvIHVuc2lnbmVkLlxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBVbnNpZ25lZCBsb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUudG9VbnNpZ25lZCA9IGZ1bmN0aW9uIHRvVW5zaWduZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudW5zaWduZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmxvdywgdGhpcy5oaWdoLCB0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIExvbmc7XHJcbn0pO1xyXG4iLCIvKlxyXG4gQ29weXJpZ2h0IDIwMTMgRGFuaWVsIFdpcnR6IDxkY29kZUBkY29kZS5pbz5cclxuXHJcbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcblxyXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG4vKipcclxuICogQGxpY2Vuc2UgcHJvdG9idWYuanMgKGMpIDIwMTMgRGFuaWVsIFdpcnR6IDxkY29kZUBkY29kZS5pbz5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMFxyXG4gKiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kY29kZUlPL3Byb3RvYnVmLmpzIGZvciBkZXRhaWxzXHJcbiAqL1xyXG4oZnVuY3Rpb24oZ2xvYmFsLCBmYWN0b3J5KSB7XHJcblxyXG4gICAgLyogQU1EICovIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVtcImFtZFwiXSlcclxuICAgICAgICBkZWZpbmUoW1wiYnl0ZWJ1ZmZlclwiXSwgZmFjdG9yeSk7XHJcbiAgICAvKiBDb21tb25KUyAqLyBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlICYmIG1vZHVsZVtcImV4cG9ydHNcIl0pXHJcbiAgICAgICAgbW9kdWxlW1wiZXhwb3J0c1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImJ5dGVidWZmZXJcIiksIHRydWUpO1xyXG4gICAgLyogR2xvYmFsICovIGVsc2VcclxuICAgICAgICAoZ2xvYmFsW1wiZGNvZGVJT1wiXSA9IGdsb2JhbFtcImRjb2RlSU9cIl0gfHwge30pW1wiUHJvdG9CdWZcIl0gPSBmYWN0b3J5KGdsb2JhbFtcImRjb2RlSU9cIl1bXCJCeXRlQnVmZmVyXCJdKTtcclxuXHJcbn0pKHRoaXMsIGZ1bmN0aW9uKEJ5dGVCdWZmZXIsIGlzQ29tbW9uSlMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIFByb3RvQnVmIG5hbWVzcGFjZS5cclxuICAgICAqIEBleHBvcnRzIFByb3RvQnVmXHJcbiAgICAgKiBAbmFtZXNwYWNlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIHZhciBQcm90b0J1ZiA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFmdW5jdGlvbihuZXc6IEJ5dGVCdWZmZXIsIC4uLlsqXSl9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLkJ5dGVCdWZmZXIgPSBCeXRlQnVmZmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgez9mdW5jdGlvbihuZXc6IExvbmcsIC4uLlsqXSl9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLkxvbmcgPSBCeXRlQnVmZmVyLkxvbmcgfHwgbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb3RvQnVmLmpzIHZlcnNpb24uXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLlZFUlNJT04gPSBcIjUuMC4xXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaXJlIHR5cGVzLlxyXG4gICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLG51bWJlcj59XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuV0lSRV9UWVBFUyA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFyaW50IHdpcmUgdHlwZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5UID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpeGVkIDY0IGJpdHMgd2lyZSB0eXBlLlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFM2NCA9IDE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMZW5ndGggZGVsaW1pdGVkIHdpcmUgdHlwZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0gPSAyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3RhcnQgZ3JvdXAgd2lyZSB0eXBlLlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5XSVJFX1RZUEVTLlNUQVJUR1JPVVAgPSAzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW5kIGdyb3VwIHdpcmUgdHlwZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5FTkRHUk9VUCA9IDQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXhlZCAzMiBiaXRzIHdpcmUgdHlwZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTMzIgPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFja2FibGUgd2lyZSB0eXBlcy5cclxuICAgICAqIEB0eXBlIHshQXJyYXkuPG51bWJlcj59XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuUEFDS0FCTEVfV0lSRV9UWVBFUyA9IFtcclxuICAgICAgICBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVCxcclxuICAgICAgICBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFM2NCxcclxuICAgICAgICBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFMzMlxyXG4gICAgXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFR5cGVzLlxyXG4gICAgICogQGRpY3RcclxuICAgICAqIEB0eXBlIHshT2JqZWN0LjxzdHJpbmcse25hbWU6IHN0cmluZywgd2lyZVR5cGU6IG51bWJlciwgZGVmYXVsdFZhbHVlOiAqfT59XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuVFlQRVMgPSB7XHJcbiAgICAgICAgLy8gQWNjb3JkaW5nIHRvIHRoZSBwcm90b2J1ZiBzcGVjLlxyXG4gICAgICAgIFwiaW50MzJcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImludDMyXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVCxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInVpbnQzMlwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwidWludDMyXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVCxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNpbnQzMlwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwic2ludDMyXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVCxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImludDY0XCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJpbnQ2NFwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogUHJvdG9CdWYuTG9uZyA/IFByb3RvQnVmLkxvbmcuWkVSTyA6IHVuZGVmaW5lZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJ1aW50NjRcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcInVpbnQ2NFwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogUHJvdG9CdWYuTG9uZyA/IFByb3RvQnVmLkxvbmcuVVpFUk8gOiB1bmRlZmluZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2ludDY0XCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJzaW50NjRcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5ULFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IFByb3RvQnVmLkxvbmcgPyBQcm90b0J1Zi5Mb25nLlpFUk8gOiB1bmRlZmluZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiYm9vbFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiYm9vbFwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZG91YmxlXCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJkb3VibGVcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzY0LFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic3RyaW5nXCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJzdHJpbmdcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNLFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IFwiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiYnl0ZXNcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImJ5dGVzXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTSxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBudWxsIC8vIG92ZXJyaWRkZW4gaW4gdGhlIGNvZGUsIG11c3QgYmUgYSB1bmlxdWUgaW5zdGFuY2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZml4ZWQzMlwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZml4ZWQzMlwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTMzIsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZml4ZWQzMlwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwic2ZpeGVkMzJcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzMyLFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZml4ZWQ2NFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZml4ZWQ2NFwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTNjQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogIFByb3RvQnVmLkxvbmcgPyBQcm90b0J1Zi5Mb25nLlVaRVJPIDogdW5kZWZpbmVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNmaXhlZDY0XCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJzZml4ZWQ2NFwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTNjQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogUHJvdG9CdWYuTG9uZyA/IFByb3RvQnVmLkxvbmcuWkVSTyA6IHVuZGVmaW5lZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJmbG9hdFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZmxvYXRcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzMyLFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZW51bVwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZW51bVwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJtZXNzYWdlXCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJtZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTSxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBudWxsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImdyb3VwXCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJncm91cFwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5TVEFSVEdST1VQLFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsaWQgbWFwIGtleSB0eXBlcy5cclxuICAgICAqIEB0eXBlIHshQXJyYXkuPCFPYmplY3QuPHN0cmluZyx7bmFtZTogc3RyaW5nLCB3aXJlVHlwZTogbnVtYmVyLCBkZWZhdWx0VmFsdWU6ICp9Pj59XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuTUFQX0tFWV9UWVBFUyA9IFtcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcImludDMyXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wic2ludDMyXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkMzJcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJ1aW50MzJcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDMyXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wiaW50NjRcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQ2NFwiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcInVpbnQ2NFwiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJib29sXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wic3RyaW5nXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl1cclxuICAgIF07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNaW5pbXVtIGZpZWxkIGlkLlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5JRF9NSU4gPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF4aW11bSBmaWVsZCBpZC5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuSURfTUFYID0gMHgxRkZGRkZGRjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHNldCB0byBgdHJ1ZWAsIGZpZWxkIG5hbWVzIHdpbGwgYmUgY29udmVydGVkIGZyb20gdW5kZXJzY29yZSBub3RhdGlvbiB0byBjYW1lbCBjYXNlLiBEZWZhdWx0cyB0byBgZmFsc2VgLlxyXG4gICAgICogIE11c3QgYmUgc2V0IHByaW9yIHRvIHBhcnNpbmcuXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuY29udmVydEZpZWxkc1RvQ2FtZWxDYXNlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCeSBkZWZhdWx0LCBtZXNzYWdlcyBhcmUgcG9wdWxhdGVkIHdpdGggKHNldFgsIHNldF94KSBhY2Nlc3NvcnMgZm9yIGVhY2ggZmllbGQuIFRoaXMgY2FuIGJlIGRpc2FibGVkIGJ5XHJcbiAgICAgKiAgc2V0dGluZyB0aGlzIHRvIGBmYWxzZWAgcHJpb3IgdG8gYnVpbGRpbmcgbWVzc2FnZXMuXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYucG9wdWxhdGVBY2Nlc3NvcnMgPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnkgZGVmYXVsdCwgbWVzc2FnZXMgYXJlIHBvcHVsYXRlZCB3aXRoIGRlZmF1bHQgdmFsdWVzIGlmIGEgZmllbGQgaXMgbm90IHByZXNlbnQgb24gdGhlIHdpcmUuIFRvIGRpc2FibGVcclxuICAgICAqICB0aGlzIGJlaGF2aW9yLCBzZXQgdGhpcyBzZXR0aW5nIHRvIGBmYWxzZWAuXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYucG9wdWxhdGVEZWZhdWx0cyA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAYWxpYXMgUHJvdG9CdWYuVXRpbFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5VdGlsID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQcm90b0J1ZiB1dGlsaXRpZXMuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuVXRpbFxyXG4gICAgICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgVXRpbCA9IHt9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGbGFnIGlmIHJ1bm5pbmcgaW4gbm9kZSBvciBub3QuXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFV0aWwuSVNfTk9ERSA9ICEhKFxyXG4gICAgICAgICAgICB0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2VzcysnJyA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmICFwcm9jZXNzWydicm93c2VyJ11cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0LlxyXG4gICAgICAgICAqIEByZXR1cm4ge1hNTEh0dHBSZXF1ZXN0fVxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBYTUxIdHRwUmVxdWVzdCBpcyBub3Qgc3VwcG9ydGVkXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFV0aWwuWEhSID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIE5vIGRlcGVuZGVuY2llcyBwbGVhc2UsIHJlZjogaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9qcy94bWxodHRwLmh0bWxcclxuICAgICAgICAgICAgdmFyIFhNTEh0dHBGYWN0b3JpZXMgPSBbXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoXCJNc3htbDIuWE1MSFRUUFwiKX0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwzLlhNTEhUVFBcIil9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge3JldHVybiBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAvKiogQHR5cGUgez9YTUxIdHRwUmVxdWVzdH0gKi9cclxuICAgICAgICAgICAgdmFyIHhociA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDtpPFhNTEh0dHBGYWN0b3JpZXMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHsgeGhyID0gWE1MSHR0cEZhY3Rvcmllc1tpXSgpOyB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF4aHIpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlhNTEh0dHBSZXF1ZXN0IGlzIG5vdCBzdXBwb3J0ZWRcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB4aHI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRmV0Y2hlcyBhIHJlc291cmNlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFJlc291cmNlIHBhdGhcclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKD9zdHJpbmcpPX0gY2FsbGJhY2sgQ2FsbGJhY2sgcmVjZWl2aW5nIHRoZSByZXNvdXJjZSdzIGNvbnRlbnRzLiBJZiBvbWl0dGVkIHRoZSByZXNvdXJjZSB3aWxsXHJcbiAgICAgICAgICogICBiZSBmZXRjaGVkIHN5bmNocm9ub3VzbHkuIElmIHRoZSByZXF1ZXN0IGZhaWxlZCwgY29udGVudHMgd2lsbCBiZSBudWxsLlxyXG4gICAgICAgICAqIEByZXR1cm4gez9zdHJpbmd8dW5kZWZpbmVkfSBSZXNvdXJjZSBjb250ZW50cyBpZiBjYWxsYmFjayBpcyBvbWl0dGVkIChudWxsIGlmIHRoZSByZXF1ZXN0IGZhaWxlZCksIGVsc2UgdW5kZWZpbmVkLlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBVdGlsLmZldGNoID0gZnVuY3Rpb24ocGF0aCwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5JU19OT0RFKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBmcy5yZWFkRmlsZShwYXRoLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhcIlwiK2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB4aHIgPSBVdGlsLlhIUigpO1xyXG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIGNhbGxiYWNrID8gdHJ1ZSA6IGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdVc2VyLUFnZW50JywgJ1hNTEhUVFAvMS4wJyk7XHJcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ3RleHQvcGxhaW4nKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeGhyLm92ZXJyaWRlTWltZVR5cGUgPT09ICdmdW5jdGlvbicpIHhoci5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L3BsYWluJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvKiByZW1vdGUgKi8geGhyLnN0YXR1cyA9PSAyMDAgfHwgLyogbG9jYWwgKi8gKHhoci5zdGF0dXMgPT0gMCAmJiB0eXBlb2YgeGhyLnJlc3BvbnNlVGV4dCA9PT0gJ3N0cmluZycpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC8qIHJlbW90ZSAqLyB4aHIuc3RhdHVzID09IDIwMCB8fCAvKiBsb2NhbCAqLyAoeGhyLnN0YXR1cyA9PSAwICYmIHR5cGVvZiB4aHIucmVzcG9uc2VUZXh0ID09PSAnc3RyaW5nJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydHMgYSBzdHJpbmcgdG8gY2FtZWwgY2FzZS5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVXRpbC50b0NhbWVsQ2FzZSA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL18oW2EtekEtWl0pL2csIGZ1bmN0aW9uICgkMCwgJDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gVXRpbDtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMYW5ndWFnZSBleHByZXNzaW9ucy5cclxuICAgICAqIEB0eXBlIHshT2JqZWN0LjxzdHJpbmcsIVJlZ0V4cD59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLkxhbmcgPSB7XHJcblxyXG4gICAgICAgIC8vIENoYXJhY3RlcnMgYWx3YXlzIGVuZGluZyBhIHN0YXRlbWVudFxyXG4gICAgICAgIERFTElNOiAvW1xcc1xce1xcfT07OlxcW1xcXSwnXCJcXChcXCk8Pl0vZyxcclxuXHJcbiAgICAgICAgLy8gRmllbGQgcnVsZXNcclxuICAgICAgICBSVUxFOiAvXig/OnJlcXVpcmVkfG9wdGlvbmFsfHJlcGVhdGVkfG1hcCkkLyxcclxuXHJcbiAgICAgICAgLy8gRmllbGQgdHlwZXNcclxuICAgICAgICBUWVBFOiAvXig/OmRvdWJsZXxmbG9hdHxpbnQzMnx1aW50MzJ8c2ludDMyfGludDY0fHVpbnQ2NHxzaW50NjR8Zml4ZWQzMnxzZml4ZWQzMnxmaXhlZDY0fHNmaXhlZDY0fGJvb2x8c3RyaW5nfGJ5dGVzKSQvLFxyXG5cclxuICAgICAgICAvLyBOYW1lc1xyXG4gICAgICAgIE5BTUU6IC9eW2EtekEtWl9dW2EtekEtWl8wLTldKiQvLFxyXG5cclxuICAgICAgICAvLyBUeXBlIGRlZmluaXRpb25zXHJcbiAgICAgICAgVFlQRURFRjogL15bYS16QS1aXVthLXpBLVpfMC05XSokLyxcclxuXHJcbiAgICAgICAgLy8gVHlwZSByZWZlcmVuY2VzXHJcbiAgICAgICAgVFlQRVJFRjogL14oPzpcXC4/W2EtekEtWl9dW2EtekEtWl8wLTldKikrJC8sXHJcblxyXG4gICAgICAgIC8vIEZ1bGx5IHF1YWxpZmllZCB0eXBlIHJlZmVyZW5jZXNcclxuICAgICAgICBGUVRZUEVSRUY6IC9eKD86XFwuW2EtekEtWl1bYS16QS1aXzAtOV0qKSskLyxcclxuXHJcbiAgICAgICAgLy8gQWxsIG51bWJlcnNcclxuICAgICAgICBOVU1CRVI6IC9eLT8oPzpbMS05XVswLTldKnwwfDBbeFhdWzAtOWEtZkEtRl0rfDBbMC03XSt8KFswLTldKihcXC5bMC05XSopPyhbRWVdWystXT9bMC05XSspPyl8aW5mfG5hbikkLyxcclxuXHJcbiAgICAgICAgLy8gRGVjaW1hbCBudW1iZXJzXHJcbiAgICAgICAgTlVNQkVSX0RFQzogL14oPzpbMS05XVswLTldKnwwKSQvLFxyXG5cclxuICAgICAgICAvLyBIZXhhZGVjaW1hbCBudW1iZXJzXHJcbiAgICAgICAgTlVNQkVSX0hFWDogL14wW3hYXVswLTlhLWZBLUZdKyQvLFxyXG5cclxuICAgICAgICAvLyBPY3RhbCBudW1iZXJzXHJcbiAgICAgICAgTlVNQkVSX09DVDogL14wWzAtN10rJC8sXHJcblxyXG4gICAgICAgIC8vIEZsb2F0aW5nIHBvaW50IG51bWJlcnNcclxuICAgICAgICBOVU1CRVJfRkxUOiAvXihbMC05XSooXFwuWzAtOV0qKT8oW0VlXVsrLV0/WzAtOV0rKT98aW5mfG5hbikkLyxcclxuXHJcbiAgICAgICAgLy8gQm9vbGVhbnNcclxuICAgICAgICBCT09MOiAvXig/OnRydWV8ZmFsc2UpJC9pLFxyXG5cclxuICAgICAgICAvLyBJZCBudW1iZXJzXHJcbiAgICAgICAgSUQ6IC9eKD86WzEtOV1bMC05XSp8MHwwW3hYXVswLTlhLWZBLUZdK3wwWzAtN10rKSQvLFxyXG5cclxuICAgICAgICAvLyBOZWdhdGl2ZSBpZCBudW1iZXJzIChlbnVtIHZhbHVlcylcclxuICAgICAgICBORUdJRDogL15cXC0/KD86WzEtOV1bMC05XSp8MHwwW3hYXVswLTlhLWZBLUZdK3wwWzAtN10rKSQvLFxyXG5cclxuICAgICAgICAvLyBXaGl0ZXNwYWNlc1xyXG4gICAgICAgIFdISVRFU1BBQ0U6IC9cXHMvLFxyXG5cclxuICAgICAgICAvLyBBbGwgc3RyaW5nc1xyXG4gICAgICAgIFNUUklORzogLyg/OlwiKFteXCJcXFxcXSooPzpcXFxcLlteXCJcXFxcXSopKilcIil8KD86JyhbXidcXFxcXSooPzpcXFxcLlteJ1xcXFxdKikqKScpL2csXHJcblxyXG4gICAgICAgIC8vIERvdWJsZSBxdW90ZWQgc3RyaW5nc1xyXG4gICAgICAgIFNUUklOR19EUTogLyg/OlwiKFteXCJcXFxcXSooPzpcXFxcLlteXCJcXFxcXSopKilcIikvZyxcclxuXHJcbiAgICAgICAgLy8gU2luZ2xlIHF1b3RlZCBzdHJpbmdzXHJcbiAgICAgICAgU1RSSU5HX1NROiAvKD86JyhbXidcXFxcXSooPzpcXFxcLlteJ1xcXFxdKikqKScpL2dcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAYWxpYXMgUHJvdG9CdWYuRG90UHJvdG9cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuRG90UHJvdG8gPSAoZnVuY3Rpb24oUHJvdG9CdWYsIExhbmcpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVXRpbGl0aWVzIHRvIHBhcnNlIC5wcm90byBmaWxlcy5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5Eb3RQcm90b1xyXG4gICAgICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgRG90UHJvdG8gPSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBUb2tlbml6ZXIuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuRG90UHJvdG8uVG9rZW5pemVyXHJcbiAgICAgICAgICogQGNsYXNzIHByb3RvdHlwZSB0b2tlbml6ZXJcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvdG8gUHJvdG8gdG8gdG9rZW5pemVcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgVG9rZW5pemVyID0gZnVuY3Rpb24ocHJvdG8pIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTb3VyY2UgdG8gcGFyc2UuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gcHJvdG8rXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDdXJyZW50IGluZGV4LlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDdXJyZW50IGxpbmUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMubGluZSA9IDE7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogVG9rZW4gc3RhY2suXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshQXJyYXkuPHN0cmluZz59XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBPcGVuaW5nIGNoYXJhY3RlciBvZiB0aGUgY3VycmVudCBzdHJpbmcgcmVhZCwgaWYgYW55LlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P3N0cmluZ31cclxuICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX3N0cmluZ09wZW4gPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5Eb3RQcm90by5Ub2tlbml6ZXIucHJvdG90eXBlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFRva2VuaXplclByb3RvdHlwZSA9IFRva2VuaXplci5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlYWRzIGEgc3RyaW5nIGJlZ2lubmluZyBhdCB0aGUgY3VycmVudCBpbmRleC5cclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBUb2tlbml6ZXJQcm90b3R5cGUuX3JlYWRTdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlID0gdGhpcy5fc3RyaW5nT3BlbiA9PT0gJ1wiJ1xyXG4gICAgICAgICAgICAgICAgPyBMYW5nLlNUUklOR19EUVxyXG4gICAgICAgICAgICAgICAgOiBMYW5nLlNUUklOR19TUTtcclxuICAgICAgICAgICAgcmUubGFzdEluZGV4ID0gdGhpcy5pbmRleCAtIDE7IC8vIEluY2x1ZGUgdGhlIG9wZW4gcXVvdGVcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gcmUuZXhlYyh0aGlzLnNvdXJjZSk7XHJcbiAgICAgICAgICAgIGlmICghbWF0Y2gpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVudGVybWluYXRlZCBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSByZS5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaCh0aGlzLl9zdHJpbmdPcGVuKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RyaW5nT3BlbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSBuZXh0IHRva2VuIGFuZCBhZHZhbmNlcyBieSBvbmUuXHJcbiAgICAgICAgICogQHJldHVybiB7P3N0cmluZ30gVG9rZW4gb3IgYG51bGxgIG9uIEVPRlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBUb2tlbml6ZXJQcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2suc2hpZnQoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPj0gdGhpcy5zb3VyY2UubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdHJpbmdPcGVuICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXBlYXQsXHJcbiAgICAgICAgICAgICAgICBwcmV2LFxyXG4gICAgICAgICAgICAgICAgbmV4dDtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgcmVwZWF0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3RyaXAgd2hpdGUgc3BhY2VzXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoTGFuZy5XSElURVNQQUNFLnRlc3QobmV4dCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJ1xcbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5saW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgrK3RoaXMuaW5kZXggPT09IHRoaXMuc291cmNlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3RyaXAgY29tbWVudHNcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCkgPT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpID09PSAnLycpIHsgLy8gTGluZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5zb3VyY2UuY2hhckF0KCsrdGhpcy5pbmRleCkgIT09ICdcXG4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPT0gdGhpcy5zb3VyY2UubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5saW5lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBlYXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKG5leHQgPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCkpID09PSAnKicpIHsgLyogQmxvY2sgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT09ICdcXG4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5saW5lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCsrdGhpcy5pbmRleCA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldiA9IG5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IHdoaWxlIChwcmV2ICE9PSAnKicgfHwgbmV4dCAhPT0gJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBlYXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJy8nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IHdoaWxlIChyZXBlYXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuc291cmNlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVhZCB0aGUgbmV4dCB0b2tlblxyXG4gICAgICAgICAgICB2YXIgZW5kID0gdGhpcy5pbmRleDtcclxuICAgICAgICAgICAgTGFuZy5ERUxJTS5sYXN0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICB2YXIgZGVsaW0gPSBMYW5nLkRFTElNLnRlc3QodGhpcy5zb3VyY2UuY2hhckF0KGVuZCsrKSk7XHJcbiAgICAgICAgICAgIGlmICghZGVsaW0pXHJcbiAgICAgICAgICAgICAgICB3aGlsZShlbmQgPCB0aGlzLnNvdXJjZS5sZW5ndGggJiYgIUxhbmcuREVMSU0udGVzdCh0aGlzLnNvdXJjZS5jaGFyQXQoZW5kKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgKytlbmQ7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLmluZGV4LCB0aGlzLmluZGV4ID0gZW5kKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuID09PSAnXCInIHx8IHRva2VuID09PSBcIidcIilcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmluZ09wZW4gPSB0b2tlbjtcclxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBlZWtzIGZvciB0aGUgbmV4dCB0b2tlbi5cclxuICAgICAgICAgKiBAcmV0dXJuIHs/c3RyaW5nfSBUb2tlbiBvciBgbnVsbGAgb24gRU9GXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRva2VuaXplclByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWNrWzBdO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNraXBzIGEgc3BlY2lmaWMgdG9rZW4gYW5kIHRocm93cyBpZiBpdCBkaWZmZXJzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBleHBlY3RlZCBFeHBlY3RlZCB0b2tlblxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgYWN0dWFsIHRva2VuIGRpZmZlcnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBUb2tlbml6ZXJQcm90b3R5cGUuc2tpcCA9IGZ1bmN0aW9uKGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHZhciBhY3R1YWwgPSB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgJ1wiK2FjdHVhbCtcIicsICdcIitleHBlY3RlZCtcIicgZXhwZWN0ZWRcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogT21pdHMgYW4gb3B0aW9uYWwgdG9rZW4uXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV4cGVjdGVkIEV4cGVjdGVkIG9wdGlvbmFsIHRva2VuXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgdG9rZW4gZXhpc3RzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVG9rZW5pemVyUHJvdG90eXBlLm9taXQgPSBmdW5jdGlvbihleHBlY3RlZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wZWVrKCkgPT09IGV4cGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIGFzIG9mIFwiVG9rZW5pemVyKGluZGV4L2xlbmd0aClcIlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBUb2tlbml6ZXJQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiVG9rZW5pemVyIChcIit0aGlzLmluZGV4K1wiL1wiK3RoaXMuc291cmNlLmxlbmd0aCtcIiBhdCBsaW5lIFwiK3RoaXMubGluZStcIilcIjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuRG90UHJvdG8uVG9rZW5pemVyXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIERvdFByb3RvLlRva2VuaXplciA9IFRva2VuaXplcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBQYXJzZXIuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuRG90UHJvdG8uUGFyc2VyXHJcbiAgICAgICAgICogQGNsYXNzIHByb3RvdHlwZSBwYXJzZXJcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIFNvdXJjZVxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBQYXJzZXIgPSBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBUb2tlbml6ZXIuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuRG90UHJvdG8uVG9rZW5pemVyfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnRuID0gbmV3IFRva2VuaXplcihzb3VyY2UpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFdoZXRoZXIgcGFyc2luZyBwcm90bzMgb3Igbm90LlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucHJvdG8zID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkRvdFByb3RvLlBhcnNlci5wcm90b3R5cGVcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgUGFyc2VyUHJvdG90eXBlID0gUGFyc2VyLnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIHRoZSBzb3VyY2UuXHJcbiAgICAgICAgICogQHJldHVybnMgeyFPYmplY3R9XHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBzb3VyY2UgY2Fubm90IGJlIHBhcnNlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHRvcExldmVsID0ge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiW1JPT1RdXCIsIC8vIHRlbXBvcmFyeVxyXG4gICAgICAgICAgICAgICAgXCJwYWNrYWdlXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VzXCI6IFtdLFxyXG4gICAgICAgICAgICAgICAgXCJlbnVtc1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwiaW1wb3J0c1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiOiB7fSxcclxuICAgICAgICAgICAgICAgIFwic2VydmljZXNcIjogW11cclxuICAgICAgICAgICAgICAgIC8vIFwic3ludGF4XCI6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBoZWFkID0gdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHdlYWs7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodG9rZW4gPSB0aGlzLnRuLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGFja2FnZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhlYWQgfHwgdG9wTGV2ZWxbXCJwYWNrYWdlXCJdICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwidW5leHBlY3RlZCAncGFja2FnZSdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHBhY2thZ2UgbmFtZTogXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wTGV2ZWxbXCJwYWNrYWdlXCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaW1wb3J0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGVhZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVuZXhwZWN0ZWQgJ2ltcG9ydCdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ucGVlaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBcInB1YmxpY1wiIHx8ICh3ZWFrID0gdG9rZW4gPT09IFwid2Vha1wiKSkgLy8gdG9rZW4gaWdub3JlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLl9yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF3ZWFrKSAvLyBpbXBvcnQgaWdub3JlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcExldmVsW1wiaW1wb3J0c1wiXS5wdXNoKHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzeW50YXgnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwidW5leHBlY3RlZCAnc3ludGF4J1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRvcExldmVsW1wic3ludGF4XCJdID0gdGhpcy5fcmVhZFN0cmluZygpKSA9PT0gXCJwcm90bzNcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3RvMyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21lc3NhZ2UnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VNZXNzYWdlKHRvcExldmVsLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlbnVtJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRW51bSh0b3BMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnb3B0aW9uJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uKHRvcExldmVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzZXJ2aWNlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlU2VydmljZSh0b3BMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXh0ZW5kJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRXh0ZW5kKHRvcExldmVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bmV4cGVjdGVkICdcIiArIHRva2VuICsgXCInXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlID0gXCJQYXJzZSBlcnJvciBhdCBsaW5lIFwiK3RoaXMudG4ubGluZStcIjogXCIgKyBlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0b3BMZXZlbFtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BMZXZlbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgdGhlIHNwZWNpZmllZCBzb3VyY2UuXHJcbiAgICAgICAgICogQHJldHVybnMgeyFPYmplY3R9XHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBzb3VyY2UgY2Fubm90IGJlIHBhcnNlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXIucGFyc2UgPSBmdW5jdGlvbihzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXJzZXIoc291cmNlKS5wYXJzZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIENvbnZlcnNpb24gLS0tLS0tXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGEgbnVtZXJpY2FsIHN0cmluZyB0byBhbiBpZC5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBtYXlCZU5lZ2F0aXZlXHJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBta0lkKHZhbHVlLCBtYXlCZU5lZ2F0aXZlKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IC0xLFxyXG4gICAgICAgICAgICAgICAgc2lnbiA9IDE7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jaGFyQXQoMCkgPT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICBzaWduID0gLTE7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoTGFuZy5OVU1CRVJfREVDLnRlc3QodmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgaWQgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKExhbmcuTlVNQkVSX0hFWC50ZXN0KHZhbHVlKSlcclxuICAgICAgICAgICAgICAgIGlkID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyaW5nKDIpLCAxNik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKExhbmcuTlVNQkVSX09DVC50ZXN0KHZhbHVlKSlcclxuICAgICAgICAgICAgICAgIGlkID0gcGFyc2VJbnQodmFsdWUuc3Vic3RyaW5nKDEpLCA4KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGlkIHZhbHVlOiBcIiArIChzaWduIDwgMCA/ICctJyA6ICcnKSArIHZhbHVlKTtcclxuICAgICAgICAgICAgaWQgPSAoc2lnbippZCl8MDsgLy8gRm9yY2UgdG8gMzJiaXRcclxuICAgICAgICAgICAgaWYgKCFtYXlCZU5lZ2F0aXZlICYmIGlkIDwgMClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBpZCB2YWx1ZTogXCIgKyAoc2lnbiA8IDAgPyAnLScgOiAnJykgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGEgbnVtZXJpY2FsIHN0cmluZyB0byBhIG51bWJlci5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsXHJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBta051bWJlcih2YWwpIHtcclxuICAgICAgICAgICAgdmFyIHNpZ24gPSAxO1xyXG4gICAgICAgICAgICBpZiAodmFsLmNoYXJBdCgwKSA9PSAnLScpIHtcclxuICAgICAgICAgICAgICAgIHNpZ24gPSAtMTtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKExhbmcuTlVNQkVSX0RFQy50ZXN0KHZhbCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2lnbiAqIHBhcnNlSW50KHZhbCwgMTApO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChMYW5nLk5VTUJFUl9IRVgudGVzdCh2YWwpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWwuc3Vic3RyaW5nKDIpLCAxNik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKExhbmcuTlVNQkVSX09DVC50ZXN0KHZhbCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2lnbiAqIHBhcnNlSW50KHZhbC5zdWJzdHJpbmcoMSksIDgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh2YWwgPT09ICdpbmYnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKiBJbmZpbml0eTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodmFsID09PSAnbmFuJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKExhbmcuTlVNQkVSX0ZMVC50ZXN0KHZhbCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2lnbiAqIHBhcnNlRmxvYXQodmFsKTtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG51bWJlciB2YWx1ZTogXCIgKyAoc2lnbiA8IDAgPyAnLScgOiAnJykgKyB2YWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gLS0tLS0gUmVhZGluZyAtLS0tLS1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVhZHMgYSBzdHJpbmcuXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcmVhZFN0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBcIlwiLFxyXG4gICAgICAgICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBkZWxpbTtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgZGVsaW0gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWxpbSAhPT0gXCInXCIgJiYgZGVsaW0gIT09ICdcIicpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHN0cmluZyBkZWxpbWl0ZXI6IFwiK2RlbGltKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlICs9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKGRlbGltKTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5wZWVrKCk7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHRva2VuID09PSAnXCInIHx8IHRva2VuID09PSAnXCInKTsgLy8gbXVsdGkgbGluZT9cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlYWRzIGEgdmFsdWUuXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbWF5QmVUeXBlUmVmXHJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcnxib29sZWFufHN0cmluZ31cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcmVhZFZhbHVlID0gZnVuY3Rpb24obWF5QmVUeXBlUmVmKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG4ucGVlaygpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ1wiJyB8fCB0b2tlbiA9PT0gXCInXCIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKExhbmcuTlVNQkVSLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1rTnVtYmVyKHRva2VuKTtcclxuICAgICAgICAgICAgaWYgKExhbmcuQk9PTC50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAodG9rZW4udG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnKTtcclxuICAgICAgICAgICAgaWYgKG1heUJlVHlwZVJlZiAmJiBMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCB2YWx1ZTogXCIrdG9rZW4pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBQYXJzaW5nIGNvbnN0cnVjdHMgLS0tLS1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIGEgbmFtZXNwYWNlIG9wdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0geyFPYmplY3R9IHBhcmVudCBQYXJlbnQgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGlzTGlzdFxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZU9wdGlvbiA9IGZ1bmN0aW9uKHBhcmVudCwgaXNMaXN0KSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG4ubmV4dCgpLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJygnKSB7XHJcbiAgICAgICAgICAgICAgICBjdXN0b20gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIUxhbmcuVFlQRVJFRi50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgIC8vIHdlIGNhbiBhbGxvdyBvcHRpb25zIG9mIHRoZSBmb3JtIGdvb2dsZS5wcm90b2J1Zi4qIHNpbmNlIHRoZXkgd2lsbCBqdXN0IGdldCBpZ25vcmVkIGFueXdheXNcclxuICAgICAgICAgICAgICAgIC8vIGlmICghL2dvb2dsZVxcLnByb3RvYnVmXFwuLy50ZXN0KHRva2VuKSkgLy8gRklYTUU6IFdoeSBzaG91bGQgdGhhdCBub3QgYmUgYSB2YWxpZCB0eXBlcmVmP1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBvcHRpb24gbmFtZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRva2VuO1xyXG4gICAgICAgICAgICBpZiAoY3VzdG9tKSB7IC8vIChteV9tZXRob2Rfb3B0aW9uKS5mb28sIChteV9tZXRob2Rfb3B0aW9uKSwgc29tZV9tZXRob2Rfb3B0aW9uLCAoZm9vLm15X29wdGlvbikuYmFyXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoJyknKTtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSAnKCcrbmFtZSsnKSc7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ucGVlaygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKExhbmcuRlFUWVBFUkVGLnRlc3QodG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoJz0nKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyc2VPcHRpb25WYWx1ZShwYXJlbnQsIG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIWlzTGlzdClcclxuICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIjtcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0cyBhbiBvcHRpb24gb24gdGhlIHNwZWNpZmllZCBvcHRpb25zIG9iamVjdC5cclxuICAgICAgICAgKiBAcGFyYW0geyFPYmplY3QuPHN0cmluZywqPn0gb3B0aW9uc1xyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfGJvb2xlYW59IHZhbHVlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0T3B0aW9uKG9wdGlvbnMsIG5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnNbbmFtZV0pKVxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbbmFtZV0gPSBbIG9wdGlvbnNbbmFtZV0gXTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNbbmFtZV0ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhbiBvcHRpb24gdmFsdWUuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBwYXJlbnRcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZU9wdGlvblZhbHVlID0gZnVuY3Rpb24ocGFyZW50LCBuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG4ucGVlaygpO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4gIT09ICd7JykgeyAvLyBQbGFpbiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgc2V0T3B0aW9uKHBhcmVudFtcIm9wdGlvbnNcIl0sIG5hbWUsIHRoaXMuX3JlYWRWYWx1ZSh0cnVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIEFnZ3JlZ2F0ZSBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCJ7XCIpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCh0b2tlbiA9IHRoaXMudG4ubmV4dCgpKSAhPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBvcHRpb24gbmFtZTogXCIgKyBuYW1lICsgXCIuXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG4ub21pdChcIjpcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldE9wdGlvbihwYXJlbnRbXCJvcHRpb25zXCJdLCBuYW1lICsgXCIuXCIgKyB0b2tlbiwgdGhpcy5fcmVhZFZhbHVlKHRydWUpKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uVmFsdWUocGFyZW50LCBuYW1lICsgXCIuXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYSBzZXJ2aWNlIGRlZmluaXRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBwYXJlbnQgUGFyZW50IGRlZmluaXRpb25cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VTZXJ2aWNlID0gZnVuY3Rpb24ocGFyZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoIUxhbmcuTkFNRS50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBzZXJ2aWNlIG5hbWUgYXQgbGluZSBcIit0aGlzLnRuLmxpbmUrXCI6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0b2tlbjtcclxuICAgICAgICAgICAgdmFyIHN2YyA9IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJycGNcIjoge30sXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvbnNcIjoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwie1wiKTtcclxuICAgICAgICAgICAgd2hpbGUgKCh0b2tlbiA9IHRoaXMudG4ubmV4dCgpKSAhPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IFwib3B0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VPcHRpb24oc3ZjKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuID09PSAncnBjJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZVNlcnZpY2VSUEMoc3ZjKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgc2VydmljZSB0b2tlbjogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG4ub21pdChcIjtcIik7XHJcbiAgICAgICAgICAgIHBhcmVudFtcInNlcnZpY2VzXCJdLnB1c2goc3ZjKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYSBSUEMgc2VydmljZSBkZWZpbml0aW9uIG9mIHRoZSBmb3JtIFsncnBjJywgbmFtZSwgKHJlcXVlc3QpLCAncmV0dXJucycsIChyZXNwb25zZSldLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gc3ZjIFNlcnZpY2UgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZVNlcnZpY2VSUEMgPSBmdW5jdGlvbihzdmMpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBcInJwY1wiLFxyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgcnBjIHNlcnZpY2UgbWV0aG9kIG5hbWU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0b2tlbjtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IHtcclxuICAgICAgICAgICAgICAgIFwicmVxdWVzdFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZXNwb25zZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0X3N0cmVhbVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwicmVzcG9uc2Vfc3RyZWFtXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25zXCI6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIihcIik7XHJcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi50b0xvd2VyQ2FzZSgpID09PSBcInN0cmVhbVwiKSB7XHJcbiAgICAgICAgICAgICAgbWV0aG9kW1wicmVxdWVzdF9zdHJlYW1cIl0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgcnBjIHNlcnZpY2UgcmVxdWVzdCB0eXBlOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIG1ldGhvZFtcInJlcXVlc3RcIl0gPSB0b2tlbjtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiKVwiKTtcclxuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuLnRvTG93ZXJDYXNlKCkgIT09IFwicmV0dXJuc1wiKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHJwYyBzZXJ2aWNlIHJlcXVlc3QgdHlwZSBkZWxpbWl0ZXI6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiKFwiKTtcclxuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuLnRvTG93ZXJDYXNlKCkgPT09IFwic3RyZWFtXCIpIHtcclxuICAgICAgICAgICAgICBtZXRob2RbXCJyZXNwb25zZV9zdHJlYW1cIl0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0aG9kW1wicmVzcG9uc2VcIl0gPSB0b2tlbjtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiKVwiKTtcclxuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuID09PSAneycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCh0b2tlbiA9IHRoaXMudG4ubmV4dCgpKSAhPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSAnb3B0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VPcHRpb24obWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBycGMgc2VydmljZSB0b2tlbjogXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLm9taXQoXCI7XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIjtcIik7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3ZjW3R5cGVdID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHN2Y1t0eXBlXSA9IHt9O1xyXG4gICAgICAgICAgICBzdmNbdHlwZV1bbmFtZV0gPSBtZXRob2Q7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIGEgbWVzc2FnZSBkZWZpbml0aW9uLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gcGFyZW50IFBhcmVudCBkZWZpbml0aW9uXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0PX0gZmxkIEZpZWxkIGRlZmluaXRpb24gaWYgdGhpcyBpcyBhIGdyb3VwXHJcbiAgICAgICAgICogQHJldHVybnMgeyFPYmplY3R9XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlTWVzc2FnZSA9IGZ1bmN0aW9uKHBhcmVudCwgZmxkKSB7XHJcbiAgICAgICAgICAgIHZhciBpc0dyb3VwID0gISFmbGQsXHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgbXNnID0ge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcImZpZWxkc1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwiZW51bXNcIjogW10sXHJcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VzXCI6IFtdLFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25zXCI6IHt9LFxyXG4gICAgICAgICAgICAgICAgXCJzZXJ2aWNlc1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwib25lb2ZzXCI6IHt9XHJcbiAgICAgICAgICAgICAgICAvLyBcImV4dGVuc2lvbnNcIjogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICghTGFuZy5OQU1FLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIFwiKyhpc0dyb3VwID8gXCJncm91cFwiIDogXCJtZXNzYWdlXCIpK1wiIG5hbWU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgbXNnW1wibmFtZVwiXSA9IHRva2VuO1xyXG4gICAgICAgICAgICBpZiAoaXNHcm91cCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiPVwiKTtcclxuICAgICAgICAgICAgICAgIGZsZFtcImlkXCJdID0gbWtJZCh0aGlzLnRuLm5leHQoKSk7XHJcbiAgICAgICAgICAgICAgICBtc2dbXCJpc0dyb3VwXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ucGVlaygpO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICdbJyAmJiBmbGQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZUZpZWxkT3B0aW9ucyhmbGQpO1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCJ7XCIpO1xyXG4gICAgICAgICAgICB3aGlsZSAoKHRva2VuID0gdGhpcy50bi5uZXh0KCkpICE9PSAnfScpIHtcclxuICAgICAgICAgICAgICAgIGlmIChMYW5nLlJVTEUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VNZXNzYWdlRmllbGQobXNnLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gXCJvbmVvZlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZU9uZU9mKG1zZyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gXCJlbnVtXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VFbnVtKG1zZyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gXCJtZXNzYWdlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VNZXNzYWdlKG1zZyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gXCJvcHRpb25cIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU9wdGlvbihtc2cpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4gPT09IFwic2VydmljZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlU2VydmljZShtc2cpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4gPT09IFwiZXh0ZW5zaW9uc1wiKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtc2cuaGFzT3duUHJvcGVydHkoXCJleHRlbnNpb25zXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZ1tcImV4dGVuc2lvbnNcIl0gPSBtc2dbXCJleHRlbnNpb25zXCJdLmNvbmNhdCh0aGlzLl9wYXJzZUV4dGVuc2lvblJhbmdlcygpKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZ1tcImV4dGVuc2lvbnNcIl0gPSB0aGlzLl9wYXJzZUV4dGVuc2lvblJhbmdlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuID09PSBcInJlc2VydmVkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VJZ25vcmVkKCk7IC8vIFRPRE9cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuID09PSBcImV4dGVuZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRXh0ZW5kKG1zZyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvdG8zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgZmllbGQgcnVsZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZUZpZWxkKG1zZywgXCJvcHRpb25hbFwiLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbWVzc2FnZSB0b2tlbjogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG4ub21pdChcIjtcIik7XHJcbiAgICAgICAgICAgIHBhcmVudFtcIm1lc3NhZ2VzXCJdLnB1c2gobXNnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1zZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYW4gaWdub3JlZCBzdGF0ZW1lbnQuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlSWdub3JlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy50bi5wZWVrKCkgIT09ICc7JylcclxuICAgICAgICAgICAgICAgIHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhIG1lc3NhZ2UgZmllbGQuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBtc2cgTWVzc2FnZSBkZWZpbml0aW9uXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgRmllbGQgcnVsZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gdHlwZSBGaWVsZCB0eXBlIGlmIGFscmVhZHkga25vd24gKG5ldmVyIGtub3duIGZvciBtYXBzKVxyXG4gICAgICAgICAqIEByZXR1cm5zIHshT2JqZWN0fSBGaWVsZCBkZXNjcmlwdG9yXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlTWVzc2FnZUZpZWxkID0gZnVuY3Rpb24obXNnLCBydWxlLCB0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmICghTGFuZy5SVUxFLnRlc3QocnVsZSkpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbWVzc2FnZSBmaWVsZCBydWxlOiBcIitydWxlKTtcclxuICAgICAgICAgICAgdmFyIGZsZCA9IHtcclxuICAgICAgICAgICAgICAgIFwicnVsZVwiOiBydWxlLFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiOiB7fSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogMFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgdG9rZW47XHJcbiAgICAgICAgICAgIGlmIChydWxlID09PSBcIm1hcFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoJzwnKTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUxhbmcuVFlQRS50ZXN0KHRva2VuKSAmJiAhTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBtZXNzYWdlIGZpZWxkIHR5cGU6IFwiICsgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgZmxkW1wia2V5dHlwZVwiXSA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKCcsJyk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEUudGVzdCh0b2tlbikgJiYgIUxhbmcuVFlQRVJFRi50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbWVzc2FnZSBmaWVsZDogXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBmbGRbXCJ0eXBlXCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoJz4nKTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUxhbmcuTkFNRS50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbWVzc2FnZSBmaWVsZCBuYW1lOiBcIiArIHRva2VuKTtcclxuICAgICAgICAgICAgICAgIGZsZFtcIm5hbWVcIl0gPSB0b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICBmbGRbXCJpZFwiXSA9IG1rSWQodGhpcy50bi5uZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ1snKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRmllbGRPcHRpb25zKGZsZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gdHlwZW9mIHR5cGUgIT09ICd1bmRlZmluZWQnID8gdHlwZSA6IHRoaXMudG4ubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcImdyb3VwXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJBIFtsZWdhY3ldIGdyb3VwIHNpbXBseSBjb21iaW5lcyBhIG5lc3RlZCBtZXNzYWdlIHR5cGUgYW5kIGEgZmllbGQgaW50byBhIHNpbmdsZSBkZWNsYXJhdGlvbi4gSW4geW91clxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvZGUsIHlvdSBjYW4gdHJlYXQgdGhpcyBtZXNzYWdlIGp1c3QgYXMgaWYgaXQgaGFkIGEgUmVzdWx0IHR5cGUgZmllbGQgY2FsbGVkIHJlc3VsdCAodGhlIGxhdHRlciBuYW1lIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udmVydGVkIHRvIGxvd2VyLWNhc2Ugc28gdGhhdCBpdCBkb2VzIG5vdCBjb25mbGljdCB3aXRoIHRoZSBmb3JtZXIpLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdycCA9IHRoaXMuX3BhcnNlTWVzc2FnZShtc2csIGZsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvXltBLVpdLy50ZXN0KGdycFtcIm5hbWVcIl0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcignaWxsZWdhbCBncm91cCBuYW1lOiAnK2dycFtcIm5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsZFtcInR5cGVcIl0gPSBncnBbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsZFtcIm5hbWVcIl0gPSBncnBbXCJuYW1lXCJdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5vbWl0KFwiO1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUxhbmcuVFlQRS50ZXN0KHR5cGUpICYmICFMYW5nLlRZUEVSRUYudGVzdCh0eXBlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG1lc3NhZ2UgZmllbGQgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBmbGRbXCJ0eXBlXCJdID0gdHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghTGFuZy5OQU1FLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbWVzc2FnZSBmaWVsZCBuYW1lOiBcIiArIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICBmbGRbXCJuYW1lXCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiPVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmbGRbXCJpZFwiXSA9IG1rSWQodGhpcy50bi5uZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5wZWVrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBcIltcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VGaWVsZE9wdGlvbnMoZmxkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtc2dbXCJmaWVsZHNcIl0ucHVzaChmbGQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmxkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhIG1lc3NhZ2Ugb25lb2YuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBtc2cgTWVzc2FnZSBkZWZpbml0aW9uXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlTWVzc2FnZU9uZU9mID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoIUxhbmcuTkFNRS50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBvbmVvZiBuYW1lOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBmbGQ7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwie1wiKTtcclxuICAgICAgICAgICAgd2hpbGUgKCh0b2tlbiA9IHRoaXMudG4ubmV4dCgpKSAhPT0gXCJ9XCIpIHtcclxuICAgICAgICAgICAgICAgIGZsZCA9IHRoaXMuX3BhcnNlTWVzc2FnZUZpZWxkKG1zZywgXCJvcHRpb25hbFwiLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBmbGRbXCJvbmVvZlwiXSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZHMucHVzaChmbGRbXCJpZFwiXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50bi5vbWl0KFwiO1wiKTtcclxuICAgICAgICAgICAgbXNnW1wib25lb2ZzXCJdW25hbWVdID0gZmllbGRzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhIHNldCBvZiBmaWVsZCBvcHRpb24gZGVmaW5pdGlvbnMuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBmbGQgRmllbGQgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZUZpZWxkT3B0aW9ucyA9IGZ1bmN0aW9uKGZsZCkge1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCJbXCIpO1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBmaXJzdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHdoaWxlICgodG9rZW4gPSB0aGlzLnRuLnBlZWsoKSkgIT09ICddJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VPcHRpb24oZmxkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIGFuIGVudW0uXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBtc2cgTWVzc2FnZSBkZWZpbml0aW9uXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlRW51bSA9IGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgICAgICB2YXIgZW5tID0ge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiOiB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbmFtZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICBlbm1bXCJuYW1lXCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIntcIik7XHJcbiAgICAgICAgICAgIHdoaWxlICgodG9rZW4gPSB0aGlzLnRuLm5leHQoKSkgIT09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBcIm9wdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uKGVubSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUxhbmcuTkFNRS50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG5hbWU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiB0b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBta0lkKHRoaXMudG4ubmV4dCgpLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IFwiW1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZUZpZWxkT3B0aW9ucyh7IFwib3B0aW9uc1wiOiB7fSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVubVtcInZhbHVlc1wiXS5wdXNoKHZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50bi5vbWl0KFwiO1wiKTtcclxuICAgICAgICAgICAgbXNnW1wiZW51bXNcIl0ucHVzaChlbm0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBleHRlbnNpb24gLyByZXNlcnZlZCByYW5nZXMuXHJcbiAgICAgICAgICogQHJldHVybnMgeyFBcnJheS48IUFycmF5LjxudW1iZXI+Pn1cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VFeHRlbnNpb25SYW5nZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4sXHJcbiAgICAgICAgICAgICAgICByYW5nZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICByYW5nZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBQcm90b0J1Zi5JRF9NSU47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1heFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBQcm90b0J1Zi5JRF9NQVg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWtOdW1iZXIodG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZS5sZW5ndGggPT09IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRuLnBlZWsoKSAhPT0gXCJ0b1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByYW5nZXMucHVzaChyYW5nZSk7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHRoaXMudG4ub21pdChcIixcIikpO1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZ2VzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhbiBleHRlbmQgYmxvY2suXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBwYXJlbnQgUGFyZW50IG9iamVjdFxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZUV4dGVuZCA9IGZ1bmN0aW9uKHBhcmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgZXh0ZW5kIHJlZmVyZW5jZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICB2YXIgZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJyZWZcIjogdG9rZW4sXHJcbiAgICAgICAgICAgICAgICBcImZpZWxkc1wiOiBbXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCJ7XCIpO1xyXG4gICAgICAgICAgICB3aGlsZSAoKHRva2VuID0gdGhpcy50bi5uZXh0KCkpICE9PSAnfScpIHtcclxuICAgICAgICAgICAgICAgIGlmIChMYW5nLlJVTEUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VNZXNzYWdlRmllbGQoZXh0LCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvdG8zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgZmllbGQgcnVsZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZUZpZWxkKGV4dCwgXCJvcHRpb25hbFwiLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgZXh0ZW5kIHRva2VuOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50bi5vbWl0KFwiO1wiKTtcclxuICAgICAgICAgICAgcGFyZW50W1wibWVzc2FnZXNcIl0ucHVzaChleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIEdlbmVyYWwgLS0tLS1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHBhcnNlci5cclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQYXJzZXIgYXQgbGluZSBcIit0aGlzLnRuLmxpbmU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkRvdFByb3RvLlBhcnNlclxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBEb3RQcm90by5QYXJzZXIgPSBQYXJzZXI7XHJcblxyXG4gICAgICAgIHJldHVybiBEb3RQcm90bztcclxuXHJcbiAgICB9KShQcm90b0J1ZiwgUHJvdG9CdWYuTGFuZyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5SZWZsZWN0ID0gKGZ1bmN0aW9uKFByb3RvQnVmKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlZmxlY3Rpb24gdHlwZXMuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdFxyXG4gICAgICAgICAqIEBuYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgUmVmbGVjdCA9IHt9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgUmVmbGVjdCBiYXNlIGNsYXNzLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuVFxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqIEBhYnN0cmFjdFxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0gez9Qcm90b0J1Zi5SZWZsZWN0LlR9IHBhcmVudCBQYXJlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgT2JqZWN0IG5hbWVcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgVCA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHBhcmVudCwgbmFtZSkge1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEJ1aWxkZXIgcmVmZXJlbmNlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IVByb3RvQnVmLkJ1aWxkZXJ9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRlciA9IGJ1aWxkZXI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUGFyZW50IG9iamVjdC5cclxuICAgICAgICAgICAgICogQHR5cGUgez9Qcm90b0J1Zi5SZWZsZWN0LlR9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9iamVjdCBuYW1lIGluIG5hbWVzcGFjZS5cclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGdWxseSBxdWFsaWZpZWQgY2xhc3MgbmFtZVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5ULnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBUUHJvdG90eXBlID0gVC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZ1bGx5IHF1YWxpZmllZCBuYW1lIG9mIHRoaXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEZ1bGx5IHF1YWxpZmllZCBuYW1lIGFzIG9mIFwiLlBBVEguVE8uVEhJU1wiXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRQcm90b3R5cGUuZnFuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgcHRyID0gdGhpcztcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgcHRyID0gcHRyLnBhcmVudDtcclxuICAgICAgICAgICAgICAgIGlmIChwdHIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBwdHIubmFtZStcIi5cIituYW1lO1xyXG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIFJlZmxlY3Qgb2JqZWN0IChpdHMgZnVsbHkgcXVhbGlmaWVkIG5hbWUpLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGluY2x1ZGVDbGFzcyBTZXQgdG8gdHJ1ZSB0byBpbmNsdWRlIHRoZSBjbGFzcyBuYW1lLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuICAgICAgICAgKiBAcmV0dXJuIFN0cmluZyByZXByZXNlbnRhdGlvblxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBUUHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oaW5jbHVkZUNsYXNzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoaW5jbHVkZUNsYXNzID8gdGhpcy5jbGFzc05hbWUgKyBcIiBcIiA6IFwiXCIpICsgdGhpcy5mcW4oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhpcyB0eXBlLlxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGlzIHR5cGUgY2Fubm90IGJlIGJ1aWx0IGRpcmVjdGx5XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRQcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IodGhpcy50b1N0cmluZyh0cnVlKStcIiBjYW5ub3QgYmUgYnVpbHQgZGlyZWN0bHlcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuVFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0LlQgPSBUO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IE5hbWVzcGFjZS5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0gez9Qcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZX0gcGFyZW50IE5hbWVzcGFjZSBwYXJlbnRcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lc3BhY2UgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE5hbWVzcGFjZSBvcHRpb25zXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmc/fSBzeW50YXggVGhlIHN5bnRheCBsZXZlbCBvZiB0aGlzIGRlZmluaXRpb24gKGUuZy4sIHByb3RvMylcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0LlRcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgTmFtZXNwYWNlID0gZnVuY3Rpb24oYnVpbGRlciwgcGFyZW50LCBuYW1lLCBvcHRpb25zLCBzeW50YXgpIHtcclxuICAgICAgICAgICAgVC5jYWxsKHRoaXMsIGJ1aWxkZXIsIHBhcmVudCwgbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiTmFtZXNwYWNlXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ2hpbGRyZW4gaW5zaWRlIHRoZSBuYW1lc3BhY2UuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshQXJyYXkuPFByb3RvQnVmLlJlZmxlY3QuVD59XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3B0aW9ucy5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFPYmplY3QuPHN0cmluZywgKj59XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN5bnRheCBsZXZlbCAoZS5nLiwgcHJvdG8yIG9yIHByb3RvMykuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshc3RyaW5nfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5zeW50YXggPSBzeW50YXggfHwgXCJwcm90bzJcIjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2UucHJvdG90eXBlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIE5hbWVzcGFjZVByb3RvdHlwZSA9IE5hbWVzcGFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFQucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgbmFtZXNwYWNlJ3MgY2hpbGRyZW4uXHJcbiAgICAgICAgICogQHBhcmFtIHtQcm90b0J1Zi5SZWZsZWN0LlQ9fSB0eXBlIEZpbHRlciB0eXBlIChyZXR1cm5zIGluc3RhbmNlcyBvZiB0aGlzIHR5cGUgb25seSkuIERlZmF1bHRzIHRvIG51bGwgKGFsbCBjaGlsZHJlbikuXHJcbiAgICAgICAgICogQHJldHVybiB7QXJyYXkuPFByb3RvQnVmLlJlZmxlY3QuVD59XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE5hbWVzcGFjZVByb3RvdHlwZS5nZXRDaGlsZHJlbiA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgdHlwZSA9IHR5cGUgfHwgbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8azsgKytpKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV0gaW5zdGFuY2VvZiB0eXBlKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGRzIGEgY2hpbGQgdG8gdGhlIG5hbWVzcGFjZS5cclxuICAgICAgICAgKiBAcGFyYW0ge1Byb3RvQnVmLlJlZmxlY3QuVH0gY2hpbGQgQ2hpbGRcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGNoaWxkIGNhbm5vdCBiZSBhZGRlZCAoZHVwbGljYXRlKVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICAgICAgICB2YXIgb3RoZXI7XHJcbiAgICAgICAgICAgIGlmIChvdGhlciA9IHRoaXMuZ2V0Q2hpbGQoY2hpbGQubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRyeSB0byByZXZlcnQgY2FtZWxjYXNlIHRyYW5zZm9ybWF0aW9uIG9uIGNvbGxpc2lvblxyXG4gICAgICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgTWVzc2FnZS5GaWVsZCAmJiBvdGhlci5uYW1lICE9PSBvdGhlci5vcmlnaW5hbE5hbWUgJiYgdGhpcy5nZXRDaGlsZChvdGhlci5vcmlnaW5hbE5hbWUpID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIG90aGVyLm5hbWUgPSBvdGhlci5vcmlnaW5hbE5hbWU7IC8vIFJldmVydCBwcmV2aW91cyBmaXJzdCAoZWZmZWN0aXZlbHkga2VlcHMgYm90aCBvcmlnaW5hbHMpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIE1lc3NhZ2UuRmllbGQgJiYgY2hpbGQubmFtZSAhPT0gY2hpbGQub3JpZ2luYWxOYW1lICYmIHRoaXMuZ2V0Q2hpbGQoY2hpbGQub3JpZ2luYWxOYW1lKSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5uYW1lID0gY2hpbGQub3JpZ2luYWxOYW1lO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiRHVwbGljYXRlIG5hbWUgaW4gbmFtZXNwYWNlIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK2NoaWxkLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyBhIGNoaWxkIGJ5IGl0cyBuYW1lIG9yIGlkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gbmFtZU9ySWQgQ2hpbGQgbmFtZSBvciBpZFxyXG4gICAgICAgICAqIEByZXR1cm4gez9Qcm90b0J1Zi5SZWZsZWN0LlR9IFRoZSBjaGlsZCBvciBudWxsIGlmIG5vdCBmb3VuZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUuZ2V0Q2hpbGQgPSBmdW5jdGlvbihuYW1lT3JJZCkge1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gdHlwZW9mIG5hbWVPcklkID09PSAnbnVtYmVyJyA/ICdpZCcgOiAnbmFtZSc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MCwgaz10aGlzLmNoaWxkcmVuLmxlbmd0aDsgaTxrOyArK2kpXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXVtrZXldID09PSBuYW1lT3JJZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVzb2x2ZXMgYSByZWZsZWN0IG9iamVjdCBpbnNpZGUgb2YgdGhpcyBuYW1lc3BhY2UuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8IUFycmF5LjxzdHJpbmc+fSBxbiBRdWFsaWZpZWQgbmFtZSB0byByZXNvbHZlXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gZXhjbHVkZU5vbk5hbWVzcGFjZSBFeGNsdWRlcyBub24tbmFtZXNwYWNlIHR5cGVzLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICogQHJldHVybiB7P1Byb3RvQnVmLlJlZmxlY3QuTmFtZXNwYWNlfSBUaGUgcmVzb2x2ZWQgdHlwZSBvciBudWxsIGlmIG5vdCBmb3VuZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHFuLCBleGNsdWRlTm9uTmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0ID0gdHlwZW9mIHFuID09PSAnc3RyaW5nJyA/IHFuLnNwbGl0KFwiLlwiKSA6IHFuLFxyXG4gICAgICAgICAgICAgICAgcHRyID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICBpZiAocGFydFtpXSA9PT0gXCJcIikgeyAvLyBGdWxseSBxdWFsaWZpZWQgbmFtZSwgZS5nLiBcIi5NeS5NZXNzYWdlJ1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHB0ci5wYXJlbnQgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgcHRyID0gcHRyLnBhcmVudDtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgY2hpbGQ7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShwdHIgaW5zdGFuY2VvZiBSZWZsZWN0Lk5hbWVzcGFjZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHRyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gcHRyLmdldENoaWxkKHBhcnRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hpbGQgfHwgIShjaGlsZCBpbnN0YW5jZW9mIFJlZmxlY3QuVCkgfHwgKGV4Y2x1ZGVOb25OYW1lc3BhY2UgJiYgIShjaGlsZCBpbnN0YW5jZW9mIFJlZmxlY3QuTmFtZXNwYWNlKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHRyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHB0ciA9IGNoaWxkOyBpKys7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChpIDwgcGFydC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHB0ciAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrOyAvLyBGb3VuZFxyXG4gICAgICAgICAgICAgICAgLy8gRWxzZSBzZWFyY2ggdGhlIHBhcmVudFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5yZXNvbHZlKHFuLCBleGNsdWRlTm9uTmFtZXNwYWNlKTtcclxuICAgICAgICAgICAgfSB3aGlsZSAocHRyICE9IG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHRyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERldGVybWluZXMgdGhlIHNob3J0ZXN0IHF1YWxpZmllZCBuYW1lIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSwgaWYgYW55LCByZWxhdGl2ZSB0byB0aGlzIG5hbWVzcGFjZS5cclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0LlR9IHQgUmVmbGVjdGlvbiB0eXBlXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHNob3J0ZXN0IHF1YWxpZmllZCBuYW1lIG9yLCBpZiB0aGVyZSBpcyBub25lLCB0aGUgZnFuXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE5hbWVzcGFjZVByb3RvdHlwZS5xbiA9IGZ1bmN0aW9uKHQpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnQgPSBbXSwgcHRyID0gdDtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgcGFydC51bnNoaWZ0KHB0ci5uYW1lKTtcclxuICAgICAgICAgICAgICAgIHB0ciA9IHB0ci5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHB0ciAhPT0gbnVsbCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGxlbj0xOyBsZW4gPD0gcGFydC5sZW5ndGg7IGxlbisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcW4gPSBwYXJ0LnNsaWNlKHBhcnQubGVuZ3RoLWxlbik7XHJcbiAgICAgICAgICAgICAgICBpZiAodCA9PT0gdGhpcy5yZXNvbHZlKHFuLCB0IGluc3RhbmNlb2YgUmVmbGVjdC5OYW1lc3BhY2UpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBxbi5qb2luKFwiLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdC5mcW4oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhlIG5hbWVzcGFjZSBhbmQgcmV0dXJucyB0aGUgcnVudGltZSBjb3VudGVycGFydC5cclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3QuPHN0cmluZyxGdW5jdGlvbnxPYmplY3Q+fSBSdW50aW1lIG5hbWVzcGFjZVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLyoqIEBkaWN0ICovXHJcbiAgICAgICAgICAgIHZhciBucyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9Y2hpbGRyZW4ubGVuZ3RoLCBjaGlsZDsgaTxrOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBOYW1lc3BhY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgbnNbY2hpbGQubmFtZV0gPSBjaGlsZC5idWlsZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsIFwiJG9wdGlvbnNcIiwgeyBcInZhbHVlXCI6IHRoaXMuYnVpbGRPcHQoKSB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG5zO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkcyB0aGUgbmFtZXNwYWNlJ3MgJyRvcHRpb25zJyBwcm9wZXJ0eS5cclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUuYnVpbGRPcHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG9wdCA9IHt9LFxyXG4gICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MCwgaz1rZXlzLmxlbmd0aDsgaTxrOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMub3B0aW9uc1trZXlzW2ldXTtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IE9wdGlvbnMgYXJlIG5vdCByZXNvbHZlZCwgeWV0LlxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKHZhbCBpbnN0YW5jZW9mIE5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG9wdFtrZXldID0gdmFsLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3B0W2tleV0gPSB2YWw7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9wdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSB2YWx1ZSBhc3NpZ25lZCB0byB0aGUgb3B0aW9uIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gbmFtZSBSZXR1cm5zIHRoZSBvcHRpb24gdmFsdWUgaWYgc3BlY2lmaWVkLCBvdGhlcndpc2UgYWxsIG9wdGlvbnMgYXJlIHJldHVybmVkLlxyXG4gICAgICAgICAqIEByZXR1cm4geyp8T2JqZWN0LjxzdHJpbmcsKj59bnVsbH0gT3B0aW9uIHZhbHVlIG9yIE5VTEwgaWYgdGhlcmUgaXMgbm8gc3VjaCBvcHRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUuZ2V0T3B0aW9uID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucztcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLm9wdGlvbnNbbmFtZV0gIT09ICd1bmRlZmluZWQnID8gdGhpcy5vcHRpb25zW25hbWVdIDogbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2VcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5OYW1lc3BhY2UgPSBOYW1lc3BhY2U7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgRWxlbWVudCBpbXBsZW1lbnRhdGlvbiB0aGF0IGNoZWNrcyBhbmQgY29udmVydHMgdmFsdWVzIGZvciBhXHJcbiAgICAgICAgICogcGFydGljdWxhciBmaWVsZCB0eXBlLCBhcyBhcHByb3ByaWF0ZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEFuIEVsZW1lbnQgcmVwcmVzZW50cyBhIHNpbmdsZSB2YWx1ZTogZWl0aGVyIHRoZSB2YWx1ZSBvZiBhIHNpbmd1bGFyIGZpZWxkLFxyXG4gICAgICAgICAqIG9yIGEgdmFsdWUgY29udGFpbmVkIGluIG9uZSBlbnRyeSBvZiBhIHJlcGVhdGVkIGZpZWxkIG9yIG1hcCBmaWVsZC4gVGhpc1xyXG4gICAgICAgICAqIGNsYXNzIGRvZXMgbm90IGltcGxlbWVudCB0aGVzZSBoaWdoZXItbGV2ZWwgY29uY2VwdHM7IGl0IG9ubHkgZW5jYXBzdWxhdGVzXHJcbiAgICAgICAgICogdGhlIGxvdy1sZXZlbCB0eXBlY2hlY2tpbmcgYW5kIGNvbnZlcnNpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LkVsZW1lbnRcclxuICAgICAgICAgKiBAcGFyYW0ge3tuYW1lOiBzdHJpbmcsIHdpcmVUeXBlOiBudW1iZXJ9fSB0eXBlIFJlc29sdmVkIGRhdGEgdHlwZVxyXG4gICAgICAgICAqIEBwYXJhbSB7UHJvdG9CdWYuUmVmbGVjdC5UfG51bGx9IHJlc29sdmVkVHlwZSBSZXNvbHZlZCB0eXBlLCBpZiByZWxldmFudFxyXG4gICAgICAgICAqIChlLmcuIHN1Ym1lc3NhZ2UgZmllbGQpLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNNYXBLZXkgSXMgdGhpcyBlbGVtZW50IGEgTWFwIGtleT8gVGhlIHZhbHVlIHdpbGwgYmVcclxuICAgICAgICAgKiBjb252ZXJ0ZWQgdG8gc3RyaW5nIGZvcm0gaWYgc28uXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN5bnRheCBTeW50YXggbGV2ZWwgb2YgZGVmaW5pbmcgbWVzc2FnZSB0eXBlLCBlLmcuLFxyXG4gICAgICAgICAqIHByb3RvMiBvciBwcm90bzMuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZmllbGQgY29udGFpbmluZyB0aGlzIGVsZW1lbnQgKGZvciBlcnJvclxyXG4gICAgICAgICAqIG1lc3NhZ2VzKVxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBFbGVtZW50ID0gZnVuY3Rpb24odHlwZSwgcmVzb2x2ZWRUeXBlLCBpc01hcEtleSwgc3ludGF4LCBuYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRWxlbWVudCB0eXBlLCBhcyBhIHN0cmluZyAoZS5nLiwgaW50MzIpLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7e25hbWU6IHN0cmluZywgd2lyZVR5cGU6IG51bWJlcn19XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVsZW1lbnQgdHlwZSByZWZlcmVuY2UgdG8gc3VibWVzc2FnZSBvciBlbnVtIGRlZmluaXRpb24sIGlmIG5lZWRlZC5cclxuICAgICAgICAgICAgICogQHR5cGUge1Byb3RvQnVmLlJlZmxlY3QuVHxudWxsfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFR5cGUgPSByZXNvbHZlZFR5cGU7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRWxlbWVudCBpcyBhIG1hcCBrZXkuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pc01hcEtleSA9IGlzTWFwS2V5O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN5bnRheCBsZXZlbCBvZiBkZWZpbmluZyBtZXNzYWdlIHR5cGUsIGUuZy4sIHByb3RvMiBvciBwcm90bzMuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnN5bnRheCA9IHN5bnRheDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBOYW1lIG9mIHRoZSBmaWVsZCBjb250YWluaW5nIHRoaXMgZWxlbWVudCAoZm9yIGVycm9yIG1lc3NhZ2VzKVxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc01hcEtleSAmJiBQcm90b0J1Zi5NQVBfS0VZX1RZUEVTLmluZGV4T2YodHlwZSkgPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbnZhbGlkIG1hcCBrZXkgdHlwZTogXCIgKyB0eXBlLm5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBFbGVtZW50UHJvdG90eXBlID0gRWxlbWVudC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9idGFpbnMgYSAobmV3KSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgc3BlY2lmaWVkIHR5cGUuXHJcbiAgICAgICAgICogQHBhcmFtIHR5cGUge3N0cmluZ3x7bmFtZTogc3RyaW5nLCB3aXJlVHlwZTogbnVtYmVyfX0gRmllbGQgdHlwZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHsqfSBEZWZhdWx0IHZhbHVlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbWtEZWZhdWx0KHR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIHR5cGUgPSBQcm90b0J1Zi5UWVBFU1t0eXBlXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlLmRlZmF1bHRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImRlZmF1bHQgdmFsdWUgZm9yIHR5cGUgXCIrdHlwZS5uYW1lK1wiIGlzIG5vdCBzdXBwb3J0ZWRcIik7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJ5dGVCdWZmZXIoMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlLmRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoaXMgZmllbGQgaW4gcHJvdG8zLlxyXG4gICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIHtzdHJpbmd8e25hbWU6IHN0cmluZywgd2lyZVR5cGU6IG51bWJlcn19IHRoZSBmaWVsZCB0eXBlXHJcbiAgICAgICAgICogQHJldHVybnMgeyp9IERlZmF1bHQgdmFsdWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBFbGVtZW50LmRlZmF1bHRGaWVsZFZhbHVlID0gbWtEZWZhdWx0O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYWtlcyBhIExvbmcgZnJvbSBhIHZhbHVlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7e2xvdzogbnVtYmVyLCBoaWdoOiBudW1iZXIsIHVuc2lnbmVkOiBib29sZWFufXxzdHJpbmd8bnVtYmVyfSB2YWx1ZSBWYWx1ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LCBkZWZhdWx0cyB0byByZXVzZSBpdCBmcm9tIExvbmctbGlrZSBvYmplY3RzIG9yIHRvIHNpZ25lZCBmb3JcclxuICAgICAgICAgKiAgc3RyaW5ncyBhbmQgbnVtYmVyc1xyXG4gICAgICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSBMb25nXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbWtMb25nKHZhbHVlLCB1bnNpZ25lZCkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxvdyA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlLmhpZ2ggPT09ICdudW1iZXInICYmIHR5cGVvZiB2YWx1ZS51bnNpZ25lZCA9PT0gJ2Jvb2xlYW4nXHJcbiAgICAgICAgICAgICAgICAmJiB2YWx1ZS5sb3cgPT09IHZhbHVlLmxvdyAmJiB2YWx1ZS5oaWdoID09PSB2YWx1ZS5oaWdoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm90b0J1Zi5Mb25nKHZhbHVlLmxvdywgdmFsdWUuaGlnaCwgdHlwZW9mIHVuc2lnbmVkID09PSAndW5kZWZpbmVkJyA/IHZhbHVlLnVuc2lnbmVkIDogdW5zaWduZWQpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm90b0J1Zi5Mb25nLmZyb21TdHJpbmcodmFsdWUsIHVuc2lnbmVkIHx8IGZhbHNlLCAxMCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb3RvQnVmLkxvbmcuZnJvbU51bWJlcih2YWx1ZSwgdW5zaWduZWQgfHwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vdCBjb252ZXJ0aWJsZSB0byBMb25nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRWxlbWVudFByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMubmFtZSB8fCAnJykgKyAodGhpcy5pc01hcEtleSA/ICdtYXAnIDogJ3ZhbHVlJykgKyAnIGVsZW1lbnQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiB2YWx1ZSBjYW4gYmUgc2V0IGZvciBhbiBlbGVtZW50IG9mIHRoaXMgdHlwZSAoc2luZ3VsYXJcclxuICAgICAgICAgKiBmaWVsZCBvciBvbmUgZWxlbWVudCBvZiBhIHJlcGVhdGVkIGZpZWxkIG9yIG1hcCkuXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBWYWx1ZSB0byBjaGVja1xyXG4gICAgICAgICAqIEByZXR1cm4geyp9IFZlcmlmaWVkLCBtYXliZSBhZGp1c3RlZCwgdmFsdWVcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSB2ZXJpZmllZCBmb3IgdGhpcyBlbGVtZW50IHNsb3RcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRWxlbWVudFByb3RvdHlwZS52ZXJpZnlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgZnVuY3Rpb24gZmFpbCh2YWwsIG1zZykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHZhbHVlIGZvciBcIitzZWxmLnRvU3RyaW5nKHRydWUpK1wiIG9mIHR5cGUgXCIrc2VsZi50eXBlLm5hbWUrXCI6IFwiK3ZhbCtcIiAoXCIrbXNnK1wiKVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2lnbmVkIDMyYml0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFjY291bnQgZm9yICFOYU46IHZhbHVlID09PSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8ICh2YWx1ZSA9PT0gdmFsdWUgJiYgdmFsdWUgJSAxICE9PSAwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwibm90IGFuIGludGVnZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID4gNDI5NDk2NzI5NSA/IHZhbHVlIHwgMCA6IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVuc2lnbmVkIDMyYml0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicgfHwgKHZhbHVlID09PSB2YWx1ZSAmJiB2YWx1ZSAlIDEgIT09IDApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJub3QgYW4gaW50ZWdlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPCAwID8gdmFsdWUgPj4+IDAgOiB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaWduZWQgNjRiaXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl06IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUHJvdG9CdWYuTG9uZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBta0xvbmcodmFsdWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIGUubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcInJlcXVpcmVzIExvbmcuanNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVW5zaWduZWQgNjRiaXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJ1aW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQ2NFwiXToge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChQcm90b0J1Zi5Mb25nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1rTG9uZyh2YWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJyZXF1aXJlcyBMb25nLmpzXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEJvb2xcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJib29sXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwibm90IGEgYm9vbGVhblwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRmxvYXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmbG9hdFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJkb3VibGVcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vdCBhIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGVuZ3RoLWRlbGltaXRlZCBzdHJpbmdcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzdHJpbmdcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgJiYgISh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vdCBhIHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIit2YWx1ZTsgLy8gQ29udmVydCBTdHJpbmcgb2JqZWN0IHRvIHN0cmluZ1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlbmd0aC1kZWxpbWl0ZWQgYnl0ZXNcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJieXRlc1wiXTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQnl0ZUJ1ZmZlci5pc0J5dGVCdWZmZXIodmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJ5dGVCdWZmZXIud3JhcCh2YWx1ZSwgXCJiYXNlNjRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29uc3RhbnQgZW51bSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImVudW1cIl06IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5yZXNvbHZlZFR5cGUuZ2V0Q2hpbGRyZW4oUHJvdG9CdWYuUmVmbGVjdC5FbnVtLlZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNbaV0ubmFtZSA9PSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbaV0uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlc1tpXS5pZCA9PSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbaV0uaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN5bnRheCA9PT0gJ3Byb3RvMycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvdG8zOiBqdXN0IG1ha2Ugc3VyZSBpdCdzIGFuIGludGVnZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8ICh2YWx1ZSA9PT0gdmFsdWUgJiYgdmFsdWUgJSAxICE9PSAwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vdCBhbiBpbnRlZ2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiA0Mjk0OTY3Mjk1IHx8IHZhbHVlIDwgMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vdCBpbiByYW5nZSBmb3IgdWludDMyXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm90bzIgcmVxdWlyZXMgZW51bSB2YWx1ZXMgdG8gYmUgdmFsaWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodmFsdWUsIFwibm90IGEgdmFsaWQgZW51bSB2YWx1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBFbWJlZGRlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZ3JvdXBcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wibWVzc2FnZVwiXToge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwib2JqZWN0IGV4cGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHRoaXMucmVzb2x2ZWRUeXBlLmNsYXp6KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pc21hdGNoZWQgdHlwZTogQ29udmVydCB0byBvYmplY3QgKHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Rjb2RlSU8vUHJvdG9CdWYuanMvaXNzdWVzLzE4MClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtpXSA9IHZhbHVlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG9iajtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRWxzZSBsZXQncyB0cnkgdG8gY29uc3RydWN0IG9uZSBmcm9tIGEga2V5LXZhbHVlIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgKHRoaXMucmVzb2x2ZWRUeXBlLmNsYXp6KSh2YWx1ZSk7IC8vIE1heSB0aHJvdyBmb3IgYSBodW5kcmVkIG9mIHJlYXNvbnNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2Ugc2hvdWxkIG5ldmVyIGVuZCBoZXJlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiW0lOVEVSTkFMXSBJbGxlZ2FsIHZhbHVlIGZvciBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit2YWx1ZStcIiAodW5kZWZpbmVkIHR5cGUgXCIrdGhpcy50eXBlK1wiKVwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxjdWxhdGVzIHRoZSBieXRlIGxlbmd0aCBvZiBhbiBlbGVtZW50IG9uIHRoZSB3aXJlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBGaWVsZCBudW1iZXJcclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIEZpZWxkIHZhbHVlXHJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBjYWxjdWxhdGVkXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVsZW1lbnRQcm90b3R5cGUuY2FsY3VsYXRlTGVuZ3RoID0gZnVuY3Rpb24oaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIDA7IC8vIE5vdGhpbmcgdG8gZW5jb2RlXHJcbiAgICAgICAgICAgIC8vIFRhZyBoYXMgYWxyZWFkeSBiZWVuIHdyaXR0ZW5cclxuICAgICAgICAgICAgdmFyIG47XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIDwgMCA/IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50NjQodmFsdWUpIDogQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoQnl0ZUJ1ZmZlci56aWdaYWdFbmNvZGUzMih2YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZmxvYXRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDY0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50NjQoQnl0ZUJ1ZmZlci56aWdaYWdFbmNvZGU2NCh2YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYm9vbFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJlbnVtXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJkb3VibGVcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDg7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic3RyaW5nXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIG4gPSBCeXRlQnVmZmVyLmNhbGN1bGF0ZVVURjhCeXRlcyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIobikgKyBuO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJ5dGVzXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5yZW1haW5pbmcoKSA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB2YWx1ZSBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrdmFsdWUucmVtYWluaW5nKCkrXCIgYnl0ZXMgcmVtYWluaW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKHZhbHVlLnJlbWFpbmluZygpKSArIHZhbHVlLnJlbWFpbmluZygpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMucmVzb2x2ZWRUeXBlLmNhbGN1bGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIobikgKyBuO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImdyb3VwXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLnJlc29sdmVkVHlwZS5jYWxjdWxhdGUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuICsgQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMigoaWQgPDwgMykgfCBQcm90b0J1Zi5XSVJFX1RZUEVTLkVOREdST1VQKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBXZSBzaG91bGQgbmV2ZXIgZW5kIGhlcmVcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJbSU5URVJOQUxdIElsbGVnYWwgdmFsdWUgdG8gZW5jb2RlIGluIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3ZhbHVlK1wiICh1bmtub3duIHR5cGUpXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVuY29kZXMgYSB2YWx1ZSB0byB0aGUgc3BlY2lmaWVkIGJ1ZmZlci4gRG9lcyBub3QgZW5jb2RlIHRoZSBrZXkuXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIEZpZWxkIG51bWJlclxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgRmllbGQgdmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0ge0J5dGVCdWZmZXJ9IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIGVuY29kZSB0b1xyXG4gICAgICAgICAqIEByZXR1cm4ge0J5dGVCdWZmZXJ9IFRoZSBCeXRlQnVmZmVyIGZvciBjaGFpbmluZ1xyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgY2Fubm90IGJlIGVuY29kZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRWxlbWVudFByb3RvdHlwZS5lbmNvZGVWYWx1ZSA9IGZ1bmN0aW9uKGlkLCB2YWx1ZSwgYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGJ1ZmZlcjsgLy8gTm90aGluZyB0byBlbmNvZGVcclxuICAgICAgICAgICAgLy8gVGFnIGhhcyBhbHJlYWR5IGJlZW4gd3JpdHRlblxyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIDMyYml0IHNpZ25lZCB2YXJpbnRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICAvLyBcIklmIHlvdSB1c2UgaW50MzIgb3IgaW50NjQgYXMgdGhlIHR5cGUgZm9yIGEgbmVnYXRpdmUgbnVtYmVyLCB0aGUgcmVzdWx0aW5nIHZhcmludCBpcyBhbHdheXMgdGVuIGJ5dGVzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9uZyDigJMgaXQgaXMsIGVmZmVjdGl2ZWx5LCB0cmVhdGVkIGxpa2UgYSB2ZXJ5IGxhcmdlIHVuc2lnbmVkIGludGVnZXIuXCIgKHNlZSAjMTIyKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDY0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAzMmJpdCB1bnNpZ25lZCB2YXJpbnRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJ1aW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDMyYml0IHZhcmludCB6aWctemFnXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyWmlnWmFnKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXhlZCB1bnNpZ25lZCAzMmJpdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVWludDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXhlZCBzaWduZWQgMzJiaXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVJbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjRiaXQgdmFyaW50IGFzLWlzXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDY0KHZhbHVlKTsgLy8gdGhyb3dzXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjRiaXQgdmFyaW50IHppZy16YWdcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50NjRaaWdaYWcodmFsdWUpOyAvLyB0aHJvd3NcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXhlZCB1bnNpZ25lZCA2NGJpdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVWludDY0KHZhbHVlKTsgLy8gdGhyb3dzXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRml4ZWQgc2lnbmVkIDY0Yml0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlSW50NjQodmFsdWUpOyAvLyB0aHJvd3NcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBCb29sXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYm9vbFwiXTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ZhbHNlJyA/IDAgOiAhIXZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKHZhbHVlID8gMSA6IDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENvbnN0YW50IGVudW0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJlbnVtXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAzMmJpdCBmbG9hdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZsb2F0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZUZsb2F0MzIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IGZsb2F0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZG91YmxlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZUZsb2F0NjQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlbmd0aC1kZWxpbWl0ZWQgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic3RyaW5nXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlbmd0aC1kZWxpbWl0ZWQgYnl0ZXNcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJieXRlc1wiXTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUucmVtYWluaW5nKCkgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgdmFsdWUgZm9yIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3ZhbHVlLnJlbWFpbmluZygpK1wiIGJ5dGVzIHJlbWFpbmluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldk9mZnNldCA9IHZhbHVlLm9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMih2YWx1ZS5yZW1haW5pbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmFwcGVuZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUub2Zmc2V0ID0gcHJldk9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBFbWJlZGRlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wibWVzc2FnZVwiXTpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYmIgPSBuZXcgQnl0ZUJ1ZmZlcigpLkxFKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFR5cGUuZW5jb2RlKHZhbHVlLCBiYik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIoYmIub2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIuYXBwZW5kKGJiLmZsaXAoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGVnYWN5IGdyb3VwXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZ3JvdXBcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFR5cGUuZW5jb2RlKHZhbHVlLCBidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKChpZCA8PCAzKSB8IFByb3RvQnVmLldJUkVfVFlQRVMuRU5ER1JPVVApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugc2hvdWxkIG5ldmVyIGVuZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJbSU5URVJOQUxdIElsbGVnYWwgdmFsdWUgdG8gZW5jb2RlIGluIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3ZhbHVlK1wiICh1bmtub3duIHR5cGUpXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBidWZmZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVjb2RlIG9uZSBlbGVtZW50IHZhbHVlIGZyb20gdGhlIHNwZWNpZmllZCBidWZmZXIuXHJcbiAgICAgICAgICogQHBhcmFtIHtCeXRlQnVmZmVyfSBidWZmZXIgQnl0ZUJ1ZmZlciB0byBkZWNvZGUgZnJvbVxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aXJlVHlwZSBUaGUgZmllbGQgd2lyZSB0eXBlXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIFRoZSBmaWVsZCBudW1iZXJcclxuICAgICAgICAgKiBAcmV0dXJuIHsqfSBEZWNvZGVkIHZhbHVlXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBmaWVsZCBjYW5ub3QgYmUgZGVjb2RlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBFbGVtZW50UHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uKGJ1ZmZlciwgd2lyZVR5cGUsIGlkKSB7XHJcbiAgICAgICAgICAgIGlmICh3aXJlVHlwZSAhPSB0aGlzLnR5cGUud2lyZVR5cGUpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVuZXhwZWN0ZWQgd2lyZSB0eXBlIGZvciBlbGVtZW50XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZhbHVlLCBuQnl0ZXM7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAzMmJpdCBzaWduZWQgdmFyaW50XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkVmFyaW50MzIoKSB8IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMzJiaXQgdW5zaWduZWQgdmFyaW50XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZhcmludDMyKCkgPj4+IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMzJiaXQgc2lnbmVkIHZhcmludCB6aWctemFnXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZhcmludDMyWmlnWmFnKCkgfCAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpeGVkIDMyYml0IHVuc2lnbmVkXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRVaW50MzIoKSA+Pj4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkSW50MzIoKSB8IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjRiaXQgc2lnbmVkIHZhcmludFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZhcmludDY0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjRiaXQgdW5zaWduZWQgdmFyaW50XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZhcmludDY0KCkudG9VbnNpZ25lZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IHNpZ25lZCB2YXJpbnQgemlnLXphZ1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWYXJpbnQ2NFppZ1phZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpeGVkIDY0Yml0IHVuc2lnbmVkXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRVaW50NjQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXhlZCA2NGJpdCBzaWduZWRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRJbnQ2NCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEJvb2wgdmFyaW50XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYm9vbFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFidWZmZXIucmVhZFZhcmludDMyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29uc3RhbnQgZW51bSB2YWx1ZSAodmFyaW50KVxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImVudW1cIl06XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBCdWlsZGVyLk1lc3NhZ2Ujc2V0IHdpbGwgYWxyZWFkeSB0aHJvd1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMzJiaXQgZmxvYXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmbG9hdFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRGbG9hdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IGZsb2F0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZG91YmxlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZERvdWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlbmd0aC1kZWxpbWl0ZWQgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic3RyaW5nXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZW5ndGgtZGVsaW1pdGVkIGJ5dGVzXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl06IHtcclxuICAgICAgICAgICAgICAgICAgICBuQnl0ZXMgPSBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5yZW1haW5pbmcoKSA8IG5CeXRlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIG51bWJlciBvZiBieXRlcyBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrbkJ5dGVzK1wiIHJlcXVpcmVkIGJ1dCBnb3Qgb25seSBcIitidWZmZXIucmVtYWluaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYnVmZmVyLmNsb25lKCk7IC8vIE9mZnNldCBhbHJlYWR5IHNldFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmxpbWl0ID0gdmFsdWUub2Zmc2V0K25CeXRlcztcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIub2Zmc2V0ICs9IG5CeXRlcztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGVuZ3RoLWRlbGltaXRlZCBlbWJlZGRlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wibWVzc2FnZVwiXToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5CeXRlcyA9IGJ1ZmZlci5yZWFkVmFyaW50MzIoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlZFR5cGUuZGVjb2RlKGJ1ZmZlciwgbkJ5dGVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZWdhY3kgZ3JvdXBcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJncm91cFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlZFR5cGUuZGVjb2RlKGJ1ZmZlciwgLTEsIGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2Ugc2hvdWxkIG5ldmVyIGVuZCBoZXJlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiW0lOVEVSTkFMXSBJbGxlZ2FsIGRlY29kZSB0eXBlXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGEgdmFsdWUgZnJvbSBhIHN0cmluZyB0byB0aGUgY2Fub25pY2FsIGVsZW1lbnQgdHlwZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIExlZ2FsIG9ubHkgd2hlbiBpc01hcEtleSBpcyB0cnVlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHZhbHVlXHJcbiAgICAgICAgICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVsZW1lbnRQcm90b3R5cGUudmFsdWVGcm9tU3RyaW5nID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01hcEtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ2YWx1ZUZyb21TdHJpbmcoKSBjYWxsZWQgb24gbm9uLW1hcC1rZXkgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVyaWZ5VmFsdWUocGFyc2VJbnQoc3RyKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJ1aW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICAgIC8vIExvbmctYmFzZWQgZmllbGRzIHN1cHBvcnQgY29udmVyc2lvbnMgZnJvbSBzdHJpbmcgYWxyZWFkeS5cclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlcmlmeVZhbHVlKHN0cik7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJvb2xcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyID09PSBcInRydWVcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic3RyaW5nXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVyaWZ5VmFsdWUoc3RyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQnl0ZUJ1ZmZlci5mcm9tQmluYXJ5KHN0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIHZhbHVlIGZyb20gdGhlIGNhbm9uaWNhbCBlbGVtZW50IHR5cGUgdG8gYSBzdHJpbmcuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBJdCBzaG91bGQgYmUgdGhlIGNhc2UgdGhhdCBgdmFsdWVGcm9tU3RyaW5nKHZhbHVlVG9TdHJpbmcodmFsKSlgIHJldHVybnNcclxuICAgICAgICAgKiBhIHZhbHVlIGVxdWl2YWxlbnQgdG8gYHZlcmlmeVZhbHVlKHZhbClgIGZvciBldmVyeSBsZWdhbCB2YWx1ZSBvZiBgdmFsYFxyXG4gICAgICAgICAqIGFjY29yZGluZyB0byB0aGlzIGVsZW1lbnQgdHlwZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgbWF5IGJlIHVzZWQgd2hlbiB0aGUgZWxlbWVudCBtdXN0IGJlIHN0b3JlZCBvciB1c2VkIGFzIGEgc3RyaW5nLFxyXG4gICAgICAgICAqIGUuZy4sIGFzIGEgbWFwIGtleSBvbiBhbiBPYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBMZWdhbCBvbmx5IHdoZW4gaXNNYXBLZXkgaXMgdHJ1ZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzdHJpbmcgZm9ybSBvZiB0aGUgdmFsdWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRWxlbWVudFByb3RvdHlwZS52YWx1ZVRvU3RyaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTWFwS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInZhbHVlVG9TdHJpbmcoKSBjYWxsZWQgb24gbm9uLW1hcC1rZXkgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gUHJvdG9CdWYuVFlQRVNbXCJieXRlc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKFwiYmluYXJ5XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5FbGVtZW50XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuRWxlbWVudCA9IEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgTWVzc2FnZS5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2V9IHBhcmVudCBQYXJlbnQgbWVzc2FnZSBvciBuYW1lc3BhY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNZXNzYWdlIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBNZXNzYWdlIG9wdGlvbnNcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBpc0dyb3VwIGB0cnVlYCBpZiB0aGlzIGlzIGEgbGVnYWN5IGdyb3VwXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmc/fSBzeW50YXggVGhlIHN5bnRheCBsZXZlbCBvZiB0aGlzIGRlZmluaXRpb24gKGUuZy4sIHByb3RvMylcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBNZXNzYWdlID0gZnVuY3Rpb24oYnVpbGRlciwgcGFyZW50LCBuYW1lLCBvcHRpb25zLCBpc0dyb3VwLCBzeW50YXgpIHtcclxuICAgICAgICAgICAgTmFtZXNwYWNlLmNhbGwodGhpcywgYnVpbGRlciwgcGFyZW50LCBuYW1lLCBvcHRpb25zLCBzeW50YXgpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIk1lc3NhZ2VcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBFeHRlbnNpb25zIHJhbmdlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IUFycmF5LjxudW1iZXI+fHVuZGVmaW5lZH1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5leHRlbnNpb25zID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFJ1bnRpbWUgbWVzc2FnZSBjbGFzcy5cclxuICAgICAgICAgICAgICogQHR5cGUgez9mdW5jdGlvbihuZXc6UHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlKX1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGF6eiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogV2hldGhlciB0aGlzIGlzIGEgbGVnYWN5IGdyb3VwIG9yIG5vdC5cclxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuaXNHcm91cCA9ICEhaXNHcm91cDtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY2FjaGVkIGNvbGxlY3Rpb25zIGFyZSB1c2VkIHRvIGVmZmljaWVudGx5IGl0ZXJhdGUgb3ZlciBvciBsb29rIHVwIGZpZWxkcyB3aGVuIGRlY29kaW5nLlxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENhY2hlZCBmaWVsZHMuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHs/QXJyYXkuPCFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQ+fVxyXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5fZmllbGRzID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDYWNoZWQgZmllbGRzIGJ5IGlkLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P09iamVjdC48bnVtYmVyLCFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQ+fVxyXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5fZmllbGRzQnlJZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ2FjaGVkIGZpZWxkcyBieSBuYW1lLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P09iamVjdC48c3RyaW5nLCFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQ+fVxyXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5fZmllbGRzQnlOYW1lID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBNZXNzYWdlUHJvdG90eXBlID0gTWVzc2FnZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE5hbWVzcGFjZS5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhlIG1lc3NhZ2UgYW5kIHJldHVybnMgdGhlIHJ1bnRpbWUgY291bnRlcnBhcnQsIHdoaWNoIGlzIGEgZnVsbHkgZnVuY3Rpb25hbCBjbGFzcy5cclxuICAgICAgICAgKiBAc2VlIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlYnVpbGQgV2hldGhlciB0byByZWJ1aWxkIG9yIG5vdCwgZGVmYXVsdHMgdG8gZmFsc2VcclxuICAgICAgICAgKiBAcmV0dXJuIHtQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9IE1lc3NhZ2UgY2xhc3NcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGJ1aWx0XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbihyZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXp6ICYmICFyZWJ1aWxkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xheno7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIHJ1bnRpbWUgTWVzc2FnZSBjbGFzcyBpbiBpdHMgb3duIHNjb3BlXHJcbiAgICAgICAgICAgIHZhciBjbGF6eiA9IChmdW5jdGlvbihQcm90b0J1ZiwgVCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBmaWVsZHMgPSBULmdldENoaWxkcmVuKFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZCksXHJcbiAgICAgICAgICAgICAgICAgICAgb25lb2ZzID0gVC5nZXRDaGlsZHJlbihQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuT25lT2YpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBydW50aW1lIE1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAqIEBjbGFzcyBCYXJlYm9uZSBvZiBhbGwgcnVudGltZSBtZXNzYWdlcy5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7IU9iamVjdC48c3RyaW5nLCo+fHN0cmluZ30gdmFsdWVzIFByZXNldCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Li4uc3RyaW5nfSB2YXJfYXJnc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGNyZWF0ZWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIE1lc3NhZ2UgPSBmdW5jdGlvbih2YWx1ZXMsIHZhcl9hcmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLmNhbGwodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB2aXJ0dWFsIG9uZW9mIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9b25lb2ZzLmxlbmd0aDsgaTxrOyArK2kpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbb25lb2ZzW2ldLm5hbWVdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZmllbGRzIGFuZCBzZXQgZGVmYXVsdCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MCwgaz1maWVsZHMubGVuZ3RoOyBpPGs7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBmaWVsZHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbZmllbGQubmFtZV0gPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQucmVwZWF0ZWQgPyBbXSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmllbGQubWFwID8gbmV3IFByb3RvQnVmLk1hcChmaWVsZCkgOiBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZC5yZXF1aXJlZCB8fCBULnN5bnRheCA9PT0gJ3Byb3RvMycpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2ZpZWxkLm5hbWVdID0gZmllbGQuZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IGZpZWxkIHZhbHVlcyBmcm9tIGEgdmFsdWVzIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB2YWx1ZXMgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlcyA9PT0gJ29iamVjdCcgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdCBfYW5vdGhlcl8gTWVzc2FnZSAqLyAodHlwZW9mIHZhbHVlcy5lbmNvZGUgIT09ICdmdW5jdGlvbicgfHwgdmFsdWVzIGluc3RhbmNlb2YgTWVzc2FnZSkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdCBhIHJlcGVhdGVkIGZpZWxkICovICFBcnJheS5pc0FycmF5KHZhbHVlcykgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdCBhIE1hcCAqLyAhKHZhbHVlcyBpbnN0YW5jZW9mIFByb3RvQnVmLk1hcCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdCBhIEJ5dGVCdWZmZXIgKi8gIUJ5dGVCdWZmZXIuaXNCeXRlQnVmZmVyKHZhbHVlcykgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdCBhbiBBcnJheUJ1ZmZlciAqLyAhKHZhbHVlcyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogbm90IGEgTG9uZyAqLyAhKFByb3RvQnVmLkxvbmcgJiYgdmFsdWVzIGluc3RhbmNlb2YgUHJvdG9CdWYuTG9uZykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNldCh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgLy8gU2V0IGZpZWxkIHZhbHVlcyBmcm9tIGFyZ3VtZW50cywgaW4gZGVjbGFyYXRpb24gb3JkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaT0wLCBrPWFyZ3VtZW50cy5sZW5ndGg7IGk8azsgKytpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlID0gYXJndW1lbnRzW2ldKSAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNldChmaWVsZHNbaV0ubmFtZSwgdmFsdWUpOyAvLyBNYXkgdGhyb3dcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5wcm90b3R5cGVcclxuICAgICAgICAgICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgTWVzc2FnZVByb3RvdHlwZSA9IE1lc3NhZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEFkZHMgYSB2YWx1ZSB0byBhIHJlcGVhdGVkIGZpZWxkLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2FkZFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEZpZWxkIG5hbWVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVmFsdWUgdG8gYWRkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0Fzc2VydCBXaGV0aGVyIHRvIGFzc2VydCB0aGUgdmFsdWUgb3Igbm90IChhc3NlcnRzIGJ5IGRlZmF1bHQpXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gdGhpc1xyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgYWRkZWRcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihrZXksIHZhbHVlLCBub0Fzc2VydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IFQuX2ZpZWxkc0J5TmFtZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9Bc3NlcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWVsZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMrXCIjXCIra2V5K1wiIGlzIHVuZGVmaW5lZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGQgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IodGhpcytcIiNcIitrZXkrXCIgaXMgbm90IGEgZmllbGQ6IFwiK2ZpZWxkLnRvU3RyaW5nKHRydWUpKTsgLy8gTWF5IHRocm93IGlmIGl0J3MgYW4gZW51bSBvciBlbWJlZGRlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmllbGQucmVwZWF0ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzK1wiI1wiK2tleStcIiBpcyBub3QgYSByZXBlYXRlZCBmaWVsZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmaWVsZC52ZXJpZnlWYWx1ZSh2YWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzW2tleV0gPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBBZGRzIGEgdmFsdWUgdG8gYSByZXBlYXRlZCBmaWVsZC4gVGhpcyBpcyBhbiBhbGlhcyBmb3Ige0BsaW5rIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNhZGR9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlIyRhZGRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBGaWVsZCBuYW1lXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFZhbHVlIHRvIGFkZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9Bc3NlcnQgV2hldGhlciB0byBhc3NlcnQgdGhlIHZhbHVlIG9yIG5vdCAoYXNzZXJ0cyBieSBkZWZhdWx0KVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IHRoaXNcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgY2Fubm90IGJlIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuJGFkZCA9IE1lc3NhZ2VQcm90b3R5cGUuYWRkO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2V0cyBhIGZpZWxkJ3MgdmFsdWUuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2Ujc2V0XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfCFPYmplY3QuPHN0cmluZywqPn0ga2V5T3JPYmogU3RyaW5nIGtleSBvciBwbGFpbiBvYmplY3QgaG9sZGluZyBtdWx0aXBsZSB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7KCp8Ym9vbGVhbik9fSB2YWx1ZSBWYWx1ZSB0byBzZXQgaWYga2V5IGlzIGEgc3RyaW5nLCBvdGhlcndpc2Ugb21pdHRlZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9Bc3NlcnQgV2hldGhlciB0byBub3QgYXNzZXJ0IGZvciBhbiBhY3R1YWwgZmllbGQgLyBwcm9wZXIgdmFsdWUgdHlwZSwgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IHRoaXNcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgY2Fubm90IGJlIHNldFxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleU9yT2JqLCB2YWx1ZSwgbm9Bc3NlcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5T3JPYmogJiYgdHlwZW9mIGtleU9yT2JqID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub0Fzc2VydCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpa2V5IGluIGtleU9yT2JqKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleU9yT2JqLmhhc093blByb3BlcnR5KGlrZXkpICYmIHR5cGVvZiAodmFsdWUgPSBrZXlPck9ialtpa2V5XSkgIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNldChpa2V5LCB2YWx1ZSwgbm9Bc3NlcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gVC5fZmllbGRzQnlOYW1lW2tleU9yT2JqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vQXNzZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmllbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzK1wiI1wiK2tleU9yT2JqK1wiIGlzIG5vdCBhIGZpZWxkOiB1bmRlZmluZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGZpZWxkIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMrXCIjXCIra2V5T3JPYmorXCIgaXMgbm90IGEgZmllbGQ6IFwiK2ZpZWxkLnRvU3RyaW5nKHRydWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmaWVsZC5uYW1lXSA9ICh2YWx1ZSA9IGZpZWxkLnZlcmlmeVZhbHVlKHZhbHVlKSk7IC8vIE1heSB0aHJvd1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleU9yT2JqXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZCAmJiBmaWVsZC5vbmVvZikgeyAvLyBGaWVsZCBpcyBwYXJ0IG9mIGFuIE9uZU9mIChub3QgYSB2aXJ0dWFsIE9uZU9mIGZpZWxkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudEZpZWxkID0gdGhpc1tmaWVsZC5vbmVvZi5uYW1lXTsgLy8gVmlydHVhbCBmaWVsZCByZWZlcmVuY2VzIGN1cnJlbnRseSBzZXQgZmllbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZpZWxkICE9PSBudWxsICYmIGN1cnJlbnRGaWVsZCAhPT0gZmllbGQubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2N1cnJlbnRGaWVsZF0gPSBudWxsOyAvLyBDbGVhciBjdXJyZW50bHkgc2V0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2ZpZWxkLm9uZW9mLm5hbWVdID0gZmllbGQubmFtZTsgLy8gUG9pbnQgdmlydHVhbCBmaWVsZCBhdCB0aGlzIGZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoLyogdmFsdWUgPT09IG51bGwgJiYgKi9jdXJyZW50RmllbGQgPT09IGtleU9yT2JqKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmaWVsZC5vbmVvZi5uYW1lXSA9IG51bGw7IC8vIENsZWFyIHZpcnR1YWwgZmllbGQgKGN1cnJlbnQgZmllbGQgZXhwbGljaXRseSBjbGVhcmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTZXRzIGEgZmllbGQncyB2YWx1ZS4gVGhpcyBpcyBhbiBhbGlhcyBmb3IgW0BsaW5rIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNzZXR9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlIyRzZXRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8IU9iamVjdC48c3RyaW5nLCo+fSBrZXlPck9iaiBTdHJpbmcga2V5IG9yIHBsYWluIG9iamVjdCBob2xkaW5nIG11bHRpcGxlIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHsoKnxib29sZWFuKT19IHZhbHVlIFZhbHVlIHRvIHNldCBpZiBrZXkgaXMgYSBzdHJpbmcsIG90aGVyd2lzZSBvbWl0dGVkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0Fzc2VydCBXaGV0aGVyIHRvIG5vdCBhc3NlcnQgdGhlIHZhbHVlLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBzZXRcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS4kc2V0ID0gTWVzc2FnZVByb3RvdHlwZS5zZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBHZXRzIGEgZmllbGQncyB2YWx1ZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNnZXRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXlcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vQXNzZXJ0IFdoZXRoZXIgdG8gbm90IGFzc2VydCBmb3IgYW4gYWN0dWFsIGZpZWxkLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHsqfSBWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZXJlIGlzIG5vIHN1Y2ggZmllbGRcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vQXNzZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vQXNzZXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IFQuX2ZpZWxkc0J5TmFtZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmllbGQgfHwgIShmaWVsZCBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMrXCIjXCIra2V5K1wiIGlzIG5vdCBhIGZpZWxkOiB1bmRlZmluZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGQgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzK1wiI1wiK2tleStcIiBpcyBub3QgYSBmaWVsZDogXCIrZmllbGQudG9TdHJpbmcodHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2ZpZWxkLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEdldHMgYSBmaWVsZCdzIHZhbHVlLiBUaGlzIGlzIGFuIGFsaWFzIGZvciB7QGxpbmsgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlIyRnZXR9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlIyRnZXRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXlcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4geyp9IFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlcmUgaXMgbm8gc3VjaCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLiRnZXQgPSBNZXNzYWdlUHJvdG90eXBlLmdldDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBHZXR0ZXJzIGFuZCBzZXR0ZXJzXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGZpZWxkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGZpZWxkc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBubyBzZXR0ZXJzIGZvciBleHRlbnNpb24gZmllbGRzIGFzIHRoZXNlIGFyZSBuYW1lZCBieSB0aGVpciBmcW5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRXh0ZW5zaW9uRmllbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoVC5idWlsZGVyLm9wdGlvbnNbJ3BvcHVsYXRlQWNjZXNzb3JzJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbihmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0L2dldFtTb21lVmFsdWVdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgTmFtZSA9IGZpZWxkLm9yaWdpbmFsTmFtZS5yZXBsYWNlKC8oX1thLXpBLVpdKS9nLCBmdW5jdGlvbihtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoJ18nLCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZSA9IE5hbWUuc3Vic3RyaW5nKDAsMSkudG9VcHBlckNhc2UoKSArIE5hbWUuc3Vic3RyaW5nKDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldC9nZXRfW3NvbWVfdmFsdWVdIEZJWE1FOiBEbyB3ZSByZWFsbHkgbmVlZCB0aGVzZT9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZmllbGQub3JpZ2luYWxOYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24obWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJfXCIrbWF0Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IGZpZWxkJ3MgdW5ib3VuZCBzZXR0ZXIgZnVuY3Rpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vQXNzZXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGVyID0gZnVuY3Rpb24odmFsdWUsIG5vQXNzZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmaWVsZC5uYW1lXSA9IG5vQXNzZXJ0ID8gdmFsdWUgOiBmaWVsZC52ZXJpZnlWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogVGhlIGN1cnJlbnQgZmllbGQncyB1bmJvdW5kIGdldHRlciBmdW5jdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdldHRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2ZpZWxkLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVC5nZXRDaGlsZChcInNldFwiK05hbWUpID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFNldHMgYSB2YWx1ZS4gVGhpcyBtZXRob2QgaXMgcHJlc2VudCBmb3IgZWFjaCBmaWVsZCwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbm8gbmFtZSBjb25mbGljdCB3aXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogIGFub3RoZXIgZmllbGQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3NldFtTb21lRmllbGRdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBWYWx1ZSB0byBzZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0Fzc2VydCBXaGV0aGVyIHRvIG5vdCBhc3NlcnQgdGhlIHZhbHVlLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAYWJzdHJhY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBzZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlW1wic2V0XCIrTmFtZV0gPSBzZXR0ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFQuZ2V0Q2hpbGQoXCJzZXRfXCIrbmFtZSkgPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogU2V0cyBhIHZhbHVlLiBUaGlzIG1ldGhvZCBpcyBwcmVzZW50IGZvciBlYWNoIGZpZWxkLCBidXQgb25seSBpZiB0aGVyZSBpcyBubyBuYW1lIGNvbmZsaWN0IHdpdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiAgYW5vdGhlciBmaWVsZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2Ujc2V0X1tzb21lX2ZpZWxkXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVmFsdWUgdG8gc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9Bc3NlcnQgV2hldGhlciB0byBub3QgYXNzZXJ0IHRoZSB2YWx1ZSwgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGFic3RyYWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZVtcInNldF9cIituYW1lXSA9IHNldHRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVC5nZXRDaGlsZChcImdldFwiK05hbWUpID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEdldHMgYSB2YWx1ZS4gVGhpcyBtZXRob2QgaXMgcHJlc2VudCBmb3IgZWFjaCBmaWVsZCwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbm8gbmFtZSBjb25mbGljdCB3aXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogIGFub3RoZXIgZmllbGQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2dldFtTb21lRmllbGRdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGFic3RyYWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Kn0gVGhlIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZVtcImdldFwiK05hbWVdID0gZ2V0dGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChULmdldENoaWxkKFwiZ2V0X1wiK25hbWUpID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEdldHMgYSB2YWx1ZS4gVGhpcyBtZXRob2QgaXMgcHJlc2VudCBmb3IgZWFjaCBmaWVsZCwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbm8gbmFtZSBjb25mbGljdCB3aXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogIGFub3RoZXIgZmllbGQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2dldF9bc29tZV9maWVsZF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHsqfSBUaGUgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAYWJzdHJhY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlW1wiZ2V0X1wiK25hbWVdID0gZ2V0dGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkoZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEVuLS9kZWNvZGluZ1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRW5jb2RlcyB0aGUgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSMkZW5jb2RlXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7KCFCeXRlQnVmZmVyfGJvb2xlYW4pPX0gYnVmZmVyIEJ5dGVCdWZmZXIgdG8gZW5jb2RlIHRvLiBXaWxsIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIGZsaXAgaXQgaWYgb21pdHRlZC5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vVmVyaWZ5IFdoZXRoZXIgdG8gbm90IHZlcmlmeSBmaWVsZCB2YWx1ZXMsIGRlZmF1bHRzIHRvIGBmYWxzZWBcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4geyFCeXRlQnVmZmVyfSBFbmNvZGVkIG1lc3NhZ2UgYXMgYSBCeXRlQnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBlbmNvZGVkIEJ5dGVCdWZmZXIgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKiBAc2VlIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGU2NFxyXG4gICAgICAgICAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlSGV4XHJcbiAgICAgICAgICAgICAgICAgKiBAc2VlIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVBQlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKGJ1ZmZlciwgbm9WZXJpZnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ2Jvb2xlYW4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub1ZlcmlmeSA9IGJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc05ldyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBuZXcgQnl0ZUJ1ZmZlcigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc05ldyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlID0gYnVmZmVyLmxpdHRsZUVuZGlhbjtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBULmVuY29kZSh0aGlzLCBidWZmZXIuTEUoKSwgbm9WZXJpZnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGlzTmV3ID8gYnVmZmVyLmZsaXAoKSA6IGJ1ZmZlcikuTEUobGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLkxFKGxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEVuY29kZXMgYSBtZXNzYWdlIHVzaW5nIHRoZSBzcGVjaWZpZWQgZGF0YSBwYXlsb2FkLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHshT2JqZWN0LjxzdHJpbmcsKj59IGRhdGEgRGF0YSBwYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyghQnl0ZUJ1ZmZlcnxib29sZWFuKT19IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIGVuY29kZSB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGFuZCBmbGlwIGl0IGlmIG9taXR0ZWQuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub1ZlcmlmeSBXaGV0aGVyIHRvIG5vdCB2ZXJpZnkgZmllbGQgdmFsdWVzLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshQnl0ZUJ1ZmZlcn0gRW5jb2RlZCBtZXNzYWdlIGFzIGEgQnl0ZUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlLmVuY29kZSA9IGZ1bmN0aW9uKGRhdGEsIGJ1ZmZlciwgbm9WZXJpZnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1lc3NhZ2UoZGF0YSkuZW5jb2RlKGJ1ZmZlciwgbm9WZXJpZnkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENhbGN1bGF0ZXMgdGhlIGJ5dGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2NhbGN1bGF0ZVxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBCeXRlIGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBjYWxjdWxhdGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVC5jYWxjdWxhdGUodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRW5jb2RlcyB0aGUgdmFyaW50MzIgbGVuZ3RoLWRlbGltaXRlZCBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2VuY29kZURlbGltaXRlZFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyghQnl0ZUJ1ZmZlcnxib29sZWFuKT19IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIGVuY29kZSB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGFuZCBmbGlwIGl0IGlmIG9taXR0ZWQuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub1ZlcmlmeSBXaGV0aGVyIHRvIG5vdCB2ZXJpZnkgZmllbGQgdmFsdWVzLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshQnl0ZUJ1ZmZlcn0gRW5jb2RlZCBtZXNzYWdlIGFzIGEgQnl0ZUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZW5jb2RlZCBCeXRlQnVmZmVyIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmVuY29kZURlbGltaXRlZCA9IGZ1bmN0aW9uKGJ1ZmZlciwgbm9WZXJpZnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1ZmZlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gbmV3IEJ5dGVCdWZmZXIoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbmMgPSBuZXcgQnl0ZUJ1ZmZlcigpLkxFKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5lbmNvZGUodGhpcywgZW5jLCBub1ZlcmlmeSkuZmxpcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKGVuYy5yZW1haW5pbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmFwcGVuZChlbmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05ldyA/IGJ1ZmZlci5mbGlwKCkgOiBidWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGlyZWN0bHkgZW5jb2RlcyB0aGUgbWVzc2FnZSB0byBhbiBBcnJheUJ1ZmZlci5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVBQlxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtBcnJheUJ1ZmZlcn0gRW5jb2RlZCBtZXNzYWdlIGFzIEFycmF5QnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBlbmNvZGVkIEFycmF5QnVmZmVyIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmVuY29kZUFCID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlKCkudG9BcnJheUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVbXCJlbmNvZGVkXCJdKSBlW1wiZW5jb2RlZFwiXSA9IGVbXCJlbmNvZGVkXCJdLnRvQXJyYXlCdWZmZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgYXMgYW4gQXJyYXlCdWZmZXIuIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlQUJ9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3RvQXJyYXlCdWZmZXJcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJ9IEVuY29kZWQgbWVzc2FnZSBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZW5jb2RlZCBBcnJheUJ1ZmZlciBpbiB0aGUgYGVuY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gTWVzc2FnZVByb3RvdHlwZS5lbmNvZGVBQjtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERpcmVjdGx5IGVuY29kZXMgdGhlIG1lc3NhZ2UgdG8gYSBub2RlIEJ1ZmZlci5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVOQlxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshQnVmZmVyfVxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkLCBub3QgcnVubmluZyB1bmRlciBub2RlLmpzIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmVcclxuICAgICAgICAgICAgICAgICAqICBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGwgcmV0dXJucyB0aGUgZW5jb2RlZCBub2RlIEJ1ZmZlciBpbiB0aGUgYGVuY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5lbmNvZGVOQiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVuY29kZSgpLnRvQnVmZmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtcImVuY29kZWRcIl0pIGVbXCJlbmNvZGVkXCJdID0gZVtcImVuY29kZWRcIl0udG9CdWZmZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgYXMgYSBub2RlIEJ1ZmZlci4gVGhpcyBpcyBhbiBhbGlhcyBmb3Ige0BsaW5rIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVOQn0uXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjdG9CdWZmZXJcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IUJ1ZmZlcn1cclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZW5jb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuIFRoZSBsYXRlciBzdGlsbFxyXG4gICAgICAgICAgICAgICAgICogIHJldHVybnMgdGhlIGVuY29kZWQgbm9kZSBCdWZmZXIgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUudG9CdWZmZXIgPSBNZXNzYWdlUHJvdG90eXBlLmVuY29kZU5CO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGlyZWN0bHkgZW5jb2RlcyB0aGUgbWVzc2FnZSB0byBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGU2NFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IEJhc2U2NCBlbmNvZGVkIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB1bmRlcmx5aW5nIGJ1ZmZlciBjYW5ub3QgYmUgZW5jb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuIFRoZSBsYXRlclxyXG4gICAgICAgICAgICAgICAgICogIHN0aWxsIHJldHVybnMgdGhlIGVuY29kZWQgYmFzZTY0IHN0cmluZyBpbiB0aGUgYGVuY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5lbmNvZGU2NCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVuY29kZSgpLnRvQmFzZTY0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtcImVuY29kZWRcIl0pIGVbXCJlbmNvZGVkXCJdID0gZVtcImVuY29kZWRcIl0udG9CYXNlNjQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgYXMgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlNjR9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3RvQmFzZTY0XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gQmFzZTY0IGVuY29kZWQgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBlbmNvZGVkIGJhc2U2NCBzdHJpbmcgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUudG9CYXNlNjQgPSBNZXNzYWdlUHJvdG90eXBlLmVuY29kZTY0O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGlyZWN0bHkgZW5jb2RlcyB0aGUgbWVzc2FnZSB0byBhIGhleCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVIZXhcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBIZXggZW5jb2RlZCBzdHJpbmdcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdW5kZXJseWluZyBidWZmZXIgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXJcclxuICAgICAgICAgICAgICAgICAqICBzdGlsbCByZXR1cm5zIHRoZSBlbmNvZGVkIGhleCBzdHJpbmcgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZW5jb2RlSGV4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlKCkudG9IZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW1wiZW5jb2RlZFwiXSkgZVtcImVuY29kZWRcIl0gPSBlW1wiZW5jb2RlZFwiXS50b0hleCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmV0dXJucyB0aGUgbWVzc2FnZSBhcyBhIGhleCBlbmNvZGVkIHN0cmluZy4gVGhpcyBpcyBhbiBhbGlhcyBmb3Ige0BsaW5rIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVIZXh9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3RvSGV4XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gSGV4IGVuY29kZWQgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBlbmNvZGVkIGhleCBzdHJpbmcgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUudG9IZXggPSBNZXNzYWdlUHJvdG90eXBlLmVuY29kZUhleDtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENsb25lcyBhIG1lc3NhZ2Ugb2JqZWN0IG9yIGZpZWxkIHZhbHVlIHRvIGEgcmF3IG9iamVjdC5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gb2JqIE9iamVjdCB0byBjbG9uZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBiaW5hcnlBc0Jhc2U2NCBXaGV0aGVyIHRvIGluY2x1ZGUgYmluYXJ5IGRhdGEgYXMgYmFzZTY0IHN0cmluZ3Mgb3IgYXMgYSBidWZmZXIgb3RoZXJ3aXNlXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGxvbmdzQXNTdHJpbmdzIFdoZXRoZXIgdG8gZW5jb2RlIGxvbmdzIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuVD19IHJlc29sdmVkVHlwZSBUaGUgcmVzb2x2ZWQgZmllbGQgdHlwZSBpZiBhIGZpZWxkXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn0gQ2xvbmVkIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsb25lUmF3KG9iaiwgYmluYXJ5QXNCYXNlNjQsIGxvbmdzQXNTdHJpbmdzLCByZXNvbHZlZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgZW51bSB2YWx1ZXMgdG8gdGhlaXIgcmVzcGVjdGl2ZSBuYW1lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWRUeXBlICYmIHJlc29sdmVkVHlwZSBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuRW51bSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBQcm90b0J1Zi5SZWZsZWN0LkVudW0uZ2V0TmFtZShyZXNvbHZlZFR5cGUub2JqZWN0LCBvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFzcy10aHJvdWdoIHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBudWxsLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgQnl0ZUJ1ZmZlcnMgdG8gcmF3IGJ1ZmZlciBvciBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJ5dGVCdWZmZXIuaXNCeXRlQnVmZmVyKG9iaikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiaW5hcnlBc0Jhc2U2NCA/IG9iai50b0Jhc2U2NCgpIDogb2JqLnRvQnVmZmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBMb25ncyB0byBwcm9wZXIgb2JqZWN0cyBvciBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFByb3RvQnVmLkxvbmcuaXNMb25nKG9iaikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb25nc0FzU3RyaW5ncyA/IG9iai50b1N0cmluZygpIDogUHJvdG9CdWYuTG9uZy5mcm9tVmFsdWUob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvbmUgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouZm9yRWFjaChmdW5jdGlvbih2LCBrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtrXSA9IGNsb25lUmF3KHYsIGJpbmFyeUFzQmFzZTY0LCBsb25nc0FzU3RyaW5ncywgcmVzb2x2ZWRUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IG1hcHMgdG8gb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBQcm90b0J1Zi5NYXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ID0gb2JqLmVudHJpZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZSA9IGl0Lm5leHQoKTsgIWUuZG9uZTsgZSA9IGl0Lm5leHQoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lW29iai5rZXlFbGVtLnZhbHVlVG9TdHJpbmcoZS52YWx1ZVswXSldID0gY2xvbmVSYXcoZS52YWx1ZVsxXSwgYmluYXJ5QXNCYXNlNjQsIGxvbmdzQXNTdHJpbmdzLCBvYmoudmFsdWVFbGVtLnJlc29sdmVkVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXZlcnl0aGluZyBlbHNlIGlzIGEgbm9uLW51bGwgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBvYmouJHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSAmJiAoZmllbGQgPSB0eXBlLmdldENoaWxkKGkpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtpXSA9IGNsb25lUmF3KG9ialtpXSwgYmluYXJ5QXNCYXNlNjQsIGxvbmdzQXNTdHJpbmdzLCBmaWVsZC5yZXNvbHZlZFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lW2ldID0gY2xvbmVSYXcob2JqW2ldLCBiaW5hcnlBc0Jhc2U2NCwgbG9uZ3NBc1N0cmluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmV0dXJucyB0aGUgbWVzc2FnZSdzIHJhdyBwYXlsb2FkLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gYmluYXJ5QXNCYXNlNjQgV2hldGhlciB0byBpbmNsdWRlIGJpbmFyeSBkYXRhIGFzIGJhc2U2NCBzdHJpbmdzIGluc3RlYWQgb2YgQnVmZmVycywgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBsb25nc0FzU3RyaW5ncyBXaGV0aGVyIHRvIGVuY29kZSBsb25ncyBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0LjxzdHJpbmcsKj59IFJhdyBwYXlsb2FkXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUudG9SYXcgPSBmdW5jdGlvbihiaW5hcnlBc0Jhc2U2NCwgbG9uZ3NBc1N0cmluZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmVSYXcodGhpcywgISFiaW5hcnlBc0Jhc2U2NCwgISFsb25nc0FzU3RyaW5ncywgdGhpcy4kdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRW5jb2RlcyBhIG1lc3NhZ2UgdG8gSlNPTi5cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEpTT04gc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZW5jb2RlSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVSYXcodGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBiaW5hcnktYXMtYmFzZTY0ICovIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogbG9uZ3MtYXMtc3RyaW5ncyAqLyB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGVjb2RlcyBhIG1lc3NhZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGJ1ZmZlciBvciBzdHJpbmcuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UuZGVjb2RlXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7IUJ5dGVCdWZmZXJ8IUFycmF5QnVmZmVyfCFCdWZmZXJ8c3RyaW5nfSBidWZmZXIgQnVmZmVyIHRvIGRlY29kZSBmcm9tXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKT19IGxlbmd0aCBNZXNzYWdlIGxlbmd0aC4gRGVmYXVsdHMgdG8gZGVjb2RlIGFsbCB0aGUgcmVtYWluaWcgZGF0YS5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gZW5jIEVuY29kaW5nIGlmIGJ1ZmZlciBpcyBhIHN0cmluZzogaGV4LCB1dGY4IChub3QgcmVjb21tZW5kZWQpLCBkZWZhdWx0cyB0byBiYXNlNjRcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4geyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IERlY29kZWQgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBkZWNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZGVjb2RlZCBtZXNzYWdlIHdpdGggbWlzc2luZyBmaWVsZHMgaW4gdGhlIGBkZWNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKiBAc2VlIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5kZWNvZGU2NFxyXG4gICAgICAgICAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UuZGVjb2RlSGV4XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2UuZGVjb2RlID0gZnVuY3Rpb24oYnVmZmVyLCBsZW5ndGgsIGVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGVuZ3RoID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5jID0gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IEJ5dGVCdWZmZXIud3JhcChidWZmZXIsIGVuYyA/IGVuYyA6IFwiYmFzZTY0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFCeXRlQnVmZmVyLmlzQnl0ZUJ1ZmZlcihidWZmZXIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBCeXRlQnVmZmVyLndyYXAoYnVmZmVyKTsgLy8gTWF5IHRocm93XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlID0gYnVmZmVyLmxpdHRsZUVuZGlhbjtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gVC5kZWNvZGUoYnVmZmVyLkxFKCksIGxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5MRShsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtc2c7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIuTEUobGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGVjb2RlcyBhIHZhcmludDMyIGxlbmd0aC1kZWxpbWl0ZWQgbWVzc2FnZSBmcm9tIHRoZSBzcGVjaWZpZWQgYnVmZmVyIG9yIHN0cmluZy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5kZWNvZGVEZWxpbWl0ZWRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHshQnl0ZUJ1ZmZlcnwhQXJyYXlCdWZmZXJ8IUJ1ZmZlcnxzdHJpbmd9IGJ1ZmZlciBCdWZmZXIgdG8gZGVjb2RlIGZyb21cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gZW5jIEVuY29kaW5nIGlmIGJ1ZmZlciBpcyBhIHN0cmluZzogaGV4LCB1dGY4IChub3QgcmVjb21tZW5kZWQpLCBkZWZhdWx0cyB0byBiYXNlNjRcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1Byb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gRGVjb2RlZCBtZXNzYWdlIG9yIGBudWxsYCBpZiBub3QgZW5vdWdoIGJ5dGVzIGFyZSBhdmFpbGFibGUgeWV0XHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGRlY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBkZWNvZGVkIG1lc3NhZ2Ugd2l0aCBtaXNzaW5nIGZpZWxkcyBpbiB0aGUgYGRlY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZS5kZWNvZGVEZWxpbWl0ZWQgPSBmdW5jdGlvbihidWZmZXIsIGVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYnVmZmVyID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gQnl0ZUJ1ZmZlci53cmFwKGJ1ZmZlciwgZW5jID8gZW5jIDogXCJiYXNlNjRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIUJ5dGVCdWZmZXIuaXNCeXRlQnVmZmVyKGJ1ZmZlcikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IEJ5dGVCdWZmZXIud3JhcChidWZmZXIpOyAvLyBNYXkgdGhyb3dcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLnJlbWFpbmluZygpIDwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZiA9IGJ1ZmZlci5vZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbiA9IGJ1ZmZlci5yZWFkVmFyaW50MzIoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLnJlbWFpbmluZygpIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5vZmZzZXQgPSBvZmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gVC5kZWNvZGUoYnVmZmVyLnNsaWNlKGJ1ZmZlci5vZmZzZXQsIGJ1ZmZlci5vZmZzZXQgKyBsZW4pLkxFKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIub2Zmc2V0ICs9IGxlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1zZztcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSBsZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGVjb2RlcyB0aGUgbWVzc2FnZSBmcm9tIHRoZSBzcGVjaWZpZWQgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLmRlY29kZTY0XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGRlY29kZSBmcm9tXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBEZWNvZGVkIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZGVjb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuIFRoZSBsYXRlciBzdGlsbFxyXG4gICAgICAgICAgICAgICAgICogIHJldHVybnMgdGhlIGRlY29kZWQgbWVzc2FnZSB3aXRoIG1pc3NpbmcgZmllbGRzIGluIHRoZSBgZGVjb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlLmRlY29kZTY0ID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1lc3NhZ2UuZGVjb2RlKHN0ciwgXCJiYXNlNjRcIik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGVjb2RlcyB0aGUgbWVzc2FnZSBmcm9tIHRoZSBzcGVjaWZpZWQgaGV4IGVuY29kZWQgc3RyaW5nLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLmRlY29kZUhleFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFN0cmluZyB0byBkZWNvZGUgZnJvbVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gRGVjb2RlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGRlY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBkZWNvZGVkIG1lc3NhZ2Ugd2l0aCBtaXNzaW5nIGZpZWxkcyBpbiB0aGUgYGRlY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZS5kZWNvZGVIZXggPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWVzc2FnZS5kZWNvZGUoc3RyLCBcImhleFwiKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBEZWNvZGVzIHRoZSBtZXNzYWdlIGZyb20gYSBKU09OIHN0cmluZy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5kZWNvZGVKU09OXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGRlY29kZSBmcm9tXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBEZWNvZGVkIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZGVjb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlXHJcbiAgICAgICAgICAgICAgICAgKiBtaXNzaW5nLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlLmRlY29kZUpTT04gPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1lc3NhZ2UoSlNPTi5wYXJzZShzdHIpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVXRpbGl0eVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIE1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjdG9TdHJpbmdcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50YXRpb24gYXMgb2YgXCIuRnVsbHkuUXVhbGlmaWVkLk1lc3NhZ2VOYW1lXCJcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBULnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFByb3BlcnRpZXNcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIE1lc3NhZ2Ugb3B0aW9ucy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS4kb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCo+fVxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgJG9wdGlvbnNTOyAvLyBjYyBuZWVkcyB0aGlzXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBNZXNzYWdlIG9wdGlvbnMuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjJG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyICRvcHRpb25zO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmVmbGVjdGlvbiB0eXBlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLiR0eXBlXHJcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7IVByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZX1cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyICR0eXBlUztcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJlZmxlY3Rpb24gdHlwZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSMkdHlwZVxyXG4gICAgICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciAkdHlwZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlLCAnJG9wdGlvbnMnLCB7IFwidmFsdWVcIjogVC5idWlsZE9wdCgpIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlUHJvdG90eXBlLCBcIiRvcHRpb25zXCIsIHsgXCJ2YWx1ZVwiOiBNZXNzYWdlW1wiJG9wdGlvbnNcIl0gfSksXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lc3NhZ2UsIFwiJHR5cGVcIiwgeyBcInZhbHVlXCI6IFQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lc3NhZ2VQcm90b3R5cGUsIFwiJHR5cGVcIiwgeyBcInZhbHVlXCI6IFQgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICB9KShQcm90b0J1ZiwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdGF0aWMgZW51bXMgYW5kIHByb3RvdHlwZWQgc3ViLW1lc3NhZ2VzIC8gY2FjaGVkIGNvbGxlY3Rpb25zXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpZWxkcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLl9maWVsZHNCeUlkID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpZWxkc0J5TmFtZSA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9dGhpcy5jaGlsZHJlbi5sZW5ndGgsIGNoaWxkOyBpPGs7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRW51bSB8fCBjaGlsZCBpbnN0YW5jZW9mIE1lc3NhZ2UgfHwgY2hpbGQgaW5zdGFuY2VvZiBTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXp6Lmhhc093blByb3BlcnR5KGNoaWxkLm5hbWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgcmVmbGVjdCBjaGlsZCBvZiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIitjaGlsZC50b1N0cmluZyh0cnVlKStcIiBjYW5ub3Qgb3ZlcnJpZGUgc3RhdGljIHByb3BlcnR5ICdcIitjaGlsZC5uYW1lK1wiJ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGF6eltjaGlsZC5uYW1lXSA9IGNoaWxkLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgTWVzc2FnZS5GaWVsZClcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5idWlsZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpZWxkcy5wdXNoKGNoaWxkKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWVsZHNCeUlkW2NoaWxkLmlkXSA9IGNoaWxkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpZWxkc0J5TmFtZVtjaGlsZC5uYW1lXSA9IGNoaWxkO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIShjaGlsZCBpbnN0YW5jZW9mIE1lc3NhZ2UuT25lT2YpICYmICEoY2hpbGQgaW5zdGFuY2VvZiBFeHRlbnNpb24pKSAvLyBOb3QgYnVpbHRcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgcmVmbGVjdCBjaGlsZCBvZiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit0aGlzLmNoaWxkcmVuW2ldLnRvU3RyaW5nKHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhenogPSBjbGF6ejtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbmNvZGVzIGEgcnVudGltZSBtZXNzYWdlJ3MgY29udGVudHMgdG8gdGhlIHNwZWNpZmllZCBidWZmZXIuXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBtZXNzYWdlIFJ1bnRpbWUgbWVzc2FnZSB0byBlbmNvZGVcclxuICAgICAgICAgKiBAcGFyYW0ge0J5dGVCdWZmZXJ9IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIHdyaXRlIHRvXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9WZXJpZnkgV2hldGhlciB0byBub3QgdmVyaWZ5IGZpZWxkIHZhbHVlcywgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAqIEByZXR1cm4ge0J5dGVCdWZmZXJ9IFRoZSBCeXRlQnVmZmVyIGZvciBjaGFpbmluZ1xyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3Npbmcgb3IgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGVuY29kZWQgZm9yIGFub3RoZXIgcmVhc29uXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24obWVzc2FnZSwgYnVmZmVyLCBub1ZlcmlmeSkge1xyXG4gICAgICAgICAgICB2YXIgZmllbGRNaXNzaW5nID0gbnVsbCxcclxuICAgICAgICAgICAgICAgIGZpZWxkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9dGhpcy5fZmllbGRzLmxlbmd0aCwgdmFsOyBpPGs7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZmllbGQgPSB0aGlzLl9maWVsZHNbaV07XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBtZXNzYWdlW2ZpZWxkLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkICYmIHZhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZE1pc3NpbmcgPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkTWlzc2luZyA9IGZpZWxkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuZW5jb2RlKG5vVmVyaWZ5ID8gdmFsIDogZmllbGQudmVyaWZ5VmFsdWUodmFsKSwgYnVmZmVyLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmllbGRNaXNzaW5nICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXCJNaXNzaW5nIGF0IGxlYXN0IG9uZSByZXF1aXJlZCBmaWVsZCBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrZmllbGRNaXNzaW5nKTtcclxuICAgICAgICAgICAgICAgIGVycltcImVuY29kZWRcIl0gPSBidWZmZXI7IC8vIFN0aWxsIGV4cG9zZSB3aGF0IHdlIGdvdFxyXG4gICAgICAgICAgICAgICAgdGhyb3coZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGN1bGF0ZXMgYSBydW50aW1lIG1lc3NhZ2UncyBieXRlIGxlbmd0aC5cclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IG1lc3NhZ2UgUnVudGltZSBtZXNzYWdlIHRvIGVuY29kZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZyBvciB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgY2FsY3VsYXRlZCBmb3IgYW5vdGhlciByZWFzb25cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG49MCwgaT0wLCBrPXRoaXMuX2ZpZWxkcy5sZW5ndGgsIGZpZWxkLCB2YWw7IGk8azsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZCA9IHRoaXMuX2ZpZWxkc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhbCA9IG1lc3NhZ2VbZmllbGQubmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQucmVxdWlyZWQgJiYgdmFsID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGF0IGxlYXN0IG9uZSByZXF1aXJlZCBmaWVsZCBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIG4gKz0gZmllbGQuY2FsY3VsYXRlKHZhbCwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2tpcHMgYWxsIGRhdGEgdW50aWwgdGhlIGVuZCBvZiB0aGUgc3BlY2lmaWVkIGdyb3VwIGhhcyBiZWVuIHJlYWNoZWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkSWQgRXhwZWN0ZWQgR1JPVVBFTkQgaWRcclxuICAgICAgICAgKiBAcGFyYW0geyFCeXRlQnVmZmVyfSBidWYgQnl0ZUJ1ZmZlclxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgYSB2YWx1ZSBhcyBiZWVuIHNraXBwZWQsIGBmYWxzZWAgaWYgdGhlIGVuZCBoYXMgYmVlbiByZWFjaGVkXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIGl0IHdhc24ndCBwb3NzaWJsZSB0byBmaW5kIHRoZSBlbmQgb2YgdGhlIGdyb3VwIChidWZmZXIgb3ZlcnJ1biBvciBlbmQgdGFnIG1pc21hdGNoKVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNraXBUaWxsR3JvdXBFbmQoZXhwZWN0ZWRJZCwgYnVmKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWcgPSBidWYucmVhZFZhcmludDMyKCksIC8vIFRocm93cyBvbiBPT0JcclxuICAgICAgICAgICAgICAgIHdpcmVUeXBlID0gdGFnICYgMHgwNyxcclxuICAgICAgICAgICAgICAgIGlkID0gdGFnID4+PiAzO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHdpcmVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5UOlxyXG4gICAgICAgICAgICAgICAgICAgIGRvIHRhZyA9IGJ1Zi5yZWFkVWludDgoKTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHRhZyAmIDB4ODApID09PSAweDgwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTNjQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmLm9mZnNldCArPSA4O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTTpcclxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBidWYucmVhZFZhcmludDMyKCk7IC8vIHJlYWRzIHRoZSB2YXJpbnRcclxuICAgICAgICAgICAgICAgICAgICBidWYub2Zmc2V0ICs9IHRhZzsgICAgICAgIC8vIHNraXBzIG4gYnl0ZXNcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5TVEFSVEdST1VQOlxyXG4gICAgICAgICAgICAgICAgICAgIHNraXBUaWxsR3JvdXBFbmQoaWQsIGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuRU5ER1JPVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkID09PSBleHBlY3RlZElkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgR1JPVVBFTkQgYWZ0ZXIgdW5rbm93biBncm91cDogXCIraWQrXCIgKFwiK2V4cGVjdGVkSWQrXCIgZXhwZWN0ZWQpXCIpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFMzMjpcclxuICAgICAgICAgICAgICAgICAgICBidWYub2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB3aXJlIHR5cGUgaW4gdW5rbm93biBncm91cCBcIitleHBlY3RlZElkK1wiOiBcIit3aXJlVHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZWNvZGVzIGFuIGVuY29kZWQgbWVzc2FnZSBhbmQgcmV0dXJucyB0aGUgZGVjb2RlZCBtZXNzYWdlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qnl0ZUJ1ZmZlcn0gYnVmZmVyIEJ5dGVCdWZmZXIgdG8gZGVjb2RlIGZyb21cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcj19IGxlbmd0aCBNZXNzYWdlIGxlbmd0aC4gRGVmYXVsdHMgdG8gZGVjb2RlIGFsbCByZW1haW5pbmcgZGF0YS5cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcj19IGV4cGVjdGVkR3JvdXBFbmRJZCBFeHBlY3RlZCBHUk9VUEVORCBpZCBpZiB0aGlzIGlzIGEgbGVnYWN5IGdyb3VwXHJcbiAgICAgICAgICogQHJldHVybiB7UHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBEZWNvZGVkIG1lc3NhZ2VcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGRlY29kZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbihidWZmZXIsIGxlbmd0aCwgZXhwZWN0ZWRHcm91cEVuZElkKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbGVuZ3RoICE9PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IC0xO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBidWZmZXIub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgbXNnID0gbmV3ICh0aGlzLmNsYXp6KSgpLFxyXG4gICAgICAgICAgICAgICAgdGFnLCB3aXJlVHlwZSwgaWQsIGZpZWxkO1xyXG4gICAgICAgICAgICB3aGlsZSAoYnVmZmVyLm9mZnNldCA8IHN0YXJ0K2xlbmd0aCB8fCAobGVuZ3RoID09PSAtMSAmJiBidWZmZXIucmVtYWluaW5nKCkgPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgdGFnID0gYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgd2lyZVR5cGUgPSB0YWcgJiAweDA3O1xyXG4gICAgICAgICAgICAgICAgaWQgPSB0YWcgPj4+IDM7XHJcbiAgICAgICAgICAgICAgICBpZiAod2lyZVR5cGUgPT09IFByb3RvQnVmLldJUkVfVFlQRVMuRU5ER1JPVVApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQgIT09IGV4cGVjdGVkR3JvdXBFbmRJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIGdyb3VwIGVuZCBpbmRpY2F0b3IgZm9yIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK2lkK1wiIChcIisoZXhwZWN0ZWRHcm91cEVuZElkID8gZXhwZWN0ZWRHcm91cEVuZElkK1wiIGV4cGVjdGVkXCIgOiBcIm5vdCBhIGdyb3VwXCIpK1wiKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghKGZpZWxkID0gdGhpcy5fZmllbGRzQnlJZFtpZF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJtZXNzYWdlcyBjcmVhdGVkIGJ5IHlvdXIgbmV3IGNvZGUgY2FuIGJlIHBhcnNlZCBieSB5b3VyIG9sZCBjb2RlOiBvbGQgYmluYXJpZXMgc2ltcGx5IGlnbm9yZSB0aGUgbmV3IGZpZWxkIHdoZW4gcGFyc2luZy5cIlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAod2lyZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5yZWFkVmFyaW50MzIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzMyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTNjQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIub2Zmc2V0ICs9IDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIub2Zmc2V0ICs9IGxlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuU1RBUlRHUk9VUDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChza2lwVGlsbEdyb3VwRW5kKGlkLCBidWZmZXIpKSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgd2lyZSB0eXBlIGZvciB1bmtub3duIGZpZWxkIFwiK2lkK1wiIGluIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCIjZGVjb2RlOiBcIit3aXJlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLnJlcGVhdGVkICYmICFmaWVsZC5vcHRpb25zW1wicGFja2VkXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnW2ZpZWxkLm5hbWVdLnB1c2goZmllbGQuZGVjb2RlKHdpcmVUeXBlLCBidWZmZXIpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQubWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleXZhbCA9IGZpZWxkLmRlY29kZSh3aXJlVHlwZSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBtc2dbZmllbGQubmFtZV0uc2V0KGtleXZhbFswXSwga2V5dmFsWzFdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnW2ZpZWxkLm5hbWVdID0gZmllbGQuZGVjb2RlKHdpcmVUeXBlLCBidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC5vbmVvZikgeyAvLyBGaWVsZCBpcyBwYXJ0IG9mIGFuIE9uZU9mIChub3QgYSB2aXJ0dWFsIE9uZU9mIGZpZWxkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudEZpZWxkID0gbXNnW2ZpZWxkLm9uZW9mLm5hbWVdOyAvLyBWaXJ0dWFsIGZpZWxkIHJlZmVyZW5jZXMgY3VycmVudGx5IHNldCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZpZWxkICE9PSBudWxsICYmIGN1cnJlbnRGaWVsZCAhPT0gZmllbGQubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZ1tjdXJyZW50RmllbGRdID0gbnVsbDsgLy8gQ2xlYXIgY3VycmVudGx5IHNldCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2dbZmllbGQub25lb2YubmFtZV0gPSBmaWVsZC5uYW1lOyAvLyBQb2ludCB2aXJ0dWFsIGZpZWxkIGF0IHRoaXMgZmllbGRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFsbCByZXF1aXJlZCBmaWVsZHMgYXJlIHByZXNlbnQgYW5kIHNldCBkZWZhdWx0IHZhbHVlcyBmb3Igb3B0aW9uYWwgZmllbGRzIHRoYXQgYXJlIG5vdFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9dGhpcy5fZmllbGRzLmxlbmd0aDsgaTxrOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkID0gdGhpcy5fZmllbGRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1zZ1tmaWVsZC5uYW1lXSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN5bnRheCA9PT0gXCJwcm90bzNcIikgeyAvLyBQcm90bzMgc2V0cyBkZWZhdWx0IHZhbHVlcyBieSBzcGVjaWZpY2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZ1tmaWVsZC5uYW1lXSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnIgPSBFcnJvcihcIk1pc3NpbmcgYXQgbGVhc3Qgb25lIHJlcXVpcmVkIGZpZWxkIGZvciBcIiArIHRoaXMudG9TdHJpbmcodHJ1ZSkgKyBcIjogXCIgKyBmaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyW1wiZGVjb2RlZFwiXSA9IG1zZzsgLy8gU3RpbGwgZXhwb3NlIHdoYXQgd2UgZ290XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChQcm90b0J1Zi5wb3B1bGF0ZURlZmF1bHRzICYmIGZpZWxkLmRlZmF1bHRWYWx1ZSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnW2ZpZWxkLm5hbWVdID0gZmllbGQuZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtc2c7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0Lk1lc3NhZ2UgPSBNZXNzYWdlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IE1lc3NhZ2UgRmllbGQuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZX0gbWVzc2FnZSBNZXNzYWdlIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBydWxlIFJ1bGUsIG9uZSBvZiByZXF1cmllZCwgb3B0aW9uYWwsIHJlcGVhdGVkXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmc/fSBrZXl0eXBlIEtleSBkYXRhIHR5cGUsIGlmIGFueS5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBEYXRhIHR5cGUsIGUuZy4gaW50MzJcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBGaWVsZCBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIFVuaXF1ZSBmaWVsZCBpZFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE9wdGlvbnNcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuT25lT2Y9fSBvbmVvZiBFbmNsb3NpbmcgT25lT2ZcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz99IHN5bnRheCBUaGUgc3ludGF4IGxldmVsIG9mIHRoaXMgZGVmaW5pdGlvbiAoZS5nLiwgcHJvdG8zKVxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqIEBleHRlbmRzIFByb3RvQnVmLlJlZmxlY3QuVFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBGaWVsZCA9IGZ1bmN0aW9uKGJ1aWxkZXIsIG1lc3NhZ2UsIHJ1bGUsIGtleXR5cGUsIHR5cGUsIG5hbWUsIGlkLCBvcHRpb25zLCBvbmVvZiwgc3ludGF4KSB7XHJcbiAgICAgICAgICAgIFQuY2FsbCh0aGlzLCBidWlsZGVyLCBtZXNzYWdlLCBuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJNZXNzYWdlLkZpZWxkXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWVzc2FnZSBmaWVsZCByZXF1aXJlZCBmbGFnLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlZCA9IHJ1bGUgPT09IFwicmVxdWlyZWRcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNZXNzYWdlIGZpZWxkIHJlcGVhdGVkIGZsYWcuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnJlcGVhdGVkID0gcnVsZSA9PT0gXCJyZXBlYXRlZFwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1lc3NhZ2UgZmllbGQgbWFwIGZsYWcuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLm1hcCA9IHJ1bGUgPT09IFwibWFwXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWVzc2FnZSBmaWVsZCBrZXkgdHlwZS4gVHlwZSByZWZlcmVuY2Ugc3RyaW5nIGlmIHVucmVzb2x2ZWQsIHByb3RvYnVmXHJcbiAgICAgICAgICAgICAqIHR5cGUgaWYgcmVzb2x2ZWQuIFZhbGlkIG9ubHkgaWYgdGhpcy5tYXAgPT09IHRydWUsIG51bGwgb3RoZXJ3aXNlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfHtuYW1lOiBzdHJpbmcsIHdpcmVUeXBlOiBudW1iZXJ9fG51bGx9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMua2V5VHlwZSA9IGtleXR5cGUgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNZXNzYWdlIGZpZWxkIHR5cGUuIFR5cGUgcmVmZXJlbmNlIHN0cmluZyBpZiB1bnJlc29sdmVkLCBwcm90b2J1ZiB0eXBlIGlmXHJcbiAgICAgICAgICAgICAqIHJlc29sdmVkLiBJbiBhIG1hcCBmaWVsZCwgdGhpcyBpcyB0aGUgdmFsdWUgdHlwZS5cclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ3x7bmFtZTogc3RyaW5nLCB3aXJlVHlwZTogbnVtYmVyfX1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXNvbHZlZCB0eXBlIHJlZmVyZW5jZSBpbnNpZGUgdGhlIGdsb2JhbCBuYW1lc3BhY2UuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5SZWZsZWN0LlR8bnVsbH1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFR5cGUgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFVuaXF1ZSBtZXNzYWdlIGZpZWxkIGlkLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWVzc2FnZSBmaWVsZCBvcHRpb25zLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IU9iamVjdC48c3RyaW5nLCo+fVxyXG4gICAgICAgICAgICAgKiBAZGljdFxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERlZmF1bHQgdmFsdWUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHsqfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRW5jbG9zaW5nIE9uZU9mLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P1Byb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5PbmVPZn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vbmVvZiA9IG9uZW9mIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3ludGF4IGxldmVsIG9mIHRoaXMgZGVmaW5pdGlvbiAoZS5nLiwgcHJvdG8zKS5cclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5zeW50YXggPSBzeW50YXggfHwgJ3Byb3RvMic7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3JpZ2luYWwgZmllbGQgbmFtZS5cclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbE5hbWUgPSB0aGlzLm5hbWU7IC8vIFVzZWQgdG8gcmV2ZXJ0IGNhbWVsY2FzZSB0cmFuc2Zvcm1hdGlvbiBvbiBuYW1pbmcgY29sbGlzaW9uc1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVsZW1lbnQgaW1wbGVtZW50YXRpb24uIENyZWF0ZWQgaW4gYnVpbGQoKSBhZnRlciB0eXBlcyBhcmUgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5FbGVtZW50fVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEtleSBlbGVtZW50IGltcGxlbWVudGF0aW9uLCBmb3IgbWFwIGZpZWxkcy4gQ3JlYXRlZCBpbiBidWlsZCgpIGFmdGVyXHJcbiAgICAgICAgICAgICAqIHR5cGVzIGFyZSByZXNvbHZlZC5cclxuICAgICAgICAgICAgICogQHR5cGUge1Byb3RvQnVmLkVsZW1lbnR9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMua2V5RWxlbWVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGZpZWxkIG5hbWVzIHRvIGNhbWVsIGNhc2Ugbm90YXRpb24gaWYgdGhlIG92ZXJyaWRlIGlzIHNldFxyXG4gICAgICAgICAgICBpZiAodGhpcy5idWlsZGVyLm9wdGlvbnNbJ2NvbnZlcnRGaWVsZHNUb0NhbWVsQ2FzZSddICYmICEodGhpcyBpbnN0YW5jZW9mIE1lc3NhZ2UuRXh0ZW5zaW9uRmllbGQpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gUHJvdG9CdWYuVXRpbC50b0NhbWVsQ2FzZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQucHJvdG90eXBlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIEZpZWxkUHJvdG90eXBlID0gRmllbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShULnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkcyB0aGUgZmllbGQuXHJcbiAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEZpZWxkUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG5ldyBFbGVtZW50KHRoaXMudHlwZSwgdGhpcy5yZXNvbHZlZFR5cGUsIGZhbHNlLCB0aGlzLnN5bnRheCwgdGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXlFbGVtZW50ID0gbmV3IEVsZW1lbnQodGhpcy5rZXlUeXBlLCB1bmRlZmluZWQsIHRydWUsIHRoaXMuc3ludGF4LCB0aGlzLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW4gcHJvdG8zLCBmaWVsZHMgZG8gbm90IGhhdmUgZmllbGQgcHJlc2VuY2UsIGFuZCBldmVyeSBmaWVsZCBpcyBzZXQgdG9cclxuICAgICAgICAgICAgLy8gaXRzIHR5cGUncyBkZWZhdWx0IHZhbHVlIChcIlwiLCAwLCAwLjAsIG9yIGZhbHNlKS5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3ludGF4ID09PSAncHJvdG8zJyAmJiAhdGhpcy5yZXBlYXRlZCAmJiAhdGhpcy5tYXApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IEVsZW1lbnQuZGVmYXVsdEZpZWxkVmFsdWUodGhpcy50eXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgZGVmYXVsdCB2YWx1ZXMgYXJlIHByZXNlbnQgd2hlbiBleHBsaWNpdGx5IHNwZWNpZmllZFxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zWydkZWZhdWx0J10gIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB0aGlzLnZlcmlmeVZhbHVlKHRoaXMub3B0aW9uc1snZGVmYXVsdCddKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIHZhbHVlIGNhbiBiZSBzZXQgZm9yIHRoaXMgZmllbGQuXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBWYWx1ZSB0byBjaGVja1xyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHNraXBSZXBlYXRlZCBXaGV0aGVyIHRvIHNraXAgdGhlIHJlcGVhdGVkIHZhbHVlIGNoZWNrIG9yIG5vdC4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAgICAgICAgICogQHJldHVybiB7Kn0gVmVyaWZpZWQsIG1heWJlIGFkanVzdGVkLCB2YWx1ZVxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgY2Fubm90IGJlIHNldCBmb3IgdGhpcyBmaWVsZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBGaWVsZFByb3RvdHlwZS52ZXJpZnlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlLCBza2lwUmVwZWF0ZWQpIHtcclxuICAgICAgICAgICAgc2tpcFJlcGVhdGVkID0gc2tpcFJlcGVhdGVkIHx8IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZhaWwodmFsLCBtc2cpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB2YWx1ZSBmb3IgXCIrc2VsZi50b1N0cmluZyh0cnVlKStcIiBvZiB0eXBlIFwiK3NlbGYudHlwZS5uYW1lK1wiOiBcIit2YWwrXCIgKFwiK21zZytcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7IC8vIE5VTEwgdmFsdWVzIGZvciBvcHRpb25hbCBmaWVsZHNcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcInJlcXVpcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3ludGF4ID09PSAncHJvdG8zJyAmJiB0aGlzLnR5cGUgIT09IFByb3RvQnVmLlRZUEVTW1wibWVzc2FnZVwiXSlcclxuICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJwcm90bzMgZmllbGQgd2l0aG91dCBmaWVsZCBwcmVzZW5jZSBjYW5ub3QgYmUgbnVsbFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRlZCAmJiAhc2tpcFJlcGVhdGVkKSB7IC8vIFJlcGVhdGVkIHZhbHVlcyBhcyBhcnJheXNcclxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8dmFsdWUubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2godGhpcy5lbGVtZW50LnZlcmlmeVZhbHVlKHZhbHVlW2ldKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcCAmJiAhc2tpcFJlcGVhdGVkKSB7IC8vIE1hcCB2YWx1ZXMgYXMgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBQcm90b0J1Zi5NYXApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgbm90IGFscmVhZHkgYSBNYXAsIGF0dGVtcHQgdG8gY29udmVydC5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJleHBlY3RlZCBQcm90b0J1Zi5NYXAgb3IgcmF3IG9iamVjdCBmb3IgbWFwIGZpZWxkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb3RvQnVmLk1hcCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBBbGwgbm9uLXJlcGVhdGVkIGZpZWxkcyBleHBlY3Qgbm8gYXJyYXlcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlcGVhdGVkICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwibm8gYXJyYXkgZXhwZWN0ZWRcIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnZlcmlmeVZhbHVlKHZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGZpZWxkIHdpbGwgaGF2ZSBhIHByZXNlbmNlIG9uIHRoZSB3aXJlIGdpdmVuIGl0c1xyXG4gICAgICAgICAqIHZhbHVlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVmVyaWZpZWQgZmllbGQgdmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IG1lc3NhZ2UgUnVudGltZSBtZXNzYWdlXHJcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZmllbGQgd2lsbCBiZSBwcmVzZW50IG9uIHRoZSB3aXJlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRmllbGRQcm90b3R5cGUuaGFzV2lyZVByZXNlbmNlID0gZnVuY3Rpb24odmFsdWUsIG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3ludGF4ICE9PSAncHJvdG8zJylcclxuICAgICAgICAgICAgICAgIHJldHVybiAodmFsdWUgIT09IG51bGwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbmVvZiAmJiBtZXNzYWdlW3RoaXMub25lb2YubmFtZV0gPT09IHRoaXMubmFtZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJ1aW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJ1aW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubG93ICE9PSAwIHx8IHZhbHVlLmhpZ2ggIT09IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJvb2xcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmbG9hdFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJkb3VibGVcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSAwLjA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInN0cmluZ1wiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnJlbWFpbmluZygpID4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZW51bVwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVuY29kZXMgdGhlIHNwZWNpZmllZCBmaWVsZCB2YWx1ZSB0byB0aGUgc3BlY2lmaWVkIGJ1ZmZlci5cclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFZlcmlmaWVkIGZpZWxkIHZhbHVlXHJcbiAgICAgICAgICogQHBhcmFtIHtCeXRlQnVmZmVyfSBidWZmZXIgQnl0ZUJ1ZmZlciB0byBlbmNvZGUgdG9cclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IG1lc3NhZ2UgUnVudGltZSBtZXNzYWdlXHJcbiAgICAgICAgICogQHJldHVybiB7Qnl0ZUJ1ZmZlcn0gVGhlIEJ5dGVCdWZmZXIgZm9yIGNoYWluaW5nXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBmaWVsZCBjYW5ub3QgYmUgZW5jb2RlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBGaWVsZFByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbih2YWx1ZSwgYnVmZmVyLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IG51bGwgfHwgdHlwZW9mIHRoaXMudHlwZSAhPT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIltJTlRFUk5BTF0gVW5yZXNvbHZlZCB0eXBlIGluIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3RoaXMudHlwZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCAodGhpcy5yZXBlYXRlZCAmJiB2YWx1ZS5sZW5ndGggPT0gMCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyOyAvLyBPcHRpb25hbCBvbWl0dGVkXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFwiT25seSByZXBlYXRlZCBmaWVsZHMgb2YgcHJpbWl0aXZlIG51bWVyaWMgdHlwZXMgKHR5cGVzIHdoaWNoIHVzZSB0aGUgdmFyaW50LCAzMi1iaXQsIG9yIDY0LWJpdCB3aXJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdHlwZXMpIGNhbiBiZSBkZWNsYXJlZCAncGFja2VkJy5cIlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnNbXCJwYWNrZWRcIl0gJiYgUHJvdG9CdWYuUEFDS0FCTEVfV0lSRV9UWVBFUy5pbmRleE9mKHRoaXMudHlwZS53aXJlVHlwZSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcIkFsbCBvZiB0aGUgZWxlbWVudHMgb2YgdGhlIGZpZWxkIGFyZSBwYWNrZWQgaW50byBhIHNpbmdsZSBrZXktdmFsdWUgcGFpciB3aXRoIHdpcmUgdHlwZSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChsZW5ndGgtZGVsaW1pdGVkKS4gRWFjaCBlbGVtZW50IGlzIGVuY29kZWQgdGhlIHNhbWUgd2F5IGl0IHdvdWxkIGJlIG5vcm1hbGx5LCBleGNlcHQgd2l0aG91dCBhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhZyBwcmVjZWRpbmcgaXQuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIoKHRoaXMuaWQgPDwgMykgfCBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5lbnN1cmVDYXBhY2l0eShidWZmZXIub2Zmc2V0ICs9IDEpOyAvLyBXZSBkbyBub3Qga25vdyB0aGUgbGVuZ3RoIHlldCwgc28gbGV0J3MgYXNzdW1lIGEgdmFyaW50IG9mIGxlbmd0aCAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IGJ1ZmZlci5vZmZzZXQ7IC8vIFJlbWVtYmVyIHdoZXJlIHRoZSBjb250ZW50cyBiZWdpblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MDsgaTx2YWx1ZS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5lbmNvZGVWYWx1ZSh0aGlzLmlkLCB2YWx1ZVtpXSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IGJ1ZmZlci5vZmZzZXQtc3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpbnRMZW4gPSBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKGxlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YXJpbnRMZW4gPiAxKSB7IC8vIFdlIG5lZWQgdG8gbW92ZSB0aGUgY29udGVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50cyA9IGJ1ZmZlci5zbGljZShzdGFydCwgYnVmZmVyLm9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCArPSB2YXJpbnRMZW4tMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5vZmZzZXQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5hcHBlbmQoY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKGxlbiwgc3RhcnQtdmFyaW50TGVuKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcIklmIHlvdXIgbWVzc2FnZSBkZWZpbml0aW9uIGhhcyByZXBlYXRlZCBlbGVtZW50cyAod2l0aG91dCB0aGUgW3BhY2tlZD10cnVlXSBvcHRpb24pLCB0aGUgZW5jb2RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtZXNzYWdlIGhhcyB6ZXJvIG9yIG1vcmUga2V5LXZhbHVlIHBhaXJzIHdpdGggdGhlIHNhbWUgdGFnIG51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPHZhbHVlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIoKHRoaXMuaWQgPDwgMykgfCB0aGlzLnR5cGUud2lyZVR5cGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmVuY29kZVZhbHVlKHRoaXMuaWQsIHZhbHVlW2ldLCBidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXcml0ZSBvdXQgZWFjaCBtYXAgZW50cnkgYXMgYSBzdWJtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXksIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHRoZSBzdWJtZXNzYWdlIChrZXksIHZhbCkgcGFpci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCgxIDw8IDMpIHwgdGhpcy5rZXlUeXBlLndpcmVUeXBlKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleUVsZW1lbnQuY2FsY3VsYXRlTGVuZ3RoKDEsIGtleSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMigoMiA8PCAzKSB8IHRoaXMudHlwZS53aXJlVHlwZSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNhbGN1bGF0ZUxlbmd0aCgyLCB2YWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VibWVzc2FnZSB3aXRoIHdpcmUgdHlwZSBvZiBsZW5ndGgtZGVsaW1pdGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMigodGhpcy5pZCA8PCAzKSB8IFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIobGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdyaXRlIG91dCB0aGUga2V5IGFuZCB2YWwuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKCgxIDw8IDMpIHwgdGhpcy5rZXlUeXBlLndpcmVUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlFbGVtZW50LmVuY29kZVZhbHVlKDEsIGtleSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIoKDIgPDwgMykgfCB0aGlzLnR5cGUud2lyZVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZW5jb2RlVmFsdWUoMiwgdmFsLCBidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNXaXJlUHJlc2VuY2UodmFsdWUsIG1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgdGhpcy50eXBlLndpcmVUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmVuY29kZVZhbHVlKHRoaXMuaWQsIHZhbHVlLCBidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHZhbHVlIGZvciBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit2YWx1ZStcIiAoXCIrZStcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhpcyBmaWVsZCdzIHZhbHVlIG9uIHRoZSBuZXR3b3JrIGxldmVsLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgRmllbGQgdmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IG1lc3NhZ2UgUnVudGltZSBtZXNzYWdlXHJcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRmllbGRQcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24odmFsdWUsIG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnZlcmlmeVZhbHVlKHZhbHVlKTsgLy8gTWF5IHRocm93XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IG51bGwgfHwgdHlwZW9mIHRoaXMudHlwZSAhPT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIltJTlRFUk5BTF0gVW5yZXNvbHZlZCB0eXBlIGluIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3RoaXMudHlwZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCAodGhpcy5yZXBlYXRlZCAmJiB2YWx1ZS5sZW5ndGggPT0gMCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDsgLy8gT3B0aW9uYWwgb21pdHRlZFxyXG4gICAgICAgICAgICB2YXIgbiA9IDA7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpLCBuaTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zW1wicGFja2VkXCJdICYmIFByb3RvQnVmLlBBQ0tBQkxFX1dJUkVfVFlQRVMuaW5kZXhPZih0aGlzLnR5cGUud2lyZVR5cGUpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbiArPSBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPHZhbHVlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmkgKz0gdGhpcy5lbGVtZW50LmNhbGN1bGF0ZUxlbmd0aCh0aGlzLmlkLCB2YWx1ZVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gKz0gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMihuaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gKz0gbmk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8dmFsdWUubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuICs9IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoKHRoaXMuaWQgPDwgMykgfCB0aGlzLnR5cGUud2lyZVR5cGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmVsZW1lbnQuY2FsY3VsYXRlTGVuZ3RoKHRoaXMuaWQsIHZhbHVlW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRWFjaCBtYXAgZW50cnkgYmVjb21lcyBhIHN1Ym1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbih2YWwsIGtleSwgbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21wdXRlIHRoZSBsZW5ndGggb2YgdGhlIHN1Ym1lc3NhZ2UgKGtleSwgdmFsKSBwYWlyLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoKDEgPDwgMykgfCB0aGlzLmtleVR5cGUud2lyZVR5cGUpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5RWxlbWVudC5jYWxjdWxhdGVMZW5ndGgoMSwga2V5KSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCgyIDw8IDMpIHwgdGhpcy50eXBlLndpcmVUeXBlKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2FsY3VsYXRlTGVuZ3RoKDIsIHZhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoKHRoaXMuaWQgPDwgMykgfCBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gKz0gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMihsZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzV2lyZVByZXNlbmNlKHZhbHVlLCBtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoKHRoaXMuaWQgPDwgMykgfCB0aGlzLnR5cGUud2lyZVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IHRoaXMuZWxlbWVudC5jYWxjdWxhdGVMZW5ndGgodGhpcy5pZCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHZhbHVlIGZvciBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit2YWx1ZStcIiAoXCIrZStcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVjb2RlIHRoZSBmaWVsZCB2YWx1ZSBmcm9tIHRoZSBzcGVjaWZpZWQgYnVmZmVyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aXJlVHlwZSBMZWFkaW5nIHdpcmUgdHlwZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Qnl0ZUJ1ZmZlcn0gYnVmZmVyIEJ5dGVCdWZmZXIgdG8gZGVjb2RlIGZyb21cclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBza2lwUmVwZWF0ZWQgV2hldGhlciB0byBza2lwIHRoZSByZXBlYXRlZCBjaGVjayBvciBub3QuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAgICAgICAqIEByZXR1cm4geyp9IERlY29kZWQgdmFsdWU6IGFycmF5IGZvciBwYWNrZWQgcmVwZWF0ZWQgZmllbGRzLCBba2V5LCB2YWx1ZV0gZm9yXHJcbiAgICAgICAgICogICAgICAgICAgICAgbWFwIGZpZWxkcywgb3IgYW4gaW5kaXZpZHVhbCB2YWx1ZSBvdGhlcndpc2UuXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBmaWVsZCBjYW5ub3QgYmUgZGVjb2RlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBGaWVsZFByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbih3aXJlVHlwZSwgYnVmZmVyLCBza2lwUmVwZWF0ZWQpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlLCBuQnl0ZXM7XHJcblxyXG4gICAgICAgICAgICAvLyBXZSBleHBlY3Qgd2lyZVR5cGUgdG8gbWF0Y2ggdGhlIHVuZGVybHlpbmcgdHlwZSdzIHdpcmVUeXBlIHVubGVzcyB3ZSBzZWVcclxuICAgICAgICAgICAgLy8gYSBwYWNrZWQgcmVwZWF0ZWQgZmllbGQsIG9yIHVubGVzcyB0aGlzIGlzIGEgbWFwIGZpZWxkLlxyXG4gICAgICAgICAgICB2YXIgd2lyZVR5cGVPSyA9XHJcbiAgICAgICAgICAgICAgICAoIXRoaXMubWFwICYmIHdpcmVUeXBlID09IHRoaXMudHlwZS53aXJlVHlwZSkgfHxcclxuICAgICAgICAgICAgICAgICghc2tpcFJlcGVhdGVkICYmIHRoaXMucmVwZWF0ZWQgJiYgdGhpcy5vcHRpb25zW1wicGFja2VkXCJdICYmXHJcbiAgICAgICAgICAgICAgICAgd2lyZVR5cGUgPT0gUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0pIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAgJiYgd2lyZVR5cGUgPT0gUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0pO1xyXG4gICAgICAgICAgICBpZiAoIXdpcmVUeXBlT0spXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgd2lyZSB0eXBlIGZvciBmaWVsZCBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit3aXJlVHlwZStcIiAoXCIrdGhpcy50eXBlLndpcmVUeXBlK1wiIGV4cGVjdGVkKVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZSBwYWNrZWQgcmVwZWF0ZWQgZmllbGRzLlxyXG4gICAgICAgICAgICBpZiAod2lyZVR5cGUgPT0gUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0gJiYgdGhpcy5yZXBlYXRlZCAmJiB0aGlzLm9wdGlvbnNbXCJwYWNrZWRcIl0gJiYgUHJvdG9CdWYuUEFDS0FCTEVfV0lSRV9UWVBFUy5pbmRleE9mKHRoaXMudHlwZS53aXJlVHlwZSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFza2lwUmVwZWF0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBuQnl0ZXMgPSBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbkJ5dGVzID0gYnVmZmVyLm9mZnNldCArIG5CeXRlczsgLy8gTGltaXRcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGJ1ZmZlci5vZmZzZXQgPCBuQnl0ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZGVjb2RlKHRoaXMudHlwZS53aXJlVHlwZSwgYnVmZmVyLCB0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFJlYWQgdGhlIG5leHQgdmFsdWUgb3RoZXJ3aXNlLi4uXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZSBtYXBzLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlYWQgb25lIChrZXksIHZhbHVlKSBzdWJtZXNzYWdlLCBhbmQgcmV0dXJuIFtrZXksIHZhbHVlXVxyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IEVsZW1lbnQuZGVmYXVsdEZpZWxkVmFsdWUodGhpcy5rZXlUeXBlKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gRWxlbWVudC5kZWZhdWx0RmllbGRWYWx1ZSh0aGlzLnR5cGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlYWQgdGhlIGxlbmd0aFxyXG4gICAgICAgICAgICAgICAgbkJ5dGVzID0gYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5yZW1haW5pbmcoKSA8IG5CeXRlcylcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgbnVtYmVyIG9mIGJ5dGVzIGZvciBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIituQnl0ZXMrXCIgcmVxdWlyZWQgYnV0IGdvdCBvbmx5IFwiK2J1ZmZlci5yZW1haW5pbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGEgc3ViLWJ1ZmZlciBvZiB0aGlzIGtleS92YWx1ZSBzdWJtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICB2YXIgbXNnYnVmID0gYnVmZmVyLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICBtc2didWYubGltaXQgPSBtc2didWYub2Zmc2V0ICsgbkJ5dGVzO1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSBuQnl0ZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG1zZ2J1Zi5yZW1haW5pbmcoKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFnID0gbXNnYnVmLnJlYWRWYXJpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpcmVUeXBlID0gdGFnICYgMHgwNztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB0YWcgPj4+IDM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMua2V5RWxlbWVudC5kZWNvZGUobXNnYnVmLCB3aXJlVHlwZSwgaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaWQgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmVsZW1lbnQuZGVjb2RlKG1zZ2J1Ziwgd2lyZVR5cGUsIGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVuZXhwZWN0ZWQgdGFnIGluIG1hcCBmaWVsZCBrZXkvdmFsdWUgc3VibWVzc2FnZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtrZXksIHZhbHVlXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSGFuZGxlIHNpbmd1bGFyIGFuZCBub24tcGFja2VkIHJlcGVhdGVkIGZpZWxkIHZhbHVlcy5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kZWNvZGUoYnVmZmVyLCB3aXJlVHlwZSwgdGhpcy5pZCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0Lk1lc3NhZ2UuRmllbGQgPSBGaWVsZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBNZXNzYWdlIEV4dGVuc2lvbkZpZWxkLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5FeHRlbnNpb25GaWVsZFxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9IG1lc3NhZ2UgTWVzc2FnZSByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcnVsZSBSdWxlLCBvbmUgb2YgcmVxdXJpZWQsIG9wdGlvbmFsLCByZXBlYXRlZFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIERhdGEgdHlwZSwgZS5nLiBpbnQzMlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEZpZWxkIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgVW5pcXVlIGZpZWxkIGlkXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE9wdGlvbnNcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGRcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgRXh0ZW5zaW9uRmllbGQgPSBmdW5jdGlvbihidWlsZGVyLCBtZXNzYWdlLCBydWxlLCB0eXBlLCBuYW1lLCBpZCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBGaWVsZC5jYWxsKHRoaXMsIGJ1aWxkZXIsIG1lc3NhZ2UsIHJ1bGUsIC8qIGtleXR5cGUgPSAqLyBudWxsLCB0eXBlLCBuYW1lLCBpZCwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRXh0ZW5zaW9uIHJlZmVyZW5jZS5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0LkV4dGVuc2lvbn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5leHRlbnNpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gRXh0ZW5kcyBGaWVsZFxyXG4gICAgICAgIEV4dGVuc2lvbkZpZWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRmllbGQucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5FeHRlbnNpb25GaWVsZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0Lk1lc3NhZ2UuRXh0ZW5zaW9uRmllbGQgPSBFeHRlbnNpb25GaWVsZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBNZXNzYWdlIE9uZU9mLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5PbmVPZlxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9IG1lc3NhZ2UgTWVzc2FnZSByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBPbmVPZiBuYW1lXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5UXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIE9uZU9mID0gZnVuY3Rpb24oYnVpbGRlciwgbWVzc2FnZSwgbmFtZSkge1xyXG4gICAgICAgICAgICBULmNhbGwodGhpcywgYnVpbGRlciwgbWVzc2FnZSwgbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRW5jbG9zZWQgZmllbGRzLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IUFycmF5LjwhUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkPn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5maWVsZHMgPSBbXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLk9uZU9mXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuTWVzc2FnZS5PbmVPZiA9IE9uZU9mO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IEVudW0uXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5FbnVtXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuVH0gcGFyZW50IFBhcmVudCBSZWZsZWN0IG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEVudW0gbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIEVudW0gb3B0aW9uc1xyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nP30gc3ludGF4IFRoZSBzeW50YXggbGV2ZWwgKGUuZy4sIHByb3RvMylcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBFbnVtID0gZnVuY3Rpb24oYnVpbGRlciwgcGFyZW50LCBuYW1lLCBvcHRpb25zLCBzeW50YXgpIHtcclxuICAgICAgICAgICAgTmFtZXNwYWNlLmNhbGwodGhpcywgYnVpbGRlciwgcGFyZW50LCBuYW1lLCBvcHRpb25zLCBzeW50YXgpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIkVudW1cIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSdW50aW1lIGVudW0gb2JqZWN0LlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsbnVtYmVyPnxudWxsfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgc3RyaW5nIG5hbWUgb2YgYW4gZW51bSB2YWx1ZS5cclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyLkVudW19IGVubSBSdW50aW1lIGVudW1cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgRW51bSB2YWx1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHs/c3RyaW5nfSBOYW1lIG9yIGBudWxsYCBpZiBub3QgcHJlc2VudFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBFbnVtLmdldE5hbWUgPSBmdW5jdGlvbihlbm0sIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZW5tKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrZXk7IGk8a2V5cy5sZW5ndGg7ICsraSlcclxuICAgICAgICAgICAgICAgIGlmIChlbm1ba2V5ID0ga2V5c1tpXV0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LkVudW0ucHJvdG90eXBlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIEVudW1Qcm90b3R5cGUgPSBFbnVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTmFtZXNwYWNlLnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkcyB0aGlzIGVudW0gYW5kIHJldHVybnMgdGhlIHJ1bnRpbWUgY291bnRlcnBhcnQuXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSByZWJ1aWxkIFdoZXRoZXIgdG8gcmVidWlsZCBvciBub3QsIGRlZmF1bHRzIHRvIGZhbHNlXHJcbiAgICAgICAgICogQHJldHVybnMgeyFPYmplY3QuPHN0cmluZyxudW1iZXI+fVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBFbnVtUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24ocmVidWlsZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmplY3QgJiYgIXJlYnVpbGQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3Q7XHJcbiAgICAgICAgICAgIHZhciBlbm0gPSBuZXcgUHJvdG9CdWYuQnVpbGRlci5FbnVtKCksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB0aGlzLmdldENoaWxkcmVuKEVudW0uVmFsdWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9dmFsdWVzLmxlbmd0aDsgaTxrOyArK2kpXHJcbiAgICAgICAgICAgICAgICBlbm1bdmFsdWVzW2ldWyduYW1lJ11dID0gdmFsdWVzW2ldWydpZCddO1xyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVubSwgJyRvcHRpb25zJywge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogdGhpcy5idWlsZE9wdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW51bWVyYWJsZVwiOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdCA9IGVubTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5FbnVtXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuRW51bSA9IEVudW07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgRW51bSBWYWx1ZS5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LkVudW0uVmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5FbnVtfSBlbm0gRW51bSByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBGaWVsZCBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIFVuaXF1ZSBmaWVsZCBpZFxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqIEBleHRlbmRzIFByb3RvQnVmLlJlZmxlY3QuVFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBWYWx1ZSA9IGZ1bmN0aW9uKGJ1aWxkZXIsIGVubSwgbmFtZSwgaWQpIHtcclxuICAgICAgICAgICAgVC5jYWxsKHRoaXMsIGJ1aWxkZXIsIGVubSwgbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiRW51bS5WYWx1ZVwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFVuaXF1ZSBlbnVtIHZhbHVlIGlkLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gRXh0ZW5kcyBUXHJcbiAgICAgICAgVmFsdWUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShULnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LkVudW0uVmFsdWVcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5FbnVtLlZhbHVlID0gVmFsdWU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFuIGV4dGVuc2lvbiAoZmllbGQpLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuRXh0ZW5zaW9uXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuVH0gcGFyZW50IFBhcmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBPYmplY3QgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZH0gZmllbGQgRXh0ZW5zaW9uIGZpZWxkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIEV4dGVuc2lvbiA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHBhcmVudCwgbmFtZSwgZmllbGQpIHtcclxuICAgICAgICAgICAgVC5jYWxsKHRoaXMsIGJ1aWxkZXIsIHBhcmVudCwgbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRXh0ZW5kZWQgbWVzc2FnZSBmaWVsZC5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGR9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBFeHRlbmRzIFRcclxuICAgICAgICBFeHRlbnNpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShULnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LkV4dGVuc2lvblxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0LkV4dGVuc2lvbiA9IEV4dGVuc2lvbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBTZXJ2aWNlLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZX0gcm9vdCBSb290XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgU2VydmljZSBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywqPj19IG9wdGlvbnMgT3B0aW9uc1xyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqIEBleHRlbmRzIFByb3RvQnVmLlJlZmxlY3QuTmFtZXNwYWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFNlcnZpY2UgPSBmdW5jdGlvbihidWlsZGVyLCByb290LCBuYW1lLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIE5hbWVzcGFjZS5jYWxsKHRoaXMsIGJ1aWxkZXIsIHJvb3QsIG5hbWUsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIlNlcnZpY2VcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBCdWlsdCBydW50aW1lIHNlcnZpY2UgY2xhc3MuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHs/ZnVuY3Rpb24obmV3OlByb3RvQnVmLkJ1aWxkZXIuU2VydmljZSl9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNsYXp6ID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBTZXJ2aWNlUHJvdG90eXBlID0gU2VydmljZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE5hbWVzcGFjZS5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhlIHNlcnZpY2UgYW5kIHJldHVybnMgdGhlIHJ1bnRpbWUgY291bnRlcnBhcnQsIHdoaWNoIGlzIGEgZnVsbHkgZnVuY3Rpb25hbCBjbGFzcy5cclxuICAgICAgICAgKiBAc2VlIFByb3RvQnVmLkJ1aWxkZXIuU2VydmljZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlYnVpbGQgV2hldGhlciB0byByZWJ1aWxkIG9yIG5vdFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBTZXJ2aWNlIGNsYXNzXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBidWlsdFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBTZXJ2aWNlUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24ocmVidWlsZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGF6eiAmJiAhcmVidWlsZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXp6O1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBydW50aW1lIFNlcnZpY2UgY2xhc3MgaW4gaXRzIG93biBzY29wZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGF6eiA9IChmdW5jdGlvbihQcm90b0J1ZiwgVCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBydW50aW1lIFNlcnZpY2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nLCBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UsIGZ1bmN0aW9uKEVycm9yLCBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2U9KSk9fSBycGNJbXBsIFJQQyBpbXBsZW1lbnRhdGlvbiByZWNlaXZpbmcgdGhlIG1ldGhvZCBuYW1lIGFuZCB0aGUgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICogQGNsYXNzIEJhcmVib25lIG9mIGFsbCBydW50aW1lIHNlcnZpY2VzLlxyXG4gICAgICAgICAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHNlcnZpY2UgY2Fubm90IGJlIGNyZWF0ZWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIFNlcnZpY2UgPSBmdW5jdGlvbihycGNJbXBsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlLmNhbGwodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFNlcnZpY2UgaW1wbGVtZW50YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlI3JwY0ltcGxcclxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7IWZ1bmN0aW9uKHN0cmluZywgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLCBmdW5jdGlvbihFcnJvciwgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlPSkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJwY0ltcGwgPSBycGNJbXBsIHx8IGZ1bmN0aW9uKG5hbWUsIG1zZywgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyB3aGF0IGEgdXNlciBoYXMgdG8gaW1wbGVtZW50OiBBIGZ1bmN0aW9uIHJlY2VpdmluZyB0aGUgbWV0aG9kIG5hbWUsIHRoZSBhY3R1YWwgbWVzc2FnZSB0b1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZW5kICh0eXBlIGNoZWNrZWQpIGFuZCB0aGUgY2FsbGJhY2sgdGhhdCdzIGVpdGhlciBwcm92aWRlZCB3aXRoIHRoZSBlcnJvciBhcyBpdHMgZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJndW1lbnQgb3IgbnVsbCBhbmQgdGhlIGFjdHVhbCByZXNwb25zZSBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLmJpbmQodGhpcywgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQsIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Rjb2RlSU8vUHJvdG9CdWYuanMvd2lraS9TZXJ2aWNlc1wiKSksIDApOyAvLyBNdXN0IGJlIGFzeW5jIVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkJ1aWxkZXIuU2VydmljZS5wcm90b3R5cGVcclxuICAgICAgICAgICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgU2VydmljZVByb3RvdHlwZSA9IFNlcnZpY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEFzeW5jaHJvbm91c2x5IHBlcmZvcm1zIGFuIFJQQyBjYWxsIHVzaW5nIHRoZSBnaXZlbiBSUEMgaW1wbGVtZW50YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UuW01ldGhvZF1cclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHshZnVuY3Rpb24oc3RyaW5nLCBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UsIGZ1bmN0aW9uKEVycm9yLCBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2U9KSl9IHJwY0ltcGwgUlBDIGltcGxlbWVudGF0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1Byb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gcmVxIFJlcXVlc3RcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oRXJyb3IsIChQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V8Qnl0ZUJ1ZmZlcnxCdWZmZXJ8c3RyaW5nKT0pfSBjYWxsYmFjayBDYWxsYmFjayByZWNlaXZpbmdcclxuICAgICAgICAgICAgICAgICAqICB0aGUgZXJyb3IgaWYgYW55IGFuZCB0aGUgcmVzcG9uc2UgZWl0aGVyIGFzIGEgcHJlLXBhcnNlZCBtZXNzYWdlIG9yIGFzIGl0cyByYXcgYnl0ZXNcclxuICAgICAgICAgICAgICAgICAqIEBhYnN0cmFjdFxyXG4gICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBBc3luY2hyb25vdXNseSBwZXJmb3JtcyBhbiBSUEMgY2FsbCB1c2luZyB0aGUgaW5zdGFuY2UncyBSUEMgaW1wbGVtZW50YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UjW01ldGhvZF1cclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IHJlcSBSZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKEVycm9yLCAoUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfEJ5dGVCdWZmZXJ8QnVmZmVyfHN0cmluZyk9KX0gY2FsbGJhY2sgQ2FsbGJhY2sgcmVjZWl2aW5nXHJcbiAgICAgICAgICAgICAgICAgKiAgdGhlIGVycm9yIGlmIGFueSBhbmQgdGhlIHJlc3BvbnNlIGVpdGhlciBhcyBhIHByZS1wYXJzZWQgbWVzc2FnZSBvciBhcyBpdHMgcmF3IGJ5dGVzXHJcbiAgICAgICAgICAgICAgICAgKiBAYWJzdHJhY3RcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBycGMgPSBULmdldENoaWxkcmVuKFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5SUENNZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHJwYy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbihtZXRob2QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlcnZpY2UjTWV0aG9kKG1lc3NhZ2UsIGNhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlUHJvdG90eXBlW21ldGhvZC5uYW1lXSA9IGZ1bmN0aW9uKHJlcSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgZ2l2ZW4gYXMgYSBidWZmZXIsIGRlY29kZSB0aGUgcmVxdWVzdC4gV2lsbCB0aHJvdyBhIFR5cGVFcnJvciBpZiBub3QgYSB2YWxpZCBidWZmZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcSA9IG1ldGhvZC5yZXNvbHZlZFJlcXVlc3RUeXBlLmNsYXp6LmRlY29kZShCeXRlQnVmZmVyLndyYXAocmVxKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXEgPT09IG51bGwgfHwgdHlwZW9mIHJlcSAhPT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCBhcmd1bWVudHNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocmVxIGluc3RhbmNlb2YgbWV0aG9kLnJlc29sdmVkUmVxdWVzdFR5cGUuY2xhenopKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEgPSBuZXcgbWV0aG9kLnJlc29sdmVkUmVxdWVzdFR5cGUuY2xhenoocmVxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJwY0ltcGwobWV0aG9kLmZxbigpLCByZXEsIGZ1bmN0aW9uKGVyciwgcmVzKSB7IC8vIEFzc3VtZXMgdGhhdCB0aGlzIGlzIHByb3Blcmx5IGFzeW5jXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29hbGVzY2UgdG8gZW1wdHkgc3RyaW5nIHdoZW4gc2VydmljZSByZXNwb25zZSBoYXMgZW1wdHkgY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gJydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHsgcmVzID0gbWV0aG9kLnJlc29sdmVkUmVzcG9uc2VUeXBlLmNsYXp6LmRlY29kZShyZXMpOyB9IGNhdGNoIChub3RBQnVmZmVyKSB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcyB8fCAhKHJlcyBpbnN0YW5jZW9mIG1ldGhvZC5yZXNvbHZlZFJlc3BvbnNlVHlwZS5jbGF6eikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKEVycm9yKFwiSWxsZWdhbCByZXNwb25zZSB0eXBlIHJlY2VpdmVkIGluIHNlcnZpY2UgbWV0aG9kIFwiKyBULm5hbWUrXCIjXCIrbWV0aG9kLm5hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjay5iaW5kKHRoaXMsIGVyciksIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VydmljZS5NZXRob2QocnBjSW1wbCwgbWVzc2FnZSwgY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNlcnZpY2VbbWV0aG9kLm5hbWVdID0gZnVuY3Rpb24ocnBjSW1wbCwgcmVxLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFNlcnZpY2UocnBjSW1wbClbbWV0aG9kLm5hbWVdKHJlcSwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXJ2aWNlW21ldGhvZC5uYW1lXSwgXCIkb3B0aW9uc1wiLCB7IFwidmFsdWVcIjogbWV0aG9kLmJ1aWxkT3B0KCkgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZVByb3RvdHlwZVttZXRob2QubmFtZV0sIFwiJG9wdGlvbnNcIiwgeyBcInZhbHVlXCI6IFNlcnZpY2VbbWV0aG9kLm5hbWVdW1wiJG9wdGlvbnNcIl0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkocnBjW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTZXJ2aWNlIG9wdGlvbnMuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UuJG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyICRvcHRpb25zUzsgLy8gY2MgbmVlZHMgdGhpc1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2VydmljZSBvcHRpb25zLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlIyRvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsKj59XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciAkb3B0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJlZmxlY3Rpb24gdHlwZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuU2VydmljZS4kdHlwZVxyXG4gICAgICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2V9XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciAkdHlwZVM7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZWZsZWN0aW9uIHR5cGUuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UjJHR5cGVcclxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlfVxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgJHR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSlcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZSwgXCIkb3B0aW9uc1wiLCB7IFwidmFsdWVcIjogVC5idWlsZE9wdCgpIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXJ2aWNlUHJvdG90eXBlLCBcIiRvcHRpb25zXCIsIHsgXCJ2YWx1ZVwiOiBTZXJ2aWNlW1wiJG9wdGlvbnNcIl0gfSksXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNlcnZpY2UsIFwiJHR5cGVcIiwgeyBcInZhbHVlXCI6IFQgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNlcnZpY2VQcm90b3R5cGUsIFwiJHR5cGVcIiwgeyBcInZhbHVlXCI6IFQgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNlcnZpY2U7XHJcblxyXG4gICAgICAgICAgICB9KShQcm90b0J1ZiwgdGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0LlNlcnZpY2UgPSBTZXJ2aWNlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBYnN0cmFjdCBzZXJ2aWNlIG1ldGhvZC5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuTWV0aG9kXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuU2VydmljZX0gc3ZjIFNlcnZpY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNZXRob2QgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE9wdGlvbnNcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0LlRcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgTWV0aG9kID0gZnVuY3Rpb24oYnVpbGRlciwgc3ZjLCBuYW1lLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIFQuY2FsbCh0aGlzLCBidWlsZGVyLCBzdmMsIG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIlNlcnZpY2UuTWV0aG9kXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3B0aW9ucy5cclxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCAqPn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLk1ldGhvZC5wcm90b3R5cGVcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgTWV0aG9kUHJvdG90eXBlID0gTWV0aG9kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVC5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhlIG1ldGhvZCdzICckb3B0aW9ucycgcHJvcGVydHkuXHJcbiAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLk1ldGhvZCNidWlsZE9wdFxyXG4gICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdC48c3RyaW5nLCo+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1ldGhvZFByb3RvdHlwZS5idWlsZE9wdCA9IE5hbWVzcGFjZVByb3RvdHlwZS5idWlsZE9wdDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5NZXRob2RcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5TZXJ2aWNlLk1ldGhvZCA9IE1ldGhvZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUlBDIHNlcnZpY2UgbWV0aG9kLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5SUENNZXRob2RcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlfSBzdmMgU2VydmljZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE1ldGhvZCBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3QgUmVxdWVzdCBtZXNzYWdlIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2UgUmVzcG9uc2UgbWVzc2FnZSBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSByZXF1ZXN0X3N0cmVhbSBXaGV0aGVyIHJlcXVlc3RzIGFyZSBzdHJlYW1lZFxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzcG9uc2Vfc3RyZWFtIFdoZXRoZXIgcmVzcG9uc2VzIGFyZSBzdHJlYW1lZFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE9wdGlvbnNcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuTWV0aG9kXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFJQQ01ldGhvZCA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHN2YywgbmFtZSwgcmVxdWVzdCwgcmVzcG9uc2UsIHJlcXVlc3Rfc3RyZWFtLCByZXNwb25zZV9zdHJlYW0sIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgTWV0aG9kLmNhbGwodGhpcywgYnVpbGRlciwgc3ZjLCBuYW1lLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJTZXJ2aWNlLlJQQ01ldGhvZFwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFJlcXVlc3QgbWVzc2FnZSBuYW1lLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3ROYW1lID0gcmVxdWVzdDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXNwb25zZSBtZXNzYWdlIG5hbWUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VOYW1lID0gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogV2hldGhlciByZXF1ZXN0cyBhcmUgc3RyZWFtZWRcclxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFN0cmVhbSA9IHJlcXVlc3Rfc3RyZWFtO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFdoZXRoZXIgcmVzcG9uc2VzIGFyZSBzdHJlYW1lZFxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbH1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVN0cmVhbSA9IHJlc3BvbnNlX3N0cmVhbTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXNvbHZlZCByZXF1ZXN0IG1lc3NhZ2UgdHlwZS5cclxuICAgICAgICAgICAgICogQHR5cGUge1Byb3RvQnVmLlJlZmxlY3QuTWVzc2FnZX1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZFJlcXVlc3RUeXBlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXNvbHZlZCByZXNwb25zZSBtZXNzYWdlIHR5cGUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRSZXNwb25zZVR5cGUgPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEV4dGVuZHMgTWV0aG9kXHJcbiAgICAgICAgUlBDTWV0aG9kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTWV0aG9kLnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuUlBDTWV0aG9kXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuU2VydmljZS5SUENNZXRob2QgPSBSUENNZXRob2Q7XHJcblxyXG4gICAgICAgIHJldHVybiBSZWZsZWN0O1xyXG5cclxuICAgIH0pKFByb3RvQnVmKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBhbGlhcyBQcm90b0J1Zi5CdWlsZGVyXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLkJ1aWxkZXIgPSAoZnVuY3Rpb24oUHJvdG9CdWYsIExhbmcsIFJlZmxlY3QpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBCdWlsZGVyLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLkJ1aWxkZXJcclxuICAgICAgICAgKiBAY2xhc3MgUHJvdmlkZXMgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gYnVpbGQgcHJvdG9jb2wgbWVzc2FnZXMuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywqPj19IG9wdGlvbnMgT3B0aW9uc1xyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBCdWlsZGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5hbWVzcGFjZS5cclxuICAgICAgICAgICAgICogQHR5cGUge1Byb3RvQnVmLlJlZmxlY3QuTmFtZXNwYWNlfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLm5zID0gbmV3IFJlZmxlY3QuTmFtZXNwYWNlKHRoaXMsIG51bGwsIFwiXCIpOyAvLyBHbG9iYWwgbmFtZXNwYWNlXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTmFtZXNwYWNlIHBvaW50ZXIuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5SZWZsZWN0LlR9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucHRyID0gdGhpcy5ucztcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXNvbHZlZCBmbGFnLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IGJ1aWxkaW5nIHJlc3VsdC5cclxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZXxPYmplY3Q+fG51bGx9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbXBvcnRlZCBmaWxlcy5cclxuICAgICAgICAgICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmZpbGVzID0ge307XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW1wb3J0IHJvb3Qgb3ZlcnJpZGUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHs/c3RyaW5nfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmltcG9ydFJvb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9wdGlvbnMuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshT2JqZWN0LjxzdHJpbmcsICo+fVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5CdWlsZGVyLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBCdWlsZGVyUHJvdG90eXBlID0gQnVpbGRlci5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIERlZmluaXRpb24gdGVzdHMgLS0tLS1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGVzdHMgaWYgYSBkZWZpbml0aW9uIG1vc3QgbGlrZWx5IGRlc2NyaWJlcyBhIG1lc3NhZ2UuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBkZWZcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlci5pc01lc3NhZ2UgPSBmdW5jdGlvbihkZWYpIHtcclxuICAgICAgICAgICAgLy8gTWVzc2FnZXMgcmVxdWlyZSBhIHN0cmluZyBuYW1lXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1wibmFtZVwiXSAhPT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIE1lc3NhZ2VzIGRvIG5vdCBjb250YWluIHZhbHVlcyAoZW51bSkgb3IgcnBjIG1ldGhvZHMgKHNlcnZpY2UpXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1widmFsdWVzXCJdICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZGVmW1wicnBjXCJdICE9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGVzdHMgaWYgYSBkZWZpbml0aW9uIG1vc3QgbGlrZWx5IGRlc2NyaWJlcyBhIG1lc3NhZ2UgZmllbGQuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBkZWZcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlci5pc01lc3NhZ2VGaWVsZCA9IGZ1bmN0aW9uKGRlZikge1xyXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGZpZWxkcyByZXF1aXJlIGEgc3RyaW5nIHJ1bGUsIG5hbWUgYW5kIHR5cGUgYW5kIGFuIGlkXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1wicnVsZVwiXSAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGRlZltcIm5hbWVcIl0gIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkZWZbXCJ0eXBlXCJdICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgZGVmW1wiaWRcIl0gPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUZXN0cyBpZiBhIGRlZmluaXRpb24gbW9zdCBsaWtlbHkgZGVzY3JpYmVzIGFuIGVudW0uXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBkZWZcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlci5pc0VudW0gPSBmdW5jdGlvbihkZWYpIHtcclxuICAgICAgICAgICAgLy8gRW51bXMgcmVxdWlyZSBhIHN0cmluZyBuYW1lXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1wibmFtZVwiXSAhPT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIEVudW1zIHJlcXVpcmUgYXQgbGVhc3Qgb25lIHZhbHVlXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1widmFsdWVzXCJdID09PSAndW5kZWZpbmVkJyB8fCAhQXJyYXkuaXNBcnJheShkZWZbXCJ2YWx1ZXNcIl0pIHx8IGRlZltcInZhbHVlc1wiXS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRlc3RzIGlmIGEgZGVmaW5pdGlvbiBtb3N0IGxpa2VseSBkZXNjcmliZXMgYSBzZXJ2aWNlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gZGVmXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuaXNTZXJ2aWNlID0gZnVuY3Rpb24oZGVmKSB7XHJcbiAgICAgICAgICAgIC8vIFNlcnZpY2VzIHJlcXVpcmUgYSBzdHJpbmcgbmFtZSBhbmQgYW4gcnBjIG9iamVjdFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcIm5hbWVcIl0gIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkZWZbXCJycGNcIl0gIT09ICdvYmplY3QnIHx8ICFkZWZbXCJycGNcIl0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRlc3RzIGlmIGEgZGVmaW5pdGlvbiBtb3N0IGxpa2VseSBkZXNjcmliZXMgYW4gZXh0ZW5kZWQgbWVzc2FnZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gZGVmXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuaXNFeHRlbmQgPSBmdW5jdGlvbihkZWYpIHtcclxuICAgICAgICAgICAgLy8gRXh0ZW5kcyBycXVpcmUgYSBzdHJpbmcgcmVmXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1wicmVmXCJdICE9PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gQnVpbGRpbmcgLS0tLS1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVzZXRzIHRoZSBwb2ludGVyIHRvIHRoZSByb290IG5hbWVzcGFjZS5cclxuICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLkJ1aWxkZXJ9IHRoaXNcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlclByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnB0ciA9IHRoaXMubnM7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlZmluZXMgYSBuYW1lc3BhY2Ugb24gdG9wIG9mIHRoZSBjdXJyZW50IHBvaW50ZXIgcG9zaXRpb24gYW5kIHBsYWNlcyB0aGUgcG9pbnRlciBvbiBpdC5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZXNwYWNlXHJcbiAgICAgICAgICogQHJldHVybiB7IVByb3RvQnVmLkJ1aWxkZXJ9IHRoaXNcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlclByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbihuYW1lc3BhY2UpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgIT09ICdzdHJpbmcnIHx8ICFMYW5nLlRZUEVSRUYudGVzdChuYW1lc3BhY2UpKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG5hbWVzcGFjZTogXCIrbmFtZXNwYWNlKTtcclxuICAgICAgICAgICAgbmFtZXNwYWNlLnNwbGl0KFwiLlwiKS5mb3JFYWNoKGZ1bmN0aW9uKHBhcnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBucyA9IHRoaXMucHRyLmdldENoaWxkKHBhcnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5zID09PSBudWxsKSAvLyBLZWVwIGV4aXN0aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIuYWRkQ2hpbGQobnMgPSBuZXcgUmVmbGVjdC5OYW1lc3BhY2UodGhpcywgdGhpcy5wdHIsIHBhcnQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHRyID0gbnM7XHJcbiAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGVzIHRoZSBzcGVjaWZpZWQgZGVmaW5pdGlvbnMgYXQgdGhlIGN1cnJlbnQgcG9pbnRlciBwb3NpdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0geyFBcnJheS48IU9iamVjdD59IGRlZnMgTWVzc2FnZXMsIGVudW1zIG9yIHNlcnZpY2VzIHRvIGNyZWF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlcn0gdGhpc1xyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBhIG1lc3NhZ2UgZGVmaW5pdGlvbiBpcyBpbnZhbGlkXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGVmcykge1xyXG4gICAgICAgICAgICBpZiAoIWRlZnMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gTm90aGluZyB0byBjcmVhdGVcclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRlZnMpKVxyXG4gICAgICAgICAgICAgICAgZGVmcyA9IFtkZWZzXTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVmcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICBkZWZzID0gZGVmcy5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJdCdzIHF1aXRlIGhhcmQgdG8ga2VlcCB0cmFjayBvZiBzY29wZXMgYW5kIG1lbW9yeSBoZXJlLCBzbyBsZXQncyBkbyB0aGlzIGl0ZXJhdGl2ZWx5LlxyXG4gICAgICAgICAgICB2YXIgc3RhY2sgPSBbZGVmc107XHJcbiAgICAgICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZzID0gc3RhY2sucG9wKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRlZnMpKSAvLyBTdGFjayBhbHdheXMgY29udGFpbnMgZW50aXJlIG5hbWVzcGFjZXNcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vdCBhIHZhbGlkIG5hbWVzcGFjZTogXCIrSlNPTi5zdHJpbmdpZnkoZGVmcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChkZWZzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmID0gZGVmcy5zaGlmdCgpOyAvLyBOYW1lc3BhY2VzIGFsd2F5cyBjb250YWluIGFuIGFycmF5IG9mIG1lc3NhZ2VzLCBlbnVtcyBhbmQgc2VydmljZXNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJ1aWxkZXIuaXNNZXNzYWdlKGRlZikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyBSZWZsZWN0Lk1lc3NhZ2UodGhpcywgdGhpcy5wdHIsIGRlZltcIm5hbWVcIl0sIGRlZltcIm9wdGlvbnNcIl0sIGRlZltcImlzR3JvdXBcIl0sIGRlZltcInN5bnRheFwiXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgT25lT2ZzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVvZnMgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltcIm9uZW9mc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRlZltcIm9uZW9mc1wiXSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmFkZENoaWxkKG9uZW9mc1tuYW1lXSA9IG5ldyBSZWZsZWN0Lk1lc3NhZ2UuT25lT2YodGhpcywgb2JqLCBuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBmaWVsZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltcImZpZWxkc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZltcImZpZWxkc1wiXS5mb3JFYWNoKGZ1bmN0aW9uKGZsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmouZ2V0Q2hpbGQoZmxkW1wiaWRcIl18MCkgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiZHVwbGljYXRlIG9yIGludmFsaWQgZmllbGQgaWQgaW4gXCIrb2JqLm5hbWUrXCI6IFwiK2ZsZFsnaWQnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZsZFtcIm9wdGlvbnNcIl0gJiYgdHlwZW9mIGZsZFtcIm9wdGlvbnNcIl0gIT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgZmllbGQgb3B0aW9ucyBpbiBcIitvYmoubmFtZStcIiNcIitmbGRbXCJuYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lb2YgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmxkW1wib25lb2ZcIl0gPT09ICdzdHJpbmcnICYmICEob25lb2YgPSBvbmVvZnNbZmxkW1wib25lb2ZcIl1dKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG9uZW9mIGluIFwiK29iai5uYW1lK1wiI1wiK2ZsZFtcIm5hbWVcIl0rXCI6IFwiK2ZsZFtcIm9uZW9mXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGQgPSBuZXcgUmVmbGVjdC5NZXNzYWdlLkZpZWxkKHRoaXMsIG9iaiwgZmxkW1wicnVsZVwiXSwgZmxkW1wia2V5dHlwZVwiXSwgZmxkW1widHlwZVwiXSwgZmxkW1wibmFtZVwiXSwgZmxkW1wiaWRcIl0sIGZsZFtcIm9wdGlvbnNcIl0sIG9uZW9mLCBkZWZbXCJzeW50YXhcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbmVvZilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25lb2YuZmllbGRzLnB1c2goZmxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouYWRkQ2hpbGQoZmxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHVzaCBjaGlsZHJlbiB0byBzdGFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ViT2JqID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZbXCJlbnVtc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZltcImVudW1zXCJdLmZvckVhY2goZnVuY3Rpb24oZW5tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViT2JqLnB1c2goZW5tKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmW1wibWVzc2FnZXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZbXCJtZXNzYWdlc1wiXS5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Yk9iai5wdXNoKG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltcInNlcnZpY2VzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmW1wic2VydmljZXNcIl0uZm9yRWFjaChmdW5jdGlvbihzdmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJPYmoucHVzaChzdmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgZXh0ZW5zaW9uIHJhbmdlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmW1wiZXh0ZW5zaW9uc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWZbXCJleHRlbnNpb25zXCJdWzBdID09PSAnbnVtYmVyJykgLy8gcHJlIDUuMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmV4dGVuc2lvbnMgPSBbIGRlZltcImV4dGVuc2lvbnNcIl0gXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZXh0ZW5zaW9ucyA9IGRlZltcImV4dGVuc2lvbnNcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBvbiB0b3Agb2YgY3VycmVudCBuYW1lc3BhY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIuYWRkQ2hpbGQob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yk9iai5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGRlZnMpOyAvLyBQdXNoIHRoZSBjdXJyZW50IGxldmVsIGJhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZnMgPSBzdWJPYmo7IC8vIENvbnRpbnVlIHByb2Nlc3Npbmcgc3ViIGxldmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJPYmogPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIgPSBvYmo7IC8vIEFuZCBtb3ZlIHRoZSBwb2ludGVyIHRvIHRoaXMgbmFtZXNwYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmogPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViT2JqID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCdWlsZGVyLmlzRW51bShkZWYpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmogPSBuZXcgUmVmbGVjdC5FbnVtKHRoaXMsIHRoaXMucHRyLCBkZWZbXCJuYW1lXCJdLCBkZWZbXCJvcHRpb25zXCJdLCBkZWZbXCJzeW50YXhcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZbXCJ2YWx1ZXNcIl0uZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5hZGRDaGlsZChuZXcgUmVmbGVjdC5FbnVtLlZhbHVlKHRoaXMsIG9iaiwgdmFsW1wibmFtZVwiXSwgdmFsW1wiaWRcIl0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLmFkZENoaWxkKG9iaik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQnVpbGRlci5pc1NlcnZpY2UoZGVmKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gbmV3IFJlZmxlY3QuU2VydmljZSh0aGlzLCB0aGlzLnB0ciwgZGVmW1wibmFtZVwiXSwgZGVmW1wib3B0aW9uc1wiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRlZltcInJwY1wiXSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXRkID0gZGVmW1wicnBjXCJdW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmFkZENoaWxkKG5ldyBSZWZsZWN0LlNlcnZpY2UuUlBDTWV0aG9kKHRoaXMsIG9iaiwgbmFtZSwgbXRkW1wicmVxdWVzdFwiXSwgbXRkW1wicmVzcG9uc2VcIl0sICEhbXRkW1wicmVxdWVzdF9zdHJlYW1cIl0sICEhbXRkW1wicmVzcG9uc2Vfc3RyZWFtXCJdLCBtdGRbXCJvcHRpb25zXCJdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB0ci5hZGRDaGlsZChvYmopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEJ1aWxkZXIuaXNFeHRlbmQoZGVmKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gdGhpcy5wdHIucmVzb2x2ZShkZWZbXCJyZWZcIl0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZbXCJmaWVsZHNcIl0uZm9yRWFjaChmdW5jdGlvbihmbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmdldENoaWxkKGZsZFsnaWQnXXwwKSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJkdXBsaWNhdGUgZXh0ZW5kZWQgZmllbGQgaWQgaW4gXCIrb2JqLm5hbWUrXCI6IFwiK2ZsZFsnaWQnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZmllbGQgaWQgaXMgYWxsb3dlZCB0byBiZSBleHRlbmRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmouZXh0ZW5zaW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmV4dGVuc2lvbnMuZm9yRWFjaChmdW5jdGlvbihyYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZsZFtcImlkXCJdID49IHJhbmdlWzBdICYmIGZsZFtcImlkXCJdIDw9IHJhbmdlWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgZXh0ZW5kZWQgZmllbGQgaWQgaW4gXCIrb2JqLm5hbWUrXCI6IFwiK2ZsZFsnaWQnXStcIiAobm90IHdpdGhpbiB2YWxpZCByYW5nZXMpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IGV4dGVuc2lvbiBmaWVsZCBuYW1lcyB0byBjYW1lbCBjYXNlIG5vdGF0aW9uIGlmIHRoZSBvdmVycmlkZSBpcyBzZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGZsZFtcIm5hbWVcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1snY29udmVydEZpZWxkc1RvQ2FtZWxDYXNlJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSBQcm90b0J1Zi5VdGlsLnRvQ2FtZWxDYXNlKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlZSAjMTYxOiBFeHRlbnNpb25zIHVzZSB0aGVpciBmdWxseSBxdWFsaWZpZWQgbmFtZSBhcyB0aGVpciBydW50aW1lIGtleSBhbmQuLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBuZXcgUmVmbGVjdC5NZXNzYWdlLkV4dGVuc2lvbkZpZWxkKHRoaXMsIG9iaiwgZmxkW1wicnVsZVwiXSwgZmxkW1widHlwZVwiXSwgdGhpcy5wdHIuZnFuKCkrJy4nK25hbWUsIGZsZFtcImlkXCJdLCBmbGRbXCJvcHRpb25zXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAuLi5hcmUgYWRkZWQgb24gdG9wIG9mIHRoZSBjdXJyZW50IG5hbWVzcGFjZSBhcyBhbiBleHRlbnNpb24gd2hpY2ggaXMgdXNlZCBmb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZpbmcgdGhlaXIgdHlwZSBsYXRlciBvbiAodGhlIGV4dGVuc2lvbiBhbHdheXMga2VlcHMgdGhlIG9yaWdpbmFsIG5hbWUgdG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHQgPSBuZXcgUmVmbGVjdC5FeHRlbnNpb24odGhpcywgdGhpcy5wdHIsIGZsZFtcIm5hbWVcIl0sIGZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5leHRlbnNpb24gPSBleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIuYWRkQ2hpbGQoZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouYWRkQ2hpbGQoZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEvXFwuP2dvb2dsZVxcLnByb3RvYnVmXFwuLy50ZXN0KGRlZltcInJlZlwiXSkpIC8vIFNpbGVudGx5IHNraXAgaW50ZXJuYWwgZXh0ZW5zaW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJleHRlbmRlZCBtZXNzYWdlIFwiK2RlZltcInJlZlwiXStcIiBpcyBub3QgZGVmaW5lZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwibm90IGEgdmFsaWQgZGVmaW5pdGlvbjogXCIrSlNPTi5zdHJpbmdpZnkoZGVmKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIEJyZWFrIGdvZXMgaGVyZVxyXG4gICAgICAgICAgICAgICAgZGVmcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB0ciA9IHRoaXMucHRyLnBhcmVudDsgLy8gTmFtZXNwYWNlIGRvbmUsIGNvbnRpbnVlIGF0IHBhcmVudFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQgPSBmYWxzZTsgLy8gUmVxdWlyZSByZS1yZXNvbHZlXHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDsgLy8gUmVxdWlyZSByZS1idWlsZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQcm9wYWdhdGVzIHN5bnRheCB0byBhbGwgY2hpbGRyZW4uXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBwYXJlbnRcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBwcm9wYWdhdGVTeW50YXgocGFyZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRbJ21lc3NhZ2VzJ10pIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFsnbWVzc2FnZXMnXS5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRbXCJzeW50YXhcIl0gPSBwYXJlbnRbXCJzeW50YXhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGFnYXRlU3ludGF4KGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRbJ2VudW1zJ10pIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFsnZW51bXMnXS5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRbXCJzeW50YXhcIl0gPSBwYXJlbnRbXCJzeW50YXhcIl07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW1wb3J0cyBhbm90aGVyIGRlZmluaXRpb24gaW50byB0aGlzIGJ1aWxkZXIuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywqPn0ganNvbiBQYXJzZWQgaW1wb3J0XHJcbiAgICAgICAgICogQHBhcmFtIHsoc3RyaW5nfHtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ30pPX0gZmlsZW5hbWUgSW1wb3J0ZWQgZmlsZSBuYW1lXHJcbiAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyfSB0aGlzXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkZWZpbml0aW9uIG9yIGZpbGUgY2Fubm90IGJlIGltcG9ydGVkXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGVbXCJpbXBvcnRcIl0gPSBmdW5jdGlvbihqc29uLCBmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZGVsaW0gPSAnLyc7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdG8gc2tpcCBkdXBsaWNhdGUgaW1wb3J0c1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ3N0cmluZycpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoUHJvdG9CdWYuVXRpbC5JU19OT0RFKVxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gcmVxdWlyZShcInBhdGhcIilbJ3Jlc29sdmUnXShmaWxlbmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWxlc1tmaWxlbmFtZV0gPT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsZXNbZmlsZW5hbWVdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbGVuYW1lID09PSAnb2JqZWN0JykgeyAvLyBPYmplY3Qgd2l0aCByb290LCBmaWxlLlxyXG5cclxuICAgICAgICAgICAgICAgIHZhciByb290ID0gZmlsZW5hbWUucm9vdDtcclxuICAgICAgICAgICAgICAgIGlmIChQcm90b0J1Zi5VdGlsLklTX05PREUpXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHJlcXVpcmUoXCJwYXRoXCIpWydyZXNvbHZlJ10ocm9vdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9vdC5pbmRleE9mKFwiXFxcXFwiKSA+PSAwIHx8IGZpbGVuYW1lLmZpbGUuaW5kZXhPZihcIlxcXFxcIikgPj0gMClcclxuICAgICAgICAgICAgICAgICAgICBkZWxpbSA9ICdcXFxcJztcclxuICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9IHJvb3QgKyBkZWxpbSArIGZpbGVuYW1lLmZpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWxlc1tmbmFtZV0gPT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsZXNbZm5hbWVdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSW1wb3J0IGltcG9ydHNcclxuXHJcbiAgICAgICAgICAgIGlmIChqc29uWydpbXBvcnRzJ10gJiYganNvblsnaW1wb3J0cyddLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbXBvcnRSb290LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc2V0Um9vdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsZW5hbWUgPT09ICdvYmplY3QnKSB7IC8vIElmIGFuIGltcG9ydCByb290IGlzIHNwZWNpZmllZCwgb3ZlcnJpZGVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbXBvcnRSb290ID0gZmlsZW5hbWVbXCJyb290XCJdOyByZXNldFJvb3QgPSB0cnVlOyAvLyAuLi4gYW5kIHJlc2V0IGFmdGVyd2FyZHNcclxuICAgICAgICAgICAgICAgICAgICBpbXBvcnRSb290ID0gdGhpcy5pbXBvcnRSb290O1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWVbXCJmaWxlXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnRSb290LmluZGV4T2YoXCJcXFxcXCIpID49IDAgfHwgZmlsZW5hbWUuaW5kZXhPZihcIlxcXFxcIikgPj0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsaW0gPSAnXFxcXCc7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZmlsZW5hbWUgPT09ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmltcG9ydFJvb3QpIC8vIElmIGltcG9ydCByb290IGlzIG92ZXJyaWRkZW4sIHVzZSBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRSb290ID0gdGhpcy5pbXBvcnRSb290O1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBPdGhlcndpc2UgY29tcHV0ZSBmcm9tIGZpbGVuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxlbmFtZS5pbmRleE9mKFwiL1wiKSA+PSAwKSB7IC8vIFVuaXhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFJvb3QgPSBmaWxlbmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC8qIC9maWxlLnByb3RvICovIGltcG9ydFJvb3QgPT09IFwiXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0Um9vdCA9IFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lLmluZGV4T2YoXCJcXFxcXCIpID49IDApIHsgLy8gV2luZG93c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0Um9vdCA9IGZpbGVuYW1lLnJlcGxhY2UoL1xcXFxbXlxcXFxdKiQvLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGltID0gJ1xcXFwnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFJvb3QgPSBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0Um9vdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGpzb25bJ2ltcG9ydHMnXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YganNvblsnaW1wb3J0cyddW2ldID09PSAnc3RyaW5nJykgeyAvLyBJbXBvcnQgZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWltcG9ydFJvb3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImNhbm5vdCBkZXRlcm1pbmUgaW1wb3J0IHJvb3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRGaWxlbmFtZSA9IGpzb25bJ2ltcG9ydHMnXVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydEZpbGVuYW1lID09PSBcImdvb2dsZS9wcm90b2J1Zi9kZXNjcmlwdG9yLnByb3RvXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gTm90IG5lZWRlZCBhbmQgdGhlcmVmb3JlIG5vdCB1c2VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEZpbGVuYW1lID0gaW1wb3J0Um9vdCArIGRlbGltICsgaW1wb3J0RmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbGVzW2ltcG9ydEZpbGVuYW1lXSA9PT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBBbHJlYWR5IGltcG9ydGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXFwucHJvdG8kL2kudGVzdChpbXBvcnRGaWxlbmFtZSkgJiYgIVByb3RvQnVmLkRvdFByb3RvKSAgICAgICAvLyBJZiB0aGlzIGlzIGEgbGlnaHQgYnVpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEZpbGVuYW1lID0gaW1wb3J0RmlsZW5hbWUucmVwbGFjZSgvXFwucHJvdG8kLywgXCIuanNvblwiKTsgLy8gYWx3YXlzIGxvYWQgdGhlIEpTT04gZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudHMgPSBQcm90b0J1Zi5VdGlsLmZldGNoKGltcG9ydEZpbGVuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRzID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJmYWlsZWQgdG8gaW1wb3J0ICdcIitpbXBvcnRGaWxlbmFtZStcIicgaW4gJ1wiK2ZpbGVuYW1lK1wiJzogZmlsZSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXFwuanNvbiQvaS50ZXN0KGltcG9ydEZpbGVuYW1lKSkgLy8gQWx3YXlzIHBvc3NpYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1wiaW1wb3J0XCJdKEpTT04ucGFyc2UoY29udGVudHMrXCJcIiksIGltcG9ydEZpbGVuYW1lKTsgLy8gTWF5IHRocm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbXCJpbXBvcnRcIl0oUHJvdG9CdWYuRG90UHJvdG8uUGFyc2VyLnBhcnNlKGNvbnRlbnRzKSwgaW1wb3J0RmlsZW5hbWUpOyAvLyBNYXkgdGhyb3dcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgLy8gSW1wb3J0IHN0cnVjdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbGVuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tcImltcG9ydFwiXShqc29uWydpbXBvcnRzJ11baV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgvXFwuKFxcdyspJC8udGVzdChmaWxlbmFtZSkpIC8vIFdpdGggZXh0ZW5zaW9uOiBBcHBlbmQgX2ltcG9ydE4gdG8gdGhlIG5hbWUgcG9ydGlvbiB0byBtYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tcImltcG9ydFwiXShqc29uWydpbXBvcnRzJ11baV0sIGZpbGVuYW1lLnJlcGxhY2UoL14oLispXFwuKFxcdyspJC8sIGZ1bmN0aW9uKCQwLCAkMSwgJDIpIHsgcmV0dXJuICQxK1wiX2ltcG9ydFwiK2krXCIuXCIrJDI7IH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSAvLyBXaXRob3V0IGV4dGVuc2lvbjogQXBwZW5kIF9pbXBvcnROIHRvIG1ha2UgaXQgdW5pcXVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1wiaW1wb3J0XCJdKGpzb25bJ2ltcG9ydHMnXVtpXSwgZmlsZW5hbWUrXCJfaW1wb3J0XCIraSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzZXRSb290KSAvLyBSZXNldCBpbXBvcnQgcm9vdCBvdmVycmlkZSB3aGVuIGFsbCBpbXBvcnRzIGFyZSBkb25lXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbXBvcnRSb290ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSW1wb3J0IHN0cnVjdHVyZXNcclxuXHJcbiAgICAgICAgICAgIGlmIChqc29uWydwYWNrYWdlJ10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZShqc29uWydwYWNrYWdlJ10pO1xyXG4gICAgICAgICAgICBpZiAoanNvblsnc3ludGF4J10pXHJcbiAgICAgICAgICAgICAgICBwcm9wYWdhdGVTeW50YXgoanNvbik7XHJcbiAgICAgICAgICAgIHZhciBiYXNlID0gdGhpcy5wdHI7XHJcbiAgICAgICAgICAgIGlmIChqc29uWydvcHRpb25zJ10pXHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhqc29uWydvcHRpb25zJ10pLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5vcHRpb25zW2tleV0gPSBqc29uWydvcHRpb25zJ11ba2V5XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoanNvblsnbWVzc2FnZXMnXSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlKGpzb25bJ21lc3NhZ2VzJ10pLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wdHIgPSBiYXNlO1xyXG4gICAgICAgICAgICBpZiAoanNvblsnZW51bXMnXSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlKGpzb25bJ2VudW1zJ10pLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wdHIgPSBiYXNlO1xyXG4gICAgICAgICAgICBpZiAoanNvblsnc2VydmljZXMnXSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlKGpzb25bJ3NlcnZpY2VzJ10pLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wdHIgPSBiYXNlO1xyXG4gICAgICAgICAgICBpZiAoanNvblsnZXh0ZW5kcyddKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUoanNvblsnZXh0ZW5kcyddKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVzb2x2ZXMgYWxsIG5hbWVzcGFjZSBvYmplY3RzLlxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBhIHR5cGUgY2Fubm90IGJlIHJlc29sdmVkXHJcbiAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyfSB0aGlzXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGUucmVzb2x2ZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBSZXNvbHZlIGFsbCByZWZsZWN0ZWQgb2JqZWN0c1xyXG4gICAgICAgICAgICB2YXIgcmVzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wdHIgPT0gbnVsbCB8fCB0eXBlb2YgdGhpcy5wdHIudHlwZSA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gRG9uZSAoYWxyZWFkeSByZXNvbHZlZClcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnB0ciBpbnN0YW5jZW9mIFJlZmxlY3QuTmFtZXNwYWNlKSB7IC8vIFJlc29sdmUgY2hpbGRyZW5cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnB0ci5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIgPSBjaGlsZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVBbGwoKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnB0ciBpbnN0YW5jZW9mIFJlZmxlY3QuTWVzc2FnZS5GaWVsZCkgeyAvLyBSZXNvbHZlIHR5cGVcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIUxhbmcuVFlQRS50ZXN0KHRoaXMucHRyLnR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEVSRUYudGVzdCh0aGlzLnB0ci50eXBlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHR5cGUgcmVmZXJlbmNlIGluIFwiK3RoaXMucHRyLnRvU3RyaW5nKHRydWUpK1wiOiBcIit0aGlzLnB0ci50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXMgPSAodGhpcy5wdHIgaW5zdGFuY2VvZiBSZWZsZWN0Lk1lc3NhZ2UuRXh0ZW5zaW9uRmllbGQgPyB0aGlzLnB0ci5leHRlbnNpb24ucGFyZW50IDogdGhpcy5wdHIucGFyZW50KS5yZXNvbHZlKHRoaXMucHRyLnR5cGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVucmVzb2x2YWJsZSB0eXBlIHJlZmVyZW5jZSBpbiBcIit0aGlzLnB0ci50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5wdHIudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIucmVzb2x2ZWRUeXBlID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMgaW5zdGFuY2VvZiBSZWZsZWN0LkVudW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIudHlwZSA9IFByb3RvQnVmLlRZUEVTW1wiZW51bVwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHRyLnN5bnRheCA9PT0gJ3Byb3RvMycgJiYgcmVzLnN5bnRheCAhPT0gJ3Byb3RvMycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInByb3RvMyBtZXNzYWdlIGNhbm5vdCByZWZlcmVuY2UgcHJvdG8yIGVudW1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlcyBpbnN0YW5jZW9mIFJlZmxlY3QuTWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIudHlwZSA9IHJlcy5pc0dyb3VwID8gUHJvdG9CdWYuVFlQRVNbXCJncm91cFwiXSA6IFByb3RvQnVmLlRZUEVTW1wibWVzc2FnZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCB0eXBlIHJlZmVyZW5jZSBpbiBcIit0aGlzLnB0ci50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5wdHIudHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB0ci50eXBlID0gUHJvdG9CdWYuVFlQRVNbdGhpcy5wdHIudHlwZV07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgaXQncyBhIG1hcCBmaWVsZCwgYWxzbyByZXNvbHZlIHRoZSBrZXkgdHlwZS4gVGhlIGtleSB0eXBlIGNhbiBiZSBvbmx5IGEgbnVtZXJpYywgc3RyaW5nLCBvciBib29sIHR5cGVcclxuICAgICAgICAgICAgICAgIC8vIChpLmUuLCBubyBlbnVtcyBvciBtZXNzYWdlcyksIHNvIHdlIGRvbid0IG5lZWQgdG8gcmVzb2x2ZSBhZ2FpbnN0IHRoZSBjdXJyZW50IG5hbWVzcGFjZS5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnB0ci5tYXApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUxhbmcuVFlQRS50ZXN0KHRoaXMucHRyLmtleVR5cGUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwga2V5IHR5cGUgZm9yIG1hcCBmaWVsZCBpbiBcIit0aGlzLnB0ci50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5wdHIua2V5VHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIua2V5VHlwZSA9IFByb3RvQnVmLlRZUEVTW3RoaXMucHRyLmtleVR5cGVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnB0ciBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5NZXRob2QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wdHIgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuUlBDTWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gdGhpcy5wdHIucGFyZW50LnJlc29sdmUodGhpcy5wdHIucmVxdWVzdE5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzIHx8ICEocmVzIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHR5cGUgcmVmZXJlbmNlIGluIFwiK3RoaXMucHRyLnRvU3RyaW5nKHRydWUpK1wiOiBcIit0aGlzLnB0ci5yZXF1ZXN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIucmVzb2x2ZWRSZXF1ZXN0VHlwZSA9IHJlcztcclxuICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLnB0ci5wYXJlbnQucmVzb2x2ZSh0aGlzLnB0ci5yZXNwb25zZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzIHx8ICEocmVzIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHR5cGUgcmVmZXJlbmNlIGluIFwiK3RoaXMucHRyLnRvU3RyaW5nKHRydWUpK1wiOiBcIit0aGlzLnB0ci5yZXNwb25zZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLnJlc29sdmVkUmVzcG9uc2VUeXBlID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIC8vIFNob3VsZCBub3QgaGFwcGVuIGFzIG5vdGhpbmcgZWxzZSBpcyBpbXBsZW1lbnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBzZXJ2aWNlIHR5cGUgaW4gXCIrdGhpcy5wdHIudG9TdHJpbmcodHJ1ZSkpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgICEodGhpcy5wdHIgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuT25lT2YpICYmIC8vIE5vdCBidWlsdFxyXG4gICAgICAgICAgICAgICAgISh0aGlzLnB0ciBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuRXh0ZW5zaW9uKSAmJiAvLyBOb3QgYnVpbHRcclxuICAgICAgICAgICAgICAgICEodGhpcy5wdHIgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0LkVudW0uVmFsdWUpIC8vIEJ1aWx0IGluIGVudW1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG9iamVjdCBpbiBuYW1lc3BhY2U6IFwiK3R5cGVvZih0aGlzLnB0cikrXCI6IFwiK3RoaXMucHRyKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoZSBwcm90b2NvbC4gVGhpcyB3aWxsIGZpcnN0IHRyeSB0byByZXNvbHZlIGFsbCBkZWZpbml0aW9ucyBhbmQsIGlmIHRoaXMgaGFzIGJlZW4gc3VjY2Vzc2Z1bCxcclxuICAgICAgICAgKiByZXR1cm4gdGhlIGJ1aWx0IHBhY2thZ2UuXHJcbiAgICAgICAgICogQHBhcmFtIHsoc3RyaW5nfEFycmF5LjxzdHJpbmc+KT19IHBhdGggU3BlY2lmaWVzIHdoYXQgdG8gcmV0dXJuLiBJZiBvbWl0dGVkLCB0aGUgZW50aXJlIG5hbWVzcGFjZSB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfCFPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgYSB0eXBlIGNvdWxkIG5vdCBiZSByZXNvbHZlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXNvbHZlZClcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUFsbCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlZCA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IG51bGw7IC8vIFJlcXVpcmUgcmUtYnVpbGRcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVzdWx0ID09PSBudWxsKSAvLyAoUmUtKUJ1aWxkXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IHRoaXMubnMuYnVpbGQoKTtcclxuICAgICAgICAgICAgaWYgKCFwYXRoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgcGFydCA9IHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJyA/IHBhdGguc3BsaXQoXCIuXCIpIDogcGF0aCxcclxuICAgICAgICAgICAgICAgIHB0ciA9IHRoaXMucmVzdWx0OyAvLyBCdWlsZCBuYW1lc3BhY2UgcG9pbnRlciAobm8gaGFzQ2hpbGQgZXRjLilcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHBhcnQubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAocHRyW3BhcnRbaV1dKVxyXG4gICAgICAgICAgICAgICAgICAgIHB0ciA9IHB0cltwYXJ0W2ldXTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHB0ciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwdHI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2ltaWxhciB0byB7QGxpbmsgUHJvdG9CdWYuQnVpbGRlciNidWlsZH0sIGJ1dCBsb29rcyB1cCB0aGUgaW50ZXJuYWwgcmVmbGVjdGlvbiBkZXNjcmlwdG9yLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gcGF0aCBTcGVjaWZpZXMgd2hhdCB0byByZXR1cm4uIElmIG9taXR0ZWQsIHRoZSBlbnRpcmUgbmFtZXNwYWNlIHdpaWwgYmUgcmV0dXJuZWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gZXhjbHVkZU5vbk5hbWVzcGFjZSBFeGNsdWRlcyBub24tbmFtZXNwYWNlIHR5cGVzIGxpa2UgZmllbGRzLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICogQHJldHVybnMgez9Qcm90b0J1Zi5SZWZsZWN0LlR9IFJlZmxlY3Rpb24gZGVzY3JpcHRvciBvciBgbnVsbGAgaWYgbm90IGZvdW5kXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlclByb3RvdHlwZS5sb29rdXAgPSBmdW5jdGlvbihwYXRoLCBleGNsdWRlTm9uTmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoID8gdGhpcy5ucy5yZXNvbHZlKHBhdGgsIGV4Y2x1ZGVOb25OYW1lc3BhY2UpIDogdGhpcy5ucztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIGFzIG9mIFwiQnVpbGRlclwiXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiQnVpbGRlclwiO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIEJhc2UgY2xhc3NlcyAtLS0tLVxyXG4gICAgICAgIC8vIEV4aXN0IGZvciB0aGUgc29sZSBwdXJwb3NlIG9mIGJlaW5nIGFibGUgdG8gXCIuLi4gaW5zdGFuY2VvZiBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2VcIiBldGMuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyLk1lc3NhZ2UgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuQnVpbGRlci5FbnVtXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlci5FbnVtID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuU2VydmljZSA9IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBCdWlsZGVyO1xyXG5cclxuICAgIH0pKFByb3RvQnVmLCBQcm90b0J1Zi5MYW5nLCBQcm90b0J1Zi5SZWZsZWN0KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBhbGlhcyBQcm90b0J1Zi5NYXBcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuTWFwID0gKGZ1bmN0aW9uKFByb3RvQnVmLCBSZWZsZWN0KSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgTWFwLiBBIE1hcCBpcyBhIGNvbnRhaW5lciB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IG1hcFxyXG4gICAgICAgICAqIGZpZWxkcyBvbiBtZXNzYWdlIG9iamVjdHMuIEl0IGNsb3NlbHkgZm9sbG93cyB0aGUgRVM2IE1hcCBBUEk7IGhvd2V2ZXIsXHJcbiAgICAgICAgICogaXQgaXMgZGlzdGluY3QgYmVjYXVzZSB3ZSBkbyBub3Qgd2FudCB0byBkZXBlbmQgb24gZXh0ZXJuYWwgcG9seWZpbGxzIG9yXHJcbiAgICAgICAgICogb24gRVM2IGl0c2VsZi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLk1hcFxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuRmllbGR9IGZpZWxkIE1hcCBmaWVsZFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBjb250ZW50cyBJbml0aWFsIGNvbnRlbnRzXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIE1hcCA9IGZ1bmN0aW9uKGZpZWxkLCBjb250ZW50cykge1xyXG4gICAgICAgICAgICBpZiAoIWZpZWxkLm1hcClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiZmllbGQgaXMgbm90IGEgbWFwXCIpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFRoZSBmaWVsZCBjb3JyZXNwb25kaW5nIHRvIHRoaXMgbWFwLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IVByb3RvQnVmLlJlZmxlY3QuRmllbGR9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRWxlbWVudCBpbnN0YW5jZSBjb3JyZXNwb25kaW5nIHRvIGtleSB0eXBlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IVByb3RvQnVmLlJlZmxlY3QuRWxlbWVudH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMua2V5RWxlbSA9IG5ldyBSZWZsZWN0LkVsZW1lbnQoZmllbGQua2V5VHlwZSwgbnVsbCwgdHJ1ZSwgZmllbGQuc3ludGF4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBFbGVtZW50IGluc3RhbmNlIGNvcnJlc3BvbmRpbmcgdG8gdmFsdWUgdHlwZS5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0LkVsZW1lbnR9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlRWxlbSA9IG5ldyBSZWZsZWN0LkVsZW1lbnQoZmllbGQudHlwZSwgZmllbGQucmVzb2x2ZWRUeXBlLCBmYWxzZSwgZmllbGQuc3ludGF4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbnRlcm5hbCBtYXA6IHN0b3JlcyBtYXBwaW5nIG9mIChzdHJpbmcgZm9ybSBvZiBrZXkpIC0+IChrZXksIHZhbHVlKVxyXG4gICAgICAgICAgICAgKiBwYWlyLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBXZSBwcm92aWRlIG1hcCBzZW1hbnRpY3MgZm9yIGFyYml0cmFyeSBrZXkgdHlwZXMsIGJ1dCB3ZSBidWlsZCBvbiB0b3BcclxuICAgICAgICAgICAgICogb2YgYW4gT2JqZWN0LCB3aGljaCBoYXMgb25seSBzdHJpbmcga2V5cy4gSW4gb3JkZXIgdG8gYXZvaWQgdGhlIG5lZWRcclxuICAgICAgICAgICAgICogdG8gY29udmVydCBhIHN0cmluZyBrZXkgYmFjayB0byBpdHMgbmF0aXZlIHR5cGUgaW4gbWFueSBzaXR1YXRpb25zLFxyXG4gICAgICAgICAgICAgKiB3ZSBzdG9yZSB0aGUgbmF0aXZlIGtleSB2YWx1ZSBhbG9uZ3NpZGUgdGhlIHZhbHVlLiBUaHVzLCB3ZSBvbmx5IG5lZWRcclxuICAgICAgICAgICAgICogYSBvbmUtd2F5IG1hcHBpbmcgZnJvbSBhIGtleSB0eXBlIHRvIGl0cyBzdHJpbmcgZm9ybSB0aGF0IGd1YXJhbnRlZXNcclxuICAgICAgICAgICAgICogdW5pcXVlbmVzcyBhbmQgZXF1YWxpdHkgKGkuZS4sIHN0cihLMSkgPT09IHN0cihLMikgaWYgYW5kIG9ubHkgaWYgSzFcclxuICAgICAgICAgICAgICogPT09IEsyKS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQHR5cGUgeyFPYmplY3Q8c3RyaW5nLCB7a2V5OiAqLCB2YWx1ZTogKn0+fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5tYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIG1hcC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNpemVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMubWFwKS5sZW5ndGg7IH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBGaWxsIGluaXRpYWwgY29udGVudHMgZnJvbSBhIHJhdyBvYmplY3QuXHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5rZXlFbGVtLnZhbHVlRnJvbVN0cmluZyhrZXlzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZUVsZW0udmVyaWZ5VmFsdWUoY29udGVudHNba2V5c1tpXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwW3RoaXMua2V5RWxlbS52YWx1ZVRvU3RyaW5nKGtleSldID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBrZXk6IGtleSwgdmFsdWU6IHZhbCB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIE1hcFByb3RvdHlwZSA9IE1hcC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhlbHBlcjogcmV0dXJuIGFuIGl0ZXJhdG9yIG92ZXIgYW4gYXJyYXkuXHJcbiAgICAgICAgICogQHBhcmFtIHshQXJyYXk8Kj59IGFyciB0aGUgYXJyYXlcclxuICAgICAgICAgKiBAcmV0dXJucyB7IU9iamVjdH0gYW4gaXRlcmF0b3JcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhcnJheUl0ZXJhdG9yKGFycikge1xyXG4gICAgICAgICAgICB2YXIgaWR4ID0gMDtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHggPCBhcnIubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IGFycltpZHgrK10gfTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENsZWFycyB0aGUgbWFwLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1hcCA9IHt9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlbGV0ZXMgYSBwYXJ0aWN1bGFyIGtleSBmcm9tIHRoZSBtYXAuXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgYW55IGVudHJ5IHdpdGggdGhpcyBrZXkgd2FzIGRlbGV0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlW1wiZGVsZXRlXCJdID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IHRoaXMua2V5RWxlbS52YWx1ZVRvU3RyaW5nKHRoaXMua2V5RWxlbS52ZXJpZnlWYWx1ZShrZXkpKTtcclxuICAgICAgICAgICAgdmFyIGhhZEtleSA9IGtleVZhbHVlIGluIHRoaXMubWFwO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tYXBba2V5VmFsdWVdO1xyXG4gICAgICAgICAgICByZXR1cm4gaGFkS2V5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgYW4gaXRlcmF0b3Igb3ZlciBba2V5LCB2YWx1ZV0gcGFpcnMgaW4gdGhlIG1hcC5cclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgaXRlcmF0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICBNYXBQcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZW50cmllcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgc3RyS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMubWFwKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVudHJ5OyBpIDwgc3RyS2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaChbKGVudHJ5PXRoaXMubWFwW3N0cktleXNbaV1dKS5rZXksIGVudHJ5LnZhbHVlXSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheUl0ZXJhdG9yKGVudHJpZXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgYW4gaXRlcmF0b3Igb3ZlciBrZXlzIGluIHRoZSBtYXAuXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGl0ZXJhdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHN0cktleXMgPSBPYmplY3Qua2V5cyh0aGlzLm1hcCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyS2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIGtleXMucHVzaCh0aGlzLm1hcFtzdHJLZXlzW2ldXS5rZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlJdGVyYXRvcihrZXlzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIG92ZXIgdmFsdWVzIGluIHRoZSBtYXAuXHJcbiAgICAgICAgICogQHJldHVybnMgeyFPYmplY3R9IFRoZSBpdGVyYXRvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgc3RyS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMubWFwKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJLZXlzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2godGhpcy5tYXBbc3RyS2V5c1tpXV0udmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlJdGVyYXRvcih2YWx1ZXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZXJhdGVzIG92ZXIgZW50cmllcyBpbiB0aGUgbWFwLCBjYWxsaW5nIGEgZnVuY3Rpb24gb24gZWFjaC5cclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHRoaXM6KiwgKiwgKiwgKil9IGNiIFRoZSBjYWxsYmFjayB0byBpbnZva2Ugd2l0aCB2YWx1ZSwga2V5LCBhbmQgbWFwIGFyZ3VtZW50cy5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdD19IHRoaXNBcmcgVGhlIGB0aGlzYCB2YWx1ZSBmb3IgdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYiwgdGhpc0FyZykge1xyXG4gICAgICAgICAgICB2YXIgc3RyS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMubWFwKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVudHJ5OyBpIDwgc3RyS2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIGNiLmNhbGwodGhpc0FyZywgKGVudHJ5PXRoaXMubWFwW3N0cktleXNbaV1dKS52YWx1ZSwgZW50cnkua2V5LCB0aGlzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXRzIGEga2V5IGluIHRoZSBtYXAgdG8gdGhlIGdpdmVuIHZhbHVlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXlcclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuTWFwfSBUaGUgbWFwIGluc3RhbmNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIGtleVZhbHVlID0gdGhpcy5rZXlFbGVtLnZlcmlmeVZhbHVlKGtleSk7XHJcbiAgICAgICAgICAgIHZhciB2YWxWYWx1ZSA9IHRoaXMudmFsdWVFbGVtLnZlcmlmeVZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBbdGhpcy5rZXlFbGVtLnZhbHVlVG9TdHJpbmcoa2V5VmFsdWUpXSA9XHJcbiAgICAgICAgICAgICAgICB7IGtleToga2V5VmFsdWUsIHZhbHVlOiB2YWxWYWx1ZSB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvIGEga2V5IGluIHRoZSBtYXAuXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleVxyXG4gICAgICAgICAqIEByZXR1cm5zIHsqfHVuZGVmaW5lZH0gVGhlIHZhbHVlLCBvciBgdW5kZWZpbmVkYCBpZiBrZXkgbm90IHByZXNlbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBNYXBQcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IHRoaXMua2V5RWxlbS52YWx1ZVRvU3RyaW5nKHRoaXMua2V5RWxlbS52ZXJpZnlWYWx1ZShrZXkpKTtcclxuICAgICAgICAgICAgaWYgKCEoa2V5VmFsdWUgaW4gdGhpcy5tYXApKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwW2tleVZhbHVlXS52YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGdpdmVuIGtleSBpcyBwcmVzZW50IGluIHRoZSBtYXAuXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIGtleSBpcyBwcmVzZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICB2YXIga2V5VmFsdWUgPSB0aGlzLmtleUVsZW0udmFsdWVUb1N0cmluZyh0aGlzLmtleUVsZW0udmVyaWZ5VmFsdWUoa2V5KSk7XHJcbiAgICAgICAgICAgIHJldHVybiAoa2V5VmFsdWUgaW4gdGhpcy5tYXApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBNYXA7XHJcbiAgICB9KShQcm90b0J1ZiwgUHJvdG9CdWYuUmVmbGVjdCk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSAucHJvdG8gc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBCdWlsZGVyLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3RvIC5wcm90byBmaWxlIGNvbnRlbnRzXHJcbiAgICAgKiBAcGFyYW0geyhQcm90b0J1Zi5CdWlsZGVyfHN0cmluZ3x7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9KT19IGJ1aWxkZXIgQnVpbGRlciB0byBhcHBlbmQgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBpZiBvbWl0dGVkLlxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfHtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ30pPX0gZmlsZW5hbWUgVGhlIGNvcnJlc3BvbmRpbmcgZmlsZSBuYW1lIGlmIGtub3duLiBNdXN0IGJlIHNwZWNpZmllZCBmb3IgaW1wb3J0cy5cclxuICAgICAqIEByZXR1cm4ge1Byb3RvQnVmLkJ1aWxkZXJ9IEJ1aWxkZXIgdG8gY3JlYXRlIG5ldyBtZXNzYWdlc1xyXG4gICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkZWZpbml0aW9uIGNhbm5vdCBiZSBwYXJzZWQgb3IgYnVpbHRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYubG9hZFByb3RvID0gZnVuY3Rpb24ocHJvdG8sIGJ1aWxkZXIsIGZpbGVuYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBidWlsZGVyID09PSAnc3RyaW5nJyB8fCAoYnVpbGRlciAmJiB0eXBlb2YgYnVpbGRlcltcImZpbGVcIl0gPT09ICdzdHJpbmcnICYmIHR5cGVvZiBidWlsZGVyW1wicm9vdFwiXSA9PT0gJ3N0cmluZycpKVxyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGJ1aWxkZXIsXHJcbiAgICAgICAgICAgIGJ1aWxkZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIFByb3RvQnVmLmxvYWRKc29uKFByb3RvQnVmLkRvdFByb3RvLlBhcnNlci5wYXJzZShwcm90byksIGJ1aWxkZXIsIGZpbGVuYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIC5wcm90byBzdHJpbmcgYW5kIHJldHVybnMgdGhlIEJ1aWxkZXIuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIFByb3RvQnVmLmxvYWRQcm90b30uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm90byAucHJvdG8gZmlsZSBjb250ZW50c1xyXG4gICAgICogQHBhcmFtIHsoUHJvdG9CdWYuQnVpbGRlcnxzdHJpbmcpPX0gYnVpbGRlciBCdWlsZGVyIHRvIGFwcGVuZCB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGlmIG9taXR0ZWQuXHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8e3Jvb3Q6IHN0cmluZywgZmlsZTogc3RyaW5nfSk9fSBmaWxlbmFtZSBUaGUgY29ycmVzcG9uZGluZyBmaWxlIG5hbWUgaWYga25vd24uIE11c3QgYmUgc3BlY2lmaWVkIGZvciBpbXBvcnRzLlxyXG4gICAgICogQHJldHVybiB7UHJvdG9CdWYuQnVpbGRlcn0gQnVpbGRlciB0byBjcmVhdGUgbmV3IG1lc3NhZ2VzXHJcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGRlZmluaXRpb24gY2Fubm90IGJlIHBhcnNlZCBvciBidWlsdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5wcm90b0Zyb21TdHJpbmcgPSBQcm90b0J1Zi5sb2FkUHJvdG87IC8vIExlZ2FjeVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSAucHJvdG8gZmlsZSBhbmQgcmV0dXJucyB0aGUgQnVpbGRlci5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfHtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ319IGZpbGVuYW1lIFBhdGggdG8gcHJvdG8gZmlsZSBvciBhbiBvYmplY3Qgc3BlY2lmeWluZyAnZmlsZScgd2l0aFxyXG4gICAgICogIGFuIG92ZXJyaWRkZW4gJ3Jvb3QnIHBhdGggZm9yIGFsbCBpbXBvcnRlZCBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oP0Vycm9yLCAhUHJvdG9CdWYuQnVpbGRlcj0pPX0gY2FsbGJhY2sgQ2FsbGJhY2sgdGhhdCB3aWxsIHJlY2VpdmUgYG51bGxgIGFzIHRoZSBmaXJzdCBhbmRcclxuICAgICAqICB0aGUgQnVpbGRlciBhcyBpdHMgc2Vjb25kIGFyZ3VtZW50IG9uIHN1Y2Nlc3MsIG90aGVyd2lzZSB0aGUgZXJyb3IgYXMgaXRzIGZpcnN0IGFyZ3VtZW50LiBJZiBvbWl0dGVkLCB0aGVcclxuICAgICAqICBmaWxlIHdpbGwgYmUgcmVhZCBzeW5jaHJvbm91c2x5IGFuZCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBCdWlsZGVyLlxyXG4gICAgICogQHBhcmFtIHtQcm90b0J1Zi5CdWlsZGVyPX0gYnVpbGRlciBCdWlsZGVyIHRvIGFwcGVuZCB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGlmIG9taXR0ZWQuXHJcbiAgICAgKiBAcmV0dXJuIHs/UHJvdG9CdWYuQnVpbGRlcnx1bmRlZmluZWR9IFRoZSBCdWlsZGVyIGlmIHN5bmNocm9ub3VzIChubyBjYWxsYmFjayBzcGVjaWZpZWQsIHdpbGwgYmUgTlVMTCBpZiB0aGVcclxuICAgICAqICAgcmVxdWVzdCBoYXMgZmFpbGVkKSwgZWxzZSB1bmRlZmluZWRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYubG9hZFByb3RvRmlsZSA9IGZ1bmN0aW9uKGZpbGVuYW1lLCBjYWxsYmFjaywgYnVpbGRlcikge1xyXG4gICAgICAgIGlmIChjYWxsYmFjayAmJiB0eXBlb2YgY2FsbGJhY2sgPT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICBidWlsZGVyID0gY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICBlbHNlIGlmICghY2FsbGJhY2sgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICBjYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxyXG4gICAgICAgICAgICByZXR1cm4gUHJvdG9CdWYuVXRpbC5mZXRjaCh0eXBlb2YgZmlsZW5hbWUgPT09ICdzdHJpbmcnID8gZmlsZW5hbWUgOiBmaWxlbmFtZVtcInJvb3RcIl0rXCIvXCIrZmlsZW5hbWVbXCJmaWxlXCJdLCBmdW5jdGlvbihjb250ZW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soRXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggZmlsZVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBQcm90b0J1Zi5sb2FkUHJvdG8oY29udGVudHMsIGJ1aWxkZXIsIGZpbGVuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBjb250ZW50cyA9IFByb3RvQnVmLlV0aWwuZmV0Y2godHlwZW9mIGZpbGVuYW1lID09PSAnb2JqZWN0JyA/IGZpbGVuYW1lW1wicm9vdFwiXStcIi9cIitmaWxlbmFtZVtcImZpbGVcIl0gOiBmaWxlbmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRzID09PSBudWxsID8gbnVsbCA6IFByb3RvQnVmLmxvYWRQcm90byhjb250ZW50cywgYnVpbGRlciwgZmlsZW5hbWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgLnByb3RvIGZpbGUgYW5kIHJldHVybnMgdGhlIEJ1aWxkZXIuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIFByb3RvQnVmLmxvYWRQcm90b0ZpbGV9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3x7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9fSBmaWxlbmFtZSBQYXRoIHRvIHByb3RvIGZpbGUgb3IgYW4gb2JqZWN0IHNwZWNpZnlpbmcgJ2ZpbGUnIHdpdGhcclxuICAgICAqICBhbiBvdmVycmlkZGVuICdyb290JyBwYXRoIGZvciBhbGwgaW1wb3J0ZWQgZmlsZXMuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKD9FcnJvciwgIVByb3RvQnVmLkJ1aWxkZXI9KT19IGNhbGxiYWNrIENhbGxiYWNrIHRoYXQgd2lsbCByZWNlaXZlIGBudWxsYCBhcyB0aGUgZmlyc3QgYW5kXHJcbiAgICAgKiAgdGhlIEJ1aWxkZXIgYXMgaXRzIHNlY29uZCBhcmd1bWVudCBvbiBzdWNjZXNzLCBvdGhlcndpc2UgdGhlIGVycm9yIGFzIGl0cyBmaXJzdCBhcmd1bWVudC4gSWYgb21pdHRlZCwgdGhlXHJcbiAgICAgKiAgZmlsZSB3aWxsIGJlIHJlYWQgc3luY2hyb25vdXNseSBhbmQgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgQnVpbGRlci5cclxuICAgICAqIEBwYXJhbSB7UHJvdG9CdWYuQnVpbGRlcj19IGJ1aWxkZXIgQnVpbGRlciB0byBhcHBlbmQgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBpZiBvbWl0dGVkLlxyXG4gICAgICogQHJldHVybiB7IVByb3RvQnVmLkJ1aWxkZXJ8dW5kZWZpbmVkfSBUaGUgQnVpbGRlciBpZiBzeW5jaHJvbm91cyAobm8gY2FsbGJhY2sgc3BlY2lmaWVkLCB3aWxsIGJlIE5VTEwgaWYgdGhlXHJcbiAgICAgKiAgIHJlcXVlc3QgaGFzIGZhaWxlZCksIGVsc2UgdW5kZWZpbmVkXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLnByb3RvRnJvbUZpbGUgPSBQcm90b0J1Zi5sb2FkUHJvdG9GaWxlOyAvLyBMZWdhY3lcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGVtcHR5IEJ1aWxkZXIuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBCdWlsZGVyIG9wdGlvbnMsIGRlZmF1bHRzIHRvIGdsb2JhbCBvcHRpb25zIHNldCBvbiBQcm90b0J1ZlxyXG4gICAgICogQHJldHVybiB7IVByb3RvQnVmLkJ1aWxkZXJ9IEJ1aWxkZXJcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYubmV3QnVpbGRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnNbJ2NvbnZlcnRGaWVsZHNUb0NhbWVsQ2FzZSddID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgb3B0aW9uc1snY29udmVydEZpZWxkc1RvQ2FtZWxDYXNlJ10gPSBQcm90b0J1Zi5jb252ZXJ0RmllbGRzVG9DYW1lbENhc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zWydwb3B1bGF0ZUFjY2Vzc29ycyddID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgb3B0aW9uc1sncG9wdWxhdGVBY2Nlc3NvcnMnXSA9IFByb3RvQnVmLnBvcHVsYXRlQWNjZXNzb3JzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvdG9CdWYuQnVpbGRlcihvcHRpb25zKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIC5qc29uIGRlZmluaXRpb24gYW5kIHJldHVybnMgdGhlIEJ1aWxkZXIuXHJcbiAgICAgKiBAcGFyYW0geyEqfHN0cmluZ30ganNvbiBKU09OIGRlZmluaXRpb25cclxuICAgICAqIEBwYXJhbSB7KFByb3RvQnVmLkJ1aWxkZXJ8c3RyaW5nfHtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ30pPX0gYnVpbGRlciBCdWlsZGVyIHRvIGFwcGVuZCB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGlmIG9taXR0ZWQuXHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8e3Jvb3Q6IHN0cmluZywgZmlsZTogc3RyaW5nfSk9fSBmaWxlbmFtZSBUaGUgY29ycmVzcG9uZGluZyBmaWxlIG5hbWUgaWYga25vd24uIE11c3QgYmUgc3BlY2lmaWVkIGZvciBpbXBvcnRzLlxyXG4gICAgICogQHJldHVybiB7UHJvdG9CdWYuQnVpbGRlcn0gQnVpbGRlciB0byBjcmVhdGUgbmV3IG1lc3NhZ2VzXHJcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGRlZmluaXRpb24gY2Fubm90IGJlIHBhcnNlZCBvciBidWlsdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5sb2FkSnNvbiA9IGZ1bmN0aW9uKGpzb24sIGJ1aWxkZXIsIGZpbGVuYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBidWlsZGVyID09PSAnc3RyaW5nJyB8fCAoYnVpbGRlciAmJiB0eXBlb2YgYnVpbGRlcltcImZpbGVcIl0gPT09ICdzdHJpbmcnICYmIHR5cGVvZiBidWlsZGVyW1wicm9vdFwiXSA9PT0gJ3N0cmluZycpKVxyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGJ1aWxkZXIsXHJcbiAgICAgICAgICAgIGJ1aWxkZXIgPSBudWxsO1xyXG4gICAgICAgIGlmICghYnVpbGRlciB8fCB0eXBlb2YgYnVpbGRlciAhPT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgIGJ1aWxkZXIgPSBQcm90b0J1Zi5uZXdCdWlsZGVyKCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAganNvbiA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgYnVpbGRlcltcImltcG9ydFwiXShqc29uLCBmaWxlbmFtZSk7XHJcbiAgICAgICAgYnVpbGRlci5yZXNvbHZlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSAuanNvbiBmaWxlIGFuZCByZXR1cm5zIHRoZSBCdWlsZGVyLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8IXtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ319IGZpbGVuYW1lIFBhdGggdG8ganNvbiBmaWxlIG9yIGFuIG9iamVjdCBzcGVjaWZ5aW5nICdmaWxlJyB3aXRoXHJcbiAgICAgKiAgYW4gb3ZlcnJpZGRlbiAncm9vdCcgcGF0aCBmb3IgYWxsIGltcG9ydGVkIGZpbGVzLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbig/RXJyb3IsICFQcm90b0J1Zi5CdWlsZGVyPSk9fSBjYWxsYmFjayBDYWxsYmFjayB0aGF0IHdpbGwgcmVjZWl2ZSBgbnVsbGAgYXMgdGhlIGZpcnN0IGFuZFxyXG4gICAgICogIHRoZSBCdWlsZGVyIGFzIGl0cyBzZWNvbmQgYXJndW1lbnQgb24gc3VjY2Vzcywgb3RoZXJ3aXNlIHRoZSBlcnJvciBhcyBpdHMgZmlyc3QgYXJndW1lbnQuIElmIG9taXR0ZWQsIHRoZVxyXG4gICAgICogIGZpbGUgd2lsbCBiZSByZWFkIHN5bmNocm9ub3VzbHkgYW5kIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIEJ1aWxkZXIuXHJcbiAgICAgKiBAcGFyYW0ge1Byb3RvQnVmLkJ1aWxkZXI9fSBidWlsZGVyIEJ1aWxkZXIgdG8gYXBwZW5kIHRvLiBXaWxsIGNyZWF0ZSBhIG5ldyBvbmUgaWYgb21pdHRlZC5cclxuICAgICAqIEByZXR1cm4gez9Qcm90b0J1Zi5CdWlsZGVyfHVuZGVmaW5lZH0gVGhlIEJ1aWxkZXIgaWYgc3luY2hyb25vdXMgKG5vIGNhbGxiYWNrIHNwZWNpZmllZCwgd2lsbCBiZSBOVUxMIGlmIHRoZVxyXG4gICAgICogICByZXF1ZXN0IGhhcyBmYWlsZWQpLCBlbHNlIHVuZGVmaW5lZFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5sb2FkSnNvbkZpbGUgPSBmdW5jdGlvbihmaWxlbmFtZSwgY2FsbGJhY2ssIGJ1aWxkZXIpIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2sgJiYgdHlwZW9mIGNhbGxiYWNrID09PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgYnVpbGRlciA9IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBjYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgZWxzZSBpZiAoIWNhbGxiYWNrIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgcmV0dXJuIFByb3RvQnVmLlV0aWwuZmV0Y2godHlwZW9mIGZpbGVuYW1lID09PSAnc3RyaW5nJyA/IGZpbGVuYW1lIDogZmlsZW5hbWVbXCJyb290XCJdK1wiL1wiK2ZpbGVuYW1lW1wiZmlsZVwiXSwgZnVuY3Rpb24oY29udGVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZW50cyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKEVycm9yKFwiRmFpbGVkIHRvIGZldGNoIGZpbGVcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgUHJvdG9CdWYubG9hZEpzb24oSlNPTi5wYXJzZShjb250ZW50cyksIGJ1aWxkZXIsIGZpbGVuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBjb250ZW50cyA9IFByb3RvQnVmLlV0aWwuZmV0Y2godHlwZW9mIGZpbGVuYW1lID09PSAnb2JqZWN0JyA/IGZpbGVuYW1lW1wicm9vdFwiXStcIi9cIitmaWxlbmFtZVtcImZpbGVcIl0gOiBmaWxlbmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRzID09PSBudWxsID8gbnVsbCA6IFByb3RvQnVmLmxvYWRKc29uKEpTT04ucGFyc2UoY29udGVudHMpLCBidWlsZGVyLCBmaWxlbmFtZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBQcm90b0J1ZjtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=