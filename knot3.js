'use strict';

/**
 * Groups together vectors which shape a Bezier curve into a coordinate (or
 * anchor point), fore handle (the following control point) and rear handle (the
 * preceding control point).
 */
class Knot3 {

  /**
   * Creates a knot from a series of vectors.
   * 
   * @param {Vec3} coord the coordinate
   * @param {Vec3} foreHandle the fore handle
   * @param {Vec3} rearHandle the rear handle
   */
  constructor (
    coord = new Vec3(),
    foreHandle = new Vec3(),
    rearHandle = new Vec3()) {

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

  /**
   * Returns a hash code for this knot based on its coordinate, fore handle and
   * rear handle.
   * 
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
   * Resets this knot to an initial state.
   * 
   * @returns this knot
   */
  reset () {

    Vec3.forward(this._foreHandle);
    Vec3.back(this._rearHandle);
    Vec3.zero(this._coord);

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

  /**
   * Rotates this knot around an axis by an angle in radians.
   *
   * @param {number} radians the angle
   * @param {Vec3} axis the axis
   * @returns this knot
   */
  rotate (
    radians = 0.0,
    axis = Vec3.forward()) {

    return this.rotateInternal(
      Math.cos(radians),
      Math.sin(radians),
      axis);
  }

  /**
   * Rotates this knot around an axis by an angle in radians. Accepts
   * pre-calculated sine and cosine of an angle, so that collections of knots
   * can be efficiently rotated without repeatedly calling cos and sin.
   *
   * @param {number} cosa cosine of the angle
   * @param {number} sina sine of the angle
   * @param {Vec3} axis the axis
   * @returns this knot
   */
  rotateInternal (
    cosa = 1.0,
    sina = 0.0,
    axis = Vec3.forward()) {

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

  /**
   * Rotates this knot around the x axis by an angle in radians.
   *
   * @param {number} radians the angle
   * @returns this knot
   */
  rotateX (radians = 0.0) {

    return this.rotateXInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  /**
   * Rotates a knot around the x axis. Accepts pre-calculated sine and cosine of
   * an angle, so that collections of knots can be efficiently rotated without
   * repeatedly calling cos and sin.
   *
   * @param {number} cosa cosine of the angle
   * @param {number} sina sine of the angle
   * @returns this knot
   */
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

  /**
   * Rotates this knot around the y axis by an angle in radians.
   *
   * @param {number} radians the angle
   * @returns this knot
   */
  rotateY (radians = 0.0) {

    return this.rotateYInternal(
      Math.cos(radians),
      Math.sin(radians));
  }

  /**
   * Rotates a knot around the y axis. Accepts pre-calculated sine and cosine of
   * an angle, so that collections of knots can be efficiently rotated without
   * repeatedly calling cos and sin.
   *
   * @param {number} cosa cosine of the angle
   * @param {number} sina sine of the angle
   * @returns this knot
   */
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

  /**
   * Scales this knot by a non uniform scalar.
   * 
   * @param {Vec3} v the non uniform scalar
   * @returns this knot
   */
  scale (v = Vec3.one()) {

    Vec3.mul(this._coord, v, this._coord);
    Vec3.mul(this._foreHandle, v, this._foreHandle);
    Vec3.mul(this._rearHandle, v, this._rearHandle);

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
    this._foreHandle.z = this._coord.z + scalar *
      (this._foreHandle.z - this._coord.z);

    return this;
  }

  /**
   * Scales the fore handle to a magnitude.
   *
   * @param {number} magnitude the magnitude
   * @returns this knot
   */
  scaleForeHandleTo (magnitude = 1.0) {

    Vec3.subNorm(this._foreHandle, this._coord,
      this._foreHandle);
    Vec3.scale(this._foreHandle, magnitude,
      this._foreHandle);
    Vec3.add(this._foreHandle, this._coord,
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
    this._rearHandle.z = this._coord.z + scalar *
      (this._rearHandle.z - this._coord.z);

    return this;
  }

  /**
   * Scales the rear handle to a magnitude.
   *
   * @param {number} magnitude the magnitude
   * @returns this knot
   */
  scaleRearHandleTo (magnitude = 1.0) {

    Vec3.subNorm(
      this._rearHandle, this._coord,
      this._rearHandle);
    Vec3.scale(
      this._rearHandle, magnitude,
      this._rearHandle);
    Vec3.add(
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

  /**
   * Sets the components of this knot.
   *
   * @param {number} xCo the coordinate x
   * @param {number} yCo the coordinate y
   * @param {number} zCo the coordinate z
   * @param {number} xFh the fore handle x
   * @param {number} yFh the fore handle y
   * @param {number} zFh the fore handle z
   * @param {number} xRh the rear handle x
   * @param {number} yRh the rear handle y
   * @param {number} zRh the rear handle z
   * @returns this knot
   */
  setComponents (
    xCo = 0.0, yCo = 0.0, zCo = 0.0,
    xFh = 0.0, yFh = 0.0, zFh = 0.0,
    xRh = 0.0, yRh = 0.0, zRh = 0.0) {

    this._coord.setComponents(xCo, yCo, zCo);
    this._foreHandle.setComponents(xFh, yFh, zFh);
    this._rearHandle.setComponents(xRh, yRh, zRh);

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
      this._coord.z,

      this._foreHandle.x,
      this._foreHandle.y,
      this._foreHandle.z,

      this._rearHandle.x,
      this._rearHandle.y,
      this._rearHandle.z];
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
   * Translates this knot by a vector.
   * 
   * @param {Vec3} v the vector
   * @returns this knot
   */
  translate (v = new Vec3()) {

    Vec3.add(this._coord, v, this._coord);
    Vec3.add(this._foreHandle, v, this._foreHandle);
    Vec3.add(this._rearHandle, v, this._rearHandle);

    return this;
  }

  /**
   * Creates a knot from the array.
   * 
   * @param {Array} arr the array
   * @param {Knot3} target the output knot
   * @returns the knot
   */
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

  /**
   * Creates a knot from polar coordinates, where the knot's fore handle is
   * tangent to the radius.
   *
   * @param {number} angle the angle in radians
   * @param {number} radius the radius
   * @param {number} handleMag the magnitude of the handles
   * @param {Knot3} target the output knot
   * @returns the knot
   */
  static fromPolar (
    angle = 0.0,
    radius = 1.0,
    handleMag = 1.3333333333333333,
    target = new Knot3()) {

    return Knot3.fromPolarInternal(
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
   * @param {Knot3} target the output knot
   * @returns the knot
   */
  static fromPolarInternal (
    cosa = 1.0,
    sina = 0.0,
    radius = 1.0,
    handleMag = 1.3333333333333333,
    target = new Knot3()) {

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

  /**
   * Copies a knots's coord, fore handle and rear handle from a source.
   *
   * @param {Knot3} source the source knot
   * @param {Knot3} target the output knot
   * @returns the knot
   */
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