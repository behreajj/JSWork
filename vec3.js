'use strict';

/**
 * A mutable, extensible class influenced by GLSL, OSL and p5*js's p5.Vector .
 * This is intended for storing points and directions in three-dimensional
 * graphics programs. Instance methods are limited, while most static methods
 * require an explicit output variable to be provided.
 */
class Vec3 {

  /**
   * Constructs a vector from numbers.
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @param {number} z the z coordinate
   */
  constructor (x = 0.0, y = 0.0, z = 0.0) {

    /**
     * The x coordinate.
     *
     * Negative values tend to the West, or left, on the horizontal axis;
     * positive values, toward the East, or right.
     */
    this._x = x;

    /**
     * The y coordinate.
     *
     * Negative values tend to the South, or backward, on the depth axis;
     * positive values, toward the North, or forward. 
     */
    this._y = y;

    /**
     * The z coordinate.
     *
     * Negative values tend inward, or down, on the vertical axis; positive
     * values outward, or up.
     */
    this._z = z;
  }

  /**
   * The number of dimensions held by this vector, 3.
   */
  get length () {

    return 3;
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
        return Vec3.mag(this);
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
      case 0: case -3:
        return this._x;
      case 1: case -2:
        return this._y;
      case 2: case -1:
        return this._z;
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

    /* Composite hash code. */
    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ xhsh;
    hsh = Math.imul(16777619, hsh) ^ yhsh;
    hsh = Math.imul(16777619, hsh) ^ zhsh;
    return hsh;
  }

  /**
   * Resets this vector to an initial state, ( 0.0, 0.0, 0.0 ) .
   *
   * @returns this vector
   */
  reset () {

    this._x = 0.0;
    this._y = 0.0;
    this._z = 0.0;

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
      case 0: case -3:
        this._x = v;
        break;
      case 1: case -2:
        this._y = v;
        break;
      case 2: case -1:
        this._z = v;
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
   * @returns this vector
   */
  setComponents (x = 0.0, y = 0.0, z = 0.0) {

    this._x = x;
    this._y = y;
    this._z = z;

    return this;
  }

  /**
   * Returns an array of length 3 containing this vector's components.
   *
   * @returns the array
   */
  toArray () {

    return [this._x, this._y, this._z];
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
      '}'
    ].join('');
  }

  /**
   * Returns an object literal with this vector's components.
   *
   * @returns the object
   */
  toObject () {

    return { x: this._x, y: this._y, z: this._z };
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
      ' }'
    ].join('');
  }

  /**
   * Finds the absolute value of each vector component.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the absolute vector
   */
  static abs (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.abs(v.x),
      Math.abs(v.y),
      Math.abs(v.z));
  }

  /**
   * Adds two vectors together.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the sum
   */
  static add (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x + b.x,
      a.y + b.y,
      a.z + b.z);
  }

  /**
   * Adds and then normalizes two vectors.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the normalized sum
   */
  static addNorm (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    const dx = a.x + b.x;
    const dy = a.y + b.y;
    const dz = a.z + b.z;

    const mSq = dx * dx + dy * dy + dz * dz;
    if (mSq <= 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv,
      dz * mInv);
  }

  /**
   * Tests to see if all the vector's components are non-zero. Useful when
   * testing valid dimensions (width and depth) stored in vectors.
   *
   * @param {Vec3} v the input vector
   * @returns the evaluation
   */
  static all (v = new Vec3()) {

    return (v.z !== 0.0) &&
      (v.y !== 0.0) &&
      (v.x !== 0.0);
  }

  /**
   * Evaluates two vectors like booleans, using the AND logic gate.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   */
  static and (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Boolean(a.x) & Boolean(b.x),
      Boolean(a.y) & Boolean(b.y),
      Boolean(a.z) & Boolean(b.z));
  }

  /**
   * Finds the angle between two vectors.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @returns the angle
   */
  static angleBetween (
    a = new Vec3(),
    b = new Vec3()) {

    if (Vec3.none(a) || Vec3.none(b)) {
      return 0.0;
    }

    return Math.acos(Vec3.dot(a, b) / (Vec3.mag(a) * Vec3.mag(b)));
  }

  /**
   * Tests to see if any of the vector's components are non-zero. Useful when
   * testing valid dimensions (width and depth) stored in vectors.
   *
   * @param {Vec3} v the input vector
   * @returns the evaluation
   */
  static all (v = new Vec3()) {

    return (v.z !== 0.0) ||
      (v.y !== 0.0) ||
      (v.x !== 0.0);
  }

  /**
   * Tests to see if two vectors approximate each other.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand 
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approx (
    a = new Vec3(),
    b = new Vec3(),
    tolerance = 0.000001) {

    return (a === b) ||
      (Math.abs(b.z - a.z) < tolerance &&
        Math.abs(b.y - a.y) < tolerance &&
        Math.abs(b.x - a.x) < tolerance);
  }

  /**
   * Tests to see if two vectors approximate each other.
   *
   * @param {Vec3} a the input vector
   * @param {number} b the magnitude
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approxMag (
    a = new Vec3(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Vec3.magSq(a)) < tolerance;
  }

  /**
   * Tests to see if two vectors are parallel.
   *
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @returns the evaluation
   */
  static areParallel (
    a = new Vec3(),
    b = new Vec3(),
    tolerance = 0.000001) {

    return (Math.abs(a.y * b.z - a.z * b.y) < tolerance) &&
      (Math.abs(a.z * b.x - a.x * b.z) < tolerance) &&
      (Math.abs(a.x * b.y - a.y * b.x) < tolerance);
  }

  /**
   * Finds the vector's azimuth, or heading, in the range [ -PI, PI ] .
   *
   * @param {Vec3} v the input vector
   * @returns the angle in radians
   */
  static azimuthSigned (v = new Vec3(1.0, 0.0, 0.0)) {

    return Math.atan2(v.y, v.x);
  }

  /**
   * Finds the vector's heading in the range [ 0.0, TAU ] .
   *
   * @param {Vec3} v the input vector
   * @returns the angle in radians
   */
  static azimuthUnsigned (v = new Vec3(1.0, 0.0, 0.0)) {

    const angle = Vec3.azimuthSigned(v);
    return angle - 6.283185307179586 * Math.floor(angle * 0.15915494309189535);
  }

  /**
   * Returns to a vector with a negative value on the y axis, (0.0, -1.0, 0.0) .
   *
   * @param {Vec3} target the output vector
   * @returns back
   */
  static back (target = new Vec3()) {

    return target.setComponents(0.0, -1.0, 0.0);
  }

  /**
   * Returns a point on a Bezier curve described by two anchor points and two
   * control points according to a step in [0.0, 1.0].
   *
   * When the step is less than zero, returns the first anchor point. When the
   * step is greater than one, returns the second anchor point.
   *
   * @param {Vec3} ap0 the first anchor point
   * @param {Vec3} cp0 the first control point
   * @param {Vec3} cp1 the second control point
   * @param {Vec3} ap1 the second anchor point
   * @param {number} step the step
   * @param {Vec3} target the output vector
   * @returns the point along the curve
   */
  static bezierPoint (
    ap0 = new Vec3(),
    cp0 = new Vec3(),
    cp1 = new Vec3(),
    ap1 = new Vec3(),
    step = 0.5,
    target = new Vec3()) {

    if (step <= 0.0) {
      return Vec3.fromSource(ap0, target);
    }

    if (step >= 1.0) {
      return Vec3.fromSource(ap1, target);
    }

    const u = 1.0 - step;
    let tcb = step * step;
    let ucb = u * u;
    const usq3t = ucb * (step + step + step);
    const tsq3u = tcb * (u + u + u);
    ucb = u * ucb;
    tcb = step * tcb;

    return target.setComponents(
      ap0.x * ucb +
      cp0.x * usq3t +
      cp1.x * tsq3u +
      ap1.x * tcb,

      ap0.y * ucb +
      cp0.y * usq3t +
      cp1.y * tsq3u +
      ap1.y * tcb,

      ap0.z * ucb +
      cp0.z * usq3t +
      cp1.z * tsq3u +
      ap1.z * tcb);
  }

  /**
   * Returns a tangent on a Bezier curve described by two anchor points and two
   * control points according to a step in [0.0, 1.0].
   *
   * When the step is less than zero, returns the first anchor point subtracted
   * from the first control point. When the step is greater than one, returns
   * the second anchor point subtracted from the second control point.
   *
   * @param {Vec3} ap0 the first anchor point
   * @param {Vec3} cp0 the first control point
   * @param {Vec3} cp1 the second control point
   * @param {Vec3} ap1 the second anchor point
   * @param {number} step the step
   * @param {Vec3} target the output vector
   * @returns the tangent along the curve
   */
  static bezierTangent (
    ap0 = new Vec3(),
    cp0 = new Vec3(),
    cp1 = new Vec3(),
    ap1 = new Vec3(),
    step = 0.5,
    target = new Vec3()) {

    if (step <= 0.0) {
      return Vec3.sub(cp0, ap0, target);
    }

    if (step >= 1.0) {
      return Vec3.sub(ap1, cp1, target);
    }

    const u = 1.0 - step;
    const t3 = step + step + step;
    const usq3 = u * (u + u + u);
    const tsq3 = step * t3;
    const ut6 = u * (t3 + t3);

    return target.setComponents(
      (cp0.x - ap0.x) * usq3 +
      (cp1.x - cp0.x) * ut6 +
      (ap1.x - cp1.x) * tsq3,

      (cp0.y - ap0.y) * usq3 +
      (cp1.y - cp0.y) * ut6 +
      (ap1.y - cp1.y) * tsq3,

      (cp0.z - ap0.z) * usq3 +
      (cp1.z - cp0.z) * ut6 +
      (ap1.z - cp1.z) * tsq3);
  }

  /**
   * Raises each component of the vector to the nearest greater integer.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the result
   */
  static ceil (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.ceil(v.x),
      Math.ceil(v.y),
      Math.ceil(v.z));
  }

  /**
   * Clamps a vector to a range within the lower and upper bound.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} lb the range lower bound
   * @param {Vec3} ub the range upper bound
   * @param {Vec3} target the output vector
   * @returns the clamped vector
   */
  static clamp (
    v = new Vec3(),
    lb = new Vec3(0.0, 0.0, 0.0),
    ub = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      Math.min(Math.max(v.x, lb.x), ub.x),
      Math.min(Math.max(v.y, lb.y), ub.y),
      Math.min(Math.max(v.z, lb.z), ub.z));
  }

  /**
   * Clamps the vector to a range in [0.0, 1.0]. Useful for working with uv
   * coordinates.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the clamped vector
   */
  static clamp01 (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.min(Math.max(v.x, 0.0), 1.0),
      Math.min(Math.max(v.y, 0.0), 1.0),
      Math.min(Math.max(v.z, 0.0), 1.0));
  }

  /**
   * Compares two vectors by magnitude. To be provided to array sort functions.
   *
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @returns the comparison
   */
  static compareMag (
    a = new Vec3(),
    b = new Vec3()) {

    const aMag = Vec3.magSq(a);
    const bMag = Vec3.magSq(b);

    if (aMag > bMag) { return 1; }
    if (aMag < bMag) { return -1; }

    return 0;
  }

  /**
   * Compares two vectors by z component, y component, then x component. To be
   * provided to array sort functions.
   *
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @returns the comparison
   */
  static compareZyx (
    a = new Vec3(),
    b = new Vec3()) {

    if (a.z < b.z) { return -1; }
    if (a.z > b.z) { return 1; }
    if (a.y < b.y) { return -1; }
    if (a.y > b.y) { return 1; }
    if (a.x < b.x) { return -1; }
    if (a.x > b.x) { return 1; }

    return 0;
  }

  /**
   * Multiplies an absolute magnitude, the left operand, by the sign of the
   * right operand, such that the magnitude of a matches the sign of b.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @param {Vec3} target the output vector
   * @returns the signed magnitude
   */
  static copySign (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.abs(a.x) * Math.sign(b.x),
      Math.abs(a.y) * Math.sign(b.y),
      Math.abs(a.z) * Math.sign(b.z));
  }

  /**
   * The cross product returns a vector perpendicular to both a and b, and
   * therefore normal to the plane on which a and b rest.
   *
   * cross ( a, b ) := ( ay bz - az by, az bx - ax bz, ax by - ay bx )
   *
   * The cross product is anti-commutative, meaning cross (a , b ) = -cross ( b,
   * a ) . A unit vector does not necessarily result from the cross of two unit
   * vectors. Crossed orthonormal vectors are as follows:
   *
   * cross ( right, forward ) = up,
   *
   * cross ( ( 1.0, 0.0, 0.0 ), ( 0.0, 1.0, 0.0 ) ) = ( 0.0, 0.0, 1.0 );
   *
   * cross ( forward, up ) = right,
   *
   * cross ( ( 0.0, 1.0, 0.0 ), ( 0.0, 0.0, 1.0 ) ) = ( 1.0, 0.0, 0.0 );
   *
   * cross ( up , right ) = forward,
   *
   * cross ( ( 0.0, 0.0, 1.0 ), ( 1.0, 0.0, 0.0 ) ) = ( 0.0, 1.0, 0.0 )
   *
   * The 3D equivalent to the 2D vector's perpendicular.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @param {Vec3} target the output vector
   * @returns the cross product
   */
  static cross (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x);
  }

  /**
   * A specialized form of the cross product which normalizes the result. This
   * is to facilitate the creation of lookAt matrices.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @param {Vec3} target the output vector
   * @param the normalized cross product
   */
  static crossNorm (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    const cx = a.y * b.z - a.z * b.y;
    const cy = a.z * b.x - a.x * b.z;
    const cz = a.x * b.y - a.y * b.x;

    const mSq = cx * cx + cy * cy + cz * cz;
    if (mSq > 0.0) {
      const mInv = 1.0 / Math.sqrt(mSq);
      return target.setComponents(
        cx * mInv,
        cy * mInv,
        cz * mInv);
    }
    return target.reset();
  }

  /**
   * Finds the absolute value of the difference between two vectors.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @param {Vec3} target the output vector
   * @returns the absolute difference
   */
  static diff (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z));
  }

  /**
   * Finds the Chebyshev distance between two vectors. Forms a square pattern
   * when plotted.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @returns the distance
   */
  static distChebyshev (
    a = new Vec3(),
    b = new Vec3()) {

    return Math.max(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z));
  }

  /**
   * Finds the Euclidean distance between two vectors. Where possible, use
   * distance squared to avoid the computational cost of the square-root.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @returns the distance
   */
  static distEuclidean (
    a = new Vec3(),
    b = new Vec3()) {

    return Math.hypot(
      b.x - a.x,
      b.y - a.y,
      b.z - a.z);
  }

  /**
   * Finds the Manhattan distance between two vectors. Forms a diamond pattern
   * when plotted.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @returns the distance
   */
  static distManhattan (
    a = new Vec3(),
    b = new Vec3()) {

    return Math.abs(b.x - a.x) +
      Math.abs(b.y - a.y) +
      Math.abs(b.z - a.z);
  }

  /**
   * Finds the Minkowski distance between two vectors. This is a generalization
   * of other distance formulae. When the exponent value, c, is 1.0, the
   * Minkowski distance equals the Manhattan distance; when it is 2.0, Minkowski
   * equals the Euclidean distance.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @param {number} c the exponent
   * @returns the distance
   */
  static distMinkowski (
    a = new Vec3(),
    b = new Vec3(),
    c = 2.0) {

    if (c === 0.0) {
      return 0.0;
    }

    return Math.pow(
      Math.pow(Math.abs(b.x - a.x), c) +
      Math.pow(Math.abs(b.y - a.y), c) +
      Math.pow(Math.abs(b.z - a.z), c),
      1.0 / c);
  }

  /**
   * Finds the Euclidean distance squared between two vectors. Equivalent to
   * subtracting one vector from the other, then finding the dot product of the
   * difference with itself.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @returns the distance
   */
  static distSq (
    a = new Vec3(),
    b = new Vec3()) {

    const xd = b.x - a.x;
    const yd = b.y - a.y;
    const zd = b.z - a.z;
    return xd * xd + yd * yd + zd * zd;
  }

  /**
   * Divides the left operand by the right, component-wise. This is
   * mathematically incorrect, but serves as a shortcut for transforming a
   * vector by the inverse of a scalar matrix.
   *
   * @param {Vec3} a numerator
   * @param {Vec3} b denominator
   * @param {Vec3} target the output vector
   * @returns the quotient
   */
  static div (
    a = new Vec3(1.0, 1.0, 1.0),
    b = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x / b.x : 0.0,
      b.y !== 0.0 ? a.y / b.y : 0.0,
      b.z !== 0.0 ? a.z / b.z : 0.0);
  }

  /**
   * Finds the dot product of two vectors by summing the products of their
   * corresponding components. dot ( a, b ) := ax bx + ay by + az bz .
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @returns the dot product
   */
  static dot (
    a = new Vec3(),
    b = new Vec3()) {

    return a.x * b.x +
      a.y * b.y +
      a.z * b.z;
  }

  /**
   * Returns to a vector with a negative value on the z axis, (0.0, 0.0, -1.0) .
   *
   * @param {Vec3} target the output vector
   * @returns down
   */
  static down (target = new Vec3()) {

    return target.setComponents(0.0, 0.0, -1.0);
  }

  /**
   * Returns a vector with all components set to a small, positive non-zero
   * value, 0.000001 .
   *
   * @param {Vec3} target the output vector
   * @returns epsilon
   */
  static epsilon (target = new Vec3()) {

    return target.setComponents(
      0.000001,
      0.000001,
      0.000001);
  }

  /**
   * Filters each component of the input vector against a lower and upper bound.
   * If the component is within the range, its value is retained; otherwise, it
   * is set to 0.0 .
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} lb the lower bound
   * @param {Vec3} ub the upper bound
   * @param {Vec3} target the output vector
   * @returns the filtered vector
   */
  static filter (
    v = new Vec3(),
    lb = new Vec3(0.0, 0.0, 0.0),
    ub = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      v.x >= lb.x && v.x < ub.x ? v.x : 0.0,
      v.y >= lb.y && v.y < ub.y ? v.y : 0.0,
      v.z >= lb.z && v.z < ub.z ? v.z : 0.0);
  }

  /**
   * Floors each component of the vector.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the floor
   */
  static floor (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.floor(v.x),
      Math.floor(v.y),
      Math.floor(v.z));
  }

  /**
   * Applies the % operator (truncation-based modulo) to each component of the
   * left operand.
   *
   * @param {Vec3} a left operand
   * @param {Vec3} b right operand
   * @param {Vec3} target the output vector
   * @returns the result 
   */
  static fmod (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x % b.x : a.x,
      b.y !== 0.0 ? a.y % b.y : a.y,
      b.z !== 0.0 ? a.z % b.z : a.z);
  }

  /**
   * Returns to a vector with a positive value on the y axis, (0.0, 1.0, 0.0) .
   *
   * @param {Vec3} target the output vector
   * @returns forward
   */
  static forward (target = new Vec3()) {

    return target.setComponents(0.0, 1.0, 0.0);
  }

  /**
   * Returns the fractional portion of the vector's components.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the fractional portion
   */
  static fract (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      v.x - Math.trunc(v.x),
      v.y - Math.trunc(v.y),
      v.z - Math.trunc(v.z));
  }

  /**
   * Creates a vector from the array.
   *
   * @param {Array} arr the array
   * @param {Vec3} target the output vector
   * @returns the vector
   */
  static fromArray (
    arr = [0.0, 0.0, 0.0],
    target = new Vec3()) {

    return target.setComponents(
      arr[0],
      arr[1],
      arr[2]);
  }

  /**
   * Creates a vector from polar coordinates.
   *
   * @param {number} azimuth the azimuth in radians
   * @param {number} radius the radius
   * @param {Vec3} target the output vector
   * @returns the vector
   */
  static fromPolar (
    azimuth = 0.0,
    radius = 1.0,
    target = new Vec3()) {

    return target.setComponents(
      radius * Math.cos(azimuth),
      radius * Math.sin(azimuth),
      0.0);
  }

  /**
   * Creates a vector from a scalar.
   *
   * @param {number} scalar the scalar
   * @param {Vec3} target the output vector
   * @returns the vector
   */
  static fromScalar (
    scalar = 1.0,
    target = new Vec3()) {

    return target.setComponents(
      scalar,
      scalar,
      scalar);
  }

  /**
   * Copies a vector's coordinates from a source.
   *
   * @param {Vec3} source the source vector
   * @param {Vec3} target the output vector
   * @returns the vector
   */
  static fromSource (
    source = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      source.x,
      source.y,
      source.z);
  }

  /**
   * Creates a vector from spherical coordinates: (1) theta, the azimuth or
   * longitude; (2) phi, the inclination or latitude; (3) rho, the radius or
   * magnitude.
   *
   * The poles will be upright in a z-up coordinate system; sideways in a y-up
   * coordinate system.
   *
   * @param {number} azimuth the angle theta in radians
   * @param {number} inclination the angle phi in radians
   * @param {number} radius rho, the vector's magnitude
   * @param {Vec3} target the output vector
   * @returns the vector
   */
  static fromSpherical (
    azimuth = 0.0,
    inclination = 0.0,
    radius = 1.0,
    target = new Vec3()) {

    const cosIncl = Math.cos(inclination);
    const sinIncl = Math.sin(inclination);
    const rhoSinIncl = radius * sinIncl;
    const rhoCosIncl = radius * cosIncl;
    return target.setComponents(
      rhoSinIncl * Math.cos(azimuth),
      rhoSinIncl * Math.sin(azimuth),
      rhoCosIncl);
  }

  /**
   * Generates a 3D array of vectors. Call the flat function with an argument of
   * 2 to flatten to a 1D array.
   * 
   * @param {number} cols number of columns
   * @param {number} rows number of rows
   * @param {number} layers number of layers
   * @param {Vec3} lowerBound the lower bound
   * @param {Vec3} upperBound the upper bound
   * @return the array
   */
  static grid (
    cols = 3,
    rows = 3,
    layers = 3,
    lowerBound = new Vec3(0.0, 0.0, 0.0),
    upperBound = new Vec3(1.0, 1.0, 1.0)) {

    const rval = rows < 2 ? 2 : rows;
    const cval = cols < 2 ? 2 : cols;
    const lval = layers < 2 ? 2 : layers;

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

    const result = [];
    for (let h = 0; h < lval; ++h) {
      const layer = [];
      const zPrc = h * hToStep;
      const z = (1.0 - zPrc) * lowerBound.z +
        zPrc * upperBound.z;
      for (let i = 0; i < rval; ++i) {
        const row = [];
        const y = ys[i];
        for (let j = 0; j < cval; ++j) {
          row.push(new Vec3(xs[j], y, z));
        }
        layer.push(row);
      }
      result.push(layer);
    }

    return result;
  }

  /**
   * Evaluates whether the left comparisand is greater than the right
   * comparisand.
   * 
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @param {Vec3} target output vector
   * @returns the evaluation
   */
  static gt (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x > b.x ? 1.0 : 0.0,
      a.y > b.y ? 1.0 : 0.0,
      a.z > b.z ? 1.0 : 0.0);
  }

  /**
   * Evaluates whether the left comparisand is greater than or equal to the right
   * comparisand.
   * 
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @param {Vec3} target output vector
   * @returns the evaluation
   */
  static gtEq (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x >= b.x ? 1.0 : 0.0,
      a.y >= b.y ? 1.0 : 0.0,
      a.z >= b.z ? 1.0 : 0.0);
  }

  /**
   * Finds the vector's inclination in the range [-PI / 2.0, PI / 2.0]. It is
   * necessary to calculate the vector's magnitude in order to find its
   * inclination.
   *
   * @param {Vec3} v the input vector
   * @returns the inclination
   */
  static inclinationSigned (v = new Vec3(1.0, 0.0, 0.0)) {

    // TODO: Refactor.
    const mSq = Vec3.magSq(v);
    if (mSq > 0.0) {
      const zNorm = v.z / Math.sqrt(mSq);
      return (zNorm <= -1.0) ? -1.5707963267948966 :
        (zNorm >= 1.0) ? 1.5707963267948966 :
          Math.acos(zNorm);
    }
    return 0.0;
  }

  /**
   * Finds the vector's unsigned inclination.
   *
   * @param {Vec3} v the input vector
   * @returns the inclination
   */
  static inclinationUnsigned (v = new Vec3(1.0, 0.0, 0.0)) {

    // TODO: Refactor.
    const angle = Vec3.inclinationSigned(v);
    return angle - 6.283185307179586 * Math.floor(angle * 0.15915494309189535);
  }

  /**
   * Tests to see if the vector is on the unit sphere, i.e., has a magnitude of
   * approximately 1.0.
   *
   * @param {Vec3} v the input vector
   * @returns the evaluation
   */
  static isUnit (v = new Vec3()) {

    return Vec3.approxMag(v, 1.0);
  }

  /**
   * Returns to a vector with a negative value on the x axis, (-1.0, 0.0, 0.0) .
   *
   * @param {Vec3} target the output vector
   * @returns left
   */
  static left (target = new Vec3()) {

    return target.setComponents(-1.0, 0.0, 0.0);
  }

  /**
   * A clamped linear interpolation from an origin to a destination by a step.
   *
   * @param {Vec3} origin the original vector
   * @param {Vec3} dest the destination vector
   * @param {number} step the step
   * @param {Vec3} target the output vector
   * @returns the interpolation
   */
  static lerp (
    origin = new Vec3(0.0, 0.0, 0.0),
    dest = new Vec3(1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec3()) {

    if (step <= 0.0) {
      return Vec3.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec3.fromSource(dest, target);
    }

    return Vec3.lerpUnclamped(origin, dest, step);
  }

  /**
   * An unclamped linear interpolation from an origin to a destination by a
   * step.
   *
   * @param {Vec3} origin the original vector
   * @param {Vec3} dest the destination vector
   * @param {number} step the step
   * @param {Vec3} target the output vector
   * @returns the interpolation
   */
  static lerpUnclamped (
    origin = new Vec3(0.0, 0.0, 0.0),
    dest = new Vec3(1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec3()) {

    const u = 1.0 - step
    return target.setComponents(
      u * origin.x + step * dest.x,
      u * origin.y + step * dest.y,
      u * origin.z + step * dest.z);
  }

  /**
   * Limits a vector's magnitude to a scalar. Does nothing if the vector is
   * beneath the limit.
   *
   * @param {Vec3} v the input vector
   * @param {number} limit the limit
   * @param {Vec3} target the output vector
   * @returns the limited vector
   */
  static limit (
    v = new Vec3(),
    limit = Number.MAX_VALUE,
    target = new Vec3()) {

    if (Vec3.magSq(v) > limit * limit) {
      return Vec3.rescale(v, limit, target);
    }
    return Vec3.fromSource(v, target);
  }

  /**
   * Evaluates whether the left comparisand is less than the right
   * comparisand.
   * 
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @param {Vec3} target output vector
   * @returns the evaluation
   */
  static lt (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x < b.x ? 1.0 : 0.0,
      a.y < b.y ? 1.0 : 0.0,
      a.z < b.z ? 1.0 : 0.0);
  }

  /**
   * Evaluates whether the left comparisand is less than or equal to the right
   * comparisand.
   * 
   * @param {Vec3} a left comparisand
   * @param {Vec3} b right comparisand
   * @param {Vec3} target output vector
   * @returns the evaluation
   */
  static ltEq (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x <= b.x ? 1.0 : 0.0,
      a.y <= b.y ? 1.0 : 0.0,
      a.z <= b.z ? 1.0 : 0.0);
  }

  /**
   * Finds the length, or magnitude, of a vector. Also referred to as the radius
   * when using polar coordinates. Where possible, use magSq or dot to avoid the
   * computational cost of the square-root.
   *
   * @param {Vec3} v the input vector
   * @returns the magnitude
   */
  static mag (v = new Vec3()) {

    return Math.hypot(v.x, v.y, v.z);
  }

  /**
   * Finds the length-, or magnitude-, squared of a vector. Returns the same
   * result as dot ( a , a ) . Useful when calculating the lengths of many
   * vectors, so as to avoid the computational cost of the square-root.
   *
   * @param {Vec3} v the input vector
   * @returns the magnitude squared
   */
  static magSq (v = new Vec3()) {

    return v.x * v.x +
      v.y * v.y +
      v.z * v.z;
  }

  /**
   * Maps an input vector from an original range to a target range.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} lbOrigin the lower bound original range
   * @param {Vec3} ubOrigin the upper bound original range
   * @param {Vec3} lbDest the lower bound destination range
   * @param {Vec3} ubDest the upper bound destination range
   * @param {Vec3} target the output vector
   * @returns the output vector
   */
  static map (
    v = new Vec3(),
    lbOrigin = new Vec3(-1.0, -1.0, -1.0),
    ubOrigin = new Vec3(1.0, 1.0, 1.0),
    lbDest = new Vec3(0.0, 0.0, 0.0),
    ubDest = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    const xDenom = ubOrigin.x - lbOrigin.x;
    const yDenom = ubOrigin.y - lbOrigin.y;
    const zDenom = ubOrigin.z - lbOrigin.z;

    return target.setComponents(
      (xDenom === 0.0) ? lbDest.x :
        lbDest.x + (ubDest.x - lbDest.x) *
        ((v.x - lbOrigin.x) / xDenom),

      (yDenom === 0.0) ? lbDest.y :
        lbDest.y + (ubDest.y - lbDest.y) *
        ((v.y - lbOrigin.y) / yDenom),

      (zDenom === 0.0) ? lbDest.z :
        lbDest.z + (ubDest.z - lbDest.z) *
        ((v.z - lbOrigin.z) / zDenom));
  }

  /**
   * Sets the target vector to the maximum components of the input vector and a
   * upper bound.
   *
   * @param {Vec3} a the input vector
   * @param {Vec3} b the upper bound
   * @param {Vec3} target the output vector
   * @returns the maximal values
   */
  static max (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.max(a.z, b.z));
  }

  /**
   * Sets the target vector to the minimum components of the input vector and a
   * lower bound.
   *
   * @param {Vec3} a the input vector
   * @param {Vec3} b the lower bound
   * @param {Vec3} target the output vector
   * @returns the minimal values
   */
  static min (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.min(a.z, b.z));
  }

  /**
   * Mixes two vectors together by a step in [0.0, 1.0] with the help of an
   * easing function.
   *
   * @param {Vec3} origin the origin vector
   * @param {Vec3} dest the destination vector
   * @param {number} step the step
   * @param {function} easingFunc  the easing function
   * @param {Vec3} target the output vector
   * @returns the mix
   */
  static mix (
    origin = new Vec3(0.0, 0.0, 0.0),
    dest = new Vec3(1.0, 1.0, 1.0),
    step = 0.5,
    easingFunc = Vec3.lerp,
    target = new Vec3()) {

    return easingFunc(origin, dest, step, target);
  }

  /**
   * Mods each component of the left vector by those of the right.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the result
   */
  static mod (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x - b.x * Math.floor(a.x / b.x) : a.x,
      b.y !== 0.0 ? a.y - b.y * Math.floor(a.y / b.y) : a.y,
      b.z !== 0.0 ? a.z - b.z * Math.floor(a.z / b.z) : a.z);
  }

  /**
   * A specialized form of mod which subtracts the floor of the vector from the
   * vector.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the result
   */
  static mod1 (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      v.x - Math.floor(v.x),
      v.y - Math.floor(v.y),
      v.z - Math.floor(v.z));
  }

  /**
   * Multiplies two vectors, component-wise. Such multiplication is
   * mathematically incorrect, but serves as a shortcut for transforming a
   * vector by a scalar matrix.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the product
   */
  static mul (
    a = new Vec3(1.0, 1.0, 1.0),
    b = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      a.x * b.x,
      a.y * b.y,
      a.z * b.z);
  }

  /**
   * Negates the input vector.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the negation
   */
  static negate (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(-v.x, -v.y, -v.z);
  }

  /**
   * Returns a vector with all components set to negative one.
   *
   * @param {Vec3} target the output vector
   * @returns negative one
   */
  static negOne (target = new Vec3()) {

    return target.setComponents(-1.0, -1.0, -1.0);
  }

  /**
   * Tests to see if all the vector's components are zero. Useful when
   * safeguarding against invalid directions.
   *
   * @param {Vec3} v the input vector
   * @returns the evaluation
   */
  static none (v = new Vec3()) {

    return (v.z === 0.0) &&
      (v.y === 0.0) &&
      (v.x === 0.0);
  }

  /**
   * Divides a vector by its magnitude, such that the new magnitude is 1.0. The
   * result is a unit vector, as it lies on the circumference of a unit sphere.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the normalized vector
   */
  static normalize (
    v = new Vec3(),
    target = new Vec3()) {

    const mSq = Vec3.magSq(v);
    if (mSq <= 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv,
      v.z * mInv);
  }

  /**
   * Evaluates a vector like a boolean, where n != 0.0 is true.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   */
  static not (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      v.x !== 0.0 ? 0.0 : 1.0,
      v.y !== 0.0 ? 0.0 : 1.0,
      v.z !== 0.0 ? 0.0 : 1.0);
  }

  /**
   * Returns a vector with both components set to one.
   *
   * @param {Vec3} target the output vector
   * @returns one
   */
  static one (target = new Vec3()) {

    return target.setComponents(1.0, 1.0, 1.0);
  }

  /**
   * Evaluates two vectors like booleans, using the OR logic gate.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   */
  static or (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Boolean(a.x) | Boolean(b.x),
      Boolean(a.y) | Boolean(b.y),
      Boolean(a.z) | Boolean(b.z));
  }

  /**
   * Raises a vector to the power of another vector.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the result
   */
  static pow (
    a = new Vec3(),
    b = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      Math.pow(a.x, b.x),
      Math.pow(a.y, b.y),
      Math.pow(a.z, b.z));
  }

  /**
   * Promotes a 2D vector to a 3D vector.
   * 
   * @param {Vec2} v the 2D vector
   * @param {Vec3} target the output vector
   * @returns the promoted vector
   */
  static promote2 (v = new Vec2(), target = new Vec3()) {

    return target.setComponents(v.x, v.y, 0.0);
  }

  /**
   * Returns the scalar projection of a onto b .
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @returns the scalar projection
   */
  static projectScalar (
    a = new Vec3(),
    b = new Vec3()) {

    const bSq = Vec3.magSq(b);
    if (bSq !== 0.0) {
      return Vec3.dot(a, b) / bSq;
    }
    return 0.0;
  }

  /**
   * Projects one vector onto another. Defined as
   *
   * proj ( a, b ) := b ( dot ( a, b ) / dot ( b, b ) )
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the projection
   */
  static projectVector (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return Vec3.scale(b, Vec3.projectScalar(a, b), target);
  }

  /**
   * Reduces the signal, or granularity, of a vector's components. Any level
   * less than 2 returns the target set to the input.
   *
   * @param {Vec3} v the input vector
   * @param {number} levels the levels
   * @param {Vec3} target the output vector
   * @returns the quantized vector
   */
  static quantize (
    v = new Vec3(),
    levels = 8,
    target = new Vec3()) {

    if (levels < 2) {
      return Vec3.fromSource(v, target);
    }

    const delta = 1.0 / levels;
    return target.setComponents(
      delta * Math.floor(0.5 + v.x * levels),
      delta * Math.floor(0.5 + v.y * levels),
      delta * Math.floor(0.5 + v.z * levels));
  }

  /**
   * Creates a random point in the Cartesian coordinate system given a lower and
   * an upper bound.
   *
   * @param {Vec3} lb the lower bound
   * @param {Vec3} ub the upper bound
   * @param {Vec3} target the output vector
   * @returns the random vector
   */
  static randomCartesian (
    lb = new Vec3(-1.0, -1.0, -1.0),
    ub = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    const xFac = Math.random();
    const yFac = Math.random();
    const zFac = Math.random();

    return target.setComponents(
      (1.0 - xFac) * lb.x + xFac * ub.x,
      (1.0 - yFac) * lb.y + yFac * ub.y,
      (1.0 - zFac) * lb.z + zFac * ub.z);
  }

  /**
   *  Creates a vector with a magnitude of 1.0 at a random heading, such that it
   *  lies on the unit circle.
   *
   *  @param {Vec3} target  the output vector
   *  @returns the random vector
   */
  static randomPolar (target = new Vec3()) {

    const tFac = Math.random();
    return Vec3.fromPolar(
      (1.0 - tFac) * -3.141592653589793 + tFac * 3.141592653589793,
      1.0,
      target);
  }

  /**
   * Creates a vector at a random azimuth and inclination.
   *
   * @param {number} rhoMin the minimum radius
   * @param {number} rhoMax the maximum radius
   * @param {Vec3} target  the output vector
   * @returns the random vector
   */
  static randomSpherical (
    rhoMin = 1.0,
    rhoMax = 1.0,
    target = new Vec3()) {

    const tFac = Math.random();
    const pFac = Math.random();
    const rFac = Math.random();

    return Vec3.fromSpherical(
      (1.0 - tFac) * -3.141592653589793 + tFac * 3.141592653589793,
      (1.0 - pFac) * -1.5707963267948966 + pFac * 1.5707963267948966,
      (1.0 - rFac) * rhoMin + rFac * rhoMax,
      target);
  }

  /**
     * Reflects an incident vector off a normal vector.
     *
     * @param {Vec3} incident the incident vector
     * @param {Vec3} normal the normal vector
     * @param {Vec3} target the output vector
     * @returns the reflected vector
     */
  static reflect (
    incident = new Vec3(),
    normal = new Vec3(),
    target = new Vec3()) {

    const nMSq = Vec3.magSq(normal);
    if (nMSq <= 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(nMSq);
    const nx = normal.x * mInv;
    const ny = normal.y * mInv;
    const nz = normal.z * mInv;

    const scalar = 2.0 *
      (nx * incident.x +
        ny * incident.y +
        nz * incident.z);

    return target.setComponents(
      incident.x - scalar * nx,
      incident.y - scalar * ny,
      incident.z - scalar * nz);
  }

  /**
   * Refracts a vector through a volume using Snell's law.
   *
   * @param {Vec3} incident the incident vector
   * @param {Vec3} normal the normal vector
   * @param {number} eta ratio of refraction indices
   * @param {Vec3} target the output vector
   * @returns the refraction
   */
  static refract (
    incident = new Vec3(),
    normal = new Vec3(),
    eta = 0.0,
    target = new Vec3()) {

    const nDotI = Vec3.dot(normal, incident);
    const k = 1.0 - eta * eta * (1.0 - nDotI * nDotI);
    if (k < 0.0) {
      return target.reset();
    }
    const scalar = eta * nDotI + Math.sqrt(k);
    return target.setComponents(
      eta * incident.x - scalar * normal.x,
      eta * incident.y - scalar * normal.y,
      eta * incident.z - scalar * normal.z);
  }

  /**
   * Normalizes a vector, then multiplies it by a scalar, in effect setting its
   * magnitude to that scalar.
   *
   * @param {Vec3} v the input vector 
   * @param {number} scalar the new scale
   * @param {Vec3} target the output vector 
   */
  static rescale (
    v = new Vec3(),
    scalar = 1.0,
    target = new Vec3()) {

    const mSq = Vec3.magSq(v);
    if (mSq <= 0.0) {
      return target.reset();
    }

    const mInv = scalar / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv,
      v.z * mInv);
  }

  /**
   * Returns to a vector with a positive value on the x axis, (1.0, 0.0, 0.0) .
   *
   * @param {Vec3} target the output vector
   * @returns right
   */
  static right (target = new Vec3()) {

    return target.setComponents(1.0, 0.0, 0.0);
  }

  /**
   *  Rotates a vector around an arbitrary axis. The axis is assumed to be
   *  normalized.
   *
   *  @param {Vec3} v the vector
   *  @param {number} radians the angle in radians
   *  @param {Vec3} axis the axis
   *  @param {Vec3} target the output vector
   *  @returns the rotated vector
   */
  static rotate (
    v = new Vec3(1.0, 0.0, 0.0),
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0),
    target = new Vec3()) {

    return Vec3.rotateInternal(
      v,
      Math.cos(radians),
      Math.sin(radians),
      axis,
      target);
  }

  /**
   * Rotates a vector around an arbitrary axis. The axis is assumed to be
   * normalized.
   *
   * Accepts pre-calculated sine and cosine of an angle, so that collections of
   * vectors can be efficiently rotated without repeatedly calling cos and sin.
   *
   * @param {Vec3} v the vector
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec3} axis the axis
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateInternal (
    v = new Vec3(1.0, 0.0, 0.0),
    cosa = 1.0,
    sina = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0),
    target = new Vec3()) {

    const complcos = 1.0 - cosa;
    const complxy = complcos * axis.x * axis.y;
    const complxz = complcos * axis.x * axis.z;
    const complyz = complcos * axis.y * axis.z;

    const sinx = sina * axis.x;
    const siny = sina * axis.y;
    const sinz = sina * axis.z;

    return target.setComponents(
      (complcos * axis.x * axis.x + cosa) * v.x +
      (complxy - sinz) * v.y +
      (complxz + siny) * v.z,

      (complxy + sinz) * v.x +
      (complcos * axis.y * axis.y + cosa) * v.y +
      (complyz - sinx) * v.z,

      (complxz - siny) * v.x +
      (complyz + sinx) * v.y +
      (complcos * axis.z * axis.z + cosa) * v.z);
  }

  /**
   * Rotates a vector around the x axis by an angle in radians.
   *
   * @param {Vec3} v the input vector
   * @param {number} radians the angle in radians
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateX (
    v = new Vec3(1.0, 0.0, 0.0),
    radians = 0.0,
    target = new Vec3()) {

    return Vec3.rotateXInternal(
      v,
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  /**
   * Rotates a vector around the x axis.
   *
   * Accepts pre-calculated sine and cosine of an angle, so that collections of
   * vectors can be efficiently rotated without repeatedly calling cos and sin.
   *
   * @param {Vec3} v the vector
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateXInternal (
    v = new Vec3(1.0, 0.0, 0.0),
    cosa = 1.0,
    sina = 0.0,
    target = new Vec3()) {

    return target.setComponents(
      v.x,
      cosa * v.y - sina * v.z,
      cosa * v.z + sina * v.y);
  }

  /**
   * Rotates a vector around the y axis by an angle in radians.
   *
   * @param {Vec3} v the input vector
   * @param {number} radians the angle in radians
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateY (
    v = new Vec3(1.0, 0.0, 0.0),
    radians = 0.0,
    target = new Vec3()) {

    return Vec3.rotateYInternal(
      v,
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  /**
   * Rotates a vector around the y axis.
   *
   * Accepts pre-calculated sine and cosine of an angle, so that collections of
   * vectors can be efficiently rotated without repeatedly calling cos and sin.
   *
   * @param {Vec3} v the vector
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateYInternal (
    v = new Vec3(1.0, 0.0, 0.0),
    cosa = 1.0,
    sina = 0.0,
    target = new Vec3()) {

    return target.setComponents(
      cosa * v.x + sina * v.z,
      v.y,
      cosa * v.z - sina * v.x);
  }

  /**
   * Rotates a vector around the z axis by an angle in radians.
   *
   * @param {Vec3} v the input vector
   * @param {number} radians the angle in radians
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateZ (
    v = new Vec3(1.0, 0.0, 0.0),
    radians = 0.0,
    target = new Vec3()) {

    return Vec3.rotateZInternal(
      v,
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  /**
   * Rotates a vector around the z axis.
   *
   * Accepts pre-calculated sine and cosine of an angle, so that collections of
   * vectors can be efficiently rotated without repeatedly calling cos and sin.
   *
   * @param {Vec3} v the vector
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static rotateZInternal (
    v = new Vec3(1.0, 0.0, 0.0),
    cosa = 1.0,
    sina = 0.0,
    target = new Vec3()) {

    return target.setComponents(
      cosa * v.x - sina * v.y,
      cosa * v.y + sina * v.x,
      v.z);
  }

  /**
   * Rounds each component of the vector to the nearest whole number.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the rounded vector
   */
  static round (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.round(v.x),
      Math.round(v.y),
      Math.round(v.z));
  }

  /**
   * Multiplies a vector, the left operand, by a scalar, the right operand.
   *
   * @param {Vec3} a the vector
   * @param {number} b the scalar
   * @param {Vec3} target the output vector
   * @returns the scaled vector
   */
  static scale (
    a = new Vec3(),
    b = 1.0,
    target = new Vec3()) {

    return target.setComponents(
      a.x * b,
      a.y * b,
      a.z * b);
  }

  /**
   * Finds the sign of a vector: -1.0 if negative; 1.0 if positive; 0.0 if
   * neither.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the sign
   */
  static sign (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.sign(v.x),
      Math.sign(v.y),
      Math.sign(v.z));
  }

  /**
   * Eases from the origin to the destination vector by a step, using the
   * formula t t ( 3.0 - 2.0 t ) . When the step is less than zero, returns the
   * origin. When the step is greater than one, returns the destination.
   *
   * @param {Vec3} origin the origin vector
   * @param {Vec3} dest the destination vector
   * @param {number} step the step in [0.0, 1.0]
   * @param {Vec3} target the output vector
   * @returns the eased vector
   */
  static smoothStep (
    origin = new Vec3(0.0, 0.0, 0.0),
    dest = new Vec3(1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec3()) {

    if (step <= 0.0) {
      return Vec3.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec3.fromSource(dest, target);
    }

    return Vec3.lerpUnclamped(origin, dest,
      step * step * (3.0 - (step + step)));
  }

  /**
   * Subtracts the right vector from the left vector.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the difference
   */
  static sub (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x - b.x,
      a.y - b.y,
      a.z - b.z);
  }

  /**
   * Subtracts the right from the left vector and then normalizes the
   * difference.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the normalized difference
   */
  static subNorm (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;

    const mSq = dx * dx + dy * dy + dz * dz;
    if (mSq <= 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv,
      dz * mInv);
  }

  /**
   * Returns an object with the vector's magnitude (rho), azimuth (theta) and
   * inclination(phi).
   *
   * @param {Vec3} v the input vector
   * @returns the spherical coordinates 
   */
  static toSpherical (v = new Vec3(1.0, 0.0, 0.0)) {

    // TODO: Refactor.
    const mSq = Vec3.magSq(v);
    if (mSq <= 0.0) {
      return { phi: 0.0, rho: 0.0, theta: 0.0 };
    }

    const rho = Math.sqrt(mSq);
    const zNorm = v.z / rho;
    const phi = (zNorm <= -1.0) ? -1.5707963267948966 :
      (zNorm >= 1.0) ? 1.5707963267948966 :
        Math.acos(zNorm);

    return {
      phi: phi,
      rho: rho,
      theta: Vec3.azimuthSigned(v)
    };
  }

  /**
   * Truncates each component of the vector.
   *
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the truncation
   */
  static trunc (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.trunc(v.x),
      Math.trunc(v.y),
      Math.trunc(v.z));
  }

  /**
   * Returns to a vector with a positive value on the z axis, (0.0, 0.0, 1.0) .
   *
   * @param {Vec3} target the output vector
   * @returns up
   */
  static up (target = new Vec3()) {

    return target.setComponents(0.0, 0.0, 1.0);
  }

  /**
   * Evaluates two vectors like booleans, using the exclusive or (XOR) logic
   * gate.
   *
   * @param {Vec3} a the left operand
   * @param {Vec3} b the right operand
   * @param {Vec3} target the output vector
   * @returns the evaluation
   */
  static xor (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Boolean(a.x) ^ Boolean(b.x),
      Boolean(a.y) ^ Boolean(b.y),
      Boolean(a.z) ^ Boolean(b.z));
  }

  /**
   * Returns a vector with all components set to zero.
   *
   * @param {Vec3} target the output vector
   * @returns the zero vector
   */
  static zero (target = new Vec3()) {

    return target.setComponents(0.0, 0.0, 0.0);
  }
}

/* Aliases. */
Vec3.compare = Vec3.compareZyx;
Vec3.dist = Vec3.distEuclidean;
Vec3.azimuth = Vec3.azimuthSigned;
Vec3.inclination = Vec3.inclinationSigned;
Vec3.project = Vec3.projectVector;
Vec3.promote = Vec3.promote2;
Vec3.random = Vec3.randomSpherical;