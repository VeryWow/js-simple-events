var EventManagment = /** @class */ (function () {
    function EventManagment() {
        this.eventHandlersMap = {
            '*': new Map(),
        };
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
        if (isOnce === void 0) { isOnce = false; }
        if (!this.eventHandlersMap[eventName]) {
            this.eventHandlersMap[eventName] = new Map();
        }
        if (callback && !this.eventHandlersMap[eventName].has(callback)) {
            this.eventHandlersMap[eventName].set(callback, isOnce);
        }
    };
    EventManagment.prototype.callHandlers = function (eventName, payload, realEventName) {
        var _this = this;
        if (this.eventHandlersMap[eventName[0]]) {
            this.eventHandlersMap[eventName[0]].forEach(function (isOnce, handler) {
                handler && handler(payload, { eventName: realEventName, isOnce: isOnce });
                if (isOnce) {
                    _this.off(eventName[0], handler);
                }
            });
        }
    };
    EventManagment.prototype.setDebug = function (isDebug) {
        this.isDebug = isDebug;
        return this;
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
        if (!this.eventHandlersMap[eventName]) {
            return this;
        }
        if (callback && this.eventHandlersMap[eventName].has(callback)) {
            this.eventHandlersMap[eventName].delete(callback);
        }
        return this;
    };
    EventManagment.prototype.emit = function (eventName, payload) {
        if (this.isDebug) {
            console.info("[" + this.constructor.name + "]: Fires " + eventName);
        }
        this.callHandlers('*', payload, eventName);
        this.callHandlers(eventName, payload);
    };
    return EventManagment;
}());
export default EventManagment;
