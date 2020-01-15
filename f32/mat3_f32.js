'use strict';

class Mat3 {

  constructor (
    m00 = 1.0, m01 = 0.0, m02 = 0.0,
    m10 = 0.0, m11 = 1.0, m12 = 0.0,
    m20 = 0.0, m21 = 0.0, m22 = 1.0) {

    this._elms = new Float32Array([
      m00, m01, m02,
      m10, m11, m12,
      m20, m21, m22
    ]);
  }

  get length () {

    return this._elms.length;
  }

  get m00 () {

    return this._elms[0];
  }

  get m01 () {

    return this._elms[1];
  }

  get m02 () {

    return this._elms[2];
  }

  get m10 () {

    return this._elms[3];
  }

  get m11 () {

    return this._elms[4];
  }

  get m12 () {

    return this._elms[5];
  }

  get m20 () {

    return this._elms[6];
  }

  get m21 () {

    return this._elms[7];
  }

  get m22 () {

    return this._elms[8];
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set m00 (v) {

    this._elms[0] = v;
  }

  set m01 (v) {

    this._elms[1] = v;
  }

  set m02 (v) {

    this._elms[2] = v;
  }

  set m10 (v) {

    this._elms[3] = v;
  }

  set m11 (v) {

    this._elms[4] = v;
  }

  set m12 (v) {

    this._elms[5] = v;
  }

  set m20 (v) {

    this._elms[6] = v;
  }

  set m21 (v) {

    this._elms[7] = v;
  }

  set m22 (v) {

    this._elms[8] = v;
  }

  [Symbol.iterator] () {

    return this._elms.entries();
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'string':
        return this.toString();
      case 'number':
      default:
        return Mat3.determinant(this);
    }
  }

  get (index = 0) {

    return this._elms[index];
  }

  getCol2 (j = -1, target = new Vec2()) {

    switch (j) {
      case 0:
      case -3:
        return target.setComponents(
          this._elms[0], this._elms[3]);
      case 1:
      case -2:
        return target.setComponents(
          this._elms[1], this._elms[4]);
      case 2:
      case -1:
        return target.setComponents(
          this._elms[2], this._elms[5]);
      default:
        return target.reset();
    }
  }

  getCol3 (j = -1, target = new Vec3()) {

    switch (j) {
      case 0:
      case -3:
        return target.setComponents(
          this._elms[0], this._elms[3], this._elms[6]);
      case 1:
      case -2:
        return target.setComponents(
          this._elms[1], this._elms[4], this._elms[7]);
      case 2:
      case -1:
        return target.setComponents(
          this._elms[2], this._elms[5], this._elms[8]);
      default:
        return target.reset();
    }
  }

  reset () {

    this._elms[0] = 1.0; this._elms[1] = 0.0; this._elms[2] = 0.0;
    this._elms[3] = 0.0; this._elms[4] = 1.0; this._elms[5] = 0.0;
    this._elms[6] = 0.0; this._elms[7] = 0.0; this._elms[8] = 1.0;

    return this;
  }

  setCol2 (j = -1, source = new Vec2()) {

    switch (j) {
      case 0:
      case -3:
        this._elms[0] = source.x;
        this._elms[3] = source.y;
        this._elms[6] = 0.0;
        return this;
      case 1:
      case -2:
        this._elms[1] = source.x;
        this._elms[4] = source.y;
        this._elms[7] = 0.0;
        return this;
      case 2:
      case -1:
        this._elms[2] = source.x;
        this._elms[5] = source.y;
        this._elms[8] = 1.0;
        return this;
      default:
        return this;
    }
  }

  setCol3 (j = -1, source = new Vec3()) {

    switch (j) {
      case 0:
      case -3:
        this._elms[0] = source.x;
        this._elms[3] = source.y;
        this._elms[6] = source.z;
        return this;
      case 1:
      case -2:
        this._elms[1] = source.x;
        this._elms[4] = source.y;
        this._elms[7] = source.z;
        return this;
      case 2:
      case -1:
        this._elms[2] = source.x;
        this._elms[5] = source.y;
        this._elms[8] = source.z;
        return this;
      default:
        return this;
    }
  }

  setComponents (
    m00 = 1.0, m01 = 0.0, m02 = 0.0,
    m10 = 0.0, m11 = 1.0, m12 = 0.0,
    m20 = 0.0, m21 = 0.0, m22 = 1.0) {

    this._elms[0] = m00; this._elms[1] = m01; this._elms[2] = m02;
    this._elms[3] = m10; this._elms[4] = m11; this._elms[5] = m12;
    this._elms[6] = m20; this._elms[7] = m21; this._elms[8] = m22;

    return this;
  }

  toArray () {

    return [
      this._elms[0], this._elms[1], this._elms[2],
      this._elms[3], this._elms[4], this._elms[5],
      this._elms[6], this._elms[7], this._elms[8]];
  }

  toObject () {

    return {
      m00: this._elms[0], m01: this._elms[1], m02: this._elms[2],
      m10: this._elms[3], m11: this._elms[4], m12: this._elms[5],
      m20: this._elms[6], m21: this._elms[7], m22: this._elms[8]
    };
  }

  toString (precision = 4) {

    return [
      '{ m00: ',
      this._elms[0].toFixed(precision),
      ', m01: ',
      this._elms[1].toFixed(precision),
      ', m02: ',
      this._elms[2].toFixed(precision),

      ', m10: ',
      this._elms[3].toFixed(precision),
      ', m11: ',
      this._elms[4].toFixed(precision),
      ', m12: ',
      this._elms[5].toFixed(precision),

      ', m20: ',
      this._elms[6].toFixed(precision),
      ', m21: ',
      this._elms[7].toFixed(precision),
      ', m22: ',
      this._elms[8].toFixed(precision),
      ' }'
    ].join('');
  }

  toStringCol (precision = 4) {

    return [
      '\n',
      this._elms[0].toFixed(precision),
      ', ',
      this._elms[1].toFixed(precision),
      ', ',
      this._elms[2].toFixed(precision),

      ', \n',
      this._elms[3].toFixed(precision),
      ', ',
      this._elms[4].toFixed(precision),
      ', ',
      this._elms[5].toFixed(precision),

      ', \n',
      this._elms[6].toFixed(precision),
      ', ',
      this._elms[7].toFixed(precision),
      ', ',
      this._elms[8].toFixed(precision),

      '\n'].join('');
  }

  static add (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      a.m00 + b.m00, a.m01 + b.m01, a.m02 + b.m02,
      a.m10 + b.m10, a.m11 + b.m11, a.m12 + b.m12,
      a.m20 + b.m20, a.m21 + b.m21, a.m22 + b.m22);
  }

  static compose (
    a = new Mat3(),
    b = new Mat3(),
    c = new Mat3(),
    target = new Mat3()) {

    const am00 = a.m00;
    const am01 = a.m01;
    const am02 = a.m02;
    const am10 = a.m10;
    const am11 = a.m11;
    const am12 = a.m12;
    const am20 = a.m20;
    const am21 = a.m21;
    const am22 = a.m22;

    const bm00 = b.m00;
    const bm01 = b.m01;
    const bm02 = b.m02;
    const bm10 = b.m10;
    const bm11 = b.m11;
    const bm12 = b.m12;
    const bm20 = b.m20;
    const bm21 = b.m21;
    const bm22 = b.m22;

    const cm00 = c.m00;
    const cm01 = c.m01;
    const cm02 = c.m02;
    const cm10 = c.m10;
    const cm11 = c.m11;
    const cm12 = c.m12;
    const cm20 = c.m20;
    const cm21 = c.m21;
    const cm22 = c.m22;

    const n00 = am00 * bm00 + am01 * bm10 + am02 * bm20;
    const n01 = am00 * bm01 + am01 * bm11 + am02 * bm21;
    const n02 = am00 * bm02 + am01 * bm12 + am02 * bm22;
    const n10 = am10 * bm00 + am11 * bm10 + am12 * bm20;
    const n11 = am10 * bm01 + am11 * bm11 + am12 * bm21;
    const n12 = am10 * bm02 + am11 * bm12 + am12 * bm22;
    const n20 = am20 * bm00 + am21 * bm10 + am22 * bm20;
    const n21 = am20 * bm01 + am21 * bm11 + am22 * bm21;
    const n22 = am20 * bm02 + am21 * bm12 + am22 * bm22;

    return target.setComponents(
      n00 * cm00 + n01 * cm10 + n02 * cm20,
      n00 * cm01 + n01 * cm11 + n02 * cm21,
      n00 * cm02 + n01 * cm12 + n02 * cm22,
      n10 * cm00 + n11 * cm10 + n12 * cm20,
      n10 * cm01 + n11 * cm11 + n12 * cm21,
      n10 * cm02 + n11 * cm12 + n12 * cm22,
      n20 * cm00 + n21 * cm10 + n22 * cm20,
      n20 * cm01 + n21 * cm11 + n22 * cm21,
      n20 * cm02 + n21 * cm12 + n22 * cm22);
  }

  static decompose (
    m = new Mat3(),
    trans = new Vec2(),
    scale = new Vec2()) {

    const mm00 = m.m00;
    const mm10 = m.m10;

    const xMag = Math.hypot(mm00, mm10);
    const yMag = Math.hypot(m.m01, m.m11);
    const det = Mat3.determinant(m);
    scale.setComponents(xMag, det < 0.0 ? -yMag : yMag);

    trans.setComponents(m.m02, m.m12);

    let angle = Math.atan2(mm10, mm00);
    angle -= 6.283185307179586 * Math.floor(angle * 0.15915494309189535);

    return { translation: trans, rotation: angle, scale: scale };
  }

  static determinant (m = new Mat3()) {

    return m.m00 * (m.m22 * m.m11 - m.m12 * m.m21) +
      m.m01 * (m.m12 * m.m20 - m.m22 * m.m10) +
      m.m02 * (m.m21 * m.m10 - m.m11 * m.m20);
  }

  static div (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3(),
    inverse = new Mat3()) {

    return Mat3.mul(a, Mat3.inverse(b, inverse), target);
  }

  static fromArray (
    arr = [
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0],
    target = new Mat3()) {

    return target.setComponents(
      arr[0], arr[1], arr[2],
      arr[3], arr[4], arr[5],
      arr[6], arr[7], arr[8]);
  }

  static fromAxes2 (
    right = Vec2.right(),
    forward = Vec2.forward(),
    translation = Vec2.zero(),
    target = new Mat3()) {

    return target.setComponents(
      right.x, forward.x, translation.x,
      right.y, forward.y, translation.y,
      0.0, 0.0, 1.0);
  }

  static fromAxes3 (
    right = Vec3.right(),
    forward = Vec3.forward(),
    translation = Vec3.up(),
    target = new Mat3()) {

    return target.setComponents(
      right.x, forward.x, translation.x,
      right.y, forward.y, translation.y,
      right.z, forward.z, translation.z);
  }

  static fromRotZ (
    radians = 0.0,
    target = new Mat3()) {

    return Mat3.fromRotZInternal(
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  static fromRotZInternal (
    cosa = 1.0,
    sina = 0.0,
    target = new Mat3()) {

    return target.setComponents(
      cosa, -sina, 0.0,
      sina, cosa, 0.0,
      0.0, 0.0, 1.0);
  }

  static fromScale1 (
    scalar = 1.0,
    target = new Mat3()) {

    return target.setComponents(
      scalar, 0.0, 0.0,
      0.0, scalar, 0.0,
      0.0, 0.0, 1.0);
  }

  static fromScale2 (
    scalar = Vec2.one(),
    target = new Mat3()) {

    return target.setComponents(
      scalar.x, 0.0, 0.0,
      0.0, scalar.y, 0.0,
      0.0, 0.0, 1.0);
  }

  static fromSource (
    source = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      source.m00, source.m01, source.m02,
      source.m10, source.m11, source.m12,
      source.m20, source.m21, source.m22);
  }

  static fromTranslation (
    translation = Vec2.zero(),
    target = new Mat3()) {

    return target.setComponents(
      1.0, 0.0, translation.x,
      0.0, 1.0, translation.y,
      0.0, 0.0, 1.0);
  }

  static identity (target = new Mat3()) {

    return target.setComponents(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0);
  }

  static inverse (m = new Mat3(), target = new Mat3()) {

    const mm00 = m.m00;
    const mm01 = m.m01;
    const mm02 = m.m02;
    const mm10 = m.m10;
    const mm11 = m.m11;
    const mm12 = m.m12;
    const mm20 = m.m20;
    const mm21 = m.m21;
    const mm22 = m.m22;

    const b01 = mm22 * mm11 - mm12 * mm21;
    const b11 = mm12 * mm20 - mm22 * mm10;
    const b21 = mm21 * mm10 - mm11 * mm20;

    const det = mm00 * b01 + mm01 * b11 + mm02 * b21;
    if (det === 0.0) { return target.reset(); }
    const detInv = 1.0 / det;

    return target.setComponents(
      b01 * detInv,
      (mm02 * mm21 - mm22 * mm01) * detInv,
      (mm12 * mm01 - mm02 * mm11) * detInv,
      b11 * detInv,
      (mm22 * mm00 - mm02 * mm20) * detInv,
      (mm02 * mm10 - mm12 * mm00) * detInv,
      b21 * detInv,
      (mm01 * mm20 - mm21 * mm00) * detInv,
      (mm11 * mm00 - mm01 * mm10) * detInv);
  }

  static isIdentity (m = new Mat3()) {

    return m.m22 === 1.0 && m.m11 === 1.0 && m.m00 === 1.0 &&
      m.m01 === 0.0 && m.m02 === 0.0 && m.m12 === 0.0 &&
      m.m10 === 0.0 && m.m20 === 0.0 && m.m21 === 0.0;
  }

  static mul (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    const am00 = a.m00;
    const am01 = a.m01;
    const am02 = a.m02;
    const am10 = a.m10;
    const am11 = a.m11;
    const am12 = a.m12;
    const am20 = a.m20;
    const am21 = a.m21;
    const am22 = a.m22;

    const bm00 = b.m00;
    const bm01 = b.m01;
    const bm02 = b.m02;
    const bm10 = b.m10;
    const bm11 = b.m11;
    const bm12 = b.m12;
    const bm20 = b.m20;
    const bm21 = b.m21;
    const bm22 = b.m22;

    return target.setComponents(
      am00 * bm00 + am01 * bm10 + am02 * bm20,
      am00 * bm01 + am01 * bm11 + am02 * bm21,
      am00 * bm02 + am01 * bm12 + am02 * bm22,
      am10 * bm00 + am11 * bm10 + am12 * bm20,
      am10 * bm01 + am11 * bm11 + am12 * bm21,
      am10 * bm02 + am11 * bm12 + am12 * bm22,
      am20 * bm00 + am21 * bm10 + am22 * bm20,
      am20 * bm01 + am21 * bm11 + am22 * bm21,
      am20 * bm02 + am21 * bm12 + am22 * bm22);
  }

  static mulVec3 (
    a = new Mat3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.m00 * b.x +
      a.m01 * b.y +
      a.m02 * b.z,

      a.m10 * b.x +
      a.m11 * b.y +
      a.m12 * b.z,

      a.m20 * b.x +
      a.m21 * b.y +
      a.m22 * b.z);
  }

  static sub (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      a.m00 - b.m00, a.m01 - b.m01, a.m02 - b.m02,
      a.m10 - b.m10, a.m11 - b.m11, a.m12 - b.m12,
      a.m20 - b.m20, a.m21 - b.m21, a.m22 - b.m22);
  }

  static transpose (
    m = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      m.m00, m.m10, m.m20,
      m.m01, m.m11, m.m21,
      m.m02, m.m12, m.m22);
  }
}