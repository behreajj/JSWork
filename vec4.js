'use strict';

/**
 * A mutable, extensible class influenced by GLSL. This is intended to serve as
 * a parent class for colors. Instance methods are limited, while most static
 * methods require an explicit output variable to be provided.
 */
class Vec4 {

  /**
   * Constructs a vector from numbers.
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @param {number} z the z coordinate
   * @param {number} w the w coordinate
   */
  constructor (x = 0.0, y = 0.0, z = 0.0, w = 0.0) {

    /**
     * The x coordinate.
     *
     * Negative values tend to the West, or left, on the horizontal axis;
     * positive values, toward the East, or right.
     * 
     * In colors, stores the red channel.
     */
    this._x = x;

    /**
     * The y coordinate.
     *
     * Negative values tend to the South, or backward, on the depth axis;
     * positive values, toward the North, or forward. 
     * 
     * In colors, stores the green channel.
     */
    this._y = y;

    /**
     * The z coordinate.
     *
     * Negative values tend inward, or down, on the vertical axis; positive
     * values outward, or up.
     * 
     * In colors, stores the blue channel.
     */
    this._z = z;

    /**
     * The w coordinate.
     *
     * When transforming a three-dimensional vector through multiplication with
     * a 4 x 4 affine transform matrix, the w component may help distinguish a
     * point ( w === 1.0 ) from a direction ( w === 0.0 ).
     *
     * In colors, stores the alpha channel, which governs transparency.
     */
    this._w = w;
  }

  /**
   * The number of dimensions held by this vector, 4.
   */
  get length () {

    return 4;
  }

  get w () {

    return this._w;
  }

  get x () {

    return this._x;
  }

  get y () {

    return this._y;
  }

  get z () {

    return this._z;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set w (v) {

    this._w = v;
  }

  set x (v) {

    this._x = v;
  }

  set y (v) {

    this._y = v;
  }

  set z (v) {

    this._z = v;
  }

  [Symbol.iterator] () {

    let index = 0;
    return {
      next: () => {
        return {
          value: this.get(index++),
          done: index > this.length
        };
      }
    };
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'string':
        return this.toString();
      case 'number':
      default:
        return Vec4.mag(this);
    }
  }

  /**
   * Tests equivalence between this and another object. For rough equivalence of
   * floating point components, use the static approx function instead.
   *
   * @param {object} obj the object
   * @returns the evaluation
   */
  equals (obj) {

    if (!obj) { return false; }
    if (this === obj) { return true; }
    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }
    return this.hashCode() === obj.hashCode();
  }

  /**
   * Gets a component of this vector by index.
   *
   * @param {number} i the index
   * @returns the value
   */
  get (i = -1) {

    switch (i) {
      case 0: case -4:
        return this._x;
      case 1: case -3:
        return this._y;
      case 2: case -2:
        return this._z;
      case 3: case -1:
        return this._w;
      default:
        return 0.0;
    }
  }

  /**
   * Returns a hash code for this vector based on its x, y and z components.
   *
   * @returns the hash code
   */
  hashCode () {

    /* x hash code. */
    const xstr = String(this._x);
    const len0 = xstr.length;
    let xhsh = 0;
    for (let i = 0; i < len0; ++i) {
      xhsh = Math.imul(31, xhsh) ^ xstr.charCodeAt(i) | 0;
    }
    xhsh >>>= 0;

    /* y hash code. */
    const ystr = String(this._y);
    const len1 = ystr.length;
    let yhsh = 0;
    for (let j = 0; j < len1; ++j) {
      yhsh = Math.imul(31, yhsh) ^ ystr.charCodeAt(j) | 0;
    }
    yhsh >>>= 0;

    /* z hash code. */
    const zstr = String(this._z);
    const len2 = zstr.length;
    let zhsh = 0;
    for (let k = 0; k < len2; ++k) {
      zhsh = Math.imul(31, zhsh) ^ zstr.charCodeAt(k) | 0;
    }
    zhsh >>>= 0;

    /* w hash code. */
    const wstr = String(this._w);
    const len3 = wstr.length;
    let whsh = 0;
    for (let l = 0; l < len3; ++l) {
      whsh = Math.imul(31, whsh) ^ wstr.charCodeAt(l) | 0;
    }
    whsh >>>= 0;

    /* Composite hash code. */
    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ xhsh;
    hsh = Math.imul(16777619, hsh) ^ yhsh;
    hsh = Math.imul(16777619, hsh) ^ zhsh;
    hsh = Math.imul(16777619, hsh) ^ whsh;
    return hsh;
  }

  /**
   * Resets this vector to an initial state, ( 0.0, 0.0, 0.0, 0.0 ) .
   *
   * @returns this vector
   */
  reset () {

    this._x = 0.0;
    this._y = 0.0;
    this._z = 0.0;
    this._w = 0.0;

    return this;
  }

  /**
   * Sets a component of this vector by index.
   *
   * @param {number} i the index
   * @param {number} v the value
   * @returns this vector
   */
  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -4:
        this._x = v;
        break;
      case 1: case -3:
        this._y = v;
        break;
      case 2: case -2:
        this._z = v;
        break;
      case 3: case -1:
        this._w = v;
        break;
    }

    return this;
  }

  /**
   * Sets the components of this vector.
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @param {number} z the z coordinate
   * @param {number} w the w coordinate
   * @returns this vector
   */
  setComponents (x = 0.0, y = 0.0, z = 0.0, w = 0.0) {

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;

    return this;
  }

  /**
   * Returns an array of length 4 containing this vector's components.
   *
   * @returns the array
   */
  toArray () {

    return [
      this._x,
      this._y,
      this._z,
      this._w];
  }

  /**
   * Returns a JSON formatted string.
   *
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toJsonString (precision = 6) {

    return [
      '{\"x\":',
      this._x.toFixed(precision),
      ',\"y\":',
      this._y.toFixed(precision),
      ',\"z\":',
      this._z.toFixed(precision),
      ',\"w\":',
      this._w.toFixed(precision),
      '}'
    ].join('');
  }

  /**
   * Returns an object literal with this vector's components.
   *
   * @returns the object
   */
  toObject () {

    return {
      x: this._x,
      y: this._y,
      z: this._z,
      w: this._w
    };
  }

  /**
   * Returns a string representation of this vector.
   *
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toString (precision = 4) {

    return [
      '{ x: ',
      this._x.toFixed(precision),
      ', y: ',
      this._y.toFixed(precision),
      ', z: ',
      this._z.toFixed(precision),
      ', w: ',
      this._w.toFixed(precision),
      ' }'
    ].join('');
  }

  /**
   * Finds the absolute value of each vector component.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the absolute vector
   */
  static abs (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.abs(v.x),
      Math.abs(v.y),
      Math.abs(v.z),
      Math.abs(v.w));
  }

  /**
   * Adds two vectors together.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the sum
   */
  static add (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x + b.x,
      a.y + b.y,
      a.z + b.z,
      a.w + b.w);
  }

  /**
   * Adds and then normalizes two vectors.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the normalized sum
   */
  static addNorm (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    const dx = a.x + b.x;
    const dy = a.y + b.y;
    const dz = a.z + b.z;
    const dw = a.w + b.w;

    const mSq = dx * dx + dy * dy + dz * dz + dw * dw;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv,
      dz * mInv,
      dw * mInv);
  }

  /**
   * Tests to see if all the vector's components are non-zero. Useful when
   * testing valid dimensions (width and depth) stored in vectors.
   *
   * @param {Vec4} v the input vector
   * @returns the evaluation
   */
  static all (v = new Vec4()) {

    return (v.w !== 0.0) &&
      (v.z !== 0.0) &&
      (v.y !== 0.0) &&
      (v.x !== 0.0);
  }

  /**
   * Evaluates two vectors like booleans, using the
   * AND logic gate.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   */
  static and (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Boolean(a.x) & Boolean(b.x),
      Boolean(a.y) & Boolean(b.y),
      Boolean(a.z) & Boolean(b.z),
      Boolean(a.w) & Boolean(b.w));
  }

  /**
     * Tests to see if any of the vector's components are non-zero. Useful when
     * testing valid dimensions (width and depth) stored in vectors.
     *
     * @param {Vec4} v the input vector
     * @returns the evaluation
     */
  static any (v = new Vec4()) {

    return (v.w !== 0.0) ||
      (v.z !== 0.0) ||
      (v.y !== 0.0) ||
      (v.x !== 0.0);
  }

  /**
   * Tests to see if two vectors approximate each other.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand 
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approx (
    a = new Vec4(),
    b = new Vec4(),
    tolerance = 0.000001) {

    return (a === b) ||
      (Math.abs(b.w - a.w) < tolerance &&
        Math.abs(b.z - a.z) < tolerance &&
        Math.abs(b.y - a.y) < tolerance &&
        Math.abs(b.x - a.x) < tolerance);
  }

  /**
   * Tests to see if two vectors approximate each other.
   *
   * @param {Vec4} a the input vector
   * @param {number} b the magnitude
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approxMag (
    a = new Vec4(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Vec4.magSq(a)) < tolerance;
  }

  /**
   * Returns to a vector with a negative value on the y axis, (0.0, -1.0, 0.0,
   * 0.0) .
   *
   * @param {Vec4} target the output vector
   * @returns back
   */
  static back (target = new Vec4()) {

    return target.setComponents(0.0, -1.0, 0.0, 0.0);
  }

  /**
   * Raises each component of the vector to the nearest greater integer.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the result
   */
  static ceil (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.ceil(v.x),
      Math.ceil(v.y),
      Math.ceil(v.z),
      Math.ceil(v.w));
  }

  /**
   * Clamps a vector to a range within the lower and upper bound.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} lb the range lower bound
   * @param {Vec4} ub the range upper bound
   * @param {Vec4} target the output vector
   * @returns the clamped vector
   */
  static clamp (
    v = new Vec4(),
    lb = new Vec4(0.0, 0.0, 0.0, 0.0),
    ub = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Vec4()) {

    return target.setComponents(
      Math.min(Math.max(v.x, lb.x), ub.x),
      Math.min(Math.max(v.y, lb.y), ub.y),
      Math.min(Math.max(v.z, lb.z), ub.z),
      Math.min(Math.max(v.w, lb.w), ub.w));
  }

  /**
   * Clamps the vector to a range in [0.0, 1.0]. Useful for working with uv
   * coordinates.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the clamped vector
   */
  static clamp01 (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.min(Math.max(v.x, 0.0), 1.0),
      Math.min(Math.max(v.y, 0.0), 1.0),
      Math.min(Math.max(v.z, 0.0), 1.0),
      Math.min(Math.max(v.w, 0.0), 1.0));
  }

  /**
   * Compares two vectors by magnitude. To be provided to array sort functions.
   *
   * @param {Vec4} a left comparisand
   * @param {Vec4} b right comparisand
   * @returns the comparison
   */
  static compareMag (
    a = new Vec4(),
    b = new Vec4()) {

    const aMag = Vec4.magSq(a);
    const bMag = Vec4.magSq(b);

    if (aMag > bMag) { return 1; }
    if (aMag < bMag) { return -1; }

    return 0;
  }

  /**
   * Compares two vectors by w component, z component, y component, then x
   * component. To be provided to array sort functions.
   *
   * @param {Vec4} a left comparisand
   * @param {Vec4} b right comparisand
   * @returns the comparison
   */
  static compareWzyx (
    a = new Vec4(),
    b = new Vec4()) {

    if (a.w > b.w) { return 1; }
    if (a.w < b.w) { return -1; }
    if (a.z > b.z) { return 1; }
    if (a.z < b.z) { return -1; }
    if (a.y > b.y) { return 1; }
    if (a.y < b.y) { return -1; }
    if (a.x > b.x) { return 1; }
    if (a.x < b.x) { return -1; }

    return 0;
  }

  /**
   * Multiplies an absolute magnitude, the left operand, by the sign of the right operand,
   * such that the magnitude of a matches the sign of b.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @param {Vec4} target the output vector
   * @returns the signed magnitude
   */
  static copySign (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.abs(a.x) * Math.sign(b.x),
      Math.abs(a.y) * Math.sign(b.y),
      Math.abs(a.z) * Math.sign(b.z),
      Math.abs(a.w) * Math.sign(b.w));
  }

  /**
   * Finds the absolute value of the difference between two vectors.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @param {Vec4} target the output vector
   * @returns the absolute difference
   */
  static diff (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z),
      Math.abs(b.w - a.w));
  }

  /**
   * Finds the Chebyshev distance between two vectors. Forms a square pattern
   * when plotted.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @returns the distance
   */
  static distChebyshev (
    a = new Vec4(),
    b = new Vec4()) {

    return Math.max(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z),
      Math.abs(b.w - a.w));
  }

  /**
   * Finds the Euclidean distance between two vectors. Where possible, use
   * distance squared to avoid the computational cost of the square-root.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @returns the distance
   */
  static distEuclidean (
    a = new Vec4(),
    b = new Vec4()) {

    return Math.hypot(
      b.x - a.x,
      b.y - a.y,
      b.z - a.z,
      b.w - a.w);
  }

  /**
   * Finds the Manhattan distance between two vectors. Forms a diamond pattern
   * when plotted.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @returns the distance
   */
  static distManhattan (
    a = new Vec4(),
    b = new Vec4()) {

    return Math.abs(b.x - a.x) +
      Math.abs(b.y - a.y) +
      Math.abs(b.z - a.z) +
      Math.abs(b.w - a.w);
  }

  /**
   * Finds the Minkowski distance between two vectors. This is a generalization
   * of other distance formulae. When the exponent value, c, is 1.0, the
   * Minkowski distance equals the Manhattan distance; when it is 2.0, Minkowski
   * equals the Euclidean distance.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @param {number} c the exponent
   * @returns the distance
   */
  static distMinkowski (
    a = new Vec4(),
    b = new Vec4(),
    c = 2.0) {

    if (c === 0.0) {
      return 0.0;
    }

    return Math.pow(
      Math.pow(Math.abs(b.x - a.x), c) +
      Math.pow(Math.abs(b.y - a.y), c) +
      Math.pow(Math.abs(b.z - a.z), c) +
      Math.pow(Math.abs(b.w - a.w), c),
      1.0 / c);
  }

  /**
   * Finds the Euclidean distance squared between two vectors. Equivalent to
   * subtracting one vector from the other, then finding the dot product of the
   * difference with itself.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @returns the distance
   */
  static distSq (
    a = new Vec4(),
    b = new Vec4()) {

    const xd = b.x - a.x;
    const yd = b.y - a.y;
    const zd = b.z - a.z;
    const wd = b.w - a.w;
    return xd * xd +
      yd * yd +
      zd * zd +
      wd * wd;
  }

  /**
   * Divides the left operand by the right, component-wise. This is
   * mathematically incorrect, but serves as a shortcut for transforming a
   * vector by the inverse of a scalar matrix.
   *
   * @param {Vec4} a numerator
   * @param {Vec4} b denominator
   * @param {Vec4} target the output vector
   * @returns the quotient
   */
  static div (
    a = new Vec4(1.0, 1.0, 1.0, 1.0),
    b = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Vec4()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x / b.x : 0.0,
      b.y !== 0.0 ? a.y / b.y : 0.0,
      b.z !== 0.0 ? a.z / b.z : 0.0,
      b.w !== 0.0 ? a.w / b.w : 0.0);
  }

  /**
   * Finds the dot product of two vectors by summing the products of their
   * corresponding components. dot ( a, b ) := ax bx + ay by + az bz .
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @returns the dot product
   */
  static dot (
    a = new Vec4(),
    b = new Vec4()) {

    return a.x * b.x +
      a.y * b.y +
      a.z * b.z +
      a.w * b.w;
  }

  /**
   * Returns to a vector with a negative value on the z axis, (0.0, 0.0, -1.0,
   * 0.0) .
   *
   * @param {Vec4} target the output vector
   * @returns down
   */
  static down (target = new Vec4()) {

    return target.setComponents(0.0, 0.0, -1.0, 0.0);
  }

  /**
   * Returns a vector with all components set to a small, positive non-zero
   * value, 0.000001 .
   *
   * @param {Vec4} target the output vector
   * @returns epsilon
   */
  static epsilon (target = new Vec4()) {

    return target.setComponents(
      0.000001,
      0.000001,
      0.000001,
      0.000001);
  }

  /**
   * Filters each component of the input vector against a lower and upper bound.
   * If the component is within the range, its value is retained; otherwise, it
   * is set to 0.0 .
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} lb the lower bound
   * @param {Vec4} ub the upper bound
   * @param {Vec4} target the output vector
   * @returns the filtered vector
   */
  static filter (
    v = new Vec4(),
    lb = new Vec4(0.0, 0.0, 0.0, 0.0),
    ub = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Vec4()) {

    return target.setComponents(
      v.x >= lb.x && v.x < ub.x ? v.x : 0.0,
      v.y >= lb.y && v.y < ub.y ? v.y : 0.0,
      v.z >= lb.z && v.z < ub.z ? v.z : 0.0,
      v.w >= lb.w && v.w < ub.w ? v.w : 0.0);
  }

  /**
   * Floors each component of the vector.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the floor
   */
  static floor (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.floor(v.x),
      Math.floor(v.y),
      Math.floor(v.z),
      Math.floor(v.w));
  }

  /**
   * Applies the % operator (truncation-based modulo) to each component of the
   * left operand.
   *
   * @param {Vec4} a left operand
   * @param {Vec4} b right operand
   * @param {Vec4} target the output vector
   * @returns the result 
   */
  static fmod (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x % b.x : a.x,
      b.y !== 0.0 ? a.y % b.y : a.y,
      b.z !== 0.0 ? a.z % b.z : a.z,
      b.w !== 0.0 ? a.w % b.w : a.w);
  }


  /**
   * Returns to a vector with a positive value on the y axis, (0.0, 1.0, 0.0,
   * 0.0) .
   *
   * @param {Vec4} target the output vector
   * @returns forward
   */
  static forward (target = new Vec4()) {

    return target.setComponents(0.0, 1.0, 0.0, 0.0);
  }

  /**
   * Returns the fractional portion of the vector's components.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the fractional portion
   */
  static fract (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      v.x - Math.trunc(v.x),
      v.y - Math.trunc(v.y),
      v.z - Math.trunc(v.z),
      v.w - Math.trunc(v.w));
  }

  /**
   * Creates a vector from the array.
   *
   * @param {Array} arr the array
   * @param {Vec4} target the output vector
   * @returns the vector
   */
  static fromArray (
    arr = [0.0, 0.0, 0.0, 0.0],
    target = new Vec4()) {

    return target.setComponents(
      arr[0],
      arr[1],
      arr[2],
      arr[3]);
  }

  /**
   * Creates a vector from a scalar.
   *
   * @param {number} scalar the scalar
   * @param {Vec4} target the output vector
   * @returns the vector
   */
  static fromScalar (
    scalar = 1.0,
    target = new Vec4()) {

    return target.setComponents(
      scalar,
      scalar,
      scalar,
      scalar);
  }

  /**
   * Copies a vector's coordinates from a source.
   *
   * @param {Vec4} source the source vector
   * @param {Vec4} target the output vector
   * @returns the vector
   */
  static fromSource (
    source = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      source.x,
      source.y,
      source.z,
      source.w);
  }

  /**
   * Generates a 4D array of vectors. Call the flat function with an argument of
   * 4s to flatten to a 1D array.
   *
   * @param {number} cols number of columns
   * @param {number} rows number of rows
   * @param {number} layers number of layers
   * @param {Vec4} lowerBound the lower bound
   * @param {Vec4} upperBound the upper bound
   * @return the array
   */
  static grid (
    cols = 3,
    rows = 3,
    layers = 3,
    time = 3,
    lowerBound = new Vec4(0.0, 0.0, 0.0, 0.0),
    upperBound = new Vec4(1.0, 1.0, 1.0, 1.0)) {

    const rval = rows < 2 ? 2 : rows;
    const cval = cols < 2 ? 2 : cols;
    const lval = layers < 2 ? 2 : layers;
    const tval = time < 2 ? 2 : time;

    const gToStep = 1.0 / (tval - 1.0);
    const hToStep = 1.0 / (lval - 1.0);
    const iToStep = 1.0 / (rval - 1.0);
    const jToStep = 1.0 / (cval - 1.0);

    const xs = [];
    for (let j = 0; j < cval; ++j) {
      const xPrc = j * jToStep;
      const x = (1.0 - xPrc) * lowerBound.x +
        xPrc * upperBound.x;
      xs.push(x);
    }

    const ys = [];
    for (let i = 0; i < rval; ++i) {
      const yPrc = i * iToStep;
      const y = (1.0 - yPrc) * lowerBound.y +
        yPrc * upperBound.y;
      ys.push(y);
    }

    const zs = [];
    for (let h = 0; h < lval; ++h) {
      const zPrc = h * hToStep;
      const z = (1.0 - zPrc) * lowerBound.z +
        zPrc * upperBound.z;
      zs.push(z);
    }

    const result = [];
    for (let g = 0; g < tval; ++g) {
      const step = [];
      const wPrc = g * gToStep;
      const w = (1.0 - wPrc) * lowerBound.w +
        wPrc * upperBound.w;
      for (let h = 0; h < lval; ++h) {
        const layer = [];
        const z = zs[h];
        for (let i = 0; i < rval; ++i) {
          const row = [];
          const y = ys[i];
          for (let j = 0; j < cval; ++j) {
            row.push(new Vec4(xs[j], y, z, w));
          }
          layer.push(row);
        }
        step.push(layer);
      }
      result.push(step);
    }

    return result;
  }

  /**
   * Evaluates whether the left comparisand is greater than the right
   * comparisand.
   * 
   * @param {Vec4} a left comparisand
   * @param {Vec4} b right comparisand
   * @param {Vec4} target output vector
   * @returns the evaluation
   */
  static gt (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x > b.x ? 1.0 : 0.0,
      a.y > b.y ? 1.0 : 0.0,
      a.z > b.z ? 1.0 : 0.0,
      a.w > b.w ? 1.0 : 0.0);
  }

  /**
   * Evaluates whether the left comparisand is greater than or equal to the right
   * comparisand.
   * 
   * @param {Vec4} a left comparisand
   * @param {Vec4} b right comparisand
   * @param {Vec4} target output vector
   * @returns the evaluation
   */
  static gtEq (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x >= b.x ? 1.0 : 0.0,
      a.y >= b.y ? 1.0 : 0.0,
      a.z >= b.z ? 1.0 : 0.0,
      a.w >= b.w ? 1.0 : 0.0);
  }

  /**
   * Tests to see if the vector is on the unit sphere, i.e., has a magnitude of
   * approximately 1.0.
   *
   * @param {Vec4} v the input vector
   * @returns the evaluation
   */
  static isUnit (v = new Vec4()) {

    return Vec4.approxMag(v, 1.0);
  }

  /**
   * Returns to a vector with a negative value on the x axis, (-1.0, 0.0, 0.0,
   * 0.0) .
   *
   * @param {Vec4} target the output vector
   * @returns left
   */
  static left (target = new Vec4()) {

    return target.setComponents(-1.0, 0.0, 0.0, 0.0);
  }

  /**
   * A clamped linear interpolation from an origin to a destination by a step.
   *
   * @param {Vec4} origin the original vector
   * @param {Vec4} dest the destination vector
   * @param {number} step the step
   * @param {Vec4} target the output vector
   * @returns the interpolation
   */
  static lerp (
    origin = new Vec4(0.0, 0.0, 0.0, 0.0),
    dest = new Vec4(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec4()) {

    if (step <= 0.0) {
      return Vec4.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec4.fromSource(dest, target);
    }

    return Vec4.lerpUnclamped(origin, dest, step);
  }

  /**
   * An unclamped linear interpolation from an origin to a destination by a
   * step.
   *
   * @param {Vec4} origin the original vector
   * @param {Vec4} dest the destination vector
   * @param {number} step the step
   * @param {Vec4} target the output vector
   * @returns the interpolation
   */
  static lerpUnclamped (
    origin = new Vec4(0.0, 0.0, 0.0, 0.0),
    dest = new Vec4(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec4()) {

    const u = 1.0 - step
    return target.setComponents(
      u * origin.x + step * dest.x,
      u * origin.y + step * dest.y,
      u * origin.z + step * dest.z,
      u * origin.w + step * dest.w);
  }

  /**
   * Limits a vector's magnitude to a scalar. Does nothing if the vector is
   * beneath the limit.
   *
   * @param {Vec4} v the input vector
   * @param {number} limit the limit
   * @param {Vec4} target the output vector
   * @returns the limited vector
   */
  static limit (
    v = new Vec4(),
    limit = Number.MAX_VALUE,
    target = new Vec4()) {

    if (Vec4.magSq(v) > limit * limit) {
      return Vec4.rescale(v, limit, target);
    }
    return Vec4.fromSource(v, target);
  }

  /**
   * Evaluates whether the left comparisand is less than the right
   * comparisand.
   * 
   * @param {Vec4} a left comparisand
   * @param {Vec4} b right comparisand
   * @param {Vec4} target output vector
   * @returns the evaluation
   */
  static lt (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x < b.x ? 1.0 : 0.0,
      a.y < b.y ? 1.0 : 0.0,
      a.z < b.z ? 1.0 : 0.0,
      a.w < b.w ? 1.0 : 0.0);
  }

  /**
   * Evaluates whether the left comparisand is less than or equal to the right
   * comparisand.
   * 
   * @param {Vec4} a left comparisand
   * @param {Vec4} b right comparisand
   * @param {Vec4} target output vector
   * @returns the evaluation
   */
  static ltEq (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x <= b.x ? 1.0 : 0.0,
      a.y <= b.y ? 1.0 : 0.0,
      a.z <= b.z ? 1.0 : 0.0,
      a.w <= b.w ? 1.0 : 0.0);
  }

  /**
   * Finds the length, or magnitude, of a vector. Also referred to as the radius
   * when using polar coordinates. Where possible, use magSq or dot to avoid the
   * computational cost of the square-root.
   *
   * @param {Vec4} v the input vector
   * @returns the magnitude
   */
  static mag (v = new Vec4()) {

    return Math.hypot(v.x, v.y, v.z, v.w);
  }

  /**
   * Finds the length-, or magnitude-, squared of a vector. Returns the same
   * result as dot ( a , a ) . Useful when calculating the lengths of many
   * vectors, so as to avoid the computational cost of the square-root.
   *
   * @param {Vec4} v the input vector
   * @returns the magnitude squared
   */
  static magSq (v = new Vec4()) {

    return v.x * v.x +
      v.y * v.y +
      v.z * v.z +
      v.w * v.w;
  }

  /**
   * Maps an input vector from an original range to a target range.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} lbOrigin the lower bound original range
   * @param {Vec4} ubOrigin the upper bound original range
   * @param {Vec4} lbDest the lower bound destination range
   * @param {Vec4} ubDest the upper bound destination range
   * @param {Vec4} target the output vector
   * @returns the output vector
   */
  static map (
    v = new Vec4(),
    lbOrigin = new Vec4(-1.0, -1.0, -1.0, -1.0),
    ubOrigin = new Vec4(1.0, 1.0, 1.0, 1.0),
    lbDest = new Vec4(0.0, 0.0, 0.0, 0.0),
    ubDest = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Vec4()) {

    const xDenom = ubOrigin.x - lbOrigin.x;
    const yDenom = ubOrigin.y - lbOrigin.y;
    const zDenom = ubOrigin.z - lbOrigin.z;
    const wDenom = ubOrigin.w - lbOrigin.w;

    return target.setComponents(
      (xDenom === 0.0) ? lbDest.x :
        lbDest.x + (ubDest.x - lbDest.x) *
        ((v.x - lbOrigin.x) / xDenom),

      (yDenom === 0.0) ? lbDest.y :
        lbDest.y + (ubDest.y - lbDest.y) *
        ((v.y - lbOrigin.y) / yDenom),

      (zDenom === 0.0) ? lbDest.z :
        lbDest.z + (ubDest.z - lbDest.z) *
        ((v.z - lbOrigin.z) / zDenom),

      (wDenom === 0.0) ? lbDest.w :
        lbDest.w + (ubDest.w - lbDest.w) *
        ((v.w - lbOrigin.w) / wDenom));
  }

  /**
   * Sets the target vector to the maximum components of the input vector and a
   * upper bound.
   *
   * @param {Vec4} a the input vector
   * @param {Vec4} b the upper bound
   * @param {Vec4} target the output vector
   * @returns the maximal values
   */
  static max (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.max(a.z, b.z),
      Math.max(a.w, b.w));
  }

  /**
   * Sets the target vector to the minimum components of the input vector and a
   * lower bound.
   *
   * @param {Vec4} a the input vector
   * @param {Vec4} b the lower bound
   * @param {Vec4} target the output vector
   * @returns the minimal values
   */
  static min (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.min(a.z, b.z),
      Math.min(a.w, b.w));
  }

  /**
   * Mixes two vectors together by a step in [0.0, 1.0] with the help of an
   * easing function.
   *
   * @param {Vec4} origin the origin vector
   * @param {Vec4} dest the destination vector
   * @param {number} step the step
   * @param {function} easingFunc  the easing function
   * @param {Vec4} target the output vector
   * @returns the mix
   */
  static mix (
    origin = new Vec4(0.0, 0.0, 0.0, 0.0),
    dest = new Vec4(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    easingFunc = Vec4.lerp,
    target = new Vec4()) {

    return easingFunc(origin, dest, step, target);
  }

  /**
   * Mods each component of the left vector by those of the right.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the result
   */
  static mod (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x - b.x * Math.floor(a.x / b.x) : a.x,
      b.y !== 0.0 ? a.y - b.y * Math.floor(a.y / b.y) : a.y,
      b.z !== 0.0 ? a.z - b.z * Math.floor(a.z / b.z) : a.z,
      b.w !== 0.0 ? a.w - b.w * Math.floor(a.w / b.w) : a.w);
  }

  /**
   * A specialized form of mod which subtracts the floor of the vector from the
   * vector.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the result
   */
  static mod1 (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      v.x - Math.floor(v.x),
      v.y - Math.floor(v.y),
      v.z - Math.floor(v.z),
      v.w - Math.floor(v.w));
  }

  /**
   * Multiplies two vectors, component-wise. Such multiplication is
   * mathematically incorrect, but serves as a shortcut for transforming a
   * vector by a scalar matrix.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the product
   */
  static mul (
    a = new Vec4(1.0, 1.0, 1.0, 1.0),
    b = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Vec4()) {

    return target.setComponents(
      a.x * b.x,
      a.y * b.y,
      a.z * b.z,
      a.w * b.w);
  }

  /**
   * Negates the input vector.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the negation
   */
  static negate (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(-v.x, -v.y, -v.z, -v.w);
  }

  /**
   * Returns a vector with all components set to negative one.
   *
   * @param {Vec4} target the output vector
   * @returns negative one
   */
  static negOne (target = new Vec4()) {

    return target.setComponents(-1.0, -1.0, -1.0, -1.0);
  }

  /**
   * Tests to see if all the vector's components are zero. Useful when
   * safeguarding against invalid directions.
   *
   * @param {Vec4} v the input vector
   * @returns the evaluation
   */
  static none (v = new Vec4()) {

    return (v.w === 0.0) &&
      (v.z === 0.0) &&
      (v.y === 0.0) &&
      (v.x === 0.0);
  }

  /**
   * Divides a vector by its magnitude, such that the new magnitude is 1.0. The
   * result is a unit vector, as it lies on the circumference of a unit sphere.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the normalized vector
   */
  static normalize (
    v = new Vec4(),
    target = new Vec4()) {

    const mSq = Vec4.magSq(v);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv,
      v.z * mInv,
      v.w * mInv);
  }


  /**
   * Evaluates a vector like a boolean, where n != 0.0 is true.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   */
  static not (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      v.x !== 0.0 ? 0.0 : 1.0,
      v.y !== 0.0 ? 0.0 : 1.0,
      v.z !== 0.0 ? 0.0 : 1.0,
      v.w !== 0.0 ? 0.0 : 1.0);
  }

  /**
   * Returns a vector with both components set to one.
   *
   * @param {Vec4} target the output vector
   * @returns one
   */
  static one (target = new Vec4()) {

    return target.setComponents(1.0, 1.0, 1.0, 1.0);
  }

  /**
   * Evaluates two vectors like booleans, using the
   * OR logic gate.
   * 
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   */
  static or (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Boolean(a.x) | Boolean(b.x),
      Boolean(a.y) | Boolean(b.y),
      Boolean(a.z) | Boolean(b.z),
      Boolean(a.w) | Boolean(b.w));
  }

  /**
   * Raises a vector to the power of another vector.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the result
   */
  static pow (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.pow(a.x, b.x),
      Math.pow(a.y, b.y),
      Math.pow(a.z, b.z),
      Math.pow(a.w, b.w));
  }

  /**
   * Promotes a 2D vector to a 4D vector.
   * 
   * @param {Vec2} v the 2D vector
   * @param {Vec4} target the output vector
   * @returns the promoted vector
   */
  static promote2 (v = new Vec2(), target = new Vec4()) {

    return target.setComponents(v.x, v.y, 0.0, 0.0);
  }

  /**
   * Promotes a 3D vector to a 4D vector.
   * 
   * @param {Vec3} v the 2D vector
   * @param {Vec4} target the output vector
   * @returns the promoted vector
   */
  static promote3 (v = new Vec3(), target = new Vec4()) {

    return target.setComponents(v.x, v.y, v.z, 0.0);
  }

  /**
   * Reduces the signal, or granularity, of a vector's components. Any level
   * less than 2 returns the target set to the input.
   *
   * @param {Vec4} v the input vector
   * @param {number} levels the levels
   * @param {Vec4} target the output vector
   * @returns the quantized vector
   */
  static quantize (
    v = new Vec4(),
    levels = 8,
    target = new Vec4()) {

    if (levels < 2) {
      return Vec4.fromSource(v, target);
    }

    const delta = 1.0 / levels;
    return target.setComponents(
      delta * Math.floor(0.5 + v.x * levels),
      delta * Math.floor(0.5 + v.y * levels),
      delta * Math.floor(0.5 + v.z * levels),
      delta * Math.floor(0.5 + v.w * levels));
  }

  /**
   * Creates a random point in the Cartesian coordinate system given a lower and
   * an upper bound.
   *
   * @param {Vec4} lb the lower bound
   * @param {Vec4} ub the upper bound
   * @param {Vec4} target the output vector
   * @returns the random vector
   */
  static randomCartesian (
    lb = new Vec4(-1.0, -1.0, -1.0, -1.0),
    ub = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Vec4()) {

    const xFac = Math.random();
    const yFac = Math.random();
    const zFac = Math.random();
    const wFac = Math.random();

    return target.setComponents(
      (1.0 - xFac) * lb.x + xFac * ub.x,
      (1.0 - yFac) * lb.y + yFac * ub.y,
      (1.0 - zFac) * lb.z + zFac * ub.z,
      (1.0 - wFac) * lb.w + wFac * ub.w);
  }

  /**
   * Creates a vector at a random position on a 4D sphere.
   *
   * @param {number} rhoMin the minimum radius
   * @param {number} rhoMax the maximum radius
   * @param {Vec4} target the output vector
   * @returns the random vector
   */
  static randomSpherical (
    rhoMin = 1.0,
    rhoMax = 1.0,
    target = new Vec4()) {

    const rFac = Math.random();
    const rho = (1.0 - rFac) * rhoMin + rFac * rhoMax;

    const t0 = Math.random() * 6.283185307179586;
    const t1 = Math.random() * 6.283185307179586;
    const r1 = Math.random();

    const x0 = rho * Math.sqrt(1.0 - r1);
    const x1 = rho * Math.sqrt(r1);

    return target.setComponents(
      x0 * Math.cos(t0),
      x1 * Math.sin(t1),
      x1 * Math.cos(t1),
      x0 * Math.sin(t0));
  }

  /**
   * Normalizes a vector, then multiplies it by a scalar, in effect setting its
   * magnitude to that scalar.
   *
   * @param {Vec4} v the input vector 
   * @param {number} scalar the new scale
   * @param {Vec4} target the output vector 
   */
  static rescale (
    v = new Vec4(),
    scalar = 1.0,
    target = new Vec4()) {

    const mSq = Vec4.magSq(v);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = scalar / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv,
      v.z * mInv,
      v.w * mInv);
  }

  /**
   * Returns to a vector with a positive value on the x axis, (1.0, 0.0, 0.0,
   * 0.0) .
   *
   * @param {Vec4} target the output vector
   * @returns right
   */
  static right (target = new Vec4()) {

    return target.setComponents(1.0, 0.0, 0.0, 0.0);
  }

  /**
   * Rounds each component of the vector to the nearest whole number.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the rounded vector
   */
  static round (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.round(v.x),
      Math.round(v.y),
      Math.round(v.z),
      Math.round(v.w));
  }

  /**
   * Multiplies a vector, the left operand, by a scalar, the right operand.
   *
   * @param {Vec4} a the vector
   * @param {number} b the scalar
   * @param {Vec4} target the output vector
   * @returns the scaled vector
   */
  static scale (
    a = new Vec4(),
    b = 1.0,
    target = new Vec4()) {

    return target.setComponents(
      a.x * b,
      a.y * b,
      a.z * b,
      a.w * b);
  }

  /**
   * Finds the sign of a vector: -1.0 if negative; 1.0 if positive; 0.0 if
   * neither.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the sign
   */
  static sign (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.sign(v.x),
      Math.sign(v.y),
      Math.sign(v.z),
      Math.sign(v.w));
  }

  /**
   * Eases from the origin to the destination vector by a step, using the
   * formula t t ( 3.0 - 2.0 t ) . When the step is less than zero, returns the
   * origin. When the step is greater than one, returns the destination.
   *
   * @param {Vec4} origin the origin vector
   * @param {Vec4} dest the destination vector
   * @param {number} step the step in [0.0, 1.0]
   * @param {Vec4} target the output vector
   * @returns the eased vector
   */
  static smoothStep (
    origin = new Vec4(0.0, 0.0, 0.0, 0.0),
    dest = new Vec4(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec4()) {

    if (step <= 0.0) {
      return Vec4.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec4.fromSource(dest, target);
    }

    return Vec4.lerpUnclamped(origin, dest,
      step * step * (3.0 - (step + step)));
  }

  /**
   * Subtracts the right vector from the left vector.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the difference
   */
  static sub (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x - b.x,
      a.y - b.y,
      a.z - b.z,
      a.w - b.w);
  }

  /**
   * Subtracts the right from the left vector and then normalizes the
   * difference.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the normalized difference
   */
  static subNorm (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    const dw = a.w - b.w;

    const mSq = dx * dx +
      dy * dy +
      dz * dz +
      dw * dw;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv,
      dz * mInv,
      dw * mInv);
  }

  /**
   * Truncates each component of the vector.
   *
   * @param {Vec4} v the input vector
   * @param {Vec4} target the output vector
   * @returns the truncation
   */
  static trunc (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.trunc(v.x),
      Math.trunc(v.y),
      Math.trunc(v.z),
      Math.trunc(v.w));
  }

  /**
   * Returns to a vector with a positive value on the z axis, (0.0, 0.0, 1.0,
   * 0.0) .
   *
   * @param {Vec4} target the output vector
   * @returns up
   */
  static up (target = new Vec4()) {

    return target.setComponents(0.0, 0.0, 1.0, 0.0);
  }

  /**
   * Returns a vector with all components set to zero.
   *
   * @param {Vec4} target the output vector
   * @returns the zero vector
   */
  static zero (target = new Vec4()) {

    return target.setComponents(0.0, 0.0, 0.0, 0.0);
  }

  /**
   * Evaluates two vectors like booleans, using the
   * exclusive or (XOR) logic gate.
   *
   * @param {Vec4} a the left operand
   * @param {Vec4} b the right operand
   * @param {Vec4} target the output vector
   * @returns the evaluation
   */
  static xor (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Boolean(a.x) ^ Boolean(b.x),
      Boolean(a.y) ^ Boolean(b.y),
      Boolean(a.z) ^ Boolean(b.z),
      Boolean(a.w) ^ Boolean(b.w));
  }
}

/* Aliases. */
Vec4.compare = Vec4.compareWzyx;
Vec4.dist = Vec4.distEuclidean;
Vec4.promote = Vec4.promote3;
Vec4.random = Vec4.randomSpherical;