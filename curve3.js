'use strict';

class Curve3 {

  constructor (
    closedLoop = false,
    knots = [
      new Knot3(
        new Vec3(-0.5, 0.0, 0.0),
        new Vec3(-0.25, 0.25, 0.0),
        new Vec3(-0.75, -0.25, 0.0)),

      new Knot3(
        new Vec3(0.5, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(0.0, 0.0, 0.0))]) {

    this._closedLoop = closedLoop;
    this._knots = knots;
  }

  get closedLoop () {

    return this._closedLoop;
  }

  get knots () {

    return this._knots;
  }

  get length () {

    return this._knots.length;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set closedLoop (v) {

    this._closedLoop = v;
  }

  [Symbol.iterator] () {

    let index = 0;
    return {
      next: () => {
        return {
          value: this._knots[index++],
          done: index > this.length
        };
      }
    };
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'string':
      default:
        return this.toString();
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

  evalFirst (
    ptTarget = new Vec3(),
    tnTarget = new Vec3()) {

    const kFirst = this._knots[0];

    return {
      point: Vec3.fromSource(
        kFirst.coord,
        ptTarget),

      tangent: Vec3.subNorm(
        kFirst.foreHandle,
        kFirst.coord,
        tnTarget)
    };
  }

  evalLast (
    ptTarget = new Vec3(),
    tnTarget = new Vec3()) {

    const kLast = this._knots[this._knots.length - 1];

    return {
      point: Vec3.fromSource(
        kLast.coord,
        ptTarget),

      tangent: Vec3.subNorm(
        kLast.coord,
        kLast.rearHandle,
        tnTarget)
    };
  }

  get (i = -1) {

    const kn = this._knots;
    const len = kn.length;
    const index = this._closedLoop ?
      i - Math.imul(len, Math.floor(i / len)) : i;
    return kn[index];
  }

  getFirst () {

    return this._knots[0];
  }

  getLast () {

    return this._knots[this._knots.length - 1];
  }

  insert (i = -1, knot = new Knot2()) {

    const kn = this._knots;
    const len = kn.length;
    const index = this._closedLoop ?
      i - Math.imul(len, Math.floor(i / len)) : i;
    kn.splice(index, 0, knot);
    return this;
  }

  hashCode () {

    const bhsh = this._closedLoop ? 1231 : 1237;

    let arrhsh = 0;
    const len = this._knots.length;
    for (let i = 0; i < len; ++i) {
      const knot = this._knots[i];
      arrhsh = Math.imul(31, arrhsh) ^ knot.hashCode() | 0;
    }
    arrhsh >>>= 0;

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ bhsh;
    hsh = Math.imul(16777619, hsh) ^ arrhsh;
    return hsh;
  }

  removeAt(i = 0) {

    return this._knots.splice(i, 1)[0];
  }

  removeFirst () {

    return this._knots.splice(0, 1)[0];
  }

  removeLast () {

    return this._knots.pop();
  }

  reset () {

    this._knots = [
      new Knot3(
        new Vec3(-0.5, 0.0, 0.0),
        new Vec3(-0.25, 0.25, 0.0),
        new Vec3(-0.75, -0.25, 0.0)),

      new Knot3(
        new Vec3(0.5, 0.0, 0.0),
        new Vec3(1.0, 0.0, 0.0),
        new Vec3(0.0, 0.0, 0.0))
    ];

    this._closedLoop = false;

    return this;
  }

  reverse () {

    this._knots.reverse();

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].reverse();
    }

    return this;
  }

  rotate (
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0)) {

    const cosa = Math.cos(radians);
    const sina = Math.sin(radians);

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].rotateInternal(cosa, sina, axis);
    }

    return this;
  }

  rotateX (radians = 0.0) {

    const cosa = Math.cos(radians);
    const sina = Math.sin(radians);

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].rotateXInternal(cosa, sina);
    }

    return this;
  }

  rotateY (radians = 0.0) {

    const cosa = Math.cos(radians);
    const sina = Math.sin(radians);

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].rotateYInternal(cosa, sina);
    }

    return this;
  }

  rotateZ (radians = 0.0) {

    const cosa = Math.cos(radians);
    const sina = Math.sin(radians);

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].rotateZInternal(cosa, sina);
    }

    return this;
  }

  scale (v = new Vec3(1.0, 1.0, 1.0)) {

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].scale(v);
    }

    return this;
  }

  toJsonString (precision = 6) {

    const result = [
      '{\"closedLoop\":',
      this._closedLoop,
      ',\"knots\":['];

    const kn = this._knots;
    const len = kn.length;
    const last = len - 1;
    for (let i = 0; i < len; ++i) {
      result.push(kn[i].toJsonString(precision));
      if (i < last) {
        result.push(',');
      }
    }

    result.push(']}')
    return result.join('');
  }

  toString (precision = 4) {

    const result = [
      '{ closedLoop: ',
      this._closedLoop,
      ', knots: [ '];

    const kn = this._knots;
    const len = kn.length;
    const last = len - 1;
    for (let i = 0; i < len; ++i) {
      result.push(kn[i].toString(precision));
      if (i < last) {
        result.push(', ');
      }
    }

    result.push(' ] }');
    return result.join('');
  }

  translate (v = new Vec3()) {

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].translate(v);
    }

    return this;
  }
}