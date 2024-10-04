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
        return Rgb.eq(this, obj);
    }

    /**
     * @param {number} [precision=4] decimal display
     * @returns the string
     */
    toString (precision = 4) {
        if (precision >= 0 && precision < 21) {
            return [
                "{\"r\":", this._r.toFixed(precision),
                ",\"g\":", this._g.toFixed(precision),
                ",\"b\":", this._b.toFixed(precision),
                ",\"alpha\":", this._alpha.toFixed(precision),
                '}'
            ].join('');
        }

        return [
            "{\"r\":", Rgb.getR8(this),
            ",\"g\":", Rgb.getG8(this),
            ",\"b\":", Rgb.getB8(this),
            ",\"alpha\":", Rgb.getAlpha8(this),
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
     * @param {number} [alphaScale=100.0] alpha scale
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
     * @returns the evaluation
     */
    static eq (o, d) {
        return Rgb.eqAlpha(o, d)
            && Rgb.eqRGB(o, d);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @returns the evaluation
     */
    static eqAlpha (o, d) {
        return Rgb.getAlpha8(o) === Rgb.getAlpha8(d);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @returns the evaluation
     */
    static eqRGB (o, d) {
        return Rgb.getR8(o) === Rgb.getR8(d)
            && Rgb.getG8(o) === Rgb.getG8(d)
            && Rgb.getB8(o) === Rgb.getB8(d);
    }

    /**
     * @param {number} [r=0] red
     * @param {number} [g=0] green
     * @param {number} [b=0] blue
     * @param {number} [alpha=7] opacity
     * @returns the conversion
     */
    static from3s (r = 0, g = 0, b = 0, alpha = 7) {
        return new Rgb(
            r / 7.0,
            g / 7.0,
            b / 7.0,
            alpha / 7.0);
    }

    /**
     * @param {number} [r=0] red
     * @param {number} [g=0] green
     * @param {number} [b=0] blue
     * @param {number} [alpha=15] opacity
     * @returns the conversion
     */
    static from4s (r = 0, g = 0, b = 0, alpha = 15) {
        return new Rgb(
            r / 15.0,
            g / 15.0,
            b / 15.0,
            alpha / 15.0);
    }

    /**
     * @param {number} [r=0] red
     * @param {number} [g=0] green
     * @param {number} [b=0] blue
     * @param {number} [alpha=1] opacity
     * @returns the conversion
     */
    static from5551 (r = 0, g = 0, b = 0, alpha = 1) {
        return new Rgb(
            r / 31.0,
            g / 31.0,
            b / 31.0,
            alpha);
    }

    /**
     * @param {number} [r=0] red
     * @param {number} [g=0] green
     * @param {number} [b=0] blue
     * @returns the conversion
     */
    static from565 (r = 0, g = 0, b = 0) {
        return new Rgb(
            r / 31.0,
            g / 63.0,
            b / 31.0,
            1.0);
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
     * @param {number} [alpha=65535] opacity
     * @returns the conversion
     */
    static from16s (r = 0, g = 0, b = 0, alpha = 65535) {
        return new Rgb(
            r / 65535.0,
            g / 65535.0,
            b / 65535.0,
            alpha / 65535.0);
    }

    /**
     * @param {number} i 12 bit integer
     * @returns the conversion
     */
    static fromRGBA12 (i) {
        return Rgb.from3s(
            (i >> 0x9) & 0x7,
            (i >> 0x6) & 0x7,
            (i >> 0x3) & 0x7,
            i & 0x7);
    }

    /**
     * @param {number} i 16 bit integer
     * @returns the conversion
     */
    static fromRGBA16 (i) {
        return Rgb.from4s(
            (i >> 0x10) & 0xf,
            (i >> 0x08) & 0xf,
            (i >> 0x04) & 0xf,
            i & 0xf);
    }

    /**
     * @param {number} i 15 bit integer
     * @returns the conversion
     */
    static fromRGB555 (i) {
        return Rgb.from5551(
            (i >> 0xa) & 0x1f,
            (i >> 0x5) & 0x1f,
            i & 0x1f,
            1);
    }

    /**
     * @param {number} i 16 bit integer
     * @returns the conversion
     */
    static fromRGB565 (i) {
        return Rgb.from565(
            (i >> 0xb) & 0x1f,
            (i >> 0x5) & 0x3f,
            i & 0x1f);
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
     * @param {Rgb} o color
     * @retuns the red channel as an unsigned 3 bit integer
     */
    static getR3 (o) {
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * 7 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the red channel as an unsigned 4 bit integer
     */
    static getR4 (o) {
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * 15 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the red channel as an unsigned 5 bit integer
     */
    static getR5 (o) {
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * 31 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the red channel as an unsigned 6 bit integer
     */
    static getR6 (o) {
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * 63 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the red channel as an unsigned 8 bit integer
     */
    static getR8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the red channel as an unsigned 16 bit integer
     */
    static getR16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.r, 0.0), 1.0) * 65535 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the green channel as an unsigned 3 bit integer
     */
    static getG3 (o) {
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * 7 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the green channel as an unsigned 4 bit integer
     */
    static getG4 (o) {
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * 15 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the green channel as an unsigned 5 bit integer
     */
    static getG5 (o) {
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * 31 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the green channel as an unsigned 6 bit integer
     */
    static getG6 (o) {
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * 63 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the green channel as an unsigned 8 bit integer
     */
    static getG8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the green channel as an unsigned 16 bit integer
     */
    static getG16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.g, 0.0), 1.0) * 65535 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the blue channel as an unsigned 3 bit integer
     */
    static getB3 (o) {
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * 7 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the blue channel as an unsigned 4 bit integer
     */
    static getB4 (o) {
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * 15 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the blue channel as an unsigned 5 bit integer
     */
    static getB5 (o) {
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * 31 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the blue channel as an unsigned 6 bit integer
     */
    static getB6 (o) {
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * 63 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the blue channel as an unsigned 8 bit integer
     */
    static getB8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the blue channel as an unsigned 16 bit integer
     */
    static getB16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.b, 0.0), 1.0) * 65535 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the alpha as an unsigned 1 bit integer
     */
    static getAlpha1 (o) {
        return o.alpha >= 0.5 ? 1 : 0;
    }

    /**
     * @param {Rgb} o color
     * @retuns the alpha as an unsigned 3 bit integer
     */
    static getAlpha3 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 7 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the alpha as an unsigned 4 bit integer
     */
    static getAlpha4 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 15 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the alpha as an unsigned 8 bit integer
     */
    static getAlpha8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Rgb} o color
     * @retuns the alpha as an unsigned 16 bit integer
     */
    static getAlpha16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 65535 + 0.5);
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
     * @returns the evaluation
     */
    static gt (o, d) {
        return Rgb.getAlpha8(o) > Rgb.getAlpha8(d)
            && Rgb.getR8(o) > Rgb.getR8(d)
            && Rgb.getG8(o) > Rgb.getG8(d)
            && Rgb.getB8(o) > Rgb.getB8(d);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @returns the evaluation
     */
    static gtEq (o, d) {
        return Rgb.getAlpha8(o) >= Rgb.getAlpha8(d)
            && Rgb.getR8(o) >= Rgb.getR8(d)
            && Rgb.getG8(o) >= Rgb.getG8(d)
            && Rgb.getB8(o) >= Rgb.getB8(d);
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
     * @returns the evaluation
     */
    static isGray (o) {
        return Rgb.getR8(o) === Rgb.getG8(o)
            && Rgb.getG8(o) === Rgb.getB8(o);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @returns the evaluation
     */
    static lt (o, d) {
        return Rgb.getAlpha8(o) < Rgb.getAlpha8(d)
            && Rgb.getR8(o) < Rgb.getR8(d)
            && Rgb.getG8(o) < Rgb.getG8(d)
            && Rgb.getB8(o) < Rgb.getB8(d);
    }

    /**
     * @param {Rgb} o left comparisand
     * @param {Rgb} d right comparisand
     * @returns the evaluation
     */
    static ltEq (o, d) {
        return Rgb.getAlpha8(o) <= Rgb.getAlpha8(d)
            && Rgb.getR8(o) <= Rgb.getR8(d)
            && Rgb.getG8(o) <= Rgb.getG8(d)
            && Rgb.getB8(o) <= Rgb.getB8(d);
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
     * @returns the 16 bit integer
     */
    static toARGB1555 (o) {
        return Rgb.getAlpha1(o) << 0xf
            | Rgb.getR5(o) << 0xa
            | Rgb.getG5(o) << 0x5
            | Rgb.getB5(o);
    }

    /**
     * @param {Rgb} o rgb
     * @returns the 15 bit integer
     */
    static toRGB555 (o) {
        return Rgb.getR5(o) << 0xa
            | Rgb.getG5(o) << 0x5
            | Rgb.getB5(o);
    }

    /**
     * @param {Rgb} o rgb
     * @returns the 16 bit integer
     */
    static toRGB565 (o) {
        return Rgb.getR5(o) << 0xb
            | Rgb.getG6(o) << 0x5
            | Rgb.getB5(o);
    }

    /**
     * @param {Rgb} o rgb
     * @returns the 32 bit integer
     */
    static toRGBA32 (o) {
        return Rgb.getR8(o) << 0x18
            | Rgb.getG8(o) << 0x10
            | Rgb.getB8(o) << 0x08
            | Rgb.getAlpha8(o);
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

    static red () {
        return new Rgb(1.0, 0.0, 0.0, 1.0);
    }

    static yellow () {
        return new Rgb(1.0, 1.0, 0.0, 1.0);
    }

    static green () {
        return new Rgb(0.0, 1.0, 0.0, 1.0);
    }

    static cyan () {
        return new Rgb(0.0, 1.0, 1.0, 1.0);
    }

    static blue () {
        return new Rgb(0.0, 0.0, 1.0, 1.0);
    }

    static magenta () {
        return new Rgb(1.0, 0.0, 1.0, 1.0);
    }

    static black () {
        return new Rgb(0.0, 0.0, 0.0, 1.0);
    }

    static clear () {
        return new Rgb(0.0, 0.0, 0.0, 0.0);
    }

    static white () {
        return new Rgb(1.0, 1.0, 1.0, 1.0);
    }
}