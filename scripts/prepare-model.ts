import { mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { Document, NodeIO } from '@gltf-transform/core'
import { BufferGeometry, Float32BufferAttribute, Color } from 'three'
import { MeshoptSimplifier } from 'meshoptimizer'
import inputs from './model-inputs.json'
import { structures } from '../src/anatomy'

const sha = (data: Uint8Array) => createHash('sha256').update(data).digest('hex')
await mkdir('.asset-cache', { recursive: true })
await mkdir('public/models', { recursive: true })
for (const input of inputs) {
  const file = Bun.file(`.asset-cache/${input.file}`)
  if (!(await file.exists())) {
    console.log(`Downloading ${input.file}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.file}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  if (sha(new Uint8Array(await file.arrayBuffer())) !== input.sha256) {
    throw new Error(
      `Checksum mismatch: ${input.file}. Refusing changed upstream data; review it before updating the pin.`,
    )
  }
}
const names = new Map(
  (await Bun.file('.asset-cache/parts_list_e.txt').text())
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.split('\t') as [string, string]),
)
const credit =
  'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan'
const doc = new Document()
doc.getRoot().getAsset().copyright = credit
const scene = doc.createScene('OrganUI Skeleton — BodyParts3D 3.0')
const buffer = doc.createBuffer()
const used = new Set<string>()
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity]
await MeshoptSimplifier.ready
// The full-resolution skeleton has about 2.1 million triangles, too heavy for a
// web page, and its density varies widely (a rib has three times the triangles
// of a femur). Each mesh is simplified with meshoptimizer, which only removes
// vertices along the existing surface, to a budget proportional to its size:
// TRIANGLES_PER_MM of bounding-box diagonal, at least MIN_TRIANGLES, never more
// than the source, and never past MAX_ERROR of the mesh's own extent.
const TRIANGLES_PER_MM = 12
const MIN_TRIANGLES = 400
const MAX_ERROR = 0.01
// Binary STL stores unindexed triangles; vertices are welded on exact position
// so the mesh is indexed before simplification and smooth normals can be
// recomputed.
const prepared = structures.map((structure) => {
  const id = structure.file ?? structure.fma
  if (used.has(id)) throw new Error(`Duplicate ownership: ${id}`)
  used.add(id)
  if (names.get(id) !== structure.sourceName)
    throw new Error(`Source name mismatch: ${id} is "${names.get(id)}"`)
  const bytes = new Uint8Array(readFileSync(`.asset-cache/${id}.stl`))
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const triangles = view.getUint32(80, true)
  if (bytes.length !== 84 + triangles * 50) throw new Error(`Invalid binary STL: ${id}`)
  const positions: number[] = [],
    indices: number[] = []
  const weld = new Map<string, number>()
  for (let t = 0; t < triangles; t++) {
    for (let k = 0; k < 3; k++) {
      const o = 84 + t * 50 + 12 + k * 12
      const v = [0, 1, 2].map((i) => view.getFloat32(o + i * 4, true))
      if (!v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${id}`)
      const key = v.join(',')
      let index = weld.get(key)
      if (index === undefined) {
        index = positions.length / 3
        weld.set(key, index)
        positions.push(...v)
        v.forEach((p, i) => {
          min[i] = Math.min(min[i], p)
          max[i] = Math.max(max[i], p)
        })
      }
      indices.push(index)
    }
  }
  const lo = [Infinity, Infinity, Infinity],
    hi = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < positions.length; i++) {
    lo[i % 3] = Math.min(lo[i % 3], positions[i])
    hi[i % 3] = Math.max(hi[i % 3], positions[i])
  }
  const diagonal = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2])
  const target = Math.min(
    triangles,
    Math.max(MIN_TRIANGLES, Math.round(diagonal * TRIANGLES_PER_MM)),
  )
  const [simplified] = MeshoptSimplifier.simplify(
    new Uint32Array(indices),
    new Float32Array(positions),
    3,
    target * 3,
    MAX_ERROR,
  )
  // Drop vertices the simplified triangles no longer use.
  const remap = new Map<number, number>()
  const kept: number[] = []
  const compact = Array.from(simplified, (index) => {
    let next = remap.get(index)
    if (next === undefined) {
      next = kept.length / 3
      remap.set(index, next)
      kept.push(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2])
    }
    return next
  })
  return {
    structure,
    positions: kept,
    indices: compact,
    runtimeTriangles: compact.length / 3,
    sources: [
      {
        element: id,
        sha256: sha(bytes),
        bytes: bytes.length,
        vertices: positions.length / 3,
        triangles,
      },
    ],
  }
})
const center = min.map((v, i) => (v + max[i]) / 2)
const scale = 0.0025 // millimeters to display units; uniform scale, no anatomical reshaping
for (const { structure, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    transformed[i] = (positions[i] - center[0]) * scale
    transformed[i + 1] = (positions[i + 2] - center[2]) * scale
    transformed[i + 2] = -(positions[i + 1] - center[1]) * scale
  }
  const geometry = new BufferGeometry()
    .setAttribute('position', new Float32BufferAttribute(transformed, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(transformed).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc
        .createAccessor()
        .setType('VEC3')
        .setArray(new Float32Array(geometry.getAttribute('normal').array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc
        .createAccessor()
        .setType('SCALAR')
        .setArray(
          positions.length / 3 <= 65536 ? new Uint16Array(indices) : new Uint32Array(indices),
        )
        .setBuffer(buffer),
    )
    .setMaterial(material)
  const mesh = doc.createMesh(structure.id).addPrimitive(primitive)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(mesh)
      .setExtras({ structureId: structure.id, fma: structure.fma }),
  )
  geometry.dispose()
}
const runtime = await new NodeIO().writeBinary(doc)
await Bun.write('public/models/skeleton.glb', runtime)
const manifest = {
  dataset: 'BodyParts3D',
  version: '3.0 (20110915)',
  variant:
    'BodyParts3D_3.0_obj_95 converted to binary STL by the Kevin-Mattheus-Moerman/BodyParts3D mirror',
  retrieved: '2026-10-16',
  license: 'CC-BY-SA-2.1-JP',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  credit,
  inputs,
  simplification: {
    tool: 'meshoptimizer 1.3.0 simplify',
    trianglesPerMmOfDiagonal: TRIANGLES_PER_MM,
    minTriangles: MIN_TRIANGLES,
    maxRelativeError: MAX_ERROR,
  },
  transform: { sourceBoundsMm: { min, max }, centerMm: center, scale, axes: '[x, z, -y]' },
  runtime: { file: 'skeleton.glb', bytes: runtime.byteLength, sha256: sha(runtime) },
  structures: prepared.map(({ structure, sources, runtimeTriangles }) => ({
    id: structure.id,
    fma: structure.fma,
    sourceName: structure.sourceName,
    sources,
    runtimeTriangles,
  })),
}
await Bun.write('public/models/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `Prepared ${structures.length} structures, ${prepared.reduce((n, p) => n + p.runtimeTriangles, 0)} triangles, ${runtime.byteLength} bytes. SHA-256 ${sha(runtime)}`,
)
