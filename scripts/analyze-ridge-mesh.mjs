import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

const objPath = path.resolve('public/models/ridge/original/eccoblender.obj');
const lines = fs.readFileSync(objPath, 'utf8').split(/\r?\n/);

console.log('Total OBJ lines:', lines.length);

const vertices = [];
const uvs = [];
const normals = [];

const posArray = [];
const uvArray = [];
const normArray = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || line.startsWith('#')) continue;

  const parts = line.split(/\s+/);
  const type = parts[0];

  if (type === 'v') {
    vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
  } else if (type === 'vt') {
    uvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
  } else if (type === 'vn') {
    normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
  } else if (type === 'f') {
    // Face: f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
    for (let j = 1; j <= 3; j++) {
      const vertData = parts[j].split('/');
      const vIdx = (parseInt(vertData[0], 10) - 1) * 3;
      posArray.push(vertices[vIdx], vertices[vIdx + 1], vertices[vIdx + 2]);

      if (vertData[1]) {
        const vtIdx = (parseInt(vertData[1], 10) - 1) * 2;
        uvArray.push(uvs[vtIdx], uvs[vtIdx + 1]);
      }

      if (vertData[2]) {
        const vnIdx = (parseInt(vertData[2], 10) - 1) * 3;
        normArray.push(normals[vnIdx], normals[vnIdx + 1], normals[vnIdx + 2]);
      }
    }
  }
}

console.log(`Loaded: ${vertices.length / 3} v, ${uvs.length / 2} vt, ${normals.length / 3} vn`);
console.log(`Face vertex elements: ${posArray.length / 3} vertices (${posArray.length / 9} triangles)`);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
if (uvArray.length > 0) geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
if (normArray.length > 0) geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normArray, 3));

geometry.computeBoundingBox();
const box = geometry.boundingBox;
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());

console.log('--- Original Bounding Box ---');
console.log('Min:', box.min.x.toFixed(4), box.min.y.toFixed(4), box.min.z.toFixed(4));
console.log('Max:', box.max.x.toFixed(4), box.max.y.toFixed(4), box.max.z.toFixed(4));
console.log('Size:', size.x.toFixed(4), size.y.toFixed(4), size.z.toFixed(4));
console.log('Center:', center.x.toFixed(4), center.y.toFixed(4), center.z.toFixed(4));

// Now let's test extreme vertex positions to see where heel/toe/top/bottom are located
let minXVert = null, maxXVert = null;
let minYVert = null, maxYVert = null;
let minZVert = null, maxZVert = null;

for (let i = 0; i < vertices.length; i += 3) {
  const x = vertices[i], y = vertices[i+1], z = vertices[i+2];
  if (!minXVert || x < minXVert.x) minXVert = { x, y, z };
  if (!maxXVert || x > maxXVert.x) maxXVert = { x, y, z };
  if (!minYVert || y < minYVert.y) minYVert = { x, y, z };
  if (!maxYVert || y > maxYVert.y) maxYVert = { x, y, z };
  if (!minZVert || z < minZVert.z) minZVert = { x, y, z };
  if (!maxZVert || z > maxZVert.z) maxZVert = { x, y, z };
}

console.log('minX vertex:', minXVert);
console.log('maxX vertex:', maxXVert);
console.log('minY vertex:', minYVert);
console.log('maxY vertex:', maxYVert);
console.log('minZ vertex:', minZVert);
console.log('maxZ vertex:', maxZVert);
