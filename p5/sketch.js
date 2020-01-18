'use strict';

let grd;

let turnedOn = false;

const abstrleft = Vec2.negOne();
const abstrright = Vec2.one();

const left = Vec2.zero();
const right = Vec2.one();

const gradient = Gradient.paletteMagma();

function setup () {
  // createCanvas(720, 405);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  ellipseMode(CENTER);

  grd = Vec2.grid(64, 64, abstrleft, abstrright);
  Vec2.zero(left);
  Vec2.fromScalar(min(width, height), right);
}

function draw () {
  background('#202020');

  if (turnedOn) {

    const trv = Vec2.zero();
    const w = frameCount * 0.05;
    const len = grd.length;
    const v3 = new Vec3();
    const nv = Vec3.zero();
    const clr = new Color(0.2, 0.2, 0.2, 1.0);
    let scl = 9.5;

    for (let i = 0; i < len; ++i) {
      let row = grd[i];
      const rlen = row.length;
      for (let j = 0; j < rlen; ++j) {
        const v = row[j];

        Vec2.map(v, abstrleft, abstrright, left, right, trv);
        v3.setComponents(v.x, v.y, w);

        const nfac = Simplex.fbm3(v3, Simplex.DEFAULT_SEED,
          8, 2.0, 0.5, nv);
        const nfac01 = nfac * 0.5 + 0.5;

        const torrad = Utils.lerp(0.2, 0.7, nfac01);
        const fac = Sdf.torus3(Vec3.promote2(v), torrad, 0.02);
        scl = Utils.map(fac, -0.7071, 0.7071, 15.0, 0.01);
        gradient.eval(nfac01, Color.lerpRgba, clr);
        fill(Color.toHexWeb(clr));
        // rect(trv.x, trv.y, scl, scl);
        ellipse(trv.x, trv.y, scl, scl);
      }
    }
  }
}

function mouseReleased () {
  turnedOn = !turnedOn;
}

function windowResized () {

  resizeCanvas(windowWidth, windowHeight);
}