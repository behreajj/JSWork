'use strict';

class Vec3 {
  /**
   * @param {number} [x=0.0] horizontal axis
   * @param {number} [y=0.0] vertical axis
   * @param {number} [z=0.0] depth axis
   */
  constructor (x = 0.0, y = 0.0, z = 0.0) {
    this._x = x;
    this._y = y;
    this._z = z;

    Object.freeze(this);
  }

  get x () { return this._x; }

  get y () { return this._y; }

  get z () { return this._z; }

  get [Symbol.toStringTag] () {
    return this.constructor.name;
  }

  toString (precision = 4) {
    if (precision >= 0 && precision < 21) {
      return [
        "{\"x\":", this._x.toFixed(precision),
        ",\"y\":", this._y.toFixed(precision),
        ",\"z\":", this._z.toFixed(precision),
        '}'
      ].join('');
    }

    return [
      "{\"x\":", this._x,
      ",\"y\":", this._y,
      ",\"z\":", this._z,
      '}'
    ].join('');
  }

  /**
   * @param {Vec3} o vector
   * @returns the absolute
   */
  static abs (o) {
    return new Vec3(
      Math.abs(o.x),
      Math.abs(o.y),
      Math.abs(o.z));
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the sum
   */
  static add (o, d) {
    return new Vec3(
      o.x + d.x,
      o.y + d.y,
      o.z + d.z);
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the angle
   */
  static angleBetween (o, d) {
    if ((o.x !== 0.0 || o.y !== 0.0 || o.z !== 0.0)
      && (d.x !== 0.0 || d.y !== 0.0 || d.z !== 0.0)) {
      return Math.acos(Vec3.dot(o, d)
        / (Vec3.mag(o) * Vec3.mag(d)));
    }
    return 0.0;
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the evaluation
   */
  static approx (o, d, tol = 0.000001) {
    return Math.abs(d.z - o.z) < tol
      && Math.abs(d.y - o.y) < tol
      && Math.abs(d.x - o.x) < tol;
  }

  /**
   * @param {Vec3} o vector
   * @returns the angle in radians
   */
  static azimuthSigned (o) {
    return Math.atan2(o.y, o.x);
  }

  /**
   * @param {Vec3} o vector
   * @returns the angle in radians
   */
  static azimuthUnsigned (o) {
    const hs = Vec3.azimuthSigned(o);
    return hs < 0.0 ?
      hs + (Math.PI + Math.PI) :
      hs;
  }

  /**
   * @param {Vec3} o vector
   * @returns the floor
   */
  static ceil (o) {
    return new Vec3(
      Math.ceil(o.x),
      Math.ceil(o.y),
      Math.ceil(o.z));
  }

  /**
   * @param {Vec3} v input
   * @param {Vec3} lb range lower bound
   * @param {Vec3} ub range upper bound
   * @param {Vec3} target the output vector
   * @returns the clamped vector
   */
  static clamp (v, lb, ub) {
    return new Vec3(
      Math.min(Math.max(v.x, lb.x), ub.x),
      Math.min(Math.max(v.y, lb.y), ub.y),
      Math.min(Math.max(v.z, lb.z), ub.z));
  }

  /**
   * @param {Vec3} o left comparisand
   * @param {Vec3} d right comparisand
   * @returns the comparison
   */
  static compare (o, d) {
    if (o.z < d.z) { return -1; }
    if (o.z > d.z) { return 1; }
    if (o.y < d.y) { return -1; }
    if (o.y > d.y) { return 1; }
    if (o.x < d.x) { return -1; }
    if (o.x > d.x) { return 1; }
    return 0;
  }

  /**
   * @param {Vec3} o left operand
   * @param {Vec3} d right operand
   * @returns the signed magnitude
   */
  static copySign (o, d) {
    return new Vec3(
      Math.abs(o.x) * Math.sign(d.x),
      Math.abs(o.y) * Math.sign(d.y),
      Math.abs(o.z) * Math.sign(d.z));
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the Chebyshev distance
   */
  static distChebyshev (o, d) {
    return Math.max(
      Math.abs(d.x - o.x),
      Math.abs(d.y - o.y),
      Math.abs(d.z - o.z));
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the Euclidean distance
   */
  static distEuclidean (o, d) {
    return Math.hypot(
      d.x - o.x,
      d.y - o.y,
      d.z - o.z);
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the Manhattan distance
   */
  static distManhattan (o, d) {
    return Math.abs(d.x - o.x) +
      Math.abs(d.y - o.y) +
      Math.abs(d.z - o.z);
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @param {number} c exponent
   * @returns the Minkowski distance
   */
  static distMinkowski (o, d, c) {
    if (c !== 0.0) {
      return Math.pow(
        Math.pow(Math.abs(d.x - o.x), c) +
        Math.pow(Math.abs(d.y - o.y), c) +
        Math.pow(Math.abs(d.z - o.z), c),
        1.0 / c);
    }
    return 0.0;
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the squared distance
   */
  static distSq (o, d) {
    const x = d.x - o.x;
    const y = d.y - o.y;
    const z = d.z - o.z;
    return x * x + y * y + z * z;
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the dot product 
   */
  static dot (o, d) {
    return o.x * d.x + o.y * d.y + o.z * d.z;
  }

  /**
   * @param {Vec3} o vector
   * @returns the flipped vector
   */
  static flipX (o) {
    return new Vec3(-o.x, o.y, o.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the flipped vector
   */
  static flipY (o) {
    return new Vec3(o.x, -o.y, o.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the flipped vector
   */
  static flipZ (o) {
    return new Vec3(o.x, o.y, -o.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the floor
   */
  static floor (o) {
    return new Vec3(
      Math.floor(o.x),
      Math.floor(o.y),
      Math.floor(o.z));
  }

  /**
   * @param {Vec3} o vector
   * @returns the fraction
   */
  static fract (o) {
    return new Vec3(
      o.x - Math.trunc(o.x),
      o.y - Math.trunc(o.y),
      o.z - Math.trunc(o.z));
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the product
   */
  static hadamard (o, d) {
    return new Vec3(
      o.x * d.x,
      o.y * d.y,
      o.z * d.z);
  }

  /**
   * @param {Vec3} o vector
   * @param {number} limit 
   */
  static limit (o, limit) {
    if (Vec3.magSq(o) > limit * limit) {
      return Vec3.rescale(o, limit);
    }
    return new Vec3(o.x, o.y, o.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the magnitude
   */
  static mag (o) {
    return Math.hypot(o.x, o.y, o.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the square magnitude
   */
  static magSq (o) {
    return o.x * o.x + o.y * o.y + o.z * o.z;
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the maximum
   */
  static max (o, d) {
    return new Vec3(
      Math.max(o.x, d.x),
      Math.max(o.y, d.y),
      Math.max(o.z, d.z));
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the minimum
   */
  static min (o, d) {
    return new Vec3(
      Math.min(o.x, d.x),
      Math.min(o.y, d.y),
      Math.min(o.z, d.z));
  }

  /**
   * @param {Vec3} o origin
   * @param {Vec3} d destination
   * @param {number} [t=0.5] factor
   */
  static mix (o, d, t = 0.5) {
    const u = 1.0 - t;
    return new Vec3(
      u * o.x + t * d.x,
      u * o.y + t * d.y,
      u * o.z + t * d.z);
  }

  /**
   * @param {Vec3} o left operand 
   * @returns the negation
   */
  static negate (o) {
    return new Vec3(-o.x, -o.y, -o.z);
  }

  /**
   * @param {Vec3} o left operand 
   * @returns the normalized vector
   */
  static normalize (o) {
    const mSq = Vec3.magSq(o);
    if (mSq > 0.0) {
      const mInv = 1.0 / Math.sqrt(mSq);
      return new Vec3(o.x * mInv, o.y * mInv, o.z * mInv);
    }
    return new Vec3(0.0, 0.0, 0.0);
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the projection
   */
  static projectScalar (o, d) {
    const bSq = Vec3.magSq(d);
    if (bSq > 0.0) { return Vec3.dot(o, d) / bSq; }
    return 0.0;
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the projection
   */
  static projectVector (o, d) {
    return Vec3.scale(d, Vec3.projectScalar(o, d));
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the remainder
   */
  static remFloor (o, d) {
    return new Vec3(
      b.x !== 0.0 ? o.x - d.x * Math.floor(o.x / d.x) : o.x,
      b.y !== 0.0 ? o.y - d.y * Math.floor(o.y / d.y) : o.y,
      b.z !== 0.0 ? o.z - d.z * Math.floor(o.z / d.z) : o.z);
  }

  /**
   * @param {Vec3} o left operand 
   * @param {Vec3} d right operand
   * @returns the remainder
   */
  static remTrunc (o, d) {
    return new Vec3(
      d.x !== 0.0 ? o.x % d.x : o.x,
      d.y !== 0.0 ? o.y % d.y : o.y,
      d.z !== 0.0 ? o.z % d.z : o.z);
  }

  /**
   * @param {Vec3} o vector
   * @param {number} d scalar
   * @returns the rescaled vector
   */
  static rescale (o, d) {
    const mSq = Vec3.magSq(o);
    if (mSq > 0.0) {
      const mInv = d / Math.sqrt(mSq);
      return new Vec3(o.x * mInv, o.y * mInv, o.z * mInv);
    }
    return new Vec3(0.0, 0.0, 0.0);
  }

  /**
   * @param o vector
   * @param {number} radians angle in radians
   */
  static rotateZ (o, radians) {
    return Vec3.rotateZIntenal(o,
      Math.cos(radians), Math.sin(radians));
  }

  /**
   * @param o vector
   * @param {number} [cosa=1.0] cosine of the angle
   * @param {number} [sina=0.0] sine of the angle
   */
  static rotateZIntenal (o, cosa = 1.0, sina = 0.0) {
    return new Vec3(
      cosa * o.x - sina * o.y,
      cosa * o.y + sina * o.x,
      o.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the rounded vector
   */
  static round (o) {
    return new Vec3(
      Math.round(o.x),
      Math.round(o.y),
      Math.round(o.z));
  }

  /**
   * @param {Vec3} o vector
   * @param {number} d scalar
   * @returns the scaled vector
   */
  static scale (o, d) {
    return new Vec3(o.x * d, o.y * d, o.z * d);
  }

  /**
   * @param {Vec3} o vector
   * @returns the sign
   */
  static sign (o) {
    return new Vec3(
      Math.sign(o.x),
      Math.sign(o.y),
      Math.sign(o.z));
  }

  /**
   * @param {Vec3} o left operand
   * @param {Vec3} d right operand
   * @returns the difference
   */
  static subtract (o, d) {
    return new Vec3(
      o.x - d.x,
      o.y - d.y,
      o.z - d.z);
  }

  /**
   * @param {Vec3} o vector
   * @returns the truncation
   */
  static trunc (o) {
    return new Vec3(
      Math.trunc(o.x),
      Math.trunc(o.y),
      Math.trunc(o.z));
  }

  /**
   * @returns the vector
   */
  static back () {
    return new Vec3(0.0, 0.0, -1.0);
  }

  /**
   * @returns the vector
   */
  static down () {
    return new Vec3(0.0, -1.0, 0.0);
  }

  /**
   * @returns the vector
   */
  static forward () {
    return new Vec3(0.0, 0.0, 1.0);
  }

  /**
 * @returns the vector
 */
  static left () {
    return new Vec3(-1.0, 0.0, 0.0);
  }

  /**
   * @returns the vector
   */
  static right () {
    return new Vec3(1.0, 0.0, 0.0);
  }

  /**
   * @returns the vector
   */
  static up () {
    return new Vec3(0.0, 1.0, 0.0);
  }

  /**
   * @returns the vector
   */
  static zero () {
    return new Vec3(0.0, 0.0, 0.0);
  }
}