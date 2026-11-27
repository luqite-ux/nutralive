import * as THREE from 'three'

export type Built = {
  group: THREE.Group
  tick?: (t: number) => void
  dispose: () => void
}

export type ModeId = 'botanical' | 'amino' | 'oils' | 'oem'

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tracker() {
  const geos: THREE.BufferGeometry[] = []
  const mats: THREE.Material[] = []
  return {
    geo<T extends THREE.BufferGeometry>(g: T) {
      geos.push(g)
      return g
    },
    mat<T extends THREE.Material>(m: T) {
      mats.push(m)
      return m
    },
    dispose() {
      geos.forEach((g) => g.dispose())
      mats.forEach((m) => m.dispose())
    },
  }
}

const UP = new THREE.Vector3(0, 1, 0)

function bond(a: THREE.Vector3, b: THREE.Vector3, geo: THREE.BufferGeometry, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.scale.set(1, len, 1)
  mesh.position.copy(a).addScaledVector(dir, 0.5)
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize())
  return mesh
}

function createPowderTextures(baseHex: string, lightHex: string, darkHex: string, seed: number) {
  const rand = mulberry32(seed)
  const size = 256
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = colorCanvas.height = size
  const cctx = colorCanvas.getContext('2d')!
  cctx.fillStyle = baseHex
  cctx.fillRect(0, 0, size, size)

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = bumpCanvas.height = size
  const bctx = bumpCanvas.getContext('2d')!
  bctx.fillStyle = '#808080'
  bctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 18000; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 0.6 + rand() * 1.4
    cctx.fillStyle = rand() > 0.5 ? lightHex : darkHex
    cctx.globalAlpha = 0.28 + rand() * 0.35
    cctx.fillRect(x, y, r, r)

    const g = Math.floor(90 + rand() * 140)
    bctx.fillStyle = `rgb(${g},${g},${g})`
    bctx.fillRect(x, y, r, r)
  }

  const map = new THREE.CanvasTexture(colorCanvas)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(4, 4)
  map.colorSpace = THREE.SRGBColorSpace

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping
  bumpMap.repeat.set(4, 4)

  return { map, bumpMap }
}

function dishWithPowder(t: ReturnType<typeof tracker>, group: THREE.Group, palette: string[], count: number, seed: number) {
  const rand = mulberry32(seed)
  const glass = t.mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      metalness: 0,
      transparent: true,
      opacity: 0.38,
      clearcoat: 1,
      envMapIntensity: 1.1,
    }),
  )
  const base = new THREE.Mesh(t.geo(new THREE.CylinderGeometry(1.7, 1.7, 0.1, 72)), glass)
  base.position.y = 0.05
  group.add(base)
  const rim = new THREE.Mesh(t.geo(new THREE.TorusGeometry(1.7, 0.035, 12, 96)), glass)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.18
  group.add(rim)
  const wall = new THREE.Mesh(t.geo(new THREE.CylinderGeometry(1.7, 1.7, 0.2, 72, 1, true)), glass)
  wall.material.side = THREE.DoubleSide
  wall.position.y = 0.15
  group.add(wall)

  // Smooth fine-powder mound core with procedural micro-grain bump texture
  const R = 1.48
  const moundPts: THREE.Vector2[] = []
  for (let i = 0; i <= 24; i++) {
    const f = i / 24
    const r = Math.max(0.002, (1 - f) * R)
    const y = 0.1 + Math.pow(f, 1.45) * 0.88 + Math.sin(f * Math.PI) * 0.05
    moundPts.push(new THREE.Vector2(r, y))
  }
  const { map, bumpMap } = createPowderTextures(palette[0], palette[4] || palette[1], palette[3] || palette[2], seed + 99)
  const moundMat = t.mat(
    new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: 0.045,
      roughness: 0.96,
      metalness: 0,
    }),
  )
  const mound = new THREE.Mesh(t.geo(new THREE.LatheGeometry(moundPts, 64)), moundMat)
  group.add(mound)

  // Fine surface micro-powder dust particles (5x finer than spheres)
  const fineCount = Math.max(count, 4200)
  const geo = t.geo(new THREE.DodecahedronGeometry(1, 0))
  const mat = t.mat(new THREE.MeshStandardMaterial({ roughness: 0.96, metalness: 0 }))
  const mesh = new THREE.InstancedMesh(geo, mat, fineCount)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const color = new THREE.Color()
  for (let i = 0; i < fineCount; i++) {
    const u = rand()
    const r = R * 0.98 * Math.sqrt(u)
    const a = rand() * Math.PI * 2
    const f = Math.max(0, 1 - r / R)
    const surfY = 0.1 + Math.pow(f, 1.45) * 0.88 + Math.sin(f * Math.PI) * 0.05
    const s = 0.009 + rand() * 0.013
    e.set(rand() * 3, rand() * 3, rand() * 3)
    q.setFromEuler(e)
    m.compose(
      new THREE.Vector3(Math.cos(a) * r, surfY + (rand() - 0.35) * 0.025, Math.sin(a) * r),
      q,
      new THREE.Vector3(s, s * 0.72, s),
    )
    mesh.setMatrixAt(i, m)
    color.set(palette[Math.floor(rand() * palette.length)])
    mesh.setColorAt(i, color)
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  group.add(mesh)

  return () => {
    map.dispose()
    bumpMap.dispose()
  }
}

export function buildBotanical(): Built {
  const t = tracker()
  const group = new THREE.Group()
  const disposePowderTex = dishWithPowder(t, group, ['#d99a1e', '#e3ae35', '#c98a12', '#b8860b', '#e8bb4d'], 4200, 7)

  const mol = new THREE.Group()
  const carbon = t.mat(new THREE.MeshStandardMaterial({ color: '#1E4620', roughness: 0.45 }))
  const oxygen = t.mat(new THREE.MeshStandardMaterial({ color: '#6BA82E', roughness: 0.35 }))
  const stick = t.mat(new THREE.MeshStandardMaterial({ color: '#8fa38a', roughness: 0.4 }))
  const atomGeo = t.geo(new THREE.SphereGeometry(1, 24, 16))
  const bondGeo = t.geo(new THREE.CylinderGeometry(0.03, 0.03, 1, 10))

  const atom = (p: THREE.Vector3, r: number, mat: THREE.Material) => {
    const a = new THREE.Mesh(atomGeo, mat)
    a.position.copy(p)
    a.scale.setScalar(r)
    mol.add(a)
  }
  const ring = (cx: number) => {
    const pts: THREE.Vector3[] = []
    for (let k = 0; k < 6; k++) {
      const ang = (Math.PI / 3) * k
      pts.push(new THREE.Vector3(cx + Math.cos(ang) * 0.42, Math.sin(ang) * 0.42, 0))
    }
    pts.forEach((p, k) => {
      atom(p, 0.075, carbon)
      mol.add(bond(p, pts[(k + 1) % 6], bondGeo, stick))
    })
    return pts
  }
  const left = ring(-1.0)
  const right = ring(1.0)
  const chain = [
    left[0],
    new THREE.Vector3(-0.29, 0.22, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.29, 0.22, 0),
    right[3],
  ]
  chain.forEach((p, i) => {
    if (i > 0 && i < chain.length - 1) atom(p, i % 2 === 1 ? 0.1 : 0.075, i % 2 === 1 ? oxygen : carbon)
    if (i > 0) mol.add(bond(chain[i - 1], p, bondGeo, stick))
  })
  mol.scale.setScalar(0.95)
  mol.position.set(0, 2.15, 0)
  group.add(mol)

  return {
    group,
    tick: (time) => {
      mol.position.y = 2.15 + Math.sin(time * 1.1) * 0.06
      mol.rotation.y = Math.sin(time * 0.5) * 0.35
    },
    dispose: () => {
      disposePowderTex()
      t.dispose()
    },
  }
}

export function buildAmino(): Built {
  const t = tracker()
  const group = new THREE.Group()
  const rand = mulberry32(21)

  const profile: THREE.Vector2[] = []
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * (Math.PI / 2)
    profile.push(new THREE.Vector2(Math.sin(a) * 1.65 + 0.001, 1.05 - Math.cos(a) * 1.05))
  }
  for (let i = 14; i >= 0; i--) {
    const a = (i / 14) * (Math.PI / 2)
    profile.push(new THREE.Vector2(Math.sin(a) * 1.58 + 0.001, 1.05 - Math.cos(a) * 0.98 + 0.07))
  }
  const ceramic = t.mat(
    new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.28, clearcoat: 0.8, side: THREE.DoubleSide }),
  )
  const bowl = new THREE.Mesh(t.geo(new THREE.LatheGeometry(profile, 64)), ceramic)
  bowl.position.y = 0.05
  group.add(bowl)

  const count = 960
  const geo = t.geo(new THREE.IcosahedronGeometry(1, 0))
  const mat = t.mat(new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, flatShading: true }))
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const color = new THREE.Color()
  const palette = ['#fbfaf4', '#f1efe3', '#e9e6d6', '#ffffff', '#f6f1df']
  for (let i = 0; i < count; i++) {
    const r = 1.38 * Math.sqrt(rand())
    const a = rand() * Math.PI * 2
    const h = Math.pow(Math.max(0, 1 - r / 1.38), 1.15) * 0.72
    const s = 0.032 + rand() * 0.034
    e.set(rand() * 3, rand() * 3, rand() * 3)
    q.setFromEuler(e)
    m.compose(
      new THREE.Vector3(Math.cos(a) * r, 0.42 + h * (0.55 + rand() * 0.45), Math.sin(a) * r),
      q,
      new THREE.Vector3(s, s * (0.8 + rand() * 0.3), s),
    )
    mesh.setMatrixAt(i, m)
    color.set(palette[Math.floor(rand() * palette.length)])
    mesh.setColorAt(i, color)
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  group.add(mesh)
  group.position.y = -0.1

  return { group, dispose: t.dispose }
}

export function buildOils(): Built {
  const t = tracker()
  const group = new THREE.Group()
  const rand = mulberry32(33)

  const amber = t.mat(
    new THREE.MeshPhysicalMaterial({
      color: '#c8761a',
      roughness: 0.04,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.4,
    }),
  )
  const gold = t.mat(
    new THREE.MeshPhysicalMaterial({
      color: '#e6b422',
      roughness: 0.04,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.4,
    }),
  )
  const pedestalMat = t.mat(new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.3, clearcoat: 0.6 }))
  const pedestal = new THREE.Mesh(t.geo(new THREE.CylinderGeometry(1.9, 2.0, 0.14, 72)), pedestalMat)
  pedestal.position.y = 0.07
  group.add(pedestal)

  const sphere = t.geo(new THREE.SphereGeometry(1, 48, 32))
  const drops: { mesh: THREE.Mesh; base: number; phase: number }[] = []
  const layout = [
    { x: -0.7, z: 0.1, r: 0.78, mat: amber },
    { x: 0.75, z: -0.15, r: 0.66, mat: gold },
    { x: 0.05, z: 0.95, r: 0.48, mat: gold },
    { x: -0.3, z: -0.95, r: 0.42, mat: amber },
    { x: 1.25, z: 0.8, r: 0.3, mat: amber },
    { x: -1.3, z: -0.55, r: 0.28, mat: gold },
    { x: 0.2, z: -0.2, r: 0.2, mat: gold },
    { x: -1.15, z: 0.95, r: 0.22, mat: gold },
    { x: 1.35, z: -0.85, r: 0.2, mat: amber },
  ]
  layout.forEach((d) => {
    const mesh = new THREE.Mesh(sphere, d.mat)
    mesh.scale.set(d.r, d.r * 0.88, d.r)
    const base = 0.14 + d.r * 0.88
    mesh.position.set(d.x, base, d.z)
    group.add(mesh)
    drops.push({ mesh, base, phase: rand() * 6 })
  })

  return {
    group,
    tick: (time) => {
      drops.forEach((d, i) => {
        d.mesh.position.y = d.base + Math.sin(time * 0.9 + d.phase) * 0.012 * (i + 1)
      })
    },
    dispose: t.dispose,
  }
}

function halfCapsule(r: number, len: number) {
  const pts: THREE.Vector2[] = []
  pts.push(new THREE.Vector2(r, 0))
  pts.push(new THREE.Vector2(r, len))
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * (Math.PI / 2)
    pts.push(new THREE.Vector2(Math.cos(a) * r, len + Math.sin(a) * r))
  }
  pts[pts.length - 1].x = 0.0001
  return new THREE.LatheGeometry(pts, 32)
}

function tabletGeometry(r: number, h: number) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0.0001, 0)]
  const bevel = h * 0.45
  pts.push(new THREE.Vector2(r - bevel, 0))
  for (let i = 1; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2)
    pts.push(new THREE.Vector2(r - bevel + Math.sin(a) * bevel, bevel - Math.cos(a) * bevel))
  }
  pts.push(new THREE.Vector2(r, h - bevel))
  for (let i = 1; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2)
    pts.push(new THREE.Vector2(r - (1 - Math.cos(a)) * bevel, h - bevel + Math.sin(a) * bevel))
  }
  pts.push(new THREE.Vector2(0.0001, h))
  return new THREE.LatheGeometry(pts, 48)
}

export function buildOem(): Built {
  const t = tracker()
  const group = new THREE.Group()
  const rand = mulberry32(45)

  const floorMat = t.mat(new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.3, clearcoat: 0.6 }))
  const floor = new THREE.Mesh(t.geo(new THREE.CylinderGeometry(2.1, 2.2, 0.12, 72)), floorMat)
  floor.position.y = 0.06
  group.add(floor)

  const tabGeo = t.geo(tabletGeometry(0.5, 0.2))
  const scoreGeo = t.geo(new THREE.BoxGeometry(0.9, 0.012, 0.03))
  const tabMats = [
    t.mat(new THREE.MeshStandardMaterial({ color: '#8fa56d', roughness: 0.7, side: THREE.DoubleSide })),
    t.mat(new THREE.MeshStandardMaterial({ color: '#cdb88c', roughness: 0.7, side: THREE.DoubleSide })),
  ]
  const scoreMat = t.mat(new THREE.MeshStandardMaterial({ color: '#5d6e45', roughness: 0.9 }))
  const tablets = [
    { x: -1.0, z: -0.55, m: 0 },
    { x: -0.25, z: -1.05, m: 1 },
    { x: -0.55, z: 0.1, m: 0 },
    { x: -1.3, z: 0.55, m: 1 },
  ]
  tablets.forEach((tb) => {
    const mesh = new THREE.Mesh(tabGeo, tabMats[tb.m])
    mesh.position.set(tb.x, 0.12, tb.z)
    mesh.rotation.y = rand() * 3
    const score = new THREE.Mesh(scoreGeo, scoreMat)
    score.position.y = 0.2
    mesh.add(score)
    group.add(mesh)
  })

  const capA = t.geo(halfCapsule(0.22, 0.34))
  const capB = t.geo(halfCapsule(0.205, 0.32))
  const bodyMats = [
    t.mat(new THREE.MeshPhysicalMaterial({ color: '#d99a1e', roughness: 0.25, clearcoat: 0.9, side: THREE.DoubleSide })),
    t.mat(new THREE.MeshPhysicalMaterial({ color: '#6f8f3c', roughness: 0.25, clearcoat: 0.9, side: THREE.DoubleSide })),
  ]
  const capMat = t.mat(
    new THREE.MeshPhysicalMaterial({ color: '#f3ead0', roughness: 0.25, clearcoat: 0.9, side: THREE.DoubleSide }),
  )
  const capsules = [
    { x: 0.7, z: -0.75, m: 0, ry: 0.4 },
    { x: 1.2, z: -0.1, m: 1, ry: 2.2 },
    { x: 0.55, z: 0.55, m: 0, ry: 1.1 },
    { x: 1.0, z: 1.05, m: 1, ry: 0.1 },
    { x: -0.2, z: 1.0, m: 0, ry: 2.8 },
  ]
  capsules.forEach((c) => {
    const cap = new THREE.Group()
    const a = new THREE.Mesh(capA, bodyMats[c.m])
    a.rotation.x = Math.PI
    a.position.y = 0.1
    const b = new THREE.Mesh(capB, capMat)
    b.position.y = -0.1
    cap.add(a, b)
    cap.rotation.z = Math.PI / 2
    const holder = new THREE.Group()
    holder.add(cap)
    holder.position.set(c.x, 0.12 + 0.22, c.z)
    holder.rotation.y = c.ry
    group.add(holder)
  })

  return { group, dispose: t.dispose }
}

export const BUILDERS: Record<ModeId, () => Built> = {
  botanical: buildBotanical,
  amino: buildAmino,
  oils: buildOils,
  oem: buildOem,
}
