import { MeshBasicMaterial, Line } from 'three';
import { getLineFromCoords } from './utils';
import { CURVE_SEGMENTS, colors } from './constants';

const TUBE_RADIUS_SEGMENTS = 2;
const DEFAULT_TUBE_RADIUS = 2;
const DRAW_RANGE_DELTA = 16;
const MAX_DRAW_RANGE = DRAW_RANGE_DELTA * CURVE_SEGMENTS;

export default class GlobeLine {
  constructor(i, coords, amount) {
    const line = getLineFromCoords(coords).line;
    const material = new MeshBasicMaterial({
      opacity: 0.9,
      transparent: true,
      color: colors[i]
    });

    this.mesh = new Line(line, material);
    this.mesh.baseColor = colors[i];
  }
}
