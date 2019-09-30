"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManagment = /** @class */ (function () {
    function EventManagment() {
        this.eventHandlersMap = {};
        this.isDebug = false;
        /// Aliases:
        this.fire = this.emit;
        this.listen = this.on;
        this.subscribe = this.on;
        this.remove = this.off;
        this.unsubscribe = this.off;
        ///
    }
    EventManagment.prototype.addEventHandler = function (eventName, callback, isOnce) {
        var _this = this;
        if (isOnce === void 0) { isOnce = false; }
        if (eventName instanceof RegExp) {
            Object.keys(this.eventHandlersMap).forEach(function (el) {
                if (el.match(eventName) && callback && !_this.eventHandlersMap[el].has(callback)) {
                    _this.eventHandlersMap[el].set(callback, isOnce);
                }
            });
        }
        else {
            if (!this.eventHandlersMap[eventName]) {
                this.eventHandlersMap[eventName] = new Map();
            }
            if (callback && !this.eventHandlersMap[eventName].has(callback)) {
                this.eventHandlersMap[eventName].set(callback, isOnce);
            }
        }
    };
    EventManagment.prototype.setDebug = function (isDebug) {
        this.isDebug = isDebug;
    };
    EventManagment.prototype.on = function (eventName, callback) {
        this.addEventHandler(eventName, callback);
        return this;
    };
    EventManagment.prototype.once = function (eventName, callback) {
        this.addEventHandler(eventName, callback, true);
        return this;
    };
    EventManagment.prototype.off = function (eventName, callback) {
        var _this = this;
        if (eventName instanceof RegExp) {
            Object.keys(this.eventHandlersMap).forEach(function (el) {
                if (el.match(eventName) && callback && !_this.eventHandlersMap[el].has(callback)) {
                    _this.eventHandlersMap[el].delete(callback);
                }
            });
        }
        else {
            if (!this.eventHandlersMap[eventName]) {
                return this;
            }
            if (callback && this.eventHandlersMap[eventName].has(callback)) {
                this.eventHandlersMap[eventName].delete(callback);
                return this;
            }
        }
        return this;
    };
    EventManagment.prototype.emit = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.isDebug) {
            console.info("[EventManagment]: Fires " + eventName, this);
        }
        if (this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName].forEach(function (isOnce, handler) {
                handler && handler.apply(void 0, args.concat([{ eventName: eventName, isOnce: isOnce }]));
                if (isOnce) {
                    _this.off(eventName, handler);
                }
            });
        }
    };
    return EventManagment;
}());
exports.default = EventManagment;
