import { MeshBasicMaterial, TubeBufferGeometry, Mesh } from 'three';
import { getSplineFromCoords } from './utils';
import { CURVE_SEGMENTS, colors } from './constants';

const TUBE_RADIUS_SEGMENTS = 2;
const DEFAULT_TUBE_RADIUS = 1;
const DRAW_RANGE_DELTA = 12;
const MAX_DRAW_RANGE = DRAW_RANGE_DELTA * CURVE_SEGMENTS;

export default class TubeAnim {
  constructor(i, coords, amount) {
    const material = new MeshBasicMaterial({
      opacity: 0.9,
      transparent: true,
      color: colors[i]
    });
    const a = 100;
    const _amount = 1200 * (Math.log(a + amount) - Math.log(a));

    const spline = getSplineFromCoords(coords, _amount).spline;
    const geometry = new TubeBufferGeometry(
      spline,
      CURVE_SEGMENTS,
      DEFAULT_TUBE_RADIUS,
      TUBE_RADIUS_SEGMENTS,
      false
    );

    this.mesh = new Mesh(geometry, material);
    this.mesh.baseColor = colors[i];

    let tick = 0;

    function loop() {
      if (tick < MAX_DRAW_RANGE) {
        geometry.setDrawRange(0, tick);
        tick += (5 % MAX_DRAW_RANGE);
        requestAnimationFrame(loop);
      }
    }
    loop();
  }
}
