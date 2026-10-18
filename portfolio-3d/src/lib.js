import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const asset = (p) => (p ? import.meta.env.BASE_URL + p.replace(/^\//, '') : p)

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isCoarse = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

// Shared, mutable state read every frame by the 3D scene (no React re-renders).
export const scene = {
  intro: 0, // 0 → 1 once the preloader finishes
  morph: 0, // 0 = stacked hero pose, 1 = fanned stage pose
  stage: 0, // 0 → 1 across the sticky stage (which face is in front)
  mouse: { x: 0, y: 0 },
  reduced: false,
  mobile: false,
}

// Lenis instance is assigned in App so the menu/curtain can stop & scroll it.
export const smooth = { lenis: null }

// Focus trap helper used by the menu and the case-study view.
export function trapFocus(container, e) {
  if (e.key !== 'Tab' || !container) return
  const f = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'
  )
  if (!f.length) return
  const first = f[0]
  const last = f[f.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

// Section navigation (set by <Curtain/>). Falls back to a plain jump.
export const nav = {
  goTo: (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (smooth.lenis) smooth.lenis.scrollTo(el, { immediate: true })
    else el.scrollIntoView()
    focusSection(el)
  },
}

export function focusSection(el) {
  const target = el.querySelector('h1, h2') || el
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

// Nested scroll locks (menu, all-projects view, case study).
let locks = 0
export function lockScroll() {
  locks++
  smooth.lenis?.stop()
  document.body.style.overflow = 'hidden'
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks) return
  document.body.style.overflow = ''
  smooth.lenis?.start()
}

// Tiny hash router for the project views: #/projects, #/projects/<id>, #/work/<id>
export function parseRoute() {
  const h = window.location.hash
  let m = h.match(/^#\/projects\/([\w-]+)$/)
  if (m) return { all: true, id: m[1] }
  if (h === '#/projects') return { all: true, id: null }
  m = h.match(/^#\/work\/([\w-]+)$/)
  if (m) return { all: false, id: m[1] }
  return { all: false, id: null }
}
export function setRoute(hash, replace = false) {
  const url = hash || window.location.pathname + window.location.search
  if (replace) history.replaceState(null, '', url)
  else history.pushState(null, '', url)
  window.dispatchEvent(new Event('routechange'))
}
