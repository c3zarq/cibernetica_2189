/**
 * Central tuning values. Keeping them here avoids magic numbers spread across
 * modules and makes later phases (settings menu, difficulty, quality presets)
 * a matter of replacing this object.
 */

export const RENDER = Object.freeze({
  fov: 70,
  near: 0.1,
  far: 220,
  maxPixelRatio: 1,
  renderScale: 1,
  backgroundColor: 0x05060a,
  fogColor: 0x05060a,
  fogNear: 35,
  fogFar: 130,
});

export const PLAYER = Object.freeze({
  height: 1.8,
  eyeHeight: 1.62,
  halfExtent: 0.3,
  walkSpeed: 4.0,
  runSpeed: 6.5,
  groundAcceleration: 45,
  groundDeceleration: 55,
  airAcceleration: 12,
  airDeceleration: 4,
  gravity: 22,
  jumpSpeed: 6.0,
  terminalVelocity: -30,
  spawn: Object.freeze({ x: 0, y: 0, z: 25 }),
});

export const LOOK = Object.freeze({
  sensitivity: 0.0022,
  maxPitch: (85 * Math.PI) / 180,
});

export const CONTROLS = Object.freeze({
  forward: Object.freeze(['KeyW']),
  backward: Object.freeze(['KeyS']),
  left: Object.freeze(['KeyA']),
  right: Object.freeze(['KeyD']),
  jump: Object.freeze(['Space']),
  run: Object.freeze(['ShiftLeft', 'ShiftRight']),
});

export const WORLD = Object.freeze({
  size: 120,
  bound: 58,
});

export const TIME = Object.freeze({
  maxDelta: 0.05,
});
