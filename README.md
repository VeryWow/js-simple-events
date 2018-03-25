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
