/**
 * jQuery like library
 * @author Daniel Fernandez
 */

'use strict';

(function (global) {
    var document = global.document;
    var $;
    var console = global.console;

    var selfclosing = /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i;

    // Make sure that self-closing tags are interpreted correctly
    // Taked from: Secrets of the JavaScript Ninja, John Resig and Bear Bibeault. Chapter 14, Manipulating the DOM
    var _convert = function (html) {
        return html.replace(/(<(\w+)[^>]*?)\/>/g, function (all, front, tag) {
            return selfclosing.test(tag) ? all : front + '></' + tag + '>';
        });
    };

    var rQuery = function (param) {
        var div = document.createElement('div');

        // Assume that strings that start with < are HTML
        if (param.charAt(0) === '<') {
            // If param is a string of type <tag/> or <tag></tag>, create an element of type 'tag'
            // And store it as element property of the rQuery object
            div.innerHTML = _convert(param);
            this.el = div.childNodes[0];
        }

        // Handle $(#id)
        if (param.charAt(0) === '#') {
            this.el = document.getElementById(param.replace('#', ''));
        // Handle $(.class)
        } else if (param.charAt(0) === '.') {
            this.el = document.getElementsByClassName(param.replace('.', ''));
        }
    };

    // $().html() implementation
    rQuery.prototype.html = function (html) {
        if (html) {
            this.el.innerHTML = '' + html; // Force the toString method to be executed
            return this; // Return the rQuery instance to allow chaining
        } else {
            return this.el.innerHTML;
        }
    };

    // $().text() implementation
    rQuery.prototype.text = function (txt) {
        if (txt) {
            this.el.textContent = txt;
            return this; // Return the rQuery instance to allow chaining
        } else {
            return this.el.textContent;
        }
    };

    // Override rQuery object toString method, to return the element HTML
    // It will be called when the rQuery object is used as an String for example when using with .html(rQuery)
    rQuery.prototype.toString = function () {
        return this.el.outerHTML;
    };

    // Expose the $ function: $()
    global.$ = function (param) {
        return new rQuery(param);
    };

    $ = global.$;

    $.isArray = function (obj) {
        var result = false;
        if (obj instanceof Array) {
            result =  true;
        }
        return result;
    };

    $.isFunction = function (obj) {
        var result = false;
        if (obj instanceof Function) {
            result = true;
        }
        return result;
    };

    $.isObject = function (obj) {
        var result = false;
        if (obj instanceof Object) {
            result = true;
        }
        return result;
    };

    $.each = function (obj, callback) {
        if ($.isArray(obj)) {
            if ($.isFunction(callback)) {
                for (var i = 0; i < obj.length; i ++) {
                    callback(i, obj[i]);
                }
            } else {
                console.log('Object parameter is not a Function object.');
            }
        } else if ($.isObject(obj)) {
            if ($.isFunction(callback)) {
                for (var item in obj) {
                    callback(item, obj[item]);
                }
            } else {
                console.log('Object parameter is not a Function object.');
            }
        } else {
            console.log('Parameter is not an Array or Object.');
        }
    };

    $.inArray = function (arg, obj, index) {
        var result = -1;
        var i = index || 0;
        if ($.isArray(obj)) {
            for (i; i < obj.length; i++) {
                if (obj[i] === arg) {
                    result = i;
                }
            }
            return result;
        }
    };

    $.isNumeric = function (arg) {
        var result = false;
        result = !$.isArray(arg) && !$.isFunction(arg) && !$.isObject(arg) && !isNaN(arg);
        return result;
    };
})(window);
