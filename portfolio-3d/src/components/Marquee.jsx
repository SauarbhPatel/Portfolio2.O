import { useEffect, useRef } from 'react'
import {
  siReact,
  siExpo,
  siJavascript,
  siTypescript,
  siNextdotjs,
  siRedux,
  siTailwindcss,
  siFirebase,
  siNodedotjs,
  siExpress,
  siMongodb,
  siRedis,
  siSocketdotio,
  siWebrtc,
  siCloudinary,
  siGit,
} from 'simple-icons'
import { gsap, ScrollTrigger, prefersReduced } from '../lib'
import { stack } from '../content'

// Tool name → brand icon (simple-icons, CC0). Unknown names fall back to a neutral glyph.
const ICONS = {
  'React Native': siReact,
  'React.js': siReact,
  'Context API': siReact,
  Expo: siExpo,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  'Next.js': siNextdotjs,
  Redux: siRedux,
  'Tailwind CSS': siTailwindcss,
  Firebase: siFirebase,
  FCM: siFirebase,
  'Node.js': siNodedotjs,
  'Express.js': siExpress,
  MongoDB: siMongodb,
  Redis: siRedis,
  'Socket.io': siSocketdotio,
  WebRTC: siWebrtc,
  Cloudinary: siCloudinary,
  Git: siGit,
}
const CLOUD = 'M6.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 8.5 5.25 5.25 0 1 1 18 19H6.5z'
const PLUG = 'M7 2v6H5v4a7 7 0 0 0 6 6.93V22h2v-3.07A7 7 0 0 0 19 12V8h-2V2h-2v6H9V2H7z'
const FALLBACK = { 'AWS S3': CLOUD, 'AWS EC2': CLOUD, WebSockets: PLUG }

// Dark brand colours would vanish on the dark page, so they glow in paper instead.
function hoverColor(hex) {
  const n = parseInt(hex, 16)
  const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return l < 0.35 ? '#F3EEE6' : `#${hex}`
}

function Tool({ name }) {
  const ic = ICONS[name]
  const color = ic ? hoverColor(ic.hex) : '#FF5A1F'
  return (
    <span className="tool" style={{ '--brand': color }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={ic ? ic.path : FALLBACK[name] || CLOUD} />
      </svg>
      <span className="tool-name">{name}</span>
    </span>
  )
}

function Row({ items, rowRef, dir }) {
  const loop = prefersReduced() ? items : [...items, ...items, ...items, ...items]
  return (
    <div className="tool-row" data-dir={dir}>
      <div className="tool-track" ref={rowRef}>
        {loop.map((t, i) => (
          <Tool key={i} name={t} />
        ))}
      </div>
    </div>
  )
}

// "Toolbox": two slow, opposite rows of real tool logos. Scrolling nudges them faster,
// hovering a row pauses it and lights the logo in its brand colour.
export default function Marquee() {
  const a = useRef(null)
  const b = useRef(null)

  useEffect(() => {
    if (prefersReduced()) return
    const rows = [
      { el: a.current, x: 0, dir: -1, speed: 1, hover: false },
      { el: b.current, x: 0, dir: 1, speed: 1, hover: false },
    ]
    rows.forEach((r) => {
      const row = r.el.parentElement
      row.addEventListener('pointerenter', () => (r.hover = true))
      row.addEventListener('pointerleave', () => (r.hover = false))
    })
    let boost = 0
    const st = ScrollTrigger.create({
      trigger: '.toolbox',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (s) => (boost = Math.min(Math.abs(s.getVelocity()) / 400, 6)),
    })
    const tick = (_, dt) => {
      boost *= 0.94
      rows.forEach((r) => {
        const half = r.el.scrollWidth / 2
        if (!half) return
        r.speed += ((r.hover ? 0 : 1 + boost) - r.speed) * 0.08
        r.x += r.dir * r.speed * dt * 0.035
        if (r.x <= -half) r.x += half
        if (r.x > 0) r.x -= half
        r.el.style.transform = `translate3d(${r.x}px,0,0)`
      })
    }
    // start row B offset so the two rows don't line up
    rows[1].x = -b.current.scrollWidth / 4
    gsap.ticker.add(tick)
    const intro = gsap.from('.toolbox .tool-row', {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.toolbox', start: 'top 80%' },
    })
    return () => {
      gsap.ticker.remove(tick)
      st.kill()
      intro.scrollTrigger?.kill()
      intro.kill()
    }
  }, [])

  const total = stack.front.length + stack.back.length
  return (
    <section className="toolbox" aria-labelledby="toolbox-title">
      <div className="wrap toolbox-head">
        <div>
          <p className="kicker mono">Toolbox</p>
          <h2 id="toolbox-title" className="toolbox-title">
            The stack I <span className="hand">ship with.</span>
          </h2>
        </div>
        <p className="toolbox-meta">
          <span className="mono">{total} tools</span>
          From the phone in your hand to the server behind it — what I use to build and ship apps.
        </p>
      </div>
      <ul className="sr-only">
        {[...stack.front, ...stack.back].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="tool-rows" aria-hidden="true">
        <Row items={stack.front} rowRef={a} dir="left" />
        <Row items={stack.back} rowRef={b} dir="right" />
      </div>
    </section>
  )
}
