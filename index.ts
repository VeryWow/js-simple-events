type eventHandlerOptions = {
  once: boolean
}

export default class EventManagment {
  private eventHandlersMap: { [key: string]: Map<Function, eventHandlerOptions> } = {}

  private addEventHandler(eventName: string, callback: Function, options: eventHandlerOptions) {
    if (!this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName] = new Map();
    }

    if (!this.eventHandlersMap[eventName].has(callback)) {
      this.eventHandlersMap[eventName].set(callback, options);
    }
  }

  on(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback, {
      once: false
    })
    return true;
  }

  once(eventName: string, callback: Function): boolean {
    this.addEventHandler(eventName, callback, {
      once: true
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
    let handlersToDelete: Function[] = [];
    if (this.eventHandlersMap[eventName]) {
      this.eventHandlersMap[eventName].forEach((options: eventHandlerOptions, handler: Function) => {
        handler(...args);
        if (options.once) {
          handlersToDelete.push(handler);
        }
      });
      handlersToDelete.forEach(el => {
        this.eventHandlersMap[eventName].delete(el);
      })
    }
  }
}
