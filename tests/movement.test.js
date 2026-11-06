import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { PLAYER } from '../src/config.js';
import {
  applyGravity,
  applyHorizontalMovement,
  computeWishDirection,
} from '../src/player/Movement.js';
import { Player } from '../src/player/Player.js';

function near(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) < 1e-3,
    `${message}: expected ${expected}, got ${actual}`,
  );
}

function makeInput({ active = [], pressed = [] } = {}) {
  return {
    isActive: (action) => active.includes(action),
    wasPressed: (action) => pressed.includes(action),
  };
}

function makeWorld() {
  return {
    spawn: { x: 0, y: 0, z: 0 },
    colliders: [],
    bounds: { minX: -10, maxX: 10, minZ: -10, maxZ: 10 },
  };
}

test('forward at yaw 0 points to -Z', () => {
  const wish = computeWishDirection(0, 1, 0);
  near(wish.x, 0, 'x');
  near(wish.z, -1, 'z');
});

test('strafe right at yaw 0 points to +X', () => {
  const wish = computeWishDirection(1, 0, 0);
  near(wish.x, 1, 'x');
  near(wish.z, 0, 'z');
});

test('forward at 90 degrees points to -X', () => {
  const wish = computeWishDirection(0, 1, Math.PI / 2);
  near(wish.x, -1, 'x');
  near(wish.z, 0, 'z');
});

test('diagonal input is normalized', () => {
  const wish = computeWishDirection(1, 1, 0);
  near(wish.length(), 1, 'length');
  near(wish.x, Math.SQRT1_2, 'x');
  near(wish.z, -Math.SQRT1_2, 'z');
});

test('ground acceleration approaches target without overshooting', () => {
  const velocity = new THREE.Vector3();
  const wish = new THREE.Vector3(0, 0, -1);

  applyHorizontalMovement(velocity, wish, PLAYER.walkSpeed, 0.01, true);
  near(velocity.z, -PLAYER.groundAcceleration * 0.01, 'z');

  applyHorizontalMovement(velocity, wish, PLAYER.walkSpeed, 1, true);
  near(velocity.z, -PLAYER.walkSpeed, 'z');
});

test('releasing input decelerates to zero', () => {
  const velocity = new THREE.Vector3(PLAYER.walkSpeed, 0, 0);
  applyHorizontalMovement(
    velocity,
    new THREE.Vector3(),
    PLAYER.walkSpeed,
    1,
    true,
  );
  near(velocity.x, 0, 'x');
  near(velocity.z, 0, 'z');
});

test('air acceleration is weaker than ground acceleration', () => {
  const velocity = new THREE.Vector3();
  applyHorizontalMovement(
    velocity,
    new THREE.Vector3(0, 0, -1),
    PLAYER.walkSpeed,
    0.01,
    false,
  );
  near(velocity.z, -PLAYER.airAcceleration * 0.01, 'z');
});

test('gravity accelerates downward and respects terminal velocity', () => {
  const velocity = new THREE.Vector3();
  applyGravity(velocity, 0.1);
  near(velocity.y, -PLAYER.gravity * 0.1, 'y');

  applyGravity(velocity, 100);
  near(velocity.y, PLAYER.terminalVelocity, 'terminal');
});

test('player jumps only while grounded', () => {
  const player = new Player(makeWorld());
  const input = makeInput({ pressed: ['jump'] });

  player.update(1 / 60, input, 0);

  assert.equal(player.grounded, false);
  assert.ok(player.velocity.y > 0);

  const upwardSpeed = player.velocity.y;
  player.update(1 / 60, input, 0);
  assert.ok(
    player.velocity.y < upwardSpeed,
    'jump must not be re-applied while airborne',
  );
});

test('player lands on the ground plane', () => {
  const player = new Player(makeWorld());
  player.position.y = 0.02;
  player.velocity.y = -5;

  player.update(1 / 60, makeInput(), 0);

  assert.equal(player.position.y, 0);
  assert.equal(player.velocity.y, 0);
  assert.equal(player.grounded, true);
});

test('player is clamped to world bounds', () => {
  const player = new Player(makeWorld());
  player.position.x = 9.9;
  player.velocity.x = 100;

  player.update(0.05, makeInput(), 0);

  near(player.position.x, 10 - PLAYER.halfExtent, 'x');
  assert.equal(player.velocity.x, 0);
});

test('zero delta leaves the player unchanged', () => {
  const player = new Player(makeWorld());
  player.position.set(1, 2, 3);

  player.update(0, makeInput({ active: ['forward'] }), 0);

  near(player.position.x, 1, 'x');
  near(player.position.y, 2, 'y');
  near(player.position.z, 3, 'z');
});
