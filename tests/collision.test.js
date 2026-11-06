import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COLLISION_EPSILON,
  moveAndSlide,
} from '../src/physics/Collision.js';

const HALF = 0.3;
const wall = { minX: 2, maxX: 6, minZ: -5, maxZ: 5 };

function near(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) < 1e-3,
    `${message}: expected ${expected}, got ${actual}`,
  );
}

test('free movement keeps the requested displacement', () => {
  const result = moveAndSlide(0, 0, 1, 2, HALF, []);
  near(result.x, 1, 'x');
  near(result.z, 2, 'z');
  assert.equal(result.blockedX, false);
  assert.equal(result.blockedZ, false);
});

test('stops on the west face when moving +X', () => {
  const result = moveAndSlide(0, 0, 3, 0, HALF, [wall]);
  near(result.x, wall.minX - HALF - COLLISION_EPSILON, 'x');
  near(result.z, 0, 'z');
  assert.equal(result.blockedX, true);
  assert.equal(result.blockedZ, false);
});

test('stops on the east face when moving -X', () => {
  const result = moveAndSlide(8, 0, -3, 0, HALF, [wall]);
  near(result.x, wall.maxX + HALF + COLLISION_EPSILON, 'x');
  assert.equal(result.blockedX, true);
});

test('stops on the north face when moving -Z', () => {
  const result = moveAndSlide(4, 7, 0, -3, HALF, [wall]);
  near(result.z, wall.maxZ + HALF + COLLISION_EPSILON, 'z');
  near(result.x, 4, 'x');
  assert.equal(result.blockedZ, true);
});

test('stops on the south face when moving +Z', () => {
  const result = moveAndSlide(4, -7, 0, 3, HALF, [wall]);
  near(result.z, wall.minZ - HALF - COLLISION_EPSILON, 'z');
  assert.equal(result.blockedZ, true);
});

test('slides along a wall when moving diagonally', () => {
  const result = moveAndSlide(0, 0, 3, 1.5, HALF, [wall]);
  near(result.x, wall.minX - HALF - COLLISION_EPSILON, 'x');
  near(result.z, 1.5, 'z');
  assert.equal(result.blockedX, true);
  assert.equal(result.blockedZ, false);
});

test('blocks both axes in a corner', () => {
  const horizontal = { minX: -5, maxX: 5, minZ: 2, maxZ: 6 };
  const result = moveAndSlide(0, 0, 3, 3, HALF, [wall, horizontal]);
  near(result.x, 2 - HALF - COLLISION_EPSILON, 'x');
  near(result.z, 2 - HALF - COLLISION_EPSILON, 'z');
  assert.equal(result.blockedX, true);
  assert.equal(result.blockedZ, true);
});

test('does not tunnel through a wall at high speed', () => {
  const result = moveAndSlide(0, 0, 40, 0, HALF, [wall]);
  near(result.x, wall.minX - HALF - COLLISION_EPSILON, 'x');
});

test('stops at the first collider in a row', () => {
  const second = { minX: 5, maxX: 6, minZ: -5, maxZ: 5 };
  const result = moveAndSlide(0, 0, 40, 0, HALF, [wall, second]);
  near(result.x, wall.minX - HALF - COLLISION_EPSILON, 'x');
});

test('touching a face without moving is not considered a collision', () => {
  const result = moveAndSlide(
    wall.minX - HALF,
    0,
    0,
    0,
    HALF,
    [wall],
  );
  near(result.x, wall.minX - HALF, 'x');
  assert.equal(result.blockedX, false);
});

test('moving into a face while already touching snaps to it', () => {
  const result = moveAndSlide(
    wall.minX - HALF - COLLISION_EPSILON,
    0,
    0.2,
    0,
    HALF,
    [wall],
  );
  near(result.x, wall.minX - HALF - COLLISION_EPSILON, 'x');
  assert.equal(result.blockedX, true);
});
