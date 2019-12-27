'use strict';

class CurveEntity2 extends Entity {

  constructor (
    name = 'CurveEntity2',
    transform = new Transform2(),
    curves = []) {

    super(name);

    this._transform = transform;
    this._curves = curves;
  }

  get curves () {

    return this._curves;
  }

  get transform () {

    return this._transform;
  }

  toString (precision = 4) {

    const result = [
      '{ name: ',
      this._name,
      ', transform: ',
      this._transform.toString(precision),
      ', curves: [ '];

    const crv = this._curves;
    const len = crv.length;
    const last = len - 1;
    for (let i = 0; i < len; ++i) {
      result.push(crv[i].toString(precision));
      if (i < last) {
        result.push(', ');
      }
    }

    result.append(' ] }');
    return result.join('');
  }
}