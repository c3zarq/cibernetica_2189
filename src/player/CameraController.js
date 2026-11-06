import { LOOK, PLAYER } from '../config.js';

export class CameraController {
  constructor(camera, input) {
    this.camera = camera;
    this.input = input;
    this.yaw = 0;
    this.pitch = 0;
    this.camera.rotation.order = 'YXZ';
  }

  updateLook() {
    if (this.input.locked) {
      const { dx, dy } = this.input.consumeMouseDelta();

      this.yaw -= dx * LOOK.sensitivity;
      this.pitch -= dy * LOOK.sensitivity;
      this.pitch = Math.max(
        -LOOK.maxPitch,
        Math.min(LOOK.maxPitch, this.pitch),
      );

      if (this.yaw > Math.PI) this.yaw -= Math.PI * 2;
      if (this.yaw < -Math.PI) this.yaw += Math.PI * 2;
    }

    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  syncTo(position) {
    this.camera.position.set(
      position.x,
      position.y + PLAYER.eyeHeight,
      position.z,
    );
  }
}
