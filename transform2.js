'use strict';

class Transform2 {

  constructor (
    location = new Vec2(),
    rotation = 0.0,
    scale = new Vec2(1.0, 1.0)) {

    this._location = location;
    this._rotation = rotation;
    this._scale = scale;
  }

  get length () {

    return 5;
  }

  get location () {

    return this._location;
  }

  get rotation () {

    return this._rotation;
  }

  get scale () {

    return this._scale;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set location (v) {

    this._location = v;
  }

  set rotation (v) {

    this._rotation = v;
  }

  set scale (v) {

    this._scale = v;
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
      default:
        return this.toString();
    }
  }

  get (i = -1) {

    switch (i) {
      case 0: case -5:
        return this._location.x;
      case 1: case -4:
        return this._location.y;
      case 2: case -3:
        return this._rotation;
      case 3: case -2:
        return this._scale.x;
      case 4: case -1:
        return this._scale.y;
      default:
        return 0.0;
    }
  }

  moveBy (direc = new Vec2()) {

    Vec2.add(this._location, direc, this._location);

    return this;
  }

  moveTo (
    location = new Vec2(),
    step = 1.0,
    easingFunc = Vec2.lerp) {

    easingFunc(
      this._location,
      location,
      step,
      this._location);

    return this;
  }

  reset () {

    Vec2.zero(this._location);
    Vec2.one(this._scale);
    this._rotation = 0.0;

    return this;
  }

  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -5:
        this._location.x = v;
        break;
      case 1: case -4:
        this._location.y = v;
        break;
      case 2: case -3:
        this._rotation = v;
        break;
      case 3: case -2:
        this._scale.x = v;
        break;
      case 4: case -1:
        this._scale.y = v;
        break;
    }

    return this;
  }

  rotateTo (radians = 0.0, step = 1.0) {

    if (step <= 0.0) {
      return this;
    }

    if (step >= 1.0) {
      this._rotation = Utils.modRadians(radians);
      return this;
    }

    let a = Utils.modRadians(this._rotation);
    let b = Utils.modRadians(radians);
    const diff = b - a;
    let modResult = false;

    if (a < b && diff > Math.PI) {
      a += Math.PI;
      modResult = true;
    } else if (a > b && diff > -Math.PI) {
      b += Math.PI;
      modResult = true;
    }

    let rNew = Utils.lerpUnclamped(a, b, step);
    if (modResult) { rNew = Utils.modRadians(rNew); }
    this._rotation = rNew;

    return this;
  }

  rotateZ (radians = 0.0) {

    this._rotation += radians;

    return this;
  }

  scaleBy1 (scalar = 1.0) {

    Vec2.scale(this._scale, scalar, this._scale);

    return this;
  }

  scaleBy2 (scalar = new Vec2()) {

    Vec2.mul(this._scale, scalar, this._scale);

    return this;
  }

  scaleTo (
    scale = Vec2.one(),
    step = 1.0,
    easingFunc = Vec2.smoothStep) {

    easingFunc(
      this._scale,
      scale,
      step,
      this._scale);

    return this;
  }

  setComponents (
    x = 0.0,
    y = 0.0,
    theta = 0.0,
    w = 1.0,
    h = 1.0) {

    this._location.setComponents(x, y);
    this._rotation = theta;
    this._scale.setComponents(w, h);

    return this;
  }

  toArray () {

    return [
      this._location.x,
      this._location.y,
      this._rotation,
      this._scale.x,
      this._scale.y];
  }

  toJsonString (precision = 6) {

    return [
      '{\"location\":',
      this._location.toJsonString(precision),
      ',\"rotation\": ',
      this._rotation.toFixed(precision),
      ',\"scale:\"',
      this._scale.toJsonString(precision),
      '}'
    ].join('');
  }

  toObject () {

    return {
      location: this._location.toObject(),
      rotation: this._rotation,
      scale: this._scale.toObject()
    };
  }

  toString (precision = 4) {

    return [
      '{ location: ',
      this._location.toString(precision),
      ', rotation: ',
      this._rotation.toFixed(precision),
      ', scale: ',
      this._scale.toString(precision),
      ' }'
    ].join('');
  }

  static fromArray (
    arr = [0.0, 0.0, 0.0, 1.0, 1.0],
    target = new Transform2()) {

    return target.setComponents(
      arr[0], arr[1],
      arr[2],
      arr[3], arr[4]);
  }

  static fromSource (
    source = new Transform2(),
    target = new Transform2()) {

    return target.setComponents(
      source.location.x,
      source.location.y,
      source.rotation,
      source.scale.x,
      source.scale.y);
  }

  static identity (target = new Transform2()) {

    return target.setComponents(
      0.0, 0.0, 0.0, 1.0, 1.0);
  }

  static mulDir (
    transform = new Transform2(),
    source = Vec2.right(),
    target = new Vec2()) {

    return Vec2.rotateZ(
      source,
      transform.rotation,
      target);
  }

  static mulPoint (
    transform = new Transform2(),
    source = new Vec2(),
    target = new Vec2()) {

    Vec2.rotateZ(
      source,
      transform.rotation,
      target);

    Vec2.mul(
      transform.scale,
      target,
      target);

    Vec2.add(
      transform.location,
      target,
      target);

    return target;
  }

  static mulVector (
    transform = new Transform2(),
    source = Vec2.right(),
    target = new Vec2()) {

    Vec2.rotateZ(
      source,
      transform.rotation,
      target);

    Vec2.mul(
      transform.scale,
      target,
      target);

    return target;
  }

  static toAxes (
    transform = new Transform2(),
    right = new Vec2(),
    forward = new Vec2()) {

    Vec2.fromPolar(transform.rotation, 1.0, right);
    Vec2.perpendicularCCW(right, forward);

    return {
      forward: forward,
      right: right
    };
  }
}