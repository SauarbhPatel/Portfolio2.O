import { lazy, Suspense, useEffect, useState } from 'react'
import { hasWebGL, asset } from '../lib'

const Scene = lazy(() => import('../three/Scene'))

// Fixed 3D layer behind the hero and the sticky stage. Pauses when both are off-screen.
export default function SceneLayer({ ready }) {
  const [gl] = useState(hasWebGL)
  const [active, setActive] = useState(true)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const ids = ['home', 'stage']
    const vis = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => vis.set(e.target.id, e.isIntersecting))
        setActive([...vis.values()].some(Boolean))
      },
      { rootMargin: '0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => setShown(true), 50)
      return () => clearTimeout(t)
    }
  }, [ready])

  return (
    <div className={`scene-layer ${shown ? 'is-shown' : ''} ${active ? '' : 'is-off'}`} aria-hidden="true">
      {gl ? (
        ready && (
          <Suspense fallback={null}>
            <Scene active={active} />
          </Suspense>
        )
      ) : (
        <img className="scene-fallback" src={asset('/hero-fallback.webp')} alt="" />
      )}
    </div>
  )
}
