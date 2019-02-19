import { EventHandlers } from './types'

export interface IEventMananger {
  on(eventName: string, callback: Function): boolean;
  listen(eventName: string, callback: Function): boolean;
  subscribe(eventName: string, callback: Function): boolean;

  once(eventName: string, callback: Function): boolean;

  off(eventName: string, callback: Function): boolean;
  remove(eventName: string, callback: Function): boolean;
  unsubscribe(eventName: string, callback: Function): boolean;

  emit(eventName: string, ...args: any[]): void;
  fire(eventName: string, ...args: any[]): void;
}

export default class EventManagement<EventNames extends string = string> implements IEventMananger {
  private eventHandlersMap: EventHandlers = {}

  private addEventHandler(eventName: EventNames, callback: Function) {
    if (!this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName] = new Map();
    }

    if (!this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].set(callback, true);
    }
  }

  on(eventName: EventNames, callback: Function): boolean {
    this.addEventHandler(eventName, callback)
    return true;
  }

  once(eventName: EventNames, callback: Function): boolean {
    this.addEventHandler(eventName, (...args: any) => {
      callback(...args);
      this.off(eventName, callback);
    })
    return true;
  }

  off(eventName: EventNames, callback: Function): boolean {
    if (!this.eventHandlersMap[eventName]) {
      return true;
    }

    if (this.eventHandlersMap[eventName].has(callback)) {
      return this.eventHandlersMap[eventName].delete(callback);
    }

    return true;
  }

  emit(eventName: EventNames, ...args: any[]): void {
    if (this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName].forEach((value: boolean, handler: Function) => {
        value && handler(...args);
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
