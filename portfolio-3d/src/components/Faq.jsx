import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { faq } from '../content'

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div>
          <p className="kicker mono">FAQ</p>
          <h2 id="faq-title" className="section-title">
            Hiring or <span className="hand">collaborating?</span>
          </h2>
        </div>
        <ul className="faq-list">
          {faq.map((f, i) => {
            const on = open === i
            return (
              <li key={f.q} className={on ? 'on' : ''}>
                <h3>
                  <button aria-expanded={on} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
