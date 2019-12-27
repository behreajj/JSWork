'use strict';

class Face3 {

  constructor (vertices) {

    this._vertices = vertices;
  }

  get length () {

    return this._vertices.length;
  }

  get vertices () {

    return this._vertices;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set vertices (v) {

    this._vertices = v;
  }

  [Symbol.iterator] () {

    let index = 0;
    return {
      next: () => {
        return {
          value: this._knots[index++],
          done: index > this.length
        };
      }
    };
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'number':
        return this._vertices.length;
      case 'string':
      default:
        return this.toString();
    }
  }

  toString (precision = 4) {

    const result = [
      '{ vertices: ['];

    const vt = this._vertices;
    const len = vt.length;
    const last = len - 1;
    for (let i = 0; i < len; ++i) {
      result.push(vt[i].toString(precision));
      if (i < last) {
        result.push(', ');
      }
    }

    result.push(' ] }')
    return result.join('');
  }
}