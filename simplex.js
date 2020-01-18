'use strict';

/**
 * A simplex noise class created with reference to Simplex noise demystified" by
 * Stefan Gustavson (
 * http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf ). Hashing
 * functions are based on Bob Jenkins lookup3 script (
 * http://burtleburtle.net/bob/c/lookup3.c ) . Flow implementations written with
 * reference to Simon Geilfus's implementation (
 * https://github.com/simongeilfus/SimplexNoise ) .
 *
 * @author Stefan Gustavson
 * @author Bob Jenkins
 * @author Simon Geilfus
 */
class Simplex {

  constructor () {
    Object.freeze(this);
    Object.seal(this);
  }

  /**
   * Hashes the indices i and j with the seed, then returns a
   * vector from the look up table.
   * 
   * @param {number} i the first index
   * @param {number} j the second index
   * @param {number} seed the seed
   * @returns the vector
   */
  static gradient2 (
    i = 0,
    j = 0,
    seed = Simplex.DEFAULT_SEED) {

    return Simplex.GRAD_2_LUT[
      Simplex.hash(i, j, seed) & 0x7];
  }

  /**
   * Hashes the indices i, j and k with the seed, then returns
   * a vector from the look up table.
   * 
   * @param {number} i the first index
   * @param {number} j the second index
   * @param {number} k the third index
   * @param {number} seed the seed
   * @returns the vector
   */
  static gradient3 (
    i = 0,
    j = 0,
    k = 0,
    seed = Simplex.DEFAULT_SEED) {

    return Simplex.GRAD_3_LUT[
      Simplex.hash(i, j,
        Simplex.hash(k, seed, 0)) & 0xf];
  }

  /**
   * Hashes the indices i, j, k and l with the seed, then
   * returns a vector from the look up table.
   * 
   * @param {number} i the first index
   * @param {number} j the second index
   * @param {number} k the third index
   * @param {number} l the fourth index
   * @param {number} seed the seed
   * @returns the vector
   */
  static gradient4 (
    i = 0,
    j = 0,
    k = 0,
    l = 0,
    seed = Simplex.DEFAULT_SEED) {

    return Simplex.GRAD_4_LUT[
      Simplex.hash(i, j,
        Simplex.hash(k, l, seed)) & 0x1f];
  }

  /**
   * Hashes the indices i and j with the seed, retrieves a
   * vector from the look-up table, then rotates it by the
   * sine and cosine of an angle.
   * 
   * @param {number} i the first index
   * @param {number} j the second index
   * @param {number} seed the seed
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec2} target the rotated vector
   * @returns the vector
   */
  static gradRot2 (
    i = 0,
    j = 0,
    seed = Simplex.DEFAULT_SEED,
    cosa = 1.0,
    sina = 0.0,
    target = new Vec2()) {

    return Vec2.rotateZInternal(
      Simplex.GRAD_2_LUT[
      Simplex.hash(i, j, seed) & 0x7],
      cosa, sina, target);
  }

  /**
   * Hashes the indices i, j and k with the seed. Retrieves
   * two vectors from rotation look-up tables, then multiplies
   * them against the sine and cosine of the angle.
   * 
   * @param {number} i the first index
   * @param {number} j the second index
   * @param {number} k the third index
   * @param {number} seed the seed 
   * @param {number} cosa the cosine of the angle
   * @param {number} sina the sine of the angle
   * @param {Vec3} target the rotated vecctor
   * @returns the vector
   */
  static gradRot3 (
    i = 0,
    j = 0,
    k = 0,
    seed = Simplex.DEFAULT_SEED,
    cosa = 1.0,
    sina = 0.0,
    target = new Vec3()) {

    const h = Simplex.hash(i, j, Simplex.hash(k, seed, 0)) & 0xf;

    const gu = Simplex.GRAD3_U[h];
    const gv = Simplex.GRAD3_V[h];
    return target.set(
      cosa * gu.x + sina * gv.x,
      cosa * gu.y + sina * gv.y,
      cosa * gu.z + sina * gv.z);
  }

  /**
   * A helper function to the gradient functions. Performs a
   * series of bit-shifting operations to create a hash.
   * 
   * @author Bob Jenkins
   * @param {number} a the first input
   * @param {number} b the second input
   * @param {number} c the third input
   * @returns the hash
   */
  static hash (a = 0, b = 0, c = 0) {
    c ^= b;
    c -= b << 0xe | b >> 0x20 - 0xe;
    a ^= c;
    a -= c << 0xb | c >> 0x20 - 0xb;
    b ^= a;
    b -= a << 0x19 | a >> 0x20 - 0x19;
    c ^= b;
    c -= b << 0x10 | b >> 0x20 - 0x10;
    a ^= c;
    a -= c << 0x4 | c >> 0x20 - 0x4;
    b ^= a;
    b -= a << 0xe | a >> 0x20 - 0xe;
    c ^= b;
    c -= b << 0x18 | b >> 0x20 - 0x18;
    return c;
  }

  /**
   * Evaluates 3D simplex noise for a given seed.
   * 
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @param {number} seed the seed
   * @param {Vec2} deriv the derivative
   * @returns the noise value
   */
  static eval2 (
    x = 0.0,
    y = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    const s = (x + y) * Simplex.F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);

    const t = (i + j) * Simplex.G2;
    const x0 = x - (i - t);
    const y0 = y - (j - t);

    let i1 = 0;
    let j1 = 0;
    if (x0 > y0) { i1 = 1; }
    else { j1 = 1; }

    const x1 = x0 - i1 + Simplex.G2;
    const y1 = y0 - j1 + Simplex.G2;

    const x2 = x0 - 1.0 + Simplex.G2_2;
    const y2 = y0 - 1.0 + Simplex.G2_2;

    let t20 = 0.0;
    let t21 = 0.0;
    let t22 = 0.0;

    let t40 = 0.0;
    let t41 = 0.0;
    let t42 = 0.0;

    let n0 = 0.0;
    let n1 = 0.0;
    let n2 = 0.0;

    let g0 = Simplex.ZERO_2;
    let g1 = Simplex.ZERO_2;
    let g2 = Simplex.ZERO_2;

    const t0 = 0.5 - (x0 * x0 + y0 * y0);
    if (t0 >= 0.0) {
      g0 = Simplex.gradient2(i, j, seed);
      t20 = t0 * t0;
      t40 = t20 * t20;
      n0 = g0.x * x0 + g0.y * y0;
    }

    const t1 = 0.5 - (x1 * x1 + y1 * y1);
    if (t1 >= 0.0) {
      g1 = Simplex.gradient2(i + i1, j + j1, seed);
      t21 = t1 * t1;
      t41 = t21 * t21;
      n1 = g1.x * x1 + g1.y * y1;
    }

    const t2 = 0.5 - (x2 * x2 + y2 * y2);
    if (t2 >= 0.0) {
      g2 = Simplex.gradient2(i + 1, j + 1, seed);
      t22 = t2 * t2;
      t42 = t22 * t22;
      n2 = g2.x * x2 + g2.y * y2;
    }

    if (deriv !== null) {

      const tmp0 = t20 * t0 * n0;
      deriv.x = tmp0 * x0;
      deriv.y = tmp0 * y0;

      const tmp1 = t21 * t1 * n1;
      deriv.x += tmp1 * x1;
      deriv.y += tmp1 * y1;

      const tmp2 = t22 * t2 * n2;
      deriv.x += tmp2 * x2;
      deriv.y += tmp2 * y2;

      deriv.x *= -8.0;
      deriv.y *= -8.0;

      deriv.x += t40 * g0.x + t41 * g1.x + t42 * g2.x;
      deriv.y += t40 * g0.y + t41 * g1.y + t42 * g2.y;

      deriv.x *= Simplex.SCALE_2;
      deriv.y *= Simplex.SCALE_2;
    }

    return Simplex.SCALE_2 *
      (t40 * n0 + t41 * n1 + t42 * n2);
  }

  /**
   * Evaluates 3D simplex noise for a given seed.
   * 
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @param {number} z the z coordinate
   * @param {number} seed the seed
   * @param {Vec3} deriv the derivative
   * @returns the noise value
   */
  static eval3 (
    x = 0.0,
    y = 0.0,
    z = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    const s = (x + y + z) * Simplex.F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);

    const t = (i + j + k) * Simplex.G3;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const z0 = z - (k - t);

    let i1 = 0;
    let j1 = 0;
    let k1 = 0;

    let i2 = 0;
    let j2 = 0;
    let k2 = 0;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; i2 = 1; j2 = 1;
      } else if (x0 >= z0) {
        i1 = 1; i2 = 1; k2 = 1;
      } else {
        k1 = 1; i2 = 1; k2 = 1;
      }
    } else {
      if (y0 < z0) {
        k1 = 1; j2 = 1; k2 = 1;
      } else if (x0 < z0) {
        j1 = 1; j2 = 1; k2 = 1;
      } else {
        j1 = 1; i2 = 1; j2 = 1;
      }
    }

    const x1 = x0 - i1 + Simplex.G3;
    const y1 = y0 - j1 + Simplex.G3;
    const z1 = z0 - k1 + Simplex.G3;

    const x2 = x0 - i2 + Simplex.G3_2;
    const y2 = y0 - j2 + Simplex.G3_2;
    const z2 = z0 - k2 + Simplex.G3_2;

    const x3 = x0 - 1.0 + Simplex.G3_3;
    const y3 = y0 - 1.0 + Simplex.G3_3;
    const z3 = z0 - 1.0 + Simplex.G3_3;

    let t20 = 0.0;
    let t21 = 0.0;
    let t22 = 0.0;
    let t23 = 0.0;

    let t40 = 0.0;
    let t41 = 0.0;
    let t42 = 0.0;
    let t43 = 0.0;

    let n0 = 0.0;
    let n1 = 0.0;
    let n2 = 0.0;
    let n3 = 0.0;

    let g0 = Simplex.ZERO_3;
    let g1 = Simplex.ZERO_3;
    let g2 = Simplex.ZERO_3;
    let g3 = Simplex.ZERO_3;

    const t0 = 0.5 - (x0 * x0 + y0 * y0 + z0 * z0);
    if (t0 >= 0.0) {
      g0 = Simplex.gradient3(i, j, k, seed);
      t20 = t0 * t0;
      t40 = t20 * t20;
      n0 = g0.x * x0 + g0.y * y0 + g0.z * z0;
    }

    const t1 = 0.5 - (x1 * x1 + y1 * y1 + z1 * z1);
    if (t1 >= 0.0) {
      g1 = Simplex.gradient3(i + i1, j + j1, k + k1, seed);
      t21 = t1 * t1;
      t41 = t21 * t21;
      n1 = g1.x * x1 + g1.y * y1 + g1.z * z1;
    }

    const t2 = 0.5 - (x2 * x2 + y2 * y2 + z2 * z2);
    if (t2 >= 0.0) {
      g2 = Simplex.gradient3(i + i2, j + j2, k + k2, seed);
      t22 = t2 * t2;
      t42 = t22 * t22;
      n2 = g2.x * x2 + g2.y * y2 + g2.z * z2;
    }

    const t3 = 0.5 - (x3 * x3 + y3 * y3 + z3 * z3);
    if (t3 >= 0.0) {
      g3 = Simplex.gradient3(i + 1, j + 1, k + 1, seed);
      t23 = t3 * t3;
      t43 = t23 * t23;
      n3 = g3.x * x3 + g3.y * y3 + g3.z * z3;
    }

    if (deriv !== null) {

      const tmp0 = t20 * t0 * n0;
      deriv.x = tmp0 * x0;
      deriv.y = tmp0 * y0;
      deriv.z = tmp0 * z0;

      const tmp1 = t21 * t1 * n1;
      deriv.x += tmp1 * x1;
      deriv.y += tmp1 * y1;
      deriv.z += tmp1 * z1;

      const tmp2 = t22 * t2 * n2;
      deriv.x += tmp2 * x2;
      deriv.y += tmp2 * y2;
      deriv.z += tmp2 * z2;

      const tmp3 = t23 * t3 * n3;
      deriv.x += tmp3 * x3;
      deriv.y += tmp3 * y3;
      deriv.z += tmp3 * z3;

      deriv.x *= -8.0;
      deriv.y *= -8.0;
      deriv.z *= -8.0;

      deriv.x += t40 * g0.x + t41 * g1.x + t42 * g2.x + t43 * g3.x;
      deriv.y += t40 * g0.y + t41 * g1.y + t42 * g2.y + t43 * g3.y;
      deriv.z += t40 * g0.z + t41 * g1.z + t42 * g2.z + t43 * g3.z;

      deriv.x *= Simplex.SCALE_3;
      deriv.y *= Simplex.SCALE_3;
      deriv.z *= Simplex.SCALE_3;
    }

    return Simplex.SCALE_3 *
      (t40 * n0 + t41 * n1 + t42 * n2 + t43 * n3);
  }

  /**
   * Evaluates 4D simplex noise for a given seed.
   * 
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @param {number} z the z coordinate
   * @param {number} w the w coordinate
   * @param {number} seed the seed
   * @param {Vec4} deriv the derivative
   * @returns the noise value
   */
  static eval4 (
    x = 0.0,
    y = 0.0,
    z = 0.0,
    w = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    const s = (x + y + z + w) * Simplex.F4;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const l = Math.floor(w + s);

    const t = (i + j + k + l) * Simplex.G4;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const z0 = z - (k - t);
    const w0 = w - (l - t);

    const sc = Simplex.PERMUTE[
      (x0 > y0 ? 0x20 : 0) |
      (x0 > z0 ? 0x10 : 0) |
      (y0 > z0 ? 0x8 : 0) |
      (x0 > w0 ? 0x4 : 0) |
      (y0 > w0 ? 0x2 : 0) |
      (z0 > w0 ? 0x1 : 0)];

    const sc0 = sc[0];
    const sc1 = sc[1];
    const sc2 = sc[2];
    const sc3 = sc[3];

    const i1 = sc0 >= 3 ? 1 : 0;
    const j1 = sc1 >= 3 ? 1 : 0;
    const k1 = sc2 >= 3 ? 1 : 0;
    const l1 = sc3 >= 3 ? 1 : 0;

    const i2 = sc0 >= 2 ? 1 : 0;
    const j2 = sc1 >= 2 ? 1 : 0;
    const k2 = sc2 >= 2 ? 1 : 0;
    const l2 = sc3 >= 2 ? 1 : 0;

    const i3 = sc0 >= 1 ? 1 : 0;
    const j3 = sc1 >= 1 ? 1 : 0;
    const k3 = sc2 >= 1 ? 1 : 0;
    const l3 = sc3 >= 1 ? 1 : 0;

    const x1 = x0 - i1 + Simplex.G4;
    const y1 = y0 - j1 + Simplex.G4;
    const z1 = z0 - k1 + Simplex.G4;
    const w1 = w0 - l1 + Simplex.G4;

    const x2 = x0 - i2 + Simplex.G4_2;
    const y2 = y0 - j2 + Simplex.G4_2;
    const z2 = z0 - k2 + Simplex.G4_2;
    const w2 = w0 - l2 + Simplex.G4_2;

    const x3 = x0 - i3 + Simplex.G4_3;
    const y3 = y0 - j3 + Simplex.G4_3;
    const z3 = z0 - k3 + Simplex.G4_3;
    const w3 = w0 - l3 + Simplex.G4_3;

    const x4 = x0 - 1.0 + Simplex.G4_4;
    const y4 = y0 - 1.0 + Simplex.G4_4;
    const z4 = z0 - 1.0 + Simplex.G4_4;
    const w4 = w0 - 1.0 + Simplex.G4_4;

    let n0 = 0.0;
    let n1 = 0.0;
    let n2 = 0.0;
    let n3 = 0.0;
    let n4 = 0.0;

    let t20 = 0.0;
    let t21 = 0.0;
    let t22 = 0.0;
    let t23 = 0.0;
    let t24 = 0.0;

    let t40 = 0.0;
    let t41 = 0.0;
    let t42 = 0.0;
    let t43 = 0.0;
    let t44 = 0.0;

    let g0 = Simplex.ZERO_4;
    let g1 = Simplex.ZERO_4;
    let g2 = Simplex.ZERO_4;
    let g3 = Simplex.ZERO_4;
    let g4 = Simplex.ZERO_4;

    const t0 = 0.5 - (x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
    if (t0 >= 0.0) {
      t20 = t0 * t0;
      t40 = t20 * t20;
      g0 = Simplex.gradient4(i, j, k, l, seed);
      n0 = g0.x * x0 + g0.y * y0 + g0.z * z0 + g0.w * w0;
    }

    const t1 = 0.5 - (x1 * x1 + y1 * y1 + z1 * z1 + w1 * w1);
    if (t1 >= 0.0) {
      t21 = t1 * t1;
      t41 = t21 * t21;
      g1 = Simplex.gradient4(i + i1, j + j1, k + k1, l + l1, seed);
      n1 = g1.x * x1 + g1.y * y1 + g1.z * z1 + g1.w * w1;
    }

    const t2 = 0.5 - (x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2);
    if (t2 >= 0.0) {
      t22 = t2 * t2;
      t42 = t22 * t22;
      g2 = Simplex.gradient4(i + i2, j + j2, k + k2, l + l2, seed);
      n2 = g2.x * x2 + g2.y * y2 + g2.z * z2 + g2.w * w2;
    }

    const t3 = 0.5 - (x3 * x3 + y3 * y3 + z3 * z3 + w3 * w3);
    if (t3 >= 0.0) {
      t23 = t3 * t3;
      t43 = t23 * t23;
      g3 = Simplex.gradient4(i + i3, j + j3, k + k3, l + l3, seed);
      n3 = g3.x * x3 + g3.y * y3 + g3.z * z3 + g3.w * w3;
    }

    const t4 = 0.5 - (x4 * x4 + y4 * y4 + z4 * z4 + w4 * w4);
    if (t4 >= 0.0) {
      t24 = t4 * t4;
      t44 = t24 * t24;
      g4 = Simplex.gradient4(i + 1, j + 1, k + 1, l + 1, seed);
      n4 = g4.x * x4 + g4.y * y4 + g4.z * z4 + g4.w * w4;
    }

    if (deriv !== null) {

      const tmp0 = t20 * t0 * n0;
      deriv.x = tmp0 * x0;
      deriv.y = tmp0 * y0;
      deriv.z = tmp0 * z0;
      deriv.w = tmp0 * w0;

      const tmp1 = t21 * t1 * n1;
      deriv.x += tmp1 * x1;
      deriv.y += tmp1 * y1;
      deriv.z += tmp1 * z1;
      deriv.w += tmp1 * w1;

      const tmp2 = t22 * t2 * n2;
      deriv.x += tmp2 * x2;
      deriv.y += tmp2 * y2;
      deriv.z += tmp2 * z2;
      deriv.w += tmp2 * w2;

      const tmp3 = t23 * t3 * n3;
      deriv.x += tmp3 * x3;
      deriv.y += tmp3 * y3;
      deriv.z += tmp3 * z3;
      deriv.w += tmp3 * w3;

      const tmp4 = t24 * t4 * n4;
      deriv.x += tmp4 * x4;
      deriv.y += tmp4 * y4;
      deriv.z += tmp4 * z4;
      deriv.w += tmp4 * w4;

      deriv.x *= -8.0;
      deriv.y *= -8.0;
      deriv.z *= -8.0;
      deriv.w *= -8.0;

      deriv.x += t40 * g0.x + t41 * g1.x + t42 * g2.x + t43 * g3.x
        + t44 * g4.x;
      deriv.y += t40 * g0.y + t41 * g1.y + t42 * g2.y + t43 * g3.y
        + t44 * g4.y;
      deriv.z += t40 * g0.z + t41 * g1.z + t42 * g2.z + t43 * g3.z
        + t44 * g4.z;
      deriv.w += t40 * g0.w + t41 * g1.w + t42 * g2.w + t43 * g3.w
        + t44 * g4.w;

      deriv.x *= Simplex.SCALE_4;
      deriv.y *= Simplex.SCALE_4;
      deriv.z *= Simplex.SCALE_4;
      deriv.w *= Simplex.SCALE_4;
    }

    return Simplex.SCALE_4 *
      (t40 * n0 +
        t41 * n1 +
        t42 * n2 +
        t43 * n3 +
        t44 * n4);
  }

  /**
   * Fractal Brownian Motion. For a given number of octaves,
   * sums the output value of a noise function. Per each
   * iteration, the output is multiplied by the amplitude;
   * amplitude is multiplied by gain; frequency is multiplied
   * by lacunarity.
   * 
   * @param {Vec2} v the input coordinate
   * @param {number} seed the seed
   * @param {number} octaves the number of iterations
   * @param {number} lacunarity the lacunarity
   * @param {number} gain the gain
   * @param {Vec2} deriv the derivative
   * @param {Vec2} vin a temporary vector
   * @param {Vec2} nxy a temporary vector
   * @returns the value
   */
  static fbm2 (
    v = new Vec2(),
    seed = Simplex.DEFAULT_SEED,
    octaves = 4,
    lacunarity = 2.0,
    gain = 0.5,
    deriv = new Vec2(),
    vin = new Vec2(),
    nxy = new Vec2()) {

    let freq = 1.0;
    let amp = 0.5;
    let sum = 0.0;
    deriv.reset();

    for (let i = 0; i < octaves; ++i) {
      Vec2.scale(v, freq, vin);
      sum += Simplex.eval2(
        vin.x, vin.y,
        seed, nxy) * amp;
      Vec2.scale(nxy, amp, nxy);
      Vec2.add(deriv, nxy, deriv);
      freq *= lacunarity;
      amp *= gain;
    }

    return sum;
  }

  /**
   * Fractal Brownian Motion. For a given number of octaves,
   * sums the output value of a noise function. Per each
   * iteration, the output is multiplied by the amplitude;
   * amplitude is multiplied by gain; frequency is multiplied
   * by lacunarity.
   * 
   * @param {Vec3} v the input coordinate
   * @param {number} seed the seed
   * @param {number} octaves the number of iterations
   * @param {number} lacunarity the lacunarity
   * @param {number} gain the gain
   * @param {Vec3} deriv the derivative
   * @param {Vec3} vin a temporary vector
   * @param {Vec3} nxyz a temporary vector
   * @returns the value
   */
  static fbm3 (
    v = new Vec3(),
    seed = Simplex.DEFAULT_SEED,
    octaves = 4,
    lacunarity = 2.0,
    gain = 0.5,
    deriv = new Vec3(),
    vin = new Vec3(),
    nxyz = new Vec3()) {

    let freq = 1.0;
    let amp = 0.5;
    let sum = 0.0;
    deriv.reset();

    for (let i = 0; i < octaves; ++i) {
      Vec3.scale(v, freq, vin);
      sum += Simplex.eval3(
        vin.x, vin.y, vin.z,
        seed, nxyz) * amp;
      Vec3.scale(nxyz, amp, nxyz);
      Vec3.add(deriv, nxyz, deriv);
      freq *= lacunarity;
      amp *= gain;
    }

    return sum;
  }

  /**
   * Fractal Brownian Motion. For a given number of octaves,
   * sums the output value of a noise function. Per each
   * iteration, the output is multiplied by the amplitude;
   * amplitude is multiplied by gain; frequency is multiplied
   * by lacunarity.
   * 
   * @param {Vec4} v the input coordinate
   * @param {number} seed the seed
   * @param {number} octaves the number of iterations
   * @param {number} lacunarity the lacunarity
   * @param {number} gain the gain
   * @param {Vec4} deriv the derivative
   * @param {Vec4} vin a temporary vector
   * @param {Vec4} nxyzw a temporary vector
   * @returns the value
   */
  static fbm4 (
    v = new Vec4(),
    seed = Simplex.DEFAULT_SEED,
    octaves = 4,
    lacunarity = 2.0,
    gain = 0.5,
    deriv = new Vec4(),
    vin = new Vec4(),
    nxyzw = new Vec4()) {

    let freq = 1.0;
    let amp = 0.5;
    let sum = 0.0;
    deriv.reset();

    for (let i = 0; i < octaves; ++i) {
      Vec4.scale(v, freq, vin);
      sum += Simplex.eval4(
        vin.x, vin.y, vin.z, vin.w,
        seed, nxyzw) * amp;
      Vec4.scale(nxyzw, amp, nxyzw);
      Vec4.add(deriv, nxyzw, deriv);
      freq *= lacunarity;
      amp *= gain;
    }

    return sum;
  }

  static flow2 (
    x = 0.0,
    y = 0.0,
    radians = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    return Simplex.flow2Internal(
      x, y,
      Math.cos(radians),
      Math.sin(radians),
      seed,
      deriv);
  }

  static flow2Internal (
    x = 0.0,
    y = 0.0,
    cosa = 1.0,
    sina = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    const s = (x + y) * Simplex.F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);

    const t = (i + j) * Simplex.G2;
    const x0 = x - (i - t);
    const y0 = y - (j - t);

    let i1 = 0;
    let j1 = 0;
    if (x0 > y0) { i1 = 1; }
    else { j1 = 1; }

    const x1 = x0 - i1 + Simplex.G2;
    const y1 = y0 - j1 + Simplex.G2;

    const x2 = x0 - 1.0 + Simplex.G2_2;
    const y2 = y0 - 1.0 + Simplex.G2_2;

    let t20 = 0.0;
    let t21 = 0.0;
    let t22 = 0.0;

    let t40 = 0.0;
    let t41 = 0.0;
    let t42 = 0.0;

    let n0 = 0.0;
    let n1 = 0.0;
    let n2 = 0.0;

    let g0 = Simplex.ZERO_2;
    let g1 = Simplex.ZERO_2;
    let g2 = Simplex.ZERO_2;

    const t0 = 0.5 - (x0 * x0 + y0 * y0);
    if (t0 >= 0.0) {
      g0 = Simplex.gradRot2(
        i, j, seed,
        cosa, sina,
        Simplex.ROT_2);
      t20 = t0 * t0;
      t40 = t20 * t20;
      n0 = g0.x * x0 + g0.y * y0;
    }

    const t1 = 0.5 - (x1 * x1 + y1 * y1);
    if (t1 >= 0.0) {
      g1 = Simplex.gradRot2(
        i + i1, j + j1, seed,
        cosa, sina,
        Simplex.ROT_2);
      t21 = t1 * t1;
      t41 = t21 * t21;
      n1 = g1.x * x1 + g1.y * y1;
    }

    const t2 = 0.5 - (x2 * x2 + y2 * y2);
    if (t2 >= 0.0) {
      g2 = Simplex.gradRot2(
        i + 1, j + 1, seed,
        cosa, sina,
        Simplex.ROT_2);
      t22 = t2 * t2;
      t42 = t22 * t22;
      n2 = g2.x * x2 + g2.y * y2;
    }

    if (deriv !== null) {

      const tmp0 = t20 * t0 * n0;
      deriv.x = tmp0 * x0;
      deriv.y = tmp0 * y0;

      const tmp1 = t21 * t1 * n1;
      deriv.x += tmp1 * x1;
      deriv.y += tmp1 * y1;

      const tmp2 = t22 * t2 * n2;
      deriv.x += tmp2 * x2;
      deriv.y += tmp2 * y2;

      deriv.x *= -8.0;
      deriv.y *= -8.0;

      deriv.x += t40 * g0.x + t41 * g1.x + t42 * g2.x;
      deriv.y += t40 * g0.y + t41 * g1.y + t42 * g2.y;

      deriv.x *= Simplex.SCALE_2;
      deriv.y *= Simplex.SCALE_2;
    }

    return Simplex.SCALE_2 *
      (t40 * n0 + t41 * n1 + t42 * n2);
  }

  static flow3 (
    x = 0.0,
    y = 0.0,
    z = 0.0,
    radians = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    return Simplex.flow3Internal(
      x, y, z,
      Math.cos(radians),
      Math.sin(radians),
      seed,
      deriv);
  }

  static flow3Internal (
    x = 0.0,
    y = 0.0,
    z = 0.0,
    cosa = 1.0,
    sina = 0.0,
    seed = Simplex.DEFAULT_SEED,
    deriv = null) {

    const s = (x + y + z) * Simplex.F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);

    const t = (i + j + k) * Simplex.G3;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const z0 = z - (k - t);

    let i1 = 0;
    let j1 = 0;
    let k1 = 0;

    let i2 = 0;
    let j2 = 0;
    let k2 = 0;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; i2 = 1; j2 = 1;
      } else if (x0 >= z0) {
        i1 = 1; i2 = 1; k2 = 1;
      } else {
        k1 = 1; i2 = 1; k2 = 1;
      }
    } else {
      if (y0 < z0) {
        k1 = 1; j2 = 1; k2 = 1;
      } else if (x0 < z0) {
        j1 = 1; j2 = 1; k2 = 1;
      } else {
        j1 = 1; i2 = 1; j2 = 1;
      }
    }

    const x1 = x0 - i1 + Simplex.G3;
    const y1 = y0 - j1 + Simplex.G3;
    const z1 = z0 - k1 + Simplex.G3;

    const x2 = x0 - i2 + Simplex.G3_2;
    const y2 = y0 - j2 + Simplex.G3_2;
    const z2 = z0 - k2 + Simplex.G3_2;

    const x3 = x0 - 1.0 + Simplex.G3_3;
    const y3 = y0 - 1.0 + Simplex.G3_3;
    const z3 = z0 - 1.0 + Simplex.G3_3;

    let t20 = 0.0;
    let t21 = 0.0;
    let t22 = 0.0;
    let t23 = 0.0;

    let t40 = 0.0;
    let t41 = 0.0;
    let t42 = 0.0;
    let t43 = 0.0;

    let n0 = 0.0;
    let n1 = 0.0;
    let n2 = 0.0;
    let n3 = 0.0;

    let g0 = Simplex.ZERO_3;
    let g1 = Simplex.ZERO_3;
    let g2 = Simplex.ZERO_3;
    let g3 = Simplex.ZERO_3;

    const t0 = 0.5 - (x0 * x0 + y0 * y0 + z0 * z0);
    if (t0 >= 0.0) {
      g0 = Simplex.gradRot3(
        i, j, k, seed,
        cosa, sina,
        Simplex.ROT_3);
      t20 = t0 * t0;
      t40 = t20 * t20;
      n0 = g0.x * x0 + g0.y * y0 + g0.z * z0;
    }

    const t1 = 0.5 - (x1 * x1 + y1 * y1 + z1 * z1);
    if (t1 >= 0.0) {
      g1 = Simplex.gradRot3(
        i + i1, j + j1, k + k1, seed,
        cosa, sina,
        Simplex.ROT_3);
      t21 = t1 * t1;
      t41 = t21 * t21;
      n1 = g1.x * x1 + g1.y * y1 + g1.z * z1;
    }

    const t2 = 0.5 - (x2 * x2 + y2 * y2 + z2 * z2);
    if (t2 >= 0.0) {
      g2 = Simplex.gradRot3(
        i + i2, j + j2, k + k2, seed,
        cosa, sina,
        Simplex.ROT_3);
      t22 = t2 * t2;
      t42 = t22 * t22;
      n2 = g2.x * x2 + g2.y * y2 + g2.z * z2;
    }

    const t3 = 0.5 - (x3 * x3 + y3 * y3 + z3 * z3);
    if (t3 >= 0.0) {
      g3 = Simplex.gradRot3(
        i + 1, j + 1, k + 1, seed,
        cosa, sina,
        Simplex.ROT_3);
      t23 = t3 * t3;
      t43 = t23 * t23;
      n3 = g3.x * x3 + g3.y * y3 + g3.z * z3;
    }

    if (deriv !== null) {

      const tmp0 = t20 * t0 * n0;
      deriv.x = tmp0 * x0;
      deriv.y = tmp0 * y0;
      deriv.z = tmp0 * z0;

      const tmp1 = t21 * t1 * n1;
      deriv.x += tmp1 * x1;
      deriv.y += tmp1 * y1;
      deriv.z += tmp1 * z1;

      const tmp2 = t22 * t2 * n2;
      deriv.x += tmp2 * x2;
      deriv.y += tmp2 * y2;
      deriv.z += tmp2 * z2;

      const tmp3 = t23 * t3 * n3;
      deriv.x += tmp3 * x3;
      deriv.y += tmp3 * y3;
      deriv.z += tmp3 * z3;

      deriv.x *= -8.0;
      deriv.y *= -8.0;
      deriv.z *= -8.0;

      deriv.x += t40 * g0.x + t41 * g1.x + t42 * g2.x + t43 * g3.x;
      deriv.y += t40 * g0.y + t41 * g1.y + t42 * g2.y + t43 * g3.y;
      deriv.z += t40 * g0.z + t41 * g1.z + t42 * g2.z + t43 * g3.z;

      deriv.x *= Simplex.SCALE_3;
      deriv.y *= Simplex.SCALE_3;
      deriv.z *= Simplex.SCALE_3;
    }

    return Simplex.SCALE_3 *
      (t40 * n0 +
        t41 * n1 +
        t42 * n2 +
        t43 * n3);
  }

  /**
   * Returns an output with the same number of dimensions as the input, 2. This
   * is done by calling eval2 twice, with offset steps added to each component
   * of the input vector. The derivatives are calculated for output vectors if
   * the arguments are not null.
   *
   * @param {Vec2} v the input vector
   * @param {number} seed the seed
   * @param {Vec2} target the output vector
   * @param {Vec2} xDeriv the derivative for the x evaluation
   * @param {Vec2} yDeriv the derivative for the y evaluation
   * @returns the noise vector
   */
  static noise2 (
    v = new Vec2(),
    seed = Simplex.DEFAULT_SEED,
    target = new Vec2(),
    xDeriv = null,
    yDeriv = null) {

    const st = Vec2.mag(v) * Simplex.STEP_2;
    const x = v.x;
    const y = v.y;

    return target.setComponents(
      Simplex.eval2(x + st, y, seed, xDeriv),
      Simplex.eval2(x, y + st, seed, yDeriv));
  }

  /**
   * Returns an output with the same number of dimensions as the input, 3. This
   * is done by calling eval3 thrice, with offset steps added to each component
   * of the input vector. The derivatives are calculated for output vectors if
   * the arguments are not null.
   *
   * @param {Vec3} v the input vector
   * @param {number} seed the seed
   * @param {Vec3} target the output vector
   * @param {Vec3} xDeriv the derivative for the x evaluation
   * @param {Vec3} yDeriv the derivative for the y evaluation
   * @param {Vec3} zDeriv the derivative for the z evaluation
   * @returns the noise vector
   */
  static noise3 (
    v = new Vec3(),
    seed = Simplex.DEFAULT_SEED,
    target = new Vec3(),
    xDeriv = null,
    yDeriv = null,
    zDeriv = null) {

    const st = Vec3.mag(v) * Simplex.STEP_3;
    const x = v.x;
    const y = v.y;
    const z = v.z;

    return target.setComponents(
      Simplex.eval3(x + st, y, z, seed, xDeriv),
      Simplex.eval3(x, y + st, z, seed, yDeriv),
      Simplex.eval3(x, y, z + st, seed, zDeriv));
  }

  /**
   * Returns an output with the same number of dimensions as the input, 4. This
   * is done by calling eval4 four times, with offset steps added to each
   * component of the input vector. The derivatives are calculated for output
   * vectors if the arguments are not null.
   *
   * @param {Vec4} v the input vector
   * @param {number} seed the seed
   * @param {Vec4} target the output vector
   * @param {Vec4} xDeriv the derivative for the x evaluation
   * @param {Vec4} yDeriv the derivative for the y evaluation
   * @param {Vec4} zDeriv the derivative for the z evaluation
   * @param {Vec4} wDeriv the derivative for the w evaluation
   * @returns the noise vector
   */
  static noise4 (
    v = new Vec4(),
    seed = Simplex.DEFAULT_SEED,
    target = new Vec4(),
    xDeriv = null,
    yDeriv = null,
    zDeriv = null,
    wDeriv = null) {

    const st = Vec4.mag(v) * Simplex.STEP_4;
    const x = v.x;
    const y = v.y;
    const z = v.z;
    const w = v.w;

    return target.setComponents(
      Simplex.eval4(x + st, y, z, w, seed, xDeriv),
      Simplex.eval4(x, y + st, z, w, seed, yDeriv),
      Simplex.eval4(x, y, z + st, w, seed, zDeriv),
      Simplex.eval4(x, y, z, w + st, seed, wDeriv));
  }
}

/**
 * A default seed set to Date.now .
 */
Simplex.DEFAULT_SEED = Object.freeze(Date.now());

/**
 * Squish constant 2D (Math.sqrt(3.0) - 1.0) / 2.0;
 * approximately 0.36602542 .
 */
Simplex.F2 = Object.freeze(0.3660254037844386);

/**
 * Squish constant 3D (Math.sqrt(4.0) - 1.0) / 3.0;
 * approximately 0.33333333 .
 */
Simplex.F3 = Object.freeze(0.3333333333333333);

/**
 * Squish constant 4D (Math.sqrt(5.0) - 1.0) / 4.0;
 * approximately 0.309017 .
 */
Simplex.F4 = Object.freeze(0.30901699437494745);

/**
 * Stretch constant 2D (1.0 / Math.sqrt(3.0) - 1.0) /
 * 2.0d; approximately 0.21132487 .
 */
Simplex.G2 = Object.freeze(0.21132486540518708);

/**
 * 2x stretch constant 2D. Approximately 0.42264974 .
 */
Simplex.G2_2 = Object.freeze(0.42264973081037416);

/**
 * Stretch constant 3D. Approximately 0.16666667 .
 */
Simplex.G3 = Object.freeze(0.16666666666666667);

/**
 * 2x stretch constant 3D. Approximately 0.33333333 .
 */
Simplex.G3_2 = Object.freeze(0.33333333333333333);

/**
 * 3x stretch constant 3D. 0.5 .
 */
Simplex.G3_3 = Object.freeze(0.5);

/**
 * Stretch constant 4D (1.0 / Math.sqrt(5.0) - 1.0) /
 * 4.0 ; approximately 0.1381966 .
 */
Simplex.G4 = Object.freeze(0.13819660112501053);

/**
 * 2x stretch constant 4D. Approximately 0.2763932 .
 */
Simplex.G4_2 = Object.freeze(0.27639320225002106);

/**
 * 3x stretch constant 4D. Approximately 0.4145898 .
 */
Simplex.G4_3 = Object.freeze(0.41458980337503159);

/**
 * 4x stretch constant 4D. Approximately 0.5527864 .
 */
Simplex.G4_4 = Object.freeze(0.55278640450004212);

/**
 * sqrt(2.0) / Math.sqrt(3.0) Used by rotation look up
 * tables. Approximately 0.8164966 .
 */
Simplex.RT2_RT3 = Object.freeze(0.816496580927726);

/**
 * Factor by which 2D noise is scaled prior to return.
 */
Simplex.SCALE_2 = Object.freeze(64.0);

/**
 * Factor by which 3D noise is scaled prior to return.
 */
Simplex.SCALE_3 = Object.freeze(68.0);

/**
 * Factor by which 4D noise is scaled prior to return.
 */
Simplex.SCALE_4 = Object.freeze(54.0);

/**
 * Factor added to 2D noise when returning a Vec2. 1.0 /
 * Math.sqrt(2.0); approximately 0.70710677 .
 */
Simplex.STEP_2 = Object.freeze(0.7071067811865475);

/**
 * Factor added to 3D noise when returning a Vec3. 1.0 /
 * Math.sqrt(3.0); approximately 0.57735026 .
 */
Simplex.STEP_3 = Object.freeze(0.5773502691896258);

/**
 * Factor added to 4D noise when returning a Vec4. 1.0 /
 * Math.sqrt(4.0); 0.5 .
 */
Simplex.STEP_4 = Object.freeze(0.5);

/**
 * 2D simplex gradient look-up table.
 */
Simplex.GRAD_2_LUT = Object.freeze([
  Object.freeze(new Vec2(-1.0, -1.0)),
  Object.freeze(new Vec2(1.0, 0.0)),
  Object.freeze(new Vec2(-1.0, 0.0)),
  Object.freeze(new Vec2(1.0, 1.0)),
  Object.freeze(new Vec2(-1.0, 1.0)),
  Object.freeze(new Vec2(0.0, -1.0)),
  Object.freeze(new Vec2(0.0, 1.0)),
  Object.freeze(new Vec2(1.0, -1.0))]);

/**
* 3D simplex gradient look-up table.
*/
Simplex.GRAD_3_LUT = Object.freeze([
  Object.freeze(new Vec3(1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(0.0, 1.0, 1.0)),
  Object.freeze(new Vec3(-1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(0.0, -1.0, 1.0)),
  Object.freeze(new Vec3(1.0, 0.0, -1.0)),
  Object.freeze(new Vec3(0.0, 1.0, -1.0)),
  Object.freeze(new Vec3(-1.0, 0.0, -1.0)),
  Object.freeze(new Vec3(0.0, -1.0, -1.0)),
  Object.freeze(new Vec3(1.0, -1.0, 0.0)),
  Object.freeze(new Vec3(1.0, 1.0, 0.0)),
  Object.freeze(new Vec3(-1.0, 1.0, 0.0)),
  Object.freeze(new Vec3(-1.0, -1.0, 0.0)),
  Object.freeze(new Vec3(1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(-1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(0.0, 1.0, -1.0)),
  Object.freeze(new Vec3(0.0, -1.0, -1.0))]);

/**
* 4D simplex gradient look-up table.
*/
Simplex.GRAD_4_LUT = Object.freeze([
  Object.freeze(new Vec4(0.0, 1.0, 1.0, 1.0)),
  Object.freeze(new Vec4(0.0, 1.0, 1.0, -1.0)),
  Object.freeze(new Vec4(0.0, 1.0, -1.0, 1.0)),
  Object.freeze(new Vec4(0.0, 1.0, -1.0, -1.0)),
  Object.freeze(new Vec4(0.0, -1.0, 1.0, 1.0)),
  Object.freeze(new Vec4(0.0, -1.0, 1.0, -1.0)),
  Object.freeze(new Vec4(0.0, -1.0, -1.0, 1.0)),
  Object.freeze(new Vec4(0.0, -1.0, -1.0, -1.0)),
  Object.freeze(new Vec4(1.0, 0.0, 1.0, 1.0)),
  Object.freeze(new Vec4(1.0, 0.0, 1.0, -1.0)),
  Object.freeze(new Vec4(1.0, 0.0, -1.0, 1.0)),
  Object.freeze(new Vec4(1.0, 0.0, -1.0, -1.0)),
  Object.freeze(new Vec4(-1.0, 0.0, 1.0, 1.0)),
  Object.freeze(new Vec4(-1.0, 0.0, 1.0, -1.0)),
  Object.freeze(new Vec4(-1.0, 0.0, -1.0, 1.0)),
  Object.freeze(new Vec4(-1.0, 0.0, -1.0, -1.0)),
  Object.freeze(new Vec4(1.0, 1.0, 0.0, 1.0)),
  Object.freeze(new Vec4(1.0, 1.0, 0.0, -1.0)),
  Object.freeze(new Vec4(1.0, -1.0, 0.0, 1.0)),
  Object.freeze(new Vec4(1.0, -1.0, 0.0, -1.0)),
  Object.freeze(new Vec4(-1.0, 1.0, 0.0, 1.0)),
  Object.freeze(new Vec4(-1.0, 1.0, 0.0, -1.0)),
  Object.freeze(new Vec4(-1.0, -1.0, 0.0, 1.0)),
  Object.freeze(new Vec4(-1.0, -1.0, 0.0, -1.0)),
  Object.freeze(new Vec4(1.0, 1.0, 1.0, 0.0)),
  Object.freeze(new Vec4(1.0, 1.0, -1.0, 0.0)),
  Object.freeze(new Vec4(1.0, -1.0, 1.0, 0.0)),
  Object.freeze(new Vec4(1.0, -1.0, -1.0, 0.0)),
  Object.freeze(new Vec4(-1.0, 1.0, 1.0, 0.0)),
  Object.freeze(new Vec4(-1.0, 1.0, -1.0, 0.0)),
  Object.freeze(new Vec4(-1.0, -1.0, 1.0, 0.0)),
  Object.freeze(new Vec4(-1.0, -1.0, -1.0, 0.0))]);

/**
* Table for 3D rotations, u. Multiplied by the cosine of an
* angle in 3D gradient rotations.
*/
Simplex.GRAD3_U = Object.freeze([
  Object.freeze(new Vec3(1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(0.0, 1.0, 1.0)),
  Object.freeze(new Vec3(-1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(0.0, -1.0, 1.0)),
  Object.freeze(new Vec3(1.0, 0.0, -1.0)),
  Object.freeze(new Vec3(0.0, 1.0, -1.0)),
  Object.freeze(new Vec3(-1.0, 0.0, -1.0)),
  Object.freeze(new Vec3(0.0, -1.0, -1.0)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, -Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, -Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, -Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, -Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, Simplex.RT2_RT3, -Simplex.RT2_RT3))]);

/**
* Table for 3D rotations, v. Multiplied by the sine of an
* angle in 3D gradient rotations.
*/
Simplex.GRAD3_V = Object.freeze([
  Object.freeze(new Vec3(-Simplex.RT2_RT3, Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, -Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, -Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, Simplex.RT2_RT3, Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, -Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, -Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(Simplex.RT2_RT3, Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(-Simplex.RT2_RT3, Simplex.RT2_RT3, -Simplex.RT2_RT3)),
  Object.freeze(new Vec3(1.0, -1.0, 0.0)),
  Object.freeze(new Vec3(1.0, 1.0, 0.0)),
  Object.freeze(new Vec3(-1.0, 1.0, 0.0)),
  Object.freeze(new Vec3(-1.0, -1.0, 0.0)),
  Object.freeze(new Vec3(1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(-1.0, 0.0, 1.0)),
  Object.freeze(new Vec3(0.0, 1.0, -1.0)),
  Object.freeze(new Vec3(0.0, -1.0, -1.0))]);

/**
* Permutation table for 4D noise.
*/
Simplex.PERMUTE = Object.freeze([
  Object.freeze([0, 1, 2, 3]),
  Object.freeze([0, 1, 3, 2]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 2, 3, 1]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([1, 2, 3, 0]),
  Object.freeze([0, 2, 1, 3]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 3, 1, 2]),
  Object.freeze([0, 3, 2, 1]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([1, 3, 2, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([1, 2, 0, 3]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([1, 3, 0, 2]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([2, 3, 0, 1]),
  Object.freeze([2, 3, 1, 0]),
  Object.freeze([1, 0, 2, 3]),
  Object.freeze([1, 0, 3, 2]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([2, 0, 3, 1]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([2, 1, 3, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([2, 0, 1, 3]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([3, 0, 1, 2]),
  Object.freeze([3, 0, 2, 1]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([3, 1, 2, 0]),
  Object.freeze([2, 1, 0, 3]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([3, 1, 0, 2]),
  Object.freeze([0, 0, 0, 0]),
  Object.freeze([3, 2, 0, 1]),
  Object.freeze([3, 2, 1, 0])]);

/**
* Temporary vector used by gradRot2.
*/
Simplex.ROT_2 = new Vec2();

/**
 * Temproary vector used by gradRot3.
 */
Simplex.ROT_3 = new Vec3();

/**
* Initial state to which a 2D noise contribution is set.
* Prevents compiler complaint that variables may not have
* been initialized.
*/
Simplex.ZERO_2 = Object.freeze(Vec2.zero());

/**
 * Initial state to which a 3D noise contribution is set.
 * Prevents compiler complaint that variables may not have
 * been initialized.
 */
Simplex.ZERO_3 = Object.freeze(Vec3.zero());

/**
 * Initial state to which a 4D noise contribution is set.
 * Prevents compiler complaint that variables may not have
 * been initialized.
 */
Simplex.ZERO_4 = Object.freeze(Vec4.zero());