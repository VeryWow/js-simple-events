import { EventHandlers } from './types'

export default class EventManagment {
  private eventHandlersMap: EventHandlers = {}

  private addEventHandler(eventName: string, callback: Function) {
    if (!this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName] = new Map();
    }

    if (!this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].set(callback, true);
    }
  }

  on(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback)
    return true;
  }

  once(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, (...args) => {
      callback(...args);
      this.off(eventName, callback);
    })
    return true;
  }

  off(eventName: string, callback: Function): boolean {
    if (!this.eventHandlersMap[eventName]) {
      return true;
    }

    if (this.eventHandlersMap[eventName].has(callback)) {
      return this.eventHandlersMap[eventName].delete(callback);
    }

    return true;
  }

  emit(eventName: string, ...args): void {
    if (this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName].forEach((value: boolean, handler: Function) => {
        handler(...args);
      });
    }
  }

  /// Aliases:
  $emit = this.emit
  fire = this.emit

  $on = this.on
  listen = this.on
  subscribe = this.on

  $off = this.off
  remove = this.off
  unsubscribe = this.off

  $once = this.once
  ///
}
