'use strict';

class Curve2 {

  constructor (
    closedLoop = false,
    knots = [
      new Knot2(
        new Vec2(-0.5, 0.0),
        new Vec2(-0.25, 0.25),
        new Vec2(-0.75, -0.25)),

      new Knot2(
        new Vec2(0.5, 0.0),
        new Vec2(1.0, 0.0),
        new Vec2(0.0, 0.0))]) {

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

  evalFirst (
    ptTarget = new Vec2(),
    tnTarget = new Vec2()) {

    const kFirst = this._knots[0];

    return {
      point: Vec2.fromSource(
        kFirst.coord,
        ptTarget),

      tangent: Vec2.subNorm(
        kFirst.foreHandle,
        kFirst.coord,
        tnTarget)
    };
  }

  evalLast (
    ptTarget = new Vec2(),
    tnTarget = new Vec2()) {

    const kLast = this._knots[this._knots.length - 1];

    return {
      point: Vec2.fromSource(
        kLast.coord,
        ptTarget),

      tangent: Vec2.subNorm(
        kLast.coord,
        kLast.rearHandle,
        tnTarget)
    };
  }

  get (i = -1) {

    const kn = this._knots;
    const len = kn.length;
    const index = this._closedLoop ?
      i - len * Math.floor(i / len) : i;
    return kn[index];
  }

  getFirst () {

    return this._knots[0];
  }

  getLast () {

    return this._knots[this._knots.length - 1];
  }

  removeFirst () {

    return this._knots.splice(0, 1)[0];
  }

  removeLast () {

    return this._knots.pop();
  }

  reset () {

    this._knots = [
      new Knot2(
        new Vec2(-0.5, 0.0),
        new Vec2(-0.25, 0.25),
        new Vec2(-0.75, -0.25)),

      new Knot2(
        new Vec2(0.5, 0.0),
        new Vec2(1.0, 0.0),
        new Vec2(0.0, 0.0))
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

  scale (v = new Vec2(1.0, 1.0)) {

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].scale(v);
    }

    return this;
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

    result.push(' ] }')
    return result.join('');
  }

  translate (v = new Vec2()) {

    const kn = this._knots;
    const len = kn.length;
    for (let i = 0; i < len; ++i) {
      kn[i].translate(v);
    }

    return this;
  }
}