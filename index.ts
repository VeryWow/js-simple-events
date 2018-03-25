import { EventHandlers } from './types'

export default class EventManagment {
  private eventHandlersMap: EventHandlers = {}

  private addEventHandler(eventName: string, callback: Function, isOnce: boolean = false) {
    if (!this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName] = new Map();
    }

    if (callback && !this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].set(callback, isOnce);
    }
  }

  on(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback)
    return true;
  }

  once(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback, true)
    return true;
  }

  off(eventName: string, callback: Function): boolean {
    if (!this.eventHandlersMap[eventName]) {
      return true;
    }

    if (callback && this.eventHandlersMap[eventName].has(callback)) {
      return this.eventHandlersMap[eventName].delete(callback);
    }

    return true;
  }

  emit(eventName: string, ...args): void {
    if (this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName].forEach((value: boolean, handler: Function) => {
        handler && handler(...args);
        if (value) {
          this.off(eventName, handler)
        }
      });
    }
  }

  /// Aliases:
  fire = this.emit

  listen = this.on
  subscribe = this.on

  remove = this.off
  unsubscribe = this.off
  ///
}
