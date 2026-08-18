import * as THREE from 'three';

/**
 * Distributes a number of points evenly around a sphere's surface.
 * Returns an array of THREE.Vector3.
 */
export function generateFibonacciSphere(samples: number, radius: number = 1): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  if (samples <= 0) return points;
  if (samples === 1) {
    points.push(new THREE.Vector3(0, 0, radius));
    return points;
  }

  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians (~2.399963 rad)

  for (let i = 0; i < samples; i++) {
    // y goes symmetrically from 1 - 1/samples down to -1 + 1/samples (avoids poles crowding)
    const y = 1 - (2 * i + 1) / samples;
    // radius at height y on unit sphere
    const r = Math.sqrt(Math.max(0, 1 - y * y));

    // golden angle spiral
    const theta = phi * i;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return points;
}
