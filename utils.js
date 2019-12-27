'use strict';

class Utils {

  /**
   * A quick approximation test. Tests to see if the absolute of the difference
   * between two values is less than a tolerance. Does not handle edge cases.
   *
   * @param {number} a the left operand
   * @param {number} b the right operand
   * @param {number} tolerance the tolerance
   * @returns the evaluation
   */
  static approx (
    a = 0.0,
    b = 0.0,
    tolerance = 0.000001) {

    return Math.abs(b - a) < tolerance;
  }

  /**
   * A clamped version of arc-cosine.
   *
   * @param {number} v the input value
   * @returns the radians
   */
  static acos (v = 0.0) {
    return (v <= -1.0) ? Math.PI :
      (v >= 1.0) ? 0.0 :
        Math.acos(v);
  }


  /**
   * A clamped version of arc-sine.
   *
   * @param {number} v the input value
   * @returns the radians
   */
  static asin (v = 0.0) {
    return (v <= -1.0) ? -Utils.HALF_PI :
      (v >= 1.0) ? Utils.HALF_PI :
        Math.asin(v);
  }

  /**
   * Clamps a value between a lower and an upper bound.
   *
   * @param {number} v the value
   * @param {number} lb the lower bound
   * @param {number} ub the upper bound
   * @returns the clamped value
   */
  static clamp (v = 0.0, lb = 0.0, ub = 1.0) {

    return v < lb ? lb : v > ub ? ub : v;
  }

  /**
   * Multiplies a magnitude, the left operand, by the sign of the right operand,
   * such that the magnitude of a matches the sign of b.
   *
   * @param {number} a left operand
   * @param {number} b right operand
   * @returns the signed magnitude
   */
  static copySign (a = 0.0, b = 1.0) {

    return a * Math.sign(b);
  }

  /**
   * Converts an angle in radians to an angle in degrees.
   *
   * @param {number} radians the angle in radians
   * @returns the angle in degrees
   */
  static degrees (radians = 0.0) {

    return radians * Utils.RAD_TO_DEG;
  }

  /**
   * Finds the absolute value of the left operand minus the right.
   *
   * @param {number} a left operand
   * @param {number} b right operand
   * @returns the difference
   */
  static diff (a = 0.0, b = 0.0) {

    return Math.abs(b - a);
  }

  /**
   * Divides the left operand by the right, but returns zero when the
   * denominator is zero. This is to simulate the convention of shading
   * languages like GLSL and OSL.
   *
   * @param {number} a the numerator
   * @param {number} b the denominator
   * @returns the quotient
   */
  static div (a = 0.0, b = 0.0) {

    return b !== 0.0 ? a / b : 0.0;
  }

  /**
   * Applies the modulo operator (%) to the operands, which implicitly uses the
   * formula fmod ( a, b ) := a - b trunc ( a / b ) .
   *
   * When the left operand is negative and the right operand is positive, the
   * result will be negative. For periodic values, such as an angle, where the
   * direction of change could be either clockwise or counterclockwise, use mod.
   *
   * If the right operand is one, use fract(a) or a - trunc(a) instead.
   *
   * @param {number} a the left operand
   * @param {number} b the right operand
   * @returns the result
   */
  static fmod (a = 0.0, b = 0.0) {

    return b !== 0.0 ? a % b : a;
  }

  /**
   * Finds the fractional portion of the input value by subtracting the value's
   * truncation from the value, i.e., fract ( a ) := a - trunc ( a ) .
   *
   * Use this instead of fmod ( a, 1.0 ) or a % 1.0.
   *
   * @param {number} a the input value
   * @returns the fractional portion
   */
  static fract (a = 0.0) {

    return a - Math.trunc(a);
  }

  /**
   * Attempts to return a hash code for an object, assumed to be a number.
   * Converts the input to a String.
   *
   * @param {object} v an object
   * @returns the hash code
   */
  static hash (v = '') {

    const s = String(v);
    const len = s.length;
    let h = 0;
    for (let i = 0; i < len; ++i) {
      h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return h >>> 0;
  }

  /**
   * Linear interpolation from the origin to the destination value by a step. If
   * the step is less than zero, returns the origin. If the step is greater than
   * one, returns the destination.
   *
   * @param {number} a the origin value
   * @param {number} b the destination value
   * @param {number} t the step
   * @returns the interpolated value
   */
  static lerp (a = 0.0, b = 1.0, t = 0.5) {

    if (t <= 0.0) { return a; }
    if (t >= 1.0) { return b; }
    return Utils.lerpUnclamped(a, b, t);
  }

  /**
   * Linear interpolation from the origin to the destination value by a step.
   * Does not check to see if the step is beyond the range [0.0, 1.0] .
   *
   * @param {number} a the origin value
   * @param {number} b the destination value
   * @param {number} t the step
   * @returns the interpolated value
   */
  static lerpUnclamped (a = 0.0, b = 1.0, t = 0.5) {

    return (1.0 - t) * a + t * b;
  }

  /**
   * Maps an input value from an original range to a target range. If the upper
   * and lower bound of the original range are equal, will return the lower
   * bound of the destination range.
   *
   * @param {number} value the input value
   * @param {number} lbOrigin lower bound of original range
   * @param {number} ubOrigin upper bound of original range
   * @param {number} lbDest lower bound of destination range
   * @param {number} ubDest upper bound of destination range
   * @returns the mapped value
   */
  static map (
    value = 0.0,
    lbOrigin = -1.0,
    ubOrigin = 1.0,
    lbDest = 0.0,
    ubDest = 1.0) {

    const denom = ubOrigin - lbOrigin;
    if (denom === 0.0) { return lbDest; }
    return lbDest + (ubDest - lbDest) * ((value - lbOrigin) / denom);
  }

  /**
   * Applies floorMod to the operands, and therefore uses the formula mod ( a,
   * b) := a - b * floor ( a / b ) .
   *
   * If the right operand is one, use mod1(a) or a - floor(a) instead.
   *
   * @param {number} a the left operand
   * @param {number} b the right operand
   * @returns the result
   */
  static mod (a = 0.0, b = 1.0) {

    return b !== 0.0 ? a - b * Math.floor(a / b) : a;
  }

  /**
   * Subtracts the floor of the input value from the value.
   *
   * Use this instead of mod(a, 1.0).
   *
   * @param {number} a the input value
   * @returns the result
   */
  static mod1 (a = 0.0) {

    return a - Math.floor(a);
  }

  /**
   * A specialized version of mod which shifts an angle in degrees to the range
   * [0, 360].
   *
   * @param {number} degrees the angle in degrees
   * @returns the unsigned degrees
   */
  static modDegrees (degrees = 0.0) {

    return degrees - 360.0 * Math.floor(degrees * Utils.ONE_360);
  }

  /**
   * A specialized version of mod which shifts an angle in radians to the range
   * [0, TAU] .
   *
   * @param {number} radians the angle in radians
   * @returns the unsigned radians
   */
  static modRadians (radians = 0.0) {

    return radians - Utils.TAU * Math.floor(radians * Utils.ONE_TAU);
  }

  /**
   * Converts an angle in degrees to an angle in radians.
   *
   * @param {number} degrees the angle in degrees
   * @returns the angle in radians
   */
  static radians (degrees = 0.0) {

    return degrees * Utils.DEG_TO_RAD;
  }

  /**
   * Eases between an origin and destination by a step in [0.0, 1.0] .
   *
   * @param {number} a the origin
   * @param {number} b the destination
   * @param {number} t the step
   * @returns the eased value
   */
  static smoothStep (a = 0.0, b = 1.0, t = 0.5) {

    if (t <= 0.0) { return a; }
    if (t >= 1.0) { return b; }
    return Utils.lerpUnclamped(a, b,
      t * t * (3.0 - (t + t)));
  }

  /**
   * Returns a random value between the lower and upper bounds.
   *
   * @param {number} a the lower bound
   * @param {number} b the upper bound
   * @returns the random value
   */
  static uniform (a = 0.0, b = 1.0) {

    return Utils.lerpUnclamped(a, b, Math.random());
  }

  /**
   * An angle in degrees is multiplied by this constant to convert it to
   * radians. PI / 180.0 , approximately 0.017453292 .
   */
  static get DEG_TO_RAD () {

    return 0.017453292519943295;
  }

  /**
   * Smallest signficant differentiation between two floating point values.
   * Approximately 0.000001 . Alternatively, see Number.EPSILON .
   */
  static get EPSILON () {

    return 0.000001;
  }

  /**
   * PI divided by two. Approximately 1.570796327 .
   */
  static get HALF_PI () {

    return 1.5707963267948966;
  }

  /**
   * One-255th, 1.0 / 255.0 . Useful when converting a color with channels in
   * the range [0, 255] to a color in the range [0.0, 1.0] . Approximately
   * 0.003921569 .
   */
  static get ONE_255 () {

    return 0.00392156862745098;
  }

  /**
   * One divided by 360 degrees, 1.0 / 360 ; approximately 0.0027777778 . Useful
   * for converting an index in a for-loop to an angle in degrees.
   */
  static get ONE_360 () {

    return 0.002777777777777778;
  }

  /**
   * One divided by TAU. Approximately 0.15915494 . Useful for converting an
   * index in a for-loop to an angle and for applying mod to an angle.
   */
  static get ONE_TAU () {

    return 0.15915494309189535;
  }

  /**
   * An approximation of \u03c6, or ( 1.0 + SQRT ( 5.0 ) ) / 2.0 , 1.61803399 .
   */
  static get PHI () {

    return 1.618033988749895;
  }

  /**
   * An approximation of PI , approximately 3.1415927 .
   */
  static get PI () {

    return 3.141592653589793;
  }

  /**
   * An angle in radians is multiplied by this constant to convert it to
   * degrees. 180.0 / PI, approximately 57.29578 .
   */
  static get RAD_TO_DEG () {

    return 57.29577951308232;
  }

  /**
   * An approximation of ( SQRT ( 3.0 ) ) / 2.0 , 0.8660254 .
   */
  static get SQRT_3_2 () {

    return 0.8660254037844386;
  }

  /**
   * An approximation of TAU . Equal to 2.0 PI, or 6.2831853 .
   */
  static get TAU () {

    return 6.283185307179586;
  }

  /**                                   
   * An approximation of PI / 3.0 , 1.0471976 . Useful for describing the field
   * of view in a perspective camera.
   */
  static get THIRD_PI () {

    return 1.0471975511965976;
  }
}