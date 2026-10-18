import { useEffect, useRef } from 'react'
import { gsap, nav, smooth, prefersReduced, focusSection } from '../lib'

const labels = { work: 'Selected work', about: 'About', experience: 'Experience', contact: 'Contact', stage: 'What I do', faq: 'FAQ', home: 'Home' }

// Full-screen wipe used when jumping between sections from the menu / CTAs.
export default function Curtain() {
  const el = useRef(null)
  const label = useRef(null)
  useEffect(() => {
    nav.goTo = (id) => {
      const target = document.getElementById(id)
      if (!target) return
      const jump = () => {
        if (smooth.lenis) smooth.lenis.scrollTo(target, { immediate: true, force: true })
        else target.scrollIntoView()
        focusSection(target)
      }
      if (prefersReduced()) return jump()
      label.current.textContent = labels[id] || ''
      gsap
        .timeline()
        .set(el.current, { display: 'flex', yPercent: 100 })
        .to(el.current, { yPercent: 0, duration: 0.55, ease: 'power4.inOut' })
        .fromTo(label.current, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, '-=0.2')
        .add(jump)
        .to(el.current, { yPercent: -100, duration: 0.6, ease: 'power4.inOut', delay: 0.15 })
        .set(el.current, { display: 'none' })
    }
  }, [])
  return (
    <div className="curtain" ref={el} aria-hidden="true">
      <span ref={label} className="curtain-label" />
    </div>
  )
}
