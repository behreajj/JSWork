'use strict';

class Complex {

  constructor (real = 0.0, imag = 0.0) {

    this._real = real;
    this._imag = imag;
  }

  get imag () {

    return this._imag;
  }

  get length () {

    return 2;
  }

  get real () {

    return this._real;
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
        return Complex.abs(this);
    }
  }

  equals (obj) {

    if (!obj) { return false; }
    if (this === obj) { return true; }
    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }
    return this.hashCode() === obj.hashCode();
  }

  get (i = -1) {

    switch (i) {
      case 0: case -2:
        return this._real;
      case 1: case -1:
        return this._imag;
      default:
        return 0.0;
    }
  }

  hashCode () {

    /* real hash code. */
    const rstr = String(this._real);
    const len0 = rstr.length;
    let rhsh = 0;
    for (let i = 0; i < len0; ++i) {
      rhsh = Math.imul(31, rhsh) ^ rstr.charCodeAt(i) | 0;
    }
    rhsh >>>= 0;

    /* imag hash code. */
    const istr = String(this._imag);
    const len1 = istr.length;
    let ihsh = 0;
    for (let j = 0; j < len1; ++j) {
      ihsh = Math.imul(31, ihsh) ^ istr.charCodeAt(j) | 0;
    }
    ihsh >>>= 0;

    /* Composite hash code. */
    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ rhsh;
    hsh = Math.imul(16777619, hsh) ^ ihsh;
    return hsh;
  }

  reset () {

    this._real = 0.0;
    this._imag = 0.0;

    return this;
  }

  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -2:
        this._real = v;
        break;
      case 1: case -1:
        this._imag = v;
        break;
    }

    return this;
  }

  setComponents (real = 0.0, imag = 0.0) {

    this._real = real;
    this._imag = imag;

    return this;
  }

  toArray () {

    return [this._real, this._imag];
  }

  toJsonString (precision = 6) {

    return [
      '{\"real\":',
      this._real.toFixed(precision),
      ',\"imag\":',
      this._imag.toFixed(precision),
      '}'
    ].join('');
  }

  toObject () {

    return { real: this._real, imag: this._imag };
  }

  toString (precision = 4) {

    return [
      '{ real: ',
      this._real.toFixed(precision),
      ', imag: ',
      this._imag.toFixed(precision),
      ' }'
    ].join('');
  }

  static abs (z = new Complex()) {

    return Math.hypot(z.real, z.imag);
  }

  static absSq (z = new Complex()) {

    return z.real * z.real + z.imag * z.imag;
  }

  static add (
    a = new Complex(),
    b = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      a.real + b.real,
      a.imag + b.imag);
  }

  static all (z = new Complex()) {

    return (z.imag !== 0.0) &&
      (z.real !== 0.0);
  }

  static any (z = new Complex()) {

    return (z.imag !== 0.0) ||
      (z.real !== 0.0);
  }

  static approx (
    a = new Complex(),
    b = new Complex(),
    tolerance = 0.000001) {

    return (a === b) ||
      (Math.abs(b.imag - a.imag) < tolerance &&
        Math.abs(b.real - a.real) < tolerance);
  }

  static compareImagReal (
    a = new Complex(),
    b = new Complex()) {

    if (a.imag > b.imag) { return 1; }
    if (a.imag < b.imag) { return -1; }
    if (a.real > b.real) { return 1; }
    if (a.real < b.real) { return -1; }

    return 0;
  }

  static conj (
    z = new Complex(),
    target = new Complex()) {

    return target.setComponents(z.real, -z.imag);
  }

  static cos (
    z = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      Math.cos(z.real) * Math.cosh(z.imag),
      -Math.sin(z.real) * Math.sinh(z.imag));
  }

  static div (
    a = new Complex(),
    b = new Complex(),
    target = new Complex()) {

    const bAbsSq = Complex.absSq(b);
    if (bAbsSq === 0.0) {
      return target.reset();
    }

    const bInvAbsSq = 1.0 / bAbsSq;
    const cReal = b.real * bInvAbsSq;
    const cImag = -b.imag * bInvAbsSq;
    return target.setComponents(
      a.real * cReal - a.imag * cImag,
      a.real * cImag + a.imag * cReal);
  }

  static exp (
    z = new Complex(),
    target = new Complex()) {

    const r = Math.exp(z.real);
    return target.setComponents(
      r * Math.cos(z.imag),
      r * Math.sin(z.imag));
  }

  static fromArray (
    arr = [0.0, 0.0],
    target = new Complex()) {

    return target.setComponents(
      arr[0],
      arr[1]);
  }

  static fromSource (
    source = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      source.real,
      source.imag);
  }

  static inverse (
    z = new Complex(),
    target = new Complex()) {

    const absSq = Complex.absSq(z);
    if (absSq <= 0.0) {
      return target.reset();
    }

    const invAbsSq = 1.0 / absSq;
    return target.setComponents(
      z.real * invAbsSq,
      -z.imag * invAbsSq);
  }

  static isUnit (z = new Complex()) {

    return Complex.approxAbs(z, 1.0);
  }

  static log (
    z = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      Math.log(Complex.abs(z)),
      Complex.phase(z));
  }

  static mobius (
    a = new Complex(),
    b = new Complex(),
    c = new Complex(),
    d = new Complex(),
    z = new Complex(),
    target = new Complex()) {

    const czdr = c.real * z.real - c.imag * z.imag + d.real;
    const czdi = c.real * z.imag + c.imag * z.real + d.imag;
    const mSq = czdr * czdr + czdi * czdi;

    if (mSq < 0.000001) {
      return target.reset();
    }

    const azbr = a.real * z.real - a.imag * z.imag + b.real;
    const azbi = a.real * z.imag + a.imag * z.real + b.imag;

    const mSqInv = 1.0 / mSq;
    const czdrInv = czdr * mSqInv;
    const czdiInv = -czdi * mSqInv;

    return target.setComponents(
      azbr * czdrInv - azbi * czdiInv,
      azbr * czdiInv + azbi * czdrInv);
  }

  static mul (
    a = new Complex(),
    b = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      a.real * b.real - a.imag * b.imag,
      a.real * b.imag + a.imag * b.real);
  }

  static none (z = new Complex()) {

    return z.real === 0.0 && z.imag === 0.0;
  }

  static phase (z = new Complex()) {

    return Math.atan2(z.imag, z.real);
  }

  static pow (
    a = new Complex(),
    b = new Complex(),
    target = new Complex()) {

    const logReal = Math.log(Complex.abs(a));
    const logImag = Complex.phase(a);
    const phi = b.real * logImag + b.imag * logReal;
    const r = Math.exp(b.real * logReal - b.imag * logImag);

    return Complex.rect(r, phi, target);
  }

  static random (
    rMin = 1.0,
    rMax = 1.0,
    target = new Complex()) {

    const pFac = Math.random();
    const rFac = Math.random();

    return Complex.rect(
      (1.0 - rFac) * rMin + rFac * rMax,
      (1.0 - pFac) * -3.141592653589793 + pFac * 3.141592653589793,
      target);
  }

  static rect (
    r = 1.0,
    phi = 0.0,
    target = new Complex()) {

    return target.setComponents(
      r * Math.cos(phi),
      r * Math.sin(phi));
  }

  static scale (
    a = new Complex(),
    b = 1.0,
    target = new Complex()) {

    return target.setComponents(
      a.real * b,
      a.imag * b);
  }

  static sin (
    z = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      Math.sin(z.real) * Math.cosh(z.imag),
      Math.cos(z.real) * Math.sinh(z.imag));
  }

  static sub (
    a = new Complex(),
    b = new Complex(),
    target = new Complex()) {

    return target.setComponents(
      a.real - b.real,
      a.imag - b.imag);
  }

  static zero (target = new Complex()) {

    return target.setComponents(0.0, 0.0);
  }
}

/* Aliases. */
Complex.compare = Complex.compareImagReal;