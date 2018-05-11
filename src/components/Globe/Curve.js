import * as THREE from 'three';
import { getSplineFromCoords } from './utils';
import { CURVE_SEGMENTS } from './constants';
import { MeshLine, MeshLineMaterial } from './THREE.MeshLine';
//import { MeshLine, MeshLineMaterial } from './MeshLine';

const colors = [
  0x38acc6, // Blue
  0xd79f2e, // Mustard
  0x7a3b6e, // Purple
  0xc2401f, // Red
  0xfa8613, // Orange
  0x40ad81, // Green
];

export default class Curve {
  constructor(i, coords, amount, camera) {
    // amount = amount < 15 ? 15 : amount;
    // const {spline} = getSplineFromCoords(coords);
    // const points = new Float32Array(CURVE_SEGMENTS * 3);
    // const vertices = spline.getPoints(CURVE_SEGMENTS - 1);
    // let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // for (let i = 0, j = 0; i < vertices.length; i++) {
    //   const vertex = vertices[i];
    //   points[j++] = vertex.x;
    //   points[j++] = vertex.y;
    //   points[j++] = vertex.z;
    // }

    // var line = new MeshLine();
    // line.setGeometry(points, point => 1.2 - point);
    // let material = new MeshLineMaterial(
    //   this.materialOptions(new THREE.Color(colors[i]), amount, resolution, camera)
    // );

    // this.mesh = new THREE.Mesh(line.geometry, material);
    // this.mesh.baseColor = colors[i];

    const material = new THREE.MeshBasicMaterial({
      opacity: 0.9,
      transparent: true,
      color: colors[i],
    });

    let geometry = new THREE.BufferGeometry();
    const {spline} = getSplineFromCoords(coords);
    const points = new Float32Array(CURVE_SEGMENTS * 3);
    const vertices = spline.getPoints(CURVE_SEGMENTS - 1);

    for (let i = 0, j = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      points[j++] = vertex.x;
      points[j++] = vertex.y;
      points[j++] = vertex.z;
    }

    // You can use setDrawRange to animate the curve
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    this.mesh = new THREE.Line(geometry, material);
    this.mesh.baseColor = colors[i];

    let tick = CURVE_SEGMENTS;

    function loop() {
      if (tick >= 0) {
        geometry.setDrawRange(tick, CURVE_SEGMENTS);
        tick--;
        requestAnimationFrame(loop);
      }
    }
    loop();
  }

  materialOptions = (color, amount, resolution, camera) => {
    return {
      color: color,
      useMap: false,
      resolution: resolution,
      sizeAttenuation: false,
      lineWidth: amount,
      near: camera.near,
      far: camera.far,
      transparent: true,
      opacity: .9
    };
  };
}
