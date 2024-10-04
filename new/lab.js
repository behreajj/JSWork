'use strict';

/**
 * Represents colors in a perceptual color space, such as CIE LAB, SR LAB 2,
 * OK LAB, etc. The a and b axes are signed, unbounded values. Negative a
 * indicates a green hue; positive, magenta. Negative b indicates a blue hue;
 * positive, yellow. Lightness falls in the range [0.0, 100.0]. For a and b,
 * the practical range varies, but is roughly in [-111.0, 111.0] for CIE LAB.
 * Alpha is expected to be in [0.0, 1.0].
 */
class Lab {
    /**
     * @param {number} [l=0.0] lightness
     * @param {number} [a=0.0] green to magenta
     * @param {number} [b=0.0] blue to yellow
     * @param {number} [alpha=1.0] opacity
     */
    constructor (l = 0.0, a = 0.0, b = 0.0, alpha = 1.0) {
        this._l = l;
        this._a = a;
        this._b = b;
        this._alpha = alpha;

        Object.freeze(this);
    }

    get l () { return this._l; }

    get a () { return this._a; }

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
        return Lab.eq(this, obj);
    }

    /**
     * @param {number} [precision=4] decimal display
     * @returns the string
     */
    toString (precision = 4) {
        if (precision >= 0 && precision < 21) {
            return [
                "{\"l\":", this._l.toFixed(precision),
                ",\"a\":", this._a.toFixed(precision),
                ",\"b\":", this._b.toFixed(precision),
                ",\"alpha\":", this._alpha.toFixed(precision),
                '}'
            ].join('');
        }

        return [
            "{\"l\":", Lab.getL16(this),
            ",\"a\":", Lab.getA16(this),
            ",\"b\":", Lab.getB16(this),
            ",\"alpha\":", Lab.getAlpha16(this),
            '}'
        ].join('');
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the sum
     */
    static add (o, d) {
        return new Lab(
            o.l + d.l,
            o.a + d.a,
            o.b + d.b,
            o.alpha + d.alpha);
    }

    /**
     * @param {Lab} o color
     * @returns the chroma
     */
    static chroma (o) {
        return Math.sqrt(Lab.chromaSq(o));
    }

    /**
     * @param {Lab} o color
     * @returns the chroma squaed
     */
    static chromaSq (o) {
        return o._a * o._a + o._b * o._b;
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the copy
     */
    static copyAlpha (o, d) {
        return new Lab(o.l, o.a, o.b, d.alpha);
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the copy
     */
    static copyChroma (o, d) {
        const oChromaSq = Lab.chromaSq(o);
        const dChromaSq = Lab.chromaSq(d);
        if (oChromaSq >= 0.000001 && dChromaSq >= 0.000001) {
            const ratio = Math.sqrt(dChromaSq) / Math.sqrt(oChromaSq);
            return new Lab(o.l, o.a * ratio, o.b * ratio, o.alpha);
        }
        return Lab.gray(o);
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the copy
     */
    static copyHue (o, d) {
        const oChromaSq = Lab.chromaSq(o);
        const dChromaSq = Lab.chromaSq(d);
        if (oChromaSq >= 0.000001 && dChromaSq >= 0.000001) {
            const ratio = Math.sqrt(oChromaSq) / Math.sqrt(dChromaSq);
            return new Lab(o.l, d.a * ratio, d.b * ratio, o.alpha);
        }
        return Lab.gray(o);
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the copy
     */
    static copyHueChroma (o, d) {
        return new Lab(o.l, d.a, d.b, o.alpha);
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the copy
     */
    static copyLight (o, d) {
        return new Lab(d.l, o.a, o.b, o.alpha);
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @param {number} [alphaScale=100.0] alpha scale
     * @returns the distance
     */
    static dist (o, d, alphaScale = 100.0) {
        const ca = d.a - o.a;
        const cb = d.b - o.b;
        return Math.abs(alphaScale * (d.alpha - o.alpha))
            + Math.abs(d.l - o.l)
            + Math.sqrt(ca * ca + cb * cb);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static eq (o, d) {
        return Lab.eqAlpha(o, d)
            && Lab.eqLight(o, d)
            && Lab.eqHueChroma(o, d);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static eqAlpha (o, d) {
        return Lab.getAlpha16(o) === Lab.getAlpha16(d);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static eqHueChroma (o, d) {
        return Lab.getA16(o) === Lab.getA16(d)
            && Lab.getB16(o) === Lab.getB16(d);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static eqLight (o, d) {
        return Lab.getL16(o) === Lab.getL16(d);
    }

    /**
     * @param {number} [l=0] light
     * @param {number} [a=0] chroma
     * @param {number} [b=0] hue
     * @param {number} [alpha=255] opacity
     * @returns the conversion
     */
    static from8s (l = 0, a = 128, b = 128, alpha = 255) {
        return new Lab(
            l / 2.55,
            a - 128.0,
            b - 128.0,
            alpha / 255.0);
    }

    /**
     * @param {number} [l=0] light
     * @param {number} [a=0] chroma
     * @param {number} [b=0] hue
     * @param {number} [alpha=65535] opacity
     * @returns the conversion
     */
    static from16s (l = 0, a = 32768, b = 32768, alpha = 65535) {
        return new Lab(
            l / 655.35,
            (a - 32768) / 257.0,
            (b - 32768) / 257.0,
            alpha / 65535.0);
    }

    /**
     * @param {number} i 32 bit integer
     * @returns the conversion
     */
    static fromTLAB32 (i) {
        return Lab.from8s(
            (i >> 0x10) & 0xff,
            (i >> 0x08) & 0xff,
            i & 0xff,
            (i >> 0x18) & 0xff);
    }

    /**
     * @param {BigInt} i 64 bit integer
     * @returns the conversion
     */
    static fromTLAB64 (i) {
        return Lab.from16s(
            Number((i >> 0x20n) & 0xffffn),
            Number((i >> 0x10n) & 0xffffn),
            Number(i & 0xffffn),
            Number((i >> 0x30n) & 0xffffn));
    }

    /**
     * @param {Lab} o color
     * @retuns the lightness as an unsigned 8 bit integer
     */
    static getL8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.l, 0.0), 100.0) * 2.55 + 0.5);
    }
    
    /**
     * @param {Lab} o color
     * @retuns the lightness as an unsigned 16 bit integer
     */
    static getL16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.l, 0.0), 100.0) * 655.35 + 0.5);
    }

    /**
     * @param {Lab} o color
     * @retuns a as an unsigned 8 bit integer
     */
    static getA8 (o) {
        return 128 + Math.floor(Math.min(Math.max(
            o.a, -127.5), 127.5));
    }

    /**
     * @param {Lab} o color
     * @retuns a as an unsigned 16 bit integer
     */
    static getA16 (o) {
        return 32768 + Math.floor(Math.min(Math.max(
            o.a, -127.5), 127.5) * 257);
    }

    /**
     * @param {Lab} o color
     * @retuns b as an unsigned 16 bit integer
     */
    static getB8 (o) {
        return 128 + Math.floor(Math.min(Math.max(
            o.b, -127.5), 127.5));
    }

    /**
     * @param {Lab} o color
     * @retuns b as an unsigned 16 bit integer
     */
    static getB16 (o) {
        return 32768 + Math.floor(Math.min(Math.max(
            o.b, -127.5), 127.5) * 257);
    }

    /**
     * @param {Lab} o color
     * @retuns the alpha as an unsigned 8 bit integer
     */
    static getAlpha8 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 255 + 0.5);
    }

    /**
     * @param {Lab} o color
     * @retuns the alpha as an unsigned 16 bit integer
     */
    static getAlpha16 (o) {
        return Math.trunc(Math.min(Math.max(
            o.alpha, 0.0), 1.0) * 65535 + 0.5);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static gt (o, d) {
        return Lab.getAlpha16(o) > Lab.getAlpha16(d)
            && Lab.getL16(o) > Lab.getL16(d)
            && Lab.getA16(o) > Lab.getA16(d)
            && Lab.getB16(o) > Lab.getB16(d);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static gtEq (o, d) {
        return Lab.getAlpha16(o) >= Lab.getAlpha16(d)
            && Lab.getL16(o) >= Lab.getL16(d)
            && Lab.getA16(o) >= Lab.getA16(d)
            && Lab.getB16(o) >= Lab.getB16(d);
    }

    /**
     * @param {Lab} o color
     * @returns the gray color
     */
    static gray (o) {
        return new Lab(o.l, 0.0, 0.0, o.alpha);
    }

    /**
     * @param {Lab} o 
     * @returns the array of harmonies
     */
    static harmonyAnalogous (o) {
        const lAna = (o.l * 2.0 + 50.0) / 3.0;

        // 30, 330 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = sqrt3_2 * o.a;
        const rt32cb = sqrt3_2 * o.b;
        const halfca = 0.5 * o.a;
        const halfcb = 0.5 * o.b;

        return [
            new Lab(lAna, rt32ca - halfcb, rt32cb + halfca, o.alpha),
            new Lab(lAna, rt32ca + halfcb, rt32cb - halfca, o.alpha)
        ];
    }

    /**
     * @param {Lab} o 
     * @returns the array of harmonies
     */
    static harmonyComplement (o) {
        return [
            new Lab(100.0 - o.l, -o.a, -o.b, o.alpha)
        ];
    }

    /**
     * @param {Lab} o 
     * @returns the array of harmonies
     */
    static harmonySplit (o) {
        const lSpl = (250.0 - o.l * 2.0) / 3.0;

        // 150, 210 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = -sqrt3_2 * o.a;
        const rt32cb = -sqrt3_2 * o.b;
        const halfca = 0.5 * o.a;
        const halfcb = 0.5 * o.b;

        return [
            new Lab(lSpl, rt32ca - halfcb, rt32cb + halfca, o.alpha),
            new Lab(lSpl, rt32ca + halfcb, rt32cb - halfca, o.alpha)
        ];
    }

    /**
     * @param {Lab} o 
     * @returns the array of harmonies
     */
    static harmonySquare (o) {
        return [
            new Lab(50.0, -o.b, o.a, o.alpha),
            new Lab(100.0 - o.l, -o.a, -o.b, o.alpha),
            new Lab(50.0, o.b, -o.a, o.alpha)
        ];
    }

    /**
     * @param {Lab} o 
     * @returns the array of harmonies
     */
    static harmonyTetradic (o) {
        const lTri = (200.0 - o.l) / 3.0;
        const lCmp = 100.0 - o.l;
        const lTet = (100.0 + o.l) / 3.0;

        // 120, 300 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = sqrt3_2 * o.a;
        const rt32cb = sqrt3_2 * o.b;
        const halfca = 0.5 * o.a;
        const halfcb = 0.5 * o.b;

        return [
            new Lab(lTri, -halfca - rt32cb, -halfcb + rt32ca, o.alpha),
            new Lab(lCmp, -o.a, -o.b, o.alpha),
            new Lab(lTet, halfca + rt32cb, halfcb - rt32ca, o.alpha)
        ];
    }

    /**
     * @param {Lab} o 
     * @returns the array of harmonies
     */
    static harmonyTriadic (o) {
        const lTri = (200.0 - o.l) / 3.0;

        // 120, 240 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = sqrt3_2 * o.a;
        const rt32cb = sqrt3_2 * o.b;
        const halfca = -0.5 * o.a;
        const halfcb = -0.5 * o.b;

        return [
            new Lab(lTri, halfca - rt32cb, halfcb + rt32ca, o.alpha),
            new Lab(lTri, halfca + rt32cb, halfcb - rt32ca, o.alpha)
        ];
    }

    /**
     * @param {Lab} o color
     * @returns the hue
     */
    static hue (o) {
        const hueSigned = Math.atan2(o.b, o.a);
        const tau = Math.PI + Math.PI;
        return hueSigned < 0.0 ?
            (hueSigned + tau) / tau :
            hueSigned / tau;
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static lt (o, d) {
        return Lab.getAlpha16(o) < Lab.getAlpha16(d)
            && Lab.getL16(o) < Lab.getL16(d)
            && Lab.getA16(o) < Lab.getA16(d)
            && Lab.getB16(o) < Lab.getB16(d);
    }

    /**
     * @param {Lab} o left comparisand
     * @param {Lab} d right comparisand
     * @returns the evaluation
     */
    static ltEq (o, d) {
        return Lab.getAlpha16(o) <= Lab.getAlpha16(d)
            && Lab.getL16(o) <= Lab.getL16(d)
            && Lab.getA16(o) <= Lab.getA16(d)
            && Lab.getB16(o) <= Lab.getB16(d);
    }

    /**
     * @param {Lab} o origin
     * @param {Lab} d destination
     * @param {number} [t=0.5] factor
     */
    static mix (o, d, t = 0.5) {
        const u = 1.0 - t;
        return new Lab(
            u * o.l + t * d.l,
            u * o.a + t * d.a,
            u * o.b + t * d.b,
            u * o.alpha + t * d.alpha);
    }

    /**
     * @param {Lab} o origin
     * @param {Lab} d destination
     * @param {number} t factor
     * @param {function} easing hue easing function
     * @returns the mixed color
     */
    static mixPolar (o, d, t, easing) {
        const oChromaSq = Lab.chromaSq(o);
        const dChromaSq = Lab.chromaSq(d);
        if (oChromaSq < 0.000001 || dChromaSq < 0.000001) {
            return Lab.mix(o, d, t);
        }

        const cChroma = u * Math.sqrt(oChromaSq)
            + t * Math.sqrt(dChromaSq);

        const cRadians = easing(
            Math.atan2(o.b, o.a),
            Math.atan2(d.b, d.a),
            t, Math.PI + Math.PI);

        return new Lab(
            u * o.l + t * d.l,
            cChroma * Math.cos(cRadians),
            cChroma * Math.sin(cRadians),
            u * o.alpha + t * d.alpha);
    }

    /**
     * @param {Lab} o color
     * @returns the opaque color
     */
    static opaque (o) {
        return new Lab(o.l, o.a, o.b, 1.0);
    }

    /**
     * @param {Lab} o color
     * @param {number} [trgChroma=0.0] target chroma
     * @returns the color
     */
    static rescaleChroma (o, trgChroma = 0.0) {
        const chromaSq = Lab.chromaSq(o);
        if (chromaSq >= 0.000001) {
            const scalarNorm = trgChroma / Math.sqrt(chromaSq);
            return new Lab(o.l, o.a * scalarNorm, o.b * scalarNorm, o.alpha);
        }
        return Lab.gray(o);
    }

    /**
     * @param {Lab} o color
     * @param {number} [hueShift=0.0] hue shift
     * @returns the hue rotated color
     */
    static rotateHue (o, hueShift = 0.0) {
        const radians = hueShift * (Math.PI + Math.PI);
        return Lab.rotateHueInternal(o, Math.cos(radians), Math.sin(radians));
    }

    /**
     * @param {Lab} o color
     * @param {number} [cosa=1.0] cosine of the angle
     * @param {number} [sina=0.0] sine of the angle
     * @returns the hue rotated color
     */
    static rotateHueInternal (o, cosa = 1.0, sina = 0.0) {
        return new Lab(
            o.l,
            cosa * o.a - sina * o.b,
            cosa * o.b + sina * o.a,
            o.alpha);
    }

    /**
     * @param {Lab} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleAlpha (o, scalar = 1.0) {
        return new Lab(o.l, o.a, o.b, o.alpha * scalar);
    }

    /**
     * @param {Lab} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleChroma (o, scalar = 1.0) {
        return new Lab(o.l, o.a * scalar, o.b * scalar, o.alpha);
    }

    /**
     * @param {Lab} o color
     * @param {number} [scalar=1.0] scalar
     * @returns the color 
     */
    static scaleLight (o, scalar = 1.0) {
        return new Lab(o.l * scalar, o.a, o.b, o.alpha);
    }

    /**
     * @param {Lab} o left operand
     * @param {Lab} d right operand
     * @returns the difference
     */
    static subtract (o, d) {
        return new Lab(
            o.l - d.l,
            o.a - d.a,
            o.b - d.b,
            o.alpha - d.alpha);
    }

    /**
     * @param {Lab} o lch
     * @returns the 32 bit integer
     */
    static toTLAB32 (o) {
        return Lab.getAlpha8(o) << 0x18
            | Lab.getL8(o) << 0x10
            | Lab.getA8(o) << 0x08
            | Lab.getB8(o);
    }

    /**
     * @param {Lab} o lab
     * @returns the 64 bit integer
     */
    static toTLAB64 (o) {
        return BigInt(Lab.getAlpha16(o)) << 0x30n
            | BigInt(Lab.getL16(o)) << 0x20n
            | BigInt(Lab.getA16(o)) << 0x10n
            | BigInt(Lab.getB16(o));
    }

    /**
     * @returns the color black
     */
    static black () {
        return new Lab(0.0, 0.0, 0.0, 1.0);
    }

    /**
     * @returns clear black
     */
    static clear () {
        return new Lab(0.0, 0.0, 0.0, 0.0);
    }

    /**
     * @returns the color white
     */
    static white () {
        return new Lab(100.0, 0.0, 0.0, 1.0);
    }
}