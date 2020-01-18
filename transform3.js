'use strict';

class Transform3 {

  constructor (
    location = new Vec3(),
    rotation = new Quaternion(),
    scale = new Vec3(1.0, 1.0, 1.0)) {

    this._location = location;
    this._rotation = rotation;
    this._scale = scale;
  }

  get length () {

    return 10;
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
      case 0: case -10:
        return this._location.x;
      case 1: case -9:
        return this._location.y;
      case 2: case -8:
        return this._location.z;

      case 3: case -7:
        return this._rotation.real;
      case 4: case -6:
        return this._rotation.imag.x;
      case 5: case -5:
        return this._rotation.imag.y;
      case 6: case -4:
        return this._rotation.imag.z;

      case 7: case -3:
        return this._scale.x;
      case 8: case -2:
        return this._scale.y;
      case 9: case -1:
        return this._scale.z;

      default:
        return 0.0;
    }
  }

  hashCode () {

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ this._location.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._rotation.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._scale.hashCode();
    return hsh;
  }

  moveBy (direc = new Vec3()) {

    Vec3.add(this._location, direc, this._location);

    return this;
  }

  moveTo (
    location = new Vec3(),
    step = 1.0,
    easingFunc = Vec3.lerp) {

    easingFunc(
      this._location,
      location,
      step,
      this._location);

    return this;
  }

  reset () {

    Vec3.zero(this._location);
    Vec3.one(this._scale);
    Quaternion.identity(this._rotation);

    return this;
  }

  rotate (
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0)) {

    Quaternion.rotate(
      this._rotation,
      radians,
      axis,
      this._rotation);

    return this;
  }

  rotateX (radians = 0.0) {

    Quaternion.rotateX(
      this._rotation,
      radians,
      this._rotation);

    return this;
  }

  rotateY (radians = 0.0) {

    Quaternion.rotateY(
      this._rotation,
      radians,
      this._rotation);

    return this;
  }

  rotateZ (radians = 0.0) {

    Quaternion.rotateZ(
      this._rotation,
      radians,
      this._rotation);

    return this;
  }

  scaleBy (scalar = new Vec3()) {

    Vec3.add(this._scale, scalar, this._scale);

    return this;
  }

  scaleTo (
    scale = Vec3.one(),
    step = 1.0,
    easingFunc = Vec3.smoothStep) {

    easingFunc(
      this._scale,
      scale,
      step,
      this._scale);

    return this;
  }

  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -10:
        this._location.x = v;
        break;
      case 1: case -9:
        this._location.y = v;
        break;
      case 2: case -8:
        this._location.z = v;
        break;

      case 3: case -7:
        this._rotation.real = v;
        break;
      case 4: case -6:
        this._rotation.imag.x = v;
        break;
      case 5: case -5:
        this._rotation.imag.y = v;
        break;
      case 6: case -4:
        this._rotation.imag.z = v;
        break;

      case 7: case -3:
        this._scale.x = v;
        break;
      case 8: case -2:
        this._scale.y = v;
        break;
      case 9: case -1:
        this._scale.z = v;
        break;
    }

    return this;
  }

  setComponents (
    x = 0.0, y = 0.0, z = 0.0,
    real = 1.0, xi = 0.0, yj = 0.0, zk = 0.0,
    w = 1.0, h = 1.0, d = 1.0) {

    this._location.setComponents(x, y, z);
    this._rotation.setComponents(real, xi, yj, zk);
    this._scale.setComponents(w, h, d);

    return this;
  }

  toArray () {

    const loc = this._location;
    const rot = this._rotation;
    const ri = rot.imag;
    const scl = this._scale;

    return [
      loc.x, loc.y, loc.z,
      rot.real, ri.x, ri.y, ri.z,
      scl.x, scl.y, scl.z];
  }

  toJsonString (precision = 6) {

    return [
      '{\"location\":',
      this._location.toJsonString(precision),
      ',\"rotation\":',
      this._rotation.toJsonString(precision),
      ',\"scale\":',
      this._scale.toJsonString(precision),
      '}'
    ].join('');
  }

  toObject () {

    return {
      location: this._location.toObject(),
      rotation: this._rotation.toObject(),
      scale: this._scale.toObject()
    };
  }

  toString (precision = 4) {

    return [
      '{ location: ',
      this._location.toString(precision),
      ', rotation: ',
      this._rotation.toString(precision),
      ', scale: ',
      this._scale.toString(precision),
      ' }'
    ].join('');
  }

  static fromArray (
    arr = [0.0, 0.0, 0.0,
      1.0, 0.0, 0.0, 0.0,
      1.0, 1.0, 1.0],
    target = new Transform2()) {

    return target.setComponents(
      arr[0], arr[1], arr[2],
      arr[3], arr[4], arr[5], arr[6],
      arr[7], arr[8], arr[9]);
  }

  static fromSource (
    source = new Transform3(),
    target = new Transform3()) {

    const loc = source.location;
    const rot = source.rotation;
    const ri = rot.imag;
    const scl = source.scale;

    return target.setComponents(
      loc.x, loc.y, loc.z,
      rot.real, ri.x, ri.y, ri.z,
      scl.x, scl.y, scl.z);
  }

  static identity (target = new Transform3()) {

    return target.setComponents(
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0, 0.0,
      1.0, 1.0, 1.0);
  }

  static mulDir (
    transform = new Transform3(),
    source = Vec3.right(),
    target = new Vec3()) {

    return Quaternion.mulVector(
      transform.rotation,
      source,
      target);
  }

  static mulPoint (
    transform = new Transform3(),
    source = new Vec3(),
    target = new Vec3()) {

    Quaternion.mulVector(
      transform.rotation,
      source,
      target);

    Vec3.mul(
      transform.scale,
      target,
      target);

    Vec3.add(
      transform.location,
      target,
      target);

    return target;
  }

  static mulVector (
    transform = new Transform3(),
    source = Vec3.right(),
    target = new Vec3()) {

    Quaternion.mulVector(
      transform.rotation,
      source,
      target);

    Vec3.mul(
      transform.scale,
      target,
      target);

    return target;
  }
}