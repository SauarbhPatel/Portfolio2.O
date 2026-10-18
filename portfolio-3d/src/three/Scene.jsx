import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { scene as S } from '../lib'
import { services } from '../content'

const W = 1.5
const H = 3
const R = 0.22

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

// ── Screen artwork, drawn procedurally per service ───────────────────────
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function drawScreen(svc, i, total) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 1024
  const ctx = c.getContext('2d')
  const col = svc.color
  // background
  ctx.fillStyle = '#121110'
  ctx.fillRect(0, 0, 512, 1024)
  const g = ctx.createRadialGradient(420, 120, 10, 420, 120, 620)
  g.addColorStop(0, col + '55')
  g.addColorStop(1, '#12111000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 1024)
  // status bar
  ctx.fillStyle = '#F3EEE6'
  ctx.globalAlpha = 0.55
  ctx.font = '500 22px "JetBrains Mono"'
  ctx.fillText(`0${i + 1} / 0${total}`, 40, 64)
  ctx.textAlign = 'right'
  ctx.fillText('SP.', 472, 64)
  ctx.textAlign = 'left'
  ctx.globalAlpha = 1
  // title
  ctx.fillStyle = '#F3EEE6'
  ctx.font = '800 78px "Bricolage Grotesque Variable"'
  const words = svc.title.split(' ')
  words.forEach((w, k) => ctx.fillText(w, 38, 190 + k * 80))
  ctx.fillStyle = col
  ctx.fillRect(40, 190 + words.length * 80 - 40, 70, 10)

  // per-service UI motif
  const top = 340
  ctx.lineWidth = 3
  if (svc.id === 'mobile') {
    for (let r = 0; r < 4; r++)
      for (let q = 0; q < 4; q++) {
        rr(ctx, 44 + q * 110, top + 20 + r * 118, 86, 86, 24)
        ctx.fillStyle = (r + q) % 3 === 0 ? col : '#2a2825'
        ctx.globalAlpha = (r + q) % 3 === 0 ? 0.9 : 1
        ctx.fill()
        ctx.globalAlpha = 1
      }
  } else if (svc.id === 'backend') {
    ctx.font = '400 24px "JetBrains Mono"'
    const lines = ['GET  /api/orders', 'POST /api/auth/otp', 'PUT  /api/users/:id', 'GET  /api/menu?day', '200 OK · 38ms']
    lines.forEach((t, k) => {
      rr(ctx, 40, top + 20 + k * 92, 432, 70, 16)
      ctx.fillStyle = k === 4 ? col : '#24221f'
      ctx.fill()
      ctx.fillStyle = k === 4 ? '#121110' : '#F3EEE6'
      ctx.fillText(t, 62, top + 64 + k * 92)
    })
  } else if (svc.id === 'realtime') {
    const bubbles = [
      [0, 260, 'Order picked up'],
      [1, 220, 'On the way!'],
      [0, 300, 'Arriving in 5 min'],
      [1, 180, '● Live'],
    ]
    ctx.font = '500 26px "Instrument Sans Variable"'
    bubbles.forEach(([me, w, t], k) => {
      const x = me ? 472 - w : 40
      rr(ctx, x, top + 20 + k * 104, w, 74, 30)
      ctx.fillStyle = me ? col : '#24221f'
      ctx.fill()
      ctx.fillStyle = me ? '#121110' : '#F3EEE6'
      ctx.fillText(t, x + 24, top + 66 + k * 104)
    })
    ctx.beginPath()
    ctx.arc(256, top + 500, 34, 0, Math.PI * 2)
    ctx.fillStyle = col
    ctx.fill()
  } else {
    rr(ctx, 40, top + 20, 432, 300, 22)
    ctx.fillStyle = '#24221f'
    ctx.fill()
    ;[0, 1, 2].forEach((k) => {
      ctx.beginPath()
      ctx.arc(70 + k * 26, top + 50, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#4a4740'
      ctx.fill()
    })
    const bars = [90, 160, 120, 210, 170, 240]
    bars.forEach((b, k) => {
      rr(ctx, 76 + k * 64, top + 290 - b, 40, b, 8)
      ctx.fillStyle = k === 5 ? '#FF5A1F' : '#F3EEE6'
      ctx.globalAlpha = k === 5 ? 1 : 0.75
      ctx.fill()
      ctx.globalAlpha = 1
    })
    rr(ctx, 40, top + 350, 432, 70, 16)
    ctx.fillStyle = '#24221f'
    ctx.fill()
    rr(ctx, 40, top + 440, 300, 70, 16)
    ctx.fill()
  }
  // tags
  ctx.font = '500 21px "JetBrains Mono"'
  let x = 40
  let y = 960
  svc.tags.slice(0, 3).forEach((t) => {
    const w = ctx.measureText(t).width + 28
    if (x + w > 480) {
      x = 40
      y -= 50
    }
    rr(ctx, x, y - 30, w, 42, 21)
    ctx.strokeStyle = '#F3EEE677'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#F3EEE6'
    ctx.fillText(t, x + 14, y - 2)
    x += w + 10
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
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
    const g = new THREE.ExtrudeGeometry(roundedRect(W, H, R), {
      depth: 0.1,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 4,
      curveSegments: 14,
    })
    g.center()
    return g
  }, [])
  const screen = useMemo(() => screenGeometry(W - 0.12, H - 0.12, R - 0.05), [])
  const textures = useMemo(() => services.map((s, i) => drawScreen(s, i, services.length)), [])
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1c1a17',
        metalness: 0.65,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        envMapIntensity: 0.9,
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
      ring.current.material.opacity = lerp(0.9, 0.35, m) * intro
    }
  })

  return (
    <group ref={group}>
      <mesh ref={ring} position={[0, 0, -0.2]}>
        <torusGeometry args={[2.25, 0.012, 8, 160]} />
        <meshBasicMaterial color="#FF5A1F" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      {services.map((s, i) => (
        <group key={s.id} ref={(el) => (slabs.current[i] = el)}>
          <mesh geometry={body} material={bodyMat} />
          <mesh geometry={screen} position={[0, 0, 0.09]}>
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
          <mesh position={[0, H / 2 - 0.13, 0.095]}>
            <capsuleGeometry args={[0.03, 0.22, 4, 8]} />
            <meshBasicMaterial color="#000" />
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
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Env />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <pointLight position={[-4, -1, 2]} intensity={18} color="#FF5A1F" />
      <pointLight position={[5, 2, -2]} intensity={12} color="#9DB8FF" />
      <Phones />
      <Dust count={S.mobile ? 140 : 420} />
    </Canvas>
  )
}
