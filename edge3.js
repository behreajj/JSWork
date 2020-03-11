'use strict';

class Edge3 {

  /**
   * Constructs an edge for a 3D mesh.
   * 
   * @param {Vert3} origin the originv vertex
   * @param {Vert3} dest the destination vertex 
   */
  constructor (
    origin = new Vert3(),
    dest = new Vert3()) {

    this._origin = origin;
    this._dest = dest;
  }

  get dest () {

    return this._dest;
  }

  get length() {
    return 16;
  }

  get origin () {

    return this._origin;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set dest (v) {

    this._dest = v;
  }

  set origin (v) {

    this._origin = v;
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

  hashCode () {

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ this._origin.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._dest.hashCode();
    return hsh;
  }

  toString (precision = 4) {

    return [
      '{ origin: ',
      this._origin.toString(precision),
      ', dest: ',
      this._dest.toString(precision),
      ' }'
    ].join('');
  }
}