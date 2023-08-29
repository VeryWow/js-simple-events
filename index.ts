export interface IEventHandlers {
  [ key: string ]: Map<Function, boolean>;
}

export default class EventManagement {
  private eventHandlersMap: IEventHandlers = {
    '*': new Map(),
  };
  private isDebug: boolean = false;

  // Private methods

  /**
   * Add an event handler.
   *
   * @private
   * @param {string} eventName - Name of the event.
   * @param {Function} callback - Callback function for the event.
   * @param {boolean} [isOnce=false] - Whether the callback is fired only once.
   */
  private addEventHandler(eventName: string, callback: Function, isOnce: boolean = false): void {
    if (!this.eventHandlersMap[ eventName ]) {
      this.eventHandlersMap[ eventName ] = new Map();
    }

    if (!this.eventHandlersMap[ eventName ].has(callback)) {
      this.eventHandlersMap[ eventName ].set(callback, isOnce);
    }
  }

  /**
   * Call registered handlers for a specific event.
   *
   * @private
   * @param {string} eventName - Name of the event.
   * @param {any} payload - Data payload for the event.
   * @param {string} [realEventName] - Real event name.
   */
  private callHandlers(eventName: string, payload: any, realEventName?: string): void {
    this.eventHandlersMap[ eventName ]?.forEach((isOnce: boolean, handler: Function) => {
      handler(payload, { eventName: realEventName || eventName, isOnce });
      if (isOnce) {
        this.off(eventName, handler);
      }
    });
  }

  // Public methods

  /**
   * Set debug mode for the event management.
   *
   * @param {boolean} isDebug - Whether to activate debug mode.
   * @returns {EventManagement} - Returns the instance of EventManagement.
   */
  public setDebug(isDebug: boolean): this {
    this.isDebug = isDebug;
    return this;
  }

  /**
   * Register an event listener.
   *
   * @param {string} eventName - Name of the event.
   * @param {Function} callback - Callback function for the event.
   * @returns {EventManagement} - Returns the instance of EventManagement.
   */
  public on(eventName: string, callback: Function): this {
    this.addEventHandler(eventName, callback);
    return this;
  }

  /**
   * Register an event listener that listens only once.
   *
   * @param {string} eventName - Name of the event.
   * @param {Function} callback - Callback function for the event.
   * @returns {EventManagement} - Returns the instance of EventManagement.
   */
  public once(eventName: string, callback: Function): this {
    this.addEventHandler(eventName, callback, true);
    return this;
  }

  /**
   * Remove an event listener.
   *
   * @param {string} eventName - Name of the event.
   * @param {Function} callback - Callback function for the event.
   * @returns {EventManagement} - Returns the instance of EventManagement.
   */
  public off(eventName: string, callback: Function): this {
    this.eventHandlersMap[ eventName ]?.delete(callback);
    return this;
  }

  /**
   * Emit/fire an event.
   *
   * @param {string} eventName - Name of the event.
   * @param {any} [payload] - Data payload for the event.
   */
  public emit(eventName: string, payload?: any): void {
    if (this.isDebug) {
      console.info(`[${this.constructor.name}]: Fires ${eventName}`);
    }

    this.callHandlers('*', payload, eventName);
    this.callHandlers(eventName, payload);
  }

  // Aliases

  /** Alias for emit method. */
  public fire = this.emit;

  /** Alias for on method. */
  public listen = this.on;

  /** Alias for on method. */
  public subscribe = this.on;

  /** Alias for off method. */
  public remove = this.off;

  /** Alias for off method. */
  public unsubscribe = this.off;
}

const eventManagerInstance = new EventManagement();

export { eventManagerInstance };
