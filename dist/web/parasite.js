var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var p$ = (function () {
    var ParasitedList = /** @class */ (function () {
        function ParasitedList() {
            this.length = 0;
        }
        ParasitedList.prototype.push = function (el) {
            if (el === void 0 || el.__lastList__ === this) {
                return this;
            }
            el.__lastList__ = this;
            this[this.length++] = el;
            return this;
        };
        ParasitedList.prototype.concat = function (obj) {
            var _this = this;
            if (!obj) {
                return this;
            }
            if (!obj.length) {
                return this.push(obj);
            }
            each(obj, function (_, el) { _this.push(el); });
            return this;
        };
        return ParasitedList;
    }());
    ParasitedList.prototype.splice = Array.prototype.splice;
    var Null = /** @class */ (function (_super) {
        __extends(Null, _super);
        function Null() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Null;
    }(ParasitedList));
    var GITHUB_URL = 'github.com/ECRomaneli/ParasiteJS';
    var LISTS = [NodeList, HTMLCollection, ParasitedList];
    var ALL = [Document, Element, Window];
    var DOC_AND_ELEMS = [Document, Element];
    var ELEMS = [Element];
    var DOC = document;
    var WIN = window || DOC.defaultView;
    var AUX = DOC.createElement('_');
    var NULL = new Null;
    var AJAX_CONFIG = {
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: 'GET',
        statusCode: {},
        xhr: function () { return new XMLHttpRequest; },
        headers: {},
        timeout: 0,
        async: true
    };
    var pjs = {};
    /* =============== FUNCTIONS =============== */
    pjs.trigger = function (event, params) {
        var customEvent = event;
        if (typeof event === 'string') {
            if (event === 'focus') {
                this.focus();
                return;
            }
            customEvent = createEvent(event);
        }
        customEvent.detail = {};
        each(params, function (key, value) {
            customEvent.detail[key] = value;
        });
        this.dispatchEvent(customEvent);
        return this;
    };
    pjs.on = function (types, handler, capture) {
        var _this = this;
        var el = this;
        handler.__handler__ = function () {
            return handler.apply(el, arguments);
        };
        eachTokens(types, function (type) { _this.addEventListener(type, handler.__handler__, capture); });
    };
    pjs.one = function (types, handler, capture) {
        var _this = this;
        var el = this;
        handler.__handler__ = function (e) {
            this.removeEventListener(e.type, handler.__handler__, capture);
            return handler.apply(el, arguments);
        };
        eachTokens(types, function (type) {
            _this.addEventListener(type, handler.__handler__, capture);
        });
    };
    pjs.off = function (types, handler, capture) {
        var _this = this;
        if (handler.__handler__) {
            handler = handler.__handler__;
        }
        eachTokens(types, function (type) {
            _this.removeEventListener(type, handler, capture);
        });
    };
    pjs.attr = function (attr, value) {
        var _this = this;
        if (typeof attr !== 'string') {
            each(attr, function (attr, value) { _this.attr(attr, value); });
            return this;
        }
        if (!isSet(value)) {
            return this.getAttribute(attr);
        }
        this.setAttribute(attr, value);
        return this;
    };
    pjs.removeAttr = function (attr) {
        this.removeAttribute(attr);
    };
    pjs.prop = function (prop, value) {
        var _this = this;
        if (typeof prop !== 'string') {
            each(prop, function (prop, value) { _this.prop(prop, value); });
            return this;
        }
        if (!isSet(value)) {
            return this[prop];
        }
        this[prop] = value;
        return this;
    };
    pjs.removeProp = function (prop) {
        if (isSet(this[prop])) {
            delete this[prop];
        }
        this.removeAttribute(prop);
    };
    pjs.val = function (value) { return this.prop('value', value); };
    pjs.text = function (text) {
        if (!isSet(text)) {
            return this.textContent;
        }
        this.textContent = text;
    };
    pjs.html = function (htmlStr) {
        if (!isSet(htmlStr)) {
            return this.innerHTML;
        }
        this.innerHTML = htmlStr;
    };
    pjs.data = function (key, value) {
        var _this = this;
        if (!this.__dataset__) {
            this.__dataset__ = {};
            each(this.dataset, function (key, value) {
                _this.__dataset__[key] = jsonParse(value);
            });
        }
        if (!isSet(key)) {
            return this.__dataset__;
        }
        if (isSet(value)) {
            this.__dataset__[key] = value;
            return this;
        }
        var data = this.__dataset__[key];
        if (isSet(data)) {
            return data;
        }
        data = this.attr(key);
        if (!isSet(data)) {
            return;
        }
        return this.__dataset__[key] = jsonParse(data);
    };
    pjs.css = function (style, value) {
        var _this = this;
        if (typeof style !== 'string') {
            each(style, function (style, value) { _this.css(style, value); });
            return this;
        }
        if (isSet(value)) {
            if (typeof value === 'number') {
                value = value + 'px';
            }
            this.style[style] = value;
            return this;
        }
        var win = this.ownerDocument.defaultView;
        if (win && win.getComputedStyle) {
            return win.getComputedStyle(this, void 0).getPropertyValue(style);
        }
        if (this.currentStyle) {
            return this.currentStyle[style];
        }
        console.warn('Returning HTMLElement.style, this may not corresponding to the current style.');
        return this.style[style];
    };
    pjs.filter = function (filter) {
        var list = new ParasitedList, isStr = typeof filter === 'string';
        each(this, function (i, el) {
            if (isStr) {
                matches(el, filter) && list.push(el);
            }
            else {
                filter.call(el, i, el) && list.push(el);
            }
        });
        return list;
    };
    pjs.is = function (selector) {
        return matches(this, selector);
    };
    pjs.find = function (selector) {
        if (!selector) {
            return NULL;
        }
        var type = selector.match(/^([#.]?)([-\w]+)(.?)/);
        if (type === null || type[3]) { // selector
            return this.findAll(selector);
        }
        if (!type[1]) { // tag
            return this.findTag(selector);
        }
        if (type[1] === '.') { // class
            return this.findClass(type[2]);
        }
        var el = this.findId(type[2]); // id
        return el === NULL ? NULL : (new ParasitedList).push(el);
    };
    pjs.not = function (filter) {
        return this.filter(typeof filter === 'string' ?
            function (_, elem) { return !matches(elem, filter); } :
            function (i, elem) { return !filter.call(elem, i, elem); });
    };
    pjs.findAll = function (selector) {
        return this.querySelectorAll(selector);
    };
    pjs.findId = function (id) {
        var el = DOC.getElementById(id), parent;
        if (el) {
            if (this === DOC) {
                return el;
            }
            parent = el.parentNode;
            do {
                if (parent === this) {
                    return el;
                }
            } while (parent = parent.parentNode);
        }
        return NULL;
    };
    pjs.findOne = function (selector) {
        return this.querySelector(selector) || NULL;
    };
    pjs.findClass = function (className) {
        return this.getElementsByClassName(className);
    };
    pjs.findTag = function (tag) {
        return this.getElementsByTagName(tag);
    };
    pjs.findName = function (name) {
        var _this = this;
        var collection = DOC.getElementsByName(name), parent;
        if (this === DOC || !collection.length) {
            return collection;
        }
        return collection.filter(function (_, el) {
            parent = el.parentNode;
            do {
                if (parent === _this) {
                    return true;
                }
            } while (parent = parent.parentNode);
            return false;
        });
    };
    pjs.findChildren = function (selector) {
        var c = this.children;
        return selector ? c.filter(selector) : c;
    };
    pjs.prepend = function () {
        var _this = this;
        if (this.native_prepend) {
            return this.native_prepend.apply(this, arguments);
        }
        setChildren(arguments, function (child) { _this.insertBefore(child, _this.firstChild); }, function (str) { _this.textContent = str + _this.textContent; }, true);
    };
    pjs.prependTo = function (selector) {
        DOC.find(selector).prepend(this);
        return this;
    };
    pjs.append = function () {
        var _this = this;
        if (this.native_append) {
            return this.native_append.apply(this, arguments);
        }
        setChildren(arguments, function (child) { _this.appendChild(child); }, function (str) { _this.textContent += str; });
    };
    pjs.appendTo = function (selector) {
        DOC.find(selector).append(this);
        return this;
    };
    pjs.parent = function (selector) {
        var elem = this.parentElement;
        if (elem && matches(elem, selector)) {
            return elem;
        }
    };
    pjs.parents = function (selector) {
        var parents = new ParasitedList, newParents = this.parent();
        do {
            parents.concat(newParents);
            newParents = newParents.parent();
        } while (newParents.length);
        return parents.filter(selector);
    };
    pjs.each = function (iterator) {
        return each(this, iterator);
    };
    pjs.get = function (index) {
        if (index < 0) {
            index = this.length + index;
        }
        return index < this.length ? this[index] : void 0;
    };
    pjs.hasClass = function (className) {
        var _this = this;
        return someToken(className, function (name) {
            return _this.classList.contains(name);
        });
    };
    pjs.addClass = function (className) {
        var _this = this;
        eachTokens(className, function (name) {
            _this.classList.add(name);
        });
    };
    pjs.removeClass = function (className) {
        var _this = this;
        eachTokens(className, function (name) {
            _this.classList.remove(name);
        });
    };
    pjs.toggleClass = function (className) {
        var _this = this;
        eachTokens(className, function (name) {
            _this.classList.toggle(name);
        });
    };
    // Rename
    pjs.remove = function (selector) {
        if (!matches(this, selector)) {
            return;
        }
        if (this.native_remove) {
            this.native_remove();
        }
        else if (this.removeNode) {
            this.removeNode();
        }
        else {
            this.outerHTML = '';
        }
    };
    pjs.empty = function () {
        emptyElement(this);
    };
    /* =============== PARASITE FUNCTIONS =============== */
    // FINDS, PARENTS
    setFirstFn('findId', DOC_AND_ELEMS);
    setListFn('findOne', DOC_AND_ELEMS);
    setListFn('findTag', DOC_AND_ELEMS);
    setListFn('findName', DOC_AND_ELEMS);
    setListFn('findClass', DOC_AND_ELEMS);
    setListFn('findAll', DOC_AND_ELEMS);
    setListFn('find', DOC_AND_ELEMS);
    setListFn('parents', ELEMS);
    setListFn('parent', ELEMS);
    setListFn('findChildren', DOC_AND_ELEMS);
    setFirstFn('is', ELEMS);
    setFn('filter', LISTS);
    setFn('not', LISTS);
    setFn('get', LISTS);
    // CLASSES
    setEachFn('addClass', ELEMS);
    setEachFn('toggleClass', ELEMS);
    setEachFn('removeClass', ELEMS);
    setFirstFn('hasClass', ELEMS);
    // EVENTS
    setEachFn('on', ALL);
    setEachFn('one', ALL);
    setEachFn('off', ALL);
    setEachFn('trigger', ALL);
    // ELEMENT MANIPULATION
    setEachFn('prepend', ELEMS);
    setEachFn('prependTo', ELEMS);
    setEachFn('append', ELEMS);
    setEachFn('appendTo', ELEMS);
    setEachFn('remove', ELEMS);
    setEachFn('empty', DOC_AND_ELEMS);
    // ATTRS AND PROPS
    setAcessorFn('attr', ELEMS);
    setEachFn('removeAttr', ELEMS);
    setAcessorFn('prop', ELEMS);
    setEachFn('removeProp', ELEMS);
    setAcessorFn('val', ELEMS);
    setConcatFn('text', DOC_AND_ELEMS);
    setFirstFn('html', ELEMS);
    setAcessorFn('data', ELEMS);
    // STYLE
    setAcessorFn('css', ELEMS);
    // LIST
    setFn('each', LISTS);
    /* =============== STATIC FUNCTIONS =============== */
    /**
     * Verify if element matches selector.
     */
    function matches(el, selector) {
        if (!isSet(selector)) {
            return true;
        }
        if (el.matches) {
            return el.matches(selector);
        }
        emptyElement(AUX);
        AUX.appendChild(el);
        return !!AUX.querySelector(selector);
    }
    function emptyElement(el) {
        while (el.lastChild) {
            el.removeChild(el.lastChild);
        }
    }
    function createEvent(src, extraProperties) {
        var event, type;
        type = src.length ? src : src.type;
        if (WIN && CustomEvent) {
            event = new CustomEvent(type, { bubbles: true, cancelable: true });
        }
        else {
            event = DOC.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true);
        }
        each(extraProperties, function (key, value) { event[key] = value; });
        return event;
    }
    function each(arr, it) {
        if (!arr) {
            return arr;
        }
        if (arr.length === void 0) {
            for (var key in arr) {
                if (it.call(arr[key], key, arr[key]) === false) {
                    break;
                }
            }
            return arr;
        }
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            if (it.call(arr[i], i, arr[i]) === false) {
                break;
            }
        }
        return arr;
    }
    function jsonParse(value) {
        try {
            return JSON.parse(value);
        }
        catch (_) {
            return value;
        }
    }
    function jsonStringify(value) {
        return JSON.stringify(value);
    }
    function buildParam(obj, prefix, forceString) {
        var uri = [], name, isArr = hasLength(obj), e = encodeURIComponent;
        each(obj, function (key, value) {
            // If array, dont use key
            isArr && (key = '');
            // Get name 
            name = (prefix || isArr) ? prefix + "[" + key + "]" : key;
            // If string or number, set uri
            if (forceString
                || (typeof value === 'string' || typeof value === 'number')) {
                uri.push(e(name) + "=" + e(value));
            }
            else {
                uri.push(buildParam(value, name));
            }
        });
        return uri.join('&');
    }
    function hasLength(arr) {
        return arr && arr.length !== void 0;
    }
    /**
     * Verify the type of object passed and compare.
     */
    function isType(obj, types) {
        var match = Array.isArray(obj) ? 'array' : (typeof obj), some = function (type) {
            if (match === type) {
                return true;
            }
            if (type === 'document') {
                return obj instanceof Document;
            }
            if (type === 'window') {
                return obj instanceof Window;
            }
            if (type === 'parasited') {
                return obj instanceof ParasitedList
                    || obj instanceof NodeList
                    || obj instanceof HTMLCollection
                    || obj instanceof Element
                    || obj instanceof Document
                    || obj instanceof Window;
            }
            return false;
        };
        if (Array.isArray(types)) {
            return types.some(some);
        }
        return some(types);
    }
    function isSet(param) {
        return !(param === void 0 || param === null);
    }
    /**
     * Execute some JavaScript code globally.
     * @param code The JavaScript code to execute.
     */
    function globalEval(code) {
        var script = DOC.createElement('script');
        script.text = code;
        DOC.head.appendChild(script).parentNode.removeChild(script);
    }
    /**
     * Transform HTML/XML code to list of elements.
     * @param htmlString HTML/XML code.
     */
    function parseHTML(htmlString) {
        AUX.innerHTML = htmlString;
        var returnArr = (new ParasitedList).concat(AUX.childNodes);
        emptyElement(AUX);
        return returnArr;
    }
    /**
     * Bind some JavaScript file globally.
     * @param file The JavaScript file to bind.
     */
    function require(file) {
        var script = DOC.createElement('script');
        script.src = file;
        DOC.body.appendChild(script);
    }
    function setChildren(children, elemInsertFn, stringInsertFn, reverse) {
        var forEach, length = children.length;
        if (reverse) {
            forEach = function (fn) {
                for (var i = length - 1; i >= 0; i--) {
                    fn(children[i]);
                }
            };
        }
        else {
            forEach = function (fn) {
                for (var i = 0; i < length; i++) {
                    fn(children[i]);
                }
            };
        }
        forEach(function (child) {
            // If arrayLike
            if (isArrayLike(child)) {
                return setChildren(child, elemInsertFn, stringInsertFn);
            }
            // If string
            if (isType(child, ['string', 'number'])) {
                return stringInsertFn(child);
            }
            // If node with no parent
            if (!child.parentElement) {
                return elemInsertFn(child);
            }
            return stringInsertFn(child.outerHTML);
        });
    }
    function ready(handler) {
        if (DOC.readyState !== 'loading') {
            handler(DOC);
        }
        else {
            DOC.addEventListener('DOMContentLoaded', function () { handler(DOC); });
        }
    }
    function get(urlOrOptions, dataOrSuccess, success) {
        return requestBuilder('GET', urlOrOptions, dataOrSuccess, success);
    }
    function post(urlOrOptions, dataOrSuccess, success) {
        return requestBuilder('POST', urlOrOptions, dataOrSuccess, success);
    }
    /**
     * Build default requests
     */
    function requestBuilder(method, urlOrOptions, dataOrSuccess, success) {
        var options, data;
        if (isType(urlOrOptions, 'string')) {
            options = { url: urlOrOptions };
        }
        else {
            options = urlOrOptions;
        }
        if (isType(urlOrOptions, 'function')) {
            success = dataOrSuccess;
        }
        else {
            data = dataOrSuccess;
        }
        options.method = method;
        options.data = data;
        options.success = success;
        return ajax(options);
    }
    function ajax(url, options) {
        if (options === void 0) { options = {}; }
        var dfrr = new Deferred(), request;
        if (isType(url, 'string')) {
            options.url = url;
        }
        else {
            options = url;
        }
        each(AJAX_CONFIG, function (key, value) {
            if (isSet(options[key])) {
                return;
            }
            options[key] = value;
        });
        // Create XMLHtmlRequest
        request = options.xhr();
        // Call beforeSend
        options.beforeSend && options.beforeSend(request, options);
        // Set Method
        options.method = (options.type || options.method).toUpperCase();
        var // Set context of callbacks
        context = options.context || options, 
        // Deferred => resolve
        resolve = function (data) {
            if (isSet(options.dataFilter)) {
                // TODO: If start works with dataType, change second param to dataType
                data = options.dataFilter(data, request.getResponseHeader('Content-Type'));
            }
            dfrr.resolveWith(context, jsonStringify(data), 'success', request);
        }, 
        // Deferred => reject
        reject = function (textStatus) {
            var errorThrown = request.statusText.replace(/^[\d*\s]/g, '');
            dfrr.rejectWith(context, request, textStatus, errorThrown);
        };
        // Set ajax default callbacks (success, error and complete)
        if (isSet(options.complete)) {
            dfrr.done(function (_d, s, req) { options.complete(req, s); })
                .fail(function (req, s) { options.complete(req, s); });
        }
        dfrr.done(options.success).fail(options.error);
        // Setting URL Encoded data
        if (options.data && options.method === 'GET') {
            var separator = options.url.indexOf('?') !== -1 ? '&' : '?';
            options.url += separator + buildParam(options.data, '', false);
        }
        // Open request
        request.open(options.method, options.url, options.async, options.username, options.password);
        // Override mime type
        if (isSet(options.mimeType)) {
            request.overrideMimeType(options.mimeType);
        }
        // Set headers
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if (isSet(options.headers)) {
            each(options.headers, function (header, value) {
                request.setRequestHeader(header, value);
            });
        }
        if (options.contentType !== false) {
            request.setRequestHeader('Content-Type', options.contentType);
        }
        if (options.async) {
            // Set timeout in ms
            request.timeout = options.timeout;
        }
        else {
            console.warn("[Deprecation] Synchronous XMLHttpRequest on the main thread " +
                "is deprecated because of its detrimental effects to the end " +
                "user's experience. For more help, check https://xhr.spec.whatwg.org/.");
        }
        // Listeners
        request.onload = function () {
            var statusFn = options.statusCode[request.status];
            statusFn && statusFn();
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject('error');
            }
        };
        request.onerror = function () { reject('error'); };
        request.ontimeout = function () { reject('timeout'); };
        request.onabort = function () { reject('abort'); };
        // Proccess data
        if (options.method === 'POST' || options.method === 'PUT') {
            request.send(buildParam(options.data, '', false));
        }
        else {
            request.send();
        }
        return dfrr.promise();
    }
    function returnArgs(fn) {
        return function () {
            fn.apply(this, arguments);
            return arguments;
        };
    }
    function call(fns, context, args) {
        fns.forEach(function (fn) {
            args = fn.apply(context, args) || [void 0];
        });
        return args;
    }
    /**
     * Chainable utility
     */
    var Deferred = /** @class */ (function () {
        function Deferred(beforeStart) {
            this._state = 'pending';
            this.pipeline = { done: [], fail: [] };
            beforeStart && beforeStart(this);
        }
        Deferred.prototype.changeState = function (newState, context, args) {
            if (this._state !== 'pending') {
                return false;
            }
            this._state = newState;
            this.pipeline.context = context;
            this.pipeline.args = args;
            return true;
        };
        Deferred.prototype.resolve = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            args.unshift(this);
            return this.resolveWith.apply(this, args);
        };
        Deferred.prototype.reject = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            args.unshift(this);
            return this.rejectWith.apply(this, args);
        };
        Deferred.prototype.resolveWith = function (context) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.changeState('resolved', context, args)) {
                this.pipeline.args = call(this.pipeline.done, context, args);
            }
            return this;
        };
        Deferred.prototype.rejectWith = function (context) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.changeState('rejected', context, args)) {
                this.pipeline.args = call(this.pipeline.fail, context, args);
            }
            return this;
        };
        Deferred.prototype.state = function () {
            return this._state;
        };
        Deferred.prototype.promise = function () {
            return this;
        };
        Deferred.prototype.done = function (callback) {
            if (!callback) {
                return this;
            }
            if (this.state() === 'resolved') {
                callback.apply(this.pipeline.context, this.pipeline.args);
            }
            else {
                this.pipeline.done.push(returnArgs(callback));
            }
            return this;
        };
        Deferred.prototype.fail = function (callback) {
            if (!callback) {
                return this;
            }
            if (this.state() === 'rejected') {
                callback.apply(this.pipeline.context, this.pipeline.args);
            }
            else {
                this.pipeline.fail.push(returnArgs(callback));
            }
            return this;
        };
        Deferred.prototype.then = function (successFilter, errorFilter) {
            var p = this.pipeline;
            if (!successFilter) {
                return this;
            }
            if (this.state() === 'resolved') {
                successFilter.apply(p.context, p.args);
            }
            p.done.push(successFilter);
            if (!errorFilter) {
                return this;
            }
            if (this.state() === 'rejected') {
                errorFilter.apply(p.context, p.args);
            }
            p.fail.push(errorFilter);
            return this;
        };
        Deferred.prototype.always = function (callback) {
            return this.done(callback).fail(callback);
        };
        return Deferred;
    }());
    /* =============== INFECTION FUNCTIONS =============== */
    function setFn(fnName, classes, fn) {
        if (fn === void 0) { fn = pjs[fnName]; }
        if (!fn) {
            console.error("Error trying to find " + fnName + " into pjs object.");
            return;
        }
        classes.forEach(function (cl) {
            try {
                if (cl.prototype[fnName]) {
                    // console.warn(`The property "${fnName}" already exists, please describe your issue on ${GITHUB_URL}.`);
                    // console.error('Already exists on: ', cl);
                    cl.prototype['native_' + fnName] = cl.prototype[fnName];
                }
                cl.prototype[fnName] = fn;
            }
            catch (e) {
                console.warn("The property \"" + fnName + "\" is not accessible, please describe your issue on " + GITHUB_URL + ".");
                console.error(e);
            }
        });
    }
    function setAcessorFn(fnName, classes) {
        // Set function on classes
        setFn(fnName, classes);
        // Set function recursively on list
        setFn(fnName, LISTS, function (key, value) {
            if (!value && typeof key !== 'object') {
                return this[0] && this[0][fnName](key, value);
            }
            return each(this, function (_, el) { el[fnName](key, value); });
        });
    }
    function setFirstFn(fnName, classes) {
        // Set function on classes
        setFn(fnName, classes);
        // Set function to each list and return first value
        setFn(fnName, LISTS, function (selector) {
            var result;
            each(this, function (_, el) {
                result = el[fnName](selector);
                return !result; // break each if has result
            });
            return result;
        });
    }
    function setListFn(fnName, classes) {
        // Set function on classes
        setFn(fnName, classes);
        // Set function to collect all elements and return a list
        setFn(fnName, LISTS, function (selector) {
            // Create list
            var list = new ParasitedList, result;
            // Each this list
            each(this, function (_, el) {
                result = el[fnName](selector);
                if (!hasLength(result)) {
                    list.push(result);
                    return;
                }
                // Each children returned
                each(result, function (_, children) {
                    // Add elements on list
                    list.push(children);
                });
            });
            // Return list
            return list;
        });
    }
    function setEachFn(fnName, classes) {
        // Set function on classes
        setFn(fnName, classes);
        // Set function to each this elements
        setFn(fnName, LISTS, function () {
            var args = arguments;
            return each(this, function (_, el) {
                return el[fnName].apply(el, args);
            });
        });
    }
    function setConcatFn(fnName, classes) {
        // Set function on classes
        setFn(fnName, classes);
        // Set function to set or concat all return values
        setFn(fnName, LISTS, function () {
            var args = arguments;
            if (args.length) {
                return each(this, function (_, el) {
                    return el[fnName].apply(el, args);
                });
            }
            var value = '';
            each(this, function (_, el) {
                value += el[fnName]() || '';
            });
            return value.trim() || void 0;
        });
    }
    function isArrayLike(obj) {
        if (Array.isArray(obj)) {
            return true;
        }
        if (typeof obj === 'function'
            || typeof obj === 'string'
            || obj instanceof Window) {
            return false;
        }
        var length = obj.length;
        return typeof length === "number" && (length === 0 || (length > 0 && (length - 1) in obj));
    }
    function eachTokens(rawTokens, iterator) {
        rawTokens.split(' ').forEach(iterator);
    }
    function someToken(rawTokens, iterator) {
        return rawTokens.split(' ').some(iterator);
    }
    /* =============== GLOBAL =============== */
    var p$ = function (selector) {
        if (isType(selector, 'function')) {
            return ready(selector);
        }
        if (isType(selector, ['document', 'window'])) {
            return selector;
        }
        if (!isType(selector, 'string')) {
            return (new ParasitedList).concat(selector);
        }
        if (selector.indexOf('<') !== -1) {
            return parseHTML(selector);
        }
        return DOC.find(selector);
    };
    p$.Deferred = function (beforeStart) { return new Deferred(beforeStart); };
    p$.isNull = function (obj) { return obj === NULL || obj === null; };
    p$.globalEval = globalEval;
    p$.parseHTML = parseHTML;
    p$.require = require;
    p$.ready = ready;
    p$.each = each;
    p$.ajax = ajax;
    p$.post = post;
    p$.get = get;
    return p$;
})();
