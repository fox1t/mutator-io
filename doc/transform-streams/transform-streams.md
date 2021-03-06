# Transform streams
A "transform stream" in mutator-io is a simple function that can mutate an incoming value and return the new one (or a Promise / Observable if the operation is asynchronous)

## Interface
```typescript
interface TransformStream {
  (message: Object): any
  subscriptionId?: string
}
```

This generic interface accepts a message and can return any type of value that will be handled by mutator-IO.

Subscription ID is only needed for internal use (and **shouldn't be implemented**) to create a bound between the transformation and the subscription returned by the `transform` method

### Examples
```typescript
mutator.transform('myPipeName', (msg) => msg + 'something')
mutator.transform('myPipeName', (msg) => Promise.resolve(msg + 'something more'))
mutator.transform('myPipeName', (msg) => Rx.Observable.from([
  msg + 'something else delayed'
]).delay(200))
```
