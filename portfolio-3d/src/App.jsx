import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, scene, smooth, prefersReduced, isCoarse } from './lib'
import Preloader from './components/Preloader'
import Curtain from './components/Curtain'
import Nav from './components/Nav'
import SceneLayer from './components/SceneLayer'
import Hero from './components/Hero'
import Stage from './components/Stage'
import About from './components/About'
import Marquee from './components/Marquee'
import Work from './components/Work'
import Timeline from './components/Timeline'
import Proof from './components/Proof'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const [reduced] = useState(prefersReduced)

  useEffect(() => {
    scene.reduced = reduced
    scene.mobile = window.innerWidth < 768 || isCoarse()
    document.documentElement.classList.toggle('reduced', reduced)
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    smooth.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      smooth.lenis = null
    }
  }, [reduced])

  useEffect(() => {
    if (!ready) return
    smooth.lenis?.start()
    gsap.to(scene, { intro: 1, duration: reduced ? 0 : 1.6, ease: 'power3.out' })
    const onMove = (e) => {
      scene.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      scene.mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    ScrollTrigger.refresh()
    return () => window.removeEventListener('pointermove', onMove)
  }, [ready, reduced])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Preloader onDone={() => setReady(true)} reduced={reduced} />
      <Curtain />
      <Nav />
      <SceneLayer ready={ready} />
      <main id="main" tabIndex={-1}>
        <Hero ready={ready} />
        <Stage />
        <div className="solid">
          <About />
          <Marquee />
          <Work />
          <Timeline />
          <Proof />
          <Faq />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
