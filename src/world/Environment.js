import * as THREE from 'three';
import { RENDER, WORLD } from '../config.js';

/**
 * Static ambience: sky/fog, lights and the ground plane. No shadows and no
 * post-processing on the reference hardware.
 */
export class Environment {
  constructor(scene) {
    scene.background = new THREE.Color(RENDER.backgroundColor);
    scene.fog = new THREE.Fog(RENDER.fogColor, RENDER.fogNear, RENDER.fogFar);

    this.hemisphere = new THREE.HemisphereLight(0x3f5f96, 0x0a0f18, 2.2);
    scene.add(this.hemisphere);

    this.keyLight = new THREE.DirectionalLight(0xaac4ff, 2.2);
    this.keyLight.position.set(40, 65, 25);
    scene.add(this.keyLight);

    const groundGeometry = new THREE.PlaneGeometry(WORLD.size, WORLD.size);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x0e121a });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    scene.add(this.ground);

    this.addStreetMarkings(scene);
  }

  /**
   * Lane dashes as a single instanced draw call.
   */
  addStreetMarkings(scene) {
    const dashGeometry = new THREE.BoxGeometry(0.16, 0.01, 2.4);
    const dashMaterial = new THREE.MeshBasicMaterial({ color: 0x1d4d5e });
    const count = 17;
    const dashes = new THREE.InstancedMesh(
      dashGeometry,
      dashMaterial,
      count,
    );
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < count; i += 1) {
      matrix.makeTranslation(0, 0.02, -48 + i * 6);
      dashes.setMatrixAt(i, matrix);
    }
    dashes.instanceMatrix.needsUpdate = true;

    scene.add(dashes);
  }
}
