export interface EventHandlers {
  [key: string]: Map<Function, boolean>
}

export default class EventManagment {
  private eventHandlersMap: EventHandlers = {}

  private addEventHandler(eventName: string | RegExp, callback: Function, isOnce: boolean = false) {
    if (eventName instanceof RegExp) {
      Object.keys(this.eventHandlersMap).forEach(el => {
        if (el.match(eventName) && callback && !this.eventHandlersMap[el].has(callback)) {
          this.eventHandlersMap[el].set(callback, isOnce);
        }
      });
    } else {
      if (!this.eventHandlersMap[eventName]) {
        this.eventHandlersMap[eventName] = new Map();
      }

      if (callback && !this.eventHandlersMap[eventName].has(callback)) {
        this.eventHandlersMap[eventName].set(callback, isOnce);
      }
    }
  }

  public on(eventName: string | RegExp, callback: Function): EventManagment {
    this.addEventHandler(eventName, callback)
    return this;
  }

  public once(eventName: string | RegExp, callback: Function): EventManagment {
    this.addEventHandler(eventName, callback, true)
    return this;
  }

  public off(eventName: string | RegExp, callback: Function): EventManagment {
    if (eventName instanceof RegExp) {
      Object.keys(this.eventHandlersMap).forEach(el => {
        if (el.match(eventName) && callback && !this.eventHandlersMap[el].has(callback)) {
          this.eventHandlersMap[el].delete(callback);
        }
      });
    } else {
      if (!this.eventHandlersMap[eventName]) {
        return this;
      }

      if (callback && this.eventHandlersMap[eventName].has(callback)) {
        this.eventHandlersMap[eventName].delete(callback);
        return this;
      }
    }

    return this;
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
