'use strict';

class Mesh3 {

  constructor (
    faces,
    coords,
    texCoords,
    normals) {

    this._faces = faces;
    this._coords = coords;
    this._normals = normals;
    this._texCoords = texCoords;
  }

  getFace (
    i = 0,
    target = new Face3()) {

    const face = this._faces[i];
    const len = face.length;
    const vertices = [];

    for (let j = 0; j < len; ++j) {

      const vert = face[j];
      vertices.push(
        new Vert3(
          this._coords[vert[0]],
          this._texCoords[vert[1]],
          this._normals[vert[2]]));
    }

    target.vertices = vertices;
    return target;
  }

  getFaces () {

    const len0 = this._faces.length;
    const result = [];
  }
}