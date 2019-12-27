'use strict';

class Vert3 {

  constructor (
    coord,
    texCoord,
    normal) {

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