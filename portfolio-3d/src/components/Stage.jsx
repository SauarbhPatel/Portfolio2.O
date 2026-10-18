import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger, scene, prefersReduced, smooth } from '../lib'
import { services } from '../content'

// Sticky 3D stage: the phone stack from the hero fans out and each face comes forward in turn.
export default function Stage() {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)
  const [reduced] = useState(prefersReduced)

  const [small] = useState(() => window.matchMedia('(max-width: 900px)').matches)
  const goStep = (i) => {
    const el = root.current
    if (!el) return
    const y = el.offsetTop + ((el.offsetHeight - window.innerHeight) * i) / (services.length - 1)
    if (smooth.lenis) smooth.lenis.scrollTo(y, { duration: 0.9 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  useEffect(() => {
    if (reduced) return
    const n = services.length
    const st1 = ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (s) => (scene.morph = s.progress),
    })
    const st2 = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (s) => {
        scene.stage = s.progress
        setIdx(Math.min(n - 1, Math.round(s.progress * (n - 1))))
      },
    })
    // Settle on a whole step whenever scrolling stops inside the stage,
    // so every skill gets its moment (works for wheel, trackpad and touch flings).
    let timer
    let lastY = window.scrollY
    let dir = 1
    let snapping = false
    const settle = () => {
      const el = root.current
      if (!el || snapping) return
      const range = el.offsetHeight - window.innerHeight
      const p = (window.scrollY - el.offsetTop) / range
      if (p <= 0.001 || p >= 0.999) return
      const f = p * (n - 1)
      const step = dir > 0 ? Math.ceil(f - 0.25) : Math.floor(f + 0.25)
      const target = el.offsetTop + (range * Math.max(0, Math.min(n - 1, step))) / (n - 1)
      if (Math.abs(target - window.scrollY) < 4) return
      snapping = true
      setTimeout(() => (snapping = false), 650)
      if (smooth.lenis) smooth.lenis.scrollTo(target, { duration: 0.55 })
      else window.scrollTo({ top: target, behavior: 'smooth' })
    }
    // Touch: one swipe moves at most one step, so a fast fling can't jump from 01 straight to 04.
    let touchStep = null
    let touchUntil = 0
    const stepOf = () => {
      const el = root.current
      const range = el.offsetHeight - window.innerHeight
      return ((window.scrollY - el.offsetTop) / range) * (n - 1)
    }
    const onTouchStart = () => {
      const f = stepOf()
      // above the stage counts as step -1, below it as step n
      touchStep = f < -3 || f > n + 2 ? null : f < 0 ? -1 : f > n - 1 ? n : Math.round(f)
      touchUntil = Infinity
    }
    const onTouchEnd = () => (touchUntil = performance.now() + 1200)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    const limitFling = () => {
      if (touchStep === null || performance.now() > touchUntil) return
      const f = stepOf()
      const lo = touchStep - 1
      const hi = touchStep + 1
      const passDown = f > hi && hi <= n - 1
      const passUp = f < lo && lo >= 0
      if (passDown || passUp) {
        const el = root.current
        const range = el.offsetHeight - window.innerHeight
        const clampTo = passDown ? hi : lo
        window.scrollTo(0, el.offsetTop + (range * clampTo) / (n - 1))
      }
    }

    const onScroll = () => {
      limitFling()
      const y = window.scrollY
      if (y !== lastY) dir = y > lastY ? 1 : -1
      lastY = y
      clearTimeout(timer)
      timer = setTimeout(settle, 140)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const fill = gsap.fromTo(
      '.stage-progress i',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true } }
    )
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      clearTimeout(timer)
      st1.kill()
      st2.kill()
      fill.scrollTrigger?.kill()
      fill.kill()
    }
  }, [reduced])

  if (reduced) {
    return (
      <section id="stage" className="stage stage-static" aria-labelledby="stage-title">
        <div className="wrap">
          <p className="kicker mono">What I do</p>
          <h2 id="stage-title" className="section-title">Four things I build.</h2>
          <ol className="stage-list">
            {services.map((s, i) => (
              <li key={s.id} style={{ '--c': s.color }}>
                <span className="mono">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.caption}</p>
                <ul className="tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  const s = services[idx]
  return (
    <section
      id="stage"
      className="stage"
      ref={root}
      style={{ height: `${services.length * (small ? 120 : 90) + 60}svh` }}
      aria-labelledby="stage-title"
    >
      <div className="stage-sticky">
        <div className="stage-caption">
          <p className="kicker mono">What I do</p>
          <h2 id="stage-title" className="sr-only">What I do</h2>
          <div className="stage-count mono" aria-hidden="true">
            <span className="stage-num">0{idx + 1}</span> / 0{services.length}
          </div>
          <div className="stage-live" aria-live="polite">
            <AnimatePresence initial={false}>
              <motion.div
                key={s.id}
                className="stage-slide"
                initial={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -30, opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="stage-title" style={{ '--c': s.color }}>
                  {s.title}
                </h3>
                <p className="stage-text">{s.caption}</p>
                <ul className="tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="stage-progress" aria-hidden="true">
          <i />
        </div>
        <ol className="stage-dots" aria-label="Jump to a skill">
          {services.map((x, i) => (
            <li key={x.id} className={i === idx ? 'on' : ''}>
              <button onClick={() => goStep(i)} aria-current={i === idx ? 'step' : undefined}>
                <span className="mono">0{i + 1}</span> {x.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
