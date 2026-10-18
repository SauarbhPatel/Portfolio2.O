import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { nav, trapFocus, asset, lockScroll, unlockScroll, setRoute } from '../lib'
import { site, contact } from '../content'
import Magnetic from './Magnetic'

const links = [
  { id: 'work', label: 'Selected work' },
  { id: 'all-projects', label: 'All projects', href: '#/projects' },
  { id: 'stage', label: 'What I do' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const btn = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!open) return
    lockScroll()
    const t = setTimeout(() => panel.current?.querySelector('a, button')?.focus(), 60)
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else trapFocus(panel.current, e)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open])

  const close = (restore = true) => {
    setOpen(false)
    if (restore) setTimeout(() => btn.current?.focus(), 10)
  }
  const go = (e, id) => {
    e.preventDefault()
    close(false)
    if (id === 'all-projects') return setTimeout(() => setRoute('#/projects'), 350)
    setTimeout(() => nav.goTo(id), 120)
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#home" className="logo" aria-label={`${site.name}, back to top`} onClick={(e) => go(e, 'home')}>
          {site.initials}
          <span className="dot" />
        </a>
        <p className="nav-status">
          <span className="pulse" /> Open to full-time roles
        </p>
        <div className="nav-right">
          <a className="nav-link" href={asset(site.resume)} target="_blank" rel="noopener" download>
            Resume
          </a>
          <Magnetic
            as="button"
            ref={btn}
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span className="menu-lines" aria-hidden="true" />
            Menu
          </Magnetic>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            ref={panel}
            initial={{ clipPath: 'circle(0% at calc(100% - 64px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 64px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 64px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-top">
              <span className="mono">Menu</span>
              <button className="menu-close" onClick={() => close()} aria-label="Close menu">
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
            <nav className="menu-body" aria-label="Sections">
              <ol className="menu-links">
                {links.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a href={l.href || `#${l.id}`} onClick={(e) => go(e, l.id)}>
                      <span className="mono idx">0{i + 1}</span>
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ol>
              <motion.aside
                className="menu-aside"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <img src={asset(site.photo)} alt="" width="120" height="120" />
                <p className="mono">Say hello</p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <div className="menu-socials">
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                  <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                  <a href={asset(site.resume)} target="_blank" rel="noopener" download>Resume ↓</a>
                </div>
              </motion.aside>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
