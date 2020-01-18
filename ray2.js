'use strict';

/**
 * A direction that extends from an originating point.
 */
class Ray2 {

  /**
   * Constructs a ray from a point and a vector.
   * 
   * @param {Vec2} origin the origin point
   * @param {Vec2} dir the direction
   */
  constructor (
    origin = Vec2.zero(),
    dir = Vec2.forward()) {

    /**
     * The ray's origin point.
     */
    this._origin = origin;

    /**
     * The ray's direction.
     */
    this._dir = dir;
  }

  get dir () {

    return this._dir;
  }

  /**
   * The number of elements held by this ray, 4.
   */
  get length () {

    return 4;
  }

  get origin () {

    return this._origin;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set dir (v) {

    this._dir = v;
  }

  set origin (v) {

    this._origin = v;
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
   * Tests equivalence between this and another object. For rough equivalence of
   * floating point components, use the static approx function instead.
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
   * Gets a component of this vector by index.
   * 
   * @param {number} i the index
   * @returns the value
   */
  get (i = -1) {

    switch (i) {
      case 0: case -4:
        return this._origin.x;
      case 1: case -3:
        return this._origin.y;
      case 2: case -2:
        return this._dir.x;
      case 3: case -1:
        return this._dir.y;
      default:
        return 0.0;
    }
  }

  /**
   * Returns a hash code for this ray based on its origin.
   * 
   * @returns the hash code
   */
  hashCode () {

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ this._origin.hashCode();
    // hsh = Math.imul(16777619, hsh) ^ this._dir.hashCode();
    return hsh;
  }

  /**
   * Resets this ray to an initial state, with an origin at ( 0.0, 0.0 ) and a
   * ray pointed forward, ( 0.0, 1.0 ).
   *
   * @returns this ray
   */
  reset () {

    this._origin.reset();
    Vec2.forward(this._dir);

    return this;
  }

  /**
   * Sets a component of this ray by index.
   * 
   * @param {number} i the index
   * @param {number} v the value
   * @returns the ray
   */
  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -4:
        this._origin.x = v;
      case 1: case -3:
        this._origin.y = v;
      case 2: case -2:
        this._dir.x = v;
      case 3: case -1:
        this._dir.y = v;
        break;
    }

    return this;
  }

  /**
   * Sets the components of this ray.
   * 
   * @param {number} xOrigin the origin x
   * @param {number} yOrigin the origin y
   * @param {number} xDir the direction x 
   * @param {number} yDir the direction y
   * @returns this ray
   */
  setComponents (
    xOrigin = 0.0,
    yOrigin = 0.0,
    xDir = 0.0,
    yDir = 1.0) {

    this._origin.setComponents(xOrigin, yOrigin);
    this._dir.setComponents(xDir, yDir);

    return this;
  }

  /**
   * Returns an array of length 4 containing this ray's components.
   *
   * @returns the array
   */
  toArray () {

    return [
      this._origin.x,
      this._origin.y,
      this._dir.x,
      this._dir.y];
  }

  /**
   * Returns a JSON formatted string.
   * 
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toJsonString (precision = 6) {

    return [
      '{\"origin\":',
      this._origin.toJsonString(precision),
      ',\"dir\":',
      this._dir.toJsonString(precision),
      '}'
    ].join('');
  }

  /**
   * Returns an object literal with this ray's components.
   *
   * @returns the object
   */
  toObject () {

    return {
      origin: this._origin.toObject(),
      dir: this._dir.toObject()
    };
  }

  /**
   * Returns a string representation of this ray.
   *
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toString (precision = 4) {

    return [
      '{ origin: ',
      this._origin.toString(precision),
      ', dir: ',
      this._dir.toString(precision),
      ' }'
    ].join('');
  }

  /**
   * Finds the point at a given time on a ray.
   * 
   * @param {Ray2} ray the ray
   * @param {number} time the time step
   * @param {Vec2} target the output vector
   */
  static eval (
    ray = new Ray2(),
    time = 0.0,
    target = new Vec2()) {

    const origin = ray.origin;
    const dir = ray.dir;

    const dmSq = Vec2.magSq(dir);
    if (time <= 0.0 || dmSq == 0.0) {
      return Vec2.fromSource(origin, target);
    }

    if (Math.abs(1.0 - dmSq) < 0.000001) {
      return target.setComponents(
        origin.x + dir.x * time,
        origin.y + dir.y * time);
    }

    const scalar = time / Math.sqrt(dmSq);
    return target.setComponents(
      origin.x + dir.x * scalar,
      origin.y + dir.y * scalar);
  }

  /**
   * Copies a ray's origin and destination from a source.
   *
   * @param {Ray2} source the source ray
   * @param {Ray2} target the target ray
   */
  static fromSource (
    source = new Ray2(),
    target = new Ray2()) {

    Vec2.fromSource(source._origin, target._origin);
    Vec2.fromSource(source._dir, target._dir);
    return target;
  }
}