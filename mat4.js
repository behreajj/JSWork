'use strict';

class Mat4 {

  constructor (
    m00 = 1.0, m01 = 0.0, m02 = 0.0, m03 = 0.0,
    m10 = 0.0, m11 = 1.0, m12 = 0.0, m13 = 0.0,
    m20 = 0.0, m21 = 0.0, m22 = 1.0, m23 = 0.0,
    m30 = 0.0, m31 = 0.0, m32 = 0.0, m33 = 1.0) {

    this._m00 = m00; this._m01 = m01; this._m02 = m02; this._m03 = m03;
    this._m10 = m10; this._m11 = m11; this._m12 = m12; this._m13 = m13;
    this._m20 = m20; this._m21 = m21; this._m22 = m22; this._m23 = m23;
    this._m30 = m30; this._m31 = m31; this._m32 = m32; this._m33 = m33;
  }

  get length () {

    return 16;
  }

  get m00 () {

    return this._m00;
  }

  get m01 () {

    return this._m01;
  }

  get m02 () {

    return this._m02;
  }

  get m03 () {

    return this._m03;
  }

  get m10 () {

    return this._m10;
  }

  get m11 () {

    return this._m11;
  }

  get m12 () {

    return this._m12;
  }

  get m13 () {

    return this._m13;
  }

  get m20 () {

    return this._m20;
  }

  get m21 () {

    return this._m21;
  }

  get m22 () {

    return this._m22;
  }

  get m23 () {

    return this._m23;
  }

  get m30 () {

    return this._m30;
  }

  get m31 () {

    return this._m31;
  }

  get m32 () {

    return this._m32;
  }

  get m33 () {

    return this._m33;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set m00 (v) {

    this._m00 = v;
  }

  set m01 (v) {

    this._m01 = v;
  }

  set m02 (v) {

    this._m02 = v;
  }

  set m03 (v) {

    this._m03 = v;
  }

  set m10 (v) {

    this._m10 = v;
  }

  set m11 (v) {

    this._m11 = v;
  }

  set m12 (v) {

    this._m12 = v;
  }

  set m13 (v) {

    this._m13 = v;
  }

  set m20 (v) {

    this._m20 = v;
  }

  set m21 (v) {

    this._m21 = v;
  }

  set m22 (v) {

    this._m22 = v;
  }

  set m23 (v) {

    this._m23 = v;
  }

  set m30 (v) {

    this._m30 = v;
  }

  set m31 (v) {

    this._m31 = v;
  }

  set m32 (v) {

    this._m32 = v;
  }

  set m33 (v) {

    this._m33 = v;
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
        return Mat4.determinant(this);
    }
  }

  get (index = -1) {

    switch (index) {

      /* Row 0 */

      case 0: case -16:
        return this._m00;
      case 1: case -15:
        return this._m01;
      case 2: case -14:
        return this._m02;
      case 3: case -13:
        return this._m03;

      /* Row 1 */

      case 4: case -12:
        return this._m10;
      case 5: case -11:
        return this._m11;
      case 6: case -10:
        return this._m12;
      case 7: case -9:
        return this._m13;

      /* Row 2 */

      case 8: case -8:
        return this._m20;
      case 9: case -7:
        return this._m21;
      case 10: case -6:
        return this._m22;
      case 11: case -5:
        return this._m23;

      /* Row 3 */

      case 12: case -4:
        return this._m30;
      case 13: case -3:
        return this._m31;
      case 14: case -2:
        return this._m32;
      case 15: case -1:
        return this._m33;

      default:
        return 0.0;
    }
  }

  getCol3 (j = -1, target = new Vec3()) {

    switch (j) {

      case 0: case -4:

        return target.setComponents(
          this._m00, this._m10, this._m20);

      case 1: case -3:

        return target.setComponents(
          this._m01, this._m11, this._m21);

      case 2: case -2:

        return target.setComponents(
          this._m02, this._m12, this._m22);

      case 3: case -1:

        return target.setComponents(
          this._m03, this._m13, this._m23);

      default:

        return target.reset();
    }
  }

  getCol4 (j = -1, target = new Vec4()) {

    switch (j) {

      case 0: case -4:

        return target.setComponents(
          this._m00, this._m10, this._m20, this._m30);

      case 1: case -3:

        return target.setComponents(
          this._m01, this._m11, this._m21, this._m31);

      case 2: case -2:

        return target.setComponents(
          this._m02, this._m12, this._m22, this._m32);

      case 3: case -1:

        return target.setComponents(
          this._m03, this._m13, this._m23, this._m33);

      default:

        return target.reset();
    }
  }

  reset () {

    this._m00 = 1.0; this._m01 = 0.0; this._m02 = 0.0; this._m03 = 0.0;
    this._m10 = 0.0; this._m11 = 1.0; this._m12 = 0.0; this._m13 = 0.0;
    this._m20 = 0.0; this._m21 = 0.0; this._m22 = 1.0; this._m23 = 0.0;
    this._m30 = 0.0; this._m31 = 0.0; this._m32 = 0.0; this._m33 = 1.0;

    return this;
  }

  setCol3 (j = -1, source = new Vec3()) {

    switch (j) {

      case 0: case -4:

        this._m00 = source.x;
        this._m10 = source.y;
        this._m20 = source.z;
        this._m30 = 0.0;

        return this;

      case 1: case -3:

        this._m01 = source.x;
        this._m11 = source.y;
        this._m21 = source.z;
        this._m31 = 0.0;

        return this;

      case 2: case -2:

        this._m02 = source.x;
        this._m12 = source.y;
        this._m22 = source.z;
        this._m32 = 0.0;

        return this;

      case 3: case -1:

        this._m03 = source.x;
        this._m13 = source.y;
        this._m23 = source.z;
        this._m33 = 1.0;

        return this;

      default:

        return this;
    }
  }

  setCol4 (j = -1, source = new Vec4()) {

    switch (j) {

      case 0: case -4:

        this._m00 = source.x;
        this._m10 = source.y;
        this._m20 = source.z;
        this._m30 = source.w;

        return this;

      case 1: case -3:

        this._m01 = source.x;
        this._m11 = source.y;
        this._m21 = source.z;
        this._m31 = source.w;

        return this;

      case 2: case -2:

        this._m02 = source.x;
        this._m12 = source.y;
        this._m22 = source.z;
        this._m32 = source.w;

        return this;

      case 3: case -1:

        this._m03 = source.x;
        this._m13 = source.y;
        this._m23 = source.z;
        this._m33 = source.w;

        return this;

      default:

        return this;
    }
  }

  setComponents (
    m00 = 1.0, m01 = 0.0, m02 = 0.0, m03 = 0.0,
    m10 = 0.0, m11 = 1.0, m12 = 0.0, m13 = 0.0,
    m20 = 0.0, m21 = 0.0, m22 = 1.0, m23 = 0.0,
    m30 = 0.0, m31 = 0.0, m32 = 0.0, m33 = 1.0) {

    this._m00 = m00; this._m01 = m01; this._m02 = m02; this._m03 = m03;
    this._m10 = m10; this._m11 = m11; this._m12 = m12; this._m13 = m13;
    this._m20 = m20; this._m21 = m21; this._m22 = m22; this._m23 = m23;
    this._m30 = m30; this._m31 = m31; this._m32 = m32; this._m33 = m33;

    return this;
  }

  toArray () {

    return [
      this._m00, this._m01, this._m02, this._m03,
      this._m10, this._m11, this._m12, this._m13,
      this._m20, this._m21, this._m22, this._m23,
      this._m30, this._m31, this._m32, this._m33];
  }

  toJsonString (precision = 6) {

    return [
      '{\"m00\":',
      this._m00.toFixed(precision),
      ',\"m01\":',
      this._m01.toFixed(precision),
      ',\"m02\":',
      this._m02.toFixed(precision),
      ',\"m03\":',
      this._m03.toFixed(precision),

      ',\"m10\":',
      this._m10.toFixed(precision),
      ',\"m11\":',
      this._m11.toFixed(precision),
      ',\"m12\":',
      this._m12.toFixed(precision),
      ',\"m13\":',
      this._m13.toFixed(precision),

      ',\"m20\":',
      this._m20.toFixed(precision),
      ',\"m21\":',
      this._m21.toFixed(precision),
      ',\"m22\":',
      this._m22.toFixed(precision),
      ',\"m23\":',
      this._m23.toFixed(precision),

      ',\"m30\":',
      this._m30.toFixed(precision),
      ',\"m31\":',
      this._m31.toFixed(precision),
      ',\"m32\":',
      this._m32.toFixed(precision),
      ',\"m33\":',
      this._m33.toFixed(precision),
      '}'
    ].join('');
  }

  toObject () {

    return {
      m00: this._m00, m01: this._m01, m02: this._m02, m03: this._m03,
      m10: this._m10, m11: this._m11, m12: this._m12, m13: this._m13,
      m20: this._m20, m21: this._m21, m22: this._m22, m23: this._m23,
      m30: this._m30, m31: this._m31, m32: this._m32, m33: this._m33
    };
  }

  toString (precision = 4) {

    return [
      '{ m00: ',
      this._m00.toFixed(precision),
      ', m01: ',
      this._m01.toFixed(precision),
      ', m02: ',
      this._m02.toFixed(precision),
      ', m03: ',
      this._m03.toFixed(precision),

      ', m10: ',
      this._m10.toFixed(precision),
      ', m11: ',
      this._m11.toFixed(precision),
      ', m12: ',
      this._m12.toFixed(precision),
      ', m13: ',
      this._m13.toFixed(precision),

      ', m20: ',
      this._m20.toFixed(precision),
      ', m21: ',
      this._m21.toFixed(precision),
      ', m22: ',
      this._m22.toFixed(precision),
      ', m23: ',
      this._m23.toFixed(precision),

      ', m30: ',
      this._m30.toFixed(precision),
      ', m31: ',
      this._m31.toFixed(precision),
      ', m32: ',
      this._m32.toFixed(precision),
      ', m33: ',
      this._m33.toFixed(precision),
      ' }'
    ].join('');
  }

  toStringCol (precision = 3) {

    return [
      '\n',
      this._m00.toFixed(precision),
      ', ',
      this._m01.toFixed(precision),
      ', ',
      this._m02.toFixed(precision),
      ', ',
      this._m03.toFixed(precision),

      ', \n',
      this._m10.toFixed(precision),
      ', ',
      this._m11.toFixed(precision),
      ', ',
      this._m12.toFixed(precision),
      ', ',
      this._m13.toFixed(precision),

      ', \n',
      this._m20.toFixed(precision),
      ', ',
      this._m21.toFixed(precision),
      ', ',
      this._m22.toFixed(precision),
      ', ',
      this._m23.toFixed(precision),

      ', \n',
      this._m30.toFixed(precision),
      ', ',
      this._m31.toFixed(precision),
      ', ',
      this._m32.toFixed(precision),
      ', ',
      this._m33.toFixed(precision),

      '\n'].join('');
  }

  static add (
    a = new Mat4(),
    b = new Mat4(),
    target = new Mat4()) {

    return target.setComponents(
      a.m00 + b.m00, a.m01 + b.m01, a.m02 + b.m02, a.m03 + b.m03,
      a.m10 + b.m10, a.m11 + b.m11, a.m12 + b.m12, a.m13 + b.m13,
      a.m20 + b.m20, a.m21 + b.m21, a.m22 + b.m22, a.m23 + b.m23,
      a.m30 + b.m30, a.m31 + b.m31, a.m32 + b.m32, a.m33 + b.m33);
  }

  static compose (
    a = new Mat4(),
    b = new Mat4(),
    c = new Mat4(),
    target = new Mat4()) {

    const n00 = a.m00 * b.m00 +
      a.m01 * b.m10 +
      a.m02 * b.m20 +
      a.m03 * b.m30;
    const n01 = a.m00 * b.m01 +
      a.m01 * b.m11 +
      a.m02 * b.m21 +
      a.m03 * b.m31;
    const n02 = a.m00 * b.m02 +
      a.m01 * b.m12 +
      a.m02 * b.m22 +
      a.m03 * b.m32;
    const n03 = a.m00 * b.m03 +
      a.m01 * b.m13 +
      a.m02 * b.m23 +
      a.m03 * b.m33;

    const n10 = a.m10 * b.m00 +
      a.m11 * b.m10 +
      a.m12 * b.m20 +
      a.m13 * b.m30;
    const n11 = a.m10 * b.m01 +
      a.m11 * b.m11 +
      a.m12 * b.m21 +
      a.m13 * b.m31;
    const n12 = a.m10 * b.m02 +
      a.m11 * b.m12 +
      a.m12 * b.m22 +
      a.m13 * b.m32;
    const n13 = a.m10 * b.m03 +
      a.m11 * b.m13 +
      a.m12 * b.m23 +
      a.m13 * b.m33;

    const n20 = a.m20 * b.m00 +
      a.m21 * b.m10 +
      a.m22 * b.m20 +
      a.m23 * b.m30;
    const n21 = a.m20 * b.m01 +
      a.m21 * b.m11 +
      a.m22 * b.m21 +
      a.m23 * b.m31;
    const n22 = a.m20 * b.m02 +
      a.m21 * b.m12 +
      a.m22 * b.m22 +
      a.m23 * b.m32;
    const n23 = a.m20 * b.m03 +
      a.m21 * b.m13 +
      a.m22 * b.m23 +
      a.m23 * b.m33;

    const n30 = a.m30 * b.m00 +
      a.m31 * b.m10 +
      a.m32 * b.m20 +
      a.m33 * b.m30;
    const n31 = a.m30 * b.m01 +
      a.m31 * b.m11 +
      a.m32 * b.m21 +
      a.m33 * b.m31;
    const n32 = a.m30 * b.m02 +
      a.m31 * b.m12 +
      a.m32 * b.m22 +
      a.m33 * b.m32;
    const n33 = a.m30 * b.m03 +
      a.m31 * b.m13 +
      a.m32 * b.m23 +
      a.m33 * b.m33;

    return target.setComponents(
      n00 * c.m00 + n01 * c.m10 + n02 * c.m20 + n03 * c.m30,
      n00 * c.m01 + n01 * c.m11 + n02 * c.m21 + n03 * c.m31,
      n00 * c.m02 + n01 * c.m12 + n02 * c.m22 + n03 * c.m32,
      n00 * c.m03 + n01 * c.m13 + n02 * c.m23 + n03 * c.m33,

      n10 * c.m00 + n11 * c.m10 + n12 * c.m20 + n13 * c.m30,
      n10 * c.m01 + n11 * c.m11 + n12 * c.m21 + n13 * c.m31,
      n10 * c.m02 + n11 * c.m12 + n12 * c.m22 + n13 * c.m32,
      n10 * c.m03 + n11 * c.m13 + n12 * c.m23 + n13 * c.m33,

      n20 * c.m00 + n21 * c.m10 + n22 * c.m20 + n23 * c.m30,
      n20 * c.m01 + n21 * c.m11 + n22 * c.m21 + n23 * c.m31,
      n20 * c.m02 + n21 * c.m12 + n22 * c.m22 + n23 * c.m32,
      n20 * c.m03 + n21 * c.m13 + n22 * c.m23 + n23 * c.m33,

      n30 * c.m00 + n31 * c.m10 + n32 * c.m20 + n33 * c.m30,
      n30 * c.m01 + n31 * c.m11 + n32 * c.m21 + n33 * c.m31,
      n30 * c.m02 + n31 * c.m12 + n32 * c.m22 + n33 * c.m32,
      n30 * c.m03 + n31 * c.m13 + n32 * c.m23 + n33 * c.m33);
  }

  static decompose (
    m = new Mat4(),
    trans = Vec3.zero(),
    rot = Quaternion.identity(),
    scale = Vec3.one()) {

    const xMag = Math.hypot(m.m00, m.m10, m.m20);
    const yMag = Math.hypot(m.m01, m.m11, m.m21);
    const zMag = Math.hypot(m.m02, m.m12, m.m22);
    const det = Mat4.determinant(m);
    scale.setComponents(xMag, det < 0.0 ? -yMag : yMag, zMag);

    const sxInv = xMag === 0.0 ? xMag : 1.0 / xMag;
    const syInv = yMag === 0.0 ? yMag : 1.0 / yMag;
    const szInv = zMag === 0.0 ? zMag : 1.0 / zMag;

    const rightx = m.m00 * sxInv;
    const righty = m.m10 * sxInv;
    const rightz = m.m20 * sxInv;

    const forwardx = m.m01 * syInv;
    const forwardy = m.m11 * syInv;
    const forwardz = m.m21 * syInv;

    const upx = m.m02 * szInv;
    const upy = m.m12 * szInv;
    const upz = m.m22 * szInv;

    Quaternion.fromAxesInternal(
      rightx, forwardy, upz,
      forwardz, upy,
      upx, rightz,
      righty, forwardx,
      rot);

    trans.setComponents(m.m03, m.m13, m.m23);

    return { translation: trans, rotation: rot, scale: scale };
  }

  static determinant (m = new Mat4()) {

    return m.m00 * (m.m11 * m.m22 * m.m33 +
      m.m12 * m.m23 * m.m31 +
      m.m13 * m.m21 * m.m32 -
      m.m13 * m.m22 * m.m31 -
      m.m11 * m.m23 * m.m32 -
      m.m12 * m.m21 * m.m33)
      - m.m01 * (m.m10 * m.m22 * m.m33 +
        m.m12 * m.m23 * m.m30 +
        m.m13 * m.m20 * m.m32 -
        m.m13 * m.m22 * m.m30 -
        m.m10 * m.m23 * m.m32 -
        m.m12 * m.m20 * m.m33)
      + m.m02 * (m.m10 * m.m21 * m.m33 +
        m.m11 * m.m23 * m.m30 +
        m.m13 * m.m20 * m.m31 -
        m.m13 * m.m21 * m.m30 -
        m.m10 * m.m23 * m.m31 -
        m.m11 * m.m20 * m.m33)
      - m.m03 * (m.m10 * m.m21 * m.m32 +
        m.m11 * m.m22 * m.m30 +
        m.m12 * m.m20 * m.m31 -
        m.m12 * m.m21 * m.m30 -
        m.m10 * m.m22 * m.m31 -
        m.m11 * m.m20 * m.m32);
  }

  static div (
    a = new Mat4(),
    b = new Mat4(),
    target = new Mat4(),
    inverse = new Mat4()) {

    return Mat4.mul(a, Mat4.inverse(b, inverse), target);
  }

  static fromArray (
    arr = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0],
    target = new Mat4()) {

    return target.setComponents(
      arr[0], arr[1], arr[2], arr[3],
      arr[4], arr[5], arr[6], arr[7],
      arr[8], arr[9], arr[10], arr[11],
      arr[12], arr[13], arr[14], arr[15]);
  }

  static fromAxes2 (
    right = Vec2.right(),
    forward = Vec2.forward(),
    translation = Vec2.zero(),
    target = new Mat4()) {

    return target.setComponents(
      right.x, forward.x, 0.0, translation.x,
      right.y, forward.y, 0.0, translation.y,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromAxes3 (
    right = Vec3.right(),
    forward = Vec3.forward(),
    up = Vec3.up(),
    translation = Vec3.zero(),
    target = new Mat4()) {

    return target.setComponents(
      right.x, forward.x, up.x, translation.x,
      right.y, forward.y, up.y, translation.y,
      right.z, forward.z, up.z, translation.z,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromAxes4 (
    right = Vec4.right(),
    forward = Vec4.forward(),
    up = Vec4.up(),
    translation = new Vec4(0.0, 0.0, 0.0, 1.0),
    target = new Mat4()) {

    return target.setComponents(
      right.x, forward.x, up.x, translation.x,
      right.y, forward.y, up.y, translation.y,
      right.z, forward.z, up.z, translation.z,
      right.w, forward.w, up.w, translation.w);
  }

  static fromRotation (
    radians = 0.0,
    axis = Vec3.up(),
    target = new Mat4()) {

    return Mat4.fromRotationInternal(
      Math.cos(radians),
      Math.sin(radians),
      axis,
      target);
  }

  static fromRotationInternal (
    cosa = 1.0,
    sina = 0.0,
    axis = Vec3.up(),
    target = new Mat4()) {

    const mSq = Vec3.magSq(axis);
    if (mSq === 0.0) {
      return Mat4.identity(target);
    }

    const mInv = (1.0 / Math.sqrt(mSq));
    const ax = axis.x * mInv;
    const ay = axis.y * mInv;
    const az = axis.z * mInv;

    const d = 1.0 - cosa;
    const x = ax * d;
    const y = ay * d;
    const z = az * d;

    const axay = x * ay;
    const axaz = x * az;
    const ayaz = y * az;

    return target.setComponents(
      cosa + x * ax, axay - sina * az, axaz + sina * ay, 0.0,
      axay + sina * az, cosa + y * ay, ayaz - sina * ax, 0.0,
      axaz - sina * ay, ayaz + sina * ax, cosa + z * az, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromRotX (
    radians = 0.0,
    target = new Mat4()) {

    return Mat4.fromRotXInternal(
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  static fromRotXInternal (
    cosa = 1.0,
    sina = 0.0,
    target = new Mat4()) {

    return target.setComponents(
      1.0, 0.0, 0.0, 0.0,
      0.0, cosa, -sina, 0.0,
      0.0, sina, cosa, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromRotY (
    radians = 0.0,
    target = new Mat4()) {

    return Mat4.fromRotYInternal(
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  static fromRotYInternal (
    cosa = 1.0,
    sina = 0.0,
    target = new Mat4()) {

    return target.setComponents(
      cosa, 0.0, sina, 0.0,
      0.0, 1.0, 0.0, 0.0,
      -sina, 0.0, cosa, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromRotZ (
    radians = 0.0,
    target = new Mat4()) {

    return Mat4.fromRotZInternal(
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  static fromRotZInternal (
    cosa = 1.0,
    sina = 0.0,
    target = new Mat4()) {

    return target.setComponents(
      cosa, -sina, 0.0, 0.0,
      sina, cosa, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromScale1 (
    scalar = 1.0,
    target = new Mat4()) {

    return target.setComponents(
      scalar, 0.0, 0.0, 0.0,
      0.0, scalar, 0.0, 0.0,
      0.0, 0.0, scalar, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromScale2 (
    scalar = Vec2.one(),
    target = new Mat4()) {

    return target.setComponents(
      scalar.x, 0.0, 0.0, 0.0,
      0.0, scalar.y, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromScale3 (
    scalar = Vec3.one(),
    target = new Mat4()) {

    return target.setComponents(
      scalar.x, 0.0, 0.0, 0.0,
      0.0, scalar.y, 0.0, 0.0,
      0.0, 0.0, scalar.z, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromSource (
    source = new Mat4(),
    target = new Mat4()) {

    return target.setComponents(
      source.m00, source.m01, source.m02, source.m03,
      source.m10, source.m11, source.m12, source.m13,
      source.m20, source.m21, source.m22, source.m23,
      source.m30, source.m31, source.m32, source.m33);
  }

  static fromTranslation2 (
    translation = Vec2.zero(),
    target = new Mat4()) {

    return target.setComponents(
      1.0, 0.0, 0.0, translation.x,
      0.0, 1.0, 0.0, translation.y,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static fromTranslation3 (
    translation = Vec3.zero(),
    target = new Mat4()) {

    return target.setComponents(
      1.0, 0.0, 0.0, translation.x,
      0.0, 1.0, 0.0, translation.y,
      0.0, 0.0, 1.0, translation.z,
      0.0, 0.0, 0.0, 1.0);
  }

  static frustum (
    left = -1.0, right = 1.0,
    bottom = -1.0, top = 1.0,
    near = 0.000001, far = 2.0,
    target = new Mat4()) {

    const n2 = near + near;

    const ex = Math.max(0.000001, right - left);
    const ey = Math.max(0.000001, top - bottom);
    const ez = Math.max(0.000001, far - near);

    const w = 1.0 / ex;
    const h = 1.0 / ey;
    const d = 1.0 / ez;

    return target.setComponents(
      n2 * w, 0.0, (right + left) * w, 0.0,
      0.0, n2 * h, (top + bottom) * h, 0.0,
      0.0, 0.0, (far + near) * -d, n2 * far * -d,
      0.0, 0.0, -1.0, 0.0);
  }

  static identity (target = new Mat4()) {

    return target.setComponents(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0);
  }

  static inverse (
    m = new Mat4(),
    target = new Mat4()) {

    const b00 = m.m00 * m.m11 - m.m01 * m.m10;
    const b01 = m.m00 * m.m12 - m.m02 * m.m10;
    const b02 = m.m00 * m.m13 - m.m03 * m.m10;
    const b03 = m.m01 * m.m12 - m.m02 * m.m11;
    const b04 = m.m01 * m.m13 - m.m03 * m.m11;
    const b05 = m.m02 * m.m13 - m.m03 * m.m12;
    const b06 = m.m20 * m.m31 - m.m21 * m.m30;
    const b07 = m.m20 * m.m32 - m.m22 * m.m30;
    const b08 = m.m20 * m.m33 - m.m23 * m.m30;
    const b09 = m.m21 * m.m32 - m.m22 * m.m31;
    const b10 = m.m21 * m.m33 - m.m23 * m.m31;
    const b11 = m.m22 * m.m33 - m.m23 * m.m32;

    const det = b00 * b11 -
      b01 * b10 +
      b02 * b09 +
      b03 * b08 -
      b04 * b07 +
      b05 * b06;

    if (det === 0.0) {
      return target.reset();
    }
    const detInv = 1.0 / det;

    return target.setComponents(
      (m.m11 * b11 - m.m12 * b10 + m.m13 * b09) * detInv,
      (m.m02 * b10 - m.m01 * b11 - m.m03 * b09) * detInv,
      (m.m31 * b05 - m.m32 * b04 + m.m33 * b03) * detInv,
      (m.m22 * b04 - m.m21 * b05 - m.m23 * b03) * detInv,
      (m.m12 * b08 - m.m10 * b11 - m.m13 * b07) * detInv,
      (m.m00 * b11 - m.m02 * b08 + m.m03 * b07) * detInv,
      (m.m32 * b02 - m.m30 * b05 - m.m33 * b01) * detInv,
      (m.m20 * b05 - m.m22 * b02 + m.m23 * b01) * detInv,
      (m.m10 * b10 - m.m11 * b08 + m.m13 * b06) * detInv,
      (m.m01 * b08 - m.m00 * b10 - m.m03 * b06) * detInv,
      (m.m30 * b04 - m.m31 * b02 + m.m33 * b00) * detInv,
      (m.m21 * b02 - m.m20 * b04 - m.m23 * b00) * detInv,
      (m.m11 * b07 - m.m10 * b09 - m.m12 * b06) * detInv,
      (m.m00 * b09 - m.m01 * b07 + m.m02 * b06) * detInv,
      (m.m31 * b01 - m.m30 * b03 - m.m32 * b00) * detInv,
      (m.m20 * b03 - m.m21 * b01 + m.m22 * b00) * detInv);
  }

  static isIdentity (m = new Mat4()) {

    return m.m33 === 1.0 && m.m22 === 1.0 && m.m11 === 1.0 && m.m00 === 1.0 &&
      m.m01 === 0.0 && m.m02 === 0.0 && m.m03 === 0.0 && m.m10 === 0.0 &&
      m.m12 === 0.0 && m.m13 === 0.0 && m.m20 === 0.0 && m.m21 === 0.0 &&
      m.m23 === 0.0 && m.m30 === 0.0 && m.m31 === 0.0 && m.m32 === 0.0;
  }

  static mul (
    a = new Mat4(),
    b = new Mat4(),
    target = new Mat4()) {

    return target.setComponents(
      a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20 + a.m03 * b.m30,
      a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21 + a.m03 * b.m31,
      a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22 + a.m03 * b.m32,
      a.m00 * b.m03 + a.m01 * b.m13 + a.m02 * b.m23 + a.m03 * b.m33,

      a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20 + a.m13 * b.m30,
      a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31,
      a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32,
      a.m10 * b.m03 + a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33,

      a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20 + a.m23 * b.m30,
      a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31,
      a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32,
      a.m20 * b.m03 + a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33,

      a.m30 * b.m00 + a.m31 * b.m10 + a.m32 * b.m20 + a.m33 * b.m30,
      a.m30 * b.m01 + a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31,
      a.m30 * b.m02 + a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32,
      a.m30 * b.m03 + a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33);
  }

  static mulVec4 (
    a = new Mat4(),
    b = new Vec4(),
    target = new Vec4()) {

    return target.setComponents(
      a.m00 * b.x +
      a.m01 * b.y +
      a.m02 * b.z +
      a.m03 * b.w,

      a.m10 * b.x +
      a.m11 * b.y +
      a.m12 * b.z +
      a.m13 * b.w,

      a.m20 * b.x +
      a.m21 * b.y +
      a.m22 * b.z +
      a.m23 * b.w,

      a.m30 * b.x +
      a.m31 * b.y +
      a.m32 * b.z +
      a.m33 * b.w);
  }

  static orthographic (
    left = -1.0, right = 1.0,
    bottom = -1.0, top = 1.0,
    near = 0.000001, far = 2.0,
    target = new Mat4()) {

    const ex = Math.max(0.000001, right - left);
    const ey = Math.max(0.000001, top - bottom);
    const ez = Math.max(0.000001, far - near);

    const w = 1.0 / ex;
    const h = 1.0 / ey;
    const d = 1.0 / ez;

    return target.setComponents(
      w + w, 0.0, 0.0, w * (left + right),
      0.0, h + h, 0.0, h * (top + bottom),
      0.0, 0.0, -(d + d), -d * (far + near),
      0.0, 0.0, 0.0, 1.0);
  }

  static perspective (
    fov = 1.0471975511965976,
    aspect = 1.7777777777777777,
    near = 0.000001, far = 1.0,
    target = new Mat4()) {

    const tanfov = Math.max(0.000001, Math.tan(fov * 0.5));
    const ez = Math.max(0.000001, far - near);
    const d = 1.0 / ez;
    const m00 = 1.0 / Math.max(0.000001, tanfov * aspect);

    return target.setComponents(
      m00, 0.0, 0.0, 0.0,
      0.0, 1.0 / tanfov, 0.0, 0.0,
      0.0, 0.0, (far + near) * -d, (near + near) * far * -d,
      0.0, 0.0, -1.0, 0.0);
  }

  static sub (
    a = new Mat4(),
    b = new Mat4(),
    target = new Mat4()) {

    return target.setComponents(
      a.m00 - b.m00, a.m01 - b.m01, a.m02 - b.m02, a.m03 - b.m03,
      a.m10 - b.m10, a.m11 - b.m11, a.m12 - b.m12, a.m13 - b.m13,
      a.m20 - b.m20, a.m21 - b.m21, a.m22 - b.m22, a.m23 - b.m23,
      a.m30 - b.m30, a.m31 - b.m31, a.m32 - b.m32, a.m33 - b.m33);
  }

  static transpose (
    m = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      m.m00, m.m10, m.m20, m.m30,
      m.m01, m.m11, m.m21, m.m31,
      m.m02, m.m12, m.m22, m.m32,
      m.m03, m.m13, m.m23, m.m33);
  }
}