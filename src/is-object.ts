/**
 * Guards that `x` is not a primitive value.
 */
export function isObject(x: unknown): x is object {
  return (typeof x === 'object' && x !== null) || typeof x === 'function';
}
