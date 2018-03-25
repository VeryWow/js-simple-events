"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManagment = /** @class */ (function () {
    function EventManagment() {
        this.eventHandlersMap = {};
    }
    EventManagment.prototype.addEventHandler = function (eventName, callback, options) {
        if (!this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName] = new Map();
        }
        if (!this.eventHandlersMap[eventName].has(callback)) {
            this.eventHandlersMap[eventName].set(callback, options);
        }
    };
    EventManagment.prototype.on = function (eventName, callback) {
        this.addEventHandler(eventName, callback, {
            once: false
        });
        return true;
    };
    EventManagment.prototype.once = function (eventName, callback) {
        this.addEventHandler(eventName, callback, {
            once: true
        });
        return true;
    };
    EventManagment.prototype.off = function (eventName, callback) {
        if (!this.eventHandlersMap[eventName]) {
            return true;
        }
        if (this.eventHandlersMap[eventName].has(callback)) {
            return this.eventHandlersMap[eventName].delete(callback);
        }
        return true;
    };
    EventManagment.prototype.emit = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlersToDelete = [];
        if (this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName].forEach(function (options, handler) {
                handler.apply(void 0, args);
                if (options.once) {
                    handlersToDelete.push(handler);
                }
            });
            handlersToDelete.forEach(function (el) {
                _this.eventHandlersMap[eventName].delete(el);
            });
        }
    };
    return EventManagment;
}());
exports.default = EventManagment;
