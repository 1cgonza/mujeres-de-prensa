import * as THREE from 'three';
import { getSplineFromCoords } from './utils';
import { CURVE_SEGMENTS } from './constants';

const TUBE_RADIUS_SEGMENTS = 2;
const DEFAULT_TUBE_RADIUS = 2;
const DRAW_RANGE_DELTA = 16;
const MAX_DRAW_RANGE = DRAW_RANGE_DELTA * CURVE_SEGMENTS;

const colors = [
  0x38acc6, // Blue
  0xd79f2e, // Mustard
  0x7a3b6e, // Purple
  0xc2401f, // Red
  0xfa8613, // Orange
  0x40ad81, // Green
];

export default class TubeAnim {
  constructor(i, coords, amount) {
    const material = new THREE.MeshBasicMaterial({
      opacity: 0.9,
      transparent: true,
      color: colors[i]
    });
    const spline = getSplineFromCoords(coords).spline;
    const geometry = new THREE.TubeBufferGeometry(
      spline,
      CURVE_SEGMENTS,
      DEFAULT_TUBE_RADIUS,
      TUBE_RADIUS_SEGMENTS,
      false
    );

    geometry.setDrawRange(0, MAX_DRAW_RANGE);

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.baseColor = colors[i];
  }
}
