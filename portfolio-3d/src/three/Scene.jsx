import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { scene as S } from '../lib'
import { services } from '../content'
import { drawScreen } from './screens'

// realistic modern-phone proportions (≈19.5:9), thin titanium frame
const W = 1.46
const H = 3.02
const R = 0.25
const FRONT = 0.064 // z of the front face

function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function screenGeometry(w, h, r) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 16)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h)
  uv.needsUpdate = true
  return g
}

// ── helpers ──────────────────────────────────────────────────────────────
const lerp = THREE.MathUtils.lerp
const clamp = THREE.MathUtils.clamp
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Env() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      env.dispose()
      pm.dispose()
    }
  }, [gl, scene])
  return null
}

function Dust({ count }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(ph) * Math.cos(th)
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6
      p[i * 3 + 2] = r * Math.cos(ph) - 2
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [count])
  useFrame((_, dt) => {
    if (ref.current && !S.reduced) ref.current.rotation.y += dt * 0.02
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.025} color="#F3EEE6" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Phones() {
  const group = useRef()
  const ring = useRef()
  const slabs = useRef([])
  const { viewport } = useThree()
  const mobile = viewport.width < viewport.height * 1.05

  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(W - 0.06, H - 0.06, R - 0.03), {
      depth: 0.068,
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelThickness: 0.03,
      bevelSegments: 8,
      curveSegments: 32,
    })
    g.center()
    return g
  }, [])
  const front = useMemo(() => new THREE.ShapeGeometry(roundedRect(W - 0.035, H - 0.035, R - 0.02), 32), [])
  const screen = useMemo(() => screenGeometry(W - 0.1, H - 0.1, R - 0.055), [])
  const cam = useMemo(() => new THREE.ShapeGeometry(roundedRect(0.6, 0.6, 0.15), 16), [])
  const textures = useMemo(() => services.map((s) => drawScreen(s, S.mobile ? 0.7 : 1)), [])
  const mats = useMemo(
    () => ({
      // brushed titanium frame
      frame: new THREE.MeshPhysicalMaterial({ color: '#4a4744', metalness: 1, roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.2, envMapIntensity: 1.3 }),
      // black glass around the display
      glass: new THREE.MeshPhysicalMaterial({ color: '#030303', metalness: 0.2, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.8 }),
      // frosted glass back
      back: new THREE.MeshPhysicalMaterial({ color: '#2b2926', metalness: 0.3, roughness: 0.55, clearcoat: 0.6, envMapIntensity: 0.9 }),
      // reflective sheen layer over the screen
      sheen: new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: 0.06, transparent: true, opacity: 0.045, envMapIntensity: 2, depthWrite: false }),
      lens: new THREE.MeshPhysicalMaterial({ color: '#05070a', metalness: 0.4, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.6 }),
      button: new THREE.MeshStandardMaterial({ color: '#56524e', metalness: 1, roughness: 0.35 }),
    }),
    []
  )
  const sm = useRef({ rx: 0, ry: 0, m: 0, a: 0 })

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const s = sm.current
    const reduced = S.reduced
    const k = reduced ? 1 : 1 - Math.pow(0.0015, dt)
    s.m = lerp(s.m, S.morph, k)
    s.a = lerp(s.a, S.stage * (services.length - 1), k)
    const m = ease(clamp(s.m, 0, 1))
    const intro = ease(clamp(S.intro, 0, 1))

    // mouse parallax
    const mx = reduced ? 0 : S.mouse.x
    const my = reduced ? 0 : S.mouse.y
    s.ry = lerp(s.ry, mx * 0.45, 1 - Math.pow(0.02, dt))
    s.rx = lerp(s.rx, -my * 0.25, 1 - Math.pow(0.02, dt))

    // group placement: hero (stacked) → stage (fanned)
    const heroPos = mobile ? [0, 1.6, 0] : [2.25, -0.05, 0]
    const stagePos = mobile ? [0, 1.3, 0] : [1.85, 0, 0]
    const heroScale = mobile ? 0.55 : 0.95
    const stageScale = mobile ? 0.55 : 0.9
    const float = reduced ? 0 : Math.sin(t * 0.9) * 0.06
    g.position.set(lerp(heroPos[0], stagePos[0], m), lerp(heroPos[1], stagePos[1], m) + float, 0)
    const sc = lerp(heroScale, stageScale, m) * lerp(0.7, 1, intro)
    g.scale.setScalar(sc)
    g.rotation.x = lerp(-1.0, 0, m) + s.rx
    g.rotation.y = lerp(-0.55, 0, m) + s.ry * (1 - m * 0.6) + (1 - intro) * -1.4
    g.rotation.z = lerp(0.18, 0, m)

    slabs.current.forEach((o, i) => {
      if (!o) return
      // stacked pose (local to the tilted group)
      const z0 = (services.length - 1 - i) * 0.24
      const rz0 = (i - 1.5) * 0.16 + (reduced ? 0 : Math.sin(t * 0.7 + i) * 0.02)
      const y0 = (i - 1.5) * -0.08
      // fanned pose
      // upcoming faces line up to the right; passed faces fly back and up behind the active one
      const d = i - s.a
      const past = Math.min(d, 0)
      const ahead = Math.max(d, 0)
      const x1 = ahead * 1.75 + past * 0.55
      const z1 = -ahead * 1.3 + past * 2.6
      const ry1 = -ahead * 0.45 - past * 0.3
      const sc1 = 1 - Math.min(Math.abs(d), 1) * 0.12
      o.position.set(lerp(0, x1, m), lerp(y0, -past * 0.35, m), lerp(z0, z1, m))
      o.rotation.set(0, lerp(0, ry1, m), lerp(rz0, 0, m))
      o.scale.setScalar(lerp(1, sc1, m))
    })

    if (ring.current) {
      ring.current.rotation.z = reduced ? 0.6 : t * 0.25
      ring.current.rotation.x = lerp(0, 1.25, m)
      ring.current.scale.setScalar(lerp(1, 1.7, m))
      ring.current.material.opacity = lerp(0.45, 0.2, m) * intro
    }
  })

  return (
    <group ref={group}>
      <mesh ref={ring} position={[0, 0, -0.2]}>
        <torusGeometry args={[2.25, 0.006, 8, 200]} />
        <meshBasicMaterial color="#FF5A1F" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      {services.map((s, i) => (
        <group key={s.id} ref={(el) => (slabs.current[i] = el)}>
          <mesh geometry={body} material={mats.frame} />
          {/* front: black glass, live display, reflective sheen */}
          <mesh geometry={front} material={mats.glass} position={[0, 0, FRONT + 0.001]} />
          <mesh geometry={screen} position={[0, 0, FRONT + 0.003]}>
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
          <mesh geometry={front} material={mats.sheen} position={[0, 0, FRONT + 0.005]} />
          {/* back: frosted glass + camera module */}
          <mesh geometry={front} material={mats.back} position={[0, 0, -FRONT - 0.001]} rotation={[0, Math.PI, 0]} />
          <group position={[W / 2 - 0.42, H / 2 - 0.42, -FRONT - 0.004]} rotation={[0, Math.PI, 0]}>
            <mesh geometry={cam} material={mats.glass} />
            {[
              [-0.13, 0.13],
              [-0.13, -0.13],
              [0.13, 0],
            ].map(([x, y], k) => (
              <group key={k} position={[x, y, 0.02]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.button}>
                  <cylinderGeometry args={[0.105, 0.105, 0.04, 32]} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.012]} material={mats.lens}>
                  <cylinderGeometry args={[0.08, 0.08, 0.03, 32]} />
                </mesh>
              </group>
            ))}
          </group>
          {/* side buttons */}
          <mesh position={[W / 2 + 0.006, 0.55, 0]} material={mats.button}>
            <boxGeometry args={[0.02, 0.36, 0.05]} />
          </mesh>
          <mesh position={[-W / 2 - 0.006, 0.78, 0]} material={mats.button}>
            <boxGeometry args={[0.02, 0.12, 0.05]} />
          </mesh>
          <mesh position={[-W / 2 - 0.006, 0.5, 0]} material={mats.button}>
            <boxGeometry args={[0.02, 0.24, 0.05]} />
          </mesh>
          <mesh position={[-W / 2 - 0.006, 0.18, 0]} material={mats.button}>
            <boxGeometry args={[0.02, 0.24, 0.05]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Scene({ active }) {
  const dpr = S.mobile ? [1, 1.5] : [1, 2]
  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      frameloop={S.reduced ? 'demand' : active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8.5], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 1.08 }}
      aria-hidden="true"
    >
      <Env />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} color="#fff4e8" />
      <directionalLight position={[-5, 2, -4]} intensity={1.4} color="#cfd8ff" />
      <pointLight position={[-4, -2, 3]} intensity={7} color="#FF5A1F" />
      <pointLight position={[5, 3, -2]} intensity={5} color="#9DB8FF" />
      <Phones />
      <Dust count={S.mobile ? 140 : 420} />
    </Canvas>
  )
}
