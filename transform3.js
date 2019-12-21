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

  toObject () {

    return {
      location: this._location.toObject(),
      rotation: this._rotation.toObject(),
      scale: this._scale.toObject()
    };
  }

  toString () {

    return [
      '{ location: ',
      this._location.toString(),
      ', rotation: ',
      this._rotation.toString(),
      ', scale: ',
      this._scale.toString(),
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
    source = new Vec3(1.0, 0.0, 0.0),
    target = new Vec3()) {

    return Quaternion.applyTo(
      transform.rotation,
      source,
      target);
  }

  static mulPoint (
    transform = new Transform3(),
    source = new Vec3(),
    target = new Vec3()) {

    Quaternion.applyTo(
      transform.rotation,
      source,
      target);
    Vec3.mul(
      transform.scale,
      target,
      target);
    Vec3.add(transform.location,
      target,
      target);
    return target;
  }

  static mulVector (
    transform = new Transform3(),
    source = new Vec3(1.0, 0.0, 0.0),
    target = new Vec3()) {

    Quaternion.applyTo(
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