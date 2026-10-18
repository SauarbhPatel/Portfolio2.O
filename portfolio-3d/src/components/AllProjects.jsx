import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { lockScroll, unlockScroll, trapFocus } from '../lib'
import { allProjects } from '../content'
import Banner from './Banner'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'app', label: 'Mobile apps' },
  { id: 'web', label: 'Web' },
  { id: 'admin', label: 'Admin & partner' },
  { id: 'live', label: 'Live on stores' },
]
const isLive = (p) => p.links.some((l) => /play\.google|apps\.apple/.test(l.href))

export default function AllProjects({ onOpen, onClose, caseOpen }) {
  const panel = useRef(null)
  const [f, setF] = useState('all')
  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((x) => [x.id, allProjects.filter((p) => x.id === 'all' || (x.id === 'live' ? isLive(p) : p.categories.includes(x.id))).length])
      ),
    []
  )
  const list = allProjects.filter((p) => f === 'all' || (f === 'live' ? isLive(p) : p.categories.includes(f)))

  useEffect(() => {
    lockScroll()
    panel.current?.querySelector('.ap-close')?.focus()
    return () => unlockScroll()
  }, [])

  useEffect(() => {
    if (caseOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else trapFocus(panel.current, e)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [caseOpen, onClose])

  return createPortal(
    <motion.div
      className="ap"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ap-title"
      ref={panel}
      data-lenis-prevent
      aria-hidden={caseOpen || undefined}
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="ap-bar">
        <span className="mono">All projects</span>
        <button className="ap-close" onClick={onClose}>
          Close <span aria-hidden="true">✕</span>
        </button>
      </div>
      <div className="ap-content">
        <header className="ap-head">
          <h2 id="ap-title" className="ap-title">
            Everything I've <span className="hand">built.</span>
          </h2>
          <p className="ap-sub">
            {allProjects.length} projects across mobile, web and admin tools. Open any of them for the full case study.
          </p>
          <div className="ap-filters" role="group" aria-label="Filter projects">
            {FILTERS.map((x) => (
              <button key={x.id} className={f === x.id ? 'on' : ''} aria-pressed={f === x.id} onClick={() => setF(x.id)}>
                {x.label} <span className="mono">{counts[x.id]}</span>
              </button>
            ))}
          </div>
        </header>
        <motion.ul className="ap-grid" layout>
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + Math.min(i, 8) * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ '--c': p.accent }}
            >
              <button className="ap-card" onClick={() => onOpen(p.id)} aria-label={`Open case study: ${p.name}`}>
                <Banner project={p} size="sm" />
                <span className="ap-meta mono">
                  <span>{p.year}</span>
                  {isLive(p) && <span className="ap-live">● Live</span>}
                </span>
                <span className="ap-name">{p.name}</span>
                <span className="ap-sum">{p.summary}</span>
                <span className="ap-go" aria-hidden="true">Case study ↗</span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>,
    document.body
  )
}
