'use strict';

class ColorKey {

  constructor (
    step = 0.0,
    color = Color.fromScalar(step)) {

    this._step = Math.min(Math.max(step, 0.0), 1.0);
    this._color = color;
  }

  get color () {

    return this._color;
  }

  get step () {

    return this._step;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set color (v) {

    this._color = v;
  }

  set step (v) {

    this._step = Math.min(Math.max(v, 0.0), 1.0);
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
        return this.toString();
      case 'number':
      default:
        return this._step;
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

    if (!obj) {
      return false;
    }

    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }

    return this.hashCode() === obj.hashCode();
  }

  /**
   * Gets a component of this color key by index.
   *
   * @param {number} i the index
   * @returns the value
   */
  get (i = -1) {

    switch (i) {
      case 0: case -5:
        return this._step;
      case 1: case -4:
        return this._color.r;
      case 2: case -3:
        return this._color.g;
      case 3: case -2:
        return this._color.b;
      case 4: case -1:
        return this._color.a;
      default:
        return 0.0;
    }
  }

  /**
   * Returns a hash code for this color key based on its step.
   * 
   * @returns the hash code
   */
  hashCode () {

    const ststr = String(this._step);
    const stlen = ststr.length;
    let sthsh = 0;
    for (let i = 0; i < stlen; ++i) {
      sthsh = Math.imul(31, sthsh) ^ ststr.charCodeAt(i) | 0;
    }
    sthsh >>= 0;

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ sthsh;
    return hsh;
  }

  /**
   * Resets this color key to an initial condition.
   * 
   * @returns this color key
   */
  reset () {

    this._step = 0.0;
    this._color.reset();

    return this;
  }

  /**
   * Sets a component of this color key by index.
   * 
   * @param {number} i the index
   * @param {number} v the value
   * @returns this color key
   */
  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -5:
        this._step = v;
        break;
      case 1: case -4:
        this._color.r = v;
        break;
      case 2: case -3:
        this._color.g = v;
        break;
      case 3: case -2:
        this._color.b = v;
        break;
      case 4: case -1:
        this._color.a = v;
        break;
    }
    return this;
  }

  /**
   * Sets the components of this color key.
   * 
   * @param {number} step the step
   * @param {number} r the color red channel
   * @param {number} g the color green channel
   * @param {number} b the color blue channel
   * @param {number} a the color alpha channel
   * @returns this color key
   */
  setComponents (
    step = 0.0,
    r = 0.0,
    g = 0.0,
    b = 0.0,
    a = 1.0) {

    this._step = Math.min(Math.max(step, 0.0), 1.0);
    this._color.setComponents(r, g, b, a);

    return this;
  }

  /**
   * Returns an array of length 5 containing this color key's components.
   * 
   * @returns the array
   */
  toArray () {

    return [
      this._step,
      this._color.r,
      this._color.g,
      this._color.b,
      this._color.a];
  }

  /**
   * Returns a JSON formatted string of this color key.
   * 
   * @param {number} precision the number of decimal places
   * @returns the string
   */
  toJsonString (precision = 6) {

    return [
      '{\"step\":',
      this._step.toFixed(3),
      ',\"color\":',
      this._color.toJsonString(precision),
      '}'
    ].join('');
  }

  /**
   * Returns an object literal with this color key's components.
   * 
   * @returns the object
   */
  toObject () {

    return {
      step: this._step,
      color: this._color.toObject()
    };
  }

  /**
   * Returns a string representation of this color key.
   * 
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toString (precision = 4) {

    return [
      '{ step: ',
      this._step.toFixed(3),
      ', color: ',
      this._color.toString(precision),
      ' }'
    ].join('');
  }

  /**
   * Tests to see if two color keys approximate each other.
   * 
   * @param {ColorKey} a the left comparisand
   * @param {ColorKey} b the right comparisand
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approx (
    a = new ColorKey(),
    b = new ColorKey(),
    tolerance = 0.0005) {

    return Math.abs(b.step - a.step) < tolerance;
  }

  /**
   * Compares two color keys by their step.
   * 
   * @param {ColorKey} a the left comparisand
   * @param {ColorKey} b the right comparisand
   * @returns the evaluation
   */
  static compareStep (
    a = new ColorKey(),
    b = new ColorKey()) {

    if (a.step > b.step) { return 1; }
    if (a.step < b.step) { return -1; }
    return 0;
  }
}