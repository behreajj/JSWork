'use strict';

/**
 * Groups together vectors which shape a Bezier curve into a
 * coordinate (or anchor point), fore handle (the following
 * control point) and rear handle (the preceding control
 * point).
 */
class Knot2 {

  /**
   * Creates a knot from a series of vectors.
   * 
   * @param {Vec2} coord the coordinate
   * @param {Vec2} foreHandle the fore handle
   * @param {Vec2} rearHandle the rear handle
   */
  constructor (
    coord = new Vec2(),
    foreHandle = new Vec2(),
    rearHandle = new Vec2()) {

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

    return 6;
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

  // alignHandles (
  //   rearDir = new Vec2(),
  //   foreDir = new Vec2(),
  //   rearScaled = new Vec2()) {

  //   return this.alignHandlesForward(
  //     rearDir,
  //     foreDir,
  //     rearScaled);
  // }

  // alignHandlesBackward (
  //   foreDir = new Vec2(),
  //   rearDir = new Vec2(),
  //   foreScaled = new Vec2()) {

  // }

  // alignHandlesForward (
  //   rearDir = new Vec2(),
  //   foreDir = new Vec2(),
  //   rearScaled = new Vec2()) {

  // }

  /**
   * Tests equivalence between this and another object.
   *
   * @param {object} obj the object
   * @returns the evaluation
   */
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
      case 0: case -6:
        return this._coord.x;
      case 1: case -5:
        return this._coord.y;

      case 2: case -4:
        return this._foreHandle.x;
      case 3: case -3:
        return this._foreHandle.y;

      case 4: case -2:
        return this._rearHandle.x;
      case 5: case -1:
        return this._rearHandle.y;

      default:
        return 0.0;
    }
  }

  /**
   * Returns a hash code for this knot based on its coordinate, fore handle and
   * rear handle.
   * @returns the hash code
   */
  hashCode () {

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ this._coord.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._foreHandle.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._rearHandle.hashCode();
    return hsh;
  }

  /**
   * Mirrors this knot's handles. Defaults to mirroring in the
   * forward direction.
   * 
   * @returns this knot
   */
  mirrorHandles () {

    return this.mirrorHandlesForward();
  }

  /**
   * Sets the forward-facing handle to mirror the rear-facing
   * handle: the fore will have the same magnitude and negated
   * direction of the rear.
   * 
   * @returns this knot
   */
  mirrorHandlesBackward () {

    this._foreHandle.setComponents(
      this._coord.x - (this._rearHandle.x - this._coord.x),
      this._coord.y - (this._rearHandle.y - this._coord.y));

    return this;
  }

  /**
   * Sets the rear-facing handle to mirror the forward-facing
   * handle: the rear will have the same magnitude and negated
   * direction of the fore.
   * 
   * @returns this knot
   */
  mirrorHandlesForward () {

    this.rearHandle.set(
      this._coord.x - (this._foreHandle.x - this._coord.x),
      this._coord.y - (this._foreHandle.y - this._coord.y));

    return this;
  }

  /**
   * Resets this knot to an initial state.
   * 
   * @returns this knot
   */
  reset () {

    Vec2.forward(this._foreHandle);
    Vec2.back(this._rearHandle);
    Vec2.zero(this._coord);

    return this;
  }

  /**
   * Reverses the knot's direction by swapping the fore- and
   * rear-handles.
   * 
   * @returns this knot
   */
  reverse () {

    const temp = this._foreHandle;
    this._foreHandle = this._rearHandle;
    this._rearHandle = temp;

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

    Vec2.rotateZInternal(
      this._coord,
      cosa, sina,
      this._coord);

    Vec2.rotateZInternal(
      this._foreHandle,
      cosa, sina,
      this._foreHandle);

    Vec2.rotateZInternal(
      this._rearHandle,
      cosa, sina,
      this._rearHandle);

    return this;
  }

  scale (v = Vec2.one()) {

    Vec2.mul(this._coord, v, this._coord);
    Vec2.mul(this._foreHandle, v, this._foreHandle);
    Vec2.mul(this._rearHandle, v, this._rearHandle);

    return this;
  }

  scaleForeHandleBy (scalar = 1.0) {

    this._foreHandle.x = this._coord.x + scalar * (this._foreHandle.x - this._coord.x);
    this._foreHandle.y = this._coord.y + scalar * (this._foreHandle.y - this._coord.y);

    return this;
  }

  scaleForeHandleTo (magnitude = 1.0) {

    Vec2.subNorm(this._foreHandle, this._coord,
      this._foreHandle);
    Vec2.scale(this._foreHandle, magnitude,
      this._foreHandle);
    Vec2.add(this._foreHandle, this._coord,
      this._foreHandle);

    return this;
  }

  scaleHandlesBy (scalar = 1.0) {

    this.scaleForeHandleBy(scalar);
    this.scaleRearHandleBy(scalar);

    return this;
  }

  scaleHandlesTo (magnitude = 1.0) {

    this.scaleForeHandleTo(magnitude);
    this.scaleRearHandleTo(magnitude);

    return this;
  }

  scaleRearHandleBy (scalar = 1.0) {

    this._rearHandle.x = this._coord.x + scalar * (this._rearHandle.x - this._coord.x);
    this._rearHandle.y = this._coord.y + scalar * (this._rearHandle.y - this._coord.y);

    return this;
  }

  scaleRearHandleTo (magnitude = 1.0) {

    Vec2.subNorm(
      this._rearHandle, this._coord,
      this._rearHandle);
    Vec2.scale(
      this._rearHandle, magnitude,
      this._rearHandle);
    Vec2.add(
      this._rearHandle, this._coord,
      this._rearHandle);

    return this;
  }

  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -6:
        this._coord.x = v;
        break;
      case 1: case -5:
        this._coord.y = v;
        break;

      case 2: case -4:
        this._foreHandle.x = v;
        break;
      case 3: case -3:
        this._foreHandle.y = v;
        break;

      case 4: case -2:
        this._rearHandle.x = v;
        break;
      case 5: case -1:
        this._rearHandle.y = v;
        break;
    }

    return this;
  }

  setComponents (
    xCo = 0.0, yCo = 0.0,
    xFh = 0.0, yFh = 0.0,
    xRh = 0.0, yRh = 0.0) {

    this._coord.setComponents(xCo, yCo);
    this._foreHandle.setComponents(xFh, yFh);
    this._rearHandle.setComponents(xRh, yRh);

    return this;
  }

  toArray () {

    return [
      this._coord.x,
      this._coord.y,

      this._foreHandle.x,
      this._foreHandle.y,

      this._rearHandle.x,
      this._rearHandle.y];
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

  translate (v = new Vec2()) {

    Vec2.add(this._coord, v, this._coord);
    Vec2.add(this._foreHandle, v, this._foreHandle);
    Vec2.add(this._rearHandle, v, this._rearHandle);

    return this;
  }

  static fromArray (
    arr = [0.0, 0.0,
      0.0, 0.0,
      0.0, 0.0],
    target = new Knot2()) {

    return target.setComponents(
      arr[0], arr[1],
      arr[2], arr[3],
      arr[4], arr[5]);
  }

  /**
   * 
   * @param {number} angle the angle in radians
   * @param {number} radius the radius
   * @param {number} handleMag the magnitude of the handles
   * @param {Knot2} target the output knot
   * @returns the knot
   */
  static fromPolar (
    angle = 0.0,
    radius = 1.0,
    handleMag = 1.3333333333333333,
    target = new Knot2()) {

    return Knot2.fromPolarInternal(
      Math.cos(angle),
      Math.sin(angle),
      radius, handleMag,
      target);
  }

  /**
   * 
   * @param {number} cosa cosine of the angle
   * @param {number} sina sine of the angle
   * @param {number} radius the radius
   * @param {number} handleMag the magnitude of the handles
   * @param {Knot2} target the output knot
   * @returns the knot
   */
  static fromPolarInternal (
    cosa = 1.0,
    sina = 0.0,
    radius = 1.0,
    handleMag = 1.3333333333333333,
    target = new Knot2()) {

    const co = target.coord;
    co.setComponents(
      cosa * radius,
      sina * radius);

    const hmsina = sina * handleMag;
    const hmcosa = cosa * handleMag;

    target.foreHandle.setComponents(
      co.x - hmsina,
      co.y + hmcosa);

    target.rearHandle.setComponents(
      co.x + hmsina,
      co.y - hmcosa);

    return target;
  }

  static fromSource (
    source = new Knot2(),
    target = new Knot2()) {

    const co = source.coord;
    const fh = source.foreHandle;
    const rh = source.rearHandle;

    return target.setComponents(
      co.x, co.y,
      fh.x, fh.y,
      rh.x, rh.y);
  }
}