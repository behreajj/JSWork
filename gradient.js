'use strict';

/**
 * Contains a list of keys which hold colors at steps in the range [0.0, 1.0] .
 * Allows for smooth color transitions to be evaluated by a factor.
 */
class Gradient {

  /**
   * Constructs a color gradient from a series of color keys. If none are
   * provided, the gradient will have a clear black color key at 0.0 and an
   * opaque white color key at 1.0 .
   *
   * @param  {...ColorKey} keys the color keys
   */
  constructor (...keys) {

    this._keys = [];

    const len = keys.length;
    if (len === 0) {
      this._keys.push(
        new ColorKey(0.0,
          Color.clearBlack()));
      this._keys.push(
        new ColorKey(1.0,
          Color.white()));
    } else {
      for (let i = 0; i < len; ++i) {
        this.insertKey(keys[i]);
      }
    }
  }

  get length () {

    return this._keys.length;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  [Symbol.iterator] () {

    let index = 0;
    return {
      next: () => {
        return {
          value: this._keys[index++],
          done: index > this.length
        };
      }
    };
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'string':
      default:
        return this.toString();
    }
  }

  /**
   * Appends a color to the gradient. Pre-existing color keys are shifted to the
   * left by one.
   *
   * @param {Color} color the color
   * @returns this gradient
   */
  appendColor (color = Color.clearBlack()) {

    this.compressKeysLeft(1);
    const key = new ColorKey(1.0, color);
    this._keys.push(key);
    return this;
  }

  /**
   * Appends a series of colors to the gradient. Pre-existing color keys are
   * shifted to the left.
   *
   * @param  {...Color} colors the colors
   * @returns this gradient
   */
  appendColors (...colors) {

    const len = colors.length;
    this.compressKeysLeft(len);
    const oldLen = this._keys.length;
    const denom = 1.0 / (oldLen + len - 1.0);
    for (let i = 0; i < len; ++i) {
      const step = (oldLen + i) * denom;
      const key = new ColorKey(step, colors[i]);
      this._keys.push(key);
    }

    return this;
  }

  /**
   * Locates the insertion point for a step in the gradient that will maintain
   * sorted order.
   *
   * @param {number} step the step
   * @returns the index
   */
  bisectLeft (step = 0.5) {

    let low = 0;
    let high = this._keys.length;

    while (low < high) {
      const middle = (low + high) / 2 | 0;
      if (step > this._keys[middle].step) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }

    return low;
  }

  /**
   * Locates the insertion point for a step in the gradient that will maintain
   * sorted order.
   *
   * @param {number} step the step
   * @returns the index
   */
  bisectRight (step = 0.5) {

    let low = 0;
    let high = this._keys.length;

    while (low < high) {
      const middle = (low + high) / 2 | 0;
      if (step < this._keys[middle].step) {
        high = middle;
      } else {
        low = middle + 1;
      }
    }

    return low;
  }

  /**
   * Helper function that shifts existing keys to the left when a new color is
   * added to the gradient without a key.
   *
   * @param {number} added number of new colors
   * @returns this gradient
   */
  compressKeysLeft (added = 1) {

    const len = this._keys.length;
    const scalar = 1.0 / (len + added - 1.0);
    for (let i = 0; i < len; ++i) {
      const key = this._keys[i];
      key.step = key.step * i * scalar;
    }
    return this;
  }

  /**
   * Helper function that shifts existing keys to the right when a new color is
   * added to the gradient without a key.
   *
   * @param {number} added number of new colors
   * @returns this gradient
   */
  compressKeysRight (added = 1) {

    const len = this._keys.length;
    const scalar = added / (len + added - 1.0);
    const coeff = 1.0 - scalar;
    for (let i = 0; i < len; ++i) {
      const key = this._keys[i];
      key.step = scalar + coeff * key.step;
    }
    return this;
  }

  /**
   * Tests to see if the gradient contains a color key. If it does, returns the
   * index of the key; otherwise, returns -1.
   *
   * @param {ColorKey} key the key
   * @returns the index, or -1
   */
  containsKey (key = new ColorKey(0.5)) {

    return this._keys.findIndex((x) =>
      Math.abs(x.step - key.step) < 0.0005);
  }

  /**
   * Tests to see if the gradient contains a key with the given step. If it
   * does, returns the key; otherwise, returns null.
   *
   * @param {number} step the step
   * @returns the key, if any
   */
  containsStep (step = 0.5) {

    const result = this._keys.find((x) =>
      Math.abs(x.step - step) < 0.0005);
    return result === undefined ? null : result;
  }

  /**
   * Distributes this gradient's color keys evenly through the range [0.0, 1.0].
   * 
   * @returns this gradient
   */
  distribute () {

    const len = this._keys.length;
    const toPercent = 1.0 / (len - 1.0);
    for (let i = 0; i < len; ++i) {
      this._keys[i].step = i * toPercent;
    }
    return this;
  }

  /**
   * Finds a color given a step in the range [0.0, 1.0]. When the step falls
   * between color keys, the resultant color is created by an easing function.
   * 
   * @param {number} step the step
   * @param {function} easingFunc the easing function
   * @param {Color} target the output color
   * @returns the color
   */
  eval (
    step = 0.5,
    easingFunc = Color.lerpRgba,
    target = new Color()) {

    const prevKey = this.findLe(step);
    if (prevKey === null) {
      return Color.fromSource(
        this.getFirst().color,
        target);
    }

    const nextKey = this.findGe(step);
    if (nextKey === null) {
      return Color.fromSource(
        this.getLast().color,
        target);
    }

    const prevStep = prevKey.step;
    const nextStep = nextKey.step;
    if (prevStep === nextStep) {
      return Color.fromSource(
        prevKey.color,
        target);
    }

    const fac = (step - nextStep) /
      (prevStep - nextStep);
    return easingFunc(
      prevKey.color,
      nextKey.color,
      fac,
      target);
  }

  /**
   * Returns the least key in this gradient greater than or equal to the given
   * step. If there is no key, returns null.
   *
   * @param {number} query the step query
   * @returns the key, if any
   */
  findGe (query = 0.5) {

    const i = this.bisectLeft(query);
    if (i < this._keys.length) {
      return this._keys[i];
    }
    return null;
  }

  /**
   * Returns the greatest key in this gradient less than or equal to the given
   * step. If there is no key, returns null.
   *
   * @param {number} query the step query
   * @returns the key, if any
   */
  findLe (query = 0.5) {

    const i = this.bisectRight(query);
    if (i > 0) {
      return this._keys[i - 1];
    }
    return null;
  }

  /**
   * Gets a color key by index.
   * 
   * @param {number} i the index
   * @returns the key
   */
  get (i = -1) {

    const len = this._keys.length;
    const j = i - Math.imul(len, Math.floor(i / len));
    return this._keys[j];
  }

  /**
   * Gets the first color key in this gradient.
   * 
   * @returns the color key
   */
  getFirst () {

    return this._keys[0];
  }

  /**
   * Gets the last color key in this gradient.
   * 
   * @returns the color key
   */
  getLast () {

    return this._keys[this._keys.length - 1];
  }

  /**
   * Inserts a color key to the gradient. If a color key at the insertion key's
   * step already exist, the old key is replaced with the new.
   *
   * @param {ColorKey} key the color key
   * @returns this gradient
   */
  insertKey (key = new ColorKey()) {

    const query = this.containsKey(key);
    if (query !== -1) {
      this._keys.splice(query, 1, key);
    } else {
      this.insortRight(key);
    }

    return this;
  }

  /**
   * Inserts a series of color keys to the gradient.
   * 
   * @param  {...ColorKey} keys color keys
   * @returns this gradient
   */
  insertKeys (...keys) {

    const len = keys.length;
    for (let i = 0; i < len; ++i) {
      this.insertKey(keys[i]);
    }

    return this;
  }

  /**
   * Inserts a color key into the keys array based on the index returned from
   * bisectLeft .
   *
   * @param {ColorKey} key the color key
   * @returns this gradient
   */
  insortLeft (key = new ColorKey()) {

    const i = this.bisectLeft(key.step);
    this._keys.splice(i, 0, key);
    return this;
  }

  /**
   * Inserts a color key into the keys array based on the index returned from
   * bisectRight .
   *
   * @param {ColorKey} key the color key
   * @returns this gradient
   */
  insortRight (key = new ColorKey()) {

    const i = this.bisectRight(key.step);
    this._keys.splice(i, 0, key);
    return this;
  }

  /**
   * Prepends a color to the gradient. Pre-existing color keys are shifted to the
   * right by one.
   *
   * @param {Color} color the color
   * @returns this gradient
   */
  prependColor (color = Color.white()) {

    this.compressKeysRight(1);
    const key = new ColorKey(0.0, color);
    this._keys.splice(0, 0, key);
    return this;
  }

  /**
   * Prepends a series of colors to the gradient. Pre-existing color keys are
   * shifted to the right.
   *
   * @param  {...Color} colors the colors
   * @returns this gradient
   */
  prependColors (...colors) {

    const len = colors.length;
    this.compressKeysRight(len);
    const oldLen = this._keys.length;
    const denom = 1.0 / (oldLen + len - 1.0);
    for (let i = 0; i < len; ++i) {
      const step = i * denom;
      const key = new ColorKey(step, colors[i]);
      this._keys.splice(i, 0, key);
    }
    return this;
  }

  /**
   * Removes the color key at the provided index.
   * 
   * @param {number} i the index
   * @returns the color key
   */
  removeAt (i = -1) {

    const len = this._keys.length;
    const j = i - Math.imul(len, Math.floor(i / len));
    return this._keys.splice(j, 1)[0];
  }

  /**
   * Removes the first color key from this gradient.
   * 
   * @returns the color key
   */
  removeFirst () {

    return this._keys.splice(0, 1)[0];
  }

  /**
   * Removes the last color key from this gradient.
   * 
   * @returns the color key
   */
  removeLast () {

    return this._keys.pop();
  }

  /**
   * Resets this gradient to an initial condition, with
   * two color keys: clear black at 0.0, and opaque white
   * at 1.0 .
   * 
   * @returns this gradient
   */
  reset () {

    this._keys = [
      new ColorKey(0.0, Color.clearBlack()),
      new ColorKey(1.0, Color.white())
    ];

    return this;
  }

  /**
   * Reverses the gradient.
   * 
   * @returns this gradient
   */
  reverse () {

    this._keys.reverse();
    const len = this._keys.length;
    for (let i = 0; i < len; ++i) {
      const key = this._keys[i];
      key.step = 1.0 - key.step;
    }

    return this;
  }

  /**
   * Returns a JSON formatted string of this gradient.
   * 
   * @param {number} precision the number of decimal places
   * @returns the string
   */
  toJsonString (precision = 6) {

    const result = [
      '{\"keys\":['];

    const kys = this._keys;
    const len = kys.length;
    const last = len - 1;
    for (let i = 0; i < len; ++i) {
      result.push(kys[i].toJsonString(precision));
      if (i < last) {
        result.push(',');
      }
    }
    result.push(']}');
    return result.join('');
  }

  /**
   * Returns an object literal with this gradient's components.
   * 
   * @returns the object
   */
  toObject () {

    const arr = [];
    const len = this._keys.length;
    for (let i = 0; i < len; ++i) {
      arr.push(this._keys[i].toObject());
    }

    return { keys: arr };
  }

  /**
   * Returns a string representation of this gradient.
   * 
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toString (precision = 4) {

    const result = [
      '{ keys: [ '];

    const kys = this._keys;
    const len = kys.length;
    const last = len - 1;
    for (let i = 0; i < len; ++i) {
      result.push(kys[i].toString(precision));
      if (i < last) {
        result.push(', ');
      }
    }
    result.push(' ] }');
    return result.join('');
  }

  /**
   * Creates a gradient from an array of colors, where the
   * color keys are evenly distributed across.
   * 
   * @param {Color[]} colors the array of colors
   * @param {Gradient} target the output gradient
   * @returns the gradient
   */
  static fromColors (colors, target = new Gradient()) {

    target._keys = [];
    const len = colors.length;
    const scalar = 1.0 / (len - 1.0);
    for (let i = 0; i < len; ++i) {
      const step = i * scalar;
      const key = new ColorKey(step, colors[i]);
      target._keys.push(key);
    }
    return target;
  }

  /**
   * Returns the Magma color palette, consisting of 16 keys.
   * 
   * @param {Gradient} target the output gradient
   * @returns the gradient
   */
  static paletteMagma (target = new Gradient()) {

    // TODO: Update to reverse order.

    target._keys = [
      new ColorKey(0.000000, new Color(0.988235, 1.000000, 0.698039)),
      new ColorKey(0.066667, new Color(0.987190, 0.843137, 0.562092)),
      new ColorKey(0.166667, new Color(0.984314, 0.694118, 0.446275)),
      new ColorKey(0.200000, new Color(0.981176, 0.548235, 0.354510)),
      new ColorKey(0.266667, new Color(0.962353, 0.412549, 0.301176)),
      new ColorKey(0.333333, new Color(0.912418, 0.286275, 0.298039)),
      new ColorKey(0.400000, new Color(0.824314, 0.198431, 0.334902)),
      new ColorKey(0.466667, new Color(0.703268, 0.142484, 0.383007)),
      new ColorKey(0.533333, new Color(0.584052, 0.110588, 0.413856)),
      new ColorKey(0.600000, new Color(0.471373, 0.080784, 0.430588)),
      new ColorKey(0.666667, new Color(0.367320, 0.045752, 0.432680)),
      new ColorKey(0.733333, new Color(0.267974, 0.002353, 0.416732)),
      new ColorKey(0.800000, new Color(0.174118, 0.006275, 0.357647)),
      new ColorKey(0.866667, new Color(0.093856, 0.036863, 0.232941)),
      new ColorKey(0.933333, new Color(0.040784, 0.028758, 0.110327)),
      new ColorKey(1.000000, new Color(0.000000, 0.000000, 0.019608))
    ];

    return target;
  }

  /**
   * Returns seven primary and secondary colors: red, yellow, green, cyan, blue,
   * magenta and red. Red is repeated so that the gradient is periodic.
   *
   * @param {Gradient} target the output gradient
   * @returns the gradient
   */
  static paletteRgb (target = new Gradient()) {

    target._keys = [
      new ColorKey(0.000000, Color.red()),
      new ColorKey(0.166667, Color.yellow()),
      new ColorKey(0.333333, Color.green()),
      new ColorKey(0.500000, Color.cyan()),
      new ColorKey(0.666667, Color.blue()),
      new ColorKey(0.833333, Color.magenta()),
      new ColorKey(1.000000, Color.red())
    ];

    return target;
  }

  /**
   * Returns thirteen colors in the red yellow blue color wheel. Red is repeated
   * so that the gradient is periodic.
   *
   * @param {Gradient} target the output gradient
   * @returns the gradient
   */
  static paletteRyb (target = new Gradient()) {

    // TODO: Update.

    target._keys = [
      new ColorKey(0.000000, Color.red()),
      new ColorKey(0.083333, new Color(1.0, 0.25, 0.0)),
      new ColorKey(0.166667, new Color(1.0, 0.50, 0.0)),
      new ColorKey(0.250000, new Color(1.0, 0.75, 0.0)),
      new ColorKey(0.333333, Color.yellow()),
      new ColorKey(0.416667, new Color(0.5058824, 0.8313726, 0.1019608)),
      new ColorKey(0.500000, new Color(0.0, 0.6627451, 0.2)),
      new ColorKey(0.583333, new Color(0.0823529, 0.5176471, 0.4)),
      new ColorKey(0.666667, new Color(0.1647059, 0.3764706, 0.6)),
      new ColorKey(0.750000, new Color(0.3333333, 0.1882353, 0.5529412)),
      new ColorKey(0.833333, new Color(0.50, 0.0, 0.50)),
      new ColorKey(0.916667, new Color(0.75, 0.0, 0.25)),
      new ColorKey(1.000000, Color.red())
    ];

    return target;
  }

  /**
   * Returns the Viridis color palette, consisting of 16 keys.
   * 
   * @param {Gradient} target the output gradient
   * @returns the gradient
   */
  static paletteViridis (target = new Gradient()) {

    target._keys = [
      new ColorKey(0.000000, new Color(0.266667, 0.003922, 0.329412)),
      new ColorKey(0.066667, new Color(0.282353, 0.100131, 0.420654)),
      new ColorKey(0.166667, new Color(0.276078, 0.184575, 0.487582)),
      new ColorKey(0.200000, new Color(0.254902, 0.265882, 0.527843)),
      new ColorKey(0.266667, new Color(0.221961, 0.340654, 0.549281)),
      new ColorKey(0.333333, new Color(0.192157, 0.405229, 0.554248)),
      new ColorKey(0.400000, new Color(0.164706, 0.469804, 0.556863)),
      new ColorKey(0.466667, new Color(0.139869, 0.534379, 0.553464)),
      new ColorKey(0.533333, new Color(0.122092, 0.595033, 0.543007)),
      new ColorKey(0.600000, new Color(0.139608, 0.658039, 0.516863)),
      new ColorKey(0.666667, new Color(0.210458, 0.717647, 0.471895)),
      new ColorKey(0.733333, new Color(0.326797, 0.773595, 0.407582)),
      new ColorKey(0.800000, new Color(0.477647, 0.821961, 0.316863)),
      new ColorKey(0.866667, new Color(0.648366, 0.858039, 0.208889)),
      new ColorKey(0.933333, new Color(0.825098, 0.884967, 0.114771)),
      new ColorKey(1.000000, new Color(0.992157, 0.905882, 0.145098))
    ];

    return target;
  }
}