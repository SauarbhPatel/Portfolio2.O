import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ScrollTrigger, prefersReduced } from '../lib'
import { experience } from '../content'

// ── date helpers (all derived from the "Mon YYYY — Mon YYYY / Present" strings in content.js) ──
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
function parseMonth(s) {
  s = s.trim().toLowerCase()
  if (s.startsWith('present')) {
    const d = new Date()
    return d.getFullYear() * 12 + d.getMonth()
  }
  const [m, y] = s.split(/\s+/)
  return +y * 12 + MONTHS.indexOf(m.slice(0, 3))
}
function span(period) {
  const [a, b] = period.split(/—|–|-/)
  const start = parseMonth(a)
  const end = parseMonth(b)
  return { start, end, months: end - start + 1, present: /present/i.test(b) }
}
function fmt(m) {
  const y = Math.floor(m / 12)
  const r = m % 12
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', r ? `${r} mo${r > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ') || '1 mo'
}
const yearOf = (m) => Math.floor(m / 12)
const label = (m) => `${MONTHS[m % 12][0].toUpperCase()}${MONTHS[m % 12].slice(1)} ${yearOf(m)}`

// Builds a gentle S-curve that passes exactly through every node.
function buildPath(points, endY) {
  if (!points.length) return ''
  const x = points[0].x
  let d = `M ${x} 0 L ${x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    const dy = p1.y - p0.y
    const s = i % 2 ? 22 : -22
    d += ` C ${x + s} ${p0.y + dy * 0.4}, ${x + s} ${p1.y - dy * 0.4}, ${x} ${p1.y}`
  }
  d += ` L ${x} ${endY}`
  return d
}

export default function Timeline() {
  const [reduced] = useState(prefersReduced)
  const items = useMemo(() => experience.map((e) => ({ ...e, ...span(e.period) })), [])
  const first = Math.min(...items.map((i) => i.start))
  const last = Math.max(...items.map((i) => i.end))
  const total = last - first + 1
  // chronological, clipped so neighbouring roles never overlap (a shared month belongs to the newer role)
  const segments = useMemo(() => {
    const chron = items.map((it, i) => ({ ...it, i })).sort((a, b) => a.start - b.start)
    const segs = chron.map((it, k) => {
      const end = k < chron.length - 1 ? Math.min(it.end + 1, chron[k + 1].start) : it.end + 1
      return { i: it.i, l: ((it.start - first) / total) * 100, w: (Math.max(1, end - it.start) / total) * 100 }
    })
    // keep very short roles visible (min 3%), pushing earlier ones left so nothing overlaps
    let limit = 100
    for (let k = segs.length - 1; k >= 0; k--) {
      const sg = segs[k]
      sg.w = Math.max(sg.w, 3)
      if (sg.l + sg.w > limit) {
        const end = limit
        sg.l = Math.max(0, end - sg.w)
        if (k > 0 && segs[k - 1].l + segs[k - 1].w > sg.l) segs[k - 1].w = Math.max(3, sg.l - segs[k - 1].l)
      }
      limit = sg.l
    }
    return segs
  }, [items, first, total])

  const wrap = useRef(null)
  const svg = useRef(null)
  const path = useRef(null)
  const comet = useRef(null)
  const dots = useRef([])
  const [geo, setGeo] = useState({ d: '', w: 60, h: 0, nodes: [] })
  const [lit, setLit] = useState(reduced ? items.length : 0) // how many nodes are lit
  const active = Math.max(0, lit - 1)

  // measure node positions → path geometry
  useLayoutEffect(() => {
    const measure = () => {
      const box = wrap.current
      if (!box) return
      const top = box.getBoundingClientRect().top
      const rail = box.querySelector('.tl2-rail').getBoundingClientRect()
      const x = rail.width / 2
      const nodes = dots.current.map((el) => {
        const r = el.getBoundingClientRect()
        return { x, y: r.top + r.height / 2 - top }
      })
      const h = box.offsetHeight
      setGeo({ d: buildPath(nodes, h), w: rail.width, h, nodes })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // drive the line, the comet and the nodes from one "reading line" at 55% of the viewport
  useEffect(() => {
    if (reduced || !geo.d) return
    const p = path.current
    const len = p.getTotalLength()
    // y → length lookup (path is monotonic in y)
    const samples = []
    for (let i = 0; i <= 400; i++) samples.push(p.getPointAtLength((len * i) / 400))
    const lengthAtY = (y) => {
      if (y <= 0) return 0
      for (let i = 1; i < samples.length; i++)
        if (samples[i].y >= y) {
          const a = samples[i - 1]
          const b = samples[i]
          const t = (y - a.y) / Math.max(1e-6, b.y - a.y)
          return (len * (i - 1 + t)) / 400
        }
      return len
    }
    p.style.strokeDasharray = `${len}`
    let lastLit = -1
    const update = () => {
      const top = wrap.current.getBoundingClientRect().top
      const ratio = window.innerWidth <= 900 ? 0.42 : 0.55
      const readY = Math.min(geo.h, Math.max(0, window.innerHeight * ratio - top))
      const L = lengthAtY(readY)
      p.style.strokeDashoffset = `${len - L}`
      const pt = p.getPointAtLength(L)
      if (comet.current) {
        comet.current.style.transform = `translate(${pt.x}px, ${pt.y}px)`
        comet.current.style.opacity = readY > 2 && readY < geo.h - 2 ? 1 : 0
      }
      const n = geo.nodes.filter((nd) => nd.y <= readY + 1).length
      if (n !== lastLit) {
        lastLit = n
        setLit(n)
      }
    }
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top bottom', end: 'bottom top', onUpdate: update, onRefresh: update })
    update()
    return () => st.kill()
  }, [geo, reduced])

  const cur = items[active]

  return (
    <section id="experience" className="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <p className="kicker mono">Experience</p>
        <h2 id="exp-title" className="section-title">
          Five teams, <span className="hand">one habit:</span> shipping.
        </h2>

        <div className="tl2">
          {/* sticky "now viewing" panel */}
          <aside className="tl2-panel" aria-hidden="true">
            <p className="mono tl2-panel-k">
              {lit ? (
                <>
                  Chapter <b>0{active + 1}</b> / 0{items.length}
                </>
              ) : (
                <>Career · {fmt(total)}</>
              )}
            </p>
            <div className="tl2-years">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={lit ? cur.period : 'all'}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {!lit
                    ? `${yearOf(first)}–Now`
                    : cur.present
                      ? `${yearOf(cur.start)}–Now`
                      : yearOf(cur.start) === yearOf(cur.end)
                        ? yearOf(cur.start)
                        : `${yearOf(cur.start)}–${String(yearOf(cur.end)).slice(2)}`}
                </motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={lit ? cur.company : 'all'}
                className="tl2-now"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <p className="tl2-now-co">{lit ? cur.company : 'Scroll through my career'}</p>
                <p className="tl2-now-role">
                  {lit ? (
                    <>
                      {cur.role}
                      {cur.place ? ` · ${cur.place}` : ''} <span className="tl2-chip">{fmt(cur.months)}</span>
                    </>
                  ) : (
                    `${items.length} companies since ${label(first)}`
                  )}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* career bar: every role as a segment, proportional to its length */}
            <div className="tl2-bar">
              {segments.map((sg) => (
                <span
                  key={sg.i}
                  className={`tl2-seg ${lit && sg.i === active ? 'on' : ''} ${sg.i < lit ? 'past' : ''}`}
                  style={{ left: `calc(${sg.l}% + 2px)`, width: `calc(${sg.w}% - 4px)` }}
                />
              ))}
            </div>
            <div className="tl2-bar-labels mono">
              <span>{label(first)}</span>
              <span>Today</span>
            </div>
          </aside>

          {/* the drawn path + roles */}
          <div className="tl2-track" ref={wrap}>
            <div className="tl2-rail">
              <svg ref={svg} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
                <defs>
                  <linearGradient id="tl2-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB27A" />
                    <stop offset="100%" stopColor="#FF5A1F" />
                  </linearGradient>
                </defs>
                <path className="tl2-ghost" d={geo.d} />
                <path ref={path} className="tl2-line" d={geo.d} style={reduced ? { strokeDasharray: 'none' } : undefined} />
              </svg>
              {!reduced && <span ref={comet} className="tl2-comet" aria-hidden="true" />}
            </div>
            <ol className="tl2-list">
              {items.map((e, i) => {
                const state = i < lit ? (i === active ? 'is-active' : 'is-past') : ''
                return (
                  <li key={e.company} className={`tl2-item ${state}`}>
                    <span className="tl2-dot" ref={(el) => (dots.current[i] = el)} aria-hidden="true">
                      <span className="tl2-dot-core" />
                    </span>
                    <article className="tl2-card">
                      <header className="tl2-head">
                        <p className="mono tl2-period">{e.period}</p>
                        <span className="tl2-chip">{fmt(e.months)}</span>
                        {e.present && <span className="tl2-chip tl2-chip-now">● Current</span>}
                      </header>
                      <h3 className="tl2-company">{e.company}</h3>
                      <p className="tl2-role">
                        {e.role}
                        {e.place ? <span className="tl2-place"> · {e.place}</span> : null}
                      </p>
                      <p className="tl2-outcome">{e.outcome}</p>
                      <span className="tl2-idx mono" aria-hidden="true">
                        0{i + 1}
                      </span>
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
