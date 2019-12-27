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

  toString () {

    return [
      '{ name: ',
      this._name,
      ' }']
      .join('');
  }
}