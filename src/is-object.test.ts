import {isObject} from './is-object';

describe('isObject', () => {
  it('returns false given a string', () => {
    expect(isObject('foo')).toBe(false);
  });

  it('returns false given a number', () => {
    expect(isObject(3)).toBe(false);
  });

  it('returns false given a boolean', () => {
    expect(isObject(true)).toBe(false);
  });

  it('returns false given null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns false given undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  it('returns true given a function', () => {
    expect(isObject(function() {})).toBe(true);
  });

  it('returns true given a plain object', () => {
    expect(isObject({})).toBe(true);
  });

  it('returns true given an object with a prototype', () => {
    expect(isObject(new (class {})())).toBe(true);
  });
});
