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
   * @param {Vec2} o vector
   * @returns the absolute
   */
  static abs (o) {
    return new Vec2(
      Math.abs(o.x),
      Math.abs(o.y));
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the sum
   */
  static add (o, d) {
    return new Vec2(
      o.x + d.x,
      o.y + d.y);
  }

  /**
   * @param {Vec2} o vector
   * @returns the floor
   */
  static ceil (o) {
    return new Vec2(
      Math.ceil(o.x),
      Math.ceil(o.y));
  }

  /**
   * @param {Vec2} v input
   * @param {Vec2} lb range lower bound
   * @param {Vec2} ub range upper bound
   * @param {Vec2} target the output vector
   * @returns the clamped vector
   */
  static clamp (v, lb, ub) {
    return new Vec2(
      Math.min(Math.max(v.x, lb.x), ub.x),
      Math.min(Math.max(v.y, lb.y), ub.y));
  }

  /**
   * @param {Vec2} o left comparisand
   * @param {Vec2} d right comparisand
   * @returns the comparison
   */
  static compare (o, d) {
    if (o.y < d.y) { return -1; }
    if (o.y > d.y) { return 1; }
    if (o.x < d.x) { return -1; }
    if (o.x > d.x) { return 1; }
    return 0;
  }

  /**
   * @param {Vec2} o left comparisand
   * @param {Vec2} d right comparisand
   * @returns the signed magnitude
   */
  static copySign (o, d) {
    return new Vec2(
      Math.abs(o.x) * Math.sign(d.x),
      Math.abs(o.y) * Math.sign(d.y));
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the cross product
   */
  static cross (o, d) {
    return o.x * d.y - o.y * d.x;
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the Chebyshev distance
   */
  static distChebyshev (o, d) {
    return Math.max(
      Math.abs(d.x - o.x),
      Math.abs(d.y - o.y));
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the Euclidean distance
   */
  static distEuclidean (o, d) {
    return Math.hypot(
      d.x - o.x,
      d.y - o.y);
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the Manhattan distance
   */
  static distManhattan (o, d) {
    return Math.abs(d.x - o.x) +
      Math.abs(d.y - o.y);
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @param {number} c exponent
   * @returns the Minkowski distance
   */
  static distMinkowski (o, d, c) {
    if (c !== 0.0) {
      return Math.pow(
        Math.pow(Math.abs(d.x - o.x), c) +
        Math.pow(Math.abs(d.y - o.y), c),
        1.0 / c);
    }
    return 0.0;
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the squared distance
   */
  static distSq (o, d) {
    const x = d.x - o.x;
    const y = d.y - o.y;
    return x * x + y * y;
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
   * @returns the floor
   */
  static floor (o) {
    return new Vec2(
      Math.floor(o.x),
      Math.floor(o.y));
  }

  /**
   * @param {Vec2} o vector
   * @returns the fraction
   */
  static fract (o) {
    return new Vec2(
      o.x - Math.trunc(o.x),
      o.y - Math.trunc(o.y));
  }

  /**
   * @param {number} azimuth azimuth in radians
   * @param {number} radius radius
   * @returns the Cartesian coordinates
   */
  static fromPolar (azimuth = 0.0, radius = 1.0) {
    return new Vec2(
      radius * Math.cos(azimuth),
      radius * Math.sin(azimuth));
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the product
   */
  static hadamard (o, d) {
    return new Vec2(
      o.x * d.x,
      o.y * d.y);
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
   * @returns the angle in radians
   */
  static headingSigned (o) {
    return Math.atan2(o.y, o.z);
  }

  /**
   * @param {Vec2} o vector
   * @returns the square magnitude
   */
  static magSq (o) {
    return o.x * o.x + o.y * o.y;
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the maximum
   */
  static max (o, d) {
    return new Vec2(
      Math.max(o.x, d.x),
      Math.max(o.y, d.y));
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the minimum
   */
  static min (o, d) {
    return new Vec2(
      Math.min(o.x, d.x),
      Math.min(o.y, d.y));
  }

  /**
   * @param {Vec2} o left operand 
   * @param {Vec2} d right operand
   * @returns the remainder
   */
  static remTrunc (o, d) {
    return new Vec2(
      d.x !== 0.0 ? o.x % d.x : o.x,
      d.y !== 0.0 ? o.y % d.y : o.y);
  }

  /**
   * @param o vector
   * @param {number} radians angle in radians
   */
  static rotateZ (o, radians) {
    return Vec2.rotateZIntenal(o,
      Math.cos(radians), Math.sin(radians));
  }

  /**
   * @param o vector
   * @param {number} [cosa=1.0] cosine of the angle
   * @param {number} [sina=0.0] sine of the angle
   */
  static rotateZIntenal (o, cosa = 1.0, sina = 0.0) {
    return new Vec2(
      cosa * o.x - sina * o.y,
      cosa * o.y + sina * o.x);
  }

  /**
   * @param {Vec2} o vector
   * @returns the rounded vector
   */
  static round (o) {
    return new Vec2(
      Math.round(o.x),
      Math.round(o.y));
  }

  /**
   * @param {Vec2} o vector
   * @returns the sign
   */
  static sign (o) {
    return new Vec2(
      Math.sign(o.x),
      Math.sign(o.y));
  }

  /**
   * @param {Vec2} o left operand
   * @param {Vec2} d right operand
   * @returns the difference
   */
  static subtract (o, d) {
    return new Vec2(
      o.x - d.x,
      o.y - d.y);
  }

  /**
   * @param {Vec2} o vector
   * @returns the truncation
   */
  static trunc (o) {
    return new Vec2(
      Math.trunc(o.x),
      Math.trunc(o.y));
  }

  /**
   * @returns the vector
   */
  static left () {
    return new Vec2(-1.0, 0.0);
  }

  /**
   * @returns the vector
   */
  static down () {
    return new Vec2(0.0, -1.0);
  }

  /**
   * @returns the vector
   */
  static right () {
    return new Vec2(1.0, 0.0);
  }

  /**
   * @returns the vector
   */
  static up () {
    return new Vec2(0.0, 1.0);
  }

  /**
   * @returns the vector
   */
  static zero () {
    return new Vec2(0.0, 0.0);
  }
}