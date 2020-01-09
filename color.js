'use strict';

class Color extends Vec4 {

  constructor (r = 0.0, g = 0.0, b = 0.0, a = 1.0) {

    super(r, g, b, a);
  }

  get a () {

    return this._w;
  }

  get b () {

    return this._z;
  }

  get g () {

    return this._y;
  }

  get r () {

    return this._x;
  }

  set a (v) {

    this._w = v;
  }

  set b (v) {

    this._z = v;
  }

  set g (v) {

    this._y = v;
  }

  set r (v) {

    this._x = v;
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'string':
        return Color.toHexString(this);
      case 'number':
      default:
        return Color.toHexInt(this);
    }
  }

  reset () {

    this._x = 0.0;
    this._y = 0.0;
    this._z = 0.0;
    this._w = 1.0;

    return this;
  }

  /**
   * Sets each channel of the color.
   * 
   * @param {number} r red
   * @param {number} g green
   * @param {number} b blue
   * @param {number} a alpha
   * @returns this color
   */
  setComponents (r = 0.0, g = 0.0, b = 0.0, a = 1.0) {
    this._x = r;
    this._y = g;
    this._z = b;
    this._w = a;

    return this;
  }

  toJsonString (precision = 6) {

    return [
      '{\"r\":',
      this._x.toFixed(precision),
      ',\"g\":',
      this._y.toFixed(precision),
      ',\"b\":',
      this._z.toFixed(precision),
      ',\"a\":',
      this._w.toFixed(precision),
      '}'
    ].join('');
  }

  toObject () {

    return {
      r: this._x,
      g: this._y,
      b: this._z,
      a: this._w
    };
  }

  toString (precision = 4) {

    return [
      '{ r: ',
      this._x.toFixed(precision),
      ', g: ',
      this._y.toFixed(precision),
      ', b: ',
      this._z.toFixed(precision),
      ', a: ',
      this._w.toFixed(precision),
      ' }'
    ].join('');
  }

  /**
   * Converts two colors to integers, performs the bitwise AND operation on
   * them, then converts the result to a color.
   *
   * @param {Color} a the left operand
   * @param {Color} b the right operand
   * @param {Color} target the output color
   * @returns the result
   */
  static bitAnd (
    a = new Color(),
    b = new Color(),
    target = new Color()) {

    return Color.fromHexInt(
      Color.toHexInt(a) & Color.toHexInt(b),
      target);
  }

  /**
   * Converts a color to an integer, performs the bitwise NOT operation on it,
   * then converts the result to a color.
   *
   * @param {Color} c the input color
   * @param {Color} target the output color
   * @returns the negation
   */
  static bitNot (
    c = new Color(),
    target = new Color()) {

    return Color.fromHexInt(
      ~Color.toHexInt(c),
      target);
  }

  /**
   * Converts two colors to integers, performs the bitwise OR operation
   * (inclusive or) on them, then converts the result to a color.
   *
   * @param {Color} a the left operand
   * @param {Color} b the right operand
   * @param {Color} target the output color
   * @returns the color
   */
  static bitOr (
    a = new Color(),
    b = new Color(),
    target = new Color()) {

    return Color.fromHexInt(
      Color.toHexInt(a) | Color.toHexInt(b),
      target);
  }

  /**
   * Converts a color to an integer, performs a bitwise left
   * shift operation, then converts the result to a color. The
   * number of places is multiplied by 0x08.
   * 
   * @param {Color} c the color
   * @param {number} places the number of places
   * @param {Color} target the output color
   * @returns the shifted color
   */
  static bitShiftLeft (
    c = new Color(),
    places = 1,
    target = new Color()) {

    return Color.fromHexInt(
      Color.toHexInt(c) << (places * 0x08),
      target);
  }

  /**
   * Converts a color to an integer, performs a bitwise right
   * shift operation, then converts the result to a color. The
   * number of places is multiplied by 0x08.
   * 
   * @param {Color} c the color
   * @param {number} places the number of places
   * @param {Color} target the output color
   * @returns the shifted color
   */
  static bitShiftRight (
    c = new Color(),
    places = 1,
    target = new Color()) {

    return Color.fromHexInt(
      Color.toHexInt(c) >> (places * 0x08),
      target);
  }

  /**
   * Converts a color to an integer, performs an unsigned
   * bitwise right shift operation, then converts the result
   * to a color. The number of places is multiplied by 0x08.
   * 
   * @param {Color} c the color
   * @param {number} places the number of places
   * @param {Color} target the output color
   * @returns the shifted color
   */
  static bitShiftRightUnsigned (
    c = new Color(),
    places = 1,
    target = new Color()) {

    return Color.fromHexInt(
      Color.toHexInt(c) >>> (places * 0x08),
      target);
  }

  /**
   * Converts two colors to integers, performs the bitwise XOR
   * operation (exclusive or) on them, then converts the
   * result to a color.
   * 
   * @param {Color} a the left operand
   * @param {Color} b the right operand
   * @param {Color} target the output color
   * @returns the color
   */
  static bitXor (
    a = new Color(),
    b = new Color(),
    target = new Color()) {

    return Color.fromHexInt(
      Color.toHexInt(a) ^ Color.toHexInt(b),
      target);
  }

  /**
   * Returns the color black, ( 0.0, 0.0, 0.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns black
   */
  static black (target = new Color()) {

    return target.setComponents(0.0, 0.0, 0.0, 1.0);
  }

  /**
   * Returns the color blue, ( 0.0, 0.0, 1.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns blue
   */
  static blue (target = new Color()) {

    return target.setComponents(0.0, 0.0, 1.0, 1.0);
  }

  /**
     * Clamps a color to a lower- and upper-bound.
     * 
     * @param {Color} c the color
     * @param {Color} lb the lower bound
     * @param {Color} ub the upper bound
     * @param {Color} target the output color
     * @returns the clamped color
     */
  static clamp (
    c = new Color(),
    lb = new Color(0.0, 0.0, 0.0, 1.0),
    ub = new Color(1.0, 1.0, 1.0, 1.0),
    target = new Color()) {

    return target.setComponents(
      Math.min(Math.max(c.x, lb.x), ub.x),
      Math.min(Math.max(c.y, lb.y), ub.y),
      Math.min(Math.max(c.z, lb.z), ub.z),
      Math.min(Math.max(c.w, lb.w), ub.w));
  }

  /**
   * Ensures that the values of the color are clamped to the
   * range [0.0, 1.0].
   * 
   * @param {Color} c the color
   * @param {Color} target the output color
   * @returns the clamped color
   */
  static clamp01 (
    c = new Color(),
    target = new Color()) {

    return target.setComponents(
      Math.min(Math.max(c.x, 0.0), 1.0),
      Math.min(Math.max(c.y, 0.0), 1.0),
      Math.min(Math.max(c.z, 0.0), 1.0),
      Math.min(Math.max(c.w, 0.0), 1.0));
  }

  /**
   * Returns the color clear black, ( 0.0, 0.0, 0.0, 0.0 ) .
   *
   * @param {Color} target the output color
   * @returns clear black
   */
  static clearBlack (target = new Color()) {

    return target.setComponents(0.0, 0.0, 0.0, 0.0);
  }

  /**
   * Returns the color clear white, ( 1.0, 1.0, 1.0, 0.0 ) .
   *
   * @param {Color} target the output color
   * @returns clear white
   */
  static clearWhite (target = new Color()) {

    return target.setComponents(1.0, 1.0, 1.0, 0.0);
  }

  /**
   * Compares two colors by luminance. To be provided to array sort functions.
   *
   * @param {Color} a left comparisand
   * @param {Color} b right comparisand
   * @returns the comparison
   */
  static compareLuminance (
    a = new Color(),
    b = new Color()) {

    const aLum = Color.luminance(a);
    const bLum = Color.luminance(b);

    if (aLum > bLum) { return 1; }
    if (aLum < bLum) { return -1; }

    return 0;
  }

  /**
   * Returns the color cyan, ( 0.0, 1.0, 1.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns cyan
   */
  static cyan (target = new Color()) {

    return target.setComponents(0.0, 1.0, 1.0, 1.0);
  }

  /**
   * Converts a 2D direction to a color. Normalizes the
   * direction, multiplies it by 0.5, then adds 0.5 .
   * 
   * @param {Vec2} v the 2D direction
   * @param {Color} target the output color
   * @returns the color 
   */
  static fromDir2 (v, target = new Color()) {

    const mSq = v.x * v.x + v.y * v.y;
    if (mSq === 0.0) {
      return target.setComponents(0.5, 0.5, 0.5, 1.0);
    }

    let r = 0.5;
    let g = 0.5;

    if (Math.abs(1.0 - mSq) < 0.000001) {
      r = v.x * 0.5 + 0.5;
      g = v.y * 0.5 + 0.5;
    } else {
      const mInv = 0.5 / Math.sqrt(mSq);
      r = v.x * mInv + 0.5;
      g = v.y * mInv + 0.5;
    }

    return target.setComponents(r, g, 0.5, 1.0);
  }

  /**
   * Converts a 3D direction to a color. Normalizes the
   * direction, multiplies it by 0.5, then adds 0.5 .
   * 
   * @param {Vec3} v the 3D direction
   * @param {Color} target the output color
   * @returns the color 
   */
  static fromDir3 (v, target = new Color()) {

    const mSq = v.x * v.x + v.y * v.y + v.z * v.z;
    if (mSq === 0.0) {
      return target.setComponents(0.5, 0.5, 0.5, 1.0);
    }

    let r = 0.5;
    let g = 0.5;
    let b = 0.5;

    if (Math.abs(1.0 - mSq) < 0.000001) {
      r = v.x * 0.5 + 0.5;
      g = v.y * 0.5 + 0.5;
      b = v.z * 0.5 + 0.5;
    } else {
      const mInv = 0.5 / Math.sqrt(mSq);
      r = v.x * mInv + 0.5;
      g = v.y * mInv + 0.5;
      b = v.y * mInv + 0.5;
    }

    return target.setComponents(r, g, b, 1.0);
  }

  /**
   * Convert a hexadecimal representation of a color stored as AARRGGBB into a
   * color.
   *
   * @param {number} c the color in hexadecimal
   * @param {Color} target the output color
   * @returns the color
   */
  static fromHexInt (
    c = 0xff000000,
    target = new Color()) {

    return target.setComponents(
      (c >> 0x10 & 0xff) * 0.00392156862745098,
      (c >> 0x8 & 0xff) * 0.00392156862745098,
      (c & 0xff) * 0.00392156862745098,
      (c >> 0x18 & 0xff) * 0.00392156862745098);
  }

  /**
   * Creates a color from the array.
   *
   * @param {Array} arr the array
   * @param {Color} target the output color
   * @returns the color
   */
  static fromArray (
    arr = [0.0, 0.0, 0.0, 1.0],
    target = new Color()) {

    const len = arr.length;
    switch (len) {
      case 2:
        return target.setComponents(
          arr[0], arr[0], arr[0], arr[1]);
      case 3:
        return target.setComponents(
          arr[0], arr[1], arr[2], 1.0);
      case 4:
      default:
        return target.setComponents(
          arr[0], arr[1], arr[2], arr[3]);
    }
  }

  /**
   * Creates a color from a scalar.
   *
   * @param {number} scalar the scalar
   * @param {number} alpha the alpha channel
   * @param {Color} target the output color
   * @returns the color
   */
  static fromScalar (
    scalar = 1.0,
    alpha = scalar,
    target = new Color()) {

    return target.setComponents(
      scalar,
      scalar,
      scalar,
      alpha);
  }

  /**
   * Creates a color from a source, which can be either a Vec4 or a Color, which
   * is a child of the former.
   *
   * @param {Vec4} source the source vector
   * @param {Color} target the output color
   * @returns the color
   */
  static fromSource (
    source = new Vec4(),
    target = new Color()) {

    return target.setComponents(
      source.x,
      source.y,
      source.z,
      source.w);
  }

  /**
   * Returns the color green, ( 0.0, 1.0, 0.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns green
   */
  static green (target = new Color()) {

    return target.setComponents(0.0, 1.0, 0.0, 1.0);
  }

  /**
   * Converts from a Vec4 -- which contains data for hue, saturation and
   * brightness -- to a color with red, green and blue channels.
   *
   * @param {Vec4} v the hsba vector
   * @param {Color} target the output color
   * @returns the color
   */
  static hsbaToRgba (
    v = new Vec4(0.0, 0.0, 0.0, 1.0),
    target = new Color()) {

    if (v.y <= 0.0) {
      return target.setComponents(v.z, v.z, v.z, v.w);
    }

    const h = (v.x - Math.floor(v.x)) * 6.0;
    const sector = Math.trunc(h);
    const tint1 = v.z * (1.0 - v.y);
    const tint2 = v.z * (1.0 - v.y * (h - sector));
    const tint3 = v.z * (1.0 - v.y * (1.0 + sector - h));

    switch (sector) {
      case 0:
        return target.setComponents(v.z, tint3, tint1, v.w);
      case 1:
        return target.setComponents(tint2, v.z, tint1, v.w);
      case 2:
        return target.setComponents(tint1, v.z, tint3, v.w);
      case 3:
        return target.setComponents(tint1, tint2, v.z, v.w);
      case 4:
        return target.setComponents(tint3, tint1, v.z, v.w);
      case 5:
        return target.setComponents(v.z, tint1, tint2, v.w);
      default:
        return Color.black(target);
    }
  }

  /**
   * Eases between an origin and destination color with linear interpolation.
   * 
   * @param {Color} origin the origin color
   * @param {Color} dest the destination color
   * @param {number} step the step
   * @param {Color} target the output color
   * @returns the eased color
   */
  static lerpRgba (
    origin = new Color(0.0, 0.0, 0.0, 1.0),
    dest = new Color(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    target = new Color()) {

    if (step <= 0.0) {
      return Color.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Color.fromSource(dest, target);
    }

    const u = 1.0 - step
    return target.setComponents(
      u * origin.x + step * dest.x,
      u * origin.y + step * dest.y,
      u * origin.z + step * dest.z,
      u * origin.w + step * dest.w);
  }

  /**
   * Eases between an origin and destination color with hermite interpolation.
   *
   * @param {Color} origin the origin color
   * @param {Color} dest the destination color
   * @param {number} step the step
   * @param {Color} target the output color
   * @returns the eased color
   */
  static smoothStepRgba (
    origin = new Color(0.0, 0.0, 0.0, 1.0),
    dest = new Color(1.0, 1.0, 1.0, 1.0),
    step = 0.5,
    target = new Color()) {

    if (step <= 0.0) {
      return Color.fromSource(origin, target);
    }

    if (step >= 1.0) {
      return Color.fromSource(dest, target);
    }

    const t = step * step * (3.0 - (step + step));
    const u = 1.0 - t;
    return target.setComponents(
      u * origin.x + t * dest.x,
      u * origin.y + t * dest.y,
      u * origin.z + t * dest.z,
      u * origin.w + t * dest.w);
  }

  /**
   * Returns the relative luminance of the color, based on
   * https://en.wikipedia.org/wiki/Relative_luminance .
   *
   * @param {Color} c the input color
   * @returns the luminance 
   */
  static luminance (c = new Color()) {

    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  }

  /**
   * Returns the color magenta, ( 1.0, 0.0, 1.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns magenta
   */
  static magenta (target = new Color()) {

    return target.setComponents(1.0, 0.0, 1.0, 1.0);
  }

  /**
   * Returns an array of 16 values which approximate the Magma color palette
   * used in data vizualization.
   *
   * @returns the array
   */
  static paletteMagma () {
    return [
      new Color(0.988235, 1.000000, 0.698039, 1.0), // 0xFFFCFFB2
      new Color(0.987190, 0.843137, 0.562092, 1.0), // 0xFFFCD78F
      new Color(0.984314, 0.694118, 0.446275, 1.0), // 0xFFFBB172
      new Color(0.981176, 0.548235, 0.354510, 1.0), // 0xFFFA8C5A

      new Color(0.962353, 0.412549, 0.301176, 1.0), // 0xFFF5694D
      new Color(0.912418, 0.286275, 0.298039, 1.0), // 0xFFE9494C
      new Color(0.824314, 0.198431, 0.334902, 1.0), // 0xFFD23355
      new Color(0.703268, 0.142484, 0.383007, 1.0), // 0xFFB32462
      
      new Color(0.584052, 0.110588, 0.413856, 1.0), // 0xFF951C6A
      new Color(0.471373, 0.080784, 0.430588, 1.0), // 0xFF78156E
      new Color(0.367320, 0.045752, 0.432680, 1.0), // 0xFF5E0C6E
      new Color(0.267974, 0.002353, 0.416732, 1.0), // 0xFF44016A

      new Color(0.174118, 0.006275, 0.357647, 1.0), // 0xFF2C025B
      new Color(0.093856, 0.036863, 0.232941, 1.0), // 0xFF18093B
      new Color(0.040784, 0.028758, 0.110327, 1.0), // 0xFF0A071C
      new Color(0.000000, 0.000000, 0.019608, 1.0)  // 0xFF000005
    ];
  }

  /**
   * Returns an array of 16 values which approximate the Viridis color palette
   * used in data vizualization.
   *
   * @returns the array
   */
  static paletteViridis () {
    return [
      new Color(0.266667, 0.003922, 0.329412, 1.0), // 0xFF440154
      new Color(0.282353, 0.100131, 0.420654, 1.0), // 0xFF481A6B
      new Color(0.276078, 0.184575, 0.487582, 1.0), // 0xFF462F7C
      new Color(0.254902, 0.265882, 0.527843, 1.0), // 0xFF414487

      new Color(0.221961, 0.340654, 0.549281, 1.0), // 0xFF39578C
      new Color(0.192157, 0.405229, 0.554248, 1.0), // 0xFF31678D
      new Color(0.164706, 0.469804, 0.556863, 1.0), // 0xFF2A788E
      new Color(0.139869, 0.534379, 0.553464, 1.0), // 0xFF24888D

      new Color(0.122092, 0.595033, 0.543007, 1.0), // 0xFF1F988A
      new Color(0.139608, 0.658039, 0.516863, 1.0), // 0xFF24A884
      new Color(0.210458, 0.717647, 0.471895, 1.0), // 0xFF36B778
      new Color(0.326797, 0.773595, 0.407582, 1.0), // 0xFF53C568

      new Color(0.477647, 0.821961, 0.316863, 1.0), // 0xFF7AD251
      new Color(0.648366, 0.858039, 0.208889, 1.0), // 0xFFA5DB35
      new Color(0.825098, 0.884967, 0.114771, 1.0), // 0xFFD2E21D
      new Color(0.992157, 0.905882, 0.145098, 1.0)  // 0xFFFDE725
    ];
  }

  /**
   * Multiplies the red, green and blue color channels of a color by the alpha
   * channel.
   *
   * @param {Color} c the input color
   * @param {Color} target the output color
   * @returns the multiplied color
   */
  static preMultiply (
    c = new Color(),
    target = new Color()) {

    if (c.a <= 0.0) {
      return Color.clearBlack(target);
    }

    if (c.a >= 1.0) {
      return target.setComponents(c.r, c.g, c.b, 1.0);
    }

    return target.setComponents(
      c.r * c.a,
      c.g * c.a,
      c.b * c.a,
      c.a);
  }

  /**
   * Creates a random HSBA vector, then converts it to an RGBA color.
   *
   * @param {Vec4} lb the lower bound
   * @param {Vec4} ub the upper bound
   * @param {Color} target the output color
   * @param {Vec4} hsba the hsba color
   * @returns the color
   */
  static randomHsba (
    lb = new Vec4(0.0, 0.0, 0.0, 1.0),
    ub = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Color(),
    hsba = new Vec4()) {

    const hf = Math.random();
    const sf = Math.random();
    const bf = Math.random();
    const af = Math.random();

    hsba.setComponents(
      (1.0 - hf) * lb.x + hf * ub.x,
      (1.0 - sf) * lb.y + sf * ub.y,
      (1.0 - bf) * lb.z + bf * ub.z,
      (1.0 - af) * lb.w + af * ub.w);

    return Color.hsbaToRgba(hsba, target);
  }

  /**
   * Creates a random color from red, green, blue and alpha channels.
   * 
   * @param {Vec4} lb the lower bound
   * @param {Vec4} ub the upper bound
   * @param {Color} target the output color
   */
  static randomRgba (
    lb = new Vec4(0.0, 0.0, 0.0, 1.0),
    ub = new Vec4(1.0, 1.0, 1.0, 1.0),
    target = new Color()) {

    const rf = Math.random();
    const gf = Math.random();
    const bf = Math.random();
    const af = Math.random();

    return target.setComponents(
      (1.0 - rf) * lb.x + rf * ub.x,
      (1.0 - gf) * lb.y + gf * ub.y,
      (1.0 - bf) * lb.z + bf * ub.z,
      (1.0 - af) * lb.w + af * ub.w);
  }

  /**
   * Returns the color red, ( 1.0, 0.0, 0.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns red
   */
  static red (target = new Color()) {

    return target.setComponents(1.0, 0.0, 0.0, 1.0);
  }

  /**
   * Converts a color to grayscale based on its perceived luminance.
   *
   * @param {Color} c the input color
   * @param {Color} target the output color
   */
  static rgbaToGray (
    c = new Color(),
    target = new Color()) {

    return Color.fromScalar(
      Color.luminance(c), c.a, target);
  }

  /**
   * Converts RGBA channels to a vector which holds hue, saturation, brightness
   * and alpha.
   *
   * @param {Color} c the color
   * @param {Vec4} target the output vector
   * @returns the HSBA values
   */
  static rgbaToHsba (
    c = new Color(),
    target = new Vec4()) {

    const bri = Math.max(c.r, c.g, c.b);
    const mn = Math.min(c.r, c.g, c.b);
    const delta = bri - mn;
    let hue = 0.0;

    if (delta !== 0.0) {
      if (c.r === bri) {
        hue = (c.g - c.b) / delta;
      } else if (c.g === bri) {
        hue = 2.0 + (c.b - c.r) / delta;
      } else {
        hue = 4.0 + (c.r - c.g) / delta;
      }

      hue *= 0.16666666666666667;
      if (hue < 0.0) { hue += 1.0 }
    }

    const sat = (bri === 0.0) ? 0.0 : (delta / bri);
    return target.setComponents(hue, sat, bri, c.a);
  }

  /**
   * Converts a color from RGB to CIE XYZ. References Pharr Jakob, and
   * Humphreys' Physically Based Rendering ,
   * http://www.pbr-book.org/3ed-2018/Color_and_Radiometry/The_SampledSpectrum_Class.html#fragment-SpectrumUtilityDeclarations-2
   * .
   *
   * @param {Vec4} c the color in RGB
   * @param {Color} target the output color
   * @returns the color in XYZ
   */
  static rgbaToXyzw (
    c = new Color(),
    target = new Vec4()) {

    return target.setComponents(
      0.412453 * c.r + 0.357580 * c.g + 0.180423 * c.b,
      0.212671 * c.r + 0.715160 * c.g + 0.072169 * c.b,
      0.019334 * c.r + 0.119193 * c.g + 0.950227 * c.b,
      c.a);
  }

  /**
   * Converts a color to a signed number where hexadecimal represents the ARGB
   * color channels: 0xAARRGGB .
   *
   * @param {Color} c the color
   * @returns the color in hexadecimal
   */
  static toHexInt (c = new Color()) {

    return Math.trunc(c.a * 0xff + 0.5) << 0x18
      | Math.trunc(c.r * 0xff + 0.5) << 0x10
      | Math.trunc(c.g * 0xff + 0.5) << 0x8
      | Math.trunc(c.b * 0xff + 0.5);
  }

  /**
   * Converts a color to an unsigned number where hexadecimal represents the
   * ARGB color channels: 0xAARRGGB .
   *
   * @param {Color} c the color
   * @returns the color in hexadecimal
   */
  static toHexLong (c = new Color()) {

    return Color.toHexInt(c) >>> 0;
  }

  /**
   * Returns a representation of the color as a hexadecimal code, preceded by a
   * '0x', in the format AARRGGBB.
   *
   * @param {Color} c the color
   * @returns the string
   */
  static toHexString (c = new Color()) {

    let a = Math.trunc(c.a * 0xff + 0.5).toString(16);
    if (a.length < 2) { a = '0' + a; };
    let r = Math.trunc(c.r * 0xff + 0.5).toString(16);
    if (r.length < 2) { r = '0' + r; };
    let g = Math.trunc(c.g * 0xff + 0.5).toString(16);
    if (g.length < 2) { g = '0' + g; };
    let b = Math.trunc(c.b * 0xff + 0.5).toString(16);
    if (b.length < 2) { b = '0' + b; };

    return ['0x', a, r, g, b].join('');
  }

  /**
   * Returns a web-friendly representation of the color as a hexadecimal code,
   * preceded by a hashtag, '#', with no alpha.
   *
   * @param {Color} c the color
   * @returns the string
   */
  static toHexWeb (c = new Color()) {

    let r = Math.trunc(c.r * 0xff + 0.5).toString(16);
    if (r.length < 2) { r = '0' + r; };
    let g = Math.trunc(c.g * 0xff + 0.5).toString(16);
    if (g.length < 2) { g = '0' + g; };
    let b = Math.trunc(c.b * 0xff + 0.5).toString(16);
    if (b.length < 2) { b = '0' + b; };

    return ['#', r, g, b].join('').toUpperCase();
  }

  /**
   * Returns the color yellow, ( 1.0, 1.0, 1.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns white
   */
  static white (target = new Color()) {

    return target.setComponents(1.0, 1.0, 1.0, 1.0);
  }

  /**
   * Converts a color from CIE XYZ to RGB. References Pharr Jakob, and
   * Humphreys' Physically Based Rendering ,
   * http://www.pbr-book.org/3ed-2018/Color_and_Radiometry/The_SampledSpectrum_Class.html#fragment-SpectrumUtilityDeclarations-1
   * .
   *
   * @param {Vec4} v the color in XYZ
   * @param {Color} target the output color
   * @returns the color in RGB
   */
  static xyzwToRgba (
    v = new Vec4(),
    target = new Color()) {

    return target.setComponents(
      3.240479 * v.x - 1.537150 * v.y - 0.498535 * v.z,
      -0.969256 * v.x + 1.875991 * v.y + 0.041556 * v.z,
      0.055648 * v.x - 0.204043 * v.y + 1.057311 * v.z,
      v.w);
  }

  /**
   * Returns the color yellow, ( 1.0, 1.0, 0.0, 1.0 ) .
   *
   * @param {Color} target the output color
   * @returns yellow
   */
  static yellow (target = new Color()) {

    return target.setComponents(1.0, 1.0, 0.0, 1.0);
  }
}