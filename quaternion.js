'use strict';

/**
 * A four-dimensional complex number. The x, y and z components are coefficients
 * of the imaginary i, j, and k. Discovered by William R. Hamilton with the
 * formula i i = j j = k k = i j k = -1.0 . Quaternions with a magnitude of 1.0
 * are commonly used to rotate 3D objects from one orientation to another
 * without suffering gimbal lock.
 */
class Quaternion {

  /**
   * Constructs a new quaternion from a scalar real component and vector
   * imaginary component. Defaults to the identity, where the real component is
   * 1.0 and the imaginary component is zero, (0.0, 0.0, 0.0) .
   *
   * @param {number} real the real component
   * @param {Vec3} imag the imaginary component
   */
  constructor (real = 1.0, imag = new Vec3()) {

    // TODO: Add the natural logarithm of a quaternion above this?
    // TODO: Add separate getUp, getRight, getForward functions?

    /**
     * The real component, a scalar; also referred to as 'w'.
     */
    this._real = real;

    /**
     * The imginary coefficient, a three dimensional vector.
     */
    this._imag = imag;
  }

  get imag () {

    return this._imag;
  }

  /**
   * The number of elements in the quaternion, 4.
   */
  get length () {

    return 4;
  }

  get real () {

    return this._real;
  }

  get w () {

    return this._real;
  }

  get x () {

    return this._imag.x;
  }

  get y () {

    return this._imag.y;
  }

  get z () {

    return this._imag.z;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set imag (v) {

    this._imag = v;
  }

  set real (v) {

    this._real = v;
  }

  set w (v) {

    this._real = v;
  }

  set x (v) {

    this._imag.x = v;
  }

  set y (v) {

    this._imag.y = v;
  }

  set z (v) {

    this._imag.z = v;
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
        return Quaternion.mag(this);
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
   * Gets a component of this quaternion by index. The real component, w, is
   * assumed to be the first element.
   *
   * @param {number} i the index
   * @returns the value
   */
  get (i = -1) {

    switch (i) {
      case 0: case -4:
        return this._real;
      case 1: case -3:
        return this._imag.x;
      case 2: case -2:
        return this._imag.y;
      case 3: case -1:
        return this._imag.z;
      default:
        return 0.0;
    }
  }

  /**
   * Returns a hash code for this vector based on its real and imaginary
   * components.
   *
   * @returns the hash code
   */
  hashCode () {

    const rstr = String(this._real);
    const len0 = rstr.length;
    let rhsh = 0;
    for (let i = 0; i < len0; ++i) {
      rhsh = Math.imul(31, rhsh) ^ rstr.charCodeAt(i) | 0;
    }
    rhsh >>>= 0;

    let hsh = -2128831035;
    hsh = Math.imul(16777619, hsh) ^ rhsh;
    hsh = Math.imul(16777619, hsh) ^ this._imag.hashCode();
    return hsh;
  }

  /**
   * Resets this quaternion to an initial state, the identity, ( 1.0, 0.0, 0.0,
   * 0.0 ) .
   *
   * @returns this quaternion
   */
  reset () {

    this._real = 1.0;
    this._imag.reset();

    return this;
  }

  /**
   * Sets a component of this quaternion by index. The real component, w, is
   * assumed to be the first element.
   *
   * @param {number} i the index
   * @param {number} v the value
   * @returns this quaternion
   */
  set (i = -1, v = 0.0) {

    switch (i) {
      case 0: case -4:
        this._real = v;
        break;
      case 1: case -3:
        this._imag.x = v;
        break;
      case 2: case -2:
        this._imag.y = v;
        break;
      case 3: case -1:
        this._imag.z = v;
        break;
    }
    return this;
  }

  /**
   * Sets the components of this quaternion.
   *
   * @param {number} w the real component
   * @param {number} x the coefficient of i
   * @param {number} y the coefficient of j
   * @param {number} z the coefficient of k
   * @returns this quaternion
   */
  setComponents (w = 1.0, x = 0.0, y = 0.0, z = 0.0) {

    this._real = w;
    this._imag.setComponents(x, y, z);

    return this;
  }

  /**
   * Returns an array of length 4 containing this quaternion's components. The
   * real component, w, is listed first.
   *
   * @returns the array
   */
  toArray () {

    const i = this._imag;
    return [this._real, i.x, i.y, i.z];
  }

  /**
   * Returns a JSON formatted string.
   *
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toJsonString (precision = 6) {

    return [
      '{\"real\":',
      this._real.toFixed(precision),
      ',\"imag\":',
      this._imag.toJsonString(precision),
      '}'
    ].join('');
  }

  /**
   * Returns an object literal with this quaternion's components.
   *
   * @returns the object
   */
  toObject () {

    return {
      real: this._real,
      imag: this._imag.toObject()
    };
  }

  /**
   * Returns a string representation of this quaternion.
   *
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toString (precision = 4) {

    return [
      '{ real: ',
      this._real.toFixed(precision),
      ', imag: ',
      this._imag.toString(precision),
      ' }'
    ].join('');
  }

  /**
   * Adds to quaternions.
   * 
   * @param {Quaternion} a the left operand
   * @param {Quaternion} b the right operand
   * @param {Quaternion} target the output quaternion
   * @returns the sum
   */
  static add (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real + b.real;
    Vec3.add(a.imag, b.imag, target.imag);
    return target;
  }

  /**
   * Adds two quaternions and normalizes the result.
   * 
   * @param {Quaternion} a the left operand
   * @param {Quaternion} b the right operand
   * @param {Quaternion} target the output quaternion
   * @returns the normalized sum
   */
  static addNorm (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real + b.real;
    Vec3.add(a.imag, b.imag, target.imag);

    const mSq = Quaternion.magSq(target);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    const i = target.imag;
    return target.setComponents(
      target.real * mInv,
      i.x * mInv,
      i.y * mInv,
      i.z * mInv);
  }

  /**
   * Tests to see if all the quaternion's components are non-zero.
   *
   * @param {Quaternion} q the input quaternion
   * @returns the evaluation
   */
  static all (q = new Quaternion()) {

    return q.real !== 0.0 && Vec3.all(q.imag);
  }

  /**
   * Tests to see if any of the quaternion's components are non-zero.
   * 
   * @param {Quaternion} q the input quaternion
   * @returns the evaluation
   */
  static any (q = new Quaternion()) {

    return q.real !== 0.0 || Vec3.any(q.imag);
  }

  /**
   * Evaluates whether or not two quaternions approximate each
   * other according to a tolerance.
   * 
   * @param {Quaternion} a the left comparisand
   * @param {Quaternion} b the right comparisand
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approx (
    a = new Quaternion(),
    b = new Quaternion(),
    tolerance = 0.000001) {

    return Math.abs(b.y - a.y) < tolerance &&
      Vec3.approx(a, b, tolerance);
  }

  /**
   * Tests to see if a quaternion has, approximately, the
   * specified magnitude.
   * 
   * @param {Quaternion} a the quaternion
   * @param {number} b the magnitude
   * @param {number} tolerance the tolerance
   */
  static approxMag (
    a = new Quaternion(),
    b = 1.0,
    tolerance = 0.000001) {

    return Math.abs((b * b) - Quaternion.magSq(a)) < tolerance;
  }

  /**
   * Compares two quaternions by real component (w), then by imaginary
   * components: z, y, then x. To be provided to array sort functions.
   *
   * @param {Quaternion} a the left comparisand
   * @param {Quaternion} b the right comparisand
   * @returns the comparison
   */
  static compareWzyx (
    a = new Quaternion(),
    b = new Quaternion()) {

    if (a.real > b.real) { return 1; }
    if (a.real < b.real) { return -1; }

    const ai = a.imag;
    const bi = b.imag;

    if (ai.z > bi.z) { return 1; }
    if (ai.z < bi.z) { return -1; }
    if (ai.y > bi.y) { return 1; }
    if (ai.y < bi.y) { return -1; }
    if (ai.x > bi.x) { return 1; }
    if (ai.x < bi.x) { return -1; }

    return 0;
  }

  /**
   * Returns the conjugate of the quaternion, where the imaginary component is
   * negated.
   *
   * a* = { a real, -a imag }
   *
   * @param {Quaternion} q the input quaternion
   * @param {Quaternion} target the output quaternion
   * @returns the conjugate
   */
  static conj (
    q = new Quaternion(),
    target = new Quaternion()) {

    target.real = q.real;
    Vec3.negate(q.imag, target.imag);
    return target;
  }

  /**
   * Divides one quaternion by another. Equivalent to multiplying the numerator
   * and the inverse of the denominator.
   *
   * @param {Quaternion} a the numerator
   * @param {Quaternion} b the denominator 
   * @param {Quaternion} target the output quaternion
   * @returns the quotient 
   */
  static div (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    const bi = b.imag;
    const bw = b.real;
    const bx = bi.x;
    const by = bi.y;
    const bz = bi.z;

    const bmSq = bw * bw + bx * bx + by * by + bz * bz;

    if (bmSq === 0.0) {
      return target.reset();
    }

    let bwInv = bw;
    let bxInv = -bx;
    let byInv = -by;
    let bzInv = -bz;

    if (Math.abs(1.0 - bmSq) > 0.000001) {
      const bmSqInv = 1.0 / bmSq;
      bwInv *= bmSqInv;
      bxInv *= bmSqInv;
      byInv *= bmSqInv;
      bzInv *= bmSqInv;
    }

    const aw = a.real;
    const ai = a.imag;
    return target.setComponents(
      aw * bwInv - ai.x * bxInv - ai.y * byInv - ai.z * bzInv,
      ai.x * bwInv + aw * bxInv + ai.y * bzInv - ai.z * byInv,
      ai.y * bwInv + aw * byInv + ai.z * bxInv - ai.x * bzInv,
      ai.z * bwInv + aw * bzInv + ai.x * byInv - ai.y * bxInv);
  }

  /**
   * Finds the dot product of two quaternions by summing the
   * products of their corresponding components.
   * 
   * dot ( a, b ) := a real * b real + dot ( a imag, b imag )
   * 
   * The dot product of a quaternion with itself is equal to
   * its magnitude squared.
   * 
   * @param {Quaternion} a left operand
   * @param {Quaternion} b right operand
   * @returns the dot product
   */
  static dot (
    a = new Quaternion(),
    b = new Quaternion()) {

    return a.real * b.real + Vec3.dot(a.imag, b.imag);
  }

  /**
   * Finds the value of Euler's number e raised to the power of the quaternion.
   * Uses the formula:
   *
   * exp ( q ) := er ( { cos ( |i| ), ^i sin ( |i| ) } )
   *
   * where r is qreal and i is qimag.
   *
   * @param {Quaternion} q the input quaternion
   * @param {Quaternion} target the output quaternion
   * @returns the result
   */
  static exp (
    q = new Quaternion(),
    target = new Quaternion()) {

    const ea = Math.exp(q.real);
    const imSq = Vec3.mag(q.imag);
    if (imSq === 0.0) {
      Vec3.zero(target.imag);
      target.real = ea;
      return target;
    }

    const im = Math.sqrt(imSq);
    target.real = ea * Math.cos(im);
    Vec3.mul(
      q.imag,
      ea * Math.sin(im) / im,
      target.imag);

    return target;
  }

  /**
   * Creates a quaternion from the array.
   *
   * @param {Array} arr the array
   * @param {Quaternion} target the output quaternion
   * @returns the quaternion
   */
  static fromArray (
    arr = [1.0, 0.0, 0.0, 0.0],
    target = new Quaternion()) {

    return target.setComponents(
      arr[0],
      arr[1],
      arr[2],
      arr[3]);
  }

  /**
   * Creates a quaternion from three axes.
   *
   * The axes should already be normalized; in other words, they should match a
   * pure rotation matrix.
   *
   * @param {Vec3} right the right axis
   * @param {Vec3} forward the forward axis
   * @param {Vec3} up the up axis
   * @param {Quaternion} target the output quaternion
   * @returns the quaternion
   */
  static fromAxes (
    right = Vec3.right(),
    forward = Vec3.forward(),
    up = Vec3.up(),
    target = new Quaternion()) {

    return Quaternion.fromAxesInternal(
      right.x, forward.y, up.z,
      forward.z, up.y,
      up.x, right.z,
      right.y, forward.x,
      target);
  }

  /**
   * Creates a quaternion from three axes - either separate vectors or the
   * columns of a matrix. This is an internal helper function which uses only
   * the relevant information to create a quaternion.
   *
   * @param {number} rightx m00 : right.x
   * @param {number} forwardy m11 : forward.y
   * @param {number} upz m22 : up.z
   * @param {number} forwardz m21 : forward.z
   * @param {number} upy m12 : up.y
   * @param {number} upx m02 : up.x
   * @param {number} rightz m20 : right.z
   * @param {number} righty m10 : right.y
   * @param {number} forwardx m01 : forward.x
   * @param {Quaternion} target the output quaternion
   * @returns the quaternion
   */
  static fromAxesInternal (
    rightx = 1.0,
    forwardy = 1.0,
    upz = 1.0,
    forwardz = 0.0,
    upy = 0.0,
    upx = 0.0,
    rightz = 0.0,
    righty = 0.0,
    forwardx = 0.0,
    target = new Quaternion()) {

    const w = 0.5 * Math.sqrt(
      Math.max(0.0, 1.0 + rightx + forwardy + upz));

    const x = 0.5 * Math.sqrt(
      Math.max(0.0, 1.0 + rightx - forwardy - upz));
    const y = 0.5 * Math.sqrt(
      Math.max(0.0, 1.0 - rightx + forwardy - upz));
    const z = 0.5 * Math.sqrt(
      Math.max(0.0, 1.0 - rightx - forwardy + upz));

    return target.setComponents(w,
      Math.abs(x) * Math.sign(forwardz - upy),
      Math.abs(y) * Math.sign(upx - rightz),
      Math.abs(z) * Math.sign(righty - forwardx));
  }

  /**
   * Creates a quaternion from an axis and angle. Normalizes the axis prior to
   * calculating the quaternion.
   * 
   * @param {number} radians the angle in radians
   * @param {Vec3} axis the axis
   * @param {Quaternion} target the output quaternion
   * @returns the quaternion
   */
  static fromAxisAngle (
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0),
    target = new Quaternion()) {

    const amSq = Vec3.magSq(axis);
    if (amSq === 0.0) {
      return target.reset();
    }

    let nx = axis.x;
    let ny = axis.y;
    let nz = axis.z;

    if (Math.abs(1.0 - amSq) > 0.000001) {
      const amInv = 1.0 / Math.sqrt(amSq);
      nx *= amInv;
      ny *= amInv;
      nz *= amInv;
    }

    const halfAngle = 0.5 * radians;
    const sinHalf = Math.sin(halfAngle);
    return target.setComponents(
      Math.cos(halfAngle),
      nx * sinHalf,
      ny * sinHalf,
      nz * sinHalf);
  }

  /**
   * Copies a quaternion's components from a source.
   * 
   * @param {Quaternion} source the source quaternion
   * @param {Quaternion} target the output quaternion
   * @returns the quaternion
   */
  static fromSource (
    source = new Quaternion(),
    target = new Quaternion()) {

    Vec3.fromSource(
      source.imag,
      target.imag);
    target.real = source.real;
    return target;
  }

  /**
   * Creates a quaternion with reference to two vectors. This function creates
   * normalized copies of the vectors. Uses the formula:
   *
   * fromTo (a, b) := { dot ( a, b ), cross ( a, b ) }
   *
   * @param {Vec3} origin the origin vector
   * @param {Vec3} dest the destination vector
   * @param {Quaternion} target the output quaternion
   * @returns the quaternion
   */
  static fromTo (
    origin = Vec3.right(),
    dest = Vec3.right(),
    target = new Quaternion()) {

    let anx = origin.x;
    let any = origin.y;
    let anz = origin.z;
    const amsq = anx * anx + any * any + anz * anz;
    if (amsq === 0.0) {
      return target.reset();
    }

    let bnx = dest.x;
    let bny = dest.y;
    let bnz = dest.z;
    const bmsq = bnx * bnx + bny * bny + bnz * bnz;
    if (bmsq === 0.0) {
      return target.reset();
    }

    if (Math.abs(1.0 - amsq) > 0.000001) {
      const aminv = 1.0 / Math.sqrt(amsq);
      anx *= aminv;
      any *= aminv;
      anz *= aminv;
    }

    if (Math.abs(1.0 - bmsq) > 0.000001) {
      const bminv = 1.0 / Math.sqrt(bmsq);
      bnx *= bminv;
      bny *= bminv;
      bnz *= bminv;
    }

    return target.setComponents(
      anx * bnx + any * bny + anz * bnz,
      any * bnz - anz * bny,
      anz * bnx - anx * bnz,
      anx * bny - any * bnx);
  }

  /**
   * Sets the target to the identity quaternion, ( 1.0, 0.0, 0.0, 0.0 ).
   *
   * @param {Quaternion} target the output quaternion
   * @returns the identity
   */
  static identity (target = new Quaternion()) {

    return target.setComponents(1.0, 0.0, 0.0, 0.0);
  }

  /**
   * Finds the inverse, or reciprocal, of a quaternion, which is the conjugate
   * divided by the magnitude squared.
   * 
   * inverse ( a ) := conj ( a ) / dot( a, a )
   *
   * If a quaternion is of unit length, its inverse is equal to its conjugate.
   *
   * @param {Quaternion} q the input quaternion
   * @param {Quaternion} target the output quaternion
   * @returns the inverse
   */
  static inverse (
    q = new Quaternion(),
    target = new Quaternion()) {

    const mSq = Quaternion.magSq(quat);
    if (mSq === 0.0) {
      return target.reset();
    }

    const i = quat.imag;
    if (Math.abs(1.0 - mSq) < 0.000001) {
      return target.setComponents(
        q.real, -i.x, -i.y, -i.z);
    }

    const mSqInv = 1.0 / mSq;
    return target.setComponents(
      q.real * mSqInv,
      -i.x * mSqInv,
      -i.y * mSqInv,
      -i.z * mSqInv);
  }

  /**
   * Tests if the quaternion is the identity, where its real component is 1.0
   *  and its imaginary components are all zero.
   *
   * @param {Quaternion} q the input quaternion
   * @returns the evaluation
   */
  static isIdentity (q = new Quaternion()) {

    return q.real === 1.0 && Vec3.none(q.imag);
  }

  /**
   * Tests to see if a quaternion is a pure, i.e. if its real component is zero.
   *
   * @param {Quaternion} q the input quaternion
   * @returns the evaluation
   */
  static isPure (q = new Quaternion()) {

    return q.real === 0.0;
  }

  /**
   * Tests if the quaternion is of unit magnitude.
   * 
   * @param {Quaternion} q the input quaternion
   * @returns the evaluation
   */
  static isUnit (q = new Quaternion()) {

    return Quaternion.approxMag(q, 1.0);
  }

  /**
   * Finds the length, or magnitude, of a quaternion.
   * 
   * mag ( a ) := sqrt ( dot ( a, a ) )
   * 
   * mag ( a ) := sqrt ( a conj ( a ) )
   * 
   * @param {Quaternion} q the input quaternion
   * @returns the magnitude
   */
  static mag (q = new Quaternion()) {

    const i = q.imag;
    return Math.hypot(q.real, i.x, i.y, i.z);
  }

  /**
   * Finds the magnitude squared of a quaternion. Equivalent to the dot product
   * of a quaternion with itself and to the product of a quaternion with its
   * conjugate.
   *
   * @param {Quaternion} q the input quaternion
   * @returns the magnitude squared
   */
  static magSq (q = new Quaternion()) {

    return q.real * q.real + Vec3.magSq(q.imag);
  }

  /**
   * Multiplies two quaternions. Also referred to as the
   * Hamilton product. Uses the formula
   * 
   * a b := {
   * areal breal - dot( aimag, bimag ),
   * cross( aimag, bimag ) + areal bimag + breal aimag }
   * 
   * Quaternion multiplication is not commutative.
   * 
   * @param {Quaternion} a left operand
   * @param {Quaternion} b right operand
   * @param {Quaternion} target the output quaternion
   * @returns the product
   */
  static mul (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    const ai = a.imag;
    const bi = b.imag;
    const aw = a.real;
    const bw = b.real;

    return target.setComponents(
      aw * bw - (ai.x * bi.x + ai.y * bi.y + ai.z * bi.z),
      ai.x * bw + aw * bi.x + ai.y * bi.z - ai.z * bi.y,
      ai.y * bw + aw * bi.y + ai.z * bi.x - ai.x * bi.z,
      ai.z * bw + aw * bi.z + ai.x * bi.y - ai.y * bi.x);
  }

  /**
   * Multiplies a vector by a quaternion, in effect rotating the vector by the
   * quaternion. Equivalent to promoting the vector to a pure quaternion,
   * multiplying the rotation quaternion and promoted vector, then dividing the
   * product by the rotation.
   *
   * a b := ( a {0.0, b } ) / b
   * 
   * The result is then demoted to a vector, as the real
   * component should be 0.0 . This is often denoted as P'
   * = RPR' .
   *
   * @param {Quaternion} q the quaternion
   * @param {Vec3} v the input vector
   * @param {Vec3} target the output vector
   * @returns the rotated vector
   */
  static mulVector (
    q = new Quaternion(),
    v = new Vec3(),
    target = new Vec3()) {

    const w = q.real;
    const i = q.imag;

    const qx = i.x;
    const qy = i.y;
    const qz = i.z;

    const iw = -qx * v.x - qy * v.y - qz * v.z;
    const ix = w * v.x + qy * v.z - qz * v.y;
    const iy = w * v.y + qz * v.x - qx * v.z;
    const iz = w * v.z + qx * v.y - qy * v.x;

    return target.setComponents(
      ix * w + iz * qy - iw * qx - iy * qz,
      iy * w + ix * qz - iw * qy - iz * qx,
      iz * w + iy * qx - iw * qz - ix * qy);
  }

  /**
   * Tests if all components of the quaternion are zero.
   *
   * @param {Quaternion} q the quaternion
   * @returns the evaluation
   */
  static none (q = new Quaternion()) {

    return q.real === 0.0 && Vec3.none(q.imag);
  }

  /**
   * Divides a quaternion by its magnitude, such that its new magnitude is one
   * and it lies on a 4D hypersphere. Uses the formula:
   * 
   * norm ( q ) := q / mag ( q )
   * 
   * Quaternions with zero magnitude will return the identity.
   *
   * @param {Quaternion} q the input quaternion 
   * @param {Quaternion} target the output quaternion 
   * @returns the normalized quaternion
   */
  static normalize (
    q = Quaternion(),
    target = new Quaternion()) {

    const mSq = Quaternion.magSq(q);

    if (mSq === 0.0) {
      return Quaternion.identity(target);
    }

    if (Math.abs(1.0 - mSq) < 0.000001) {
      return Quaternion.fromSource(q, target);
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return Quaternion.scale(q, mInv, target);
  }

  /**
   * Creates a random unit quaternion. Uses an algorithm by Ken Shoemake,
   * reproduced at this Math Stack Exchange discussion:
   * https://math.stackexchange.com/questions/131336/uniform-random-quaternion-in-a-restricted-angle-range
   * .
   *
   *  @param {Quaternion} target the output quaternion
   *  @returns the output quaternion
   */
  static random (target = new Quaternion()) {

    const t0 = Math.random() * 6.283185307179586;
    const t1 = Math.random() * 6.283185307179586;
    const r1 = Math.random();
    const x0 = Math.sqrt(1.0 - r1);
    const x1 = Math.sqrt(r1);

    return target.setComponents(
      x0 * Math.sin(t0),
      x0 * Math.cos(t0),
      x1 * Math.sin(t1),
      x1 * Math.cos(t1));
  }

  /**
   * Rotates a quaternion around an arbitrary axis by an angle.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} radians the angle in radians
   * @param {Vec3} axis the axis
   * @param {Quaternion} target the output quaternion
   * @returns the output quaternion
   */
  static rotate (
    q = new Quaternion(),
    radians = 0.0,
    axis = new Vec3(0.0, 0.0, 1.0),
    target = new Quaternion()) {

    const mSq = Quaternion.magSq(q);
    if (mSq === 0.0) {
      return Quaternion.fromAxisAngle(radians, axis, target);
    }

    const wNorm = (mSq === 1.0) ? q.real :
      (q.real / Math.sqrt(mSq));
    const halfAngle = (wNorm <= -1.0) ? Math.PI :
      (wNorm >= 1.0) ? 0.0 :
        Math.acos(wNorm);
    const ang = halfAngle + halfAngle + radians;
    const modAngle = ang - 6.283185307179586 *
      Math.floor(ang * 0.15915494309189535);

    return Quaternion.fromAxisAngle(modAngle, axis, target);
  }

  /**
   * Rotates a quaternion about the x axis by an angle.
   *
   * Do not use sequences of ortho-normal rotations by Euler angles; this will
   * result in gimbal lock, defeating the purpose behind a quaternion.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} radians the angle in radians
   * @param {Quaternion} target the output quaternion
   */
  static rotateX (
    q = new Quaternion(),
    radians = 0.0,
    target = new Quaternion()) {

    const halfAngle = radians * 0.5;
    return Quaternion.rotateXInternal(
      q,
      Math.cos(halfAngle),
      Math.sin(halfAngle),
      target);
  }

  /**
   * Rotates a vector around the x axis. Accepts pre-calculated sine and cosine
   * of half the angle so that collections of quaternions can be efficiently
   * rotated without repeatedly calling cos and sin.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} cosah the cosine of the angle
   * @param {number} sinah the sine of the angle
   * @param {Quaternion} target the output quaternion
   * @returns the rotated quaternion
   */
  static rotateXInternal (
    q = new Quaternion(),
    cosah = 1.0,
    sinah = 0.0,
    target = new Quaternion()) {

    const i = q.imag;
    return target.setComponents(
      cosah * q.real - sinah * i.x,
      cosah * i.x + sinah * q.real,
      cosah * i.y + sinah * i.z,
      cosah * i.z - sinah * i.y);
  }

  /**
   * Rotates a quaternion about the y axis by an angle.
   *
   * Do not use sequences of ortho-normal rotations by Euler angles; this will
   * result in gimbal lock, defeating the purpose behind a quaternion.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} radians the angle in radians
   * @param {Quaternion} target the output quaternion
   */
  static rotateY (
    q = new Quaternion(),
    radians = 0.0,
    target = new Quaternion()) {

    const halfAngle = radians * 0.5;
    return Quaternion.rotateYInternal(
      q,
      Math.cos(halfAngle),
      Math.sin(halfAngle),
      target);
  }

  /**
   * Rotates a vector around the y axis. Accepts pre-calculated sine and cosine
   * of half the angle so that collections of quaternions can be efficiently
   * rotated without repeatedly calling cos and sin.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} cosah the cosine of the angle
   * @param {number} sinah the sine of the angle
   * @param {Quaternion} target the output quaternion
   * @returns the rotated quaternion
   */
  static rotateYInternal (
    q = new Quaternion(),
    cosah = 1.0,
    sinah = 0.0,
    target = new Quaternion()) {

    const i = q.imag;
    return target.setComponents(
      cosah * q.real - sinah * i.y,
      cosah * i.x - sinah * i.z,
      cosah * i.y + sinah * q.real,
      cosah * i.z + sinah * i.x);
  }

  /**
   * Rotates a quaternion about the z axis by an angle.
   *
   * Do not use sequences of ortho-normal rotations by Euler angles; this will
   * result in gimbal lock, defeating the purpose behind a quaternion.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} radians the angle in radians
   * @param {Quaternion} target the output quaternion
   */
  static rotateZ (
    q = new Quaternion(),
    radians = 0.0,
    target = new Quaternion()) {

    const halfAngle = radians * 0.5;
    return Quaternion.rotateZInternal(
      q,
      Math.cos(halfAngle),
      Math.sin(halfAngle),
      target);
  }

  /**
   * Rotates a vector around the z axis. Accepts pre-calculated sine and cosine
   * of half the angle so that collections of quaternions can be efficiently
   * rotated without repeatedly calling cos and sin.
   *
   * @param {Quaternion} q the input quaternion
   * @param {number} cosah the cosine of the angle
   * @param {number} sinah the sine of the angle
   * @param {Quaternion} target the output quaternion
   * @returns the rotated quaternion
   */
  static rotateZInternal (
    q = new Quaternion(),
    cosah = 1.0,
    sinah = 0.0,
    target = new Quaternion()) {

    const i = q.imag;
    return target.setComponents(
      cosah * q.real - sinah * i.z,
      cosah * i.x + sinah * i.y,
      cosah * i.y - sinah * i.x,
      cosah * i.z + sinah * q.real);
  }

  /**
   * Multiplies a quaternion, the left operand, by a scalar, the right operand.
   *
   * @param {Quaternion} a the quaternion
   * @param {number} b the scalar
   * @param {Quaternion} target the output quaternion
   * @returns the scaled quaternion
   */
  static scale (
    a = new Quaternion(),
    b = 1.0,
    target = new Quaternion()) {

    target.real = a.real * b;
    Vec3.scale(a.imag, b);
    return target;
  }

  /**
   * Eases between two quaternions with spherical linear interpolation. Slerp
   * chooses the shortest path between two quaternions and maintains constant
   * speed for a step given in [0.0, 1.0] .
   *
   * @param {Quaternion} origin the origin quaternion
   * @param {Quaternion} dest the destination quaternion
   * @param {number} step the step
   * @param {Quaternion} target the output quaternion
   * @returns the eased quaternion
   */
  static slerp (
    origin = new Quaternion(),
    dest = new Quaternion(),
    step = 0.5,
    target = new Quaternion()) {

    const ai = origin.imag;
    const aw = origin.real;
    const ax = ai.x;
    const ay = ai.y;
    const az = ai.z;

    const bi = dest.imag;
    let bw = dest.real;
    let bx = bi.x;
    let by = bi.y;
    let bz = bi.z;

    let dotp = aw * bw + ax * bx + ay * by + az * bz;
    dotp = Math.min(Math.max(dotp, -1.0), 1.0);
    if (dotp < 0.0) {
      bw = -bw;
      bx = -bx;
      by = -by;
      bz = -bz;
      dotp = -dotp;
    }

    const theta = Math.acos(dotp);
    const sinTheta = Math.sqrt(1.0 - dotp * dotp);
    let u = 1.0;
    let v = 0.0;
    if (sinTheta > 0.0) {
      const sInv = 1.0 / sinTheta;
      u = Math.sin((1.0 - step) * theta) * sInv;
      v = Math.sin(step * theta) * sInv;
    } else {
      u = 1.0 - step;
      v = step;
    }

    const cw = u * aw + v * bw;
    const cx = u * ax + v * bx;
    const cy = u * ay + v * by;
    const cz = u * az + v * bz;

    const mSq = cw * cw + cx * cx + cy * cy + cz * cz;

    if (mSq === 0.0) {
      return Quaternion.identity(target);
    }

    if (mSq === 1.0) {
      return target.setComponents(cw, cx, cy, cz);
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    return target.setComponents(
      cw * mInv,
      cx * mInv,
      cy * mInv,
      cz * mInv);
  }

  /**
   * Subtracts the right quaternion from the left.
   * 
   * @param {Quaternion} a the left operand
   * @param {Quaternion} b the right operand
   * @param {Quaternion} target the output quaternion
   * @returns the difference
   */
  static sub (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real - b.real;
    Vec3.sub(a.imag, b.imag, target.imag);
    return target;
  }

  /**
   * Subtracts the right quaternion from the left and
   * normalizes the difference.
   * 
   * @param {Quaternion} a the left operand
   * @param {Quaternion} b the right operand
   * @param {Quaternion} target the output quaternion
   * @returns the normalized difference
   */
  static subNorm (
    a = new Quaternion(),
    b = new Quaternion(),
    target = new Quaternion()) {

    target.real = a.real - b.real;
    Vec3.sub(a.imag, b.imag, target.imag);

    const mSq = Quaternion.magSq(target);
    if (mSq === 0.0) {
      return target.reset();
    }

    const mInv = 1.0 / Math.sqrt(mSq);
    const i = target.imag;
    return target.setComponents(
      target.real * mInv,
      i.x * mInv,
      i.y * mInv,
      i.z * mInv);
  }

  /**
   * Converts a quaternion to three axes, which in turn may constitute a
   * rotation matrix. Returns an object containing all three axes.
   *
   * @param {Quaternion} q the quaternion
   * @param {Vec3} right the right axis
   * @param {Vec3} forward the forward axis
   * @param {Vec3} up the up axis
   * @returns the three axes
   */
  static toAxes (
    q = new Quaternion(),
    right = Vec3.right(),
    forward = Vec3.forward(),
    up = Vec3.up()) {

    const w = q.real;
    const i = q.imag;
    const x = i.x;
    const y = i.y;
    const z = i.z;

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xsq2 = x * x2;
    const ysq2 = y * y2;
    const zsq2 = z * z2;

    const xy2 = x * y2;
    const xz2 = x * z2;
    const yz2 = y * z2;

    const wx2 = w * x2;
    const wy2 = w * y2;
    const wz2 = w * z2;

    right.setComponents(
      1.0 - ysq2 - zsq2,
      xy2 + wz2,
      xz2 - wy2);

    forward.setComponents(
      xy2 - wz2,
      1.0 - xsq2 - zsq2,
      yz2 + wx2);

    up.setComponents(
      xz2 + wy2,
      yz2 - wx2,
      1.0 - xsq2 - ysq2);

    return {
      right: right,
      forward: forward,
      up: up
    };
  }

  /**
   * Converts a quaternion to an axis and angle. The axis is assigned to an
   * output vector. The function returns an object containing both the axis and
   * angle.
   *
   * @param {Quaternion} q the quaternion
   * @param {Vec3} axis the output axis
   * @returns an object containing axis and angle
   */
  static toAxisAngle (
    q = new Quaternion(),
    axis = new Vec3()) {

    const mSq = Quaternion.magSq(q);

    if (mSq === 0.0) {
      Vec3.forward(axis);
      return { angle: 0.0, axis: axis };
    }

    let wNorm = 0.0;
    // let xNorm = 0.0;
    // let yNorm = 0.0;
    // let zNorm = 0.0;
    const i = q.imag;

    if (Math.abs(1.0 - mSq) < 0.000001) {
      const mInv = 1.0 / Math.sqrt(mSq);
      wNorm = q.real * mInv;
      // xNorm = i.x * mInv;
      // yNorm = i.y * mInv;
      // zNorm = i.z * mInv;
    } else {
      wNorm = q.real;
      // xNorm = i.x;
      // yNorm = i.y;
      // zNorm = i.z;
    }

    const angle = (wNorm <= -1.0) ? 6.283185307179586 :
      (wNorm >= 1.0) ? 0.0 :
        2.0 * Math.acos(wNorm);
    const wAsin = 6.283185307179586 - angle;
    if (wAsin === 0.0) {
      Vec3.forward(axis);
      return { angle: angle, axis: axis };
    }

    const sInv = 1.0 / wAsin;
    // const ax = xNorm * sInv;
    // const ay = yNorm * sInv;
    // const az = zNorm * sInv;
    const ax = i.x * sInv;
    const ay = i.y * sInv;
    const az = i.z * sInv;

    const amSq = ax * ax + ay * ay + az * az;

    if (amSq === 0.0) {
      Vec3.forward(axis);
      return { angle: angle, axis: axis };
    }

    if (Math.abs(1.0 - amSq) < 0.000001) {
      axis.setComponents(ax, ay, az);
      return { angle: angle, axis: axis };
    }

    const mInv = 1.0 / Math.sqrt(amSq);
    axis.setComponents(
      ax * mInv,
      ay * mInv,
      az * mInv);
    return { angle: angle, axis: axis };
  }
}

/* Aliases. */
Quaternion.compare = Quaternion.compareWzyx;