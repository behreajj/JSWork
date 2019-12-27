'use strict';

class Knot3 {

  constructor (
    coord,
    foreHandle,
    rearHandle) {

    this._coord = coord;
    this._foreHandle = foreHandle;
    this._rearHandle = rearHandle;
  }

  get coord () {

    return this._coord;
  }

  get foreHandle () {

    return this._foreHandle;
  }

  get length () {

    return 9;
  }

  get rearHandle () {

    return this._rearHandle;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set coord (v) {

    this._coord = v;
  }

  set foreHandle (v) {

    this._foreHandle = v;
  }

  set rearHandle (v) {

    this._rearHandle = v;
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
      case 0: case -9:
        return this._coord.x;
      case 1: case -8:
        return this._coord.y;
      case 2: case -7:
        return this._coord.z;

      case 3: case -6:
        return this._foreHandle.x;
      case 4: case -5:
        return this._foreHandle.y;
      case 5: case -4:
        return this._foreHandle.z;

      case 6: case -3:
        return this._rearHandle.x;
      case 7: case -2:
        return this._rearHandle.y;
      case 8: case -1:
        return this._rearHandle.z;

      default:
        return 0.0;
    }
  }

  reset () {

    Vec3.forward(this._foreHandle);
    Vec3.back(this._rearHandle);
    Vec3.zero(this._coord);

    return this;
  }

  reverse () {

    const temp = this._foreHandle;
    this._foreHandle = this._rearHandle;
    this._rearHandle = temp;

    return this;
  }

  rotate (
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0)) {

    return this.rotateInternal(
      Math.cos(radians),
      Math.sin(radians),
      axis);
  }

  rotateInternal (
    cosa = 1.0,
    sina = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0)) {

    Vec3.rotateInternal(
      this._coord,
      cosa, sina, axis,
      this._coord);

    Vec3.rotateInternal(
      this._foreHandle,
      cosa, sina, axis,
      this._foreHandle);

    Vec3.rotateInternal(
      this._rearHandle,
      cosa, sina, axis,
      this._rearHandle);

    return this;
  }

  rotateX (radians = 0.0) {

    return this.rotateXInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  rotateXInternal (
    cosa = 1.0,
    sina = 0.0) {

    Vec3.rotateXInternal(
      this._coord,
      cosa, sina,
      this._coord);

    Vec3.rotateXInternal(
      this._foreHandle,
      cosa, sina,
      this._foreHandle);

    Vec3.rotateXInternal(
      this._rearHandle,
      cosa, sina,
      this._rearHandle);

    return this;
  }

  rotateY (radians = 0.0) {

    return this.rotateYInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  rotateYInternal (
    cosa = 1.0,
    sina = 0.0) {

    Vec3.rotateYInternal(
      this._coord,
      cosa, sina,
      this._coord);

    Vec3.rotateYInternal(
      this._foreHandle,
      cosa, sina,
      this._foreHandle);

    Vec3.rotateYInternal(
      this._rearHandle,
      cosa, sina,
      this._rearHandle);

    return this;
  }

  rotateZ (radians = 0.0) {

    return this.rotateZInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  rotateZInternal (
    cosa = 1.0,
    sina = 0.0) {

    Vec3.rotateZInternal(
      this._coord,
      cosa, sina,
      this._coord);

    Vec3.rotateZInternal(
      this._foreHandle,
      cosa, sina,
      this._foreHandle);

    Vec3.rotateZInternal(
      this._rearHandle,
      cosa, sina,
      this._rearHandle);

    return this;
  }

  scale (v = new Vec3(1.0, 1.0, 1.0)) {

    Vec3.mul(this._coord, v, this._coord);
    Vec3.mul(this._foreHandle, v, this._foreHandle);
    Vec3.mul(this._rearHandle, v, this._rearHandle);

    return this;
  }

  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -9:
        this._coord.x = v;
        break;
      case 1: case -8:
        this._coord.y = v;
        break;
      case 2: case -7:
        this._coord.z = v;
        break;

      case 3: case -6:
        this._foreHandle.x = v;
        break;
      case 4: case -5:
        this._foreHandle.y = v;
        break;
      case 5: case -4:
        this._foreHandle.z = v;
        break;

      case 6: case -3:
        this._rearHandle.x = v;
        break;
      case 7: case -2:
        this._rearHandle.y = v;
        break;
      case 8: case -1:
        this._rearHandle.z = v;
        break;
    }

    return this;
  }

  setComponents (
    xCo = 0.0, yCo = 0.0, zCo = 0.0,
    xFh = 0.0, yFh = 0.0, zFh = 0.0,
    xRh = 0.0, yRh = 0.0, zRh = 0.0) {

    this._coord.setComponents(xCo, yCo, zCo);
    this._foreHandle.setComponents(xFh, yFh, zFh);
    this._rearHandle.setComponents(xRh, yRh, zRh);

    return this;
  }

  toJsonString (precision = 6) {

    return [
      '{\"coord\":',
      this._coord.toJsonString(precision),
      ',\"foreHandle\":',
      this._foreHandle.toJsonString(precision),
      ',\"rearHandle\":',
      this._rearHandle.toJsonString(precision),
      '}'
    ].join('');
  }

  toArray () {

    return [
      this._coord.x,
      this._coord.y,
      this._coord.z,

      this._foreHandle.x,
      this._foreHandle.y,
      this._foreHandle.z,

      this._rearHandle.x,
      this._rearHandle.y,
      this._rearHandle.z];
  }

  toObject () {

    return {
      coord: this._coord.toObject(),
      foreHandle: this._foreHandle.toObject(),
      rearHandle: this._rearHandle.toObject()
    };
  }

  toString (precision = 4) {

    return [
      '{ coord: ',
      this._coord.toString(precision),
      ', foreHandle: ',
      this._foreHandle.toString(precision),
      ', rearHandle: ',
      this._rearHandle.toString(precision),
      ' }'
    ].join('');
  }

  translate (v = new Vec3()) {

    Vec3.add(this._coord, v, this._coord);
    Vec3.add(this._foreHandle, v, this._foreHandle);
    Vec3.add(this._rearHandle, v, this._rearHandle);

    return this;
  }

  static fromArray (
    arr = [0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0],
    target = new Knot3()) {

    return target.setComponents(
      arr[0], arr[1], arr[2],
      arr[3], arr[4], arr[5],
      arr[6], arr[7], arr[8]);
  }

  static fromPolar (
    angle = 0.0,
    radius = 1.0,
    handleMag = 1.3333333333333333,
    target = new Knot3()) {

    const cosa = Math.cos(angle);
    const sina = Math.sin(angle);

    const co = target.coord;
    co.setComponents(
      cosa * radius,
      sina * radius,
      0.0);

    const hmsina = sina * handleMag;
    const hmcosa = cosa * handleMag;

    target.foreHandle.setComponents(
      co.x - hmsina,
      co.y + hmcosa,
      0.0);
    target.rearHandle.setComponents(
      co.x + hmsina,
      co.y - hmcosa,
      0.0);

    return target;
  }

  static fromSource (
    source = new Knot3(),
    target = new Knot3()) {

    const co = source.coord;
    const fh = source.foreHandle;
    const rh = source.rearHandle;

    return target.setComponents(
      co.x, co.y, co.z,
      fh.x, fh.y, fh.z,
      rh.x, rh.y, rh.z);
  }
}