'use strict';

class Vec3 {

  constructor (x = 0.0, y = 0.0, z = 0.0) {

    this._x = x;
    this._y = y;
    this._z = z;
  }

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

  reset () {

    this._x = 0.0;
    this._y = 0.0;
    this._z = 0.0;

    return this;
  }

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

  setComponents (x = 0.0, y = 0.0, z = 0.0) {

    this._x = x;
    this._y = y;
    this._z = z;

    return this;
  }

  toArray () {

    return [this._x, this._y, this._z];
  }

  toObject () {

    return { x: this._x, y: this._y, z: this._z };
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
      ' }'
    ].join('');
  }

  static abs (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.abs(v.x),
      Math.abs(v.y),
      Math.abs(v.z));
  }

  static add (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x + b.x,
      a.y + b.y,
      a.z + b.z);
  }

  static addNorm (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    const dx = a.x + b.x;
    const dy = a.y + b.y;
    const dz = a.z + b.z;

    const mSq = dx * dx + dy * dy + dz * dz;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv,
      dz * mInv);
  }

  static angleBetween (
    a = new Vec3(),
    b = new Vec3()) {

    if (Vec3.isZero(a) || Vec3.isZero(b)) {
      return 0.0;
    }

    return Math.acos(Vec3.dot(a, b) / (Vec3.mag(a) * Vec3.mag(b)));
  }

  static approx (
    a = new Vec3(),
    b = new Vec3(),
    tolerance = 0.000001) {

    return Math.abs(b.z - a.z) < tolerance &&
      Math.abs(b.y - a.y) < tolerance &&
      Math.abs(b.x - a.x) < tolerance;
  }

  static approxMag (
    a = new Vec3(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Vec3.magSq(a)) < tolerance;
  }

  static areParallel (
    a = new Vec3(),
    b = new Vec3()) {

    return ((a.y * b.z - a.z * b.y) === 0.0) &&
      ((a.z * b.x - a.x * b.z) === 0.0) &&
      ((a.x * b.y - a.y * b.x) === 0.0);
  }

  static azimuthSigned (v = new Vec3(1.0, 0.0, 0.0)) {

    return Math.atan2(v.y, v.x);
  }

  static azimuthUnsigned (v = new Vec3(1.0, 0.0, 0.0)) {

    const angle = Vec3.azimuthSigned(v);
    return angle - 6.283185307179586 * Math.floor(angle * 0.15915494309189535);
  }

  static back (target = new Vec3()) {

    return target.setComponents(0.0, -1.0, 0.0);
  }

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

  static ceil (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.ceil(v.x),
      Math.ceil(v.y),
      Math.ceil(v.z));
  }

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

  static clamp01 (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.min(Math.max(v.x, 0.0), 1.0),
      Math.min(Math.max(v.y, 0.0), 1.0),
      Math.min(Math.max(v.z, 0.0), 1.0));
  }

  static compareMag (
    a = new Vec2(),
    b = new Vec2()) {

    const aMag = Vec3.magSq(a);
    const bMag = Vec3.magSq(b);

    if (aMag > bMag) { return 1; }
    if (aMag < bMag) { return -1; }

    return 0;
  }

  static compareZyx (
    a = new Vec3(),
    b = new Vec3()) {

    if (a.z > b.z) { return 1; }
    if (a.z < b.z) { return -1; }
    if (a.y > b.y) { return 1; }
    if (a.y < b.y) { return -1; }
    if (a.x > b.x) { return 1; }
    if (a.x < b.x) { return -1; }

    return 0;
  }

  static copySign (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x * Math.sign(b.x),
      a.y * Math.sign(b.y),
      a.z * Math.sign(b.z));
  }

  static cross (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x);
  }

  static crossNorm (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    const cx = a.y * b.z - a.z * b.y;
    const cy = a.z * b.x - a.x * b.z;
    const cz = a.x * b.y - a.y * b.x;

    const mSq = cx * cx + cy * cy + cz * cz;
    if (mSq === 0.0) { return target.reset(); }
    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      cx * mInv,
      cy * mInv,
      cz * mInv);
  }

  static diff (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z));
  }

  static distChebyshev (
    a = new Vec3(),
    b = new Vec3()) {

    return Math.max(
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
      Math.abs(b.z - a.z));
  }

  static distEuclidean (
    a = new Vec3(),
    b = new Vec3()) {

    return Math.hypot(
      b.x - a.x,
      b.y - a.y,
      b.z - a.z);
  }

  static distManhattan (
    a = new Vec3(),
    b = new Vec3()) {

    return Math.abs(b.x - a.x) +
      Math.abs(b.y - a.y) +
      Math.abs(b.z - a.z);
  }

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

  static distSq (
    a = new Vec3(),
    b = new Vec3()) {

    const xd = b.x - a.x;
    const yd = b.y - a.y;
    const zd = b.z - a.z;
    return xd * xd + yd * yd + zd * zd;
  }

  static div (
    a = new Vec3(1.0, 1.0, 1.0),
    b = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x / b.x : 0.0,
      b.y !== 0.0 ? a.y / b.y : 0.0,
      b.z !== 0.0 ? a.z / b.z : 0.0);
  }

  static dot (
    a = new Vec3(),
    b = new Vec3()) {

    return a.x * b.x +
      a.y * b.y +
      a.z * b.z;
  }

  static down (target = new Vec3()) {

    return target.setComponents(0.0, 0.0, -1.0);
  }

  static epsilon (target = new Vec3()) {

    return target.setComponents(
      0.000001,
      0.000001,
      0.000001);
  }

  static floor (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.floor(v.x),
      Math.floor(v.y),
      Math.floor(v.z));
  }

  static fmod (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x % b.x : a.x,
      b.y !== 0.0 ? a.y % b.y : a.y,
      b.z !== 0.0 ? a.z % b.z : a.z);
  }

  static forward (target = new Vec3()) {

    return target.setComponents(0.0, 1.0, 0.0);
  }

  static fract (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      v.x - Math.trunc(v.x),
      v.y - Math.trunc(v.y),
      v.z - Math.trunc(v.z));
  }

  static fromArray (
    arr = [0.0, 0.0, 0.0],
    target = new Vec3()) {

    return target.setComponents(
      arr[0],
      arr[1],
      arr[2]);
  }

  static fromPolar (
    azimuth = 0.0,
    radius = 1.0,
    target = new Vec3()) {

    return target.setComponents(
      radius * Math.cos(azimuth),
      radius * Math.sin(azimuth),
      0.0);
  }

  static fromScalar (
    scalar = 1.0,
    target = new Vec3()) {

    return target.setComponents(
      scalar,
      scalar,
      scalar);
  }

  static fromSource (
    source = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      source.x,
      source.y,
      source.z);
  }

  static fromSpherical (
    azimuth = 0.0,
    inclination = 0.0,
    radius = 1.0,
    target = new Vec3()) {

    const rhoCosPhi = radius * Math.cos(inclination);
    return target.setComponents(
      rhoCosPhi * Math.cos(azimuth),
      rhoCosPhi * Math.sin(azimuth),
      radius * -Math.sin(inclination));
  }

  static grid (
    rows = 3,
    cols = 3,
    layers = 3,
    lowerBound = new Vec3(0.0, 0.0, 0.0),
    upperBound = new Vec3(1.0, 1.0, 1.0)) {

    const rval = rows < 3 ? 3 : rows;
    const cval = cols < 3 ? 3 : cols;
    const lval = layers < 3 ? 3 : layers;

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

  static inclinationSigned (v = new Vec3(1.0, 0.0, 0.0)) {

    const mSq = Vec3.magSq(v);
    if (mSq === 0.0) { return 0.0; }
    const radians = v.z / Math.sqrt(mSq);
    return (radians <= -1.0) ? -1.5707963267948966 :
      (radians >= 1.0) ? 1.5707963267948966 :
        Math.asin(radians);
  }

  static inclinationUnsigned (v = new Vec3(1.0, 0.0, 0.0)) {

    const angle = Vec3.inclinationSigned(v);
    return angle - 6.283185307179586 * Math.floor(angle * 0.15915494309189535);
  }

  static isNonZero (v = new Vec3()) {

    return (v.z !== 0.0) &&
      (v.y !== 0.0) &&
      (v.x !== 0.0);
  }

  static isUnit (v = new Vec3()) {

    return Vec3.approxMag(v, 1.0);
  }

  static isZero (v = new Vec3()) {

    return (v.z === 0.0) &&
      (v.y === 0.0) &&
      (v.x === 0.0);
  }

  static left (target = new Vec3()) {

    return target.setComponents(-1.0, 0.0, 0.0);
  }

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

  static mag (v = new Vec3()) {

    return Math.hypot(v.x, v.y, v.z);
  }

  static magSq (v = new Vec3()) {

    return v.x * v.x +
      v.y * v.y +
      v.z * v.z;
  }

  static max (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.max(a.z, b.z));
  }

  static min (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.min(a.z, b.z));
  }

  static mix (
    origin = new Vec3(0.0, 0.0, 0.0),
    dest = new Vec3(1.0, 1.0, 1.0),
    step = 0.5,
    easingFunc = Vec3.lerp,
    target = new Vec3()) {

    return easingFunc(origin, dest, step, target);
  }

  static mod (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      b.x !== 0.0 ? a.x - b.x * Math.floor(a.x / b.x) : a.x,
      b.y !== 0.0 ? a.y - b.y * Math.floor(a.y / b.y) : a.y,
      b.z !== 0.0 ? a.z - b.z * Math.floor(a.z / b.z) : a.z);
  }

  static mod1 (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      v.x - Math.floor(v.x),
      v.y - Math.floor(v.y),
      v.z - Math.floor(v.z));
  }

  static mul (
    a = new Vec3(1.0, 1.0, 1.0),
    b = new Vec3(1.0, 1.0, 1.0),
    target = new Vec3()) {

    return target.setComponents(
      a.x * b.x,
      a.y * b.y,
      a.z * b.z);
  }

  static negate (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(-v.x, -v.y, -v.z);
  }

  static negOne (target = new Vec3()) {

    return target.setComponents(-1.0, -1.0, -1.0);
  }

  static normalize (
    v = new Vec3(),
    target = new Vec3()) {

    const mSq = Vec3.magSq(v);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv,
      v.z * mInv);
  }

  static one (target = new Vec3()) {

    return target.setComponents(1.0, 1.0, 1.0);
  }

  static pow (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.pow(a.x, b.x),
      Math.pow(a.y, b.y),
      Math.pow(a.z, b.z));
  }

  static projectScalar (
    a = new Vec3(),
    b = new Vec3()) {

    const bSq = Vec3.magSq(b);
    if (bSq !== 0.0) {
      return Vec3.dot(a, b) / bSq;
    }
    return 0.0;
  }

  static projectVector (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return Vec3.scale(b, Vec3.projectScalar(a, b), target);
  }

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

  static randomSpherical (target = new Vec3()) {

    // const rx = 2.0 * Math.random() - 1.0;
    // const ry = 2.0 * Math.random() - 1.0;
    // const rz = 2.0 * Math.random() - 1.0;

    // const mSq = rx * rx + ry * ry + rz * rz;
    // if (mSq === 0.0) {
    //   return target.reset();
    // }

    // const mInv = 1.0 / Math.sqrt(mSq);
    // return target.setComponents(
    //   rx * mInv,
    //   ry * mInv,
    //   rz * mInv);

    const tFac = Math.random();
    const pFac = Math.random();

    return Vec3.fromSpherical(
      (1.0 - tFac) * -Math.PI + tFac * Math.PI,
      0.5 * ((1.0 - pFac) * -Math.PI + pFac * Math.PI),
      1.0,
      target);
  }

  static rescale (
    v = new Vec3(),
    scalar = 1.0,
    target = new Vec3()) {

    const mSq = Vec3.magSq(v);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = scalar / Math.sqrt(mSq);
    return target.setComponents(
      v.x * mInv,
      v.y * mInv,
      v.z * mInv);
  }

  static right (target = new Vec3()) {

    return target.setComponents(1.0, 0.0, 0.0);
  }

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

  static round (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.round(v.x),
      Math.round(v.y),
      Math.round(v.z));
  }

  static scale (
    a = new Vec3(),
    b = 1.0,
    target = new Vec3()) {

    return target.setComponents(
      a.x * b,
      a.y * b,
      a.z * b);
  }

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

    return Vec3.lerpUnclamped(origin, dest, step * step * (3.0 - (step + step)));
  }

  static sub (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.x - b.x,
      a.y - b.y,
      a.z - b.z);
  }

  static subNorm (
    a = new Vec3(),
    b = new Vec3(),
    target = new Vec3()) {

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;

    const mSq = dx * dx + dy * dy + dz * dz;
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      dx * mInv,
      dy * mInv,
      dz * mInv);
  }

  static toSpherical (v = new Vec3(1.0, 0.0, 0.0)) {
    const mSq = Vec3.magSq(v);
    if (mSq === 0.0) {
      return { phi: 0.0, rho: 0.0, theta: 0.0 };
    }

    const rho = Math.sqrt(mSq);
    const zNorm = v.z / rho;
    const phi = (zNorm <= -1.0) ? -1.5707963267948966 :
      (zNorm >= 1.0) ? 1.5707963267948966 :
        Math.asin(zNorm);

    return {
      phi: phi,
      rho: rho,
      theta: Vec3.azimuthSigned(v)
    };
  }

  static trunc (
    v = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      Math.trunc(v.x),
      Math.trunc(v.y),
      Math.trunc(v.z));
  }

  static up (target = new Vec3()) {

    return target.setComponents(0.0, 0.0, 1.0);
  }

  static zero (target = new Vec3()) {

    return target.setComponents(0.0, 0.0, 0.0);
  }
}