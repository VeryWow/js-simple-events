import { EventHandlers } from './types'

export interface IEventMananger<EventNames extends string = string> {
  on(eventName: EventNames, callback: Function): boolean;
  listen(eventName: EventNames, callback: Function): boolean;
  subscribe(eventName: EventNames, callback: Function): boolean;

  once(eventName: EventNames, callback: Function): boolean;

  off(eventName: EventNames, callback: Function): boolean;
  remove(eventName: EventNames, callback: Function): boolean;
  unsubscribe(eventName: EventNames, callback: Function): boolean;

  emit(eventName: EventNames, ...args: any[]): void;
  fire(eventName: EventNames, ...args: any[]): void;
}

export default class EventManager<EventNames extends string = string> implements IEventMananger<EventNames> {
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
