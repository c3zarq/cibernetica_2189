import * as THREE from 'three';
import { PLAYER } from '../config.js';

function approach(current, target, maxDelta) {
  if (current < target) return Math.min(current + maxDelta, target);
  return Math.max(current - maxDelta, target);
}

/**
 * Converts local input (x = strafe, z = forward) into a world-space direction
 * using the camera yaw. Yaw 0 looks down -Z.
 */
export function computeWishDirection(
  moveX,
  moveZ,
  yaw,
  target = new THREE.Vector3(),
) {
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);

  // right = (cos, 0, -sin), forward = (-sin, 0, -cos)
  target.set(
    cos * moveX - sin * moveZ,
    0,
    -sin * moveX - cos * moveZ,
  );

  if (target.lengthSq() > 1) target.normalize();
  return target;
}

export function applyHorizontalMovement(
  velocity,
  wish,
  targetSpeed,
  dt,
  grounded,
) {
  if (wish.lengthSq() > 0) {
    const acceleration = grounded
      ? PLAYER.groundAcceleration
      : PLAYER.airAcceleration;
    const step = acceleration * dt;

    velocity.x = approach(velocity.x, wish.x * targetSpeed, step);
    velocity.z = approach(velocity.z, wish.z * targetSpeed, step);
    return;
  }

  const deceleration = grounded
    ? PLAYER.groundDeceleration
    : PLAYER.airDeceleration;
  const step = deceleration * dt;

  velocity.x = approach(velocity.x, 0, step);
  velocity.z = approach(velocity.z, 0, step);
}

export function applyGravity(velocity, dt) {
  velocity.y = Math.max(
    velocity.y - PLAYER.gravity * dt,
    PLAYER.terminalVelocity,
  );
}
