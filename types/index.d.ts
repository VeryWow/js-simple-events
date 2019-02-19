export interface EventHandlers {
    [key: string]: Map<Function, boolean>;
}
export interface IEventMananger<EventNames extends string = string> {
    on(eventName: EventNames, callback: Function): EventManager;
    listen(eventName: EventNames, callback: Function): EventManager;
    subscribe(eventName: EventNames, callback: Function): EventManager;
    once(eventName: EventNames, callback: Function): boolean;
    off(eventName: EventNames, callback: Function): EventManager;
    remove(eventName: EventNames, callback: Function): EventManager;
    unsubscribe(eventName: EventNames, callback: Function): EventManager;
    emit(eventName: EventNames, ...args: any[]): void;
    fire(eventName: EventNames, ...args: any[]): void;
}
export default class EventManager<EventNames extends string = string> implements IEventMananger<EventNames> {
    private eventHandlersMap;
    private addEventHandler;
    on(eventName: EventNames, callback: Function): EventManager;
    once(eventName: EventNames, callback: Function): boolean;
    off(eventName: EventNames, callback: Function): EventManager;
    emit(eventName: EventNames, ...args: any[]): void;
    fire: (eventName: EventNames, ...args: any[]) => void;
    listen: (eventName: EventNames, callback: Function) => EventManager<string>;
    subscribe: (eventName: EventNames, callback: Function) => EventManager<string>;
    remove: (eventName: EventNames, callback: Function) => EventManager<string>;
    unsubscribe: (eventName: EventNames, callback: Function) => EventManager<string>;
}
declare type EventDecoratorOptions = {
    placement: 'before' | 'after' | 'promise' | 'callback';
};
declare type FunctionalKeys<T extends object> = {
    [key in keyof T]: T[key] extends Function ? key : never;
}[keyof T];
export declare function on<T extends new (...args: any[]) => any, Name extends FunctionalKeys<InstanceType<T>> = FunctionalKeys<InstanceType<T>>>(target: T, name: Name, options?: EventDecoratorOptions): MethodDecorator;
export declare function on<T extends object, Name extends FunctionalKeys<T> = FunctionalKeys<T>>(target: T, name: Name, options?: EventDecoratorOptions): MethodDecorator;
export declare function on<T extends EventManager>(target: T, name: T extends EventManager<infer U> ? U : FunctionalKeys<T>): MethodDecorator;
export {};
