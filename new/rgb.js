'use strict';

class Rgb {
    /**
     * @param {number} [r=0.0] red
     * @param {number} [g=0.0] green
     * @param {number} [b=0.0] blue
     * @param {number} [alpha=1.0] alpha, opacity
     */
    constructor (r = 0.0, g = 0.0, b = 0.0, alpha = 1.0) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._alpha = alpha;

        Object.freeze(this);
    }

    get r () { return this._r; }

    get g () { return this._g; }

    get b () { return this._b; }

    get alpha () { return this._alpha; }

    get [Symbol.toStringTag] () {
        return this.constructor.name;
    }

    /**
     * @param {*} obj 
     * @returns the evaluation
     */
    equals (obj) {
        if (!obj) { return false; }
        if (this === obj) { return true; }
        if (obj.constructor.name !== this.constructor.name) {
            return false;
        }
        return Rgb.eq(this, obj, 8);
    }

    /**
     * @param {number} [precision=4] decimal display
     * @returns the string
     */
    toString (precision = 4) {
        if (precision >= 1 && precision < 21) {
            return [
                "{\"r\":", this._r.toFixed(precision),
                ",\"g\":", this._g.toFixed(precision),
                ",\"b\":", this._b.toFixed(precision),
                ",\"alpha\":", this._alpha.toFixed(precision),
                '}'
            ].join('');
        }

        const bd = precision >= -7 ? 8 + precision : 8;
        return [
            "{\"r\":", Rgb.getRInt(this, bd),
            ",\"g\":", Rgb.getGInt(this, bd),
            ",\"b\":", Rgb.getBInt(this, bd),
            ",\"alpha\":", Rgb.getAlphaInt(this, bd),
            '}'
        ].join('');
    }

    /**
     * @param {Rgb} o left operand
     * @param {Rgb} d right operand
     * @returns the bitwise and
     */
    static bitAnd (o, d) {
        return Rgb.fromRGBA32(Rgb.toRGBA32(o) & Rgb.toRGBA32(d));
    }

    /**
     * @param {Rgb} o left operand
     * @returns the bitwise negation
     */
    static bitNot (o) {
        return Rgb.fromRGBA32(~Rgb.toRGBA32(o));
    }

    /**
     * @param {Rgb} o left operand
     * @param {Rgb} d right operand
     * @returns the bitwise inclusive or
     */
    static bitOr (o, d) {
        return Rgb.fromRGBA32(Rgb.toRGBA32(o) | Rgb.toRGBA32(d));
    }

    /**
     * @param {Rgb} o left operand
     * @param {Rgb} d right operand
     * @returns the exclusive or
     */
    static bitXor (o, d) {
        return Rgb.fromRGBA32(Rgb.toRGBA32(o) ^ Rgb.toRGBA32(d));
    }

    /**
     * @param {Rgb} o color
     * @param {number} [lb=0.0] lower bound
     * @param {number} [ub=1.0] upper bound
     * @returns the clamped color
     */
    static clamp (o, lb = 0.0, ub = 1.0) {
        return new Rgb(
            Math.min(Math.max(o.r, lb), ub),
            Math.min(Math.max(o.g, lb), ub),
            Math.min(Math.max(o.b, lb), ub),
            Math.min(Math.max(o.alpha, lb), ub));
    }

    /**
     * @param {Rgb} o left operand
     * @param {Rgb} d right operand
     * @returns the copy
     */
    static copyAlpha (o, d) {
        return new Rgb(o.r, o.g, o.b, d.alpha);
    }

    /**
     * @param {Rgb} o left operand
     * @param {Rgb} d right operand
     * @param {number} [alphaScale=1.0] alpha scale
     * @returns the distance
     */
    static dist (o, d, alphaScale = 1.0) {
        const cr = d.r - o.r;
        const cg = d.g - o.g;
        const cb = d.b - o.b;
        const ct = alphaScale * (d.alpha - o.alpha)

        return Math.sqrt(cr * cr + cg * cg + cb * cb + ct * ct);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static eq (o, d, bitDepth = 8) {
        return Rgb.eqAlpha(o, d, bitDepth)
            && Rgb.eqRGB(o, d, bitDepth);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static eqAlpha (o, d, bitDepth = 8) {
        return Rgb.getAlphaInt(o, bitDepth) === Rgb.getAlphaInt(d, bitDepth);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static eqRGB (o, d, bitDepth = 8) {
        return Rgb.getRInt(o, bitDepth) === Rgb.getRInt(d, bitDepth)
            && Rgb.getGInt(o, bitDepth) === Rgb.getGInt(d, bitDepth)
            && Rgb.getBInt(o, bitDepth) === Rgb.getBInt(d, bitDepth);
    }

    /**
     * @param {number} [r=0] red
     * @param {number} [g=0] green
     * @param {number} [b=0] blue
     * @param {number} [alpha=255] opacity
     * @returns the conversion
     */
    static from8s (r = 0, g = 0, b = 0, alpha = 255) {
        return new Rgb(
            r / 255.0,
            g / 255.0,
            b / 255.0,
            alpha / 255.0);
    }

    /**
     * @param {number} [r=0] red
     * @param {number} [g=0] green
     * @param {number} [b=0] blue
     * @param {number} [alpha=255] opacity
     * @param {number} [rBitDepth=8] red bit depth
     * @param {number} [gBitDepth=8] green bit depth
     * @param {number} [bBitDepth=8] blue bit depth
     * @param {number} [alphaBitDepth=8] alpha bit depth
     * @returns the conversion
     */
    static fromInts (
        r = 0, g = 0, b = 0, alpha = 255,
        rBitDepth = 8,
        gBitDepth = 8,
        bBitDepth = 8,
        alphaBitDepth = 8) {

        const rMx = (1 << rBitDepth) - 1;
        const gMx = (1 << gBitDepth) - 1;
        const bMx = (1 << bBitDepth) - 1;
        const tMx = (1 << alphaBitDepth) - 1;
        return new Rgb(
            rMx !== 0.0 ? r / rMx : 0.0,
            gMx !== 0.0 ? g / gMx : 0.0,
            bMx !== 0.0 ? b / bMx : 0.0,
            tMx !== 0.0 ? alpha / tMx : 1.0);
    }

    /**
     * @param {number} i 32 bit integer
     * @returns the conversion
     */
    static fromRGBA32 (i) {
        return Rgb.from8s(
            (i >> 0x18) & 0xff,
            (i >> 0x10) & 0xff,
            (i >> 0x08) & 0xff,
            i & 0xff);
    }

    /**
     * @param {number} i integer
     * @param {number} [rBitDepth=8] red bit depth
     * @param {number} [gBitDepth=8] green bit depth
     * @param {number} [bBitDepth=8] blue bit depth
     * @param {number} [alphaBitDepth=8] alpha bit depth
     * @returns the conversion
     */
    static fromRGBAInt (i,
        rBitDepth = 8,
        gBitDepth = 8,
        bBitDepth = 8,
        alphaBitDepth = 8) {
        // TODO: Support big ints with bit depth 16 channels?

        const bShift = alphaBitDepth;
        const gShift = alphaBitDepth + bBitDepth;
        const rShift = alphaBitDepth + bBitDepth + gBitDepth;

        const rMx = (1 << rBitDepth) - 1;
        const gMx = (1 << gBitDepth) - 1;
        const bMx = (1 << bBitDepth) - 1;
        const tMx = (1 << alphaBitDepth) - 1;

        const r = (i >> rShift) & rMx;
        const g = (i >> gShift) & gMx;
        const b = (i >> bShift) & bMx;
        const alpha = i & tMx;

        return new Rgb(
            rMx !== 0.0 ? r / rMx : 0.0,
            gMx !== 0.0 ? g / gMx : 0.0,
            bMx !== 0.0 ? b / bMx : 0.0,
            tMx !== 0.0 ? alpha / tMx : 1.0);
    }

    /**
     * @param {Rgb} o
     * @param {number} [bitDepth=8] 
     * @return red as an unsigned integer
     */
    static getRInt (o, bitDepth = 8) {
        const mx = (1 << bitDepth) - 1;
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * mx + 0.5);
    }

    /**
     * @param {Rgb} o
     * @param {number} [bitDepth=8] 
     * @return green as an unsigned integer
     */
    static getGInt (o, bitDepth = 8) {
        const mx = (1 << bitDepth) - 1;
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * mx + 0.5);
    }

    /**
     * @param {Rgb} o
     * @param {number} [bitDepth=8] 
     * @return blue as an unsigned integer
     */
    static getBInt (o, bitDepth = 8) {
        const mx = (1 << bitDepth) - 1;
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * mx + 0.5);
    }

    /**
     * @param {Rgb} o
     * @param {number} [bitDepth=8] 
     * @return alpha as an unsigned integer
     */
    static getAlphaInt (o, bitDepth = 8) {
        const mx = (1 << bitDepth) - 1;
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * mx + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @returns the gray color
     */
    static gray (o) {
        const lum = 0.3 * o.r + 0.59 * o.g + 0.11 * o.b;
        return new Rgb(lum, lum, lum, o.alpha);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static gt (o, d, bitDepth = 8) {
        return Rgb.getAlphaInt(o, bitDepth) > Rgb.getAlphaInt(d, bitDepth)
            && Rgb.getRInt(o, bitDepth) > Rgb.getRInt(d, bitDepth)
            && Rgb.getGInt(o, bitDepth) > Rgb.getGInt(d, bitDepth)
            && Rgb.getBInt(o, bitDepth) > Rgb.getBInt(d, bitDepth);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static gtEq (o, d, bitDepth = 8) {
        return Rgb.getAlphaInt(o, bitDepth) >= Rgb.getAlphaInt(d, bitDepth)
            && Rgb.getRInt(o, bitDepth) >= Rgb.getRInt(d, bitDepth)
            && Rgb.getGInt(o, bitDepth) >= Rgb.getGInt(d, bitDepth)
            && Rgb.getBInt(o, bitDepth) >= Rgb.getBInt(d, bitDepth);
    }

    /**
     * @param {Rgb} o rgb
     * @param {number} [eps=0.0] epsilon
     */
    static isInGamut (o, eps = 0.0) {
        let oneEps = 1.0 + eps;
        return o.r >= -eps && o.r <= oneEps
            && o.g >= -eps && o.g <= oneEps
            && o.b >= -eps && o.b <= oneEps;
    }

    /**
     * @param {Rgb} o rgb
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static isGray (o, bitDepth = 8) {
        return Rgb.getRInt(o, bitDepth) === Rgb.getGInt(o, bitDepth)
            && Rgb.getGInt(o, bitDepth) === Rgb.getBInt(o, bitDepth);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static lt (o, d, bitDepth = 8) {
        return Rgb.getAlphaInt(o, bitDepth) < Rgb.getAlphaInt(d, bitDepth)
            && Rgb.getRInt(o, bitDepth) < Rgb.getRInt(d, bitDepth)
            && Rgb.getGInt(o, bitDepth) < Rgb.getGInt(d, bitDepth)
            && Rgb.getBInt(o, bitDepth) < Rgb.getBInt(d, bitDepth);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @param {number} [bitDepth=8] bit depth
     * @returns the evaluation
     */
    static ltEq (o, d, bitDepth = 8) {
        return Rgb.getAlphaInt(o, bitDepth) <= Rgb.getAlphaInt(d, bitDepth)
            && Rgb.getRInt(o, bitDepth) <= Rgb.getRInt(d, bitDepth)
            && Rgb.getGInt(o, bitDepth) <= Rgb.getGInt(d, bitDepth)
            && Rgb.getBInt(o, bitDepth) <= Rgb.getBInt(d, bitDepth);
    }

    /**
     * @param {Rgb} o origin
     * @param {Rgb} d destination
     * @param {number} [t=0.5] factor
     */
    static mix (o, d, t = 0.5) {
        const u = 1.0 - t;
        return new Rgb(
            u * o.r + t * d.r,
            u * o.g + t * d.g,
            u * o.b + t * d.b,
            u * o.alpha + t * d.alpha);
    }

    /**
     * @param {Rgb} o color
     * @returns the opaque color
     */
    static opaque (o) {
        return new Rgb(o.r, o.g, o.b, 1.0);
    }

    /**
     * @param {Rgb} o rgb
     * @returns the premultiplied color
     */
    static premul (o) {
        if (o.alpha !== 0.0) {
            return new Rgb(
                o.r / o.alpha,
                o.g / o.alpha,
                o.b / o.alpha,
                o.alpha);
        }
        return Rgb.clear();
    }

    /**
     * @param {Rgb} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleAlpha (o, scalar = 1.0) {
        return new Rgb(o.r, o.g, o.b, o.alpha * scalar);
    }

    /**
     * @param {Rgb} o color
     * @returns the separated channels
     */
    static sepRgb (o) {
        return [
            new Rgb(o.r, 0.0, 0.0, o.alpha),
            new Rgb(0.0, o.g, 0.0, o.alpha),
            new Rgb(0.0, 0.0, o.b, o.alpha)
        ];
    }

    /**
     * @param {Rgb} o gamma rgb
     * @returns linear rgb
     */
    static sRgbGammaToLinear (o) {
        const inv1_055 = 1.0 / 1.055;
        const inv12_92 = 1.0 / 12.92;

        return new Rgb(
            o.r > 0.04045 ?
                Math.pow((o.r + 0.055) * inv1_055, 2.4) :
                o.r * inv12_92,
            o.g > 0.04045 ?
                Math.pow((o.g + 0.055) * inv1_055, 2.4) :
                o.g * inv12_92,
            o.b > 0.04045 ?
                Math.pow((o.b + 0.055) * inv1_055, 2.4) :
                o.b * inv12_92,
            o.alpha);
    }

    /**
     * @param {Rgb} o linear rgb
     * @returns gamma rgb
     */
    static sRgbLinearToGamma (o) {
        const inv24 = 1.0 / 2.4;
        return new Rgb(
            o.r > 0.0031308 ?
                Math.pow(o.r, inv24) * 1.055 - 0.055 :
                o.r * 12.92,
            o.g > 0.0031308 ?
                Math.pow(o.g, inv24) * 1.055 - 0.055 :
                o.g * 12.92,
            o.b > 0.0031308 ?
                Math.pow(o.b, inv24) * 1.055 - 0.055 :
                o.b * 12.92,
            o.alpha
        );
    }

    /**
     * @param {Rgb} o rgb
     * @returns the 32 bit integer
     */
    static toRGBA32 (o) {
        return Rgb.getRInt(o, 8) << 0x18
            | Rgb.getGInt(o, 8) << 0x10
            | Rgb.getBInt(o, 8) << 0x08
            | Rgb.getAlphaInt(o, 8);
    }

    /**
     * @param {Rgb} o rgb
     * @param {number} [rBitDepth=8] red bit depth
     * @param {number} [gBitDepth=8] green bit depth
     * @param {number} [bBitDepth=8] blue bit depth
     * @param {number} [alphaBitDepth=8] alpha bit depth
     * @returns the integer
     */
    static toRGBAInt (o,
        rBitDepth = 8,
        gBitDepth = 8,
        bBitDepth = 8,
        alphaBitDepth = 8) {
        // TODO: Support big ints with bit depth 16 channels?
        const bShift = alphaBitDepth;
        const gShift = alphaBitDepth + bBitDepth;
        const rShift = alphaBitDepth + bBitDepth + gBitDepth;
        return Rgb.getRInt(o, rBitDepth) << rShift
            | Rgb.getGInt(o, gBitDepth) << gShift
            | Rgb.getBInt(o, bBitDepth) << bShift
            | Rgb.getAlphaInt(o, alphaBitDepth);
    }

    /**
     * @param {Rgb} o rgb
     * @returns the unpremultiplied color
     */
    static unpremul (o) {
        if (o.alpha !== 0.0) {
            return new Rgb(
                o.r * o.alpha,
                o.g * o.alpha,
                o.b * o.alpha,
                o.alpha);
        }
        return Rgb.clear();
    }

    /**
     * @returns the color red
     */
    static red () {
        return new Rgb(1.0, 0.0, 0.0, 1.0);
    }

    /**
     * @returns the color yellow
     */
    static yellow () {
        return new Rgb(1.0, 1.0, 0.0, 1.0);
    }

    /**
     * @returns the color lime green
     */
    static green () {
        return new Rgb(0.0, 1.0, 0.0, 1.0);
    }

    /**
     * @returns the color cyan
     */
    static cyan () {
        return new Rgb(0.0, 1.0, 1.0, 1.0);
    }

    /**
     * @returns the color blue
     */
    static blue () {
        return new Rgb(0.0, 0.0, 1.0, 1.0);
    }

    /**
     * @returns the color magenta
     */
    static magenta () {
        return new Rgb(1.0, 0.0, 1.0, 1.0);
    }

    /**
     * @returns the color black
     */
    static black () {
        return new Rgb(0.0, 0.0, 0.0, 1.0);
    }

    /**
     * @returns clear black
     */
    static clear () {
        return new Rgb(0.0, 0.0, 0.0, 0.0);
    }

    /**
     * @returns the color white
     */
    static white () {
        return new Rgb(1.0, 1.0, 1.0, 1.0);
    }
}