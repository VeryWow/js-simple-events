
export interface IEventHandlers {
  [key: string]: Map<Function, boolean>;
}

export default class EventManagment {
  private eventHandlersMap: IEventHandlers = {
    '*': new Map(),
  };
  private isDebug: boolean = false;

  private addEventHandler(eventName: string, callback: Function, isOnce: boolean = false) {
    if (!this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName] = new Map();
    }

    if (callback && !this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].set(callback, isOnce);
    }
  }

  private callHandlers(event: string | string[], payload: any) {
    // Temp patch with an array
    // @TODO
    const realEventName = Array.isArray(event) ? event[1] : event;
    const eventName = Array.isArray(event) ? event[0] : event;

    if (this.eventHandlersMap[eventName[0]]) {
      this.eventHandlersMap[eventName[0]].forEach((isOnce: boolean, handler: Function) => {
        handler && handler(payload, { eventName: realEventName, isOnce });
        if (isOnce) {
          this.off(eventName[0], handler);
        }
      });
    }
  }

  public setDebug(isDebug: boolean) {
    this.isDebug = isDebug;

    return this;
  }

  public on(eventName: string, callback: Function): EventManagment {
    this.addEventHandler(eventName, callback);

    return this;
  }

  public once(eventName: string, callback: Function): EventManagment {
    this.addEventHandler(eventName, callback, true);

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

  public emit(eventName: string, payload?: any): void {
    if (this.isDebug) {
      console.info(`[${this.constructor.name}]: Fires ${eventName}`);
    }

    this.callHandlers(['*', eventName], payload);
    this.callHandlers(eventName, payload);
  }

  /// Aliases:
  public fire = this.emit;

  public listen = this.on;
  public subscribe = this.on;

  public remove = this.off;
  public unsubscribe = this.off;
  ///
}
