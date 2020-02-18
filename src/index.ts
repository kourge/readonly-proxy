export function readonlyProxyOf<T extends object>(target: T): Readonly<T> {
  return new Proxy(target, {
    get(target: T, property: string | number | symbol, receiver: any): any {
      const result = Reflect.get(target, property, receiver);
      try {
        if (
          (typeof result === 'object' && result !== null) ||
          typeof result === 'function'
        ) {
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
  });
}
