'use strict';

/**
 * A mutable, extensible class influenced by GLSL, OSL and Processing's
 * PMatrix2D. Although this is a 3 x 3 matrix, it is generally assumed to be a
 * 2D affine transform matrix, where the last row is (0.0, 0.0, 1.0) . Instance
 * methods are limited, while most static methods require an explicit output
 * variable to be provided.
 */
class Mat3 {

  /**
   * Constructs a matrix from numbers.
   * 
   * @param {number} m00 row 0, column 0
   * @param {number} m01 row 0, column 1
   * @param {number} m02 row 0, column 2
   * @param {number} m10 row 1, column 0
   * @param {number} m11 row 1, column 1
   * @param {number} m12 row 1, column 2
   * @param {number} m20 row 2, column 0
   * @param {number} m21 row 2, column 1
   * @param {number} m22 row 2, column 2
   */
  constructor (
    m00 = 1.0, m01 = 0.0, m02 = 0.0,
    m10 = 0.0, m11 = 1.0, m12 = 0.0,
    m20 = 0.0, m21 = 0.0, m22 = 1.0) {

    this._m00 = m00; this._m01 = m01; this._m02 = m02;
    this._m10 = m10; this._m11 = m11; this._m12 = m12;
    this._m20 = m20; this._m21 = m21; this._m22 = m22;
  }

  /**
   * Returns the number of elements in the matrix.
   */
  get length () {

    return 9;
  }

  get m00 () {

    return this._m00;
  }

  get m01 () {

    return this._m01;
  }

  get m02 () {

    return this._m02;
  }

  get m10 () {

    return this._m10;
  }

  get m11 () {

    return this._m11;
  }

  get m12 () {

    return this._m12;
  }

  get m20 () {

    return this._m20;
  }

  get m21 () {

    return this._m21;
  }

  get m22 () {

    return this._m22;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set m00 (v) {

    this._m00 = v;
  }

  set m01 (v) {

    this._m01 = v;
  }

  set m02 (v) {

    this._m02 = v;
  }

  set m10 (v) {

    this._m10 = v;
  }

  set m11 (v) {

    this._m11 = v;
  }

  set m12 (v) {

    this._m12 = v;
  }

  set m20 (v) {

    this._m20 = v;
  }

  set m21 (v) {

    this._m21 = v;
  }

  set m22 (v) {

    this._m22 = v;
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
        return Mat3.determinant(this);
    }
  }

  get (index = -1) {

    switch (index) {

      /* Row 0 */

      case 0: case -9:
        return this._m00;
      case 1: case -8:
        return this._m01;
      case 2: case -7:
        return this._m02;

      /* Row 1 */

      case 3: case -6:
        return this._m10;
      case 4: case -5:
        return this._m11;
      case 5: case -4:
        return this._m12;

      /* Row 2 */

      case 6: case -3:
        return this._m20;
      case 7: case -2:
        return this._m21;
      case 8: case -1:
        return this._m22;

      default:
        return 0.0;
    }
  }

  getCol2 (j = -1, target = new Vec2()) {

    switch (j) {

      case 0: case -3:

        return target.setComponents(
          this._m00, this._m10);

      case 1: case -2:

        return target.setComponents(
          this._m01, this._m11);

      case 2: case -1:

        return target.setComponents(
          this._m02, this._m12);

      default:

        return target.reset();
    }
  }

  getCol3 (j = -1, target = new Vec3()) {

    switch (j) {

      case 0: case -3:

        return target.setComponents(
          this._m00, this._m10, this._m20);

      case 1: case -2:

        return target.setComponents(
          this._m01, this._m11, this._m21);

      case 2: case -1:

        return target.setComponents(
          this._m02, this._m12, this._m22);

      default:

        return target.reset();
    }
  }

  reset () {

    this._m00 = 1.0; this._m01 = 0.0; this._m02 = 0.0;
    this._m10 = 0.0; this._m11 = 1.0; this._m12 = 0.0;
    this._m20 = 0.0; this._m21 = 0.0; this._m22 = 1.0;

    return this;
  }

  setCol2 (j = -1, source = new Vec2()) {

    switch (j) {

      case 0: case -3:

        this._m00 = source.x;
        this._m10 = source.y;
        this._m20 = 0.0;

        return this;

      case 1: case -2:

        this._m01 = source.x;
        this._m11 = source.y;
        this._m21 = 0.0;

        return this;

      case 2: case -1:

        this._m02 = source.x;
        this._m12 = source.y;
        this._m22 = 1.0;

        return this;

      default:

        return this;
    }
  }

  setCol3 (j = -1, source = new Vec3()) {

    switch (j) {

      case 0: case -3:

        this._m00 = source.x;
        this._m10 = source.y;
        this._m20 = source.z;

        return this;

      case 1: case -2:

        this._m01 = source.x;
        this._m11 = source.y;
        this._m21 = source.z;

        return this;

      case 2: case -1:

        this._m02 = source.x;
        this._m12 = source.y;
        this._m22 = source.z;

        return this;

      default:

        return this;
    }
  }

  /**
   * Sets this matrix's components with real numbers.
   *
   * @param {number} m00 row 0, column 0
   * @param {number} m01 row 0, column 1
   * @param {number} m02 row 0, column 2
   * @param {number} m10 row 1, column 0
   * @param {number} m11 row 1, column 1
   * @param {number} m12 row 1, column 2
   * @param {number} m20 row 2, column 0
   * @param {number} m21 row 2, column 1
   * @param {number} m22 row 2, column 2
   * @returns this matrix
   */
  setComponents (
    m00 = 1.0, m01 = 0.0, m02 = 0.0,
    m10 = 0.0, m11 = 1.0, m12 = 0.0,
    m20 = 0.0, m21 = 0.0, m22 = 1.0) {

    this._m00 = m00; this._m01 = m01; this._m02 = m02;
    this._m10 = m10; this._m11 = m11; this._m12 = m12;
    this._m20 = m20; this._m21 = m21; this._m22 = m22;

    return this;
  }

  toJsonString (precision = 6) {

    return [
      '{\"m00\":',
      this._m00.toFixed(precision),
      ',\"m01\":',
      this._m01.toFixed(precision),
      ',\"m02\":',
      this._m02.toFixed(precision),

      ',\"m10\":',
      this._m10.toFixed(precision),
      ',\"m11\":',
      this._m11.toFixed(precision),
      ',\"m12\":',
      this._m12.toFixed(precision),

      ',\"m20\":',
      this._m20.toFixed(precision),
      ',\"m21\":',
      this._m21.toFixed(precision),
      ',\"m22\":',
      this._m22.toFixed(precision),
      '}'
    ].join('');
  }

  toArray () {

    return [
      this._m00, this._m01, this._m02,
      this._m10, this._m11, this._m12,
      this._m20, this._m21, this._m22];
  }

  toObject () {

    return {
      m00: this._m00, m01: this._m01, m02: this._m02,
      m10: this._m10, m11: this._m11, m12: this._m12,
      m20: this._m20, m21: this._m21, m22: this._m22
    };
  }

  toString (precision = 4) {

    return [
      '{ m00: ',
      this._m00.toFixed(precision),
      ', m01: ',
      this._m01.toFixed(precision),
      ', m02: ',
      this._m02.toFixed(precision),

      ', m10: ',
      this._m10.toFixed(precision),
      ', m11: ',
      this._m11.toFixed(precision),
      ', m12: ',
      this._m12.toFixed(precision),

      ', m20: ',
      this._m20.toFixed(precision),
      ', m21: ',
      this._m21.toFixed(precision),
      ', m22: ',
      this._m22.toFixed(precision),
      ' }'
    ].join('');
  }

  toStringCol (precision = 3) {

    return [
      '\n',
      this._m00.toFixed(precision),
      ', ',
      this._m01.toFixed(precision),
      ', ',
      this._m02.toFixed(precision),

      ', \n',
      this._m10.toFixed(precision),
      ', ',
      this._m11.toFixed(precision),
      ', ',
      this._m12.toFixed(precision),

      ', \n',
      this._m20.toFixed(precision),
      ', ',
      this._m21.toFixed(precision),
      ', ',
      this._m22.toFixed(precision),

      '\n'].join('');
  }

  /**
   * Adds two matrices together.
   * 
   * @param {Mat3} a left operand
   * @param {Mat3} b right operand
   * @param {Mat3} target output matrix
   * @returns the sum
   */
  static add (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      a.m00 + b.m00, a.m01 + b.m01, a.m02 + b.m02,
      a.m10 + b.m10, a.m11 + b.m11, a.m12 + b.m12,
      a.m20 + b.m20, a.m21 + b.m21, a.m22 + b.m22);
  }

  /**
   * Evaluates two matrices like booleans, using the AND logic gate.
   * 
   * @param {Mat3} a left operand
   * @param {Mat3} b right operand
   * @param {Mat3} target output matrix
   * @returns the evaluation
   */
  static and (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      Boolean(a.m00) & Boolean(b.m00),
      Boolean(a.m01) & Boolean(b.m01),
      Boolean(a.m02) & Boolean(b.m02),

      Boolean(a.m10) & Boolean(b.m10),
      Boolean(a.m11) & Boolean(b.m11),
      Boolean(a.m12) & Boolean(b.m12),

      Boolean(a.m20) & Boolean(b.m20),
      Boolean(a.m21) & Boolean(b.m21),
      Boolean(a.m22) & Boolean(b.m22));
  }

  /**
   * Multiplies three matrices. Useful for composing an affine transform from
   * translation, rotation and scale matrices.
   *
   * @param {Mat3} a first matrix
   * @param {Mat3} b second matrix
   * @param {Mat3} c third matrix
   * @param {Mat3} target output matrix
   * @returns the product
   */
  static compose (
    a = new Mat3(),
    b = new Mat3(),
    c = new Mat3(),
    target = new Mat3()) {

    const n00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20;
    const n01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21;
    const n02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22;

    const n10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20;
    const n11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21;
    const n12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22;

    const n20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20;
    const n21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21;
    const n22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22;

    return target.setComponents(
      n00 * c.m00 + n01 * c.m10 + n02 * c.m20,
      n00 * c.m01 + n01 * c.m11 + n02 * c.m21,
      n00 * c.m02 + n01 * c.m12 + n02 * c.m22,

      n10 * c.m00 + n11 * c.m10 + n12 * c.m20,
      n10 * c.m01 + n11 * c.m11 + n12 * c.m21,
      n10 * c.m02 + n11 * c.m12 + n12 * c.m22,

      n20 * c.m00 + n21 * c.m10 + n22 * c.m20,
      n20 * c.m01 + n21 * c.m11 + n22 * c.m21,
      n20 * c.m02 + n21 * c.m12 + n22 * c.m22);
  }

  /**
   * Decomposes a matrix into its translation, rotation and scale. Returns an object containing the three.
   * 
   * @param {Mat3} m matrix
   * @param {Vec3} trans output translation
   * @param {Vec3} scale output scale
   * @returns the object
   */
  static decompose (
    m = new Mat3(),
    trans = Vec2.zero(),
    scale = Vec2.one()) {

    const xMag = Math.hypot(m.m00, m.m10);
    const yMag = Math.hypot(m.m01, m.m11);
    const det = Mat3.determinant(m);
    scale.setComponents(xMag, det < 0.0 ? -yMag : yMag);

    trans.setComponents(m.m02, m.m12);

    let angle = Math.atan2(m.m10, m.m00);
    angle -= 6.283185307179586 * Math.floor(angle * 0.15915494309189535);

    return { translation: trans, rotation: angle, scale: scale };
  }

  /**
   * Finds the determinant of a matrix.
   * 
   * @param {Mat3} m matrix
   * @returns the determinant
   */
  static determinant (m = new Mat3()) {

    return m.m00 * (m.m22 * m.m11 - m.m12 * m.m21) +
      m.m01 * (m.m12 * m.m20 - m.m22 * m.m10) +
      m.m02 * (m.m21 * m.m10 - m.m11 * m.m20);
  }

  /**
   * Divides the left matrix by the right. Equivalent to multiplying the left
   * matrix by the inverse of the right.
   *
   * @param {Mat3} a numerator
   * @param {Mat3} b denominator
   * @param {Mat3} target output matrix
   * @param {Mat3} inverse denonminator inverse
   * @returns the quotient
   */
  static div (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3(),
    inverse = new Mat3()) {

    return Mat3.mul(a, Mat3.inverse(b, inverse), target);
  }

  /**
   * Creates a matrix from a one dimensional array of numbers.
   *
   * @param {Array} arr a 1D array of numbers
   * @param {Mat3} target output matrix
   * @returns the matrix
   */
  static fromArray (
    arr = [
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0],
    target = new Mat3()) {

    return target.setComponents(
      arr[0], arr[1], arr[2],
      arr[3], arr[4], arr[5],
      arr[6], arr[7], arr[8]);
  }

  /**
   * Creates a matrix from 2D column axes and a translation. The last row of the
   * matrix is assumed to be (0.0, 0.0, 1.0) .
   *
   * @param {Vec2} right right axis
   * @param {Vec2} forward forward axis
   * @param {Vec2} translation translation
   * @param {Mat3} target output matrix
   * @returns the output matrix
   */
  static fromAxes2 (
    right = Vec2.right(),
    forward = Vec2.forward(),
    translation = Vec2.zero(),
    target = new Mat3()) {

    return target.setComponents(
      right.x, forward.x, translation.x,
      right.y, forward.y, translation.y,
      0.0, 0.0, 1.0);
  }

  /**
   * Creates a matrix from 3D column axes and a translation.
   *
   * @param {Vec3} right right axis
   * @param {Vec3} forward forward axis
   * @param {Vec3} translation translation
   * @param {Mat3} target output matrix
   * @returns the output matrix
   */
  static fromAxes3 (
    right = Vec3.right(),
    forward = Vec3.forward(),
    translation = Vec3.up(),
    target = new Mat3()) {

    return target.setComponents(
      right.x, forward.x, translation.x,
      right.y, forward.y, translation.y,
      right.z, forward.z, translation.z);
  }

  /**
   * Creates a matrix from a rotation.
   * 
   * @param {number} radians angle in radians
   * @param {Mat3} target output matrix
   * @returns the matrix
   */
  static fromRotZ (
    radians = 0.0,
    target = new Mat3()) {

    return Mat3.fromRotZInternal(
      Math.cos(radians),
      Math.sin(radians),
      target);
  }

  /**
   * Creates a matrix from a rotation. Accepts pre-calculated sine and cosine of
   * an angle, so that collections of matrices can be efficiently rotated
   * without repeatedly calling cos and sin.
   *
   * @param {number} cosa cosine of the angle
   * @param {number} sina sine of the angle
   * @param {Mat3} target output matrix
   * @returns the matrix
   */
  static fromRotZInternal (
    cosa = 1.0,
    sina = 0.0,
    target = new Mat3()) {

    return target.setComponents(
      cosa, -sina, 0.0,
      sina, cosa, 0.0,
      0.0, 0.0, 1.0);
  }

  /**
   * Creates a matrix from a uniform scalar.
   * 
   * @param {number} scalar uniform scalar
   * @param {Mat3} target output matrix
   * @returns the matrix
   */
  static fromScale1 (
    scalar = 1.0,
    target = new Mat3()) {

    return target.setComponents(
      scalar, 0.0, 0.0,
      0.0, scalar, 0.0,
      0.0, 0.0, 1.0);
  }

  /**
   * Creates a matrix from a nonuniform scalar held in a 2D vector.
   *
   * @param {Vec2} scalar nonuniform scalar
   * @param {Mat3} target output matrix
   * @returns the matrix
   */
  static fromScale2 (
    scalar = Vec2.one(),
    target = new Mat3()) {

    return target.setComponents(
      scalar.x, 0.0, 0.0,
      0.0, scalar.y, 0.0,
      0.0, 0.0, 1.0);
  }

  /**
   * Copies a source matrix to an output matrix.
   * 
   * @param {Mat3} source source matrix
   * @param {Mat3} target output matrix
   * @returns the copy
   */
  static fromSource (
    source = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      source.m00, source.m01, source.m02,
      source.m10, source.m11, source.m12,
      source.m20, source.m21, source.m22);
  }

  /**
   * Creates a matrix from a translation.
   *
   * @param {Vec2} translation translation vector
   * @param {Mat3} target output matrix
   * @returns the matrix
   */
  static fromTranslation (
    translation = Vec2.zero(),
    target = new Mat3()) {

    return target.setComponents(
      1.0, 0.0, translation.x,
      0.0, 1.0, translation.y,
      0.0, 0.0, 1.0);
  }

  /**
   * Returns the identity matrix, [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
   * .
   *
   * @param {Mat3} target output matrix
   */
  static identity (target = new Mat3()) {

    return target.setComponents(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0);
  }

  /**
   * Finds the inverse of the input matrix.
   *
   * @param {Mat3} m matrix
   * @param {Mat3} target output matrix
   * @returns the inverse
   */
  static inverse (
    m = new Mat3(), 
    target = new Mat3()) {

    const b01 = m.m22 * m.m11 - m.m12 * m.m21;
    const b11 = m.m12 * m.m20 - m.m22 * m.m10;
    const b21 = m.m21 * m.m10 - m.m11 * m.m20;

    const det = m.m00 * b01 + m.m01 * b11 + m.m02 * b21;
    if (det === 0.0) { return target.reset(); }

    const detInv = 1.0 / det;
    return target.setComponents(
      b01 * detInv,
      (m.m02 * m.m21 - m.m22 * m.m01) * detInv,
      (m.m12 * m.m01 - m.m02 * m.m11) * detInv,

      b11 * detInv,
      (m.m22 * m.m00 - m.m02 * m.m20) * detInv,
      (m.m02 * m.m10 - m.m12 * m.m00) * detInv,

      b21 * detInv,
      (m.m01 * m.m20 - m.m21 * m.m00) * detInv,
      (m.m11 * m.m00 - m.m01 * m.m10) * detInv);
  }

  /**
   * Finds whether or not a matrix is the identity.
   *
   * @param {Mat3} m matrix
   * @returns the evaluation
   */
  static isIdentity (m = new Mat3()) {

    return m.m22 === 1.0 && m.m11 === 1.0 && m.m00 === 1.0 &&
      m.m01 === 0.0 && m.m02 === 0.0 && m.m12 === 0.0 &&
      m.m10 === 0.0 && m.m20 === 0.0 && m.m21 === 0.0;
  }

  /**
   * Multiplies two matrices.
   * 
   * @param {Mat3} a left operand
   * @param {Mat3} b right operand
   * @param {Mat3} target output matrix
   * @returns the product
   */
  static mul (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20,
      a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21,
      a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22,

      a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20,
      a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21,
      a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22,

      a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20,
      a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21,
      a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22);
  }

  /**
   * Multiplies a matrix (the left operand) and a 3D vector (the right operand);
   * returns a 3D vector.
   *
   * @param {Mat3} a left operand
   * @param {Vec3} b right operand
   * @param {Vec3} target output vector
   * @returns the product
   */
  static mulVec3 (
    a = new Mat3(),
    b = new Vec3(),
    target = new Vec3()) {

    return target.setComponents(
      a.m00 * b.x +
      a.m01 * b.y +
      a.m02 * b.z,

      a.m10 * b.x +
      a.m11 * b.y +
      a.m12 * b.z,

      a.m20 * b.x +
      a.m21 * b.y +
      a.m22 * b.z);
  }

  /**
   * Evaluates two matrices like booleans, using the inclusive or (OR) logic
   * gate.
   *
   * @param {Mat3} a left operand
   * @param {Mat3} b right operand
   * @param {Mat3} target output matrix
   * @returns the evaluation
   */
  static or (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      Boolean(a.m00) | Boolean(b.m00),
      Boolean(a.m01) | Boolean(b.m01),
      Boolean(a.m02) | Boolean(b.m02),

      Boolean(a.m10) | Boolean(b.m10),
      Boolean(a.m11) | Boolean(b.m11),
      Boolean(a.m12) | Boolean(b.m12),

      Boolean(a.m20) | Boolean(b.m20),
      Boolean(a.m21) | Boolean(b.m21),
      Boolean(a.m22) | Boolean(b.m22));
  }

  /**
   * Rotates the elements of the input matrix 90 degrees counter-clockwise.
   *
   * @param {Mat3} m input matrix
   * @param {Mat3} target output matrix
   * @returns the rotated matrix
   */
  static rotateElmsCcw (
    m = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      m.m02, m.m12, m.m22,
      m.m01, m.m11, m.m21,
      m.m00, m.m10, m.m20);
  }

  /**
   * Rotates the elements of the input matrix 90 degrees clockwise.
   *
   * @param {Mat3} m input matrix
   * @param {Mat3} target output matrix
   * @returns the rotated matrix
   */
  static rotateElmsCw (
    m = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      m.m20, m.m10, m.m00,
      m.m21, m.m11, m.m01,
      m.m22, m.m12, m.m02);
  }

  /**
   * Subtracts the right matrix from the left matrix.
   *
   * @param {Mat3} a left operand
   * @param {Mat3} b right operand
   * @param {Mat3} target output matrix
   * @returns the difference
   */
  static sub (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      a.m00 - b.m00, a.m01 - b.m01, a.m02 - b.m02,
      a.m10 - b.m10, a.m11 - b.m11, a.m12 - b.m12,
      a.m20 - b.m20, a.m21 - b.m21, a.m22 - b.m22);
  }

  /**
   * Transposes a matrix, switching its row and column elements.
   *
   * @param {Mat3} m input matrix
   * @param {Mat3} target transposition
   */
  static transpose (
    m = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      m.m00, m.m10, m.m20,
      m.m01, m.m11, m.m21,
      m.m02, m.m12, m.m22);
  }

  /**
   * Evaluates two matrices like booleans, using the exclusive or (XOR) logic
   * gate.
   * 
   * @param {Mat3} a left operand
   * @param {Mat3} b right operand
   * @param {Mat3} target output matrix
   * @returns the evaluation
   */
  static xor (
    a = new Mat3(),
    b = new Mat3(),
    target = new Mat3()) {

    return target.setComponents(
      Boolean(a.m00) ^ Boolean(b.m00),
      Boolean(a.m01) ^ Boolean(b.m01),
      Boolean(a.m02) ^ Boolean(b.m02),

      Boolean(a.m10) ^ Boolean(b.m10),
      Boolean(a.m11) ^ Boolean(b.m11),
      Boolean(a.m12) ^ Boolean(b.m12),

      Boolean(a.m20) ^ Boolean(b.m20),
      Boolean(a.m21) ^ Boolean(b.m21),
      Boolean(a.m22) ^ Boolean(b.m22));
  }
}