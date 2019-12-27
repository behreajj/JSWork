'use strict';

class Quaternion {

  constructor (real = 1.0, imag = new Vec3()) {

    this._real = real;
    this._imag = imag;
  }

  get imag () {

    return this._imag;
  }

  get length () {

    return 4;
  }

  get real () {

    return this._real;
  }

  get w () {

    return this._real;
  }

  get x () {

    return this._imag.x;
  }

  get y () {

    return this._imag.y;
  }

  get z () {

    return this._imag.z;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set imag (v) {

    this._imag = v;
  }

  set real (v) {

    this._real = v;
  }

  set w (v) {

    this._real = v;
  }

  set x (v) {

    this._imag.x = v;
  }

  set y (v) {

    this._imag.y = v;
  }

  set z (v) {

    this._imag.z = v;
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
        return Quaternion.mag(this);
    }
  }

  get (i = -1) {

    switch (i) {
      case 0: case -4:
        return this._real;
      case 1: case -3:
        return this._imag.x;
      case 2: case -2:
        return this._imag.y;
      case 3: case -1:
        return this._imag.z;
      default:
        return 0.0;
    }
  }

  reset () {

    this._real = 1.0;
    this._imag.reset();

    return this;
  }

  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -4:
        this._real = v;
        break;
      case 1: case -3:
        this._imag.x = v;
        break;
      case 2: case -2:
        this._imag.y = v;
        break;
      case 3: case -1:
        this._imag.z = v;
        break;
    }
    return this;
  }

  setComponents (w = 1.0, x = 0.0, y = 0.0, z = 0.0) {

    this._real = w;
    this._imag.setComponents(x, y, z);

    return this;
  }

  toArray () {

    const i = this._imag;
    return [this._real, i.x, i.y, i.z];
  }

  toJsonString (precision = 6) {

    return [
      '{\"real\":',
      this._real.toFixed(precision),
      ',\"imag\":',
      this._imag.toJsonString(precision),
      '}'
    ].join('');
  }

  toObject () {

    return {
      real: this._real,
      imag: this._imag.toObject()
    };
  }

  toString (precision = 4) {

    return [
      '{ real: ',
      this._real.toFixed(precision),
      ', imag: ',
      this._imag.toString(precision),
      ' }'
    ].join('');
  }

  static add (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real + b.real;
    Vec3.add(a.imag, b.imag, target.imag);
    return target;
  }

  static addNorm (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real + b.real;
    Vec3.add(a.imag, b.imag, target.imag);

    const mSq = Quaternion.magSq(target);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    const i = target.imag;
    return target.setComponents(
      target.real * mInv,
      i.x * mInv,
      i.y * mInv,
      i.z * mInv);
  }

  static applyTo (
    q = new Quaternion(),
    v = new Vec3(),
    target = new Vec3()) {

    const w = q.real;
    const i = q.imag;

    const qx = i.x;
    const qy = i.y;
    const qz = i.z;

    const iw = -qx * v.x - qy * v.y - qz * v.z;
    const ix = w * v.x + qy * v.z - qz * v.y;
    const iy = w * v.y + qz * v.x - qx * v.z;
    const iz = w * v.z + qx * v.y - qy * v.x;

    return target.setComponents(
      ix * w + iz * qy - iw * qx - iy * qz,
      iy * w + ix * qz - iw * qy - iz * qx,
      iz * w + iy * qx - iw * qz - ix * qy);
  }

  static approx (
    a = new Quaternion(),
    b = new Quaternion(),
    tolerance = 0.000001) {

    return Math.abs(b.y - a.y) < tolerance &&
      Vec3.approx(a, b, tolerance);
  }

  static approxMag (
    a = new Quaternion(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Quaternion.magSq(a)) < tolerance;
  }

  static compareWzyx (
    a = new Quaternion(),
    b = new Quaternion()) {

    if (a.real > b.real) { return 1; }
    if (a.real < b.real) { return -1; }

    const ai = a.imag;
    const bi = b.imag;

    if (ai.z > bi.z) { return 1; }
    if (ai.z < bi.z) { return -1; }
    if (ai.y > bi.y) { return 1; }
    if (ai.y < bi.y) { return -1; }
    if (ai.x > bi.x) { return 1; }
    if (ai.x < bi.x) { return -1; }

    return 0;
  }

  static conj (
    q = new Quaternion(),
    target = new Quaternion()) {

    target.real = q.real;
    Vec3.negate(q.imag, target.imag);
    return target;
  }

  static div (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    const bi = b.imag;
    const bw = b.real;
    const bx = bi.x;
    const by = bi.y;
    const bz = bi.z;

    const bmSq = bw * bw + bx * bx + by * by + bz * bz;

    if (bmSq === 0.0) {
      return target.reset();
    }

    const bwInv = bw;
    const bxInv = -bx;
    const byInv = -by;
    const bzInv = -bz;

    if (Math.abs(1.0 - bmSq) > 0.000001) {
      const bmSqInv = 1.0 / bmSq;
      bwInv *= bmSqInv;
      bxInv *= bmSqInv;
      byInv *= bmSqInv;
      bzInv *= bmSqInv;
    }

    const aw = a.real;
    const ai = a.imag;
    return target.setComponents(
      aw * bwInv - ai.x * bxInv - ai.y * byInv - ai.z * bzInv,
      ai.x * bwInv + aw * bxInv + ai.y * bzInv - ai.z * byInv,
      ai.y * bwInv + aw * byInv + ai.z * bxInv - ai.x * bzInv,
      ai.z * bwInv + aw * bzInv + ai.x * byInv - ai.y * bxInv);
  }

  static dot (
    a = new Quaternion(),
    b = new Quaternion()) {

    return a.real * b.real + Vec3.dot(a.imag, b.imag);
  }

  static exp (
    q = new Quaternion(),
    target = new Quaternion()) {

    const ea = Math.exp(q.real);
    const imSq = Vec3.mag(q.imag);
    if (imSq === 0.0) {
      Vec3.zero(target.imag);
      target.real = ea;
      return target;
    }

    const im = Math.sqrt(imSq);
    target.real = ea * Math.cos(im);
    Vec3.mul(
      q.imag,
      ea * Math.sin(im) / im,
      target.imag);

    return target;
  }

  static fromArray (
    arr = [1.0, 0.0, 0.0, 0.0],
    target = new Quaternion()) {

    return target.setComponents(
      arr[0],
      arr[1],
      arr[2],
      arr[3]);
  }

  static fromAxisAngle (
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0),
    target = new Quaternion()) {

    const amSq = Vec3.magSq(axis);
    if (amSq === 0.0) {
      return target.reset();
    }

    let nx = axis.x;
    let ny = axis.y;
    let nz = axis.z;

    if (Math.abs(1.0 - amSq) > 0.000001) {
      const amInv = 1.0 / Math.sqrt(amSq);
      nx *= amInv;
      ny *= amInv;
      nz *= amInv;
    }

    const halfAngle = 0.5 * radians;
    const sinHalf = Math.sin(halfAngle);
    return target.setComponents(
      Math.cos(halfAngle),
      nx * sinHalf,
      ny * sinHalf,
      nz * sinHalf);
  }

  static fromSource (
    source = new Quaternion(),
    target = new Quaternion()) {

    Vec3.fromSource(
      source.imag,
      target.imag);
    target.real = source.real;
    return target;
  }

  static identity (target = new Quaternion()) {

    return target.setComponents(1.0, 0.0, 0.0, 0.0);
  }

  static inverse (
    q = new Quaternion(),
    target = new Quaternion()) {

    const mSq = Quaternion.magSq(quat);
    if (mSq === 0.0) {
      return target.reset();
    }

    const i = quat.imag;
    if (mSq === 1.0) {
      return target.setComponents(
        q.real, -i.x, -i.y, -i.z);
    }

    const mSqInv = 1.0 / mSq;
    return target.setComponents(
      q.real * mSqInv,
      -i.x * mSqInv,
      -i.y * mSqInv,
      -i.z * mSqInv);
  }

  static isPure (q = new Quaternion()) {

    return q.real === 0.0;
  }

  static isUnit (q = new Quaternion()) {

    return Quaternion.approxMag(q, 1.0);
  }

  static isZero (q = new Quaternion()) {

    return q.real === 0.0 && Vec3.isZero(q.imag);
  }

  static mag (q = new Quaternion()) {

    const i = q.imag;
    return Math.hypot(q.real, i.x, i.y, i.z);
  }

  static magSq (q = new Quaternion()) {

    return q.real * q.real + Vec3.magSq(q.imag);
  }

  static mul (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    const ai = a.imag;
    const bi = b.imag;
    const aw = a.real;
    const bw = b.real;

    return target.setComponents(
      aw * bw - (ai.x * bi.x + ai.y * bi.y + ai.z * bi.z),
      ai.x * bw + aw * bi.x + ai.y * bi.z - ai.z * bi.y,
      ai.y * bw + aw * bi.y + ai.z * bi.x - ai.x * bi.z,
      ai.z * bw + aw * bi.z + ai.x * bi.y - ai.y * bi.x);
  }

  static normalize (
    q = Quaternion(),
    target = new Quaternion()) {

    const mSq = Quaternion.magSq(q);
    if (mSq === 0.0) {
      return Quaternion.identity(target);
    }
    if (mSq === 1.0) {
      return Quaternion.fromSource(q, target);
    }
    const mInv = 1.0 / Math.sqrt(mSq);
    return Quaternion.scale(q, mInv, target);
  }

  static random (target = new Quaternion()) {

    const t0 = Math.random() * 6.283185307179586;
    const t1 = Math.random() * 6.283185307179586;
    const r1 = Math.random();
    const x0 = Math.sqrt(1.0 - r1);
    const x1 = Math.sqrt(r1);

    return target.setComponents(
      x0 * Math.sin(t0),
      x0 * Math.cos(t0),
      x1 * Math.sin(t1),
      x1 * Math.cos(t1));
  }

  static rotate (
    q = new Quaternion(),
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0),
    target = new Quaternion()) {

    const mSq = Quaternion.magSq(q);
    if (mSq === 0.0) {
      return Quaternion.fromAxisAngle(radians, axis, target);
    }

    const wNorm = (mSq === 1.0) ? q.real : (q.real / Math.sqrt());
    const halfAngle = Math.acos(wNorm);
    const ang = halfAngle + halfAngle + radians;
    const modAngle = ang - 6.283185307179586 *
      Math.floor(ang * 0.15915494309189535);

    return Quaternion.fromAxisAngle(modAngle, axis, target);
  }

  static rotateX (
    q = new Quaternion(),
    radians = 0.0,
    target = new Quaternion()) {

    const halfAngle = radians * 0.5;
    return Quaternion.rotateXInternal(
      q,
      Math.cos(halfAngle),
      Math.sin(halfAngle),
      target);
  }

  static rotateXInternal (
    q = new Quaternion(),
    cosah = 1.0,
    sinah = 0.0,
    target = new Quaternion()) {

    const i = q.imag;
    return target.setComponents(
      cosah * q.real - sinah * i.x,
      cosah * i.x + sinah * q.real,
      cosah * i.y + sinah * i.z,
      cosah * i.z - sinah * i.y);
  }

  static rotateY (
    q = new Quaternion(),
    radians = 0.0,
    target = new Quaternion()) {

    const halfAngle = radians * 0.5;
    return Quaternion.rotateYInternal(
      q,
      Math.cos(halfAngle),
      Math.sin(halfAngle),
      target);
  }

  static rotateYInternal (
    q = new Quaternion(),
    cosah = 1.0,
    sinah = 0.0,
    target = new Quaternion()) {

    const i = q.imag;
    return target.setComponents(
      cosah * q.real - sinah * i.y,
      cosah * i.x - sinah * i.z,
      cosah * i.y + sinah * q.real,
      cosah * i.z + sinah * i.x);
  }

  static rotateZ (
    q = new Quaternion(),
    radians = 0.0,
    target = new Quaternion()) {

    const halfAngle = radians * 0.5;
    return Quaternion.rotateZInternal(
      q,
      Math.cos(halfAngle),
      Math.sin(halfAngle),
      target);
  }

  static rotateZInternal (
    q = new Quaternion(),
    cosah = 1.0,
    sinah = 0.0,
    target = new Quaternion()) {

    const i = q.imag;
    return target.setComponents(
      cosah * q.real - sinah * i.z,
      cosah * i.x + sinah * i.y,
      cosah * i.y - sinah * i.x,
      cosah * i.z + sinah * q.real);
  }

  static scale (
    a = new Quaternion(),
    b = 1.0,
    target = new Quaternion()) {

    target.real = a.real * b;
    Vec3.scale(a.imag, b);
    return target;
  }

  static slerp (
    origin = new Quaternion(),
    dest = new Quaternion(),
    step = 0.5,
    target = new Quaternion()) {

    const ai = origin.imag;
    const aw = origin.real;
    const ax = ai.x;
    const ay = ai.y;
    const az = ai.z;

    const bi = dest.imag;
    let bw = dest.real;
    let bx = bi.x;
    let by = bi.y;
    let bz = bi.z;

    let dotp = aw * bw + ax * bx + ay * by + az * bz;
    dotp = Math.min(Math.max(dotp, -1.0), 1.0);
    if (dotp < 0.0) {
      bw = -bw;
      bx = -bx;
      by = -by;
      bz = -bz;
      dotp = -dotp;
    }

    const theta = Math.acos(dotp);
    const sinTheta = Math.sqrt(1.0 - dotp * dotp);
    let u = 1.0;
    let v = 0.0;
    if (sinTheta > 0.0) {
      const sInv = 1.0 / sinTheta;
      u = Math.sin((1.0 - step) * theta) * sInv;
      v = Math.sin(step * theta) * sInv;
    } else {
      u = 1.0 - step;
      v = step;
    }

    const cw = u * aw + v * bw;
    const cx = u * ax + v * bx;
    const cy = u * ay + v * by;
    const cz = u * az + v * bz;

    const mSq = cw * cw + cx * cx + cy * cy + cz * cz;

    if (mSq === 0.0) {
      return Quaternion.identity(target);
    }

    if (mSq === 1.0) {
      return target.setComponents(cw, cx, cy, cz);
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      cw * mInv,
      cx * mInv,
      cy * mInv,
      cz * mInv);
  }

  static sub (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real - b.real;
    Vec3.sub(a.imag, b.imag, target.imag);
    return target;
  }

  static subNorm (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real - b.real;
    Vec3.sub(a.imag, b.imag, target.imag);

    const mSq = Quaternion.magSq(target);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    const i = target.imag;
    return target.setComponents(
      target.real * mInv,
      i.x * mInv,
      i.y * mInv,
      i.z * mInv);
  }

  static toAxes (
    q = new Quaternion(),
    right = new Vec3(),
    forward = new Vec3(),
    up = new Vec3()) {

    const w = q.real;
    const i = q.imag;
    const x = i.x;
    const y = i.y;
    const z = i.z;

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xsq2 = x * x2;
    const ysq2 = y * y2;
    const zsq2 = z * z2;

    const xy2 = x * y2;
    const xz2 = x * z2;
    const yz2 = y * z2;

    const wx2 = w * x2;
    const wy2 = w * y2;
    const wz2 = w * z2;

    right.setComponents(
      1.0 - ysq2 - zsq2,
      xy2 + wz2,
      xz2 - wy2);

    forward.setComponents(
      xy2 - wz2,
      1.0 - xsq2 - zsq2,
      yz2 + wx2);

    up.setComponents(
      xz2 + wy2,
      yz2 - wx2,
      1.0 - xsq2 - ysq2);

    return {
      right: right,
      forward: forward,
      up: up
    };
  }

  static toAxisAngle (
    q = new Quaternion(),
    axis = new Vec3()) {

    const mSq = Quaternion.magSq(q);

    if (mSq === 0.0) {
      Vec3.forward(axis);
      return { angle: 0.0, axis: axis };
    }

    let wNorm = 0.0;
    // let xNorm = 0.0;
    // let yNorm = 0.0;
    // let zNorm = 0.0;
    const i = q.imag;

    if (Math.abs(1.0 - mSq) < 0.000001) {
      const mInv = 1.0 / Math.sqrt(mSq);
      wNorm = q.real * mInv;
      // xNorm = i.x * mInv;
      // yNorm = i.y * mInv;
      // zNorm = i.z * mInv;
    } else {
      wNorm = q.real;
      // xNorm = i.x;
      // yNorm = i.y;
      // zNorm = i.z;
    }

    const angle = (wNorm <= -1.0) ?
      6.283185307179586 :
      (wNorm >= 1.0) ? 0.0 :
      2.0 * Math.acos(wNorm);
    const wAsin = 6.283185307179586 - angle;
    if (wAsin === 0.0) {
      Vec3.forward(axis);
      return { angle: angle, axis: axis };
    }

    const sInv = 1.0 / wAsin;
    // const ax = xNorm * sInv;
    // const ay = yNorm * sInv;
    // const az = zNorm * sInv;
    const ax = i.x * sInv;
    const ay = i.y * sInv;
    const az = i.z * sInv;

    const amSq = ax * ax + ay * ay + az * az;

    if (amSq === 0.0) {
      Vec3.forward(axis);
      return { angle: angle, axis: axis };
    }

    if (Math.abs(1.0 - amSq) < 0.000001) {
      axis.setComponents(ax, ay, az);
      return { angle: angle, axis: axis };
    }

    const mInv = 1.0 / Math.sqrt(amSq);
    axis.setComponents(
      ax * mInv,
      ay * mInv,
      az * mInv);
    return { angle: angle, axis: axis };
  }
}