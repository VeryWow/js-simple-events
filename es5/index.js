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
    EventManagment.prototype.addEventHandler = function (eventName, callback, isOnce) {
        if (isOnce === void 0) { isOnce = false; }
        if (!this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName] = new Map();
        }
        if (callback && !this.eventHandlersMap[eventName].has(callback)) {
            this.eventHandlersMap[eventName].set(callback, isOnce);
        }
    };
    EventManagment.prototype.on = function (eventName, callback) {
        this.addEventHandler(eventName, callback);
        return true;
    };
    EventManagment.prototype.once = function (eventName, callback) {
        this.addEventHandler(eventName, callback, true);
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
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName].forEach(function (value, handler) {
                handler && handler.apply(void 0, args);
                if (value) {
                    _this.off(eventName, handler);
                }
            });
        }
    };
    return EventManagment;
}());
export default EventManagment;
