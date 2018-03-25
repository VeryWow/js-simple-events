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
        if (!this.eventHandlersMap[eventName].has(callback)) {
            this.eventHandlersMap[eventName].set(callback, true);
        }
    };
    EventManagment.prototype.on = function (eventName, callback) {
        this.addEventHandler(eventName, callback);
        return true;
    };
    EventManagment.prototype.once = function (eventName, callback) {
        var _this = this;
        this.addEventHandler(eventName, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            callback.apply(void 0, args);
            _this.off(eventName, callback);
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
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName].forEach(function (value, handler) {
                value && handler.apply(void 0, args);
            });
        }
    };
    return EventManagment;
}());
export default EventManagment;
