'use strict';

class Lch {
    /**
     * @param {number} [l=0.0] lightness
     * @param {number} [c=0.0] chroma
     * @param {number} [h=0.0] hue
     * @param {number} [alpha=1.0] opacity
     */
    constructor (l = 0.0, c = 0.0, h = 0.0, alpha = 1.0) {
        this._l = l;
        this._c = c;
        this._h = h;
        this._alpha = alpha;

        Object.freeze(this);
    }

    get l () { return this._l; }

    get c () { return this._c; }

    get h () { return this._h; }

    get alpha () { return this._alpha; }

    get [Symbol.toStringTag] () {
        return this.constructor.name;
    }

    /**
     * @param {number} [precision=4] the precision
     * @returns the string
     */
    toString (precision = 4) {
        if (precision >= 0 && precision < 21) {
            return [
                "{\"l\":", this._l.toFixed(precision),
                ",\"c\":", this._c.toFixed(precision),
                ",\"h\":", this._h.toFixed(precision),
                ",\"alpha\":", this._alpha.toFixed(precision),
                '}'
            ].join('');
        }

        return [
            "{\"l\":", Lch.getL16(this),
            ",\"c\":", Lch.getC16(this),
            ",\"h\":", Lch.getH16(this),
            ",\"alpha\":", Lch.getAlpha16(this),
            '}'
        ].join('');
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the sum
     */
    static add (o, d) {
        return new Lch(
            o.l + d.l,
            o.c + d.c,
            o.h + d.h,
            o.alpha + d.alpha);
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the copy
     */
    static copyAlpha (o, d) {
        return new Lch(o.l, o.c, o.h, d.alpha);
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the copy
     */
    static copyChroma (o, d) {
        return new Lch(o.l, d.c, o.h, o.alpha);
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the copy
     */
    static copyHue (o, d) {
        return new Lch(o.l, o.c, d.h, o.alpha);
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the copy
     */
    static copyHueChroma (o, d) {
        return new Lch(o.l, d.c, d.h, o.alpha);
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the copy
     */
    static copyLight (o, d) {
        return new Lch(d.l, o.c, o.h, o.alpha);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static eq (o, d) {
        return Lch.eqAlpha(o, d)
            && Lch.eqLight(o, d)
            && Lch.eqChroma(o, d)
            && Lch.eqHue(o, d);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static eqAlpha (o, d) {
        return Lch.getAlpha16(o) === Lch.getAlpha16(d);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static eqChroma (o, d) {
        return Lch.getC16(o) === Lch.getC16(d);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static eqHue (o, d) {
        return Lch.getH16(o) === Lch.getH16(d);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static eqLight (o, d) {
        return Lch.getL16(o) === Lch.getL16(d);
    }

    /**
     * @param {number} [l=0] light
     * @param {number} [c=0] chroma
     * @param {number} [h=0] hue
     * @param {number} [alpha=255] opacity
     * @returns the conversion
     */
    static from8s (l = 0, c = 0, h = 0, alpha = 255) {
        return new Lch(
            l / 2.55,
            c,
            h / 255.0,
            alpha / 255.0);
    }

    /**
     * @param {number} [l=0] light
     * @param {number} [c=0] chroma
     * @param {number} [h=0] hue
     * @param {number} [alpha=65535] opacity
     * @returns the conversion
     */
    static from16s (l = 0, c = 0, h = 0, alpha = 65535) {
        return new Lch(
            l / 655.35,
            c / 257.0,
            h / 65535.0,
            alpha / 65535.0);
    }

    /**
     * @param {number} i 32 bit integer
     * @returns the conversion
     */
    static fromTLCH32 (i) {
        return Lch.from8s(
            (i >> 0x10) & 0xff,
            (i >> 0x08) & 0xff,
            i & 0xff,
            (i >> 0x18) & 0xff);
    }

    /**
     * @param {BigInt} i 64 bit integer
     * @returns the conversion
     */
    static fromTLCH64 (i) {
        return Lch.from16s(
            Number((i >> 0x20n) & 0xffffn),
            Number((i >> 0x10n) & 0xffffn),
            Number(i & 0xffffn),
            Number((i >> 0x30n) & 0xffffn));
    }

    /**
     * @param {Lch} o 
     * @returns the a component
     */
    static getA (o) {
        return o.c * Math.cos(o.h * (Math.PI + Math.PI));
    }

    /**
     * @param {Lch} o 
     * @returns the b component
     */
    static getB (o) {
        return o.c * Math.sin(o.h * (Math.PI + Math.PI));
    }

    /**
     * @param {Lch} c color
     * @retuns the lightness as an unsigned 8 bit integer
     */
    static getL8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.l, 0.0), 100.0) * 2.55 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the chroma as an unsigned 8 bit integer
     */
    static getC8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.c, 0.0), 255.0) + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the hue as an unsigned 8 bit integer
     */
    static getH8 (c) {
        return Math.trunc((c.h - Math.floor(c.h)) * 255 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the alpha as an unsigned 8 bit integer
     */
    static getAlpha8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the lightness as an unsigned 16 bit integer
     */
    static getL16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.l, 0.0), 100.0) * 655.35 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the chroma as an unsigned 16 bit integer
     */
    static getC16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.c, 0.0), 255.0) * 257 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the hue as an unsigned 16 bit integer
     */
    static getH16 (c) {
        return Math.trunc((c.h - Math.floor(c.h)) * 65535 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @retuns the alpha as an unsigned 16 bit integer
     */
    static getAlpha16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 65535 + 0.5);
    }

    /**
     * @param {Lch} c color
     * @returns the gray color
     */
    static gray (c) {
        return new Lch(c.l, 0.0, c.h, c.alpha);
    }

    /**
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @returns the difference
     */
    static subtract (o, d) {
        return new Lch(
            o.l - d.l,
            o.c - d.c,
            o.h - d.h,
            o.alpha - d.alpha);
    }

    /**
     * @param {Lch} c lch
     * @returns the 32 bit integer
     */
    static toTLCH32 (c) {
        return Lch.getAlpha8(c) << 0x18
            | Lch.getL8(c) << 0x10
            | Lch.getC8(c) << 0x08
            | Lch.getH8(c);
    }

    /**
     * @param {Lch} c lch
     * @returns the 64 bit integer
     */
    static toTLCH64 (c) {
        return BigInt(Lch.getAlpha16(c)) << 0x30n
            | BigInt(Lch.getL16(c)) << 0x20n
            | BigInt(Lch.getC16(c)) << 0x10n
            | BigInt(Lch.getH16(c));
    }

    static black () {
        return new Lch(0.0, 0.0, 0.0, 1.0);
    }

    static clear () {
        return new Lch(0.0, 0.0, 0.0, 0.0);
    }

    static white () {
        return new Lch(100.0, 0.0, 0.0, 1.0);
    }
}