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
     * @param {number} [alpha=1.0] alpha, opacity
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

    [Symbol.toPrimitive] (hint) {
        switch (hint) {
            case 'string':
                return this.toString();
            case 'number':
            default:
                return Lab.toTLAB64(this);
        }
    }

    hashCode() {
        return Lab.toTLAB32(this);
    }

    equals (obj) {
        if (!obj) { return false; }
        if (this === obj) { return true; }
        if (obj.constructor.name !== this.constructor.name) {
            return false;
        }
        return Lab.eq(this, obj);
    }

    toString (precision = 4) {
        return [
            '{\"l\":',
            this._l.toFixed(precision),
            ',\"a\":',
            this._a.toFixed(precision),
            ',\"b\":',
            this._b.toFixed(precision),
            ',\"alpha\":',
            this._alpha.toFixed(precision),
            '}'
        ].join('');
    }

    static add (o, d) {
        return new Lab(o.l + d.l, o.a + d.a, o.b + d.b, o.alpha + d.alpha);
    }

    static black () {
        return new Lab(0.0, 0.0, 0.0, 1.0);
    }

    static clear () {
        return new Lab(0.0, 0.0, 0.0, 0.0);
    }

    static chroma (c) {
        return Math.sqrt(Lab.chromaSq(c));
    }

    static chromaSq (c) {
        return c._a * c._a + c._b * c._b;
    }

    static copyAlpha (o, d) {
        return new Lab(o.l, o.a, o.b, d.alpha);
    }

    static copyChroma (o, d) {
        const oChromaSq = Lab.chromaSq(o);
        const dChromaSq = Lab.chromaSq(d);
        if (oChromaSq >= 0.000001 && dChromaSq >= 0.000001) {
            const ratio = Math.sqrt(dChromaSq) / Math.sqrt(oChromaSq);
            return new Lab(o.l, o.a * ratio, o.b * ratio, o.alpha);
        }
        return Lab.gray(o);
    }

    static copyHue (o, d) {
        const oChromaSq = Lab.chromaSq(o);
        const dChromaSq = Lab.chromaSq(d);
        if (oChromaSq >= 0.000001 && dChromaSq >= 0.000001) {
            const ratio = Math.sqrt(oChromaSq) / Math.sqrt(dChromaSq);
            return new Lab(o.l, d.a * ratio, d.b * ratio, o.alpha);
        }
        return Lab.gray(o);
    }

    static copyHueChroma (o, d) {
        return new Lab(o.l, d.a, d.b, o.alpha);
    }

    static copyL (o, d) {
        return new Lab(d.l, o.a, o.b, o.alpha);
    }

    static dist (o, d) {
        const da = d.a - o.a;
        const db = d.b - o.b;
        return Math.abs(100.0 * (d.alpha - o.alpha))
            + Math.abs(d.l - o.l)
            + Math.sqrt(da * da + db * db);
    }

    static eq (o, d) {
        return Lab.toTLAB64(o) === Lab.toTLAB64(d);
    }

    static from8s (l = 0, a = 128, b = 128, alpha = 255) {
        return new Lab(
            l / 2.55,
            a - 128.0,
            b - 128.0,
            alpha / 255.0);
    }

    static from16s (l = 0, a = 32768, b = 32768, alpha = 65535) {
        return new Lab(
            l / 655.35,
            (a - 32768) / 257.0,
            (b - 32768) / 257.0,
            alpha / 65535.0);
    }

    static fromTLAB32 (i) {
        return Lab.from8s(
            (i >> 0x10) & 0xff,
            (i >> 0x08) & 0xff,
            i & 0xff,
            (i >> 0x18) & 0xff);
    }

    static fromTLAB64 (i) {
        return Lab.from16s(
            (i >> 0x20) & 0xffff,
            (i >> 0x10) & 0xffff,
            i & 0xffff,
            (i >> 0x30) & 0xffff);
    }

    static getL8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.l, 0.0), 100.0) * 2.55 + 0.5);
    }

    static getA8 (c) {
        return 128 + Math.floor(Math.min(Math.max(
            c.a, -127.5), 127.5));
    }

    static getB8 (c) {
        return 128 + Math.floor(Math.min(Math.max(
            c.b, -127.5), 127.5));
    }

    static getAlpha8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 255 + 0.5);
    }

    static getL16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.l, 0.0), 100.0) * 655.35 + 0.5);
    }

    static getA16 (c) {
        return 32768 + Math.floor(Math.min(Math.max(
            c.a, -127.5), 127.5) * 257);
    }

    static getB16 (c) {
        return 32768 + Math.floor(Math.min(Math.max(
            c.b, -127.5), 127.5) * 257);
    }

    static getAlpha16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 65535 + 0.5);
    }

    static gray (c) {
        return Lab.new(c.l, 0.0, 0.0, c.alpha);
    }

    static gt (o, d) {
        return Lab.toTLAB64(o) > Lab.toTLAB64(d);
    }

    static gtEq (o, d) {
        return Lab.toTLAB64(o) >= Lab.toTLAB64(d);
    }

    static harmonyAnalogous (c) {
        const lAna = (c.l * 2.0 + 50.0) / 3.0;

        // 30, 330 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = sqrt3_2 * c.a;
        const rt32cb = sqrt3_2 * c.b;
        const halfca = 0.5 * c.a;
        const halfcb = 0.5 * c.b;

        return [
            new Lab(lAna, rt32ca - halfcb, rt32cb + halfca, c.alpha),
            new Lab(lAna, rt32ca + halfcb, rt32cb - halfca, c.alpha)
        ];
    }

    static harmonyComplement (c) {
        return [
            new Lab(100.0 - c.l, -c.a, -c.b, c.alpha),
        ];
    }

    static harmonySplit (c) {
        const lSpl = (250.0 - c.l * 2.0) / 3.0;

        // 150, 210 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = -sqrt3_2 * c.a;
        const rt32cb = -sqrt3_2 * c.b;
        const halfca = 0.5 * c.a;
        const halfcb = 0.5 * c.b;

        return [
            new Lab(lSpl, rt32ca - halfcb, rt32cb + halfca, c.alpha),
            new Lab(lSpl, rt32ca + halfcb, rt32cb - halfca, c.alpha)
        ];
    }

    static harmonySquare (c) {
        return [
            new Lab(50.0, -c.b, c.a, c.alpha),
            new Lab(100.0 - c.l, -c.a, -c.b, c.alpha),
            new Lab(50.0, c.b, -c.a, c.alpha)
        ];
    }

    static harmonyTetradic (c) {
        const lTri = (200.0 - c.l) / 3.0;
        const lCmp = 100.0 - c.l;
        const lTet = (100.0 + c.l) / 3.0;

        // 120, 300 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = sqrt3_2 * c.a;
        const rt32cb = sqrt3_2 * c.b;
        const halfca = 0.5 * c.a;
        const halfcb = 0.5 * c.b;

        return [
            new Lab(lTri, -halfca - rt32cb, -halfcb + rt32ca, c.alpha),
            new Lab(lCmp, -c.a, -c.b, c.alpha),
            new Lab(lTet, halfca + rt32cb, halfcb - rt32ca, c.alpha)
        ];
    }

    static harmonyTriadic (c) {
        const lTri = lTri = (200.0 - c.l) / 3.0;

        // 120, 240 degrees
        const sqrt3_2 = 0.8660254037844386;
        const rt32ca = sqrt3_2 * c.a;
        const rt32cb = sqrt3_2 * c.b;
        const halfca = -0.5 * c.a;
        const halfcb = -0.5 * c.b;

        return [
            new Lab(lTri, halfca - rt32cb, halfcb + rt32ca, c.alpha),
            new Lab(lTri, halfca + rt32cb, halfcb - rt32ca, c.alpha)
        ];
    }

    static hue (c) {
        const hueSigned = Math.atan2(c.b, c.a);
        const tau = Math.PI + Math.PI;
        return hueSigned < 0.0 ?
            (hueSigned + tau) / tau :
            hueSigned / tau;
    }

    static lt (o, d) {
        return Lab.toTLAB64(o) < Lab.toTLAB64(d);
    }

    static ltEq (o, d) {
        return Lab.toTLAB64(o) <= Lab.toTLAB64(d);
    }

    static mix (o, d, t = 0.5) {
        const u = 1.0 - t;
        return new Lab(
            u * o.l + t * d.l,
            u * o.a + t * d.a,
            u * o.b + t * d.b,
            u * o.alpha + t * d.alpha);
    }

    static mixPolar (o, d, t, easing) {
        const oChromaSq = Lab.chromaSq(o);
        const dChromaSq = Lab.chromaSq(d);
        if (oChromaSq < 0.000001 || dChromaSq < 0.000001) {
            return Lab.mix(o, d, t);
        }

        const cChroma = u * Math.sqrt(oChromaSq)
            + t * Math.sqrt(dChromaSq);

        const cHue = easing(
            Math.atan2(o.b, o.a),
            Math.atan2(d.b, d.a),
            t, Math.PI + Math.PI);

        return new Lab(
            u * o.l + t * d.l,
            cChroma * Math.cos(cHue),
            cChroma * Math.sin(cHue),
            u * o.alpha + t * d.alpha);
    }

    static opaque (c) {
        return new Lab(c.l, c.a, c.b, 1.0);
    }

    static rescaleChroma (c, scalar) {
        const chromaSq = Lab.chromaSq(c);
        if (chromaSq >= 0.000001) {
            const scalarNorm = scalar / Math.sqrt(chromaSq);
            return new Lab(c.l, c.a * scalarNorm, c.b * scalarNorm, c.alpha);
        }
        return Lab.gray(c);
    }

    static rotateHue (c, hueShift = 0.0) {
        const radians = hueShift * (Math.PI + Math.PI);
        return Lab.rotateHueInternal(c, Math.cos(radians), Math.sin(radians));
    }

    static rotateHueInternal (c, cosa = 1.0, sina = 0.0) {
        return new Lab(
            c.l,
            cosa * c.a - sina * c.b,
            cosa * c.b + sina * c.a,
            c.alpha
        );
    }

    static scaleAlpha (c, scalar = 1.0) {
        return new Lab(c.l, c.a, c.b, c.alpha * scalar);
    }

    static scaleChroma (c, scalar = 1.0) {
        return new Lab(c.l, c.a * scalar, c.b * scalar, c.alpha);
    }

    static scaleL (c, scalar = 1.0) {
        return new Lab(c.l * scalar, c.a, c.b, c.alpha);
    }

    static subtract (o, d) {
        return new Lab(o.l - d.l, o.a - d.a, o.b - d.b, o.alpha - d.alpha);
    }

    static toTLAB32 (c) {
        return Lab.getAlpha8(c) << 0x18
            | Lab.getL8(c) << 0x10
            | Lab.getA8(c) << 0x08
            | Lab.getB8(c);
    }

    static toTLAB64 (c) {
        return Lab.getAlpha16(c) << 0x30
            | Lab.getL16(c) << 0x20
            | Lab.getA16(c) << 0x10
            | Lab.getB16(c);
    }

    static white () {
        return new Lab(100.0, 0.0, 0.0, 1.0);
    }
}