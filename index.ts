
export interface EventHandlers {
  [key: string]: Map<Function, boolean>
}

export default class EventManagment {
  private eventHandlersMap: EventHandlers = {
    '*': new Map()
  }
  private isDebug: boolean = false;

  private addEventHandler(eventName: string, callback: Function, isOnce: boolean = false) {
    if (!this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName] = new Map();
    }

    if (callback && !this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].set(callback, isOnce);
    }
  }

  private callHandlers(eventName: string, ...args: any) {
    if (this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName].forEach((isOnce: boolean, handler: Function) => {
        handler && handler(...args, { eventName, isOnce });
        if (isOnce) {
          this.off(eventName, handler)
        }
      });
    }
  }

  public setDebug(isDebug: boolean) {
    this.isDebug = isDebug;
    return this;
  }

  public on(eventName: string, callback: Function): EventManagment {
    this.addEventHandler(eventName, callback)
    return this;
  }

  public once(eventName: string, callback: Function): EventManagment {
    this.addEventHandler(eventName, callback, true)
    return this;
  }

  public off(eventName: string, callback: Function): EventManagment {
    if (!this.eventHandlersMap[eventName]) {
      return this;
    }

    if (callback && this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].delete(callback);
    }

    return this;
  }

  public emit(eventName: string, ...args: any): void {
    if (this.isDebug) {
      console.info(`[${this.constructor.name}]: Fires ${eventName}`);
    }

    this.callHandlers('*', ...args);
    this.callHandlers(eventName, ...args);
  }

  /// Aliases:
  public fire = this.emit

  public listen = this.on
  public subscribe = this.on

  public remove = this.off
  public unsubscribe = this.off
  ///
}
