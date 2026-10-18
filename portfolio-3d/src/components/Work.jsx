import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { gsap, prefersReduced, isCoarse, asset, parseRoute, setRoute } from '../lib'
import { projects, allProjects } from '../content'
import Banner from './Banner'
import CaseStudy from './CaseStudy'
import AllProjects from './AllProjects'

function useRoute() {
  const [r, setR] = useState(parseRoute)
  useEffect(() => {
    const on = () => setR(parseRoute())
    window.addEventListener('popstate', on)
    window.addEventListener('routechange', on)
    return () => {
      window.removeEventListener('popstate', on)
      window.removeEventListener('routechange', on)
    }
  }, [])
  return r
}

function Card({ p, i, onOpen }) {
  const el = useRef(null)
  const move = (e) => {
    if (prefersReduced() || isCoarse()) return
    const r = el.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el.current, { rotateY: px * 7, rotateX: -py * 7, duration: 0.6, ease: 'power3.out' })
    el.current.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
    el.current.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
  }
  const leave = () => gsap.to(el.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' })
  return (
    <li className={`card ${i % 3 === 0 ? 'card-wide' : ''}`} style={{ '--c': p.accent }}>
      <article ref={el} className="card-inner" onPointerMove={move} onPointerLeave={leave}>
        <div className="card-media">
          <Banner project={p} />
        </div>
        <div className="card-body">
          <p className="mono card-meta">
            <span>{p.year}</span>
            <span>{p.kind}</span>
          </p>
          <h3 className="card-title">{p.name}</h3>
          <p className="card-sum">{p.summary}</p>
          <button className="card-open" onClick={() => onOpen(p.id)} aria-label={`Open case study: ${p.name}`}>
            <span>Case study</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </button>
        </div>
        <span className="card-glare" aria-hidden="true" />
      </article>
    </li>
  )
}

export default function Work() {
  const root = useRef(null)
  const route = useRoute()
  const opener = useRef(null)

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.work .card').forEach((c) => {
        gsap.from(c, { y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } })
        const f = c.querySelector('.banner-frame, .banner-type')
        if (f)
          gsap.fromTo(f, { yPercent: 5 }, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.from('.work-head .char', { yPercent: 110, stagger: 0.03, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: '.work-head', start: 'top 80%' } })
      gsap.from('.all-cta', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.all-cta', start: 'top 88%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const remember = () => (opener.current = document.activeElement)
  const restore = () => setTimeout(() => opener.current?.focus?.(), 40)

  const list = route.all ? allProjects : projects
  const idx = route.id ? list.findIndex((x) => x.id === route.id) : -1
  const current = idx >= 0 ? list[idx] : route.id ? allProjects.find((x) => x.id === route.id) : null
  const next = current ? list[(Math.max(idx, 0) + 1) % list.length] : null
  const prefix = route.all ? '#/projects/' : '#/work/'

  return (
    <section id="work" className="work" ref={root} aria-labelledby="work-title">
      <div className="wrap">
        <div className="work-head">
          <p className="kicker mono">Selected work · {projects.length} case studies</p>
          <h2 id="work-title" className="section-title" aria-label="Selected work">
            {'Selected work'.split('').map((c, i) => (
              <span className="char-mask" key={i} aria-hidden="true">
                <span className="char">{c === ' ' ? ' ' : c}</span>
              </span>
            ))}
          </h2>
        </div>
        <ul className="cards">
          {projects.map((p, i) => (
            <Card
              key={p.id}
              p={p}
              i={i}
              onOpen={(id) => {
                remember()
                setRoute(`#/work/${id}`)
              }}
            />
          ))}
        </ul>

        <a
          className="all-cta"
          href="#/projects"
          onClick={(e) => {
            e.preventDefault()
            remember()
            setRoute('#/projects')
          }}
        >
          <span className="all-thumbs" aria-hidden="true">
            {allProjects
              .filter((p) => p.image)
              .slice(6, 11)
              .map((p) => (
                <img key={p.id} src={asset(p.image)} alt="" loading="lazy" width="1280" height="800" />
              ))}
          </span>
          <span className="all-text">
            <span className="mono">Full archive</span>
            <span className="all-title">
              See all {allProjects.length} projects <span aria-hidden="true">→</span>
            </span>
          </span>
        </a>
      </div>

      <AnimatePresence>
        {route.all && (
          <AllProjects
            key="all"
            onOpen={(id) => {
              remember()
              setRoute(`#/projects/${id}`)
            }}
            onClose={() => {
              setRoute('', true)
              restore()
            }}
            caseOpen={!!current}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {current && (
          <CaseStudy
            key={current.id}
            p={current}
            next={next}
            onNext={() => setRoute(prefix + next.id, true)}
            onClose={() => {
              setRoute(route.all ? '#/projects' : '', true)
              restore()
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
