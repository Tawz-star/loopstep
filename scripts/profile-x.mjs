import fs from 'fs';
import path from 'path';

const objPath = path.resolve('public/models/ridge/original/eccoblender.obj');
const lines = fs.readFileSync(objPath, 'utf8').split(/\r?\n/);

const verts = [];
for (let line of lines) {
  if (line.startsWith('v ')) {
    const p = line.trim().split(/\s+/);
    verts.push({ x: parseFloat(p[1]), y: parseFloat(p[2]), z: parseFloat(p[3]) });
  }
}

// Slice X into 10 bins from -0.85 to 1.25
const minX = -0.8561, maxX = 1.2571;
const step = (maxX - minX) / 10;

for (let i = 0; i < 10; i++) {
  const x0 = minX + i * step;
  const x1 = x0 + step;
  const inBin = verts.filter(v => v.x >= x0 && v.x < x1);
  if (inBin.length === 0) continue;
  const ys = inBin.map(v => v.y);
  const zs = inBin.map(v => v.z);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const avgZ = zs.reduce((a, b) => a + b, 0) / zs.length;
  console.log(`Bin ${i} [x: ${x0.toFixed(2)} to ${x1.toFixed(2)}] count: ${inBin.length} | y: [${minY.toFixed(2)}, ${maxY.toFixed(2)}] (h=${(maxY-minY).toFixed(2)}) | z: [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}] (w=${(maxZ-minZ).toFixed(2)}) avgZ: ${avgZ.toFixed(2)}`);
}
