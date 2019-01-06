"use strict";
(function () {
    class ParasitedList {
        constructor() {
            this.length = 0;
        }
        push(el) {
            if (el === void 0 || el.__lastList__ === this) {
                return this;
            }
            el.__lastList__ = this;
            this[this.length++] = el;
            return this;
        }
        concat(arrLike) {
            each(arrLike, (_, el) => {
                this.push(el);
            });
            return this;
        }
    }
    ParasitedList.prototype.splice = Array.prototype.splice;
    class Null {
    }
    Null.prototype = ParasitedList.prototype;
    const GITHUB_URL = 'github/parasitejs';
    const LISTS = [NodeList, HTMLCollection, ParasitedList];
    const ALL = [Document, Element, Window];
    const DOC_AND_ELEMS = [Document, Element];
    const ELEMS = [Element];
    const DOC = document;
    const WIN = window || DOC.defaultView;
    const AUX = DOC.createElement('_');
    const NULL = new Null;
    const AJAX_CONFIG = {
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: 'GET',
        statusCode: {},
        xhr: () => new XMLHttpRequest,
        headers: {},
        timeout: 0,
        async: true
    };
    let pjs = {};
    /* =============== FUNCTIONS =============== */
    pjs.trigger = function (event, params) {
        let customEvent = event;
        if (typeof event === 'string') {
            if (event === 'focus') {
                this.focus();
                return;
            }
            customEvent = createEvent(event);
        }
        customEvent.detail = {};
        each(params, (key, value) => {
            customEvent.detail[key] = value;
        });
        this.dispatchEvent(customEvent);
        return this;
    };
    pjs.on = function (types, handler, capture) {
        let el = this;
        handler.__handler__ = function () {
            return handler.apply(el, arguments);
        };
        return types.split(' ').forEach((type) => { this.addEventListener(type, handler.__handler__, capture); });
    };
    pjs.one = function (types, handler, capture) {
        let el = this;
        handler.__handler__ = function (e) {
            this.removeEventListener(e.type, handler.__handler__, capture);
            return handler.apply(el, arguments);
        };
        return types.split(' ').forEach((type) => {
            this.addEventListener(type, handler.__handler__, capture);
        });
    };
    pjs.off = function (types, handler, capture) {
        if (handler.__handler__) {
            handler = handler.__handler__;
        }
        return types.split(' ').forEach((type) => {
            this.removeEventListener(type, handler, capture);
        });
    };
    pjs.attr = function (attr, value) {
        if (typeof attr !== 'string') {
            each(attr, (attr, value) => { this.attr(attr, value); });
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
        if (typeof prop !== 'string') {
            each(prop, (prop, value) => { this.prop(prop, value); });
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
    pjs.data = function (key, value) {
        if (!this.__dataset__) {
            this.__dataset__ = {};
            each(this.dataset, (key, value) => {
                this.__dataset__[key] = jsonParse(value);
            });
        }
        if (!isSet(key)) {
            return this.__dataset__;
        }
        if (isSet(value)) {
            this.dataset[key] = value;
            return this;
        }
        let data = this.__dataset__[key];
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
        if (typeof style !== 'string') {
            each(style, (style, value) => { this.css(style, value); });
            return this;
        }
        if (!isSet(value)) {
            if (typeof value === 'number') {
                value = value + 'px';
            }
            this.style[style] = value;
            return this;
        }
        let win = this.ownerDocument.defaultView;
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
        let list = new ParasitedList, isStr = typeof filter === 'string';
        each(this, (i, el) => {
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
        let type = selector.match(/^([#.]?)([-\w]+)(.?)/);
        if (type === null || type[3]) { // selector
            return this.findAll(selector);
        }
        if (!type[1]) { // tag
            return this.findTag(selector);
        }
        if (type[1] === '.') { // class
            return this.findClass(type[2]);
        }
        let el = this.findId(type[2]); // id
        return el === NULL ? NULL : (new ParasitedList).push(el);
    };
    pjs.findAll = function (selector) {
        return this.querySelectorAll(selector);
    };
    pjs.findId = function (id) {
        let el = DOC.getElementById(id), parent;
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
        let collection = DOC.getElementsByName(name), parent;
        if (this === DOC || !collection.length) {
            return collection;
        }
        return collection.filter((_, el) => {
            parent = el.parentNode;
            do {
                if (parent === this) {
                    return true;
                }
            } while (parent = parent.parentNode);
            return false;
        });
    };
    pjs.parent = function (selector) {
        let elem = this.parentElement;
        if (elem && matches(elem, selector)) {
            return elem;
        }
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
    /* =============== PARASITE FUNCTIONS =============== */
    // FINDS, PARENTS
    setFirstFn('findId', DOC_AND_ELEMS);
    setListFn('findOne', DOC_AND_ELEMS);
    setListFn('findTag', DOC_AND_ELEMS);
    setListFn('findName', DOC_AND_ELEMS);
    setListFn('findClass', DOC_AND_ELEMS);
    setListFn('findAll', DOC_AND_ELEMS);
    setListFn('find', DOC_AND_ELEMS);
    setListFn('parent', ELEMS);
    setFirstFn('is', ELEMS);
    setFn('filter', LISTS);
    setFn('get', LISTS);
    // EVENTS
    setEachFn('on', ALL);
    setEachFn('one', ALL);
    setEachFn('off', ALL);
    setEachFn('trigger', ALL);
    // ATTRS AND PROPS
    setAcessorFn('attr', ELEMS);
    setEachFn('removeAttr', ELEMS);
    setAcessorFn('prop', ELEMS);
    setEachFn('removeProp', ELEMS);
    setAcessorFn('val', ELEMS);
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
        let event, type;
        type = src.length ? src : src.type;
        if (WIN && CustomEvent) {
            event = new CustomEvent(type, { bubbles: true, cancelable: true });
        }
        else {
            event = DOC.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true);
        }
        each(extraProperties, (key, value) => { event[key] = value; });
        return event;
    }
    function each(arr, it) {
        if (!arr) {
            return arr;
        }
        if (arr.length === void 0) {
            for (let key in arr) {
                if (it.call(arr[key], key, arr[key]) === false) {
                    break;
                }
            }
            return arr;
        }
        let length = arr.length;
        for (let i = 0; i < length; i++) {
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
        let uri = [], name, isArr = hasLength(obj), e = encodeURIComponent;
        each(obj, (key, value) => {
            // If array, dont use key
            isArr && (key = '');
            // Get name 
            name = (prefix || isArr) ? `${prefix}[${key}]` : key;
            // If string or number, set uri
            if (forceString
                || (typeof value === 'string' || typeof value === 'number')) {
                uri.push(`${e(name)}=${e(value)}`);
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
        let match = Array.isArray(obj) ? 'array' : (typeof obj), some = (type) => {
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
        const script = DOC.createElement('script');
        script.text = code;
        DOC.head.appendChild(script).parentNode.removeChild(script);
    }
    /**
     * Transform HTML/XML code to list of elements.
     * @param htmlString HTML/XML code.
     */
    function parseHTML(htmlString) {
        AUX.innerHTML = htmlString;
        let returnArr = (new ParasitedList).concat(AUX.childNodes);
        emptyElement(AUX);
        return returnArr;
    }
    /**
     * Bind some JavaScript file globally.
     * @param file The JavaScript file to bind.
     */
    function require(file) {
        const script = DOC.createElement('script');
        script.src = file;
        DOC.body.appendChild(script);
    }
    function ready(handler) {
        if (DOC.readyState !== 'loading') {
            handler(DOC);
        }
        else {
            DOC.addEventListener('DOMContentLoaded', () => { handler(DOC); });
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
        let options, data;
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
    function ajax(url, options = {}) {
        let dfrr = new Deferred(), request;
        if (isType(url, 'string')) {
            options.url = url;
        }
        else {
            options = url;
        }
        each(AJAX_CONFIG, (key, value) => {
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
        let // Set context of callbacks
        context = options.context || options, 
        // Deferred => resolve
        resolve = (data) => {
            if (isSet(options.dataFilter)) {
                // TODO: If start works with dataType, change second param to dataType
                data = options.dataFilter(data, request.getResponseHeader('Content-Type'));
            }
            dfrr.resolveWith(context, jsonStringify(data), 'success', request);
        }, 
        // Deferred => reject
        reject = (textStatus) => {
            let errorThrown = request.statusText.replace(/^[\d*\s]/g, '');
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
            let separator = options.url.indexOf('?') !== -1 ? '&' : '?';
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
            each(options.headers, (header, value) => {
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
        request.onload = () => {
            let statusFn = options.statusCode[request.status];
            statusFn && statusFn();
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject('error');
            }
        };
        request.onerror = () => { reject('error'); };
        request.ontimeout = () => { reject('timeout'); };
        request.onabort = () => { reject('abort'); };
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
        fns.forEach((fn) => {
            args = fn.apply(context, args) || [void 0];
        });
        return args;
    }
    /**
     * Chainable utility
     */
    class Deferred {
        constructor(beforeStart) {
            this._state = 'pending';
            this.pipeline = { done: [], fail: [] };
            beforeStart && beforeStart(this);
        }
        changeState(newState, context, args) {
            if (this._state !== 'pending') {
                return false;
            }
            this._state = newState;
            this.pipeline.context = context;
            this.pipeline.args = args;
            return true;
        }
        resolve(...args) {
            args.unshift(this);
            return this.resolveWith.apply(this, args);
        }
        reject(...args) {
            args.unshift(this);
            return this.rejectWith.apply(this, args);
        }
        resolveWith(context, ...args) {
            if (this.changeState('resolved', context, args)) {
                this.pipeline.args = call(this.pipeline.done, context, args);
            }
            return this;
        }
        rejectWith(context, ...args) {
            if (this.changeState('rejected', context, args)) {
                this.pipeline.args = call(this.pipeline.fail, context, args);
            }
            return this;
        }
        state() {
            return this._state;
        }
        promise() {
            return this;
        }
        done(callback) {
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
        }
        fail(callback) {
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
        }
        then(successFilter, errorFilter) {
            let p = this.pipeline;
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
        }
        always(callback) {
            return this.done(callback).fail(callback);
        }
    }
    function debug(times, fn1, fn2) {
        let begin, time1, time2, count = times;
        // Clear processor
        for (let i = -10000; i < 10000; i++) {
            Math.abs(i);
        }
        // Test 1
        begin = Date.now();
        while (count--) {
            fn1();
        }
        time1 = Date.now() - begin;
        if (!fn2) {
            return time1;
        }
        // Test 2
        count = times;
        begin = Date.now();
        while (count--) {
            fn2();
        }
        time2 = Date.now() - begin;
        // Return
        console.warn(`Function ${time2 > time1 ? '1' : '2'} is ${Math.abs(time2 - time1)}ms more fast!`);
        console.warn(fn1(), fn2());
        return [time1, time2];
    }
    /* =============== INFECTION FUNCTIONS =============== */
    function setFn(fnName, classes, fn = pjs[fnName]) {
        if (!fn) {
            console.error(`Error trying to find ${fnName} into pjs object.`);
            return;
        }
        classes.forEach((cl) => {
            if (cl.prototype[fnName]) {
                console.warn(`The property ${fnName} already exists, please describe your issue on ${GITHUB_URL}.`, cl);
                cl.prototype['old_' + fnName] = cl.prototype[fnName];
            }
            cl.prototype[fnName] = fn;
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
            return each(this, (_, el) => { el[fnName](key, value); });
        });
    }
    function setFirstFn(fnName, classes) {
        // Set function on classes
        setFn(fnName, classes);
        // Set function to each list and return first value
        setFn(fnName, LISTS, function (selector) {
            let result;
            each(this, (_, el) => {
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
            let list = new ParasitedList, result;
            // Each this list
            each(this, (_, el) => {
                result = el[fnName](selector);
                if (!hasLength(result)) {
                    list.push(result);
                    return;
                }
                // Each children returned
                each(result, (_, children) => {
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
            let args = arguments;
            return each(this, (_, el) => {
                return el[fnName].apply(el, args);
            });
        });
    }
    // function isArrayLike(obj): boolean {
    //     if (Array.isArray(obj)) { return true; }
    //     if (typeof obj === 'function'
    //     ||  typeof obj === 'string'
    //     ||  obj instanceof Window) { return false; }
    //     let length = obj.length;
    //     return typeof length === "number" && (length === 0 || (length > 0 && (length - 1) in obj));
    // }
    /* =============== GLOBAL =============== */
    const p$ = (selector) => {
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
    p$.Deferred = (beforeStart) => new Deferred(beforeStart);
    p$.isNull = (obj) => obj === NULL || obj === null;
    p$.globalEval = globalEval;
    p$.parseHTML = parseHTML;
    p$.require = require;
    p$.debug = debug;
    p$.ready = ready;
    p$.each = each;
    p$.ajax = ajax;
    p$.post = post;
    p$.get = get;
    WIN.p$ = p$;
})();
