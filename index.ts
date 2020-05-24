import {isObject} from './is-object';

/**
 * Makes all properties in `T` read-only, recursively.
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Returns a read-only proxy of the given `target` object. The proxy resists
 * attempts to directly delete or set any of its properties, and only allows
 * getting properties from it. Furthermore, any property retrieved from this
 * proxy will also be wrapped in a read-only proxy if it is an object.
 *
 * In strict mode, an attempt to set or delete any property on this proxy will
 * cause a `TypeError` to be thrown.
 *
 * @throws {TypeError} if the given `target` is not an object
 */
export function readonlyProxyOf<T extends object>(target: T): DeepReadonly<T> {
  return new Proxy(target, {
    get(target: T, property: string | number | symbol, receiver: any): any {
      const result = Reflect.get(target, property, receiver);
      try {
        if (isObject(result)) {
          return readonlyProxyOf(result);
        }
      } catch {}
      return result;
    },

    set(): boolean {
      return false;
    },

    deleteProperty(): boolean {
      return false;
    },
  }) as DeepReadonly<T>;
}

export default readonlyProxyOf;

/**
 * Returns a silent, read-only proxy of the given `target` object. The proxy
 * resists attempts to directly delete or set any of its properties, and only
 * allows getting properties from it. Furthermore, any property retrieved from
 * this proxy will also be wrapped in a read-only proxy if it is an object.
 *
 * In strict mode, an attempt to set or delete any property on this proxy will
 * silently fail instead of throwing an error.
 *
 * @throws {TypeError} if the given `target` is not an object
 */
export function silentReadonlyProxyOf<T extends object>(
  target: T,
): DeepReadonly<T> {
  return new Proxy(target, {
    get(target: T, property: string | number | symbol, receiver: any): any {
      const result = Reflect.get(target, property, receiver);
      try {
        if (isObject(result)) {
          return silentReadonlyProxyOf(result);
        }
      } catch {}
      return result;
    },

    set(): boolean {
      return true;
    },

    deleteProperty(): boolean {
      return true;
    },
  }) as DeepReadonly<T>;
}
