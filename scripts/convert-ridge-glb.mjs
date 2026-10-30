import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill FileReader and Blob for Node.js environment
global.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      setTimeout(() => {
        if (this.onloadend) this.onloadend();
      }, 0);
    });
  }
};

async function main() {
  const objPath = path.resolve('public/models/ridge/original/eccoblender.obj');
  console.log('Loading OBJ from:', objPath);

  const fileContent = fs.readFileSync(objPath, 'utf8');
  const lines = fileContent.split(/\r?\n/);
  console.log('Lines count:', lines.length);

  const v = [];
  const vt = [];
  const vn = [];

  const posArray = [];
  const uvArray = [];
  const normArray = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('v ')) {
      const parts = line.split(/\s+/);
      v.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (line.startsWith('vt ')) {
      const parts = line.split(/\s+/);
      vt.push(parseFloat(parts[1]), parseFloat(parts[2]));
    } else if (line.startsWith('vn ')) {
      const parts = line.split(/\s+/);
      vn.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (line.startsWith('f ')) {
      const parts = line.split(/\s+/);
      for (let j = 1; j <= 3; j++) {
        const seg = parts[j].split('/');
        const vi = (parseInt(seg[0], 10) - 1) * 3;
        posArray.push(v[vi], v[vi + 1], v[vi + 2]);

        if (seg[1]) {
          const vti = (parseInt(seg[1], 10) - 1) * 2;
          uvArray.push(vt[vti], vt[vti + 1]);
        }

        if (seg[2]) {
          const vni = (parseInt(seg[2], 10) - 1) * 3;
          normArray.push(vn[vni], vn[vni + 1], vn[vni + 2]);
        }
      }
    }
  }

  console.log(`Parsed raw components: ${v.length / 3} vertices, ${vt.length / 2} UVs, ${vn.length / 3} normals.`);
  console.log(`Extracted triangle vertices: ${posArray.length / 3} (${posArray.length / 9} triangles)`);

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
  if (uvArray.length > 0) geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
  if (normArray.length > 0) geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normArray, 3));

  console.log('Merging duplicate vertices for indexed GLB optimization...');
  geometry = BufferGeometryUtils.mergeVertices(geometry, 0.0001);
  console.log(`Indexed geometry has ${geometry.attributes.position.count} vertices, ${geometry.index.count / 3} triangles.`);

  // Standardize orientation & dimensions
  geometry.computeBoundingBox();
  const rawBox = geometry.boundingBox;
  const rawSize = rawBox.getSize(new THREE.Vector3());
  console.log('Raw size:', rawSize);

  // Target standard length: 1.40m along X
  const targetLength = 1.40;
  const scaleFactor = targetLength / rawSize.x;
  console.log('Scale factor:', scaleFactor);
  geometry.scale(scaleFactor, scaleFactor, scaleFactor);

  // Align center of X and Z to 0, and align bottom datum to Y = 0.012m
  geometry.computeBoundingBox();
  const scaledBox = geometry.boundingBox;
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  const scaledMin = scaledBox.min;

  geometry.translate(-scaledCenter.x, 0.012 - scaledMin.y, -scaledCenter.z);

  // Compute final bounding box
  geometry.computeBoundingBox();
  const finalBox = geometry.boundingBox;
  const finalSize = finalBox.getSize(new THREE.Vector3());
  const finalCenter = finalBox.getCenter(new THREE.Vector3());

  console.log('--- Final Standardized Bounding Box ---');
  console.log('Min:', finalBox.min.x.toFixed(4), finalBox.min.y.toFixed(4), finalBox.min.z.toFixed(4));
  console.log('Max:', finalBox.max.x.toFixed(4), finalBox.max.y.toFixed(4), finalBox.max.z.toFixed(4));
  console.log('Size:', finalSize.x.toFixed(4), finalSize.y.toFixed(4), finalSize.z.toFixed(4));
  console.log('Center:', finalCenter.x.toFixed(4), finalCenter.y.toFixed(4), finalCenter.z.toFixed(4));

  // Add uv2 attribute for ambient occlusion
  geometry.setAttribute('uv2', geometry.attributes.uv.clone());

  // Material definition
  const material = new THREE.MeshStandardMaterial({
    name: 'Ridge_Trail_Reconstructed_PBR',
    roughness: 0.85,
    metalness: 0.1,
    color: 0xffffff
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'Ridge_Trail_Shoe_Mesh';
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const exportScene = new THREE.Scene();
  exportScene.add(mesh);

  console.log('Exporting GLB binary...');
  await new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      exportScene,
      (glbArrayBuffer) => {
        const buffer = Buffer.from(glbArrayBuffer);
        const outDir = path.resolve('public/models/ridge');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        const outPath = path.join(outDir, 'ridge_trail.glb');
        fs.writeFileSync(outPath, buffer);
        console.log(`Saved ridge_trail.glb: ${outPath} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);

        const topLevelFallback = path.resolve('public/models/trail_shoe_ridge.glb');
        fs.writeFileSync(topLevelFallback, buffer);
        console.log(`Saved fallback: ${topLevelFallback}`);
        resolve();
      },
      (err) => {
        console.error('GLTF Export failed:', err);
        reject(err);
      },
      { binary: true }
    );
  });
}

main().catch(console.error);
