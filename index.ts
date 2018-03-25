export interface EventHandlers {
  [key: string]: Map<Function, boolean>
}

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

  public on(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback)
    return true;
  }

  public once(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback, true)
    return true;
  }

  public off(eventName: string, callback: Function): boolean {
    if (!this.eventHandlersMap[eventName]) {
      return true;
    }

    if (callback && this.eventHandlersMap[eventName].has(callback)) {
      return this.eventHandlersMap[eventName].delete(callback);
    }

    return true;
  }

  public emit(eventName: string, ...args): void {
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
  public fire = this.emit

  public listen = this.on
  public subscribe = this.on

  public remove = this.off
  public unsubscribe = this.off
  ///
}
