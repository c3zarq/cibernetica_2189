export const COLLISION_EPSILON = 1e-4;

/**
 * Moves an axis-aligned footprint (square of side 2 * halfExtent) through a
 * list of static AABB colliders, resolving X first and then Z. Resolving one
 * axis at a time produces wall sliding without a physics engine.
 *
 * The sweep checks whether the movement crosses the near face of a collider,
 * so a large delta cannot tunnel through it. Buildings are treated as vertical
 * prisms: the footprint can never enter their XZ rectangle, regardless of the
 * player's height.
 */
export function moveAndSlide(x, z, dx, dz, halfExtent, colliders) {
  let nextX = x + dx;
  let blockedX = false;

  if (dx !== 0) {
    for (const collider of colliders) {
      const overlapsZ =
        z > collider.minZ - halfExtent && z < collider.maxZ + halfExtent;
      if (!overlapsZ) continue;

      const entryX =
        dx > 0
          ? collider.minX - halfExtent - COLLISION_EPSILON
          : collider.maxX + halfExtent + COLLISION_EPSILON;

      if (dx > 0 && x <= entryX + COLLISION_EPSILON && nextX > entryX) {
        nextX = entryX;
        blockedX = true;
      } else if (
        dx < 0 &&
        x >= entryX - COLLISION_EPSILON &&
        nextX < entryX
      ) {
        nextX = entryX;
        blockedX = true;
      }
    }
  }

  let nextZ = z + dz;
  let blockedZ = false;

  if (dz !== 0) {
    for (const collider of colliders) {
      const overlapsX =
        nextX > collider.minX - halfExtent &&
        nextX < collider.maxX + halfExtent;
      if (!overlapsX) continue;

      const entryZ =
        dz > 0
          ? collider.minZ - halfExtent - COLLISION_EPSILON
          : collider.maxZ + halfExtent + COLLISION_EPSILON;

      if (dz > 0 && z <= entryZ + COLLISION_EPSILON && nextZ > entryZ) {
        nextZ = entryZ;
        blockedZ = true;
      } else if (
        dz < 0 &&
        z >= entryZ - COLLISION_EPSILON &&
        nextZ < entryZ
      ) {
        nextZ = entryZ;
        blockedZ = true;
      }
    }
  }

  return { x: nextX, z: nextZ, blockedX, blockedZ };
}
