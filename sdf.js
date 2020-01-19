'use strict';

/**
 * Facilitates implicit shapes created with signed distance fields. Adapted from
 * the GLSL of Inigo Quilez:
 * https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm ,
 * https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm .
 *
 * @author Inigo Quilez
 */
class Sdf {

  constructor () {
    Object.freeze(this);
    Object.seal(this);
  }

  /**
   * Draws a two dimensional box whose dimensions are described by the bounds.
   *
   * @param {Vec2} point the point
   * @param {Vec2} bounds the bounds
   * @param {number} rounding the rounding
   * @returns the signed distance
   */
  static box2 (
    point = new Vec2(),
    bounds = new Vec2(0.5, 0.5),
    rounding = 0.0) {

    const qx = Math.abs(point.x) - bounds.x;
    const qy = Math.abs(point.y) - bounds.y;

    return Math.hypot(
      Math.max(qx, 0.0),
      Math.max(qy, 0.0)) +
      Math.min(Math.max(qx, qy), 0.0) -
      rounding;
  }

  /**
   * Draws a three dimensional box whose dimensions are described by the bounds.
   *
   * @param {Vec3} point the point
   * @param {Vec3} bounds the bounds
   * @param {number} rounding the rounding
   * @returns the signed distance
   */
  static box3 (
    point = new Vec3(),
    bounds = new Vec3(0.5, 0.5, 0.5),
    rounding = 0.0) {

    const qx = Math.abs(point.x) - bounds.x;
    const qy = Math.abs(point.y) - bounds.y;
    const qz = Math.abs(point.z) - bounds.z;

    return Math.hypot(
      Math.max(qx, 0.0),
      Math.max(qy, 0.0),
      Math.max(qz, 0.0)) +
      Math.min(Math.max(qx, qy, qz), 0.0) -
      rounding;
  }

  /**
   * Draws a circle.
   * 
   * @param {Vec2} point the point
   * @param {number} bounds the bounds
   * @returns the signed distance
   */
  static circle (
    point = new Vec2(),
    bounds = 0.5) {

    return Vec2.mag(point) - bounds;
  }

  /**
   * Draws a conic gradient.
   *
   * @param {Vec2} point the point
   * @param {number} radians the angular offset
   * @returns the factor
   */
  static conic (
    point = new Vec2(),
    radians = 0.0) {

    const ang = (Vec2.headingSigned(point) - radians) *
      0.15915494309189535;
    return ang - Math.floor(ang);
  }

  /**
   * Draws a hexagon.
   * 
   * @param {Vec2} point the point
   * @param {Vec2} bounds the bounds
   */
  static hexagon (
    point = new Vec2(),
    bounds = new Vec2(0.5, 0.5)) {

    const px0 = Math.abs(point.x);
    const py0 = Math.abs(point.y);
    const dotkp2 = 2.0 * Math.min(0.0,
      -Utils.SQRT_3_2 * px0 + Utils.ONE_SQRT_3 * py0);
    const px1 = px0 + dotkp2 * Utils.SQRT_3_2;
    const limit = 0.5 * bounds;
    const py2 = py0 - dotkp2 * Utils.ONE_SQRT_3 - bounds;
    return Utils.copySign(Math.hypot(
      px1 - Utils.clamp(px1, -limit, limit), py2), py2);
  }

  /**
   * Finds the intersection between two shapes as represented by factors.
   *
   * @param {number} a the left factor
   * @param {number} b the right factor
   * @returns the intersection
   */
  static intersect (a = 0.0, b = 0.0) {

    return Math.max(a, b);
  }

  /**
   * Finds the rounded intersection between two shapes as represented by
   * factors.
   *
   * @param {number} a the left factor
   * @param {number} b the right factor
   * @param {number} radius the radius
   * @returns the intersection
   */
  static intersectRound (a = 0.0, b = 0.0, radius = 0.0) {

    return Math.hypot(Math.max(0.0, a + radius),
      Math.max(0.0, b + radius))
      + Math.min(Math.max(a, b), -radius);
  }

  /**
   * Draws a line from the origin to the destination, where the distance field
   * is characterized by a third point's distance from the line.
   *
   *     @param {Vec2} point the point
   *     @param {Vec2} origin the origin
   *     @param {Vec2} dest the destination
   *     @param {number} rounding the rounding factor
   *     @returns the signed distance
   */
  static line2 (
    point = new Vec2(),
    origin = new Vec2(-0.5, -0.5),
    dest = new Vec2(0.5, 0.5),
    rounding = 0.0) {

    const bax = dest.x - origin.x;
    const bay = dest.y - origin.y;

    /* dot(ba, ba) */
    const baba = bax * bax + bay * bay;

    /* Numerator: p - a */
    const pax = point.x - origin.x;
    const pay = point.y - origin.y;

    if (baba === 0.0) {
      return Math.hypot(pax, pay);
    }

    /* dot(pa, ba) */
    const paba = pax * bax + pay * bay;

    /* Clamped scalar projection */
    const h = Math.min(Math.max(paba / baba, 0.0), 1.0);
    return Math.hypot(
      pax - h * bax,
      pay - h * bay) - rounding;
  }

  /**
   * Draws a line from the origin to the destination, where the distance field
   * is characterized by a third point's distance from the line.
   *
   *     @param {Vec3} point the point
   *     @param {Vec3} origin the origin
   *     @param {Vec3} dest the destination
   *     @param {number} rounding the rounding factor
   *     @returns the signed distance
   */
  static line3 (
    point = new Vec3(),
    origin = new Vec3(-0.5, -0.5, -0.5),
    dest = new Vec3(0.5, 0.5, 0.5),
    rounding = 0.0) {

    const bax = dest.x - origin.x;
    const bay = dest.y - origin.y;
    const baz = dest.z - origin.z;

    /* dot(ba, ba) */
    const baba = bax * bax + bay * bay + baz * baz;

    /* Numerator: p - a */
    const pax = point.x - origin.x;
    const pay = point.y - origin.y;
    const paz = point.z - origin.z;

    if (baba === 0.0) {
      return Math.hypot(pax, pay, paz);
    }

    /* dot(pa, ba) */
    const paba = pax * bax + pay * bay + paz * baz;

    /* Clamped scalar projection */
    const h = Math.min(Math.max(paba / baba, 0.0), 1.0);
    return Math.hypot(
      pax - h * bax,
      pay - h * bay,
      paz - h * baz) - rounding;
  }

  /**
   * Draws a polygon from a series of vertices. The number of vertices is
   * assumed to be greater than three. With reference to
   * https://www.shadertoy.com/view/wdBXRW .
   *
   * @param {Vec2} point the point
   * @param {Vec2[]} vertices the array of vertices
   * @param {number} rounding the rounding
   */
  static polygon (
    point = new Vec2(),
    vertices = [
      new Vec2(-0.5, -0.5),
      new Vec2(0.5, -0.5),
      new Vec2(0.5, 0.5),
      new Vec2(-0.5, 0.5)],
    rounding = 0.0) {

    const len = vertices.length;
    if (len < 3) {
      return -rounding;
    }

    let curr = vertices[0];
    let prev = vertices[len - 1];
    let d = Number.MAX_VALUE;
    let s = 1.0;

    for (let i = 0; i < len; ++i) {
      curr = vertices[i];

      const ex = prev.x - curr.x;
      const ey = prev.y - curr.y;

      const wx = point.x - curr.x;
      const wy = point.y - curr.y;

      const num = wx * ex + wy * ey;
      const denom = ex * ex + ey * ey;

      const dotp = (denom === 0.0) ? 0.0 :
        Math.min(Math.max(num / denom, 0.0), 1.0);
      const bx = wx - ex * dotp;
      const by = wy - ey * dotp;

      d = Math.min(d, bx * bx + by * by);

      const cx = point.y >= curr.y;
      const cy = point.y < prev.y;
      const cz = ex * wy > ey * wx;

      if (cx && cy && cz || !cx && !cy && !cz) {
        s = -s;
      }

      prev = curr;
    }

    return s * Math.sqrt(d) - rounding;
  }

  /**
   * Draws a ring.
   *
   * @param {Vec2} point the point
   * @param {number} radius the radius
   * @param {number} thickness the thickness
   * @returns the signed distance
   */
  static ring (
    point = new Vec2(),
    radius = 0.5,
    thickness = 0.125) {

    const n = Vec2.mag(point) - radius;
    return Math.sqrt(n * n) - thickness;
  }

  /**
   * Draws a sphere.
   * 
   * @param {Vec3} point the point
   * @param {number} bounds the bounds
   * @returns the signed distance
   */
  static sphere (
    point = new Vec3(),
    bounds = 0.5) {

    return Vec3.mag(point) - bounds;
  }

  /**
   * Finds the subtraction of two shapes as represented by factors.
   * 
   * @param {number} a the left factor
   * @param {number} b the right factor
   * @param the subtraction
   */
  static subtract (a = 0.0, b = 0.0) {

    return Math.max(-a, b);
  }

  /**
   * Finds the rounded subtraction of two shapes as
   * represented by factors.
   * 
   * @param {number} a the left factor
   * @param {number} b the right factor
   * @param {number} radius the radius
   * @param the subtraction
   */
  static subtractRound (a = 0.0, b = 0.0, radius = 0.0) {

    return Sdf.intersectRound(a, -b, radius);
  }

  /**
   * Draws a torus, or donut. The annulus faces toward the z axis.
   *
   * @param {Vec3} point the point
   * @param {number} radius the radius
   * @param {number} thickness the thickness
   * @returns the signed distance
   */
  static torus (
    point = new Vec3(),
    radius = 0.5,
    thickness = 0.125) {

    return Math.hypot(
      Math.hypot(point.x, point.y) - radius,
      point.z) - thickness;
  }

  /**
   * Finds the union of two shapes as represented by factors.
   *
   * @param {number} a the left factor
   * @param {number} b the right factor
   * @returns the union
   */
  static union (a = 0.0, b = 0.0) {

    return Math.min(a, b);
  }

  /**
   * Finds the rounded union of two shapes as represented by factors.
   *
   * @param {number} a the left factor
   * @param {number} b the right factor
   * @param {number} radius the radius
   * @returns the union
   */
  static unionRound (a = 0.0, b = 0.0, radius = 0.0) {

    return Math.max(Math.min(a, b), radius) -
      Math.hypot(
        Math.min(0.0, a - radius),
        Math.min(0.0, b - radius));
  }
}