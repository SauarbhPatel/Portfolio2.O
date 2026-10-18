import { useRef } from 'react'
import { gsap, prefersReduced, isCoarse } from '../lib'

// Wraps a link/button; it leans toward the pointer and springs back.
export default function Magnetic({ as: Tag = 'a', className = '', strength = 0.35, children, ref: outer, ...rest }) {
  const ref = useRef(null)
  const setRef = (el) => {
    ref.current = el
    if (typeof outer === 'function') outer(el)
    else if (outer) outer.current = el
  }
  const inner = useRef(null)
  const off = () => prefersReduced() || isCoarse()
  const move = (e) => {
    if (off()) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    gsap.to(ref.current, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' })
    gsap.to(inner.current, { x: x * strength * 0.4, y: y * strength * 0.4, duration: 0.4, ease: 'power3.out' })
  }
  const leave = () => {
    gsap.to([ref.current, inner.current], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' })
  }
  return (
    <Tag ref={setRef} className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>
      <span ref={inner} className="magnetic-inner">{children}</span>
    </Tag>
  )
}
