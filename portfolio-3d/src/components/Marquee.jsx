import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReduced } from '../lib'
import { stack } from '../content'

function Band({ items, className, bandRef }) {
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className={`band ${className}`}>
      <div className="band-track" ref={bandRef}>
        {row.map((t, i) => (
          <span key={i} className="band-item">
            {t}
            <span className="star" aria-hidden="true">✳</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// Two crossed bands; speed and direction follow scroll velocity.
export default function Marquee() {
  const a = useRef(null)
  const b = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    let x1 = 0
    let x2 = -50
    let dir = 1
    let boost = 0
    const st = ScrollTrigger.create({
      trigger: '.marquee',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (s) => {
        dir = s.direction
        boost = Math.min(Math.abs(s.getVelocity()) / 300, 12)
      },
    })
    const tick = (_, dt) => {
      const speed = (0.012 + boost * 0.012) * dt * 0.06 * dir
      boost *= 0.92
      x1 -= speed
      x2 += speed
      if (x1 <= -50) x1 += 50
      if (x1 > 0) x1 -= 50
      if (x2 >= 0) x2 -= 50
      if (x2 < -50) x2 += 50
      if (a.current) a.current.style.transform = `translate3d(${x1}%,0,0)`
      if (b.current) b.current.style.transform = `translate3d(${x2}%,0,0)`
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      st.kill()
    }
  }, [])
  const half = Math.ceil(stack.length / 2)
  return (
    <section className="marquee" aria-label="Tools and technologies">
      <ul className="sr-only">
        {stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div aria-hidden="true">
        <Band items={stack.slice(0, half)} className="band-a" bandRef={a} />
        <Band items={stack.slice(half)} className="band-b" bandRef={b} />
      </div>
    </section>
  )
}
