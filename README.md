# `readonly-proxy`

An alternative to `Object.freeze`, the `readonly-proxy` provides a way to make
a mutation-resistant proxy to some object, instead of freezing the object
itself. It provides several advantages over `Object.freeze`:

- The original object remains unfrozen. Only the wrapped proxy exhibits
  "frozen" behavior.
- Changes to the original object is reflected by the proxy, whereas a clone of
  an object is effectly a snapshot of the original object at the time of cloning.
- The proxy is recursively read-only and works with objects with circular
  references, while out-of-the-box `Object.freeze` does not deep freeze an
  object, nor does it automatically handle objects with cycles without
  additional care.

A read-only proxy is especially useful when:

- You cannot trust the consumer to refrain from mutating an object returned by
  your API.
- Your entire codebase is in strict mode, and you need find out what part of
  your codebase is trying to mutate an object.

## Installation

```
# If you use npm
npm install readonly-proxy

# If you use yarn
yarn add readonly-proxy
```

## Usage

Basic usage:

```js
import {readonlyProxyOf} from 'readonly-proxy';

const point = {x: 0, y: 0};
const p = readonlyProxyOf(point);

try {
  // Setting a property does not work and throws a `TypeError`.
  p.x = 3;
} catch {
  assert(p.x === 0);
  assert(point.x === 0);
}

try {
  // Deleting a property does not work and throws a `TypeError`.
  delete p.y;
} catch {
  assert(p.y === 0);
  assert(point.y === 0);
}

// Setting a property on the original object is reflected in the proxy.
point.x = 3;
assert(point.x === 3);
assert(p.x === 3);

// Deleting a property on the original object is reflected in the proxy.
delete point.y;
assert(!('y' in point));
assert(!('y' in p));
```

## TypeScript

TypeScript declaration files are included. No additional configuration is
needed. Additionally, this package exports a `DeepReadonly<T>` type that is a
recursive version of the built-in `Readonly<T>` type.

## Strict mode behavior

In the aforementioned usage example, attempting to set or delete a property
throws a `TypeError`. This is behavior defined by the ES6 spec for any
JavaScript code running in
[strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode).
and is similar to the behavior of `Object.freeze`.

If you are not sure if your codebase is running in strict mode, insert the
following line somewhere in your codebase that guarantees that it will be run:

```js
false.x = '';
```

If doing so results in a `TypeError` being thrown, then your code is running in
strict mode. Make sure to do this test in your codebase, not in a console or
inspector panel!

On the other hand, if your code is running in non-strict mode (colloqually
"sloppy mode"), then attempting to set or delete a property on a read-only proxy
will silently fail, and the execution of the code will proceed.

### Spec details

First, the [ECMAScript 6 spec](http://www.ecma-international.org/ecma-262/6.0/)
says in §9.5.9 (Proxy Object Internal Methods and Internal Slots »
`[[Set]] ( P, V, Receiver)`) step 11 and §9.5.10 (`[[Delete]] (P)`) step 11 that
if a proxy object's handler's `[[Set]]` or `[[Delete]]` trap returns `false`,
then the resulting operation returns `false`. The operation's return value is
meant to signal whether or not it succeeded; `readonly-proxy` defines its
`[[Set]]` and `[[Delete]]` traps to return `false` to indicate that a property
write or deletion cannot succeed.

In §12.3.2.1 (Property Accessors » Runtime Semantics: Evaluation), writing a
member expression (e.g. `foo.bar`) in strict mode results in a strict reference.

Finally, in §6.2.3.2 (The Reference Specification Type » `PutValue (V, W)`)
step 6d, if a `[[Set]]` operation returns `false` and the reference is a strict
reference, then a `TypeError` is thrown. Similarly, in §12.5.4.2 (The `delete`
Operator » Runtime Semantics: Evaluation) step 5f, if a `[[Delete]]` operation
returns `false` and the reference is a strict reference, then a `TypeError` is
thrown.

Combine all of these semantics together, and we get the behavior above.

## Silent version

As mentioned in the previous section, because `readonly-proxy` returns `false`
from its `[[Set]]` and `[[Delete]]` traps, in strict mode, attempting to write
or delete a property on a read-only proxy will result in a `TypeError` being
thrown. If you do not want this behavior even in strict mode, you can instead
use the `silentReadonlyProxyOf` function:

```js
(function() {
  'use strict';
  const {silentReadonlyProxyOf} = require('readonly-proxy');

  const point = {x: 0, y: 0};
  const p = silentReadonlyProxyOf(point);

  // Setting a property does not work, and does not throw a `TypeError`.
  p.x = 3;
  assert(p.x === 0);
  assert(point.x === 0);

  // Deleting a property does not work, and does not throw a `TypeError`.
  delete p.y;
  assert(p.y === 0);
  assert(point.y === 0);
})();
```

The `silentReadonlyProxyOf` function is a version of the `readonlyProxyOf`
function whose `[[Set]]` and `[[Delete]]` traps lie about their failures to
mutate by returning `true`. This makes it semantically incorrect, but suppresses
the `TypeError` throws even in strict mode.

## Interaction with polyfill

It is not recommended to use `readonly-proxy` with a proxy polyfill. In the
scenario that it is required, keep in mind the following information when
determining what parts of `readonly-proxy` will work and what will not:

- It uses the `get` handler trap to automaticallly wrap an object property value
  in another proxy.
- It uses the `set` handler trap to ignore an attempt to set a property to
  another value.
- It uses the `deleteProperty` handler trap to ignore an attempt to delete a
  property.
- It relies on the fact that constructing a proxy of an object leaves the
  original target object unmodified.

Take [`proxy-polyfill`](https://github.com/GoogleChrome/proxy-polyfill) for
example: at the time of writing, out of the above three traps, it only supports
two of them (`get` and `set`), and throws when passed a handler that defines
a trap that is not supported by it. This makes it incompatible with
`readonly-proxy`. Futhermore, `proxy-polyfill` calls `Object.seal` on the
original target object as well, meaning that the ability to continue modifying
the original object is lost.

## License

`readonly-proxy` is licensed under the MIT license. See the `LICENSE` file for
more information.
