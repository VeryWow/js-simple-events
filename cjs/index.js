"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManagment = /** @class */ (function () {
    function EventManagment() {
        this.eventHandlersMap = {};
        /// Aliases:
        this.fire = this.emit;
        this.listen = this.on;
        this.subscribe = this.on;
        this.remove = this.off;
        this.unsubscribe = this.off;
        ///
    }
    EventManagment.prototype.addEventHandler = function (eventName, callback) {
        if (!this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName] = new Map();
        }
        if (callback && !this.eventHandlersMap[eventName].has(callback)) {
            this.eventHandlersMap[eventName].set(callback, true);
        }
    };
    EventManagment.prototype.on = function (eventName, callback) {
        this.addEventHandler(eventName, callback);
        return true;
    };
    EventManagment.prototype.once = function (eventName, callback) {
        var _this = this;
        var toHandle = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            callback.apply(void 0, args);
            _this.off(eventName, toHandle);
        };
        this.addEventHandler(eventName, toHandle);
        return true;
    };
    EventManagment.prototype.off = function (eventName, callback) {
        if (!this.eventHandlersMap[eventName]) {
            return true;
        }
        if (callback && this.eventHandlersMap[eventName].has(callback)) {
            return this.eventHandlersMap[eventName].delete(callback);
        }
        return true;
    };
    EventManagment.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName].forEach(function (value, handler) {
                value && handler && handler.apply(void 0, args);
            });
        }
    };
    return EventManagment;
}());
exports.default = EventManagment;
