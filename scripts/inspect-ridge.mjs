import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const objPath = path.resolve('public/models/ridge/original/eccoblender.obj');
console.log('Reading OBJ:', objPath);
const content = fs.readFileSync(objPath, 'utf8');

const loader = new OBJLoader();
const obj = loader.parse(content);

console.log('Parsed OBJ successfully!');
console.log('Children count:', obj.children.length);

let totalVertices = 0;
let totalFaces = 0;

obj.traverse((child) => {
  if (child.isMesh) {
    const geo = child.geometry;
    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;
    const normals = geo.attributes.normal;
    console.log('Mesh name:', child.name);
    console.log('Positions count:', pos ? pos.count : 0);
    console.log('UV count:', uvs ? uvs.count : 0);
    console.log('Normals count:', normals ? normals.count : 0);
    totalVertices += pos ? pos.count : 0;
    if (geo.index) {
      totalFaces += geo.index.count / 3;
    } else if (pos) {
      totalFaces += pos.count / 3;
    }
  }
});

const box = new THREE.Box3().setFromObject(obj);
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());

console.log('Bounding Box:');
console.log('  Min:', box.min.x.toFixed(4), box.min.y.toFixed(4), box.min.z.toFixed(4));
console.log('  Max:', box.max.x.toFixed(4), box.max.y.toFixed(4), box.max.z.toFixed(4));
console.log('  Size:', size.x.toFixed(4), size.y.toFixed(4), size.z.toFixed(4));
console.log('  Center:', center.x.toFixed(4), center.y.toFixed(4), center.z.toFixed(4));
console.log('Total vertices:', totalVertices);
console.log('Total faces:', totalFaces);
