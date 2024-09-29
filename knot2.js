'use strict';

/**
 * Groups together vectors which shape a Bezier curve into a coordinate (or
 * anchor point), fore handle (the following control point) and rear handle (the
 * preceding control point).
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

    /**
     * The spatial coordinate of the knot.
     */
    this._coord = coord;

    /**
     * The handle which warps the curve segment heading away from the knot along
     * the direction of the curve.
     */
    this._foreHandle = foreHandle;

    /**
     * The handle which warps the curve segment heading towards the knot along
     * the direction of the curve.
     */
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

  /**
   * Aligns this knot's handles in the same direction while preserving their
   * magnitude.
   *
   * @returns this knot
   */
  alignHandles () {

    return this.alignHandlesForward();
  }

  /**
   * Aligns this knot's fore handle to its rear handle while preserving
   * magnitude.
   * 
   * @returns this knot
   */
  alignHandlesBackward () {

    const cox = this._coord.x;
    const coy = this._coord.y;

    const rearDirx = this._rearHandle.x - cox;
    const rearDiry = this._rearHandle.y - coy;
    const rearMagSq = rearDirx * rearDirx + rearDiry * rearDiry;
    if (rearMagSq <= 0.0) {
      this._foreHandle.x = cox;
      this._foreHandle.y = coy;
      return this;
    }

    const foreDirx = this._foreHandle.x - cox;
    const foreDiry = this._foreHandle.y - coy;
    const foreMagSq = foreDirx * foreDirx + foreDiry * foreDiry;
    if (foreMagSq <= 0.0) {
      this._foreHandle.x = cox;
      this._foreHandle.y = coy;
      return this;
    }

    const flipRescale = -Math.sqrt(foreMagSq) / Math.sqrt(rearMagSq);
    this._foreHandle.x = rearDirx * flipRescale + cox;
    this._foreHandle.y = rearDiry * flipRescale + coy;

    return this;
  }

  /**
   * Aligns this knot's rear handle to its fore handle while preserving
   * magnitude.
   *
   * @returns this knot
   */
  alignHandlesForward () {

    const cox = this._coord.x;
    const coy = this._coord.y;

    const foreDirx = this._foreHandle.x - cox;
    const foreDiry = this._foreHandle.y - coy;
    const foreMagSq = foreDirx * foreDirx + foreDiry * foreDiry;
    if (foreMagSq <= 0.0) {
      this._rearHandle.x = cox;
      this._rearHandle.y = coy;
      return this;
    }

    const rearDirx = this._rearHandle.x - cox;
    const rearDiry = this._rearHandle.y - coy;
    const rearMagSq = rearDirx * rearDirx + rearDiry * rearDiry;
    if (rearMagSq <= 0.0) {
      this._rearHandle.x = cox;
      this._rearHandle.y = coy;
      return this;
    }

    const flipRescale = -Math.sqrt(rearMagSq) / Math.sqrt(foreMagSq);
    this._rearHandle.x = foreDirx * flipRescale + cox;
    this._rearHandle.y = foreDiry * flipRescale + coy;
    return this;
  }

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

  /**
   * Gets a component of this knot by index.
   *
   * @param {number} i the index
   * @returns the value
   */
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

  rotateForeHandleZ (radians = 0.0) {

    return this.rotateForeHandleZInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  rotateForeHandleZInternal (
    cosa = 1.0,
    sina = 0.0) {

    Vec2.sub(
      this._coord,
      this._foreHandle,
      this._foreHandle);

    Vec2.rotateZInternal(
      this._foreHandle,
      cosa, sina,
      this._foreHandle);

    Vec2.add(
      this._coord,
      this._foreHandle,
      this._foreHandle);

    return this;
  }

  /**
   * Rotates this knot around the z axis by an angle in radians.
   *
   * @param {number} radians the angle
   * @returns this knot
   */
  rotateZ (radians = 0.0) {

    return this.rotateZInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  /**
   * Rotates a knot around the z axis. Accepts pre-calculated sine and cosine of
   * an angle, so that collections of knots can be efficiently rotated without
   * repeatedly calling cos and sin.
   *
   * @param {number} cosa cosine of the angle
   * @param {number} sina sine of the angle
   * @returns this knot
   */
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

  /**
   * Scales this knot by a uniform scalar.
   * 
   * @param {number} us the uniform scalar
   * @returns this knot
   */
  scale1 (us = 1.0) {

    Vec2.scale(this._coord, us, this._coord);
    Vec2.scale(this._foreHandle, us, this._foreHandle);
    Vec2.scale(this._rearHandle, us, this._rearHandle);

    return this;
  }

  /**
   * Scales this knot by a non uniform scalar.
   * 
   * @param {Vec2} nus the non uniform scalar
   * @returns this knot
   */
  scale2 (nus = Vec2.one()) {

    Vec2.mul(this._coord, nus, this._coord);
    Vec2.mul(this._foreHandle, nus, this._foreHandle);
    Vec2.mul(this._rearHandle, nus, this._rearHandle);

    return this;
  }

  /**
   * Scales the fore handle by a factor.
   *
   * @param {number} scalar the scalar
   * @returns this knot
   */
  scaleForeHandleBy (scalar = 1.0) {

    this._foreHandle.x = this._coord.x + scalar *
      (this._foreHandle.x - this._coord.x);
    this._foreHandle.y = this._coord.y + scalar *
      (this._foreHandle.y - this._coord.y);

    return this;
  }

  /**
   * Scales the fore handle to a magnitude.
   *
   * @param {number} magnitude the magnitude
   * @returns this knot
   */
  scaleForeHandleTo (magnitude = 1.0) {

    Vec2.subNorm(
      this._foreHandle, this._coord,
      this._foreHandle);
    Vec2.scale(
      this._foreHandle, magnitude,
      this._foreHandle);
    Vec2.add(
      this._foreHandle, this._coord,
      this._foreHandle);

    return this;
  }

  /**
   * Scales both the fore and rear handle by a factor.
   *
   * @param {number} scalar the scalar
   * @returns this knot
   */
  scaleHandlesBy (scalar = 1.0) {

    this.scaleForeHandleBy(scalar);
    this.scaleRearHandleBy(scalar);

    return this;
  }

  /**
   * Scales both the fore and rear handle to a magnitude.
   *
   * @param {number} magnitude the magnitude
   * @returns this knot
   */
  scaleHandlesTo (magnitude = 1.0) {

    this.scaleForeHandleTo(magnitude);
    this.scaleRearHandleTo(magnitude);

    return this;
  }

  /**
   * Scales the rear handle by a factor.
   *
   * @param {number} scalar the scalar
   * @returns this knot
   */
  scaleRearHandleBy (scalar = 1.0) {

    this._rearHandle.x = this._coord.x + scalar *
      (this._rearHandle.x - this._coord.x);
    this._rearHandle.y = this._coord.y + scalar *
      (this._rearHandle.y - this._coord.y);

    return this;
  }

  /**
   * Scales the rear handle to a magnitude.
   *
   * @param {number} magnitude the magnitude
   * @returns this knot
   */
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

  /**
   * Sets a component of this knot by index.
   *
   * @param {number} i the index
   * @param {number} v the value
   * @returns this knot
   */
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

  /**
   * Sets the components of this knot.
   *
   * @param {number} xCo the coordinate x
   * @param {number} yCo the coordinate y
   * @param {number} xFh the fore handle x
   * @param {number} yFh the fore handle y
   * @param {number} xRh the rear handle x
   * @param {number} yRh the rear handle y
   * @returns this knot
   */
  setComponents (
    xCo = 0.0, yCo = 0.0,
    xFh = 0.0, yFh = 0.0,
    xRh = 0.0, yRh = 0.0) {

    this._coord.setComponents(xCo, yCo);
    this._foreHandle.setComponents(xFh, yFh);
    this._rearHandle.setComponents(xRh, yRh);

    return this;
  }

  /**
   * Returns an array of length 6 containing this knot's components.
   *
   * @returns the array
   */
  toArray () {

    return [
      this._coord.x,
      this._coord.y,

      this._foreHandle.x,
      this._foreHandle.y,

      this._rearHandle.x,
      this._rearHandle.y];
  }

  /**
   * Returns a JSON formatted string.
   * 
   * @param {number} precision number of decimal places
   * @returns the string
   */
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

  /**
   * Returns an object literal with this knot's components.
   *
   * @returns the object
   */
  toObject () {

    return {
      coord: this._coord.toObject(),
      foreHandle: this._foreHandle.toObject(),
      rearHandle: this._rearHandle.toObject()
    };
  }

  /**
   * Returns a string representation of this knot.
   * 
   * @param {number} precision the print precision
   * @returns the string
   */
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

  /**
   * Multiplies this knot by a transform.
   * 
   * @param {Transform2} tr the transform
   * @returns this knot
   */
  transform (tr = new Transform2()) {

    Transform2.mulPoint(tr, this._coord, this._coord);
    Transform2.mulPoint(tr, this._foreHandle, this._foreHandle);
    Transform2.mulPoint(tr, this._rearHandle, this._rearHandle);

    return this;
  }

  /**
   * Translates this knot by a vector.
   * 
   * @param {Vec2} v the vector
   * @returns this knot
   */
  translate (v = new Vec2()) {

    Vec2.add(this._coord, v, this._coord);
    Vec2.add(this._foreHandle, v, this._foreHandle);
    Vec2.add(this._rearHandle, v, this._rearHandle);

    return this;
  }

  /**
   * Creates a knot from the array.
   * 
   * @param {Array} arr the array
   * @param {Knot2} target the output knot
   * @returns the knot
   */
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
   * Creates a knot from polar coordinates, where the knot's fore handle is
   * tangent to the radius.
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
   * Creates a knot from polar coordinates, where the knot's fore handle is
   * tangent to the radius.
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

  /**
   * Copies a knots's coord, fore handle and rear handle from a source.
   *
   * @param {Knot2} source the source knot
   * @param {Knot2} target the output knot
   * @returns the knot
   */
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