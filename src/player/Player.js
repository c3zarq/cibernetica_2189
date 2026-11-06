import * as THREE from 'three';
import { PLAYER } from '../config.js';
import { moveAndSlide } from '../physics/Collision.js';
import {
  applyGravity,
  applyHorizontalMovement,
  computeWishDirection,
} from './Movement.js';

const wish = new THREE.Vector3();

export class Player {
  constructor(world) {
    this.world = world;
    this.position = new THREE.Vector3(
      world.spawn.x,
      world.spawn.y,
      world.spawn.z,
    );
    this.velocity = new THREE.Vector3();
    this.grounded = true;
  }

  update(dt, input, yaw) {
    if (dt <= 0) return;

    const moveX =
      Number(input.isActive('right')) - Number(input.isActive('left'));
    const moveZ =
      Number(input.isActive('forward')) - Number(input.isActive('backward'));

    computeWishDirection(moveX, moveZ, yaw, wish);

    const targetSpeed = input.isActive('run')
      ? PLAYER.runSpeed
      : PLAYER.walkSpeed;

    applyHorizontalMovement(
      this.velocity,
      wish,
      targetSpeed,
      dt,
      this.grounded,
    );

    if (input.wasPressed('jump') && this.grounded) {
      this.velocity.y = PLAYER.jumpSpeed;
      this.grounded = false;
    }

    applyGravity(this.velocity, dt);

    const result = moveAndSlide(
      this.position.x,
      this.position.z,
      this.velocity.x * dt,
      this.velocity.z * dt,
      PLAYER.halfExtent,
      this.world.colliders,
    );

    const minX = this.world.bounds.minX + PLAYER.halfExtent;
    const maxX = this.world.bounds.maxX - PLAYER.halfExtent;
    const minZ = this.world.bounds.minZ + PLAYER.halfExtent;
    const maxZ = this.world.bounds.maxZ - PLAYER.halfExtent;

    const clampedX = Math.min(Math.max(result.x, minX), maxX);
    const clampedZ = Math.min(Math.max(result.z, minZ), maxZ);

    if (clampedX !== result.x) this.velocity.x = 0;
    if (clampedZ !== result.z) this.velocity.z = 0;
    if (result.blockedX) this.velocity.x = 0;
    if (result.blockedZ) this.velocity.z = 0;

    this.position.x = clampedX;
    this.position.z = clampedZ;
    this.position.y += this.velocity.y * dt;

    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }
  }
}
