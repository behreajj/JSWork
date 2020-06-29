'use strict';

let shp;

function preload () {
  // shp = loadModel('triangle.obj');
}

function setup () {
  createCanvas(400, 400);
}

function draw () {
  background('#fff7d5');
}

class Grad {
  constructor(...keys) {
    this._keys = [];
    const len = keys.length;
    for(let i = 0; i < len; ++i) {
      this.insertKey(keys[i]);
    }
  }

  bisectLeft (step = 0.5) {

    let low = 0;
    let high = this._keys.length;

    while (low < high) {
      const middle = (low + high) / 2 | 0;
      if (step > this._keys[middle].step) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }

    return low;
  }

  bisectRight (step = 0.5) {

    let low = 0;
    let high = this._keys.length;

    while (low < high) {
      const middle = (low + high) / 2 | 0;
      if (step < this._keys[middle].step) {
        high = middle;
      } else {
        low = middle + 1;
      }
    }

    return low;
  }

  containsKey (key = new ColorKey(0.5)) {

    return this._keys.findIndex((x) =>
      Math.abs(x.step - key.step) < 0.0005);
  }

  findGe (query = 0.5) {

    const i = this.bisectLeft(query);
    if (i < this._keys.length) {
      return this._keys[i];
    }
    return null;
  }

  findLe (query = 0.5) {

    const i = this.bisectRight(query);
    if (i > 0) {
      return this._keys[i - 1];
    }
    return null;
  }

  getFirst () {

    return this._keys[0];
  }

  getLast () {

    return this._keys[this._keys.length - 1];
  }

  insertKey (key = new ColorKey()) {

    const query = this.containsKey(key);
    if (query !== -1) {
      this._keys.splice(query, 1, key);
    } else {
      this.insortRight(key);
    }

    return this;
  }

  insortRight (key = new ColorKey()) {

    const i = this.bisectRight(key.step);
    this._keys.splice(i, 0, key);
    return this;
  }
}

// function orientedCylinder (
//   origin,
//   dest,
//   sectors = 32,
//   includeCaps = true,
//   radius = 0.25) {

//   const model = new p5.Geometry();
//   model.gid = "orientedCylinder|false";

//   /*
//    * Seems like p5.Geometry requires data arrays of a uniform length. This will
//    * lead to a seam, where coordinates overlap each other, on the prime meridian.
//    * This is to accomodate UV coordinates, where u === 0.0 and u === 1.0 share the
//    * same coordinate, but refer to a different point in a texture.
//    */
//   const vs = model.vertices;
//   const vts = model.uvs;
//   const vns = model.vertexNormals;
//   const fs = model.faces;

//   /* Validate arguments. */
//   const sec = sectors < 3 ? 3 : sectors;
//   const rad = radius < Number.EPSILON ? Number.EPSILON : radius;

//   /* Find the difference between destination and origin. */
//   const diff = p5.Vector.sub(dest, origin);

//   /* If the difference's length, or magnitude, is zero, then the input arguments are invalid. */
//   const diffMag = p5.Vector.dot(diff, diff);
//   if (diffMag === 0.0) {
//     diff.set(Number.EPSILON, Number.EPSILON, Number.EPSILON);
//   }

//   /* Normalize diff to get forward axis. */
//   const k = p5.Vector.mult(diff, 1.0 / Math.sqrt(diffMag));

//   /* Assume the world's up direction is (0.0, 0.0, 1.0). */
//   const ref = new p5.Vector(0.0, 0.0, 1.0);

//   /* Find the cross product of forward and up to get the right axis. */
//   let i = p5.Vector.cross(ref, k);

//   /*
//    * If all components of the right axis are approximately zero,
//    * then forward and up are parallel axes.
//    */
//   if (Math.abs(i.x) < Number.EPSILON &&
//     Math.abs(i.y) < Number.EPSILON &&
//     Math.abs(i.z) < Number.EPSILON) {

//     /* Change assumption: world up is now (0.0, 1.0, 0.0). */
//     ref.set(0.0, 1.0, 0.0);

//     /* Recalculate the cross product for the right axis. */
//     i = p5.Vector.cross(ref, k);
//   }

//   /* Normalize right. */
//   i.normalize();

//   /* Cross forward and right to get up axis. */
//   const j = p5.Vector.cross(k, i);

//   /* Normalize up. */
//   j.normalize();

//   /*
//    * With no caps, there are 2 triangles per each side. With caps included,
//    * there are 2 triangle fans plus 2 triangles per side .
//    */
//   const sec1 = sec + 1;
//   const len = includeCaps ? sec1 * 4 : sec1 * 2;

//   /* Load arrays. */
//   for (let i = 0; i < len; ++i) {
//     vs.push(new p5.Vector());
//     vts.push(new p5.Vector());
//     vns.push(new p5.Vector());
//   }

//   const toU = 1.0 / sec;
//   const toTheta = (Math.PI * 2.0) / sec;
//   for (let i = 0, j = sec1, k = sec1 * 2, m = sec1 * 3;
//     i < sec1; ++i, ++j, ++k, ++m) {

//     const theta = i * toTheta;
//     const cosa = Math.cos(theta);
//     const sina = Math.sin(theta);
//     const u = i * toU;

//     /*
//      * Equivalent to multiplying the circle by the look-at matrix formed by the
//      * axes. Since the 2D circle's z component is 0, don't worry about
//      * multiplying by the forward axis.
//      *
//      * It should not be necessary to normalize the normal.
//      */
//     const vn0 = vns[i];
//     const vn1 = vns[j];

//     vn0.set(
//       i.x * cosa + j.x * sina,
//       i.y * cosa + j.y * sina,
//       i.z * cosa + j.z * sina);
//     vn1.set(vn0.x, vn0.y, vn0.z);

//     /* 
//      * Set coordinates at either end of the cylinder by multiplying both
//      * by the radius, then adding the origin or destination.
//      */
//     const v0 = vs[i];
//     const v1 = vs[j];

//     v0.set(
//       vn.x * rad + origin.x,
//       vn.y * rad + origin.y,
//       vn.z * rad + origin.z);

//     v1.set(
//       vn.x * rad + dest.x,
//       vn.y * rad + dest.y,
//       vn.z * rad + dest.z);

//     /* Set UV coordinates. */
//     const vt0 = vts[i];
//     const vt1 = vts[j];

//     vt0.set(u, 1.0, 0.0);
//     vt1.set(u, 0.0, 0.0);

//     if (includeCaps) {

//       const v2 = vs[k];
//       const v3 = vs[m];

//       v2.set(v0.x, v0.y, v0.z);
//       v3.set(v1.x, v1.y, v1.z);

//       const vt2 = vts[k];
//       const vt3 = vts[m];

//       vt2.set(
//         cosa * 0.5 + 0.5,
//         sina * 0.5 + 0.5,
//         0.0);
//       vt3.set(vt2.x, vt2.y, 0.0);

//       const vn2 = vns[k];
//       const vn3 = vns[m];

//       vn2.set(-k.x, -k.y, -k.z);
//       vn3.set(-k.x, -k.y, -k.z);
//     }
//   }

//   // Looks like everything has to be of uniform length...
//   // vs.push(createVector(0.5, 0.0));
//   // vs.push(createVector(-0.25, 0.4330127));
//   // vs.push(createVector(-0.25, -0.4330127));

//   // vts.push(createVector(1.0, 0.5));
//   // vts.push(createVector(0.25, 0.066987306));
//   // vts.push(createVector(0.25, 0.9330127));

//   // vns.push(createVector(0.0, 0.0, 1.0));

//   // es.push([0, 1]);
//   // es.push([1, 2]);
//   // es.push([2, 0]);

//   // fs.push([0, 1, 2]);

//   return model;
// }

// 'use strict';

// let grd;

// let turnedOn = false;

// const abstrleft = Vec2.negOne();
// const abstrright = Vec2.one();

// const left = Vec2.zero();
// const right = Vec2.one();

// const gradient = Gradient.paletteMagma();

// function setup () {
//   createCanvas(windowWidth, windowHeight);
//   noStroke();
//   rectMode(CENTER);
//   ellipseMode(CENTER);

//   grd = Vec2.grid(64, 64, abstrleft, abstrright);
//   Vec2.zero(left);
//   Vec2.fromScalar(min(width, height), right);
// }

// function draw () {
//   background('#202020');

//   if (turnedOn) {

//     const trv = Vec2.zero();
//     const z = (mouseY / (height - 1.0)) * 2.0 - 1.0;
//     const w = (mouseX / (width - 1.0)) * 2.0 - 1.0;
//     const len = grd.length;
//     // const v3 = new Vec3();
//     // const nv = Vec3.zero();
//     const v4 = new Vec4();
//     const nv = Vec4.zero();
//     const clr = new Color(0.2, 0.2, 0.2, 1.0);
//     let scl = 9.5;

//     for (let i = 0; i < len; ++i) {
//       let row = grd[i];
//       const rlen = row.length;
//       for (let j = 0; j < rlen; ++j) {
//         const v = row[j];

//         Vec2.map(v, abstrleft, abstrright, left, right, trv);
//         // v3.setComponents(v.x, v.y, w);
//         v4.setComponents(v.x, v.y, z, w);

//         // const nfac = Simplex.fbm3(v3, Simplex.DEFAULT_SEED,
//         //   8, 2.0, 0.5, nv);

//         // const nfac = Simplex.eval4(v3.x, v3.y, v3.z, w, Simplex.DEFAULT_SEED, nv);

//         const nfac = Simplex.noise4(v4, Simplex.DEFAULT_SEED, nv);
//         const nfac01 = nfac * 0.5 + 0.5;

//         const torrad = Utils.lerp(0.375, 0.75, nfac01);
//         const fac = Sdf.torus(Vec3.promote2(v), torrad, 0.2);
//         scl = Utils.map(fac, -0.7071, 0.7071, 15.0, 0.01);
//         gradient.eval(nfac01, Color.lerpRgba, clr);

//         fill(Color.toHexWeb(clr));
//         rect(trv.x, trv.y, scl, scl);
//         // ellipse(trv.x, trv.y, scl, scl);
//       }
//     }
//   }
// }

// function mouseReleased () {

//   turnedOn = !turnedOn;
// }

// function windowResized () {

//   resizeCanvas(windowWidth, windowHeight);
// }