/*!
   This file is part of ColorZilla
  
   Written by Alex Sirota (alex @ iosart.com)
  
   Copyright (c) iosart labs llc 2011, All Rights Reserved
   
   Please do not use without permission
*/
!function(){document.body.hasAttribute("cz-shortcut-listen")||(document.body.setAttribute("cz-shortcut-listen","true"),document.body.addEventListener("keydown",function(a){var b=navigator.userAgent.toLowerCase().indexOf("mac")>-1,c=a.keyCode;(a.ctrlKey&&a.altKey&&!b||a.metaKey&&a.altKey&&b)&&c>64&&91>c&&chrome.extension.sendRequest({"op":"hotkey-pressed","keyCode":c})},!1))}();

!function(t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}(this, function() {
    function t() {}
    var e = t.prototype;
    return e.on = function(t, e) {
        if (t && e) {
            var i = this._events = this._events || {}
              , n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e),
            this
        }
    }
    ,
    e.once = function(t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {}
              , n = i[t] = i[t] || [];
            return n[e] = !0,
            this
        }
    }
    ,
    e.off = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1),
            this
        }
    }
    ,
    e.emitEvent = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = 0
              , r = i[n];
            e = e || [];
            for (var s = this._onceEvents && this._onceEvents[t]; r; ) {
                var o = s && s[r];
                o && (this.off(t, r),
                delete s[r]),
                r.apply(this, e),
                n += o ? 0 : 1,
                r = i[n]
            }
            return this
        }
    }
    ,
    t
}),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter")) : t.imagesLoaded = e(t, t.EvEmitter)
}(window, function(t, e) {
    function i(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    function n(t) {
        var e = [];
        if (Array.isArray(t))
            e = t;
        else if ("number" == typeof t.length)
            for (var i = 0; i < t.length; i++)
                e.push(t[i]);
        else
            e.push(t);
        return e
    }
    function r(t, e, s) {
        return this instanceof r ? ("string" == typeof t && (t = document.querySelectorAll(t)),
        this.elements = n(t),
        this.options = i({}, this.options),
        "function" == typeof e ? s = e : i(this.options, e),
        s && this.on("always", s),
        this.getImages(),
        a && (this.jqDeferred = new a.Deferred),
        void setTimeout(function() {
            this.check()
        }
        .bind(this))) : new r(t,e,s)
    }
    function s(t) {
        this.img = t
    }
    function o(t, e) {
        this.url = t,
        this.element = e,
        this.img = new Image
    }
    var a = t.jQuery
      , l = t.console;
    r.prototype = Object.create(e.prototype),
    r.prototype.options = {},
    r.prototype.getImages = function() {
        this.images = [],
        this.elements.forEach(this.addElementImages, this)
    }
    ,
    r.prototype.addElementImages = function(t) {
        "IMG" == t.nodeName && this.addImage(t),
        this.options.background === !0 && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && h[e]) {
            for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var r = i[n];
                this.addImage(r)
            }
            if ("string" == typeof this.options.background) {
                var s = t.querySelectorAll(this.options.background);
                for (n = 0; n < s.length; n++) {
                    var o = s[n];
                    this.addElementBackgroundImages(o)
                }
            }
        }
    }
    ;
    var h = {
        1: !0,
        9: !0,
        11: !0
    };
    return r.prototype.addElementBackgroundImages = function(t) {
        var e = getComputedStyle(t);
        if (e)
            for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n; ) {
                var r = n && n[2];
                r && this.addBackground(r, t),
                n = i.exec(e.backgroundImage)
            }
    }
    ,
    r.prototype.addImage = function(t) {
        var e = new s(t);
        this.images.push(e)
    }
    ,
    r.prototype.addBackground = function(t, e) {
        var i = new o(t,e);
        this.images.push(i)
    }
    ,
    r.prototype.check = function() {
        function t(t, i, n) {
            setTimeout(function() {
                e.progress(t, i, n)
            })
        }
        var e = this;
        return this.progressedCount = 0,
        this.hasAnyBroken = !1,
        this.images.length ? void this.images.forEach(function(e) {
            e.once("progress", t),
            e.check()
        }) : void this.complete()
    }
    ,
    r.prototype.progress = function(t, e, i) {
        this.progressedCount++,
        this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded,
        this.emitEvent("progress", [this, t, e]),
        this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t),
        this.progressedCount == this.images.length && this.complete(),
        this.options.debug && l && l.log("progress: " + i, t, e)
    }
    ,
    r.prototype.complete = function() {
        var t = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0,
        this.emitEvent(t, [this]),
        this.emitEvent("always", [this]),
        this.jqDeferred) {
            var e = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[e](this)
        }
    }
    ,
    s.prototype = Object.create(e.prototype),
    s.prototype.check = function() {
        var t = this.getIsImageComplete();
        return t ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image,
        this.proxyImage.addEventListener("load", this),
        this.proxyImage.addEventListener("error", this),
        this.img.addEventListener("load", this),
        this.img.addEventListener("error", this),
        void (this.proxyImage.src = this.img.src))
    }
    ,
    s.prototype.getIsImageComplete = function() {
        return this.img.complete && void 0 !== this.img.naturalWidth
    }
    ,
    s.prototype.confirm = function(t, e) {
        this.isLoaded = t,
        this.emitEvent("progress", [this, this.img, e])
    }
    ,
    s.prototype.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }
    ,
    s.prototype.onload = function() {
        this.confirm(!0, "onload"),
        this.unbindEvents()
    }
    ,
    s.prototype.onerror = function() {
        this.confirm(!1, "onerror"),
        this.unbindEvents()
    }
    ,
    s.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this),
        this.proxyImage.removeEventListener("error", this),
        this.img.removeEventListener("load", this),
        this.img.removeEventListener("error", this)
    }
    ,
    o.prototype = Object.create(s.prototype),
    o.prototype.check = function() {
        this.img.addEventListener("load", this),
        this.img.addEventListener("error", this),
        this.img.src = this.url;
        var t = this.getIsImageComplete();
        t && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
        this.unbindEvents())
    }
    ,
    o.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this),
        this.img.removeEventListener("error", this)
    }
    ,
    o.prototype.confirm = function(t, e) {
        this.isLoaded = t,
        this.emitEvent("progress", [this, this.element, e])
    }
    ,
    r.makeJQueryPlugin = function(e) {
        e = e || t.jQuery,
        e && (a = e,
        a.fn.imagesLoaded = function(t, e) {
            var i = new r(this,t,e);
            return i.jqDeferred.promise(a(this))
        }
        )
    }
    ,
    r.makeJQueryPlugin(),
    r
}),
!function(t) {
    function e() {}
    function i(t) {
        function i(e) {
            e.prototype.option || (e.prototype.option = function(e) {
                t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
            }
            )
        }
        function r(e, i) {
            t.fn[e] = function(r) {
                if ("string" == typeof r) {
                    for (var o = n.call(arguments, 1), a = 0, l = this.length; l > a; a++) {
                        var h = this[a]
                          , u = t.data(h, e);
                        if (u)
                            if (t.isFunction(u[r]) && "_" !== r.charAt(0)) {
                                var c = u[r].apply(u, o);
                                if (void 0 !== c)
                                    return c
                            } else
                                s("no such method '" + r + "' for " + e + " instance");
                        else
                            s("cannot call methods on " + e + " prior to initialization; attempted to call '" + r + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var n = t.data(this, e);
                    n ? (n.option(r),
                    n._init()) : (n = new i(this,r),
                    t.data(this, e, n))
                })
            }
        }
        if (t) {
            var s = "undefined" == typeof console ? e : function(t) {
                console.error(t)
            }
            ;
            return t.bridget = function(t, e) {
                i(e),
                r(t, e)
            }
            ,
            t.bridget
        }
    }
    var n = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], i) : i("object" == typeof exports ? require("jquery") : t.jQuery)
}(window),
function(t) {
    function e(e) {
        var i = t.event;
        return i.target = i.target || i.srcElement || e,
        i
    }
    var i = document.documentElement
      , n = function() {};
    i.addEventListener ? n = function(t, e, i) {
        t.addEventListener(e, i, !1)
    }
    : i.attachEvent && (n = function(t, i, n) {
        t[i + n] = n.handleEvent ? function() {
            var i = e(t);
            n.handleEvent.call(n, i)
        }
        : function() {
            var i = e(t);
            n.call(t, i)
        }
        ,
        t.attachEvent("on" + i, t[i + n])
    }
    );
    var r = function() {};
    i.removeEventListener ? r = function(t, e, i) {
        t.removeEventListener(e, i, !1)
    }
    : i.detachEvent && (r = function(t, e, i) {
        t.detachEvent("on" + e, t[e + i]);
        try {
            delete t[e + i]
        } catch (n) {
            t[e + i] = void 0
        }
    }
    );
    var s = {
        bind: n,
        unbind: r
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", s) : "object" == typeof exports ? module.exports = s : t.eventie = s
}(window),
function() {
    function t() {}
    function e(t, e) {
        for (var i = t.length; i--; )
            if (t[i].listener === e)
                return i;
        return -1
    }
    function i(t) {
        return function() {
            return this[t].apply(this, arguments)
        }
    }
    var n = t.prototype
      , r = this
      , s = r.EventEmitter;
    n.getListeners = function(t) {
        var e, i, n = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (i in n)
                n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i])
        } else
            e = n[t] || (n[t] = []);
        return e
    }
    ,
    n.flattenListeners = function(t) {
        var e, i = [];
        for (e = 0; e < t.length; e += 1)
            i.push(t[e].listener);
        return i
    }
    ,
    n.getListenersAsObject = function(t) {
        var e, i = this.getListeners(t);
        return i instanceof Array && (e = {},
        e[t] = i),
        e || i
    }
    ,
    n.addListener = function(t, i) {
        var n, r = this.getListenersAsObject(t), s = "object" == typeof i;
        for (n in r)
            r.hasOwnProperty(n) && -1 === e(r[n], i) && r[n].push(s ? i : {
                listener: i,
                once: !1
            });
        return this
    }
    ,
    n.on = i("addListener"),
    n.addOnceListener = function(t, e) {
        return this.addListener(t, {
            listener: e,
            once: !0
        })
    }
    ,
    n.once = i("addOnceListener"),
    n.defineEvent = function(t) {
        return this.getListeners(t),
        this
    }
    ,
    n.defineEvents = function(t) {
        for (var e = 0; e < t.length; e += 1)
            this.defineEvent(t[e]);
        return this
    }
    ,
    n.removeListener = function(t, i) {
        var n, r, s = this.getListenersAsObject(t);
        for (r in s)
            s.hasOwnProperty(r) && (n = e(s[r], i),
            -1 !== n && s[r].splice(n, 1));
        return this
    }
    ,
    n.off = i("removeListener"),
    n.addListeners = function(t, e) {
        return this.manipulateListeners(!1, t, e)
    }
    ,
    n.removeListeners = function(t, e) {
        return this.manipulateListeners(!0, t, e)
    }
    ,
    n.manipulateListeners = function(t, e, i) {
        var n, r, s = t ? this.removeListener : this.addListener, o = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (n = i.length; n--; )
                s.call(this, e, i[n]);
        else
            for (n in e)
                e.hasOwnProperty(n) && (r = e[n]) && ("function" == typeof r ? s.call(this, n, r) : o.call(this, n, r));
        return this
    }
    ,
    n.removeEvent = function(t) {
        var e, i = typeof t, n = this._getEvents();
        if ("string" === i)
            delete n[t];
        else if (t instanceof RegExp)
            for (e in n)
                n.hasOwnProperty(e) && t.test(e) && delete n[e];
        else
            delete this._events;
        return this
    }
    ,
    n.removeAllListeners = i("removeEvent"),
    n.emitEvent = function(t, e) {
        var i, n, r, s, o = this.getListenersAsObject(t);
        for (r in o)
            if (o.hasOwnProperty(r))
                for (n = o[r].length; n--; )
                    i = o[r][n],
                    i.once === !0 && this.removeListener(t, i.listener),
                    s = i.listener.apply(this, e || []),
                    s === this._getOnceReturnValue() && this.removeListener(t, i.listener);
        return this
    }
    ,
    n.trigger = i("emitEvent"),
    n.emit = function(t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }
    ,
    n.setOnceReturnValue = function(t) {
        return this._onceReturnValue = t,
        this
    }
    ,
    n._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }
    ,
    n._getEvents = function() {
        return this._events || (this._events = {})
    }
    ,
    t.noConflict = function() {
        return r.EventEmitter = s,
        t
    }
    ,
    "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : r.EventEmitter = t
}
.call(this),
function(t) {
    function e(t) {
        if (t) {
            if ("string" == typeof n[t])
                return t;
            t = t.charAt(0).toUpperCase() + t.slice(1);
            for (var e, r = 0, s = i.length; s > r; r++)
                if (e = i[r] + t,
                "string" == typeof n[e])
                    return e
        }
    }
    var i = "Webkit Moz ms Ms O".split(" ")
      , n = document.documentElement.style;
    "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
        return e
    }) : "object" == typeof exports ? module.exports = e : t.getStyleProperty = e
}(window),
function(t) {
    function e(t) {
        var e = parseFloat(t)
          , i = -1 === t.indexOf("%") && !isNaN(e);
        return i && e
    }
    function i() {}
    function n() {
        for (var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, e = 0, i = o.length; i > e; e++) {
            var n = o[e];
            t[n] = 0
        }
        return t
    }
    function r(i) {
        function r() {
            if (!p) {
                p = !0;
                var n = t.getComputedStyle;
                if (h = function() {
                    var t = n ? function(t) {
                        return n(t, null)
                    }
                    : function(t) {
                        return t.currentStyle
                    }
                    ;
                    return function(e) {
                        var i = t(e);
                        return i || s("Style returned " + i + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),
                        i
                    }
                }(),
                u = i("boxSizing")) {
                    var r = document.createElement("div");
                    r.style.width = "200px",
                    r.style.padding = "1px 2px 3px 4px",
                    r.style.borderStyle = "solid",
                    r.style.borderWidth = "1px 2px 3px 4px",
                    r.style[u] = "border-box";
                    var o = document.body || document.documentElement;
                    o.appendChild(r);
                    var a = h(r);
                    c = 200 === e(a.width),
                    o.removeChild(r)
                }
            }
        }
        function a(t) {
            if (r(),
            "string" == typeof t && (t = document.querySelector(t)),
            t && "object" == typeof t && t.nodeType) {
                var i = h(t);
                if ("none" === i.display)
                    return n();
                var s = {};
                s.width = t.offsetWidth,
                s.height = t.offsetHeight;
                for (var a = s.isBorderBox = !(!u || !i[u] || "border-box" !== i[u]), p = 0, f = o.length; f > p; p++) {
                    var d = o[p]
                      , m = i[d];
                    m = l(t, m);
                    var _ = parseFloat(m);
                    s[d] = isNaN(_) ? 0 : _
                }
                var g = s.paddingLeft + s.paddingRight
                  , v = s.paddingTop + s.paddingBottom
                  , y = s.marginLeft + s.marginRight
                  , T = s.marginTop + s.marginBottom
                  , w = s.borderLeftWidth + s.borderRightWidth
                  , x = s.borderTopWidth + s.borderBottomWidth
                  , b = a && c
                  , P = e(i.width);
                P !== !1 && (s.width = P + (b ? 0 : g + w));
                var S = e(i.height);
                return S !== !1 && (s.height = S + (b ? 0 : v + x)),
                s.innerWidth = s.width - (g + w),
                s.innerHeight = s.height - (v + x),
                s.outerWidth = s.width + y,
                s.outerHeight = s.height + T,
                s
            }
        }
        function l(e, i) {
            if (t.getComputedStyle || -1 === i.indexOf("%"))
                return i;
            var n = e.style
              , r = n.left
              , s = e.runtimeStyle
              , o = s && s.left;
            return o && (s.left = e.currentStyle.left),
            n.left = i,
            i = n.pixelLeft,
            n.left = r,
            o && (s.left = o),
            i
        }
        var h, u, c, p = !1;
        return a
    }
    var s = "undefined" == typeof console ? i : function(t) {
        console.error(t)
    }
      , o = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
    "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], r) : "object" == typeof exports ? module.exports = r(require("desandro-get-style-property")) : t.getSize = r(t.getStyleProperty)
}(window),
function(t) {
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : o.push(t))
    }
    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== s.readyState;
        e.isReady || i || n()
    }
    function n() {
        e.isReady = !0;
        for (var t = 0, i = o.length; i > t; t++) {
            var n = o[t];
            n()
        }
    }
    function r(r) {
        return "complete" === s.readyState ? n() : (r.bind(s, "DOMContentLoaded", i),
        r.bind(s, "readystatechange", i),
        r.bind(t, "load", i)),
        e
    }
    var s = t.document
      , o = [];
    e.isReady = !1,
    "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], r) : "object" == typeof exports ? module.exports = r(require("eventie")) : t.docReady = r(t.eventie)
}(window),
function(t) {
    function e(t, e) {
        return t[o](e)
    }
    function i(t) {
        if (!t.parentNode) {
            var e = document.createDocumentFragment();
            e.appendChild(t)
        }
    }
    function n(t, e) {
        i(t);
        for (var n = t.parentNode.querySelectorAll(e), r = 0, s = n.length; s > r; r++)
            if (n[r] === t)
                return !0;
        return !1
    }
    function r(t, n) {
        return i(t),
        e(t, n)
    }
    var s, o = function() {
        if (t.matches)
            return "matches";
        if (t.matchesSelector)
            return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0, n = e.length; n > i; i++) {
            var r = e[i]
              , s = r + "MatchesSelector";
            if (t[s])
                return s
        }
    }();
    if (o) {
        var a = document.createElement("div")
          , l = e(a, "div");
        s = l ? e : r
    } else
        s = n;
    "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
        return s
    }) : "object" == typeof exports ? module.exports = s : window.matchesSelector = s
}(Element.prototype),
function(t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(i, n) {
        return e(t, i, n)
    }) : "object" == typeof exports ? module.exports = e(t, require("doc-ready"), require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.docReady, t.matchesSelector)
}(window, function(t, e, i) {
    var n = {};
    n.extend = function(t, e) {
        for (var i in e)
            t[i] = e[i];
        return t
    }
    ,
    n.modulo = function(t, e) {
        return (t % e + e) % e
    }
    ;
    var r = Object.prototype.toString;
    n.isArray = function(t) {
        return "[object Array]" == r.call(t)
    }
    ,
    n.makeArray = function(t) {
        var e = [];
        if (n.isArray(t))
            e = t;
        else if (t && "number" == typeof t.length)
            for (var i = 0, r = t.length; r > i; i++)
                e.push(t[i]);
        else
            e.push(t);
        return e
    }
    ,
    n.indexOf = Array.prototype.indexOf ? function(t, e) {
        return t.indexOf(e)
    }
    : function(t, e) {
        for (var i = 0, n = t.length; n > i; i++)
            if (t[i] === e)
                return i;
        return -1
    }
    ,
    n.removeFrom = function(t, e) {
        var i = n.indexOf(t, e);
        -1 != i && t.splice(i, 1)
    }
    ,
    n.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(t) {
        return t instanceof HTMLElement
    }
    : function(t) {
        return t && "object" == typeof t && 1 == t.nodeType && "string" == typeof t.nodeName
    }
    ,
    n.setText = function() {
        function t(t, i) {
            e = e || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"),
            t[e] = i
        }
        var e;
        return t
    }(),
    n.getParent = function(t, e) {
        for (; t != document.body; )
            if (t = t.parentNode,
            i(t, e))
                return t
    }
    ,
    n.getQueryElement = function(t) {
        return "string" == typeof t ? document.querySelector(t) : t
    }
    ,
    n.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }
    ,
    n.filterFindElements = function(t, e) {
        t = n.makeArray(t);
        for (var r = [], s = 0, o = t.length; o > s; s++) {
            var a = t[s];
            if (n.isElement(a))
                if (e) {
                    i(a, e) && r.push(a);
                    for (var l = a.querySelectorAll(e), h = 0, u = l.length; u > h; h++)
                        r.push(l[h])
                } else
                    r.push(a)
        }
        return r
    }
    ,
    n.debounceMethod = function(t, e, i) {
        var n = t.prototype[e]
          , r = e + "Timeout";
        t.prototype[e] = function() {
            var t = this[r];
            t && clearTimeout(t);
            var e = arguments
              , s = this;
            this[r] = setTimeout(function() {
                n.apply(s, e),
                delete s[r]
            }, i || 100)
        }
    }
    ,
    n.toDashed = function(t) {
        return t.replace(/(.)([A-Z])/g, function(t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    }
    ;
    var s = t.console;
    return n.htmlInit = function(i, r) {
        e(function() {
            for (var e = n.toDashed(r), o = document.querySelectorAll(".js-" + e), a = "data-" + e + "-options", l = 0, h = o.length; h > l; l++) {
                var u, c = o[l], p = c.getAttribute(a);
                try {
                    u = p && JSON.parse(p)
                } catch (f) {
                    s && s.error("Error parsing " + a + " on " + c.nodeName.toLowerCase() + (c.id ? "#" + c.id : "") + ": " + f);
                    continue
                }
                var d = new i(c,u)
                  , m = t.jQuery;
                m && m.data(c, r, d)
            }
        })
    }
    ,
    n
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(i, n, r, s) {
        return e(t, i, n, r, s)
    }) : "object" == typeof exports ? module.exports = e(t, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (t.Outlayer = {},
    t.Outlayer.Item = e(t, t.EventEmitter, t.getSize, t.getStyleProperty, t.fizzyUIUtils))
}(window, function(t, e, i, n, r) {
    function s(t) {
        for (var e in t)
            return !1;
        return e = null,
        !0
    }
    function o(t, e) {
        t && (this.element = t,
        this.layout = e,
        this.position = {
            x: 0,
            y: 0
        },
        this._create())
    }
    function a(t) {
        return t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase()
        })
    }
    var l = t.getComputedStyle
      , h = l ? function(t) {
        return l(t, null)
    }
    : function(t) {
        return t.currentStyle
    }
      , u = n("transition")
      , c = n("transform")
      , p = u && c
      , f = !!n("perspective")
      , d = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "otransitionend",
        transition: "transitionend"
    }[u]
      , m = ["transform", "transition", "transitionDuration", "transitionProperty"]
      , _ = function() {
        for (var t = {}, e = 0, i = m.length; i > e; e++) {
            var r = m[e]
              , s = n(r);
            s && s !== r && (t[r] = s)
        }
        return t
    }();
    r.extend(o.prototype, e.prototype),
    o.prototype._create = function() {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        },
        this.css({
            position: "absolute"
        })
    }
    ,
    o.prototype.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }
    ,
    o.prototype.getSize = function() {
        this.size = i(this.element)
    }
    ,
    o.prototype.css = function(t) {
        var e = this.element.style;
        for (var i in t) {
            var n = _[i] || i;
            e[n] = t[i]
        }
    }
    ,
    o.prototype.getPosition = function() {
        var t = h(this.element)
          , e = this.layout.options
          , i = e.isOriginLeft
          , n = e.isOriginTop
          , r = t[i ? "left" : "right"]
          , s = t[n ? "top" : "bottom"]
          , o = this.layout.size
          , a = -1 != r.indexOf("%") ? parseFloat(r) / 100 * o.width : parseInt(r, 10)
          , l = -1 != s.indexOf("%") ? parseFloat(s) / 100 * o.height : parseInt(s, 10);
        a = isNaN(a) ? 0 : a,
        l = isNaN(l) ? 0 : l,
        a -= i ? o.paddingLeft : o.paddingRight,
        l -= n ? o.paddingTop : o.paddingBottom,
        this.position.x = a,
        this.position.y = l
    }
    ,
    o.prototype.layoutPosition = function() {
        var t = this.layout.size
          , e = this.layout.options
          , i = {}
          , n = e.isOriginLeft ? "paddingLeft" : "paddingRight"
          , r = e.isOriginLeft ? "left" : "right"
          , s = e.isOriginLeft ? "right" : "left"
          , o = this.position.x + t[n];
        i[r] = this.getXValue(o),
        i[s] = "";
        var a = e.isOriginTop ? "paddingTop" : "paddingBottom"
          , l = e.isOriginTop ? "top" : "bottom"
          , h = e.isOriginTop ? "bottom" : "top"
          , u = this.position.y + t[a];
        i[l] = this.getYValue(u),
        i[h] = "",
        this.css(i),
        this.emitEvent("layout", [this])
    }
    ,
    o.prototype.getXValue = function(t) {
        var e = this.layout.options;
        return e.percentPosition && !e.isHorizontal ? t / this.layout.size.width * 100 + "%" : t + "px"
    }
    ,
    o.prototype.getYValue = function(t) {
        var e = this.layout.options;
        return e.percentPosition && e.isHorizontal ? t / this.layout.size.height * 100 + "%" : t + "px"
    }
    ,
    o.prototype._transitionTo = function(t, e) {
        this.getPosition();
        var i = this.position.x
          , n = this.position.y
          , r = parseInt(t, 10)
          , s = parseInt(e, 10)
          , o = r === this.position.x && s === this.position.y;
        if (this.setPosition(t, e),
        o && !this.isTransitioning)
            return void this.layoutPosition();
        var a = t - i
          , l = e - n
          , h = {};
        h.transform = this.getTranslate(a, l),
        this.transition({
            to: h,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: !0
        })
    }
    ,
    o.prototype.getTranslate = function(t, e) {
        var i = this.layout.options;
        return t = i.isOriginLeft ? t : -t,
        e = i.isOriginTop ? e : -e,
        f ? "translate3d(" + t + "px, " + e + "px, 0)" : "translate(" + t + "px, " + e + "px)"
    }
    ,
    o.prototype.goTo = function(t, e) {
        this.setPosition(t, e),
        this.layoutPosition()
    }
    ,
    o.prototype.moveTo = p ? o.prototype._transitionTo : o.prototype.goTo,
    o.prototype.setPosition = function(t, e) {
        this.position.x = parseInt(t, 10),
        this.position.y = parseInt(e, 10)
    }
    ,
    o.prototype._nonTransition = function(t) {
        this.css(t.to),
        t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd)
            t.onTransitionEnd[e].call(this)
    }
    ,
    o.prototype._transition = function(t) {
        if (!parseFloat(this.layout.options.transitionDuration))
            return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd)
            e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to)
            e.ingProperties[i] = !0,
            t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            var n = this.element.offsetHeight;
            n = null
        }
        this.enableTransition(t.to),
        this.css(t.to),
        this.isTransitioning = !0
    }
    ;
    var g = "opacity," + a(_.transform || "transform");
    o.prototype.enableTransition = function() {
        this.isTransitioning || (this.css({
            transitionProperty: g,
            transitionDuration: this.layout.options.transitionDuration
        }),
        this.element.addEventListener(d, this, !1))
    }
    ,
    o.prototype.transition = o.prototype[u ? "_transition" : "_nonTransition"],
    o.prototype.onwebkitTransitionEnd = function(t) {
        this.ontransitionend(t)
    }
    ,
    o.prototype.onotransitionend = function(t) {
        this.ontransitionend(t)
    }
    ;
    var v = {
        "-webkit-transform": "transform",
        "-moz-transform": "transform",
        "-o-transform": "transform"
    };
    o.prototype.ontransitionend = function(t) {
        if (t.target === this.element) {
            var e = this._transn
              , i = v[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[i],
            s(e.ingProperties) && this.disableTransition(),
            i in e.clean && (this.element.style[t.propertyName] = "",
            delete e.clean[i]),
            i in e.onEnd) {
                var n = e.onEnd[i];
                n.call(this),
                delete e.onEnd[i]
            }
            this.emitEvent("transitionEnd", [this])
        }
    }
    ,
    o.prototype.disableTransition = function() {
        this.removeTransitionStyles(),
        this.element.removeEventListener(d, this, !1),
        this.isTransitioning = !1
    }
    ,
    o.prototype._removeStyles = function(t) {
        var e = {};
        for (var i in t)
            e[i] = "";
        this.css(e)
    }
    ;
    var y = {
        transitionProperty: "",
        transitionDuration: ""
    };
    return o.prototype.removeTransitionStyles = function() {
        this.css(y)
    }
    ,
    o.prototype.removeElem = function() {
        this.element.parentNode.removeChild(this.element),
        this.css({
            display: ""
        }),
        this.emitEvent("remove", [this])
    }
    ,
    o.prototype.remove = function() {
        if (!u || !parseFloat(this.layout.options.transitionDuration))
            return void this.removeElem();
        var t = this;
        this.once("transitionEnd", function() {
            t.removeElem()
        }),
        this.hide()
    }
    ,
    o.prototype.reveal = function() {
        delete this.isHidden,
        this.css({
            display: ""
        });
        var t = this.layout.options
          , e = {}
          , i = this.getHideRevealTransitionEndProperty("visibleStyle");
        e[i] = this.onRevealTransitionEnd,
        this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }
    ,
    o.prototype.onRevealTransitionEnd = function() {
        this.isHidden || this.emitEvent("reveal")
    }
    ,
    o.prototype.getHideRevealTransitionEndProperty = function(t) {
        var e = this.layout.options[t];
        if (e.opacity)
            return "opacity";
        for (var i in e)
            return i
    }
    ,
    o.prototype.hide = function() {
        this.isHidden = !0,
        this.css({
            display: ""
        });
        var t = this.layout.options
          , e = {}
          , i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        e[i] = this.onHideTransitionEnd,
        this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }
    ,
    o.prototype.onHideTransitionEnd = function() {
        this.isHidden && (this.css({
            display: "none"
        }),
        this.emitEvent("hide"))
    }
    ,
    o.prototype.destroy = function() {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        })
    }
    ,
    o
}),
function(t, e) {
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(i, n, r, s, o) {
        return e(t, i, n, r, s, o)
    }) : "object" == typeof exports ? module.exports = e(t, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.eventie, t.EventEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
}(window, function(t, e, i, n, r, s) {
    function o(t, e) {
        var i = r.getQueryElement(t);
        if (!i)
            return void (a && a.error("Bad element for " + this.constructor.namespace + ": " + (i || t)));
        this.element = i,
        l && (this.$element = l(this.element)),
        this.options = r.extend({}, this.constructor.defaults),
        this.option(e);
        var n = ++u;
        this.element.outlayerGUID = n,
        c[n] = this,
        this._create(),
        this.options.isInitLayout && this.layout()
    }
    var a = t.console
      , l = t.jQuery
      , h = function() {}
      , u = 0
      , c = {};
    return o.namespace = "outlayer",
    o.Item = s,
    o.defaults = {
        containerStyle: {
            position: "relative"
        },
        isInitLayout: !0,
        isOriginLeft: !0,
        isOriginTop: !0,
        isResizeBound: !0,
        isResizingContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
            opacity: 0,
            transform: "scale(0.001)"
        },
        visibleStyle: {
            opacity: 1,
            transform: "scale(1)"
        }
    },
    r.extend(o.prototype, i.prototype),
    o.prototype.option = function(t) {
        r.extend(this.options, t)
    }
    ,
    o.prototype._create = function() {
        this.reloadItems(),
        this.stamps = [],
        this.stamp(this.options.stamp),
        r.extend(this.element.style, this.options.containerStyle),
        this.options.isResizeBound && this.bindResize()
    }
    ,
    o.prototype.reloadItems = function() {
        this.items = this._itemize(this.element.children)
    }
    ,
    o.prototype._itemize = function(t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], r = 0, s = e.length; s > r; r++) {
            var o = e[r]
              , a = new i(o,this);
            n.push(a)
        }
        return n
    }
    ,
    o.prototype._filterFindItemElements = function(t) {
        return r.filterFindElements(t, this.options.itemSelector)
    }
    ,
    o.prototype.getItemElements = function() {
        for (var t = [], e = 0, i = this.items.length; i > e; e++)
            t.push(this.items[e].element);
        return t
    }
    ,
    o.prototype.layout = function() {
        this._resetLayout(),
        this._manageStamps();
        var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
        this.layoutItems(this.items, t),
        this._isLayoutInited = !0
    }
    ,
    o.prototype._init = o.prototype.layout,
    o.prototype._resetLayout = function() {
        this.getSize()
    }
    ,
    o.prototype.getSize = function() {
        this.size = n(this.element)
    }
    ,
    o.prototype._getMeasurement = function(t, e) {
        var i, s = this.options[t];
        s ? ("string" == typeof s ? i = this.element.querySelector(s) : r.isElement(s) && (i = s),
        this[t] = i ? n(i)[e] : s) : this[t] = 0
    }
    ,
    o.prototype.layoutItems = function(t, e) {
        t = this._getItemsForLayout(t),
        this._layoutItems(t, e),
        this._postLayout()
    }
    ,
    o.prototype._getItemsForLayout = function(t) {
        for (var e = [], i = 0, n = t.length; n > i; i++) {
            var r = t[i];
            r.isIgnored || e.push(r)
        }
        return e
    }
    ,
    o.prototype._layoutItems = function(t, e) {
        if (this._emitCompleteOnItems("layout", t),
        t && t.length) {
            for (var i = [], n = 0, r = t.length; r > n; n++) {
                var s = t[n]
                  , o = this._getItemLayoutPosition(s);
                o.item = s,
                o.isInstant = e || s.isLayoutInstant,
                i.push(o)
            }
            this._processLayoutQueue(i)
        }
    }
    ,
    o.prototype._getItemLayoutPosition = function() {
        return {
            x: 0,
            y: 0
        }
    }
    ,
    o.prototype._processLayoutQueue = function(t) {
        for (var e = 0, i = t.length; i > e; e++) {
            var n = t[e];
            this._positionItem(n.item, n.x, n.y, n.isInstant)
        }
    }
    ,
    o.prototype._positionItem = function(t, e, i, n) {
        n ? t.goTo(e, i) : t.moveTo(e, i)
    }
    ,
    o.prototype._postLayout = function() {
        this.resizeContainer()
    }
    ,
    o.prototype.resizeContainer = function() {
        if (this.options.isResizingContainer) {
            var t = this._getContainerSize();
            t && (this._setContainerMeasure(t.width, !0),
            this._setContainerMeasure(t.height, !1))
        }
    }
    ,
    o.prototype._getContainerSize = h,
    o.prototype._setContainerMeasure = function(t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth),
            t = Math.max(t, 0),
            this.element.style[e ? "width" : "height"] = t + "px"
        }
    }
    ,
    o.prototype._emitCompleteOnItems = function(t, e) {
        function i() {
            r.dispatchEvent(t + "Complete", null, [e])
        }
        function n() {
            o++,
            o === s && i()
        }
        var r = this
          , s = e.length;
        if (!e || !s)
            return void i();
        for (var o = 0, a = 0, l = e.length; l > a; a++) {
            var h = e[a];
            h.once(t, n)
        }
    }
    ,
    o.prototype.dispatchEvent = function(t, e, i) {
        var n = e ? [e].concat(i) : i;
        if (this.emitEvent(t, n),
        l)
            if (this.$element = this.$element || l(this.element),
            e) {
                var r = l.Event(e);
                r.type = t,
                this.$element.trigger(r, i)
            } else
                this.$element.trigger(t, i)
    }
    ,
    o.prototype.ignore = function(t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }
    ,
    o.prototype.unignore = function(t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }
    ,
    o.prototype.stamp = function(t) {
        if (t = this._find(t)) {
            this.stamps = this.stamps.concat(t);
            for (var e = 0, i = t.length; i > e; e++) {
                var n = t[e];
                this.ignore(n)
            }
        }
    }
    ,
    o.prototype.unstamp = function(t) {
        if (t = this._find(t))
            for (var e = 0, i = t.length; i > e; e++) {
                var n = t[e];
                r.removeFrom(this.stamps, n),
                this.unignore(n)
            }
    }
    ,
    o.prototype._find = function(t) {
        return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)),
        t = r.makeArray(t)) : void 0
    }
    ,
    o.prototype._manageStamps = function() {
        if (this.stamps && this.stamps.length) {
            this._getBoundingRect();
            for (var t = 0, e = this.stamps.length; e > t; t++) {
                var i = this.stamps[t];
                this._manageStamp(i)
            }
        }
    }
    ,
    o.prototype._getBoundingRect = function() {
        var t = this.element.getBoundingClientRect()
          , e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }
    ,
    o.prototype._manageStamp = h,
    o.prototype._getElementOffset = function(t) {
        var e = t.getBoundingClientRect()
          , i = this._boundingRect
          , r = n(t)
          , s = {
            left: e.left - i.left - r.marginLeft,
            top: e.top - i.top - r.marginTop,
            right: i.right - e.right - r.marginRight,
            bottom: i.bottom - e.bottom - r.marginBottom
        };
        return s
    }
    ,
    o.prototype.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }
    ,
    o.prototype.bindResize = function() {
        this.isResizeBound || (e.bind(t, "resize", this),
        this.isResizeBound = !0)
    }
    ,
    o.prototype.unbindResize = function() {
        this.isResizeBound && e.unbind(t, "resize", this),
        this.isResizeBound = !1
    }
    ,
    o.prototype.onresize = function() {
        function t() {
            e.resize(),
            delete e.resizeTimeout
        }
        this.resizeTimeout && clearTimeout(this.resizeTimeout);
        var e = this;
        this.resizeTimeout = setTimeout(t, 100)
    }
    ,
    o.prototype.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }
    ,
    o.prototype.needsResizeLayout = function() {
        var t = n(this.element)
          , e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth
    }
    ,
    o.prototype.addItems = function(t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)),
        e
    }
    ,
    o.prototype.appended = function(t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0),
        this.reveal(e))
    }
    ,
    o.prototype.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i)
        }
    }
    ,
    o.prototype.reveal = function(t) {
        this._emitCompleteOnItems("reveal", t);
        for (var e = t && t.length, i = 0; e && e > i; i++) {
            var n = t[i];
            n.reveal()
        }
    }
    ,
    o.prototype.hide = function(t) {
        this._emitCompleteOnItems("hide", t);
        for (var e = t && t.length, i = 0; e && e > i; i++) {
            var n = t[i];
            n.hide()
        }
    }
    ,
    o.prototype.revealItemElements = function(t) {
        var e = this.getItems(t);
        this.reveal(e)
    }
    ,
    o.prototype.hideItemElements = function(t) {
        var e = this.getItems(t);
        this.hide(e)
    }
    ,
    o.prototype.getItem = function(t) {
        for (var e = 0, i = this.items.length; i > e; e++) {
            var n = this.items[e];
            if (n.element === t)
                return n
        }
    }
    ,
    o.prototype.getItems = function(t) {
        t = r.makeArray(t);
        for (var e = [], i = 0, n = t.length; n > i; i++) {
            var s = t[i]
              , o = this.getItem(s);
            o && e.push(o)
        }
        return e
    }
    ,
    o.prototype.remove = function(t) {
        var e = this.getItems(t);
        if (this._emitCompleteOnItems("remove", e),
        e && e.length)
            for (var i = 0, n = e.length; n > i; i++) {
                var s = e[i];
                s.remove(),
                r.removeFrom(this.items, s)
            }
    }
    ,
    o.prototype.destroy = function() {
        var t = this.element.style;
        t.height = "",
        t.position = "",
        t.width = "";
        for (var e = 0, i = this.items.length; i > e; e++) {
            var n = this.items[e];
            n.destroy()
        }
        this.unbindResize();
        var r = this.element.outlayerGUID;
        delete c[r],
        delete this.element.outlayerGUID,
        l && l.removeData(this.element, this.constructor.namespace)
    }
    ,
    o.data = function(t) {
        t = r.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && c[e]
    }
    ,
    o.create = function(t, e) {
        function i() {
            o.apply(this, arguments)
        }
        return Object.create ? i.prototype = Object.create(o.prototype) : r.extend(i.prototype, o.prototype),
        i.prototype.constructor = i,
        i.defaults = r.extend({}, o.defaults),
        r.extend(i.defaults, e),
        i.prototype.settings = {},
        i.namespace = t,
        i.data = o.data,
        i.Item = function() {
            s.apply(this, arguments)
        }
        ,
        i.Item.prototype = new s,
        r.htmlInit(i, t),
        l && l.bridget && l.bridget(t, i),
        i
    }
    ,
    o.Item = s,
    o
}),
function(t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], e) : "object" == typeof exports ? module.exports = e(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : t.Masonry = e(t.Outlayer, t.getSize, t.fizzyUIUtils)
}(window, function(t, e, i) {
    var n = t.create("masonry");
    return n.prototype._resetLayout = function() {
        this.getSize(),
        this._getMeasurement("columnWidth", "outerWidth"),
        this._getMeasurement("gutter", "outerWidth"),
        this.measureColumns();
        var t = this.cols;
        for (this.colYs = []; t--; )
            this.colYs.push(0);
        this.maxY = 0
    }
    ,
    n.prototype.measureColumns = function() {
        if (this.getContainerWidth(),
        !this.columnWidth) {
            var t = this.items[0]
              , i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth
        }
        var n = this.columnWidth += this.gutter
          , r = this.containerWidth + this.gutter
          , s = r / n
          , o = n - r % n
          , a = o && 1 > o ? "round" : "floor";
        s = Math[a](s),
        this.cols = Math.max(s, 1)
    }
    ,
    n.prototype.getContainerWidth = function() {
        var t = this.options.isFitWidth ? this.element.parentNode : this.element
          , i = e(t);
        this.containerWidth = i && i.innerWidth
    }
    ,
    n.prototype._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth
          , n = e && 1 > e ? "round" : "ceil"
          , r = Math[n](t.size.outerWidth / this.columnWidth);
        r = Math.min(r, this.cols);
        for (var s = this._getColGroup(r), o = Math.min.apply(Math, s), a = i.indexOf(s, o), l = {
            x: this.columnWidth * a,
            y: o
        }, h = o + t.size.outerHeight, u = this.cols + 1 - s.length, c = 0; u > c; c++)
            this.colYs[a + c] = h;
        return l
    }
    ,
    n.prototype._getColGroup = function(t) {
        if (2 > t)
            return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
            var r = this.colYs.slice(n, n + t);
            e[n] = Math.max.apply(Math, r)
        }
        return e
    }
    ,
    n.prototype._manageStamp = function(t) {
        var i = e(t)
          , n = this._getElementOffset(t)
          , r = this.options.isOriginLeft ? n.left : n.right
          , s = r + i.outerWidth
          , o = Math.floor(r / this.columnWidth);
        o = Math.max(0, o);
        var a = Math.floor(s / this.columnWidth);
        a -= s % this.columnWidth ? 0 : 1,
        a = Math.min(this.cols - 1, a);
        for (var l = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, h = o; a >= h; h++)
            this.colYs[h] = Math.max(l, this.colYs[h])
    }
    ,
    n.prototype._getContainerSize = function() {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {
            height: this.maxY
        };
        return this.options.isFitWidth && (t.width = this._getContainerFitWidth()),
        t
    }
    ,
    n.prototype._getContainerFitWidth = function() {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; )
            t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }
    ,
    n.prototype.needsResizeLayout = function() {
        var t = this.containerWidth;
        return this.getContainerWidth(),
        t !== this.containerWidth
    }
    ,
    n
});
/*!
 * VERSION: 1.15.1
 * DATE: 2015-01-20
 * UPDATES AND DOCS AT: http://greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(t, e, i) {
        var n = function(t) {
            var e, i = [], n = t.length;
            for (e = 0; e !== n; i.push(t[e++]))
                ;
            return i
        }
          , r = function(t, e, n) {
            i.call(this, t, e, n),
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._dirty = !0,
            this.render = r.prototype.render
        }
          , s = 1e-10
          , o = i._internals
          , a = o.isSelector
          , l = o.isArray
          , h = r.prototype = i.to({}, .1, {})
          , u = [];
        r.version = "1.15.1",
        h.constructor = r,
        h.kill()._gc = !1,
        r.killTweensOf = r.killDelayedCallsTo = i.killTweensOf,
        r.getTweensOf = i.getTweensOf,
        r.lagSmoothing = i.lagSmoothing,
        r.ticker = i.ticker,
        r.render = i.render,
        h.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            i.prototype.invalidate.call(this)
        }
        ,
        h.updateTo = function(t, e) {
            var n, r = this.ratio, s = this.vars.immediateRender || t.immediateRender;
            e && this._startTime < this._timeline._time && (this._startTime = this._timeline._time,
            this._uncache(!1),
            this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
            for (n in t)
                this.vars[n] = t[n];
            if (this._initted || s)
                if (e)
                    this._initted = !1,
                    s && this.render(0, !0, !0);
                else if (this._gc && this._enabled(!0, !1),
                this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this),
                this._time / this._duration > .998) {
                    var o = this._time;
                    this.render(0, !0, !1),
                    this._initted = !1,
                    this.render(o, !0, !1)
                } else if (this._time > 0 || s) {
                    this._initted = !1,
                    this._init();
                    for (var a, l = 1 / (1 - r), h = this._firstPT; h; )
                        a = h.s + h.c,
                        h.c *= l,
                        h.s = a - h.c,
                        h = h._next
                }
            return this
        }
        ,
        h.render = function(t, e, i) {
            this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
            var n, r, a, l, h, c, p, f, d = this._dirty ? this.totalDuration() : this._totalDuration, m = this._time, _ = this._totalTime, g = this._cycle, v = this._duration, y = this._rawPrevTime;
            if (t >= d ? (this._totalTime = d,
            this._cycle = this._repeat,
            this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = v,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1),
            this._reversed || (n = !0,
            r = "onComplete"),
            0 === v && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0),
            (0 === t || 0 > y || y === s) && y !== t && (i = !0,
            y > s && (r = "onReverseComplete")),
            this._rawPrevTime = f = !e || t || y === t ? t : s)) : 1e-7 > t ? (this._totalTime = this._time = this._cycle = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
            (0 !== _ || 0 === v && y > 0 && y !== s) && (r = "onReverseComplete",
            n = this._reversed),
            0 > t && (this._active = !1,
            0 === v && (this._initted || !this.vars.lazy || i) && (y >= 0 && (i = !0),
            this._rawPrevTime = f = !e || t || y === t ? t : s)),
            this._initted || (i = !0)) : (this._totalTime = this._time = t,
            0 !== this._repeat && (l = v + this._repeatDelay,
            this._cycle = this._totalTime / l >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / l && this._cycle--,
            this._time = this._totalTime - this._cycle * l,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = v - this._time),
            this._time > v ? this._time = v : 0 > this._time && (this._time = 0)),
            this._easeType ? (h = this._time / v,
            c = this._easeType,
            p = this._easePower,
            (1 === c || 3 === c && h >= .5) && (h = 1 - h),
            3 === c && (h *= 2),
            1 === p ? h *= h : 2 === p ? h *= h * h : 3 === p ? h *= h * h * h : 4 === p && (h *= h * h * h * h),
            this.ratio = 1 === c ? 1 - h : 2 === c ? h : .5 > this._time / v ? h / 2 : 1 - h / 2) : this.ratio = this._ease.getRatio(this._time / v)),
            m === this._time && !i && g === this._cycle)
                return void (_ !== this._totalTime && this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || u)));
            if (!this._initted) {
                if (this._init(),
                !this._initted || this._gc)
                    return;
                if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))
                    return this._time = m,
                    this._totalTime = _,
                    this._rawPrevTime = y,
                    this._cycle = g,
                    o.lazyTweens.push(this),
                    void (this._lazy = [t, e]);
                this._time && !n ? this.ratio = this._ease.getRatio(this._time / v) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }
            for (this._lazy !== !1 && (this._lazy = !1),
            this._active || !this._paused && this._time !== m && t >= 0 && (this._active = !0),
            0 === _ && (2 === this._initted && t > 0 && this._init(),
            this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")),
            this.vars.onStart && (0 !== this._totalTime || 0 === v) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || u))),
            a = this._firstPT; a; )
                a.f ? a.t[a.p](a.c * this.ratio + a.s) : a.t[a.p] = a.c * this.ratio + a.s,
                a = a._next;
            this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i),
            e || (this._totalTime !== _ || n) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || u)),
            this._cycle !== g && (e || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || u)),
            r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i),
            n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !e && this.vars[r] && this.vars[r].apply(this.vars[r + "Scope"] || this, this.vars[r + "Params"] || u),
            0 === v && this._rawPrevTime === s && f !== s && (this._rawPrevTime = 0))
        }
        ,
        r.to = function(t, e, i) {
            return new r(t,e,i)
        }
        ,
        r.from = function(t, e, i) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            new r(t,e,i)
        }
        ,
        r.fromTo = function(t, e, i, n) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            new r(t,e,n)
        }
        ,
        r.staggerTo = r.allTo = function(t, e, s, o, h, c, p) {
            o = o || 0;
            var f, d, m, _, g = s.delay || 0, v = [], y = function() {
                s.onComplete && s.onComplete.apply(s.onCompleteScope || this, arguments),
                h.apply(p || this, c || u)
            };
            for (l(t) || ("string" == typeof t && (t = i.selector(t) || t),
            a(t) && (t = n(t))),
            t = t || [],
            0 > o && (t = n(t),
            t.reverse(),
            o *= -1),
            f = t.length - 1,
            m = 0; f >= m; m++) {
                d = {};
                for (_ in s)
                    d[_] = s[_];
                d.delay = g,
                m === f && h && (d.onComplete = y),
                v[m] = new r(t[m],e,d),
                g += o
            }
            return v
        }
        ,
        r.staggerFrom = r.allFrom = function(t, e, i, n, s, o, a) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            r.staggerTo(t, e, i, n, s, o, a)
        }
        ,
        r.staggerFromTo = r.allFromTo = function(t, e, i, n, s, o, a, l) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            r.staggerTo(t, e, n, s, o, a, l)
        }
        ,
        r.delayedCall = function(t, e, i, n, s) {
            return new r(e,0,{
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                onCompleteScope: n,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                onReverseCompleteScope: n,
                immediateRender: !1,
                useFrames: s,
                overwrite: 0
            })
        }
        ,
        r.set = function(t, e) {
            return new r(t,0,e)
        }
        ,
        r.isTweening = function(t) {
            return i.getTweensOf(t, !0).length > 0
        }
        ;
        var c = function(t, e) {
            for (var n = [], r = 0, s = t._first; s; )
                s instanceof i ? n[r++] = s : (e && (n[r++] = s),
                n = n.concat(c(s, e)),
                r = n.length),
                s = s._next;
            return n
        }
          , p = r.getAllTweens = function(e) {
            return c(t._rootTimeline, e).concat(c(t._rootFramesTimeline, e))
        }
        ;
        r.killAll = function(t, i, n, r) {
            null == i && (i = !0),
            null == n && (n = !0);
            var s, o, a, l = p(0 != r), h = l.length, u = i && n && r;
            for (a = 0; h > a; a++)
                o = l[a],
                (u || o instanceof e || (s = o.target === o.vars.onComplete) && n || i && !s) && (t ? o.totalTime(o._reversed ? 0 : o.totalDuration()) : o._enabled(!1, !1))
        }
        ,
        r.killChildTweensOf = function(t, e) {
            if (null != t) {
                var s, h, u, c, p, f = o.tweenLookup;
                if ("string" == typeof t && (t = i.selector(t) || t),
                a(t) && (t = n(t)),
                l(t))
                    for (c = t.length; --c > -1; )
                        r.killChildTweensOf(t[c], e);
                else {
                    s = [];
                    for (u in f)
                        for (h = f[u].target.parentNode; h; )
                            h === t && (s = s.concat(f[u].tweens)),
                            h = h.parentNode;
                    for (p = s.length,
                    c = 0; p > c; c++)
                        e && s[c].totalTime(s[c].totalDuration()),
                        s[c]._enabled(!1, !1)
                }
            }
        }
        ;
        var f = function(t, i, n, r) {
            i = i !== !1,
            n = n !== !1,
            r = r !== !1;
            for (var s, o, a = p(r), l = i && n && r, h = a.length; --h > -1; )
                o = a[h],
                (l || o instanceof e || (s = o.target === o.vars.onComplete) && n || i && !s) && o.paused(t)
        };
        return r.pauseAll = function(t, e, i) {
            f(!0, t, e, i)
        }
        ,
        r.resumeAll = function(t, e, i) {
            f(!1, t, e, i)
        }
        ,
        r.globalTimeScale = function(e) {
            var n = t._rootTimeline
              , r = i.ticker.time;
            return arguments.length ? (e = e || s,
            n._startTime = r - (r - n._startTime) * n._timeScale / e,
            n = t._rootFramesTimeline,
            r = i.ticker.frame,
            n._startTime = r - (r - n._startTime) * n._timeScale / e,
            n._timeScale = t._rootTimeline._timeScale = e,
            e) : n._timeScale
        }
        ,
        h.progress = function(t) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
        }
        ,
        h.totalProgress = function(t) {
            return arguments.length ? this.totalTime(this.totalDuration() * t, !1) : this._totalTime / this.totalDuration()
        }
        ,
        h.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            t > this._duration && (t = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(t, e)) : this._time
        }
        ,
        h.duration = function(e) {
            return arguments.length ? t.prototype.duration.call(this, e) : this._duration
        }
        ,
        h.totalDuration = function(t) {
            return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat,
            this._dirty = !1),
            this._totalDuration)
        }
        ,
        h.repeat = function(t) {
            return arguments.length ? (this._repeat = t,
            this._uncache(!0)) : this._repeat
        }
        ,
        h.repeatDelay = function(t) {
            return arguments.length ? (this._repeatDelay = t,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        h.yoyo = function(t) {
            return arguments.length ? (this._yoyo = t,
            this) : this._yoyo
        }
        ,
        r
    }, !0),
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(t, e, i) {
        var n = function(t) {
            e.call(this, t),
            this._labels = {},
            this.autoRemoveChildren = this.vars.autoRemoveChildren === !0,
            this.smoothChildTiming = this.vars.smoothChildTiming === !0,
            this._sortChildren = !0,
            this._onUpdate = this.vars.onUpdate;
            var i, n, r = this.vars;
            for (n in r)
                i = r[n],
                l(i) && -1 !== i.join("").indexOf("{self}") && (r[n] = this._swapSelfInParams(i));
            l(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger)
        }
          , r = 1e-10
          , s = i._internals
          , o = n._internals = {}
          , a = s.isSelector
          , l = s.isArray
          , h = s.lazyTweens
          , u = s.lazyRender
          , c = []
          , p = _gsScope._gsDefine.globals
          , f = function(t) {
            var e, i = {};
            for (e in t)
                i[e] = t[e];
            return i
        }
          , d = o.pauseCallback = function(t, e, i, n) {
            var r = t._timeline
              , s = r._totalTime;
            !e && this._forcingPlayhead || r._rawPrevTime === t._startTime || (r.pause(t._startTime),
            e && e.apply(n || r, i || c),
            this._forcingPlayhead && r.seek(s))
        }
          , m = function(t) {
            var e, i = [], n = t.length;
            for (e = 0; e !== n; i.push(t[e++]))
                ;
            return i
        }
          , _ = n.prototype = new e;
        return n.version = "1.15.1",
        _.constructor = n,
        _.kill()._gc = _._forcingPlayhead = !1,
        _.to = function(t, e, n, r) {
            var s = n.repeat && p.TweenMax || i;
            return e ? this.add(new s(t,e,n), r) : this.set(t, n, r)
        }
        ,
        _.from = function(t, e, n, r) {
            return this.add((n.repeat && p.TweenMax || i).from(t, e, n), r)
        }
        ,
        _.fromTo = function(t, e, n, r, s) {
            var o = r.repeat && p.TweenMax || i;
            return e ? this.add(o.fromTo(t, e, n, r), s) : this.set(t, r, s)
        }
        ,
        _.staggerTo = function(t, e, r, s, o, l, h, u) {
            var c, p = new n({
                onComplete: l,
                onCompleteParams: h,
                onCompleteScope: u,
                smoothChildTiming: this.smoothChildTiming
            });
            for ("string" == typeof t && (t = i.selector(t) || t),
            t = t || [],
            a(t) && (t = m(t)),
            s = s || 0,
            0 > s && (t = m(t),
            t.reverse(),
            s *= -1),
            c = 0; t.length > c; c++)
                r.startAt && (r.startAt = f(r.startAt)),
                p.to(t[c], e, f(r), c * s);
            return this.add(p, o)
        }
        ,
        _.staggerFrom = function(t, e, i, n, r, s, o, a) {
            return i.immediateRender = 0 != i.immediateRender,
            i.runBackwards = !0,
            this.staggerTo(t, e, i, n, r, s, o, a)
        }
        ,
        _.staggerFromTo = function(t, e, i, n, r, s, o, a, l) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            this.staggerTo(t, e, n, r, s, o, a, l)
        }
        ,
        _.call = function(t, e, n, r) {
            return this.add(i.delayedCall(0, t, e, n), r)
        }
        ,
        _.set = function(t, e, n) {
            return n = this._parseTimeOrLabel(n, 0, !0),
            null == e.immediateRender && (e.immediateRender = n === this._time && !this._paused),
            this.add(new i(t,0,e), n)
        }
        ,
        n.exportRoot = function(t, e) {
            t = t || {},
            null == t.smoothChildTiming && (t.smoothChildTiming = !0);
            var r, s, o = new n(t), a = o._timeline;
            for (null == e && (e = !0),
            a._remove(o, !0),
            o._startTime = 0,
            o._rawPrevTime = o._time = o._totalTime = a._time,
            r = a._first; r; )
                s = r._next,
                e && r instanceof i && r.target === r.vars.onComplete || o.add(r, r._startTime - r._delay),
                r = s;
            return a.add(o, 0),
            o
        }
        ,
        _.add = function(r, s, o, a) {
            var h, u, c, p, f, d;
            if ("number" != typeof s && (s = this._parseTimeOrLabel(s, 0, !0, r)),
            !(r instanceof t)) {
                if (r instanceof Array || r && r.push && l(r)) {
                    for (o = o || "normal",
                    a = a || 0,
                    h = s,
                    u = r.length,
                    c = 0; u > c; c++)
                        l(p = r[c]) && (p = new n({
                            tweens: p
                        })),
                        this.add(p, h),
                        "string" != typeof p && "function" != typeof p && ("sequence" === o ? h = p._startTime + p.totalDuration() / p._timeScale : "start" === o && (p._startTime -= p.delay())),
                        h += a;
                    return this._uncache(!0)
                }
                if ("string" == typeof r)
                    return this.addLabel(r, s);
                if ("function" != typeof r)
                    throw "Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
                r = i.delayedCall(0, r)
            }
            if (e.prototype.add.call(this, r, s),
            (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                for (f = this,
                d = f.rawTime() > r._startTime; f._timeline; )
                    d && f._timeline.smoothChildTiming ? f.totalTime(f._totalTime, !0) : f._gc && f._enabled(!0, !1),
                    f = f._timeline;
            return this
        }
        ,
        _.remove = function(e) {
            if (e instanceof t)
                return this._remove(e, !1);
            if (e instanceof Array || e && e.push && l(e)) {
                for (var i = e.length; --i > -1; )
                    this.remove(e[i]);
                return this
            }
            return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e)
        }
        ,
        _._remove = function(t, i) {
            e.prototype._remove.call(this, t, i);
            var n = this._last;
            return n ? this._time > n._startTime + n._totalDuration / n._timeScale && (this._time = this.duration(),
            this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0,
            this
        }
        ,
        _.append = function(t, e) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
        }
        ,
        _.insert = _.insertMultiple = function(t, e, i, n) {
            return this.add(t, e || 0, i, n)
        }
        ,
        _.appendMultiple = function(t, e, i, n) {
            return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, n)
        }
        ,
        _.addLabel = function(t, e) {
            return this._labels[t] = this._parseTimeOrLabel(e),
            this
        }
        ,
        _.addPause = function(t, e, n, r) {
            var s = i.delayedCall(0, d, ["{self}", e, n, r], this);
            return s.data = "isPause",
            this.add(s, t)
        }
        ,
        _.removeLabel = function(t) {
            return delete this._labels[t],
            this
        }
        ,
        _.getLabelTime = function(t) {
            return null != this._labels[t] ? this._labels[t] : -1
        }
        ,
        _._parseTimeOrLabel = function(e, i, n, r) {
            var s;
            if (r instanceof t && r.timeline === this)
                this.remove(r);
            else if (r && (r instanceof Array || r.push && l(r)))
                for (s = r.length; --s > -1; )
                    r[s]instanceof t && r[s].timeline === this && this.remove(r[s]);
            if ("string" == typeof i)
                return this._parseTimeOrLabel(i, n && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, n);
            if (i = i || 0,
            "string" != typeof e || !isNaN(e) && null == this._labels[e])
                null == e && (e = this.duration());
            else {
                if (s = e.indexOf("="),
                -1 === s)
                    return null == this._labels[e] ? n ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
                i = parseInt(e.charAt(s - 1) + "1", 10) * Number(e.substr(s + 1)),
                e = s > 1 ? this._parseTimeOrLabel(e.substr(0, s - 1), 0, n) : this.duration()
            }
            return Number(e) + i
        }
        ,
        _.seek = function(t, e) {
            return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1)
        }
        ,
        _.stop = function() {
            return this.paused(!0)
        }
        ,
        _.gotoAndPlay = function(t, e) {
            return this.play(t, e)
        }
        ,
        _.gotoAndStop = function(t, e) {
            return this.pause(t, e)
        }
        ,
        _.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n, s, o, a, l, p = this._dirty ? this.totalDuration() : this._totalDuration, f = this._time, d = this._startTime, m = this._timeScale, _ = this._paused;
            if (t >= p ? (this._totalTime = this._time = p,
            this._reversed || this._hasPausedChild() || (s = !0,
            a = "onComplete",
            0 === this._duration && (0 === t || 0 > this._rawPrevTime || this._rawPrevTime === r) && this._rawPrevTime !== t && this._first && (l = !0,
            this._rawPrevTime > r && (a = "onReverseComplete"))),
            this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r,
            t = p + 1e-4) : 1e-7 > t ? (this._totalTime = this._time = 0,
            (0 !== f || 0 === this._duration && this._rawPrevTime !== r && (this._rawPrevTime > 0 || 0 > t && this._rawPrevTime >= 0)) && (a = "onReverseComplete",
            s = this._reversed),
            0 > t ? (this._active = !1,
            this._rawPrevTime >= 0 && this._first && (l = !0),
            this._rawPrevTime = t) : (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r,
            t = 0,
            this._initted || (l = !0))) : this._totalTime = this._time = this._rawPrevTime = t,
            this._time !== f && this._first || i || l) {
                if (this._initted || (this._initted = !0),
                this._active || !this._paused && this._time !== f && t > 0 && (this._active = !0),
                0 === f && this.vars.onStart && 0 !== this._time && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || c)),
                this._time >= f)
                    for (n = this._first; n && (o = n._next,
                    !this._paused || _); )
                        (n._active || n._startTime <= this._time && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                        n = o;
                else
                    for (n = this._last; n && (o = n._prev,
                    !this._paused || _); )
                        (n._active || f >= n._startTime && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                        n = o;
                this._onUpdate && (e || (h.length && u(),
                this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || c))),
                a && (this._gc || (d === this._startTime || m !== this._timeScale) && (0 === this._time || p >= this.totalDuration()) && (s && (h.length && u(),
                this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !e && this.vars[a] && this.vars[a].apply(this.vars[a + "Scope"] || this, this.vars[a + "Params"] || c)))
            }
        }
        ,
        _._hasPausedChild = function() {
            for (var t = this._first; t; ) {
                if (t._paused || t instanceof n && t._hasPausedChild())
                    return !0;
                t = t._next
            }
            return !1
        }
        ,
        _.getChildren = function(t, e, n, r) {
            r = r || -9999999999;
            for (var s = [], o = this._first, a = 0; o; )
                r > o._startTime || (o instanceof i ? e !== !1 && (s[a++] = o) : (n !== !1 && (s[a++] = o),
                t !== !1 && (s = s.concat(o.getChildren(!0, e, n)),
                a = s.length))),
                o = o._next;
            return s
        }
        ,
        _.getTweensOf = function(t, e) {
            var n, r, s = this._gc, o = [], a = 0;
            for (s && this._enabled(!0, !0),
            n = i.getTweensOf(t),
            r = n.length; --r > -1; )
                (n[r].timeline === this || e && this._contains(n[r])) && (o[a++] = n[r]);
            return s && this._enabled(!1, !0),
            o
        }
        ,
        _.recent = function() {
            return this._recent
        }
        ,
        _._contains = function(t) {
            for (var e = t.timeline; e; ) {
                if (e === this)
                    return !0;
                e = e.timeline
            }
            return !1
        }
        ,
        _.shiftChildren = function(t, e, i) {
            i = i || 0;
            for (var n, r = this._first, s = this._labels; r; )
                r._startTime >= i && (r._startTime += t),
                r = r._next;
            if (e)
                for (n in s)
                    s[n] >= i && (s[n] += t);
            return this._uncache(!0)
        }
        ,
        _._kill = function(t, e) {
            if (!t && !e)
                return this._enabled(!1, !1);
            for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), n = i.length, r = !1; --n > -1; )
                i[n]._kill(t, e) && (r = !0);
            return r
        }
        ,
        _.clear = function(t) {
            var e = this.getChildren(!1, !0, !0)
              , i = e.length;
            for (this._time = this._totalTime = 0; --i > -1; )
                e[i]._enabled(!1, !1);
            return t !== !1 && (this._labels = {}),
            this._uncache(!0)
        }
        ,
        _.invalidate = function() {
            for (var e = this._first; e; )
                e.invalidate(),
                e = e._next;
            return t.prototype.invalidate.call(this)
        }
        ,
        _._enabled = function(t, i) {
            if (t === this._gc)
                for (var n = this._first; n; )
                    n._enabled(t, !0),
                    n = n._next;
            return e.prototype._enabled.call(this, t, i)
        }
        ,
        _.totalTime = function() {
            this._forcingPlayhead = !0;
            var e = t.prototype.totalTime.apply(this, arguments);
            return this._forcingPlayhead = !1,
            e
        }
        ,
        _.duration = function(t) {
            return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t),
            this) : (this._dirty && this.totalDuration(),
            this._duration)
        }
        ,
        _.totalDuration = function(t) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var e, i, n = 0, r = this._last, s = 999999999999; r; )
                        e = r._prev,
                        r._dirty && r.totalDuration(),
                        r._startTime > s && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : s = r._startTime,
                        0 > r._startTime && !r._paused && (n -= r._startTime,
                        this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale),
                        this.shiftChildren(-r._startTime, !1, -9999999999),
                        s = 0),
                        i = r._startTime + r._totalDuration / r._timeScale,
                        i > n && (n = i),
                        r = e;
                    this._duration = this._totalDuration = n,
                    this._dirty = !1
                }
                return this._totalDuration
            }
            return 0 !== this.totalDuration() && 0 !== t && this.timeScale(this._totalDuration / t),
            this
        }
        ,
        _.usesFrames = function() {
            for (var e = this._timeline; e._timeline; )
                e = e._timeline;
            return e === t._rootFramesTimeline
        }
        ,
        _.rawTime = function() {
            return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
        }
        ,
        n
    }, !0),
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(t, e, i) {
        var n = function(e) {
            t.call(this, e),
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._dirty = !0
        }
          , r = 1e-10
          , s = []
          , o = e._internals
          , a = o.lazyTweens
          , l = o.lazyRender
          , h = new i(null,null,1,0)
          , u = n.prototype = new t;
        return u.constructor = n,
        u.kill()._gc = !1,
        n.version = "1.15.1",
        u.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            t.prototype.invalidate.call(this)
        }
        ,
        u.addCallback = function(t, i, n, r) {
            return this.add(e.delayedCall(0, t, n, r), i)
        }
        ,
        u.removeCallback = function(t, e) {
            if (t)
                if (null == e)
                    this._kill(null, t);
                else
                    for (var i = this.getTweensOf(t, !1), n = i.length, r = this._parseTimeOrLabel(e); --n > -1; )
                        i[n]._startTime === r && i[n]._enabled(!1, !1);
            return this
        }
        ,
        u.removePause = function(e) {
            return this.removeCallback(t._internals.pauseCallback, e)
        }
        ,
        u.tweenTo = function(t, i) {
            i = i || {};
            var n, r, o, a = {
                ease: h,
                useFrames: this.usesFrames(),
                immediateRender: !1
            };
            for (r in i)
                a[r] = i[r];
            return a.time = this._parseTimeOrLabel(t),
            n = Math.abs(Number(a.time) - this._time) / this._timeScale || .001,
            o = new e(this,n,a),
            a.onStart = function() {
                o.target.paused(!0),
                o.vars.time !== o.target.time() && n === o.duration() && o.duration(Math.abs(o.vars.time - o.target.time()) / o.target._timeScale),
                i.onStart && i.onStart.apply(i.onStartScope || o, i.onStartParams || s)
            }
            ,
            o
        }
        ,
        u.tweenFromTo = function(t, e, i) {
            i = i || {},
            t = this._parseTimeOrLabel(t),
            i.startAt = {
                onComplete: this.seek,
                onCompleteParams: [t],
                onCompleteScope: this
            },
            i.immediateRender = i.immediateRender !== !1;
            var n = this.tweenTo(e, i);
            return n.duration(Math.abs(n.vars.time - t) / this._timeScale || .001)
        }
        ,
        u.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n, o, h, u, c, p, f = this._dirty ? this.totalDuration() : this._totalDuration, d = this._duration, m = this._time, _ = this._totalTime, g = this._startTime, v = this._timeScale, y = this._rawPrevTime, T = this._paused, w = this._cycle;
            if (t >= f ? (this._locked || (this._totalTime = f,
            this._cycle = this._repeat),
            this._reversed || this._hasPausedChild() || (o = !0,
            u = "onComplete",
            0 === this._duration && (0 === t || 0 > y || y === r) && y !== t && this._first && (c = !0,
            y > r && (u = "onReverseComplete"))),
            this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r,
            this._yoyo && 0 !== (1 & this._cycle) ? this._time = t = 0 : (this._time = d,
            t = d + 1e-4)) : 1e-7 > t ? (this._locked || (this._totalTime = this._cycle = 0),
            this._time = 0,
            (0 !== m || 0 === d && y !== r && (y > 0 || 0 > t && y >= 0) && !this._locked) && (u = "onReverseComplete",
            o = this._reversed),
            0 > t ? (this._active = !1,
            y >= 0 && this._first && (c = !0),
            this._rawPrevTime = t) : (this._rawPrevTime = d || !e || t || this._rawPrevTime === t ? t : r,
            t = 0,
            this._initted || (c = !0))) : (0 === d && 0 > y && (c = !0),
            this._time = this._rawPrevTime = t,
            this._locked || (this._totalTime = t,
            0 !== this._repeat && (p = d + this._repeatDelay,
            this._cycle = this._totalTime / p >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / p && this._cycle--,
            this._time = this._totalTime - this._cycle * p,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = d - this._time),
            this._time > d ? (this._time = d,
            t = d + 1e-4) : 0 > this._time ? this._time = t = 0 : t = this._time))),
            this._cycle !== w && !this._locked) {
                var x = this._yoyo && 0 !== (1 & w)
                  , b = x === (this._yoyo && 0 !== (1 & this._cycle))
                  , P = this._totalTime
                  , S = this._cycle
                  , C = this._rawPrevTime
                  , O = this._time;
                if (this._totalTime = w * d,
                w > this._cycle ? x = !x : this._totalTime += d,
                this._time = m,
                this._rawPrevTime = 0 === d ? y - 1e-4 : y,
                this._cycle = w,
                this._locked = !0,
                m = x ? 0 : d,
                this.render(m, e, 0 === d),
                e || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || s),
                b && (m = x ? d + 1e-4 : -1e-4,
                this.render(m, !0, !1)),
                this._locked = !1,
                this._paused && !T)
                    return;
                this._time = O,
                this._totalTime = P,
                this._cycle = S,
                this._rawPrevTime = C
            }
            if (!(this._time !== m && this._first || i || c))
                return void (_ !== this._totalTime && this._onUpdate && (e || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s)));
            if (this._initted || (this._initted = !0),
            this._active || !this._paused && this._totalTime !== _ && t > 0 && (this._active = !0),
            0 === _ && this.vars.onStart && 0 !== this._totalTime && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || s)),
            this._time >= m)
                for (n = this._first; n && (h = n._next,
                !this._paused || T); )
                    (n._active || n._startTime <= this._time && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                    n = h;
            else
                for (n = this._last; n && (h = n._prev,
                !this._paused || T); )
                    (n._active || m >= n._startTime && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                    n = h;
            this._onUpdate && (e || (a.length && l(),
            this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s))),
            u && (this._locked || this._gc || (g === this._startTime || v !== this._timeScale) && (0 === this._time || f >= this.totalDuration()) && (o && (a.length && l(),
            this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !e && this.vars[u] && this.vars[u].apply(this.vars[u + "Scope"] || this, this.vars[u + "Params"] || s)))
        }
        ,
        u.getActive = function(t, e, i) {
            null == t && (t = !0),
            null == e && (e = !0),
            null == i && (i = !1);
            var n, r, s = [], o = this.getChildren(t, e, i), a = 0, l = o.length;
            for (n = 0; l > n; n++)
                r = o[n],
                r.isActive() && (s[a++] = r);
            return s
        }
        ,
        u.getLabelAfter = function(t) {
            t || 0 !== t && (t = this._time);
            var e, i = this.getLabelsArray(), n = i.length;
            for (e = 0; n > e; e++)
                if (i[e].time > t)
                    return i[e].name;
            return null
        }
        ,
        u.getLabelBefore = function(t) {
            null == t && (t = this._time);
            for (var e = this.getLabelsArray(), i = e.length; --i > -1; )
                if (t > e[i].time)
                    return e[i].name;
            return null
        }
        ,
        u.getLabelsArray = function() {
            var t, e = [], i = 0;
            for (t in this._labels)
                e[i++] = {
                    time: this._labels[t],
                    name: t
                };
            return e.sort(function(t, e) {
                return t.time - e.time
            }),
            e
        }
        ,
        u.progress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
        }
        ,
        u.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
        }
        ,
        u.totalDuration = function(e) {
            return arguments.length ? -1 === this._repeat ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (t.prototype.totalDuration.call(this),
            this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat),
            this._totalDuration)
        }
        ,
        u.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            t > this._duration && (t = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(t, e)) : this._time
        }
        ,
        u.repeat = function(t) {
            return arguments.length ? (this._repeat = t,
            this._uncache(!0)) : this._repeat
        }
        ,
        u.repeatDelay = function(t) {
            return arguments.length ? (this._repeatDelay = t,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        u.yoyo = function(t) {
            return arguments.length ? (this._yoyo = t,
            this) : this._yoyo
        }
        ,
        u.currentLabel = function(t) {
            return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + 1e-8)
        }
        ,
        n
    }, !0),
    function() {
        var t = 180 / Math.PI
          , e = []
          , i = []
          , n = []
          , r = {}
          , s = _gsScope._gsDefine.globals
          , o = function(t, e, i, n) {
            this.a = t,
            this.b = e,
            this.c = i,
            this.d = n,
            this.da = n - t,
            this.ca = i - t,
            this.ba = e - t
        }
          , a = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,"
          , l = function(t, e, i, n) {
            var r = {
                a: t
            }
              , s = {}
              , o = {}
              , a = {
                c: n
            }
              , l = (t + e) / 2
              , h = (e + i) / 2
              , u = (i + n) / 2
              , c = (l + h) / 2
              , p = (h + u) / 2
              , f = (p - c) / 8;
            return r.b = l + (t - l) / 4,
            s.b = c + f,
            r.c = s.a = (r.b + s.b) / 2,
            s.c = o.a = (c + p) / 2,
            o.b = p - f,
            a.b = u + (n - u) / 4,
            o.c = a.a = (o.b + a.b) / 2,
            [r, s, o, a]
        }
          , h = function(t, r, s, o, a) {
            var h, u, c, p, f, d, m, _, g, v, y, T, w, x = t.length - 1, b = 0, P = t[0].a;
            for (h = 0; x > h; h++)
                f = t[b],
                u = f.a,
                c = f.d,
                p = t[b + 1].d,
                a ? (y = e[h],
                T = i[h],
                w = .25 * (T + y) * r / (o ? .5 : n[h] || .5),
                d = c - (c - u) * (o ? .5 * r : 0 !== y ? w / y : 0),
                m = c + (p - c) * (o ? .5 * r : 0 !== T ? w / T : 0),
                _ = c - (d + ((m - d) * (3 * y / (y + T) + .5) / 4 || 0))) : (d = c - .5 * (c - u) * r,
                m = c + .5 * (p - c) * r,
                _ = c - (d + m) / 2),
                d += _,
                m += _,
                f.c = g = d,
                f.b = 0 !== h ? P : P = f.a + .6 * (f.c - f.a),
                f.da = c - u,
                f.ca = g - u,
                f.ba = P - u,
                s ? (v = l(u, P, g, c),
                t.splice(b, 1, v[0], v[1], v[2], v[3]),
                b += 4) : b++,
                P = m;
            f = t[b],
            f.b = P,
            f.c = P + .4 * (f.d - P),
            f.da = f.d - f.a,
            f.ca = f.c - f.a,
            f.ba = P - f.a,
            s && (v = l(f.a, P, f.c, f.d),
            t.splice(b, 1, v[0], v[1], v[2], v[3]))
        }
          , u = function(t, n, r, s) {
            var a, l, h, u, c, p, f = [];
            if (s)
                for (t = [s].concat(t),
                l = t.length; --l > -1; )
                    "string" == typeof (p = t[l][n]) && "=" === p.charAt(1) && (t[l][n] = s[n] + Number(p.charAt(0) + p.substr(2)));
            if (a = t.length - 2,
            0 > a)
                return f[0] = new o(t[0][n],0,0,t[-1 > a ? 0 : 1][n]),
                f;
            for (l = 0; a > l; l++)
                h = t[l][n],
                u = t[l + 1][n],
                f[l] = new o(h,0,0,u),
                r && (c = t[l + 2][n],
                e[l] = (e[l] || 0) + (u - h) * (u - h),
                i[l] = (i[l] || 0) + (c - u) * (c - u));
            return f[l] = new o(t[l][n],0,0,t[l + 1][n]),
            f
        }
          , c = function(t, s, o, l, c, p) {
            var f, d, m, _, g, v, y, T, w = {}, x = [], b = p || t[0];
            c = "string" == typeof c ? "," + c + "," : a,
            null == s && (s = 1);
            for (d in t[0])
                x.push(d);
            if (t.length > 1) {
                for (T = t[t.length - 1],
                y = !0,
                f = x.length; --f > -1; )
                    if (d = x[f],
                    Math.abs(b[d] - T[d]) > .05) {
                        y = !1;
                        break
                    }
                y && (t = t.concat(),
                p && t.unshift(p),
                t.push(t[1]),
                p = t[t.length - 3])
            }
            for (e.length = i.length = n.length = 0,
            f = x.length; --f > -1; )
                d = x[f],
                r[d] = -1 !== c.indexOf("," + d + ","),
                w[d] = u(t, d, r[d], p);
            for (f = e.length; --f > -1; )
                e[f] = Math.sqrt(e[f]),
                i[f] = Math.sqrt(i[f]);
            if (!l) {
                for (f = x.length; --f > -1; )
                    if (r[d])
                        for (m = w[x[f]],
                        v = m.length - 1,
                        _ = 0; v > _; _++)
                            g = m[_ + 1].da / i[_] + m[_].da / e[_],
                            n[_] = (n[_] || 0) + g * g;
                for (f = n.length; --f > -1; )
                    n[f] = Math.sqrt(n[f])
            }
            for (f = x.length,
            _ = o ? 4 : 1; --f > -1; )
                d = x[f],
                m = w[d],
                h(m, s, o, l, r[d]),
                y && (m.splice(0, _),
                m.splice(m.length - _, _));
            return w
        }
          , p = function(t, e, i) {
            e = e || "soft";
            var n, r, s, a, l, h, u, c, p, f, d, m = {}, _ = "cubic" === e ? 3 : 2, g = "soft" === e, v = [];
            if (g && i && (t = [i].concat(t)),
            null == t || _ + 1 > t.length)
                throw "invalid Bezier data";
            for (p in t[0])
                v.push(p);
            for (h = v.length; --h > -1; ) {
                for (p = v[h],
                m[p] = l = [],
                f = 0,
                c = t.length,
                u = 0; c > u; u++)
                    n = null == i ? t[u][p] : "string" == typeof (d = t[u][p]) && "=" === d.charAt(1) ? i[p] + Number(d.charAt(0) + d.substr(2)) : Number(d),
                    g && u > 1 && c - 1 > u && (l[f++] = (n + l[f - 2]) / 2),
                    l[f++] = n;
                for (c = f - _ + 1,
                f = 0,
                u = 0; c > u; u += _)
                    n = l[u],
                    r = l[u + 1],
                    s = l[u + 2],
                    a = 2 === _ ? 0 : l[u + 3],
                    l[f++] = d = 3 === _ ? new o(n,r,s,a) : new o(n,(2 * r + n) / 3,(2 * r + s) / 3,s);
                l.length = f
            }
            return m
        }
          , f = function(t, e, i) {
            for (var n, r, s, o, a, l, h, u, c, p, f, d = 1 / i, m = t.length; --m > -1; )
                for (p = t[m],
                s = p.a,
                o = p.d - s,
                a = p.c - s,
                l = p.b - s,
                n = r = 0,
                u = 1; i >= u; u++)
                    h = d * u,
                    c = 1 - h,
                    n = r - (r = (h * h * o + 3 * c * (h * a + c * l)) * h),
                    f = m * i + u - 1,
                    e[f] = (e[f] || 0) + n * n
        }
          , d = function(t, e) {
            e = e >> 0 || 6;
            var i, n, r, s, o = [], a = [], l = 0, h = 0, u = e - 1, c = [], p = [];
            for (i in t)
                f(t[i], o, e);
            for (r = o.length,
            n = 0; r > n; n++)
                l += Math.sqrt(o[n]),
                s = n % e,
                p[s] = l,
                s === u && (h += l,
                s = n / e >> 0,
                c[s] = p,
                a[s] = h,
                l = 0,
                p = []);
            return {
                length: h,
                lengths: a,
                segments: c
            }
        }
          , m = _gsScope._gsDefine.plugin({
            propName: "bezier",
            priority: -1,
            version: "1.3.4",
            API: 2,
            global: !0,
            init: function(t, e, i) {
                this._target = t,
                e instanceof Array && (e = {
                    values: e
                }),
                this._func = {},
                this._round = {},
                this._props = [],
                this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
                var n, r, s, o, a, l = e.values || [], h = {}, u = l[0], f = e.autoRotate || i.vars.orientToBezier;
                this._autoRotate = f ? f instanceof Array ? f : [["x", "y", "rotation", f === !0 ? 0 : Number(f) || 0]] : null;
                for (n in u)
                    this._props.push(n);
                for (s = this._props.length; --s > -1; )
                    n = this._props[s],
                    this._overwriteProps.push(n),
                    r = this._func[n] = "function" == typeof t[n],
                    h[n] = r ? t[n.indexOf("set") || "function" != typeof t["get" + n.substr(3)] ? n : "get" + n.substr(3)]() : parseFloat(t[n]),
                    a || h[n] !== l[0][n] && (a = h);
                if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? c(l, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, a) : p(l, e.type, h),
                this._segCount = this._beziers[n].length,
                this._timeRes) {
                    var m = d(this._beziers, this._timeRes);
                    this._length = m.length,
                    this._lengths = m.lengths,
                    this._segments = m.segments,
                    this._l1 = this._li = this._s1 = this._si = 0,
                    this._l2 = this._lengths[0],
                    this._curSeg = this._segments[0],
                    this._s2 = this._curSeg[0],
                    this._prec = 1 / this._curSeg.length
                }
                if (f = this._autoRotate)
                    for (this._initialRotations = [],
                    f[0]instanceof Array || (this._autoRotate = f = [f]),
                    s = f.length; --s > -1; ) {
                        for (o = 0; 3 > o; o++)
                            n = f[s][o],
                            this._func[n] = "function" == typeof t[n] ? t[n.indexOf("set") || "function" != typeof t["get" + n.substr(3)] ? n : "get" + n.substr(3)] : !1;
                        n = f[s][2],
                        this._initialRotations[s] = this._func[n] ? this._func[n].call(this._target) : this._target[n]
                    }
                return this._startRatio = i.vars.runBackwards ? 1 : 0,
                !0
            },
            set: function(e) {
                var i, n, r, s, o, a, l, h, u, c, p = this._segCount, f = this._func, d = this._target, m = e !== this._startRatio;
                if (this._timeRes) {
                    if (u = this._lengths,
                    c = this._curSeg,
                    e *= this._length,
                    r = this._li,
                    e > this._l2 && p - 1 > r) {
                        for (h = p - 1; h > r && e >= (this._l2 = u[++r]); )
                            ;
                        this._l1 = u[r - 1],
                        this._li = r,
                        this._curSeg = c = this._segments[r],
                        this._s2 = c[this._s1 = this._si = 0]
                    } else if (this._l1 > e && r > 0) {
                        for (; r > 0 && (this._l1 = u[--r]) >= e; )
                            ;
                        0 === r && this._l1 > e ? this._l1 = 0 : r++,
                        this._l2 = u[r],
                        this._li = r,
                        this._curSeg = c = this._segments[r],
                        this._s1 = c[(this._si = c.length - 1) - 1] || 0,
                        this._s2 = c[this._si]
                    }
                    if (i = r,
                    e -= this._l1,
                    r = this._si,
                    e > this._s2 && c.length - 1 > r) {
                        for (h = c.length - 1; h > r && e >= (this._s2 = c[++r]); )
                            ;
                        this._s1 = c[r - 1],
                        this._si = r
                    } else if (this._s1 > e && r > 0) {
                        for (; r > 0 && (this._s1 = c[--r]) >= e; )
                            ;
                        0 === r && this._s1 > e ? this._s1 = 0 : r++,
                        this._s2 = c[r],
                        this._si = r
                    }
                    a = (r + (e - this._s1) / (this._s2 - this._s1)) * this._prec
                } else
                    i = 0 > e ? 0 : e >= 1 ? p - 1 : p * e >> 0,
                    a = (e - i * (1 / p)) * p;
                for (n = 1 - a,
                r = this._props.length; --r > -1; )
                    s = this._props[r],
                    o = this._beziers[s][i],
                    l = (a * a * o.da + 3 * n * (a * o.ca + n * o.ba)) * a + o.a,
                    this._round[s] && (l = Math.round(l)),
                    f[s] ? d[s](l) : d[s] = l;
                if (this._autoRotate) {
                    var _, g, v, y, T, w, x, b = this._autoRotate;
                    for (r = b.length; --r > -1; )
                        s = b[r][2],
                        w = b[r][3] || 0,
                        x = b[r][4] === !0 ? 1 : t,
                        o = this._beziers[b[r][0]],
                        _ = this._beziers[b[r][1]],
                        o && _ && (o = o[i],
                        _ = _[i],
                        g = o.a + (o.b - o.a) * a,
                        y = o.b + (o.c - o.b) * a,
                        g += (y - g) * a,
                        y += (o.c + (o.d - o.c) * a - y) * a,
                        v = _.a + (_.b - _.a) * a,
                        T = _.b + (_.c - _.b) * a,
                        v += (T - v) * a,
                        T += (_.c + (_.d - _.c) * a - T) * a,
                        l = m ? Math.atan2(T - v, y - g) * x + w : this._initialRotations[r],
                        f[s] ? d[s](l) : d[s] = l)
                }
            }
        })
          , _ = m.prototype;
        m.bezierThrough = c,
        m.cubicToQuadratic = l,
        m._autoCSS = !0,
        m.quadraticToCubic = function(t, e, i) {
            return new o(t,(2 * e + t) / 3,(2 * e + i) / 3,i)
        }
        ,
        m._cssRegister = function() {
            var t = s.CSSPlugin;
            if (t) {
                var e = t._internals
                  , i = e._parseToProxy
                  , n = e._setPluginRatio
                  , r = e.CSSPropTween;
                e._registerComplexSpecialProp("bezier", {
                    parser: function(t, e, s, o, a, l) {
                        e instanceof Array && (e = {
                            values: e
                        }),
                        l = new m;
                        var h, u, c, p = e.values, f = p.length - 1, d = [], _ = {};
                        if (0 > f)
                            return a;
                        for (h = 0; f >= h; h++)
                            c = i(t, p[h], o, a, l, f !== h),
                            d[h] = c.end;
                        for (u in e)
                            _[u] = e[u];
                        return _.values = d,
                        a = new r(t,"bezier",0,0,c.pt,2),
                        a.data = c,
                        a.plugin = l,
                        a.setRatio = n,
                        0 === _.autoRotate && (_.autoRotate = !0),
                        !_.autoRotate || _.autoRotate instanceof Array || (h = _.autoRotate === !0 ? 0 : Number(_.autoRotate),
                        _.autoRotate = null != c.end.left ? [["left", "top", "rotation", h, !1]] : null != c.end.x ? [["x", "y", "rotation", h, !1]] : !1),
                        _.autoRotate && (o._transform || o._enableTransforms(!1),
                        c.autoRotate = o._target._gsTransform),
                        l._onInitTween(c.proxy, _, o._tween),
                        a
                    }
                })
            }
        }
        ,
        _._roundProps = function(t, e) {
            for (var i = this._overwriteProps, n = i.length; --n > -1; )
                (t[i[n]] || t.bezier || t.bezierThrough) && (this._round[i[n]] = e)
        }
        ,
        _._kill = function(t) {
            var e, i, n = this._props;
            for (e in this._beziers)
                if (e in t)
                    for (delete this._beziers[e],
                    delete this._func[e],
                    i = n.length; --i > -1; )
                        n[i] === e && n.splice(i, 1);
            return this._super._kill.call(this, t)
        }
    }(),
    _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(t, e) {
        var i, n, r, s, o = function() {
            t.call(this, "css"),
            this._overwriteProps.length = 0,
            this.setRatio = o.prototype.setRatio
        }, a = _gsScope._gsDefine.globals, l = {}, h = o.prototype = new t("css");
        h.constructor = o,
        o.version = "1.15.1",
        o.API = 2,
        o.defaultTransformPerspective = 0,
        o.defaultSkewType = "compensated",
        h = "px",
        o.suffixMap = {
            top: h,
            right: h,
            bottom: h,
            left: h,
            width: h,
            height: h,
            fontSize: h,
            padding: h,
            margin: h,
            perspective: h,
            lineHeight: ""
        };
        var u, c, p, f, d, m, _ = /(?:\d|\-\d|\.\d|\-\.\d)+/g, g = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g, v = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, y = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, T = /(?:\d|\-|\+|=|#|\.)*/g, w = /opacity *= *([^)]*)/i, x = /opacity:([^;]*)/i, b = /alpha\(opacity *=.+?\)/i, P = /^(rgb|hsl)/, S = /([A-Z])/g, C = /-([a-z])/gi, O = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, E = function(t, e) {
            return e.toUpperCase()
        }, R = /(?:Left|Right|Width)/i, k = /(M11|M12|M21|M22)=[\d\-\.e]+/gi, z = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, A = /,(?=[^\)]*(?:\(|$))/gi, M = Math.PI / 180, L = 180 / Math.PI, I = {}, D = document, F = function(t) {
            return D.createElementNS ? D.createElementNS("http://www.w3.org/1999/xhtml", t) : D.createElement(t)
        }, N = F("div"), j = F("img"), W = o._internals = {
            _specialProps: l
        }, B = navigator.userAgent, X = function() {
            var t = B.indexOf("Android")
              , e = F("a");
            return p = -1 !== B.indexOf("Safari") && -1 === B.indexOf("Chrome") && (-1 === t || Number(B.substr(t + 8, 1)) > 3),
            d = p && 6 > Number(B.substr(B.indexOf("Version/") + 8, 1)),
            f = -1 !== B.indexOf("Firefox"),
            (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(B) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(B)) && (m = parseFloat(RegExp.$1)),
            e ? (e.style.cssText = "top:1px;opacity:.55;",
            /^0.55/.test(e.style.opacity)) : !1
        }(), Y = function(t) {
            return w.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
        }, q = function(t) {
            window.console && console.log(t)
        }, U = "", H = "", V = function(t, e) {
            e = e || N;
            var i, n, r = e.style;
            if (void 0 !== r[t])
                return t;
            for (t = t.charAt(0).toUpperCase() + t.substr(1),
            i = ["O", "Moz", "ms", "Ms", "Webkit"],
            n = 5; --n > -1 && void 0 === r[i[n] + t]; )
                ;
            return n >= 0 ? (H = 3 === n ? "ms" : i[n],
            U = "-" + H.toLowerCase() + "-",
            H + t) : null
        }, Q = D.defaultView ? D.defaultView.getComputedStyle : function() {}
        , G = o.getStyle = function(t, e, i, n, r) {
            var s;
            return X || "opacity" !== e ? (!n && t.style[e] ? s = t.style[e] : (i = i || Q(t)) ? s = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(S, "-$1").toLowerCase()) : t.currentStyle && (s = t.currentStyle[e]),
            null == r || s && "none" !== s && "auto" !== s && "auto auto" !== s ? s : r) : Y(t)
        }
        , $ = W.convertToPixels = function(t, i, n, r, s) {
            if ("px" === r || !r)
                return n;
            if ("auto" === r || !n)
                return 0;
            var a, l, h, u = R.test(i), c = t, p = N.style, f = 0 > n;
            if (f && (n = -n),
            "%" === r && -1 !== i.indexOf("border"))
                a = n / 100 * (u ? t.clientWidth : t.clientHeight);
            else {
                if (p.cssText = "border:0 solid red;position:" + G(t, "position") + ";line-height:0;",
                "%" !== r && c.appendChild)
                    p[u ? "borderLeftWidth" : "borderTopWidth"] = n + r;
                else {
                    if (c = t.parentNode || D.body,
                    l = c._gsCache,
                    h = e.ticker.frame,
                    l && u && l.time === h)
                        return l.width * n / 100;
                    p[u ? "width" : "height"] = n + r
                }
                c.appendChild(N),
                a = parseFloat(N[u ? "offsetWidth" : "offsetHeight"]),
                c.removeChild(N),
                u && "%" === r && o.cacheWidths !== !1 && (l = c._gsCache = c._gsCache || {},
                l.time = h,
                l.width = 100 * (a / n)),
                0 !== a || s || (a = $(t, i, n, r, !0))
            }
            return f ? -a : a
        }
        , Z = W.calculateOffset = function(t, e, i) {
            if ("absolute" !== G(t, "position", i))
                return 0;
            var n = "left" === e ? "Left" : "Top"
              , r = G(t, "margin" + n, i);
            return t["offset" + n] - ($(t, e, parseFloat(r), r.replace(T, "")) || 0)
        }
        , J = function(t, e) {
            var i, n, r = {};
            if (e = e || Q(t, null))
                for (i in e)
                    (-1 === i.indexOf("Transform") || xt === i) && (r[i] = e[i]);
            else if (e = t.currentStyle || t.style)
                for (i in e)
                    "string" == typeof i && void 0 === r[i] && (r[i.replace(C, E)] = e[i]);
            return X || (r.opacity = Y(t)),
            n = At(t, e, !1),
            r.rotation = n.rotation,
            r.skewX = n.skewX,
            r.scaleX = n.scaleX,
            r.scaleY = n.scaleY,
            r.x = n.x,
            r.y = n.y,
            St && (r.z = n.z,
            r.rotationX = n.rotationX,
            r.rotationY = n.rotationY,
            r.scaleZ = n.scaleZ),
            r.filters && delete r.filters,
            r
        }, K = function(t, e, i, n, r) {
            var s, o, a, l = {}, h = t.style;
            for (o in i)
                "cssText" !== o && "length" !== o && isNaN(o) && (e[o] !== (s = i[o]) || r && r[o]) && -1 === o.indexOf("Origin") && ("number" == typeof s || "string" == typeof s) && (l[o] = "auto" !== s || "left" !== o && "top" !== o ? "" !== s && "auto" !== s && "none" !== s || "string" != typeof e[o] || "" === e[o].replace(y, "") ? s : 0 : Z(t, o),
                void 0 !== h[o] && (a = new ft(h,o,h[o],a)));
            if (n)
                for (o in n)
                    "className" !== o && (l[o] = n[o]);
            return {
                difs: l,
                firstMPT: a
            }
        }, tt = {
            width: ["Left", "Right"],
            height: ["Top", "Bottom"]
        }, et = ["marginLeft", "marginRight", "marginTop", "marginBottom"], it = function(t, e, i) {
            var n = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight)
              , r = tt[e]
              , s = r.length;
            for (i = i || Q(t, null); --s > -1; )
                n -= parseFloat(G(t, "padding" + r[s], i, !0)) || 0,
                n -= parseFloat(G(t, "border" + r[s] + "Width", i, !0)) || 0;
            return n
        }, nt = function(t, e) {
            (null == t || "" === t || "auto" === t || "auto auto" === t) && (t = "0 0");
            var i = t.split(" ")
              , n = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : i[0]
              , r = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : i[1];
            return null == r ? r = "center" === n ? "50%" : "0" : "center" === r && (r = "50%"),
            ("center" === n || isNaN(parseFloat(n)) && -1 === (n + "").indexOf("=")) && (n = "50%"),
            e && (e.oxp = -1 !== n.indexOf("%"),
            e.oyp = -1 !== r.indexOf("%"),
            e.oxr = "=" === n.charAt(1),
            e.oyr = "=" === r.charAt(1),
            e.ox = parseFloat(n.replace(y, "")),
            e.oy = parseFloat(r.replace(y, ""))),
            n + " " + r + (i.length > 2 ? " " + i[2] : "")
        }, rt = function(t, e) {
            return "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e)
        }, st = function(t, e) {
            return null == t ? e : "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t)
        }, ot = function(t, e, i, n) {
            var r, s, o, a, l, h = 1e-6;
            return null == t ? a = e : "number" == typeof t ? a = t : (r = 360,
            s = t.split("_"),
            l = "=" === t.charAt(1),
            o = (l ? parseInt(t.charAt(0) + "1", 10) * parseFloat(s[0].substr(2)) : parseFloat(s[0])) * (-1 === t.indexOf("rad") ? 1 : L) - (l ? 0 : e),
            s.length && (n && (n[i] = e + o),
            -1 !== t.indexOf("short") && (o %= r,
            o !== o % (r / 2) && (o = 0 > o ? o + r : o - r)),
            -1 !== t.indexOf("_cw") && 0 > o ? o = (o + 9999999999 * r) % r - (0 | o / r) * r : -1 !== t.indexOf("ccw") && o > 0 && (o = (o - 9999999999 * r) % r - (0 | o / r) * r)),
            a = e + o),
            h > a && a > -h && (a = 0),
            a
        }, at = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0]
        }, lt = function(t, e, i) {
            return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t,
            0 | 255 * (1 > 6 * t ? e + 6 * (i - e) * t : .5 > t ? i : 2 > 3 * t ? e + 6 * (i - e) * (2 / 3 - t) : e) + .5
        }, ht = o.parseColor = function(t) {
            var e, i, n, r, s, o;
            return t && "" !== t ? "number" == typeof t ? [t >> 16, 255 & t >> 8, 255 & t] : ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)),
            at[t] ? at[t] : "#" === t.charAt(0) ? (4 === t.length && (e = t.charAt(1),
            i = t.charAt(2),
            n = t.charAt(3),
            t = "#" + e + e + i + i + n + n),
            t = parseInt(t.substr(1), 16),
            [t >> 16, 255 & t >> 8, 255 & t]) : "hsl" === t.substr(0, 3) ? (t = t.match(_),
            r = Number(t[0]) % 360 / 360,
            s = Number(t[1]) / 100,
            o = Number(t[2]) / 100,
            i = .5 >= o ? o * (s + 1) : o + s - o * s,
            e = 2 * o - i,
            t.length > 3 && (t[3] = Number(t[3])),
            t[0] = lt(r + 1 / 3, e, i),
            t[1] = lt(r, e, i),
            t[2] = lt(r - 1 / 3, e, i),
            t) : (t = t.match(_) || at.transparent,
            t[0] = Number(t[0]),
            t[1] = Number(t[1]),
            t[2] = Number(t[2]),
            t.length > 3 && (t[3] = Number(t[3])),
            t)) : at.black
        }
        , ut = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
        for (h in at)
            ut += "|" + h + "\\b";
        ut = RegExp(ut + ")", "gi");
        var ct = function(t, e, i, n) {
            if (null == t)
                return function(t) {
                    return t
                }
                ;
            var r, s = e ? (t.match(ut) || [""])[0] : "", o = t.split(s).join("").match(v) || [], a = t.substr(0, t.indexOf(o[0])), l = ")" === t.charAt(t.length - 1) ? ")" : "", h = -1 !== t.indexOf(" ") ? " " : ",", u = o.length, c = u > 0 ? o[0].replace(_, "") : "";
            return u ? r = e ? function(t) {
                var e, p, f, d;
                if ("number" == typeof t)
                    t += c;
                else if (n && A.test(t)) {
                    for (d = t.replace(A, "|").split("|"),
                    f = 0; d.length > f; f++)
                        d[f] = r(d[f]);
                    return d.join(",")
                }
                if (e = (t.match(ut) || [s])[0],
                p = t.split(e).join("").match(v) || [],
                f = p.length,
                u > f--)
                    for (; u > ++f; )
                        p[f] = i ? p[0 | (f - 1) / 2] : o[f];
                return a + p.join(h) + h + e + l + (-1 !== t.indexOf("inset") ? " inset" : "")
            }
            : function(t) {
                var e, s, p;
                if ("number" == typeof t)
                    t += c;
                else if (n && A.test(t)) {
                    for (s = t.replace(A, "|").split("|"),
                    p = 0; s.length > p; p++)
                        s[p] = r(s[p]);
                    return s.join(",")
                }
                if (e = t.match(v) || [],
                p = e.length,
                u > p--)
                    for (; u > ++p; )
                        e[p] = i ? e[0 | (p - 1) / 2] : o[p];
                return a + e.join(h) + l
            }
            : function(t) {
                return t
            }
        }
          , pt = function(t) {
            return t = t.split(","),
            function(e, i, n, r, s, o, a) {
                var l, h = (i + "").split(" ");
                for (a = {},
                l = 0; 4 > l; l++)
                    a[t[l]] = h[l] = h[l] || h[(l - 1) / 2 >> 0];
                return r.parse(e, a, s, o)
            }
        }
          , ft = (W._setPluginRatio = function(t) {
            this.plugin.setRatio(t);
            for (var e, i, n, r, s = this.data, o = s.proxy, a = s.firstMPT, l = 1e-6; a; )
                e = o[a.v],
                a.r ? e = Math.round(e) : l > e && e > -l && (e = 0),
                a.t[a.p] = e,
                a = a._next;
            if (s.autoRotate && (s.autoRotate.rotation = o.rotation),
            1 === t)
                for (a = s.firstMPT; a; ) {
                    if (i = a.t,
                    i.type) {
                        if (1 === i.type) {
                            for (r = i.xs0 + i.s + i.xs1,
                            n = 1; i.l > n; n++)
                                r += i["xn" + n] + i["xs" + (n + 1)];
                            i.e = r
                        }
                    } else
                        i.e = i.s + i.xs0;
                    a = a._next
                }
        }
        ,
        function(t, e, i, n, r) {
            this.t = t,
            this.p = e,
            this.v = i,
            this.r = r,
            n && (n._prev = this,
            this._next = n)
        }
        )
          , dt = (W._parseToProxy = function(t, e, i, n, r, s) {
            var o, a, l, h, u, c = n, p = {}, f = {}, d = i._transform, m = I;
            for (i._transform = null,
            I = e,
            n = u = i.parse(t, e, n, r),
            I = m,
            s && (i._transform = d,
            c && (c._prev = null,
            c._prev && (c._prev._next = null))); n && n !== c; ) {
                if (1 >= n.type && (a = n.p,
                f[a] = n.s + n.c,
                p[a] = n.s,
                s || (h = new ft(n,"s",a,h,n.r),
                n.c = 0),
                1 === n.type))
                    for (o = n.l; --o > 0; )
                        l = "xn" + o,
                        a = n.p + "_" + l,
                        f[a] = n.data[l],
                        p[a] = n[l],
                        s || (h = new ft(n,l,a,h,n.rxp[l]));
                n = n._next
            }
            return {
                proxy: p,
                end: f,
                firstMPT: h,
                pt: u
            }
        }
        ,
        W.CSSPropTween = function(t, e, n, r, o, a, l, h, u, c, p) {
            this.t = t,
            this.p = e,
            this.s = n,
            this.c = r,
            this.n = l || e,
            t instanceof dt || s.push(this.n),
            this.r = h,
            this.type = a || 0,
            u && (this.pr = u,
            i = !0),
            this.b = void 0 === c ? n : c,
            this.e = void 0 === p ? n + r : p,
            o && (this._next = o,
            o._prev = this)
        }
        )
          , mt = o.parseComplex = function(t, e, i, n, r, s, o, a, l, h) {
            i = i || s || "",
            o = new dt(t,e,0,0,o,h ? 2 : 1,null,!1,a,i,n),
            n += "";
            var c, p, f, d, m, v, y, T, w, x, b, S, C = i.split(", ").join(",").split(" "), O = n.split(", ").join(",").split(" "), E = C.length, R = u !== !1;
            for ((-1 !== n.indexOf(",") || -1 !== i.indexOf(",")) && (C = C.join(" ").replace(A, ", ").split(" "),
            O = O.join(" ").replace(A, ", ").split(" "),
            E = C.length),
            E !== O.length && (C = (s || "").split(" "),
            E = C.length),
            o.plugin = l,
            o.setRatio = h,
            c = 0; E > c; c++)
                if (d = C[c],
                m = O[c],
                T = parseFloat(d),
                T || 0 === T)
                    o.appendXtra("", T, rt(m, T), m.replace(g, ""), R && -1 !== m.indexOf("px"), !0);
                else if (r && ("#" === d.charAt(0) || at[d] || P.test(d)))
                    S = "," === m.charAt(m.length - 1) ? ")," : ")",
                    d = ht(d),
                    m = ht(m),
                    w = d.length + m.length > 6,
                    w && !X && 0 === m[3] ? (o["xs" + o.l] += o.l ? " transparent" : "transparent",
                    o.e = o.e.split(O[c]).join("transparent")) : (X || (w = !1),
                    o.appendXtra(w ? "rgba(" : "rgb(", d[0], m[0] - d[0], ",", !0, !0).appendXtra("", d[1], m[1] - d[1], ",", !0).appendXtra("", d[2], m[2] - d[2], w ? "," : S, !0),
                    w && (d = 4 > d.length ? 1 : d[3],
                    o.appendXtra("", d, (4 > m.length ? 1 : m[3]) - d, S, !1)));
                else if (v = d.match(_)) {
                    if (y = m.match(g),
                    !y || y.length !== v.length)
                        return o;
                    for (f = 0,
                    p = 0; v.length > p; p++)
                        b = v[p],
                        x = d.indexOf(b, f),
                        o.appendXtra(d.substr(f, x - f), Number(b), rt(y[p], b), "", R && "px" === d.substr(x + b.length, 2), 0 === p),
                        f = x + b.length;
                    o["xs" + o.l] += d.substr(f)
                } else
                    o["xs" + o.l] += o.l ? " " + d : d;
            if (-1 !== n.indexOf("=") && o.data) {
                for (S = o.xs0 + o.data.s,
                c = 1; o.l > c; c++)
                    S += o["xs" + c] + o.data["xn" + c];
                o.e = S + o["xs" + c]
            }
            return o.l || (o.type = -1,
            o.xs0 = o.e),
            o.xfirst || o
        }
          , _t = 9;
        for (h = dt.prototype,
        h.l = h.pr = 0; --_t > 0; )
            h["xn" + _t] = 0,
            h["xs" + _t] = "";
        h.xs0 = "",
        h._next = h._prev = h.xfirst = h.data = h.plugin = h.setRatio = h.rxp = null,
        h.appendXtra = function(t, e, i, n, r, s) {
            var o = this
              , a = o.l;
            return o["xs" + a] += s && a ? " " + t : t || "",
            i || 0 === a || o.plugin ? (o.l++,
            o.type = o.setRatio ? 2 : 1,
            o["xs" + o.l] = n || "",
            a > 0 ? (o.data["xn" + a] = e + i,
            o.rxp["xn" + a] = r,
            o["xn" + a] = e,
            o.plugin || (o.xfirst = new dt(o,"xn" + a,e,i,o.xfirst || o,0,o.n,r,o.pr),
            o.xfirst.xs0 = 0),
            o) : (o.data = {
                s: e + i
            },
            o.rxp = {},
            o.s = e,
            o.c = i,
            o.r = r,
            o)) : (o["xs" + a] += e + (n || ""),
            o)
        }
        ;
        var gt = function(t, e) {
            e = e || {},
            this.p = e.prefix ? V(t) || t : t,
            l[t] = l[this.p] = this,
            this.format = e.formatter || ct(e.defaultValue, e.color, e.collapsible, e.multi),
            e.parser && (this.parse = e.parser),
            this.clrs = e.color,
            this.multi = e.multi,
            this.keyword = e.keyword,
            this.dflt = e.defaultValue,
            this.pr = e.priority || 0
        }
          , vt = W._registerComplexSpecialProp = function(t, e, i) {
            "object" != typeof e && (e = {
                parser: i
            });
            var n, r, s = t.split(","), o = e.defaultValue;
            for (i = i || [o],
            n = 0; s.length > n; n++)
                e.prefix = 0 === n && e.prefix,
                e.defaultValue = i[n] || o,
                r = new gt(s[n],e)
        }
          , yt = function(t) {
            if (!l[t]) {
                var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                vt(t, {
                    parser: function(t, i, n, r, s, o, h) {
                        var u = a.com.greensock.plugins[e];
                        return u ? (u._cssRegister(),
                        l[n].parse(t, i, n, r, s, o, h)) : (q("Error: " + e + " js file not loaded."),
                        s)
                    }
                })
            }
        };
        h = gt.prototype,
        h.parseComplex = function(t, e, i, n, r, s) {
            var o, a, l, h, u, c, p = this.keyword;
            if (this.multi && (A.test(i) || A.test(e) ? (a = e.replace(A, "|").split("|"),
            l = i.replace(A, "|").split("|")) : p && (a = [e],
            l = [i])),
            l) {
                for (h = l.length > a.length ? l.length : a.length,
                o = 0; h > o; o++)
                    e = a[o] = a[o] || this.dflt,
                    i = l[o] = l[o] || this.dflt,
                    p && (u = e.indexOf(p),
                    c = i.indexOf(p),
                    u !== c && (i = -1 === c ? l : a,
                    i[o] += " " + p));
                e = a.join(", "),
                i = l.join(", ")
            }
            return mt(t, this.p, e, i, this.clrs, this.dflt, n, this.pr, r, s)
        }
        ,
        h.parse = function(t, e, i, n, s, o) {
            return this.parseComplex(t.style, this.format(G(t, this.p, r, !1, this.dflt)), this.format(e), s, o)
        }
        ,
        o.registerSpecialProp = function(t, e, i) {
            vt(t, {
                parser: function(t, n, r, s, o, a) {
                    var l = new dt(t,r,0,0,o,2,r,!1,i);
                    return l.plugin = a,
                    l.setRatio = e(t, n, s._tween, r),
                    l
                },
                priority: i
            })
        }
        ;
        var Tt, wt = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","), xt = V("transform"), bt = U + "transform", Pt = V("transformOrigin"), St = null !== V("perspective"), Ct = W.Transform = function() {
            this.perspective = parseFloat(o.defaultTransformPerspective) || 0,
            this.force3D = o.defaultForce3D !== !1 && St ? o.defaultForce3D || "auto" : !1
        }
        , Ot = window.SVGElement, Et = function(t, e, i) {
            var n, r = D.createElementNS("http://www.w3.org/2000/svg", t), s = /([a-z])([A-Z])/g;
            for (n in i)
                r.setAttributeNS(null, n.replace(s, "$1-$2").toLowerCase(), i[n]);
            return e.appendChild(r),
            r
        }, Rt = document.documentElement, kt = function() {
            var t, e, i, n = m || /Android/i.test(B) && !window.chrome;
            return D.createElementNS && !n && (t = Et("svg", Rt),
            e = Et("rect", t, {
                width: 100,
                height: 50,
                x: 100
            }),
            i = e.getBoundingClientRect().width,
            e.style[Pt] = "50% 50%",
            e.style[xt] = "scaleX(0.5)",
            n = i === e.getBoundingClientRect().width && !(f && St),
            Rt.removeChild(t)),
            n
        }(), zt = function(t, e, i) {
            var n = t.getBBox();
            e = nt(e).split(" "),
            i.xOrigin = (-1 !== e[0].indexOf("%") ? parseFloat(e[0]) / 100 * n.width : parseFloat(e[0])) + n.x,
            i.yOrigin = (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * n.height : parseFloat(e[1])) + n.y
        }, At = W.getTransform = function(t, e, i, n) {
            if (t._gsTransform && i && !n)
                return t._gsTransform;
            var s, a, l, h, u, c, p, f, d, m, _ = i ? t._gsTransform || new Ct : new Ct, g = 0 > _.scaleX, v = 2e-5, y = 1e5, T = St ? parseFloat(G(t, Pt, e, !1, "0 0 0").split(" ")[2]) || _.zOrigin || 0 : 0, w = parseFloat(o.defaultTransformPerspective) || 0;
            if (xt ? a = G(t, bt, e, !0) : t.currentStyle && (a = t.currentStyle.filter.match(k),
            a = a && 4 === a.length ? [a[0].substr(4), Number(a[2].substr(4)), Number(a[1].substr(4)), a[3].substr(4), _.x || 0, _.y || 0].join(",") : ""),
            s = !a || "none" === a || "matrix(1, 0, 0, 1, 0, 0)" === a,
            _.svg = !!(Ot && "function" == typeof t.getBBox && t.getCTM && (!t.parentNode || t.parentNode.getBBox && t.parentNode.getCTM)),
            _.svg && (zt(t, G(t, Pt, r, !1, "50% 50%") + "", _),
            Tt = o.useSVGTransformAttr || kt,
            l = t.getAttribute("transform"),
            s && l && -1 !== l.indexOf("matrix") && (a = l,
            s = 0)),
            !s) {
                for (l = (a || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [],
                h = l.length; --h > -1; )
                    u = Number(l[h]),
                    l[h] = (c = u - (u |= 0)) ? (0 | c * y + (0 > c ? -.5 : .5)) / y + u : u;
                if (16 === l.length) {
                    var x, b, P, S, C, O = l[0], E = l[1], R = l[2], z = l[3], A = l[4], M = l[5], I = l[6], D = l[7], F = l[8], N = l[9], j = l[10], W = l[12], B = l[13], X = l[14], Y = l[11], q = Math.atan2(I, j);
                    _.zOrigin && (X = -_.zOrigin,
                    W = F * X - l[12],
                    B = N * X - l[13],
                    X = j * X + _.zOrigin - l[14]),
                    _.rotationX = q * L,
                    q && (S = Math.cos(-q),
                    C = Math.sin(-q),
                    x = A * S + F * C,
                    b = M * S + N * C,
                    P = I * S + j * C,
                    F = A * -C + F * S,
                    N = M * -C + N * S,
                    j = I * -C + j * S,
                    Y = D * -C + Y * S,
                    A = x,
                    M = b,
                    I = P),
                    q = Math.atan2(F, j),
                    _.rotationY = q * L,
                    q && (S = Math.cos(-q),
                    C = Math.sin(-q),
                    x = O * S - F * C,
                    b = E * S - N * C,
                    P = R * S - j * C,
                    N = E * C + N * S,
                    j = R * C + j * S,
                    Y = z * C + Y * S,
                    O = x,
                    E = b,
                    R = P),
                    q = Math.atan2(E, O),
                    _.rotation = q * L,
                    q && (S = Math.cos(-q),
                    C = Math.sin(-q),
                    O = O * S + A * C,
                    b = E * S + M * C,
                    M = E * -C + M * S,
                    I = R * -C + I * S,
                    E = b),
                    _.rotationX && Math.abs(_.rotationX) + Math.abs(_.rotation) > 359.9 && (_.rotationX = _.rotation = 0,
                    _.rotationY += 180),
                    _.scaleX = (0 | Math.sqrt(O * O + E * E) * y + .5) / y,
                    _.scaleY = (0 | Math.sqrt(M * M + N * N) * y + .5) / y,
                    _.scaleZ = (0 | Math.sqrt(I * I + j * j) * y + .5) / y,
                    _.skewX = 0,
                    _.perspective = Y ? 1 / (0 > Y ? -Y : Y) : 0,
                    _.x = W,
                    _.y = B,
                    _.z = X
                } else if (!(St && !n && l.length && _.x === l[4] && _.y === l[5] && (_.rotationX || _.rotationY) || void 0 !== _.x && "none" === G(t, "display", e))) {
                    var U = l.length >= 6
                      , H = U ? l[0] : 1
                      , V = l[1] || 0
                      , Q = l[2] || 0
                      , $ = U ? l[3] : 1;
                    _.x = l[4] || 0,
                    _.y = l[5] || 0,
                    p = Math.sqrt(H * H + V * V),
                    f = Math.sqrt($ * $ + Q * Q),
                    d = H || V ? Math.atan2(V, H) * L : _.rotation || 0,
                    m = Q || $ ? Math.atan2(Q, $) * L + d : _.skewX || 0,
                    Math.abs(m) > 90 && 270 > Math.abs(m) && (g ? (p *= -1,
                    m += 0 >= d ? 180 : -180,
                    d += 0 >= d ? 180 : -180) : (f *= -1,
                    m += 0 >= m ? 180 : -180)),
                    _.scaleX = p,
                    _.scaleY = f,
                    _.rotation = d,
                    _.skewX = m,
                    St && (_.rotationX = _.rotationY = _.z = 0,
                    _.perspective = w,
                    _.scaleZ = 1)
                }
                _.zOrigin = T;
                for (h in _)
                    v > _[h] && _[h] > -v && (_[h] = 0)
            }
            return i && (t._gsTransform = _),
            _
        }
        , Mt = function(t) {
            var e, i, n = this.data, r = -n.rotation * M, s = r + n.skewX * M, o = 1e5, a = (0 | Math.cos(r) * n.scaleX * o) / o, l = (0 | Math.sin(r) * n.scaleX * o) / o, h = (0 | Math.sin(s) * -n.scaleY * o) / o, u = (0 | Math.cos(s) * n.scaleY * o) / o, c = this.t.style, p = this.t.currentStyle;
            if (p) {
                i = l,
                l = -h,
                h = -i,
                e = p.filter,
                c.filter = "";
                var f, d, _ = this.t.offsetWidth, g = this.t.offsetHeight, v = "absolute" !== p.position, y = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + l + ", M21=" + h + ", M22=" + u, x = n.x + _ * n.xPercent / 100, b = n.y + g * n.yPercent / 100;
                if (null != n.ox && (f = (n.oxp ? .01 * _ * n.ox : n.ox) - _ / 2,
                d = (n.oyp ? .01 * g * n.oy : n.oy) - g / 2,
                x += f - (f * a + d * l),
                b += d - (f * h + d * u)),
                v ? (f = _ / 2,
                d = g / 2,
                y += ", Dx=" + (f - (f * a + d * l) + x) + ", Dy=" + (d - (f * h + d * u) + b) + ")") : y += ", sizingMethod='auto expand')",
                c.filter = -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? e.replace(z, y) : y + " " + e,
                (0 === t || 1 === t) && 1 === a && 0 === l && 0 === h && 1 === u && (v && -1 === y.indexOf("Dx=0, Dy=0") || w.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf(e.indexOf("Alpha")) && c.removeAttribute("filter")),
                !v) {
                    var P, S, C, O = 8 > m ? 1 : -1;
                    for (f = n.ieOffsetX || 0,
                    d = n.ieOffsetY || 0,
                    n.ieOffsetX = Math.round((_ - ((0 > a ? -a : a) * _ + (0 > l ? -l : l) * g)) / 2 + x),
                    n.ieOffsetY = Math.round((g - ((0 > u ? -u : u) * g + (0 > h ? -h : h) * _)) / 2 + b),
                    _t = 0; 4 > _t; _t++)
                        S = et[_t],
                        P = p[S],
                        i = -1 !== P.indexOf("px") ? parseFloat(P) : $(this.t, S, parseFloat(P), P.replace(T, "")) || 0,
                        C = i !== n[S] ? 2 > _t ? -n.ieOffsetX : -n.ieOffsetY : 2 > _t ? f - n.ieOffsetX : d - n.ieOffsetY,
                        c[S] = (n[S] = Math.round(i - C * (0 === _t || 2 === _t ? 1 : O))) + "px"
                }
            }
        }, Lt = W.set3DTransformRatio = function(t) {
            var e, i, n, r, s, o, a, l, h, u, c, p, d, m, _, g, v, y, T, w, x, b = this.data, P = this.t.style, S = b.rotation * M, C = b.scaleX, O = b.scaleY, E = b.scaleZ, R = b.x, k = b.y, z = b.z, A = b.perspective;
            if (!(1 !== t && 0 !== t && b.force3D || b.force3D === !0 || b.rotationY || b.rotationX || 1 !== E || A || z))
                return void It.call(this, t);
            if (f && (m = 1e-4,
            m > C && C > -m && (C = E = 2e-5),
            m > O && O > -m && (O = E = 2e-5),
            !A || b.z || b.rotationX || b.rotationY || (A = 0)),
            S || b.skewX)
                _ = e = Math.cos(S),
                g = r = Math.sin(S),
                b.skewX && (S -= b.skewX * M,
                _ = Math.cos(S),
                g = Math.sin(S),
                "simple" === b.skewType && (v = Math.tan(b.skewX * M),
                v = Math.sqrt(1 + v * v),
                _ *= v,
                g *= v)),
                i = -g,
                s = _;
            else {
                if (!(b.rotationY || b.rotationX || 1 !== E || A || b.svg))
                    return void (P[xt] = (b.xPercent || b.yPercent ? "translate(" + b.xPercent + "%," + b.yPercent + "%) translate3d(" : "translate3d(") + R + "px," + k + "px," + z + "px)" + (1 !== C || 1 !== O ? " scale(" + C + "," + O + ")" : ""));
                e = s = 1,
                i = r = 0
            }
            h = 1,
            n = o = a = l = u = c = 0,
            p = A ? -1 / A : 0,
            d = b.zOrigin,
            m = 1e-6,
            w = ",",
            x = "0",
            S = b.rotationY * M,
            S && (_ = Math.cos(S),
            g = Math.sin(S),
            a = -g,
            u = p * -g,
            n = e * g,
            o = r * g,
            h = _,
            p *= _,
            e *= _,
            r *= _),
            S = b.rotationX * M,
            S && (_ = Math.cos(S),
            g = Math.sin(S),
            v = i * _ + n * g,
            y = s * _ + o * g,
            l = h * g,
            c = p * g,
            n = i * -g + n * _,
            o = s * -g + o * _,
            h *= _,
            p *= _,
            i = v,
            s = y),
            1 !== E && (n *= E,
            o *= E,
            h *= E,
            p *= E),
            1 !== O && (i *= O,
            s *= O,
            l *= O,
            c *= O),
            1 !== C && (e *= C,
            r *= C,
            a *= C,
            u *= C),
            (d || b.svg) && (d && (R += n * -d,
            k += o * -d,
            z += h * -d + d),
            b.svg && (R += b.xOrigin - (b.xOrigin * e + b.yOrigin * i),
            k += b.yOrigin - (b.xOrigin * r + b.yOrigin * s)),
            m > R && R > -m && (R = x),
            m > k && k > -m && (k = x),
            m > z && z > -m && (z = 0)),
            T = b.xPercent || b.yPercent ? "translate(" + b.xPercent + "%," + b.yPercent + "%) matrix3d(" : "matrix3d(",
            T += (m > e && e > -m ? x : e) + w + (m > r && r > -m ? x : r) + w + (m > a && a > -m ? x : a),
            T += w + (m > u && u > -m ? x : u) + w + (m > i && i > -m ? x : i) + w + (m > s && s > -m ? x : s),
            b.rotationX || b.rotationY ? (T += w + (m > l && l > -m ? x : l) + w + (m > c && c > -m ? x : c) + w + (m > n && n > -m ? x : n),
            T += w + (m > o && o > -m ? x : o) + w + (m > h && h > -m ? x : h) + w + (m > p && p > -m ? x : p) + w) : T += ",0,0,0,0,1,0,",
            T += R + w + k + w + z + w + (A ? 1 + -z / A : 1) + ")",
            P[xt] = T
        }
        , It = W.set2DTransformRatio = function(t) {
            var e, i, n, r, s, o, a, l, h, u, c, p = this.data, f = this.t, d = f.style, m = p.x, _ = p.y;
            return !(p.rotationX || p.rotationY || p.z || p.force3D === !0 || "auto" === p.force3D && 1 !== t && 0 !== t) || p.svg && Tt || !St ? (r = p.scaleX,
            s = p.scaleY,
            void (p.rotation || p.skewX || p.svg ? (e = p.rotation * M,
            i = e - p.skewX * M,
            n = 1e5,
            o = Math.cos(e) * r,
            a = Math.sin(e) * r,
            l = Math.sin(i) * -s,
            h = Math.cos(i) * s,
            p.svg && (m += p.xOrigin - (p.xOrigin * o + p.yOrigin * l),
            _ += p.yOrigin - (p.xOrigin * a + p.yOrigin * h),
            c = 1e-6,
            c > m && m > -c && (m = 0),
            c > _ && _ > -c && (_ = 0)),
            u = (0 | o * n) / n + "," + (0 | a * n) / n + "," + (0 | l * n) / n + "," + (0 | h * n) / n + "," + m + "," + _ + ")",
            p.svg && Tt ? f.setAttribute("transform", "matrix(" + u) : d[xt] = (p.xPercent || p.yPercent ? "translate(" + p.xPercent + "%," + p.yPercent + "%) matrix(" : "matrix(") + u) : d[xt] = (p.xPercent || p.yPercent ? "translate(" + p.xPercent + "%," + p.yPercent + "%) matrix(" : "matrix(") + r + ",0,0," + s + "," + m + "," + _ + ")")) : (this.setRatio = Lt,
            void Lt.call(this, t))
        }
        ;
        h = Ct.prototype,
        h.x = h.y = h.z = h.skewX = h.skewY = h.rotation = h.rotationX = h.rotationY = h.zOrigin = h.xPercent = h.yPercent = 0,
        h.scaleX = h.scaleY = h.scaleZ = 1,
        vt("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent", {
            parser: function(t, e, i, n, s, a, l) {
                if (n._lastParsedTransform === l)
                    return s;
                n._lastParsedTransform = l;
                var h, u, c, p, f, d, m, _ = n._transform = At(t, r, !0, l.parseTransform), g = t.style, v = 1e-6, y = wt.length, T = l, w = {};
                if ("string" == typeof T.transform && xt)
                    c = N.style,
                    c[xt] = T.transform,
                    c.display = "block",
                    c.position = "absolute",
                    D.body.appendChild(N),
                    h = At(N, null, !1),
                    D.body.removeChild(N);
                else if ("object" == typeof T) {
                    if (h = {
                        scaleX: st(null != T.scaleX ? T.scaleX : T.scale, _.scaleX),
                        scaleY: st(null != T.scaleY ? T.scaleY : T.scale, _.scaleY),
                        scaleZ: st(T.scaleZ, _.scaleZ),
                        x: st(T.x, _.x),
                        y: st(T.y, _.y),
                        z: st(T.z, _.z),
                        xPercent: st(T.xPercent, _.xPercent),
                        yPercent: st(T.yPercent, _.yPercent),
                        perspective: st(T.transformPerspective, _.perspective)
                    },
                    m = T.directionalRotation,
                    null != m)
                        if ("object" == typeof m)
                            for (c in m)
                                T[c] = m[c];
                        else
                            T.rotation = m;
                    "string" == typeof T.x && -1 !== T.x.indexOf("%") && (h.x = 0,
                    h.xPercent = st(T.x, _.xPercent)),
                    "string" == typeof T.y && -1 !== T.y.indexOf("%") && (h.y = 0,
                    h.yPercent = st(T.y, _.yPercent)),
                    h.rotation = ot("rotation"in T ? T.rotation : "shortRotation"in T ? T.shortRotation + "_short" : "rotationZ"in T ? T.rotationZ : _.rotation, _.rotation, "rotation", w),
                    St && (h.rotationX = ot("rotationX"in T ? T.rotationX : "shortRotationX"in T ? T.shortRotationX + "_short" : _.rotationX || 0, _.rotationX, "rotationX", w),
                    h.rotationY = ot("rotationY"in T ? T.rotationY : "shortRotationY"in T ? T.shortRotationY + "_short" : _.rotationY || 0, _.rotationY, "rotationY", w)),
                    h.skewX = null == T.skewX ? _.skewX : ot(T.skewX, _.skewX),
                    h.skewY = null == T.skewY ? _.skewY : ot(T.skewY, _.skewY),
                    (u = h.skewY - _.skewY) && (h.skewX += u,
                    h.rotation += u)
                }
                for (St && null != T.force3D && (_.force3D = T.force3D,
                d = !0),
                _.skewType = T.skewType || _.skewType || o.defaultSkewType,
                f = _.force3D || _.z || _.rotationX || _.rotationY || h.z || h.rotationX || h.rotationY || h.perspective,
                f || null == T.scale || (h.scaleZ = 1); --y > -1; )
                    i = wt[y],
                    p = h[i] - _[i],
                    (p > v || -v > p || null != T[i] || null != I[i]) && (d = !0,
                    s = new dt(_,i,_[i],p,s),
                    i in w && (s.e = w[i]),
                    s.xs0 = 0,
                    s.plugin = a,
                    n._overwriteProps.push(s.n));
                return p = T.transformOrigin,
                p && _.svg && (zt(t, nt(p), h),
                s = new dt(_,"xOrigin",_.xOrigin,h.xOrigin - _.xOrigin,s,-1,"transformOrigin"),
                s.b = _.xOrigin,
                s.e = s.xs0 = h.xOrigin,
                s = new dt(_,"yOrigin",_.yOrigin,h.yOrigin - _.yOrigin,s,-1,"transformOrigin"),
                s.b = _.yOrigin,
                s.e = s.xs0 = h.yOrigin,
                p = "0px 0px"),
                (p || St && f && _.zOrigin) && (xt ? (d = !0,
                i = Pt,
                p = (p || G(t, i, r, !1, "50% 50%")) + "",
                s = new dt(g,i,0,0,s,-1,"transformOrigin"),
                s.b = g[i],
                s.plugin = a,
                St ? (c = _.zOrigin,
                p = p.split(" "),
                _.zOrigin = (p.length > 2 && (0 === c || "0px" !== p[2]) ? parseFloat(p[2]) : c) || 0,
                s.xs0 = s.e = p[0] + " " + (p[1] || "50%") + " 0px",
                s = new dt(_,"zOrigin",0,0,s,-1,s.n),
                s.b = c,
                s.xs0 = s.e = _.zOrigin) : s.xs0 = s.e = p) : nt(p + "", _)),
                d && (n._transformType = _.svg && Tt || !f && 3 !== this._transformType ? 2 : 3),
                s
            },
            prefix: !0
        }),
        vt("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: !0,
            color: !0,
            multi: !0,
            keyword: "inset"
        }),
        vt("borderRadius", {
            defaultValue: "0px",
            parser: function(t, e, i, s, o) {
                e = this.format(e);
                var a, l, h, u, c, p, f, d, m, _, g, v, y, T, w, x, b = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], P = t.style;
                for (m = parseFloat(t.offsetWidth),
                _ = parseFloat(t.offsetHeight),
                a = e.split(" "),
                l = 0; b.length > l; l++)
                    this.p.indexOf("border") && (b[l] = V(b[l])),
                    c = u = G(t, b[l], r, !1, "0px"),
                    -1 !== c.indexOf(" ") && (u = c.split(" "),
                    c = u[0],
                    u = u[1]),
                    p = h = a[l],
                    f = parseFloat(c),
                    v = c.substr((f + "").length),
                    y = "=" === p.charAt(1),
                    y ? (d = parseInt(p.charAt(0) + "1", 10),
                    p = p.substr(2),
                    d *= parseFloat(p),
                    g = p.substr((d + "").length - (0 > d ? 1 : 0)) || "") : (d = parseFloat(p),
                    g = p.substr((d + "").length)),
                    "" === g && (g = n[i] || v),
                    g !== v && (T = $(t, "borderLeft", f, v),
                    w = $(t, "borderTop", f, v),
                    "%" === g ? (c = 100 * (T / m) + "%",
                    u = 100 * (w / _) + "%") : "em" === g ? (x = $(t, "borderLeft", 1, "em"),
                    c = T / x + "em",
                    u = w / x + "em") : (c = T + "px",
                    u = w + "px"),
                    y && (p = parseFloat(c) + d + g,
                    h = parseFloat(u) + d + g)),
                    o = mt(P, b[l], c + " " + u, p + " " + h, !1, "0px", o);
                return o
            },
            prefix: !0,
            formatter: ct("0px 0px 0px 0px", !1, !0)
        }),
        vt("backgroundPosition", {
            defaultValue: "0 0",
            parser: function(t, e, i, n, s, o) {
                var a, l, h, u, c, p, f = "background-position", d = r || Q(t, null), _ = this.format((d ? m ? d.getPropertyValue(f + "-x") + " " + d.getPropertyValue(f + "-y") : d.getPropertyValue(f) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), g = this.format(e);
                if (-1 !== _.indexOf("%") != (-1 !== g.indexOf("%")) && (p = G(t, "backgroundImage").replace(O, ""),
                p && "none" !== p)) {
                    for (a = _.split(" "),
                    l = g.split(" "),
                    j.setAttribute("src", p),
                    h = 2; --h > -1; )
                        _ = a[h],
                        u = -1 !== _.indexOf("%"),
                        u !== (-1 !== l[h].indexOf("%")) && (c = 0 === h ? t.offsetWidth - j.width : t.offsetHeight - j.height,
                        a[h] = u ? parseFloat(_) / 100 * c + "px" : 100 * (parseFloat(_) / c) + "%");
                    _ = a.join(" ")
                }
                return this.parseComplex(t.style, _, g, s, o)
            },
            formatter: nt
        }),
        vt("backgroundSize", {
            defaultValue: "0 0",
            formatter: nt
        }),
        vt("perspective", {
            defaultValue: "0px",
            prefix: !0
        }),
        vt("perspectiveOrigin", {
            defaultValue: "50% 50%",
            prefix: !0
        }),
        vt("transformStyle", {
            prefix: !0
        }),
        vt("backfaceVisibility", {
            prefix: !0
        }),
        vt("userSelect", {
            prefix: !0
        }),
        vt("margin", {
            parser: pt("marginTop,marginRight,marginBottom,marginLeft")
        }),
        vt("padding", {
            parser: pt("paddingTop,paddingRight,paddingBottom,paddingLeft")
        }),
        vt("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function(t, e, i, n, s, o) {
                var a, l, h;
                return 9 > m ? (l = t.currentStyle,
                h = 8 > m ? " " : ",",
                a = "rect(" + l.clipTop + h + l.clipRight + h + l.clipBottom + h + l.clipLeft + ")",
                e = this.format(e).split(",").join(h)) : (a = this.format(G(t, this.p, r, !1, this.dflt)),
                e = this.format(e)),
                this.parseComplex(t.style, a, e, s, o)
            }
        }),
        vt("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: !0,
            multi: !0
        }),
        vt("autoRound,strictUnits", {
            parser: function(t, e, i, n, r) {
                return r
            }
        }),
        vt("border", {
            defaultValue: "0px solid #000",
            parser: function(t, e, i, n, s, o) {
                return this.parseComplex(t.style, this.format(G(t, "borderTopWidth", r, !1, "0px") + " " + G(t, "borderTopStyle", r, !1, "solid") + " " + G(t, "borderTopColor", r, !1, "#000")), this.format(e), s, o)
            },
            color: !0,
            formatter: function(t) {
                var e = t.split(" ");
                return e[0] + " " + (e[1] || "solid") + " " + (t.match(ut) || ["#000"])[0]
            }
        }),
        vt("borderWidth", {
            parser: pt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
        }),
        vt("float,cssFloat,styleFloat", {
            parser: function(t, e, i, n, r) {
                var s = t.style
                  , o = "cssFloat"in s ? "cssFloat" : "styleFloat";
                return new dt(s,o,0,0,r,-1,i,!1,0,s[o],e)
            }
        });
        var Dt = function(t) {
            var e, i = this.t, n = i.filter || G(this.data, "filter") || "", r = 0 | this.s + this.c * t;
            100 === r && (-1 === n.indexOf("atrix(") && -1 === n.indexOf("radient(") && -1 === n.indexOf("oader(") ? (i.removeAttribute("filter"),
            e = !G(this.data, "filter")) : (i.filter = n.replace(b, ""),
            e = !0)),
            e || (this.xn1 && (i.filter = n = n || "alpha(opacity=" + r + ")"),
            -1 === n.indexOf("pacity") ? 0 === r && this.xn1 || (i.filter = n + " alpha(opacity=" + r + ")") : i.filter = n.replace(w, "opacity=" + r))
        };
        vt("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function(t, e, i, n, s, o) {
                var a = parseFloat(G(t, "opacity", r, !1, "1"))
                  , l = t.style
                  , h = "autoAlpha" === i;
                return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + a),
                h && 1 === a && "hidden" === G(t, "visibility", r) && 0 !== e && (a = 0),
                X ? s = new dt(l,"opacity",a,e - a,s) : (s = new dt(l,"opacity",100 * a,100 * (e - a),s),
                s.xn1 = h ? 1 : 0,
                l.zoom = 1,
                s.type = 2,
                s.b = "alpha(opacity=" + s.s + ")",
                s.e = "alpha(opacity=" + (s.s + s.c) + ")",
                s.data = t,
                s.plugin = o,
                s.setRatio = Dt),
                h && (s = new dt(l,"visibility",0,0,s,-1,null,!1,0,0 !== a ? "inherit" : "hidden",0 === e ? "hidden" : "inherit"),
                s.xs0 = "inherit",
                n._overwriteProps.push(s.n),
                n._overwriteProps.push(i)),
                s
            }
        });
        var Ft = function(t, e) {
            e && (t.removeProperty ? ("ms" === e.substr(0, 2) && (e = "M" + e.substr(1)),
            t.removeProperty(e.replace(S, "-$1").toLowerCase())) : t.removeAttribute(e))
        }
          , Nt = function(t) {
            if (this.t._gsClassPT = this,
            1 === t || 0 === t) {
                this.t.setAttribute("class", 0 === t ? this.b : this.e);
                for (var e = this.data, i = this.t.style; e; )
                    e.v ? i[e.p] = e.v : Ft(i, e.p),
                    e = e._next;
                1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
            } else
                this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
        };
        vt("className", {
            parser: function(t, e, n, s, o, a, l) {
                var h, u, c, p, f, d = t.getAttribute("class") || "", m = t.style.cssText;
                if (o = s._classNamePT = new dt(t,n,0,0,o,2),
                o.setRatio = Nt,
                o.pr = -11,
                i = !0,
                o.b = d,
                u = J(t, r),
                c = t._gsClassPT) {
                    for (p = {},
                    f = c.data; f; )
                        p[f.p] = 1,
                        f = f._next;
                    c.setRatio(1)
                }
                return t._gsClassPT = o,
                o.e = "=" !== e.charAt(1) ? e : d.replace(RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""),
                s._tween._duration && (t.setAttribute("class", o.e),
                h = K(t, u, J(t), l, p),
                t.setAttribute("class", d),
                o.data = h.firstMPT,
                t.style.cssText = m,
                o = o.xfirst = s.parse(t, h.difs, o, a)),
                o
            }
        });
        var jt = function(t) {
            if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                var e, i, n, r, s = this.t.style, o = l.transform.parse;
                if ("all" === this.e)
                    s.cssText = "",
                    r = !0;
                else
                    for (e = this.e.split(" ").join("").split(","),
                    n = e.length; --n > -1; )
                        i = e[n],
                        l[i] && (l[i].parse === o ? r = !0 : i = "transformOrigin" === i ? Pt : l[i].p),
                        Ft(s, i);
                r && (Ft(s, xt),
                this.t._gsTransform && delete this.t._gsTransform)
            }
        };
        for (vt("clearProps", {
            parser: function(t, e, n, r, s) {
                return s = new dt(t,n,0,0,s,2),
                s.setRatio = jt,
                s.e = e,
                s.pr = -10,
                s.data = r._tween,
                i = !0,
                s
            }
        }),
        h = "bezier,throwProps,physicsProps,physics2D".split(","),
        _t = h.length; _t--; )
            yt(h[_t]);
        h = o.prototype,
        h._firstPT = h._lastParsedTransform = h._transform = null,
        h._onInitTween = function(t, e, a) {
            if (!t.nodeType)
                return !1;
            this._target = t,
            this._tween = a,
            this._vars = e,
            u = e.autoRound,
            i = !1,
            n = e.suffixMap || o.suffixMap,
            r = Q(t, ""),
            s = this._overwriteProps;
            var l, h, f, m, _, g, v, y, T, w = t.style;
            if (c && "" === w.zIndex && (l = G(t, "zIndex", r),
            ("auto" === l || "" === l) && this._addLazySet(w, "zIndex", 0)),
            "string" == typeof e && (m = w.cssText,
            l = J(t, r),
            w.cssText = m + ";" + e,
            l = K(t, l, J(t)).difs,
            !X && x.test(e) && (l.opacity = parseFloat(RegExp.$1)),
            e = l,
            w.cssText = m),
            this._firstPT = h = this.parse(t, e, null),
            this._transformType) {
                for (T = 3 === this._transformType,
                xt ? p && (c = !0,
                "" === w.zIndex && (v = G(t, "zIndex", r),
                ("auto" === v || "" === v) && this._addLazySet(w, "zIndex", 0)),
                d && this._addLazySet(w, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (T ? "visible" : "hidden"))) : w.zoom = 1,
                f = h; f && f._next; )
                    f = f._next;
                y = new dt(t,"transform",0,0,null,2),
                this._linkCSSP(y, null, f),
                y.setRatio = T && St ? Lt : xt ? It : Mt,
                y.data = this._transform || At(t, r, !0),
                s.pop()
            }
            if (i) {
                for (; h; ) {
                    for (g = h._next,
                    f = m; f && f.pr > h.pr; )
                        f = f._next;
                    (h._prev = f ? f._prev : _) ? h._prev._next = h : m = h,
                    (h._next = f) ? f._prev = h : _ = h,
                    h = g
                }
                this._firstPT = m
            }
            return !0
        }
        ,
        h.parse = function(t, e, i, s) {
            var o, a, h, c, p, f, d, m, _, g, v = t.style;
            for (o in e)
                f = e[o],
                a = l[o],
                a ? i = a.parse(t, f, o, this, i, s, e) : (p = G(t, o, r) + "",
                _ = "string" == typeof f,
                "color" === o || "fill" === o || "stroke" === o || -1 !== o.indexOf("Color") || _ && P.test(f) ? (_ || (f = ht(f),
                f = (f.length > 3 ? "rgba(" : "rgb(") + f.join(",") + ")"),
                i = mt(v, o, p, f, !0, "transparent", i, 0, s)) : !_ || -1 === f.indexOf(" ") && -1 === f.indexOf(",") ? (h = parseFloat(p),
                d = h || 0 === h ? p.substr((h + "").length) : "",
                ("" === p || "auto" === p) && ("width" === o || "height" === o ? (h = it(t, o, r),
                d = "px") : "left" === o || "top" === o ? (h = Z(t, o, r),
                d = "px") : (h = "opacity" !== o ? 0 : 1,
                d = "")),
                g = _ && "=" === f.charAt(1),
                g ? (c = parseInt(f.charAt(0) + "1", 10),
                f = f.substr(2),
                c *= parseFloat(f),
                m = f.replace(T, "")) : (c = parseFloat(f),
                m = _ ? f.replace(T, "") : ""),
                "" === m && (m = o in n ? n[o] : d),
                f = c || 0 === c ? (g ? c + h : c) + m : e[o],
                d !== m && "" !== m && (c || 0 === c) && h && (h = $(t, o, h, d),
                "%" === m ? (h /= $(t, o, 100, "%") / 100,
                e.strictUnits !== !0 && (p = h + "%")) : "em" === m ? h /= $(t, o, 1, "em") : "px" !== m && (c = $(t, o, c, m),
                m = "px"),
                g && (c || 0 === c) && (f = c + h + m)),
                g && (c += h),
                !h && 0 !== h || !c && 0 !== c ? void 0 !== v[o] && (f || "NaN" != f + "" && null != f) ? (i = new dt(v,o,c || h || 0,0,i,-1,o,!1,0,p,f),
                i.xs0 = "none" !== f || "display" !== o && -1 === o.indexOf("Style") ? f : p) : q("invalid " + o + " tween value: " + e[o]) : (i = new dt(v,o,h,c - h,i,0,o,u !== !1 && ("px" === m || "zIndex" === o),0,p,f),
                i.xs0 = m)) : i = mt(v, o, p, f, !0, null, i, 0, s)),
                s && i && !i.plugin && (i.plugin = s);
            return i
        }
        ,
        h.setRatio = function(t) {
            var e, i, n, r = this._firstPT, s = 1e-6;
            if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                    for (; r; ) {
                        if (e = r.c * t + r.s,
                        r.r ? e = Math.round(e) : s > e && e > -s && (e = 0),
                        r.type)
                            if (1 === r.type)
                                if (n = r.l,
                                2 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2;
                                else if (3 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3;
                                else if (4 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4;
                                else if (5 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5;
                                else {
                                    for (i = r.xs0 + e + r.xs1,
                                    n = 1; r.l > n; n++)
                                        i += r["xn" + n] + r["xs" + (n + 1)];
                                    r.t[r.p] = i
                                }
                            else
                                -1 === r.type ? r.t[r.p] = r.xs0 : r.setRatio && r.setRatio(t);
                        else
                            r.t[r.p] = e + r.xs0;
                        r = r._next
                    }
                else
                    for (; r; )
                        2 !== r.type ? r.t[r.p] = r.b : r.setRatio(t),
                        r = r._next;
            else
                for (; r; )
                    2 !== r.type ? r.t[r.p] = r.e : r.setRatio(t),
                    r = r._next
        }
        ,
        h._enableTransforms = function(t) {
            this._transform = this._transform || At(this._target, r, !0),
            this._transformType = this._transform.svg && Tt || !t && 3 !== this._transformType ? 2 : 3
        }
        ;
        var Wt = function() {
            this.t[this.p] = this.e,
            this.data._linkCSSP(this, this._next, null, !0)
        };
        h._addLazySet = function(t, e, i) {
            var n = this._firstPT = new dt(t,e,0,0,this._firstPT,2);
            n.e = i,
            n.setRatio = Wt,
            n.data = this
        }
        ,
        h._linkCSSP = function(t, e, i, n) {
            return t && (e && (e._prev = t),
            t._next && (t._next._prev = t._prev),
            t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next,
            n = !0),
            i ? i._next = t : n || null !== this._firstPT || (this._firstPT = t),
            t._next = e,
            t._prev = i),
            t
        }
        ,
        h._kill = function(e) {
            var i, n, r, s = e;
            if (e.autoAlpha || e.alpha) {
                s = {};
                for (n in e)
                    s[n] = e[n];
                s.opacity = 1,
                s.autoAlpha && (s.visibility = 1)
            }
            return e.className && (i = this._classNamePT) && (r = i.xfirst,
            r && r._prev ? this._linkCSSP(r._prev, i._next, r._prev._prev) : r === this._firstPT && (this._firstPT = i._next),
            i._next && this._linkCSSP(i._next, i._next._next, r._prev),
            this._classNamePT = null),
            t.prototype._kill.call(this, s)
        }
        ;
        var Bt = function(t, e, i) {
            var n, r, s, o;
            if (t.slice)
                for (r = t.length; --r > -1; )
                    Bt(t[r], e, i);
            else
                for (n = t.childNodes,
                r = n.length; --r > -1; )
                    s = n[r],
                    o = s.type,
                    s.style && (e.push(J(s)),
                    i && i.push(s)),
                    1 !== o && 9 !== o && 11 !== o || !s.childNodes.length || Bt(s, e, i)
        };
        return o.cascadeTo = function(t, i, n) {
            var r, s, o, a = e.to(t, i, n), l = [a], h = [], u = [], c = [], p = e._internals.reservedProps;
            for (t = a._targets || a.target,
            Bt(t, h, c),
            a.render(i, !0),
            Bt(t, u),
            a.render(0, !0),
            a._enabled(!0),
            r = c.length; --r > -1; )
                if (s = K(c[r], h[r], u[r]),
                s.firstMPT) {
                    s = s.difs;
                    for (o in n)
                        p[o] && (s[o] = n[o]);
                    l.push(e.to(c[r], i, s))
                }
            return l
        }
        ,
        t.activate([o]),
        o
    }, !0),
    function() {
        var t = _gsScope._gsDefine.plugin({
            propName: "roundProps",
            priority: -1,
            API: 2,
            init: function(t, e, i) {
                return this._tween = i,
                !0
            }
        })
          , e = t.prototype;
        e._onInitAllProps = function() {
            for (var t, e, i, n = this._tween, r = n.vars.roundProps instanceof Array ? n.vars.roundProps : n.vars.roundProps.split(","), s = r.length, o = {}, a = n._propLookup.roundProps; --s > -1; )
                o[r[s]] = 1;
            for (s = r.length; --s > -1; )
                for (t = r[s],
                e = n._firstPT; e; )
                    i = e._next,
                    e.pg ? e.t._roundProps(o, !0) : e.n === t && (this._add(e.t, t, e.s, e.c),
                    i && (i._prev = e._prev),
                    e._prev ? e._prev._next = i : n._firstPT === e && (n._firstPT = i),
                    e._next = e._prev = null,
                    n._propLookup[t] = a),
                    e = i;
            return !1
        }
        ,
        e._add = function(t, e, i, n) {
            this._addTween(t, e, i, i + n, e, !0),
            this._overwriteProps.push(e)
        }
    }(),
    _gsScope._gsDefine.plugin({
        propName: "attr",
        API: 2,
        version: "0.3.3",
        init: function(t, e) {
            var i, n, r;
            if ("function" != typeof t.setAttribute)
                return !1;
            this._target = t,
            this._proxy = {},
            this._start = {},
            this._end = {};
            for (i in e)
                this._start[i] = this._proxy[i] = n = t.getAttribute(i),
                r = this._addTween(this._proxy, i, parseFloat(n), e[i], i),
                this._end[i] = r ? r.s + r.c : e[i],
                this._overwriteProps.push(i);
            return !0
        },
        set: function(t) {
            this._super.setRatio.call(this, t);
            for (var e, i = this._overwriteProps, n = i.length, r = 1 === t ? this._end : t ? this._proxy : this._start; --n > -1; )
                e = i[n],
                this._target.setAttribute(e, r[e] + "")
        }
    }),
    _gsScope._gsDefine.plugin({
        propName: "directionalRotation",
        version: "0.2.1",
        API: 2,
        init: function(t, e) {
            "object" != typeof e && (e = {
                rotation: e
            }),
            this.finals = {};
            var i, n, r, s, o, a, l = e.useRadians === !0 ? 2 * Math.PI : 360, h = 1e-6;
            for (i in e)
                "useRadians" !== i && (a = (e[i] + "").split("_"),
                n = a[0],
                r = parseFloat("function" != typeof t[i] ? t[i] : t[i.indexOf("set") || "function" != typeof t["get" + i.substr(3)] ? i : "get" + i.substr(3)]()),
                s = this.finals[i] = "string" == typeof n && "=" === n.charAt(1) ? r + parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2)) : Number(n) || 0,
                o = s - r,
                a.length && (n = a.join("_"),
                -1 !== n.indexOf("short") && (o %= l,
                o !== o % (l / 2) && (o = 0 > o ? o + l : o - l)),
                -1 !== n.indexOf("_cw") && 0 > o ? o = (o + 9999999999 * l) % l - (0 | o / l) * l : -1 !== n.indexOf("ccw") && o > 0 && (o = (o - 9999999999 * l) % l - (0 | o / l) * l)),
                (o > h || -h > o) && (this._addTween(t, i, r, r + o, i),
                this._overwriteProps.push(i)));
            return !0
        },
        set: function(t) {
            var e;
            if (1 !== t)
                this._super.setRatio.call(this, t);
            else
                for (e = this._firstPT; e; )
                    e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p],
                    e = e._next
        }
    })._autoCSS = !0,
    _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(t) {
        var e, i, n, r = _gsScope.GreenSockGlobals || _gsScope, s = r.com.greensock, o = 2 * Math.PI, a = Math.PI / 2, l = s._class, h = function(e, i) {
            var n = l("easing." + e, function() {}, !0)
              , r = n.prototype = new t;
            return r.constructor = n,
            r.getRatio = i,
            n
        }, u = t.register || function() {}
        , c = function(t, e, i, n) {
            var r = l("easing." + t, {
                easeOut: new e,
                easeIn: new i,
                easeInOut: new n
            }, !0);
            return u(r, t),
            r
        }, p = function(t, e, i) {
            this.t = t,
            this.v = e,
            i && (this.next = i,
            i.prev = this,
            this.c = i.v - e,
            this.gap = i.t - t)
        }, f = function(e, i) {
            var n = l("easing." + e, function(t) {
                this._p1 = t || 0 === t ? t : 1.70158,
                this._p2 = 1.525 * this._p1
            }, !0)
              , r = n.prototype = new t;
            return r.constructor = n,
            r.getRatio = i,
            r.config = function(t) {
                return new n(t)
            }
            ,
            n
        }, d = c("Back", f("BackOut", function(t) {
            return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
        }), f("BackIn", function(t) {
            return t * t * ((this._p1 + 1) * t - this._p1)
        }), f("BackInOut", function(t) {
            return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
        })), m = l("easing.SlowMo", function(t, e, i) {
            e = e || 0 === e ? e : .7,
            null == t ? t = .7 : t > 1 && (t = 1),
            this._p = 1 !== t ? e : 0,
            this._p1 = (1 - t) / 2,
            this._p2 = t,
            this._p3 = this._p1 + this._p2,
            this._calcEnd = i === !0
        }, !0), _ = m.prototype = new t;
        return _.constructor = m,
        _.getRatio = function(t) {
            var e = t + (.5 - t) * this._p;
            return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
        }
        ,
        m.ease = new m(.7,.7),
        _.config = m.config = function(t, e, i) {
            return new m(t,e,i)
        }
        ,
        e = l("easing.SteppedEase", function(t) {
            t = t || 1,
            this._p1 = 1 / t,
            this._p2 = t + 1
        }, !0),
        _ = e.prototype = new t,
        _.constructor = e,
        _.getRatio = function(t) {
            return 0 > t ? t = 0 : t >= 1 && (t = .999999999),
            (this._p2 * t >> 0) * this._p1
        }
        ,
        _.config = e.config = function(t) {
            return new e(t)
        }
        ,
        i = l("easing.RoughEase", function(e) {
            e = e || {};
            for (var i, n, r, s, o, a, l = e.taper || "none", h = [], u = 0, c = 0 | (e.points || 20), f = c, d = e.randomize !== !1, m = e.clamp === !0, _ = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --f > -1; )
                i = d ? Math.random() : 1 / c * f,
                n = _ ? _.getRatio(i) : i,
                "none" === l ? r = g : "out" === l ? (s = 1 - i,
                r = s * s * g) : "in" === l ? r = i * i * g : .5 > i ? (s = 2 * i,
                r = .5 * s * s * g) : (s = 2 * (1 - i),
                r = .5 * s * s * g),
                d ? n += Math.random() * r - .5 * r : f % 2 ? n += .5 * r : n -= .5 * r,
                m && (n > 1 ? n = 1 : 0 > n && (n = 0)),
                h[u++] = {
                    x: i,
                    y: n
                };
            for (h.sort(function(t, e) {
                return t.x - e.x
            }),
            a = new p(1,1,null),
            f = c; --f > -1; )
                o = h[f],
                a = new p(o.x,o.y,a);
            this._prev = new p(0,0,0 !== a.t ? a : a.next)
        }, !0),
        _ = i.prototype = new t,
        _.constructor = i,
        _.getRatio = function(t) {
            var e = this._prev;
            if (t > e.t) {
                for (; e.next && t >= e.t; )
                    e = e.next;
                e = e.prev
            } else
                for (; e.prev && e.t >= t; )
                    e = e.prev;
            return this._prev = e,
            e.v + (t - e.t) / e.gap * e.c
        }
        ,
        _.config = function(t) {
            return new i(t)
        }
        ,
        i.ease = new i,
        c("Bounce", h("BounceOut", function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        }), h("BounceIn", function(t) {
            return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
        }), h("BounceInOut", function(t) {
            var e = .5 > t;
            return t = e ? 1 - 2 * t : 2 * t - 1,
            t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375,
            e ? .5 * (1 - t) : .5 * t + .5
        })),
        c("Circ", h("CircOut", function(t) {
            return Math.sqrt(1 - (t -= 1) * t)
        }), h("CircIn", function(t) {
            return -(Math.sqrt(1 - t * t) - 1)
        }), h("CircInOut", function(t) {
            return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        })),
        n = function(e, i, n) {
            var r = l("easing." + e, function(t, e) {
                this._p1 = t || 1,
                this._p2 = e || n,
                this._p3 = this._p2 / o * (Math.asin(1 / this._p1) || 0)
            }, !0)
              , s = r.prototype = new t;
            return s.constructor = r,
            s.getRatio = i,
            s.config = function(t, e) {
                return new r(t,e)
            }
            ,
            r
        }
        ,
        c("Elastic", n("ElasticOut", function(t) {
            return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * o / this._p2) + 1
        }, .3), n("ElasticIn", function(t) {
            return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * o / this._p2))
        }, .3), n("ElasticInOut", function(t) {
            return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * o / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * o / this._p2) + 1
        }, .45)),
        c("Expo", h("ExpoOut", function(t) {
            return 1 - Math.pow(2, -10 * t)
        }), h("ExpoIn", function(t) {
            return Math.pow(2, 10 * (t - 1)) - .001
        }), h("ExpoInOut", function(t) {
            return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
        })),
        c("Sine", h("SineOut", function(t) {
            return Math.sin(t * a)
        }), h("SineIn", function(t) {
            return -Math.cos(t * a) + 1
        }), h("SineInOut", function(t) {
            return -.5 * (Math.cos(Math.PI * t) - 1)
        })),
        l("easing.EaseLookup", {
            find: function(e) {
                return t.map[e]
            }
        }, !0),
        u(r.SlowMo, "SlowMo", "ease,"),
        u(i, "RoughEase", "ease,"),
        u(e, "SteppedEase", "ease,"),
        d
    }, !0)
}),
_gsScope._gsDefine && _gsScope._gsQueue.pop()(),
function(t, e) {
    "use strict";
    var i = t.GreenSockGlobals = t.GreenSockGlobals || t;
    if (!i.TweenLite) {
        var n, r, s, o, a, l = function(t) {
            var e, n = t.split("."), r = i;
            for (e = 0; n.length > e; e++)
                r[n[e]] = r = r[n[e]] || {};
            return r
        }, h = l("com.greensock"), u = 1e-10, c = function(t) {
            var e, i = [], n = t.length;
            for (e = 0; e !== n; i.push(t[e++]))
                ;
            return i
        }, p = function() {}, f = function() {
            var t = Object.prototype.toString
              , e = t.call([]);
            return function(i) {
                return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
            }
        }(), d = {}, m = function(n, r, s, o) {
            this.sc = d[n] ? d[n].sc : [],
            d[n] = this,
            this.gsClass = null,
            this.func = s;
            var a = [];
            this.check = function(h) {
                for (var u, c, p, f, _ = r.length, g = _; --_ > -1; )
                    (u = d[r[_]] || new m(r[_],[])).gsClass ? (a[_] = u.gsClass,
                    g--) : h && u.sc.push(this);
                if (0 === g && s)
                    for (c = ("com.greensock." + n).split("."),
                    p = c.pop(),
                    f = l(c.join("."))[p] = this.gsClass = s.apply(s, a),
                    o && (i[p] = f,
                    "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + n.split(".").pop(), [], function() {
                        return f
                    }) : n === e && "undefined" != typeof module && module.exports && (module.exports = f)),
                    _ = 0; this.sc.length > _; _++)
                        this.sc[_].check()
            }
            ,
            this.check(!0)
        }, _ = t._gsDefine = function(t, e, i, n) {
            return new m(t,e,i,n)
        }
        , g = h._class = function(t, e, i) {
            return e = e || function() {}
            ,
            _(t, [], function() {
                return e
            }, i),
            e
        }
        ;
        _.globals = i;
        var v = [0, 0, 1, 1]
          , y = []
          , T = g("easing.Ease", function(t, e, i, n) {
            this._func = t,
            this._type = i || 0,
            this._power = n || 0,
            this._params = e ? v.concat(e) : v
        }, !0)
          , w = T.map = {}
          , x = T.register = function(t, e, i, n) {
            for (var r, s, o, a, l = e.split(","), u = l.length, c = (i || "easeIn,easeOut,easeInOut").split(","); --u > -1; )
                for (s = l[u],
                r = n ? g("easing." + s, null, !0) : h.easing[s] || {},
                o = c.length; --o > -1; )
                    a = c[o],
                    w[s + "." + a] = w[a + s] = r[a] = t.getRatio ? t : t[a] || new t
        }
        ;
        for (s = T.prototype,
        s._calcEnd = !1,
        s.getRatio = function(t) {
            if (this._func)
                return this._params[0] = t,
                this._func.apply(null, this._params);
            var e = this._type
              , i = this._power
              , n = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
            return 1 === i ? n *= n : 2 === i ? n *= n * n : 3 === i ? n *= n * n * n : 4 === i && (n *= n * n * n * n),
            1 === e ? 1 - n : 2 === e ? n : .5 > t ? n / 2 : 1 - n / 2
        }
        ,
        n = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"],
        r = n.length; --r > -1; )
            s = n[r] + ",Power" + r,
            x(new T(null,null,1,r), s, "easeOut", !0),
            x(new T(null,null,2,r), s, "easeIn" + (0 === r ? ",easeNone" : "")),
            x(new T(null,null,3,r), s, "easeInOut");
        w.linear = h.easing.Linear.easeIn,
        w.swing = h.easing.Quad.easeInOut;
        var b = g("events.EventDispatcher", function(t) {
            this._listeners = {},
            this._eventTarget = t || this
        });
        s = b.prototype,
        s.addEventListener = function(t, e, i, n, r) {
            r = r || 0;
            var s, l, h = this._listeners[t], u = 0;
            for (null == h && (this._listeners[t] = h = []),
            l = h.length; --l > -1; )
                s = h[l],
                s.c === e && s.s === i ? h.splice(l, 1) : 0 === u && r > s.pr && (u = l + 1);
            h.splice(u, 0, {
                c: e,
                s: i,
                up: n,
                pr: r
            }),
            this !== o || a || o.wake()
        }
        ,
        s.removeEventListener = function(t, e) {
            var i, n = this._listeners[t];
            if (n)
                for (i = n.length; --i > -1; )
                    if (n[i].c === e)
                        return void n.splice(i, 1)
        }
        ,
        s.dispatchEvent = function(t) {
            var e, i, n, r = this._listeners[t];
            if (r)
                for (e = r.length,
                i = this._eventTarget; --e > -1; )
                    n = r[e],
                    n && (n.up ? n.c.call(n.s || i, {
                        type: t,
                        target: i
                    }) : n.c.call(n.s || i))
        }
        ;
        var P = t.requestAnimationFrame
          , S = t.cancelAnimationFrame
          , C = Date.now || function() {
            return (new Date).getTime()
        }
          , O = C();
        for (n = ["ms", "moz", "webkit", "o"],
        r = n.length; --r > -1 && !P; )
            P = t[n[r] + "RequestAnimationFrame"],
            S = t[n[r] + "CancelAnimationFrame"] || t[n[r] + "CancelRequestAnimationFrame"];
        g("Ticker", function(t, e) {
            var i, n, r, s, l, h = this, c = C(), f = e !== !1 && P, d = 500, m = 33, _ = "tick", g = function(t) {
                var e, o, a = C() - O;
                a > d && (c += a - m),
                O += a,
                h.time = (O - c) / 1e3,
                e = h.time - l,
                (!i || e > 0 || t === !0) && (h.frame++,
                l += e + (e >= s ? .004 : s - e),
                o = !0),
                t !== !0 && (r = n(g)),
                o && h.dispatchEvent(_)
            };
            b.call(h),
            h.time = h.frame = 0,
            h.tick = function() {
                g(!0)
            }
            ,
            h.lagSmoothing = function(t, e) {
                d = t || 1 / u,
                m = Math.min(e, d, 0)
            }
            ,
            h.sleep = function() {
                null != r && (f && S ? S(r) : clearTimeout(r),
                n = p,
                r = null,
                h === o && (a = !1))
            }
            ,
            h.wake = function() {
                null !== r ? h.sleep() : h.frame > 10 && (O = C() - d + 5),
                n = 0 === i ? p : f && P ? P : function(t) {
                    return setTimeout(t, 0 | 1e3 * (l - h.time) + 1)
                }
                ,
                h === o && (a = !0),
                g(2)
            }
            ,
            h.fps = function(t) {
                return arguments.length ? (i = t,
                s = 1 / (i || 60),
                l = this.time + s,
                void h.wake()) : i
            }
            ,
            h.useRAF = function(t) {
                return arguments.length ? (h.sleep(),
                f = t,
                void h.fps(i)) : f
            }
            ,
            h.fps(t),
            setTimeout(function() {
                f && (!r || 5 > h.frame) && h.useRAF(!1)
            }, 1500)
        }),
        s = h.Ticker.prototype = new h.events.EventDispatcher,
        s.constructor = h.Ticker;
        var E = g("core.Animation", function(t, e) {
            if (this.vars = e = e || {},
            this._duration = this._totalDuration = t || 0,
            this._delay = Number(e.delay) || 0,
            this._timeScale = 1,
            this._active = e.immediateRender === !0,
            this.data = e.data,
            this._reversed = e.reversed === !0,
            Y) {
                a || o.wake();
                var i = this.vars.useFrames ? X : Y;
                i.add(this, i._time),
                this.vars.paused && this.paused(!0)
            }
        });
        o = E.ticker = new h.Ticker,
        s = E.prototype,
        s._dirty = s._gc = s._initted = s._paused = !1,
        s._totalTime = s._time = 0,
        s._rawPrevTime = -1,
        s._next = s._last = s._onUpdate = s._timeline = s.timeline = null,
        s._paused = !1;
        var R = function() {
            a && C() - O > 2e3 && o.wake(),
            setTimeout(R, 2e3)
        };
        R(),
        s.play = function(t, e) {
            return null != t && this.seek(t, e),
            this.reversed(!1).paused(!1)
        }
        ,
        s.pause = function(t, e) {
            return null != t && this.seek(t, e),
            this.paused(!0)
        }
        ,
        s.resume = function(t, e) {
            return null != t && this.seek(t, e),
            this.paused(!1)
        }
        ,
        s.seek = function(t, e) {
            return this.totalTime(Number(t), e !== !1)
        }
        ,
        s.restart = function(t, e) {
            return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0)
        }
        ,
        s.reverse = function(t, e) {
            return null != t && this.seek(t || this.totalDuration(), e),
            this.reversed(!0).paused(!1)
        }
        ,
        s.render = function() {}
        ,
        s.invalidate = function() {
            return this._time = this._totalTime = 0,
            this._initted = this._gc = !1,
            this._rawPrevTime = -1,
            (this._gc || !this.timeline) && this._enabled(!0),
            this
        }
        ,
        s.isActive = function() {
            var t, e = this._timeline, i = this._startTime;
            return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t
        }
        ,
        s._enabled = function(t, e) {
            return a || o.wake(),
            this._gc = !t,
            this._active = this.isActive(),
            e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)),
            !1
        }
        ,
        s._kill = function() {
            return this._enabled(!1, !1)
        }
        ,
        s.kill = function(t, e) {
            return this._kill(t, e),
            this
        }
        ,
        s._uncache = function(t) {
            for (var e = t ? this : this.timeline; e; )
                e._dirty = !0,
                e = e.timeline;
            return this
        }
        ,
        s._swapSelfInParams = function(t) {
            for (var e = t.length, i = t.concat(); --e > -1; )
                "{self}" === t[e] && (i[e] = this);
            return i
        }
        ,
        s.eventCallback = function(t, e, i, n) {
            if ("on" === (t || "").substr(0, 2)) {
                var r = this.vars;
                if (1 === arguments.length)
                    return r[t];
                null == e ? delete r[t] : (r[t] = e,
                r[t + "Params"] = f(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i,
                r[t + "Scope"] = n),
                "onUpdate" === t && (this._onUpdate = e)
            }
            return this
        }
        ,
        s.delay = function(t) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay),
            this._delay = t,
            this) : this._delay
        }
        ,
        s.duration = function(t) {
            return arguments.length ? (this._duration = this._totalDuration = t,
            this._uncache(!0),
            this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0),
            this) : (this._dirty = !1,
            this._duration)
        }
        ,
        s.totalDuration = function(t) {
            return this._dirty = !1,
            arguments.length ? this.duration(t) : this._totalDuration
        }
        ,
        s.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
        }
        ,
        s.totalTime = function(t, e, i) {
            if (a || o.wake(),
            !arguments.length)
                return this._totalTime;
            if (this._timeline) {
                if (0 > t && !i && (t += this.totalDuration()),
                this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var n = this._totalDuration
                      , r = this._timeline;
                    if (t > n && !i && (t = n),
                    this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? n - t : t) / this._timeScale,
                    r._dirty || this._uncache(!1),
                    r._timeline)
                        for (; r._timeline; )
                            r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0),
                            r = r._timeline
                }
                this._gc && this._enabled(!0, !1),
                (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1),
                L.length && q())
            }
            return this
        }
        ,
        s.progress = s.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * t, e) : this._time / this.duration()
        }
        ,
        s.startTime = function(t) {
            return arguments.length ? (t !== this._startTime && (this._startTime = t,
            this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)),
            this) : this._startTime
        }
        ,
        s.endTime = function(t) {
            return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
        }
        ,
        s.timeScale = function(t) {
            if (!arguments.length)
                return this._timeScale;
            if (t = t || u,
            this._timeline && this._timeline.smoothChildTiming) {
                var e = this._pauseTime
                  , i = e || 0 === e ? e : this._timeline.totalTime();
                this._startTime = i - (i - this._startTime) * this._timeScale / t
            }
            return this._timeScale = t,
            this._uncache(!1)
        }
        ,
        s.reversed = function(t) {
            return arguments.length ? (t != this._reversed && (this._reversed = t,
            this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)),
            this) : this._reversed
        }
        ,
        s.paused = function(t) {
            if (!arguments.length)
                return this._paused;
            if (t != this._paused && this._timeline) {
                a || t || o.wake();
                var e = this._timeline
                  , i = e.rawTime()
                  , n = i - this._pauseTime;
                !t && e.smoothChildTiming && (this._startTime += n,
                this._uncache(!1)),
                this._pauseTime = t ? i : null,
                this._paused = t,
                this._active = this.isActive(),
                !t && 0 !== n && this._initted && this.duration() && this.render(e.smoothChildTiming ? this._totalTime : (i - this._startTime) / this._timeScale, !0, !0)
            }
            return this._gc && !t && this._enabled(!0, !1),
            this
        }
        ;
        var k = g("core.SimpleTimeline", function(t) {
            E.call(this, 0, t),
            this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        s = k.prototype = new E,
        s.constructor = k,
        s.kill()._gc = !1,
        s._first = s._last = s._recent = null,
        s._sortChildren = !1,
        s.add = s.insert = function(t, e) {
            var i, n;
            if (t._startTime = Number(e || 0) + t._delay,
            t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale),
            t.timeline && t.timeline._remove(t, !0),
            t.timeline = t._timeline = this,
            t._gc && t._enabled(!0, !0),
            i = this._last,
            this._sortChildren)
                for (n = t._startTime; i && i._startTime > n; )
                    i = i._prev;
            return i ? (t._next = i._next,
            i._next = t) : (t._next = this._first,
            this._first = t),
            t._next ? t._next._prev = t : this._last = t,
            t._prev = i,
            this._recent = t,
            this._timeline && this._uncache(!0),
            this
        }
        ,
        s._remove = function(t, e) {
            return t.timeline === this && (e || t._enabled(!1, !0),
            t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next),
            t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev),
            t._next = t._prev = t.timeline = null,
            t === this._recent && (this._recent = this._last),
            this._timeline && this._uncache(!0)),
            this
        }
        ,
        s.render = function(t, e, i) {
            var n, r = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = t; r; )
                n = r._next,
                (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)),
                r = n
        }
        ,
        s.rawTime = function() {
            return a || o.wake(),
            this._totalTime
        }
        ;
        var z = g("TweenLite", function(e, i, n) {
            if (E.call(this, i, n),
            this.render = z.prototype.render,
            null == e)
                throw "Cannot tween a null target.";
            this.target = e = "string" != typeof e ? e : z.selector(e) || e;
            var r, s, o, a = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType), l = this.vars.overwrite;
            if (this._overwrite = l = null == l ? B[z.defaultOverwrite] : "number" == typeof l ? l >> 0 : B[l],
            (a || e instanceof Array || e.push && f(e)) && "number" != typeof e[0])
                for (this._targets = o = c(e),
                this._propLookup = [],
                this._siblings = [],
                r = 0; o.length > r; r++)
                    s = o[r],
                    s ? "string" != typeof s ? s.length && s !== t && s[0] && (s[0] === t || s[0].nodeType && s[0].style && !s.nodeType) ? (o.splice(r--, 1),
                    this._targets = o = o.concat(c(s))) : (this._siblings[r] = U(s, this, !1),
                    1 === l && this._siblings[r].length > 1 && V(s, this, null, 1, this._siblings[r])) : (s = o[r--] = z.selector(s),
                    "string" == typeof s && o.splice(r + 1, 1)) : o.splice(r--, 1);
            else
                this._propLookup = {},
                this._siblings = U(e, this, !1),
                1 === l && this._siblings.length > 1 && V(e, this, null, 1, this._siblings);
            (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -u,
            this.render(-this._delay))
        }, !0)
          , A = function(e) {
            return e && e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
        }
          , M = function(t, e) {
            var i, n = {};
            for (i in t)
                W[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!F[i] || F[i] && F[i]._autoCSS) || (n[i] = t[i],
                delete t[i]);
            t.css = n
        };
        s = z.prototype = new E,
        s.constructor = z,
        s.kill()._gc = !1,
        s.ratio = 0,
        s._firstPT = s._targets = s._overwrittenProps = s._startAt = null,
        s._notifyPluginsOfEnabled = s._lazy = !1,
        z.version = "1.15.1",
        z.defaultEase = s._ease = new T(null,null,1,1),
        z.defaultOverwrite = "auto",
        z.ticker = o,
        z.autoSleep = !0,
        z.lagSmoothing = function(t, e) {
            o.lagSmoothing(t, e)
        }
        ,
        z.selector = t.$ || t.jQuery || function(e) {
            var i = t.$ || t.jQuery;
            return i ? (z.selector = i,
            i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
        }
        ;
        var L = []
          , I = {}
          , D = z._internals = {
            isArray: f,
            isSelector: A,
            lazyTweens: L
        }
          , F = z._plugins = {}
          , N = D.tweenLookup = {}
          , j = 0
          , W = D.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1,
            lazy: 1,
            onOverwrite: 1
        }
          , B = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            "true": 1,
            "false": 0
        }
          , X = E._rootFramesTimeline = new k
          , Y = E._rootTimeline = new k
          , q = D.lazyRender = function() {
            var t, e = L.length;
            for (I = {}; --e > -1; )
                t = L[e],
                t && t._lazy !== !1 && (t.render(t._lazy[0], t._lazy[1], !0),
                t._lazy = !1);
            L.length = 0
        }
        ;
        Y._startTime = o.time,
        X._startTime = o.frame,
        Y._active = X._active = !0,
        setTimeout(q, 1),
        E._updateRoot = z.render = function() {
            var t, e, i;
            if (L.length && q(),
            Y.render((o.time - Y._startTime) * Y._timeScale, !1, !1),
            X.render((o.frame - X._startTime) * X._timeScale, !1, !1),
            L.length && q(),
            !(o.frame % 120)) {
                for (i in N) {
                    for (e = N[i].tweens,
                    t = e.length; --t > -1; )
                        e[t]._gc && e.splice(t, 1);
                    0 === e.length && delete N[i]
                }
                if (i = Y._first,
                (!i || i._paused) && z.autoSleep && !X._first && 1 === o._listeners.tick.length) {
                    for (; i && i._paused; )
                        i = i._next;
                    i || o.sleep()
                }
            }
        }
        ,
        o.addEventListener("tick", E._updateRoot);
        var U = function(t, e, i) {
            var n, r, s = t._gsTweenID;
            if (N[s || (t._gsTweenID = s = "t" + j++)] || (N[s] = {
                target: t,
                tweens: []
            }),
            e && (n = N[s].tweens,
            n[r = n.length] = e,
            i))
                for (; --r > -1; )
                    n[r] === e && n.splice(r, 1);
            return N[s].tweens
        }
          , H = function(t, e, i, n) {
            var r, s, o = t.vars.onOverwrite;
            return o && (r = o(t, e, i, n)),
            o = z.onOverwrite,
            o && (s = o(t, e, i, n)),
            r !== !1 && s !== !1
        }
          , V = function(t, e, i, n, r) {
            var s, o, a, l;
            if (1 === n || n >= 4) {
                for (l = r.length,
                s = 0; l > s; s++)
                    if ((a = r[s]) !== e)
                        a._gc || H(a, e) && a._enabled(!1, !1) && (o = !0);
                    else if (5 === n)
                        break;
                return o
            }
            var h, c = e._startTime + u, p = [], f = 0, d = 0 === e._duration;
            for (s = r.length; --s > -1; )
                (a = r[s]) === e || a._gc || a._paused || (a._timeline !== e._timeline ? (h = h || Q(e, 0, d),
                0 === Q(a, h, d) && (p[f++] = a)) : c >= a._startTime && a._startTime + a.totalDuration() / a._timeScale > c && ((d || !a._initted) && 2e-10 >= c - a._startTime || (p[f++] = a)));
            for (s = f; --s > -1; )
                if (a = p[s],
                2 === n && a._kill(i, t, e) && (o = !0),
                2 !== n || !a._firstPT && a._initted) {
                    if (2 !== n && !H(a, e))
                        continue;
                    a._enabled(!1, !1) && (o = !0)
                }
            return o
        }
          , Q = function(t, e, i) {
            for (var n = t._timeline, r = n._timeScale, s = t._startTime; n._timeline; ) {
                if (s += n._startTime,
                r *= n._timeScale,
                n._paused)
                    return -100;
                n = n._timeline
            }
            return s /= r,
            s > e ? s - e : i && s === e || !t._initted && 2 * u > s - e ? u : (s += t.totalDuration() / t._timeScale / r) > e + u ? 0 : s - e - u
        };
        s._init = function() {
            var t, e, i, n, r, s = this.vars, o = this._overwrittenProps, a = this._duration, l = !!s.immediateRender, h = s.ease;
            if (s.startAt) {
                this._startAt && (this._startAt.render(-1, !0),
                this._startAt.kill()),
                r = {};
                for (n in s.startAt)
                    r[n] = s.startAt[n];
                if (r.overwrite = !1,
                r.immediateRender = !0,
                r.lazy = l && s.lazy !== !1,
                r.startAt = r.delay = null,
                this._startAt = z.to(this.target, 0, r),
                l)
                    if (this._time > 0)
                        this._startAt = null;
                    else if (0 !== a)
                        return
            } else if (s.runBackwards && 0 !== a)
                if (this._startAt)
                    this._startAt.render(-1, !0),
                    this._startAt.kill(),
                    this._startAt = null;
                else {
                    0 !== this._time && (l = !1),
                    i = {};
                    for (n in s)
                        W[n] && "autoCSS" !== n || (i[n] = s[n]);
                    if (i.overwrite = 0,
                    i.data = "isFromStart",
                    i.lazy = l && s.lazy !== !1,
                    i.immediateRender = l,
                    this._startAt = z.to(this.target, 0, i),
                    l) {
                        if (0 === this._time)
                            return
                    } else
                        this._startAt._init(),
                        this._startAt._enabled(!1),
                        this.vars.immediateRender && (this._startAt = null)
                }
            if (this._ease = h = h ? h instanceof T ? h : "function" == typeof h ? new T(h,s.easeParams) : w[h] || z.defaultEase : z.defaultEase,
            s.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, s.easeParams)),
            this._easeType = this._ease._type,
            this._easePower = this._ease._power,
            this._firstPT = null,
            this._targets)
                for (t = this._targets.length; --t > -1; )
                    this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], o ? o[t] : null) && (e = !0);
            else
                e = this._initProps(this.target, this._propLookup, this._siblings, o);
            if (e && z._onPluginEvent("_onInitAllProps", this),
            o && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)),
            s.runBackwards)
                for (i = this._firstPT; i; )
                    i.s += i.c,
                    i.c = -i.c,
                    i = i._next;
            this._onUpdate = s.onUpdate,
            this._initted = !0
        }
        ,
        s._initProps = function(e, i, n, r) {
            var s, o, a, l, h, u;
            if (null == e)
                return !1;
            I[e._gsTweenID] && q(),
            this.vars.css || e.style && e !== t && e.nodeType && F.css && this.vars.autoCSS !== !1 && M(this.vars, e);
            for (s in this.vars) {
                if (u = this.vars[s],
                W[s])
                    u && (u instanceof Array || u.push && f(u)) && -1 !== u.join("").indexOf("{self}") && (this.vars[s] = u = this._swapSelfInParams(u, this));
                else if (F[s] && (l = new F[s])._onInitTween(e, this.vars[s], this)) {
                    for (this._firstPT = h = {
                        _next: this._firstPT,
                        t: l,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: !0,
                        n: s,
                        pg: !0,
                        pr: l._priority
                    },
                    o = l._overwriteProps.length; --o > -1; )
                        i[l._overwriteProps[o]] = this._firstPT;
                    (l._priority || l._onInitAllProps) && (a = !0),
                    (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0)
                } else
                    this._firstPT = i[s] = h = {
                        _next: this._firstPT,
                        t: e,
                        p: s,
                        f: "function" == typeof e[s],
                        n: s,
                        pg: !1,
                        pr: 0
                    },
                    h.s = h.f ? e[s.indexOf("set") || "function" != typeof e["get" + s.substr(3)] ? s : "get" + s.substr(3)]() : parseFloat(e[s]),
                    h.c = "string" == typeof u && "=" === u.charAt(1) ? parseInt(u.charAt(0) + "1", 10) * Number(u.substr(2)) : Number(u) - h.s || 0;
                h && h._next && (h._next._prev = h)
            }
            return r && this._kill(r, e) ? this._initProps(e, i, n, r) : this._overwrite > 1 && this._firstPT && n.length > 1 && V(e, this, i, this._overwrite, n) ? (this._kill(i, e),
            this._initProps(e, i, n, r)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (I[e._gsTweenID] = !0),
            a)
        }
        ,
        s.render = function(t, e, i) {
            var n, r, s, o, a = this._time, l = this._duration, h = this._rawPrevTime;
            if (t >= l)
                this._totalTime = this._time = l,
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1,
                this._reversed || (n = !0,
                r = "onComplete"),
                0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0),
                (0 === t || 0 > h || h === u && "isPause" !== this.data) && h !== t && (i = !0,
                h > u && (r = "onReverseComplete")),
                this._rawPrevTime = o = !e || t || h === t ? t : u);
            else if (1e-7 > t)
                this._totalTime = this._time = 0,
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
                (0 !== a || 0 === l && h > 0 && h !== u) && (r = "onReverseComplete",
                n = this._reversed),
                0 > t && (this._active = !1,
                0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (h !== u || "isPause" !== this.data) && (i = !0),
                this._rawPrevTime = o = !e || t || h === t ? t : u)),
                this._initted || (i = !0);
            else if (this._totalTime = this._time = t,
            this._easeType) {
                var c = t / l
                  , p = this._easeType
                  , f = this._easePower;
                (1 === p || 3 === p && c >= .5) && (c = 1 - c),
                3 === p && (c *= 2),
                1 === f ? c *= c : 2 === f ? c *= c * c : 3 === f ? c *= c * c * c : 4 === f && (c *= c * c * c * c),
                this.ratio = 1 === p ? 1 - c : 2 === p ? c : .5 > t / l ? c / 2 : 1 - c / 2
            } else
                this.ratio = this._ease.getRatio(t / l);
            if (this._time !== a || i) {
                if (!this._initted) {
                    if (this._init(),
                    !this._initted || this._gc)
                        return;
                    if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))
                        return this._time = this._totalTime = a,
                        this._rawPrevTime = h,
                        L.push(this),
                        void (this._lazy = [t, e]);
                    this._time && !n ? this.ratio = this._ease.getRatio(this._time / l) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                }
                for (this._lazy !== !1 && (this._lazy = !1),
                this._active || !this._paused && this._time !== a && t >= 0 && (this._active = !0),
                0 === a && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")),
                this.vars.onStart && (0 !== this._time || 0 === l) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || y))),
                s = this._firstPT; s; )
                    s.f ? s.t[s.p](s.c * this.ratio + s.s) : s.t[s.p] = s.c * this.ratio + s.s,
                    s = s._next;
                this._onUpdate && (0 > t && this._startAt && t !== -1e-4 && this._startAt.render(t, e, i),
                e || (this._time !== a || n) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || y)),
                r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && t !== -1e-4 && this._startAt.render(t, e, i),
                n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !e && this.vars[r] && this.vars[r].apply(this.vars[r + "Scope"] || this, this.vars[r + "Params"] || y),
                0 === l && this._rawPrevTime === u && o !== u && (this._rawPrevTime = 0))
            }
        }
        ,
        s._kill = function(t, e, i) {
            if ("all" === t && (t = null),
            null == t && (null == e || e === this.target))
                return this._lazy = !1,
                this._enabled(!1, !1);
            e = "string" != typeof e ? e || this._targets || this.target : z.selector(e) || e;
            var n, r, s, o, a, l, h, u, c;
            if ((f(e) || A(e)) && "number" != typeof e[0])
                for (n = e.length; --n > -1; )
                    this._kill(t, e[n]) && (l = !0);
            else {
                if (this._targets) {
                    for (n = this._targets.length; --n > -1; )
                        if (e === this._targets[n]) {
                            a = this._propLookup[n] || {},
                            this._overwrittenProps = this._overwrittenProps || [],
                            r = this._overwrittenProps[n] = t ? this._overwrittenProps[n] || {} : "all";
                            break
                        }
                } else {
                    if (e !== this.target)
                        return !1;
                    a = this._propLookup,
                    r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
                }
                if (a) {
                    if (h = t || a,
                    u = t !== r && "all" !== r && t !== a && ("object" != typeof t || !t._tempKill),
                    i && (z.onOverwrite || this.vars.onOverwrite)) {
                        for (s in h)
                            a[s] && (c || (c = []),
                            c.push(s));
                        if (!H(this, i, e, c))
                            return !1
                    }
                    for (s in h)
                        (o = a[s]) && (o.pg && o.t._kill(h) && (l = !0),
                        o.pg && 0 !== o.t._overwriteProps.length || (o._prev ? o._prev._next = o._next : o === this._firstPT && (this._firstPT = o._next),
                        o._next && (o._next._prev = o._prev),
                        o._next = o._prev = null),
                        delete a[s]),
                        u && (r[s] = 1);
                    !this._firstPT && this._initted && this._enabled(!1, !1)
                }
            }
            return l
        }
        ,
        s.invalidate = function() {
            return this._notifyPluginsOfEnabled && z._onPluginEvent("_onDisable", this),
            this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null,
            this._notifyPluginsOfEnabled = this._active = this._lazy = !1,
            this._propLookup = this._targets ? {} : [],
            E.prototype.invalidate.call(this),
            this.vars.immediateRender && (this._time = -u,
            this.render(-this._delay)),
            this
        }
        ,
        s._enabled = function(t, e) {
            if (a || o.wake(),
            t && this._gc) {
                var i, n = this._targets;
                if (n)
                    for (i = n.length; --i > -1; )
                        this._siblings[i] = U(n[i], this, !0);
                else
                    this._siblings = U(this.target, this, !0)
            }
            return E.prototype._enabled.call(this, t, e),
            this._notifyPluginsOfEnabled && this._firstPT ? z._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1
        }
        ,
        z.to = function(t, e, i) {
            return new z(t,e,i)
        }
        ,
        z.from = function(t, e, i) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            new z(t,e,i)
        }
        ,
        z.fromTo = function(t, e, i, n) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            new z(t,e,n)
        }
        ,
        z.delayedCall = function(t, e, i, n, r) {
            return new z(e,0,{
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                onCompleteScope: n,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                onReverseCompleteScope: n,
                immediateRender: !1,
                lazy: !1,
                useFrames: r,
                overwrite: 0
            })
        }
        ,
        z.set = function(t, e) {
            return new z(t,0,e)
        }
        ,
        z.getTweensOf = function(t, e) {
            if (null == t)
                return [];
            t = "string" != typeof t ? t : z.selector(t) || t;
            var i, n, r, s;
            if ((f(t) || A(t)) && "number" != typeof t[0]) {
                for (i = t.length,
                n = []; --i > -1; )
                    n = n.concat(z.getTweensOf(t[i], e));
                for (i = n.length; --i > -1; )
                    for (s = n[i],
                    r = i; --r > -1; )
                        s === n[r] && n.splice(i, 1)
            } else
                for (n = U(t).concat(),
                i = n.length; --i > -1; )
                    (n[i]._gc || e && !n[i].isActive()) && n.splice(i, 1);
            return n
        }
        ,
        z.killTweensOf = z.killDelayedCallsTo = function(t, e, i) {
            "object" == typeof e && (i = e,
            e = !1);
            for (var n = z.getTweensOf(t, e), r = n.length; --r > -1; )
                n[r]._kill(i, t)
        }
        ;
        var G = g("plugins.TweenPlugin", function(t, e) {
            this._overwriteProps = (t || "").split(","),
            this._propName = this._overwriteProps[0],
            this._priority = e || 0,
            this._super = G.prototype
        }, !0);
        if (s = G.prototype,
        G.version = "1.10.1",
        G.API = 2,
        s._firstPT = null,
        s._addTween = function(t, e, i, n, r, s) {
            var o, a;
            return null != n && (o = "number" == typeof n || "=" !== n.charAt(1) ? Number(n) - i : parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2))) ? (this._firstPT = a = {
                _next: this._firstPT,
                t: t,
                p: e,
                s: i,
                c: o,
                f: "function" == typeof t[e],
                n: r || e,
                r: s
            },
            a._next && (a._next._prev = a),
            a) : void 0
        }
        ,
        s.setRatio = function(t) {
            for (var e, i = this._firstPT, n = 1e-6; i; )
                e = i.c * t + i.s,
                i.r ? e = Math.round(e) : n > e && e > -n && (e = 0),
                i.f ? i.t[i.p](e) : i.t[i.p] = e,
                i = i._next
        }
        ,
        s._kill = function(t) {
            var e, i = this._overwriteProps, n = this._firstPT;
            if (null != t[this._propName])
                this._overwriteProps = [];
            else
                for (e = i.length; --e > -1; )
                    null != t[i[e]] && i.splice(e, 1);
            for (; n; )
                null != t[n.n] && (n._next && (n._next._prev = n._prev),
                n._prev ? (n._prev._next = n._next,
                n._prev = null) : this._firstPT === n && (this._firstPT = n._next)),
                n = n._next;
            return !1
        }
        ,
        s._roundProps = function(t, e) {
            for (var i = this._firstPT; i; )
                (t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e),
                i = i._next
        }
        ,
        z._onPluginEvent = function(t, e) {
            var i, n, r, s, o, a = e._firstPT;
            if ("_onInitAllProps" === t) {
                for (; a; ) {
                    for (o = a._next,
                    n = r; n && n.pr > a.pr; )
                        n = n._next;
                    (a._prev = n ? n._prev : s) ? a._prev._next = a : r = a,
                    (a._next = n) ? n._prev = a : s = a,
                    a = o
                }
                a = e._firstPT = r
            }
            for (; a; )
                a.pg && "function" == typeof a.t[t] && a.t[t]() && (i = !0),
                a = a._next;
            return i
        }
        ,
        G.activate = function(t) {
            for (var e = t.length; --e > -1; )
                t[e].API === G.API && (F[(new t[e])._propName] = t[e]);
            return !0
        }
        ,
        _.plugin = function(t) {
            if (!(t && t.propName && t.init && t.API))
                throw "illegal plugin definition.";
            var e, i = t.propName, n = t.priority || 0, r = t.overwriteProps, s = {
                init: "_onInitTween",
                set: "setRatio",
                kill: "_kill",
                round: "_roundProps",
                initAll: "_onInitAllProps"
            }, o = g("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
                G.call(this, i, n),
                this._overwriteProps = r || []
            }, t.global === !0), a = o.prototype = new G(i);
            a.constructor = o,
            o.API = t.API;
            for (e in s)
                "function" == typeof t[e] && (a[s[e]] = t[e]);
            return o.version = t.version,
            G.activate([o]),
            o
        }
        ,
        n = t._gsQueue) {
            for (r = 0; n.length > r; r++)
                n[r]();
            for (s in d)
                d[s].func || t.console.log("GSAP encountered missing dependency: com.greensock." + s)
        }
        a = !1
    }
}("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax"),
!function(t, e) {
    "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e() : t.ScrollMagic = e()
}(this, function() {
    "use strict";
    var t = function() {};
    t.version = "2.0.5",
    window.addEventListener("mousewheel", function() {});
    var e = "data-scrollmagic-pin-spacer";
    t.Controller = function(n) {
        var s, o, a = "ScrollMagic.Controller", l = "FORWARD", h = "REVERSE", u = "PAUSED", c = i.defaults, p = this, f = r.extend({}, c, n), d = [], m = !1, _ = 0, g = u, v = !0, y = 0, T = !0, w = function() {
            for (var t in f)
                c.hasOwnProperty(t) || delete f[t];
            if (f.container = r.get.elements(f.container)[0],
            !f.container)
                throw a + " init failed.";
            v = f.container === window || f.container === document.body || !document.body.contains(f.container),
            v && (f.container = window),
            y = P(),
            f.container.addEventListener("resize", E),
            f.container.addEventListener("scroll", E),
            f.refreshInterval = parseInt(f.refreshInterval) || c.refreshInterval,
            x()
        }, x = function() {
            f.refreshInterval > 0 && (o = window.setTimeout(R, f.refreshInterval))
        }, b = function() {
            return f.vertical ? r.get.scrollTop(f.container) : r.get.scrollLeft(f.container)
        }, P = function() {
            return f.vertical ? r.get.height(f.container) : r.get.width(f.container)
        }, S = this._setScrollPos = function(t) {
            f.vertical ? v ? window.scrollTo(r.get.scrollLeft(), t) : f.container.scrollTop = t : v ? window.scrollTo(t, r.get.scrollTop()) : f.container.scrollLeft = t
        }
        , C = function() {
            if (T && m) {
                var t = r.type.Array(m) ? m : d.slice(0);
                m = !1;
                var e = _;
                _ = p.scrollPos();
                var i = _ - e;
                0 !== i && (g = i > 0 ? l : h),
                g === h && t.reverse(),
                t.forEach(function(t) {
                    t.update(!0)
                })
            }
        }, O = function() {
            s = r.rAF(C)
        }, E = function(t) {
            "resize" == t.type && (y = P(),
            g = u),
            m !== !0 && (m = !0,
            O())
        }, R = function() {
            if (!v && y != P()) {
                var t;
                try {
                    t = new Event("resize",{
                        bubbles: !1,
                        cancelable: !1
                    })
                } catch (e) {
                    t = document.createEvent("Event"),
                    t.initEvent("resize", !1, !1)
                }
                f.container.dispatchEvent(t)
            }
            d.forEach(function(t) {
                t.refresh()
            }),
            x()
        };
        this._options = f;
        var k = function(t) {
            if (t.length <= 1)
                return t;
            var e = t.slice(0);
            return e.sort(function(t, e) {
                return t.scrollOffset() > e.scrollOffset() ? 1 : -1
            }),
            e
        };
        return this.addScene = function(e) {
            if (r.type.Array(e))
                e.forEach(function(t) {
                    p.addScene(t)
                });
            else if (e instanceof t.Scene)
                if (e.controller() !== p)
                    e.addTo(p);
                else if (d.indexOf(e) < 0) {
                    d.push(e),
                    d = k(d),
                    e.on("shift.controller_sort", function() {
                        d = k(d)
                    });
                    for (var i in f.globalSceneOptions)
                        e[i] && e[i].call(e, f.globalSceneOptions[i])
                }
            return p
        }
        ,
        this.removeScene = function(t) {
            if (r.type.Array(t))
                t.forEach(function(t) {
                    p.removeScene(t)
                });
            else {
                var e = d.indexOf(t);
                e > -1 && (t.off("shift.controller_sort"),
                d.splice(e, 1),
                t.remove())
            }
            return p
        }
        ,
        this.updateScene = function(e, i) {
            return r.type.Array(e) ? e.forEach(function(t) {
                p.updateScene(t, i)
            }) : i ? e.update(!0) : m !== !0 && e instanceof t.Scene && (m = m || [],
            -1 == m.indexOf(e) && m.push(e),
            m = k(m),
            O()),
            p
        }
        ,
        this.update = function(t) {
            return E({
                type: "resize"
            }),
            t && C(),
            p
        }
        ,
        this.scrollTo = function(i, n) {
            if (r.type.Number(i))
                S.call(f.container, i, n);
            else if (i instanceof t.Scene)
                i.controller() === p && p.scrollTo(i.scrollOffset(), n);
            else if (r.type.Function(i))
                S = i;
            else {
                var s = r.get.elements(i)[0];
                if (s) {
                    for (; s.parentNode.hasAttribute(e); )
                        s = s.parentNode;
                    var o = f.vertical ? "top" : "left"
                      , a = r.get.offset(f.container)
                      , l = r.get.offset(s);
                    v || (a[o] -= p.scrollPos()),
                    p.scrollTo(l[o] - a[o], n)
                }
            }
            return p
        }
        ,
        this.scrollPos = function(t) {
            return arguments.length ? (r.type.Function(t) && (b = t),
            p) : b.call(p)
        }
        ,
        this.info = function(t) {
            var e = {
                size: y,
                vertical: f.vertical,
                scrollPos: _,
                scrollDirection: g,
                container: f.container,
                isDocument: v
            };
            return arguments.length ? void 0 !== e[t] ? e[t] : void 0 : e
        }
        ,
        this.loglevel = function() {
            return p
        }
        ,
        this.enabled = function(t) {
            return arguments.length ? (T != t && (T = !!t,
            p.updateScene(d, !0)),
            p) : T
        }
        ,
        this.destroy = function(t) {
            window.clearTimeout(o);
            for (var e = d.length; e--; )
                d[e].destroy(t);
            return f.container.removeEventListener("resize", E),
            f.container.removeEventListener("scroll", E),
            r.cAF(s),
            null
        }
        ,
        w(),
        p
    }
    ;
    var i = {
        defaults: {
            container: window,
            vertical: !0,
            globalSceneOptions: {},
            loglevel: 2,
            refreshInterval: 100
        }
    };
    t.Controller.addOption = function(t, e) {
        i.defaults[t] = e
    }
    ,
    t.Controller.extend = function(e) {
        var i = this;
        t.Controller = function() {
            return i.apply(this, arguments),
            this.$super = r.extend({}, this),
            e.apply(this, arguments) || this
        }
        ,
        r.extend(t.Controller, i),
        t.Controller.prototype = i.prototype,
        t.Controller.prototype.constructor = t.Controller
    }
    ,
    t.Scene = function(i) {
        var s, o, a = "BEFORE", l = "DURING", h = "AFTER", u = n.defaults, c = this, p = r.extend({}, u, i), f = a, d = 0, m = {
            start: 0,
            end: 0
        }, _ = 0, g = !0, v = function() {
            for (var t in p)
                u.hasOwnProperty(t) || delete p[t];
            for (var e in u)
                O(e);
            S()
        }, y = {};
        this.on = function(t, e) {
            return r.type.Function(e) && (t = t.trim().split(" "),
            t.forEach(function(t) {
                var i = t.split(".")
                  , n = i[0]
                  , r = i[1];
                "*" != n && (y[n] || (y[n] = []),
                y[n].push({
                    namespace: r || "",
                    callback: e
                }))
            })),
            c
        }
        ,
        this.off = function(t, e) {
            return t ? (t = t.trim().split(" "),
            t.forEach(function(t) {
                var i = t.split(".")
                  , n = i[0]
                  , r = i[1] || ""
                  , s = "*" === n ? Object.keys(y) : [n];
                s.forEach(function(t) {
                    for (var i = y[t] || [], n = i.length; n--; ) {
                        var s = i[n];
                        !s || r !== s.namespace && "*" !== r || e && e != s.callback || i.splice(n, 1)
                    }
                    i.length || delete y[t]
                })
            }),
            c) : c
        }
        ,
        this.trigger = function(e, i) {
            if (e) {
                var n = e.trim().split(".")
                  , r = n[0]
                  , s = n[1]
                  , o = y[r];
                o && o.forEach(function(e) {
                    s && s !== e.namespace || e.callback.call(c, new t.Event(r,e.namespace,c,i))
                })
            }
            return c
        }
        ,
        c.on("change.internal", function(t) {
            "loglevel" !== t.what && "tweenChanges" !== t.what && ("triggerElement" === t.what ? x() : "reverse" === t.what && c.update())
        }).on("shift.internal", function() {
            T(),
            c.update()
        }),
        this.addTo = function(e) {
            return e instanceof t.Controller && o != e && (o && o.removeScene(c),
            o = e,
            S(),
            w(!0),
            x(!0),
            T(),
            o.info("container").addEventListener("resize", b),
            e.addScene(c),
            c.trigger("add", {
                controller: o
            }),
            c.update()),
            c
        }
        ,
        this.enabled = function(t) {
            return arguments.length ? (g != t && (g = !!t,
            c.update(!0)),
            c) : g
        }
        ,
        this.remove = function() {
            if (o) {
                o.info("container").removeEventListener("resize", b);
                var t = o;
                o = void 0,
                t.removeScene(c),
                c.trigger("remove")
            }
            return c
        }
        ,
        this.destroy = function(t) {
            return c.trigger("destroy", {
                reset: t
            }),
            c.remove(),
            c.off("*.*"),
            null
        }
        ,
        this.update = function(t) {
            if (o)
                if (t)
                    if (o.enabled() && g) {
                        var e, i = o.info("scrollPos");
                        e = p.duration > 0 ? (i - m.start) / (m.end - m.start) : i >= m.start ? 1 : 0,
                        c.trigger("update", {
                            startPos: m.start,
                            endPos: m.end,
                            scrollPos: i
                        }),
                        c.progress(e)
                    } else
                        E && f === l && k(!0);
                else
                    o.updateScene(c, !1);
            return c
        }
        ,
        this.refresh = function() {
            return w(),
            x(),
            c
        }
        ,
        this.progress = function(t) {
            if (arguments.length) {
                var e = !1
                  , i = f
                  , n = o ? o.info("scrollDirection") : "PAUSED"
                  , r = p.reverse || t >= d;
                if (0 === p.duration ? (e = d != t,
                d = 1 > t && r ? 0 : 1,
                f = 0 === d ? a : l) : 0 > t && f !== a && r ? (d = 0,
                f = a,
                e = !0) : t >= 0 && 1 > t && r ? (d = t,
                f = l,
                e = !0) : t >= 1 && f !== h ? (d = 1,
                f = h,
                e = !0) : f !== l || r || k(),
                e) {
                    var s = {
                        progress: d,
                        state: f,
                        scrollDirection: n
                    }
                      , u = f != i
                      , m = function(t) {
                        c.trigger(t, s)
                    };
                    u && i !== l && (m("enter"),
                    m(i === a ? "start" : "end")),
                    m("progress"),
                    u && f !== l && (m(f === a ? "start" : "end"),
                    m("leave"))
                }
                return c
            }
            return d
        }
        ;
        var T = function() {
            m = {
                start: _ + p.offset
            },
            o && p.triggerElement && (m.start -= o.info("size") * p.triggerHook),
            m.end = m.start + p.duration
        }
          , w = function(t) {
            if (s) {
                var e = "duration";
                C(e, s.call(c)) && !t && (c.trigger("change", {
                    what: e,
                    newval: p[e]
                }),
                c.trigger("shift", {
                    reason: e
                }))
            }
        }
          , x = function(t) {
            var i = 0
              , n = p.triggerElement;
            if (o && n) {
                for (var s = o.info(), a = r.get.offset(s.container), l = s.vertical ? "top" : "left"; n.parentNode.hasAttribute(e); )
                    n = n.parentNode;
                var h = r.get.offset(n);
                s.isDocument || (a[l] -= o.scrollPos()),
                i = h[l] - a[l]
            }
            var u = i != _;
            _ = i,
            u && !t && c.trigger("shift", {
                reason: "triggerElementPosition"
            })
        }
          , b = function() {
            p.triggerHook > 0 && c.trigger("shift", {
                reason: "containerResize"
            })
        }
          , P = r.extend(n.validate, {
            duration: function(t) {
                if (r.type.String(t) && t.match(/^(\.|\d)*\d+%$/)) {
                    var e = parseFloat(t) / 100;
                    t = function() {
                        return o ? o.info("size") * e : 0
                    }
                }
                if (r.type.Function(t)) {
                    s = t;
                    try {
                        t = parseFloat(s())
                    } catch (i) {
                        t = -1
                    }
                }
                if (t = parseFloat(t),
                !r.type.Number(t) || 0 > t)
                    throw s ? (s = void 0,
                    0) : 0;
                return t
            }
        })
          , S = function(t) {
            t = arguments.length ? [t] : Object.keys(P),
            t.forEach(function(t) {
                var e;
                if (P[t])
                    try {
                        e = P[t](p[t])
                    } catch (i) {
                        e = u[t]
                    } finally {
                        p[t] = e
                    }
            })
        }
          , C = function(t, e) {
            var i = !1
              , n = p[t];
            return p[t] != e && (p[t] = e,
            S(t),
            i = n != p[t]),
            i
        }
          , O = function(t) {
            c[t] || (c[t] = function(e) {
                return arguments.length ? ("duration" === t && (s = void 0),
                C(t, e) && (c.trigger("change", {
                    what: t,
                    newval: p[t]
                }),
                n.shifts.indexOf(t) > -1 && c.trigger("shift", {
                    reason: t
                })),
                c) : p[t]
            }
            )
        };
        this.controller = function() {
            return o
        }
        ,
        this.state = function() {
            return f
        }
        ,
        this.scrollOffset = function() {
            return m.start
        }
        ,
        this.triggerPosition = function() {
            var t = p.offset;
            return o && (t += p.triggerElement ? _ : o.info("size") * c.triggerHook()),
            t
        }
        ;
        var E, R;
        c.on("shift.internal", function(t) {
            var e = "duration" === t.reason;
            (f === h && e || f === l && 0 === p.duration) && k(),
            e && z()
        }).on("progress.internal", function() {
            k()
        }).on("add.internal", function() {
            z()
        }).on("destroy.internal", function(t) {
            c.removePin(t.reset)
        });
        var k = function(t) {
            if (E && o) {
                var e = o.info()
                  , i = R.spacer.firstChild;
                if (t || f !== l) {
                    var n = {
                        position: R.inFlow ? "relative" : "absolute",
                        top: 0,
                        left: 0
                    }
                      , s = r.css(i, "position") != n.position;
                    R.pushFollowers ? p.duration > 0 && (f === h && 0 === parseFloat(r.css(R.spacer, "padding-top")) ? s = !0 : f === a && 0 === parseFloat(r.css(R.spacer, "padding-bottom")) && (s = !0)) : n[e.vertical ? "top" : "left"] = p.duration * d,
                    r.css(i, n),
                    s && z()
                } else {
                    "fixed" != r.css(i, "position") && (r.css(i, {
                        position: "fixed"
                    }),
                    z());
                    var u = r.get.offset(R.spacer, !0)
                      , c = p.reverse || 0 === p.duration ? e.scrollPos - m.start : Math.round(d * p.duration * 10) / 10;
                    u[e.vertical ? "top" : "left"] += c,
                    r.css(R.spacer.firstChild, {
                        top: u.top,
                        left: u.left
                    })
                }
            }
        }
          , z = function() {
            if (E && o && R.inFlow) {
                var t = f === l
                  , e = o.info("vertical")
                  , i = R.spacer.firstChild
                  , n = r.isMarginCollapseType(r.css(R.spacer, "display"))
                  , s = {};
                R.relSize.width || R.relSize.autoFullWidth ? t ? r.css(E, {
                    width: r.get.width(R.spacer)
                }) : r.css(E, {
                    width: "100%"
                }) : (s["min-width"] = r.get.width(e ? E : i, !0, !0),
                s.width = t ? s["min-width"] : "auto"),
                R.relSize.height ? t ? r.css(E, {
                    height: r.get.height(R.spacer) - (R.pushFollowers ? p.duration : 0)
                }) : r.css(E, {
                    height: "100%"
                }) : (s["min-height"] = r.get.height(e ? i : E, !0, !n),
                s.height = t ? s["min-height"] : "auto"),
                R.pushFollowers && (s["padding" + (e ? "Top" : "Left")] = p.duration * d,
                s["padding" + (e ? "Bottom" : "Right")] = p.duration * (1 - d)),
                r.css(R.spacer, s)
            }
        }
          , A = function() {
            o && E && f === l && !o.info("isDocument") && k()
        }
          , M = function() {
            o && E && f === l && ((R.relSize.width || R.relSize.autoFullWidth) && r.get.width(window) != r.get.width(R.spacer.parentNode) || R.relSize.height && r.get.height(window) != r.get.height(R.spacer.parentNode)) && z()
        }
          , L = function(t) {
            o && E && f === l && !o.info("isDocument") && (t.preventDefault(),
            o._setScrollPos(o.info("scrollPos") - ((t.wheelDelta || t[o.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -t.detail)))
        };
        this.setPin = function(t, i) {
            var n = {
                pushFollowers: !0,
                spacerClass: "scrollmagic-pin-spacer"
            };
            if (i = r.extend({}, n, i),
            t = r.get.elements(t)[0],
            !t)
                return c;
            if ("fixed" === r.css(t, "position"))
                return c;
            if (E) {
                if (E === t)
                    return c;
                c.removePin()
            }
            E = t;
            var s = E.parentNode.style.display
              , o = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
            E.parentNode.style.display = "none";
            var a = "absolute" != r.css(E, "position")
              , l = r.css(E, o.concat(["display"]))
              , h = r.css(E, ["width", "height"]);
            E.parentNode.style.display = s,
            !a && i.pushFollowers && (i.pushFollowers = !1);
            var u = E.parentNode.insertBefore(document.createElement("div"), E)
              , p = r.extend(l, {
                position: a ? "relative" : "absolute",
                boxSizing: "content-box",
                mozBoxSizing: "content-box",
                webkitBoxSizing: "content-box"
            });
            if (a || r.extend(p, r.css(E, ["width", "height"])),
            r.css(u, p),
            u.setAttribute(e, ""),
            r.addClass(u, i.spacerClass),
            R = {
                spacer: u,
                relSize: {
                    width: "%" === h.width.slice(-1),
                    height: "%" === h.height.slice(-1),
                    autoFullWidth: "auto" === h.width && a && r.isMarginCollapseType(l.display)
                },
                pushFollowers: i.pushFollowers,
                inFlow: a
            },
            !E.___origStyle) {
                E.___origStyle = {};
                var f = E.style
                  , d = o.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
                d.forEach(function(t) {
                    E.___origStyle[t] = f[t] || ""
                })
            }
            return R.relSize.width && r.css(u, {
                width: h.width
            }),
            R.relSize.height && r.css(u, {
                height: h.height
            }),
            u.appendChild(E),
            r.css(E, {
                position: a ? "relative" : "absolute",
                margin: "auto",
                top: "auto",
                left: "auto",
                bottom: "auto",
                right: "auto"
            }),
            (R.relSize.width || R.relSize.autoFullWidth) && r.css(E, {
                boxSizing: "border-box",
                mozBoxSizing: "border-box",
                webkitBoxSizing: "border-box"
            }),
            window.addEventListener("scroll", A),
            window.addEventListener("resize", A),
            window.addEventListener("resize", M),
            E.addEventListener("mousewheel", L),
            E.addEventListener("DOMMouseScroll", L),
            k(),
            c
        }
        ,
        this.removePin = function(t) {
            if (E) {
                if (f === l && k(!0),
                t || !o) {
                    var i = R.spacer.firstChild;
                    if (i.hasAttribute(e)) {
                        var n = R.spacer.style
                          , s = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                        margins = {},
                        s.forEach(function(t) {
                            margins[t] = n[t] || ""
                        }),
                        r.css(i, margins)
                    }
                    R.spacer.parentNode.insertBefore(i, R.spacer),
                    R.spacer.parentNode.removeChild(R.spacer),
                    E.parentNode.hasAttribute(e) || (r.css(E, E.___origStyle),
                    delete E.___origStyle)
                }
                window.removeEventListener("scroll", A),
                window.removeEventListener("resize", A),
                window.removeEventListener("resize", M),
                E.removeEventListener("mousewheel", L),
                E.removeEventListener("DOMMouseScroll", L),
                E = void 0
            }
            return c
        }
        ;
        var I, D = [];
        return c.on("destroy.internal", function(t) {
            c.removeClassToggle(t.reset)
        }),
        this.setClassToggle = function(t, e) {
            var i = r.get.elements(t);
            return 0 !== i.length && r.type.String(e) ? (D.length > 0 && c.removeClassToggle(),
            I = e,
            D = i,
            c.on("enter.internal_class leave.internal_class", function(t) {
                var e = "enter" === t.type ? r.addClass : r.removeClass;
                D.forEach(function(t) {
                    e(t, I)
                })
            }),
            c) : c
        }
        ,
        this.removeClassToggle = function(t) {
            return t && D.forEach(function(t) {
                r.removeClass(t, I)
            }),
            c.off("start.internal_class end.internal_class"),
            I = void 0,
            D = [],
            c
        }
        ,
        v(),
        c
    }
    ;
    var n = {
        defaults: {
            duration: 0,
            offset: 0,
            triggerElement: void 0,
            triggerHook: .5,
            reverse: !0,
            loglevel: 2
        },
        validate: {
            offset: function(t) {
                if (t = parseFloat(t),
                !r.type.Number(t))
                    throw 0;
                return t
            },
            triggerElement: function(t) {
                if (t = t || void 0) {
                    var e = r.get.elements(t)[0];
                    if (!e)
                        throw 0;
                    t = e
                }
                return t
            },
            triggerHook: function(t) {
                var e = {
                    onCenter: .5,
                    onEnter: 1,
                    onLeave: 0
                };
                if (r.type.Number(t))
                    t = Math.max(0, Math.min(parseFloat(t), 1));
                else {
                    if (!(t in e))
                        throw 0;
                    t = e[t]
                }
                return t
            },
            reverse: function(t) {
                return !!t
            }
        },
        shifts: ["duration", "offset", "triggerHook"]
    };
    t.Scene.addOption = function(t, e, i, r) {
        t in n.defaults || (n.defaults[t] = e,
        n.validate[t] = i,
        r && n.shifts.push(t))
    }
    ,
    t.Scene.extend = function(e) {
        var i = this;
        t.Scene = function() {
            return i.apply(this, arguments),
            this.$super = r.extend({}, this),
            e.apply(this, arguments) || this
        }
        ,
        r.extend(t.Scene, i),
        t.Scene.prototype = i.prototype,
        t.Scene.prototype.constructor = t.Scene
    }
    ,
    t.Event = function(t, e, i, n) {
        n = n || {};
        for (var r in n)
            this[r] = n[r];
        return this.type = t,
        this.target = this.currentTarget = i,
        this.namespace = e || "",
        this.timeStamp = this.timestamp = Date.now(),
        this
    }
    ;
    var r = t._util = function(t) {
        var e, i = {}, n = function(t) {
            return parseFloat(t) || 0
        }, r = function(e) {
            return e.currentStyle ? e.currentStyle : t.getComputedStyle(e)
        }, s = function(e, i, s, o) {
            if (i = i === document ? t : i,
            i === t)
                o = !1;
            else if (!c.DomElement(i))
                return 0;
            e = e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
            var a = (s ? i["offset" + e] || i["outer" + e] : i["client" + e] || i["inner" + e]) || 0;
            if (s && o) {
                var l = r(i);
                a += "Height" === e ? n(l.marginTop) + n(l.marginBottom) : n(l.marginLeft) + n(l.marginRight)
            }
            return a
        }, o = function(t) {
            return t.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(t) {
                return t[1].toUpperCase()
            })
        };
        i.extend = function(t) {
            for (t = t || {},
            e = 1; e < arguments.length; e++)
                if (arguments[e])
                    for (var i in arguments[e])
                        arguments[e].hasOwnProperty(i) && (t[i] = arguments[e][i]);
            return t
        }
        ,
        i.isMarginCollapseType = function(t) {
            return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(t) > -1
        }
        ;
        var a = 0
          , l = ["ms", "moz", "webkit", "o"]
          , h = t.requestAnimationFrame
          , u = t.cancelAnimationFrame;
        for (e = 0; !h && e < l.length; ++e)
            h = t[l[e] + "RequestAnimationFrame"],
            u = t[l[e] + "CancelAnimationFrame"] || t[l[e] + "CancelRequestAnimationFrame"];
        h || (h = function(e) {
            var i = (new Date).getTime()
              , n = Math.max(0, 16 - (i - a))
              , r = t.setTimeout(function() {
                e(i + n)
            }, n);
            return a = i + n,
            r
        }
        ),
        u || (u = function(e) {
            t.clearTimeout(e)
        }
        ),
        i.rAF = h.bind(t),
        i.cAF = u.bind(t);
        var c = i.type = function(t) {
            return Object.prototype.toString.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
        }
        ;
        c.String = function(t) {
            return "string" === c(t)
        }
        ,
        c.Function = function(t) {
            return "function" === c(t)
        }
        ,
        c.Array = function(t) {
            return Array.isArray(t)
        }
        ,
        c.Number = function(t) {
            return !c.Array(t) && t - parseFloat(t) + 1 >= 0
        }
        ,
        c.DomElement = function(t) {
            return "object" == typeof HTMLElement ? t instanceof HTMLElement : t && "object" == typeof t && null !== t && 1 === t.nodeType && "string" == typeof t.nodeName
        }
        ;
        var p = i.get = {};
        return p.elements = function(e) {
            var i = [];
            if (c.String(e))
                try {
                    e = document.querySelectorAll(e)
                } catch (n) {
                    return i
                }
            if ("nodelist" === c(e) || c.Array(e))
                for (var r = 0, s = i.length = e.length; s > r; r++) {
                    var o = e[r];
                    i[r] = c.DomElement(o) ? o : p.elements(o)
                }
            else
                (c.DomElement(e) || e === document || e === t) && (i = [e]);
            return i
        }
        ,
        p.scrollTop = function(e) {
            return e && "number" == typeof e.scrollTop ? e.scrollTop : t.pageYOffset || 0
        }
        ,
        p.scrollLeft = function(e) {
            return e && "number" == typeof e.scrollLeft ? e.scrollLeft : t.pageXOffset || 0
        }
        ,
        p.width = function(t, e, i) {
            return s("width", t, e, i)
        }
        ,
        p.height = function(t, e, i) {
            return s("height", t, e, i)
        }
        ,
        p.offset = function(t, e) {
            var i = {
                top: 0,
                left: 0
            };
            if (t && t.getBoundingClientRect) {
                var n = t.getBoundingClientRect();
                i.top = n.top,
                i.left = n.left,
                e || (i.top += p.scrollTop(),
                i.left += p.scrollLeft())
            }
            return i
        }
        ,
        i.addClass = function(t, e) {
            e && (t.classList ? t.classList.add(e) : t.className += " " + e)
        }
        ,
        i.removeClass = function(t, e) {
            e && (t.classList ? t.classList.remove(e) : t.className = t.className.replace(RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " "))
        }
        ,
        i.css = function(t, e) {
            if (c.String(e))
                return r(t)[o(e)];
            if (c.Array(e)) {
                var i = {}
                  , n = r(t);
                return e.forEach(function(t) {
                    i[t] = n[o(t)]
                }),
                i
            }
            for (var s in e) {
                var a = e[s];
                a == parseFloat(a) && (a += "px"),
                t.style[o(s)] = a
            }
        }
        ,
        i
    }(window || {});
    return t
}),
!function(t, e) {
    "function" == typeof define && define.amd ? define(["ScrollMagic", "TweenMax", "TimelineMax"], e) : "object" == typeof exports ? (require("gsap"),
    e(require("scrollmagic"), TweenMax, TimelineMax)) : e(t.ScrollMagic || t.jQuery && t.jQuery.ScrollMagic, t.TweenMax || t.TweenLite, t.TimelineMax || t.TimelineLite)
}(this, function(t, e, i) {
    "use strict";
    t.Scene.addOption("tweenChanges", !1, function(t) {
        return !!t
    }),
    t.Scene.extend(function() {
        var t, n = this;
        n.on("progress.plugin_gsap", function() {
            r()
        }),
        n.on("destroy.plugin_gsap", function(t) {
            n.removeTween(t.reset)
        });
        var r = function() {
            if (t) {
                var e = n.progress()
                  , i = n.state();
                t.repeat && -1 === t.repeat() ? "DURING" === i && t.paused() ? t.play() : "DURING" === i || t.paused() || t.pause() : e != t.progress() && (0 === n.duration() ? e > 0 ? t.play() : t.reverse() : n.tweenChanges() && t.tweenTo ? t.tweenTo(e * t.duration()) : t.progress(e).pause())
            }
        };
        n.setTween = function(s, o, a) {
            var l;
            arguments.length > 1 && (arguments.length < 3 && (a = o,
            o = 1),
            s = e.to(s, o, a));
            try {
                l = i ? new i({
                    smoothChildTiming: !0
                }).add(s) : s,
                l.pause()
            } catch (h) {
                return n
            }
            return t && n.removeTween(),
            t = l,
            s.repeat && -1 === s.repeat() && (t.repeat(-1),
            t.yoyo(s.yoyo())),
            r(),
            n
        }
        ,
        n.removeTween = function(e) {
            return t && (e && t.progress(0).pause(),
            t.kill(),
            t = void 0),
            n
        }
    })
}),
function($) {
    $(document).ready(function() {
        function t(t, e, i, n, r, s) {
            var o = [{
                featureType: "all",
                stylers: [{
                    saturation: -80
                }]
            }, {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#bae8e4"
                }]
            }, {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{
                    color: "#fff"
                }]
            }, {
                featureType: "poi",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "administrative",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [{
                    color: e
                }, {
                    saturation: "-30"
                }, {
                    lightness: "30"
                }]
            }, {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{
                    color: e
                }, {
                    saturation: "-30"
                }, {
                    lightness: "30"
                }]
            }, {
                featureType: "landscape",
                stylers: [{
                    color: i
                }]
            }, {
                featureType: "transit",
                stylers: [{
                    color: i
                }]
            }, {
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                elementType: "labels.text",
                stylers: [{
                    visibility: "on"
                }]
            }, {
                elementType: "labels.icon",
                stylers: [{
                    visibility: "on"
                }]
            }]
              , a = new google.maps.Map(t,{
                center: {
                    lat: n,
                    lng: r
                },
                scrollwheel: !1,
                styles: o,
                zoom: 11
            })
              , l = new google.maps.Marker({
                map: a,
                position: {
                    lat: n,
                    lng: r
                },
                animation: google.maps.Animation.DROP,
                title: "Our Location!"
            })
              , h = new google.maps.InfoWindow({
                content: s
            });
            google.maps.event.addListener(l, "click", function() {
                h.open(a, l)
            }),
            window.setTimeout(function() {
                h.open(a, l)
            }, 1e3)
        }
        var e = function(t, e) {
            var i;
            return function() {
                var n = Array.prototype.slice.call(arguments)
                  , r = this;
                clearTimeout(i),
                i = setTimeout(function() {
                    t.apply(r, n)
                }, e)
            }
        }
          , i = function(t, e, i) {
            var n = t || e
              , i = i || 1
              , r = parseInt(n);
            if (n.indexOf("%") >= 0) {
                var s = r / 100;
                return function() {
                    return window.innerHeight * s * i
                }
            }
            return NaN !== r ? function() {
                return r * i
            }
            : function() {
                return window.innerHeight * i
            }
        }
          , n = function(t, e, i) {
            var n = $(window).scrollTop() - i
              , r = 1 - n / e
              , s = e
              , o = i + s
              , a = Math.max(r * s, t);
            return [o, a]
        }
          , r = function(t, e) {
            if (t)
                if (t.progress(0),
                t.invalidate(),
                e)
                    for (var i = t.getChildren(), n = 0; n < i.length; n++)
                        TweenMax.set(i[n].target, {
                            clearProps: "all"
                        });
                else
                    TweenMax.set(t.target, {
                        clearProps: "all"
                    })
        }
          , s = function(t, e) {
            for (var i = 0; i < e.length; i++)
                if (t.hasClass(e[i]))
                    return !0;
            return !1
        };
        $(".read-more").off("click.read-more").on("click.read-more", function() {
            var t = $(this).closest(".section").outerHeight()
              , e = t || window.innerHeight;
            $("body").animate({
                scrollTop: e
            }, 1e3)
        });
        var o = new ScrollMagic.Controller
          , a = {
            blogTitle: "blogTitle",
            horizontalHalf: "horizontalHalf",
            zoomOut: "zoomOut",
            phoneWall: "phoneWall",
            flipOut: "flipOut",
            circleReveal: "circleReveal",
            shuffleOver: "shuffleOver",
            shuffleUnder: "shuffleUnder",
            staggeredElement: "staggeredElement",
            elementTransition: "elementTransition"
        }
          , l = ["scale", "up", "right", "down", "left", "rotate-y", "rotate-x"]
          , h = ["fade", "lid-tilt", "phone-arc"]
          , u = function(t) {
            for (var e = "", i = 0; i < t.length; i++)
                i > 0 && (e += ", "),
                e += "." + t[i] + "-in, ",
                e += "." + t[i] + "-in-out, ",
                e += "." + t[i] + "-out, ",
                e += "." + t[i] + "-out-in";
            return e
        }
          , c = u(l)
          , p = c.replace(/[.]+/g, "").split(", ")
          , f = c + ", " + u(h)
          , d = f.replace(/[.]+/g, "").split(", ")
          , m = d.filter(function(t) {
            return t.indexOf("in-out") < 0 && t.indexOf("out-in") < 0
        })
          , _ = {}
          , g = 0
          , v = {
            init: function(t) {
                var l = {
                    duration: void 0,
                    responsiveThreshold: 768,
                    scrollTriggered: !1,
                    staggeredDelay: .8,
                    reset: !0
                };
                t = $.extend(l, t);
                var h = window.location.hash.substring(1);
                return this.each(function(l) {
                    var h = $(this)
                      , u = h.attr("data-duration") || t.duration
                      , c = h.attr("data-responsivethreshold") || t.responsiveThreshold
                      , v = h.attr("data-staggereddelay") || t.staggeredDelay
                      , y = t.reset;
                    if (!h.parent(".fb").length || !s(h, d)) {
                        var T = !1
                          , w = h.attr("data-id");
                        w || (g++,
                        w = g,
                        h.attr("data-id", w),
                        T = !0);
                        var x = $("nav.n").first()
                          , b = h.offset().top
                          , P = i(u, h.outerHeight() + "px")
                          , S = i(u, "50%")
                          , C = i(u, "100%")
                          , O = i(u, "150%")
                          , E = function(t) {
                            "FORWARD" === t.scrollDirection ? x.addClass("ao") : x.removeClass("ao")
                        }
                          , R = function(t) {
                            "FORWARD" === t.scrollDirection ? (x.removeClass("fj"),
                            x.addClass("ao")) : (x.addClass("fj"),
                            x.removeClass("ao"))
                        };
                        if (window.innerWidth >= c) {
                            if (h.hasClass("gh")) {
                                var k = h.find(".fade-transition")
                                  , z = TweenMax.to(k, 1, {
                                    scale: "0",
                                    opacity: 0,
                                    ease: Power2.easeIn
                                })
                                  , A = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: S
                                }).setTween(z).addTo(o);
                                _[w] = {
                                    type: a.blogTitle,
                                    sceneTweenPairs: [{
                                        scene: A,
                                        tween: z
                                    }]
                                }
                            } else if (h.hasClass("gn")) {
                                var M = i(u, "150%", .33);
                                h.find(".read-more").off("click.read-more").on("click.read-more", function() {
                                    var t = O() + window.innerHeight
                                      , e = n(300, t, b);
                                    $("body").animate({
                                        scrollTop: e[0]
                                    }, e[1])
                                });
                                var L = h.find(".laptop-preview-sizer")
                                  , I = h.find(".header-wrapper")
                                  , D = TweenMax.to(L, 1, {
                                    scale: .5,
                                    ease: Power2.easeInOut
                                })
                                  , F = TweenMax.to(I, 1, {
                                    opacity: 0,
                                    ease: Power2.easeInOut
                                })
                                  , N = TweenMax.to(x, 1, {
                                    opacity: 0,
                                    ease: Power2.easeInOut
                                })
                                  , j = function(t) {
                                    "FORWARD" === t.scrollDirection ? x.addClass("g") : x.removeClass("g")
                                }
                                  , W = function(t) {
                                    "FORWARD" === t.scrollDirection ? (x.addClass("ao"),
                                    setTimeout(function() {
                                        x.css("opacity", "")
                                    }, 0)) : (x.removeClass("ao"),
                                    setTimeout(function() {
                                        x.css("opacity", 0)
                                    }, 0))
                                }
                                  , A = new ScrollMagic.Scene({
                                    duration: O
                                }).setTween(D).setPin(h[0]).on("end", j).addTo(o)
                                  , B = new ScrollMagic.Scene({
                                    duration: M
                                }).setTween(F).on("end", W).addTo(o)
                                  , X = new ScrollMagic.Scene({
                                    duration: M
                                }).setTween(N).addTo(o);
                                _[w] = {
                                    type: a.zoomOut,
                                    sceneTweenPairs: [{
                                        scene: A,
                                        tween: D
                                    }, {
                                        scene: B,
                                        tween: F
                                    }, {
                                        scene: X,
                                        tween: N
                                    }]
                                }
                            } else if (h.hasClass("gg")) {
                                h.find(".read-more").off("click.read-more").on("click.read-more", function() {
                                    var t = C()
                                      , e = n(300, t, b);
                                    $("body").animate({
                                        scrollTop: e[0]
                                    }, e[1])
                                });
                                var Y = h.find(".column-one")
                                  , q = h.find(".column-two")
                                  , U = Y.add(q)
                                  , I = h.find(".header-wrapper")
                                  , H = new TimelineMax;
                                U.each(function() {
                                    var t = $(this)
                                      , e = t.find(".phone-preview-sizer")
                                      , i = e.length;
                                    e.each(function(t) {
                                        var e = i - t
                                          , n = Math.round(10 * (Math.random() / 2 + .5)) / 10 * e;
                                        H.to(this, 1, {
                                            className: "+=g",
                                            ease: Power2.easeInOut
                                        }, n)
                                    })
                                });
                                var A = new ScrollMagic.Scene({
                                    duration: C
                                }).setTween(H).setPin(h[0]).on("end", R).addTo(o);
                                _[w] = {
                                    type: a.phoneWall,
                                    sceneTweenPairs: [{
                                        scene: A,
                                        tween: H,
                                        isTimeline: !0
                                    }]
                                }
                            } else if (h.hasClass("gl")) {
                                var V = i(u, "100%", 2);
                                h.find(".read-more").off("click.read-more").on("click.read-more", function(t) {
                                    t.stopPropagation();
                                    var e = C()
                                      , i = n(300, e, b);
                                    $("body").animate({
                                        scrollTop: i[0]
                                    }, i[1])
                                });
                                var Q = h.find(".fixed-wrapper")
                                  , I = h.find(".header-wrapper")
                                  , G = h.is($(".gl").first()) && 0 === h.scrollTop();
                                Q.on("click", function() {
                                    var t = h.offset().top
                                      , e = Math.abs($(window).scrollTop() - t)
                                      , i = e / window.innerHeight
                                      , n = Math.max(1200 * i, 200);
                                    $("body").animate({
                                        scrollTop: t
                                    }, n)
                                });
                                var z, Z = !1;
                                G ? z = TweenMax.to(Q, 1, {
                                    scale: .4,
                                    rotationX: 110,
                                    y: "-40%"
                                }) : (Z = !0,
                                z = new TimelineMax,
                                z.set(Q, {
                                    scale: .3,
                                    rotationX: 110,
                                    y: "-100%"
                                }),
                                z.to(Q, 1, {
                                    scale: 1,
                                    rotationX: 0,
                                    y: "0%"
                                }),
                                z.to(Q, 1, {
                                    scale: .4,
                                    rotationX: 110,
                                    y: "-40%"
                                }));
                                var A;
                                A = G ? new ScrollMagic.Scene({
                                    duration: C
                                }).setTween(z).addTo(o) : new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onEnter",
                                    duration: V
                                }).setTween(z).addTo(o),
                                _[w] = {
                                    type: a.flipOut,
                                    sceneTweenPairs: [{
                                        scene: A,
                                        tween: z,
                                        isTimeline: Z
                                    }]
                                }
                            } else if (h.hasClass("ga")) {
                                h.find(".read-more").off("click.read-more").on("click.read-more", function(t) {
                                    var e = $(this).closest(".circle-reveal-wrapper").index(".circle-reveal-wrapper") + 1;
                                    $("body").animate({
                                        scrollTop: b + window.innerHeight * e
                                    }, 800)
                                });
                                var J = new TimelineMax
                                  , K = new TimelineMax
                                  , tt = $(".circle-reveal-wrapper").length
                                  , et = function() {
                                    return window.innerHeight * tt
                                };
                                h.find(".circle-reveal-wrapper").each(function(t) {
                                    var e = $(this)
                                      , i = e.find(".header-wrapper")
                                      , n = e.find(".circle-background");
                                    e.css("z-index", tt - t),
                                    J.to(n, 1, {
                                        scale: 0,
                                        ease: Power2.easeInOut
                                    }),
                                    K.to(i, .5, {
                                        opacity: 0,
                                        ease: Power2.easeInOut,
                                        onComplete: function() {
                                            e.next(".circle-reveal-wrapper").find(".circle-background").hasClass("l") ? x.addClass("bi") : x.removeClass("bi"),
                                            e.css("pointer-events", "none")
                                        },
                                        onReverseComplete: function() {
                                            var t = e.prev(".circle-reveal-wrapper").length ? e.prev(".circle-reveal-wrapper") : e;
                                            t.find(".circle-background").hasClass("l") ? x.addClass("bi") : x.removeClass("bi"),
                                            e.css("pointer-events", "")
                                        }
                                    }).to({}, .5, {})
                                });
                                var A = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: et
                                }).setTween(J).setPin(h[0]).addTo(o)
                                  , B = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: et
                                }).setTween(K).on("end", E).addTo(o);
                                _[w] = {
                                    type: a.circleReveal,
                                    sceneTweenPairs: [{
                                        scene: A,
                                        tween: J,
                                        isTimeline: !0
                                    }, {
                                        scene: B,
                                        tween: K,
                                        isTimeline: !0
                                    }]
                                }
                            } else if (h.hasClass("fh")) {
                                h.find(".read-more").off("click.read-more").on("click.read-more", function(t) {
                                    var e = $(this).closest(".horizontal-half-wrapper").index(".horizontal-half-wrapper") + 1;
                                    $("body").animate({
                                        scrollTop: b + 2 * window.innerHeight * e
                                    }, 1200)
                                });
                                var it = h.find(".phone-preview-sizer")
                                  , nt = h.find(".horizontal-half-wrapper")
                                  , et = function() {
                                    return window.innerHeight * (2 * nt.length - 1)
                                }
                                  , rt = new TimelineMax
                                  , st = new TimelineMax
                                  , K = new TimelineMax;
                                nt.each(function(t) {
                                    var e = $(this).hasClass("he") ? "right" : "left"
                                      , i = {
                                        ease: Power4.easeInOut
                                    }
                                      , n = {
                                        ease: Power3.easeInOut
                                    }
                                      , r = {
                                        opacity: 1,
                                        ease: Power2.easeInOut,
                                        delay: .5
                                    }
                                      , s = {
                                        ease: Power3.easeInOut
                                    }
                                      , o = {
                                        opacity: 0,
                                        ease: Power2.easeInOut
                                    }
                                      , a = function(t) {
                                        var e = it.find(".image-container")
                                          , i = e.eq(t);
                                        i.length && (e.removeClass("g"),
                                        i.addClass("g"))
                                    }
                                      , l = $(this).find(".header-wrapper")
                                      , h = $(this).find(".header-background");
                                    0 === t && st.set($(this), {
                                        zIndex: 1
                                    }),
                                    $(this).hasClass("g") || (i.left = "right" === e ? "25%" : "75%",
                                    i.onStart = function() {
                                        a(t)
                                    }
                                    ,
                                    i.onReverseComplete = function() {
                                        a(t - 1)
                                    }
                                    ,
                                    rt.to(it, .8, i),
                                    rt.to({}, .2, {}),
                                    st.set($(this), {
                                        zIndex: 1
                                    }),
                                    n[e] = "+=100%",
                                    st.to(h, 1, n),
                                    r[e] = "+=50px",
                                    K.to(l, .5, r)),
                                    rt.to(it, .8, {
                                        left: "50%",
                                        ease: Power4.easeInOut,
                                        delay: .2
                                    }),
                                    s[e] = "-=100%",
                                    st.to(h, 1, s),
                                    st.set($(this), {
                                        zIndex: -1
                                    }),
                                    o[e] = "-=50px",
                                    K.to(l, .5, o),
                                    K.to({}, .5, {})
                                });
                                var ot = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: et
                                }).setTween(rt).setPin(h[0]).addTo(o)
                                  , B = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: et
                                }).setTween(st).addTo(o)
                                  , X = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: et
                                }).setTween(K).on("end", R).addTo(o);
                                _[w] = {
                                    type: a.horizontalHalf,
                                    sceneTweenPairs: [{
                                        scene: ot,
                                        tween: rt,
                                        isTimeline: !0
                                    }, {
                                        scene: B,
                                        tween: st,
                                        isTimeline: !0
                                    }, {
                                        scene: X,
                                        tween: K,
                                        isTimeline: !0
                                    }]
                                }
                            } else if (h.hasClass("fr")) {
                                var at = i(u, "100%")
                                  , ot = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onLeave",
                                    duration: at
                                }).setClassToggle(h[0], "z-depth-1").setPin(h[0], {
                                    pushFollowers: !1
                                }).addTo(o);
                                _[w] = {
                                    type: a.shuffleOver,
                                    sceneTweenPairs: [{
                                        scene: ot
                                    }]
                                }
                            } else if (h.hasClass("fn")) {
                                var ot = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onEnter",
                                    duration: P
                                }).on("end", function() {
                                    h.toggleClass("shuffle-under-end")
                                }).setClassToggle(h[0], "shuffle-under-active").setPin(h[0], {
                                    pushFollowers: !1
                                }).addTo(o);
                                _[w] = {
                                    type: a.shuffleUnder,
                                    sceneTweenPairs: [{
                                        scene: ot
                                    }]
                                }
                            } else if (h.hasClass("fb")) {
                                var lt = h.find(f)
                                  , ht = new TimelineMax;
                                lt.each(function() {
                                    ht.to(this, 1, {
                                        className: "+=g",
                                        ease: Power3.easeInOut
                                    }, "-=" + v)
                                });
                                var ot = new ScrollMagic.Scene({
                                    triggerElement: h[0],
                                    triggerHook: "onEnter",
                                    duration: P
                                }).setTween(ht).addTo(o);
                                _[w] = {
                                    type: a.staggeredElement,
                                    sceneTweenPairs: [{
                                        scene: ot,
                                        tween: ht,
                                        isTimeline: !0
                                    }]
                                }
                            } else if (s(h, d)) {
                                var ut = h[0];
                                s(h, p) && (ut = h.parent()[0]);
                                var ct = !s(h, m)
                                  , z = TweenMax.to($(this), 1, {
                                    className: "+=g",
                                    ease: Power3.easeInOut
                                })
                                  , ot = new ScrollMagic.Scene({
                                    triggerElement: ut,
                                    triggerHook: "onEnter",
                                    duration: P,
                                    offset: 100,
                                    reverse: ct
                                }).setTween(z).addTo(o);
                                _[w] = {
                                    type: a.elementTransition,
                                    sceneTweenPairs: [{
                                        scene: ot,
                                        tween: z
                                    }]
                                }
                            }
                        } else
                            h.attr("data-disabled", !0);
                        var pt = e(function() {
                            var t = window.innerWidth
                              , e = "true" === h.attr("data-disabled");
                            if (e)
                                window.innerWidth >= c && (h.attr("data-disabled", !1),
                                h.scrollTransition({
                                    reset: !1
                                }));
                            else {
                                for (var i = _[w].type, n = _[w].sceneTweenPairs, s = 0; s < n.length; s++) {
                                    var o = n[s].tween
                                      , a = n[s].isTimeline === !0
                                      , l = n[s].scene;
                                    window.innerWidth < c && h.attr("data-disabled", !0),
                                    r(o, a),
                                    l.destroy(!0)
                                }
                                "true" !== h.attr("data-disabled") && h.scrollTransition({
                                    reset: !1
                                })
                            }
                        }, 400);
                        $(window).off("resize.scrollTransition" + w).on("resize.scrollTransition" + w, pt)
                    }
                })
            },
            destroy: function() {
                for (var t = $(this), e = t.attr("data-id"), i = _[e].type, n = _[e].sceneTweenPairs, s = 0; s < n.length; s++) {
                    var o = n[s].tween
                      , a = n[s].isTimeline === !0
                      , l = n[s].scene;
                    t.attr("data-disabled", !0),
                    r(o, a),
                    l.destroy(!0)
                }
                t.attr("data-id", ""),
                delete _[e],
                $(window).off("resize.scrollTransition" + e)
            }
        };
        $.fn.scrollTransition = function(t) {
            return v[t] ? v[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void $.error("Method " + t + " does not exist on jQuery.scrollTransition") : v.init.apply(this, arguments)
        }
        ,
        $(".gh").scrollTransition(),
        $(".gn").scrollTransition(),
        $(".gg").scrollTransition(),
        $(".gl").scrollTransition(),
        $(".ga").scrollTransition(),
        $(".fh").scrollTransition(),
        $(".fr").scrollTransition(),
        $(".fn").scrollTransition(),
        $(".fb").scrollTransition(),
        $(f).scrollTransition(),
        $(window).on("scroll.navbar", function() {
            var t = $("nav.n").first();
            t.hasClass("fq") && ($(window).scrollTop() > 0 ? t.addClass("ao") : t.removeClass("ao"))
        });
        var y = $(".masonry-grid");
        if (y.length && y.imagesLoaded(function() {
            y.masonry({
                columnWidth: ".col",
                itemSelector: ".col"
            })
        }),
        "object" == typeof google && "object" == typeof google.maps) {
            var T = 37.7576793
              , w = -122.4
              , x = "#7CFFE6"
              , b = "#fafafa"
              , P = "123 Main Street, San Francisco, CA 94110"
              , S = $(".google-map").first();
            S.length && t(S[0], x, b, T, w, P)
        }
    })
}(jQuery),
function($) {
    $(function() {
        $(".carousel.carousel-slider").carousel({
            fullWidth: !0
        }),
        $(".carousel").carousel(),
        $(".slider").slider(),
        $(".parallax").parallax(),
        $(".modal").modal(),
        $(".scrollspy").scrollSpy(),
        $(".button-collapse").sideNav({
            edge: "left"
        }),
        $(".datepicker").pickadate({
            selectYears: 20
        }),
        $("select").not(".disabled").material_select(),
        $("input.autocomplete").autocomplete({
            data: {
                Apple: null,
                Microsoft: null,
                Google: "http://placehold.it/250x250"
            }
        }),
        $(".chips").material_chip(),
        $(".chips-initial").material_chip({
            readOnly: !0,
            data: [{
                tag: "Apple"
            }, {
                tag: "Microsoft"
            }, {
                tag: "Google"
            }]
        }),
        $(".chips-placeholder").material_chip({
            placeholder: "Enter a tag",
            secondaryPlaceholder: "+Tag"
        }),
        $(".chips-autocomplete").material_chip({
            autocompleteOptions: {
                data: {
                    Apple: null,
                    Microsoft: null,
                    Google: null
                }
            }
        })
    })
}(jQuery);