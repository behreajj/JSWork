'use strict';

class Vec4 {

  constructor (x = 0.0, y = 0.0, z = 0.0, w = 0.0) {

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  get length () {

    return 4;
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

  get w () {

    return this._w;
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

  set w (v) {

    this._w = v;
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

  reset () {

    this._x = 0.0;
    this._y = 0.0;
    this._z = 0.0;
    this._w = 0.0;

    return this;
  }

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

  setComponents (x = 0.0, y = 0.0, z = 0.0, w = 0.0) {

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;

    return this;
  }

  toArray () {

    return [
      this._x,
      this._y,
      this._z,
      this._w];
  }

  toObject () {

    return {
      x: this._x,
      y: this._y,
      z: this._z,
      w: this._w
    };
  }

  toString () {

    const precision = 4;
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

  static abs (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.abs(v.x),
      Math.abs(v.y),
      Math.abs(v.z),
      Math.abs(v.w));
  }

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

  static approx (
    a = new Vec4(),
    b = new Vec4(),
    tolerance = 0.000001) {

    return Math.abs(b.w - a.w) < tolerance &&
      Math.abs(b.z - a.z) < tolerance &&
      Math.abs(b.y - a.y) < tolerance &&
      Math.abs(b.x - a.x) < tolerance;
  }

  static approxMag (
    a = new Vec4(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Vec4.magSq(a)) < tolerance;
  }

  static ceil (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.ceil(v.x),
      Math.ceil(v.y),
      Math.ceil(v.z),
      Math.ceil(v.w));
  }

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

  static clamp01 (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.min(Math.max(v.x, 0.0), 1.0),
      Math.min(Math.max(v.y, 0.0), 1.0),
      Math.min(Math.max(v.z, 0.0), 1.0),
      Math.min(Math.max(v.w, 0.0), 1.0));
  }

  static compareMag (
    a = new Vec4(),
    b = new Vec4()) {

    const aMag = Vec4.magSq(a);
    const bMag = Vec4.magSq(b);

    if (aMag > bMag) { return 1; }
    if (aMag < bMag) { return -1; }

    return 0;
  }

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

  static copySign (
    a = new Vec4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.x * Math.sign(b.x),
      a.y * Math.sign(b.y),
      a.z * Math.sign(b.z),
      a.w * Math.sign(b.w));
  }

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

  static distChebyshev (
    a = new Vec4(),
    b = new Vec4()) {

    return Math.max(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z),
      Math.abs(b.w - a.w));
  }

  static distEuclidean (
    a = new Vec4(),
    b = new Vec4()) {

    return Math.hypot(
      b.x - a.x,
      b.y - a.y,
      b.z - a.z,
      b.w - a.w);
  }

  static distManhattan (
    a = new Vec4(),
    b = new Vec4()) {

    return Math.abs(b.x - a.x) +
      Math.abs(b.y - a.y) +
      Math.abs(b.z - a.z) +
      Math.abs(b.w - a.w);
  }

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

  static dot (
    a = new Vec4(),
    b = new Vec4()) {

    return a.x * b.x +
      a.y * b.y +
      a.z * b.z +
      a.w * b.w;
  }

  static epsilon (target = new Vec4()) {

    return target.setComponents(
      0.000001,
      0.000001,
      0.000001,
      0.000001);
  }

  static floor (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.floor(v.x),
      Math.floor(v.y),
      Math.floor(v.z),
      Math.floor(v.w));
  }

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

  static fract (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      v.x - Math.trunc(v.x),
      v.y - Math.trunc(v.y),
      v.z - Math.trunc(v.z),
      v.w - Math.trunc(v.w));
  }

  static fromArray (
    arr = [0.0, 0.0, 0.0, 0.0],
    target = new Vec4()) {

    return target.setComponents(
      arr[0],
      arr[1],
      arr[2],
      arr[3]);
  }

  static fromScalar (
    scalar = 1.0,
    target = new Vec4()) {

    return target.setComponents(
      scalar,
      scalar,
      scalar,
      scalar);
  }

  static fromSource (
    source = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      source.x,
      source.y,
      source.z,
      source.w);
  }

  static isNonZero (v = new Vec4()) {

    return (v.w !== 0.0) &&
      (v.z !== 0.0) &&
      (v.y !== 0.0) &&
      (v.x !== 0.0);
  }

  static isUnit (v = new Vec4()) {

    return Vec3.approxMag(v, 1.0);
  }

  static isZero (v = new Vec4()) {

    return (v.w === 0.0) &&
      (v.z === 0.0) &&
      (v.y === 0.0) &&
      (v.x === 0.0);
  }

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

  static mag (v = new Vec4()) {

    return Math.hypot(v.x, v.y, v.z, v.w);
  }

  static magSq (v = new Vec4()) {

    return v.x * v.x +
      v.y * v.y +
      v.z * v.z +
      v.w * v.w;
  }

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

  static mix (
    origin = new Vec4(0.0, 0.0, 0.0, 0.0),
    dest = new Vec4(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    easingFunc = Vec4.lerp,
    target = new Vec4()) {

    return easingFunc(origin, dest, step, target);
  }

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

  static mod1 (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      v.x - Math.floor(v.x),
      v.y - Math.floor(v.y),
      v.z - Math.floor(v.z),
      v.w - Math.floor(v.w));
  }

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

  static negate (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(-v.x, -v.y, -v.z, -v.w);
  }

  static negOne (target = new Vec4()) {

    return target.setComponents(-1.0, -1.0, -1.0, -1.0);
  }

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

  static one (target = new Vec4()) {

    return target.setComponents(1.0, 1.0, 1.0, 1.0);
  }

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

  static randomSpherical (target = new Vec4()) {

    const rx = 2.0 * Math.random() - 1.0;
    const ry = 2.0 * Math.random() - 1.0;
    const rz = 2.0 * Math.random() - 1.0;
    const rw = 2.0 * Math.random() - 1.0;

    const mSq = rx * rx + ry * ry + rz * rz + rw * rw;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      rx * mInv,
      ry * mInv,
      rz * mInv,
      rw * mInv);
  }

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

  static round (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.round(v.x),
      Math.round(v.y),
      Math.round(v.z),
      Math.round(v.w));
  }

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

  static smoothStep (
    origin = new Vec4(0.0, 0.0, 0.0, 0.0),
    dest = new Vec4(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    target = new Vec4()) {

    if (step <= 0.0) {
      return Vec3.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Vec3.fromSource(dest, target);
    }

    return Vec4.lerpUnclamped(origin, dest,
      step * step * (3.0 - (step + step)));
  }

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

  static trunc (
    v = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      Math.trunc(v.x),
      Math.trunc(v.y),
      Math.trunc(v.z),
      Math.trunc(v.w));
  }

  static zero (target = new Vec4()) {

    return target.setComponents(0.0, 0.0, 0.0, 0.0);
  }
}