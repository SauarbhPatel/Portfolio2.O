import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { trapFocus, lockScroll, unlockScroll } from '../lib'
import Banner from './Banner'

export default function CaseStudy({ p, onClose, onNext, next }) {
  const panel = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    panel.current?.querySelector('.cs-close')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current()
      else trapFocus(panel.current, e)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    lockScroll()
    return () => unlockScroll()
  }, [])

  return createPortal(
    <motion.div
      className="cs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-title"
      ref={panel}
      data-lenis-prevent
      style={{ '--c': p.accent }}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="cs-bar">
        <span className="mono">Case study</span>
        <button className="cs-close" onClick={onClose}>
          Close <span aria-hidden="true">✕</span>
        </button>
      </div>
      <motion.div
        className="cs-content"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="cs-head">
          <p className="mono cs-meta">
            {p.year} · {p.kind}
          </p>
          <h2 id="cs-title" className="cs-title">
            {p.name}
          </h2>
          <p className="cs-sum">{p.summary}</p>
          {p.role && <p className="cs-role"><span className="mono">Role</span> {p.role}</p>}
        </header>
        <div className="cs-media">
          <Banner project={p} size="hero" />
        </div>
        <div className="cs-grid">
          <section>
            <h3 className="mono">01 — The problem</h3>
            <p>{p.problem}</p>
          </section>
          <section>
            <h3 className="mono">02 — What I did</h3>
            <ul className="cs-list">
              {p.did.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mono">03 — Outcome</h3>
            {p.result ? <p className="cs-result">{p.result}</p> : <p className="cs-muted">No metrics listed yet — the features above describe what it does.</p>}
            <ul className="tags">
              {p.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {p.links.length > 0 && (
              <div className="cs-links">
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
        <button className="cs-next" onClick={onNext}>
          <span className="mono">Next project</span>
          <span className="cs-next-name">{next.name} →</span>
        </button>
      </motion.div>
    </motion.div>,
    document.body
  )
}
