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
     * @param {*} obj 
     * @returns the evaluation
     */
    equals (obj) {
        if (!obj) { return false; }
        if (this === obj) { return true; }
        if (obj.constructor.name !== this.constructor.name) {
            return false;
        }
        return Lch.eq(this, obj);
    }

    /**
     * @param {number} [precision=4] decimal display
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
     * @param {Lch} o left operand
     * @param {Lch} d right operand
     * @param {number} [alphaScale=100.0] alpha scale
     * @returns the distance
     */
    static dist (o, d, alphaScale = 100.0) {
        const tau = Math.PI + Math.PI;

        const oa = o.c * Math.cos(o.h * tau);
        const ob = o.c * Math.sin(o.h * tau);

        const da = d.c * Math.cos(d.h * tau);
        const db = d.c * Math.sin(d.h * tau);

        const ca = da - oa;
        const cb = db - ob;
        return Math.abs(alphaScale * (d.alpha - o.alpha))
            + Math.abs(d.l - o.l)
            + Math.sqrt(ca * ca + cb * cb);
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
     * @param {Lch} o color
     * @retuns the lightness as an unsigned 8 bit integer
     */
    static getL8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.l, 0.0), 100.0) * 2.55 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the lightness as an unsigned 16 bit integer
     */
    static getL16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.l, 0.0), 100.0) * 655.35 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the chroma as an unsigned 8 bit integer
     */
    static getC8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.c, 0.0), 255.0) + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the chroma as an unsigned 16 bit integer
     */
    static getC16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.c, 0.0), 255.0) * 257 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the hue as an unsigned 8 bit integer
     */
    static getH8 (o) {
        return Math.trunc((o.h - Math.floor(o.h)) * 255 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the hue as an unsigned 16 bit integer
     */
    static getH16 (o) {
        return Math.trunc((o.h - Math.floor(o.h)) * 65535 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the alpha as an unsigned 8 bit integer
     */
    static getAlpha8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @retuns the alpha as an unsigned 16 bit integer
     */
    static getAlpha16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 65535 + 0.5);
    }

    /**
     * @param {Lch} o color
     * @returns the gray color
     */
    static gray (o) {
        return new Lch(o.l, 0.0, o.h, o.alpha);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static gt (o, d) {
        return Lch.getAlpha16(o) > Lch.getAlpha16(d)
            && Lch.getL16(o) > Lch.getL16(d)
            && Lch.getC16(o) > Lch.getC16(d)
            && Lch.getH16(o) > Lch.getH16(d);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static gtEq (o, d) {
        return Lch.getAlpha16(o) >= Lch.getAlpha16(d)
            && Lch.getL16(o) >= Lch.getL16(d)
            && Lch.getC16(o) >= Lch.getC16(d)
            && Lch.getH16(o) >= Lch.getH16(d);
    }

    /**
     * @param {Lch} o 
     * @returns the array of harmonies
     */
    static harmonyAnalogous (o) {
        const lAna = (o.l * 2.0 + 50.0) / 3.0;

        const h30 = o.h + 0.08333333333333333;
        const h330 = o.h - 0.08333333333333333;

        return [
            new Lch(lAna, o.c, h30 - Math.floor(h30), o.alpha),
            new Lch(lAna, o.c, h330 - Math.floor(h330), o.alpha)
        ];
    }

    /**
     * @param {Lch} o 
     * @returns the array of harmonies
     */
    static harmonyComplement (o) {
        const h180 = c.h + 0.5;
        return [
            new Lch(100.0 - o.l, o.c, h180 - Math.floor(h180), o.alpha)
        ];
    }

    /**
     * @param {Lch} o 
     * @returns the array of harmonies
     */
    static harmonySplit (o) {
        const lSpl = (250.0 - o.l * 2.0) / 3.0;

        const h150 = o.h + 0.4166666666666667;
        const h210 = o.h - 0.4166666666666667;

        return [
            new Lch(lSpl, o.c, h150 - Math.floor(h150), o.alpha),
            new Lch(lSpl, o.c, h210 - Math.floor(h210), o.alpha)
        ];
    }

    /**
     * @param {Lch} o 
     * @returns the array of harmonies
     */
    static harmonySquare (o) {
        const h90 = o.h + 0.25;
        const h180 = o.h + 0.5;
        const h270 = o.h - 0.25;

        return [
            new Lch(50.0, o.c, h90 - Math.floor(h90), o.alpha),
            new Lch(100.0 - o.l, o.c, h180 - Math.floor(h180), o.alpha),
            new Lch(50.0, o.c, h270 - Math.floor(h270), o.alpha)
        ];
    }

    /**
     * @param {Lch} o 
     * @returns the array of harmonies
     */
    static harmonyTetradic (o) {
        const lTri = (200.0 - o.l) / 3.0;
        const lCmp = 100.0 - o.l;
        const lTet = (100.0 + o.l) / 3.0;

        const h120 = o.h + 0.3333333333333333;
        const h180 = o.h + 0.5;
        const h300 = o.h - 0.16666667;

        return [
            new Lch(lTri, o.c, h120 - Math.floor(h120), o.alpha),
            new Lch(lCmp, o.c, h180 - Math.floor(h180), o.alpha),
            new Lch(lTet, o.c, h300 - Math.floor(h300), o.alpha)
        ];
    }

    /**
     * @param {Lch} o 
     * @returns the array of harmonies
     */
    static harmonyTriadic (o) {
        const lTri = (200.0 - o.l) / 3.0;

        const h120 = o.h + 0.3333333333333333;
        const h240 = o.h - 0.3333333333333333;

        return [
            new Lch(lTri, o.c, h120 - Math.floor(h120), o.alpha),
            new Lch(lTri, o.c, h240 - Math.floor(h240), o.alpha)
        ];
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static lt (o, d) {
        return Lch.getAlpha16(o) < Lch.getAlpha16(d)
            && Lch.getL16(o) < Lch.getL16(d)
            && Lch.getC16(o) < Lch.getC16(d)
            && Lch.getH16(o) < Lch.getH16(d);
    }

    /**
     * @param {Lch} o left comparisand
     * @param {Lch} d right comparisand
     * @returns the evaluation
     */
    static ltEq (o, d) {
        return Lch.getAlpha16(o) <= Lch.getAlpha16(d)
            && Lch.getL16(o) <= Lch.getL16(d)
            && Lch.getC16(o) <= Lch.getC16(d)
            && Lch.getH16(o) <= Lch.getH16(d);
    }

    /**
     * @param {Lch} o origin
     * @param {Lch} d destination
     * @param {number} t factor
     * @param {function} easing hue easing function
     * @returns the mixed color
     */
    static mix (o, d, t, easing) {
        const u = 1.0 - t;
        const cl = u * o.l + t * d.l;
        const calpha = u * o.alpha + t * d.alpha;

        const oIsGray = o.c < 0.000001;
        const dIsGray = d.c < 0.000001;
        if (oIsGray && dIsGray) {
            return new Lch(cl, 0.0, 0.0, calpha);
        }

        if (oIsGray || dIsGray) {
            let oa = 0.0;
            let ob = 0.0;
            if (!oIsGray) {
                const ohRadians = o.h * (Math.PI + Math.PI);
                oa = o.c * Math.cos(ohRadians);
                ob = o.c * Math.sin(ohRadians);
            }

            let da = 0.0;
            let db = 0.0;
            if (!dIsGray) {
                const dhRadians = d.h * (Math.PI + Math.PI);
                da = d.c * Math.cos(dhRadians);
                db = d.c * Math.sin(dhRadians);
            }

            const ca = u * oa + t * da;
            const cb = u * ob + t * db;

            // Zero chroma should already be taken care of by the early
            // return for o and d gray above.
            const cc = Math.sqrt(ca * ca + cb * cb);

            let cRadiansSigned = Math.atan2(cb, ca);
            const cRadians = cRadiansSigned < 0.0 ?
                cRadiansSigned + (Math.PI + Math.PI) :
                cRadiansSigned;
            const ch = cRadians / (Math.PI + Math.PI);

            return new Lch(cl, cc, ch, calpha);
        }

        return new Lch(
            cl,
            u * o.c + t * d.c,
            easing(o.h, d.h, t, 1.0),
            calpha);
    }

    /**
     * @param {Lch} o color
     * @returns the opaque color
     */
    static opaque (o) {
        return new Lch(o.l, o.c, o.h, 1.0);
    }

    /**
     * @param {Lch} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleAlpha (o, scalar = 1.0) {
        return new Lch(o.l, o.c, o.h, o.alpha * scalar);
    }

    /**
     * @param {Lch} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleChroma (o, scalar = 1.0) {
        return new Lch(o.l, o.c * scalar, o.h, o.alpha);
    }

    /**
     * @param {Lch} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleLight (o, scalar = 1.0) {
        return new Lch(o.l * scalar, o.c, o.h, o.alpha);
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
     * @param {Lch} o lch
     * @returns the 32 bit integer
     */
    static toTLCH32 (o) {
        return Lch.getAlpha8(o) << 0x18
            | Lch.getL8(o) << 0x10
            | Lch.getC8(o) << 0x08
            | Lch.getH8(o);
    }

    /**
     * @param {Lch} o lch
     * @returns the 64 bit integer
     */
    static toTLCH64 (o) {
        return BigInt(Lch.getAlpha16(o)) << 0x30n
            | BigInt(Lch.getL16(o)) << 0x20n
            | BigInt(Lch.getC16(o)) << 0x10n
            | BigInt(Lch.getH16(o));
    }

    /**
     * @returns the color black
     */
    static black () {
        return new Lch(0.0, 0.0, 0.0, 1.0);
    }

    /**
     * @returns clear black
     */
    static clear () {
        return new Lch(0.0, 0.0, 0.0, 0.0);
    }

    /**
     * @returns the color white
     */
    static white () {
        return new Lch(100.0, 0.0, 0.0, 1.0);
    }
}