'use strict';

class Vec2 {
  /**
   * @param {number} [x=0.0] horizontal axis
   * @param {number} [y=0.0] vertical axis
   */
  constructor (x = 0.0, y = 0.0) {
    this._x = x;
    this._y = y;

    Object.freeze(this);
  }

  get x () { return this._x; }

  get y () { return this._y; }

  get [Symbol.toStringTag] () {
    return this.constructor.name;
  }

  toString (precision = 4) {
    return [
      "{\"x\":",
      this._x.toFixed(precision),
      ",\"y\":",
      this._y.toFixed(precision),
      '}'
    ].join('');
  }
}