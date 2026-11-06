import * as THREE from 'three';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const bodyMaterials = new Map();
const neonMaterials = new Map();

function getBodyMaterial(color) {
  if (!bodyMaterials.has(color)) {
    bodyMaterials.set(
      color,
      new THREE.MeshLambertMaterial({ color, emissive: 0x03060c }),
    );
  }
  return bodyMaterials.get(color);
}

function getNeonMaterial(color) {
  if (!neonMaterials.has(color)) {
    neonMaterials.set(color, new THREE.MeshBasicMaterial({ color }));
  }
  return neonMaterials.get(color);
}

/**
 * Builds one low-poly building out of shared geometry and cached materials.
 * Neon strips sit on the facade that faces the central street (x = 0).
 */
export function createBuilding({
  x,
  z,
  width,
  depth,
  height,
  color,
  neonColor,
}) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const body = new THREE.Mesh(unitBox, getBodyMaterial(color));
  body.scale.set(width, height, depth);
  body.position.y = height / 2;
  group.add(body);

  const facing = x <= 0 ? 1 : -1;
  const faceX = facing * (width / 2 + 0.05);
  const neon = getNeonMaterial(neonColor);

  const verticalStrip = new THREE.Mesh(unitBox, neon);
  verticalStrip.scale.set(0.09, height * 0.8, 0.18);
  verticalStrip.position.set(faceX, height * 0.5, depth * 0.28);
  group.add(verticalStrip);

  const horizontalBand = new THREE.Mesh(unitBox, neon);
  horizontalBand.scale.set(0.09, 0.12, depth * 0.72);
  horizontalBand.position.set(faceX, height * 0.74, 0);
  group.add(horizontalBand);

  const sign = new THREE.Mesh(unitBox, neon);
  sign.scale.set(0.06, Math.min(2.2, height * 0.18), Math.min(2.6, depth * 0.36));
  sign.position.set(faceX, height * 0.4, -depth * 0.18);
  group.add(sign);

  return {
    group,
    collider: {
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
    },
  };
}
