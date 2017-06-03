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

},{}],"CardMoveEvent":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e54abXhmzNCsJ+pA9pty28+', 'CardMoveEvent');
// Scripts\Gui\CardMoveEvent.js

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

        parentNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onAnimCompleted: function onAnimCompleted(num) {
        this.parentNode.getComponent("UIPokerShuffle").onAnimCompleted(num);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
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
},{}],"MainGame":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0975fZx1UJEDqmd0lBtMyYs', 'MainGame');
// Scripts\Gui\MainGame.js

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
    onLoad: function onLoad() {}

});

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
},{"bytebuffer":"bytebuffer","long":"long","protobuf":"protobuf"}],"PokerSelect":[function(require,module,exports){
"use strict";
cc._RF.push(module, '3b47a4kgtxMBrjGDVwvwKDi', 'PokerSelect');
// Scripts\Gui\PokerSelect.js

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
        _isSelected: false,
        _dispatcher: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
            this.node.on(cc.Node.EventType.TOUCH_START, this._onSelect);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onSelect);
            this.node.on(cc.Node.EventType.TOUCH_END, this._onSelect);
        } else {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this._onSelect);
            // this.node.on(cc.Node.EventType.MOUSE_MOVE, this._onSelect);
        }
    },

    _onSelect: function _onSelect(event) {
        //console.log([event, event.type, typeof(event.target), typeof(event.currentTarget)]);
        var component = event.currentTarget.getComponent("PokerSelect");
        if (!component._isSelected) {
            event.currentTarget.runAction(cc.moveBy(0.06, cc.p(0, 20)));
            component._isSelected = true;
        } else {
            event.currentTarget.runAction(cc.moveBy(0.06, cc.p(0, -20)));
            component._isSelected = false;
        }
    }

});

cc._RF.pop();
},{}],"PokerSort":[function(require,module,exports){
"use strict";
cc._RF.push(module, '60027OfYfZM9aft31kToOk+', 'PokerSort');
// Scripts\Gui\PokerSort.js

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
        pokerSelectPrefab: cc.Prefab,

        _pokerList: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initPokers();
    },

    initPokers: function initPokers() {
        this._pokerList = [];
        for (var i = 0; i < 13; ++i) {
            var selectPoker = cc.instantiate(this.pokerSelectPrefab);
            selectPoker.getComponent("PokerSelect")._dispatcher = this.parent;
            selectPoker.parent = this.node;
            selectPoker.position = cc.v2(i * 60 - 360, -182);
            this._pokerList.push(selectPoker);
        }
    }

});

cc._RF.pop();
},{}],"SceneManager":[function(require,module,exports){
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
    },

    onClick_btnSetting: function onClick_btnSetting() {
        cc.guimanager.open('UISetting');
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
},{}],"UIPokerShuffle":[function(require,module,exports){
"use strict";
cc._RF.push(module, '663f4GkXdFOZILOqkauFXod', 'UIPokerShuffle');
// Scripts\Gui\UIPokerShuffle.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        originPoker: cc.Node,
        movePoker: cc.Node,
        prefabHeadIcon: cc.Prefab,
        prefabPokerSort: cc.Prefab,

        _pokerList: null,
        _headIcons: null,
        _curShuffleIdx: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._pokerList = [];
        this._pokerList.push(cc.find("PokerShuffle/Pokers/myPokerList"));
        this._pokerList.push(cc.find("PokerShuffle/Pokers/PokerList2"));
        this._pokerList.push(cc.find("PokerShuffle/Pokers/PokerList3"));
        this._pokerList.push(cc.find("PokerShuffle/Pokers/PokerList4"));

        this.node.on("test_test", function (data) {
            console.log("test_test");
        });
    },

    initRoom: function initRoom(playerNum) {},

    _initHeadPosition: function _initHeadPosition(playerNum) {
        this.headIcons = [];
        var headParent = cc.find("PokerShuffle/heads");
        if (playerNum == 2) {
            var head = cc.instantiate(this.prefabHeadIcon);
            this.headIcons.push(head);
            head.position = cc.position();
        }
    },

    clickStartBtn: function clickStartBtn() {
        this.originPoker.active = true;
        this.movePoker.active = true;
        this.movePoker.getComponent(cc.Animation).play();
        cc.find("PokerShuffle/startBtn").active = false;

        var pokerSort = cc.instantiate(this.prefabPokerSort);
        pokerSort.parent = this.node;
        pokerSort.position = cc.v2(0, 0);
    },

    //发牌event
    onAnimCompleted: function onAnimCompleted(index) {
        if (index < 1 || index > 4) {
            return;
        }
        //console.log([index, this._curShuffleIdx, this._pokerList[index-1].childrenCount ]);
        if (index == 2) {
            this._pokerList[index - 1].children[12 - this._curShuffleIdx].active = true;
        } else {
            this._pokerList[index - 1].children[this._curShuffleIdx].active = true;
        }

        if (index == 4) {
            this._curShuffleIdx++;
            this.movePoker.getComponent(cc.Animation).play();
        }
        if (this._curShuffleIdx >= 12) {
            this.movePoker.getComponent(cc.Animation).stop();
            this.movePoker.active = false;
            this.originPoker.active = false;

            //cc.director.getScheduler().schedule(function(){
            //var pokerSort = cc.instantiate(this.prefabPokerSort);
            //pokerSort.parent = this;
            //}, this, 2, 1, 0, false);
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"UISetting":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f67d7lo/1dD4IGPp1qXvxwc', 'UISetting');
// Scripts\Gui\UISetting.js

"use strict";

cc.Class({
   extends: cc.uipanel

});

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

'use strict';

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
        cc.log('onload');
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

},{"_process":2,"bytebuffer":"bytebuffer","fs":undefined,"path":1}]},{},["CardMoveEvent","MainGame","PokerSelect","PokerSort","UIJoinRoom","UILogin","UIMain","UINotice","UIPanel","UIPokerShuffle","UISetting","bytebuffer","long","protobuf","AudioMgr","DataManager","GameManager","GuiManager","NetManager","SceneManager","init"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvQXVkaW9NZ3IuanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvQ2FyZE1vdmVFdmVudC5qcyIsImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvRGF0YU1hbmFnZXIuanMiLCJhc3NldHMvU2NyaXB0cy9NYW5hZ2VyL0dhbWVNYW5hZ2VyLmpzIiwiYXNzZXRzL1NjcmlwdHMvTWFuYWdlci9HdWlNYW5hZ2VyLmpzIiwiYXNzZXRzL1NjcmlwdHMvR3VpL01haW5HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdHMvTWFuYWdlci9OZXRNYW5hZ2VyLmpzIiwiYXNzZXRzL1NjcmlwdHMvR3VpL1Bva2VyU2VsZWN0LmpzIiwiYXNzZXRzL1NjcmlwdHMvR3VpL1Bva2VyU29ydC5qcyIsImFzc2V0cy9TY3JpcHRzL01hbmFnZXIvU2NlbmVNYW5hZ2VyLmpzIiwiYXNzZXRzL1NjcmlwdHMvR3VpL1VJSm9pblJvb20uanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvVUlMb2dpbi5qcyIsImFzc2V0cy9TY3JpcHRzL0d1aS9VSU1haW4uanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvVUlOb3RpY2UuanMiLCJhc3NldHMvU2NyaXB0cy9HdWkvVUlQYW5lbC5qcyIsImFzc2V0cy9TY3JpcHRzL0d1aS9VSVBva2VyU2h1ZmZsZS5qcyIsImFzc2V0cy9TY3JpcHRzL0d1aS9VSVNldHRpbmcuanMiLCJhc3NldHMvU2NyaXB0cy9MaWIvYnl0ZWJ1ZmZlci5qcyIsImFzc2V0cy9TY3JpcHRzL2luaXQuanMiLCJhc3NldHMvU2NyaXB0cy9MaWIvbG9uZy5qcyIsImFzc2V0cy9TY3JpcHRzL0xpYi9wcm90b2J1Zi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBYlE7O0FBZ0JaO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQW5GSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFaUTs7QUFlWjtBQUNBOztBQUlBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBOUJLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBOztBQWpCYTs7QUEyQmpCOzs7Ozs7Ozs7O0FDNUJBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTs7QUFqQmE7O0FBMkJqQjs7Ozs7Ozs7OztBQzNCQTs7QUFFSTtBQUNJO0FBQ0g7O0FBRUY7QUFDSztBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0o7QUFDTDs7QUFFRDtBQUNDO0FBQ0E7QUFDSTtBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFJSTtBQUNIOztBQUVEO0FBQ0E7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEOztBQUVEO0FBQ0s7QUFDQTtBQUNKOztBQUVEO0FBQ0M7QUFDSTtBQUNBO0FBQ0k7QUFFSTtBQUNBO0FBQ0E7QUFDSDtBQU5MO0FBT0M7QUFDSjs7QUFFRjtBQUNLO0FBQ0E7QUFFSTtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0w7O0FBRUQ7QUFDQztBQUNJO0FBQ0E7QUFFSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBNUZhO0FBOEZqQjs7Ozs7Ozs7OztBQy9GQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBOztBQWpCSzs7Ozs7Ozs7OztBQ0NUO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEOztBQUVFO0FBQ0E7QUFDQTtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRDtBQUNJO0FBQ0Q7QUFDRztBQUNBO0FBQ0Y7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDRTtBQUNBO0FBQ0U7QUFDRDtBQUNGOztBQUVEO0FBQ0U7QUFDRDs7QUFFRDtBQUNJOztBQUdBO0FBQ0U7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFJQztBQUNEO0FBQ0k7QUFDRjtBQUNEO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFFRTtBQUNBO0FBQ0Q7QUFDSjs7QUFFRDtBQUNBO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVFO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0U7QUFDQTtBQUVFO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBO0FBQ0U7QUFFRTtBQUNBO0FBQ0Q7QUFDRjs7QUFFRDtBQUNFO0FBQ0E7QUFFSTtBQUNIO0FBQ0Y7QUE3SFk7QUErSGpCOzs7Ozs7Ozs7O0FDaElBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaUTs7QUFlWjtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0Q7QUFDRjtBQUNKOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBRUo7O0FBekNJOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFiUTs7QUFnQlo7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7O0FBakNJOzs7Ozs7Ozs7O0FDQVQ7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFqQlk7O0FBb0JqQjs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0k7O0FBRUE7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUpTOztBQU9aO0FBQ0k7QUFDQTtBQUVJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFFSTtBQUVJO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0c7QUFDQTtBQUNBO0FBRUs7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUVNO0FBQ0w7QUFHRztBQUNIO0FBR0c7QUFDSDtBQUVGO0FBQ0w7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUEvSEs7Ozs7Ozs7Ozs7QUNEVDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBRlE7O0FBS1o7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDSztBQUNBO0FBQ0Q7QUFDRztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0M7QUFDRDtBQUNKOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFqRkk7Ozs7Ozs7Ozs7QUNEVDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUpROztBQU9aO0FBQ0E7O0FBSUE7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDRztBQUNGOztBQUVEOztBQUlBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFQTtBQXhDSzs7Ozs7Ozs7OztBQ0RUO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBRFE7O0FBSVo7QUFDQTs7QUFJQTtBQUNRO0FBQ0g7O0FBRUw7QUFDQTs7QUFFQTtBQW5CSzs7Ozs7Ozs7OztBQ0RUO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUdHO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0k7QUFFSTtBQUNIO0FBQ0o7O0FBRUQ7O0FBSUE7O0FBSUE7QUFDSTtBQUNIO0FBbERpQjtBQW9EekI7Ozs7Ozs7Ozs7QUN2REQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQVJROztBQVdaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSDtBQUNKOztBQUVEOztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSjtBQUNIO0FBQ0o7O0FBSUQ7QUFDQTs7QUFFQTtBQXJGSzs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBREs7Ozs7Ozs7Ozs7OztBQ0FUOzs7Ozs7QUFNQTtBQUFlO0FBQW9KO0FBQUE7QUFBbUI7QUFBa0I7QUFBNkI7QUFBMkQ7QUFBbUI7QUFBYztBQUEwQjtBQUF5QztBQUFDO0FBQWE7QUFBQTtBQUFnQztBQUNqVjtBQUFDO0FBQXNCO0FBQWdCO0FBQUE7QUFBcUM7QUFBdUs7QUFBOEQ7QUFBaUM7QUFBd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMvWjtBQUEwYTtBQUFzQjtBQUN4VztBQUE2RDtBQUE0SztBQUNqUTtBQUFxRTtBQUFrQjtBQUE0QjtBQUFvQjtBQUE0QjtBQUFtRztBQUFyQztBQUN0VTtBQUR3ZTtBQUM1VjtBQUE0QjtBQUFtQztBQUFtQjtBQUFtQjtBQUEwQjtBQUEwSDtBQUFvQztBQUFvQztBQUFxQztBQUN6ZTtBQUFnQztBQUNnSDtBQUE5RDtBQUE2SDtBQUE2QjtBQUFtRTtBQUN4TjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW9FO0FBQXBDO0FBQStMO0FBQWU7QUFBZjtBQUEwRDtBQUFrQztBQUEwQjtBQUFnRDtBQUFBO0FBQUE7QUFBQTtBQUM3YjtBQUFyQjtBQUFnTjtBQUFsQztBQUFrRjtBQUEyQjtBQUFtRTtBQUM3VTtBQUFxRDtBQUFpRDtBQUFtRTtBQUNuTjtBQUFrSDtBQUFnRDtBQUFtRTtBQUFvTjtBQUM5YTtBQUFrRDtBQUFtRTtBQUFvVDtBQUNyYjtBQUFpRDtBQUFtRDtBQUFtRTtBQUFvTjtBQUE0QztBQUFvRDtBQUMzZDtBQUFzQztBQUFrVDtBQUNoUztBQUFtRDtBQUFtRTtBQUFvTjtBQUNwVjtBQUFxRDtBQUFtRTtBQUFvVDtBQUMxZDtBQUEwTDtBQUFzRDtBQUFtRTtBQUNsVDtBQUFtSTtBQUFzRDtBQUFtRTtBQUN0TjtBQUE0VDtBQUFpRDtBQUFtRTtBQUNqUztBQUFxTztBQUFtRDtBQUM5YztBQUFtQjtBQUFvVDtBQUM5TDtBQUFzRDtBQUFtRTtBQUFvTjtBQUM1UjtBQUEwRDtBQUFtRTtBQUNqSDtBQUFxSjtBQUNsQztBQUFrRDtBQUFtRTtBQUM5YTtBQUEwSDtBQUFBO0FBQzFIO0FBQTZDO0FBQW9EO0FBQW1FO0FBQzdIO0FBQXFKO0FBQ2pDO0FBQXNEO0FBQW1FO0FBQW9OO0FBQUE7QUFDN0Y7QUFBeUQ7QUFBbUU7QUFDblA7QUFBMkk7QUFBdUQ7QUFDbmI7QUFBb047QUFBcUU7QUFBd0Q7QUFBbUU7QUFDdmI7QUFBb047QUFBMkk7QUFBd0Q7QUFBbUU7QUFDbFM7QUFBcUU7QUFBbUY7QUFBNEQ7QUFBOEI7QUFBNEI7QUFBOEI7QUFDL2Q7QUFBK0I7QUFBbUU7QUFBa1Q7QUFBQTtBQUN6WjtBQUF3QjtBQUFuQjtBQUF3RztBQUFxQztBQUFpRDtBQUE0QjtBQUFtRTtBQUNqUztBQUFBO0FBQUE7QUFBaUI7QUFBd0g7QUFBc0U7QUFBa0M7QUFBNEc7QUFBNkQ7QUFBK0U7QUFDOVQ7QUFBOEI7QUFBNks7QUFBOEI7QUFDcFQ7QUFBK0I7QUFBbUU7QUFDNUo7QUFBb0g7QUFBQTtBQUFBO0FBQW1OO0FBQThCO0FBQXdDO0FBQWtEO0FBQ25jO0FBQWdEO0FBQXdDO0FBQWtEO0FBQWtEO0FBQWdEO0FBQWdFO0FBQXFDO0FBQWlEO0FBQTRCO0FBQW1FO0FBQzlUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTVJO0FBQWtDO0FBQWdIO0FBQStCO0FBQWdEO0FBQW9DO0FBQW9GO0FBQWhCO0FBQ3ZNO0FBQTZJO0FBQWlCO0FBQThEO0FBQTJCO0FBQW1FO0FBQ2hUO0FBQUE7QUFBQTtBQUE4QztBQUFrSjtBQUEyRTtBQUE4QjtBQUNsYjtBQUF3UjtBQUFBO0FBQ3BIO0FBQWlCO0FBQWlJO0FBQTJCO0FBQW1FO0FBQ2hVO0FBQUE7QUFBQTtBQUFzSjtBQUF5RTtBQUFtRTtBQUNsUztBQUFBO0FBQXVKO0FBQWlCO0FBQStDO0FBQWtFO0FBQXVDO0FBQWtDO0FBQXVDO0FBQzFoQjtBQUF3RTtBQUFtSjtBQUNsTTtBQUFBO0FBQUE7QUFBc0M7QUFBOEI7QUFBNkM7QUFBd0I7QUFBdUI7QUFBK0g7QUFBd0I7QUFBbUI7QUFDeFQ7QUFBeUM7QUFBK0I7QUFBOEo7QUFBNEM7QUFBNEQ7QUFBbUU7QUFDNWI7QUFBb047QUFBQTtBQUFBO0FBQStOO0FBQWlCO0FBQ2haO0FBQTJCO0FBQW1FO0FBQW9OO0FBQUE7QUFBQTtBQUN0VztBQUFZO0FBQTBCO0FBQTRIO0FBQW9OO0FBQzNRO0FBQTBCO0FBQTZCO0FBQXNCO0FBQTZCO0FBQXVCO0FBQThCO0FBQW9CO0FBQWlGO0FBQXFCO0FBQzFRO0FBQXlCO0FBQWtHO0FBQ25OO0FBQW1MO0FBQTBMO0FBQXNCO0FBQWtHO0FBQzlPO0FBQXlEO0FBQStJO0FBQzFkO0FBQ1A7QUFBdUY7QUFBOEI7QUFBdUU7QUFBd0I7QUFBdU07QUFDbEg7QUFBOEI7QUFBVjtBQUEwRDtBQUFtQjtBQUFpRDtBQUFvQjtBQUMvYztBQUFtQjtBQUFvTjtBQUFnQztBQUFxQjtBQUFpSTtBQUFrQjtBQUE0RDtBQUFrQjtBQUNwZDtBQUEyQjtBQUE0SDtBQUFvTjtBQUF5RjtBQUFBO0FBQ3ZUO0FBQXVJO0FBQTJCO0FBQThCO0FBQTBCO0FBQzlYO0FBQXdCO0FBQThCO0FBQW9CO0FBQW9HO0FBQXNCO0FBQW1CO0FBQXVKO0FBQTZCO0FBQXdGO0FBQVk7QUFDamdCO0FBQXdCO0FBQWtHO0FBQXVTO0FBQXVGO0FBQ3hmO0FBQW1CO0FBQW1CO0FBQStGO0FBQTZMO0FBQXVCO0FBQWtHO0FBQzNiO0FBQXNOO0FBQWlEO0FBQXdCO0FBQUE7QUFBa0Q7QUFDalY7QUFBZ0k7QUFBcUw7QUFBdUQ7QUFDOVM7QUFBc0M7QUFBcUM7QUFBcUM7QUFBdUM7QUFBcUM7QUFBZ0M7QUFBMEM7QUFBa0I7QUFDalA7QUFEaVA7QUFDaE47QUFBNEI7QUFBNUI7QUFBOE07QUFBd0I7QUFBYztBQUEyQztBQUE4QjtBQUN2WDtBQUF5RztBQUE2RTtBQUFDO0FBRGtLO0FBQ2pLO0FBQW9CO0FBQUE7QUFBaUY7QUFBVTtBQUE0QjtBQUNsVjtBQUErQjtBQUE4QjtBQUE0QjtBQUE4QztBQUEwRDtBQUFjO0FBQXFCO0FBQW9CO0FBQWtDO0FBQW9CO0FBQWtDO0FBQTBCO0FBQ3ZhO0FBQWlIO0FBQXZCO0FBQXVLO0FBQTRCO0FBQTBGO0FBQW1GO0FBQW1CO0FBQXVCO0FBQ2pjO0FBQW1MO0FBQWtCO0FBQWxCO0FBQTRDO0FBQTROO0FBQzNlO0FBQWtCO0FBQWxCO0FBQXFDO0FBQWE7QUFBNkI7QUFBdUY7QUFBaUM7QUFBTztBQUFZO0FBQVc7QUFBUztBQUFzRDtBQUFPO0FBQVM7QUFBVztBQUFPO0FBQXVDO0FBQU87QUFBUztBQUFXO0FBQU87QUFBOEM7QUFBTztBQUFNO0FBQVc7QUFBSztBQUErQjtBQUFPO0FBQ2hnQjtBQUFXO0FBQU87QUFBNkM7QUFBTztBQUFNO0FBQVc7QUFBSztBQUE4QjtBQUFPO0FBQU07QUFBVztBQUFLO0FBQXFDO0FBQW1CO0FBQVU7QUFBVztBQUFzTTtBQUFPO0FBQ3BiO0FBQTZHO0FBQVM7QUFBdUI7QUFBZ0c7QUFDcE47QUFBNEI7QUFBNUI7QUFBc0g7QUFBMkI7QUFBTztBQUFrSjtBQUE0RDtBQUMvWDtBQUFjO0FBQW1CO0FBQWtCO0FBQXNEO0FBQWtEO0FBQVk7QUFBaUM7QUFBL0I7QUFBbUs7QUFBMEI7QUFBOEI7QUFBa0c7QUFBaUI7QUFBako7QUFDWjtBQUEyQjtBQUE0QztBQUE1QztBQUN6VjtBQUEyQjtBQUFrRDtBQUFZO0FBQWlDO0FBQS9CO0FBQWdHO0FBQWlDO0FBQTRCO0FBQWtCO0FBQUU7QUFBaUM7QUFBMkI7QUFBbUI7QUFBRTtBQUFnQztBQUFvQztBQUEyQjtBQUE4QjtBQUE5QjtBQUNsYjtBQUFrQztBQUFBO0FBQXdDO0FBQW9DO0FBQWM7QUFBVztBQUEwQjtBQUFrRztBQUM5UDtBQUFVO0FBQStCO0FBQStCO0FBQW1CO0FBQVM7QUFBeUU7QUFBVztBQUE0QjtBQUF3RTtBQUE2RjtBQUFjO0FBQXFCO0FBQVU7Ozs7Ozs7Ozs7QUM1RmpkO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQXRCSTs7Ozs7Ozs7Ozs7O0FDQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBOzs7OztBQUtBOztBQUVJO0FBRUE7QUFFQTtBQUdIO0FBQ0c7O0FBRUE7Ozs7Ozs7Ozs7O0FBVUE7O0FBRUk7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQU9BOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBSGdEOztBQU1wRDs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBO0FBRUE7QUFDSDtBQUNHO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBO0FBRUE7QUFDSDtBQUNKOztBQUVEOzs7Ozs7OztBQVFBOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFDSTtBQUVBO0FBRUg7QUFDRztBQUVBO0FBRUg7QUFDRDtBQUVBO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7O0FBRUE7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7QUFFQTs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7O0FBT0E7QUFDSTtBQUVBO0FBRUE7QUFDSTtBQUNBO0FBRUg7QUFDRztBQUNIO0FBQ0Q7QUFDQTs7QUFHQTtBQUNBO0FBR0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTtBQUNBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFFQTtBQUVBO0FBQXlCO0FBQ3JCO0FBQ0k7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0g7QUFFSjs7QUFFRDtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDSTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBR0k7QUFDSTtBQURKO0FBR0g7QUFDSjtBQUNKOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDSjtBQUNBO0FBQ0k7QUFESjtBQUlIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7O0FBT0E7QUFDSTtBQUVBO0FBRUE7QUFBQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBOztBQUVBOzs7OztBQUtBO0FBQ0k7QUFFQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFFQTtBQUVBO0FBRUE7O0FBR0E7QUFDSTtBQUlIOztBQUdEO0FBQ0E7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7Ozs7QUFPQTtBQUNJO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUFBO0FBS0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBRUQ7QUFDSTtBQUVBO0FBQ0g7QUFFRDtBQUNIO0FBQ0c7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNJO0FBQ0o7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTs7O0FBR0E7QUFDQTtBQUNJO0FBTEo7QUFPQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFNSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFNSDs7QUFFRDs7Ozs7OztBQU9BOztBQUVBOzs7Ozs7QUFNQTtBQUNJO0FBRUE7QUFDQTtBQUdJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFJSjtBQUNKOztBQUVEOzs7Ozs7O0FBT0E7O0FBRUE7Ozs7O0FBS0E7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUVBO0FBQ0g7O0FBRUQ7QUFDSDs7Ozs7Ozs7Ozs7OztBQzdzQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7O0FBS0E7O0FBRUk7QUFFQTtBQUVBO0FBR0g7QUFDRzs7QUFFQTs7Ozs7OztBQU1BOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7OztBQUtBOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQU1BOzs7Ozs7O0FBT0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSEs7QUFLVDtBQUNJO0FBQ0E7QUFDQTtBQUhNO0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSEs7QUFLVDtBQUNJO0FBQ0E7QUFDQTtBQUhNO0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSEk7QUFLUjtBQUNJO0FBQ0E7QUFDQTtBQUhNO0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSEs7QUFLVDtBQUNJO0FBQ0E7QUFDQTtBQUhPO0FBS1g7QUFDSTtBQUNBO0FBQ0E7QUFIUTtBQUtaO0FBQ0k7QUFDQTtBQUNBO0FBSE87QUFLWDtBQUNJO0FBQ0E7QUFDQTtBQUhRO0FBS1o7QUFDSTtBQUNBO0FBQ0E7QUFISztBQUtUO0FBQ0k7QUFDQTtBQUNBO0FBSEk7QUFLUjtBQUNJO0FBQ0E7QUFDQTtBQUhPO0FBS1g7QUFDSTtBQUNBO0FBQ0E7QUFISztBQXZGSTs7QUE4RmpCOzs7Ozs7QUFNQTs7QUFnQkE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7OztBQUtBOztBQUVBOzs7Ozs7QUFNQTs7QUFJQTs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ2lCO0FBQTRCO0FBQzVCO0FBQTJDO0FBQzNDO0FBQTJDO0FBQzNDO0FBQThDO0FBRS9EO0FBQ0E7QUFDQTtBQUNJO0FBQU07QUFBOEI7QUFDeEI7QUFBVztBQUN2QjtBQUNIO0FBQ0Q7QUFFQTtBQUNIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFFQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBSUg7QUFDSjtBQUVPO0FBQ0g7QUFDRztBQUNIO0FBQ1I7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFJSDtBQUNEO0FBRUE7QUFDSDtBQUNHO0FBQ0E7QUFFQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNIOztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUF6RFk7O0FBNERoQjs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7OztBQUtBOztBQUVBOzs7Ozs7O0FBT0E7O0FBRUk7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7OztBQUtBO0FBQ0k7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFFQTtBQUVBOztBQUdBO0FBR0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFFQTtBQUVIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQThDO0FBQzFDO0FBQ0k7QUFESjtBQUlBO0FBQ0E7QUFDSDtBQUE2RDtBQUMxRDtBQUNJO0FBRUE7QUFFQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFFSjtBQUNKOztBQUVEOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFUTtBQURKO0FBR0o7QUFFQTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNBO0FBRUE7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBRUg7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7QUFPQTs7QUFFSTs7Ozs7QUFLQTs7QUFFQTs7OztBQUlBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSVztBQVVmO0FBQUE7QUFBQTtBQUdBO0FBQ0k7QUFDSTtBQUNJO0FBQ0k7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUVBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDSjtBQUNJO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQS9DUjtBQWlESDtBQUNKO0FBQ0c7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUE7Ozs7Ozs7QUFPQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBUUE7QUFDQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBWUE7QUFDSDs7QUFFRDs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBQUE7QUFBQTtBQUdBO0FBQ0k7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUg7O0FBRUQ7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFBQTtBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDUjtBQUNBO0FBQWM7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBR0k7QUFFQTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUFxQjtBQUNqQjtBQUNIO0FBQVE7QUFDTDtBQUNBO0FBQ0k7QUFFQTtBQUlIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSE07QUFLVjtBQUNBO0FBQ0k7QUFNSDtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQUE7QUFFQTtBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTFM7QUFPYjtBQUNBO0FBQ0E7QUFDRTtBQUNBO0FBQ0Q7QUFDRDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFJSDtBQUNEO0FBQ0g7QUFFRDtBQUVBO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSTTtBQVVWO0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUVBO0FBQ0E7QUFDSTtBQWFJO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFMQTtBQU1BO0FBS0Q7QUFFQTtBQUNIO0FBRUo7QUFDRDtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSTtBQURKO0FBR0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxNO0FBT1Y7QUFDQTs7QUFFSTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFSDs7QUFFRzs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUg7O0FBRUc7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFSDtBQUNKO0FBQ0Q7QUFDQTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUVBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFBQTtBQUVBO0FBQ0k7QUFFQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFITTtBQUtWO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUdJO0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFGTTtBQUlWO0FBQ0E7QUFFQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBVFI7QUFXQTtBQUNBO0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFFQTtBQUNJO0FBQ0E7QUFGTTtBQUlWO0FBQ0E7QUFDSTtBQUdJO0FBRUE7QUFDSDtBQUVKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUE7Ozs7QUFJQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTtBQUVIOztBQUVEOzs7O0FBSUE7QUFDSTs7QUFFQTs7Ozs7O0FBS0E7O0FBRUE7Ozs7Ozs7OztBQVNBOztBQUVJOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFFQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7OztBQVdBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7OztBQUlBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBRUE7QUFDQTtBQUNJO0FBREo7QUFJSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUFBO0FBTUg7QUFDRDtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDSTtBQURKO0FBSUg7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQUE7QUFBQTtBQUdBO0FBQXNCO0FBQ2xCO0FBQ0k7QUFESjtBQUdIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBRUE7QUFDQTtBQUVIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUFBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBRUE7QUFDSDs7QUFFRDs7OztBQUlBO0FBQ0k7QUFBQTtBQUVBO0FBQ0k7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBRUE7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7O0FBRUk7Ozs7QUFJQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7OztBQUlBOztBQUVBO0FBRUg7O0FBRUQ7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFFQTtBQUVBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7O0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFHQTtBQUVBO0FBRUE7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRUE7O0FBRUo7QUFDQTtBQUNBO0FBQ0k7QUFFQTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUFpQztBQUM3QjtBQUVRO0FBQ0g7QUFDRztBQUNIO0FBR1I7O0FBRUQ7QUFDQTtBQUNBO0FBQWdDO0FBQzVCO0FBRVE7QUFDSDtBQUNHO0FBQ0g7QUFHUjs7QUFFRDtBQUNBO0FBQ0k7QUFFQTs7QUFFSjtBQUNBO0FBQ0E7QUFDSTtBQUVBOztBQUVKO0FBQ0E7QUFDSTtBQUVBOztBQUVKO0FBQ0E7QUFDSTtBQUVBOztBQUVKO0FBQ0E7QUFBNkI7QUFDekI7QUFDQTtBQUNJO0FBREo7QUFPSTtBQUNBO0FBRUE7QUFFQTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFBZ0M7QUFDNUI7QUFFQTtBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFESjtBQUlIO0FBQ0Q7QUFDQTtBQUNIO0FBM0dMOztBQThHQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFFQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQXJDUjtBQXVDQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFJQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0k7QUFDQTs7QUFFSjtBQUNBO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUlBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUNBOztBQUVKO0FBQ0E7QUFDSTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFSjtBQUNJO0FBQ0E7QUExR1I7QUE0R0E7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTs7QUFHQTtBQUNBO0FBQ0k7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUNJO0FBQ0E7O0FBRUo7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0k7O0FBRUo7QUFDQTtBQUE4QjtBQUMxQjtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQWdDO0FBQzVCO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFoRlI7O0FBbUZBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ007QUFDQTs7QUFFTjtBQUNNOztBQUVOO0FBQ007O0FBRU47QUFDTTtBQXZCVjtBQXlCSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7QUFDSTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7OztBQVlBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7QUFRQTtBQUNJOztBQUdBO0FBQ0E7O0FBRUk7QUFBQTs7QUFHQTs7Ozs7Ozs7O0FBU0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFESjtBQUdBO0FBQ0k7QUFDQTtBQUdBO0FBR0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0c7QUFDSTtBQURKO0FBR1A7QUFDSjs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7OztBQVdBO0FBQ0k7QUFDQTtBQUNJO0FBRUE7QUFFQTtBQUVBO0FBQ0g7QUFDRDtBQUVBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBREo7QUFJSDtBQUNEO0FBQ0E7QUFDSTtBQUVBO0FBRUE7QUFDSDtBQUVEO0FBQTRCO0FBQ3hCO0FBQ0E7QUFDSTtBQUVBO0FBQ0g7QUFFSjtBQUNEO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7QUFFQTs7Ozs7Ozs7OztBQVVBO0FBQ0k7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTQTs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTs7QUFHQTtBQUVRO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSDs7QUFFRDtBQUNJOzs7Ozs7Ozs7OztBQVdBOztBQUVKO0FBQ0k7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUo7QUFDSTs7Ozs7Ozs7QUFRQTs7QUFFSjtBQUNJOzs7Ozs7OztBQVFBO0FBRVA7QUFDUjs7QUFFRDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFjQTtBQUNJO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7Ozs7OztBQVdBO0FBQ0k7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBU0E7O0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7OztBQVNBOztBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0k7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7QUFTQTs7QUFFQTs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBU0E7O0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFESjtBQUdIO0FBQ0Q7QUFDQTtBQUFBO0FBRUE7QUFDSTtBQUNJO0FBSUg7QUFOTDtBQVFIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFFUztBQUNBO0FBSVo7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0FBY0E7QUFDSTtBQUdBO0FBSUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs7O0FBV0E7QUFDSTtBQUlBO0FBRUE7QUFBQTtBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7O0FBVUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBVUE7QUFDSTtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBVUE7QUFDSTtBQUNIOztBQUVEOztBQUVBOzs7Ozs7O0FBT0E7QUFDSTtBQUNIOztBQUVEOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7QUFNQTtBQUVIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFFQTtBQUNIO0FBTUc7QUFDUDs7QUFFRDtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQUE7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBRUg7QUFFSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUlIO0FBQ0Q7QUFDSDs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQUE7QUFDSTtBQURKO0FBR0E7QUFDSTtBQUNJO0FBQUc7QUFBSDtBQUVBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBSUo7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQXhCUjtBQTBCQTtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBRUE7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQWxCUjtBQW9CQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUFtQjtBQUNmO0FBQ0E7QUFFQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQWdDO0FBQzVCO0FBQ0g7QUFDRztBQUNBO0FBQ0E7QUFDSDtBQUVKO0FBQ0o7QUFDRDtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7QUFDSTs7QUFFQTs7O0FBR0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7Ozs7OztBQU1BOztBQUVBO0FBQ0E7QUFFSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7OztBQUtBO0FBQ0k7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7O0FBR0E7QUFIQTtBQU1IOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQXNCO0FBQ2xCO0FBRUE7QUFFQTtBQUNIO0FBQ0Q7QUFDQTtBQUFzQztBQUNsQztBQUVBO0FBQ0E7QUFDSTtBQURKO0FBR0g7QUFDRDtBQUFpQztBQUM3QjtBQUNJO0FBQ0E7QUFDSTtBQUVIO0FBQ0Q7QUFDSDtBQUNHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7O0FBR0E7QUFDSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFFQTtBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFSjtBQUNJOztBQUVKO0FBQ0E7QUFDSTs7QUFFSjtBQUNJOztBQUVKO0FBQ0k7O0FBRUo7QUFDSTs7QUFFSjtBQUNJO0FBQ0o7QUFDSTtBQWxDUjtBQW9DSDs7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUVBO0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQURKO0FBRUE7QUFFQTtBQUFxQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBREo7QUFHSDtBQUNKO0FBQ0c7QUFDQTtBQUNJO0FBQ0E7O0FBTUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQURKO0FBR0E7QUFDSDtBQUNHO0FBQ0k7QUFESjtBQUdIO0FBQ0o7QUFDRztBQUNBO0FBQ0k7QUFDQTs7QUFNQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUtBOztBQUdBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFESjtBQUdIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIO0FBQ0o7O0FBRUQ7QUFDSDs7QUFFRDtBQUNBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQWFBO0FBQ0k7O0FBRUE7Ozs7O0FBS0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7OztBQVNBO0FBQ0k7O0FBRUE7Ozs7O0FBS0E7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7OztBQVdBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0E7QUFDSTtBQURKO0FBSUg7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQUE7QUFFQTtBQUNJO0FBREo7QUFJUTtBQUNBO0FBRm1DO0FBSTNDO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7OztBQVVBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNJOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7O0FBVUE7QUFDSTs7QUFFQTs7O0FBR0E7O0FBRUE7Ozs7QUFJQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7O0FBUUE7QUFDSTs7QUFHQTtBQUNBOztBQUVJOzs7Ozs7OztBQVFBO0FBQ0k7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKOztBQUVEOzs7O0FBSUE7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0E7Ozs7Ozs7Ozs7QUFVQTtBQUNBO0FBQ0k7O0FBRUk7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUVIO0FBQ0Q7QUFFQTtBQUVBO0FBQXFEO0FBQ2pEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUVBO0FBQU07QUFBc0Q7QUFDNUQ7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRztBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFHSDtBQUNKOztBQUVEOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7OztBQU1BOztBQUVBOzs7Ozs7QUFNQTs7QUFFQTs7QUFNQTtBQUVIO0FBQ0o7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7OztBQVVBO0FBQ0k7O0FBRUE7OztBQUdBOztBQUVBOzs7OztBQUtBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFQTs7Ozs7O0FBTUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFjQTtBQUNJOztBQUVBOzs7QUFHQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7Ozs7QUFJQTs7QUFFQTtBQUVIOztBQUVEOzs7O0FBSUE7QUFDSTs7QUFFQTs7Ozs7Ozs7QUFPQTs7QUFFSTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUE7O0FBRUE7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFFQTtBQUNIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7QUFFQTs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUVBO0FBQ0k7QUFDQTtBQUNJO0FBQ0o7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBRUE7QUFHSTtBQUVBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTs7QUFFSjtBQUNJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBRVE7QUFDSDs7QUFFTDtBQUNBO0FBRVE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDSDs7QUFFTDtBQUNBO0FBQ0E7QUFFUTtBQUNIO0FBQ0w7QUFFUTtBQUNIO0FBQ0w7QUFFUTtBQUNIOztBQUVMO0FBQ0E7QUFDSTtBQUNJO0FBR1A7O0FBRUQ7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUVIOztBQUVHO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFFSDs7QUFFRztBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFFSDs7QUFFRztBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFFSDtBQUNEO0FBRUg7QUFDRDtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVKO0FBQ0c7QUFFUDs7QUFHRDtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNKOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7O0FBRUE7O0FBRUE7O0FBRUk7QUFFQTtBQUVBO0FBRUg7QUFBMEM7O0FBRXZDO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNIOztBQUVEOztBQUVBO0FBQ0k7QUFBQTs7QUFHQTtBQUFvQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7QUFHSDs7QUFFRztBQUNJO0FBQ0c7QUFDSDtBQUFrQztBQUM5QjtBQUNBO0FBRUg7QUFBeUM7QUFDdEM7QUFDQTtBQUNIO0FBRUo7QUFFSjs7QUFHRDtBQUNJO0FBQThDO0FBQzFDO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNJO0FBQ0o7QUFDQTtBQUVBO0FBQ0k7QUFESjtBQUlIO0FBQ0c7QUFHSTtBQUE0RjtBQUErQjtBQUUzSDtBQUNYO0FBQ0Q7QUFDSTtBQUNQOztBQUVEOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRVE7QUFDSDtBQUNMO0FBR0E7QUFHQTtBQUdBOztBQUdBO0FBQ0g7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNBOztBQUdBO0FBQTZDOztBQUV6QztBQUNJO0FBQ0E7QUFDSDtBQUVKO0FBQXVEOztBQUVwRDtBQUNJO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFLSjs7QUFHRDtBQUNBO0FBQ0E7QUFDSTtBQUVBO0FBQ0g7QUFFSjs7QUFFRztBQUNJO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNIO0FBQ0c7QUFFUDtBQUVHO0FBQ0E7QUFIRzs7QUFPUDtBQUNIOztBQUVEOzs7Ozs7OztBQVFBO0FBQ0k7QUFDQTtBQUlBO0FBQ0k7QUFDSjtBQUVBO0FBQUE7QUFFQTtBQUNJO0FBR0k7QUFDQTtBQUNIO0FBTkw7QUFRSDs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVBOzs7QUFHQTs7QUFFQTs7O0FBR0E7O0FBRUE7OztBQUdBOztBQUVBO0FBRUg7O0FBRUQ7Ozs7QUFJQTtBQUNJOztBQUVBOzs7Ozs7Ozs7Ozs7QUFXQTtBQUNJOztBQUdBOzs7O0FBSUE7O0FBRUE7Ozs7QUFJQTs7QUFFQTs7OztBQUlBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQWNBOztBQUVBOzs7QUFHQTtBQUNJO0FBQWtCO0FBQXNDO0FBRHhCOztBQUlwQztBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUVIO0FBQ0o7QUFDSjs7QUFFRDs7QUFFQTs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0g7QUFMRTtBQU9WOztBQUVEOzs7QUFHQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBREo7QUFHSDs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFESjtBQUdIOztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQURKO0FBR0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0k7QUFESjtBQUVIOztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUVBO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBRUE7QUFDSDs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNIOztBQUdEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBR0E7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQVVBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNJO0FBS0E7QUFFUTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjtBQUNMO0FBQ0E7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBOzs7QUFHQTs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBRUE7QUFFQTtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNJO0FBS0E7QUFFUTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjtBQUNMO0FBQ0E7QUFDSDs7QUFFRDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgICAgIGJnbVZvbHVtZToxLjAsXHJcbiAgICAgICAgc2Z4Vm9sdW1lOjEuMCxcclxuICAgICAgICBiZ21BdWRpb0lEOi0xLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdibVZvbHVtZVwiKTtcclxuICAgICAgICBpZih0ICE9IG51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLmJnbVZvbHVtZSA9IHBhcnNlRmxvYXQodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNmeFZvbHVtZVwiKTtcclxuICAgICAgICBpZih0ICE9IG51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLnNmeFZvbHVtZSA9IHBhcnNlRmxvYXQodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYy5nYW1lLm9uKGNjLmdhbWUuRVZFTlRfSElERSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYy5hdWRpb0VuZ2luZS5wYXVzZUFsbFwiKTtcclxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2VBbGwoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjYy5nYW1lLm9uKGNjLmdhbWUuRVZFTlRfU0hPVywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYy5hdWRpb0VuZ2luZS5yZXN1bWVBbGxcIik7XHJcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnJlc3VtZUFsbCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFVybCA6IGZ1bmN0aW9uKHVybCl7XHJcbiAgICAgICAgcmV0dXJuIGNjLnVybC5yYXcoXCJyZWwvU291bmQvXCIgKyB1cmwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBwbGF5QkdNIDogZnVuY3Rpb24odXJsKXtcclxuICAgICAgICB2YXIgYXVpZG9VcmwgPSB0aGlzLmdldFVybCh1cmwpO1xyXG4gICAgICAgIGlmKHRoaXMuYmdtQXVkaW9JRCA+PSAwKXtcclxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcCh0aGlzLmJnbUF1ZGlvSUQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJnbUF1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5KGF1ZGlvVXJsLCB0cnVlLCB0aGlzLmJnbVZvbHVtZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHBsYXlTRlggOiBmdW5jdGlvbih1cmwpe1xyXG4gICAgICAgIHZhciBhdWRpb1VybCA9IHRoaXMuZ2V0VXJsKHVybCk7XHJcbiAgICAgICAgaWYodGhpcy5zZnhWb2x1bWUgPiAwKXtcclxuICAgICAgICAgICAgdmFyIGF1ZGlvSWQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5KGF1ZGlvVXJsLCBmYWxzZSwgdGhpcy5zZnhWb2x1bWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2V0QkdNVm9sdW1lIDogZnVuY3Rpb24odiwgZm9yY2Upe1xyXG4gICAgICAgIGlmKHRoaXMuYmdtQXVkaW9JRCA+PSAwKXtcclxuICAgICAgICAgICAgaWYoIHYgPiAwKXtcclxuICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnJlc3VtZSh0aGlzLmJnbUF1ZGlvSUQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wYXVzZSh0aGlzLmJnbUF1ZGlvSUQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuYmdtVm9sdW1lICE9IHYgfHwgZm9yY2Upe1xyXG4gICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJiZ21Wb2x1bWVcIiwgdik7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtVm9sdW1lID0gdjtcclxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuc2V0Vm9sdW1lKHRoaXMuYmdtQXVkaW9JRCwgdik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwYXVzZUFsbCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2VBbGwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzdW1lQWxsIDogZnVuY3Rpb24oKXtcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5yZXN1bWVBbGwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuXHJcbiAgICAgICAgcGFyZW50Tm9kZTogY2MuTm9kZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgb25BbmltQ29tcGxldGVkOiBmdW5jdGlvbihudW0pe1xyXG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5nZXRDb21wb25lbnQoXCJVSVBva2VyU2h1ZmZsZVwiKS5vbkFuaW1Db21wbGV0ZWQobnVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiLy/mlbDmja7nrqHnkIblmajvvIzlrZjlgqjlhajlsYDmlbDmja5cclxudmFyIE0gPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcbmNjLmRhdGFtYW5hZ2VyID0gbmV3IE0oKVxyXG4iLCIvL+a4uOaIj+euoeeQhuWZqO+8jOi/m+WFpeaIv+mXtOWQjueahOaVsOaNruWSjOmAu+i+keeuoeeQhlxyXG52YXIgTSA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG5cclxuY2MuZ2FtZW1hbmFnZXIgPSBuZXcgTSgpXHJcbiIsIlxyXG52YXIgTSA9IGNjLkNsYXNzKHtcclxuXHJcbiAgICBjdG9yIDogZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnBhbmVscyA9IHt9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgIGRpc3BhY2hNc2c6ZnVuY3Rpb24obmFtZSxtc2dkYXRhKXtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wYW5lbHMpe1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IHRoaXMucGFuZWxzW2tleV1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPGxpc3QubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gbGlzdFtpXVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwW25hbWVdID09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFtuYW1lXShtc2dkYXRhKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgb3BlbjpmdW5jdGlvbihuYW1lLGJ2aXNpYmxlLGNhbGwpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICBjYy5sb2FkZXIubG9hZFJlcygnR3VpLycgKyBuYW1lLGZ1bmN0aW9uKGVycixwcmVmYWIpIHtcclxuICAgICAgICBpZiAocHJlZmFiICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgb2JqID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKVxyXG4gICAgICAgICAgICBvYmoucGFyZW50ID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKVxyXG4gICAgICAgICAgICB2YXIgcGFuZWwgPSBvYmouZ2V0Q29tcG9uZW50KGNjLnVpcGFuZWwpO1xyXG4gICAgICAgICAgICBpZiAoY2FsbCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY2FsbChwYW5lbClcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBzZWxmLnBhbmVsc1tuYW1lXVxyXG4gICAgICAgICAgICBpZiAobGlzdCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gW11cclxuICAgICAgICAgICAgICAgIHNlbGYucGFuZWxzW25hbWVdID0gbGlzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhbmVsLm9uQ3JlYXRlKClcclxuICAgICAgICAgICAgaWYgKGJ2aXNpYmxlID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHBhbmVsLnNldFZpc2libGUodHJ1ZSlcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwYW5lbC5zZXRWaXNpYmxlKGJ2aXNpYmxlKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsaXN0LnB1c2gocGFuZWwpXHJcbiAgICAgICAgICAgIHJldHVybiBwYW5lbFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYy5sb2coJ29wZW4gcGFuZWwgZmFpbDonICsgbmFtZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICB9LFxyXG5cclxuICAgZGVzdHJveVBhbmVsOmZ1bmN0aW9uKHBhbmVsKXtcclxuICAgICAgICBwYW5lbC5vbkNsb3NlKClcclxuICAgICAgICBwYW5lbC5ub2RlLmRlc3Ryb3koKVxyXG4gICB9LFxyXG5cclxuICAgY2xvc2U6ZnVuY3Rpb24ocGFuZWwpe1xyXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMucGFuZWxzKXtcclxuICAgICAgICB2YXIgbGlzdCA9IHRoaXMucGFuZWxzW2tleV1cclxuICAgICAgICBmb3IgKHZhciBpID0gbGlzdC5sZW5ndGggLSAxO2kgPj0gMDsgLS1pKVxyXG4gICAgICAgICAgICBpZiAobGlzdFtpXSA9PSBwYW5lbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95UGFuZWwocGFuZWwpXHJcbiAgICAgICAgICAgICAgICBsaXN0LnNsaWNlKGksMSlcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgIGNsb3NlQnlOYW1lOmZ1bmN0aW9uKHBhbmVsTmFtZSl7XHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGlzLnBhbmVsc1twYW5lbE5hbWVdXHJcbiAgICAgICAgaWYgKGxpc3QgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBsaXN0LmxlbmdodDsgKytpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3lQYW5lbChsaXN0W2ldKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW3BhbmVsTmFtZV0gPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgY2xvc2VBbGw6ZnVuY3Rpb24oKXtcclxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnBhbmVscyl7XHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGlzLnBhbmVsc1trZXldXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGxpc3QubGVuZ2h0OyArK2kpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lQYW5lbChsaXN0W2ldKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMucGFuZWxzID0ge31cclxuICAgfVxyXG59KTtcclxuY2MuZ3VpbWFuYWdlciA9IG5ldyBNKCk7XHJcblxyXG5cclxuIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxyXG52YXIgTSA9IGNjLkNsYXNzKHtcclxuICAgIGN0b3I6ZnVuY3Rpb24oKXtcclxuICAgICAgICByZXF1aXJlKCdsb25nJylcclxuICAgICAgICByZXF1aXJlKCdieXRlYnVmZmVyJylcclxuICAgICAgICB0aGlzLlByb3RvQnVmID0gcmVxdWlyZSgncHJvdG9idWYnKVxyXG4gICAgICAgIHRoaXMuaGFuZGxlciA9IFtdXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBpbml0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICB0aGlzLm1lc3NhZ2VzID0ge307XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgdGhpcy5sb2FkUHJvdG8oJ1Byb3RvL2NsaWVudCcsZnVuY3Rpb24oYnVpbGRlcil7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uQ19Mb2dpbicpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLlNfTG9naW5SZXQnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5DX0cxM19KaW9uR2FtZScpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLkNfRzEzX0NyZWF0ZUdhbWUnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5DX0cxM19KaW9uR2FtZScpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLlNfRzEzX1Jvb21BdHRyJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uQ19HMTNfR2l2ZVVwJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uU19HMTNfQWJvcnRHYW1lT3JOb3QnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0cxM19Wb3RlRm9BYm9ydEdhbWUnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0cxM19RdWl0ZWQnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5DX0cxM19SZWFkeVN3aXRjaCcpO1xyXG4gICAgICAgIHNlbGYuYnVpbGRNZXNzYWdlKGJ1aWxkZXIsJ1B1YmxpY1Byb3RvLlNfRzEzX1BsYXllcnNJblJvb20nKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0cxM19IYW5kJyk7XHJcbiAgICAgICAgc2VsZi5idWlsZE1lc3NhZ2UoYnVpbGRlciwnUHVibGljUHJvdG8uQ19HMTNfQnJpbmdPdXQnKTtcclxuICAgICAgICBzZWxmLmJ1aWxkTWVzc2FnZShidWlsZGVyLCdQdWJsaWNQcm90by5TX0cxM19BbGxIYW5kcycpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5sb2FkUHJvdG9JRCgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgbG9hZFByb3RvOmZ1bmN0aW9uKHBhdGgsY2FsbCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhwYXRoLGZ1bmN0aW9uKGVycixwcm90byl7XHJcbiAgICAgICAgICB2YXIgYnVpbGRlciA9IHNlbGYuUHJvdG9CdWYucHJvdG9Gcm9tU3RyaW5nKHByb3RvKTtcclxuICAgICAgICAgIGNhbGwoYnVpbGRlcilcclxuICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZE1lc3NhZ2U6ZnVuY3Rpb24oYnVpbGRlcixuYW1lKXtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VzW25hbWVdID0gYnVpbGRlci5idWlsZChuYW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgbG9hZFByb3RvSUQ6ZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICAgIGNjLmxvYWRlci5sb2FkUmVzKCdQcm90by9wcm90b2lkJyxmdW5jdGlvbihlcnIscHJvdG9pZCl7XHJcbiAgICAgICAgc2VsZi5pZF9uYW1lX21hcCA9IEpTT04ucGFyc2UocHJvdG9pZClcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGlkX25hbWVfY29udmVydDpmdW5jdGlvbihpZF9vcl9uYW1lKXtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvdG9faWRfbmFtZV9tYXBbaWRfb3JfbmFtZV1cclxuICAgIH0sXHJcblxyXG4gICAgY29ubmVjdDpmdW5jdGlvbihpcCxwb3J0LGZ1bmMpe1xyXG4gICAgICAgIGlmICh0aGlzLmpic29ja2V0ID09IG51bGwpXHJcbiAgICAgICAgICB0aGlzLmpic29ja2V0ID0gbmV3IEpCU29ja2V0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5qYnNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgZnVuYyh0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmpic29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICBpZiAoZGF0YS5lcnJvcmlkID09IEpCU29ja2V0LkNvbm5lY3RFcnJvcilcclxuICAgICAgICAgICAgZnVuYyhmYWxzZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmpic29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjYy5sb2coJ2RhdGEubXNnaWQ6JyArIGRhdGEubXNnaWQpXHJcbiAgICAgICAgICBzZWxmLmRpc3BhY2hNc2coZGF0YS5tc2dpZCxkYXRhLm1zZylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5qYnNvY2tldC5jb25uZWN0KGlwLHBvcnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WFs+mXree9kee7nFxyXG4gICAgY2xvc2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAodGhpcy5qYnNvY2tldCAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRoaXMuamJzb2NrZXQuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuamJzb2NrZXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/liIblj5Hmtojmga9cclxuICAgIGRpc3BhY2hNc2c6ZnVuY3Rpb24obXNnaWQsbXNnKSB7XHJcbiAgICAgIHZhciBtc2duYW1lID0gdGhpcy5pZF9uYW1lX21hcFtTdHJpbmcobXNnaWQpXVxyXG4gICAgICB2YXIgbXNnZGF0YSA9IHRoaXMubWVzc2FnZXNbbXNnbmFtZV0uZGVjb2RlKG1zZylcclxuICAgICAgdmFyIG1zZ2hhbmRsZXJuYW1lID0gbXNnbmFtZS5yZXBsYWNlKCcuJywnXycpXHJcbiAgICAgIGNjLmxvZygncmVjdjonICsgbXNnbmFtZSlcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmhhbmRsZXIubGVuZ3RoOysraSlcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcltpXS5kaXNwYWNoTXNnKG1zZ2hhbmRsZXJuYW1lLG1zZ2RhdGEpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/nlLPor7fkuIDkuKogbXNnXHJcbiAgICBtc2c6ZnVuY3Rpb24obXNnbmFtZSl7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tZXNzYWdlc1ttc2duYW1lXTtcclxuICAgICAgaWYgKG1lc3NhZ2UpXHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgcmV0ID0gbmV3IG1lc3NhZ2UoKTtcclxuICAgICAgICByZXQuX19tc2dpZCA9IHRoaXMuaWRfbmFtZV9tYXBbbXNnbmFtZV1cclxuICAgICAgICByZXR1cm4gcmV0XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH0sXHJcblxyXG4gICAgLy/lj5HpgIFtc2dcclxuICAgIHNlbmQ6ZnVuY3Rpb24obXNnKXtcclxuICAgICAgaWYgKHRoaXMuamJzb2NrZXQgIT0gbnVsbClcclxuICAgICAge1xyXG4gICAgICAgIHZhciBpZCA9IG1zZy5fX21zZ2lkXHJcbiAgICAgICAgdGhpcy5qYnNvY2tldC5zZW5kKGlkLFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQ4QXJyYXkobXNnLnRvQnVmZmVyKCkpKSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZWdpc3RlckhhbmRsZXI6ZnVuY3Rpb24oaGFuZGxlcil7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICBpZiAoaGFuZGxlciAhPSBudWxsICYmIHR5cGVvZiBoYW5kbGVyLmRpc3BhY2hNc2cgPT0gJ2Z1bmN0aW9uJylcclxuICAgICAge1xyXG4gICAgICAgICAgc2VsZi5oYW5kbGVyLnB1c2goaGFuZGxlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbmNjLm5ldG1hbmFnZXIgPSBuZXcgTSgpO1xyXG5cclxuXHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICBfaXNTZWxlY3RlZDogZmFsc2UsXHJcbiAgICAgICAgX2Rpc3BhdGNoZXI6bnVsbCxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQgfHwgY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uU2VsZWN0KTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uU2VsZWN0KTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25TZWxlY3QpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRE9XTiwgdGhpcy5fb25TZWxlY3QpO1xyXG4gICAgICAgICAgIC8vIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9NT1ZFLCB0aGlzLl9vblNlbGVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfb25TZWxlY3Q6IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFtldmVudCwgZXZlbnQudHlwZSwgdHlwZW9mKGV2ZW50LnRhcmdldCksIHR5cGVvZihldmVudC5jdXJyZW50VGFyZ2V0KV0pO1xyXG4gICAgICAgIHZhciBjb21wb25lbnQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldENvbXBvbmVudChcIlBva2VyU2VsZWN0XCIpO1xyXG4gICAgICAgIGlmKCFjb21wb25lbnQuX2lzU2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnJ1bkFjdGlvbihjYy5tb3ZlQnkoMC4wNiwgY2MucCgwLCAyMCkpKTtcclxuICAgICAgICAgICAgY29tcG9uZW50Ll9pc1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuMDYsIGNjLnAoMCwgLTIwKSkpO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuX2lzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICAgICAgcG9rZXJTZWxlY3RQcmVmYWI6IGNjLlByZWZhYixcclxuXHJcbiAgICAgICAgX3Bva2VyTGlzdDogbnVsbFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFBva2VycygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UG9rZXJzOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuX3Bva2VyTGlzdCA9IFtdO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAxMzsgKytpKXtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdFBva2VyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wb2tlclNlbGVjdFByZWZhYik7XHJcbiAgICAgICAgICAgIHNlbGVjdFBva2VyLmdldENvbXBvbmVudChcIlBva2VyU2VsZWN0XCIpLl9kaXNwYXRjaGVyID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAgICAgICAgIHNlbGVjdFBva2VyLnBhcmVudCA9IHRoaXMubm9kZTtcclxuICAgICAgICAgICAgc2VsZWN0UG9rZXIucG9zaXRpb24gPSBjYy52MigoaSo2MC0zNjApLCAtMTgyKTtcclxuICAgICAgICAgICAgdGhpcy5fcG9rZXJMaXN0LnB1c2goc2VsZWN0UG9rZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsInZhciBNID0gY2MuQ2xhc3Moe1xyXG4gICAgbG9hZFNjZW5lOmZ1bmN0aW9uKG5hbWUsY2FsbCl7XHJcbiAgICAgICAgY2MubG9nKCd0ZXN0JylcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUobmFtZSxjYWxsKTtcclxuICAgICAgICBjYy5ndWltYW5hZ2VyLmNsb3NlQWxsKClcclxuICAgIH0sXHJcbiAgICBsb2FkTWFpblNjZW5lOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5sb2FkU2NlbmUoJ01haW4nLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNjLmd1aW1hbmFnZXIub3BlbignVUlNYWluJylcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgbG9hZExvZ2luU2NlbmU6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjYy5sb2coJ2xvYWRsb2dpbicpXHJcbiAgICAgICAgdGhpcy5sb2FkU2NlbmUoJ0xvZ2luJyxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjYy5ndWltYW5hZ2VyLm9wZW4oJ1VJTG9naW4nKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY2Muc2NlbmVtYW5hZ2VyID0gbmV3IE0oKSIsInJlcXVpcmUoJ1VJUGFuZWwnKVxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy51aXBhbmVsLFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgIGJ0bkNsb3NlOmNjLkJ1dHRvbixcclxuICAgICAgIGJ0bkNvbWZpcmU6Y2MuQnV0dG9uLFxyXG4gICAgICAgc3BDdXJzb3I6Y2MuTm9kZSxcclxuICAgICAgIGN1ckluZGV4OjBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHVwZGF0ZUN1cnNvcjpmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1ckluZGV4IDwgMCkgdGhpcy5jdXJJbmRleCA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VySW5kZXggPCA2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJvb20gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ3Jvb21pZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnNwQ3Vyc29yLnBhcmVudCA9IHJvb20uY2hpbGRyZW5bdGhpcy5jdXJJbmRleF07XHJcbiAgICAgICAgICAgIHRoaXMuc3BDdXJzb3IucG9zaXRpb24gPSBjYy5wKDAsMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYnRuQ2xvc2UuaW50ZXJhY3RhYmxlID0gdGhpcy5pc2Z1bGwoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGdldFZhbHVlOmZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIHJldHVybiBub2RlLmdldENoaWxkQnlOYW1lKCdudW0nKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZ1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgZ2V0Um9vbUlEOmZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICB2YXIgcm9vbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgncm9vbWlkJyk7XHJcbiAgICAgICAgdmFyIGNzID0gcm9vbS5jaGlsZHJlbjtcclxuICAgICAgICB2YXIgaWRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb29tLmNoaWxkcmVuQ291bnQ7ICsraSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkc1tpXSA9IHRoaXMuZ2V0VmFsdWUoY3NbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaWRzLmpvaW4oXCJcIikpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgc2V0VmFsdWU6ZnVuY3Rpb24obm9kZSxzdHIpe1xyXG4gICAgICAgIG5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ251bScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gc3RyO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgc2V0Q3VySW5kZXhWYWx1ZTpmdW5jdGlvbihzdHIpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzZnVsbCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJvb20gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ3Jvb21pZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHJvb20uY2hpbGRyZW5bdGhpcy5jdXJJbmRleF0sc3RyKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBpc2Z1bGw6ZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJJbmRleCA9PSA2O1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgcmVzZXRWYWx1ZSA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByb29tID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdyb29taWQnKTtcclxuICAgICAgICB2YXIgY3MgPSByb29tLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJJbmRleDsgKytpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShjc1tpXSxcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDdXJzb3IoKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGRlbGV0ZVZhbHVlIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VySW5kZXggPj0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC0tdGhpcy5jdXJJbmRleDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VySW5kZXggPCAwKSB0aGlzLmN1ckluZGV4ID0gMDtcclxuICAgICAgICAgICAgdGhpcy5zZXRDdXJJbmRleFZhbHVlKFwiXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnNvcigpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIGlucHV0VmFsdWUgOiBmdW5jdGlvbihudW0pIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNmdWxsKCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNldEN1ckluZGV4VmFsdWUobnVtKTtcclxuICAgICAgICAgICAgKyt0aGlzLmN1ckluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnNvcigpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICB2YXIga2V5Ym9hcmQgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2tleWJvYXJkJyk7XHJcbiAgICAgICB2YXIgY3MgPSBrZXlib2FyZC5jaGlsZHJlbjtcclxuICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5Ym9hcmQuY2hpbGRyZW5Db3VudDsrK2kpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBidG4gPSBjc1tpXS5nZXRDb21wb25lbnQoY2MuQnV0dG9uKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBidG4ubm9kZS5vbignY2xpY2snLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICB2YXIgbm9kZSA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICBpZiAobm9kZS5uYW1lID09IFwiYnRuX3Jlc2V0XCIpXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVzZXRWYWx1ZSgpOyAgICBcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09IFwiYnRuX2RlbGV0ZVwiKVxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBzZWxmLmlucHV0VmFsdWUobm9kZS5nZXRDaGlsZEJ5TmFtZSgnbnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnRuQ2xvc2UuaW50ZXJhY3RhYmxlID0gdGhpcy5pc2Z1bGwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25DbGlja19idG5DbG9zZTogZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmNsb3NlKClcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uY2xpY2tfYnRuQ29tZmlyZTogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgbXNnID0gY2MubmV0bWFuYWdlci5tc2coJ1B1YmxpY1Byb3RvLkNfRzEzX0ppb25HYW1lJylcclxuICAgICAgICBtc2cucm9vbV9jb2RlID0gdGhpcy5nZXRSb29tSUQoKVxyXG4gICAgICAgIGNjLm5ldG1hbmFnZXIuc2VuZChtc2cpXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlcXVpcmUgam9pbiByb29tOicgKyBtc2cucm9vbV9jb2RlKTtcclxuICAgICAgICB0aGlzLmNsb3NlKClcclxuICAgIH1cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJyZXF1aXJlKCdVSVBhbmVsJylcclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MudWlwYW5lbCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgYnRuV1hMb2dpbjpjYy5CdXR0b24sXHJcbiAgICAgICAgYnRuR3Vlc3RMb2dpbjpjYy5CdXR0b25cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0TWdyKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL2luaXQgbWFuYWdlcnNcclxuICAgIGluaXRNZ3IgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNjLm1nciA9IHt9O1xyXG5cclxuICAgICAgICAvL2luaXQgYXVkaW8gbWFuYWdlclxyXG4gICAgICAgIHZhciBBdWRpb01nciA9IHJlcXVpcmUoXCJBdWRpb01nclwiKTtcclxuICAgICAgICBjYy5tZ3IuQXVkaW9NZ3IgPSBuZXcgQXVkaW9NZ3IoKTtcclxuICAgICAgICBjYy5tZ3IuQXVkaW9NZ3IuaW5pdCgpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgbG9ja1VJOmZ1bmN0aW9uKGJMb2NrKXtcclxuICAgICAgICB2YXIgaW50ZXJhY3RhYmxlID0gIWJMb2NrXHJcbiAgICAgICAgdGhpcy5idG5XWExvZ2luLmludGVyYWN0YWJsZSA9IGludGVyYWN0YWJsZVxyXG4gICAgICAgIHRoaXMuYnRuR3Vlc3RMb2dpbi5pbnRlcmFjdGFibGUgPSBpbnRlcmFjdGFibGVcclxuICAgICAgICBcclxuICAgICAgICAvL1RPOui9rOiPiuiKsSBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGxvZ2luOmZ1bmN0aW9uKHR5cGUpe1xyXG4gICAgICAgICB0aGlzLmxvY2tVSSh0cnVlKVxyXG4gICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY2MubmV0bWFuYWdlci5jb25uZWN0KCcxMC4xNzMuMzIuNTInLDcwMDAsZnVuY3Rpb24ob2spe1xyXG4gICAgICAgICAgIGlmIChvaylcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIGNjLmxvZygnY29ubmVjdGVkIScpO1xyXG4gICAgICAgICAgICAgICB2YXIgbXNnID0gY2MubmV0bWFuYWdlci5tc2coJ1B1YmxpY1Byb3RvLkNfTG9naW4nKTtcclxuICAgICAgICAgICAgICAgbXNnLmxvZ2luX3R5cGUgPSB0eXBlXHJcbiAgICAgICAgICAgICAgIG1zZy5vcGVuaWQgPSAnMSdcclxuICAgICAgICAgICAgICAgbXNnLnRva2VuID0gJ3h4eHh4J1xyXG4gICAgICAgICAgICAgICBtc2cubmlja19uYW1lID0gJ3J1YW5iYW4nXHJcbiAgICAgICAgICAgICAgIGNjLm5ldG1hbmFnZXIuc2VuZChtc2cpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICBzZWxmLmxvY2tVSShmYWxzZSlcclxuICAgICAgICAgICAgICAgY2MubG9nKCdjb25uZWN0IGZhaWwhJyk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy93ZWNoYXQgbG9naW5cclxuICAgIG9uQ2xpY2tfYnRuV1hMb2dpbjpmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdGhpcy5sb2dpbigwKVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy/ov5Tlm57ljY/orq4gXHJcbiAgICBQdWJsaWNQcm90b19TX0xvZ2luUmV0OmZ1bmN0aW9uKG1zZyl7XHJcbiAgICAgICAgdGhpcy5sb2NrVUkoZmFsc2UpXHJcbiAgICAgICAgaWYgKG1zZy5yZXRfY29kZSA9PSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2MubG9nKCdsb2dpbiBzdWNjZXNzISBjdWlkOicgKyBtc2cuY3VpZCk7XHJcbiAgICAgICAgICAgIGNjLnNjZW5lbWFuYWdlci5sb2FkTWFpblNjZW5lKClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjYy5sb2coJ2xvZ2luIGZhaWwhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25NZXNzYWdlRXJyb3I6ZnVuY3Rpb24oZXJyb3JpZCl7XHJcbiAgICAgICAgdGhpcy5sb2NrVUkoZmFsc2UpXHJcbiAgICB9LFxyXG5cclxuICAgIC8vZ3Vlc3QgbG9naW5cclxuICAgIG9uQ2xpY2tfYnRuR3Vlc3RMb2dpbiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5sb2dpbigxKVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwicmVxdWlyZSgnVUlQYW5lbCcpXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLnVpcGFuZWwsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGJ0bk5vdGljZTpjYy5CdXR0b24sXHJcbiAgICAgICAgYnRuQ3JlYXRlUm9vbTpjYy5CdXR0b24sXHJcbiAgICAgICAgYnRuSm9pblJvb206Y2MuQnV0dG9uLFxyXG4gICAgICAgIGZ1bmNOb2RlOmNjLk5vZGVcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNjLmxvZyh0aGlzLmZ1bmNOb2RlLndpZHRoKVxyXG4gICAgICAgIHRoaXMuZnVuY05vZGUuc2NhbGVZID0gdGhpcy5mdW5jTm9kZS53aWR0aC8gODQwLjA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkNsaWNrX2J0bk5vdGljZTpmdW5jdGlvbigpe1xyXG4gICAgICAgY2MuZ3VpbWFuYWdlci5vcGVuKCdVSU5vdGljZScpXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkNsaWNrX2J0bkNyZWF0ZVJvb206ZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uQ2xpY2tfYnRuSm9pblJvb20gOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNjLmd1aW1hbmFnZXIub3BlbignVUlKb2luUm9vbScpXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkNsaWNrX2J0blNldHRpbmc6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2MuZ3VpbWFuYWdlci5vcGVuKCdVSVNldHRpbmcnKVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsInJlcXVpcmUoJ1VJUGFuZWwnKVxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy51aXBhbmVsLFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBidG5DbG9zZTpjYy5CdXR0b25cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkJ0bkNsb3NlQ2xpY2tlZDpmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJpZiAoY2MudWlwYW5lbCA9PSB1bmRlZmluZWQpXG57XG4gICAgY2MubG9nKCd1aXBhbmVsIGluaXQnKVxuICAgIGNjLnVpcGFuZWwgPSBjYy5DbGFzcyh7XG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICAgICAgY3RvcjpmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5pc01vZGVsID0gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBzZXRWaXNpYmxlOmZ1bmN0aW9uKGJWaXNpYmxlKXtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmVTZWxmID0gYlZpc2libGVcbiAgICAgICAgICAgIGlmIChiVmlzaWJsZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBvbkNyZWF0ZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2RlbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgICAgICAgICBjYy5sb2FkZXIubG9hZFJlcygnR3VpL01vZGFsQmcnLGZ1bmN0aW9uKGVycixwcmVmYWIpe1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2xvYWQnKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnLnBhcmVudCA9IHNlbGYubm9kZVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnLnNldFNpYmxpbmdJbmRleCgwKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJnLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb25JbW1lZGlhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIG9uQ2xvc2U6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICh0aGlzLmJnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuYmcub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJUKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgb25TaG93OmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIG9uSGlkZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBjbG9zZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgY2MuZ3VpbWFuYWdlci5jbG9zZSh0aGlzKVxuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIG9yaWdpblBva2VyOiBjYy5Ob2RlLFxyXG4gICAgICAgIG1vdmVQb2tlcjogY2MuTm9kZSxcclxuICAgICAgICBwcmVmYWJIZWFkSWNvbjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHByZWZhYlBva2VyU29ydDogY2MuUHJlZmFiLFxyXG5cclxuICAgICAgICBfcG9rZXJMaXN0OiBudWxsLFxyXG4gICAgICAgIF9oZWFkSWNvbnM6IG51bGwsXHJcbiAgICAgICAgX2N1clNodWZmbGVJZHg6MFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX3Bva2VyTGlzdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3Bva2VyTGlzdC5wdXNoKGNjLmZpbmQoXCJQb2tlclNodWZmbGUvUG9rZXJzL215UG9rZXJMaXN0XCIpKTtcclxuICAgICAgICB0aGlzLl9wb2tlckxpc3QucHVzaChjYy5maW5kKFwiUG9rZXJTaHVmZmxlL1Bva2Vycy9Qb2tlckxpc3QyXCIpKTtcclxuICAgICAgICB0aGlzLl9wb2tlckxpc3QucHVzaChjYy5maW5kKFwiUG9rZXJTaHVmZmxlL1Bva2Vycy9Qb2tlckxpc3QzXCIpKTtcclxuICAgICAgICB0aGlzLl9wb2tlckxpc3QucHVzaChjYy5maW5kKFwiUG9rZXJTaHVmZmxlL1Bva2Vycy9Qb2tlckxpc3Q0XCIpKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidGVzdF90ZXN0XCIsIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRlc3RfdGVzdFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFJvb206IGZ1bmN0aW9uKHBsYXllck51bSl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBfaW5pdEhlYWRQb3NpdGlvbjogZnVuY3Rpb24ocGxheWVyTnVtKXtcclxuICAgICAgICB0aGlzLmhlYWRJY29ucyA9IFtdO1xyXG4gICAgICAgIHZhciBoZWFkUGFyZW50ID0gY2MuZmluZChcIlBva2VyU2h1ZmZsZS9oZWFkc1wiKTtcclxuICAgICAgICBpZihwbGF5ZXJOdW0gPT0gMil7XHJcbiAgICAgICAgICAgIHZhciBoZWFkID0gY2MuaW5zdGFudGlhdGUodGhpcy5wcmVmYWJIZWFkSWNvbiwpXHJcbiAgICAgICAgICAgIHRoaXMuaGVhZEljb25zLnB1c2goaGVhZCk7XHJcbiAgICAgICAgICAgIGhlYWQucG9zaXRpb24gPSBjYy5wb3NpdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja1N0YXJ0QnRuOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMub3JpZ2luUG9rZXIuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm1vdmVQb2tlci5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubW92ZVBva2VyLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pLnBsYXkoKTtcclxuICAgICAgICBjYy5maW5kKFwiUG9rZXJTaHVmZmxlL3N0YXJ0QnRuXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgcG9rZXJTb3J0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5wcmVmYWJQb2tlclNvcnQpO1xyXG4gICAgICAgIHBva2VyU29ydC5wYXJlbnQgPSB0aGlzLm5vZGU7XHJcbiAgICAgICAgcG9rZXJTb3J0LnBvc2l0aW9uID0gY2MudjIoMCwgMCk7ICBcclxuICAgIH0sXHJcblxyXG4gICAgLy/lj5HniYxldmVudFxyXG4gICAgb25BbmltQ29tcGxldGVkOiBmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgaWYoaW5kZXggPCAxIHx8IGluZGV4ID4gNCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhbaW5kZXgsIHRoaXMuX2N1clNodWZmbGVJZHgsIHRoaXMuX3Bva2VyTGlzdFtpbmRleC0xXS5jaGlsZHJlbkNvdW50IF0pO1xyXG4gICAgICAgIGlmKGluZGV4ID09IDIpe1xyXG4gICAgICAgICAgICB0aGlzLl9wb2tlckxpc3RbaW5kZXgtMV0uY2hpbGRyZW5bMTIgLSB0aGlzLl9jdXJTaHVmZmxlSWR4XS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLl9wb2tlckxpc3RbaW5kZXgtMV0uY2hpbGRyZW5bdGhpcy5fY3VyU2h1ZmZsZUlkeF0uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoaW5kZXggPT0gNCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1clNodWZmbGVJZHgrKztcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUG9rZXIuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9jdXJTaHVmZmxlSWR4ID49IDEyKXtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUG9rZXIuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikuc3RvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVQb2tlci5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Qb2tlci5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIC8vdmFyIHBva2VyU29ydCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUG9rZXJTb3J0KTtcclxuICAgICAgICAgICAgICAgIC8vcG9rZXJTb3J0LnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIC8vfSwgdGhpcywgMiwgMSwgMCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy51aXBhbmVsLFxyXG5cclxuICAgXHJcbn0pO1xyXG4iLCIvKlxyXG4gYnl0ZWJ1ZmZlci5qcyAoYykgMjAxNSBEYW5pZWwgV2lydHogPGRjb2RlQGRjb2RlLmlvPlxyXG4gQmFja2luZyBidWZmZXI6IEFycmF5QnVmZmVyLCBBY2Nlc3NvcjogVWludDhBcnJheVxyXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMFxyXG4gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGNvZGVJTy9ieXRlYnVmZmVyLmpzIGZvciBkZXRhaWxzXHJcbiovXHJcbihmdW5jdGlvbihrLG0pe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtcImxvbmdcIl0sbSk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgcmVxdWlyZSYmXCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGUmJm1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe3ZhciByPW1vZHVsZSxzO3RyeXtzPXJlcXVpcmUoXCJsb25nXCIpfWNhdGNoKHUpe31zPW0ocyk7ci5leHBvcnRzPXN9ZWxzZShrLmRjb2RlSU89ay5kY29kZUlPfHx7fSkuQnl0ZUJ1ZmZlcj1tKGsuZGNvZGVJTy5Mb25nKX0pKHRoaXMsZnVuY3Rpb24oayl7ZnVuY3Rpb24gbShhKXt2YXIgYj0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBiPGEubGVuZ3RoP2EuY2hhckNvZGVBdChiKyspOm51bGx9fWZ1bmN0aW9uIHIoKXt2YXIgYT1bXSxiPVtdO3JldHVybiBmdW5jdGlvbigpe2lmKDA9PT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBiLmpvaW4oXCJcIikrdy5hcHBseShTdHJpbmcsYSk7MTAyNDxhLmxlbmd0aCtcclxuYXJndW1lbnRzLmxlbmd0aCYmKGIucHVzaCh3LmFwcGx5KFN0cmluZyxhKSksYS5sZW5ndGg9MCk7QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYSxhcmd1bWVudHMpfX1mdW5jdGlvbiBzKGEsYixjLGQsZil7dmFyIGw7bD04KmYtZC0xO3ZhciBnPSgxPDxsKS0xLGU9Zz4+MSxoPS03O2Y9Yz9mLTE6MDt2YXIgaz1jPy0xOjEscD1hW2IrZl07Zis9aztjPXAmKDE8PC1oKS0xO3A+Pj0taDtmb3IoaCs9bDswPGg7Yz0yNTYqYythW2IrZl0sZis9ayxoLT04KTtsPWMmKDE8PC1oKS0xO2M+Pj0taDtmb3IoaCs9ZDswPGg7bD0yNTYqbCthW2IrZl0sZis9ayxoLT04KTtpZigwPT09YyljPTEtZTtlbHNle2lmKGM9PT1nKXJldHVybiBsP05hTjpJbmZpbml0eSoocD8tMToxKTtsKz1NYXRoLnBvdygyLGQpO2MtPWV9cmV0dXJuKHA/LTE6MSkqbCpNYXRoLnBvdygyLGMtZCl9ZnVuY3Rpb24gdShhLGIsYyxkLGYsbCl7dmFyIGcsZT04KmwtZi0xLGg9KDE8PGUpLTEsaz1oPj4xLHA9MjM9PT1mP1xyXG5NYXRoLnBvdygyLC0yNCktTWF0aC5wb3coMiwtNzcpOjA7bD1kPzA6bC0xO3ZhciBtPWQ/MTotMSxuPTA+Ynx8MD09PWImJjA+MS9iPzE6MDtiPU1hdGguYWJzKGIpO2lzTmFOKGIpfHxJbmZpbml0eT09PWI/KGI9aXNOYU4oYik/MTowLGQ9aCk6KGQ9TWF0aC5mbG9vcihNYXRoLmxvZyhiKS9NYXRoLkxOMiksMT5iKihnPU1hdGgucG93KDIsLWQpKSYmKGQtLSxnKj0yKSxiPTE8PWQraz9iK3AvZzpiK3AqTWF0aC5wb3coMiwxLWspLDI8PWIqZyYmKGQrKyxnLz0yKSxkK2s+PWg/KGI9MCxkPWgpOjE8PWQraz8oYj0oYipnLTEpKk1hdGgucG93KDIsZiksZCs9ayk6KGI9YipNYXRoLnBvdygyLGstMSkqTWF0aC5wb3coMixmKSxkPTApKTtmb3IoOzg8PWY7YVtjK2xdPWImMjU1LGwrPW0sYi89MjU2LGYtPTgpO2Q9ZDw8ZnxiO2ZvcihlKz1mOzA8ZTthW2MrbF09ZCYyNTUsbCs9bSxkLz0yNTYsZS09OCk7YVtjK2wtbV18PTEyOCpufXZhciBoPWZ1bmN0aW9uKGEsYixjKXtcInVuZGVmaW5lZFwiPT09XHJcbnR5cGVvZiBhJiYoYT1oLkRFRkFVTFRfQ0FQQUNJVFkpO1widW5kZWZpbmVkXCI9PT10eXBlb2YgYiYmKGI9aC5ERUZBVUxUX0VORElBTik7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjJiYoYz1oLkRFRkFVTFRfTk9BU1NFUlQpO2lmKCFjKXthfD0wO2lmKDA+YSl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBjYXBhY2l0eVwiKTtiPSEhYjtjPSEhY310aGlzLmJ1ZmZlcj0wPT09YT92Om5ldyBBcnJheUJ1ZmZlcihhKTt0aGlzLnZpZXc9MD09PWE/bnVsbDpuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlcik7dGhpcy5vZmZzZXQ9MDt0aGlzLm1hcmtlZE9mZnNldD0tMTt0aGlzLmxpbWl0PWE7dGhpcy5saXR0bGVFbmRpYW49Yjt0aGlzLm5vQXNzZXJ0PWN9O2guVkVSU0lPTj1cIjUuMC4xXCI7aC5MSVRUTEVfRU5ESUFOPSEwO2guQklHX0VORElBTj0hMTtoLkRFRkFVTFRfQ0FQQUNJVFk9MTY7aC5ERUZBVUxUX0VORElBTj1oLkJJR19FTkRJQU47aC5ERUZBVUxUX05PQVNTRVJUPSExO2guTG9uZz1rfHxcclxubnVsbDt2YXIgZT1oLnByb3RvdHlwZTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9faXNCeXRlQnVmZmVyX19cIix7dmFsdWU6ITAsZW51bWVyYWJsZTohMSxjb25maWd1cmFibGU6ITF9KTt2YXIgdj1uZXcgQXJyYXlCdWZmZXIoMCksdz1TdHJpbmcuZnJvbUNoYXJDb2RlO2guYWNjZXNzb3I9ZnVuY3Rpb24oKXtyZXR1cm4gVWludDhBcnJheX07aC5hbGxvY2F0ZT1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIG5ldyBoKGEsYixjKX07aC5jb25jYXQ9ZnVuY3Rpb24oYSxiLGMsZCl7aWYoXCJib29sZWFuXCI9PT10eXBlb2YgYnx8XCJzdHJpbmdcIiE9PXR5cGVvZiBiKWQ9YyxjPWIsYj12b2lkIDA7Zm9yKHZhciBmPTAsbD0wLGc9YS5sZW5ndGgsZTtsPGc7KytsKWguaXNCeXRlQnVmZmVyKGFbbF0pfHwoYVtsXT1oLndyYXAoYVtsXSxiKSksZT1hW2xdLmxpbWl0LWFbbF0ub2Zmc2V0LDA8ZSYmKGYrPWUpO2lmKDA9PT1mKXJldHVybiBuZXcgaCgwLGMsZCk7Yj1uZXcgaChmLGMsZCk7Zm9yKGw9XHJcbjA7bDxnOyljPWFbbCsrXSxlPWMubGltaXQtYy5vZmZzZXQsMD49ZXx8KGIudmlldy5zZXQoYy52aWV3LnN1YmFycmF5KGMub2Zmc2V0LGMubGltaXQpLGIub2Zmc2V0KSxiLm9mZnNldCs9ZSk7Yi5saW1pdD1iLm9mZnNldDtiLm9mZnNldD0wO3JldHVybiBifTtoLmlzQnl0ZUJ1ZmZlcj1mdW5jdGlvbihhKXtyZXR1cm4hMD09PShhJiZhLl9faXNCeXRlQnVmZmVyX18pfTtoLnR5cGU9ZnVuY3Rpb24oKXtyZXR1cm4gQXJyYXlCdWZmZXJ9O2gud3JhcD1mdW5jdGlvbihhLGIsYyxkKXtcInN0cmluZ1wiIT09dHlwZW9mIGImJihkPWMsYz1iLGI9dm9pZCAwKTtpZihcInN0cmluZ1wiPT09dHlwZW9mIGEpc3dpdGNoKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgYiYmKGI9XCJ1dGY4XCIpLGIpe2Nhc2UgXCJiYXNlNjRcIjpyZXR1cm4gaC5mcm9tQmFzZTY0KGEsYyk7Y2FzZSBcImhleFwiOnJldHVybiBoLmZyb21IZXgoYSxjKTtjYXNlIFwiYmluYXJ5XCI6cmV0dXJuIGguZnJvbUJpbmFyeShhLGMpO2Nhc2UgXCJ1dGY4XCI6cmV0dXJuIGguZnJvbVVURjgoYSxcclxuYyk7Y2FzZSBcImRlYnVnXCI6cmV0dXJuIGguZnJvbURlYnVnKGEsYyk7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVuc3VwcG9ydGVkIGVuY29kaW5nOiBcIitiKTt9aWYobnVsbD09PWF8fFwib2JqZWN0XCIhPT10eXBlb2YgYSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJ1ZmZlclwiKTtpZihoLmlzQnl0ZUJ1ZmZlcihhKSlyZXR1cm4gYj1lLmNsb25lLmNhbGwoYSksYi5tYXJrZWRPZmZzZXQ9LTEsYjtpZihhIGluc3RhbmNlb2YgVWludDhBcnJheSliPW5ldyBoKDAsYyxkKSwwPGEubGVuZ3RoJiYoYi5idWZmZXI9YS5idWZmZXIsYi5vZmZzZXQ9YS5ieXRlT2Zmc2V0LGIubGltaXQ9YS5ieXRlT2Zmc2V0K2EuYnl0ZUxlbmd0aCxiLnZpZXc9bmV3IFVpbnQ4QXJyYXkoYS5idWZmZXIpKTtlbHNlIGlmKGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciliPW5ldyBoKDAsYyxkKSwwPGEuYnl0ZUxlbmd0aCYmKGIuYnVmZmVyPWEsYi5vZmZzZXQ9MCxiLmxpbWl0PWEuYnl0ZUxlbmd0aCxiLnZpZXc9MDxcclxuYS5ieXRlTGVuZ3RoP25ldyBVaW50OEFycmF5KGEpOm51bGwpO2Vsc2UgaWYoXCJbb2JqZWN0IEFycmF5XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpKWZvcihiPW5ldyBoKGEubGVuZ3RoLGMsZCksYi5saW1pdD1hLmxlbmd0aCxjPTA7YzxhLmxlbmd0aDsrK2MpYi52aWV3W2NdPWFbY107ZWxzZSB0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJ1ZmZlclwiKTtyZXR1cm4gYn07ZS53cml0ZUJpdFNldD1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKCEoYSBpbnN0YW5jZW9mIEFycmF5KSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIEJpdFNldDogTm90IGFuIGFycmF5XCIpO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD5cclxudGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1iLGY9YS5sZW5ndGgsZT1mPj4zLGc9MCxoO2ZvcihiKz10aGlzLndyaXRlVmFyaW50MzIoZixiKTtlLS07KWg9ISFhW2crK10mMXwoISFhW2crK10mMSk8PDF8KCEhYVtnKytdJjEpPDwyfCghIWFbZysrXSYxKTw8M3woISFhW2crK10mMSk8PDR8KCEhYVtnKytdJjEpPDw1fCghIWFbZysrXSYxKTw8NnwoISFhW2crK10mMSk8PDcsdGhpcy53cml0ZUJ5dGUoaCxiKyspO2lmKGc8Zil7Zm9yKGg9ZT0wO2c8ZjspaHw9KCEhYVtnKytdJjEpPDxlKys7dGhpcy53cml0ZUJ5dGUoaCxiKyspfXJldHVybiBjPyh0aGlzLm9mZnNldD1iLHRoaXMpOmItZH07ZS5yZWFkQml0U2V0PWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7dmFyIGM9dGhpcy5yZWFkVmFyaW50MzIoYSksXHJcbmQ9Yy52YWx1ZSxmPWQ+PjMsZT0wLGc9W107Zm9yKGErPWMubGVuZ3RoO2YtLTspYz10aGlzLnJlYWRCeXRlKGErKyksZ1tlKytdPSEhKGMmMSksZ1tlKytdPSEhKGMmMiksZ1tlKytdPSEhKGMmNCksZ1tlKytdPSEhKGMmOCksZ1tlKytdPSEhKGMmMTYpLGdbZSsrXT0hIShjJjMyKSxnW2UrK109ISEoYyY2NCksZ1tlKytdPSEhKGMmMTI4KTtpZihlPGQpZm9yKGY9MCxjPXRoaXMucmVhZEJ5dGUoYSsrKTtlPGQ7KWdbZSsrXT0hIShjPj5mKysmMSk7YiYmKHRoaXMub2Zmc2V0PWEpO3JldHVybiBnfTtlLnJlYWRCeXRlcz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrYT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitcclxuYitcIiAoK1wiK2ErXCIpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD10aGlzLnNsaWNlKGIsYithKTtjJiYodGhpcy5vZmZzZXQrPWEpO3JldHVybiBkfTtlLndyaXRlQnl0ZXM9ZS5hcHBlbmQ7ZS53cml0ZUludDg9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxufWIrPTE7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmQmJnRoaXMucmVzaXplKChkKj0yKT5iP2Q6Yik7dGhpcy52aWV3W2ItMV09YTtjJiYodGhpcy5vZmZzZXQrPTEpO3JldHVybiB0aGlzfTtlLndyaXRlQnl0ZT1lLndyaXRlSW50ODtlLnJlYWRJbnQ4PWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMSkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWE9dGhpcy52aWV3W2FdOzEyOD09PShhJjEyOCkmJihhPS0oMjU1LWErMSkpO2ImJih0aGlzLm9mZnNldCs9XHJcbjEpO3JldHVybiBhfTtlLnJlYWRCeXRlPWUucmVhZEludDg7ZS53cml0ZVVpbnQ4PWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9MTt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTtcclxudGhpcy52aWV3W2ItMV09YTtjJiYodGhpcy5vZmZzZXQrPTEpO3JldHVybiB0aGlzfTtlLndyaXRlVUludDg9ZS53cml0ZVVpbnQ4O2UucmVhZFVpbnQ4PWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMSkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWE9dGhpcy52aWV3W2FdO2ImJih0aGlzLm9mZnNldCs9MSk7cmV0dXJuIGF9O2UucmVhZFVJbnQ4PWUucmVhZFVpbnQ4O2Uud3JpdGVJbnQxNj1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtcclxuYyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9Mjt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTtiLT0yO3RoaXMubGl0dGxlRW5kaWFuPyh0aGlzLnZpZXdbYisxXT0oYSY2NTI4MCk+Pj44LHRoaXMudmlld1tiXT1hJjI1NSk6KHRoaXMudmlld1tiXT0oYSY2NTI4MCk+Pj5cclxuOCx0aGlzLnZpZXdbYisxXT1hJjI1NSk7YyYmKHRoaXMub2Zmc2V0Kz0yKTtyZXR1cm4gdGhpc307ZS53cml0ZVNob3J0PWUud3JpdGVJbnQxNjtlLnJlYWRJbnQxNj1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzIpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz0wO3RoaXMubGl0dGxlRW5kaWFuPyhjPXRoaXMudmlld1thXSxjfD10aGlzLnZpZXdbYSsxXTw8OCk6KGM9dGhpcy52aWV3W2FdPDw4LGN8PXRoaXMudmlld1thKzFdKTszMjc2OD09PShjJjMyNzY4KSYmXHJcbihjPS0oNjU1MzUtYysxKSk7YiYmKHRoaXMub2Zmc2V0Kz0yKTtyZXR1cm4gY307ZS5yZWFkU2hvcnQ9ZS5yZWFkSW50MTY7ZS53cml0ZVVpbnQxNj1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitiK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWIrPTI7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtcclxuYj5kJiZ0aGlzLnJlc2l6ZSgoZCo9Mik+Yj9kOmIpO2ItPTI7dGhpcy5saXR0bGVFbmRpYW4/KHRoaXMudmlld1tiKzFdPShhJjY1MjgwKT4+PjgsdGhpcy52aWV3W2JdPWEmMjU1KToodGhpcy52aWV3W2JdPShhJjY1MjgwKT4+PjgsdGhpcy52aWV3W2IrMV09YSYyNTUpO2MmJih0aGlzLm9mZnNldCs9Mik7cmV0dXJuIHRoaXN9O2Uud3JpdGVVSW50MTY9ZS53cml0ZVVpbnQxNjtlLnJlYWRVaW50MTY9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsyPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsyKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxufXZhciBjPTA7dGhpcy5saXR0bGVFbmRpYW4/KGM9dGhpcy52aWV3W2FdLGN8PXRoaXMudmlld1thKzFdPDw4KTooYz10aGlzLnZpZXdbYV08PDgsY3w9dGhpcy52aWV3W2ErMV0pO2ImJih0aGlzLm9mZnNldCs9Mik7cmV0dXJuIGN9O2UucmVhZFVJbnQxNj1lLnJlYWRVaW50MTY7ZS53cml0ZUludDMyPWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthfD0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitcclxuYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31iKz00O3ZhciBkPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5kJiZ0aGlzLnJlc2l6ZSgoZCo9Mik+Yj9kOmIpO2ItPTQ7dGhpcy5saXR0bGVFbmRpYW4/KHRoaXMudmlld1tiKzNdPWE+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMl09YT4+PjE2JjI1NSx0aGlzLnZpZXdbYisxXT1hPj4+OCYyNTUsdGhpcy52aWV3W2JdPWEmMjU1KToodGhpcy52aWV3W2JdPWE+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMV09YT4+PjE2JjI1NSx0aGlzLnZpZXdbYisyXT1hPj4+OCYyNTUsdGhpcy52aWV3W2IrM109YSYyNTUpO2MmJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIHRoaXN9O2Uud3JpdGVJbnQ9ZS53cml0ZUludDMyO2UucmVhZEludDMyPWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElXHJcbjEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzQ+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzQpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz0wO3RoaXMubGl0dGxlRW5kaWFuPyhjPXRoaXMudmlld1thKzJdPDwxNixjfD10aGlzLnZpZXdbYSsxXTw8OCxjfD10aGlzLnZpZXdbYV0sYys9dGhpcy52aWV3W2ErM108PDI0Pj4+MCk6KGM9dGhpcy52aWV3W2ErMV08PDE2LGN8PXRoaXMudmlld1thKzJdPDw4LGN8PXRoaXMudmlld1thKzNdLGMrPXRoaXMudmlld1thXTw8MjQ+Pj4wKTtiJiYodGhpcy5vZmZzZXQrPTQpO3JldHVybiBjfDB9O2UucmVhZEludD1lLnJlYWRJbnQzMjtlLndyaXRlVWludDMyPWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtcclxuaWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitiK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWIrPTQ7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmQmJnRoaXMucmVzaXplKChkKj0yKT5iP2Q6Yik7Yi09NDt0aGlzLmxpdHRsZUVuZGlhbj8odGhpcy52aWV3W2IrM109YT4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1hPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWE+Pj44JjI1NSx0aGlzLnZpZXdbYl09XHJcbmEmMjU1KToodGhpcy52aWV3W2JdPWE+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMV09YT4+PjE2JjI1NSx0aGlzLnZpZXdbYisyXT1hPj4+OCYyNTUsdGhpcy52aWV3W2IrM109YSYyNTUpO2MmJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIHRoaXN9O2Uud3JpdGVVSW50MzI9ZS53cml0ZVVpbnQzMjtlLnJlYWRVaW50MzI9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSs0PnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCs0KSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGM9MDt0aGlzLmxpdHRsZUVuZGlhbj8oYz10aGlzLnZpZXdbYStcclxuMl08PDE2LGN8PXRoaXMudmlld1thKzFdPDw4LGN8PXRoaXMudmlld1thXSxjKz10aGlzLnZpZXdbYSszXTw8MjQ+Pj4wKTooYz10aGlzLnZpZXdbYSsxXTw8MTYsY3w9dGhpcy52aWV3W2ErMl08PDgsY3w9dGhpcy52aWV3W2ErM10sYys9dGhpcy52aWV3W2FdPDwyND4+PjApO2ImJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIGN9O2UucmVhZFVJbnQzMj1lLnJlYWRVaW50MzI7ayYmKGUud3JpdGVJbnQ2ND1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCI9PT10eXBlb2YgYSlhPWsuZnJvbU51bWJlcihhKTtlbHNlIGlmKFwic3RyaW5nXCI9PT10eXBlb2YgYSlhPWsuZnJvbVN0cmluZyhhKTtlbHNlIGlmKCEoYSYmYSBpbnN0YW5jZW9mIGspKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyIG9yIExvbmcpXCIpO2lmKFwibnVtYmVyXCIhPT1cclxudHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31cIm51bWJlclwiPT09dHlwZW9mIGE/YT1rLmZyb21OdW1iZXIoYSk6XCJzdHJpbmdcIj09PXR5cGVvZiBhJiYoYT1rLmZyb21TdHJpbmcoYSkpO2IrPTg7dmFyIGQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmQmJnRoaXMucmVzaXplKChkKj0yKT5iP2Q6Yik7Yi09ODt2YXIgZD1hLmxvdyxmPWEuaGlnaDt0aGlzLmxpdHRsZUVuZGlhbj8odGhpcy52aWV3W2IrM109ZD4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1kPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWQ+Pj44JjI1NSx0aGlzLnZpZXdbYl09ZCYyNTUsYis9NCx0aGlzLnZpZXdbYiszXT1cclxuZj4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWY+Pj44JjI1NSx0aGlzLnZpZXdbYl09ZiYyNTUpOih0aGlzLnZpZXdbYl09Zj4+PjI0JjI1NSx0aGlzLnZpZXdbYisxXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzJdPWY+Pj44JjI1NSx0aGlzLnZpZXdbYiszXT1mJjI1NSxiKz00LHRoaXMudmlld1tiXT1kPj4+MjQmMjU1LHRoaXMudmlld1tiKzFdPWQ+Pj4xNiYyNTUsdGhpcy52aWV3W2IrMl09ZD4+PjgmMjU1LHRoaXMudmlld1tiKzNdPWQmMjU1KTtjJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiB0aGlzfSxlLndyaXRlTG9uZz1lLndyaXRlSW50NjQsZS5yZWFkSW50NjQ9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7XHJcbmE+Pj49MDtpZigwPmF8fGErOD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrOCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjPTAsZD0wO3RoaXMubGl0dGxlRW5kaWFuPyhjPXRoaXMudmlld1thKzJdPDwxNixjfD10aGlzLnZpZXdbYSsxXTw8OCxjfD10aGlzLnZpZXdbYV0sYys9dGhpcy52aWV3W2ErM108PDI0Pj4+MCxhKz00LGQ9dGhpcy52aWV3W2ErMl08PDE2LGR8PXRoaXMudmlld1thKzFdPDw4LGR8PXRoaXMudmlld1thXSxkKz10aGlzLnZpZXdbYSszXTw8MjQ+Pj4wKTooZD10aGlzLnZpZXdbYSsxXTw8MTYsZHw9dGhpcy52aWV3W2ErMl08PDgsZHw9dGhpcy52aWV3W2ErM10sZCs9dGhpcy52aWV3W2FdPDwyND4+PjAsYSs9NCxjPXRoaXMudmlld1thKzFdPDwxNixjfD10aGlzLnZpZXdbYSsyXTw8OCxjfD10aGlzLnZpZXdbYSszXSxjKz10aGlzLnZpZXdbYV08PDI0Pj4+MCk7XHJcbmE9bmV3IGsoYyxkLCExKTtiJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiBhfSxlLnJlYWRMb25nPWUucmVhZEludDY0LGUud3JpdGVVaW50NjQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiPT09dHlwZW9mIGEpYT1rLmZyb21OdW1iZXIoYSk7ZWxzZSBpZihcInN0cmluZ1wiPT09dHlwZW9mIGEpYT1rLmZyb21TdHJpbmcoYSk7ZWxzZSBpZighKGEmJmEgaW5zdGFuY2VvZiBrKSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlciBvciBMb25nKVwiKTtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrXHJcbmIrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9XCJudW1iZXJcIj09PXR5cGVvZiBhP2E9ay5mcm9tTnVtYmVyKGEpOlwic3RyaW5nXCI9PT10eXBlb2YgYSYmKGE9ay5mcm9tU3RyaW5nKGEpKTtiKz04O3ZhciBkPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5kJiZ0aGlzLnJlc2l6ZSgoZCo9Mik+Yj9kOmIpO2ItPTg7dmFyIGQ9YS5sb3csZj1hLmhpZ2g7dGhpcy5saXR0bGVFbmRpYW4/KHRoaXMudmlld1tiKzNdPWQ+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMl09ZD4+PjE2JjI1NSx0aGlzLnZpZXdbYisxXT1kPj4+OCYyNTUsdGhpcy52aWV3W2JdPWQmMjU1LGIrPTQsdGhpcy52aWV3W2IrM109Zj4+PjI0JjI1NSx0aGlzLnZpZXdbYisyXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzFdPWY+Pj44JjI1NSx0aGlzLnZpZXdbYl09ZiYyNTUpOih0aGlzLnZpZXdbYl09Zj4+PjI0JjI1NSx0aGlzLnZpZXdbYisxXT1mPj4+MTYmMjU1LHRoaXMudmlld1tiKzJdPWY+Pj44JjI1NSxcclxudGhpcy52aWV3W2IrM109ZiYyNTUsYis9NCx0aGlzLnZpZXdbYl09ZD4+PjI0JjI1NSx0aGlzLnZpZXdbYisxXT1kPj4+MTYmMjU1LHRoaXMudmlld1tiKzJdPWQ+Pj44JjI1NSx0aGlzLnZpZXdbYiszXT1kJjI1NSk7YyYmKHRoaXMub2Zmc2V0Kz04KTtyZXR1cm4gdGhpc30sZS53cml0ZVVJbnQ2ND1lLndyaXRlVWludDY0LGUucmVhZFVpbnQ2ND1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzg+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzgpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz0wLGQ9MDt0aGlzLmxpdHRsZUVuZGlhbj9cclxuKGM9dGhpcy52aWV3W2ErMl08PDE2LGN8PXRoaXMudmlld1thKzFdPDw4LGN8PXRoaXMudmlld1thXSxjKz10aGlzLnZpZXdbYSszXTw8MjQ+Pj4wLGErPTQsZD10aGlzLnZpZXdbYSsyXTw8MTYsZHw9dGhpcy52aWV3W2ErMV08PDgsZHw9dGhpcy52aWV3W2FdLGQrPXRoaXMudmlld1thKzNdPDwyND4+PjApOihkPXRoaXMudmlld1thKzFdPDwxNixkfD10aGlzLnZpZXdbYSsyXTw8OCxkfD10aGlzLnZpZXdbYSszXSxkKz10aGlzLnZpZXdbYV08PDI0Pj4+MCxhKz00LGM9dGhpcy52aWV3W2ErMV08PDE2LGN8PXRoaXMudmlld1thKzJdPDw4LGN8PXRoaXMudmlld1thKzNdLGMrPXRoaXMudmlld1thXTw8MjQ+Pj4wKTthPW5ldyBrKGMsZCwhMCk7YiYmKHRoaXMub2Zmc2V0Kz04KTtyZXR1cm4gYX0sZS5yZWFkVUludDY0PWUucmVhZFVpbnQ2NCk7ZS53cml0ZUZsb2F0MzI9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09XHJcbnR5cGVvZiBhKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhIG51bWJlcilcIik7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9NDt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTt1KHRoaXMudmlldyxhLGItNCx0aGlzLmxpdHRsZUVuZGlhbiwyMyw0KTtjJiYodGhpcy5vZmZzZXQrPTQpO3JldHVybiB0aGlzfTtlLndyaXRlRmxvYXQ9ZS53cml0ZUZsb2F0MzI7ZS5yZWFkRmxvYXQzMj1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmXHJcbihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSs0PnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCs0KSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9YT1zKHRoaXMudmlldyxhLHRoaXMubGl0dGxlRW5kaWFuLDIzLDQpO2ImJih0aGlzLm9mZnNldCs9NCk7cmV0dXJuIGF9O2UucmVhZEZsb2F0PWUucmVhZEZsb2F0MzI7ZS53cml0ZUZsb2F0NjQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGEgbnVtYmVyKVwiKTtcclxuaWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2IrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Yis9ODt2YXIgZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTt1KHRoaXMudmlldyxhLGItOCx0aGlzLmxpdHRsZUVuZGlhbiw1Miw4KTtjJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiB0aGlzfTtlLndyaXRlRG91YmxlPWUud3JpdGVGbG9hdDY0O2UucmVhZEZsb2F0NjQ9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09XHJcbmElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErOD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrOCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWE9cyh0aGlzLnZpZXcsYSx0aGlzLmxpdHRsZUVuZGlhbiw1Miw4KTtiJiYodGhpcy5vZmZzZXQrPTgpO3JldHVybiBhfTtlLnJlYWREb3VibGU9ZS5yZWFkRmxvYXQ2NDtoLk1BWF9WQVJJTlQzMl9CWVRFUz01O2guY2FsY3VsYXRlVmFyaW50MzI9ZnVuY3Rpb24oYSl7YT4+Pj0wO3JldHVybiAxMjg+YT8xOjE2Mzg0PmE/MjoyMDk3MTUyPmE/MzoyNjg0MzU0NTY+YT80OjV9O2guemlnWmFnRW5jb2RlMzI9ZnVuY3Rpb24oYSl7cmV0dXJuKChhfD0wKTw8MV5hPj4zMSk+Pj4wfTtoLnppZ1phZ0RlY29kZTMyPWZ1bmN0aW9uKGEpe3JldHVybiBhPj4+MV4tKGEmXHJcbjEpfDB9O2Uud3JpdGVWYXJpbnQzMj1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHZhbHVlOiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YXw9MDtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1oLmNhbGN1bGF0ZVZhcmludDMyKGEpLGY7Yis9ZDtmPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5mJiZ0aGlzLnJlc2l6ZSgoZio9Mik+Yj9mOmIpO1xyXG5iLT1kO2ZvcihhPj4+PTA7MTI4PD1hOylmPWEmMTI3fDEyOCx0aGlzLnZpZXdbYisrXT1mLGE+Pj49Nzt0aGlzLnZpZXdbYisrXT1hO3JldHVybiBjPyh0aGlzLm9mZnNldD1iLHRoaXMpOmR9O2Uud3JpdGVWYXJpbnQzMlppZ1phZz1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLndyaXRlVmFyaW50MzIoaC56aWdaYWdFbmNvZGUzMihhKSxiKX07ZS5yZWFkVmFyaW50MzI9ZnVuY3Rpb24oYSl7dmFyIGI9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhO2ImJihhPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsxPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsxKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcclxufXZhciBjPTAsZD0wLGY7ZG97aWYoIXRoaXMubm9Bc3NlcnQmJmE+dGhpcy5saW1pdCl0aHJvdyBhPUVycm9yKFwiVHJ1bmNhdGVkXCIpLGEudHJ1bmNhdGVkPSEwLGE7Zj10aGlzLnZpZXdbYSsrXTs1PmMmJihkfD0oZiYxMjcpPDw3KmMpOysrY313aGlsZSgwIT09KGYmMTI4KSk7ZHw9MDtyZXR1cm4gYj8odGhpcy5vZmZzZXQ9YSxkKTp7dmFsdWU6ZCxsZW5ndGg6Y319O2UucmVhZFZhcmludDMyWmlnWmFnPWZ1bmN0aW9uKGEpe2E9dGhpcy5yZWFkVmFyaW50MzIoYSk7XCJvYmplY3RcIj09PXR5cGVvZiBhP2EudmFsdWU9aC56aWdaYWdEZWNvZGUzMihhLnZhbHVlKTphPWguemlnWmFnRGVjb2RlMzIoYSk7cmV0dXJuIGF9O2smJihoLk1BWF9WQVJJTlQ2NF9CWVRFUz0xMCxoLmNhbGN1bGF0ZVZhcmludDY0PWZ1bmN0aW9uKGEpe1wibnVtYmVyXCI9PT10eXBlb2YgYT9hPWsuZnJvbU51bWJlcihhKTpcInN0cmluZ1wiPT09dHlwZW9mIGEmJihhPWsuZnJvbVN0cmluZyhhKSk7dmFyIGI9YS50b0ludCgpPj4+XHJcbjAsYz1hLnNoaWZ0UmlnaHRVbnNpZ25lZCgyOCkudG9JbnQoKT4+PjA7YT1hLnNoaWZ0UmlnaHRVbnNpZ25lZCg1NikudG9JbnQoKT4+PjA7cmV0dXJuIDA9PWE/MD09Yz8xNjM4ND5iPzEyOD5iPzE6MjoyMDk3MTUyPmI/Mzo0OjE2Mzg0PmM/MTI4PmM/NTo2OjIwOTcxNTI+Yz83Ojg6MTI4PmE/OToxMH0saC56aWdaYWdFbmNvZGU2ND1mdW5jdGlvbihhKXtcIm51bWJlclwiPT09dHlwZW9mIGE/YT1rLmZyb21OdW1iZXIoYSwhMSk6XCJzdHJpbmdcIj09PXR5cGVvZiBhP2E9ay5mcm9tU3RyaW5nKGEsITEpOiExIT09YS51bnNpZ25lZCYmKGE9YS50b1NpZ25lZCgpKTtyZXR1cm4gYS5zaGlmdExlZnQoMSkueG9yKGEuc2hpZnRSaWdodCg2MykpLnRvVW5zaWduZWQoKX0saC56aWdaYWdEZWNvZGU2ND1mdW5jdGlvbihhKXtcIm51bWJlclwiPT09dHlwZW9mIGE/YT1rLmZyb21OdW1iZXIoYSwhMSk6XCJzdHJpbmdcIj09PXR5cGVvZiBhP2E9ay5mcm9tU3RyaW5nKGEsITEpOiExIT09YS51bnNpZ25lZCYmXHJcbihhPWEudG9TaWduZWQoKSk7cmV0dXJuIGEuc2hpZnRSaWdodFVuc2lnbmVkKDEpLnhvcihhLmFuZChrLk9ORSkudG9TaWduZWQoKS5uZWdhdGUoKSkudG9TaWduZWQoKX0sZS53cml0ZVZhcmludDY0PWZ1bmN0aW9uKGEsYil7dmFyIGM9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2MmJihiPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIj09PXR5cGVvZiBhKWE9ay5mcm9tTnVtYmVyKGEpO2Vsc2UgaWYoXCJzdHJpbmdcIj09PXR5cGVvZiBhKWE9ay5mcm9tU3RyaW5nKGEpO2Vsc2UgaWYoIShhJiZhIGluc3RhbmNlb2YgaykpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB2YWx1ZTogXCIrYStcIiAobm90IGFuIGludGVnZXIgb3IgTG9uZylcIik7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitiK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yj4+Pj0wO2lmKDA+Ynx8YiswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK1xyXG5iK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fVwibnVtYmVyXCI9PT10eXBlb2YgYT9hPWsuZnJvbU51bWJlcihhLCExKTpcInN0cmluZ1wiPT09dHlwZW9mIGE/YT1rLmZyb21TdHJpbmcoYSwhMSk6ITEhPT1hLnVuc2lnbmVkJiYoYT1hLnRvU2lnbmVkKCkpO3ZhciBkPWguY2FsY3VsYXRlVmFyaW50NjQoYSksZj1hLnRvSW50KCk+Pj4wLGU9YS5zaGlmdFJpZ2h0VW5zaWduZWQoMjgpLnRvSW50KCk+Pj4wLGc9YS5zaGlmdFJpZ2h0VW5zaWduZWQoNTYpLnRvSW50KCk+Pj4wO2IrPWQ7dmFyIHQ9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPnQmJnRoaXMucmVzaXplKCh0Kj0yKT5iP3Q6Yik7Yi09ZDtzd2l0Y2goZCl7Y2FzZSAxMDp0aGlzLnZpZXdbYis5XT1nPj4+NyYxO2Nhc2UgOTp0aGlzLnZpZXdbYis4XT05IT09ZD9nfDEyODpnJjEyNztjYXNlIDg6dGhpcy52aWV3W2IrN109OCE9PWQ/ZT4+PjIxfDEyODplPj4+MjEmMTI3O2Nhc2UgNzp0aGlzLnZpZXdbYis2XT1cclxuNyE9PWQ/ZT4+PjE0fDEyODplPj4+MTQmMTI3O2Nhc2UgNjp0aGlzLnZpZXdbYis1XT02IT09ZD9lPj4+N3wxMjg6ZT4+PjcmMTI3O2Nhc2UgNTp0aGlzLnZpZXdbYis0XT01IT09ZD9lfDEyODplJjEyNztjYXNlIDQ6dGhpcy52aWV3W2IrM109NCE9PWQ/Zj4+PjIxfDEyODpmPj4+MjEmMTI3O2Nhc2UgMzp0aGlzLnZpZXdbYisyXT0zIT09ZD9mPj4+MTR8MTI4OmY+Pj4xNCYxMjc7Y2FzZSAyOnRoaXMudmlld1tiKzFdPTIhPT1kP2Y+Pj43fDEyODpmPj4+NyYxMjc7Y2FzZSAxOnRoaXMudmlld1tiXT0xIT09ZD9mfDEyODpmJjEyN31yZXR1cm4gYz8odGhpcy5vZmZzZXQrPWQsdGhpcyk6ZH0sZS53cml0ZVZhcmludDY0WmlnWmFnPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMud3JpdGVWYXJpbnQ2NChoLnppZ1phZ0VuY29kZTY0KGEpLGIpfSxlLnJlYWRWYXJpbnQ2ND1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09XHJcbnR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsxPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsxKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGM9YSxkPTAsZj0wLGU9MCxnPTAsZz10aGlzLnZpZXdbYSsrXSxkPWcmMTI3O2lmKGcmMTI4JiYoZz10aGlzLnZpZXdbYSsrXSxkfD0oZyYxMjcpPDw3LGcmMTI4fHx0aGlzLm5vQXNzZXJ0JiZcInVuZGVmaW5lZFwiPT09dHlwZW9mIGcpJiYoZz10aGlzLnZpZXdbYSsrXSxkfD0oZyYxMjcpPDwxNCxnJjEyOHx8dGhpcy5ub0Fzc2VydCYmXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBnKSYmKGc9dGhpcy52aWV3W2ErK10sZHw9KGcmMTI3KTw8MjEsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykmJihnPXRoaXMudmlld1thKytdLFxyXG5mPWcmMTI3LGcmMTI4fHx0aGlzLm5vQXNzZXJ0JiZcInVuZGVmaW5lZFwiPT09dHlwZW9mIGcpJiYoZz10aGlzLnZpZXdbYSsrXSxmfD0oZyYxMjcpPDw3LGcmMTI4fHx0aGlzLm5vQXNzZXJ0JiZcInVuZGVmaW5lZFwiPT09dHlwZW9mIGcpJiYoZz10aGlzLnZpZXdbYSsrXSxmfD0oZyYxMjcpPDwxNCxnJjEyOHx8dGhpcy5ub0Fzc2VydCYmXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBnKSYmKGc9dGhpcy52aWV3W2ErK10sZnw9KGcmMTI3KTw8MjEsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykmJihnPXRoaXMudmlld1thKytdLGU9ZyYxMjcsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykmJihnPXRoaXMudmlld1thKytdLGV8PShnJjEyNyk8PDcsZyYxMjh8fHRoaXMubm9Bc3NlcnQmJlwidW5kZWZpbmVkXCI9PT10eXBlb2YgZykpdGhyb3cgRXJyb3IoXCJCdWZmZXIgb3ZlcnJ1blwiKTtkPWsuZnJvbUJpdHMoZHxmPDwyOCxmPj4+NHxcclxuZTw8MjQsITEpO3JldHVybiBiPyh0aGlzLm9mZnNldD1hLGQpOnt2YWx1ZTpkLGxlbmd0aDphLWN9fSxlLnJlYWRWYXJpbnQ2NFppZ1phZz1mdW5jdGlvbihhKXsoYT10aGlzLnJlYWRWYXJpbnQ2NChhKSkmJmEudmFsdWUgaW5zdGFuY2VvZiBrP2EudmFsdWU9aC56aWdaYWdEZWNvZGU2NChhLnZhbHVlKTphPWguemlnWmFnRGVjb2RlNjQoYSk7cmV0dXJuIGF9KTtlLndyaXRlQ1N0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7dmFyIGQsZj1hLmxlbmd0aDtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBOb3QgYSBzdHJpbmdcIik7Zm9yKGQ9MDtkPGY7KytkKWlmKDA9PT1hLmNoYXJDb2RlQXQoZCkpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgc3RyOiBDb250YWlucyBOVUxMLWNoYXJhY3RlcnNcIik7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHxcclxuMCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYitcIiAobm90IGFuIGludGVnZXIpXCIpO2I+Pj49MDtpZigwPmJ8fGIrMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIitiK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWY9bi5jYWxjdWxhdGVVVEYxNmFzVVRGOChtKGEpKVsxXTtiKz1mKzE7ZD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO2I+ZCYmdGhpcy5yZXNpemUoKGQqPTIpPmI/ZDpiKTtiLT1mKzE7bi5lbmNvZGVVVEYxNnRvVVRGOChtKGEpLGZ1bmN0aW9uKGEpe3RoaXMudmlld1tiKytdPWF9LmJpbmQodGhpcykpO3RoaXMudmlld1tiKytdPTA7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Zn07ZS5yZWFkQ1N0cmluZz1mdW5jdGlvbihhKXt2YXIgYj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE7YiYmKGE9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09XHJcbnR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIithK1wiIChub3QgYW4gaW50ZWdlcilcIik7YT4+Pj0wO2lmKDA+YXx8YSsxPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2ErXCIgKCsxKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGM9YSxkLGY9LTE7bi5kZWNvZGVVVEY4dG9VVEYxNihmdW5jdGlvbigpe2lmKDA9PT1mKXJldHVybiBudWxsO2lmKGE+PXRoaXMubGltaXQpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IFRydW5jYXRlZCBkYXRhLCBcIithK1wiIDwgXCIrdGhpcy5saW1pdCk7Zj10aGlzLnZpZXdbYSsrXTtyZXR1cm4gMD09PWY/bnVsbDpmfS5iaW5kKHRoaXMpLGQ9cigpLCEwKTtyZXR1cm4gYj8odGhpcy5vZmZzZXQ9YSxkKCkpOntzdHJpbmc6ZCgpLGxlbmd0aDphLWN9fTtlLndyaXRlSVN0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVxyXG5cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI7YyYmKGI9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IE5vdCBhIHN0cmluZ1wiKTtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1iLGY7Zj1uLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSksdGhpcy5ub0Fzc2VydClbMV07Yis9NCtmO3ZhciBlPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5lJiZ0aGlzLnJlc2l6ZSgoZSo9Mik+Yj9lOmIpO2ItPTQrZjt0aGlzLmxpdHRsZUVuZGlhbj8odGhpcy52aWV3W2IrXHJcbjNdPWY+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMl09Zj4+PjE2JjI1NSx0aGlzLnZpZXdbYisxXT1mPj4+OCYyNTUsdGhpcy52aWV3W2JdPWYmMjU1KToodGhpcy52aWV3W2JdPWY+Pj4yNCYyNTUsdGhpcy52aWV3W2IrMV09Zj4+PjE2JjI1NSx0aGlzLnZpZXdbYisyXT1mPj4+OCYyNTUsdGhpcy52aWV3W2IrM109ZiYyNTUpO2IrPTQ7bi5lbmNvZGVVVEYxNnRvVVRGOChtKGEpLGZ1bmN0aW9uKGEpe3RoaXMudmlld1tiKytdPWF9LmJpbmQodGhpcykpO2lmKGIhPT1kKzQrZil0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogVHJ1bmNhdGVkIGRhdGEsIFwiK2IrXCIgPT0gXCIrKGIrNCtmKSk7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Yi1kfTtlLnJlYWRJU3RyaW5nPWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrXHJcbmErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthPj4+PTA7aWYoMD5hfHxhKzQ+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYStcIiAoKzQpIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgYz1hLGQ9dGhpcy5yZWFkVWludDMyKGEpLGQ9dGhpcy5yZWFkVVRGOFN0cmluZyhkLGguTUVUUklDU19CWVRFUyxhKz00KTthKz1kLmxlbmd0aDtyZXR1cm4gYj8odGhpcy5vZmZzZXQ9YSxkLnN0cmluZyk6e3N0cmluZzpkLnN0cmluZyxsZW5ndGg6YS1jfX07aC5NRVRSSUNTX0NIQVJTPVwiY1wiO2guTUVUUklDU19CWVRFUz1cImJcIjtlLndyaXRlVVRGOFN0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrXHJcbmIrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZCxmPWI7ZD1uLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSkpWzFdO2IrPWQ7dmFyIGU9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtiPmUmJnRoaXMucmVzaXplKChlKj0yKT5iP2U6Yik7Yi09ZDtuLmVuY29kZVVURjE2dG9VVEY4KG0oYSksZnVuY3Rpb24oYSl7dGhpcy52aWV3W2IrK109YX0uYmluZCh0aGlzKSk7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Yi1mfTtlLndyaXRlU3RyaW5nPWUud3JpdGVVVEY4U3RyaW5nO2guY2FsY3VsYXRlVVRGOENoYXJzPWZ1bmN0aW9uKGEpe3JldHVybiBuLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSkpWzBdfTtoLmNhbGN1bGF0ZVVURjhCeXRlcz1mdW5jdGlvbihhKXtyZXR1cm4gbi5jYWxjdWxhdGVVVEYxNmFzVVRGOChtKGEpKVsxXX07XHJcbmguY2FsY3VsYXRlU3RyaW5nPWguY2FsY3VsYXRlVVRGOEJ5dGVzO2UucmVhZFVURjhTdHJpbmc9ZnVuY3Rpb24oYSxiLGMpe1wibnVtYmVyXCI9PT10eXBlb2YgYiYmKGM9YixiPXZvaWQgMCk7dmFyIGQ9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjO2QmJihjPXRoaXMub2Zmc2V0KTtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGImJihiPWguTUVUUklDU19DSEFSUyk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGxlbmd0aDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBjfHwwIT09YyUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitjK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yz4+Pj0wO2lmKDA+Y3x8YyswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2MrXCIgKCswKSA8PSBcIitcclxudGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBmPTAsZT1jLGc7aWYoYj09PWguTUVUUklDU19DSEFSUyl7Zz1yKCk7bi5kZWNvZGVVVEY4KGZ1bmN0aW9uKCl7cmV0dXJuIGY8YSYmYzx0aGlzLmxpbWl0P3RoaXMudmlld1tjKytdOm51bGx9LmJpbmQodGhpcyksZnVuY3Rpb24oYSl7KytmO24uVVRGOHRvVVRGMTYoYSxnKX0pO2lmKGYhPT1hKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHJhbmdlOiBUcnVuY2F0ZWQgZGF0YSwgXCIrZitcIiA9PSBcIithKTtyZXR1cm4gZD8odGhpcy5vZmZzZXQ9YyxnKCkpOntzdHJpbmc6ZygpLGxlbmd0aDpjLWV9fWlmKGI9PT1oLk1FVFJJQ1NfQllURVMpe2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGN8fDAhPT1jJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2MrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtjPj4+PTA7aWYoMD5jfHxjK2E+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrXHJcbmMrXCIgKCtcIithK1wiKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9dmFyIGs9YythO24uZGVjb2RlVVRGOHRvVVRGMTYoZnVuY3Rpb24oKXtyZXR1cm4gYzxrP3RoaXMudmlld1tjKytdOm51bGx9LmJpbmQodGhpcyksZz1yKCksdGhpcy5ub0Fzc2VydCk7aWYoYyE9PWspdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IFRydW5jYXRlZCBkYXRhLCBcIitjK1wiID09IFwiK2spO3JldHVybiBkPyh0aGlzLm9mZnNldD1jLGcoKSk6e3N0cmluZzpnKCksbGVuZ3RoOmMtZX19dGhyb3cgVHlwZUVycm9yKFwiVW5zdXBwb3J0ZWQgbWV0cmljczogXCIrYik7fTtlLnJlYWRTdHJpbmc9ZS5yZWFkVVRGOFN0cmluZztlLndyaXRlVlN0cmluZz1mdW5jdGlvbihhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYjtjJiYoYj10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHN0cjogTm90IGEgc3RyaW5nXCIpO1xyXG5pZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2IrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtiPj4+PTA7aWYoMD5ifHxiKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYitcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO312YXIgZD1iLGYsZTtmPW4uY2FsY3VsYXRlVVRGMTZhc1VURjgobShhKSx0aGlzLm5vQXNzZXJ0KVsxXTtlPWguY2FsY3VsYXRlVmFyaW50MzIoZik7Yis9ZStmO3ZhciBnPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7Yj5nJiZ0aGlzLnJlc2l6ZSgoZyo9Mik+Yj9nOmIpO2ItPWUrZjtiKz10aGlzLndyaXRlVmFyaW50MzIoZixiKTtuLmVuY29kZVVURjE2dG9VVEY4KG0oYSksZnVuY3Rpb24oYSl7dGhpcy52aWV3W2IrK109YX0uYmluZCh0aGlzKSk7aWYoYiE9PWQrZitlKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHJhbmdlOiBUcnVuY2F0ZWQgZGF0YSwgXCIrXHJcbmIrXCIgPT0gXCIrKGIrZitlKSk7cmV0dXJuIGM/KHRoaXMub2Zmc2V0PWIsdGhpcyk6Yi1kfTtlLnJlYWRWU3RyaW5nPWZ1bmN0aW9uKGEpe3ZhciBiPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYTtiJiYoYT10aGlzLm9mZnNldCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMT50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMSkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjPWEsZD10aGlzLnJlYWRWYXJpbnQzMihhKSxkPXRoaXMucmVhZFVURjhTdHJpbmcoZC52YWx1ZSxoLk1FVFJJQ1NfQllURVMsYSs9ZC5sZW5ndGgpO2ErPWQubGVuZ3RoO3JldHVybiBiPyh0aGlzLm9mZnNldD1hLGQuc3RyaW5nKTp7c3RyaW5nOmQuc3RyaW5nLFxyXG5sZW5ndGg6YS1jfX07ZS5hcHBlbmQ9ZnVuY3Rpb24oYSxiLGMpe2lmKFwibnVtYmVyXCI9PT10eXBlb2YgYnx8XCJzdHJpbmdcIiE9PXR5cGVvZiBiKWM9YixiPXZvaWQgMDt2YXIgZD1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGM7ZCYmKGM9dGhpcy5vZmZzZXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGN8fDAhPT1jJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IFwiK2MrXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTtjPj4+PTA7aWYoMD5jfHxjKzA+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBvZmZzZXQ6IDAgPD0gXCIrYytcIiAoKzApIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31hIGluc3RhbmNlb2YgaHx8KGE9aC53cmFwKGEsYikpO2I9YS5saW1pdC1hLm9mZnNldDtpZigwPj1iKXJldHVybiB0aGlzO2MrPWI7dmFyIGY9dGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtjPmYmJnRoaXMucmVzaXplKChmKj0yKT5cclxuYz9mOmMpO2MtPWI7dGhpcy52aWV3LnNldChhLnZpZXcuc3ViYXJyYXkoYS5vZmZzZXQsYS5saW1pdCksYyk7YS5vZmZzZXQrPWI7ZCYmKHRoaXMub2Zmc2V0Kz1iKTtyZXR1cm4gdGhpc307ZS5hcHBlbmRUbz1mdW5jdGlvbihhLGIpe2EuYXBwZW5kKHRoaXMsYik7cmV0dXJuIHRoaXN9O2UuYXNzZXJ0PWZ1bmN0aW9uKGEpe3RoaXMubm9Bc3NlcnQ9IWE7cmV0dXJuIHRoaXN9O2UuY2FwYWNpdHk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aH07ZS5jbGVhcj1mdW5jdGlvbigpe3RoaXMub2Zmc2V0PTA7dGhpcy5saW1pdD10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO3RoaXMubWFya2VkT2Zmc2V0PS0xO3JldHVybiB0aGlzfTtlLmNsb25lPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBoKDAsdGhpcy5saXR0bGVFbmRpYW4sdGhpcy5ub0Fzc2VydCk7YT8oYi5idWZmZXI9bmV3IEFycmF5QnVmZmVyKHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpLGIudmlldz1uZXcgVWludDhBcnJheShiLmJ1ZmZlcikpOlxyXG4oYi5idWZmZXI9dGhpcy5idWZmZXIsYi52aWV3PXRoaXMudmlldyk7Yi5vZmZzZXQ9dGhpcy5vZmZzZXQ7Yi5tYXJrZWRPZmZzZXQ9dGhpcy5tYXJrZWRPZmZzZXQ7Yi5saW1pdD10aGlzLmxpbWl0O3JldHVybiBifTtlLmNvbXBhY3Q9ZnVuY3Rpb24oYSxiKXtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGEmJihhPXRoaXMub2Zmc2V0KTtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGImJihiPXRoaXMubGltaXQpO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBiZWdpbjogTm90IGFuIGludGVnZXJcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGVuZDogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKDA+YXx8YT5ifHxiPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYStcIiA8PSBcIitcclxuYitcIiA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9aWYoMD09PWEmJmI9PT10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXJldHVybiB0aGlzO3ZhciBjPWItYTtpZigwPT09YylyZXR1cm4gdGhpcy5idWZmZXI9dix0aGlzLnZpZXc9bnVsbCwwPD10aGlzLm1hcmtlZE9mZnNldCYmKHRoaXMubWFya2VkT2Zmc2V0LT1hKSx0aGlzLmxpbWl0PXRoaXMub2Zmc2V0PTAsdGhpczt2YXIgZD1uZXcgQXJyYXlCdWZmZXIoYyksZj1uZXcgVWludDhBcnJheShkKTtmLnNldCh0aGlzLnZpZXcuc3ViYXJyYXkoYSxiKSk7dGhpcy5idWZmZXI9ZDt0aGlzLnZpZXc9ZjswPD10aGlzLm1hcmtlZE9mZnNldCYmKHRoaXMubWFya2VkT2Zmc2V0LT1hKTt0aGlzLm9mZnNldD0wO3RoaXMubGltaXQ9YztyZXR1cm4gdGhpc307ZS5jb3B5PWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PVxyXG50eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJlZ2luOiBOb3QgYW4gaW50ZWdlclwiKTthPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgZW5kOiBOb3QgYW4gaW50ZWdlclwiKTtiPj4+PTA7aWYoMD5hfHxhPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogMCA8PSBcIithK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWlmKGE9PT1iKXJldHVybiBuZXcgaCgwLHRoaXMubGl0dGxlRW5kaWFuLHRoaXMubm9Bc3NlcnQpO3ZhciBjPWItYSxkPW5ldyBoKGMsdGhpcy5saXR0bGVFbmRpYW4sdGhpcy5ub0Fzc2VydCk7ZC5vZmZzZXQ9MDtkLmxpbWl0PWM7MDw9ZC5tYXJrZWRPZmZzZXQmJihkLm1hcmtlZE9mZnNldC09YSk7dGhpcy5jb3B5VG8oZCwwLGEsYik7cmV0dXJuIGR9O2UuY29weVRvPWZ1bmN0aW9uKGEsXHJcbmIsYyxkKXt2YXIgZixlO2lmKCF0aGlzLm5vQXNzZXJ0JiYhaC5pc0J5dGVCdWZmZXIoYSkpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCB0YXJnZXQ6IE5vdCBhIEJ5dGVCdWZmZXJcIik7Yj0oZT1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGIpP2Eub2Zmc2V0OmJ8MDtjPShmPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYyk/dGhpcy5vZmZzZXQ6Y3wwO2Q9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBkP3RoaXMubGltaXQ6ZHwwO2lmKDA+Ynx8Yj5hLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHRhcmdldCByYW5nZTogMCA8PSBcIitiK1wiIDw9IFwiK2EuYnVmZmVyLmJ5dGVMZW5ndGgpO2lmKDA+Y3x8ZD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHNvdXJjZSByYW5nZTogMCA8PSBcIitjK1wiIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO3ZhciBnPWQtYztpZigwPT09ZylyZXR1cm4gYTthLmVuc3VyZUNhcGFjaXR5KGIrZyk7XHJcbmEudmlldy5zZXQodGhpcy52aWV3LnN1YmFycmF5KGMsZCksYik7ZiYmKHRoaXMub2Zmc2V0Kz1nKTtlJiYoYS5vZmZzZXQrPWcpO3JldHVybiB0aGlzfTtlLmVuc3VyZUNhcGFjaXR5PWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYnVmZmVyLmJ5dGVMZW5ndGg7cmV0dXJuIGI8YT90aGlzLnJlc2l6ZSgoYio9Mik+YT9iOmEpOnRoaXN9O2UuZmlsbD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiO2QmJihiPXRoaXMub2Zmc2V0KTtcInN0cmluZ1wiPT09dHlwZW9mIGEmJjA8YS5sZW5ndGgmJihhPWEuY2hhckNvZGVBdCgwKSk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjJiYoYz10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgdmFsdWU6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthfD1cclxuMDtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBiZWdpbjogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgY3x8MCE9PWMlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGVuZDogTm90IGFuIGludGVnZXJcIik7Yz4+Pj0wO2lmKDA+Ynx8Yj5jfHxjPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYitcIiA8PSBcIitjK1wiIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31pZihiPj1jKXJldHVybiB0aGlzO2Zvcig7YjxjOyl0aGlzLnZpZXdbYisrXT1hO2QmJih0aGlzLm9mZnNldD1iKTtyZXR1cm4gdGhpc307ZS5mbGlwPWZ1bmN0aW9uKCl7dGhpcy5saW1pdD10aGlzLm9mZnNldDt0aGlzLm9mZnNldD0wO3JldHVybiB0aGlzfTtlLm1hcms9ZnVuY3Rpb24oYSl7YT1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGE/dGhpcy5vZmZzZXQ6YTtcclxuaWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2E+Pj49MDtpZigwPmF8fGErMD50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogMCA8PSBcIithK1wiICgrMCkgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXRoaXMubWFya2VkT2Zmc2V0PWE7cmV0dXJuIHRoaXN9O2Uub3JkZXI9ZnVuY3Rpb24oYSl7aWYoIXRoaXMubm9Bc3NlcnQmJlwiYm9vbGVhblwiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBsaXR0bGVFbmRpYW46IE5vdCBhIGJvb2xlYW5cIik7dGhpcy5saXR0bGVFbmRpYW49ISFhO3JldHVybiB0aGlzfTtlLkxFPWZ1bmN0aW9uKGEpe3RoaXMubGl0dGxlRW5kaWFuPVwidW5kZWZpbmVkXCIhPT10eXBlb2YgYT8hIWE6ITA7cmV0dXJuIHRoaXN9O2UuQkU9ZnVuY3Rpb24oYSl7dGhpcy5saXR0bGVFbmRpYW49XHJcblwidW5kZWZpbmVkXCIhPT10eXBlb2YgYT8hYTohMTtyZXR1cm4gdGhpc307ZS5wcmVwZW5kPWZ1bmN0aW9uKGEsYixjKXtpZihcIm51bWJlclwiPT09dHlwZW9mIGJ8fFwic3RyaW5nXCIhPT10eXBlb2YgYiljPWIsYj12b2lkIDA7dmFyIGQ9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjO2QmJihjPXRoaXMub2Zmc2V0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBjfHwwIT09YyUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiBcIitjK1wiIChub3QgYW4gaW50ZWdlcilcIik7Yz4+Pj0wO2lmKDA+Y3x8YyswPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgb2Zmc2V0OiAwIDw9IFwiK2MrXCIgKCswKSA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9YSBpbnN0YW5jZW9mIGh8fChhPWgud3JhcChhLGIpKTtiPWEubGltaXQtYS5vZmZzZXQ7aWYoMD49YilyZXR1cm4gdGhpczt2YXIgZj1iLWM7aWYoMDxmKXt2YXIgZT1uZXcgQXJyYXlCdWZmZXIodGhpcy5idWZmZXIuYnl0ZUxlbmd0aCtcclxuZiksZz1uZXcgVWludDhBcnJheShlKTtnLnNldCh0aGlzLnZpZXcuc3ViYXJyYXkoYyx0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSxiKTt0aGlzLmJ1ZmZlcj1lO3RoaXMudmlldz1nO3RoaXMub2Zmc2V0Kz1mOzA8PXRoaXMubWFya2VkT2Zmc2V0JiYodGhpcy5tYXJrZWRPZmZzZXQrPWYpO3RoaXMubGltaXQrPWY7Yys9Zn1lbHNlIG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyKTt0aGlzLnZpZXcuc2V0KGEudmlldy5zdWJhcnJheShhLm9mZnNldCxhLmxpbWl0KSxjLWIpO2Eub2Zmc2V0PWEubGltaXQ7ZCYmKHRoaXMub2Zmc2V0LT1iKTtyZXR1cm4gdGhpc307ZS5wcmVwZW5kVG89ZnVuY3Rpb24oYSxiKXthLnByZXBlbmQodGhpcyxiKTtyZXR1cm4gdGhpc307ZS5wcmludERlYnVnPWZ1bmN0aW9uKGEpe1wiZnVuY3Rpb25cIiE9PXR5cGVvZiBhJiYoYT1jb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpKTthKHRoaXMudG9TdHJpbmcoKStcIlxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cIitcclxudGhpcy50b0RlYnVnKCEwKSl9O2UucmVtYWluaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubGltaXQtdGhpcy5vZmZzZXR9O2UucmVzZXQ9ZnVuY3Rpb24oKXswPD10aGlzLm1hcmtlZE9mZnNldD8odGhpcy5vZmZzZXQ9dGhpcy5tYXJrZWRPZmZzZXQsdGhpcy5tYXJrZWRPZmZzZXQ9LTEpOnRoaXMub2Zmc2V0PTA7cmV0dXJuIHRoaXN9O2UucmVzaXplPWZ1bmN0aW9uKGEpe2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBjYXBhY2l0eTogXCIrYStcIiAobm90IGFuIGludGVnZXIpXCIpO2F8PTA7aWYoMD5hKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIGNhcGFjaXR5OiAwIDw9IFwiK2EpO31pZih0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoPGEpe2E9bmV3IEFycmF5QnVmZmVyKGEpO3ZhciBiPW5ldyBVaW50OEFycmF5KGEpO2Iuc2V0KHRoaXMudmlldyk7dGhpcy5idWZmZXI9YTt0aGlzLnZpZXc9Yn1yZXR1cm4gdGhpc307XHJcbmUucmV2ZXJzZT1mdW5jdGlvbihhLGIpe1widW5kZWZpbmVkXCI9PT10eXBlb2YgYSYmKGE9dGhpcy5vZmZzZXQpO1widW5kZWZpbmVkXCI9PT10eXBlb2YgYiYmKGI9dGhpcy5saW1pdCk7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYXx8MCE9PWElMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGJlZ2luOiBOb3QgYW4gaW50ZWdlclwiKTthPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgZW5kOiBOb3QgYW4gaW50ZWdlclwiKTtiPj4+PTA7aWYoMD5hfHxhPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogMCA8PSBcIithK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fWlmKGE9PT1iKXJldHVybiB0aGlzO0FycmF5LnByb3RvdHlwZS5yZXZlcnNlLmNhbGwodGhpcy52aWV3LnN1YmFycmF5KGEsYikpO3JldHVybiB0aGlzfTtcclxuZS5za2lwPWZ1bmN0aW9uKGEpe2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBsZW5ndGg6IFwiK2ErXCIgKG5vdCBhbiBpbnRlZ2VyKVwiKTthfD0wfXZhciBiPXRoaXMub2Zmc2V0K2E7aWYoIXRoaXMubm9Bc3NlcnQmJigwPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgbGVuZ3RoOiAwIDw9IFwiK3RoaXMub2Zmc2V0K1wiICsgXCIrYStcIiA8PSBcIit0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt0aGlzLm9mZnNldD1iO3JldHVybiB0aGlzfTtlLnNsaWNlPWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgYmVnaW46IE5vdCBhbiBpbnRlZ2VyXCIpO1xyXG5hPj4+PTA7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBifHwwIT09YiUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgZW5kOiBOb3QgYW4gaW50ZWdlclwiKTtiPj4+PTA7aWYoMD5hfHxhPmJ8fGI+dGhpcy5idWZmZXIuYnl0ZUxlbmd0aCl0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogMCA8PSBcIithK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjPXRoaXMuY2xvbmUoKTtjLm9mZnNldD1hO2MubGltaXQ9YjtyZXR1cm4gY307ZS50b0J1ZmZlcj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLm9mZnNldCxjPXRoaXMubGltaXQ7aWYoIXRoaXMubm9Bc3NlcnQpe2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIG9mZnNldDogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgY3x8MCE9PWMlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGxpbWl0OiBOb3QgYW4gaW50ZWdlclwiKTtcclxuYz4+Pj0wO2lmKDA+Ynx8Yj5jfHxjPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYitcIiA8PSBcIitjK1wiIDw9IFwiK3RoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpO31pZighYSYmMD09PWImJmM9PT10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXJldHVybiB0aGlzLmJ1ZmZlcjtpZihiPT09YylyZXR1cm4gdjthPW5ldyBBcnJheUJ1ZmZlcihjLWIpOyhuZXcgVWludDhBcnJheShhKSkuc2V0KChuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlcikpLnN1YmFycmF5KGIsYyksMCk7cmV0dXJuIGF9O2UudG9BcnJheUJ1ZmZlcj1lLnRvQnVmZmVyO2UudG9TdHJpbmc9ZnVuY3Rpb24oYSxiLGMpe2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgYSlyZXR1cm5cIkJ5dGVCdWZmZXJBQihvZmZzZXQ9XCIrdGhpcy5vZmZzZXQrXCIsbWFya2VkT2Zmc2V0PVwiK3RoaXMubWFya2VkT2Zmc2V0K1wiLGxpbWl0PVwiK3RoaXMubGltaXQrXCIsY2FwYWNpdHk9XCIrdGhpcy5jYXBhY2l0eSgpK1xyXG5cIilcIjtcIm51bWJlclwiPT09dHlwZW9mIGEmJihjPWI9YT1cInV0ZjhcIik7c3dpdGNoKGEpe2Nhc2UgXCJ1dGY4XCI6cmV0dXJuIHRoaXMudG9VVEY4KGIsYyk7Y2FzZSBcImJhc2U2NFwiOnJldHVybiB0aGlzLnRvQmFzZTY0KGIsYyk7Y2FzZSBcImhleFwiOnJldHVybiB0aGlzLnRvSGV4KGIsYyk7Y2FzZSBcImJpbmFyeVwiOnJldHVybiB0aGlzLnRvQmluYXJ5KGIsYyk7Y2FzZSBcImRlYnVnXCI6cmV0dXJuIHRoaXMudG9EZWJ1ZygpO2Nhc2UgXCJjb2x1bW5zXCI6cmV0dXJuIHRoaXMudG9Db2x1bW5zKCk7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVuc3VwcG9ydGVkIGVuY29kaW5nOiBcIithKTt9fTt2YXIgeD1mdW5jdGlvbigpe2Zvcih2YXIgYT17fSxiPVs2NSw2Niw2Nyw2OCw2OSw3MCw3MSw3Miw3Myw3NCw3NSw3Niw3Nyw3OCw3OSw4MCw4MSw4Miw4Myw4NCw4NSw4Niw4Nyw4OCw4OSw5MCw5Nyw5OCw5OSwxMDAsMTAxLDEwMiwxMDMsMTA0LDEwNSwxMDYsMTA3LDEwOCwxMDksMTEwLDExMSwxMTIsMTEzLFxyXG4xMTQsMTE1LDExNiwxMTcsMTE4LDExOSwxMjAsMTIxLDEyMiw0OCw0OSw1MCw1MSw1Miw1Myw1NCw1NSw1Niw1Nyw0Myw0N10sYz1bXSxkPTAsZj1iLmxlbmd0aDtkPGY7KytkKWNbYltkXV09ZDthLmVuY29kZT1mdW5jdGlvbihhLGMpe2Zvcih2YXIgZCxmO251bGwhPT0oZD1hKCkpOyljKGJbZD4+MiY2M10pLGY9KGQmMyk8PDQsbnVsbCE9PShkPWEoKSk/KGZ8PWQ+PjQmMTUsYyhiWyhmfGQ+PjQmMTUpJjYzXSksZj0oZCYxNSk8PDIsbnVsbCE9PShkPWEoKSk/KGMoYlsoZnxkPj42JjMpJjYzXSksYyhiW2QmNjNdKSk6KGMoYltmJjYzXSksYyg2MSkpKTooYyhiW2YmNjNdKSxjKDYxKSxjKDYxKSl9O2EuZGVjb2RlPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZChhKXt0aHJvdyBFcnJvcihcIklsbGVnYWwgY2hhcmFjdGVyIGNvZGU6IFwiK2EpO31mb3IodmFyIGYsZSxoO251bGwhPT0oZj1hKCkpOylpZihlPWNbZl0sXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBlJiZkKGYpLG51bGwhPT0oZj1hKCkpJiZcclxuKGg9Y1tmXSxcInVuZGVmaW5lZFwiPT09dHlwZW9mIGgmJmQoZiksYihlPDwyPj4+MHwoaCY0OCk+PjQpLG51bGwhPT0oZj1hKCkpKSl7ZT1jW2ZdO2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgZSlpZig2MT09PWYpYnJlYWs7ZWxzZSBkKGYpO2IoKGgmMTUpPDw0Pj4+MHwoZSY2MCk+PjIpO2lmKG51bGwhPT0oZj1hKCkpKXtoPWNbZl07aWYoXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBoKWlmKDYxPT09ZilicmVhaztlbHNlIGQoZik7YigoZSYzKTw8Nj4+PjB8aCl9fX07YS50ZXN0PWZ1bmN0aW9uKGEpe3JldHVybi9eKD86W0EtWmEtejAtOSsvXXs0fSkqKD86W0EtWmEtejAtOSsvXXsyfT09fFtBLVphLXowLTkrL117M309KT8kLy50ZXN0KGEpfTtyZXR1cm4gYX0oKTtlLnRvQmFzZTY0PWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTthfD0wO2J8PTA7aWYoMD5hfHxiPnRoaXMuY2FwYWNpdHl8fFxyXG5hPmIpdGhyb3cgUmFuZ2VFcnJvcihcImJlZ2luLCBlbmRcIik7dmFyIGM7eC5lbmNvZGUoZnVuY3Rpb24oKXtyZXR1cm4gYTxiP3RoaXMudmlld1thKytdOm51bGx9LmJpbmQodGhpcyksYz1yKCkpO3JldHVybiBjKCl9O2guZnJvbUJhc2U2ND1mdW5jdGlvbihhLGIpe2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYSl0aHJvdyBUeXBlRXJyb3IoXCJzdHJcIik7dmFyIGM9bmV3IGgoYS5sZW5ndGgvNCozLGIpLGQ9MDt4LmRlY29kZShtKGEpLGZ1bmN0aW9uKGEpe2Mudmlld1tkKytdPWF9KTtjLmxpbWl0PWQ7cmV0dXJuIGN9O2guYnRvYT1mdW5jdGlvbihhKXtyZXR1cm4gaC5mcm9tQmluYXJ5KGEpLnRvQmFzZTY0KCl9O2guYXRvYj1mdW5jdGlvbihhKXtyZXR1cm4gaC5mcm9tQmFzZTY0KGEpLnRvQmluYXJ5KCl9O2UudG9CaW5hcnk9ZnVuY3Rpb24oYSxiKXtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGEmJihhPXRoaXMub2Zmc2V0KTtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGImJihiPXRoaXMubGltaXQpO1xyXG5hfD0wO2J8PTA7aWYoMD5hfHxiPnRoaXMuY2FwYWNpdHkoKXx8YT5iKXRocm93IFJhbmdlRXJyb3IoXCJiZWdpbiwgZW5kXCIpO2lmKGE9PT1iKXJldHVyblwiXCI7Zm9yKHZhciBjPVtdLGQ9W107YTxiOyljLnB1c2godGhpcy52aWV3W2ErK10pLDEwMjQ8PWMubGVuZ3RoJiYoZC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGMpKSxjPVtdKTtyZXR1cm4gZC5qb2luKFwiXCIpK1N0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGMpfTtoLmZyb21CaW5hcnk9ZnVuY3Rpb24oYSxiKXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwic3RyXCIpO2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGgsZixlPW5ldyBoKGQsYik7YzxkOyl7Zj1hLmNoYXJDb2RlQXQoYyk7aWYoMjU1PGYpdGhyb3cgUmFuZ2VFcnJvcihcImlsbGVnYWwgY2hhciBjb2RlOiBcIitmKTtlLnZpZXdbYysrXT1mfWUubGltaXQ9ZDtyZXR1cm4gZX07ZS50b0RlYnVnPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1cclxuLTEsYz10aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoLGQsZj1cIlwiLGU9XCJcIixnPVwiXCI7YjxjOyl7LTEhPT1iJiYoZD10aGlzLnZpZXdbYl0sZj0xNj5kP2YrKFwiMFwiK2QudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkpOmYrZC50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSxhJiYoZSs9MzI8ZCYmMTI3PmQ/U3RyaW5nLmZyb21DaGFyQ29kZShkKTpcIi5cIikpOysrYjtpZihhJiYwPGImJjA9PT1iJTE2JiZiIT09Yyl7Zm9yKDs1MT5mLmxlbmd0aDspZis9XCIgXCI7Zys9ZitlK1wiXFxuXCI7Zj1lPVwiXCJ9Zj1iPT09dGhpcy5vZmZzZXQmJmI9PT10aGlzLmxpbWl0P2YrKGI9PT10aGlzLm1hcmtlZE9mZnNldD9cIiFcIjpcInxcIik6Yj09PXRoaXMub2Zmc2V0P2YrKGI9PT10aGlzLm1hcmtlZE9mZnNldD9cIltcIjpcIjxcIik6Yj09PXRoaXMubGltaXQ/ZisoYj09PXRoaXMubWFya2VkT2Zmc2V0P1wiXVwiOlwiPlwiKTpmKyhiPT09dGhpcy5tYXJrZWRPZmZzZXQ/XCInXCI6YXx8MCE9PWImJmIhPT1jP1wiIFwiOlwiXCIpfWlmKGEmJlwiIFwiIT09XHJcbmYpe2Zvcig7NTE+Zi5sZW5ndGg7KWYrPVwiIFwiO2crPWYrZStcIlxcblwifXJldHVybiBhP2c6Zn07aC5mcm9tRGVidWc9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEubGVuZ3RoO2I9bmV3IGgoKGQrMSkvM3wwLGIsYyk7Zm9yKHZhciBmPTAsZT0wLGcsaz0hMSxtPSExLG49ITEscD0hMSxxPSExO2Y8ZDspe3N3aXRjaChnPWEuY2hhckF0KGYrKykpe2Nhc2UgXCIhXCI6aWYoIWMpe2lmKG18fG58fHApe3E9ITA7YnJlYWt9bT1uPXA9ITB9Yi5vZmZzZXQ9Yi5tYXJrZWRPZmZzZXQ9Yi5saW1pdD1lO2s9ITE7YnJlYWs7Y2FzZSBcInxcIjppZighYyl7aWYobXx8cCl7cT0hMDticmVha31tPXA9ITB9Yi5vZmZzZXQ9Yi5saW1pdD1lO2s9ITE7YnJlYWs7Y2FzZSBcIltcIjppZighYyl7aWYobXx8bil7cT0hMDticmVha31tPW49ITB9Yi5vZmZzZXQ9Yi5tYXJrZWRPZmZzZXQ9ZTtrPSExO2JyZWFrO2Nhc2UgXCI8XCI6aWYoIWMpe2lmKG0pe3E9ITA7YnJlYWt9bT0hMH1iLm9mZnNldD1lO2s9ITE7YnJlYWs7Y2FzZSBcIl1cIjppZighYyl7aWYocHx8XHJcbm4pe3E9ITA7YnJlYWt9cD1uPSEwfWIubGltaXQ9Yi5tYXJrZWRPZmZzZXQ9ZTtrPSExO2JyZWFrO2Nhc2UgXCI+XCI6aWYoIWMpe2lmKHApe3E9ITA7YnJlYWt9cD0hMH1iLmxpbWl0PWU7az0hMTticmVhaztjYXNlIFwiJ1wiOmlmKCFjKXtpZihuKXtxPSEwO2JyZWFrfW49ITB9Yi5tYXJrZWRPZmZzZXQ9ZTtrPSExO2JyZWFrO2Nhc2UgXCIgXCI6az0hMTticmVhaztkZWZhdWx0OmlmKCFjJiZrKXtxPSEwO2JyZWFrfWc9cGFyc2VJbnQoZythLmNoYXJBdChmKyspLDE2KTtpZighYyYmKGlzTmFOKGcpfHwwPmd8fDI1NTxnKSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIHN0cjogTm90IGEgZGVidWcgZW5jb2RlZCBzdHJpbmdcIik7Yi52aWV3W2UrK109ZztrPSEwfWlmKHEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IEludmFsaWQgc3ltYm9sIGF0IFwiK2YpO31pZighYyl7aWYoIW18fCFwKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBNaXNzaW5nIG9mZnNldCBvciBsaW1pdFwiKTtcclxuaWYoZTxiLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBOb3QgYSBkZWJ1ZyBlbmNvZGVkIHN0cmluZyAoaXMgaXQgaGV4PykgXCIrZStcIiA8IFwiK2QpO31yZXR1cm4gYn07ZS50b0hleD1mdW5jdGlvbihhLGIpe2E9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhP3RoaXMub2Zmc2V0OmE7Yj1cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI/dGhpcy5saW1pdDpiO2lmKCF0aGlzLm5vQXNzZXJ0KXtpZihcIm51bWJlclwiIT09dHlwZW9mIGF8fDAhPT1hJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBiZWdpbjogTm90IGFuIGludGVnZXJcIik7YT4+Pj0wO2lmKFwibnVtYmVyXCIhPT10eXBlb2YgYnx8MCE9PWIlMSl0aHJvdyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGVuZDogTm90IGFuIGludGVnZXJcIik7Yj4+Pj0wO2lmKDA+YXx8YT5ifHxiPnRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpdGhyb3cgUmFuZ2VFcnJvcihcIklsbGVnYWwgcmFuZ2U6IDAgPD0gXCIrYStcIiA8PSBcIitiK1wiIDw9IFwiK1xyXG50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKTt9Zm9yKHZhciBjPUFycmF5KGItYSksZDthPGI7KWQ9dGhpcy52aWV3W2ErK10sMTY+ZD9jLnB1c2goXCIwXCIsZC50b1N0cmluZygxNikpOmMucHVzaChkLnRvU3RyaW5nKDE2KSk7cmV0dXJuIGMuam9pbihcIlwiKX07aC5mcm9tSGV4PWZ1bmN0aW9uKGEsYixjKXtpZighYyl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBOb3QgYSBzdHJpbmdcIik7aWYoMCE9PWEubGVuZ3RoJTIpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IExlbmd0aCBub3QgYSBtdWx0aXBsZSBvZiAyXCIpO312YXIgZD1hLmxlbmd0aDtiPW5ldyBoKGQvMnwwLGIpO2Zvcih2YXIgZixlPTAsZz0wO2U8ZDtlKz0yKXtmPXBhcnNlSW50KGEuc3Vic3RyaW5nKGUsZSsyKSwxNik7aWYoIWMmJighaXNGaW5pdGUoZil8fDA+Znx8MjU1PGYpKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgc3RyOiBDb250YWlucyBub24taGV4IGNoYXJhY3RlcnNcIik7XHJcbmIudmlld1tnKytdPWZ9Yi5saW1pdD1nO3JldHVybiBifTt2YXIgbj1mdW5jdGlvbigpe3ZhciBhPXtNQVhfQ09ERVBPSU5UOjExMTQxMTEsZW5jb2RlVVRGODpmdW5jdGlvbihhLGMpe3ZhciBkPW51bGw7XCJudW1iZXJcIj09PXR5cGVvZiBhJiYoZD1hLGE9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0pO2Zvcig7bnVsbCE9PWR8fG51bGwhPT0oZD1hKCkpOykxMjg+ZD9jKGQmMTI3KTooMjA0OD5kP2MoZD4+NiYzMXwxOTIpOig2NTUzNj5kP2MoZD4+MTImMTV8MjI0KTooYyhkPj4xOCY3fDI0MCksYyhkPj4xMiY2M3wxMjgpKSxjKGQ+PjYmNjN8MTI4KSksYyhkJjYzfDEyOCkpLGQ9bnVsbH0sZGVjb2RlVVRGODpmdW5jdGlvbihhLGMpe2Zvcih2YXIgZCxmLGUsZyxoPWZ1bmN0aW9uKGEpe2E9YS5zbGljZSgwLGEuaW5kZXhPZihudWxsKSk7dmFyIGI9RXJyb3IoYS50b1N0cmluZygpKTtiLm5hbWU9XCJUcnVuY2F0ZWRFcnJvclwiO2IuYnl0ZXM9YTt0aHJvdyBiO307bnVsbCE9PShkPWEoKSk7KWlmKDA9PT1cclxuKGQmMTI4KSljKGQpO2Vsc2UgaWYoMTkyPT09KGQmMjI0KSludWxsPT09KGY9YSgpKSYmaChbZCxmXSksYygoZCYzMSk8PDZ8ZiY2Myk7ZWxzZSBpZigyMjQ9PT0oZCYyNDApKW51bGwhPT0oZj1hKCkpJiZudWxsIT09KGU9YSgpKXx8aChbZCxmLGVdKSxjKChkJjE1KTw8MTJ8KGYmNjMpPDw2fGUmNjMpO2Vsc2UgaWYoMjQwPT09KGQmMjQ4KSludWxsIT09KGY9YSgpKSYmbnVsbCE9PShlPWEoKSkmJm51bGwhPT0oZz1hKCkpfHxoKFtkLGYsZSxnXSksYygoZCY3KTw8MTh8KGYmNjMpPDwxMnwoZSY2Myk8PDZ8ZyY2Myk7ZWxzZSB0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCBzdGFydGluZyBieXRlOiBcIitkKTt9LFVURjE2dG9VVEY4OmZ1bmN0aW9uKGEsYyl7Zm9yKHZhciBkLGU9bnVsbDtudWxsIT09KGQ9bnVsbCE9PWU/ZTphKCkpOyk1NTI5Njw9ZCYmNTczNDM+PWQmJm51bGwhPT0oZT1hKCkpJiY1NjMyMDw9ZSYmNTczNDM+PWU/KGMoMTAyNCooZC01NTI5NikrZS01NjMyMCs2NTUzNiksXHJcbmU9bnVsbCk6YyhkKTtudWxsIT09ZSYmYyhlKX0sVVRGOHRvVVRGMTY6ZnVuY3Rpb24oYSxjKXt2YXIgZD1udWxsO1wibnVtYmVyXCI9PT10eXBlb2YgYSYmKGQ9YSxhPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9KTtmb3IoO251bGwhPT1kfHxudWxsIT09KGQ9YSgpKTspNjU1MzU+PWQ/YyhkKTooZC09NjU1MzYsYygoZD4+MTApKzU1Mjk2KSxjKGQlMTAyNCs1NjMyMCkpLGQ9bnVsbH0sZW5jb2RlVVRGMTZ0b1VURjg6ZnVuY3Rpb24oYixjKXthLlVURjE2dG9VVEY4KGIsZnVuY3Rpb24oYil7YS5lbmNvZGVVVEY4KGIsYyl9KX0sZGVjb2RlVVRGOHRvVVRGMTY6ZnVuY3Rpb24oYixjKXthLmRlY29kZVVURjgoYixmdW5jdGlvbihiKXthLlVURjh0b1VURjE2KGIsYyl9KX0sY2FsY3VsYXRlQ29kZVBvaW50OmZ1bmN0aW9uKGEpe3JldHVybiAxMjg+YT8xOjIwNDg+YT8yOjY1NTM2PmE/Mzo0fSxjYWxjdWxhdGVVVEY4OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxkPTA7bnVsbCE9PShjPWEoKSk7KWQrPVxyXG4xMjg+Yz8xOjIwNDg+Yz8yOjY1NTM2PmM/Mzo0O3JldHVybiBkfSxjYWxjdWxhdGVVVEYxNmFzVVRGODpmdW5jdGlvbihiKXt2YXIgYz0wLGQ9MDthLlVURjE2dG9VVEY4KGIsZnVuY3Rpb24oYSl7KytjO2QrPTEyOD5hPzE6MjA0OD5hPzI6NjU1MzY+YT8zOjR9KTtyZXR1cm5bYyxkXX19O3JldHVybiBhfSgpO2UudG9VVEY4PWZ1bmN0aW9uKGEsYil7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBhJiYoYT10aGlzLm9mZnNldCk7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiJiYoYj10aGlzLmxpbWl0KTtpZighdGhpcy5ub0Fzc2VydCl7aWYoXCJudW1iZXJcIiE9PXR5cGVvZiBhfHwwIT09YSUxKXRocm93IFR5cGVFcnJvcihcIklsbGVnYWwgYmVnaW46IE5vdCBhbiBpbnRlZ2VyXCIpO2E+Pj49MDtpZihcIm51bWJlclwiIT09dHlwZW9mIGJ8fDAhPT1iJTEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBlbmQ6IE5vdCBhbiBpbnRlZ2VyXCIpO2I+Pj49MDtpZigwPmF8fGE+Ynx8Yj50aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKXRocm93IFJhbmdlRXJyb3IoXCJJbGxlZ2FsIHJhbmdlOiAwIDw9IFwiK1xyXG5hK1wiIDw9IFwiK2IrXCIgPD0gXCIrdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCk7fXZhciBjO3RyeXtuLmRlY29kZVVURjh0b1VURjE2KGZ1bmN0aW9uKCl7cmV0dXJuIGE8Yj90aGlzLnZpZXdbYSsrXTpudWxsfS5iaW5kKHRoaXMpLGM9cigpKX1jYXRjaChkKXtpZihhIT09Yil0aHJvdyBSYW5nZUVycm9yKFwiSWxsZWdhbCByYW5nZTogVHJ1bmNhdGVkIGRhdGEsIFwiK2ErXCIgIT0gXCIrYik7fXJldHVybiBjKCl9O2guZnJvbVVURjg9ZnVuY3Rpb24oYSxiLGMpe2lmKCFjJiZcInN0cmluZ1wiIT09dHlwZW9mIGEpdGhyb3cgVHlwZUVycm9yKFwiSWxsZWdhbCBzdHI6IE5vdCBhIHN0cmluZ1wiKTt2YXIgZD1uZXcgaChuLmNhbGN1bGF0ZVVURjE2YXNVVEY4KG0oYSksITApWzFdLGIsYyksZT0wO24uZW5jb2RlVVRGMTZ0b1VURjgobShhKSxmdW5jdGlvbihhKXtkLnZpZXdbZSsrXT1hfSk7ZC5saW1pdD1lO3JldHVybiBkfTtyZXR1cm4gaH0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2MubmV0bWFuYWdlci5pbml0KCk7XHJcbiAgICAgICAgY2MubmV0bWFuYWdlci5yZWdpc3RlckhhbmRsZXIoY2MuZ3VpbWFuYWdlcik7XHJcbiAgICAgICAgY2Muc2NlbmVtYW5hZ2VyLmxvYWRMb2dpblNjZW5lKCk7XHJcbiAgICAgICAgY2MubG9nKCdvbmxvYWQnKVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiLypcclxuIENvcHlyaWdodCAyMDEzIERhbmllbCBXaXJ0eiA8ZGNvZGVAZGNvZGUuaW8+XHJcbiBDb3B5cmlnaHQgMjAwOSBUaGUgQ2xvc3VyZSBMaWJyYXJ5IEF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcblxyXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG5cclxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMtSVNcIiBCQVNJUyxcclxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBsaWNlbnNlIGxvbmcuanMgKGMpIDIwMTMgRGFuaWVsIFdpcnR6IDxkY29kZUBkY29kZS5pbz5cclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMFxyXG4gKiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kY29kZUlPL2xvbmcuanMgZm9yIGRldGFpbHNcclxuICovXHJcbihmdW5jdGlvbihnbG9iYWwsIGZhY3RvcnkpIHtcclxuXHJcbiAgICAvKiBBTUQgKi8gaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lW1wiYW1kXCJdKVxyXG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XHJcbiAgICAvKiBDb21tb25KUyAqLyBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZSAmJiBtb2R1bGVbXCJleHBvcnRzXCJdKVxyXG4gICAgICAgIG1vZHVsZVtcImV4cG9ydHNcIl0gPSBmYWN0b3J5KCk7XHJcbiAgICAvKiBHbG9iYWwgKi8gZWxzZVxyXG4gICAgICAgIChnbG9iYWxbXCJkY29kZUlPXCJdID0gZ2xvYmFsW1wiZGNvZGVJT1wiXSB8fCB7fSlbXCJMb25nXCJdID0gZmFjdG9yeSgpO1xyXG5cclxufSkodGhpcywgZnVuY3Rpb24oKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdHMgYSA2NCBiaXQgdHdvJ3MtY29tcGxlbWVudCBpbnRlZ2VyLCBnaXZlbiBpdHMgbG93IGFuZCBoaWdoIDMyIGJpdCB2YWx1ZXMgYXMgKnNpZ25lZCogaW50ZWdlcnMuXHJcbiAgICAgKiAgU2VlIHRoZSBmcm9tKiBmdW5jdGlvbnMgYmVsb3cgZm9yIG1vcmUgY29udmVuaWVudCB3YXlzIG9mIGNvbnN0cnVjdGluZyBMb25ncy5cclxuICAgICAqIEBleHBvcnRzIExvbmdcclxuICAgICAqIEBjbGFzcyBBIExvbmcgY2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIDY0IGJpdCB0d28ncy1jb21wbGVtZW50IGludGVnZXIgdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG93IFRoZSBsb3cgKHNpZ25lZCkgMzIgYml0cyBvZiB0aGUgbG9uZ1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhpZ2ggVGhlIGhpZ2ggKHNpZ25lZCkgMzIgYml0cyBvZiB0aGUgbG9uZ1xyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIHNpZ25lZFxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIExvbmcobG93LCBoaWdoLCB1bnNpZ25lZCkge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbG93IDMyIGJpdHMgYXMgYSBzaWduZWQgdmFsdWUuXHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sb3cgPSBsb3cgfCAwO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgaGlnaCAzMiBiaXRzIGFzIGEgc2lnbmVkIHZhbHVlLlxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaGlnaCA9IGhpZ2ggfCAwO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGV0aGVyIHVuc2lnbmVkIG9yIG5vdC5cclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy51bnNpZ25lZCA9ICEhdW5zaWduZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIGEgbG9uZyBpcyB0aGUgdHdvIGdpdmVuIHNpZ25lZCwgMzItYml0IHZhbHVlcy5cclxuICAgIC8vIFdlIHVzZSAzMi1iaXQgcGllY2VzIGJlY2F1c2UgdGhlc2UgYXJlIHRoZSBzaXplIG9mIGludGVnZXJzIG9uIHdoaWNoXHJcbiAgICAvLyBKYXZhc2NyaXB0IHBlcmZvcm1zIGJpdC1vcGVyYXRpb25zLiAgRm9yIG9wZXJhdGlvbnMgbGlrZSBhZGRpdGlvbiBhbmRcclxuICAgIC8vIG11bHRpcGxpY2F0aW9uLCB3ZSBzcGxpdCBlYWNoIG51bWJlciBpbnRvIDE2IGJpdCBwaWVjZXMsIHdoaWNoIGNhbiBlYXNpbHkgYmVcclxuICAgIC8vIG11bHRpcGxpZWQgd2l0aGluIEphdmFzY3JpcHQncyBmbG9hdGluZy1wb2ludCByZXByZXNlbnRhdGlvbiB3aXRob3V0IG92ZXJmbG93XHJcbiAgICAvLyBvciBjaGFuZ2UgaW4gc2lnbi5cclxuICAgIC8vXHJcbiAgICAvLyBJbiB0aGUgYWxnb3JpdGhtcyBiZWxvdywgd2UgZnJlcXVlbnRseSByZWR1Y2UgdGhlIG5lZ2F0aXZlIGNhc2UgdG8gdGhlXHJcbiAgICAvLyBwb3NpdGl2ZSBjYXNlIGJ5IG5lZ2F0aW5nIHRoZSBpbnB1dChzKSBhbmQgdGhlbiBwb3N0LXByb2Nlc3NpbmcgdGhlIHJlc3VsdC5cclxuICAgIC8vIE5vdGUgdGhhdCB3ZSBtdXN0IEFMV0FZUyBjaGVjayBzcGVjaWFsbHkgd2hldGhlciB0aG9zZSB2YWx1ZXMgYXJlIE1JTl9WQUxVRVxyXG4gICAgLy8gKC0yXjYzKSBiZWNhdXNlIC1NSU5fVkFMVUUgPT0gTUlOX1ZBTFVFIChzaW5jZSAyXjYzIGNhbm5vdCBiZSByZXByZXNlbnRlZCBhc1xyXG4gICAgLy8gYSBwb3NpdGl2ZSBudW1iZXIsIGl0IG92ZXJmbG93cyBiYWNrIGludG8gYSBuZWdhdGl2ZSkuICBOb3QgaGFuZGxpbmcgdGhpc1xyXG4gICAgLy8gY2FzZSB3b3VsZCBvZnRlbiByZXN1bHQgaW4gaW5maW5pdGUgcmVjdXJzaW9uLlxyXG4gICAgLy9cclxuICAgIC8vIENvbW1vbiBjb25zdGFudCB2YWx1ZXMgWkVSTywgT05FLCBORUdfT05FLCBldGMuIGFyZSBkZWZpbmVkIGJlbG93IHRoZSBmcm9tKlxyXG4gICAgLy8gbWV0aG9kcyBvbiB3aGljaCB0aGV5IGRlcGVuZC5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIGluZGljYXRvciB1c2VkIHRvIHJlbGlhYmx5IGRldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBMb25nIG9yIG5vdC5cclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBMb25nLnByb3RvdHlwZS5fX2lzTG9uZ19fO1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMb25nLnByb3RvdHlwZSwgXCJfX2lzTG9uZ19fXCIsIHtcclxuICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHsqfSBvYmogT2JqZWN0XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpc0xvbmcob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIChvYmogJiYgb2JqW1wiX19pc0xvbmdfX1wiXSkgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGUgc3BlY2lmaWVkIG9iamVjdCBpcyBhIExvbmcuXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7Kn0gb2JqIE9iamVjdFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuaXNMb25nID0gaXNMb25nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBjYWNoZSBvZiB0aGUgTG9uZyByZXByZXNlbnRhdGlvbnMgb2Ygc21hbGwgaW50ZWdlciB2YWx1ZXMuXHJcbiAgICAgKiBAdHlwZSB7IU9iamVjdH1cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgSU5UX0NBQ0hFID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIGNhY2hlIG9mIHRoZSBMb25nIHJlcHJlc2VudGF0aW9ucyBvZiBzbWFsbCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy5cclxuICAgICAqIEB0eXBlIHshT2JqZWN0fVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBVSU5UX0NBQ0hFID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZnJvbUludCh2YWx1ZSwgdW5zaWduZWQpIHtcclxuICAgICAgICB2YXIgb2JqLCBjYWNoZWRPYmosIGNhY2hlO1xyXG4gICAgICAgIGlmICh1bnNpZ25lZCkge1xyXG4gICAgICAgICAgICB2YWx1ZSA+Pj49IDA7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZSA9ICgwIDw9IHZhbHVlICYmIHZhbHVlIDwgMjU2KSkge1xyXG4gICAgICAgICAgICAgICAgY2FjaGVkT2JqID0gVUlOVF9DQUNIRVt2YWx1ZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGVkT2JqKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRPYmo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2JqID0gZnJvbUJpdHModmFsdWUsICh2YWx1ZSB8IDApIDwgMCA/IC0xIDogMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZSlcclxuICAgICAgICAgICAgICAgIFVJTlRfQ0FDSEVbdmFsdWVdID0gb2JqO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlIHw9IDA7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZSA9ICgtMTI4IDw9IHZhbHVlICYmIHZhbHVlIDwgMTI4KSkge1xyXG4gICAgICAgICAgICAgICAgY2FjaGVkT2JqID0gSU5UX0NBQ0hFW3ZhbHVlXTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZWRPYmopXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlZE9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvYmogPSBmcm9tQml0cyh2YWx1ZSwgdmFsdWUgPCAwID8gLTEgOiAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZSlcclxuICAgICAgICAgICAgICAgIElOVF9DQUNIRVt2YWx1ZV0gPSBvYmo7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIExvbmcgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiAzMiBiaXQgaW50ZWdlciB2YWx1ZS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIFRoZSAzMiBiaXQgaW50ZWdlciBpbiBxdWVzdGlvblxyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIHNpZ25lZFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuZnJvbUludCA9IGZyb21JbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZnJvbU51bWJlcih2YWx1ZSwgdW5zaWduZWQpIHtcclxuICAgICAgICBpZiAoaXNOYU4odmFsdWUpIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiB1bnNpZ25lZCA/IFVaRVJPIDogWkVSTztcclxuICAgICAgICBpZiAodW5zaWduZWQpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMClcclxuICAgICAgICAgICAgICAgIHJldHVybiBVWkVSTztcclxuICAgICAgICAgICAgaWYgKHZhbHVlID49IFRXT19QV1JfNjRfREJMKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1BWF9VTlNJR05FRF9WQUxVRTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPD0gLVRXT19QV1JfNjNfREJMKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1JTl9WQUxVRTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICsgMSA+PSBUV09fUFdSXzYzX0RCTClcclxuICAgICAgICAgICAgICAgIHJldHVybiBNQVhfVkFMVUU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWx1ZSA8IDApXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tTnVtYmVyKC12YWx1ZSwgdW5zaWduZWQpLm5lZygpO1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cygodmFsdWUgJSBUV09fUFdSXzMyX0RCTCkgfCAwLCAodmFsdWUgLyBUV09fUFdSXzMyX0RCTCkgfCAwLCB1bnNpZ25lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgTG9uZyByZXByZXNlbnRpbmcgdGhlIGdpdmVuIHZhbHVlLCBwcm92aWRlZCB0aGF0IGl0IGlzIGEgZmluaXRlIG51bWJlci4gT3RoZXJ3aXNlLCB6ZXJvIGlzIHJldHVybmVkLlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgVGhlIG51bWJlciBpbiBxdWVzdGlvblxyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIHNpZ25lZFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuZnJvbU51bWJlciA9IGZyb21OdW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG93Qml0c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhpZ2hCaXRzXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZyb21CaXRzKGxvd0JpdHMsIGhpZ2hCaXRzLCB1bnNpZ25lZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTG9uZyhsb3dCaXRzLCBoaWdoQml0cywgdW5zaWduZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIExvbmcgcmVwcmVzZW50aW5nIHRoZSA2NCBiaXQgaW50ZWdlciB0aGF0IGNvbWVzIGJ5IGNvbmNhdGVuYXRpbmcgdGhlIGdpdmVuIGxvdyBhbmQgaGlnaCBiaXRzLiBFYWNoIGlzXHJcbiAgICAgKiAgYXNzdW1lZCB0byB1c2UgMzIgYml0cy5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvd0JpdHMgVGhlIGxvdyAzMiBiaXRzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGlnaEJpdHMgVGhlIGhpZ2ggMzIgYml0c1xyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIHNpZ25lZFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuZnJvbUJpdHMgPSBmcm9tQml0cztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJhc2VcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBleHBvbmVudFxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgcG93X2RibCA9IE1hdGgucG93OyAvLyBVc2VkIDQgdGltZXMgKDQqOCB0byAxNSs0KVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxudW1iZXIpPX0gdW5zaWduZWRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gcmFkaXhcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmcm9tU3RyaW5nKHN0ciwgdW5zaWduZWQsIHJhZGl4KSB7XHJcbiAgICAgICAgaWYgKHN0ci5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdlbXB0eSBzdHJpbmcnKTtcclxuICAgICAgICBpZiAoc3RyID09PSBcIk5hTlwiIHx8IHN0ciA9PT0gXCJJbmZpbml0eVwiIHx8IHN0ciA9PT0gXCIrSW5maW5pdHlcIiB8fCBzdHIgPT09IFwiLUluZmluaXR5XCIpXHJcbiAgICAgICAgICAgIHJldHVybiBaRVJPO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdW5zaWduZWQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIC8vIEZvciBnb29nLm1hdGgubG9uZyBjb21wYXRpYmlsaXR5XHJcbiAgICAgICAgICAgIHJhZGl4ID0gdW5zaWduZWQsXHJcbiAgICAgICAgICAgIHVuc2lnbmVkID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdW5zaWduZWQgPSAhISB1bnNpZ25lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmFkaXggPSByYWRpeCB8fCAxMDtcclxuICAgICAgICBpZiAocmFkaXggPCAyIHx8IDM2IDwgcmFkaXgpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ3JhZGl4Jyk7XHJcblxyXG4gICAgICAgIHZhciBwO1xyXG4gICAgICAgIGlmICgocCA9IHN0ci5pbmRleE9mKCctJykpID4gMClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2ludGVyaW9yIGh5cGhlbicpO1xyXG4gICAgICAgIGVsc2UgaWYgKHAgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZyb21TdHJpbmcoc3RyLnN1YnN0cmluZygxKSwgdW5zaWduZWQsIHJhZGl4KS5uZWcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERvIHNldmVyYWwgKDgpIGRpZ2l0cyBlYWNoIHRpbWUgdGhyb3VnaCB0aGUgbG9vcCwgc28gYXMgdG9cclxuICAgICAgICAvLyBtaW5pbWl6ZSB0aGUgY2FsbHMgdG8gdGhlIHZlcnkgZXhwZW5zaXZlIGVtdWxhdGVkIGRpdi5cclxuICAgICAgICB2YXIgcmFkaXhUb1Bvd2VyID0gZnJvbU51bWJlcihwb3dfZGJsKHJhZGl4LCA4KSk7XHJcblxyXG4gICAgICAgIHZhciByZXN1bHQgPSBaRVJPO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSArPSA4KSB7XHJcbiAgICAgICAgICAgIHZhciBzaXplID0gTWF0aC5taW4oOCwgc3RyLmxlbmd0aCAtIGkpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKGksIGkgKyBzaXplKSwgcmFkaXgpO1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA8IDgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwb3dlciA9IGZyb21OdW1iZXIocG93X2RibChyYWRpeCwgc2l6ZSkpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Lm11bChwb3dlcikuYWRkKGZyb21OdW1iZXIodmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5tdWwocmFkaXhUb1Bvd2VyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5hZGQoZnJvbU51bWJlcih2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3VsdC51bnNpZ25lZCA9IHVuc2lnbmVkO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgTG9uZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gc3RyaW5nLCB3cml0dGVuIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmFkaXguXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIExvbmdcclxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58bnVtYmVyKT19IHVuc2lnbmVkIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LCBkZWZhdWx0cyB0byBgZmFsc2VgIGZvciBzaWduZWRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gcmFkaXggVGhlIHJhZGl4IGluIHdoaWNoIHRoZSB0ZXh0IGlzIHdyaXR0ZW4gKDItMzYpLCBkZWZhdWx0cyB0byAxMFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuZnJvbVN0cmluZyA9IGZyb21TdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ3whe2xvdzogbnVtYmVyLCBoaWdoOiBudW1iZXIsIHVuc2lnbmVkOiBib29sZWFufX0gdmFsXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZnJvbVZhbHVlKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwgLyogaXMgY29tcGF0aWJsZSAqLyBpbnN0YW5jZW9mIExvbmcpXHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKVxyXG4gICAgICAgICAgICByZXR1cm4gZnJvbU51bWJlcih2YWwpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgcmV0dXJuIGZyb21TdHJpbmcodmFsKTtcclxuICAgICAgICAvLyBUaHJvd3MgZm9yIG5vbi1vYmplY3RzLCBjb252ZXJ0cyBub24taW5zdGFuY2VvZiBMb25nOlxyXG4gICAgICAgIHJldHVybiBmcm9tQml0cyh2YWwubG93LCB2YWwuaGlnaCwgdmFsLnVuc2lnbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgdmFsdWUgdG8gYSBMb25nLlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd8IXtsb3c6IG51bWJlciwgaGlnaDogbnVtYmVyLCB1bnNpZ25lZDogYm9vbGVhbn19IHZhbCBWYWx1ZVxyXG4gICAgICogQHJldHVybnMgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLmZyb21WYWx1ZSA9IGZyb21WYWx1ZTtcclxuXHJcbiAgICAvLyBOT1RFOiB0aGUgY29tcGlsZXIgc2hvdWxkIGlubGluZSB0aGVzZSBjb25zdGFudCB2YWx1ZXMgYmVsb3cgYW5kIHRoZW4gcmVtb3ZlIHRoZXNlIHZhcmlhYmxlcywgc28gdGhlcmUgc2hvdWxkIGJlXHJcbiAgICAvLyBubyBydW50aW1lIHBlbmFsdHkgZm9yIHRoZXNlLlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBUV09fUFdSXzE2X0RCTCA9IDEgPDwgMTY7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFRXT19QV1JfMjRfREJMID0gMSA8PCAyNDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgVFdPX1BXUl8zMl9EQkwgPSBUV09fUFdSXzE2X0RCTCAqIFRXT19QV1JfMTZfREJMO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBUV09fUFdSXzY0X0RCTCA9IFRXT19QV1JfMzJfREJMICogVFdPX1BXUl8zMl9EQkw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFRXT19QV1JfNjNfREJMID0gVFdPX1BXUl82NF9EQkwgLyAyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFRXT19QV1JfMjQgPSBmcm9tSW50KFRXT19QV1JfMjRfREJMKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgWkVSTyA9IGZyb21JbnQoMCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaWduZWQgemVyby5cclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5aRVJPID0gWkVSTztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgVVpFUk8gPSBmcm9tSW50KDAsIHRydWUpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5zaWduZWQgemVyby5cclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5VWkVSTyA9IFVaRVJPO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBPTkUgPSBmcm9tSW50KDEpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2lnbmVkIG9uZS5cclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5PTkUgPSBPTkU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAaW5uZXJcclxuICAgICAqL1xyXG4gICAgdmFyIFVPTkUgPSBmcm9tSW50KDEsIHRydWUpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5zaWduZWQgb25lLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLlVPTkUgPSBVT05FO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBORUdfT05FID0gZnJvbUludCgtMSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaWduZWQgbmVnYXRpdmUgb25lLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLk5FR19PTkUgPSBORUdfT05FO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBNQVhfVkFMVUUgPSBmcm9tQml0cygweEZGRkZGRkZGfDAsIDB4N0ZGRkZGRkZ8MCwgZmFsc2UpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF4aW11bSBzaWduZWQgdmFsdWUuXHJcbiAgICAgKiBAdHlwZSB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmcuTUFYX1ZBTFVFID0gTUFYX1ZBTFVFO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGlubmVyXHJcbiAgICAgKi9cclxuICAgIHZhciBNQVhfVU5TSUdORURfVkFMVUUgPSBmcm9tQml0cygweEZGRkZGRkZGfDAsIDB4RkZGRkZGRkZ8MCwgdHJ1ZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXhpbXVtIHVuc2lnbmVkIHZhbHVlLlxyXG4gICAgICogQHR5cGUgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nLk1BWF9VTlNJR05FRF9WQUxVRSA9IE1BWF9VTlNJR05FRF9WQUxVRTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgTUlOX1ZBTFVFID0gZnJvbUJpdHMoMCwgMHg4MDAwMDAwMHwwLCBmYWxzZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNaW5pbXVtIHNpZ25lZCB2YWx1ZS5cclxuICAgICAqIEB0eXBlIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZy5NSU5fVkFMVUUgPSBNSU5fVkFMVUU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAYWxpYXMgTG9uZy5wcm90b3R5cGVcclxuICAgICAqIEBpbm5lclxyXG4gICAgICovXHJcbiAgICB2YXIgTG9uZ1Byb3RvdHlwZSA9IExvbmcucHJvdG90eXBlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhlIExvbmcgdG8gYSAzMiBiaXQgaW50ZWdlciwgYXNzdW1pbmcgaXQgaXMgYSAzMiBiaXQgaW50ZWdlci5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUudG9JbnQgPSBmdW5jdGlvbiB0b0ludCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51bnNpZ25lZCA/IHRoaXMubG93ID4+PiAwIDogdGhpcy5sb3c7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhlIExvbmcgdG8gYSB0aGUgbmVhcmVzdCBmbG9hdGluZy1wb2ludCByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHZhbHVlIChkb3VibGUsIDUzIGJpdCBtYW50aXNzYSkuXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnRvTnVtYmVyID0gZnVuY3Rpb24gdG9OdW1iZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudW5zaWduZWQpXHJcbiAgICAgICAgICAgIHJldHVybiAoKHRoaXMuaGlnaCA+Pj4gMCkgKiBUV09fUFdSXzMyX0RCTCkgKyAodGhpcy5sb3cgPj4+IDApO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2ggKiBUV09fUFdSXzMyX0RCTCArICh0aGlzLmxvdyA+Pj4gMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhlIExvbmcgdG8gYSBzdHJpbmcgd3JpdHRlbiBpbiB0aGUgc3BlY2lmaWVkIHJhZGl4LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXI9fSByYWRpeCBSYWRpeCAoMi0zNiksIGRlZmF1bHRzIHRvIDEwXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICogQG92ZXJyaWRlXHJcbiAgICAgKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBJZiBgcmFkaXhgIGlzIG91dCBvZiByYW5nZVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcocmFkaXgpIHtcclxuICAgICAgICByYWRpeCA9IHJhZGl4IHx8IDEwO1xyXG4gICAgICAgIGlmIChyYWRpeCA8IDIgfHwgMzYgPCByYWRpeClcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcigncmFkaXgnKTtcclxuICAgICAgICBpZiAodGhpcy5pc1plcm8oKSlcclxuICAgICAgICAgICAgcmV0dXJuICcwJztcclxuICAgICAgICBpZiAodGhpcy5pc05lZ2F0aXZlKCkpIHsgLy8gVW5zaWduZWQgTG9uZ3MgYXJlIG5ldmVyIG5lZ2F0aXZlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVxKE1JTl9WQUxVRSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gY2hhbmdlIHRoZSBMb25nIHZhbHVlIGJlZm9yZSBpdCBjYW4gYmUgbmVnYXRlZCwgc28gd2UgcmVtb3ZlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgYm90dG9tLW1vc3QgZGlnaXQgaW4gdGhpcyBiYXNlIGFuZCB0aGVuIHJlY3Vyc2UgdG8gZG8gdGhlIHJlc3QuXHJcbiAgICAgICAgICAgICAgICB2YXIgcmFkaXhMb25nID0gZnJvbU51bWJlcihyYWRpeCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2ID0gdGhpcy5kaXYocmFkaXhMb25nKSxcclxuICAgICAgICAgICAgICAgICAgICByZW0xID0gZGl2Lm11bChyYWRpeExvbmcpLnN1Yih0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaXYudG9TdHJpbmcocmFkaXgpICsgcmVtMS50b0ludCgpLnRvU3RyaW5nKHJhZGl4KTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJy0nICsgdGhpcy5uZWcoKS50b1N0cmluZyhyYWRpeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEbyBzZXZlcmFsICg2KSBkaWdpdHMgZWFjaCB0aW1lIHRocm91Z2ggdGhlIGxvb3AsIHNvIGFzIHRvXHJcbiAgICAgICAgLy8gbWluaW1pemUgdGhlIGNhbGxzIHRvIHRoZSB2ZXJ5IGV4cGVuc2l2ZSBlbXVsYXRlZCBkaXYuXHJcbiAgICAgICAgdmFyIHJhZGl4VG9Qb3dlciA9IGZyb21OdW1iZXIocG93X2RibChyYWRpeCwgNiksIHRoaXMudW5zaWduZWQpLFxyXG4gICAgICAgICAgICByZW0gPSB0aGlzO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVtRGl2ID0gcmVtLmRpdihyYWRpeFRvUG93ZXIpLFxyXG4gICAgICAgICAgICAgICAgaW50dmFsID0gcmVtLnN1YihyZW1EaXYubXVsKHJhZGl4VG9Qb3dlcikpLnRvSW50KCkgPj4+IDAsXHJcbiAgICAgICAgICAgICAgICBkaWdpdHMgPSBpbnR2YWwudG9TdHJpbmcocmFkaXgpO1xyXG4gICAgICAgICAgICByZW0gPSByZW1EaXY7XHJcbiAgICAgICAgICAgIGlmIChyZW0uaXNaZXJvKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlnaXRzICsgcmVzdWx0O1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChkaWdpdHMubGVuZ3RoIDwgNilcclxuICAgICAgICAgICAgICAgICAgICBkaWdpdHMgPSAnMCcgKyBkaWdpdHM7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAnJyArIGRpZ2l0cyArIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBoaWdoIDMyIGJpdHMgYXMgYSBzaWduZWQgaW50ZWdlci5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFNpZ25lZCBoaWdoIGJpdHNcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5nZXRIaWdoQml0cyA9IGZ1bmN0aW9uIGdldEhpZ2hCaXRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2g7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgaGlnaCAzMiBiaXRzIGFzIGFuIHVuc2lnbmVkIGludGVnZXIuXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBVbnNpZ25lZCBoaWdoIGJpdHNcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5nZXRIaWdoQml0c1Vuc2lnbmVkID0gZnVuY3Rpb24gZ2V0SGlnaEJpdHNVbnNpZ25lZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaWdoID4+PiAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGxvdyAzMiBiaXRzIGFzIGEgc2lnbmVkIGludGVnZXIuXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBTaWduZWQgbG93IGJpdHNcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5nZXRMb3dCaXRzID0gZnVuY3Rpb24gZ2V0TG93Qml0cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb3c7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgbG93IDMyIGJpdHMgYXMgYW4gdW5zaWduZWQgaW50ZWdlci5cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFVuc2lnbmVkIGxvdyBiaXRzXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuZ2V0TG93Qml0c1Vuc2lnbmVkID0gZnVuY3Rpb24gZ2V0TG93Qml0c1Vuc2lnbmVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvdyA+Pj4gMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgYml0cyBuZWVkZWQgdG8gcmVwcmVzZW50IHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiB0aGlzIExvbmcuXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmdldE51bUJpdHNBYnMgPSBmdW5jdGlvbiBnZXROdW1CaXRzQWJzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTmVnYXRpdmUoKSkgLy8gVW5zaWduZWQgTG9uZ3MgYXJlIG5ldmVyIG5lZ2F0aXZlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVxKE1JTl9WQUxVRSkgPyA2NCA6IHRoaXMubmVnKCkuZ2V0TnVtQml0c0FicygpO1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzLmhpZ2ggIT0gMCA/IHRoaXMuaGlnaCA6IHRoaXMubG93O1xyXG4gICAgICAgIGZvciAodmFyIGJpdCA9IDMxOyBiaXQgPiAwOyBiaXQtLSlcclxuICAgICAgICAgICAgaWYgKCh2YWwgJiAoMSA8PCBiaXQpKSAhPSAwKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaCAhPSAwID8gYml0ICsgMzMgOiBiaXQgKyAxO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGVxdWFscyB6ZXJvLlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuaXNaZXJvID0gZnVuY3Rpb24gaXNaZXJvKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2ggPT09IDAgJiYgdGhpcy5sb3cgPT09IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgbmVnYXRpdmUuXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5pc05lZ2F0aXZlID0gZnVuY3Rpb24gaXNOZWdhdGl2ZSgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMudW5zaWduZWQgJiYgdGhpcy5oaWdoIDwgMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBwb3NpdGl2ZS5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmlzUG9zaXRpdmUgPSBmdW5jdGlvbiBpc1Bvc2l0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuc2lnbmVkIHx8IHRoaXMuaGlnaCA+PSAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIG9kZC5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmlzT2RkID0gZnVuY3Rpb24gaXNPZGQoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmxvdyAmIDEpID09PSAxO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGV2ZW4uXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5pc0V2ZW4gPSBmdW5jdGlvbiBpc0V2ZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmxvdyAmIDEpID09PSAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGVxdWFscyB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMob3RoZXIpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhvdGhlcikpXHJcbiAgICAgICAgICAgIG90aGVyID0gZnJvbVZhbHVlKG90aGVyKTtcclxuICAgICAgICBpZiAodGhpcy51bnNpZ25lZCAhPT0gb3RoZXIudW5zaWduZWQgJiYgKHRoaXMuaGlnaCA+Pj4gMzEpID09PSAxICYmIChvdGhlci5oaWdoID4+PiAzMSkgPT09IDEpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5oaWdoID09PSBvdGhlci5oaWdoICYmIHRoaXMubG93ID09PSBvdGhlci5sb3c7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZXF1YWxzIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNlcXVhbHN9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5lcSA9IExvbmdQcm90b3R5cGUuZXF1YWxzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZGlmZmVycyBmcm9tIHRoZSBzcGVjaWZpZWQncy5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLm5vdEVxdWFscyA9IGZ1bmN0aW9uIG5vdEVxdWFscyhvdGhlcikge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5lcSgvKiB2YWxpZGF0ZXMgKi8gb3RoZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGRpZmZlcnMgZnJvbSB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbm90RXF1YWxzfS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubmVxID0gTG9uZ1Byb3RvdHlwZS5ub3RFcXVhbHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIHNwZWNpZmllZCdzLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubGVzc1RoYW4gPSBmdW5jdGlvbiBsZXNzVGhhbihvdGhlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXAoLyogdmFsaWRhdGVzICovIG90aGVyKSA8IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgbGVzcyB0aGFuIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNsZXNzVGhhbn0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmx0ID0gTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbk9yRXF1YWwgPSBmdW5jdGlvbiBsZXNzVGhhbk9yRXF1YWwob3RoZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wKC8qIHZhbGlkYXRlcyAqLyBvdGhlcikgPD0gMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdGhlIHNwZWNpZmllZCdzLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2xlc3NUaGFuT3JFcXVhbH0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmx0ZSA9IExvbmdQcm90b3R5cGUubGVzc1RoYW5PckVxdWFsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBzcGVjaWZpZWQncy5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmdyZWF0ZXJUaGFuID0gZnVuY3Rpb24gZ3JlYXRlclRoYW4ob3RoZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wKC8qIHZhbGlkYXRlcyAqLyBvdGhlcikgPiAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjZ3JlYXRlclRoYW59LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5ndCA9IExvbmdQcm90b3R5cGUuZ3JlYXRlclRoYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdGhlIHNwZWNpZmllZCdzLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuZ3JlYXRlclRoYW5PckVxdWFsID0gZnVuY3Rpb24gZ3JlYXRlclRoYW5PckVxdWFsKG90aGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcCgvKiB2YWxpZGF0ZXMgKi8gb3RoZXIpID49IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNncmVhdGVyVGhhbk9yRXF1YWx9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5ndGUgPSBMb25nUHJvdG90eXBlLmdyZWF0ZXJUaGFuT3JFcXVhbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXBhcmVzIHRoaXMgTG9uZydzIHZhbHVlIHdpdGggdGhlIHNwZWNpZmllZCdzLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gMCBpZiB0aGV5IGFyZSB0aGUgc2FtZSwgMSBpZiB0aGUgdGhpcyBpcyBncmVhdGVyIGFuZCAtMVxyXG4gICAgICogIGlmIHRoZSBnaXZlbiBvbmUgaXMgZ3JlYXRlclxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlKG90aGVyKSB7XHJcbiAgICAgICAgaWYgKCFpc0xvbmcob3RoZXIpKVxyXG4gICAgICAgICAgICBvdGhlciA9IGZyb21WYWx1ZShvdGhlcik7XHJcbiAgICAgICAgaWYgKHRoaXMuZXEob3RoZXIpKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB2YXIgdGhpc05lZyA9IHRoaXMuaXNOZWdhdGl2ZSgpLFxyXG4gICAgICAgICAgICBvdGhlck5lZyA9IG90aGVyLmlzTmVnYXRpdmUoKTtcclxuICAgICAgICBpZiAodGhpc05lZyAmJiAhb3RoZXJOZWcpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICBpZiAoIXRoaXNOZWcgJiYgb3RoZXJOZWcpXHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHNpZ24gYml0cyBhcmUgdGhlIHNhbWVcclxuICAgICAgICBpZiAoIXRoaXMudW5zaWduZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikuaXNOZWdhdGl2ZSgpID8gLTEgOiAxO1xyXG4gICAgICAgIC8vIEJvdGggYXJlIHBvc2l0aXZlIGlmIGF0IGxlYXN0IG9uZSBpcyB1bnNpZ25lZFxyXG4gICAgICAgIHJldHVybiAob3RoZXIuaGlnaCA+Pj4gMCkgPiAodGhpcy5oaWdoID4+PiAwKSB8fCAob3RoZXIuaGlnaCA9PT0gdGhpcy5oaWdoICYmIChvdGhlci5sb3cgPj4+IDApID4gKHRoaXMubG93ID4+PiAwKSkgPyAtMSA6IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcGFyZXMgdGhpcyBMb25nJ3MgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjY29tcGFyZX0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IDAgaWYgdGhleSBhcmUgdGhlIHNhbWUsIDEgaWYgdGhlIHRoaXMgaXMgZ3JlYXRlciBhbmQgLTFcclxuICAgICAqICBpZiB0aGUgZ2l2ZW4gb25lIGlzIGdyZWF0ZXJcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5jb21wID0gTG9uZ1Byb3RvdHlwZS5jb21wYXJlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTmVnYXRlcyB0aGlzIExvbmcncyB2YWx1ZS5cclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gTmVnYXRlZCBMb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24gbmVnYXRlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy51bnNpZ25lZCAmJiB0aGlzLmVxKE1JTl9WQUxVRSkpXHJcbiAgICAgICAgICAgIHJldHVybiBNSU5fVkFMVUU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm90KCkuYWRkKE9ORSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTmVnYXRlcyB0aGlzIExvbmcncyB2YWx1ZS4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNuZWdhdGV9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IE5lZ2F0ZWQgTG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLm5lZyA9IExvbmdQcm90b3R5cGUubmVnYXRlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3VtIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gYWRkZW5kIEFkZGVuZFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBTdW1cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoYWRkZW5kKSB7XHJcbiAgICAgICAgaWYgKCFpc0xvbmcoYWRkZW5kKSlcclxuICAgICAgICAgICAgYWRkZW5kID0gZnJvbVZhbHVlKGFkZGVuZCk7XHJcblxyXG4gICAgICAgIC8vIERpdmlkZSBlYWNoIG51bWJlciBpbnRvIDQgY2h1bmtzIG9mIDE2IGJpdHMsIGFuZCB0aGVuIHN1bSB0aGUgY2h1bmtzLlxyXG5cclxuICAgICAgICB2YXIgYTQ4ID0gdGhpcy5oaWdoID4+PiAxNjtcclxuICAgICAgICB2YXIgYTMyID0gdGhpcy5oaWdoICYgMHhGRkZGO1xyXG4gICAgICAgIHZhciBhMTYgPSB0aGlzLmxvdyA+Pj4gMTY7XHJcbiAgICAgICAgdmFyIGEwMCA9IHRoaXMubG93ICYgMHhGRkZGO1xyXG5cclxuICAgICAgICB2YXIgYjQ4ID0gYWRkZW5kLmhpZ2ggPj4+IDE2O1xyXG4gICAgICAgIHZhciBiMzIgPSBhZGRlbmQuaGlnaCAmIDB4RkZGRjtcclxuICAgICAgICB2YXIgYjE2ID0gYWRkZW5kLmxvdyA+Pj4gMTY7XHJcbiAgICAgICAgdmFyIGIwMCA9IGFkZGVuZC5sb3cgJiAweEZGRkY7XHJcblxyXG4gICAgICAgIHZhciBjNDggPSAwLCBjMzIgPSAwLCBjMTYgPSAwLCBjMDAgPSAwO1xyXG4gICAgICAgIGMwMCArPSBhMDAgKyBiMDA7XHJcbiAgICAgICAgYzE2ICs9IGMwMCA+Pj4gMTY7XHJcbiAgICAgICAgYzAwICY9IDB4RkZGRjtcclxuICAgICAgICBjMTYgKz0gYTE2ICsgYjE2O1xyXG4gICAgICAgIGMzMiArPSBjMTYgPj4+IDE2O1xyXG4gICAgICAgIGMxNiAmPSAweEZGRkY7XHJcbiAgICAgICAgYzMyICs9IGEzMiArIGIzMjtcclxuICAgICAgICBjNDggKz0gYzMyID4+PiAxNjtcclxuICAgICAgICBjMzIgJj0gMHhGRkZGO1xyXG4gICAgICAgIGM0OCArPSBhNDggKyBiNDg7XHJcbiAgICAgICAgYzQ4ICY9IDB4RkZGRjtcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHMoKGMxNiA8PCAxNikgfCBjMDAsIChjNDggPDwgMTYpIHwgYzMyLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gc3VidHJhaGVuZCBTdWJ0cmFoZW5kXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IERpZmZlcmVuY2VcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KHN1YnRyYWhlbmQpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhzdWJ0cmFoZW5kKSlcclxuICAgICAgICAgICAgc3VidHJhaGVuZCA9IGZyb21WYWx1ZShzdWJ0cmFoZW5kKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGQoc3VidHJhaGVuZC5uZWcoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZGlmZmVyZW5jZSBvZiB0aGlzIGFuZCB0aGUgc3BlY2lmaWVkIExvbmcuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjc3VidHJhY3R9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IHN1YnRyYWhlbmQgU3VidHJhaGVuZFxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBEaWZmZXJlbmNlXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuc3ViID0gTG9uZ1Byb3RvdHlwZS5zdWJ0cmFjdDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHByb2R1Y3Qgb2YgdGhpcyBhbmQgdGhlIHNwZWNpZmllZCBMb25nLlxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBtdWx0aXBsaWVyIE11bHRpcGxpZXJcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gUHJvZHVjdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkobXVsdGlwbGllcikge1xyXG4gICAgICAgIGlmICh0aGlzLmlzWmVybygpKVxyXG4gICAgICAgICAgICByZXR1cm4gWkVSTztcclxuICAgICAgICBpZiAoIWlzTG9uZyhtdWx0aXBsaWVyKSlcclxuICAgICAgICAgICAgbXVsdGlwbGllciA9IGZyb21WYWx1ZShtdWx0aXBsaWVyKTtcclxuICAgICAgICBpZiAobXVsdGlwbGllci5pc1plcm8oKSlcclxuICAgICAgICAgICAgcmV0dXJuIFpFUk87XHJcbiAgICAgICAgaWYgKHRoaXMuZXEoTUlOX1ZBTFVFKSlcclxuICAgICAgICAgICAgcmV0dXJuIG11bHRpcGxpZXIuaXNPZGQoKSA/IE1JTl9WQUxVRSA6IFpFUk87XHJcbiAgICAgICAgaWYgKG11bHRpcGxpZXIuZXEoTUlOX1ZBTFVFKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNPZGQoKSA/IE1JTl9WQUxVRSA6IFpFUk87XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTmVnYXRpdmUoKSkge1xyXG4gICAgICAgICAgICBpZiAobXVsdGlwbGllci5pc05lZ2F0aXZlKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uZWcoKS5tdWwobXVsdGlwbGllci5uZWcoKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5lZygpLm11bChtdWx0aXBsaWVyKS5uZWcoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG11bHRpcGxpZXIuaXNOZWdhdGl2ZSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tdWwobXVsdGlwbGllci5uZWcoKSkubmVnKCk7XHJcblxyXG4gICAgICAgIC8vIElmIGJvdGggbG9uZ3MgYXJlIHNtYWxsLCB1c2UgZmxvYXQgbXVsdGlwbGljYXRpb25cclxuICAgICAgICBpZiAodGhpcy5sdChUV09fUFdSXzI0KSAmJiBtdWx0aXBsaWVyLmx0KFRXT19QV1JfMjQpKVxyXG4gICAgICAgICAgICByZXR1cm4gZnJvbU51bWJlcih0aGlzLnRvTnVtYmVyKCkgKiBtdWx0aXBsaWVyLnRvTnVtYmVyKCksIHRoaXMudW5zaWduZWQpO1xyXG5cclxuICAgICAgICAvLyBEaXZpZGUgZWFjaCBsb25nIGludG8gNCBjaHVua3Mgb2YgMTYgYml0cywgYW5kIHRoZW4gYWRkIHVwIDR4NCBwcm9kdWN0cy5cclxuICAgICAgICAvLyBXZSBjYW4gc2tpcCBwcm9kdWN0cyB0aGF0IHdvdWxkIG92ZXJmbG93LlxyXG5cclxuICAgICAgICB2YXIgYTQ4ID0gdGhpcy5oaWdoID4+PiAxNjtcclxuICAgICAgICB2YXIgYTMyID0gdGhpcy5oaWdoICYgMHhGRkZGO1xyXG4gICAgICAgIHZhciBhMTYgPSB0aGlzLmxvdyA+Pj4gMTY7XHJcbiAgICAgICAgdmFyIGEwMCA9IHRoaXMubG93ICYgMHhGRkZGO1xyXG5cclxuICAgICAgICB2YXIgYjQ4ID0gbXVsdGlwbGllci5oaWdoID4+PiAxNjtcclxuICAgICAgICB2YXIgYjMyID0gbXVsdGlwbGllci5oaWdoICYgMHhGRkZGO1xyXG4gICAgICAgIHZhciBiMTYgPSBtdWx0aXBsaWVyLmxvdyA+Pj4gMTY7XHJcbiAgICAgICAgdmFyIGIwMCA9IG11bHRpcGxpZXIubG93ICYgMHhGRkZGO1xyXG5cclxuICAgICAgICB2YXIgYzQ4ID0gMCwgYzMyID0gMCwgYzE2ID0gMCwgYzAwID0gMDtcclxuICAgICAgICBjMDAgKz0gYTAwICogYjAwO1xyXG4gICAgICAgIGMxNiArPSBjMDAgPj4+IDE2O1xyXG4gICAgICAgIGMwMCAmPSAweEZGRkY7XHJcbiAgICAgICAgYzE2ICs9IGExNiAqIGIwMDtcclxuICAgICAgICBjMzIgKz0gYzE2ID4+PiAxNjtcclxuICAgICAgICBjMTYgJj0gMHhGRkZGO1xyXG4gICAgICAgIGMxNiArPSBhMDAgKiBiMTY7XHJcbiAgICAgICAgYzMyICs9IGMxNiA+Pj4gMTY7XHJcbiAgICAgICAgYzE2ICY9IDB4RkZGRjtcclxuICAgICAgICBjMzIgKz0gYTMyICogYjAwO1xyXG4gICAgICAgIGM0OCArPSBjMzIgPj4+IDE2O1xyXG4gICAgICAgIGMzMiAmPSAweEZGRkY7XHJcbiAgICAgICAgYzMyICs9IGExNiAqIGIxNjtcclxuICAgICAgICBjNDggKz0gYzMyID4+PiAxNjtcclxuICAgICAgICBjMzIgJj0gMHhGRkZGO1xyXG4gICAgICAgIGMzMiArPSBhMDAgKiBiMzI7XHJcbiAgICAgICAgYzQ4ICs9IGMzMiA+Pj4gMTY7XHJcbiAgICAgICAgYzMyICY9IDB4RkZGRjtcclxuICAgICAgICBjNDggKz0gYTQ4ICogYjAwICsgYTMyICogYjE2ICsgYTE2ICogYjMyICsgYTAwICogYjQ4O1xyXG4gICAgICAgIGM0OCAmPSAweEZGRkY7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKChjMTYgPDwgMTYpIHwgYzAwLCAoYzQ4IDw8IDE2KSB8IGMzMiwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcHJvZHVjdCBvZiB0aGlzIGFuZCB0aGUgc3BlY2lmaWVkIExvbmcuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbXVsdGlwbHl9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG11bHRpcGxpZXIgTXVsdGlwbGllclxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBQcm9kdWN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubXVsID0gTG9uZ1Byb3RvdHlwZS5tdWx0aXBseTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhpcyBMb25nIGRpdmlkZWQgYnkgdGhlIHNwZWNpZmllZC4gVGhlIHJlc3VsdCBpcyBzaWduZWQgaWYgdGhpcyBMb25nIGlzIHNpZ25lZCBvclxyXG4gICAgICogIHVuc2lnbmVkIGlmIHRoaXMgTG9uZyBpcyB1bnNpZ25lZC5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gZGl2aXNvciBEaXZpc29yXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFF1b3RpZW50XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuZGl2aWRlID0gZnVuY3Rpb24gZGl2aWRlKGRpdmlzb3IpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhkaXZpc29yKSlcclxuICAgICAgICAgICAgZGl2aXNvciA9IGZyb21WYWx1ZShkaXZpc29yKTtcclxuICAgICAgICBpZiAoZGl2aXNvci5pc1plcm8oKSlcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2RpdmlzaW9uIGJ5IHplcm8nKTtcclxuICAgICAgICBpZiAodGhpcy5pc1plcm8oKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5zaWduZWQgPyBVWkVSTyA6IFpFUk87XHJcbiAgICAgICAgdmFyIGFwcHJveCwgcmVtLCByZXM7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVuc2lnbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgc2VjdGlvbiBpcyBvbmx5IHJlbGV2YW50IGZvciBzaWduZWQgbG9uZ3MgYW5kIGlzIGRlcml2ZWQgZnJvbSB0aGVcclxuICAgICAgICAgICAgLy8gY2xvc3VyZSBsaWJyYXJ5IGFzIGEgd2hvbGUuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVxKE1JTl9WQUxVRSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXZpc29yLmVxKE9ORSkgfHwgZGl2aXNvci5lcShORUdfT05FKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTUlOX1ZBTFVFOyAgLy8gcmVjYWxsIHRoYXQgLU1JTl9WQUxVRSA9PSBNSU5fVkFMVUVcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRpdmlzb3IuZXEoTUlOX1ZBTFVFKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT05FO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCwgd2UgaGF2ZSB8b3RoZXJ8ID49IDIsIHNvIHx0aGlzL290aGVyfCA8IHxNSU5fVkFMVUV8LlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoYWxmVGhpcyA9IHRoaXMuc2hyKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcHJveCA9IGhhbGZUaGlzLmRpdihkaXZpc29yKS5zaGwoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFwcHJveC5lcShaRVJPKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGl2aXNvci5pc05lZ2F0aXZlKCkgPyBPTkUgOiBORUdfT05FO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbSA9IHRoaXMuc3ViKGRpdmlzb3IubXVsKGFwcHJveCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBhcHByb3guYWRkKHJlbS5kaXYoZGl2aXNvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXZpc29yLmVxKE1JTl9WQUxVRSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51bnNpZ25lZCA/IFVaRVJPIDogWkVSTztcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNOZWdhdGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGl2aXNvci5pc05lZ2F0aXZlKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmVnKCkuZGl2KGRpdmlzb3IubmVnKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmVnKCkuZGl2KGRpdmlzb3IpLm5lZygpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpdmlzb3IuaXNOZWdhdGl2ZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGl2KGRpdmlzb3IubmVnKCkpLm5lZygpO1xyXG4gICAgICAgICAgICByZXMgPSBaRVJPO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSBhbGdvcml0aG0gYmVsb3cgaGFzIG5vdCBiZWVuIG1hZGUgZm9yIHVuc2lnbmVkIGxvbmdzLiBJdCdzIHRoZXJlZm9yZVxyXG4gICAgICAgICAgICAvLyByZXF1aXJlZCB0byB0YWtlIHNwZWNpYWwgY2FyZSBvZiB0aGUgTVNCIHByaW9yIHRvIHJ1bm5pbmcgaXQuXHJcbiAgICAgICAgICAgIGlmICghZGl2aXNvci51bnNpZ25lZClcclxuICAgICAgICAgICAgICAgIGRpdmlzb3IgPSBkaXZpc29yLnRvVW5zaWduZWQoKTtcclxuICAgICAgICAgICAgaWYgKGRpdmlzb3IuZ3QodGhpcykpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVVpFUk87XHJcbiAgICAgICAgICAgIGlmIChkaXZpc29yLmd0KHRoaXMuc2hydSgxKSkpIC8vIDE1ID4+PiAxID0gNyA7IHdpdGggZGl2aXNvciA9IDggOyB0cnVlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVU9ORTtcclxuICAgICAgICAgICAgcmVzID0gVVpFUk87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXBlYXQgdGhlIGZvbGxvd2luZyB1bnRpbCB0aGUgcmVtYWluZGVyIGlzIGxlc3MgdGhhbiBvdGhlcjogIGZpbmQgYVxyXG4gICAgICAgIC8vIGZsb2F0aW5nLXBvaW50IHRoYXQgYXBwcm94aW1hdGVzIHJlbWFpbmRlciAvIG90aGVyICpmcm9tIGJlbG93KiwgYWRkIHRoaXNcclxuICAgICAgICAvLyBpbnRvIHRoZSByZXN1bHQsIGFuZCBzdWJ0cmFjdCBpdCBmcm9tIHRoZSByZW1haW5kZXIuICBJdCBpcyBjcml0aWNhbCB0aGF0XHJcbiAgICAgICAgLy8gdGhlIGFwcHJveGltYXRlIHZhbHVlIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcmVhbCB2YWx1ZSBzbyB0aGF0IHRoZVxyXG4gICAgICAgIC8vIHJlbWFpbmRlciBuZXZlciBiZWNvbWVzIG5lZ2F0aXZlLlxyXG4gICAgICAgIHJlbSA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKHJlbS5ndGUoZGl2aXNvcikpIHtcclxuICAgICAgICAgICAgLy8gQXBwcm94aW1hdGUgdGhlIHJlc3VsdCBvZiBkaXZpc2lvbi4gVGhpcyBtYXkgYmUgYSBsaXR0bGUgZ3JlYXRlciBvclxyXG4gICAgICAgICAgICAvLyBzbWFsbGVyIHRoYW4gdGhlIGFjdHVhbCB2YWx1ZS5cclxuICAgICAgICAgICAgYXBwcm94ID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihyZW0udG9OdW1iZXIoKSAvIGRpdmlzb3IudG9OdW1iZXIoKSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2Ugd2lsbCB0d2VhayB0aGUgYXBwcm94aW1hdGUgcmVzdWx0IGJ5IGNoYW5naW5nIGl0IGluIHRoZSA0OC10aCBkaWdpdCBvclxyXG4gICAgICAgICAgICAvLyB0aGUgc21hbGxlc3Qgbm9uLWZyYWN0aW9uYWwgZGlnaXQsIHdoaWNoZXZlciBpcyBsYXJnZXIuXHJcbiAgICAgICAgICAgIHZhciBsb2cyID0gTWF0aC5jZWlsKE1hdGgubG9nKGFwcHJveCkgLyBNYXRoLkxOMiksXHJcbiAgICAgICAgICAgICAgICBkZWx0YSA9IChsb2cyIDw9IDQ4KSA/IDEgOiBwb3dfZGJsKDIsIGxvZzIgLSA0OCksXHJcblxyXG4gICAgICAgICAgICAvLyBEZWNyZWFzZSB0aGUgYXBwcm94aW1hdGlvbiB1bnRpbCBpdCBpcyBzbWFsbGVyIHRoYW4gdGhlIHJlbWFpbmRlci4gIE5vdGVcclxuICAgICAgICAgICAgLy8gdGhhdCBpZiBpdCBpcyB0b28gbGFyZ2UsIHRoZSBwcm9kdWN0IG92ZXJmbG93cyBhbmQgaXMgbmVnYXRpdmUuXHJcbiAgICAgICAgICAgICAgICBhcHByb3hSZXMgPSBmcm9tTnVtYmVyKGFwcHJveCksXHJcbiAgICAgICAgICAgICAgICBhcHByb3hSZW0gPSBhcHByb3hSZXMubXVsKGRpdmlzb3IpO1xyXG4gICAgICAgICAgICB3aGlsZSAoYXBwcm94UmVtLmlzTmVnYXRpdmUoKSB8fCBhcHByb3hSZW0uZ3QocmVtKSkge1xyXG4gICAgICAgICAgICAgICAgYXBwcm94IC09IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgYXBwcm94UmVzID0gZnJvbU51bWJlcihhcHByb3gsIHRoaXMudW5zaWduZWQpO1xyXG4gICAgICAgICAgICAgICAgYXBwcm94UmVtID0gYXBwcm94UmVzLm11bChkaXZpc29yKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2Uga25vdyB0aGUgYW5zd2VyIGNhbid0IGJlIHplcm8uLi4gYW5kIGFjdHVhbGx5LCB6ZXJvIHdvdWxkIGNhdXNlXHJcbiAgICAgICAgICAgIC8vIGluZmluaXRlIHJlY3Vyc2lvbiBzaW5jZSB3ZSB3b3VsZCBtYWtlIG5vIHByb2dyZXNzLlxyXG4gICAgICAgICAgICBpZiAoYXBwcm94UmVzLmlzWmVybygpKVxyXG4gICAgICAgICAgICAgICAgYXBwcm94UmVzID0gT05FO1xyXG5cclxuICAgICAgICAgICAgcmVzID0gcmVzLmFkZChhcHByb3hSZXMpO1xyXG4gICAgICAgICAgICByZW0gPSByZW0uc3ViKGFwcHJveFJlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgZGl2aWRlZCBieSB0aGUgc3BlY2lmaWVkLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2RpdmlkZX0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gZGl2aXNvciBEaXZpc29yXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFF1b3RpZW50XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuZGl2ID0gTG9uZ1Byb3RvdHlwZS5kaXZpZGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoaXMgTG9uZyBtb2R1bG8gdGhlIHNwZWNpZmllZC5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gZGl2aXNvciBEaXZpc29yXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFJlbWFpbmRlclxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLm1vZHVsbyA9IGZ1bmN0aW9uIG1vZHVsbyhkaXZpc29yKSB7XHJcbiAgICAgICAgaWYgKCFpc0xvbmcoZGl2aXNvcikpXHJcbiAgICAgICAgICAgIGRpdmlzb3IgPSBmcm9tVmFsdWUoZGl2aXNvcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKHRoaXMuZGl2KGRpdmlzb3IpLm11bChkaXZpc29yKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgbW9kdWxvIHRoZSBzcGVjaWZpZWQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbW9kdWxvfS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gUmVtYWluZGVyXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubW9kID0gTG9uZ1Byb3RvdHlwZS5tb2R1bG87XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBiaXR3aXNlIE5PVCBvZiB0aGlzIExvbmcuXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUubm90ID0gZnVuY3Rpb24gbm90KCkge1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cyh+dGhpcy5sb3csIH50aGlzLmhpZ2gsIHRoaXMudW5zaWduZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGJpdHdpc2UgQU5EIG9mIHRoaXMgTG9uZyBhbmQgdGhlIHNwZWNpZmllZC5cclxuICAgICAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgTG9uZ1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLmFuZCA9IGZ1bmN0aW9uIGFuZChvdGhlcikge1xyXG4gICAgICAgIGlmICghaXNMb25nKG90aGVyKSlcclxuICAgICAgICAgICAgb3RoZXIgPSBmcm9tVmFsdWUob3RoZXIpO1xyXG4gICAgICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmxvdyAmIG90aGVyLmxvdywgdGhpcy5oaWdoICYgb3RoZXIuaGlnaCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYml0d2lzZSBPUiBvZiB0aGlzIExvbmcgYW5kIHRoZSBzcGVjaWZpZWQuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIExvbmdcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5vciA9IGZ1bmN0aW9uIG9yKG90aGVyKSB7XHJcbiAgICAgICAgaWYgKCFpc0xvbmcob3RoZXIpKVxyXG4gICAgICAgICAgICBvdGhlciA9IGZyb21WYWx1ZShvdGhlcik7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKHRoaXMubG93IHwgb3RoZXIubG93LCB0aGlzLmhpZ2ggfCBvdGhlci5oaWdoLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBiaXR3aXNlIFhPUiBvZiB0aGlzIExvbmcgYW5kIHRoZSBnaXZlbiBvbmUuXHJcbiAgICAgKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIExvbmdcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ31cclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS54b3IgPSBmdW5jdGlvbiB4b3Iob3RoZXIpIHtcclxuICAgICAgICBpZiAoIWlzTG9uZyhvdGhlcikpXHJcbiAgICAgICAgICAgIG90aGVyID0gZnJvbVZhbHVlKG90aGVyKTtcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3cgXiBvdGhlci5sb3csIHRoaXMuaGlnaCBeIG90aGVyLmhpZ2gsIHRoaXMudW5zaWduZWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhpcyBMb25nIHdpdGggYml0cyBzaGlmdGVkIHRvIHRoZSBsZWZ0IGJ5IHRoZSBnaXZlbiBhbW91bnQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBTaGlmdGVkIExvbmdcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5zaGlmdExlZnQgPSBmdW5jdGlvbiBzaGlmdExlZnQobnVtQml0cykge1xyXG4gICAgICAgIGlmIChpc0xvbmcobnVtQml0cykpXHJcbiAgICAgICAgICAgIG51bUJpdHMgPSBudW1CaXRzLnRvSW50KCk7XHJcbiAgICAgICAgaWYgKChudW1CaXRzICY9IDYzKSA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZWxzZSBpZiAobnVtQml0cyA8IDMyKVxyXG4gICAgICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3cgPDwgbnVtQml0cywgKHRoaXMuaGlnaCA8PCBudW1CaXRzKSB8ICh0aGlzLmxvdyA+Pj4gKDMyIC0gbnVtQml0cykpLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tQml0cygwLCB0aGlzLmxvdyA8PCAobnVtQml0cyAtIDMyKSwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIHNoaWZ0ZWQgdG8gdGhlIGxlZnQgYnkgdGhlIGdpdmVuIGFtb3VudC4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNzaGlmdExlZnR9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBTaGlmdGVkIExvbmdcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5zaGwgPSBMb25nUHJvdG90eXBlLnNoaWZ0TGVmdDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhpcyBMb25nIHdpdGggYml0cyBhcml0aG1ldGljYWxseSBzaGlmdGVkIHRvIHRoZSByaWdodCBieSB0aGUgZ2l2ZW4gYW1vdW50LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ8IUxvbmd9IG51bUJpdHMgTnVtYmVyIG9mIGJpdHNcclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gU2hpZnRlZCBMb25nXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIExvbmdQcm90b3R5cGUuc2hpZnRSaWdodCA9IGZ1bmN0aW9uIHNoaWZ0UmlnaHQobnVtQml0cykge1xyXG4gICAgICAgIGlmIChpc0xvbmcobnVtQml0cykpXHJcbiAgICAgICAgICAgIG51bUJpdHMgPSBudW1CaXRzLnRvSW50KCk7XHJcbiAgICAgICAgaWYgKChudW1CaXRzICY9IDYzKSA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZWxzZSBpZiAobnVtQml0cyA8IDMyKVxyXG4gICAgICAgICAgICByZXR1cm4gZnJvbUJpdHMoKHRoaXMubG93ID4+PiBudW1CaXRzKSB8ICh0aGlzLmhpZ2ggPDwgKDMyIC0gbnVtQml0cykpLCB0aGlzLmhpZ2ggPj4gbnVtQml0cywgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5oaWdoID4+IChudW1CaXRzIC0gMzIpLCB0aGlzLmhpZ2ggPj0gMCA/IDAgOiAtMSwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIGFyaXRobWV0aWNhbGx5IHNoaWZ0ZWQgdG8gdGhlIHJpZ2h0IGJ5IHRoZSBnaXZlbiBhbW91bnQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjc2hpZnRSaWdodH0uXHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnNociA9IExvbmdQcm90b3R5cGUuc2hpZnRSaWdodDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhpcyBMb25nIHdpdGggYml0cyBsb2dpY2FsbHkgc2hpZnRlZCB0byB0aGUgcmlnaHQgYnkgdGhlIGdpdmVuIGFtb3VudC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnNoaWZ0UmlnaHRVbnNpZ25lZCA9IGZ1bmN0aW9uIHNoaWZ0UmlnaHRVbnNpZ25lZChudW1CaXRzKSB7XHJcbiAgICAgICAgaWYgKGlzTG9uZyhudW1CaXRzKSlcclxuICAgICAgICAgICAgbnVtQml0cyA9IG51bUJpdHMudG9JbnQoKTtcclxuICAgICAgICBudW1CaXRzICY9IDYzO1xyXG4gICAgICAgIGlmIChudW1CaXRzID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGhpZ2ggPSB0aGlzLmhpZ2g7XHJcbiAgICAgICAgICAgIGlmIChudW1CaXRzIDwgMzIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb3cgPSB0aGlzLmxvdztcclxuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tQml0cygobG93ID4+PiBudW1CaXRzKSB8IChoaWdoIDw8ICgzMiAtIG51bUJpdHMpKSwgaGlnaCA+Pj4gbnVtQml0cywgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVtQml0cyA9PT0gMzIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbUJpdHMoaGlnaCwgMCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tQml0cyhoaWdoID4+PiAobnVtQml0cyAtIDMyKSwgMCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhpcyBMb25nIHdpdGggYml0cyBsb2dpY2FsbHkgc2hpZnRlZCB0byB0aGUgcmlnaHQgYnkgdGhlIGdpdmVuIGFtb3VudC4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNzaGlmdFJpZ2h0VW5zaWduZWR9LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBTaGlmdGVkIExvbmdcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgTG9uZ1Byb3RvdHlwZS5zaHJ1ID0gTG9uZ1Byb3RvdHlwZS5zaGlmdFJpZ2h0VW5zaWduZWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIExvbmcgdG8gc2lnbmVkLlxyXG4gICAgICogQHJldHVybnMgeyFMb25nfSBTaWduZWQgbG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnRvU2lnbmVkID0gZnVuY3Rpb24gdG9TaWduZWQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVuc2lnbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3csIHRoaXMuaGlnaCwgZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgTG9uZyB0byB1bnNpZ25lZC5cclxuICAgICAqIEByZXR1cm5zIHshTG9uZ30gVW5zaWduZWQgbG9uZ1xyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBMb25nUHJvdG90eXBlLnRvVW5zaWduZWQgPSBmdW5jdGlvbiB0b1Vuc2lnbmVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnVuc2lnbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3csIHRoaXMuaGlnaCwgdHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBMb25nO1xyXG59KTtcclxuIiwiLypcclxuIENvcHlyaWdodCAyMDEzIERhbmllbCBXaXJ0eiA8ZGNvZGVAZGNvZGUuaW8+XHJcblxyXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG5cclxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBsaWNlbnNlIHByb3RvYnVmLmpzIChjKSAyMDEzIERhbmllbCBXaXJ0eiA8ZGNvZGVAZGNvZGUuaW8+XHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjBcclxuICogc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGNvZGVJTy9wcm90b2J1Zi5qcyBmb3IgZGV0YWlsc1xyXG4gKi9cclxuKGZ1bmN0aW9uKGdsb2JhbCwgZmFjdG9yeSkge1xyXG5cclxuICAgIC8qIEFNRCAqLyBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbXCJhbWRcIl0pXHJcbiAgICAgICAgZGVmaW5lKFtcImJ5dGVidWZmZXJcIl0sIGZhY3RvcnkpO1xyXG4gICAgLyogQ29tbW9uSlMgKi8gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZSAmJiBtb2R1bGVbXCJleHBvcnRzXCJdKVxyXG4gICAgICAgIG1vZHVsZVtcImV4cG9ydHNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJieXRlYnVmZmVyXCIpLCB0cnVlKTtcclxuICAgIC8qIEdsb2JhbCAqLyBlbHNlXHJcbiAgICAgICAgKGdsb2JhbFtcImRjb2RlSU9cIl0gPSBnbG9iYWxbXCJkY29kZUlPXCJdIHx8IHt9KVtcIlByb3RvQnVmXCJdID0gZmFjdG9yeShnbG9iYWxbXCJkY29kZUlPXCJdW1wiQnl0ZUJ1ZmZlclwiXSk7XHJcblxyXG59KSh0aGlzLCBmdW5jdGlvbihCeXRlQnVmZmVyLCBpc0NvbW1vbkpTKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBQcm90b0J1ZiBuYW1lc3BhY2UuXHJcbiAgICAgKiBAZXhwb3J0cyBQcm90b0J1ZlxyXG4gICAgICogQG5hbWVzcGFjZVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICB2YXIgUHJvdG9CdWYgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHshZnVuY3Rpb24obmV3OiBCeXRlQnVmZmVyLCAuLi5bKl0pfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5CeXRlQnVmZmVyID0gQnl0ZUJ1ZmZlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHs/ZnVuY3Rpb24obmV3OiBMb25nLCAuLi5bKl0pfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5Mb25nID0gQnl0ZUJ1ZmZlci5Mb25nIHx8IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm90b0J1Zi5qcyB2ZXJzaW9uLlxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqIEBjb25zdFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5WRVJTSU9OID0gXCI1LjAuMVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2lyZSB0eXBlcy5cclxuICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZyxudW1iZXI+fVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLldJUkVfVFlQRVMgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZhcmludCB3aXJlIHR5cGUuXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXhlZCA2NCBiaXRzIHdpcmUgdHlwZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTNjQgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGVuZ3RoIGRlbGltaXRlZCB3aXJlIHR5cGUuXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNID0gMjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0YXJ0IGdyb3VwIHdpcmUgdHlwZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5TVEFSVEdST1VQID0gMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVuZCBncm91cCB3aXJlIHR5cGUuXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLldJUkVfVFlQRVMuRU5ER1JPVVAgPSA0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRml4ZWQgMzIgYml0cyB3aXJlIHR5cGUuXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzMyID0gNTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhY2thYmxlIHdpcmUgdHlwZXMuXHJcbiAgICAgKiBAdHlwZSB7IUFycmF5LjxudW1iZXI+fVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLlBBQ0tBQkxFX1dJUkVfVFlQRVMgPSBbXHJcbiAgICAgICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTNjQsXHJcbiAgICAgICAgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTMzJcclxuICAgIF07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUeXBlcy5cclxuICAgICAqIEBkaWN0XHJcbiAgICAgKiBAdHlwZSB7IU9iamVjdC48c3RyaW5nLHtuYW1lOiBzdHJpbmcsIHdpcmVUeXBlOiBudW1iZXIsIGRlZmF1bHRWYWx1ZTogKn0+fVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLlRZUEVTID0ge1xyXG4gICAgICAgIC8vIEFjY29yZGluZyB0byB0aGUgcHJvdG9idWYgc3BlYy5cclxuICAgICAgICBcImludDMyXCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJpbnQzMlwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJ1aW50MzJcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcInVpbnQzMlwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzaW50MzJcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcInNpbnQzMlwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJpbnQ2NFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiaW50NjRcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5ULFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IFByb3RvQnVmLkxvbmcgPyBQcm90b0J1Zi5Mb25nLlpFUk8gOiB1bmRlZmluZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwidWludDY0XCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJ1aW50NjRcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5ULFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IFByb3RvQnVmLkxvbmcgPyBQcm90b0J1Zi5Mb25nLlVaRVJPIDogdW5kZWZpbmVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInNpbnQ2NFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwic2ludDY0XCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVCxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBQcm90b0J1Zi5Mb25nID8gUHJvdG9CdWYuTG9uZy5aRVJPIDogdW5kZWZpbmVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImJvb2xcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImJvb2xcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5ULFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImRvdWJsZVwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZG91YmxlXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFM2NCxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInN0cmluZ1wiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwic3RyaW5nXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTSxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImJ5dGVzXCI6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJieXRlc1wiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0sXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbnVsbCAvLyBvdmVycmlkZGVuIGluIHRoZSBjb2RlLCBtdXN0IGJlIGEgdW5pcXVlIGluc3RhbmNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImZpeGVkMzJcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImZpeGVkMzJcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzMyLFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwic2ZpeGVkMzJcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcInNmaXhlZDMyXCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFMzMixcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImZpeGVkNjRcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImZpeGVkNjRcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzY0LFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICBQcm90b0J1Zi5Mb25nID8gUHJvdG9CdWYuTG9uZy5VWkVSTyA6IHVuZGVmaW5lZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJzZml4ZWQ2NFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwic2ZpeGVkNjRcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzY0LFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IFByb3RvQnVmLkxvbmcgPyBQcm90b0J1Zi5Mb25nLlpFUk8gOiB1bmRlZmluZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZmxvYXRcIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImZsb2F0XCIsXHJcbiAgICAgICAgICAgIHdpcmVUeXBlOiBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFMzMixcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImVudW1cIjoge1xyXG4gICAgICAgICAgICBuYW1lOiBcImVudW1cIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuVkFSSU5ULFxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwibWVzc2FnZVwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwibWVzc2FnZVwiLFxyXG4gICAgICAgICAgICB3aXJlVHlwZTogUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0sXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJncm91cFwiOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiZ3JvdXBcIixcclxuICAgICAgICAgICAgd2lyZVR5cGU6IFByb3RvQnVmLldJUkVfVFlQRVMuU1RBUlRHUk9VUCxcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkIG1hcCBrZXkgdHlwZXMuXHJcbiAgICAgKiBAdHlwZSB7IUFycmF5LjwhT2JqZWN0LjxzdHJpbmcse25hbWU6IHN0cmluZywgd2lyZVR5cGU6IG51bWJlciwgZGVmYXVsdFZhbHVlOiAqfT4+fVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLk1BUF9LRVlfVFlQRVMgPSBbXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJpbnQzMlwiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcInNpbnQzMlwiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDMyXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wiZml4ZWQzMlwiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcImludDY0XCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wic2ludDY0XCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJ1aW50NjRcIl0sXHJcbiAgICAgICAgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDY0XCJdLFxyXG4gICAgICAgIFByb3RvQnVmLlRZUEVTW1wiYm9vbFwiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcInN0cmluZ1wiXSxcclxuICAgICAgICBQcm90b0J1Zi5UWVBFU1tcImJ5dGVzXCJdXHJcbiAgICBdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWluaW11bSBmaWVsZCBpZC5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuSURfTUlOID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1heGltdW0gZmllbGQgaWQuXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLklEX01BWCA9IDB4MUZGRkZGRkY7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiBzZXQgdG8gYHRydWVgLCBmaWVsZCBuYW1lcyB3aWxsIGJlIGNvbnZlcnRlZCBmcm9tIHVuZGVyc2NvcmUgbm90YXRpb24gdG8gY2FtZWwgY2FzZS4gRGVmYXVsdHMgdG8gYGZhbHNlYC5cclxuICAgICAqICBNdXN0IGJlIHNldCBwcmlvciB0byBwYXJzaW5nLlxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLmNvbnZlcnRGaWVsZHNUb0NhbWVsQ2FzZSA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnkgZGVmYXVsdCwgbWVzc2FnZXMgYXJlIHBvcHVsYXRlZCB3aXRoIChzZXRYLCBzZXRfeCkgYWNjZXNzb3JzIGZvciBlYWNoIGZpZWxkLiBUaGlzIGNhbiBiZSBkaXNhYmxlZCBieVxyXG4gICAgICogIHNldHRpbmcgdGhpcyB0byBgZmFsc2VgIHByaW9yIHRvIGJ1aWxkaW5nIG1lc3NhZ2VzLlxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLnBvcHVsYXRlQWNjZXNzb3JzID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ5IGRlZmF1bHQsIG1lc3NhZ2VzIGFyZSBwb3B1bGF0ZWQgd2l0aCBkZWZhdWx0IHZhbHVlcyBpZiBhIGZpZWxkIGlzIG5vdCBwcmVzZW50IG9uIHRoZSB3aXJlLiBUbyBkaXNhYmxlXHJcbiAgICAgKiAgdGhpcyBiZWhhdmlvciwgc2V0IHRoaXMgc2V0dGluZyB0byBgZmFsc2VgLlxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLnBvcHVsYXRlRGVmYXVsdHMgPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGFsaWFzIFByb3RvQnVmLlV0aWxcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuVXRpbCA9IChmdW5jdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvdG9CdWYgdXRpbGl0aWVzLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlV0aWxcclxuICAgICAgICAgKiBAbmFtZXNwYWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFV0aWwgPSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRmxhZyBpZiBydW5uaW5nIGluIG5vZGUgb3Igbm90LlxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBVdGlsLklTX05PREUgPSAhIShcclxuICAgICAgICAgICAgdHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MrJycgPT09ICdbb2JqZWN0IHByb2Nlc3NdJyAmJiAhcHJvY2Vzc1snYnJvd3NlciddXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIFhNTEh0dHBSZXF1ZXN0IG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJuIHtYTUxIdHRwUmVxdWVzdH1cclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgWE1MSHR0cFJlcXVlc3QgaXMgbm90IHN1cHBvcnRlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBVdGlsLlhIUiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBObyBkZXBlbmRlbmNpZXMgcGxlYXNlLCByZWY6IGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMveG1saHR0cC5odG1sXHJcbiAgICAgICAgICAgIHZhciBYTUxIdHRwRmFjdG9yaWVzID0gW1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge3JldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKX0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFBcIil9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge3JldHVybiBuZXcgQWN0aXZlWE9iamVjdChcIk1zeG1sMy5YTUxIVFRQXCIpfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKX1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgLyoqIEB0eXBlIHs/WE1MSHR0cFJlcXVlc3R9ICovXHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7aTxYTUxIdHRwRmFjdG9yaWVzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7IHhociA9IFhNTEh0dHBGYWN0b3JpZXNbaV0oKTsgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgheGhyKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJYTUxIdHRwUmVxdWVzdCBpcyBub3Qgc3VwcG9ydGVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4geGhyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZldGNoZXMgYSByZXNvdXJjZS5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBSZXNvdXJjZSBwYXRoXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbig/c3RyaW5nKT19IGNhbGxiYWNrIENhbGxiYWNrIHJlY2VpdmluZyB0aGUgcmVzb3VyY2UncyBjb250ZW50cy4gSWYgb21pdHRlZCB0aGUgcmVzb3VyY2Ugd2lsbFxyXG4gICAgICAgICAqICAgYmUgZmV0Y2hlZCBzeW5jaHJvbm91c2x5LiBJZiB0aGUgcmVxdWVzdCBmYWlsZWQsIGNvbnRlbnRzIHdpbGwgYmUgbnVsbC5cclxuICAgICAgICAgKiBAcmV0dXJuIHs/c3RyaW5nfHVuZGVmaW5lZH0gUmVzb3VyY2UgY29udGVudHMgaWYgY2FsbGJhY2sgaXMgb21pdHRlZCAobnVsbCBpZiB0aGUgcmVxdWVzdCBmYWlsZWQpLCBlbHNlIHVuZGVmaW5lZC5cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVXRpbC5mZXRjaCA9IGZ1bmN0aW9uKHBhdGgsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAmJiB0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKFV0aWwuSVNfTk9ERSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnMucmVhZEZpbGUocGF0aCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soXCJcIitkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gVXRpbC5YSFIoKTtcclxuICAgICAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBwYXRoLCBjYWxsYmFjayA/IHRydWUgOiBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcignVXNlci1BZ2VudCcsICdYTUxIVFRQLzEuMCcpO1xyXG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICd0ZXh0L3BsYWluJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHhoci5vdmVycmlkZU1pbWVUeXBlID09PSAnZnVuY3Rpb24nKSB4aHIub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9wbGFpbicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLyogcmVtb3RlICovIHhoci5zdGF0dXMgPT0gMjAwIHx8IC8qIGxvY2FsICovICh4aHIuc3RhdHVzID09IDAgJiYgdHlwZW9mIHhoci5yZXNwb25zZVRleHQgPT09ICdzdHJpbmcnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgvKiByZW1vdGUgKi8geGhyLnN0YXR1cyA9PSAyMDAgfHwgLyogbG9jYWwgKi8gKHhoci5zdGF0dXMgPT0gMCAmJiB0eXBlb2YgeGhyLnJlc3BvbnNlVGV4dCA9PT0gJ3N0cmluZycpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnRzIGEgc3RyaW5nIHRvIGNhbWVsIGNhc2UuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFV0aWwudG9DYW1lbENhc2UgPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9fKFthLXpBLVpdKS9nLCBmdW5jdGlvbiAoJDAsICQxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFV0aWw7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGFuZ3VhZ2UgZXhwcmVzc2lvbnMuXHJcbiAgICAgKiBAdHlwZSB7IU9iamVjdC48c3RyaW5nLCFSZWdFeHA+fVxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5MYW5nID0ge1xyXG5cclxuICAgICAgICAvLyBDaGFyYWN0ZXJzIGFsd2F5cyBlbmRpbmcgYSBzdGF0ZW1lbnRcclxuICAgICAgICBERUxJTTogL1tcXHNcXHtcXH09OzpcXFtcXF0sJ1wiXFwoXFwpPD5dL2csXHJcblxyXG4gICAgICAgIC8vIEZpZWxkIHJ1bGVzXHJcbiAgICAgICAgUlVMRTogL14oPzpyZXF1aXJlZHxvcHRpb25hbHxyZXBlYXRlZHxtYXApJC8sXHJcblxyXG4gICAgICAgIC8vIEZpZWxkIHR5cGVzXHJcbiAgICAgICAgVFlQRTogL14oPzpkb3VibGV8ZmxvYXR8aW50MzJ8dWludDMyfHNpbnQzMnxpbnQ2NHx1aW50NjR8c2ludDY0fGZpeGVkMzJ8c2ZpeGVkMzJ8Zml4ZWQ2NHxzZml4ZWQ2NHxib29sfHN0cmluZ3xieXRlcykkLyxcclxuXHJcbiAgICAgICAgLy8gTmFtZXNcclxuICAgICAgICBOQU1FOiAvXlthLXpBLVpfXVthLXpBLVpfMC05XSokLyxcclxuXHJcbiAgICAgICAgLy8gVHlwZSBkZWZpbml0aW9uc1xyXG4gICAgICAgIFRZUEVERUY6IC9eW2EtekEtWl1bYS16QS1aXzAtOV0qJC8sXHJcblxyXG4gICAgICAgIC8vIFR5cGUgcmVmZXJlbmNlc1xyXG4gICAgICAgIFRZUEVSRUY6IC9eKD86XFwuP1thLXpBLVpfXVthLXpBLVpfMC05XSopKyQvLFxyXG5cclxuICAgICAgICAvLyBGdWxseSBxdWFsaWZpZWQgdHlwZSByZWZlcmVuY2VzXHJcbiAgICAgICAgRlFUWVBFUkVGOiAvXig/OlxcLlthLXpBLVpdW2EtekEtWl8wLTldKikrJC8sXHJcblxyXG4gICAgICAgIC8vIEFsbCBudW1iZXJzXHJcbiAgICAgICAgTlVNQkVSOiAvXi0/KD86WzEtOV1bMC05XSp8MHwwW3hYXVswLTlhLWZBLUZdK3wwWzAtN10rfChbMC05XSooXFwuWzAtOV0qKT8oW0VlXVsrLV0/WzAtOV0rKT8pfGluZnxuYW4pJC8sXHJcblxyXG4gICAgICAgIC8vIERlY2ltYWwgbnVtYmVyc1xyXG4gICAgICAgIE5VTUJFUl9ERUM6IC9eKD86WzEtOV1bMC05XSp8MCkkLyxcclxuXHJcbiAgICAgICAgLy8gSGV4YWRlY2ltYWwgbnVtYmVyc1xyXG4gICAgICAgIE5VTUJFUl9IRVg6IC9eMFt4WF1bMC05YS1mQS1GXSskLyxcclxuXHJcbiAgICAgICAgLy8gT2N0YWwgbnVtYmVyc1xyXG4gICAgICAgIE5VTUJFUl9PQ1Q6IC9eMFswLTddKyQvLFxyXG5cclxuICAgICAgICAvLyBGbG9hdGluZyBwb2ludCBudW1iZXJzXHJcbiAgICAgICAgTlVNQkVSX0ZMVDogL14oWzAtOV0qKFxcLlswLTldKik/KFtFZV1bKy1dP1swLTldKyk/fGluZnxuYW4pJC8sXHJcblxyXG4gICAgICAgIC8vIEJvb2xlYW5zXHJcbiAgICAgICAgQk9PTDogL14oPzp0cnVlfGZhbHNlKSQvaSxcclxuXHJcbiAgICAgICAgLy8gSWQgbnVtYmVyc1xyXG4gICAgICAgIElEOiAvXig/OlsxLTldWzAtOV0qfDB8MFt4WF1bMC05YS1mQS1GXSt8MFswLTddKykkLyxcclxuXHJcbiAgICAgICAgLy8gTmVnYXRpdmUgaWQgbnVtYmVycyAoZW51bSB2YWx1ZXMpXHJcbiAgICAgICAgTkVHSUQ6IC9eXFwtPyg/OlsxLTldWzAtOV0qfDB8MFt4WF1bMC05YS1mQS1GXSt8MFswLTddKykkLyxcclxuXHJcbiAgICAgICAgLy8gV2hpdGVzcGFjZXNcclxuICAgICAgICBXSElURVNQQUNFOiAvXFxzLyxcclxuXHJcbiAgICAgICAgLy8gQWxsIHN0cmluZ3NcclxuICAgICAgICBTVFJJTkc6IC8oPzpcIihbXlwiXFxcXF0qKD86XFxcXC5bXlwiXFxcXF0qKSopXCIpfCg/OicoW14nXFxcXF0qKD86XFxcXC5bXidcXFxcXSopKiknKS9nLFxyXG5cclxuICAgICAgICAvLyBEb3VibGUgcXVvdGVkIHN0cmluZ3NcclxuICAgICAgICBTVFJJTkdfRFE6IC8oPzpcIihbXlwiXFxcXF0qKD86XFxcXC5bXlwiXFxcXF0qKSopXCIpL2csXHJcblxyXG4gICAgICAgIC8vIFNpbmdsZSBxdW90ZWQgc3RyaW5nc1xyXG4gICAgICAgIFNUUklOR19TUTogLyg/OicoW14nXFxcXF0qKD86XFxcXC5bXidcXFxcXSopKiknKS9nXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGFsaWFzIFByb3RvQnVmLkRvdFByb3RvXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLkRvdFByb3RvID0gKGZ1bmN0aW9uKFByb3RvQnVmLCBMYW5nKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFV0aWxpdGllcyB0byBwYXJzZSAucHJvdG8gZmlsZXMuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuRG90UHJvdG9cclxuICAgICAgICAgKiBAbmFtZXNwYWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIERvdFByb3RvID0ge307XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgVG9rZW5pemVyLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLkRvdFByb3RvLlRva2VuaXplclxyXG4gICAgICAgICAqIEBjbGFzcyBwcm90b3R5cGUgdG9rZW5pemVyXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3RvIFByb3RvIHRvIHRva2VuaXplXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFRva2VuaXplciA9IGZ1bmN0aW9uKHByb3RvKSB7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU291cmNlIHRvIHBhcnNlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHByb3RvK1wiXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ3VycmVudCBpbmRleC5cclxuICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pbmRleCA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ3VycmVudCBsaW5lLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmxpbmUgPSAxO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFRva2VuIHN0YWNrLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IUFycmF5LjxzdHJpbmc+fVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gW107XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3BlbmluZyBjaGFyYWN0ZXIgb2YgdGhlIGN1cnJlbnQgc3RyaW5nIHJlYWQsIGlmIGFueS5cclxuICAgICAgICAgICAgICogQHR5cGUgez9zdHJpbmd9XHJcbiAgICAgICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLl9zdHJpbmdPcGVuID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuRG90UHJvdG8uVG9rZW5pemVyLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBUb2tlbml6ZXJQcm90b3R5cGUgPSBUb2tlbml6ZXIucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZWFkcyBhIHN0cmluZyBiZWdpbm5pbmcgYXQgdGhlIGN1cnJlbnQgaW5kZXguXHJcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVG9rZW5pemVyUHJvdG90eXBlLl9yZWFkU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZSA9IHRoaXMuX3N0cmluZ09wZW4gPT09ICdcIidcclxuICAgICAgICAgICAgICAgID8gTGFuZy5TVFJJTkdfRFFcclxuICAgICAgICAgICAgICAgIDogTGFuZy5TVFJJTkdfU1E7XHJcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCA9IHRoaXMuaW5kZXggLSAxOyAvLyBJbmNsdWRlIHRoZSBvcGVuIHF1b3RlXHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IHJlLmV4ZWModGhpcy5zb3VyY2UpO1xyXG4gICAgICAgICAgICBpZiAoIW1hdGNoKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bnRlcm1pbmF0ZWQgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gcmUubGFzdEluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5fc3RyaW5nT3Blbik7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0cmluZ09wZW4gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hbMV07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgbmV4dCB0b2tlbiBhbmQgYWR2YW5jZXMgYnkgb25lLlxyXG4gICAgICAgICAqIEByZXR1cm4gez9zdHJpbmd9IFRva2VuIG9yIGBudWxsYCBvbiBFT0ZcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVG9rZW5pemVyUHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWNrLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMuc291cmNlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RyaW5nT3BlbiAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVwZWF0LFxyXG4gICAgICAgICAgICAgICAgcHJldixcclxuICAgICAgICAgICAgICAgIG5leHQ7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHJlcGVhdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0cmlwIHdoaXRlIHNwYWNlc1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKExhbmcuV0hJVEVTUEFDRS50ZXN0KG5leHQgPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT09ICdcXG4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMubGluZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKyt0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0cmlwIGNvbW1lbnRzXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpID09PSAnLycpIHtcclxuICAgICAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KSA9PT0gJy8nKSB7IC8vIExpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuc291cmNlLmNoYXJBdCgrK3RoaXMuaW5kZXgpICE9PSAnXFxuJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID09IHRoaXMuc291cmNlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMubGluZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChuZXh0ID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpKSA9PT0gJyonKSB7IC8qIEJsb2NrICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09PSAnXFxuJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMubGluZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgrK3RoaXMuaW5kZXggPT09IHRoaXMuc291cmNlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXYgPSBuZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAocHJldiAhPT0gJyonIHx8IG5leHQgIT09ICcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcvJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSB3aGlsZSAocmVwZWF0KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlYWQgdGhlIG5leHQgdG9rZW5cclxuICAgICAgICAgICAgdmFyIGVuZCA9IHRoaXMuaW5kZXg7XHJcbiAgICAgICAgICAgIExhbmcuREVMSU0ubGFzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgdmFyIGRlbGltID0gTGFuZy5ERUxJTS50ZXN0KHRoaXMuc291cmNlLmNoYXJBdChlbmQrKykpO1xyXG4gICAgICAgICAgICBpZiAoIWRlbGltKVxyXG4gICAgICAgICAgICAgICAgd2hpbGUoZW5kIDwgdGhpcy5zb3VyY2UubGVuZ3RoICYmICFMYW5nLkRFTElNLnRlc3QodGhpcy5zb3VyY2UuY2hhckF0KGVuZCkpKVxyXG4gICAgICAgICAgICAgICAgICAgICsrZW5kO1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5pbmRleCwgdGhpcy5pbmRleCA9IGVuZCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ1wiJyB8fCB0b2tlbiA9PT0gXCInXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHJpbmdPcGVuID0gdG9rZW47XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQZWVrcyBmb3IgdGhlIG5leHQgdG9rZW4uXHJcbiAgICAgICAgICogQHJldHVybiB7P3N0cmluZ30gVG9rZW4gb3IgYG51bGxgIG9uIEVPRlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBUb2tlbml6ZXJQcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHRva2VuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFja1swXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTa2lwcyBhIHNwZWNpZmljIHRva2VuIGFuZCB0aHJvd3MgaWYgaXQgZGlmZmVycy5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXhwZWN0ZWQgRXhwZWN0ZWQgdG9rZW5cclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGFjdHVhbCB0b2tlbiBkaWZmZXJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVG9rZW5pemVyUHJvdG90eXBlLnNraXAgPSBmdW5jdGlvbihleHBlY3RlZCkge1xyXG4gICAgICAgICAgICB2YXIgYWN0dWFsID0gdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsICdcIithY3R1YWwrXCInLCAnXCIrZXhwZWN0ZWQrXCInIGV4cGVjdGVkXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9taXRzIGFuIG9wdGlvbmFsIHRva2VuLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBleHBlY3RlZCBFeHBlY3RlZCBvcHRpb25hbCB0b2tlblxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIHRva2VuIGV4aXN0c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRva2VuaXplclByb3RvdHlwZS5vbWl0ID0gZnVuY3Rpb24oZXhwZWN0ZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGVlaygpID09PSBleHBlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFN0cmluZyByZXByZXNlbnRhdGlvbiBhcyBvZiBcIlRva2VuaXplcihpbmRleC9sZW5ndGgpXCJcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVG9rZW5pemVyUHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlRva2VuaXplciAoXCIrdGhpcy5pbmRleCtcIi9cIit0aGlzLnNvdXJjZS5sZW5ndGgrXCIgYXQgbGluZSBcIit0aGlzLmxpbmUrXCIpXCI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkRvdFByb3RvLlRva2VuaXplclxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBEb3RQcm90by5Ub2tlbml6ZXIgPSBUb2tlbml6ZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgUGFyc2VyLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLkRvdFByb3RvLlBhcnNlclxyXG4gICAgICAgICAqIEBjbGFzcyBwcm90b3R5cGUgcGFyc2VyXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSBTb3VyY2VcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgUGFyc2VyID0gZnVuY3Rpb24oc291cmNlKSB7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogVG9rZW5pemVyLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IVByb3RvQnVmLkRvdFByb3RvLlRva2VuaXplcn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy50biA9IG5ldyBUb2tlbml6ZXIoc291cmNlKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBXaGV0aGVyIHBhcnNpbmcgcHJvdG8zIG9yIG5vdC5cclxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnByb3RvMyA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5Eb3RQcm90by5QYXJzZXIucHJvdG90eXBlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFBhcnNlclByb3RvdHlwZSA9IFBhcnNlci5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyB0aGUgc291cmNlLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHshT2JqZWN0fVxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgc291cmNlIGNhbm5vdCBiZSBwYXJzZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3BMZXZlbCA9IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIltST09UXVwiLCAvLyB0ZW1wb3JhcnlcclxuICAgICAgICAgICAgICAgIFwicGFja2FnZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlc1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwiZW51bXNcIjogW10sXHJcbiAgICAgICAgICAgICAgICBcImltcG9ydHNcIjogW10sXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvbnNcIjoge30sXHJcbiAgICAgICAgICAgICAgICBcInNlcnZpY2VzXCI6IFtdXHJcbiAgICAgICAgICAgICAgICAvLyBcInN5bnRheFwiOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIHRva2VuLFxyXG4gICAgICAgICAgICAgICAgaGVhZCA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICB3ZWFrO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRva2VuID0gdGhpcy50bi5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BhY2thZ2UnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkIHx8IHRvcExldmVsW1wicGFja2FnZVwiXSAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVuZXhwZWN0ZWQgJ3BhY2thZ2UnXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBwYWNrYWdlIG5hbWU6IFwiICsgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcExldmVsW1wicGFja2FnZVwiXSA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ltcG9ydCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhlYWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bmV4cGVjdGVkICdpbXBvcnQnXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gXCJwdWJsaWNcIiB8fCAod2VhayA9IHRva2VuID09PSBcIndlYWtcIikpIC8vIHRva2VuIGlnbm9yZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5fcmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghd2VhaykgLy8gaW1wb3J0IGlnbm9yZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BMZXZlbFtcImltcG9ydHNcIl0ucHVzaCh0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3ludGF4JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGVhZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInVuZXhwZWN0ZWQgJ3N5bnRheCdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0b3BMZXZlbFtcInN5bnRheFwiXSA9IHRoaXMuX3JlYWRTdHJpbmcoKSkgPT09IFwicHJvdG8zXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm90bzMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdtZXNzYWdlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZSh0b3BMZXZlbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZW51bSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZUVudW0odG9wTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ29wdGlvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU9wdGlvbih0b3BMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VydmljZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZVNlcnZpY2UodG9wTGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V4dGVuZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZUV4dGVuZCh0b3BMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwidW5leHBlY3RlZCAnXCIgKyB0b2tlbiArIFwiJ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGUubWVzc2FnZSA9IFwiUGFyc2UgZXJyb3IgYXQgbGluZSBcIit0aGlzLnRuLmxpbmUrXCI6IFwiICsgZS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGUgdG9wTGV2ZWxbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9wTGV2ZWw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIHRoZSBzcGVjaWZpZWQgc291cmNlLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHshT2JqZWN0fVxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgc291cmNlIGNhbm5vdCBiZSBwYXJzZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24oc291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGFyc2VyKHNvdXJjZSkucGFyc2UoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBDb252ZXJzaW9uIC0tLS0tLVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIG51bWVyaWNhbCBzdHJpbmcgdG8gYW4gaWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbWF5QmVOZWdhdGl2ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbWtJZCh2YWx1ZSwgbWF5QmVOZWdhdGl2ZSkge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSAtMSxcclxuICAgICAgICAgICAgICAgIHNpZ24gPSAxO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuY2hhckF0KDApID09ICctJykge1xyXG4gICAgICAgICAgICAgICAgc2lnbiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKExhbmcuTlVNQkVSX0RFQy50ZXN0KHZhbHVlKSlcclxuICAgICAgICAgICAgICAgIGlkID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChMYW5nLk5VTUJFUl9IRVgudGVzdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICBpZCA9IHBhcnNlSW50KHZhbHVlLnN1YnN0cmluZygyKSwgMTYpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChMYW5nLk5VTUJFUl9PQ1QudGVzdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICBpZCA9IHBhcnNlSW50KHZhbHVlLnN1YnN0cmluZygxKSwgOCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBpZCB2YWx1ZTogXCIgKyAoc2lnbiA8IDAgPyAnLScgOiAnJykgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlkID0gKHNpZ24qaWQpfDA7IC8vIEZvcmNlIHRvIDMyYml0XHJcbiAgICAgICAgICAgIGlmICghbWF5QmVOZWdhdGl2ZSAmJiBpZCA8IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgaWQgdmFsdWU6IFwiICsgKHNpZ24gPCAwID8gJy0nIDogJycpICsgdmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIG51bWVyaWNhbCBzdHJpbmcgdG8gYSBudW1iZXIuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbWtOdW1iZXIodmFsKSB7XHJcbiAgICAgICAgICAgIHZhciBzaWduID0gMTtcclxuICAgICAgICAgICAgaWYgKHZhbC5jaGFyQXQoMCkgPT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICBzaWduID0gLTE7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWwuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChMYW5nLk5VTUJFUl9ERUMudGVzdCh2YWwpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWwsIDEwKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoTGFuZy5OVU1CRVJfSEVYLnRlc3QodmFsKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsLnN1YnN0cmluZygyKSwgMTYpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChMYW5nLk5VTUJFUl9PQ1QudGVzdCh2YWwpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWwuc3Vic3RyaW5nKDEpLCA4KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodmFsID09PSAnaW5mJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBzaWduICogSW5maW5pdHk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbCA9PT0gJ25hbicpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChMYW5nLk5VTUJFUl9GTFQudGVzdCh2YWwpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKiBwYXJzZUZsb2F0KHZhbCk7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBudW1iZXIgdmFsdWU6IFwiICsgKHNpZ24gPCAwID8gJy0nIDogJycpICsgdmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFJlYWRpbmcgLS0tLS0tXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlYWRzIGEgc3RyaW5nLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3JlYWRTdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gXCJcIixcclxuICAgICAgICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgICAgICAgZGVsaW07XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIGRlbGltID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVsaW0gIT09IFwiJ1wiICYmIGRlbGltICE9PSAnXCInKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBzdHJpbmcgZGVsaW1pdGVyOiBcIitkZWxpbSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChkZWxpbSk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ucGVlaygpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICh0b2tlbiA9PT0gJ1wiJyB8fCB0b2tlbiA9PT0gJ1wiJyk7IC8vIG11bHRpIGxpbmU/XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZWFkcyBhIHZhbHVlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG1heUJlVHlwZVJlZlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ8Ym9vbGVhbnxzdHJpbmd9XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3JlYWRWYWx1ZSA9IGZ1bmN0aW9uKG1heUJlVHlwZVJlZikge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICdcIicgfHwgdG9rZW4gPT09IFwiJ1wiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChMYW5nLk5VTUJFUi50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBta051bWJlcih0b2tlbik7XHJcbiAgICAgICAgICAgIGlmIChMYW5nLkJPT0wudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRva2VuLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyk7XHJcbiAgICAgICAgICAgIGlmIChtYXlCZVR5cGVSZWYgJiYgTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgdmFsdWU6IFwiK3Rva2VuKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gUGFyc2luZyBjb25zdHJ1Y3RzIC0tLS0tXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhIG5hbWVzcGFjZSBvcHRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0fSBwYXJlbnQgUGFyZW50IGRlZmluaXRpb25cclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBpc0xpc3RcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VPcHRpb24gPSBmdW5jdGlvbihwYXJlbnQsIGlzTGlzdCkge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLm5leHQoKSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICcoJykge1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gYWxsb3cgb3B0aW9ucyBvZiB0aGUgZm9ybSBnb29nbGUucHJvdG9idWYuKiBzaW5jZSB0aGV5IHdpbGwganVzdCBnZXQgaWdub3JlZCBhbnl3YXlzXHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoIS9nb29nbGVcXC5wcm90b2J1ZlxcLi8udGVzdCh0b2tlbikpIC8vIEZJWE1FOiBXaHkgc2hvdWxkIHRoYXQgbm90IGJlIGEgdmFsaWQgdHlwZXJlZj9cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgb3B0aW9uIG5hbWU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0b2tlbjtcclxuICAgICAgICAgICAgaWYgKGN1c3RvbSkgeyAvLyAobXlfbWV0aG9kX29wdGlvbikuZm9vLCAobXlfbWV0aG9kX29wdGlvbiksIHNvbWVfbWV0aG9kX29wdGlvbiwgKGZvby5teV9vcHRpb24pLmJhclxyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKCcpJyk7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gJygnK25hbWUrJyknO1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgICAgIGlmIChMYW5nLkZRVFlQRVJFRi50ZXN0KHRva2VuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKCc9Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uVmFsdWUocGFyZW50LCBuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFpc0xpc3QpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldHMgYW4gb3B0aW9uIG9uIHRoZSBzcGVjaWZpZWQgb3B0aW9ucyBvYmplY3QuXHJcbiAgICAgICAgICogQHBhcmFtIHshT2JqZWN0LjxzdHJpbmcsKj59IG9wdGlvbnNcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcnxib29sZWFufSB2YWx1ZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNldE9wdGlvbihvcHRpb25zLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnNbbmFtZV0gPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zW25hbWVdKSlcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW25hbWVdID0gWyBvcHRpb25zW25hbWVdIF07XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zW25hbWVdLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYW4gb3B0aW9uIHZhbHVlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gcGFyZW50XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VPcHRpb25WYWx1ZSA9IGZ1bmN0aW9uKHBhcmVudCwgbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuICE9PSAneycpIHsgLy8gUGxhaW4gdmFsdWVcclxuICAgICAgICAgICAgICAgIHNldE9wdGlvbihwYXJlbnRbXCJvcHRpb25zXCJdLCBuYW1lLCB0aGlzLl9yZWFkVmFsdWUodHJ1ZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBZ2dyZWdhdGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwie1wiKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgodG9rZW4gPSB0aGlzLnRuLm5leHQoKSkgIT09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghTGFuZy5OQU1FLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgb3B0aW9uIG5hbWU6IFwiICsgbmFtZSArIFwiLlwiICsgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRuLm9taXQoXCI6XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRPcHRpb24ocGFyZW50W1wib3B0aW9uc1wiXSwgbmFtZSArIFwiLlwiICsgdG9rZW4sIHRoaXMuX3JlYWRWYWx1ZSh0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU9wdGlvblZhbHVlKHBhcmVudCwgbmFtZSArIFwiLlwiICsgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIGEgc2VydmljZSBkZWZpbml0aW9uLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gcGFyZW50IFBhcmVudCBkZWZpbml0aW9uXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlU2VydmljZSA9IGZ1bmN0aW9uKHBhcmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgc2VydmljZSBuYW1lIGF0IGxpbmUgXCIrdGhpcy50bi5saW5lK1wiOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdG9rZW47XHJcbiAgICAgICAgICAgIHZhciBzdmMgPSB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogbmFtZSxcclxuICAgICAgICAgICAgICAgIFwicnBjXCI6IHt9LFxyXG4gICAgICAgICAgICAgICAgXCJvcHRpb25zXCI6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIntcIik7XHJcbiAgICAgICAgICAgIHdoaWxlICgodG9rZW4gPSB0aGlzLnRuLm5leHQoKSkgIT09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBcIm9wdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uKHN2Yyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gJ3JwYycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VTZXJ2aWNlUlBDKHN2Yyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHNlcnZpY2UgdG9rZW46IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRuLm9taXQoXCI7XCIpO1xyXG4gICAgICAgICAgICBwYXJlbnRbXCJzZXJ2aWNlc1wiXS5wdXNoKHN2Yyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIGEgUlBDIHNlcnZpY2UgZGVmaW5pdGlvbiBvZiB0aGUgZm9ybSBbJ3JwYycsIG5hbWUsIChyZXF1ZXN0KSwgJ3JldHVybnMnLCAocmVzcG9uc2UpXS5cclxuICAgICAgICAgKiBAcGFyYW0geyFPYmplY3R9IHN2YyBTZXJ2aWNlIGRlZmluaXRpb25cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VTZXJ2aWNlUlBDID0gZnVuY3Rpb24oc3ZjKSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gXCJycGNcIixcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmICghTGFuZy5OQU1FLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHJwYyBzZXJ2aWNlIG1ldGhvZCBuYW1lOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdG9rZW47XHJcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSB7XHJcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVzcG9uc2VcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVxdWVzdF9zdHJlYW1cIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcInJlc3BvbnNlX3N0cmVhbVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiOiB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCIoXCIpO1xyXG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAodG9rZW4udG9Mb3dlckNhc2UoKSA9PT0gXCJzdHJlYW1cIikge1xyXG4gICAgICAgICAgICAgIG1ldGhvZFtcInJlcXVlc3Rfc3RyZWFtXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIHJwYyBzZXJ2aWNlIHJlcXVlc3QgdHlwZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICBtZXRob2RbXCJyZXF1ZXN0XCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIilcIik7XHJcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi50b0xvd2VyQ2FzZSgpICE9PSBcInJldHVybnNcIilcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBycGMgc2VydmljZSByZXF1ZXN0IHR5cGUgZGVsaW1pdGVyOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIihcIik7XHJcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi50b0xvd2VyQ2FzZSgpID09PSBcInN0cmVhbVwiKSB7XHJcbiAgICAgICAgICAgICAgbWV0aG9kW1wicmVzcG9uc2Vfc3RyZWFtXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGhvZFtcInJlc3BvbnNlXCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIilcIik7XHJcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5wZWVrKCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ3snKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgodG9rZW4gPSB0aGlzLnRuLm5leHQoKSkgIT09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ29wdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgcnBjIHNlcnZpY2UgdG9rZW46IFwiICsgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5vbWl0KFwiO1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI7XCIpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN2Y1t0eXBlXSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICBzdmNbdHlwZV0gPSB7fTtcclxuICAgICAgICAgICAgc3ZjW3R5cGVdW25hbWVdID0gbWV0aG9kO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhIG1lc3NhZ2UgZGVmaW5pdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0geyFPYmplY3R9IHBhcmVudCBQYXJlbnQgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdD19IGZsZCBGaWVsZCBkZWZpbml0aW9uIGlmIHRoaXMgaXMgYSBncm91cFxyXG4gICAgICAgICAqIEByZXR1cm5zIHshT2JqZWN0fVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZU1lc3NhZ2UgPSBmdW5jdGlvbihwYXJlbnQsIGZsZCkge1xyXG4gICAgICAgICAgICB2YXIgaXNHcm91cCA9ICEhZmxkLFxyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgdmFyIG1zZyA9IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJmaWVsZHNcIjogW10sXHJcbiAgICAgICAgICAgICAgICBcImVudW1zXCI6IFtdLFxyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlc1wiOiBbXSxcclxuICAgICAgICAgICAgICAgIFwib3B0aW9uc1wiOiB7fSxcclxuICAgICAgICAgICAgICAgIFwic2VydmljZXNcIjogW10sXHJcbiAgICAgICAgICAgICAgICBcIm9uZW9mc1wiOiB7fVxyXG4gICAgICAgICAgICAgICAgLy8gXCJleHRlbnNpb25zXCI6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIUxhbmcuTkFNRS50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBcIisoaXNHcm91cCA/IFwiZ3JvdXBcIiA6IFwibWVzc2FnZVwiKStcIiBuYW1lOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgIG1zZ1tcIm5hbWVcIl0gPSB0b2tlbjtcclxuICAgICAgICAgICAgaWYgKGlzR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICBmbGRbXCJpZFwiXSA9IG1rSWQodGhpcy50bi5uZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgbXNnW1wiaXNHcm91cFwiXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLnBlZWsoKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuID09PSAnWycgJiYgZmxkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VGaWVsZE9wdGlvbnMoZmxkKTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwie1wiKTtcclxuICAgICAgICAgICAgd2hpbGUgKCh0b2tlbiA9IHRoaXMudG4ubmV4dCgpKSAhPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTGFuZy5SVUxFLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZUZpZWxkKG1zZywgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4gPT09IFwib25lb2ZcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU1lc3NhZ2VPbmVPZihtc2cpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4gPT09IFwiZW51bVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRW51bShtc2cpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4gPT09IFwibWVzc2FnZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZShtc2cpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4gPT09IFwib3B0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VPcHRpb24obXNnKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuID09PSBcInNlcnZpY2VcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZVNlcnZpY2UobXNnKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuID09PSBcImV4dGVuc2lvbnNcIilcclxuICAgICAgICAgICAgICAgICAgICBpZiAobXNnLmhhc093blByb3BlcnR5KFwiZXh0ZW5zaW9uc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2dbXCJleHRlbnNpb25zXCJdID0gbXNnW1wiZXh0ZW5zaW9uc1wiXS5jb25jYXQodGhpcy5fcGFyc2VFeHRlbnNpb25SYW5nZXMoKSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2dbXCJleHRlbnNpb25zXCJdID0gdGhpcy5fcGFyc2VFeHRlbnNpb25SYW5nZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gXCJyZXNlcnZlZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlSWdub3JlZCgpOyAvLyBUT0RPXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbiA9PT0gXCJleHRlbmRcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZUV4dGVuZChtc2cpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb3RvMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGZpZWxkIHJ1bGU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU1lc3NhZ2VGaWVsZChtc2csIFwib3B0aW9uYWxcIiwgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG1lc3NhZ2UgdG9rZW46IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRuLm9taXQoXCI7XCIpO1xyXG4gICAgICAgICAgICBwYXJlbnRbXCJtZXNzYWdlc1wiXS5wdXNoKG1zZyk7XHJcbiAgICAgICAgICAgIHJldHVybiBtc2c7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFyc2VzIGFuIGlnbm9yZWQgc3RhdGVtZW50LlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZUlnbm9yZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMudG4ucGVlaygpICE9PSAnOycpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYSBtZXNzYWdlIGZpZWxkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gbXNnIE1lc3NhZ2UgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBydWxlIEZpZWxkIHJ1bGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IHR5cGUgRmllbGQgdHlwZSBpZiBhbHJlYWR5IGtub3duIChuZXZlciBrbm93biBmb3IgbWFwcylcclxuICAgICAgICAgKiBAcmV0dXJucyB7IU9iamVjdH0gRmllbGQgZGVzY3JpcHRvclxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZU1lc3NhZ2VGaWVsZCA9IGZ1bmN0aW9uKG1zZywgcnVsZSwgdHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoIUxhbmcuUlVMRS50ZXN0KHJ1bGUpKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG1lc3NhZ2UgZmllbGQgcnVsZTogXCIrcnVsZSk7XHJcbiAgICAgICAgICAgIHZhciBmbGQgPSB7XHJcbiAgICAgICAgICAgICAgICBcInJ1bGVcIjogcnVsZSxcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvbnNcIjoge30sXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IDBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIHRva2VuO1xyXG4gICAgICAgICAgICBpZiAocnVsZSA9PT0gXCJtYXBcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKCc8Jyk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEUudGVzdCh0b2tlbikgJiYgIUxhbmcuVFlQRVJFRi50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgbWVzc2FnZSBmaWVsZCB0eXBlOiBcIiArIHRva2VuKTtcclxuICAgICAgICAgICAgICAgIGZsZFtcImtleXR5cGVcIl0gPSB0b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICghTGFuZy5UWVBFLnRlc3QodG9rZW4pICYmICFMYW5nLlRZUEVSRUYudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG1lc3NhZ2UgZmllbGQ6IFwiICsgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgZmxkW1widHlwZVwiXSA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKCc+Jyk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG1lc3NhZ2UgZmllbGQgbmFtZTogXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICBmbGRbXCJuYW1lXCJdID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRuLnNraXAoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgZmxkW1wiaWRcIl0gPSBta0lkKHRoaXMudG4ubmV4dCgpKTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5wZWVrKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09ICdbJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZUZpZWxkT3B0aW9ucyhmbGQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdHlwZSA9IHR5cGVvZiB0eXBlICE9PSAndW5kZWZpbmVkJyA/IHR5cGUgOiB0aGlzLnRuLm5leHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJncm91cFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFwiQSBbbGVnYWN5XSBncm91cCBzaW1wbHkgY29tYmluZXMgYSBuZXN0ZWQgbWVzc2FnZSB0eXBlIGFuZCBhIGZpZWxkIGludG8gYSBzaW5nbGUgZGVjbGFyYXRpb24uIEluIHlvdXJcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb2RlLCB5b3UgY2FuIHRyZWF0IHRoaXMgbWVzc2FnZSBqdXN0IGFzIGlmIGl0IGhhZCBhIFJlc3VsdCB0eXBlIGZpZWxkIGNhbGxlZCByZXN1bHQgKHRoZSBsYXR0ZXIgbmFtZSBpc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnRlZCB0byBsb3dlci1jYXNlIHNvIHRoYXQgaXQgZG9lcyBub3QgY29uZmxpY3Qgd2l0aCB0aGUgZm9ybWVyKS5cIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncnAgPSB0aGlzLl9wYXJzZU1lc3NhZ2UobXNnLCBmbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghL15bQS1aXS8udGVzdChncnBbXCJuYW1lXCJdKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2lsbGVnYWwgZ3JvdXAgbmFtZTogJytncnBbXCJuYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBmbGRbXCJ0eXBlXCJdID0gZ3JwW1wibmFtZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBmbGRbXCJuYW1lXCJdID0gZ3JwW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG4ub21pdChcIjtcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEUudGVzdCh0eXBlKSAmJiAhTGFuZy5UWVBFUkVGLnRlc3QodHlwZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBtZXNzYWdlIGZpZWxkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxkW1widHlwZVwiXSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUxhbmcuTkFNRS50ZXN0KHRva2VuKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG1lc3NhZ2UgZmllbGQgbmFtZTogXCIgKyB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxkW1wibmFtZVwiXSA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxkW1wiaWRcIl0gPSBta0lkKHRoaXMudG4ubmV4dCgpKTtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG4ucGVlaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gXCJbXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRmllbGRPcHRpb25zKGZsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbXNnW1wiZmllbGRzXCJdLnB1c2goZmxkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZsZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYSBtZXNzYWdlIG9uZW9mLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gbXNnIE1lc3NhZ2UgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZU1lc3NhZ2VPbmVPZiA9IGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgb25lb2YgbmFtZTogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRva2VuLFxyXG4gICAgICAgICAgICAgICAgZmxkO1xyXG4gICAgICAgICAgICB2YXIgZmllbGRzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudG4uc2tpcChcIntcIik7XHJcbiAgICAgICAgICAgIHdoaWxlICgodG9rZW4gPSB0aGlzLnRuLm5leHQoKSkgIT09IFwifVwiKSB7XHJcbiAgICAgICAgICAgICAgICBmbGQgPSB0aGlzLl9wYXJzZU1lc3NhZ2VGaWVsZChtc2csIFwib3B0aW9uYWxcIiwgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgZmxkW1wib25lb2ZcIl0gPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmxkW1wiaWRcIl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG4ub21pdChcIjtcIik7XHJcbiAgICAgICAgICAgIG1zZ1tcIm9uZW9mc1wiXVtuYW1lXSA9IGZpZWxkcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYSBzZXQgb2YgZmllbGQgb3B0aW9uIGRlZmluaXRpb25zLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gZmxkIEZpZWxkIGRlZmluaXRpb25cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VGaWVsZE9wdGlvbnMgPSBmdW5jdGlvbihmbGQpIHtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiW1wiKTtcclxuICAgICAgICAgICAgdmFyIHRva2VuLFxyXG4gICAgICAgICAgICAgICAgZmlyc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB3aGlsZSAoKHRva2VuID0gdGhpcy50bi5wZWVrKCkpICE9PSAnXScpIHtcclxuICAgICAgICAgICAgICAgIGlmICghZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlT3B0aW9uKGZsZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFBhcnNlcyBhbiBlbnVtLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gbXNnIE1lc3NhZ2UgZGVmaW5pdGlvblxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUGFyc2VyUHJvdG90eXBlLl9wYXJzZUVudW0gPSBmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgdmFyIGVubSA9IHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZXNcIjogW10sXHJcbiAgICAgICAgICAgICAgICBcIm9wdGlvbnNcIjoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmICghTGFuZy5OQU1FLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIG5hbWU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgZW5tW1wibmFtZVwiXSA9IHRva2VuO1xyXG4gICAgICAgICAgICB0aGlzLnRuLnNraXAoXCJ7XCIpO1xyXG4gICAgICAgICAgICB3aGlsZSAoKHRva2VuID0gdGhpcy50bi5uZXh0KCkpICE9PSAnfScpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gXCJvcHRpb25cIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU9wdGlvbihlbm0pO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMYW5nLk5BTUUudGVzdCh0b2tlbikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBuYW1lOiBcIit0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiPVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbWtJZCh0aGlzLnRuLm5leHQoKSwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50bi5wZWVrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuID09PSBcIltcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VGaWVsZE9wdGlvbnMoeyBcIm9wdGlvbnNcIjoge30gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbm1bXCJ2YWx1ZXNcIl0ucHVzaCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG4ub21pdChcIjtcIik7XHJcbiAgICAgICAgICAgIG1zZ1tcImVudW1zXCJdLnB1c2goZW5tKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgZXh0ZW5zaW9uIC8gcmVzZXJ2ZWQgcmFuZ2VzLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHshQXJyYXkuPCFBcnJheS48bnVtYmVyPj59XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUuX3BhcnNlRXh0ZW5zaW9uUmFuZ2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHRva2VuLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2UsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBbXTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRuLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gUHJvdG9CdWYuSURfTUlOO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXhcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gUHJvdG9CdWYuSURfTUFYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG1rTnVtYmVyKHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByYW5nZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50bi5wZWVrKCkgIT09IFwidG9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG4ubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmFuZ2VzLnB1c2gocmFuZ2UpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLnRuLm9taXQoXCIsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwiO1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmdlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYXJzZXMgYW4gZXh0ZW5kIGJsb2NrLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gcGFyZW50IFBhcmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFBhcnNlclByb3RvdHlwZS5fcGFyc2VFeHRlbmQgPSBmdW5jdGlvbihwYXJlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy50bi5uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmICghTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGV4dGVuZCByZWZlcmVuY2U6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgdmFyIGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIFwicmVmXCI6IHRva2VuLFxyXG4gICAgICAgICAgICAgICAgXCJmaWVsZHNcIjogW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy50bi5za2lwKFwie1wiKTtcclxuICAgICAgICAgICAgd2hpbGUgKCh0b2tlbiA9IHRoaXMudG4ubmV4dCgpKSAhPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTGFuZy5SVUxFLnRlc3QodG9rZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlTWVzc2FnZUZpZWxkKGV4dCwgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoTGFuZy5UWVBFUkVGLnRlc3QodG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb3RvMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGZpZWxkIHJ1bGU6IFwiK3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZU1lc3NhZ2VGaWVsZChleHQsIFwib3B0aW9uYWxcIiwgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGV4dGVuZCB0b2tlbjogXCIrdG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG4ub21pdChcIjtcIik7XHJcbiAgICAgICAgICAgIHBhcmVudFtcIm1lc3NhZ2VzXCJdLnB1c2goZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4dDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBHZW5lcmFsIC0tLS0tXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBwYXJzZXIuXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBQYXJzZXJQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiUGFyc2VyIGF0IGxpbmUgXCIrdGhpcy50bi5saW5lO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5Eb3RQcm90by5QYXJzZXJcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRG90UHJvdG8uUGFyc2VyID0gUGFyc2VyO1xyXG5cclxuICAgICAgICByZXR1cm4gRG90UHJvdG87XHJcblxyXG4gICAgfSkoUHJvdG9CdWYsIFByb3RvQnVmLkxhbmcpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3RcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYuUmVmbGVjdCA9IChmdW5jdGlvbihQcm90b0J1Zikge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZWZsZWN0aW9uIHR5cGVzLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3RcclxuICAgICAgICAgKiBAbmFtZXNwYWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFJlZmxlY3QgPSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIFJlZmxlY3QgYmFzZSBjbGFzcy5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LlRcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAYWJzdHJhY3RcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHs/UHJvdG9CdWYuUmVmbGVjdC5UfSBwYXJlbnQgUGFyZW50IG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE9iamVjdCBuYW1lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIFQgPSBmdW5jdGlvbihidWlsZGVyLCBwYXJlbnQsIG5hbWUpIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBCdWlsZGVyIHJlZmVyZW5jZS5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5CdWlsZGVyfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkZXIgPSBidWlsZGVyO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFBhcmVudCBvYmplY3QuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHs/UHJvdG9CdWYuUmVmbGVjdC5UfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBPYmplY3QgbmFtZSBpbiBuYW1lc3BhY2UuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRnVsbHkgcXVhbGlmaWVkIGNsYXNzIG5hbWVcclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuVC5wcm90b3R5cGVcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgVFByb3RvdHlwZSA9IFQucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmdWxseSBxdWFsaWZpZWQgbmFtZSBvZiB0aGlzIG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBGdWxseSBxdWFsaWZpZWQgbmFtZSBhcyBvZiBcIi5QQVRILlRPLlRISVNcIlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBUUHJvdG90eXBlLmZxbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMubmFtZSxcclxuICAgICAgICAgICAgICAgIHB0ciA9IHRoaXM7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHB0ciA9IHB0ci5wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocHRyID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcHRyLm5hbWUrXCIuXCIrbmFtZTtcclxuICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBSZWZsZWN0IG9iamVjdCAoaXRzIGZ1bGx5IHF1YWxpZmllZCBuYW1lKS5cclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBpbmNsdWRlQ2xhc3MgU2V0IHRvIHRydWUgdG8gaW5jbHVkZSB0aGUgY2xhc3MgbmFtZS4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAgICAgICAgICogQHJldHVybiBTdHJpbmcgcmVwcmVzZW50YXRpb25cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgVFByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGluY2x1ZGVDbGFzcykge1xyXG4gICAgICAgICAgICByZXR1cm4gKGluY2x1ZGVDbGFzcyA/IHRoaXMuY2xhc3NOYW1lICsgXCIgXCIgOiBcIlwiKSArIHRoaXMuZnFuKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoaXMgdHlwZS5cclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhpcyB0eXBlIGNhbm5vdCBiZSBidWlsdCBkaXJlY3RseVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBUUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMudG9TdHJpbmcodHJ1ZSkrXCIgY2Fubm90IGJlIGJ1aWx0IGRpcmVjdGx5XCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LlRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5UID0gVDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBOYW1lc3BhY2UuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHs/UHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2V9IHBhcmVudCBOYW1lc3BhY2UgcGFyZW50XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZXNwYWNlIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBOYW1lc3BhY2Ugb3B0aW9uc1xyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nP30gc3ludGF4IFRoZSBzeW50YXggbGV2ZWwgb2YgdGhpcyBkZWZpbml0aW9uIChlLmcuLCBwcm90bzMpXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5UXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIE5hbWVzcGFjZSA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHBhcmVudCwgbmFtZSwgb3B0aW9ucywgc3ludGF4KSB7XHJcbiAgICAgICAgICAgIFQuY2FsbCh0aGlzLCBidWlsZGVyLCBwYXJlbnQsIG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIk5hbWVzcGFjZVwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENoaWxkcmVuIGluc2lkZSB0aGUgbmFtZXNwYWNlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IUFycmF5LjxQcm90b0J1Zi5SZWZsZWN0LlQ+fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9wdGlvbnMuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshT2JqZWN0LjxzdHJpbmcsICo+fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTeW50YXggbGV2ZWwgKGUuZy4sIHByb3RvMiBvciBwcm90bzMpLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IXN0cmluZ31cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuc3ludGF4ID0gc3ludGF4IHx8IFwicHJvdG8yXCI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTmFtZXNwYWNlLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBOYW1lc3BhY2VQcm90b3R5cGUgPSBOYW1lc3BhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShULnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIG5hbWVzcGFjZSdzIGNoaWxkcmVuLlxyXG4gICAgICAgICAqIEBwYXJhbSB7UHJvdG9CdWYuUmVmbGVjdC5UPX0gdHlwZSBGaWx0ZXIgdHlwZSAocmV0dXJucyBpbnN0YW5jZXMgb2YgdGhpcyB0eXBlIG9ubHkpLiBEZWZhdWx0cyB0byBudWxsIChhbGwgY2hpbGRyZW4pLlxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5LjxQcm90b0J1Zi5SZWZsZWN0LlQ+fVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUuZ2V0Q2hpbGRyZW4gPSBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5zbGljZSgpO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPXRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpPGs7ICsraSlcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldIGluc3RhbmNlb2YgdHlwZSlcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWRkcyBhIGNoaWxkIHRvIHRoZSBuYW1lc3BhY2UuXHJcbiAgICAgICAgICogQHBhcmFtIHtQcm90b0J1Zi5SZWZsZWN0LlR9IGNoaWxkIENoaWxkXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBjaGlsZCBjYW5ub3QgYmUgYWRkZWQgKGR1cGxpY2F0ZSlcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTmFtZXNwYWNlUHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24oY2hpbGQpIHtcclxuICAgICAgICAgICAgdmFyIG90aGVyO1xyXG4gICAgICAgICAgICBpZiAob3RoZXIgPSB0aGlzLmdldENoaWxkKGNoaWxkLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gcmV2ZXJ0IGNhbWVsY2FzZSB0cmFuc2Zvcm1hdGlvbiBvbiBjb2xsaXNpb25cclxuICAgICAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIE1lc3NhZ2UuRmllbGQgJiYgb3RoZXIubmFtZSAhPT0gb3RoZXIub3JpZ2luYWxOYW1lICYmIHRoaXMuZ2V0Q2hpbGQob3RoZXIub3JpZ2luYWxOYW1lKSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBvdGhlci5uYW1lID0gb3RoZXIub3JpZ2luYWxOYW1lOyAvLyBSZXZlcnQgcHJldmlvdXMgZmlyc3QgKGVmZmVjdGl2ZWx5IGtlZXBzIGJvdGggb3JpZ2luYWxzKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBNZXNzYWdlLkZpZWxkICYmIGNoaWxkLm5hbWUgIT09IGNoaWxkLm9yaWdpbmFsTmFtZSAmJiB0aGlzLmdldENoaWxkKGNoaWxkLm9yaWdpbmFsTmFtZSkgPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQubmFtZSA9IGNoaWxkLm9yaWdpbmFsTmFtZTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIkR1cGxpY2F0ZSBuYW1lIGluIG5hbWVzcGFjZSBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIitjaGlsZC5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYSBjaGlsZCBieSBpdHMgbmFtZSBvciBpZC5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IG5hbWVPcklkIENoaWxkIG5hbWUgb3IgaWRcclxuICAgICAgICAgKiBAcmV0dXJuIHs/UHJvdG9CdWYuUmVmbGVjdC5UfSBUaGUgY2hpbGQgb3IgbnVsbCBpZiBub3QgZm91bmRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTmFtZXNwYWNlUHJvdG90eXBlLmdldENoaWxkID0gZnVuY3Rpb24obmFtZU9ySWQpIHtcclxuICAgICAgICAgICAgdmFyIGtleSA9IHR5cGVvZiBuYW1lT3JJZCA9PT0gJ251bWJlcicgPyAnaWQnIDogJ25hbWUnO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9dGhpcy5jaGlsZHJlbi5sZW5ndGg7IGk8azsgKytpKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW5baV1ba2V5XSA9PT0gbmFtZU9ySWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlc29sdmVzIGEgcmVmbGVjdCBvYmplY3QgaW5zaWRlIG9mIHRoaXMgbmFtZXNwYWNlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfCFBcnJheS48c3RyaW5nPn0gcW4gUXVhbGlmaWVkIG5hbWUgdG8gcmVzb2x2ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGV4Y2x1ZGVOb25OYW1lc3BhY2UgRXhjbHVkZXMgbm9uLW5hbWVzcGFjZSB0eXBlcywgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAqIEByZXR1cm4gez9Qcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZX0gVGhlIHJlc29sdmVkIHR5cGUgb3IgbnVsbCBpZiBub3QgZm91bmRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTmFtZXNwYWNlUHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihxbiwgZXhjbHVkZU5vbk5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFydCA9IHR5cGVvZiBxbiA9PT0gJ3N0cmluZycgPyBxbi5zcGxpdChcIi5cIikgOiBxbixcclxuICAgICAgICAgICAgICAgIHB0ciA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgaWYgKHBhcnRbaV0gPT09IFwiXCIpIHsgLy8gRnVsbHkgcXVhbGlmaWVkIG5hbWUsIGUuZy4gXCIuTXkuTWVzc2FnZSdcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwdHIucGFyZW50ICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHB0ciA9IHB0ci5wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNoaWxkO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocHRyIGluc3RhbmNlb2YgUmVmbGVjdC5OYW1lc3BhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHB0ciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IHB0ci5nZXRDaGlsZChwYXJ0W2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoaWxkIHx8ICEoY2hpbGQgaW5zdGFuY2VvZiBSZWZsZWN0LlQpIHx8IChleGNsdWRlTm9uTmFtZXNwYWNlICYmICEoY2hpbGQgaW5zdGFuY2VvZiBSZWZsZWN0Lk5hbWVzcGFjZSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHB0ciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwdHIgPSBjaGlsZDsgaSsrO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoaSA8IHBhcnQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGlmIChwdHIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBicmVhazsgLy8gRm91bmRcclxuICAgICAgICAgICAgICAgIC8vIEVsc2Ugc2VhcmNoIHRoZSBwYXJlbnRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQucmVzb2x2ZShxbiwgZXhjbHVkZU5vbk5hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHB0ciAhPSBudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHB0cjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZXRlcm1pbmVzIHRoZSBzaG9ydGVzdCBxdWFsaWZpZWQgbmFtZSBvZiB0aGUgc3BlY2lmaWVkIHR5cGUsIGlmIGFueSwgcmVsYXRpdmUgdG8gdGhpcyBuYW1lc3BhY2UuXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5UfSB0IFJlZmxlY3Rpb24gdHlwZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzaG9ydGVzdCBxdWFsaWZpZWQgbmFtZSBvciwgaWYgdGhlcmUgaXMgbm9uZSwgdGhlIGZxblxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBOYW1lc3BhY2VQcm90b3R5cGUucW4gPSBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0ID0gW10sIHB0ciA9IHQ7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHBhcnQudW5zaGlmdChwdHIubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBwdHIgPSBwdHIucGFyZW50O1xyXG4gICAgICAgICAgICB9IHdoaWxlIChwdHIgIT09IG51bGwpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBsZW49MTsgbGVuIDw9IHBhcnQubGVuZ3RoOyBsZW4rKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHFuID0gcGFydC5zbGljZShwYXJ0Lmxlbmd0aC1sZW4pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHQgPT09IHRoaXMucmVzb2x2ZShxbiwgdCBpbnN0YW5jZW9mIFJlZmxlY3QuTmFtZXNwYWNlKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcW4uam9pbihcIi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHQuZnFuKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoZSBuYW1lc3BhY2UgYW5kIHJldHVybnMgdGhlIHJ1bnRpbWUgY291bnRlcnBhcnQuXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0LjxzdHJpbmcsRnVuY3Rpb258T2JqZWN0Pn0gUnVudGltZSBuYW1lc3BhY2VcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTmFtZXNwYWNlUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qKiBAZGljdCAqL1xyXG4gICAgICAgICAgICB2YXIgbnMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPWNoaWxkcmVuLmxlbmd0aCwgY2hpbGQ7IGk8azsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgTmFtZXNwYWNlKVxyXG4gICAgICAgICAgICAgICAgICAgIG5zW2NoaWxkLm5hbWVdID0gY2hpbGQuYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCBcIiRvcHRpb25zXCIsIHsgXCJ2YWx1ZVwiOiB0aGlzLmJ1aWxkT3B0KCkgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBucztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhlIG5hbWVzcGFjZSdzICckb3B0aW9ucycgcHJvcGVydHkuXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0LjxzdHJpbmcsKj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTmFtZXNwYWNlUHJvdG90eXBlLmJ1aWxkT3B0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHQgPSB7fSxcclxuICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpPTAsIGs9a2V5cy5sZW5ndGg7IGk8azsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXSxcclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLm9wdGlvbnNba2V5c1tpXV07XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBPcHRpb25zIGFyZSBub3QgcmVzb2x2ZWQsIHlldC5cclxuICAgICAgICAgICAgICAgIC8vIGlmICh2YWwgaW5zdGFuY2VvZiBOYW1lc3BhY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBvcHRba2V5XSA9IHZhbC5idWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9wdFtrZXldID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvcHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgdmFsdWUgYXNzaWduZWQgdG8gdGhlIG9wdGlvbiB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG5hbWUgUmV0dXJucyB0aGUgb3B0aW9uIHZhbHVlIGlmIHNwZWNpZmllZCwgb3RoZXJ3aXNlIGFsbCBvcHRpb25zIGFyZSByZXR1cm5lZC5cclxuICAgICAgICAgKiBAcmV0dXJuIHsqfE9iamVjdC48c3RyaW5nLCo+fW51bGx9IE9wdGlvbiB2YWx1ZSBvciBOVUxMIGlmIHRoZXJlIGlzIG5vIHN1Y2ggb3B0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTmFtZXNwYWNlUHJvdG90eXBlLmdldE9wdGlvbiA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5vcHRpb25zW25hbWVdICE9PSAndW5kZWZpbmVkJyA/IHRoaXMub3B0aW9uc1tuYW1lXSA6IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTmFtZXNwYWNlXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuTmFtZXNwYWNlID0gTmFtZXNwYWNlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IEVsZW1lbnQgaW1wbGVtZW50YXRpb24gdGhhdCBjaGVja3MgYW5kIGNvbnZlcnRzIHZhbHVlcyBmb3IgYVxyXG4gICAgICAgICAqIHBhcnRpY3VsYXIgZmllbGQgdHlwZSwgYXMgYXBwcm9wcmlhdGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBBbiBFbGVtZW50IHJlcHJlc2VudHMgYSBzaW5nbGUgdmFsdWU6IGVpdGhlciB0aGUgdmFsdWUgb2YgYSBzaW5ndWxhciBmaWVsZCxcclxuICAgICAgICAgKiBvciBhIHZhbHVlIGNvbnRhaW5lZCBpbiBvbmUgZW50cnkgb2YgYSByZXBlYXRlZCBmaWVsZCBvciBtYXAgZmllbGQuIFRoaXNcclxuICAgICAgICAgKiBjbGFzcyBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlc2UgaGlnaGVyLWxldmVsIGNvbmNlcHRzOyBpdCBvbmx5IGVuY2Fwc3VsYXRlc1xyXG4gICAgICAgICAqIHRoZSBsb3ctbGV2ZWwgdHlwZWNoZWNraW5nIGFuZCBjb252ZXJzaW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5FbGVtZW50XHJcbiAgICAgICAgICogQHBhcmFtIHt7bmFtZTogc3RyaW5nLCB3aXJlVHlwZTogbnVtYmVyfX0gdHlwZSBSZXNvbHZlZCBkYXRhIHR5cGVcclxuICAgICAgICAgKiBAcGFyYW0ge1Byb3RvQnVmLlJlZmxlY3QuVHxudWxsfSByZXNvbHZlZFR5cGUgUmVzb2x2ZWQgdHlwZSwgaWYgcmVsZXZhbnRcclxuICAgICAgICAgKiAoZS5nLiBzdWJtZXNzYWdlIGZpZWxkKS5cclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzTWFwS2V5IElzIHRoaXMgZWxlbWVudCBhIE1hcCBrZXk/IFRoZSB2YWx1ZSB3aWxsIGJlXHJcbiAgICAgICAgICogY29udmVydGVkIHRvIHN0cmluZyBmb3JtIGlmIHNvLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzeW50YXggU3ludGF4IGxldmVsIG9mIGRlZmluaW5nIG1lc3NhZ2UgdHlwZSwgZS5nLixcclxuICAgICAgICAgKiBwcm90bzIgb3IgcHJvdG8zLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGZpZWxkIGNvbnRhaW5pbmcgdGhpcyBlbGVtZW50IChmb3IgZXJyb3JcclxuICAgICAgICAgKiBtZXNzYWdlcylcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgRWxlbWVudCA9IGZ1bmN0aW9uKHR5cGUsIHJlc29sdmVkVHlwZSwgaXNNYXBLZXksIHN5bnRheCwgbmFtZSkge1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVsZW1lbnQgdHlwZSwgYXMgYSBzdHJpbmcgKGUuZy4sIGludDMyKS5cclxuICAgICAgICAgICAgICogQHR5cGUge3tuYW1lOiBzdHJpbmcsIHdpcmVUeXBlOiBudW1iZXJ9fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBFbGVtZW50IHR5cGUgcmVmZXJlbmNlIHRvIHN1Ym1lc3NhZ2Ugb3IgZW51bSBkZWZpbml0aW9uLCBpZiBuZWVkZWQuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5SZWZsZWN0LlR8bnVsbH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRUeXBlID0gcmVzb2x2ZWRUeXBlO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVsZW1lbnQgaXMgYSBtYXAga2V5LlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuaXNNYXBLZXkgPSBpc01hcEtleTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTeW50YXggbGV2ZWwgb2YgZGVmaW5pbmcgbWVzc2FnZSB0eXBlLCBlLmcuLCBwcm90bzIgb3IgcHJvdG8zLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5zeW50YXggPSBzeW50YXg7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTmFtZSBvZiB0aGUgZmllbGQgY29udGFpbmluZyB0aGlzIGVsZW1lbnQgKGZvciBlcnJvciBtZXNzYWdlcylcclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNNYXBLZXkgJiYgUHJvdG9CdWYuTUFQX0tFWV9UWVBFUy5pbmRleE9mKHR5cGUpIDwgMClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSW52YWxpZCBtYXAga2V5IHR5cGU6IFwiICsgdHlwZS5uYW1lKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgRWxlbWVudFByb3RvdHlwZSA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBPYnRhaW5zIGEgKG5ldykgZGVmYXVsdCB2YWx1ZSBmb3IgdGhlIHNwZWNpZmllZCB0eXBlLlxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIHtzdHJpbmd8e25hbWU6IHN0cmluZywgd2lyZVR5cGU6IG51bWJlcn19IEZpZWxkIHR5cGVcclxuICAgICAgICAgKiBAcmV0dXJucyB7Kn0gRGVmYXVsdCB2YWx1ZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIG1rRGVmYXVsdCh0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gUHJvdG9CdWYuVFlQRVNbdHlwZV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHlwZS5kZWZhdWx0VmFsdWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJkZWZhdWx0IHZhbHVlIGZvciB0eXBlIFwiK3R5cGUubmFtZStcIiBpcyBub3Qgc3VwcG9ydGVkXCIpO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBQcm90b0J1Zi5UWVBFU1tcImJ5dGVzXCJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCeXRlQnVmZmVyKDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZS5kZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIGZpZWxkIGluIHByb3RvMy5cclxuICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSB7c3RyaW5nfHtuYW1lOiBzdHJpbmcsIHdpcmVUeXBlOiBudW1iZXJ9fSB0aGUgZmllbGQgdHlwZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHsqfSBEZWZhdWx0IHZhbHVlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRWxlbWVudC5kZWZhdWx0RmllbGRWYWx1ZSA9IG1rRGVmYXVsdDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFrZXMgYSBMb25nIGZyb20gYSB2YWx1ZS5cclxuICAgICAgICAgKiBAcGFyYW0ge3tsb3c6IG51bWJlciwgaGlnaDogbnVtYmVyLCB1bnNpZ25lZDogYm9vbGVhbn18c3RyaW5nfG51bWJlcn0gdmFsdWUgVmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZCBXaGV0aGVyIHVuc2lnbmVkIG9yIG5vdCwgZGVmYXVsdHMgdG8gcmV1c2UgaXQgZnJvbSBMb25nLWxpa2Ugb2JqZWN0cyBvciB0byBzaWduZWQgZm9yXHJcbiAgICAgICAgICogIHN0cmluZ3MgYW5kIG51bWJlcnNcclxuICAgICAgICAgKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgTG9uZ1xyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIG1rTG9uZyh2YWx1ZSwgdW5zaWduZWQpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sb3cgPT09ICdudW1iZXInICYmIHR5cGVvZiB2YWx1ZS5oaWdoID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgdmFsdWUudW5zaWduZWQgPT09ICdib29sZWFuJ1xyXG4gICAgICAgICAgICAgICAgJiYgdmFsdWUubG93ID09PSB2YWx1ZS5sb3cgJiYgdmFsdWUuaGlnaCA9PT0gdmFsdWUuaGlnaClcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvdG9CdWYuTG9uZyh2YWx1ZS5sb3csIHZhbHVlLmhpZ2gsIHR5cGVvZiB1bnNpZ25lZCA9PT0gJ3VuZGVmaW5lZCcgPyB2YWx1ZS51bnNpZ25lZCA6IHVuc2lnbmVkKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvdG9CdWYuTG9uZy5mcm9tU3RyaW5nKHZhbHVlLCB1bnNpZ25lZCB8fCBmYWxzZSwgMTApO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm90b0J1Zi5Mb25nLmZyb21OdW1iZXIodmFsdWUsIHVuc2lnbmVkIHx8IGZhbHNlKTtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJub3QgY29udmVydGlibGUgdG8gTG9uZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVsZW1lbnRQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLm5hbWUgfHwgJycpICsgKHRoaXMuaXNNYXBLZXkgPyAnbWFwJyA6ICd2YWx1ZScpICsgJyBlbGVtZW50JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gdmFsdWUgY2FuIGJlIHNldCBmb3IgYW4gZWxlbWVudCBvZiB0aGlzIHR5cGUgKHNpbmd1bGFyXHJcbiAgICAgICAgICogZmllbGQgb3Igb25lIGVsZW1lbnQgb2YgYSByZXBlYXRlZCBmaWVsZCBvciBtYXApLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVmFsdWUgdG8gY2hlY2tcclxuICAgICAgICAgKiBAcmV0dXJuIHsqfSBWZXJpZmllZCwgbWF5YmUgYWRqdXN0ZWQsIHZhbHVlXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgdmVyaWZpZWQgZm9yIHRoaXMgZWxlbWVudCBzbG90XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVsZW1lbnRQcm90b3R5cGUudmVyaWZ5VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZhaWwodmFsLCBtc2cpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB2YWx1ZSBmb3IgXCIrc2VsZi50b1N0cmluZyh0cnVlKStcIiBvZiB0eXBlIFwiK3NlbGYudHlwZS5uYW1lK1wiOiBcIit2YWwrXCIgKFwiK21zZytcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNpZ25lZCAzMmJpdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzZml4ZWQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICAvLyBBY2NvdW50IGZvciAhTmFOOiB2YWx1ZSA9PT0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCAodmFsdWUgPT09IHZhbHVlICYmIHZhbHVlICUgMSAhPT0gMCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vdCBhbiBpbnRlZ2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA+IDQyOTQ5NjcyOTUgPyB2YWx1ZSB8IDAgOiB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVbnNpZ25lZCAzMmJpdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8ICh2YWx1ZSA9PT0gdmFsdWUgJiYgdmFsdWUgJSAxICE9PSAwKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwibm90IGFuIGludGVnZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIDwgMCA/IHZhbHVlID4+PiAwIDogdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2lnbmVkIDY0Yml0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDY0XCJdOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFByb3RvQnVmLkxvbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWtMb25nKHZhbHVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJyZXF1aXJlcyBMb25nLmpzXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVuc2lnbmVkIDY0Yml0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl06IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUHJvdG9CdWYuTG9uZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBta0xvbmcodmFsdWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwicmVxdWlyZXMgTG9uZy5qc1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBCb29sXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYm9vbFwiXTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vdCBhIGJvb2xlYW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZsb2F0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZmxvYXRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZG91YmxlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJub3QgYSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlbmd0aC1kZWxpbWl0ZWQgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic3RyaW5nXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnICYmICEodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJub3QgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCIrdmFsdWU7IC8vIENvbnZlcnQgU3RyaW5nIG9iamVjdCB0byBzdHJpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZW5ndGgtZGVsaW1pdGVkIGJ5dGVzXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEJ5dGVCdWZmZXIuaXNCeXRlQnVmZmVyKHZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLndyYXAodmFsdWUsIFwiYmFzZTY0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENvbnN0YW50IGVudW0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJlbnVtXCJdOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMucmVzb2x2ZWRUeXBlLmdldENoaWxkcmVuKFByb3RvQnVmLlJlZmxlY3QuRW51bS5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzW2ldLm5hbWUgPT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW2ldLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZXNbaV0uaWQgPT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW2ldLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zeW50YXggPT09ICdwcm90bzMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb3RvMzoganVzdCBtYWtlIHN1cmUgaXQncyBhbiBpbnRlZ2VyLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCAodmFsdWUgPT09IHZhbHVlICYmIHZhbHVlICUgMSAhPT0gMCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJub3QgYW4gaW50ZWdlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gNDI5NDk2NzI5NSB8fCB2YWx1ZSA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJub3QgaW4gcmFuZ2UgZm9yIHVpbnQzMlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvdG8yIHJlcXVpcmVzIGVudW0gdmFsdWVzIHRvIGJlIHZhbGlkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWlsKHZhbHVlLCBcIm5vdCBhIHZhbGlkIGVudW0gdmFsdWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gRW1iZWRkZWQgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImdyb3VwXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl06IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm9iamVjdCBleHBlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiB0aGlzLnJlc29sdmVkVHlwZS5jbGF6eilcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNaXNtYXRjaGVkIHR5cGU6IENvbnZlcnQgdG8gb2JqZWN0IChzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kY29kZUlPL1Byb3RvQnVmLmpzL2lzc3Vlcy8xODApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbaV0gPSB2YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVsc2UgbGV0J3MgdHJ5IHRvIGNvbnN0cnVjdCBvbmUgZnJvbSBhIGtleS12YWx1ZSBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3ICh0aGlzLnJlc29sdmVkVHlwZS5jbGF6eikodmFsdWUpOyAvLyBNYXkgdGhyb3cgZm9yIGEgaHVuZHJlZCBvZiByZWFzb25zXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFdlIHNob3VsZCBuZXZlciBlbmQgaGVyZVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIltJTlRFUk5BTF0gSWxsZWdhbCB2YWx1ZSBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrdmFsdWUrXCIgKHVuZGVmaW5lZCB0eXBlIFwiK3RoaXMudHlwZStcIilcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FsY3VsYXRlcyB0aGUgYnl0ZSBsZW5ndGggb2YgYW4gZWxlbWVudCBvbiB0aGUgd2lyZS5cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgRmllbGQgbnVtYmVyXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBGaWVsZCB2YWx1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgY2FsY3VsYXRlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBFbGVtZW50UHJvdG90eXBlLmNhbGN1bGF0ZUxlbmd0aCA9IGZ1bmN0aW9uKGlkLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiAwOyAvLyBOb3RoaW5nIHRvIGVuY29kZVxyXG4gICAgICAgICAgICAvLyBUYWcgaGFzIGFscmVhZHkgYmVlbiB3cml0dGVuXHJcbiAgICAgICAgICAgIHZhciBuO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA8IDAgPyBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDY0KHZhbHVlKSA6IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKEJ5dGVCdWZmZXIuemlnWmFnRW5jb2RlMzIodmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZsb2F0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQ2NCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDY0KEJ5dGVCdWZmZXIuemlnWmFnRW5jb2RlNjQodmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA4O1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJvb2xcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZW51bVwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZG91YmxlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA4O1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInN0cmluZ1wiXTpcclxuICAgICAgICAgICAgICAgICAgICBuID0gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVVVEY4Qnl0ZXModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKG4pICsgbjtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJieXRlc1wiXTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUucmVtYWluaW5nKCkgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgdmFsdWUgZm9yIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3ZhbHVlLnJlbWFpbmluZygpK1wiIGJ5dGVzIHJlbWFpbmluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMih2YWx1ZS5yZW1haW5pbmcoKSkgKyB2YWx1ZS5yZW1haW5pbmcoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJtZXNzYWdlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLnJlc29sdmVkVHlwZS5jYWxjdWxhdGUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKG4pICsgbjtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJncm91cFwiXTpcclxuICAgICAgICAgICAgICAgICAgICBuID0gdGhpcy5yZXNvbHZlZFR5cGUuY2FsY3VsYXRlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbiArIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoKGlkIDw8IDMpIHwgUHJvdG9CdWYuV0lSRV9UWVBFUy5FTkRHUk9VUCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gV2Ugc2hvdWxkIG5ldmVyIGVuZCBoZXJlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiW0lOVEVSTkFMXSBJbGxlZ2FsIHZhbHVlIHRvIGVuY29kZSBpbiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit2YWx1ZStcIiAodW5rbm93biB0eXBlKVwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbmNvZGVzIGEgdmFsdWUgdG8gdGhlIHNwZWNpZmllZCBidWZmZXIuIERvZXMgbm90IGVuY29kZSB0aGUga2V5LlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBGaWVsZCBudW1iZXJcclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIEZpZWxkIHZhbHVlXHJcbiAgICAgICAgICogQHBhcmFtIHtCeXRlQnVmZmVyfSBidWZmZXIgQnl0ZUJ1ZmZlciB0byBlbmNvZGUgdG9cclxuICAgICAgICAgKiBAcmV0dXJuIHtCeXRlQnVmZmVyfSBUaGUgQnl0ZUJ1ZmZlciBmb3IgY2hhaW5pbmdcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBlbmNvZGVkXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVsZW1lbnRQcm90b3R5cGUuZW5jb2RlVmFsdWUgPSBmdW5jdGlvbihpZCwgdmFsdWUsIGJ1ZmZlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiBidWZmZXI7IC8vIE5vdGhpbmcgdG8gZW5jb2RlXHJcbiAgICAgICAgICAgIC8vIFRhZyBoYXMgYWxyZWFkeSBiZWVuIHdyaXR0ZW5cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAzMmJpdCBzaWduZWQgdmFyaW50XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJJZiB5b3UgdXNlIGludDMyIG9yIGludDY0IGFzIHRoZSB0eXBlIGZvciBhIG5lZ2F0aXZlIG51bWJlciwgdGhlIHJlc3VsdGluZyB2YXJpbnQgaXMgYWx3YXlzIHRlbiBieXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvbmcg4oCTIGl0IGlzLCBlZmZlY3RpdmVseSwgdHJlYXRlZCBsaWtlIGEgdmVyeSBsYXJnZSB1bnNpZ25lZCBpbnRlZ2VyLlwiIChzZWUgIzEyMilcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQ2NCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMzJiaXQgdW5zaWduZWQgdmFyaW50XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAzMmJpdCB2YXJpbnQgemlnLXphZ1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMlppZ1phZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRml4ZWQgdW5zaWduZWQgMzJiaXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVVpbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRml4ZWQgc2lnbmVkIDMyYml0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlSW50MzIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IHZhcmludCBhcy1pc1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQ2NCh2YWx1ZSk7IC8vIHRocm93c1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IHZhcmludCB6aWctemFnXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDY0WmlnWmFnKHZhbHVlKTsgLy8gdGhyb3dzXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRml4ZWQgdW5zaWduZWQgNjRiaXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVVpbnQ2NCh2YWx1ZSk7IC8vIHRocm93c1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEZpeGVkIHNpZ25lZCA2NGJpdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZUludDY0KHZhbHVlKTsgLy8gdGhyb3dzXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQm9vbFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJvb2xcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdmYWxzZScgPyAwIDogISF2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMih2YWx1ZSA/IDEgOiAwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb25zdGFudCBlbnVtIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZW51bVwiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMzJiaXQgZmxvYXRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmbG9hdFwiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVGbG9hdDMyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyA2NGJpdCBmbG9hdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImRvdWJsZVwiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVGbG9hdDY0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZW5ndGgtZGVsaW1pdGVkIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInN0cmluZ1wiXTpcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZW5ndGgtZGVsaW1pdGVkIGJ5dGVzXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnJlbWFpbmluZygpIDwgMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHZhbHVlIGZvciBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit2YWx1ZS5yZW1haW5pbmcoKStcIiBieXRlcyByZW1haW5pbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZPZmZzZXQgPSB2YWx1ZS5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIodmFsdWUucmVtYWluaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5hcHBlbmQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLm9mZnNldCA9IHByZXZPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRW1iZWRkZWQgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJiID0gbmV3IEJ5dGVCdWZmZXIoKS5MRSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRUeXBlLmVuY29kZSh2YWx1ZSwgYmIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKGJiLm9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmFwcGVuZChiYi5mbGlwKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlZ2FjeSBncm91cFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImdyb3VwXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRUeXBlLmVuY29kZSh2YWx1ZSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMigoaWQgPDwgMykgfCBQcm90b0J1Zi5XSVJFX1RZUEVTLkVOREdST1VQKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHNob3VsZCBuZXZlciBlbmQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiW0lOVEVSTkFMXSBJbGxlZ2FsIHZhbHVlIHRvIGVuY29kZSBpbiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit2YWx1ZStcIiAodW5rbm93biB0eXBlKVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlY29kZSBvbmUgZWxlbWVudCB2YWx1ZSBmcm9tIHRoZSBzcGVjaWZpZWQgYnVmZmVyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qnl0ZUJ1ZmZlcn0gYnVmZmVyIEJ5dGVCdWZmZXIgdG8gZGVjb2RlIGZyb21cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lyZVR5cGUgVGhlIGZpZWxkIHdpcmUgdHlwZVxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBUaGUgZmllbGQgbnVtYmVyXHJcbiAgICAgICAgICogQHJldHVybiB7Kn0gRGVjb2RlZCB2YWx1ZVxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgZmllbGQgY2Fubm90IGJlIGRlY29kZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRWxlbWVudFByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbihidWZmZXIsIHdpcmVUeXBlLCBpZCkge1xyXG4gICAgICAgICAgICBpZiAod2lyZVR5cGUgIT0gdGhpcy50eXBlLndpcmVUeXBlKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmV4cGVjdGVkIHdpcmUgdHlwZSBmb3IgZWxlbWVudFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSwgbkJ5dGVzO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gMzJiaXQgc2lnbmVkIHZhcmludFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZFZhcmludDMyKCkgfCAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDMyYml0IHVuc2lnbmVkIHZhcmludFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWYXJpbnQzMigpID4+PiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDMyYml0IHNpZ25lZCB2YXJpbnQgemlnLXphZ1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWYXJpbnQzMlppZ1phZygpIHwgMDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXhlZCAzMmJpdCB1bnNpZ25lZFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkVWludDMyKCkgPj4+IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIucmVhZEludDMyKCkgfCAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IHNpZ25lZCB2YXJpbnRcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWYXJpbnQ2NCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDY0Yml0IHVuc2lnbmVkIHZhcmludFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWYXJpbnQ2NCgpLnRvVW5zaWduZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyA2NGJpdCBzaWduZWQgdmFyaW50IHppZy16YWdcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkVmFyaW50NjRaaWdaYWcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGaXhlZCA2NGJpdCB1bnNpZ25lZFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkVWludDY0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRml4ZWQgNjRiaXQgc2lnbmVkXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkSW50NjQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBCb29sIHZhcmludFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJvb2xcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENvbnN0YW50IGVudW0gdmFsdWUgKHZhcmludClcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJlbnVtXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgQnVpbGRlci5NZXNzYWdlI3NldCB3aWxsIGFscmVhZHkgdGhyb3dcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDMyYml0IGZsb2F0XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZmxvYXRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5yZWFkRmxvYXQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyA2NGJpdCBmbG9hdFxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImRvdWJsZVwiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWREb3VibGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMZW5ndGgtZGVsaW1pdGVkIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInN0cmluZ1wiXTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRWU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGVuZ3RoLWRlbGltaXRlZCBieXRlc1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJ5dGVzXCJdOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbkJ5dGVzID0gYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWZmZXIucmVtYWluaW5nKCkgPCBuQnl0ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCBudW1iZXIgb2YgYnl0ZXMgZm9yIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK25CeXRlcytcIiByZXF1aXJlZCBidXQgZ290IG9ubHkgXCIrYnVmZmVyLnJlbWFpbmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGJ1ZmZlci5jbG9uZSgpOyAvLyBPZmZzZXQgYWxyZWFkeSBzZXRcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5saW1pdCA9IHZhbHVlLm9mZnNldCtuQnl0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSBuQnl0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlbmd0aC1kZWxpbWl0ZWQgZW1iZWRkZWQgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl06IHtcclxuICAgICAgICAgICAgICAgICAgICBuQnl0ZXMgPSBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZWRUeXBlLmRlY29kZShidWZmZXIsIG5CeXRlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGVnYWN5IGdyb3VwXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZ3JvdXBcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZWRUeXBlLmRlY29kZShidWZmZXIsIC0xLCBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFdlIHNob3VsZCBuZXZlciBlbmQgaGVyZVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIltJTlRFUk5BTF0gSWxsZWdhbCBkZWNvZGUgdHlwZVwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0cyBhIHZhbHVlIGZyb20gYSBzdHJpbmcgdG8gdGhlIGNhbm9uaWNhbCBlbGVtZW50IHR5cGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBMZWdhbCBvbmx5IHdoZW4gaXNNYXBLZXkgaXMgdHJ1ZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB2YWx1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBFbGVtZW50UHJvdG90eXBlLnZhbHVlRnJvbVN0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNNYXBLZXkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwidmFsdWVGcm9tU3RyaW5nKCkgY2FsbGVkIG9uIG5vbi1tYXAta2V5IGVsZW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInNmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInVpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJmaXhlZDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlcmlmeVZhbHVlKHBhcnNlSW50KHN0cikpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBMb25nLWJhc2VkIGZpZWxkcyBzdXBwb3J0IGNvbnZlcnNpb25zIGZyb20gc3RyaW5nIGFscmVhZHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52ZXJpZnlWYWx1ZShzdHIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJib29sXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ciA9PT0gXCJ0cnVlXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcInN0cmluZ1wiXTpcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlcmlmeVZhbHVlKHN0cik7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJ5dGVzXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJ5dGVCdWZmZXIuZnJvbUJpbmFyeShzdHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydHMgYSB2YWx1ZSBmcm9tIHRoZSBjYW5vbmljYWwgZWxlbWVudCB0eXBlIHRvIGEgc3RyaW5nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSXQgc2hvdWxkIGJlIHRoZSBjYXNlIHRoYXQgYHZhbHVlRnJvbVN0cmluZyh2YWx1ZVRvU3RyaW5nKHZhbCkpYCByZXR1cm5zXHJcbiAgICAgICAgICogYSB2YWx1ZSBlcXVpdmFsZW50IHRvIGB2ZXJpZnlWYWx1ZSh2YWwpYCBmb3IgZXZlcnkgbGVnYWwgdmFsdWUgb2YgYHZhbGBcclxuICAgICAgICAgKiBhY2NvcmRpbmcgdG8gdGhpcyBlbGVtZW50IHR5cGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGlzIG1heSBiZSB1c2VkIHdoZW4gdGhlIGVsZW1lbnQgbXVzdCBiZSBzdG9yZWQgb3IgdXNlZCBhcyBhIHN0cmluZyxcclxuICAgICAgICAgKiBlLmcuLCBhcyBhIG1hcCBrZXkgb24gYW4gT2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogTGVnYWwgb25seSB3aGVuIGlzTWFwS2V5IGlzIHRydWUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWVcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgc3RyaW5nIGZvcm0gb2YgdGhlIHZhbHVlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVsZW1lbnRQcm90b3R5cGUudmFsdWVUb1N0cmluZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc01hcEtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ2YWx1ZVRvU3RyaW5nKCkgY2FsbGVkIG9uIG5vbi1tYXAta2V5IGVsZW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IFByb3RvQnVmLlRZUEVTW1wiYnl0ZXNcIl0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZyhcImJpbmFyeVwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuRWxlbWVudFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0LkVsZW1lbnQgPSBFbGVtZW50O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IE1lc3NhZ2UuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuTmFtZXNwYWNlfSBwYXJlbnQgUGFyZW50IG1lc3NhZ2Ugb3IgbmFtZXNwYWNlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTWVzc2FnZSBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywqPj19IG9wdGlvbnMgTWVzc2FnZSBvcHRpb25zXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gaXNHcm91cCBgdHJ1ZWAgaWYgdGhpcyBpcyBhIGxlZ2FjeSBncm91cFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nP30gc3ludGF4IFRoZSBzeW50YXggbGV2ZWwgb2YgdGhpcyBkZWZpbml0aW9uIChlLmcuLCBwcm90bzMpXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgTWVzc2FnZSA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHBhcmVudCwgbmFtZSwgb3B0aW9ucywgaXNHcm91cCwgc3ludGF4KSB7XHJcbiAgICAgICAgICAgIE5hbWVzcGFjZS5jYWxsKHRoaXMsIGJ1aWxkZXIsIHBhcmVudCwgbmFtZSwgb3B0aW9ucywgc3ludGF4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJNZXNzYWdlXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRXh0ZW5zaW9ucyByYW5nZS5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFBcnJheS48bnVtYmVyPnx1bmRlZmluZWR9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuZXh0ZW5zaW9ucyA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSdW50aW1lIG1lc3NhZ2UgY2xhc3MuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHs/ZnVuY3Rpb24obmV3OlByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSl9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhenogPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFdoZXRoZXIgdGhpcyBpcyBhIGxlZ2FjeSBncm91cCBvciBub3QuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmlzR3JvdXAgPSAhIWlzR3JvdXA7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNhY2hlZCBjb2xsZWN0aW9ucyBhcmUgdXNlZCB0byBlZmZpY2llbnRseSBpdGVyYXRlIG92ZXIgb3IgbG9vayB1cCBmaWVsZHMgd2hlbiBkZWNvZGluZy5cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDYWNoZWQgZmllbGRzLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P0FycmF5LjwhUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkPn1cclxuICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpZWxkcyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ2FjaGVkIGZpZWxkcyBieSBpZC5cclxuICAgICAgICAgICAgICogQHR5cGUgez9PYmplY3QuPG51bWJlciwhUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkPn1cclxuICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpZWxkc0J5SWQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENhY2hlZCBmaWVsZHMgYnkgbmFtZS5cclxuICAgICAgICAgICAgICogQHR5cGUgez9PYmplY3QuPHN0cmluZywhUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkPn1cclxuICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpZWxkc0J5TmFtZSA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5wcm90b3R5cGVcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgTWVzc2FnZVByb3RvdHlwZSA9IE1lc3NhZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShOYW1lc3BhY2UucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoZSBtZXNzYWdlIGFuZCByZXR1cm5zIHRoZSBydW50aW1lIGNvdW50ZXJwYXJ0LCB3aGljaCBpcyBhIGZ1bGx5IGZ1bmN0aW9uYWwgY2xhc3MuXHJcbiAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2VcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSByZWJ1aWxkIFdoZXRoZXIgdG8gcmVidWlsZCBvciBub3QsIGRlZmF1bHRzIHRvIGZhbHNlXHJcbiAgICAgICAgICogQHJldHVybiB7UHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlfSBNZXNzYWdlIGNsYXNzXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBidWlsdFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24ocmVidWlsZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGF6eiAmJiAhcmVidWlsZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXp6O1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBydW50aW1lIE1lc3NhZ2UgY2xhc3MgaW4gaXRzIG93biBzY29wZVxyXG4gICAgICAgICAgICB2YXIgY2xhenogPSAoZnVuY3Rpb24oUHJvdG9CdWYsIFQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRzID0gVC5nZXRDaGlsZHJlbihQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQpLFxyXG4gICAgICAgICAgICAgICAgICAgIG9uZW9mcyA9IFQuZ2V0Q2hpbGRyZW4oUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLk9uZU9mKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgcnVudGltZSBNZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgKiBAY2xhc3MgQmFyZWJvbmUgb2YgYWxsIHJ1bnRpbWUgbWVzc2FnZXMuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyFPYmplY3QuPHN0cmluZywqPnxzdHJpbmd9IHZhbHVlcyBQcmVzZXQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gey4uLnN0cmluZ30gdmFyX2FyZ3NcclxuICAgICAgICAgICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBjcmVhdGVkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBNZXNzYWdlID0gZnVuY3Rpb24odmFsdWVzLCB2YXJfYXJncykge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5jYWxsKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdmlydHVhbCBvbmVvZiBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPW9uZW9mcy5sZW5ndGg7IGk8azsgKytpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW29uZW9mc1tpXS5uYW1lXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGZpZWxkcyBhbmQgc2V0IGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpPTAsIGs9ZmllbGRzLmxlbmd0aDsgaTxrOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gZmllbGRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2ZpZWxkLm5hbWVdID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnJlcGVhdGVkID8gW10gOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZpZWxkLm1hcCA/IG5ldyBQcm90b0J1Zi5NYXAoZmllbGQpIDogbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGQucmVxdWlyZWQgfHwgVC5zeW50YXggPT09ICdwcm90bzMnKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmaWVsZC5uYW1lXSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBmaWVsZCB2YWx1ZXMgZnJvbSBhIHZhbHVlcyBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdmFsdWVzICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZXMgPT09ICdvYmplY3QnICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBub3QgX2Fub3RoZXJfIE1lc3NhZ2UgKi8gKHR5cGVvZiB2YWx1ZXMuZW5jb2RlICE9PSAnZnVuY3Rpb24nIHx8IHZhbHVlcyBpbnN0YW5jZW9mIE1lc3NhZ2UpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBub3QgYSByZXBlYXRlZCBmaWVsZCAqLyAhQXJyYXkuaXNBcnJheSh2YWx1ZXMpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBub3QgYSBNYXAgKi8gISh2YWx1ZXMgaW5zdGFuY2VvZiBQcm90b0J1Zi5NYXApICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBub3QgYSBCeXRlQnVmZmVyICovICFCeXRlQnVmZmVyLmlzQnl0ZUJ1ZmZlcih2YWx1ZXMpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBub3QgYW4gQXJyYXlCdWZmZXIgKi8gISh2YWx1ZXMgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdCBhIExvbmcgKi8gIShQcm90b0J1Zi5Mb25nICYmIHZhbHVlcyBpbnN0YW5jZW9mIFByb3RvQnVmLkxvbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzZXQodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIC8vIFNldCBmaWVsZCB2YWx1ZXMgZnJvbSBhcmd1bWVudHMsIGluIGRlY2xhcmF0aW9uIG9yZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MCwgaz1hcmd1bWVudHMubGVuZ3RoOyBpPGs7ICsraSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSA9IGFyZ3VtZW50c1tpXSkgIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzZXQoZmllbGRzW2ldLm5hbWUsIHZhbHVlKTsgLy8gTWF5IHRocm93XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UucHJvdG90eXBlXHJcbiAgICAgICAgICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIE1lc3NhZ2VQcm90b3R5cGUgPSBNZXNzYWdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBBZGRzIGEgdmFsdWUgdG8gYSByZXBlYXRlZCBmaWVsZC5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNhZGRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBGaWVsZCBuYW1lXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFZhbHVlIHRvIGFkZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9Bc3NlcnQgV2hldGhlciB0byBhc3NlcnQgdGhlIHZhbHVlIG9yIG5vdCAoYXNzZXJ0cyBieSBkZWZhdWx0KVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IHRoaXNcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgY2Fubm90IGJlIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgbm9Bc3NlcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBULl9maWVsZHNCeU5hbWVba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vQXNzZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmllbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzK1wiI1wiK2tleStcIiBpcyB1bmRlZmluZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGZpZWxkIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKHRoaXMrXCIjXCIra2V5K1wiIGlzIG5vdCBhIGZpZWxkOiBcIitmaWVsZC50b1N0cmluZyh0cnVlKSk7IC8vIE1heSB0aHJvdyBpZiBpdCdzIGFuIGVudW0gb3IgZW1iZWRkZWQgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkLnJlcGVhdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IodGhpcytcIiNcIitrZXkrXCIgaXMgbm90IGEgcmVwZWF0ZWQgZmllbGRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZmllbGQudmVyaWZ5VmFsdWUodmFsdWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1trZXldID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQWRkcyBhIHZhbHVlIHRvIGEgcmVwZWF0ZWQgZmllbGQuIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjYWRkfS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSMkYWRkXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgRmllbGQgbmFtZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBWYWx1ZSB0byBhZGRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vQXNzZXJ0IFdoZXRoZXIgdG8gYXNzZXJ0IHRoZSB2YWx1ZSBvciBub3QgKGFzc2VydHMgYnkgZGVmYXVsdClcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSB0aGlzXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBhZGRlZFxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLiRhZGQgPSBNZXNzYWdlUHJvdG90eXBlLmFkZDtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFNldHMgYSBmaWVsZCdzIHZhbHVlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3NldFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3whT2JqZWN0LjxzdHJpbmcsKj59IGtleU9yT2JqIFN0cmluZyBrZXkgb3IgcGxhaW4gb2JqZWN0IGhvbGRpbmcgbXVsdGlwbGUgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geygqfGJvb2xlYW4pPX0gdmFsdWUgVmFsdWUgdG8gc2V0IGlmIGtleSBpcyBhIHN0cmluZywgb3RoZXJ3aXNlIG9taXR0ZWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vQXNzZXJ0IFdoZXRoZXIgdG8gbm90IGFzc2VydCBmb3IgYW4gYWN0dWFsIGZpZWxkIC8gcHJvcGVyIHZhbHVlIHR5cGUsIGRlZmF1bHRzIHRvIGBmYWxzZWBcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSB0aGlzXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBzZXRcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrZXlPck9iaiwgdmFsdWUsIG5vQXNzZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleU9yT2JqICYmIHR5cGVvZiBrZXlPck9iaiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9Bc3NlcnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWtleSBpbiBrZXlPck9iailcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlPck9iai5oYXNPd25Qcm9wZXJ0eShpa2V5KSAmJiB0eXBlb2YgKHZhbHVlID0ga2V5T3JPYmpbaWtleV0pICE9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzZXQoaWtleSwgdmFsdWUsIG5vQXNzZXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IFQuX2ZpZWxkc0J5TmFtZVtrZXlPck9ial07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub0Fzc2VydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IodGhpcytcIiNcIitrZXlPck9iaitcIiBpcyBub3QgYSBmaWVsZDogdW5kZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShmaWVsZCBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzK1wiI1wiK2tleU9yT2JqK1wiIGlzIG5vdCBhIGZpZWxkOiBcIitmaWVsZC50b1N0cmluZyh0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbZmllbGQubmFtZV0gPSAodmFsdWUgPSBmaWVsZC52ZXJpZnlWYWx1ZSh2YWx1ZSkpOyAvLyBNYXkgdGhyb3dcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXlPck9ial0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQgJiYgZmllbGQub25lb2YpIHsgLy8gRmllbGQgaXMgcGFydCBvZiBhbiBPbmVPZiAobm90IGEgdmlydHVhbCBPbmVPZiBmaWVsZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRGaWVsZCA9IHRoaXNbZmllbGQub25lb2YubmFtZV07IC8vIFZpcnR1YWwgZmllbGQgcmVmZXJlbmNlcyBjdXJyZW50bHkgc2V0IGZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGaWVsZCAhPT0gbnVsbCAmJiBjdXJyZW50RmllbGQgIT09IGZpZWxkLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tjdXJyZW50RmllbGRdID0gbnVsbDsgLy8gQ2xlYXIgY3VycmVudGx5IHNldCBmaWVsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmaWVsZC5vbmVvZi5uYW1lXSA9IGZpZWxkLm5hbWU7IC8vIFBvaW50IHZpcnR1YWwgZmllbGQgYXQgdGhpcyBmaWVsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC8qIHZhbHVlID09PSBudWxsICYmICovY3VycmVudEZpZWxkID09PSBrZXlPck9iailcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbZmllbGQub25lb2YubmFtZV0gPSBudWxsOyAvLyBDbGVhciB2aXJ0dWFsIGZpZWxkIChjdXJyZW50IGZpZWxkIGV4cGxpY2l0bHkgY2xlYXJlZClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2V0cyBhIGZpZWxkJ3MgdmFsdWUuIFRoaXMgaXMgYW4gYWxpYXMgZm9yIFtAbGluayBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2Ujc2V0fS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSMkc2V0XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfCFPYmplY3QuPHN0cmluZywqPn0ga2V5T3JPYmogU3RyaW5nIGtleSBvciBwbGFpbiBvYmplY3QgaG9sZGluZyBtdWx0aXBsZSB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7KCp8Ym9vbGVhbik9fSB2YWx1ZSBWYWx1ZSB0byBzZXQgaWYga2V5IGlzIGEgc3RyaW5nLCBvdGhlcndpc2Ugb21pdHRlZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9Bc3NlcnQgV2hldGhlciB0byBub3QgYXNzZXJ0IHRoZSB2YWx1ZSwgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgc2V0XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuJHNldCA9IE1lc3NhZ2VQcm90b3R5cGUuc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogR2V0cyBhIGZpZWxkJ3MgdmFsdWUuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZ2V0XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgS2V5XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0Fzc2VydCBXaGV0aGVyIHRvIG5vdCBhc3NlcnQgZm9yIGFuIGFjdHVhbCBmaWVsZCwgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7Kn0gVmFsdWVcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGVyZSBpcyBubyBzdWNoIGZpZWxkXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub0Fzc2VydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub0Fzc2VydClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBULl9maWVsZHNCeU5hbWVba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkIHx8ICEoZmllbGQgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcih0aGlzK1wiI1wiK2tleStcIiBpcyBub3QgYSBmaWVsZDogdW5kZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGZpZWxkIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IodGhpcytcIiNcIitrZXkrXCIgaXMgbm90IGEgZmllbGQ6IFwiK2ZpZWxkLnRvU3RyaW5nKHRydWUpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tmaWVsZC5uYW1lXTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBHZXRzIGEgZmllbGQncyB2YWx1ZS4gVGhpcyBpcyBhbiBhbGlhcyBmb3Ige0BsaW5rIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSMkZ2V0fS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSMkZ2V0XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgS2V5XHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHsqfSBWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZXJlIGlzIG5vIHN1Y2ggZmllbGRcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS4kZ2V0ID0gTWVzc2FnZVByb3RvdHlwZS5nZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gR2V0dGVycyBhbmQgc2V0dGVyc1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmaWVsZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBmaWVsZHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm8gc2V0dGVycyBmb3IgZXh0ZW5zaW9uIGZpZWxkcyBhcyB0aGVzZSBhcmUgbmFtZWQgYnkgdGhlaXIgZnFuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkV4dGVuc2lvbkZpZWxkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFQuYnVpbGRlci5vcHRpb25zWydwb3B1bGF0ZUFjY2Vzc29ycyddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oZmllbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldC9nZXRbU29tZVZhbHVlXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIE5hbWUgPSBmaWVsZC5vcmlnaW5hbE5hbWUucmVwbGFjZSgvKF9bYS16QS1aXSkvZywgZnVuY3Rpb24obWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2gudG9VcHBlckNhc2UoKS5yZXBsYWNlKCdfJywnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5hbWUgPSBOYW1lLnN1YnN0cmluZygwLDEpLnRvVXBwZXJDYXNlKCkgKyBOYW1lLnN1YnN0cmluZygxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXQvZ2V0X1tzb21lX3ZhbHVlXSBGSVhNRTogRG8gd2UgcmVhbGx5IG5lZWQgdGhlc2U/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGZpZWxkLm9yaWdpbmFsTmFtZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiX1wiK21hdGNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGUgY3VycmVudCBmaWVsZCdzIHVuYm91bmQgc2V0dGVyIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0Fzc2VydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNldHRlciA9IGZ1bmN0aW9uKHZhbHVlLCBub0Fzc2VydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbZmllbGQubmFtZV0gPSBub0Fzc2VydCA/IHZhbHVlIDogZmllbGQudmVyaWZ5VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IGZpZWxkJ3MgdW5ib3VuZCBnZXR0ZXIgZnVuY3Rpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tmaWVsZC5uYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFQuZ2V0Q2hpbGQoXCJzZXRcIitOYW1lKSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBTZXRzIGEgdmFsdWUuIFRoaXMgbWV0aG9kIGlzIHByZXNlbnQgZm9yIGVhY2ggZmllbGQsIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIG5vIG5hbWUgY29uZmxpY3Qgd2l0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICBhbm90aGVyIGZpZWxkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNzZXRbU29tZUZpZWxkXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVmFsdWUgdG8gc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9Bc3NlcnQgV2hldGhlciB0byBub3QgYXNzZXJ0IHRoZSB2YWx1ZSwgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGFic3RyYWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB2YWx1ZSBjYW5ub3QgYmUgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZVtcInNldFwiK05hbWVdID0gc2V0dGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChULmdldENoaWxkKFwic2V0X1wiK25hbWUpID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFNldHMgYSB2YWx1ZS4gVGhpcyBtZXRob2QgaXMgcHJlc2VudCBmb3IgZWFjaCBmaWVsZCwgYnV0IG9ubHkgaWYgdGhlcmUgaXMgbm8gbmFtZSBjb25mbGljdCB3aXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogIGFub3RoZXIgZmllbGQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3NldF9bc29tZV9maWVsZF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFZhbHVlIHRvIHNldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vQXNzZXJ0IFdoZXRoZXIgdG8gbm90IGFzc2VydCB0aGUgdmFsdWUsIGRlZmF1bHRzIHRvIGBmYWxzZWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gdGhpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBhYnN0cmFjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgY2Fubm90IGJlIHNldFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGVbXCJzZXRfXCIrbmFtZV0gPSBzZXR0ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFQuZ2V0Q2hpbGQoXCJnZXRcIitOYW1lKSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBHZXRzIGEgdmFsdWUuIFRoaXMgbWV0aG9kIGlzIHByZXNlbnQgZm9yIGVhY2ggZmllbGQsIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIG5vIG5hbWUgY29uZmxpY3Qgd2l0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICBhbm90aGVyIGZpZWxkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNnZXRbU29tZUZpZWxkXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBhYnN0cmFjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGVbXCJnZXRcIitOYW1lXSA9IGdldHRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVC5nZXRDaGlsZChcImdldF9cIituYW1lKSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBHZXRzIGEgdmFsdWUuIFRoaXMgbWV0aG9kIGlzIHByZXNlbnQgZm9yIGVhY2ggZmllbGQsIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIG5vIG5hbWUgY29uZmxpY3Qgd2l0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICBhbm90aGVyIGZpZWxkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNnZXRfW3NvbWVfZmllbGRdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7Kn0gVGhlIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGFic3RyYWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZVtcImdldF9cIituYW1lXSA9IGdldHRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBFbi0vZGVjb2RpbmdcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEVuY29kZXMgdGhlIG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjJGVuY29kZVxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyghQnl0ZUJ1ZmZlcnxib29sZWFuKT19IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIGVuY29kZSB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGFuZCBmbGlwIGl0IGlmIG9taXR0ZWQuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub1ZlcmlmeSBXaGV0aGVyIHRvIG5vdCB2ZXJpZnkgZmllbGQgdmFsdWVzLCBkZWZhdWx0cyB0byBgZmFsc2VgXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshQnl0ZUJ1ZmZlcn0gRW5jb2RlZCBtZXNzYWdlIGFzIGEgQnl0ZUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZW5jb2RlZCBCeXRlQnVmZmVyIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlNjRcclxuICAgICAgICAgICAgICAgICAqIEBzZWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2VuY29kZUhleFxyXG4gICAgICAgICAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlQUJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbihidWZmZXIsIG5vVmVyaWZ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBidWZmZXIgPT09ICdib29sZWFuJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9WZXJpZnkgPSBidWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1ZmZlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gbmV3IEJ5dGVCdWZmZXIoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZSA9IGJ1ZmZlci5saXR0bGVFbmRpYW47XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC5lbmNvZGUodGhpcywgYnVmZmVyLkxFKCksIG5vVmVyaWZ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpc05ldyA/IGJ1ZmZlci5mbGlwKCkgOiBidWZmZXIpLkxFKGxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5MRShsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBFbmNvZGVzIGEgbWVzc2FnZSB1c2luZyB0aGUgc3BlY2lmaWVkIGRhdGEgcGF5bG9hZC5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7IU9iamVjdC48c3RyaW5nLCo+fSBkYXRhIERhdGEgcGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHsoIUJ5dGVCdWZmZXJ8Ym9vbGVhbik9fSBidWZmZXIgQnl0ZUJ1ZmZlciB0byBlbmNvZGUgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgZmxpcCBpdCBpZiBvbWl0dGVkLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9WZXJpZnkgV2hldGhlciB0byBub3QgdmVyaWZ5IGZpZWxkIHZhbHVlcywgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IUJ5dGVCdWZmZXJ9IEVuY29kZWQgbWVzc2FnZSBhcyBhIEJ5dGVCdWZmZXJcclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZS5lbmNvZGUgPSBmdW5jdGlvbihkYXRhLCBidWZmZXIsIG5vVmVyaWZ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNZXNzYWdlKGRhdGEpLmVuY29kZShidWZmZXIsIG5vVmVyaWZ5KTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDYWxjdWxhdGVzIHRoZSBieXRlIGxlbmd0aCBvZiB0aGUgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNjYWxjdWxhdGVcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgY2FsY3VsYXRlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFQuY2FsY3VsYXRlKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEVuY29kZXMgdGhlIHZhcmludDMyIGxlbmd0aC1kZWxpbWl0ZWQgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSNlbmNvZGVEZWxpbWl0ZWRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHsoIUJ5dGVCdWZmZXJ8Ym9vbGVhbik9fSBidWZmZXIgQnl0ZUJ1ZmZlciB0byBlbmNvZGUgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgZmxpcCBpdCBpZiBvbWl0dGVkLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gbm9WZXJpZnkgV2hldGhlciB0byBub3QgdmVyaWZ5IGZpZWxkIHZhbHVlcywgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IUJ5dGVCdWZmZXJ9IEVuY29kZWQgbWVzc2FnZSBhcyBhIEJ5dGVCdWZmZXJcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZW5jb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuIFRoZSBsYXRlciBzdGlsbFxyXG4gICAgICAgICAgICAgICAgICogIHJldHVybnMgdGhlIGVuY29kZWQgQnl0ZUJ1ZmZlciBpbiB0aGUgYGVuY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5lbmNvZGVEZWxpbWl0ZWQgPSBmdW5jdGlvbihidWZmZXIsIG5vVmVyaWZ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzTmV3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFidWZmZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IG5ldyBCeXRlQnVmZmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW5jID0gbmV3IEJ5dGVCdWZmZXIoKS5MRSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuZW5jb2RlKHRoaXMsIGVuYywgbm9WZXJpZnkpLmZsaXAoKTtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMihlbmMucmVtYWluaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5hcHBlbmQoZW5jKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOZXcgPyBidWZmZXIuZmxpcCgpIDogYnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERpcmVjdGx5IGVuY29kZXMgdGhlIG1lc3NhZ2UgdG8gYW4gQXJyYXlCdWZmZXIuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlQUJcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJ9IEVuY29kZWQgbWVzc2FnZSBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZW5jb2RlZCBBcnJheUJ1ZmZlciBpbiB0aGUgYGVuY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZVByb3RvdHlwZS5lbmNvZGVBQiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVuY29kZSgpLnRvQXJyYXlCdWZmZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlW1wiZW5jb2RlZFwiXSkgZVtcImVuY29kZWRcIl0gPSBlW1wiZW5jb2RlZFwiXS50b0FycmF5QnVmZmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIGFzIGFuIEFycmF5QnVmZmVyLiBUaGlzIGlzIGFuIGFsaWFzIGZvciB7QGxpbmsgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2VuY29kZUFCfS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSN0b0FycmF5QnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyfSBFbmNvZGVkIG1lc3NhZ2UgYXMgQXJyYXlCdWZmZXJcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZW5jb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuIFRoZSBsYXRlciBzdGlsbFxyXG4gICAgICAgICAgICAgICAgICogIHJldHVybnMgdGhlIGVuY29kZWQgQXJyYXlCdWZmZXIgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IE1lc3NhZ2VQcm90b3R5cGUuZW5jb2RlQUI7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBEaXJlY3RseSBlbmNvZGVzIHRoZSBtZXNzYWdlIHRvIGEgbm9kZSBCdWZmZXIuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlTkJcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IUJ1ZmZlcn1cclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZW5jb2RlZCwgbm90IHJ1bm5pbmcgdW5kZXIgbm9kZS5qcyBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlXHJcbiAgICAgICAgICAgICAgICAgKiAgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsIHJldHVybnMgdGhlIGVuY29kZWQgbm9kZSBCdWZmZXIgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZW5jb2RlTkIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGUoKS50b0J1ZmZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVbXCJlbmNvZGVkXCJdKSBlW1wiZW5jb2RlZFwiXSA9IGVbXCJlbmNvZGVkXCJdLnRvQnVmZmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIGFzIGEgbm9kZSBCdWZmZXIuIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlTkJ9LlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3RvQnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4geyFCdWZmZXJ9XHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBlbmNvZGVkIG5vZGUgQnVmZmVyIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLnRvQnVmZmVyID0gTWVzc2FnZVByb3RvdHlwZS5lbmNvZGVOQjtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERpcmVjdGx5IGVuY29kZXMgdGhlIG1lc3NhZ2UgdG8gYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlNjRcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBCYXNlNjQgZW5jb2RlZCBzdHJpbmdcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdW5kZXJseWluZyBidWZmZXIgY2Fubm90IGJlIGVuY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXJcclxuICAgICAgICAgICAgICAgICAqICBzdGlsbCByZXR1cm5zIHRoZSBlbmNvZGVkIGJhc2U2NCBzdHJpbmcgaW4gdGhlIGBlbmNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZW5jb2RlNjQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGUoKS50b0Jhc2U2NCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVbXCJlbmNvZGVkXCJdKSBlW1wiZW5jb2RlZFwiXSA9IGVbXCJlbmNvZGVkXCJdLnRvQmFzZTY0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIGFzIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nLiBUaGlzIGlzIGFuIGFsaWFzIGZvciB7QGxpbmsgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI2VuY29kZTY0fS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSN0b0Jhc2U2NFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IEJhc2U2NCBlbmNvZGVkIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZW5jb2RlZCBiYXNlNjQgc3RyaW5nIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLnRvQmFzZTY0ID0gTWVzc2FnZVByb3RvdHlwZS5lbmNvZGU2NDtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERpcmVjdGx5IGVuY29kZXMgdGhlIG1lc3NhZ2UgdG8gYSBoZXggZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlSGV4XHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gSGV4IGVuY29kZWQgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHVuZGVybHlpbmcgYnVmZmVyIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyXHJcbiAgICAgICAgICAgICAgICAgKiAgc3RpbGwgcmV0dXJucyB0aGUgZW5jb2RlZCBoZXggc3RyaW5nIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmVuY29kZUhleCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVuY29kZSgpLnRvSGV4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZVtcImVuY29kZWRcIl0pIGVbXCJlbmNvZGVkXCJdID0gZVtcImVuY29kZWRcIl0udG9IZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgYXMgYSBoZXggZW5jb2RlZCBzdHJpbmcuIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjZW5jb2RlSGV4fS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSN0b0hleFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IEhleCBlbmNvZGVkIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZW5jb2RlZCBoZXggc3RyaW5nIGluIHRoZSBgZW5jb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLnRvSGV4ID0gTWVzc2FnZVByb3RvdHlwZS5lbmNvZGVIZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDbG9uZXMgYSBtZXNzYWdlIG9iamVjdCBvciBmaWVsZCB2YWx1ZSB0byBhIHJhdyBvYmplY3QuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IG9iaiBPYmplY3QgdG8gY2xvbmVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmluYXJ5QXNCYXNlNjQgV2hldGhlciB0byBpbmNsdWRlIGJpbmFyeSBkYXRhIGFzIGJhc2U2NCBzdHJpbmdzIG9yIGFzIGEgYnVmZmVyIG90aGVyd2lzZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBsb25nc0FzU3RyaW5ncyBXaGV0aGVyIHRvIGVuY29kZSBsb25ncyBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0LlQ9fSByZXNvbHZlZFR5cGUgVGhlIHJlc29sdmVkIGZpZWxkIHR5cGUgaWYgYSBmaWVsZFxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMgeyp9IENsb25lZCBvYmplY3RcclxuICAgICAgICAgICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbG9uZVJhdyhvYmosIGJpbmFyeUFzQmFzZTY0LCBsb25nc0FzU3RyaW5ncywgcmVzb2x2ZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IGVudW0gdmFsdWVzIHRvIHRoZWlyIHJlc3BlY3RpdmUgbmFtZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkVHlwZSAmJiByZXNvbHZlZFR5cGUgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0LkVudW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gUHJvdG9CdWYuUmVmbGVjdC5FbnVtLmdldE5hbWUocmVzb2x2ZWRUeXBlLm9iamVjdCwgb2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhc3MtdGhyb3VnaCBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgbnVsbC4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IEJ5dGVCdWZmZXJzIHRvIHJhdyBidWZmZXIgb3Igc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCeXRlQnVmZmVyLmlzQnl0ZUJ1ZmZlcihvYmopKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluYXJ5QXNCYXNlNjQgPyBvYmoudG9CYXNlNjQoKSA6IG9iai50b0J1ZmZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgTG9uZ3MgdG8gcHJvcGVyIG9iamVjdHMgb3Igc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChQcm90b0J1Zi5Mb25nLmlzTG9uZyhvYmopKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9uZ3NBc1N0cmluZ3MgPyBvYmoudG9TdHJpbmcoKSA6IFByb3RvQnVmLkxvbmcuZnJvbVZhbHVlKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENsb25lIGFycmF5c1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmZvckVhY2goZnVuY3Rpb24odiwgaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVba10gPSBjbG9uZVJhdyh2LCBiaW5hcnlBc0Jhc2U2NCwgbG9uZ3NBc1N0cmluZ3MsIHJlc29sdmVkVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsb25lID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBtYXBzIHRvIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgUHJvdG9CdWYuTWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdCA9IG9iai5lbnRyaWVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGUgPSBpdC5uZXh0KCk7ICFlLmRvbmU7IGUgPSBpdC5uZXh0KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtvYmoua2V5RWxlbS52YWx1ZVRvU3RyaW5nKGUudmFsdWVbMF0pXSA9IGNsb25lUmF3KGUudmFsdWVbMV0sIGJpbmFyeUFzQmFzZTY0LCBsb25nc0FzU3RyaW5ncywgb2JqLnZhbHVlRWxlbS5yZXNvbHZlZFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEV2ZXJ5dGhpbmcgZWxzZSBpcyBhIG5vbi1udWxsIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gb2JqLiR0eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG9iailcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgJiYgKGZpZWxkID0gdHlwZS5nZXRDaGlsZChpKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVbaV0gPSBjbG9uZVJhdyhvYmpbaV0sIGJpbmFyeUFzQmFzZTY0LCBsb25nc0FzU3RyaW5ncywgZmllbGQucmVzb2x2ZWRUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtpXSA9IGNsb25lUmF3KG9ialtpXSwgYmluYXJ5QXNCYXNlNjQsIGxvbmdzQXNTdHJpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJldHVybnMgdGhlIG1lc3NhZ2UncyByYXcgcGF5bG9hZC5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGJpbmFyeUFzQmFzZTY0IFdoZXRoZXIgdG8gaW5jbHVkZSBiaW5hcnkgZGF0YSBhcyBiYXNlNjQgc3RyaW5ncyBpbnN0ZWFkIG9mIEJ1ZmZlcnMsIGRlZmF1bHRzIHRvIGBmYWxzZWBcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9uZ3NBc1N0cmluZ3MgV2hldGhlciB0byBlbmNvZGUgbG9uZ3MgYXMgc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdC48c3RyaW5nLCo+fSBSYXcgcGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLnRvUmF3ID0gZnVuY3Rpb24oYmluYXJ5QXNCYXNlNjQsIGxvbmdzQXNTdHJpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb25lUmF3KHRoaXMsICEhYmluYXJ5QXNCYXNlNjQsICEhbG9uZ3NBc1N0cmluZ3MsIHRoaXMuJHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEVuY29kZXMgYSBtZXNzYWdlIHRvIEpTT04uXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBKU09OIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmVuY29kZUpTT04gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lUmF3KHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogYmluYXJ5LWFzLWJhc2U2NCAqLyB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGxvbmdzLWFzLXN0cmluZ3MgKi8gdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiR0eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERlY29kZXMgYSBtZXNzYWdlIGZyb20gdGhlIHNwZWNpZmllZCBidWZmZXIgb3Igc3RyaW5nLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLmRlY29kZVxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyFCeXRlQnVmZmVyfCFBcnJheUJ1ZmZlcnwhQnVmZmVyfHN0cmluZ30gYnVmZmVyIEJ1ZmZlciB0byBkZWNvZGUgZnJvbVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyk9fSBsZW5ndGggTWVzc2FnZSBsZW5ndGguIERlZmF1bHRzIHRvIGRlY29kZSBhbGwgdGhlIHJlbWFpbmlnIGRhdGEuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IGVuYyBFbmNvZGluZyBpZiBidWZmZXIgaXMgYSBzdHJpbmc6IGhleCwgdXRmOCAobm90IHJlY29tbWVuZGVkKSwgZGVmYXVsdHMgdG8gYmFzZTY0XHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBEZWNvZGVkIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgZGVjb2RlZCBvciBpZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3NpbmcuIFRoZSBsYXRlciBzdGlsbFxyXG4gICAgICAgICAgICAgICAgICogIHJldHVybnMgdGhlIGRlY29kZWQgbWVzc2FnZSB3aXRoIG1pc3NpbmcgZmllbGRzIGluIHRoZSBgZGVjb2RlZGAgcHJvcGVydHkgb24gdGhlIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UuZGVjb2RlNjRcclxuICAgICAgICAgICAgICAgICAqIEBzZWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLmRlY29kZUhleFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlLmRlY29kZSA9IGZ1bmN0aW9uKGJ1ZmZlciwgbGVuZ3RoLCBlbmMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYyA9IGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBidWZmZXIgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBCeXRlQnVmZmVyLndyYXAoYnVmZmVyLCBlbmMgPyBlbmMgOiBcImJhc2U2NFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghQnl0ZUJ1ZmZlci5pc0J5dGVCdWZmZXIoYnVmZmVyKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gQnl0ZUJ1ZmZlci53cmFwKGJ1ZmZlcik7IC8vIE1heSB0aHJvd1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZSA9IGJ1ZmZlci5saXR0bGVFbmRpYW47XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IFQuZGVjb2RlKGJ1ZmZlci5MRSgpLCBsZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIuTEUobGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbXNnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLkxFKGxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERlY29kZXMgYSB2YXJpbnQzMiBsZW5ndGgtZGVsaW1pdGVkIG1lc3NhZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGJ1ZmZlciBvciBzdHJpbmcuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UuZGVjb2RlRGVsaW1pdGVkXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7IUJ5dGVCdWZmZXJ8IUFycmF5QnVmZmVyfCFCdWZmZXJ8c3RyaW5nfSBidWZmZXIgQnVmZmVyIHRvIGRlY29kZSBmcm9tXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IGVuYyBFbmNvZGluZyBpZiBidWZmZXIgaXMgYSBzdHJpbmc6IGhleCwgdXRmOCAobm90IHJlY29tbWVuZGVkKSwgZGVmYXVsdHMgdG8gYmFzZTY0XHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IERlY29kZWQgbWVzc2FnZSBvciBgbnVsbGAgaWYgbm90IGVub3VnaCBieXRlcyBhcmUgYXZhaWxhYmxlIHlldFxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBkZWNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZGVjb2RlZCBtZXNzYWdlIHdpdGggbWlzc2luZyBmaWVsZHMgaW4gdGhlIGBkZWNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2UuZGVjb2RlRGVsaW1pdGVkID0gZnVuY3Rpb24oYnVmZmVyLCBlbmMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IEJ5dGVCdWZmZXIud3JhcChidWZmZXIsIGVuYyA/IGVuYyA6IFwiYmFzZTY0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFCeXRlQnVmZmVyLmlzQnl0ZUJ1ZmZlcihidWZmZXIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBCeXRlQnVmZmVyLndyYXAoYnVmZmVyKTsgLy8gTWF5IHRocm93XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5yZW1haW5pbmcoKSA8IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmYgPSBidWZmZXIub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZW4gPSBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5yZW1haW5pbmcoKSA8IGxlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIub2Zmc2V0ID0gb2ZmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IFQuZGVjb2RlKGJ1ZmZlci5zbGljZShidWZmZXIub2Zmc2V0LCBidWZmZXIub2Zmc2V0ICsgbGVuKS5MRSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSBsZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtc2c7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5vZmZzZXQgKz0gbGVuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERlY29kZXMgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5kZWNvZGU2NFxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFN0cmluZyB0byBkZWNvZGUgZnJvbVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gRGVjb2RlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGRlY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nLiBUaGUgbGF0ZXIgc3RpbGxcclxuICAgICAgICAgICAgICAgICAqICByZXR1cm5zIHRoZSBkZWNvZGVkIG1lc3NhZ2Ugd2l0aCBtaXNzaW5nIGZpZWxkcyBpbiB0aGUgYGRlY29kZWRgIHByb3BlcnR5IG9uIHRoZSBlcnJvci5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZS5kZWNvZGU2NCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNZXNzYWdlLmRlY29kZShzdHIsIFwiYmFzZTY0XCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERlY29kZXMgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGhleCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS5kZWNvZGVIZXhcclxuICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBTdHJpbmcgdG8gZGVjb2RlIGZyb21cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4geyFQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IERlY29kZWQgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBkZWNvZGVkIG9yIGlmIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gVGhlIGxhdGVyIHN0aWxsXHJcbiAgICAgICAgICAgICAgICAgKiAgcmV0dXJucyB0aGUgZGVjb2RlZCBtZXNzYWdlIHdpdGggbWlzc2luZyBmaWVsZHMgaW4gdGhlIGBkZWNvZGVkYCBwcm9wZXJ0eSBvbiB0aGUgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2UuZGVjb2RlSGV4ID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1lc3NhZ2UuZGVjb2RlKHN0ciwgXCJoZXhcIik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGVjb2RlcyB0aGUgbWVzc2FnZSBmcm9tIGEgSlNPTiBzdHJpbmcuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UuZGVjb2RlSlNPTlxyXG4gICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFN0cmluZyB0byBkZWNvZGUgZnJvbVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gRGVjb2RlZCBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGRlY29kZWQgb3IgaWYgcmVxdWlyZWQgZmllbGRzIGFyZVxyXG4gICAgICAgICAgICAgICAgICogbWlzc2luZy5cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgTWVzc2FnZS5kZWNvZGVKU09OID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNZXNzYWdlKEpTT04ucGFyc2Uoc3RyKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFV0aWxpdHlcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBNZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlI3RvU3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIGFzIG9mIFwiLkZ1bGx5LlF1YWxpZmllZC5NZXNzYWdlTmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VQcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBNZXNzYWdlIG9wdGlvbnMuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UuJG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyICRvcHRpb25zUzsgLy8gY2MgbmVlZHMgdGhpc1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogTWVzc2FnZSBvcHRpb25zLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlIyRvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsKj59XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciAkb3B0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJlZmxlY3Rpb24gdHlwZS5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZS4kdHlwZVxyXG4gICAgICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciAkdHlwZVM7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZWZsZWN0aW9uIHR5cGUuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2UjJHR5cGVcclxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlfVxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgJHR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSlcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVzc2FnZSwgJyRvcHRpb25zJywgeyBcInZhbHVlXCI6IFQuYnVpbGRPcHQoKSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVzc2FnZVByb3RvdHlwZSwgXCIkb3B0aW9uc1wiLCB7IFwidmFsdWVcIjogTWVzc2FnZVtcIiRvcHRpb25zXCJdIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlLCBcIiR0eXBlXCIsIHsgXCJ2YWx1ZVwiOiBUIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlUHJvdG90eXBlLCBcIiR0eXBlXCIsIHsgXCJ2YWx1ZVwiOiBUIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBNZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgfSkoUHJvdG9CdWYsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RhdGljIGVudW1zIGFuZCBwcm90b3R5cGVkIHN1Yi1tZXNzYWdlcyAvIGNhY2hlZCBjb2xsZWN0aW9uc1xyXG4gICAgICAgICAgICB0aGlzLl9maWVsZHMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5fZmllbGRzQnlJZCA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLl9maWVsZHNCeU5hbWUgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPXRoaXMuY2hpbGRyZW4ubGVuZ3RoLCBjaGlsZDsgaTxrOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEVudW0gfHwgY2hpbGQgaW5zdGFuY2VvZiBNZXNzYWdlIHx8IGNoaWxkIGluc3RhbmNlb2YgU2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGF6ei5oYXNPd25Qcm9wZXJ0eShjaGlsZC5uYW1lKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHJlZmxlY3QgY2hpbGQgb2YgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrY2hpbGQudG9TdHJpbmcodHJ1ZSkrXCIgY2Fubm90IG92ZXJyaWRlIHN0YXRpYyBwcm9wZXJ0eSAnXCIrY2hpbGQubmFtZStcIidcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhenpbY2hpbGQubmFtZV0gPSBjaGlsZC5idWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIE1lc3NhZ2UuRmllbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuYnVpbGQoKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWVsZHMucHVzaChjaGlsZCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmllbGRzQnlJZFtjaGlsZC5pZF0gPSBjaGlsZCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWVsZHNCeU5hbWVbY2hpbGQubmFtZV0gPSBjaGlsZDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCEoY2hpbGQgaW5zdGFuY2VvZiBNZXNzYWdlLk9uZU9mKSAmJiAhKGNoaWxkIGluc3RhbmNlb2YgRXh0ZW5zaW9uKSkgLy8gTm90IGJ1aWx0XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHJlZmxlY3QgY2hpbGQgb2YgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5jaGlsZHJlbltpXS50b1N0cmluZyh0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXp6ID0gY2xheno7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRW5jb2RlcyBhIHJ1bnRpbWUgbWVzc2FnZSdzIGNvbnRlbnRzIHRvIHRoZSBzcGVjaWZpZWQgYnVmZmVyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gbWVzc2FnZSBSdW50aW1lIG1lc3NhZ2UgdG8gZW5jb2RlXHJcbiAgICAgICAgICogQHBhcmFtIHtCeXRlQnVmZmVyfSBidWZmZXIgQnl0ZUJ1ZmZlciB0byB3cml0ZSB0b1xyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vVmVyaWZ5IFdoZXRoZXIgdG8gbm90IHZlcmlmeSBmaWVsZCB2YWx1ZXMsIGRlZmF1bHRzIHRvIGBmYWxzZWBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCeXRlQnVmZmVyfSBUaGUgQnl0ZUJ1ZmZlciBmb3IgY2hhaW5pbmdcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgcmVxdWlyZWQgZmllbGRzIGFyZSBtaXNzaW5nIG9yIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBlbmNvZGVkIGZvciBhbm90aGVyIHJlYXNvblxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBNZXNzYWdlUHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGJ1ZmZlciwgbm9WZXJpZnkpIHtcclxuICAgICAgICAgICAgdmFyIGZpZWxkTWlzc2luZyA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICBmaWVsZDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPXRoaXMuX2ZpZWxkcy5sZW5ndGgsIHZhbDsgaTxrOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkID0gdGhpcy5fZmllbGRzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFsID0gbWVzc2FnZVtmaWVsZC5uYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5yZXF1aXJlZCAmJiB2YWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGRNaXNzaW5nID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZE1pc3NpbmcgPSBmaWVsZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLmVuY29kZShub1ZlcmlmeSA/IHZhbCA6IGZpZWxkLnZlcmlmeVZhbHVlKHZhbCksIGJ1ZmZlciwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpZWxkTWlzc2luZyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFwiTWlzc2luZyBhdCBsZWFzdCBvbmUgcmVxdWlyZWQgZmllbGQgZm9yIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK2ZpZWxkTWlzc2luZyk7XHJcbiAgICAgICAgICAgICAgICBlcnJbXCJlbmNvZGVkXCJdID0gYnVmZmVyOyAvLyBTdGlsbCBleHBvc2Ugd2hhdCB3ZSBnb3RcclxuICAgICAgICAgICAgICAgIHRocm93KGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxjdWxhdGVzIGEgcnVudGltZSBtZXNzYWdlJ3MgYnl0ZSBsZW5ndGguXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBtZXNzYWdlIFJ1bnRpbWUgbWVzc2FnZSB0byBlbmNvZGVcclxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBCeXRlIGxlbmd0aFxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiByZXF1aXJlZCBmaWVsZHMgYXJlIG1pc3Npbmcgb3IgdGhlIG1lc3NhZ2UgY2Fubm90IGJlIGNhbGN1bGF0ZWQgZm9yIGFub3RoZXIgcmVhc29uXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24obWVzc2FnZSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuPTAsIGk9MCwgaz10aGlzLl9maWVsZHMubGVuZ3RoLCBmaWVsZCwgdmFsOyBpPGs7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZmllbGQgPSB0aGlzLl9maWVsZHNbaV07XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBtZXNzYWdlW2ZpZWxkLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkICYmIHZhbCA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiTWlzc2luZyBhdCBsZWFzdCBvbmUgcmVxdWlyZWQgZmllbGQgZm9yIFwiK3RoaXMudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK2ZpZWxkKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBuICs9IGZpZWxkLmNhbGN1bGF0ZSh2YWwsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNraXBzIGFsbCBkYXRhIHVudGlsIHRoZSBlbmQgb2YgdGhlIHNwZWNpZmllZCBncm91cCBoYXMgYmVlbiByZWFjaGVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZElkIEV4cGVjdGVkIEdST1VQRU5EIGlkXHJcbiAgICAgICAgICogQHBhcmFtIHshQnl0ZUJ1ZmZlcn0gYnVmIEJ5dGVCdWZmZXJcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGEgdmFsdWUgYXMgYmVlbiBza2lwcGVkLCBgZmFsc2VgIGlmIHRoZSBlbmQgaGFzIGJlZW4gcmVhY2hlZFxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBpdCB3YXNuJ3QgcG9zc2libGUgdG8gZmluZCB0aGUgZW5kIG9mIHRoZSBncm91cCAoYnVmZmVyIG92ZXJydW4gb3IgZW5kIHRhZyBtaXNtYXRjaClcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBza2lwVGlsbEdyb3VwRW5kKGV4cGVjdGVkSWQsIGJ1Zikge1xyXG4gICAgICAgICAgICB2YXIgdGFnID0gYnVmLnJlYWRWYXJpbnQzMigpLCAvLyBUaHJvd3Mgb24gT09CXHJcbiAgICAgICAgICAgICAgICB3aXJlVHlwZSA9IHRhZyAmIDB4MDcsXHJcbiAgICAgICAgICAgICAgICBpZCA9IHRhZyA+Pj4gMztcclxuICAgICAgICAgICAgc3dpdGNoICh3aXJlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLlZBUklOVDpcclxuICAgICAgICAgICAgICAgICAgICBkbyB0YWcgPSBidWYucmVhZFVpbnQ4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCh0YWcgJiAweDgwKSA9PT0gMHg4MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzY0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJ1Zi5vZmZzZXQgKz0gODtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU06XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gYnVmLnJlYWRWYXJpbnQzMigpOyAvLyByZWFkcyB0aGUgdmFyaW50XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmLm9mZnNldCArPSB0YWc7ICAgICAgICAvLyBza2lwcyBuIGJ5dGVzXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuU1RBUlRHUk9VUDpcclxuICAgICAgICAgICAgICAgICAgICBza2lwVGlsbEdyb3VwRW5kKGlkLCBidWYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLkVOREdST1VQOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCA9PT0gZXhwZWN0ZWRJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIEdST1VQRU5EIGFmdGVyIHVua25vd24gZ3JvdXA6IFwiK2lkK1wiIChcIitleHBlY3RlZElkK1wiIGV4cGVjdGVkKVwiKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5CSVRTMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmLm9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgd2lyZSB0eXBlIGluIHVua25vd24gZ3JvdXAgXCIrZXhwZWN0ZWRJZCtcIjogXCIrd2lyZVR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVjb2RlcyBhbiBlbmNvZGVkIG1lc3NhZ2UgYW5kIHJldHVybnMgdGhlIGRlY29kZWQgbWVzc2FnZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0J5dGVCdWZmZXJ9IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIGRlY29kZSBmcm9tXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXI9fSBsZW5ndGggTWVzc2FnZSBsZW5ndGguIERlZmF1bHRzIHRvIGRlY29kZSBhbGwgcmVtYWluaW5nIGRhdGEuXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXI9fSBleHBlY3RlZEdyb3VwRW5kSWQgRXhwZWN0ZWQgR1JPVVBFTkQgaWQgaWYgdGhpcyBpcyBhIGxlZ2FjeSBncm91cFxyXG4gICAgICAgICAqIEByZXR1cm4ge1Byb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZX0gRGVjb2RlZCBtZXNzYWdlXHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBtZXNzYWdlIGNhbm5vdCBiZSBkZWNvZGVkXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1lc3NhZ2VQcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24oYnVmZmVyLCBsZW5ndGgsIGV4cGVjdGVkR3JvdXBFbmRJZCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxlbmd0aCAhPT0gJ251bWJlcicpXHJcbiAgICAgICAgICAgICAgICBsZW5ndGggPSAtMTtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gYnVmZmVyLm9mZnNldCxcclxuICAgICAgICAgICAgICAgIG1zZyA9IG5ldyAodGhpcy5jbGF6eikoKSxcclxuICAgICAgICAgICAgICAgIHRhZywgd2lyZVR5cGUsIGlkLCBmaWVsZDtcclxuICAgICAgICAgICAgd2hpbGUgKGJ1ZmZlci5vZmZzZXQgPCBzdGFydCtsZW5ndGggfHwgKGxlbmd0aCA9PT0gLTEgJiYgYnVmZmVyLnJlbWFpbmluZygpID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIHRhZyA9IGJ1ZmZlci5yZWFkVmFyaW50MzIoKTtcclxuICAgICAgICAgICAgICAgIHdpcmVUeXBlID0gdGFnICYgMHgwNztcclxuICAgICAgICAgICAgICAgIGlkID0gdGFnID4+PiAzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpcmVUeXBlID09PSBQcm90b0J1Zi5XSVJFX1RZUEVTLkVOREdST1VQKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkICE9PSBleHBlY3RlZEdyb3VwRW5kSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCBncm91cCBlbmQgaW5kaWNhdG9yIGZvciBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIitpZCtcIiAoXCIrKGV4cGVjdGVkR3JvdXBFbmRJZCA/IGV4cGVjdGVkR3JvdXBFbmRJZCtcIiBleHBlY3RlZFwiIDogXCJub3QgYSBncm91cFwiKStcIilcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIShmaWVsZCA9IHRoaXMuX2ZpZWxkc0J5SWRbaWRdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFwibWVzc2FnZXMgY3JlYXRlZCBieSB5b3VyIG5ldyBjb2RlIGNhbiBiZSBwYXJzZWQgYnkgeW91ciBvbGQgY29kZTogb2xkIGJpbmFyaWVzIHNpbXBseSBpZ25vcmUgdGhlIG5ldyBmaWVsZCB3aGVuIHBhcnNpbmcuXCJcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHdpcmVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5WQVJJTlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIucmVhZFZhcmludDMyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLkJJVFMzMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5vZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLldJUkVfVFlQRVMuQklUUzY0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSA4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU06XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9mZnNldCArPSBsZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5XSVJFX1RZUEVTLlNUQVJUR1JPVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc2tpcFRpbGxHcm91cEVuZChpZCwgYnVmZmVyKSkge31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHdpcmUgdHlwZSBmb3IgdW5rbm93biBmaWVsZCBcIitpZCtcIiBpbiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiI2RlY29kZTogXCIrd2lyZVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5yZXBlYXRlZCAmJiAhZmllbGQub3B0aW9uc1tcInBhY2tlZFwiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1zZ1tmaWVsZC5uYW1lXS5wdXNoKGZpZWxkLmRlY29kZSh3aXJlVHlwZSwgYnVmZmVyKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLm1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXl2YWwgPSBmaWVsZC5kZWNvZGUod2lyZVR5cGUsIGJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnW2ZpZWxkLm5hbWVdLnNldChrZXl2YWxbMF0sIGtleXZhbFsxXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG1zZ1tmaWVsZC5uYW1lXSA9IGZpZWxkLmRlY29kZSh3aXJlVHlwZSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQub25lb2YpIHsgLy8gRmllbGQgaXMgcGFydCBvZiBhbiBPbmVPZiAobm90IGEgdmlydHVhbCBPbmVPZiBmaWVsZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRGaWVsZCA9IG1zZ1tmaWVsZC5vbmVvZi5uYW1lXTsgLy8gVmlydHVhbCBmaWVsZCByZWZlcmVuY2VzIGN1cnJlbnRseSBzZXQgZmllbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGaWVsZCAhPT0gbnVsbCAmJiBjdXJyZW50RmllbGQgIT09IGZpZWxkLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2dbY3VycmVudEZpZWxkXSA9IG51bGw7IC8vIENsZWFyIGN1cnJlbnRseSBzZXQgZmllbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnW2ZpZWxkLm9uZW9mLm5hbWVdID0gZmllbGQubmFtZTsgLy8gUG9pbnQgdmlydHVhbCBmaWVsZCBhdCB0aGlzIGZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbGwgcmVxdWlyZWQgZmllbGRzIGFyZSBwcmVzZW50IGFuZCBzZXQgZGVmYXVsdCB2YWx1ZXMgZm9yIG9wdGlvbmFsIGZpZWxkcyB0aGF0IGFyZSBub3RcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPXRoaXMuX2ZpZWxkcy5sZW5ndGg7IGk8azsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZCA9IHRoaXMuX2ZpZWxkc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtc2dbZmllbGQubmFtZV0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zeW50YXggPT09IFwicHJvdG8zXCIpIHsgLy8gUHJvdG8zIHNldHMgZGVmYXVsdCB2YWx1ZXMgYnkgc3BlY2lmaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2dbZmllbGQubmFtZV0gPSBmaWVsZC5kZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXCJNaXNzaW5nIGF0IGxlYXN0IG9uZSByZXF1aXJlZCBmaWVsZCBmb3IgXCIgKyB0aGlzLnRvU3RyaW5nKHRydWUpICsgXCI6IFwiICsgZmllbGQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycltcImRlY29kZWRcIl0gPSBtc2c7IC8vIFN0aWxsIGV4cG9zZSB3aGF0IHdlIGdvdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoUHJvdG9CdWYucG9wdWxhdGVEZWZhdWx0cyAmJiBmaWVsZC5kZWZhdWx0VmFsdWUgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZ1tmaWVsZC5uYW1lXSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbXNnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2VcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5NZXNzYWdlID0gTWVzc2FnZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBNZXNzYWdlIEZpZWxkLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZFxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9IG1lc3NhZ2UgTWVzc2FnZSByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcnVsZSBSdWxlLCBvbmUgb2YgcmVxdXJpZWQsIG9wdGlvbmFsLCByZXBlYXRlZFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nP30ga2V5dHlwZSBLZXkgZGF0YSB0eXBlLCBpZiBhbnkuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRGF0YSB0eXBlLCBlLmcuIGludDMyXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgRmllbGQgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBVbmlxdWUgZmllbGQgaWRcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBPcHRpb25zXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLk9uZU9mPX0gb25lb2YgRW5jbG9zaW5nIE9uZU9mXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmc/fSBzeW50YXggVGhlIHN5bnRheCBsZXZlbCBvZiB0aGlzIGRlZmluaXRpb24gKGUuZy4sIHByb3RvMylcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0LlRcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgRmllbGQgPSBmdW5jdGlvbihidWlsZGVyLCBtZXNzYWdlLCBydWxlLCBrZXl0eXBlLCB0eXBlLCBuYW1lLCBpZCwgb3B0aW9ucywgb25lb2YsIHN5bnRheCkge1xyXG4gICAgICAgICAgICBULmNhbGwodGhpcywgYnVpbGRlciwgbWVzc2FnZSwgbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiTWVzc2FnZS5GaWVsZFwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1lc3NhZ2UgZmllbGQgcmVxdWlyZWQgZmxhZy5cclxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZWQgPSBydWxlID09PSBcInJlcXVpcmVkXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWVzc2FnZSBmaWVsZCByZXBlYXRlZCBmbGFnLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXBlYXRlZCA9IHJ1bGUgPT09IFwicmVwZWF0ZWRcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNZXNzYWdlIGZpZWxkIG1hcCBmbGFnLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5tYXAgPSBydWxlID09PSBcIm1hcFwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1lc3NhZ2UgZmllbGQga2V5IHR5cGUuIFR5cGUgcmVmZXJlbmNlIHN0cmluZyBpZiB1bnJlc29sdmVkLCBwcm90b2J1ZlxyXG4gICAgICAgICAgICAgKiB0eXBlIGlmIHJlc29sdmVkLiBWYWxpZCBvbmx5IGlmIHRoaXMubWFwID09PSB0cnVlLCBudWxsIG90aGVyd2lzZS5cclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ3x7bmFtZTogc3RyaW5nLCB3aXJlVHlwZTogbnVtYmVyfXxudWxsfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmtleVR5cGUgPSBrZXl0eXBlIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWVzc2FnZSBmaWVsZCB0eXBlLiBUeXBlIHJlZmVyZW5jZSBzdHJpbmcgaWYgdW5yZXNvbHZlZCwgcHJvdG9idWYgdHlwZSBpZlxyXG4gICAgICAgICAgICAgKiByZXNvbHZlZC4gSW4gYSBtYXAgZmllbGQsIHRoaXMgaXMgdGhlIHZhbHVlIHR5cGUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd8e25hbWU6IHN0cmluZywgd2lyZVR5cGU6IG51bWJlcn19XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVzb2x2ZWQgdHlwZSByZWZlcmVuY2UgaW5zaWRlIHRoZSBnbG9iYWwgbmFtZXNwYWNlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7UHJvdG9CdWYuUmVmbGVjdC5UfG51bGx9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRUeXBlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBVbmlxdWUgbWVzc2FnZSBmaWVsZCBpZC5cclxuICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE1lc3NhZ2UgZmllbGQgb3B0aW9ucy5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgICAgICogQGRpY3RcclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZWZhdWx0IHZhbHVlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7Kn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVuY2xvc2luZyBPbmVPZi5cclxuICAgICAgICAgICAgICogQHR5cGUgez9Qcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuT25lT2Z9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMub25lb2YgPSBvbmVvZiB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN5bnRheCBsZXZlbCBvZiB0aGlzIGRlZmluaXRpb24gKGUuZy4sIHByb3RvMykuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuc3ludGF4ID0gc3ludGF4IHx8ICdwcm90bzInO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9yaWdpbmFsIGZpZWxkIG5hbWUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxOYW1lID0gdGhpcy5uYW1lOyAvLyBVc2VkIHRvIHJldmVydCBjYW1lbGNhc2UgdHJhbnNmb3JtYXRpb24gb24gbmFtaW5nIGNvbGxpc2lvbnNcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBFbGVtZW50IGltcGxlbWVudGF0aW9uLiBDcmVhdGVkIGluIGJ1aWxkKCkgYWZ0ZXIgdHlwZXMgYXJlIHJlc29sdmVkLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7UHJvdG9CdWYuRWxlbWVudH1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBLZXkgZWxlbWVudCBpbXBsZW1lbnRhdGlvbiwgZm9yIG1hcCBmaWVsZHMuIENyZWF0ZWQgaW4gYnVpbGQoKSBhZnRlclxyXG4gICAgICAgICAgICAgKiB0eXBlcyBhcmUgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5FbGVtZW50fVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmtleUVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29udmVydCBmaWVsZCBuYW1lcyB0byBjYW1lbCBjYXNlIG5vdGF0aW9uIGlmIHRoZSBvdmVycmlkZSBpcyBzZXRcclxuICAgICAgICAgICAgaWYgKHRoaXMuYnVpbGRlci5vcHRpb25zWydjb252ZXJ0RmllbGRzVG9DYW1lbENhc2UnXSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBNZXNzYWdlLkV4dGVuc2lvbkZpZWxkKSlcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IFByb3RvQnVmLlV0aWwudG9DYW1lbENhc2UodGhpcy5uYW1lKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBGaWVsZFByb3RvdHlwZSA9IEZpZWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVC5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhlIGZpZWxkLlxyXG4gICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBGaWVsZFByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBuZXcgRWxlbWVudCh0aGlzLnR5cGUsIHRoaXMucmVzb2x2ZWRUeXBlLCBmYWxzZSwgdGhpcy5zeW50YXgsIHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcClcclxuICAgICAgICAgICAgICAgIHRoaXMua2V5RWxlbWVudCA9IG5ldyBFbGVtZW50KHRoaXMua2V5VHlwZSwgdW5kZWZpbmVkLCB0cnVlLCB0aGlzLnN5bnRheCwgdGhpcy5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEluIHByb3RvMywgZmllbGRzIGRvIG5vdCBoYXZlIGZpZWxkIHByZXNlbmNlLCBhbmQgZXZlcnkgZmllbGQgaXMgc2V0IHRvXHJcbiAgICAgICAgICAgIC8vIGl0cyB0eXBlJ3MgZGVmYXVsdCB2YWx1ZSAoXCJcIiwgMCwgMC4wLCBvciBmYWxzZSkuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN5bnRheCA9PT0gJ3Byb3RvMycgJiYgIXRoaXMucmVwZWF0ZWQgJiYgIXRoaXMubWFwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBFbGVtZW50LmRlZmF1bHRGaWVsZFZhbHVlKHRoaXMudHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIGRlZmF1bHQgdmFsdWVzIGFyZSBwcmVzZW50IHdoZW4gZXhwbGljaXRseSBzcGVjaWZpZWRcclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRoaXMub3B0aW9uc1snZGVmYXVsdCddICE9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gdGhpcy52ZXJpZnlWYWx1ZSh0aGlzLm9wdGlvbnNbJ2RlZmF1bHQnXSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiB2YWx1ZSBjYW4gYmUgc2V0IGZvciB0aGlzIGZpZWxkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVmFsdWUgdG8gY2hlY2tcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBza2lwUmVwZWF0ZWQgV2hldGhlciB0byBza2lwIHRoZSByZXBlYXRlZCB2YWx1ZSBjaGVjayBvciBub3QuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAgICAgICAqIEByZXR1cm4geyp9IFZlcmlmaWVkLCBtYXliZSBhZGp1c3RlZCwgdmFsdWVcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBzZXQgZm9yIHRoaXMgZmllbGRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRmllbGRQcm90b3R5cGUudmVyaWZ5VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSwgc2tpcFJlcGVhdGVkKSB7XHJcbiAgICAgICAgICAgIHNraXBSZXBlYXRlZCA9IHNraXBSZXBlYXRlZCB8fCBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBmYWlsKHZhbCwgbXNnKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgdmFsdWUgZm9yIFwiK3NlbGYudG9TdHJpbmcodHJ1ZSkrXCIgb2YgdHlwZSBcIitzZWxmLnR5cGUubmFtZStcIjogXCIrdmFsK1wiIChcIittc2crXCIpXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgeyAvLyBOVUxMIHZhbHVlcyBmb3Igb3B0aW9uYWwgZmllbGRzXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXF1aXJlZClcclxuICAgICAgICAgICAgICAgICAgICBmYWlsKHR5cGVvZiB2YWx1ZSwgXCJyZXF1aXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN5bnRheCA9PT0gJ3Byb3RvMycgJiYgdGhpcy50eXBlICE9PSBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbCh0eXBlb2YgdmFsdWUsIFwicHJvdG8zIGZpZWxkIHdpdGhvdXQgZmllbGQgcHJlc2VuY2UgY2Fubm90IGJlIG51bGxcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0ZWQgJiYgIXNraXBSZXBlYXRlZCkgeyAvLyBSZXBlYXRlZCB2YWx1ZXMgYXMgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPHZhbHVlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHRoaXMuZWxlbWVudC52ZXJpZnlWYWx1ZSh2YWx1ZVtpXSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXAgJiYgIXNraXBSZXBlYXRlZCkgeyAvLyBNYXAgdmFsdWVzIGFzIG9iamVjdHNcclxuICAgICAgICAgICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgUHJvdG9CdWYuTWFwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG5vdCBhbHJlYWR5IGEgTWFwLCBhdHRlbXB0IHRvIGNvbnZlcnQuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXhwZWN0ZWQgUHJvdG9CdWYuTWFwIG9yIHJhdyBvYmplY3QgZm9yIG1hcCBmaWVsZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm90b0J1Zi5NYXAodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQWxsIG5vbi1yZXBlYXRlZCBmaWVsZHMgZXhwZWN0IG5vIGFycmF5XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXBlYXRlZCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSlcclxuICAgICAgICAgICAgICAgIGZhaWwodHlwZW9mIHZhbHVlLCBcIm5vIGFycmF5IGV4cGVjdGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC52ZXJpZnlWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBmaWVsZCB3aWxsIGhhdmUgYSBwcmVzZW5jZSBvbiB0aGUgd2lyZSBnaXZlbiBpdHNcclxuICAgICAgICAgKiB2YWx1ZS5cclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFZlcmlmaWVkIGZpZWxkIHZhbHVlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBtZXNzYWdlIFJ1bnRpbWUgbWVzc2FnZVxyXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGZpZWxkIHdpbGwgYmUgcHJlc2VudCBvbiB0aGUgd2lyZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEZpZWxkUHJvdG90eXBlLmhhc1dpcmVQcmVzZW5jZSA9IGZ1bmN0aW9uKHZhbHVlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN5bnRheCAhPT0gJ3Byb3RvMycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlICE9PSBudWxsKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25lb2YgJiYgbWVzc2FnZVt0aGlzLm9uZW9mLm5hbWVdID09PSB0aGlzLm5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQzMlwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50MzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDMyXCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkMzJcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJpbnQ2NFwiXTpcclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzaW50NjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wic2ZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1widWludDY0XCJdOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImZpeGVkNjRcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxvdyAhPT0gMCB8fCB2YWx1ZS5oaWdoICE9PSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJib29sXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZmxvYXRcIl06XHJcbiAgICAgICAgICAgICAgICBjYXNlIFByb3RvQnVmLlRZUEVTW1wiZG91YmxlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gMC4wO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJzdHJpbmdcIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImJ5dGVzXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZW1haW5pbmcoKSA+IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBQcm90b0J1Zi5UWVBFU1tcImVudW1cIl06XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgUHJvdG9CdWYuVFlQRVNbXCJtZXNzYWdlXCJdOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbmNvZGVzIHRoZSBzcGVjaWZpZWQgZmllbGQgdmFsdWUgdG8gdGhlIHNwZWNpZmllZCBidWZmZXIuXHJcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBWZXJpZmllZCBmaWVsZCB2YWx1ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Qnl0ZUJ1ZmZlcn0gYnVmZmVyIEJ5dGVCdWZmZXIgdG8gZW5jb2RlIHRvXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBtZXNzYWdlIFJ1bnRpbWUgbWVzc2FnZVxyXG4gICAgICAgICAqIEByZXR1cm4ge0J5dGVCdWZmZXJ9IFRoZSBCeXRlQnVmZmVyIGZvciBjaGFpbmluZ1xyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgZmllbGQgY2Fubm90IGJlIGVuY29kZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRmllbGRQcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24odmFsdWUsIGJ1ZmZlciwgbWVzc2FnZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBudWxsIHx8IHR5cGVvZiB0aGlzLnR5cGUgIT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJbSU5URVJOQUxdIFVucmVzb2x2ZWQgdHlwZSBpbiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit0aGlzLnR5cGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgKHRoaXMucmVwZWF0ZWQgJiYgdmFsdWUubGVuZ3RoID09IDApKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjsgLy8gT3B0aW9uYWwgb21pdHRlZFxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcIk9ubHkgcmVwZWF0ZWQgZmllbGRzIG9mIHByaW1pdGl2ZSBudW1lcmljIHR5cGVzICh0eXBlcyB3aGljaCB1c2UgdGhlIHZhcmludCwgMzItYml0LCBvciA2NC1iaXQgd2lyZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHR5cGVzKSBjYW4gYmUgZGVjbGFyZWQgJ3BhY2tlZCcuXCJcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zW1wicGFja2VkXCJdICYmIFByb3RvQnVmLlBBQ0tBQkxFX1dJUkVfVFlQRVMuaW5kZXhPZih0aGlzLnR5cGUud2lyZVR5cGUpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJBbGwgb2YgdGhlIGVsZW1lbnRzIG9mIHRoZSBmaWVsZCBhcmUgcGFja2VkIGludG8gYSBzaW5nbGUga2V5LXZhbHVlIHBhaXIgd2l0aCB3aXJlIHR5cGUgMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAobGVuZ3RoLWRlbGltaXRlZCkuIEVhY2ggZWxlbWVudCBpcyBlbmNvZGVkIHRoZSBzYW1lIHdheSBpdCB3b3VsZCBiZSBub3JtYWxseSwgZXhjZXB0IHdpdGhvdXQgYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0YWcgcHJlY2VkaW5nIGl0LlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIuZW5zdXJlQ2FwYWNpdHkoYnVmZmVyLm9mZnNldCArPSAxKTsgLy8gV2UgZG8gbm90IGtub3cgdGhlIGxlbmd0aCB5ZXQsIHNvIGxldCdzIGFzc3VtZSBhIHZhcmludCBvZiBsZW5ndGggMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBidWZmZXIub2Zmc2V0OyAvLyBSZW1lbWJlciB3aGVyZSB0aGUgY29udGVudHMgYmVnaW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpPTA7IGk8dmFsdWUubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZW5jb2RlVmFsdWUodGhpcy5pZCwgdmFsdWVbaV0sIGJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSBidWZmZXIub2Zmc2V0LXN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaW50TGVuID0gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMihsZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaW50TGVuID4gMSkgeyAvLyBXZSBuZWVkIHRvIG1vdmUgdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudHMgPSBidWZmZXIuc2xpY2Uoc3RhcnQsIGJ1ZmZlci5vZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgKz0gdmFyaW50TGVuLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIub2Zmc2V0ID0gc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIuYXBwZW5kKGNvbnRlbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMihsZW4sIHN0YXJ0LXZhcmludExlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJJZiB5b3VyIG1lc3NhZ2UgZGVmaW5pdGlvbiBoYXMgcmVwZWF0ZWQgZWxlbWVudHMgKHdpdGhvdXQgdGhlIFtwYWNrZWQ9dHJ1ZV0gb3B0aW9uKSwgdGhlIGVuY29kZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWVzc2FnZSBoYXMgemVybyBvciBtb3JlIGtleS12YWx1ZSBwYWlycyB3aXRoIHRoZSBzYW1lIHRhZyBudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MDsgaTx2YWx1ZS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgdGhpcy50eXBlLndpcmVUeXBlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5lbmNvZGVWYWx1ZSh0aGlzLmlkLCB2YWx1ZVtpXSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV3JpdGUgb3V0IGVhY2ggbWFwIGVudHJ5IGFzIGEgc3VibWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwga2V5LCBtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXB1dGUgdGhlIGxlbmd0aCBvZiB0aGUgc3VibWVzc2FnZSAoa2V5LCB2YWwpIHBhaXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMigoMSA8PCAzKSB8IHRoaXMua2V5VHlwZS53aXJlVHlwZSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlFbGVtZW50LmNhbGN1bGF0ZUxlbmd0aCgxLCBrZXkpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIoKDIgPDwgMykgfCB0aGlzLnR5cGUud2lyZVR5cGUpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jYWxjdWxhdGVMZW5ndGgoMiwgdmFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1Ym1lc3NhZ2Ugd2l0aCB3aXJlIHR5cGUgb2YgbGVuZ3RoLWRlbGltaXRlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVmFyaW50MzIoKHRoaXMuaWQgPDwgMykgfCBQcm90b0J1Zi5XSVJFX1RZUEVTLkxERUxJTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKGxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXcml0ZSBvdXQgdGhlIGtleSBhbmQgdmFsLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMigoMSA8PCAzKSB8IHRoaXMua2V5VHlwZS53aXJlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5RWxlbWVudC5lbmNvZGVWYWx1ZSgxLCBrZXksIGJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVZhcmludDMyKCgyIDw8IDMpIHwgdGhpcy50eXBlLndpcmVUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmVuY29kZVZhbHVlKDIsIHZhbCwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzV2lyZVByZXNlbmNlKHZhbHVlLCBtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVWYXJpbnQzMigodGhpcy5pZCA8PCAzKSB8IHRoaXMudHlwZS53aXJlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5lbmNvZGVWYWx1ZSh0aGlzLmlkLCB2YWx1ZSwgYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB2YWx1ZSBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrdmFsdWUrXCIgKFwiK2UrXCIpXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBidWZmZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIHRoaXMgZmllbGQncyB2YWx1ZSBvbiB0aGUgbmV0d29yayBsZXZlbC5cclxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIEZpZWxkIHZhbHVlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSBtZXNzYWdlIFJ1bnRpbWUgbWVzc2FnZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEZpZWxkUHJvdG90eXBlLmNhbGN1bGF0ZSA9IGZ1bmN0aW9uKHZhbHVlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy52ZXJpZnlWYWx1ZSh2YWx1ZSk7IC8vIE1heSB0aHJvd1xyXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBudWxsIHx8IHR5cGVvZiB0aGlzLnR5cGUgIT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJbSU5URVJOQUxdIFVucmVzb2x2ZWQgdHlwZSBpbiBcIit0aGlzLnRvU3RyaW5nKHRydWUpK1wiOiBcIit0aGlzLnR5cGUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgKHRoaXMucmVwZWF0ZWQgJiYgdmFsdWUubGVuZ3RoID09IDApKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7IC8vIE9wdGlvbmFsIG9taXR0ZWRcclxuICAgICAgICAgICAgdmFyIG4gPSAwO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaSwgbmk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1tcInBhY2tlZFwiXSAmJiBQcm90b0J1Zi5QQUNLQUJMRV9XSVJFX1RZUEVTLmluZGV4T2YodGhpcy50eXBlLndpcmVUeXBlKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gKz0gQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMigodGhpcy5pZCA8PCAzKSB8IFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGk9MDsgaTx2YWx1ZS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pICs9IHRoaXMuZWxlbWVudC5jYWxjdWxhdGVMZW5ndGgodGhpcy5pZCwgdmFsdWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIobmkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IG5pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaT0wOyBpPHZhbHVlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbiArPSBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgdGhpcy50eXBlLndpcmVUeXBlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4gKz0gdGhpcy5lbGVtZW50LmNhbGN1bGF0ZUxlbmd0aCh0aGlzLmlkLCB2YWx1ZVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVhY2ggbWFwIGVudHJ5IGJlY29tZXMgYSBzdWJtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXksIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHRoZSBzdWJtZXNzYWdlIChrZXksIHZhbCkgcGFpci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCgxIDw8IDMpIHwgdGhpcy5rZXlUeXBlLndpcmVUeXBlKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleUVsZW1lbnQuY2FsY3VsYXRlTGVuZ3RoKDEsIGtleSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQnl0ZUJ1ZmZlci5jYWxjdWxhdGVWYXJpbnQzMigoMiA8PCAzKSB8IHRoaXMudHlwZS53aXJlVHlwZSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNhbGN1bGF0ZUxlbmd0aCgyLCB2YWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbiArPSBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgUHJvdG9CdWYuV0lSRV9UWVBFUy5MREVMSU0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IEJ5dGVCdWZmZXIuY2FsY3VsYXRlVmFyaW50MzIobGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbiArPSBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1dpcmVQcmVzZW5jZSh2YWx1ZSwgbWVzc2FnZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbiArPSBCeXRlQnVmZmVyLmNhbGN1bGF0ZVZhcmludDMyKCh0aGlzLmlkIDw8IDMpIHwgdGhpcy50eXBlLndpcmVUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmVsZW1lbnQuY2FsY3VsYXRlTGVuZ3RoKHRoaXMuaWQsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB2YWx1ZSBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrdmFsdWUrXCIgKFwiK2UrXCIpXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlY29kZSB0aGUgZmllbGQgdmFsdWUgZnJvbSB0aGUgc3BlY2lmaWVkIGJ1ZmZlci5cclxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lyZVR5cGUgTGVhZGluZyB3aXJlIHR5cGVcclxuICAgICAgICAgKiBAcGFyYW0ge0J5dGVCdWZmZXJ9IGJ1ZmZlciBCeXRlQnVmZmVyIHRvIGRlY29kZSBmcm9tXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gc2tpcFJlcGVhdGVkIFdoZXRoZXIgdG8gc2tpcCB0aGUgcmVwZWF0ZWQgY2hlY2sgb3Igbm90LiBEZWZhdWx0cyB0byBmYWxzZS5cclxuICAgICAgICAgKiBAcmV0dXJuIHsqfSBEZWNvZGVkIHZhbHVlOiBhcnJheSBmb3IgcGFja2VkIHJlcGVhdGVkIGZpZWxkcywgW2tleSwgdmFsdWVdIGZvclxyXG4gICAgICAgICAqICAgICAgICAgICAgIG1hcCBmaWVsZHMsIG9yIGFuIGluZGl2aWR1YWwgdmFsdWUgb3RoZXJ3aXNlLlxyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgZmllbGQgY2Fubm90IGJlIGRlY29kZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRmllbGRQcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24od2lyZVR5cGUsIGJ1ZmZlciwgc2tpcFJlcGVhdGVkKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSwgbkJ5dGVzO1xyXG5cclxuICAgICAgICAgICAgLy8gV2UgZXhwZWN0IHdpcmVUeXBlIHRvIG1hdGNoIHRoZSB1bmRlcmx5aW5nIHR5cGUncyB3aXJlVHlwZSB1bmxlc3Mgd2Ugc2VlXHJcbiAgICAgICAgICAgIC8vIGEgcGFja2VkIHJlcGVhdGVkIGZpZWxkLCBvciB1bmxlc3MgdGhpcyBpcyBhIG1hcCBmaWVsZC5cclxuICAgICAgICAgICAgdmFyIHdpcmVUeXBlT0sgPVxyXG4gICAgICAgICAgICAgICAgKCF0aGlzLm1hcCAmJiB3aXJlVHlwZSA9PSB0aGlzLnR5cGUud2lyZVR5cGUpIHx8XHJcbiAgICAgICAgICAgICAgICAoIXNraXBSZXBlYXRlZCAmJiB0aGlzLnJlcGVhdGVkICYmIHRoaXMub3B0aW9uc1tcInBhY2tlZFwiXSAmJlxyXG4gICAgICAgICAgICAgICAgIHdpcmVUeXBlID09IFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMubWFwICYmIHdpcmVUeXBlID09IFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNKTtcclxuICAgICAgICAgICAgaWYgKCF3aXJlVHlwZU9LKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIHdpcmUgdHlwZSBmb3IgZmllbGQgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrd2lyZVR5cGUrXCIgKFwiK3RoaXMudHlwZS53aXJlVHlwZStcIiBleHBlY3RlZClcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgcGFja2VkIHJlcGVhdGVkIGZpZWxkcy5cclxuICAgICAgICAgICAgaWYgKHdpcmVUeXBlID09IFByb3RvQnVmLldJUkVfVFlQRVMuTERFTElNICYmIHRoaXMucmVwZWF0ZWQgJiYgdGhpcy5vcHRpb25zW1wicGFja2VkXCJdICYmIFByb3RvQnVmLlBBQ0tBQkxFX1dJUkVfVFlQRVMuaW5kZXhPZih0aGlzLnR5cGUud2lyZVR5cGUpID49IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICghc2tpcFJlcGVhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbkJ5dGVzID0gYnVmZmVyLnJlYWRWYXJpbnQzMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5CeXRlcyA9IGJ1ZmZlci5vZmZzZXQgKyBuQnl0ZXM7IC8vIExpbWl0XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChidWZmZXIub2Zmc2V0IDwgbkJ5dGVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmRlY29kZSh0aGlzLnR5cGUud2lyZVR5cGUsIGJ1ZmZlciwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBSZWFkIHRoZSBuZXh0IHZhbHVlIG90aGVyd2lzZS4uLlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgbWFwcy5cclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZWFkIG9uZSAoa2V5LCB2YWx1ZSkgc3VibWVzc2FnZSwgYW5kIHJldHVybiBba2V5LCB2YWx1ZV1cclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBFbGVtZW50LmRlZmF1bHRGaWVsZFZhbHVlKHRoaXMua2V5VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEVsZW1lbnQuZGVmYXVsdEZpZWxkVmFsdWUodGhpcy50eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWFkIHRoZSBsZW5ndGhcclxuICAgICAgICAgICAgICAgIG5CeXRlcyA9IGJ1ZmZlci5yZWFkVmFyaW50MzIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChidWZmZXIucmVtYWluaW5nKCkgPCBuQnl0ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJJbGxlZ2FsIG51bWJlciBvZiBieXRlcyBmb3IgXCIrdGhpcy50b1N0cmluZyh0cnVlKStcIjogXCIrbkJ5dGVzK1wiIHJlcXVpcmVkIGJ1dCBnb3Qgb25seSBcIitidWZmZXIucmVtYWluaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEdldCBhIHN1Yi1idWZmZXIgb2YgdGhpcyBrZXkvdmFsdWUgc3VibWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgdmFyIG1zZ2J1ZiA9IGJ1ZmZlci5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgbXNnYnVmLmxpbWl0ID0gbXNnYnVmLm9mZnNldCArIG5CeXRlcztcclxuICAgICAgICAgICAgICAgIGJ1ZmZlci5vZmZzZXQgKz0gbkJ5dGVzO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChtc2didWYucmVtYWluaW5nKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhZyA9IG1zZ2J1Zi5yZWFkVmFyaW50MzIoKTtcclxuICAgICAgICAgICAgICAgICAgICB3aXJlVHlwZSA9IHRhZyAmIDB4MDc7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGFnID4+PiAzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLmtleUVsZW1lbnQuZGVjb2RlKG1zZ2J1Ziwgd2lyZVR5cGUsIGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlkID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5lbGVtZW50LmRlY29kZShtc2didWYsIHdpcmVUeXBlLCBpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmV4cGVjdGVkIHRhZyBpbiBtYXAgZmllbGQga2V5L3ZhbHVlIHN1Ym1lc3NhZ2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCB2YWx1ZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZSBzaW5ndWxhciBhbmQgbm9uLXBhY2tlZCByZXBlYXRlZCBmaWVsZCB2YWx1ZXMuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGVjb2RlKGJ1ZmZlciwgd2lyZVR5cGUsIHRoaXMuaWQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5NZXNzYWdlLkZpZWxkID0gRmllbGQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgTWVzc2FnZSBFeHRlbnNpb25GaWVsZC5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRXh0ZW5zaW9uRmllbGRcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlfSBtZXNzYWdlIE1lc3NhZ2UgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgUnVsZSwgb25lIG9mIHJlcXVyaWVkLCBvcHRpb25hbCwgcmVwZWF0ZWRcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBEYXRhIHR5cGUsIGUuZy4gaW50MzJcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBGaWVsZCBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIFVuaXF1ZSBmaWVsZCBpZFxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBPcHRpb25zXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIEV4dGVuc2lvbkZpZWxkID0gZnVuY3Rpb24oYnVpbGRlciwgbWVzc2FnZSwgcnVsZSwgdHlwZSwgbmFtZSwgaWQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgRmllbGQuY2FsbCh0aGlzLCBidWlsZGVyLCBtZXNzYWdlLCBydWxlLCAvKiBrZXl0eXBlID0gKi8gbnVsbCwgdHlwZSwgbmFtZSwgaWQsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiByZWZlcmVuY2UuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuUmVmbGVjdC5FeHRlbnNpb259XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuZXh0ZW5zaW9uO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEV4dGVuZHMgRmllbGRcclxuICAgICAgICBFeHRlbnNpb25GaWVsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZpZWxkLnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRXh0ZW5zaW9uRmllbGRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5NZXNzYWdlLkV4dGVuc2lvbkZpZWxkID0gRXh0ZW5zaW9uRmllbGQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgTWVzc2FnZSBPbmVPZi5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuT25lT2ZcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlfSBtZXNzYWdlIE1lc3NhZ2UgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgT25lT2YgbmFtZVxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqIEBleHRlbmRzIFByb3RvQnVmLlJlZmxlY3QuVFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBPbmVPZiA9IGZ1bmN0aW9uKGJ1aWxkZXIsIG1lc3NhZ2UsIG5hbWUpIHtcclxuICAgICAgICAgICAgVC5jYWxsKHRoaXMsIGJ1aWxkZXIsIG1lc3NhZ2UsIG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVuY2xvc2VkIGZpZWxkcy5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFBcnJheS48IVByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5GaWVsZD59XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzID0gW107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZS5PbmVPZlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0Lk1lc3NhZ2UuT25lT2YgPSBPbmVPZjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBFbnVtLlxyXG4gICAgICAgICAqIEBleHBvcnRzIFByb3RvQnVmLlJlZmxlY3QuRW51bVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0LlR9IHBhcmVudCBQYXJlbnQgUmVmbGVjdCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBFbnVtIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBFbnVtIG9wdGlvbnNcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz99IHN5bnRheCBUaGUgc3ludGF4IGxldmVsIChlLmcuLCBwcm90bzMpXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgRW51bSA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHBhcmVudCwgbmFtZSwgb3B0aW9ucywgc3ludGF4KSB7XHJcbiAgICAgICAgICAgIE5hbWVzcGFjZS5jYWxsKHRoaXMsIGJ1aWxkZXIsIHBhcmVudCwgbmFtZSwgb3B0aW9ucywgc3ludGF4KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJFbnVtXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUnVudGltZSBlbnVtIG9iamVjdC5cclxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLG51bWJlcj58bnVsbH1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgdGhlIHN0cmluZyBuYW1lIG9mIGFuIGVudW0gdmFsdWUuXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlci5FbnVtfSBlbm0gUnVudGltZSBlbnVtXHJcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIEVudW0gdmFsdWVcclxuICAgICAgICAgKiBAcmV0dXJucyB7P3N0cmluZ30gTmFtZSBvciBgbnVsbGAgaWYgbm90IHByZXNlbnRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRW51bS5nZXROYW1lID0gZnVuY3Rpb24oZW5tLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVubSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MCwga2V5OyBpPGtleXMubGVuZ3RoOyArK2kpXHJcbiAgICAgICAgICAgICAgICBpZiAoZW5tW2tleSA9IGtleXNbaV1dID09PSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5FbnVtLnByb3RvdHlwZVxyXG4gICAgICAgICAqIEBpbm5lclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBFbnVtUHJvdG90eXBlID0gRW51bS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE5hbWVzcGFjZS5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZHMgdGhpcyBlbnVtIGFuZCByZXR1cm5zIHRoZSBydW50aW1lIGNvdW50ZXJwYXJ0LlxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVidWlsZCBXaGV0aGVyIHRvIHJlYnVpbGQgb3Igbm90LCBkZWZhdWx0cyB0byBmYWxzZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHshT2JqZWN0LjxzdHJpbmcsbnVtYmVyPn1cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRW51bVByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKHJlYnVpbGQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0ICYmICFyZWJ1aWxkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xyXG4gICAgICAgICAgICB2YXIgZW5tID0gbmV3IFByb3RvQnVmLkJ1aWxkZXIuRW51bSgpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gdGhpcy5nZXRDaGlsZHJlbihFbnVtLlZhbHVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBrPXZhbHVlcy5sZW5ndGg7IGk8azsgKytpKVxyXG4gICAgICAgICAgICAgICAgZW5tW3ZhbHVlc1tpXVsnbmFtZSddXSA9IHZhbHVlc1tpXVsnaWQnXTtcclxuICAgICAgICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSlcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbm0sICckb3B0aW9ucycsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHRoaXMuYnVpbGRPcHQoKSxcclxuICAgICAgICAgICAgICAgICAgICBcImVudW1lcmFibGVcIjogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3QgPSBlbm07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuRW51bVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0LkVudW0gPSBFbnVtO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IEVudW0gVmFsdWUuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5FbnVtLlZhbHVlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuRW51bX0gZW5tIEVudW0gcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgRmllbGQgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBVbmlxdWUgZmllbGQgaWRcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0LlRcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgVmFsdWUgPSBmdW5jdGlvbihidWlsZGVyLCBlbm0sIG5hbWUsIGlkKSB7XHJcbiAgICAgICAgICAgIFQuY2FsbCh0aGlzLCBidWlsZGVyLCBlbm0sIG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBvdmVycmlkZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIkVudW0uVmFsdWVcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBVbmlxdWUgZW51bSB2YWx1ZSBpZC5cclxuICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEV4dGVuZHMgVFxyXG4gICAgICAgIFZhbHVlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVC5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5FbnVtLlZhbHVlXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuRW51bS5WYWx1ZSA9IFZhbHVlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBbiBleHRlbnNpb24gKGZpZWxkKS5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LkV4dGVuc2lvblxyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0LlR9IHBhcmVudCBQYXJlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgT2JqZWN0IG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2UuRmllbGR9IGZpZWxkIEV4dGVuc2lvbiBmaWVsZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBFeHRlbnNpb24gPSBmdW5jdGlvbihidWlsZGVyLCBwYXJlbnQsIG5hbWUsIGZpZWxkKSB7XHJcbiAgICAgICAgICAgIFQuY2FsbCh0aGlzLCBidWlsZGVyLCBwYXJlbnQsIG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEV4dGVuZGVkIG1lc3NhZ2UgZmllbGQuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLkZpZWxkfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gRXh0ZW5kcyBUXHJcbiAgICAgICAgRXh0ZW5zaW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVC5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5FeHRlbnNpb25cclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5FeHRlbnNpb24gPSBFeHRlbnNpb247XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgU2VydmljZS5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5CdWlsZGVyfSBidWlsZGVyIEJ1aWxkZXIgcmVmZXJlbmNlXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuUmVmbGVjdC5OYW1lc3BhY2V9IHJvb3QgUm9vdFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFNlcnZpY2UgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE9wdGlvbnNcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKiBAZXh0ZW5kcyBQcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBTZXJ2aWNlID0gZnVuY3Rpb24oYnVpbGRlciwgcm9vdCwgbmFtZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBOYW1lc3BhY2UuY2FsbCh0aGlzLCBidWlsZGVyLCByb290LCBuYW1lLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJTZXJ2aWNlXCI7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQnVpbHQgcnVudGltZSBzZXJ2aWNlIGNsYXNzLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P2Z1bmN0aW9uKG5ldzpQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UpfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5jbGF6eiA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5wcm90b3R5cGVcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgU2VydmljZVByb3RvdHlwZSA9IFNlcnZpY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShOYW1lc3BhY2UucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoZSBzZXJ2aWNlIGFuZCByZXR1cm5zIHRoZSBydW50aW1lIGNvdW50ZXJwYXJ0LCB3aGljaCBpcyBhIGZ1bGx5IGZ1bmN0aW9uYWwgY2xhc3MuXHJcbiAgICAgICAgICogQHNlZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2VcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSByZWJ1aWxkIFdoZXRoZXIgdG8gcmVidWlsZCBvciBub3RcclxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gU2VydmljZSBjbGFzc1xyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbWVzc2FnZSBjYW5ub3QgYmUgYnVpbHRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU2VydmljZVByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKHJlYnVpbGQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhenogJiYgIXJlYnVpbGQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGF6ejtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgcnVudGltZSBTZXJ2aWNlIGNsYXNzIGluIGl0cyBvd24gc2NvcGVcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhenogPSAoZnVuY3Rpb24oUHJvdG9CdWYsIFQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgcnVudGltZSBTZXJ2aWNlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHN0cmluZywgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLCBmdW5jdGlvbihFcnJvciwgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlPSkpPX0gcnBjSW1wbCBSUEMgaW1wbGVtZW50YXRpb24gcmVjZWl2aW5nIHRoZSBtZXRob2QgbmFtZSBhbmQgdGhlIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAqIEBjbGFzcyBCYXJlYm9uZSBvZiBhbGwgcnVudGltZSBzZXJ2aWNlcy5cclxuICAgICAgICAgICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBzZXJ2aWNlIGNhbm5vdCBiZSBjcmVhdGVkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBTZXJ2aWNlID0gZnVuY3Rpb24ocnBjSW1wbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb3RvQnVmLkJ1aWxkZXIuU2VydmljZS5jYWxsKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBTZXJ2aWNlIGltcGxlbWVudGF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuU2VydmljZSNycGNJbXBsXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUgeyFmdW5jdGlvbihzdHJpbmcsIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZSwgZnVuY3Rpb24oRXJyb3IsIFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZT0pKX1cclxuICAgICAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ycGNJbXBsID0gcnBjSW1wbCB8fCBmdW5jdGlvbihuYW1lLCBtc2csIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgd2hhdCBhIHVzZXIgaGFzIHRvIGltcGxlbWVudDogQSBmdW5jdGlvbiByZWNlaXZpbmcgdGhlIG1ldGhvZCBuYW1lLCB0aGUgYWN0dWFsIG1lc3NhZ2UgdG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCAodHlwZSBjaGVja2VkKSBhbmQgdGhlIGNhbGxiYWNrIHRoYXQncyBlaXRoZXIgcHJvdmlkZWQgd2l0aCB0aGUgZXJyb3IgYXMgaXRzIGZpcnN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZ3VtZW50IG9yIG51bGwgYW5kIHRoZSBhY3R1YWwgcmVzcG9uc2UgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjay5iaW5kKHRoaXMsIEVycm9yKFwiTm90IGltcGxlbWVudGVkLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kY29kZUlPL1Byb3RvQnVmLmpzL3dpa2kvU2VydmljZXNcIikpLCAwKTsgLy8gTXVzdCBiZSBhc3luYyFcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UucHJvdG90eXBlXHJcbiAgICAgICAgICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIFNlcnZpY2VQcm90b3R5cGUgPSBTZXJ2aWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlLnByb3RvdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBBc3luY2hyb25vdXNseSBwZXJmb3JtcyBhbiBSUEMgY2FsbCB1c2luZyB0aGUgZ2l2ZW4gUlBDIGltcGxlbWVudGF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlLltNZXRob2RdXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7IWZ1bmN0aW9uKHN0cmluZywgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlLCBmdW5jdGlvbihFcnJvciwgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlPSkpfSBycGNJbXBsIFJQQyBpbXBsZW1lbnRhdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V9IHJlcSBSZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKEVycm9yLCAoUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfEJ5dGVCdWZmZXJ8QnVmZmVyfHN0cmluZyk9KX0gY2FsbGJhY2sgQ2FsbGJhY2sgcmVjZWl2aW5nXHJcbiAgICAgICAgICAgICAgICAgKiAgdGhlIGVycm9yIGlmIGFueSBhbmQgdGhlIHJlc3BvbnNlIGVpdGhlciBhcyBhIHByZS1wYXJzZWQgbWVzc2FnZSBvciBhcyBpdHMgcmF3IGJ5dGVzXHJcbiAgICAgICAgICAgICAgICAgKiBAYWJzdHJhY3RcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQXN5bmNocm9ub3VzbHkgcGVyZm9ybXMgYW4gUlBDIGNhbGwgdXNpbmcgdGhlIGluc3RhbmNlJ3MgUlBDIGltcGxlbWVudGF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlI1tNZXRob2RdXHJcbiAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7UHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlfSByZXEgUmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbihFcnJvciwgKFByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZXxCeXRlQnVmZmVyfEJ1ZmZlcnxzdHJpbmcpPSl9IGNhbGxiYWNrIENhbGxiYWNrIHJlY2VpdmluZ1xyXG4gICAgICAgICAgICAgICAgICogIHRoZSBlcnJvciBpZiBhbnkgYW5kIHRoZSByZXNwb25zZSBlaXRoZXIgYXMgYSBwcmUtcGFyc2VkIG1lc3NhZ2Ugb3IgYXMgaXRzIHJhdyBieXRlc1xyXG4gICAgICAgICAgICAgICAgICogQGFic3RyYWN0XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcnBjID0gVC5nZXRDaGlsZHJlbihQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuUlBDTWV0aG9kKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxycGMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24obWV0aG9kKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXJ2aWNlI01ldGhvZChtZXNzYWdlLCBjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2VydmljZVByb3RvdHlwZVttZXRob2QubmFtZV0gPSBmdW5jdGlvbihyZXEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGdpdmVuIGFzIGEgYnVmZmVyLCBkZWNvZGUgdGhlIHJlcXVlc3QuIFdpbGwgdGhyb3cgYSBUeXBlRXJyb3IgaWYgbm90IGEgdmFsaWQgYnVmZmVyLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEgPSBtZXRob2QucmVzb2x2ZWRSZXF1ZXN0VHlwZS5jbGF6ei5kZWNvZGUoQnl0ZUJ1ZmZlci53cmFwKHJlcSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxID09PSBudWxsIHx8IHR5cGVvZiByZXEgIT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIklsbGVnYWwgYXJndW1lbnRzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJlcSBpbnN0YW5jZW9mIG1ldGhvZC5yZXNvbHZlZFJlcXVlc3RUeXBlLmNsYXp6KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxID0gbmV3IG1ldGhvZC5yZXNvbHZlZFJlcXVlc3RUeXBlLmNsYXp6KHJlcSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ycGNJbXBsKG1ldGhvZC5mcW4oKSwgcmVxLCBmdW5jdGlvbihlcnIsIHJlcykgeyAvLyBBc3N1bWVzIHRoYXQgdGhpcyBpcyBwcm9wZXJseSBhc3luY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvYWxlc2NlIHRvIGVtcHR5IHN0cmluZyB3aGVuIHNlcnZpY2UgcmVzcG9uc2UgaGFzIGVtcHR5IGNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7IHJlcyA9IG1ldGhvZC5yZXNvbHZlZFJlc3BvbnNlVHlwZS5jbGF6ei5kZWNvZGUocmVzKTsgfSBjYXRjaCAobm90QUJ1ZmZlcikge31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXMgfHwgIShyZXMgaW5zdGFuY2VvZiBtZXRob2QucmVzb2x2ZWRSZXNwb25zZVR5cGUuY2xhenopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhFcnJvcihcIklsbGVnYWwgcmVzcG9uc2UgdHlwZSByZWNlaXZlZCBpbiBzZXJ2aWNlIG1ldGhvZCBcIisgVC5uYW1lK1wiI1wiK21ldGhvZC5uYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2suYmluZCh0aGlzLCBlcnIpLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlcnZpY2UuTWV0aG9kKHJwY0ltcGwsIG1lc3NhZ2UsIGNhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlW21ldGhvZC5uYW1lXSA9IGZ1bmN0aW9uKHJwY0ltcGwsIHJlcSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXJ2aWNlKHJwY0ltcGwpW21ldGhvZC5uYW1lXShyZXEsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZVttZXRob2QubmFtZV0sIFwiJG9wdGlvbnNcIiwgeyBcInZhbHVlXCI6IG1ldGhvZC5idWlsZE9wdCgpIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNlcnZpY2VQcm90b3R5cGVbbWV0aG9kLm5hbWVdLCBcIiRvcHRpb25zXCIsIHsgXCJ2YWx1ZVwiOiBTZXJ2aWNlW21ldGhvZC5uYW1lXVtcIiRvcHRpb25zXCJdIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKHJwY1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUHJvcGVydGllc1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2VydmljZSBvcHRpb25zLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlLiRvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsKj59XHJcbiAgICAgICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciAkb3B0aW9uc1M7IC8vIGNjIG5lZWRzIHRoaXNcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFNlcnZpY2Ugb3B0aW9ucy5cclxuICAgICAgICAgICAgICAgICAqIEBuYW1lIFByb3RvQnVmLkJ1aWxkZXIuU2VydmljZSMkb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCo+fVxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgJG9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZWZsZWN0aW9uIHR5cGUuXHJcbiAgICAgICAgICAgICAgICAgKiBAbmFtZSBQcm90b0J1Zi5CdWlsZGVyLlNlcnZpY2UuJHR5cGVcclxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlfVxyXG4gICAgICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgJHR5cGVTO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogUmVmbGVjdGlvbiB0eXBlLlxyXG4gICAgICAgICAgICAgICAgICogQG5hbWUgUHJvdG9CdWYuQnVpbGRlci5TZXJ2aWNlIyR0eXBlXHJcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7IVByb3RvQnVmLlJlZmxlY3QuU2VydmljZX1cclxuICAgICAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyICR0eXBlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNlcnZpY2UsIFwiJG9wdGlvbnNcIiwgeyBcInZhbHVlXCI6IFQuYnVpbGRPcHQoKSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2VydmljZVByb3RvdHlwZSwgXCIkb3B0aW9uc1wiLCB7IFwidmFsdWVcIjogU2VydmljZVtcIiRvcHRpb25zXCJdIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXJ2aWNlLCBcIiR0eXBlXCIsIHsgXCJ2YWx1ZVwiOiBUIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXJ2aWNlUHJvdG90eXBlLCBcIiR0eXBlXCIsIHsgXCJ2YWx1ZVwiOiBUIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBTZXJ2aWNlO1xyXG5cclxuICAgICAgICAgICAgfSkoUHJvdG9CdWYsIHRoaXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2VcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgUmVmbGVjdC5TZXJ2aWNlID0gU2VydmljZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWJzdHJhY3Qgc2VydmljZSBtZXRob2QuXHJcbiAgICAgICAgICogQGV4cG9ydHMgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLk1ldGhvZFxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLkJ1aWxkZXJ9IGJ1aWxkZXIgQnVpbGRlciByZWZlcmVuY2VcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2V9IHN2YyBTZXJ2aWNlXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTWV0aG9kIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBPcHRpb25zXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5UXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIE1ldGhvZCA9IGZ1bmN0aW9uKGJ1aWxkZXIsIHN2YywgbmFtZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBULmNhbGwodGhpcywgYnVpbGRlciwgc3ZjLCBuYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAb3ZlcnJpZGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJTZXJ2aWNlLk1ldGhvZFwiO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9wdGlvbnMuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgKj59XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5NZXRob2QucHJvdG90eXBlXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIE1ldGhvZFByb3RvdHlwZSA9IE1ldGhvZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFQucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoZSBtZXRob2QncyAnJG9wdGlvbnMnIHByb3BlcnR5LlxyXG4gICAgICAgICAqIEBuYW1lIFByb3RvQnVmLlJlZmxlY3QuU2VydmljZS5NZXRob2QjYnVpbGRPcHRcclxuICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3QuPHN0cmluZywqPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBNZXRob2RQcm90b3R5cGUuYnVpbGRPcHQgPSBOYW1lc3BhY2VQcm90b3R5cGUuYnVpbGRPcHQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuTWV0aG9kXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJlZmxlY3QuU2VydmljZS5NZXRob2QgPSBNZXRob2Q7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJQQyBzZXJ2aWNlIG1ldGhvZC5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuUlBDTWV0aG9kXHJcbiAgICAgICAgICogQHBhcmFtIHshUHJvdG9CdWYuQnVpbGRlcn0gYnVpbGRlciBCdWlsZGVyIHJlZmVyZW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSB7IVByb3RvQnVmLlJlZmxlY3QuU2VydmljZX0gc3ZjIFNlcnZpY2VcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBNZXRob2QgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0IFJlcXVlc3QgbWVzc2FnZSBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlIFJlc3BvbnNlIG1lc3NhZ2UgbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVxdWVzdF9zdHJlYW0gV2hldGhlciByZXF1ZXN0cyBhcmUgc3RyZWFtZWRcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlc3BvbnNlX3N0cmVhbSBXaGV0aGVyIHJlc3BvbnNlcyBhcmUgc3RyZWFtZWRcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gb3B0aW9ucyBPcHRpb25zXHJcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICogQGV4dGVuZHMgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLk1ldGhvZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBSUENNZXRob2QgPSBmdW5jdGlvbihidWlsZGVyLCBzdmMsIG5hbWUsIHJlcXVlc3QsIHJlc3BvbnNlLCByZXF1ZXN0X3N0cmVhbSwgcmVzcG9uc2Vfc3RyZWFtLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIE1ldGhvZC5jYWxsKHRoaXMsIGJ1aWxkZXIsIHN2YywgbmFtZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG92ZXJyaWRlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiU2VydmljZS5SUENNZXRob2RcIjtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXF1ZXN0IG1lc3NhZ2UgbmFtZS5cclxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TmFtZSA9IHJlcXVlc3Q7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVzcG9uc2UgbWVzc2FnZSBuYW1lLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlTmFtZSA9IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFdoZXRoZXIgcmVxdWVzdHMgYXJlIHN0cmVhbWVkXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RTdHJlYW0gPSByZXF1ZXN0X3N0cmVhbTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBXaGV0aGVyIHJlc3BvbnNlcyBhcmUgc3RyZWFtZWRcclxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VTdHJlYW0gPSByZXNwb25zZV9zdHJlYW07XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVzb2x2ZWQgcmVxdWVzdCBtZXNzYWdlIHR5cGUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5SZWZsZWN0Lk1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRSZXF1ZXN0VHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVzb2x2ZWQgcmVzcG9uc2UgbWVzc2FnZSB0eXBlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7UHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkUmVzcG9uc2VUeXBlID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBFeHRlbmRzIE1ldGhvZFxyXG4gICAgICAgIFJQQ01ldGhvZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1ldGhvZC5wcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLlJQQ01ldGhvZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBSZWZsZWN0LlNlcnZpY2UuUlBDTWV0aG9kID0gUlBDTWV0aG9kO1xyXG5cclxuICAgICAgICByZXR1cm4gUmVmbGVjdDtcclxuXHJcbiAgICB9KShQcm90b0J1Zik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAYWxpYXMgUHJvdG9CdWYuQnVpbGRlclxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5CdWlsZGVyID0gKGZ1bmN0aW9uKFByb3RvQnVmLCBMYW5nLCBSZWZsZWN0KSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnN0cnVjdHMgYSBuZXcgQnVpbGRlci5cclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5CdWlsZGVyXHJcbiAgICAgICAgICogQGNsYXNzIFByb3ZpZGVzIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGJ1aWxkIHByb3RvY29sIG1lc3NhZ2VzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj49fSBvcHRpb25zIE9wdGlvbnNcclxuICAgICAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgQnVpbGRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBOYW1lc3BhY2UuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtQcm90b0J1Zi5SZWZsZWN0Lk5hbWVzcGFjZX1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5ucyA9IG5ldyBSZWZsZWN0Lk5hbWVzcGFjZSh0aGlzLCBudWxsLCBcIlwiKTsgLy8gR2xvYmFsIG5hbWVzcGFjZVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5hbWVzcGFjZSBwb2ludGVyLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7UHJvdG9CdWYuUmVmbGVjdC5UfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnB0ciA9IHRoaXMubnM7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVzb2x2ZWQgZmxhZy5cclxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBUaGUgY3VycmVudCBidWlsZGluZyByZXN1bHQuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZyxQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2V8T2JqZWN0PnxudWxsfVxyXG4gICAgICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnJlc3VsdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW1wb3J0ZWQgZmlsZXMuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5maWxlcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEltcG9ydCByb290IG92ZXJyaWRlLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7P3N0cmluZ31cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pbXBvcnRSb290ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBPcHRpb25zLlxyXG4gICAgICAgICAgICAgKiBAdHlwZSB7IU9iamVjdC48c3RyaW5nLCAqPn1cclxuICAgICAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuQnVpbGRlci5wcm90b3R5cGVcclxuICAgICAgICAgKiBAaW5uZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgQnVpbGRlclByb3RvdHlwZSA9IEJ1aWxkZXIucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBEZWZpbml0aW9uIHRlc3RzIC0tLS0tXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRlc3RzIGlmIGEgZGVmaW5pdGlvbiBtb3N0IGxpa2VseSBkZXNjcmliZXMgYSBtZXNzYWdlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gZGVmXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuaXNNZXNzYWdlID0gZnVuY3Rpb24oZGVmKSB7XHJcbiAgICAgICAgICAgIC8vIE1lc3NhZ2VzIHJlcXVpcmUgYSBzdHJpbmcgbmFtZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcIm5hbWVcIl0gIT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyBNZXNzYWdlcyBkbyBub3QgY29udGFpbiB2YWx1ZXMgKGVudW0pIG9yIHJwYyBtZXRob2RzIChzZXJ2aWNlKVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcInZhbHVlc1wiXSAhPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRlZltcInJwY1wiXSAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRlc3RzIGlmIGEgZGVmaW5pdGlvbiBtb3N0IGxpa2VseSBkZXNjcmliZXMgYSBtZXNzYWdlIGZpZWxkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gZGVmXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuaXNNZXNzYWdlRmllbGQgPSBmdW5jdGlvbihkZWYpIHtcclxuICAgICAgICAgICAgLy8gTWVzc2FnZSBmaWVsZHMgcmVxdWlyZSBhIHN0cmluZyBydWxlLCBuYW1lIGFuZCB0eXBlIGFuZCBhbiBpZFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcInJ1bGVcIl0gIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkZWZbXCJuYW1lXCJdICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgZGVmW1widHlwZVwiXSAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGRlZltcImlkXCJdID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGVzdHMgaWYgYSBkZWZpbml0aW9uIG1vc3QgbGlrZWx5IGRlc2NyaWJlcyBhbiBlbnVtLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gZGVmXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuaXNFbnVtID0gZnVuY3Rpb24oZGVmKSB7XHJcbiAgICAgICAgICAgIC8vIEVudW1zIHJlcXVpcmUgYSBzdHJpbmcgbmFtZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcIm5hbWVcIl0gIT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyBFbnVtcyByZXF1aXJlIGF0IGxlYXN0IG9uZSB2YWx1ZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcInZhbHVlc1wiXSA9PT0gJ3VuZGVmaW5lZCcgfHwgIUFycmF5LmlzQXJyYXkoZGVmW1widmFsdWVzXCJdKSB8fCBkZWZbXCJ2YWx1ZXNcIl0ubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUZXN0cyBpZiBhIGRlZmluaXRpb24gbW9zdCBsaWtlbHkgZGVzY3JpYmVzIGEgc2VydmljZS5cclxuICAgICAgICAgKiBAcGFyYW0geyFPYmplY3R9IGRlZlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyLmlzU2VydmljZSA9IGZ1bmN0aW9uKGRlZikge1xyXG4gICAgICAgICAgICAvLyBTZXJ2aWNlcyByZXF1aXJlIGEgc3RyaW5nIG5hbWUgYW5kIGFuIHJwYyBvYmplY3RcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWZbXCJuYW1lXCJdICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgZGVmW1wicnBjXCJdICE9PSAnb2JqZWN0JyB8fCAhZGVmW1wicnBjXCJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUZXN0cyBpZiBhIGRlZmluaXRpb24gbW9zdCBsaWtlbHkgZGVzY3JpYmVzIGFuIGV4dGVuZGVkIG1lc3NhZ2VcclxuICAgICAgICAgKiBAcGFyYW0geyFPYmplY3R9IGRlZlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyLmlzRXh0ZW5kID0gZnVuY3Rpb24oZGVmKSB7XHJcbiAgICAgICAgICAgIC8vIEV4dGVuZHMgcnF1aXJlIGEgc3RyaW5nIHJlZlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZltcInJlZlwiXSAhPT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIEJ1aWxkaW5nIC0tLS0tXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlc2V0cyB0aGUgcG9pbnRlciB0byB0aGUgcm9vdCBuYW1lc3BhY2UuXHJcbiAgICAgICAgICogQHJldHVybnMgeyFQcm90b0J1Zi5CdWlsZGVyfSB0aGlzXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5wdHIgPSB0aGlzLm5zO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZWZpbmVzIGEgbmFtZXNwYWNlIG9uIHRvcCBvZiB0aGUgY3VycmVudCBwb2ludGVyIHBvc2l0aW9uIGFuZCBwbGFjZXMgdGhlIHBvaW50ZXIgb24gaXQuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVzcGFjZVxyXG4gICAgICAgICAqIEByZXR1cm4geyFQcm90b0J1Zi5CdWlsZGVyfSB0aGlzXHJcbiAgICAgICAgICogQGV4cG9zZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24obmFtZXNwYWNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlICE9PSAnc3RyaW5nJyB8fCAhTGFuZy5UWVBFUkVGLnRlc3QobmFtZXNwYWNlKSlcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBuYW1lc3BhY2U6IFwiK25hbWVzcGFjZSk7XHJcbiAgICAgICAgICAgIG5hbWVzcGFjZS5zcGxpdChcIi5cIikuZm9yRWFjaChmdW5jdGlvbihwYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnMgPSB0aGlzLnB0ci5nZXRDaGlsZChwYXJ0KTtcclxuICAgICAgICAgICAgICAgIGlmIChucyA9PT0gbnVsbCkgLy8gS2VlcCBleGlzdGluZ1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLmFkZENoaWxkKG5zID0gbmV3IFJlZmxlY3QuTmFtZXNwYWNlKHRoaXMsIHRoaXMucHRyLCBwYXJ0KSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB0ciA9IG5zO1xyXG4gICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlcyB0aGUgc3BlY2lmaWVkIGRlZmluaXRpb25zIGF0IHRoZSBjdXJyZW50IHBvaW50ZXIgcG9zaXRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHshQXJyYXkuPCFPYmplY3Q+fSBkZWZzIE1lc3NhZ2VzLCBlbnVtcyBvciBzZXJ2aWNlcyB0byBjcmVhdGVcclxuICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLkJ1aWxkZXJ9IHRoaXNcclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgYSBtZXNzYWdlIGRlZmluaXRpb24gaXMgaW52YWxpZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyUHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGRlZnMpIHtcclxuICAgICAgICAgICAgaWYgKCFkZWZzKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIE5vdGhpbmcgdG8gY3JlYXRlXHJcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShkZWZzKSlcclxuICAgICAgICAgICAgICAgIGRlZnMgPSBbZGVmc107XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlZnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICAgICAgZGVmcyA9IGRlZnMuc2xpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSXQncyBxdWl0ZSBoYXJkIHRvIGtlZXAgdHJhY2sgb2Ygc2NvcGVzIGFuZCBtZW1vcnkgaGVyZSwgc28gbGV0J3MgZG8gdGhpcyBpdGVyYXRpdmVseS5cclxuICAgICAgICAgICAgdmFyIHN0YWNrID0gW2RlZnNdO1xyXG4gICAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGVmcyA9IHN0YWNrLnBvcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShkZWZzKSkgLy8gU3RhY2sgYWx3YXlzIGNvbnRhaW5zIGVudGlyZSBuYW1lc3BhY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJub3QgYSB2YWxpZCBuYW1lc3BhY2U6IFwiK0pTT04uc3RyaW5naWZ5KGRlZnMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoZGVmcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlZiA9IGRlZnMuc2hpZnQoKTsgLy8gTmFtZXNwYWNlcyBhbHdheXMgY29udGFpbiBhbiBhcnJheSBvZiBtZXNzYWdlcywgZW51bXMgYW5kIHNlcnZpY2VzXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChCdWlsZGVyLmlzTWVzc2FnZShkZWYpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSBuZXcgUmVmbGVjdC5NZXNzYWdlKHRoaXMsIHRoaXMucHRyLCBkZWZbXCJuYW1lXCJdLCBkZWZbXCJvcHRpb25zXCJdLCBkZWZbXCJpc0dyb3VwXCJdLCBkZWZbXCJzeW50YXhcIl0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIE9uZU9mc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lb2ZzID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZbXCJvbmVvZnNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkZWZbXCJvbmVvZnNcIl0pLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5hZGRDaGlsZChvbmVvZnNbbmFtZV0gPSBuZXcgUmVmbGVjdC5NZXNzYWdlLk9uZU9mKHRoaXMsIG9iaiwgbmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZmllbGRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZbXCJmaWVsZHNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZbXCJmaWVsZHNcIl0uZm9yRWFjaChmdW5jdGlvbihmbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmdldENoaWxkKGZsZFtcImlkXCJdfDApICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImR1cGxpY2F0ZSBvciBpbnZhbGlkIGZpZWxkIGlkIGluIFwiK29iai5uYW1lK1wiOiBcIitmbGRbJ2lkJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbGRbXCJvcHRpb25zXCJdICYmIHR5cGVvZiBmbGRbXCJvcHRpb25zXCJdICE9PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGZpZWxkIG9wdGlvbnMgaW4gXCIrb2JqLm5hbWUrXCIjXCIrZmxkW1wibmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZW9mID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZsZFtcIm9uZW9mXCJdID09PSAnc3RyaW5nJyAmJiAhKG9uZW9mID0gb25lb2ZzW2ZsZFtcIm9uZW9mXCJdXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBvbmVvZiBpbiBcIitvYmoubmFtZStcIiNcIitmbGRbXCJuYW1lXCJdK1wiOiBcIitmbGRbXCJvbmVvZlwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxkID0gbmV3IFJlZmxlY3QuTWVzc2FnZS5GaWVsZCh0aGlzLCBvYmosIGZsZFtcInJ1bGVcIl0sIGZsZFtcImtleXR5cGVcIl0sIGZsZFtcInR5cGVcIl0sIGZsZFtcIm5hbWVcIl0sIGZsZFtcImlkXCJdLCBmbGRbXCJvcHRpb25zXCJdLCBvbmVvZiwgZGVmW1wic3ludGF4XCJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob25lb2YpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uZW9mLmZpZWxkcy5wdXNoKGZsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmFkZENoaWxkKGZsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFB1c2ggY2hpbGRyZW4gdG8gc3RhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Yk9iaiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmW1wiZW51bXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZbXCJlbnVtc1wiXS5mb3JFYWNoKGZ1bmN0aW9uKGVubSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Yk9iai5wdXNoKGVubSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltcIm1lc3NhZ2VzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmW1wibWVzc2FnZXNcIl0uZm9yRWFjaChmdW5jdGlvbihtc2cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJPYmoucHVzaChtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZbXCJzZXJ2aWNlc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZltcInNlcnZpY2VzXCJdLmZvckVhY2goZnVuY3Rpb24oc3ZjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViT2JqLnB1c2goc3ZjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IGV4dGVuc2lvbiByYW5nZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltcImV4dGVuc2lvbnNcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmW1wiZXh0ZW5zaW9uc1wiXVswXSA9PT0gJ251bWJlcicpIC8vIHByZSA1LjAuMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5leHRlbnNpb25zID0gWyBkZWZbXCJleHRlbnNpb25zXCJdIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmV4dGVuc2lvbnMgPSBkZWZbXCJleHRlbnNpb25zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgb24gdG9wIG9mIGN1cnJlbnQgbmFtZXNwYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLmFkZENoaWxkKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJPYmoubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChkZWZzKTsgLy8gUHVzaCB0aGUgY3VycmVudCBsZXZlbCBiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZzID0gc3ViT2JqOyAvLyBDb250aW51ZSBwcm9jZXNzaW5nIHN1YiBsZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViT2JqID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHRyID0gb2JqOyAvLyBBbmQgbW92ZSB0aGUgcG9pbnRlciB0byB0aGlzIG5hbWVzcGFjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Yk9iaiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQnVpbGRlci5pc0VudW0oZGVmKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gbmV3IFJlZmxlY3QuRW51bSh0aGlzLCB0aGlzLnB0ciwgZGVmW1wibmFtZVwiXSwgZGVmW1wib3B0aW9uc1wiXSwgZGVmW1wic3ludGF4XCJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmW1widmFsdWVzXCJdLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouYWRkQ2hpbGQobmV3IFJlZmxlY3QuRW51bS5WYWx1ZSh0aGlzLCBvYmosIHZhbFtcIm5hbWVcIl0sIHZhbFtcImlkXCJdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB0ci5hZGRDaGlsZChvYmopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEJ1aWxkZXIuaXNTZXJ2aWNlKGRlZikpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IG5ldyBSZWZsZWN0LlNlcnZpY2UodGhpcywgdGhpcy5wdHIsIGRlZltcIm5hbWVcIl0sIGRlZltcIm9wdGlvbnNcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkZWZbXCJycGNcIl0pLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG10ZCA9IGRlZltcInJwY1wiXVtuYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5hZGRDaGlsZChuZXcgUmVmbGVjdC5TZXJ2aWNlLlJQQ01ldGhvZCh0aGlzLCBvYmosIG5hbWUsIG10ZFtcInJlcXVlc3RcIl0sIG10ZFtcInJlc3BvbnNlXCJdLCAhIW10ZFtcInJlcXVlc3Rfc3RyZWFtXCJdLCAhIW10ZFtcInJlc3BvbnNlX3N0cmVhbVwiXSwgbXRkW1wib3B0aW9uc1wiXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIuYWRkQ2hpbGQob2JqKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCdWlsZGVyLmlzRXh0ZW5kKGRlZikpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHRoaXMucHRyLnJlc29sdmUoZGVmW1wicmVmXCJdLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmW1wiZmllbGRzXCJdLmZvckVhY2goZnVuY3Rpb24oZmxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5nZXRDaGlsZChmbGRbJ2lkJ118MCkgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiZHVwbGljYXRlIGV4dGVuZGVkIGZpZWxkIGlkIGluIFwiK29iai5uYW1lK1wiOiBcIitmbGRbJ2lkJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGZpZWxkIGlkIGlzIGFsbG93ZWQgdG8gYmUgZXh0ZW5kZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmV4dGVuc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24ocmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbGRbXCJpZFwiXSA+PSByYW5nZVswXSAmJiBmbGRbXCJpZFwiXSA8PSByYW5nZVsxXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGV4dGVuZGVkIGZpZWxkIGlkIGluIFwiK29iai5uYW1lK1wiOiBcIitmbGRbJ2lkJ10rXCIgKG5vdCB3aXRoaW4gdmFsaWQgcmFuZ2VzKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBleHRlbnNpb24gZmllbGQgbmFtZXMgdG8gY2FtZWwgY2FzZSBub3RhdGlvbiBpZiB0aGUgb3ZlcnJpZGUgaXMgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBmbGRbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnNbJ2NvbnZlcnRGaWVsZHNUb0NhbWVsQ2FzZSddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gUHJvdG9CdWYuVXRpbC50b0NhbWVsQ2FzZShuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWUgIzE2MTogRXh0ZW5zaW9ucyB1c2UgdGhlaXIgZnVsbHkgcXVhbGlmaWVkIG5hbWUgYXMgdGhlaXIgcnVudGltZSBrZXkgYW5kLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gbmV3IFJlZmxlY3QuTWVzc2FnZS5FeHRlbnNpb25GaWVsZCh0aGlzLCBvYmosIGZsZFtcInJ1bGVcIl0sIGZsZFtcInR5cGVcIl0sIHRoaXMucHRyLmZxbigpKycuJytuYW1lLCBmbGRbXCJpZFwiXSwgZmxkW1wib3B0aW9uc1wiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLi4uYXJlIGFkZGVkIG9uIHRvcCBvZiB0aGUgY3VycmVudCBuYW1lc3BhY2UgYXMgYW4gZXh0ZW5zaW9uIHdoaWNoIGlzIHVzZWQgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzb2x2aW5nIHRoZWlyIHR5cGUgbGF0ZXIgb24gKHRoZSBleHRlbnNpb24gYWx3YXlzIGtlZXBzIHRoZSBvcmlnaW5hbCBuYW1lIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJldmVudCBuYW1pbmcgY29sbGlzaW9ucylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0ID0gbmV3IFJlZmxlY3QuRXh0ZW5zaW9uKHRoaXMsIHRoaXMucHRyLCBmbGRbXCJuYW1lXCJdLCBmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZXh0ZW5zaW9uID0gZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLmFkZENoaWxkKGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmFkZENoaWxkKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghL1xcLj9nb29nbGVcXC5wcm90b2J1ZlxcLi8udGVzdChkZWZbXCJyZWZcIl0pKSAvLyBTaWxlbnRseSBza2lwIGludGVybmFsIGV4dGVuc2lvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiZXh0ZW5kZWQgbWVzc2FnZSBcIitkZWZbXCJyZWZcIl0rXCIgaXMgbm90IGRlZmluZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vdCBhIHZhbGlkIGRlZmluaXRpb246IFwiK0pTT04uc3RyaW5naWZ5KGRlZikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWYgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBCcmVhayBnb2VzIGhlcmVcclxuICAgICAgICAgICAgICAgIGRlZnMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdHIgPSB0aGlzLnB0ci5wYXJlbnQ7IC8vIE5hbWVzcGFjZSBkb25lLCBjb250aW51ZSBhdCBwYXJlbnRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkID0gZmFsc2U7IC8vIFJlcXVpcmUgcmUtcmVzb2x2ZVxyXG4gICAgICAgICAgICB0aGlzLnJlc3VsdCA9IG51bGw7IC8vIFJlcXVpcmUgcmUtYnVpbGRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGFnYXRlcyBzeW50YXggdG8gYWxsIGNoaWxkcmVuLlxyXG4gICAgICAgICAqIEBwYXJhbSB7IU9iamVjdH0gcGFyZW50XHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvcGFnYXRlU3ludGF4KHBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50WydtZXNzYWdlcyddKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRbJ21lc3NhZ2VzJ10uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkW1wic3ludGF4XCJdID0gcGFyZW50W1wic3ludGF4XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BhZ2F0ZVN5bnRheChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFyZW50WydlbnVtcyddKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRbJ2VudW1zJ10uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkW1wic3ludGF4XCJdID0gcGFyZW50W1wic3ludGF4XCJdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEltcG9ydHMgYW5vdGhlciBkZWZpbml0aW9uIGludG8gdGhpcyBidWlsZGVyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsKj59IGpzb24gUGFyc2VkIGltcG9ydFxyXG4gICAgICAgICAqIEBwYXJhbSB7KHN0cmluZ3x7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9KT19IGZpbGVuYW1lIEltcG9ydGVkIGZpbGUgbmFtZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlcn0gdGhpc1xyXG4gICAgICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgZGVmaW5pdGlvbiBvciBmaWxlIGNhbm5vdCBiZSBpbXBvcnRlZFxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyUHJvdG90eXBlW1wiaW1wb3J0XCJdID0gZnVuY3Rpb24oanNvbiwgZmlsZW5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGRlbGltID0gJy8nO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRvIHNraXAgZHVwbGljYXRlIGltcG9ydHNcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsZW5hbWUgPT09ICdzdHJpbmcnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFByb3RvQnVmLlV0aWwuSVNfTk9ERSlcclxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IHJlcXVpcmUoXCJwYXRoXCIpWydyZXNvbHZlJ10oZmlsZW5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsZXNbZmlsZW5hbWVdID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVzW2ZpbGVuYW1lXSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ29iamVjdCcpIHsgLy8gT2JqZWN0IHdpdGggcm9vdCwgZmlsZS5cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IGZpbGVuYW1lLnJvb3Q7XHJcbiAgICAgICAgICAgICAgICBpZiAoUHJvdG9CdWYuVXRpbC5JU19OT0RFKVxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3QgPSByZXF1aXJlKFwicGF0aFwiKVsncmVzb2x2ZSddKHJvb3QpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvb3QuaW5kZXhPZihcIlxcXFxcIikgPj0gMCB8fCBmaWxlbmFtZS5maWxlLmluZGV4T2YoXCJcXFxcXCIpID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsaW0gPSAnXFxcXCc7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm5hbWUgPSByb290ICsgZGVsaW0gKyBmaWxlbmFtZS5maWxlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsZXNbZm5hbWVdID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVzW2ZuYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEltcG9ydCBpbXBvcnRzXHJcblxyXG4gICAgICAgICAgICBpZiAoanNvblsnaW1wb3J0cyddICYmIGpzb25bJ2ltcG9ydHMnXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1wb3J0Um9vdCxcclxuICAgICAgICAgICAgICAgICAgICByZXNldFJvb3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZpbGVuYW1lID09PSAnb2JqZWN0JykgeyAvLyBJZiBhbiBpbXBvcnQgcm9vdCBpcyBzcGVjaWZpZWQsIG92ZXJyaWRlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1wb3J0Um9vdCA9IGZpbGVuYW1lW1wicm9vdFwiXTsgcmVzZXRSb290ID0gdHJ1ZTsgLy8gLi4uIGFuZCByZXNldCBhZnRlcndhcmRzXHJcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0Um9vdCA9IHRoaXMuaW1wb3J0Um9vdDtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lW1wiZmlsZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0Um9vdC5pbmRleE9mKFwiXFxcXFwiKSA+PSAwIHx8IGZpbGVuYW1lLmluZGV4T2YoXCJcXFxcXCIpID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGltID0gJ1xcXFwnO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbGVuYW1lID09PSAnc3RyaW5nJykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbXBvcnRSb290KSAvLyBJZiBpbXBvcnQgcm9vdCBpcyBvdmVycmlkZGVuLCB1c2UgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0Um9vdCA9IHRoaXMuaW1wb3J0Um9vdDtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy8gT3RoZXJ3aXNlIGNvbXB1dGUgZnJvbSBmaWxlbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZW5hbWUuaW5kZXhPZihcIi9cIikgPj0gMCkgeyAvLyBVbml4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRSb290ID0gZmlsZW5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvKiAvZmlsZS5wcm90byAqLyBpbXBvcnRSb290ID09PSBcIlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFJvb3QgPSBcIi9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxlbmFtZS5pbmRleE9mKFwiXFxcXFwiKSA+PSAwKSB7IC8vIFdpbmRvd3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFJvb3QgPSBmaWxlbmFtZS5yZXBsYWNlKC9cXFxcW15cXFxcXSokLywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxpbSA9ICdcXFxcJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRSb290ID0gXCIuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGltcG9ydFJvb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxqc29uWydpbXBvcnRzJ10ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGpzb25bJ2ltcG9ydHMnXVtpXSA9PT0gJ3N0cmluZycpIHsgLy8gSW1wb3J0IGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbXBvcnRSb290KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJjYW5ub3QgZGV0ZXJtaW5lIGltcG9ydCByb290XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1wb3J0RmlsZW5hbWUgPSBqc29uWydpbXBvcnRzJ11baV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnRGaWxlbmFtZSA9PT0gXCJnb29nbGUvcHJvdG9idWYvZGVzY3JpcHRvci5wcm90b1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIE5vdCBuZWVkZWQgYW5kIHRoZXJlZm9yZSBub3QgdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRGaWxlbmFtZSA9IGltcG9ydFJvb3QgKyBkZWxpbSArIGltcG9ydEZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWxlc1tpbXBvcnRGaWxlbmFtZV0gPT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gQWxyZWFkeSBpbXBvcnRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1xcLnByb3RvJC9pLnRlc3QoaW1wb3J0RmlsZW5hbWUpICYmICFQcm90b0J1Zi5Eb3RQcm90bykgICAgICAgLy8gSWYgdGhpcyBpcyBhIGxpZ2h0IGJ1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRGaWxlbmFtZSA9IGltcG9ydEZpbGVuYW1lLnJlcGxhY2UoL1xcLnByb3RvJC8sIFwiLmpzb25cIik7IC8vIGFsd2F5cyBsb2FkIHRoZSBKU09OIGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRzID0gUHJvdG9CdWYuVXRpbC5mZXRjaChpbXBvcnRGaWxlbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50cyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiZmFpbGVkIHRvIGltcG9ydCAnXCIraW1wb3J0RmlsZW5hbWUrXCInIGluICdcIitmaWxlbmFtZStcIic6IGZpbGUgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1xcLmpzb24kL2kudGVzdChpbXBvcnRGaWxlbmFtZSkpIC8vIEFsd2F5cyBwb3NzaWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tcImltcG9ydFwiXShKU09OLnBhcnNlKGNvbnRlbnRzK1wiXCIpLCBpbXBvcnRGaWxlbmFtZSk7IC8vIE1heSB0aHJvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW1wiaW1wb3J0XCJdKFByb3RvQnVmLkRvdFByb3RvLlBhcnNlci5wYXJzZShjb250ZW50cyksIGltcG9ydEZpbGVuYW1lKTsgLy8gTWF5IHRocm93XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIC8vIEltcG9ydCBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbXCJpbXBvcnRcIl0oanNvblsnaW1wb3J0cyddW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoL1xcLihcXHcrKSQvLnRlc3QoZmlsZW5hbWUpKSAvLyBXaXRoIGV4dGVuc2lvbjogQXBwZW5kIF9pbXBvcnROIHRvIHRoZSBuYW1lIHBvcnRpb24gdG8gbWFrZSBpdCB1bmlxdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbXCJpbXBvcnRcIl0oanNvblsnaW1wb3J0cyddW2ldLCBmaWxlbmFtZS5yZXBsYWNlKC9eKC4rKVxcLihcXHcrKSQvLCBmdW5jdGlvbigkMCwgJDEsICQyKSB7IHJldHVybiAkMStcIl9pbXBvcnRcIitpK1wiLlwiKyQyOyB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgLy8gV2l0aG91dCBleHRlbnNpb246IEFwcGVuZCBfaW1wb3J0TiB0byBtYWtlIGl0IHVuaXF1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tcImltcG9ydFwiXShqc29uWydpbXBvcnRzJ11baV0sIGZpbGVuYW1lK1wiX2ltcG9ydFwiK2kpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc2V0Um9vdCkgLy8gUmVzZXQgaW1wb3J0IHJvb3Qgb3ZlcnJpZGUgd2hlbiBhbGwgaW1wb3J0cyBhcmUgZG9uZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1wb3J0Um9vdCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEltcG9ydCBzdHJ1Y3R1cmVzXHJcblxyXG4gICAgICAgICAgICBpZiAoanNvblsncGFja2FnZSddKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZpbmUoanNvblsncGFja2FnZSddKTtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ3N5bnRheCddKVxyXG4gICAgICAgICAgICAgICAgcHJvcGFnYXRlU3ludGF4KGpzb24pO1xyXG4gICAgICAgICAgICB2YXIgYmFzZSA9IHRoaXMucHRyO1xyXG4gICAgICAgICAgICBpZiAoanNvblsnb3B0aW9ucyddKVxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoanNvblsnb3B0aW9ucyddKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2Uub3B0aW9uc1trZXldID0ganNvblsnb3B0aW9ucyddW2tleV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ21lc3NhZ2VzJ10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZShqc29uWydtZXNzYWdlcyddKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHRyID0gYmFzZTtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ2VudW1zJ10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZShqc29uWydlbnVtcyddKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHRyID0gYmFzZTtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ3NlcnZpY2VzJ10pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZShqc29uWydzZXJ2aWNlcyddKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHRyID0gYmFzZTtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ2V4dGVuZHMnXSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlKGpzb25bJ2V4dGVuZHMnXSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNldCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlc29sdmVzIGFsbCBuYW1lc3BhY2Ugb2JqZWN0cy5cclxuICAgICAgICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgYSB0eXBlIGNhbm5vdCBiZSByZXNvbHZlZFxyXG4gICAgICAgICAqIEByZXR1cm5zIHshUHJvdG9CdWYuQnVpbGRlcn0gdGhpc1xyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyUHJvdG90eXBlLnJlc29sdmVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gUmVzb2x2ZSBhbGwgcmVmbGVjdGVkIG9iamVjdHNcclxuICAgICAgICAgICAgdmFyIHJlcztcclxuICAgICAgICAgICAgaWYgKHRoaXMucHRyID09IG51bGwgfHwgdHlwZW9mIHRoaXMucHRyLnR5cGUgPT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIERvbmUgKGFscmVhZHkgcmVzb2x2ZWQpXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wdHIgaW5zdGFuY2VvZiBSZWZsZWN0Lk5hbWVzcGFjZSkgeyAvLyBSZXNvbHZlIGNoaWxkcmVuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wdHIuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHRyID0gY2hpbGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlQWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wdHIgaW5zdGFuY2VvZiBSZWZsZWN0Lk1lc3NhZ2UuRmllbGQpIHsgLy8gUmVzb2x2ZSB0eXBlXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEUudGVzdCh0aGlzLnB0ci50eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghTGFuZy5UWVBFUkVGLnRlc3QodGhpcy5wdHIudHlwZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCB0eXBlIHJlZmVyZW5jZSBpbiBcIit0aGlzLnB0ci50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5wdHIudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gKHRoaXMucHRyIGluc3RhbmNlb2YgUmVmbGVjdC5NZXNzYWdlLkV4dGVuc2lvbkZpZWxkID8gdGhpcy5wdHIuZXh0ZW5zaW9uLnBhcmVudCA6IHRoaXMucHRyLnBhcmVudCkucmVzb2x2ZSh0aGlzLnB0ci50eXBlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bnJlc29sdmFibGUgdHlwZSByZWZlcmVuY2UgaW4gXCIrdGhpcy5wdHIudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3RoaXMucHRyLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLnJlc29sdmVkVHlwZSA9IHJlcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzIGluc3RhbmNlb2YgUmVmbGVjdC5FbnVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLnR5cGUgPSBQcm90b0J1Zi5UWVBFU1tcImVudW1cIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnB0ci5zeW50YXggPT09ICdwcm90bzMnICYmIHJlcy5zeW50YXggIT09ICdwcm90bzMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJwcm90bzMgbWVzc2FnZSBjYW5ub3QgcmVmZXJlbmNlIHByb3RvMiBlbnVtXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXMgaW5zdGFuY2VvZiBSZWZsZWN0Lk1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLnR5cGUgPSByZXMuaXNHcm91cCA/IFByb3RvQnVmLlRZUEVTW1wiZ3JvdXBcIl0gOiBQcm90b0J1Zi5UWVBFU1tcIm1lc3NhZ2VcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgdHlwZSByZWZlcmVuY2UgaW4gXCIrdGhpcy5wdHIudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3RoaXMucHRyLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdHIudHlwZSA9IFByb3RvQnVmLlRZUEVTW3RoaXMucHRyLnR5cGVdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgYSBtYXAgZmllbGQsIGFsc28gcmVzb2x2ZSB0aGUga2V5IHR5cGUuIFRoZSBrZXkgdHlwZSBjYW4gYmUgb25seSBhIG51bWVyaWMsIHN0cmluZywgb3IgYm9vbCB0eXBlXHJcbiAgICAgICAgICAgICAgICAvLyAoaS5lLiwgbm8gZW51bXMgb3IgbWVzc2FnZXMpLCBzbyB3ZSBkb24ndCBuZWVkIHRvIHJlc29sdmUgYWdhaW5zdCB0aGUgY3VycmVudCBuYW1lc3BhY2UuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wdHIubWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMYW5nLlRZUEUudGVzdCh0aGlzLnB0ci5rZXlUeXBlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJpbGxlZ2FsIGtleSB0eXBlIGZvciBtYXAgZmllbGQgaW4gXCIrdGhpcy5wdHIudG9TdHJpbmcodHJ1ZSkrXCI6IFwiK3RoaXMucHRyLmtleVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLmtleVR5cGUgPSBQcm90b0J1Zi5UWVBFU1t0aGlzLnB0ci5rZXlUeXBlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wdHIgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0LlNlcnZpY2UuTWV0aG9kKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHRyIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5TZXJ2aWNlLlJQQ01ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMucHRyLnBhcmVudC5yZXNvbHZlKHRoaXMucHRyLnJlcXVlc3ROYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcyB8fCAhKHJlcyBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB0eXBlIHJlZmVyZW5jZSBpbiBcIit0aGlzLnB0ci50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5wdHIucmVxdWVzdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHRyLnJlc29sdmVkUmVxdWVzdFR5cGUgPSByZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gdGhpcy5wdHIucGFyZW50LnJlc29sdmUodGhpcy5wdHIucmVzcG9uc2VOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcyB8fCAhKHJlcyBpbnN0YW5jZW9mIFByb3RvQnVmLlJlZmxlY3QuTWVzc2FnZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiSWxsZWdhbCB0eXBlIHJlZmVyZW5jZSBpbiBcIit0aGlzLnB0ci50b1N0cmluZyh0cnVlKStcIjogXCIrdGhpcy5wdHIucmVzcG9uc2VOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB0ci5yZXNvbHZlZFJlc3BvbnNlVHlwZSA9IHJlcztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSAvLyBTaG91bGQgbm90IGhhcHBlbiBhcyBub3RoaW5nIGVsc2UgaXMgaW1wbGVtZW50ZWRcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImlsbGVnYWwgc2VydmljZSB0eXBlIGluIFwiK3RoaXMucHRyLnRvU3RyaW5nKHRydWUpKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAhKHRoaXMucHRyIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5NZXNzYWdlLk9uZU9mKSAmJiAvLyBOb3QgYnVpbHRcclxuICAgICAgICAgICAgICAgICEodGhpcy5wdHIgaW5zdGFuY2VvZiBQcm90b0J1Zi5SZWZsZWN0LkV4dGVuc2lvbikgJiYgLy8gTm90IGJ1aWx0XHJcbiAgICAgICAgICAgICAgICAhKHRoaXMucHRyIGluc3RhbmNlb2YgUHJvdG9CdWYuUmVmbGVjdC5FbnVtLlZhbHVlKSAvLyBCdWlsdCBpbiBlbnVtXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiaWxsZWdhbCBvYmplY3QgaW4gbmFtZXNwYWNlOiBcIit0eXBlb2YodGhpcy5wdHIpK1wiOiBcIit0aGlzLnB0cik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNldCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkcyB0aGUgcHJvdG9jb2wuIFRoaXMgd2lsbCBmaXJzdCB0cnkgdG8gcmVzb2x2ZSBhbGwgZGVmaW5pdGlvbnMgYW5kLCBpZiB0aGlzIGhhcyBiZWVuIHN1Y2Nlc3NmdWwsXHJcbiAgICAgICAgICogcmV0dXJuIHRoZSBidWlsdCBwYWNrYWdlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7KHN0cmluZ3xBcnJheS48c3RyaW5nPik9fSBwYXRoIFNwZWNpZmllcyB3aGF0IHRvIHJldHVybi4gSWYgb21pdHRlZCwgdGhlIGVudGlyZSBuYW1lc3BhY2Ugd2lsbCBiZSByZXR1cm5lZC5cclxuICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLkJ1aWxkZXIuTWVzc2FnZXwhT2JqZWN0LjxzdHJpbmcsKj59XHJcbiAgICAgICAgICogQHRocm93cyB7RXJyb3J9IElmIGEgdHlwZSBjb3VsZCBub3QgYmUgcmVzb2x2ZWRcclxuICAgICAgICAgKiBAZXhwb3NlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlclByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzb2x2ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVBbGwoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQgPSB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBudWxsOyAvLyBSZXF1aXJlIHJlLWJ1aWxkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3VsdCA9PT0gbnVsbCkgLy8gKFJlLSlCdWlsZFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSB0aGlzLm5zLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIGlmICghcGF0aClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdDtcclxuICAgICAgICAgICAgdmFyIHBhcnQgPSB0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycgPyBwYXRoLnNwbGl0KFwiLlwiKSA6IHBhdGgsXHJcbiAgICAgICAgICAgICAgICBwdHIgPSB0aGlzLnJlc3VsdDsgLy8gQnVpbGQgbmFtZXNwYWNlIHBvaW50ZXIgKG5vIGhhc0NoaWxkIGV0Yy4pXHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYXJ0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHB0cltwYXJ0W2ldXSlcclxuICAgICAgICAgICAgICAgICAgICBwdHIgPSBwdHJbcGFydFtpXV07XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwdHIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHRyO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNpbWlsYXIgdG8ge0BsaW5rIFByb3RvQnVmLkJ1aWxkZXIjYnVpbGR9LCBidXQgbG9va3MgdXAgdGhlIGludGVybmFsIHJlZmxlY3Rpb24gZGVzY3JpcHRvci5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IHBhdGggU3BlY2lmaWVzIHdoYXQgdG8gcmV0dXJuLiBJZiBvbWl0dGVkLCB0aGUgZW50aXJlIG5hbWVzcGFjZSB3aWlsIGJlIHJldHVybmVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IGV4Y2x1ZGVOb25OYW1lc3BhY2UgRXhjbHVkZXMgbm9uLW5hbWVzcGFjZSB0eXBlcyBsaWtlIGZpZWxkcywgZGVmYXVsdHMgdG8gYGZhbHNlYFxyXG4gICAgICAgICAqIEByZXR1cm5zIHs/UHJvdG9CdWYuUmVmbGVjdC5UfSBSZWZsZWN0aW9uIGRlc2NyaXB0b3Igb3IgYG51bGxgIGlmIG5vdCBmb3VuZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXJQcm90b3R5cGUubG9va3VwID0gZnVuY3Rpb24ocGF0aCwgZXhjbHVkZU5vbk5hbWVzcGFjZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aCA/IHRoaXMubnMucmVzb2x2ZShwYXRoLCBleGNsdWRlTm9uTmFtZXNwYWNlKSA6IHRoaXMubnM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFN0cmluZyByZXByZXNlbnRhdGlvbiBhcyBvZiBcIkJ1aWxkZXJcIlxyXG4gICAgICAgICAqIEBleHBvc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyUHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkJ1aWxkZXJcIjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBCYXNlIGNsYXNzZXMgLS0tLS1cclxuICAgICAgICAvLyBFeGlzdCBmb3IgdGhlIHNvbGUgcHVycG9zZSBvZiBiZWluZyBhYmxlIHRvIFwiLi4uIGluc3RhbmNlb2YgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlXCIgZXRjLlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAYWxpYXMgUHJvdG9CdWYuQnVpbGRlci5NZXNzYWdlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgQnVpbGRlci5NZXNzYWdlID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGFsaWFzIFByb3RvQnVmLkJ1aWxkZXIuRW51bVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEJ1aWxkZXIuRW51bSA9IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBhbGlhcyBQcm90b0J1Zi5CdWlsZGVyLk1lc3NhZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBCdWlsZGVyLlNlcnZpY2UgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuICAgICAgICByZXR1cm4gQnVpbGRlcjtcclxuXHJcbiAgICB9KShQcm90b0J1ZiwgUHJvdG9CdWYuTGFuZywgUHJvdG9CdWYuUmVmbGVjdCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAYWxpYXMgUHJvdG9CdWYuTWFwXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLk1hcCA9IChmdW5jdGlvbihQcm90b0J1ZiwgUmVmbGVjdCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IE1hcC4gQSBNYXAgaXMgYSBjb250YWluZXIgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCBtYXBcclxuICAgICAgICAgKiBmaWVsZHMgb24gbWVzc2FnZSBvYmplY3RzLiBJdCBjbG9zZWx5IGZvbGxvd3MgdGhlIEVTNiBNYXAgQVBJOyBob3dldmVyLFxyXG4gICAgICAgICAqIGl0IGlzIGRpc3RpbmN0IGJlY2F1c2Ugd2UgZG8gbm90IHdhbnQgdG8gZGVwZW5kIG9uIGV4dGVybmFsIHBvbHlmaWxscyBvclxyXG4gICAgICAgICAqIG9uIEVTNiBpdHNlbGYuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhwb3J0cyBQcm90b0J1Zi5NYXBcclxuICAgICAgICAgKiBAcGFyYW0geyFQcm90b0J1Zi5SZWZsZWN0LkZpZWxkfSBmaWVsZCBNYXAgZmllbGRcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCo+PX0gY29udGVudHMgSW5pdGlhbCBjb250ZW50c1xyXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBNYXAgPSBmdW5jdGlvbihmaWVsZCwgY29udGVudHMpIHtcclxuICAgICAgICAgICAgaWYgKCFmaWVsZC5tYXApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImZpZWxkIGlzIG5vdCBhIG1hcFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBUaGUgZmllbGQgY29ycmVzcG9uZGluZyB0byB0aGlzIG1hcC5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0LkZpZWxkfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEVsZW1lbnQgaW5zdGFuY2UgY29ycmVzcG9uZGluZyB0byBrZXkgdHlwZS5cclxuICAgICAgICAgICAgICogQHR5cGUgeyFQcm90b0J1Zi5SZWZsZWN0LkVsZW1lbnR9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmtleUVsZW0gPSBuZXcgUmVmbGVjdC5FbGVtZW50KGZpZWxkLmtleVR5cGUsIG51bGwsIHRydWUsIGZpZWxkLnN5bnRheCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRWxlbWVudCBpbnN0YW5jZSBjb3JyZXNwb25kaW5nIHRvIHZhbHVlIHR5cGUuXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshUHJvdG9CdWYuUmVmbGVjdC5FbGVtZW50fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy52YWx1ZUVsZW0gPSBuZXcgUmVmbGVjdC5FbGVtZW50KGZpZWxkLnR5cGUsIGZpZWxkLnJlc29sdmVkVHlwZSwgZmFsc2UsIGZpZWxkLnN5bnRheCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW50ZXJuYWwgbWFwOiBzdG9yZXMgbWFwcGluZyBvZiAoc3RyaW5nIGZvcm0gb2Yga2V5KSAtPiAoa2V5LCB2YWx1ZSlcclxuICAgICAgICAgICAgICogcGFpci5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogV2UgcHJvdmlkZSBtYXAgc2VtYW50aWNzIGZvciBhcmJpdHJhcnkga2V5IHR5cGVzLCBidXQgd2UgYnVpbGQgb24gdG9wXHJcbiAgICAgICAgICAgICAqIG9mIGFuIE9iamVjdCwgd2hpY2ggaGFzIG9ubHkgc3RyaW5nIGtleXMuIEluIG9yZGVyIHRvIGF2b2lkIHRoZSBuZWVkXHJcbiAgICAgICAgICAgICAqIHRvIGNvbnZlcnQgYSBzdHJpbmcga2V5IGJhY2sgdG8gaXRzIG5hdGl2ZSB0eXBlIGluIG1hbnkgc2l0dWF0aW9ucyxcclxuICAgICAgICAgICAgICogd2Ugc3RvcmUgdGhlIG5hdGl2ZSBrZXkgdmFsdWUgYWxvbmdzaWRlIHRoZSB2YWx1ZS4gVGh1cywgd2Ugb25seSBuZWVkXHJcbiAgICAgICAgICAgICAqIGEgb25lLXdheSBtYXBwaW5nIGZyb20gYSBrZXkgdHlwZSB0byBpdHMgc3RyaW5nIGZvcm0gdGhhdCBndWFyYW50ZWVzXHJcbiAgICAgICAgICAgICAqIHVuaXF1ZW5lc3MgYW5kIGVxdWFsaXR5IChpLmUuLCBzdHIoSzEpID09PSBzdHIoSzIpIGlmIGFuZCBvbmx5IGlmIEsxXHJcbiAgICAgICAgICAgICAqID09PSBLMikuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEB0eXBlIHshT2JqZWN0PHN0cmluZywge2tleTogKiwgdmFsdWU6ICp9Pn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMubWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBtYXAuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJzaXplXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm1hcCkubGVuZ3RoOyB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gRmlsbCBpbml0aWFsIGNvbnRlbnRzIGZyb20gYSByYXcgb2JqZWN0LlxyXG4gICAgICAgICAgICBpZiAoY29udGVudHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHRoaXMua2V5RWxlbS52YWx1ZUZyb21TdHJpbmcoa2V5c1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWVFbGVtLnZlcmlmeVZhbHVlKGNvbnRlbnRzW2tleXNbaV1dKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcFt0aGlzLmtleUVsZW0udmFsdWVUb1N0cmluZyhrZXkpXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsga2V5OiBrZXksIHZhbHVlOiB2YWwgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBNYXBQcm90b3R5cGUgPSBNYXAucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIZWxwZXI6IHJldHVybiBhbiBpdGVyYXRvciBvdmVyIGFuIGFycmF5LlxyXG4gICAgICAgICAqIEBwYXJhbSB7IUFycmF5PCo+fSBhcnIgdGhlIGFycmF5XHJcbiAgICAgICAgICogQHJldHVybnMgeyFPYmplY3R9IGFuIGl0ZXJhdG9yXHJcbiAgICAgICAgICogQGlubmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gYXJyYXlJdGVyYXRvcihhcnIpIHtcclxuICAgICAgICAgICAgdmFyIGlkeCA9IDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4IDwgYXJyLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBhcnJbaWR4KytdIH07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDbGVhcnMgdGhlIG1hcC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBNYXBQcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXAgPSB7fTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZWxldGVzIGEgcGFydGljdWxhciBrZXkgZnJvbSB0aGUgbWFwLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIGFueSBlbnRyeSB3aXRoIHRoaXMga2V5IHdhcyBkZWxldGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZVtcImRlbGV0ZVwiXSA9IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICB2YXIga2V5VmFsdWUgPSB0aGlzLmtleUVsZW0udmFsdWVUb1N0cmluZyh0aGlzLmtleUVsZW0udmVyaWZ5VmFsdWUoa2V5KSk7XHJcbiAgICAgICAgICAgIHZhciBoYWRLZXkgPSBrZXlWYWx1ZSBpbiB0aGlzLm1hcDtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMubWFwW2tleVZhbHVlXTtcclxuICAgICAgICAgICAgcmV0dXJuIGhhZEtleTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIG92ZXIgW2tleSwgdmFsdWVdIHBhaXJzIGluIHRoZSBtYXAuXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGl0ZXJhdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGVudHJpZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHN0cktleXMgPSBPYmplY3Qua2V5cyh0aGlzLm1hcCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBlbnRyeTsgaSA8IHN0cktleXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goWyhlbnRyeT10aGlzLm1hcFtzdHJLZXlzW2ldXSkua2V5LCBlbnRyeS52YWx1ZV0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlJdGVyYXRvcihlbnRyaWVzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIGFuIGl0ZXJhdG9yIG92ZXIga2V5cyBpbiB0aGUgbWFwLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBpdGVyYXRvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlzID0gW107XHJcbiAgICAgICAgICAgIHZhciBzdHJLZXlzID0gT2JqZWN0LmtleXModGhpcy5tYXApO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cktleXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2godGhpcy5tYXBbc3RyS2V5c1tpXV0ua2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5SXRlcmF0b3Ioa2V5cyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmV0dXJucyBhbiBpdGVyYXRvciBvdmVyIHZhbHVlcyBpbiB0aGUgbWFwLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHshT2JqZWN0fSBUaGUgaXRlcmF0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICBNYXBQcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHN0cktleXMgPSBPYmplY3Qua2V5cyh0aGlzLm1hcCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyS2V5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRoaXMubWFwW3N0cktleXNbaV1dLnZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5SXRlcmF0b3IodmFsdWVzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVyYXRlcyBvdmVyIGVudHJpZXMgaW4gdGhlIG1hcCwgY2FsbGluZyBhIGZ1bmN0aW9uIG9uIGVhY2guXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbih0aGlzOiosICosICosICopfSBjYiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIHdpdGggdmFsdWUsIGtleSwgYW5kIG1hcCBhcmd1bWVudHMuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSB0aGlzQXJnIFRoZSBgdGhpc2AgdmFsdWUgZm9yIHRoZSBjYWxsYmFja1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2IsIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgdmFyIHN0cktleXMgPSBPYmplY3Qua2V5cyh0aGlzLm1hcCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBlbnRyeTsgaSA8IHN0cktleXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBjYi5jYWxsKHRoaXNBcmcsIChlbnRyeT10aGlzLm1hcFtzdHJLZXlzW2ldXSkudmFsdWUsIGVudHJ5LmtleSwgdGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0cyBhIGtleSBpbiB0aGUgbWFwIHRvIHRoZSBnaXZlbiB2YWx1ZS5cclxuICAgICAgICAgKiBAcGFyYW0geyp9IGtleSBUaGUga2V5XHJcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWVcclxuICAgICAgICAgKiBAcmV0dXJucyB7IVByb3RvQnVmLk1hcH0gVGhlIG1hcCBpbnN0YW5jZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IHRoaXMua2V5RWxlbS52ZXJpZnlWYWx1ZShrZXkpO1xyXG4gICAgICAgICAgICB2YXIgdmFsVmFsdWUgPSB0aGlzLnZhbHVlRWxlbS52ZXJpZnlWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMubWFwW3RoaXMua2V5RWxlbS52YWx1ZVRvU3RyaW5nKGtleVZhbHVlKV0gPVxyXG4gICAgICAgICAgICAgICAgeyBrZXk6IGtleVZhbHVlLCB2YWx1ZTogdmFsVmFsdWUgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgdmFsdWUgY29ycmVzcG9uZGluZyB0byBhIGtleSBpbiB0aGUgbWFwLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXlcclxuICAgICAgICAgKiBAcmV0dXJucyB7Knx1bmRlZmluZWR9IFRoZSB2YWx1ZSwgb3IgYHVuZGVmaW5lZGAgaWYga2V5IG5vdCBwcmVzZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgTWFwUHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICB2YXIga2V5VmFsdWUgPSB0aGlzLmtleUVsZW0udmFsdWVUb1N0cmluZyh0aGlzLmtleUVsZW0udmVyaWZ5VmFsdWUoa2V5KSk7XHJcbiAgICAgICAgICAgIGlmICghKGtleVZhbHVlIGluIHRoaXMubWFwKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFtrZXlWYWx1ZV0udmFsdWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBnaXZlbiBrZXkgaXMgcHJlc2VudCBpbiB0aGUgbWFwLlxyXG4gICAgICAgICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXlcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBrZXkgaXMgcHJlc2VudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1hcFByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICAgICAgdmFyIGtleVZhbHVlID0gdGhpcy5rZXlFbGVtLnZhbHVlVG9TdHJpbmcodGhpcy5rZXlFbGVtLnZlcmlmeVZhbHVlKGtleSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGtleVZhbHVlIGluIHRoaXMubWFwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gTWFwO1xyXG4gICAgfSkoUHJvdG9CdWYsIFByb3RvQnVmLlJlZmxlY3QpO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgLnByb3RvIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgQnVpbGRlci5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm90byAucHJvdG8gZmlsZSBjb250ZW50c1xyXG4gICAgICogQHBhcmFtIHsoUHJvdG9CdWYuQnVpbGRlcnxzdHJpbmd8e3Jvb3Q6IHN0cmluZywgZmlsZTogc3RyaW5nfSk9fSBidWlsZGVyIEJ1aWxkZXIgdG8gYXBwZW5kIHRvLiBXaWxsIGNyZWF0ZSBhIG5ldyBvbmUgaWYgb21pdHRlZC5cclxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3x7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9KT19IGZpbGVuYW1lIFRoZSBjb3JyZXNwb25kaW5nIGZpbGUgbmFtZSBpZiBrbm93bi4gTXVzdCBiZSBzcGVjaWZpZWQgZm9yIGltcG9ydHMuXHJcbiAgICAgKiBAcmV0dXJuIHtQcm90b0J1Zi5CdWlsZGVyfSBCdWlsZGVyIHRvIGNyZWF0ZSBuZXcgbWVzc2FnZXNcclxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgZGVmaW5pdGlvbiBjYW5ub3QgYmUgcGFyc2VkIG9yIGJ1aWx0XHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLmxvYWRQcm90byA9IGZ1bmN0aW9uKHByb3RvLCBidWlsZGVyLCBmaWxlbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYnVpbGRlciA9PT0gJ3N0cmluZycgfHwgKGJ1aWxkZXIgJiYgdHlwZW9mIGJ1aWxkZXJbXCJmaWxlXCJdID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYnVpbGRlcltcInJvb3RcIl0gPT09ICdzdHJpbmcnKSlcclxuICAgICAgICAgICAgZmlsZW5hbWUgPSBidWlsZGVyLFxyXG4gICAgICAgICAgICBidWlsZGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBQcm90b0J1Zi5sb2FkSnNvbihQcm90b0J1Zi5Eb3RQcm90by5QYXJzZXIucGFyc2UocHJvdG8pLCBidWlsZGVyLCBmaWxlbmFtZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSAucHJvdG8gc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBCdWlsZGVyLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBQcm90b0J1Zi5sb2FkUHJvdG99LlxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvdG8gLnByb3RvIGZpbGUgY29udGVudHNcclxuICAgICAqIEBwYXJhbSB7KFByb3RvQnVmLkJ1aWxkZXJ8c3RyaW5nKT19IGJ1aWxkZXIgQnVpbGRlciB0byBhcHBlbmQgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBpZiBvbWl0dGVkLlxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfHtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ30pPX0gZmlsZW5hbWUgVGhlIGNvcnJlc3BvbmRpbmcgZmlsZSBuYW1lIGlmIGtub3duLiBNdXN0IGJlIHNwZWNpZmllZCBmb3IgaW1wb3J0cy5cclxuICAgICAqIEByZXR1cm4ge1Byb3RvQnVmLkJ1aWxkZXJ9IEJ1aWxkZXIgdG8gY3JlYXRlIG5ldyBtZXNzYWdlc1xyXG4gICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkZWZpbml0aW9uIGNhbm5vdCBiZSBwYXJzZWQgb3IgYnVpbHRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYucHJvdG9Gcm9tU3RyaW5nID0gUHJvdG9CdWYubG9hZFByb3RvOyAvLyBMZWdhY3lcclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgLnByb3RvIGZpbGUgYW5kIHJldHVybnMgdGhlIEJ1aWxkZXIuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3x7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9fSBmaWxlbmFtZSBQYXRoIHRvIHByb3RvIGZpbGUgb3IgYW4gb2JqZWN0IHNwZWNpZnlpbmcgJ2ZpbGUnIHdpdGhcclxuICAgICAqICBhbiBvdmVycmlkZGVuICdyb290JyBwYXRoIGZvciBhbGwgaW1wb3J0ZWQgZmlsZXMuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKD9FcnJvciwgIVByb3RvQnVmLkJ1aWxkZXI9KT19IGNhbGxiYWNrIENhbGxiYWNrIHRoYXQgd2lsbCByZWNlaXZlIGBudWxsYCBhcyB0aGUgZmlyc3QgYW5kXHJcbiAgICAgKiAgdGhlIEJ1aWxkZXIgYXMgaXRzIHNlY29uZCBhcmd1bWVudCBvbiBzdWNjZXNzLCBvdGhlcndpc2UgdGhlIGVycm9yIGFzIGl0cyBmaXJzdCBhcmd1bWVudC4gSWYgb21pdHRlZCwgdGhlXHJcbiAgICAgKiAgZmlsZSB3aWxsIGJlIHJlYWQgc3luY2hyb25vdXNseSBhbmQgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgQnVpbGRlci5cclxuICAgICAqIEBwYXJhbSB7UHJvdG9CdWYuQnVpbGRlcj19IGJ1aWxkZXIgQnVpbGRlciB0byBhcHBlbmQgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBpZiBvbWl0dGVkLlxyXG4gICAgICogQHJldHVybiB7P1Byb3RvQnVmLkJ1aWxkZXJ8dW5kZWZpbmVkfSBUaGUgQnVpbGRlciBpZiBzeW5jaHJvbm91cyAobm8gY2FsbGJhY2sgc3BlY2lmaWVkLCB3aWxsIGJlIE5VTEwgaWYgdGhlXHJcbiAgICAgKiAgIHJlcXVlc3QgaGFzIGZhaWxlZCksIGVsc2UgdW5kZWZpbmVkXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLmxvYWRQcm90b0ZpbGUgPSBmdW5jdGlvbihmaWxlbmFtZSwgY2FsbGJhY2ssIGJ1aWxkZXIpIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2sgJiYgdHlwZW9mIGNhbGxiYWNrID09PSAnb2JqZWN0JylcclxuICAgICAgICAgICAgYnVpbGRlciA9IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBjYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgZWxzZSBpZiAoIWNhbGxiYWNrIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgcmV0dXJuIFByb3RvQnVmLlV0aWwuZmV0Y2godHlwZW9mIGZpbGVuYW1lID09PSAnc3RyaW5nJyA/IGZpbGVuYW1lIDogZmlsZW5hbWVbXCJyb290XCJdK1wiL1wiK2ZpbGVuYW1lW1wiZmlsZVwiXSwgZnVuY3Rpb24oY29udGVudHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZW50cyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKEVycm9yKFwiRmFpbGVkIHRvIGZldGNoIGZpbGVcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgUHJvdG9CdWYubG9hZFByb3RvKGNvbnRlbnRzLCBidWlsZGVyLCBmaWxlbmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY29udGVudHMgPSBQcm90b0J1Zi5VdGlsLmZldGNoKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ29iamVjdCcgPyBmaWxlbmFtZVtcInJvb3RcIl0rXCIvXCIrZmlsZW5hbWVbXCJmaWxlXCJdIDogZmlsZW5hbWUpO1xyXG4gICAgICAgIHJldHVybiBjb250ZW50cyA9PT0gbnVsbCA/IG51bGwgOiBQcm90b0J1Zi5sb2FkUHJvdG8oY29udGVudHMsIGJ1aWxkZXIsIGZpbGVuYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkcyBhIC5wcm90byBmaWxlIGFuZCByZXR1cm5zIHRoZSBCdWlsZGVyLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBQcm90b0J1Zi5sb2FkUHJvdG9GaWxlfS5cclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8e3Jvb3Q6IHN0cmluZywgZmlsZTogc3RyaW5nfX0gZmlsZW5hbWUgUGF0aCB0byBwcm90byBmaWxlIG9yIGFuIG9iamVjdCBzcGVjaWZ5aW5nICdmaWxlJyB3aXRoXHJcbiAgICAgKiAgYW4gb3ZlcnJpZGRlbiAncm9vdCcgcGF0aCBmb3IgYWxsIGltcG9ydGVkIGZpbGVzLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbig/RXJyb3IsICFQcm90b0J1Zi5CdWlsZGVyPSk9fSBjYWxsYmFjayBDYWxsYmFjayB0aGF0IHdpbGwgcmVjZWl2ZSBgbnVsbGAgYXMgdGhlIGZpcnN0IGFuZFxyXG4gICAgICogIHRoZSBCdWlsZGVyIGFzIGl0cyBzZWNvbmQgYXJndW1lbnQgb24gc3VjY2Vzcywgb3RoZXJ3aXNlIHRoZSBlcnJvciBhcyBpdHMgZmlyc3QgYXJndW1lbnQuIElmIG9taXR0ZWQsIHRoZVxyXG4gICAgICogIGZpbGUgd2lsbCBiZSByZWFkIHN5bmNocm9ub3VzbHkgYW5kIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIEJ1aWxkZXIuXHJcbiAgICAgKiBAcGFyYW0ge1Byb3RvQnVmLkJ1aWxkZXI9fSBidWlsZGVyIEJ1aWxkZXIgdG8gYXBwZW5kIHRvLiBXaWxsIGNyZWF0ZSBhIG5ldyBvbmUgaWYgb21pdHRlZC5cclxuICAgICAqIEByZXR1cm4geyFQcm90b0J1Zi5CdWlsZGVyfHVuZGVmaW5lZH0gVGhlIEJ1aWxkZXIgaWYgc3luY2hyb25vdXMgKG5vIGNhbGxiYWNrIHNwZWNpZmllZCwgd2lsbCBiZSBOVUxMIGlmIHRoZVxyXG4gICAgICogICByZXF1ZXN0IGhhcyBmYWlsZWQpLCBlbHNlIHVuZGVmaW5lZFxyXG4gICAgICogQGV4cG9zZVxyXG4gICAgICovXHJcbiAgICBQcm90b0J1Zi5wcm90b0Zyb21GaWxlID0gUHJvdG9CdWYubG9hZFByb3RvRmlsZTsgLy8gTGVnYWN5XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBlbXB0eSBCdWlsZGVyLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywqPj19IG9wdGlvbnMgQnVpbGRlciBvcHRpb25zLCBkZWZhdWx0cyB0byBnbG9iYWwgb3B0aW9ucyBzZXQgb24gUHJvdG9CdWZcclxuICAgICAqIEByZXR1cm4geyFQcm90b0J1Zi5CdWlsZGVyfSBCdWlsZGVyXHJcbiAgICAgKiBAZXhwb3NlXHJcbiAgICAgKi9cclxuICAgIFByb3RvQnVmLm5ld0J1aWxkZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zWydjb252ZXJ0RmllbGRzVG9DYW1lbENhc2UnXSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIG9wdGlvbnNbJ2NvbnZlcnRGaWVsZHNUb0NhbWVsQ2FzZSddID0gUHJvdG9CdWYuY29udmVydEZpZWxkc1RvQ2FtZWxDYXNlO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1sncG9wdWxhdGVBY2Nlc3NvcnMnXSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIG9wdGlvbnNbJ3BvcHVsYXRlQWNjZXNzb3JzJ10gPSBQcm90b0J1Zi5wb3B1bGF0ZUFjY2Vzc29ycztcclxuICAgICAgICByZXR1cm4gbmV3IFByb3RvQnVmLkJ1aWxkZXIob3B0aW9ucyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZHMgYSAuanNvbiBkZWZpbml0aW9uIGFuZCByZXR1cm5zIHRoZSBCdWlsZGVyLlxyXG4gICAgICogQHBhcmFtIHshKnxzdHJpbmd9IGpzb24gSlNPTiBkZWZpbml0aW9uXHJcbiAgICAgKiBAcGFyYW0geyhQcm90b0J1Zi5CdWlsZGVyfHN0cmluZ3x7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9KT19IGJ1aWxkZXIgQnVpbGRlciB0byBhcHBlbmQgdG8uIFdpbGwgY3JlYXRlIGEgbmV3IG9uZSBpZiBvbWl0dGVkLlxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfHtyb290OiBzdHJpbmcsIGZpbGU6IHN0cmluZ30pPX0gZmlsZW5hbWUgVGhlIGNvcnJlc3BvbmRpbmcgZmlsZSBuYW1lIGlmIGtub3duLiBNdXN0IGJlIHNwZWNpZmllZCBmb3IgaW1wb3J0cy5cclxuICAgICAqIEByZXR1cm4ge1Byb3RvQnVmLkJ1aWxkZXJ9IEJ1aWxkZXIgdG8gY3JlYXRlIG5ldyBtZXNzYWdlc1xyXG4gICAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkZWZpbml0aW9uIGNhbm5vdCBiZSBwYXJzZWQgb3IgYnVpbHRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYubG9hZEpzb24gPSBmdW5jdGlvbihqc29uLCBidWlsZGVyLCBmaWxlbmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYnVpbGRlciA9PT0gJ3N0cmluZycgfHwgKGJ1aWxkZXIgJiYgdHlwZW9mIGJ1aWxkZXJbXCJmaWxlXCJdID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYnVpbGRlcltcInJvb3RcIl0gPT09ICdzdHJpbmcnKSlcclxuICAgICAgICAgICAgZmlsZW5hbWUgPSBidWlsZGVyLFxyXG4gICAgICAgICAgICBidWlsZGVyID0gbnVsbDtcclxuICAgICAgICBpZiAoIWJ1aWxkZXIgfHwgdHlwZW9mIGJ1aWxkZXIgIT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICBidWlsZGVyID0gUHJvdG9CdWYubmV3QnVpbGRlcigpO1xyXG4gICAgICAgIGlmICh0eXBlb2YganNvbiA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgIGJ1aWxkZXJbXCJpbXBvcnRcIl0oanNvbiwgZmlsZW5hbWUpO1xyXG4gICAgICAgIGJ1aWxkZXIucmVzb2x2ZUFsbCgpO1xyXG4gICAgICAgIHJldHVybiBidWlsZGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWRzIGEgLmpzb24gZmlsZSBhbmQgcmV0dXJucyB0aGUgQnVpbGRlci5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfCF7cm9vdDogc3RyaW5nLCBmaWxlOiBzdHJpbmd9fSBmaWxlbmFtZSBQYXRoIHRvIGpzb24gZmlsZSBvciBhbiBvYmplY3Qgc3BlY2lmeWluZyAnZmlsZScgd2l0aFxyXG4gICAgICogIGFuIG92ZXJyaWRkZW4gJ3Jvb3QnIHBhdGggZm9yIGFsbCBpbXBvcnRlZCBmaWxlcy5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oP0Vycm9yLCAhUHJvdG9CdWYuQnVpbGRlcj0pPX0gY2FsbGJhY2sgQ2FsbGJhY2sgdGhhdCB3aWxsIHJlY2VpdmUgYG51bGxgIGFzIHRoZSBmaXJzdCBhbmRcclxuICAgICAqICB0aGUgQnVpbGRlciBhcyBpdHMgc2Vjb25kIGFyZ3VtZW50IG9uIHN1Y2Nlc3MsIG90aGVyd2lzZSB0aGUgZXJyb3IgYXMgaXRzIGZpcnN0IGFyZ3VtZW50LiBJZiBvbWl0dGVkLCB0aGVcclxuICAgICAqICBmaWxlIHdpbGwgYmUgcmVhZCBzeW5jaHJvbm91c2x5IGFuZCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBCdWlsZGVyLlxyXG4gICAgICogQHBhcmFtIHtQcm90b0J1Zi5CdWlsZGVyPX0gYnVpbGRlciBCdWlsZGVyIHRvIGFwcGVuZCB0by4gV2lsbCBjcmVhdGUgYSBuZXcgb25lIGlmIG9taXR0ZWQuXHJcbiAgICAgKiBAcmV0dXJuIHs/UHJvdG9CdWYuQnVpbGRlcnx1bmRlZmluZWR9IFRoZSBCdWlsZGVyIGlmIHN5bmNocm9ub3VzIChubyBjYWxsYmFjayBzcGVjaWZpZWQsIHdpbGwgYmUgTlVMTCBpZiB0aGVcclxuICAgICAqICAgcmVxdWVzdCBoYXMgZmFpbGVkKSwgZWxzZSB1bmRlZmluZWRcclxuICAgICAqIEBleHBvc2VcclxuICAgICAqL1xyXG4gICAgUHJvdG9CdWYubG9hZEpzb25GaWxlID0gZnVuY3Rpb24oZmlsZW5hbWUsIGNhbGxiYWNrLCBidWlsZGVyKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgIGJ1aWxkZXIgPSBjYWxsYmFjayxcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIGVsc2UgaWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICBpZiAoY2FsbGJhY2spXHJcbiAgICAgICAgICAgIHJldHVybiBQcm90b0J1Zi5VdGlsLmZldGNoKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ3N0cmluZycgPyBmaWxlbmFtZSA6IGZpbGVuYW1lW1wicm9vdFwiXStcIi9cIitmaWxlbmFtZVtcImZpbGVcIl0sIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGVudHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhFcnJvcihcIkZhaWxlZCB0byBmZXRjaCBmaWxlXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIFByb3RvQnVmLmxvYWRKc29uKEpTT04ucGFyc2UoY29udGVudHMpLCBidWlsZGVyLCBmaWxlbmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB2YXIgY29udGVudHMgPSBQcm90b0J1Zi5VdGlsLmZldGNoKHR5cGVvZiBmaWxlbmFtZSA9PT0gJ29iamVjdCcgPyBmaWxlbmFtZVtcInJvb3RcIl0rXCIvXCIrZmlsZW5hbWVbXCJmaWxlXCJdIDogZmlsZW5hbWUpO1xyXG4gICAgICAgIHJldHVybiBjb250ZW50cyA9PT0gbnVsbCA/IG51bGwgOiBQcm90b0J1Zi5sb2FkSnNvbihKU09OLnBhcnNlKGNvbnRlbnRzKSwgYnVpbGRlciwgZmlsZW5hbWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gUHJvdG9CdWY7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9