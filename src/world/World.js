import * as THREE from 'three';
import { PLAYER, WORLD } from '../config.js';
import { createBuilding } from './Building.js';
import { Environment } from './Environment.js';

const BUILDINGS = [
  { x: -13.5, z: 34, width: 11, depth: 14, height: 14, color: 0x1b2438, neonColor: 0x26e8ff },
  { x: -14.5, z: 16, width: 13, depth: 12, height: 9, color: 0x241b2e, neonColor: 0xff3d9a },
  { x: -13.0, z: -2, width: 10, depth: 14, height: 19, color: 0x18202e, neonColor: 0x26e8ff },
  { x: -14.8, z: -21, width: 13, depth: 12, height: 11, color: 0x211a2b, neonColor: 0xffd166 },
  { x: -13.2, z: -40, width: 10, depth: 14, height: 16, color: 0x171f2b, neonColor: 0xff3d9a },
  { x: 13.8, z: 33, width: 12, depth: 14, height: 18, color: 0x1c2539, neonColor: 0xff3d9a },
  { x: 14.6, z: 15, width: 13, depth: 12, height: 10, color: 0x221c2f, neonColor: 0x26e8ff },
  { x: 13.2, z: -3, width: 10, depth: 14, height: 22, color: 0x161f2d, neonColor: 0xffd166 },
  { x: 14.9, z: -22, width: 13, depth: 12, height: 13, color: 0x1e2436, neonColor: 0x26e8ff },
  { x: 13.4, z: -41, width: 11, depth: 14, height: 8, color: 0x191d2c, neonColor: 0xff3d9a },
];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.spawn = PLAYER.spawn;
    this.colliders = [];
    this.bounds = {
      minX: -WORLD.bound,
      maxX: WORLD.bound,
      minZ: -WORLD.bound,
      maxZ: WORLD.bound,
    };

    this.environment = new Environment(scene);
    this.buildStreet();
  }

  buildStreet() {
    for (const spec of BUILDINGS) {
      const { group, collider } = createBuilding(spec);
      this.scene.add(group);
      this.colliders.push(collider);
    }

    this.addNeonLights();
  }

  addNeonLights() {
    const cyanLight = new THREE.PointLight(0x24e6ff, 300, 45, 2);
    cyanLight.position.set(0, 5, 9);
    this.scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff2f9a, 300, 45, 2);
    magentaLight.position.set(0, 5, -18);
    this.scene.add(magentaLight);
  }
}
