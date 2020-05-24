import {readonlyProxyOf, silentReadonlyProxyOf} from './readonly';

const o = {a: 1, b: 2} as const;
const l = {
  name: 'origin',
  position: {x: 0, y: 0},
} as const;

interface R {
  name: string;
  self: R;
}
const r: R = {name: 'recursive', self: null} as any;
r.self = r;

describe('readonlyProxyOf', () => {
  describe('on initialize', () => {
    it('throws a TypeError when given a number', () => {
      expect(() => {
        // @ts-ignore
        readonlyProxyOf(3);
      }).toThrowError(TypeError);
    });

    it('throws a TypeError when given a string', () => {
      expect(() => {
        // @ts-ignore
        readonlyProxyOf('foo');
      }).toThrowError(TypeError);
    });

    it('throws a TypeError when given a boolean', () => {
      expect(() => {
        // @ts-ignore
        readonlyProxyOf(true);
      }).toThrowError(TypeError);
    });

    it('throws a TypeError when given null', () => {
      expect(() => {
        // @ts-ignore
        readonlyProxyOf(null);
      }).toThrowError(TypeError);
    });
  });

  it('ignores a [[Set]] attempt', () => {
    const result = readonlyProxyOf(o);
    const a = result.a;

    // @ts-ignore
    result.a = 3;

    expect(result.a).toBe(a);
    expect(o.a).toBe(a);
  });

  it('ignores a [[Delete]] attempt', () => {
    const result = readonlyProxyOf(o);
    const a = result.a;

    // @ts-ignore
    const deletion = delete result.a;
    expect(deletion).toBe(false);

    expect(result.a).toBe(a);
    expect(o.a).toBe(a);
  });

  it('passes through any primitive property', () => {
    const result = readonlyProxyOf(o);

    expect(result.a).toBe(o.a);
    expect(result.b).toBe(o.b);
  });

  it('works on an object with a cycle', () => {
    const result = readonlyProxyOf(r);
    const {name} = result;

    // @ts-ignore
    result.name = 'foo';
    expect(result.name).toBe(name);

    // @ts-ignore
    result.self.name = 'foo';
    expect(result.self.name).toBe(name);
    expect(result.name).toBe(name);

    // @ts-ignore
    result.self.self.name = 'foo';
    expect(result.self.self.name).toBe(name);
    expect(result.self.name).toBe(name);
    expect(result.name).toBe(name);
  });

  it('wraps any object property in a proxy', () => {
    const result = readonlyProxyOf(l);
    const {x, y} = l.position;

    // @ts-ignore
    result.position.x = 1;
    expect(result.position.x).toBe(x);

    // @ts-ignore
    result.position.y = 2;
    expect(result.position.y).toBe(y);

    // @ts-ignore
    const deletionOfX = delete result.position.x;
    expect(deletionOfX).toBe(false);

    // @ts-ignore
    const deletionOfY = delete result.position.y;
    expect(deletionOfY).toBe(false);
  });

  describe('in strict mode', () => {
    'use strict';

    it('throws on a [[Set]] attempt', () => {
      const result = readonlyProxyOf(o);
      const a = result.a;

      expect(() => {
        // @ts-ignore
        result.a = 3;
      }).toThrow();

      expect(result.a).toBe(a);
      expect(o.a).toBe(a);
    });

    it('throws on a [[Delete]] attempt', () => {
      const result = readonlyProxyOf(o);
      const a = result.a;

      expect(() => {
        // @ts-ignore
        const deletion = delete result.a;
      }).toThrow();

      expect(result.a).toBe(a);
      expect(o.a).toBe(a);
    });

    it('works on an object with a cycle', () => {
      const result = readonlyProxyOf(r);
      const {name} = result;

      expect(() => {
        // @ts-ignore
        result.name = 'foo';
        expect(result.name).toBe(name);
      }).toThrow();

      expect(() => {
        // @ts-ignore
        result.self.name = 'foo';
        expect(result.self.name).toBe(name);
        expect(result.name).toBe(name);
      }).toThrow();

      expect(() => {
        // @ts-ignore
        result.self.self.name = 'foo';
        expect(result.self.self.name).toBe(name);
        expect(result.self.name).toBe(name);
        expect(result.name).toBe(name);
      }).toThrow();
    });
  });
});

describe('silentReadonlyProxyOf', () => {
  describe('on initialize', () => {
    it('throws a TypeError when given a number', () => {
      expect(() => {
        // @ts-ignore
        silentReadonlyProxyOf(3);
      }).toThrowError(TypeError);
    });

    it('throws a TypeError when given a string', () => {
      expect(() => {
        // @ts-ignore
        silentReadonlyProxyOf('foo');
      }).toThrowError(TypeError);
    });

    it('throws a TypeError when given a boolean', () => {
      expect(() => {
        // @ts-ignore
        silentReadonlyProxyOf(true);
      }).toThrowError(TypeError);
    });

    it('throws a TypeError when given null', () => {
      expect(() => {
        // @ts-ignore
        silentReadonlyProxyOf(null);
      }).toThrowError(TypeError);
    });
  });

  it('ignores a [[Set]] attempt', () => {
    const result = silentReadonlyProxyOf(o);
    const a = result.a;

    // @ts-ignore
    result.a = 3;

    expect(result.a).toBe(a);
    expect(o.a).toBe(a);
  });

  it('ignores a [[Delete]] attempt', () => {
    const result = silentReadonlyProxyOf(o);
    const a = result.a;

    // @ts-ignore
    const deletion = delete result.a;
    expect(deletion).toBe(true);

    expect(result.a).toBe(a);
    expect(o.a).toBe(a);
  });

  it('passes through any primitive property', () => {
    const result = silentReadonlyProxyOf(o);

    expect(result.a).toBe(o.a);
    expect(result.b).toBe(o.b);
  });

  it('works on an object with a cycle', () => {
    const result = silentReadonlyProxyOf(r);
    const {name} = result;

    // @ts-ignore
    result.name = 'foo';
    expect(result.name).toBe(name);

    // @ts-ignore
    result.self.name = 'foo';
    expect(result.self.name).toBe(name);
    expect(result.name).toBe(name);

    // @ts-ignore
    result.self.self.name = 'foo';
    expect(result.self.self.name).toBe(name);
    expect(result.self.name).toBe(name);
    expect(result.name).toBe(name);
  });

  it('wraps any object property in a proxy', () => {
    const result = silentReadonlyProxyOf(l);
    const {x, y} = l.position;

    // @ts-ignore
    result.position.x = 1;
    expect(result.position.x).toBe(x);

    // @ts-ignore
    result.position.y = 2;
    expect(result.position.y).toBe(y);

    // @ts-ignore
    const deletionOfX = delete result.position.x;
    expect(deletionOfX).toBe(true);

    // @ts-ignore
    const deletionOfY = delete result.position.y;
    expect(deletionOfY).toBe(true);
  });

  describe('in strict mode', () => {
    'use strict';

    it('fails on a [[Set]] attempt but does not throw', () => {
      const result = silentReadonlyProxyOf(o);
      const a = result.a;

      // @ts-ignore
      result.a = 3;

      expect(result.a).toBe(a);
      expect(o.a).toBe(a);
    });

    it('fails on a [[Delete]] attempt but does not throw', () => {
      const result = silentReadonlyProxyOf(o);
      const a = result.a;

      // @ts-ignore
      const deletion = delete result.a;
      expect(deletion).toBe(true);

      expect(result.a).toBe(a);
      expect(o.a).toBe(a);
    });

    it('works on an object with a cycle', () => {
      const result = silentReadonlyProxyOf(r);
      const {name} = result;

      // @ts-ignore
      result.name = 'foo';
      expect(result.name).toBe(name);

      // @ts-ignore
      result.self.name = 'foo';
      expect(result.self.name).toBe(name);
      expect(result.name).toBe(name);

      // @ts-ignore
      result.self.self.name = 'foo';
      expect(result.self.self.name).toBe(name);
      expect(result.self.name).toBe(name);
      expect(result.name).toBe(name);
    });
  });
});
