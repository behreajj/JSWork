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
    if (precision >= 0 && precision < 21) {
      return [
        "{\"x\":", this._x.toFixed(precision),
        ",\"y\":", this._y.toFixed(precision),
        '}'
      ].join('');
    }

    return [
      "{\"x\":", this._x,
      ",\"y\":", this._y,
      '}'
    ].join('');
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the sum
   */
  static add (o, d) {
    return new Vec2(o.x + d.x, o.y + d.y);
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the dot product 
   */
  static dot (o, d) {
    return o.x * d.x + o.y * d.y;
  }

  /**
   * @param {Vec2} o vector
   * @returns the magnitude
   */
  static mag (o) {
    return Math.sqrt(Vec2.magSq(o));
  }

  /**
   * @param {Vec2} o vector
   * @returns the square magnitude
   */
  static magSq (o) {
    return o.x * o.x + o.y * o.y;
  }
}