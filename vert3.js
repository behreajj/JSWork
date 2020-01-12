'use strict';

class Vert3 {

  /**
   * Constructs a vertex for a 3D mesh.
   * 
   * @param {Vec3} coord the coordinate
   * @param {Vec2} texCoord the texture coordinate
   * @param {Vec3} normal the normal
   */
  constructor (
    coord = new Vec3(),
    texCoord = new Vec2(0.5, 0.5),
    normal = new Vec3(0.0, 0.0, 1.0)) {

    this._coord = coord;
    this._texCoord = texCoord;
    this._normal = normal;
  }

  get coord () {

    return this._coord;
  }

  get length () {

    return 8;
  }

  get normal () {

    return this._normal;
  }

  get texCoord () {

    return this._texCoord;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set coord (v) {

    this._coord = v;
  }

  set normal (v) {

    this._normal = v;
  }

  set texCoord (v) {

    this._texCoord = v;
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
    hsh = Math.imul(16777619, hsh) ^ this._coord.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._normal.hashCode();
    hsh = Math.imul(16777619, hsh) ^ this._texCoord.hashCode();
    return hsh;
  }

  toString (precision = 4) {

    return [
      '{ coord: ',
      this._coord.toString(precision),
      ', texCoord: ',
      this._texCoord.toString(precision),
      ', normal: ',
      this._normal.toString(precision),
      ' }'
    ].join('');
  }
}