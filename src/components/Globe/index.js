import * as THREE from 'three';
import { PI_TWO, GLOBE_RADIUS, magazines } from './constants';
import Hammer from 'hammerjs';
import { clamp } from './utils';
import Tube from './Tube';
import req from '../../utils/req';
import DataStore from './DataStore';
import UI from './UI';

const CAMERA_Z_MIN = 500;
const CAMERA_Z_MAX = 2300;

let intersected;
let animReq;

export default class Globe {
  constructor(container) {
    if (!container) {
      return false;
    }
    this.container = container;
    this.nodes = [];
    this.reset();
    this._cameraZ = 1100;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.rootMesh = new THREE.Mesh(new THREE.Geometry());
    this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 1, 10000);
    this.camera.position.z = this._cameraZ;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.raycaster.linePrecision = 2;
    this.mouse = new THREE.Vector2();
    this.stageMouse = new THREE.Vector2();

    this.initSphere();
    this.initPanListener();
    this.initZoomListener();
    this.initResizeListener();

    this.scene.add(this.rootMesh);

    req('/assets/db/lugares.json').then(res => {
      this.data = new DataStore(res);
      this.ui = new UI(this.container, this.data, this.reload, this.createLineObjects, this.createCurveObjects, this.renderAll);
      this.renderAll();
      this.loop();
    });

    window.addEventListener('mousemove', this.onMouseMove, false);
  }

  reload = () => {
    window.cancelAnimationFrame(animReq);
    this.nodes = [];
    this.scene = new THREE.Scene();
    this.rootMesh = new THREE.Mesh(new THREE.Geometry());
    this.scene.add(this.rootMesh);
    this.initSphere();
    this.loop();
  };

  onMouseMove = (event) => {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.stageMouse.x = event.clientX;
    this.stageMouse.y = event.clientY;
  };

  initSphere() {
    let geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
    let loader = new THREE.TextureLoader();
    let material = new THREE.MeshBasicMaterial({
      map: loader.load('/assets/imgs/bitmap.jpg')
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'globe';
    this.rootMesh.add(mesh);
  }

  initPanListener() {
    let mc = new Hammer.Manager(this.container);
    mc.add(new Hammer.Pan());

    mc.on('pan', (e) => {
      this._deltaX = e.deltaX - this._startX;
      this._deltaY = e.deltaY - this._startY;
    });

    mc.on('panstart', () => {
      this.reset();
      this.container.style.cursor = 'move';
    });

    mc.on('panend', () => {
      this.reset();
      this.container.style.cursor = 'auto';
    });
  }

  initZoomListener() {
    this.container.addEventListener('mousewheel', e => {
      const delta = e.wheelDeltaY * 0.2;
      this._cameraZ = clamp(this._cameraZ - delta, CAMERA_Z_MIN, CAMERA_Z_MAX);
    }, false);
  }

  initResizeListener() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }, false);
  }

  reset() {
    this._deltaX = 0;
    this._deltaY = 0;
    this._startX = 0;
    this._startY = 0;
  }

  loop = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.nodes);

    if (intersects.length > 0) {
      if (intersected !== intersects[0].object) {
        if (intersected) {
          intersected.material.color.set(intersected.baseColor);
        }
        intersected = intersects[0].object;
        intersected.material.color.set(0xf72ea3);
      }

      this.ui.box.classList.remove('hidden');
      this.ui.box.style.top = `${this.stageMouse.y - 20}px`;
      this.ui.box.style.left = `${this.stageMouse.x + 12}px`;
      this.ui.box.innerText = `${intersected.place.name}`;
    } else {
      if (intersected) {
        intersected.material.color.set(intersected.baseColor);
      }
      intersected = null;
      this.ui.box.classList.add('hidden');
    }

    this.rootMesh.rotation.x += Math.atan(this._deltaY / this._cameraZ) * 0.2;
    this.rootMesh.rotation.y += Math.atan(this._deltaX / this._cameraZ) * 0.2;
    if (this.rootMesh.rotation.x > PI_TWO) {
      this.rootMesh.rotation.x -= PI_TWO;
    }
    if (this.rootMesh.rotation.y > PI_TWO) {
      this.rootMesh.rotation.y -= PI_TWO;
    }

    // zoom
    this.camera.position.z = this._cameraZ;

    // render
    this.renderer.render(this.scene, this.camera);

    // next frame
    animReq = requestAnimationFrame(this.loop);
  };

  createLineObjects = (d) => {
    d.forEach(place => {
      magazines.forEach((obj, i) => {
        if (place.magazines.hasOwnProperty(obj.key)) {
          let curve = new Tube(
            i,
            [place.lat, place.lng - (i * .195), place.lat, place.lng - (i * .195)],
            place.magazines[obj.key].length
          );

          curve.mesh.place = place;
          this.nodes.push(curve.mesh);
          this.rootMesh.add(curve.mesh);
        }
      });
    });
  };

  createCurveObjects = (d) => {
    d.forEach(place => {
      magazines.forEach((obj, i) => {
        if (place.magazines.hasOwnProperty(obj.key)) {
          let curve = new Tube(
            i,
            [place.lat, place.lng - (i * .195), 4, -73.25],
            place.magazines[obj.key].length
          );

          curve.mesh.place = place;
          this.nodes.push(curve.mesh);
          this.rootMesh.add(curve.mesh);
        }
      });
    });
  };

  renderAll = () => {
    this.createCurveObjects(this.data.extProcedencia);
    this.createLineObjects(this.data.extMencion);
    this.createLineObjects(this.data.natMencion);
    this.createLineObjects(this.data.natProcedencia);
  }
}
