"use client"

import { useRef, useMemo, useEffect, useState, useCallback, memo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { Slider } from "@/components/ui/slider"

const AGENT_SCALE = 0.3

function CameraController({ distance }: { distance: number }) {
  const { camera } = useThree()
  const orbitControlsRef = useRef<any>(null)
  const lastInteractionRef = useRef(Date.now())
  const autoRotateRef = useRef(true)

  useEffect(() => {
    if (camera) {
      const angle = Math.atan2(camera.position.z, camera.position.x)
      const radius = distance
      camera.position.x = radius * Math.cos(angle)
      camera.position.y = distance
      camera.position.z = radius * Math.sin(angle)
      camera.lookAt(0, 0, 0)
    }
  }, [camera, distance])

  useEffect(() => {
    const handleMouseMove = () => {
      lastInteractionRef.current = Date.now()
      autoRotateRef.current = false
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    if (orbitControlsRef.current) {
      if (Date.now() - lastInteractionRef.current > 2000) {
        autoRotateRef.current = true
      }
      orbitControlsRef.current.autoRotate = autoRotateRef.current
      orbitControlsRef.current.autoRotateSpeed = 0.5
      orbitControlsRef.current.update()
    }
  })

  return (
    <OrbitControls ref={orbitControlsRef} enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
  )
}

/* ------------------------------------------------------------------ */
/*  Agent                                                              */
/* ------------------------------------------------------------------ */
function Agent({ startPosition, buildings }: { startPosition: number[]; buildings: any[] }) {
  const meshRef = useRef<THREE.Group>(null)
  const targetRef = useRef(new THREE.Vector3())
  const speedRef = useRef(0.02)

  const buildingBounds = useMemo(() => {
    return buildings.map((b) => ({
      x: b.position[0],
      z: b.position[2],
      width: b.type === "block" ? 2 : b.type === "skyscraper" ? 1 : 1.2,
      depth: b.type === "block" ? 2 : b.type === "skyscraper" ? 1 : 1.2,
    }))
  }, [buildings])

  const checkCollision = useCallback(
    (position: THREE.Vector3) => {
      const r = 0.3
      return buildingBounds.some((b) => {
        return Math.abs(position.x - b.x) < b.width / 2 + r && Math.abs(position.z - b.z) < b.depth / 2 + r
      })
    },
    [buildingBounds],
  )

  useFrame(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    const dist = mesh.position.distanceTo(targetRef.current)

    if (dist < 0.5 || targetRef.current.lengthSq() === 0) {
      let t: THREE.Vector3
      let attempts = 0
      do {
        t = new THREE.Vector3((Math.random() - 0.5) * 18, 0, (Math.random() - 0.5) * 18)
        attempts++
      } while (checkCollision(t) && attempts < 30)
      if (attempts < 30) targetRef.current.copy(t)
      else {
        const p = mesh.position.clone()
        targetRef.current.set(p.x + (Math.random() - 0.5) * 2, 0, p.z + (Math.random() - 0.5) * 2)
      }
    }

    const dir = targetRef.current.clone().sub(mesh.position).normalize()
    const next = mesh.position.clone().add(dir.multiplyScalar(speedRef.current))
    if (!checkCollision(next)) {
      mesh.position.copy(next)
      mesh.rotation.y = Math.atan2(dir.x, dir.z)
    } else {
      targetRef.current.set(0, 0, 0)
    }
  })

  return (
    <group ref={meshRef} position={startPosition as [number, number, number]} scale={AGENT_SCALE}>
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 2, 8]} />
        <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Tree (memoised)                                                    */
/* ------------------------------------------------------------------ */
const Tree = memo(function Tree({ position, scale = 1 }: { position: number[]; scale?: number }) {
  const greens = ["#4a7a52", "#5a8a60", "#6a9a6e"]
  const c = useMemo(() => greens[Math.floor(Math.random() * greens.length)], [])

  return (
    <group position={[position[0], 0, position[2]]} scale={scale}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 6]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 1.2, 6]} />
        <meshStandardMaterial color={c} />
      </mesh>
    </group>
  )
})

/* ------------------------------------------------------------------ */
/*  Modern Skyscraper – glass curtain wall tower                       */
/* ------------------------------------------------------------------ */
function Skyscraper({
  position,
  baseHeight,
  color,
}: {
  position: number[]
  baseHeight: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const currentHeight = useRef(baseHeight)

  const px = Math.abs(position[0] * 137.3 + position[2] * 251.7)
  const variant = Math.floor(px) % 5

  // Glass facade colors -- lighter cool tones that pop against dark bg
  const glassBase = "#4a5e72"
  const glassEmit = "#5a7088"
  const frameColor = "#b0b8c4"
  const accentColor = "#d0d8e0"

  const floors = Math.max(4, Math.floor(baseHeight / 0.6))
  const hasSpire = variant === 0 || variant === 4
  const hasCrown = variant === 2 || variant === 3
  const isTapered = variant === 1

  useFrame(({ mouse, viewport }) => {
    if (!groupRef.current) return
    const x = (mouse.x * viewport.width) / 2
    const z = -(mouse.y * viewport.height) / 2
    const d = Math.sqrt((x - position[0]) ** 2 + (z - position[2]) ** 2)
    const mult = Math.max(0, 1 - d / 10)
    const target = baseHeight + mult * 5
    currentHeight.current = THREE.MathUtils.lerp(currentHeight.current, target, 0.1)
    const s = currentHeight.current / baseHeight
    groupRef.current.scale.y = s
    groupRef.current.position.y = (currentHeight.current - baseHeight) / 2
  })

  const offset = ((px % 100) / 100 - 0.5) * 0.1

  return (
    <group ref={groupRef} position={[position[0] + offset, 0, position[2] + offset]}>
      {/* Main glass tower */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <boxGeometry args={[0.82, baseHeight, 0.82]} />
        <meshPhysicalMaterial
          color={glassBase}
          metalness={0.95}
          roughness={0.05}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Tapered upper section */}
      {isTapered && baseHeight > 3 && (
        <mesh position={[0, baseHeight * 0.8, 0]}>
          <boxGeometry args={[0.55, baseHeight * 0.4, 0.55]} />
          <meshPhysicalMaterial
            color={glassBase}
            metalness={0.95}
            roughness={0.05}
            clearcoat={1}
          />
        </mesh>
      )}

      {/* Glass panel grid -- horizontal mullions */}
      {Array.from({ length: Math.min(floors, 12) }).map((_, i) => {
        const y = (baseHeight / (floors + 1)) * (i + 1)
        return (
          <mesh key={`h-${i}`} position={[0, y, 0]}>
            <boxGeometry args={[0.88, 0.02, 0.88]} />
            <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
          </mesh>
        )
      })}

      {/* Vertical mullions -- 3 per face */}
      {[-0.22, 0, 0.22].map((off, mi) => (
        <group key={`vm-${mi}`}>
          <mesh position={[off, baseHeight / 2, 0.42]}>
            <boxGeometry args={[0.015, baseHeight, 0.015]} />
            <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.42, baseHeight / 2, off]}>
            <boxGeometry args={[0.015, baseHeight, 0.015]} />
            <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[off, baseHeight / 2, -0.42]}>
            <boxGeometry args={[0.015, baseHeight, 0.015]} />
            <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.42, baseHeight / 2, off]}>
            <boxGeometry args={[0.015, baseHeight, 0.015]} />
            <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Glowing window panels -- every other floor on two faces */}
      {Array.from({ length: Math.min(floors, 12) }).map((_, i) => {
        if (i % 2 !== 0) return null
        const y = (baseHeight / (floors + 1)) * (i + 1)
        return (
          <group key={`gw-${i}`}>
            <mesh position={[0, y, 0.415]}>
              <boxGeometry args={[0.72, 0.18, 0.005]} />
              <meshStandardMaterial color={glassEmit} emissive={glassEmit} emissiveIntensity={0.6} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.415, y, 0]}>
              <boxGeometry args={[0.005, 0.18, 0.72]} />
              <meshStandardMaterial color={glassEmit} emissive={glassEmit} emissiveIntensity={0.6} transparent opacity={0.7} />
            </mesh>
          </group>
        )
      })}

      {/* Accent LED strip at top */}
      <mesh position={[0, baseHeight + 0.02, 0]}>
        <boxGeometry args={[0.86, 0.04, 0.86]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
      </mesh>

      {/* Crown or spire */}
      {hasSpire && (
        <group>
          <mesh position={[0, baseHeight + 0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.01, 1, 6]} />
            <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, baseHeight + 1, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {hasCrown && (
        <group>
          <mesh position={[0, baseHeight + 0.15, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.5]} />
            <meshPhysicalMaterial color={glassBase} metalness={0.9} roughness={0.1} clearcoat={1} />
          </mesh>
          <mesh position={[0, baseHeight + 0.32, 0]}>
            <boxGeometry args={[0.52, 0.02, 0.52]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
          </mesh>
        </group>
      )}

      {/* Base plinth */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.92, 0.16, 0.92]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Modern Block Building – flat roof with clean facade                */
/* ------------------------------------------------------------------ */
function BlockBuilding({
  position,
  baseHeight,
  color,
}: {
  position: number[]
  baseHeight: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const currentHeight = useRef(baseHeight)

  const px = Math.abs(position[0] * 137.3 + position[2] * 251.7)
  const variant = Math.floor(px) % 3

  const bodyColor = variant === 0 ? "#6a7585" : variant === 1 ? "#5e6878" : "#546070"
  const panelColor = "#2a3848"
  const accentColor = "#8a96a8"
  const floors = Math.max(2, Math.floor(baseHeight / 1.0))

  useFrame(({ mouse, viewport }) => {
    if (!groupRef.current) return
    const x = (mouse.x * viewport.width) / 2
    const z = -(mouse.y * viewport.height) / 2
    const d = Math.sqrt((x - position[0]) ** 2 + (z - position[2]) ** 2)
    const mult = Math.max(0, 1 - d / 10)
    const target = baseHeight + mult * 3
    currentHeight.current = THREE.MathUtils.lerp(currentHeight.current, target, 0.1)
    const s = currentHeight.current / baseHeight
    groupRef.current.scale.y = s
    groupRef.current.position.y = (currentHeight.current - baseHeight) / 2
  })

  const offset = ((px % 100) / 100 - 0.5) * 0.08

  return (
    <group ref={groupRef} position={[position[0] + offset, 0, position[2] + offset]}>
      {/* Main body -- matte concrete */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <boxGeometry args={[1.8, baseHeight, 1.8]} />
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Recessed dark panels per floor on front + side */}
      {Array.from({ length: Math.min(floors, 6) }).map((_, fi) => {
        const y = (baseHeight / floors) * fi + baseHeight / floors / 2
        return (
          <group key={`bp-${fi}`}>
            {/* Front -- two wide panels */}
            {[-0.45, 0.45].map((wx, wi) => (
              <mesh key={`fp-${fi}-${wi}`} position={[wx, y, 0.905]}>
                <boxGeometry args={[0.7, baseHeight / floors * 0.65, 0.02]} />
                <meshPhysicalMaterial
                  color={panelColor}
                  metalness={0.8}
                  roughness={0.15}
                  clearcoat={0.5}
                />
              </mesh>
            ))}
            {/* Side -- two wide panels */}
            {[-0.45, 0.45].map((wz, wi) => (
              <mesh key={`sp-${fi}-${wi}`} position={[0.905, y, wz]}>
                <boxGeometry args={[0.02, baseHeight / floors * 0.65, 0.7]} />
                <meshPhysicalMaterial
                  color={panelColor}
                  metalness={0.8}
                  roughness={0.15}
                  clearcoat={0.5}
                />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Floor slab lines */}
      {Array.from({ length: floors }).map((_, i) => {
        const y = (baseHeight / floors) * (i + 1)
        return (
          <mesh key={`slab-${i}`} position={[0, y, 0]}>
            <boxGeometry args={[1.84, 0.03, 1.84]} />
            <meshStandardMaterial color="#4e5868" metalness={0.4} roughness={0.6} />
          </mesh>
        )
      })}

      {/* Ground floor accent entrance */}
      <mesh position={[0, 0.4, 0.91]}>
        <boxGeometry args={[0.6, 0.8, 0.02]} />
        <meshStandardMaterial color={panelColor} emissive={panelColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Entrance canopy */}
      <mesh position={[0, 0.85, 1.0]}>
        <boxGeometry args={[0.9, 0.04, 0.3]} />
        <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Rooftop edge accent */}
      <mesh position={[0, baseHeight + 0.02, 0]}>
        <boxGeometry args={[1.84, 0.04, 1.84]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.2} />
      </mesh>

      {/* Rooftop mechanical penthouse */}
      <mesh position={[0.3, baseHeight + 0.2, -0.3]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#4a5868" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Modern House – clean minimal residential                           */
/* ------------------------------------------------------------------ */
function House({
  position,
  baseHeight,
  color,
}: {
  position: number[]
  baseHeight: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const currentHeight = useRef(baseHeight)

  const px = Math.abs(position[0] * 137.3 + position[2] * 251.7)
  const variant = Math.floor(px) % 3

  const wallColor = variant === 0 ? "#7a8494" : variant === 1 ? "#6e7888" : "#64707e"
  const roofColor = "#3a4050"
  const woodColor = "#8a7060"
  const windowColor = "#2a3848"

  useFrame(({ mouse, viewport }) => {
    if (!groupRef.current) return
    const x = (mouse.x * viewport.width) / 2
    const z = -(mouse.y * viewport.height) / 2
    const d = Math.sqrt((x - position[0]) ** 2 + (z - position[2]) ** 2)
    const mult = Math.max(0, 1 - d / 10)
    const target = baseHeight + mult * 1.5
    currentHeight.current = THREE.MathUtils.lerp(currentHeight.current, target, 0.1)
    const s = currentHeight.current / baseHeight
    groupRef.current.scale.y = s
    groupRef.current.position.y = (currentHeight.current - baseHeight) / 2
  })

  const offset = ((px % 100) / 100 - 0.5) * 0.06

  return (
    <group ref={groupRef} position={[position[0] + offset, 0, position[2] + offset]}>
      {/* Main walls -- clean white/light grey */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <boxGeometry args={[1.0, baseHeight, 1.0]} />
        <meshStandardMaterial color={wallColor} metalness={0.15} roughness={0.75} />
      </mesh>

      {/* Flat modern roof with slight overhang */}
      <mesh position={[0, baseHeight + 0.04, 0]}>
        <boxGeometry args={[1.15, 0.08, 1.15]} />
        <meshStandardMaterial color={roofColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Large front window -- floor to ceiling style */}
      <mesh position={[-0.15, baseHeight * 0.5, 0.505]}>
        <boxGeometry args={[0.45, baseHeight * 0.7, 0.02]} />
        <meshPhysicalMaterial
          color={windowColor}
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          emissive={windowColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Front door -- wood accent */}
      <mesh position={[0.3, baseHeight * 0.3, 0.505]}>
        <boxGeometry args={[0.22, baseHeight * 0.55, 0.02]} />
        <meshStandardMaterial color={woodColor} metalness={0.15} roughness={0.65} />
      </mesh>

      {/* Side window */}
      <mesh position={[0.505, baseHeight * 0.55, 0]}>
        <boxGeometry args={[0.02, baseHeight * 0.4, 0.35]} />
        <meshPhysicalMaterial
          color={windowColor}
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          emissive={windowColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Door frame accent */}
      <mesh position={[0.3, baseHeight * 0.6, 0.51]}>
        <boxGeometry args={[0.28, 0.03, 0.01]} />
        <meshStandardMaterial color={roofColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Small yard fence / planter */}
      <mesh position={[0, 0.05, 0.6]}>
        <boxGeometry args={[0.8, 0.1, 0.12]} />
        <meshStandardMaterial color="#4a6a50" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Park                                                               */
/* ------------------------------------------------------------------ */
function Park({ position, size }: { position: number[]; size: number }) {
  const trees = useMemo(() => {
    const t: { position: number[]; scale: number }[] = []
    const count = Math.floor(Math.random() * 8) + 8
    for (let i = 0; i < count; i++) {
      t.push({
        position: [(Math.random() - 0.5) * (size - 0.5), 0, (Math.random() - 0.5) * (size - 0.5)],
        scale: Math.random() * 0.5 + 0.8,
      })
    }
    return t
  }, [size])

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#3a6a42" />
      </mesh>
      {trees.map((tree, i) => (
        <Tree key={i} position={tree.position} scale={tree.scale} />
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  City – procedural generation                                       */
/* ------------------------------------------------------------------ */
function City({ seed, parkDensity }: { seed: number; parkDensity: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const { buildings, trees, parks, agents } = useMemo(() => {
    let s = seed
    const random = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }

    const buildingData: any[] = []
    const treeData: any[] = []
    const parkData: any[] = []
    const agentData: any[] = []
    const gridSize = 20
    const occupiedSpaces = new Map<string, string>()

    const isAvail = (x: number, z: number, size = 1, buf = 0) => {
      for (let dx = -buf; dx < size + buf; dx++)
        for (let dz = -buf; dz < size + buf; dz++)
          if (occupiedSpaces.has(`${Math.floor(x + dx)},${Math.floor(z + dz)}`)) return false
      return true
    }

    const mark = (x: number, z: number, size = 1, type: string) => {
      for (let dx = 0; dx < size; dx++)
        for (let dz = 0; dz < size; dz++) occupiedSpaces.set(`${Math.floor(x + dx)},${Math.floor(z + dz)}`, type)
    }

    // Parks
    const parkCount = Math.floor(gridSize * gridSize * (parkDensity * 0.2))
    for (let i = 0; i < parkCount; i++) {
      const ps = random() > 0.5 ? 2 : 3
      for (let att = 0; att < 50; att++) {
        const px = Math.floor(random() * (gridSize - ps)) - gridSize / 2
        const pz = Math.floor(random() * (gridSize - ps)) - gridSize / 2
        if (isAvail(px, pz, ps, 1)) {
          mark(px, pz, ps, "park")
          parkData.push({ position: [px + ps / 2, 0, pz + ps / 2], size: ps })
          const ac = 3
          for (let j = 0; j < ac; j++) {
            const ax = px + ps / 2 + (random() - 0.5) * 4
            const az = pz + ps / 2 + (random() - 0.5) * 4
            if (Math.abs(ax) < gridSize / 2 && Math.abs(az) < gridSize / 2) agentData.push({ position: [ax, 0, az] })
          }
          break
        }
      }
    }

    // Zones
    const zones = new Map<string, string>()
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++) {
        const k = `${x},${z}`
        if (!occupiedSpaces.has(k)) zones.set(k, "skyscraper")
      }
    for (let x = -6; x <= 6; x++)
      for (let z = -6; z <= 6; z++) {
        const k = `${x},${z}`
        if (!occupiedSpaces.has(k) && !zones.has(k)) zones.set(k, "block")
      }

    const AGENT_H = 0.8

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        const k = `${x},${z}`
        if (occupiedSpaces.has(k)) continue

        if (random() > 0.8 && isAvail(x, z, 1, 0.5)) {
          mark(x, z, 1, "tree")
          treeData.push({ position: [x, 0, z], scale: 0.8 + random() * 0.2 })
          continue
        }

        if (isAvail(x, z, 1, 0.5)) {
          const zt = zones.get(k) || "house"
          const ranges: Record<string, { min: number; max: number }> = {
            skyscraper: { min: 4, max: 10 },
            block: { min: 2, max: 5 },
            house: { min: 1, max: 2 },
          }
          const r = ranges[zt]
          const bh = (r.min + random() * (r.max - r.min)) * AGENT_H

          let bright: number
          switch (zt) {
            case "skyscraper":
              bright = Math.floor(random() * 30 + 100)
              break
            case "block":
              bright = Math.floor(random() * 30 + 110)
              break
            default:
              bright = Math.floor(random() * 30 + 120)
          }

          mark(x, z, 1, "building")
          buildingData.push({
            position: [x, 0, z],
            type: zt,
            baseHeight: bh,
            color: `rgb(${bright}, ${bright}, ${bright})`,
          })
        }
      }
    }

    return { buildings: buildingData, trees: treeData, parks: parkData, agents: agentData }
  }, [parkDensity, seed])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3
  })

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#141c28" metalness={0.3} roughness={0.9} />
      </mesh>

      {parks.map((p, i) => (
        <Park key={`p-${i}`} {...p} />
      ))}

      {buildings.map((b, i) => {
        switch (b.type) {
          case "skyscraper":
            return <Skyscraper key={`b-${i}`} position={b.position} baseHeight={b.baseHeight} color={b.color} />
          case "block":
            return <BlockBuilding key={`b-${i}`} position={b.position} baseHeight={b.baseHeight} color={b.color} />
          default:
            return <House key={`b-${i}`} position={b.position} baseHeight={b.baseHeight} color={b.color} />
        }
      })}

      {trees.map((t, i) => (
        <Tree key={`t-${i}`} position={t.position} scale={t.scale} />
      ))}

      {agents.map((a, i) => (
        <Agent key={`a-${i}`} startPosition={a.position} buildings={buildings} />
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function ThreeBackground() {
  const [seed, setSeed] = useState(Date.now())
  const [cameraDistance, setCameraDistance] = useState(15)
  const [parkDensity, setParkDensity] = useState(0.5)

  return (
    <div className="absolute inset-0 bg-background">
      <Canvas camera={{ position: [15, 15, 15], fov: 75 }}>
        <color attach="background" args={["#0a0f1a"]} />
        <fog attach="fog" args={["#0a0f1a", 18, 45]} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 8]} intensity={0.8} color="#e0dcd6" />
        <pointLight position={[-8, 10, -8]} intensity={0.4} color="#7a9aaa" />
        <pointLight position={[6, 8, 6]} intensity={0.25} color="#aab4c0" />

        <City seed={seed} parkDensity={parkDensity} />
        <CameraController distance={cameraDistance} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.4} intensity={0.6} radius={0.4} />
        </EffectComposer>
      </Canvas>

      {/* Camera zoom -- hidden on mobile, vertical strip on right for desktop */}
      <div className="hidden md:flex absolute right-4 lg:right-6 bottom-20 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 flex-col items-center gap-2 z-10">
        <button
          onClick={() => setCameraDistance((d) => Math.max(5, d - 1))}
          className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.1] transition-all text-sm"
          aria-label="Zoom in"
        >
          +
        </button>
        <div className="h-12 lg:h-16 w-px bg-white/[0.08] relative">
          <div
            className="absolute bottom-0 left-0 w-full bg-white/30 rounded-full transition-all duration-300"
            style={{ height: `${((15 - cameraDistance) / 10) * 100}%` }}
          />
        </div>
        <button
          onClick={() => setCameraDistance((d) => Math.min(15, d + 1))}
          className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.1] transition-all text-sm"
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      {/* Bottom controls -- stacked on mobile, inline on desktop */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] sm:w-auto">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/[0.04] backdrop-blur-md rounded-2xl sm:rounded-full px-3 sm:px-2 py-3 sm:py-2 border border-white/[0.06]">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSeed(Date.now())}
              className="h-8 sm:h-9 px-4 sm:px-5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white/70 hover:text-white/90 transition-all text-[11px] sm:text-xs font-medium tracking-wide uppercase border border-white/[0.06] whitespace-nowrap"
            >
              Regenerate
            </button>
            <div className="hidden sm:block h-5 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial px-1 sm:px-3">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/30 font-medium whitespace-nowrap">Green Space</span>
              <Slider
                value={[parkDensity]}
                onValueChange={(value) => setParkDensity(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-16 sm:w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
