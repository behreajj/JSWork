'use strict';

class Vec2 {

  constructor (x = 0.0, y = 0.0) {
    this._x = x;
    this._y = y;
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

  // [Symbol.iterator] () {

  //   let index = 0;
  //   const data = this.toArray();
  //   const len = data.length;

  //   return {
  //     next: function () {
  //       return { value: data[index++], done: index > len };
  //     }
  //   };
  // }

  [Symbol.iterator] () {

    let index = 0;
    return {
      next: () => {
        return {
          value: this.get(index++),
          done: index > 2
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

  reset () {

    this._x = 0.0;
    this._y = 0.0;

    return this;
  }

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

  setComponents (x = 0.0, y = 0.0) {

    this._x = x;
    this._y = y;

    return this;
  }

  toArray () {

    return [this._x, this._y];
  }

  toObject () {

    return { x: this._x, y: this._y };
  }

  toString () {

    const precision = 4;
    return [
      '{ x: ',
      this._x.toFixed(precision),
      ', y: ',
      this._y.toFixed(precision),
      ' }'
    ].join('');
  }

  static abs (
    v = new Vec2(),
    target = new Vec3()) {

    return target.setComponents(
      Math.abs(v.x),
      Math.abs(v.y));
  }

  static add (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec3()) {

    return target.setComponents(
      a.x + b.x,
      a.y + b.y);
  }

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

  static angleBetween (
    a = new Vec2(),
    b = new Vec2()) {

    if (Vec2.isZero(a) || Vec2.isZero(b)) {
      return 0.0;
    }

    return Math.acos(Vec2.dot(a, b) / (Vec2.mag(a) * Vec2.mag(b)));
  }

  static approx (
    a = new Vec2(),
    b = new Vec2(),
    tolerance = 0.000001) {

    return Math.abs(b.y - a.y) < tolerance &&
      Math.abs(b.x - a.x) < tolerance;
  }

  static approxMag (
    a = new Vec2(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Vec2.magSq(a)) < tolerance;
  }

  static areParallel (a = new Vec2(), b = new Vec2()) {

    return (a.x * b.y - a.y * b.x) === 0.0;
  }

  static back (target = new Vec2()) {

    return target.setComponents(0.0, -1.0);
  }

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

  static ceil (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.ceil(v.x),
      Math.ceil(v.y));
  }

  static clamp (
    v = new Vec2(),
    lb = new Vec2(0.0, 0.0),
    ub = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      Math.min(Math.max(v.x, lb.x), ub.x),
      Math.min(Math.max(v.y, lb.y), ub.y));
  }

  static clamp01 (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.min(Math.max(v.x, 0.0), 1.0),
      Math.min(Math.max(v.y, 0.0), 1.0));
  }

  static compareMag (
    a = new Vec2(),
    b = new Vec2()) {

    const aMag = Vec2.magSq(a);
    const bMag = Vec2.magSq(b);

    if (aMag > bMag) { return 1; }
    if (aMag < bMag) { return -1; }

    return 0;
  }

  static compareYx (
    a = new Vec2(),
    b = new Vec2()) {

    if (a.y > b.y) { return 1; }
    if (a.y < b.y) { return -1; }
    if (a.x > b.x) { return 1; }
    if (a.x < b.x) { return -1; }

    return 0;
  }

  static copySign (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      a.x * Math.sign(b.x),
      a.y * Math.sign(b.y));
  }

  static diff (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y));
  }

  static distChebyshev (
    a = new Vec2(),
    b = new Vec2()) {

    return Math.max(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y));
  }

  static distEuclidean (
    a = new Vec2(),
    b = new Vec2()) {

    return Math.hypot(
      b.x - a.x,
      b.y - a.y);
  }

  static distManhattan (
    a = new Vec2(),
    b = new Vec2()) {

    return Math.abs(b.x - a.x) +
      Math.abs(b.y - a.y);
  }

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

  static distSq (
    a = new Vec2(),
    b = new Vec2()) {

    const xd = b.x - a.x;
    const yd = b.y - a.y;
    return xd * xd + yd * yd;
  }

  static div (
    a = new Vec2(1.0, 1.0),
    b = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x / b.x : 0.0,
      b.y !== 0.0 ? a.y / b.y : 0.0);
  }

  static dot (
    a = new Vec2(),
    b = new Vec2()) {

    return a.x * b.x + a.y * b.y;
  }

  static epsilon (target = new Vec2()) {

    return target.setComponents(
      0.000001,
      0.000001);
  }

  static floor (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.floor(v.x),
      Math.floor(v.y));
  }

  static fmod (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x % b.x : a.x,
      b.y !== 0.0 ? a.y % b.y : a.y);
  }

  static forward (target = new Vec2()) {

    return target.setComponents(0.0, 1.0);
  }

  static fract (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      v.x - Math.trunc(v.x),
      v.y - Math.trunc(v.y));
  }

  static fromArray (
    arr = [0.0, 0.0],
    target = new Vec2()) {

    return target.setComponents(
      arr[0],
      arr[1]);
  }

  static fromPolar (
    azimuth = 0.0,
    radius = 1.0,
    target = new Vec2()) {

    return target.setComponents(
      radius * Math.cos(azimuth),
      radius * Math.sin(azimuth));
  }

  static fromScalar (
    scalar = 1.0,
    target = new Vec2()) {

    return target.setComponents(
      scalar,
      scalar);
  }

  static fromSource (
    source = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      source.x,
      source.y);
  }

  static grid (
    rows = 3,
    cols = 3,
    lowerBound = new Vec2(0.0, 0.0),
    upperBound = new Vec2(1.0, 1.0)) {

    const rval = rows < 3 ? 3 : rows;
    const cval = cols < 3 ? 3 : cols;

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
      row = [];
      const yPrc = i * iToStep;
      const y = (1.0 - yPrc) * lowerBound.y +
        yPrc * upperBound.y;
      for (let j = 0; j < cval; ++j) {
        row.push(new Vec2(xs[j], y));
      }
      result.append(row);
    }

    return result;
  }

  static headingSigned (v = new Vec2(1.0, 0.0)) {

    return Math.atan2(v.y, v.z);
  }

  static headingUnsigned (v = new Vec2(1.0, 0.0)) {

    const angle = Vec2.headingSigned(v);
    return angle - 6.283185307179586 * Math.floor(angle * 0.15915494309189535);
  }

  static isNonZero (v = new Vec2()) {

    return (v.y !== 0.0) &&
      (v.x !== 0.0);
  }

  static isUnit (v = new Vec2()) {

    return Vec2.approxMag(v, 1.0);
  }

  static isZero (v = new Vec2()) {

    return (v.y === 0.0) &&
      (v.x === 0.0);
  }

  static left (target = new Vec2()) {

    return target.setComponents(-1.0, 0.0);
  }

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

  static mag (v = new Vec2()) {

    return Math.hypot(v.x, v.y);
  }

  static magSq (v = new Vec2()) {

    return v.x * v.x + v.y * v.y;
  }

  static max (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y));
  }

  static min (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y));
  }

  static mix (
    origin = new Vec2(0.0, 0.0),
    dest = new Vec2(1.0, 1.0),
    step = 0.5,
    easingFunc = Vec2.lerp,
    target = new Vec2()) {

    return easingFunc(origin, dest, step, target);
  }

  static mod (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x - b.x * Math.floor(a.x / b.x) : a.x,
      b.y !== 0.0 ? a.y - b.y * Math.floor(a.y / b.y) : a.y);
  }

  static mod1 (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      v.x - Math.floor(v.x),
      v.y - Math.floor(v.y));
  }

  static mul (
    a = new Vec2(1.0, 1.0),
    b = new Vec2(1.0, 1.0),
    target = new Vec2()) {

    return target.setComponents(
      a.x * b.x,
      a.y * b.y);
  }

  static negate (
    v = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(-v.x, -v.y);
  }

  static negOne (target = new Vec2()) {

    return target.setComponents(-1.0, -1.0);
  }

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

  static one (target = new Vec2()) {

    return target.setComponents(1.0, 1.0);
  }

  static perpendicularCCW (
    v = new Vec2(1.0, 0.0),
    target = new Vec2()) {

    return target.setComponents(-v.y, v.x);
  }

  static perpendicularCW (
    v = new Vec2(1.0, 0.0),
    target = new Vec2()) {

    return target.setComponents(v.y, -v.x);
  }

  static pow (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return target.setComponents(
      Math.pow(a.x, b.x),
      Math.pow(a.y, b.y));
  }

  static projectScalar (
    a = new Vec2(),
    b = new Vec2()) {

    const bSq = Vec2.magSq(b);
    if (bSq !== 0.0) {
      return Vec2.dot(a, b) / bSq;
    }
    return 0.0;
  }

  static projectVector (
    a = new Vec2(),
    b = new Vec2(),
    target = new Vec2()) {

    return Vec2.scale(b, Vec2.projectScalar(a, b), target);
  }

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

  static randomPolar (target = new Vec2()) {

    // const rx = 2.0 * Math.random() - 1.0;
    // const ry = 2.0 * Math.random() - 1.0;

    // const mSq = rx * rx + ry * ry;
    // if (mSq === 0.0) {
    //   return target.reset();
    // }

    // const mInv = 1.0 / Math.sqrt(mSq);
    // return target.setComponents(
    //   rx * mInv,
    //   ry * mInv);

    const tFac = Math.random();

    return Vec2.fromPolar(
      (1.0 - tFac) * -Math.PI + tFac * Math.PI,
      1.0,
      target);
  }

  /**
   * Normalizes a vector, then multiplies it by a scalar, in effect setting its magnitude to that scalar.
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
   * Rotates a vector around the z axis. Accepts pre-calculated sine and cosine of an angle, so that collections of vectors can be efficiently rotated without repeatedly calling cos and sin.
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
   * Eases from the origin to the destination vector by a step, using the formula t\u00b2 ( 3.0 - 2.0 t ) . When the step is less than zero, returns the origin. When the step is greater than one, returns the destination.
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
   * Subtracts the right from the left vector and then normalizes the difference.
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
   * Returns a vector representing the center of the UV coordinate system, (0.5, 0.5) .
   * 
   * @param {Vec2} target the output vector
   * @returns the uv center
   */
  static uvCenter (target = new Vec2()) {
    return target.setComponents(0.5, 0.5);
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