import { useEffect, useRef } from 'react'
import { gsap, nav, prefersReduced } from '../lib'
import { site } from '../content'
import SplitText from './SplitText'
import Magnetic from './Magnetic'

export default function Hero({ ready }) {
  const root = useRef(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero .char', { yPercent: 115, rotate: 8, duration: 1.1, stagger: 0.035 })
        .from('.hero .reveal-up', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.7')
      gsap.to('.hero-copy', {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  const go = (e, id) => {
    e.preventDefault()
    nav.goTo(id)
  }

  return (
    <section id="home" className="hero" ref={root} aria-labelledby="hero-title" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div className="hero-copy">
        <p className="eyebrow reveal-up">
          <span className="mono">Now</span> {site.currently.role} @ {site.currently.company} · building{' '}
          {site.currently.product}
        </p>
        <h1 id="hero-title" className="hero-title">
          <SplitText text="Saurabh" className="line" />
          <SplitText text="Patel" className="line line-accent" />
        </h1>
        <p className="hero-lede reveal-up">{site.positioning}</p>
        <p className="hero-role mono reveal-up">
          {site.role} <span aria-hidden="true">·</span> {site.city}
        </p>
        <div className="hero-ctas reveal-up">
          <Magnetic href="#work" className="btn btn-primary" onClick={(e) => go(e, 'work')}>
            View work <span aria-hidden="true">→</span>
          </Magnetic>
          <Magnetic href="#contact" className="btn btn-ghost" onClick={(e) => go(e, 'contact')}>
            Get in touch
          </Magnetic>
        </div>
        <dl className="hero-stats reveal-up">
          {site.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="scroll-cue mono reveal-up" aria-hidden="true">
        Scroll <span />
      </p>
    </section>
  )
}
