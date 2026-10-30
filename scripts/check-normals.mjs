import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

const objPath = path.resolve('public/models/ridge/original/eccoblender.obj');
const lines = fs.readFileSync(objPath, 'utf8').split(/\r?\n/);

let totalFaceNormalsMatch = 0;
let totalFacesChecked = 0;

// Check first 100 faces to verify face normal vs vertex normal orientation
const v = [], vt = [], vn = [];
for (let line of lines) {
  if (line.startsWith('v ')) {
    const p = line.trim().split(/\s+/);
    v.push(new THREE.Vector3(parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3])));
  } else if (line.startsWith('vn ')) {
    const p = line.trim().split(/\s+/);
    vn.push(new THREE.Vector3(parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3])));
  } else if (line.startsWith('f ') && totalFacesChecked < 100) {
    const p = line.trim().split(/\s+/);
    const i1 = parseInt(p[1].split('/')[0]) - 1;
    const i2 = parseInt(p[2].split('/')[0]) - 1;
    const i3 = parseInt(p[3].split('/')[0]) - 1;
    const n1 = parseInt(p[1].split('/')[2]) - 1;

    const v1 = v[i1], v2 = v[i2], v3 = v[i3];
    const edge1 = new THREE.Vector3().subVectors(v2, v1);
    const edge2 = new THREE.Vector3().subVectors(v3, v1);
    const faceNormal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();
    const vertNormal = vn[n1];

    if (faceNormal.dot(vertNormal) > 0) totalFaceNormalsMatch++;
    totalFacesChecked++;
  }
}

console.log(`Face normals matching vertex normals: ${totalFaceNormalsMatch} / ${totalFacesChecked}`);
