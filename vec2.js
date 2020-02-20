'use strict';

/**
 * A mutable, extensible class influenced by GLSL, OSL and p5*js's p5.Vector .
 * This is intended for storing points and directions in two-dimensional
 * graphics programs. Instance methods are limited, while most static methods
 * require an explicit output variable to be provided.
 */
class Vec2 {

  /**
   * Constructs a vector from numbers.
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   */
  constructor (x = 0.0, y = 0.0) {

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
  }

  /**
   * The number of dimensions held by this vector, 2.
   */
  get length () {

    return 2;
  }

  get x () {

    return this._x;
  }

  get y () {

    return this._y;
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
        return Vec2.mag(this);
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
      case 0: case -2:
        return this._x;
      case 1: case -1:
        return this._y;
      default:
        return 0.0;
    }
  }

  /**
   * Returns a hash code for this vector based on its x and y components.
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

    /* Composite hash code. */
    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ xhsh;
    hsh = Math.imul(16777619, hsh) ^ yhsh;
    return hsh;
  }

  /**
   * Resets this vector to an initial state, ( 0.0, 0.0 ) .
   *
   * @returns this vector
   */
  reset () {

    this._x = 0.0;
    this._y = 0.0;

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
      case 0: case -2:
        this._x = v;
        break;
      case 1: case -1:
        this._y = v;
        break;
    }

    return this;
  }

  /**
   * Sets the components of this vector.
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @returns this vector
   */
  setComponents (x = 0.0, y = 0.0) {

    this._x = x;
    this._y = y;

    return this;
  }

  /**
   * Returns an array of length 2 containing this vector's components.
   *
   * @returns the array
   */
  toArray () {

    return [this._x, this._y];
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
      '}'
    ].join('');
  }

  /**
   * Returns an object literal with this vector's components.
   *
   * @returns the object
   */
  toObject () {

    return { x: this._x, y: this._y };
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
      ' }'
    ].join('');
  }

  /**
   * Finds the absolute value of each vector component.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the absolute vector
   */
  static abs (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.abs(v.x),
      Math.abs(v.y));
  }

  /**
   * Adds two vectors together.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the sum
   */
  static add (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      a.x + b.x,
      a.y + b.y);
  }

  /**
   * Adds and then normalizes two vectors.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the normalized sum
   */
  static addNorm (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    const dx = a.x + b.x;
    const dy = a.y + b.y;

    const mSq = dx * dx + dy * dy;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv);
  }

  /**
   * Tests to see if all the vector's components are non-zero. Useful when
   * testing valid dimensions (width and depth) stored in vectors.
   *
   * @param {Vec2} v the input vector
   * @returns the evaluation
   */
  static all (v = new Vec2()) {

    return (v.y !== 0.0) &&
      (v.x !== 0.0);
  }

  /**
   * Evaluates two vectors like booleans, using the
   * AND logic gate.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   */
  static and (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Boolean(a.x) & Boolean(b.x),
      Boolean(a.y) & Boolean(b.y));
  }

  /**
   * Finds the angle between two vectors.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @returns the angle
   */
  static angleBetween (
    a = new Vec2(),
    b = new Vec2()) {

    if (Vec2.none(a) || Vec2.none(b)) {
      return 0.0;
    }

    return Math.acos(Vec2.dot(a, b) / (Vec2.mag(a) * Vec2.mag(b)));
  }

  /**
   * Tests to see if any of the vector's components are non-zero. Useful when
   * testing valid dimensions (width and depth) stored in vectors.
   *
   * @param {Vec2} v the input vector
   * @returns the evaluation
   */
  static any (v = new Vec2()) {

    return (v.y !== 0.0) ||
      (v.x !== 0.0);
  }

  /**
   * Tests to see if two vectors approximate each other.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand 
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approx (
    a = new Vec2(),
    b = new Vec2(),
    tolerance = 0.000001) {

    return Math.abs(b.y - a.y) < tolerance &&
      Math.abs(b.x - a.x) < tolerance;
  }

  /**
   * Tests to see if two vectors approximate each other.
   *
   * @param {Vec2} a the input vector
   * @param {number} b the magnitude
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approxMag (
    a = new Vec2(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Vec2.magSq(a)) < tolerance;
  }

  /**
   * Tests to see if two vectors are parallel.
   *
   * @param {Vec2} a left comparisand
   * @param {Vec2} b right comparisand
   * @returns the evaluation
   */
  static areParallel (a = new Vec2(), b = new Vec2()) {

    return (a.x * b.y - a.y * b.x) === 0.0;
  }

  /**
   * Returns to a vector with a negative value on the y axis, (0.0, -1.0) .
   *
   * @param {Vec2} target the output vector
   * @returns back
   */
  static back (target = new Vec2()) {

    return target.setComponents(0.0, -1.0);
  }

  /**
   * Returns a point on a Bezier curve described by two anchor points and two
   * control points according to a step in [0.0, 1.0].
   *
   * When the step is less than one, returns the first anchor point. When the
   * step is greater than one, returns the second anchor point.
   *
   * @param {Vec2} ap0 the first anchor point
   * @param {Vec2} cp0 the first control point
   * @param {Vec2} cp1 the second control point
   * @param {Vec2} ap1 the second anchor point
   * @param {number} step the step
   * @param {Vec2} target the output vector
   * @returns the point along the curve
   */
  static bezierPoint (
    ap0 = new Vec2(),
    cp0 = new Vec2(),
    cp1 = new Vec2(),
    ap1 = new Vec2(),
    step = 0.5,
    target = new Vec2()) {

    if (step <= 0.0) {
      return Vec2.fromSource(ap0, target);
    }

    if (step >= 1.0) {
      return Vec2.fromSource(ap1, target);
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
      ap1.y * tcb);
  }

  /**
   * Returns a tangent on a Bezier curve described by two anchor points and two
   * control points according to a step in [0.0, 1.0].
   *
   * When the step is less than one, returns the first anchor point subtracted
   * from the first control point. When the step is greater than one, returns
   * the second anchor point subtracted from the second control point.
   *
   * @param {Vec2} ap0 the first anchor point
   * @param {Vec2} cp0 the first control point
   * @param {Vec2} cp1 the second control point
   * @param {Vec2} ap1 the second anchor point
   * @param {number} step the step
   * @param {Vec2} target the output vector
   * @returns the tangent along the curve
   */
  static bezierTangent (
    ap0 = new Vec2(),
    cp0 = new Vec2(),
    cp1 = new Vec2(),
    ap1 = new Vec2(),
    step = 0.5,
    target = new Vec2()) {

    if (step <= 0.0) {
      return Vec2.sub(cp0, ap0, target);
    }

    if (step >= 1.0) {
      return Vec2.sub(ap1, cp1, target);
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
      (ap1.y - cp1.y) * tsq3);
  }

  /**
   * Raises each component of the vector to the nearest greater integer.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the result
   */
  static ceil (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.ceil(v.x),
      Math.ceil(v.y));
  }

  /**
   * Clamps a vector to a range within the lower and upper bound.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} lb the range lower bound
   * @param {Vec2} ub the range upper bound
   * @param {Vec2} target the output vector
   * @returns the clamped vector
   */
  static clamp (
    v = new Vec2(),
    lb = new Vec2(0.0, 0.0),
    ub = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      Math.min(Math.max(v.x, lb.x), ub.x),
      Math.min(Math.max(v.y, lb.y), ub.y));
  }

  /**
   * Clamps the vector to a range in [0.0, 1.0]. Useful for working with uv
   * coordinates.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the clamped vector
   */
  static clamp01 (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.min(Math.max(v.x, 0.0), 1.0),
      Math.min(Math.max(v.y, 0.0), 1.0));
  }

  /**
   * Compares two vectors by magnitude. To be provided to array sort functions.
   *
   * @param {Vec2} a left comparisand
   * @param {Vec2} b right comparisand
   * @returns the comparison
   */
  static compareMag (
    a = new Vec2(),
    b = new Vec2()) {

    const aMag = Vec2.magSq(a);
    const bMag = Vec2.magSq(b);

    if (aMag > bMag) { return 1; }
    if (aMag < bMag) { return -1; }

    return 0;
  }

  /**
   * Compares two vectors by y component, then x component. To be
   * provided to array sort functions.
   *
   * @param {Vec2} a left comparisand
   * @param {Vec2} b right comparisand
   * @returns the comparison
   */
  static compareYx (
    a = new Vec2(),
    b = new Vec2()) {

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
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @param {Vec2} target the output vector
   * @returns the signed magnitude
   */
  static copySign (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.abs(a.x) * Math.sign(b.x),
      Math.abs(a.y) * Math.sign(b.y));
  }

  /**
   * Finds the absolute value of the difference between two vectors.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @param {Vec2} target the output vector
   * @returns the absolute difference
   */
  static diff (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y));
  }

  /**
   * Finds the Chebyshev distance between two vectors. Forms a square pattern
   * when plotted.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @returns the distance
   */
  static distChebyshev (
    a = new Vec2(),
    b = new Vec2()) {

    return Math.max(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y));
  }

  /**
   * Finds the Euclidean distance between two vectors. Where possible, use
   * distance squared to avoid the computational cost of the square-root.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @returns the distance
   */
  static distEuclidean (
    a = new Vec2(),
    b = new Vec2()) {

    return Math.hypot(
      b.x - a.x,
      b.y - a.y);
  }

  /**
   * Finds the Manhattan distance between two vectors. Forms a diamond pattern
   * when plotted.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @returns the distance
   */
  static distManhattan (
    a = new Vec2(),
    b = new Vec2()) {

    return Math.abs(b.x - a.x) +
      Math.abs(b.y - a.y);
  }

  /**
   * Finds the Minkowski distance between two vectors. This is a generalization
   * of other distance formulae. When the exponent value, c, is 1.0, the
   * Minkowski distance equals the Manhattan distance; when it is 2.0, Minkowski
   * equals the Euclidean distance.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @param {number} c the exponent
   * @returns the distance
   */
  static distMinkowski (
    a = new Vec2(),
    b = new Vec2(),
    c = 2.0) {

    if (c === 0.0) {
      return 0.0;
    }

    return Math.pow(
      Math.pow(Math.abs(b.x - a.x), c) +
      Math.pow(Math.abs(b.y - a.y), c),
      1.0 / c);
  }

  /**
   * Finds the Euclidean distance squared between two vectors. Equivalent to
   * subtracting one vector from the other, then finding the dot product of the
   * difference with itself.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @returns the distance
   */
  static distSq (
    a = new Vec2(),
    b = new Vec2()) {

    const xd = b.x - a.x;
    const yd = b.y - a.y;
    return xd * xd + yd * yd;
  }

  /**
   * Divides the left operand by the right, component-wise. This is
   * mathematically incorrect, but serves as a shortcut for transforming a
   * vector by the inverse of a scalar matrix.
   *
   * @param {Vec2} a numerator
   * @param {Vec2} b denominator
   * @param {Vec2} target the output vector
   * @returns the quotient
   */
  static div (
    a = new Vec2(1.0, 1.0),
    b = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x / b.x : 0.0,
      b.y !== 0.0 ? a.y / b.y : 0.0);
  }

  /**
   * Finds the dot product of two vectors by summing the products of their
   * corresponding components. dot ( a, b ) := ax bx + ay by .
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @returns the dot product
   */
  static dot (
    a = new Vec2(),
    b = new Vec2()) {

    return a.x * b.x + a.y * b.y;
  }

  /**
   * Returns a vector with all components set to a small, positive non-zero
   * value, 0.000001 .
   *
   * @param {Vec2} target the output vector
   * @returns epsilon
   */
  static epsilon (target = new Vec2()) {

    return target.setComponents(
      0.000001,
      0.000001);
  }

  /**
   * Filters each component of the input vector against a lower and upper bound.
   * If the component is within the range, its value is retained; otherwise, it
   * is set to 0.0 .
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} lb the lower bound
   * @param {Vec2} ub the upper bound
   * @param {Vec2} target the output vector
   * @returns the filtered vector
   */
  static filter (
    v = new Vec2(),
    lb = new Vec2(0.0, 0.0),
    ub = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      v.x >= lb.x && v.x < ub.x ? v.x : 0.0,
      v.y >= lb.y && v.y < ub.y ? v.y : 0.0);
  }

  /**
   * Floors each component of the vector.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the floor
   */
  static floor (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.floor(v.x),
      Math.floor(v.y));
  }

  /**
   * Applies the % operator (truncation-based modulo) to each component of the
   * left operand.
   *
   * @param {Vec2} a left operand
   * @param {Vec2} b right operand
   * @param {Vec2} target the output vector
   * @returns the result 
   */
  static fmod (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x % b.x : a.x,
      b.y !== 0.0 ? a.y % b.y : a.y);
  }

  /**
   * Returns to a vector with a positive value on the y axis, (0.0, 1.0) .
   *
   * @param {Vec2} target the output vector
   * @returns forward
   */
  static forward (target = new Vec2()) {

    return target.setComponents(0.0, 1.0);
  }

  /**
   * Returns the fractional portion of the vector's components.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the fractional portion
   */
  static fract (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      v.x - Math.trunc(v.x),
      v.y - Math.trunc(v.y));
  }

  /**
   * Creates a vector from the array.
   *
   * @param {Array} arr the array
   * @param {Vec2} target the output vector
   * @returns the vector
   */
  static fromArray (
    arr = [0.0, 0.0],
    target = new Vec2()) {

    return target.setComponents(
      arr[0],
      arr[1]);
  }

  /**
   * Creates a vector from polar coordinates.
   *
   * @param {number} azimuth the azimuth in radians
   * @param {number} radius the radius
   * @param {Vec2} target the output vector
   * @returns the vector
   */
  static fromPolar (
    azimuth = 0.0,
    radius = 1.0,
    target = new Vec2()) {

    return target.setComponents(
      radius * Math.cos(azimuth),
      radius * Math.sin(azimuth));
  }

  /**
   * Creates a vector from a scalar.
   *
   * @param {number} scalar the scalar
   * @param {Vec2} target the output vector
   * @returns the vector
   */
  static fromScalar (
    scalar = 1.0,
    target = new Vec2()) {

    return target.setComponents(
      scalar,
      scalar);
  }

  /**
   * Copies a vector's coordinates from a source.
   *
   * @param {Vec2} source the source vector
   * @param {Vec2} target the output vector
   * @returns the vector
   */
  static fromSource (
    source = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      source.x,
      source.y);
  }

  /**
   * Returns a 2D grid of vectors. Call the flat function with an argument of
   * 1 to flatten to a 1D array.
   *
   * @param {number} cols columns
   * @param {number} rows rows
   * @param {Vec2} lowerBound the lower bound
   * @param {Vec2} upperBound the upper bound
   * @returns the grid
   */
  static grid (
    cols = 3,
    rows = 3,
    lowerBound = new Vec2(0.0, 0.0),
    upperBound = new Vec2(1.0, 1.0)) {

    const rval = rows < 2 ? 2 : rows;
    const cval = cols < 2 ? 2 : cols;

    const iToStep = 1.0 / (rval - 1.0);
    const jToStep = 1.0 / (cval - 1.0);

    const xs = [];
    for (let j = 0; j < cval; ++j) {
      const xPrc = j * jToStep;
      const x = (1.0 - xPrc) * lowerBound.x +
        xPrc * upperBound.x;
      xs.push(x);
    }

    const result = [];
    for (let i = 0; i < rval; ++i) {
      const row = [];
      const yPrc = i * iToStep;
      const y = (1.0 - yPrc) * lowerBound.y +
        yPrc * upperBound.y;
      for (let j = 0; j < cval; ++j) {
        row.push(new Vec2(xs[j], y));
      }
      result.push(row);
    }

    return result;
  }

  /**
   * Finds the vector's heading in the range [ -PI, PI ] .
   *
   * @param {Vec2} v the input vector
   * @returns the angle in radians
   */
  static headingSigned (v = new Vec2(1.0, 0.0)) {

    return Math.atan2(v.y, v.z);
  }

  /**
   * Finds the vector's heading in the range [ 0.0, TAU ] .
   *
   * @param {Vec2} v the input vector
   * @returns the angle in radians
   */
  static headingUnsigned (v = new Vec2(1.0, 0.0)) {

    const angle = Vec2.headingSigned(v);
    return angle - 6.283185307179586 * Math.floor(angle * 0.15915494309189535);
  }

  /**
   * Tests to see if the vector is on the unit circle, i.e., has a magnitude of
   * approximately 1.0.
   *
   * @param {Vec2} v the input vector
   * @returns the evaluation
   */
  static isUnit (v = new Vec2()) {

    return Vec2.approxMag(v, 1.0);
  }

  /**
    * Returns to a vector with a negative value on the x axis, (-1.0, 0.0) .
    *
    * @param {Vec2} target the output vector
    * @returns left
    */
  static left (target = new Vec2()) {

    return target.setComponents(-1.0, 0.0);
  }

  /**
   * A clamped linear interpolation from an origin to a destination by a step.
   *
   * @param {Vec2} origin the original vector
   * @param {Vec2} dest the destination vector
   * @param {number} step the step
   * @param {Vec2} target the output vector
   * @returns the interpolation
   */
  static lerp (
    origin = new Vec2(0.0, 0.0),
    dest = new Vec2(1.0, 1.0),
    step = 0.5,
    target = new Vec2()) {

    if (step <= 0.0) {
      return Vec2.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec2.fromSource(dest, target);
    }

    return Vec2.lerpUnclamped(origin, dest, step);
  }

  /**
    * An unclamped linear interpolation from an origin to a destination by a
    * step.
    *
    * @param {Vec2} origin the original vector
    * @param {Vec2} dest the destination vector
    * @param {number} step the step
    * @param {Vec2} target the output vector
    * @returns the interpolation
    */
  static lerpUnclamped (
    origin = new Vec2(0.0, 0.0),
    dest = new Vec2(1.0, 1.0),
    step = 0.5,
    target = new Vec2()) {

    const u = 1.0 - step
    return target.setComponents(
      u * origin.x + step * dest.x,
      u * origin.y + step * dest.y);
  }

  /**
   * Limits a vector's magnitude to a scalar. Does nothing if the vector is
   * beneath the limit.
   *
   * @param {Vec2} v the input vector
   * @param {number} limit the limit
   * @param {Vec2} target the output vector
   * @returns the limited vector
   */
  static limit (
    v = new Vec2(),
    limit = Number.MAX_VALUE,
    target = new Vec2()) {

    if (Vec2.magSq(v) > limit * limit) {
      return Vec2.rescale(v, limit, target);
    }
    return Vec2.fromSource(v, target);
  }

  /**
   * Finds the length, or magnitude, of a vector. Also referred to as the radius
   * when using polar coordinates. Where possible, use magSq or dot to avoid the
   * computational cost of the square-root.
   *
   * @param {Vec2} v the input vector
   * @returns the magnitude
   */
  static mag (v = new Vec2()) {

    return Math.hypot(v.x, v.y);
  }

  /**
   * Finds the length-, or magnitude-, squared of a vector. Returns the same
   * result as dot ( a , a ) . Useful when calculating the lengths of many
   * vectors, so as to avoid the computational cost of the square-root.
   *
   * @param {Vec2} v the input vector
   * @returns the magnitude squared
   */
  static magSq (v = new Vec2()) {

    return v.x * v.x + v.y * v.y;
  }

  /**
   * Maps an input vector from an original range to a target range.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} lbOrigin the lower bound original range
   * @param {Vec2} ubOrigin the upper bound original range
   * @param {Vec2} lbDest the lower bound destination range
   * @param {Vec2} ubDest the upper bound destination range
   * @param {Vec2} target the output vector
   * @returns the output vector
   */
  static map (
    v = new Vec2(),
    lbOrigin = new Vec2(-1.0, -1.0),
    ubOrigin = new Vec2(1.0, 1.0),
    lbDest = new Vec2(0.0, 0.0),
    ubDest = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    const xDenom = ubOrigin.x - lbOrigin.x;
    const yDenom = ubOrigin.y - lbOrigin.y;

    return target.setComponents(
      (xDenom === 0.0) ? lbDest.x :
        lbDest.x + (ubDest.x - lbDest.x) *
        ((v.x - lbOrigin.x) / xDenom),

      (yDenom === 0.0) ? lbDest.y :
        lbDest.y + (ubDest.y - lbDest.y) *
        ((v.y - lbOrigin.y) / yDenom));
  }

  /**
   * Sets the target vector to the maximum components of the input vector and a
   * upper bound.
   *
   * @param {Vec2} a the input vector
   * @param {Vec2} b the upper bound
   * @param {Vec2} target the output vector
   * @returns the maximal values
   */
  static max (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y));
  }

  /**
   * Sets the target vector to the minimum components of the input vector and a
   * lower bound.
   *
   * @param {Vec2} a the input vector
   * @param {Vec2} b the lower bound
   * @param {Vec2} target the output vector
   * @returns the minimal values
   */
  static min (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y));
  }

  /**
   * Mixes two vectors together by a step in [0.0, 1.0] with the help of an
   * easing function.
   *
   * @param {Vec2} origin the origin vector
   * @param {Vec2} dest the destination vector
   * @param {number} step the step
   * @param {function} easingFunc  the easing function
   * @param {Vec2} target the output vector
   * @returns the mix
   */
  static mix (
    origin = new Vec2(0.0, 0.0),
    dest = new Vec2(1.0, 1.0),
    step = 0.5,
    easingFunc = Vec2.lerp,
    target = new Vec2()) {

    return easingFunc(origin, dest, step, target);
  }

  /**
   * Mods each component of the left vector by those of the right.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the result
   */
  static mod (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x - b.x * Math.floor(a.x / b.x) : a.x,
      b.y !== 0.0 ? a.y - b.y * Math.floor(a.y / b.y) : a.y);
  }

  /**
   * A specialized form of mod which subtracts the floor of the vector from the
   * vector. For Vec2s, useful for managing texture coordinates in the range
   * [0.0, 1.0].
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the result
   */
  static mod1 (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      v.x - Math.floor(v.x),
      v.y - Math.floor(v.y));
  }

  /**
   * Multiplies two vectors, component-wise. Such multiplication is
   * mathematically incorrect, but serves as a shortcut for transforming a
   * vector by a scalar matrix.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the product
   */
  static mul (
    a = new Vec2(1.0, 1.0),
    b = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      a.x * b.x,
      a.y * b.y);
  }

  /**
   * Negates the input vector.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the negation
   */
  static negate (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(-v.x, -v.y);
  }

  /**
   * Returns a vector with all components set to negative one.
   *
   * @param {Vec2} target the output vector
   * @returns negative one
   */
  static negOne (target = new Vec2()) {

    return target.setComponents(-1.0, -1.0);
  }

  /**
   * Tests to see if all the vector's components are zero. Useful when
   * safeguarding against invalid directions.
   *
   * @param {Vec2} v the input vector
   * @returns the evaluation
   */
  static none (v = new Vec2()) {

    return (v.y === 0.0) &&
      (v.x === 0.0);
  }

  /**
   * Divides a vector by its magnitude, such that the new magnitude is 1.0. The
   * result is a unit vector, as it lies on the circumference of a unit circle.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the normalized vector
   */
  static normalize (
    v = new Vec2(),
    target = new Vec2()) {

    const mSq = Vec2.magSq(v);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv);
  }

  /**
   * Evaluates a vector like a boolean, where n != 0.0 is true.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   */
  static not (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      v.x !== 0.0 ? 0.0 : 1.0,
      v.y !== 0.0 ? 0.0 : 1.0);
  }

  /**
   * Returns a vector with both components set to one.
   *
   * @param {Vec2} target the output vector
   * @returns one
   */
  static one (target = new Vec2()) {

    return target.setComponents(1.0, 1.0);
  }

  /**
   * Evaluates two vectors like booleans, using the
   * OR logic gate.
   * 
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   */
  static or (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Boolean(a.x) | Boolean(b.x),
      Boolean(a.y) | Boolean(b.y));
  }

  /**
   * Finds the perpendicular of a vector in the counter-clockwise direction,
   * such that
   *
   * perp ( right ) = forward, perp ( 1.0, 0.0 ) = ( 0.0, 1.0 )
   *
   * perp ( forward ) = left, perp ( 0.0, 1.0 ) = ( -1.0, 0.0 )
   *
   * perp ( left ) = back, perp ( -1.0, 0.0 ) = ( 0.0, -1.0 )
   *
   * perp ( back ) = right, perp ( 0.0, -1.0 ) = ( 1.0, 0.0 )
   *
   * In terms of the components, perp ( x, y ) = ( -y, x ) .
   *
   * @param {Vec2} v the vector
   * @param {Vec2} target the output vector
   * @returns the perpendicular
   */
  static perpendicularCCW (
    v = new Vec2(1.0, 0.0),
    target = new Vec2()) {

    return target.setComponents(-v.y, v.x);
  }

  /**
   * Finds the perpendicular of a vector in the clockwise direction, such that
   *
   * perp ( right ) = back, perp( 1.0, 0.0 ) = ( 0.0, -1.0 )
   *
   * perp ( back ) = left, perp( 0.0, -1.0 ) = ( -1.0, 0.0 )
   *
   * perp ( left ) = forward, perp( -1.0, 0.0 ) = ( 0.0, 1.0 )
   *
   * perp ( forward ) = right, perp( 0.0, 1.0 ) = ( 1.0, 0.0 )
   *
   * In terms of the components, perp ( x, y ) = ( y, -x ) .
   *
   * @param {Vec2} v the vector
   * @param {Vec2} target the output vector
   * @returns the perpendicular
   */
  static perpendicularCW (
    v = new Vec2(1.0, 0.0),
    target = new Vec2()) {

    return target.setComponents(v.y, -v.x);
  }

  /**
   * Raises a vector to the power of another vector.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the result
   */
  static pow (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.pow(a.x, b.x),
      Math.pow(a.y, b.y));
  }

  /**
   * Returns the scalar projection of a onto b .
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @returns the scalar projection
   */
  static projectScalar (
    a = new Vec2(),
    b = new Vec2()) {

    const bSq = Vec2.magSq(b);
    if (bSq !== 0.0) {
      return Vec2.dot(a, b) / bSq;
    }
    return 0.0;
  }

  /**
   * Projects one vector onto another. Defined as
   *
   * proj ( a, b ) := b ( dot ( a, b ) / dot ( b, b ) )
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the projection
   */
  static projectVector (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return Vec2.scale(b, Vec2.projectScalar(a, b), target);
  }

  /**
   * Reduces the signal, or granularity, of a vector's components. Any level
   * less than 2 returns the target set to the input.
   *
   * @param {Vec2} v the input vector
   * @param {number} levels the levels
   * @param {Vec2} target the output vector
   * @returns the quantized vector
   */
  static quantize (
    v = new Vec2(),
    levels = 8,
    target = new Vec2()) {

    if (levels < 2) {
      return Vec2.fromSource(v, target);
    }

    const delta = 1.0 / levels;
    return target.setComponents(
      delta * Math.floor(0.5 + v.x * levels),
      delta * Math.floor(0.5 + v.y * levels));
  }

  /**
   * Creates a random point in the Cartesian coordinate system given a lower and
   * an upper bound.
   *
   * @param {Vec2} lb the lower bound
   * @param {Vec2} ub the upper bound
   * @param {Vec2} target the output vector
   * @returns the random vector
   */
  static randomCartesian (
    lb = new Vec2(-1.0, -1.0),
    ub = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    const xFac = Math.random();
    const yFac = Math.random();

    return target.setComponents(
      (1.0 - xFac) * lb.x + xFac * ub.x,
      (1.0 - yFac) * lb.y + yFac * ub.y);
  }

  /**
   *  Creates a vector with a magnitude at a random heading.
   *
   * @param {number} rhoMin the minimum radius
   * @param {number} rhoMax the maximum radius
   * @param {Vec2} target  the output vector
   * @returns the random vector
   */
  static randomPolar (
    rhoMin = 1.0,
    rhoMax = 1.0,
    target = new Vec2()) {

    const tFac = Math.random();
    const rFac = Math.random();

    return Vec2.fromPolar(
      (1.0 - tFac) * -3.141592653589793 + tFac * 3.141592653589793,
      (1.0 - rFac) * rhoMin + rFac * rhoMax,
      target);
  }

  /**
   * Reflects an incident vector off a normal vector.
   *
   * @param {Vec2} incident the incident vector
   * @param {Vec2} normal the normal vector
   * @param {Vec2} target the output vector
   * @returns the reflected vector
   */
  static reflect (
    incident = new Vec2(),
    normal = new Vec2(),
    target = new Vec2()) {

    const nMSq = Vec2.magSq(normal);
    if (nMSq === 0.0) { return target.reset(); }

    const mInv = 1.0 / Math.sqrt(nMSq);
    const nx = normal.x * mInv;
    const ny = normal.y * mInv;

    const scalar = 2.0 *
      (nx * incident.x +
        ny * incident.y);

    return target.set(
      incident.x - scalar * nx,
      incident.y - scalar * ny);
  }

  /**
   * Refracts a vector through a volume using Snell's law.
   *
   * @param {Vec2} incident the incident vector
   * @param {Vec2} normal the normal vector
   * @param {number} eta ratio of refraction indices
   * @param {Vec2} target the output vector
   * @returns the refraction
   */
  static refract (
    incident = new Vec2(),
    normal = new Vec2(),
    eta = 0.0,
    target = new Vec2()) {

    const nDotI = Vec2.dot(normal, incident);
    const k = 1.0 - eta * eta * (1.0 - nDotI * nDotI);
    if (k < 0.0) { return target.reset(); }
    const scalar = eta * nDotI + Math.sqrt(k);
    return target.setComponents(
      eta * incident.x - scalar * normal.x,
      eta * incident.y - scalar * normal.y);
  }

  /**
   * Normalizes a vector, then multiplies it by a scalar, in effect setting its
   * magnitude to that scalar.
   *
   * @param {Vec2} v the input vector 
   * @param {number} scalar the new scale
   * @param {Vec2} target the output vector 
   */
  static rescale (
    v = new Vec2(),
    scalar = 1.0,
    target = new Vec2()) {

    const mSq = Vec2.magSq(v);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = scalar / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv);
  }

  /**
   * Returns to a vector with a positive value on the x axis, (1.0, 0.0) .
   *
   * @param {Vec2} target the output vector
   * @returns right
   */
  static right (target = new Vec2()) {

    return target.setComponents(1.0, 0.0);
  }

  /**
   * Rotates a vector around the z axis by an angle in radians.
   *
   * @param {Vec2} v the input vector
   * @param {number} radians the angle in radians
   * @param {Vec2} target the output vector
   * @returns the rotated vector
   */
  static rotateZ (
    v = new Vec2(1.0, 0.0),
    radians = 0.0,
    target = new Vec2()) {

    return Vec2.rotateZInternal(
      v,
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  /**
   * Rotates a vector around the z axis. Accepts pre-calculated sine and cosine
   * of an angle, so that collections of vectors can be efficiently rotated
   * without repeatedly calling cos and sin.
   *
   * @param {Vec2} v the vector
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec2} target the output vector
   * @returns the rotated vector
   */
  static rotateZInternal (
    v = new Vec2(1.0, 0.0),
    cosa = 1.0,
    sina = 0.0,
    target = new Vec2()) {

    return target.setComponents(
      cosa * v.x - sina * v.y,
      cosa * v.y + sina * v.x);
  }

  /**
   * Rounds each component of the vector to the nearest whole number.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the rounded vector
   */
  static round (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.round(v.x),
      Math.round(v.y));
  }

  /**
   * Multiplies a vector, the left operand, by a scalar, the right operand.
   *
   * @param {Vec2} a the vector
   * @param {number} b the scalar
   * @param {Vec2} target the output vector
   * @returns the scaled vector
   */
  static scale (
    a = new Vec2(),
    b = 1.0,
    target = new Vec2()) {

    return target.setComponents(
      a.x * b,
      a.y * b);
  }

  /**
   * Finds the sign of a vector: -1.0 if negative; 1.0 if positive; 0.0 if
   * neither.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the sign
   */
  static sign (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.sign(v.x),
      Math.sign(v.y));
  }

  /**
   * Eases from the origin to the destination vector by a step, using the
   * formula t t ( 3.0 - 2.0 t ) . When the step is less than zero, returns
   * the origin. When the step is greater than one, returns the destination.
   *
   * @param {Vec2} origin the origin vector
   * @param {Vec2} dest the destination vector
   * @param {number} step the step in [0.0, 1.0]
   * @param {Vec2} target the output vector
   * @returns the eased vector
   */
  static smoothStep (
    origin = new Vec2(0.0, 0.0),
    dest = new Vec2(1.0, 1.0),
    step = 0.5,
    target = new Vec2()) {

    if (step <= 0.0) {
      return Vec2.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec2.fromSource(dest, target);
    }

    return Vec2.lerpUnclamped(origin, dest,
      step * step * (3.0 - (step + step)));
  }

  /**
   * Subtracts the right vector from the left vector.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the difference
   */
  static sub (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      a.x - b.x,
      a.y - b.y);
  }

  /**
   * Subtracts the right from the left vector and then normalizes the
   * difference.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the normalized difference
   */
  static subNorm (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    const dx = a.x - b.x;
    const dy = a.y - b.y;

    const mSq = dx * dx + dy * dy;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv);
  }

  /**
   * Returns an object with the vector's magnitude (rho) and heading (theta).
   *
   * @param {Vec2} v the input vector
   * @returns the polar coordinates
   */
  static toPolar (v = new Vec2(1.0, 0.0)) {

    return {
      rho: Vec2.mag(v),
      theta: Vec2.headingSigned(v)
    };
  }

  /**
   * Truncates each component of the vector.
   *
   * @param {Vec2} v the input vector
   * @param {Vec2} target the output vector
   * @returns the truncation
   */
  static trunc (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.trunc(v.x),
      Math.trunc(v.y));
  }

  /**
   * Returns a vector representing the center of the UV coordinate system, (0.5,
   * 0.5) .
   *
   * @param {Vec2} target the output vector
   * @returns the uv center
   */
  static uvCenter (target = new Vec2()) {

    return target.setComponents(0.5, 0.5);
  }

  /**
   * Evaluates two vectors like booleans, using the
   * exclusive or (XOR) logic gate.
   *
   * @param {Vec2} a the left operand
   * @param {Vec2} b the right operand
   * @param {Vec2} target the output vector
   * @returns the evaluation
   */
  static xor (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Boolean(a.x) ^ Boolean(b.x),
      Boolean(a.y) ^ Boolean(b.y));
  }

  /**
   * Returns a vector with all components set to zero.
   *
   * @param {Vec2} target the output vector
   * @returns the zero vector
   */
  static zero (target = new Vec2()) {

    return target.setComponents(0.0, 0.0);
  }

}

/* Aliases. */
Vec2.compare = Vec2.compareYx;
Vec2.dist = Vec2.distEuclidean;
Vec2.heading = Vec2.headingSigned;
Vec2.perpendicular = Vec2.perpendicularCCW;
Vec2.project = Vec2.projectVector;
Vec2.random = Vec2.randomPolar;