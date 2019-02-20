# js-simple-events
> Yet another simple event management system

`npm i -S js-simple-events`

## About

This is just a simple class that helps to manage events in a simple way without dependencies. It also supports TypeScript!

And it's really light - <1kb in size!

## Methods

Method   | Params            | Description
-------- | ----------------- | ----------------------------------------------------------------
`emit`   | `event, payload`  | Emit the event with the given payload.
`fire`   | `event, payload`  | _Alias for `emit`_
`on`     | `event, callback` | Listen for the event with the given callback.
`listen` | `event, callback` | _Alias for `on`_
`once`   | `event, callback` | Listen for the event once, after handling - remove the listener.
`off`    | `event, callback` | Remove event listener(s) for the event.
`remove` | `event, callback` | _Alias for `off`_

## Examples

```js
// Import and initialize
import EventManager from 'js-simple-events'

const eventManager = new EventManager();


// Define handlers
const eventHandler = (payload) => console.log('Yay, events work!', payload);

eventManager.on('test', eventHandler);
eventManager.once('test', () => console.log('This will be called just once!'));

// Emit events
eventManager.emit('test', 'Hello!');
// -> Yay, events work! Hello!
// -> This will be called just once!

eventManager.emit('test', 'Hello!');
// -> Yay, events work! Hello!
// (The 'once' handler isn't fired)
```

## Typed events

Additionally, it's possible to define types for event names using TypeScript and generics:

```ts
import EventManager from 'js-simple-events'

type MyEvents = 'click' | 'hover';

const eventManager = new EventManager<MyEvents>();

eventManager.emit('click') // event name now autocompletes as either 'click' or 'hover'
```

## `@on` decorator

This library also includes a handy `@on` decorator, that allows to bind methods of your class as listeners to `EventManager` events or method calls of any object or class!

Examples:
```ts
import EventManager, { on } from 'js-simple-events'

class Other extends EventManager {
  test(callback) {
    console.log('test');

    setTimeout(callback, 1000);
  }

  testPromiseResolve() {
    return Promise.resolve('test');
  }

  testPromiseReject() {
    return Promise.reject('test');
  }
}

const other = new Other();

class Test {
  @on(Other, 'test')
  onBeforeTest() {
    console.log('Other.test is called', Array.from(arguments))
  }

  @on(Other, 'test', { placement: 'after' })
  onAfterTest() {
    console.log('Other.test was called', Array.from(arguments))
  }

  @on(Other, 'test', { placement: 'callback' })
  cbTest() {
    console.log('Other.test callback is called', Array.from(arguments))
  }

  @on(Other, 'testPromiseResolve', { placement: 'promise' })
  onTestResolve() {
    console.log('Other.testPromiseResolve is settled', Array.from(arguments))
  }

  @on(Other, 'testPromiseReject', { placement: 'promise' })
  onTestReject() {
    console.log('Other.testPromiseReject is settled', Array.from(arguments))
  }

  @on(other, 'test')
  onTestEvent() {
    console.log('"test" event handler called')
  }
}

const test = new Test();

other.test(() => console.log('after you'));
// => Other.test is called >[ƒ]
// => test
// => Other.test was called >[ƒ]
// *1 second pause*
// => Other.test callback is called >[]
// => after you

other.emit('test');
// => "test" event handler called
```

---

## Plugins

### [For Vue.js](https://github.com/kaskar2008/vue-simple-events)
