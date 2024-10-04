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

    equals (obj) {
        if (!obj) { return false; }
        if (this === obj) { return true; }
        if (obj.constructor.name !== this.constructor.name) {
            return false;
        }
        return Rgb.eq(this, obj);
    }

    toString (precision = 4) {
        return [
            "{\"r\":",
            this._r.toFixed(precision),
            ",\"g\":",
            this._g.toFixed(precision),
            ",\"b\":",
            this._b.toFixed(precision),
            ",\"alpha\":",
            this._alpha.toFixed(precision),
            '}'
        ].join('');
    }

    static bitAnd (o, d) {
        return Rgb.fromRGBA32(Rgb.toRGBA32(o) & Rgb.toRGBA32(d));
    }

    static bitNot (c) {
        return Rgb.fromRGBA32(~Rgb.toRGBA32(c));
    }

    static bitOr (o, d) {
        return Rgb.fromRGBA32(Rgb.toRGBA32(o) | Rgb.toRGBA32(d));
    }

    static bitXor (o, d) {
        return Rgb.fromRGBA32(Rgb.toRGBA32(o) ^ Rgb.toRGBA32(d));
    }

    static clamp (c, lb = 0.0, ub = 1.0) {
        return new Rgb(
            Math.min(Math.max(c.r, lb), ub),
            Math.min(Math.max(c.g, lb), ub),
            Math.min(Math.max(c.b, lb), ub),
            Math.min(Math.max(c.alpha, lb), ub));
    }

    static copyAlpha (o, d) {
        return new Rgb(o.r, o.g, o.b, d.alpha);
    }

    static dist (o, d, alphaScale = 1.0) {
        const cr = d.r - o.r;
        const cg = d.g - o.g;
        const cb = d.b - o.b;
        const ct = alphaScale * (d.alpha - o.alpha)

        return Math.sqrt(cr * cr + cg * cg + cb * cb + ct * ct);
    }

    static eq (o, d) {
        return Rgb.toRGBA32(o) === Rgb.toRGBA32(d);
    }

    static from3s (r = 0, g = 0, b = 0, alpha = 7) {
        return new Rgb(
            r / 7.0,
            g / 7.0,
            b / 7.0,
            alpha / 7.0);
    }

    static from4s (r = 0, g = 0, b = 0, alpha = 15) {
        return new Rgb(
            r / 15.0,
            g / 15.0,
            b / 15.0,
            alpha / 15.0);
    }

    static from5551 (r = 0, g = 0, b = 0, alpha = 1) {
        return new Rgb(
            r / 31.0,
            g / 31.0,
            b / 31.0,
            alpha);
    }

    static from565 (r = 0, g = 0, b = 0) {
        return new Rgb(
            r / 31.0,
            g / 63.0,
            b / 31.0,
            1.0);
    }

    static from8s (r = 0, g = 0, b = 0, alpha = 65535) {
        return new Rgb(
            r / 255.0,
            g / 255.0,
            b / 255.0,
            alpha / 255.0);
    }

    static from16s (r = 0, g = 0, b = 0, alpha = 65535) {
        return new Rgb(
            r / 65535.0,
            g / 65535.0,
            b / 65535.0,
            alpha / 65535.0);
    }

    static fromRGBA12 (i) {
        return Rgb.from3s(
            (i >> 0x9) & 0x7,
            (i >> 0x6) & 0x7,
            (i >> 0x3) & 0x7,
            i & 0x7);
    }

    static fromRGBA16 (i) {
        return Rgb.from4s(
            (i >> 0x10) & 0xf,
            (i >> 0x08) & 0xf,
            (i >> 0x04) & 0xf,
            i & 0xf);
    }

    static fromRGB555 (i) {
        return Rgb.from5551(
            (i >> 0xa) & 0x1f,
            (i >> 0x5) & 0x1f,
            i & 0x1f,
            1);
    }

    static fromRGB565 (i) {
        return Rgb.from565(
            (i >> 0xb) & 0x1f,
            (i >> 0x5) & 0x3f,
            i & 0x1f);
    }

    static fromRGBA32 (i) {
        return Rgb.from8s(
            (i >> 0x18) & 0xff,
            (i >> 0x10) & 0xff,
            (i >> 0x08) & 0xff,
            i & 0xff);
    }

    static fromRGBA64 (i) {
        return Rgb.from16s(
            (i >> 0x30) & 0xffff,
            (i >> 0x20) & 0xffff,
            (i >> 0x10) & 0xffff,
            i & 0xffff);
    }

    static getR3 (c) {
        return Math.trunc(Math.min(Math.max(
            c.r, 0.0), 1.0) * 7 + 0.5);
    }

    static getR4 (c) {
        return Math.trunc(Math.min(Math.max(
            c.r, 0.0), 1.0) * 15 + 0.5);
    }

    static getR5 (c) {
        return Math.trunc(Math.min(Math.max(
            c.r, 0.0), 1.0) * 31 + 0.5);
    }

    static getR8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.r, 0.0), 1.0) * 255 + 0.5);
    }

    static getR16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.r, 0.0), 1.0) * 65535 + 0.5);
    }

    static getG3 (c) {
        return Math.trunc(Math.min(Math.max(
            c.g, 0.0), 1.0) * 7 + 0.5);
    }

    static getG4 (c) {
        return Math.trunc(Math.min(Math.max(
            c.g, 0.0), 1.0) * 15 + 0.5);
    }

    static getG5 (c) {
        return Math.trunc(Math.min(Math.max(
            c.g, 0.0), 1.0) * 31 + 0.5);
    }

    static getG6 (c) {
        return Math.trunc(Math.min(Math.max(
            c.g, 0.0), 1.0) * 63 + 0.5);
    }

    static getG8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.g, 0.0), 1.0) * 255 + 0.5);
    }

    static getG16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.g, 0.0), 1.0) * 65535 + 0.5);
    }

    static getB3 (c) {
        return Math.trunc(Math.min(Math.max(
            c.b, 0.0), 1.0) * 7 + 0.5);
    }

    static getB4 (c) {
        return Math.trunc(Math.min(Math.max(
            c.b, 0.0), 1.0) * 15 + 0.5);
    }

    static getB5 (c) {
        return Math.trunc(Math.min(Math.max(
            c.b, 0.0), 1.0) * 31 + 0.5);
    }

    static getB8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.b, 0.0), 1.0) * 255 + 0.5);
    }

    static getB16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.b, 0.0), 1.0) * 65535 + 0.5);
    }

    static getAlpha1 (c) {
        return c.alpha >= 0.5 ? 1 : 0;
    }

    static getAlpha3 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 7 + 0.5);
    }

    static getAlpha4 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 15 + 0.5);
    }

    static getAlpha8 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 255 + 0.5);
    }

    static getAlpha16 (c) {
        return Math.trunc(Math.min(Math.max(
            c.alpha, 0.0), 1.0) * 65535 + 0.5);
    }

    static gt (o, d) {
        return Rgb.toRGBA32(o) > Rgb.toRGBA32(d);
    }

    static gtEq (o, d) {
        return Rgb.toRGBA32(o) >= Rgb.toRGBA32(d);
    }

    static isInGamut (c, eps = 0.0) {
        let oneEps = 1.0 + eps;
        return c.r >= -eps && c.r <= oneEps
            && c.g >= -eps && c.g <= oneEps
            && c.b >= -eps && c.b <= oneEps;
    }

    static lt (o, d) {
        return Rgb.toRGBA32(o) < Rgb.toRGBA32(d);
    }

    static ltEq (o, d) {
        return Rgb.toRGBA32(o) <= Rgb.toRGBA32(d);
    }

    static mix (o, d, t = 0.5) {
        const u = 1.0 - t;
        return new Rgb(
            u * o.r + t * d.r,
            u * o.g + t * d.g,
            u * o.b + t * d.b,
            u * o.alpha + t * d.alpha);
    }

    static opaque (c) {
        return new Rgb(c.r, c.g, c.b, 1.0);
    }

    static premul (c) {
        if (c.alpha !== 0.0) {
            return new Rgb(
                c.r / c.alpha,
                c.g / c.alpha,
                c.b / c.alpha,
                c.alpha);
        }
        return Rgb.clear();
    }

    static scaleAlpha (c, scalar = 1.0) {
        return new Rgb(c.r, c.g, c.b, c.alpha * scalar);
    }

    static sRgbGammaToLinear (c) {
        const inv1_055 = 1.0 / 1.055;
        const inv12_92 = 1.0 / 12.92;

        return new Rgb(
            c.r > 0.04045 ?
                Math.pow((c.r + 0.055) * inv1_055, 2.4) :
                c.r * inv12_92,
            c.g > 0.04045 ?
                Math.pow((c.g + 0.055) * inv1_055, 2.4) :
                c.g * inv12_92,
            c.b > 0.04045 ?
                Math.pow((c.b + 0.055) * inv1_055, 2.4) :
                c.b * inv12_92,
            c.alpha);
    }

    static sRgbLinearToGamma (c) {
        const inv24 = 1.0 / 2.4;
        return new Rgb(
            c.r > 0.0031308 ?
                Math.pow(c.r, inv24) * 1.055 - 0.055 :
                c.r * 12.92,
            c.g > 0.0031308 ?
                Math.pow(c.g, inv24) * 1.055 - 0.055 :
                c.g * 12.92,
            c.b > 0.0031308 ?
                Math.pow(c.b, inv24) * 1.055 - 0.055 :
                c.b * 12.92,
            c.alpha
        );
    }

    static toARGB1555 (c) {
        return Rgb.getAlpha1(c) << 0xf
            | Rgb.getR5(c) << 0xa
            | Rgb.getG5(c) << 0x5
            | Rgb.getB5(c);
    }

    static toRGB555 (c) {
        return Rgb.getR5(c) << 0xa
            | Rgb.getG5(c) << 0x5
            | Rgb.getB5(c);
    }

    static toRGB565 (c) {
        return Rgb.getR5(c) << 0xb
            | Rgb.getG6(c) << 0x5
            | Rgb.getB5(c);
    }

    static toRGBA32 (c) {
        return Rgb.getR8(c) << 0x18
            | Rgb.getG8(c) << 0x10
            | Rgb.getB8(c) << 0x08
            | Rgb.getAlpha8(c);
    }

    static toRGBA64 (c) {
        return Rgb.getR16(c) << 0x30
            | Rgb.getG16(c) << 0x20
            | Rgb.getB16(c) << 0x10
            | Rgb.getAlpha16(c);
    }

    static unpremul (c) {
        if (c.alpha !== 0.0) {
            return new Rgb(
                c.r * c.alpha,
                c.g * c.alpha,
                c.b * c.alpha,
                c.alpha);
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