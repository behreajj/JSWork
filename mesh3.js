'use strict';

class Mesh3 {

  constructor (
    name = 'Mesh3',
    faces,
    coords,
    texCoords,
    normals) {

    /** 
     * The mesh's name. 
     */
    this._name = name;

    /**
     * The faces array does not include face data itself, but rather
     * indices to other arrays which contain vertex data. It is a
     * three-dimensional array organized by
     *
     * - the number of faces;
     * - the number of vertices per faces;
     * - the information per vertex.
     */
    this._faces = faces;

    /**
     * An array of coordinates in the mesh.
     */
    this._coords = coords;

    /**
     * An array of normals to indicate how light will bounce off the mesh's
     * surface.
     */
    this._normals = normals;

    /**
     * The texture (UV) coordinates that describe how an image is mapped onto
     * the geometry of the mesh. Typically in the range [0.0, 1.0].
     */
    this._texCoords = texCoords;
  }

  get coords () {

    return this._coords;
  }

  get faces () {

    return this._faces;
  }

  get name () {

    return this._name;
  }

  get normals () {

    return this._normals;
  }

  get texCoords () {

    return this._texCoords;
  }

  get [Symbol.toStringTag] () {

    return this.constructor.name;
  }

  set coords (v) {

    this._coords = v;
  }

  set faces (v) {

    this._faces = v;
  }

  set name (v) {

    this._name = v;
  }

  set normals (v) {

    this._normals = v;
  }

  set texCoords (v) {

    this._texCoords = v;
  }

  [Symbol.toPrimitive] (hint) {

    switch (hint) {
      case 'string':
      default:
        return this.toString();
    }
  }

  getFace (
    i = 0,
    target = new Face3()) {

    const face = this._faces[i];
    const len = face.length;
    const vertices = [];

    for (let j = 0; j < len; ++j) {

      const vert = face[j];
      const v = this._coords[vert[0]];
      const vt = this._texCoords[vert[1]];
      const vn = this._normals[vert[2]];
      vertex = new Vert3(v, vt, vn);
      vertices.push(vertex);
    }

    target.vertices = vertices;
    return target;
  }

  /**
   * Returns a string representation of this mesh.
   *
   * @param {number} precision number of decimal places
   * @returns the string
   */
  toString (precision = 4) {

    const result = [
      '{ name: \"',
      this._name,
      '\", coords: [ '];

    const vs = this._coords;
    const len0 = vs.length;
    const last0 = len0 - 1;
    for (let i = 0; i < len0; ++i) {
      result.push(vs[i].toString(precision));
      if (i < last0) {
        result.push(', ');
      }
    }
    result.push(' ], texCoords: [ ');

    const vts = this._texCoords;
    const len1 = vts.length;
    const last1 = len1 - 1;
    for (let i = 0; i < len1; ++i) {
      result.push(vts[i].toString(precision));
      if (i < last1) {
        result.push(', ');
      }
    }
    result.push(' ], normals: [ ');

    const vns = this._normals;
    const len2 = vns.length;
    const last2 = len2 - 1;
    for (let i = 0; i < len2; ++i) {
      result.push(vns[i].toString(precision));
      if (i < last2) {
        result.push(', ');
      }
    }
    result.push(' ], faces: [ ');

    const fs = this._faces;
    const len3 = fs.length;
    const last3 = len3 - 1;
    for (let i = 0; i < len3; ++i) {
      const face = fs[i];
      const len4 = face.length;
      const last4 = len4 - 1;
      result.push('[ ');

      for (let j = 0; j < len4; ++j) {
        const vert = face[j];
        const len5 = vert.length;
        const last5 = len5 - 1;
        result.push('[ ');

        for (let k = 0; k < len5; ++k) {
          const idx = vert[k];
          result.push(idx);
          if (k < last5) {
            result.push(', ');
          }
        }
        result.push(' ]');
        if (j < last4) {
          result.push(', ');
        }
      }
      result.push(' ]');
      if (i < last3) {
        result.push(', ');
      }
    }

    result.push(' ] }');
    return result.join('');
  }

  static cylinder (
    name = 'Cylinder',
    origin = new Vec3(),
    dest = new Vec3(),
    sectors = 32,
    includeCaps = true,
    radius = 0.25,
    target = new Mesh3(
      'Cylinder', [], [], [], [])) {

    const x0 = dest.x - origin.x;
    const y0 = dest.y - origin.y;
    const z0 = dest.z - origin.z;
    const m0 = x0 * x0 + y0 * y0 + z0 * z0;

    if (m0 === 0.0) { return target; }

    target.name = name;

    const sec = sectors < 3 ? 3 : sectors;
    const rad = radius < Number.EPSILON ? Number.EPSILON : radius;

    const mInv0 = 1.0 / Math.sqrt(m0);
    const kx = x0 * mInv0;
    const ky = y0 * mInv0;
    const kz = z0 * mInv0;

    let refx = 0.0;
    let refy = 0.0;
    let refz = 1.0;

    let x1 = refy * kz - refz * ky;
    let y1 = refz * kx - refx * kz;
    let z1 = refx * ky - refy * kx;

    if (x1 !== 0.0 && y1 !== 0.0 && z1 !== 0.0) {
      refx = 0.0;
      refy = 1.0;
      refz = 0.0;

      x1 = refy * kz - refz * ky;
      y1 = refz * kx - refx * kz;
      z1 = refx * ky - refy * kx;
    }

    const m1 = x1 * x1 + y1 * y1 + z1 * z1;
    const mInv1 = 1.0 / Math.sqrt(m1);
    const ix = x1 * mInv1;
    const iy = y1 * mInv1;
    const iz = z1 * mInv1;

    const x2 = iy * kz - iz * ky;
    const y2 = iz * kx - ix * kz;
    const z2 = ix * ky - iy * kx;

    const m2 = x2 * x2 + y2 * y2 + z2 * z2;
    const mInv2 = 1.0 / Math.sqrt(m2);
    const jx = x2 * mInv2;
    const jy = y2 * mInv2;
    const jz = z2 * mInv2;

    const sec1 = sec + 1;
    const vLen = sec + sec;
    const vtLen = sec1 + sec1;

    if (includeCaps) {
      Mesh3.resizeVec3(target.coords, vLen + 2);
      Mesh3.resizeVec2(target.texCoords, vtLen + sec1);
      Mesh3.resizeVec3(target.normals, sec + 2);
      Mesh3.resizeIndices(target.faces, vLen + vLen);
    } else {
      Mesh3.resizeVec3(target.coords, vLen);
      Mesh3.resizeVec2(target.texCoords, vtLen);
      Mesh3.resizeVec3(target.normals, sec);
      Mesh3.resizeIndices(target.faces, vLen);
    }

    const toU = 1.0 / sec;
    for (let i = 0, j = sec1; i < sec1; ++i, ++j) {
      const u = 1.0 - i * toU;
      target.texCoords[i].set(u, 1.0);
      target.texCoords[j].set(u, 0.0);
    }

    const toTheta = 6.283185307179586 / sec;
    for (let i = 0, j = sec; i < sec; ++i, ++j) {
      const theta = i * toTheta;
      const cosa = Math.cos(theta);
      const sina = Math.sin(theta);

      const vn = target.normals[i].setComponents(
        ix * cosa + jx * sina,
        iy * cosa + jy * sina,
        iz * cosa + jz * sina);

      const v0 = Vec3.scale(vn, rad, target.coords[i]);
      Vec3.add(v0, origin, v0);

      const v1 = Vec3.scale(vn, rad, target.coords[j]);
      Vec3.add(v1, dest, v1);

      const triangle0 = target.faces[i];
      const vert00 = triangle0[0];
      const vert01 = triangle0[1];
      const vert02 = triangle0[2];

      const triangle1 = target.faces[j];
      const vert10 = triangle1[0];
      const vert11 = triangle1[1];
      const vert12 = triangle1[2];

      const n0 = (i + 1) % sec;
      const n1 = sec + n0;
      const st0 = sec1 + i;
      const st1 = st0 + 1;

      vert00[0] = i;
      vert00[1] = i;
      vert00[2] = i;

      vert01[0] = j;
      vert01[1] = st0;
      vert01[2] = i;

      vert02[0] = n1;
      vert02[1] = st1;
      vert02[2] = n0;

      vert10[0] = n1;
      vert10[1] = st1;
      vert10[2] = n0;

      vert11[0] = n0;
      vert11[1] = i + 1;
      vert11[2] = n0;

      vert12[0] = i;
      vert12[1] = i;
      vert12[2] = i;

      if (includeCaps) {
        target.texCoords[vtLen + i].setComponents(
          cosa * 0.5 + 0.5,
          sina * 0.5 + 0.5);
      }
    }

    if (includeCaps) {
      const len1 = vLen + 1;
      const vtCenterIdx = target.texCoords.length - 1;

      Vec3.fromSource(origin, target.coords[vLen]);
      Vec3.fromSource(dest, target.coords[len1]);
      
      Vec2.uvCenter(target.texCoords[vtCenterIdx]);
      
      target.normals[sec].setComponents(-kx, -ky, -kz);
      target.normals[sec1].setComponents(-kx, -ky, -kz);
    }

    return target;
  }

  /**
   * Creates a plane subdivided into  quadrilaterals. Useful for meshes which
   * later will be augmented by noise or height maps to simulate terrain.
   *
   * @param {string} name the mesh's name
   * @param {number} cols columns
   * @param {number} rows rows
   * @param {Mesh3} target the output mesh
   * @returns the plane
   */
  static plane (
    name = 'Plane',
    cols = 3,
    rows = 3,
    target = new Mesh3(
      'Plane', [], [], [], [])) {

    target.name = name;
    const rval = rows < 1 ? 1 : rows;
    const cval = cols < 1 ? 1 : cols;
    const rval1 = rval + 1;
    const cval1 = cval + 1;
    const iToStep = 1.0 / rval;
    const jToStep = 1.0 / cval;
    const flen = rval * cval;
    const dlen = rval1 * cval1;

    Mesh3.resizeVec3(target.coords, dlen);
    Mesh3.resizeVec2(target.texCoords, dlen);
    Mesh3.resizeVec3(target.normals, 1);
    Mesh3.resizeIndices(target.faces, flen);

    Vec3.up(target.normals[0]);

    const xs = [];
    const us = [];
    for (let j = 0; j < cval1; ++j) {
      const xPrc = j * jToStep;
      xs.push(xPrc - 0.5);
      us.push(xPrc);
    }

    for (let k = 0, i = 0; i < rval1; ++i) {
      const yPrc = i * iToStep;
      const y = yPrc - 0.5;
      const v = 1.0 - yPrc;

      for (let j = 0; j < cval1; ++j, ++k) {
        target.coords[k].setComponents(
          xs[j], y, 0.0);
        target.texCoords[k].setComponents(
          us[j], v);
      }
    }

    for (let k = 0, i = 0; i < rval; ++i) {
      const noff0 = i * cval1;
      const noff1 = (i + 1) * cval1;
      for (let j = 0; j < cval; ++j, ++k) {
        const n00 = noff0 + j;
        const n10 = n00 + 1;
        const n01 = noff1 + j;
        const n11 = n01 + 1;

        target.faces[k] = [
          [n00, n00, 0],
          [n10, n10, 0],
          [n11, n11, 0],
          [n01, n01, 0]];
      }
    }

    return target;
  }

  /**
   * Creates a regular convex polygon.
   * 
   * @param {string} name the mesh's name
   * @param {number} sectors number of sectors
   * @param {Mesh3} target the output mesh
   */
  static polygon (
    name = 'Polygon',
    sectors = 3,
    target = new Mesh3(
      'Polygon', [], [], [], [])) {

    target.name = name;
    const seg = sectors < 3 ? 3 : sectors;
    const newLen = seg + 1;
    const toTheta = 6.283185307179586 / seg;

    Mesh3.resizeVec3(target.coords, newLen);
    Mesh3.resizeVec2(target.texCoords, newLen);
    Mesh3.resizeVec3(target.normals, 1);
    Mesh3.resizeIndices(target.faces, seg);

    Vec3.zero(target.coords[0]);
    Vec2.uvCenter(target.texCoords[0]);
    Vec3.up(target.normals[0]);

    for (let i = 0, j = 1; i < seg; ++i, ++j) {
      const theta = i * toTheta;
      const v = target.coords[j];
      v.setComponents(
        0.5 * Math.cos(theta),
        0.5 * Math.sin(theta),
        0.0);

      const vt = target.texCoords[j];
      vt.setComponents(
        v.x + 0.5,
        0.5 - v.y);

      const k = 1 + j % seg;
      const vert0 = [0, 0];
      const vert1 = [j, j];
      const vert2 = [k, k];
      target.faces[i] = [
        vert0, vert1, vert2];
    }

    return target;
  }

  static resizeIndices (arr, newSize) {
    while (newSize > arr.length) {
      arr.push([]);
    }
    arr.length = newSize;
    return arr;
  }

  static resizeVec2 (arr, newSize) {
    while (newSize > arr.length) {
      arr.push(new Vec2());
    }
    arr.length = newSize;
    return arr;
  }

  static resizeVec3 (arr, newSize) {
    while (newSize > arr.length) {
      arr.push(new Vec3());
    }
    arr.length = newSize;
    return arr;
  }

  /**
   * Creates a square. Useful when representing an image with a mesh entity.
   *
   * @param {string} name the mesh's name
   * @param {number} size the square size
   * @param {Mesh3} target the output mesh
   */
  static square (
    name = 'Square',
    size = 0.35355339059327373,
    target = new Mesh3(
      'Square', [], [], [], [])) {

    target.name = name;

    const vsz = Math.max(0.000001, size);

    Mesh3.resizeVec3(target.coords, 4);
    Mesh3.resizeVec2(target.texCoords, 4);
    Mesh3.resizeVec3(target.normals, 1);
    Mesh3.resizeIndices(target.faces, 2);

    target.coords[0].setComponents(-vsz, -vsz, 0.0);
    target.coords[1].setComponents(vsz, -vsz, 0.0);
    target.coords[2].setComponents(vsz, vsz, 0.0);
    target.coords[3].setComponents(-vsz, vsz, 0.0);

    target.texCoords[0].setComponents(0.0, 1.0);
    target.texCoords[1].setComponents(1.0, 1.0);
    target.texCoords[2].setComponents(1.0, 0.0);
    target.texCoords[3].setComponents(0.0, 0.0);

    Vec3.up(target.normals[0]);

    target.faces[0] = [[0, 0, 0], [1, 1, 0], [2, 2, 0]];
    target.faces[1] = [[2, 2, 0], [3, 3, 0], [0, 0, 0]];

    return target;
  }

  /**
   * Creates a triangle. A shorthand for calling polygon with three sides.
   *
   * @param {string} name the mesh's name
   * @param {Mesh3} target the output mesh
   * @returns the triangle
   */
  static triangle (
    name = 'Triangle',
    target = new Mesh3(
      'Triangle', [], [], [], [])) {

    /* 
     * Math.cos(Math.PI / 6.0) / 2.0
     * 0.43301270189221935
     */

    target.name = name;

    Mesh3.resizeVec3(target.coords, 3);
    Mesh3.resizeVec2(target.texCoords, 3);
    Mesh3.resizeVec3(target.normals, 1);
    Mesh3.resizeIndices(target.faces, 1);

    target.coords[0].setComponents(0.5, 0.0, 0.0);
    target.coords[1].setComponents(-0.25, 0.4330127, 0.0);
    target.coords[2].setComponents(-0.25, -0.4330127, 0.0);

    target.texCoords[0].setComponents(0.5, 1.0);
    target.texCoords[1].setComponents(0.25, 0.066987306);
    target.texCoords[2].setComponents(0.25, 0.9330127);

    Vec3.up(target.normals[0]);

    target.faces[0] = [[0, 0, 0], [1, 1, 0], [2, 2, 0]];

    return target;
  }
}