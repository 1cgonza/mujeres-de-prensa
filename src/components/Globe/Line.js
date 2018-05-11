import * as THREE from 'three';
import { getLineFromCoords } from './utils';
import { CURVE_SEGMENTS, colors } from './constants';

const MAX_DRAW_RANGE = 100;
export default class GlobeLine {
  constructor(i, coords, amount) {
    // const line = getLineFromCoords(coords).line;
    // const material = new THREE.MeshBasicMaterial({
    //   opacity: 0.9,
    //   transparent: true,
    //   color: colors[i]
    // });

    // this.mesh = new THREE.Line(line, material);
    // this.mesh.baseColor = colors[i];


    const material = new THREE.MeshBasicMaterial({
      opacity: 0.9,
      transparent: true,
      color: colors[i]
    });
    const line = getLineFromCoords(coords).line;
    const geometry = new THREE.CylinderBufferGeometry(
      5,
      5,
      100,
      false
    );

    const points = new Float32Array(CURVE_SEGMENTS * 3);
    const vertices = line.getPoints(CURVE_SEGMENTS - 1);

    for (let i = 0, j = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      points[j++] = vertex.x;
      points[j++] = vertex.y;
      points[j++] = vertex.z;
    }

    // You can use setDrawRange to animate the curve
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    this.mesh = new THREE.Mesh(geometry, material);
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
