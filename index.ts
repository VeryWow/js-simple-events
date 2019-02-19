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

type EventDecoratorOptions = {
  placement: 'before' | 'after' | 'promise' | 'callback';
};

type FunctionalKeys<T extends object> = {
  [key in keyof T]: T[key] extends Function ? key : never;
}[keyof T];

function on<
  T extends new (...args: any[]) => any,
  Name extends FunctionalKeys<InstanceType<T>> = FunctionalKeys<InstanceType<T>>
>(target: T, name: Name, options?: EventDecoratorOptions): MethodDecorator;

function on<
  T extends object,
  Name extends FunctionalKeys<T> = FunctionalKeys<T>
>(target: T, name: Name, options?: EventDecoratorOptions): MethodDecorator;

function on<
  T extends EventManager
>(target: T, name: T extends EventManager<infer U> ? U : FunctionalKeys<T>): MethodDecorator;

function on<
  T extends new (...args: any[]) => any,
  Name extends FunctionalKeys<InstanceType<T>> = FunctionalKeys<InstanceType<T>>
>(
  decoTarget: T, name: Name, options?: EventDecoratorOptions
): MethodDecorator {
  if (decoTarget instanceof EventManager) {
    return function (target, key, _) {
      decoTarget.on(name,  target[key]);
    };
  }

  let obj;

  if (typeof decoTarget === 'function') {
    obj = decoTarget.prototype;
  } else {
    obj = decoTarget;
  }

  if (typeof obj !== 'undefined' && typeof obj[name] === 'function') {
    const temp = obj[name];

    return function (target, key, _) {
      if (!options || options.placement === 'before') {
        obj[name] = function () {
          target[key].apply(target, arguments);
          return temp.apply(this, arguments);
        };
      }

      else if (options.placement === 'after') {
        obj[name] = function () {
          const res = temp.apply(this, arguments);
          target[key].apply(target, arguments);

          return res;
        };
      }

      else if (options.placement === 'callback') {
        obj[name] = function (...args: any[]) {
          const cb = args.pop();

          return temp.apply(this, args.concat([function () {
            target[key].apply(target, arguments);
            return cb(arguments);
          }]))
        }
      }

      else if (options.placement === 'promise' && typeof Promise !== 'undefined') {
        obj[name] = function () {
          const result = temp.apply(this, arguments);

          if (result instanceof Promise) {
            const settled = function (res) {
              target[key].apply(target, [res]);

              return res;
            }

            return result
              .then(settled)
              .catch(settled);
          }

          return result;
        };
      }
    } as InstanceType<T>[Name] extends Function ? MethodDecorator : never;
  }
}
