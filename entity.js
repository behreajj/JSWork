'use strict';

class Entity {

  constructor (name = 'Entity') {

    this._name = name;
  }

  get name () {

    return this._name;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set name (v) {

    this._name = v;
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

    const s = this._name;
    const len = s.length;
    let h = 0;
    for (let i = 0; i < len; ++i) {
      h = Math.imul(31, h) ^ s.charCodeAt(i) | 0;
    }
    return h >>> 0;
  }

  toString () {

    return [
      '{ name: ',
      this._name,
      ' }']
      .join('');
  }
}