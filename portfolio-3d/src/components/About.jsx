import { useEffect, useRef } from 'react'
import { gsap, prefersReduced, asset } from '../lib'
import { about, site } from '../content'

export default function About() {
  const root = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-statement .w',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.about-statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
        }
      )
      gsap.from('.about-photo', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
      })
      gsap.from('.about-bio p', {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const words = about.statement.split(' ')
  return (
    <section id="about" className="about" ref={root} aria-labelledby="about-title">
      <div className="wrap">
        <p className="kicker mono">About</p>
        <h2 id="about-title" className="sr-only">About me</h2>
        <p className="about-statement">
          {words.map((w, i) => (
            <span className="w" key={i}>
              {w}{' '}
            </span>
          ))}
        </p>
        <div className="about-grid">
          <figure className="about-photo">
            <img src={asset(site.photo)} alt={`Portrait of ${site.name}`} width="900" height="900" loading="lazy" />
            <figcaption className="mono">
              {site.city} · {site.timezone}
            </figcaption>
          </figure>
          <div className="about-bio">
            {about.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
