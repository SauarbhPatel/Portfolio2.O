import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../content'

export default function Preloader({ onDone, reduced }) {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    let raf
    let done = false
    const start = performance.now()
    const min = reduced ? 0 : 1500
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
    let fontsReady = false
    fonts.then(() => (fontsReady = true))
    const loop = (now) => {
      const p = Math.min(1, (now - start) / Math.max(min, 1))
      setCount(Math.round((fontsReady ? p : Math.min(p, 0.9)) * 100))
      if (p >= 1 && fontsReady && !done) {
        done = true
        setShow(false)
        onDone()
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          aria-hidden="true"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="pre-mark"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.initials}
            <span className="dot" />
          </motion.div>
          <div className="pre-foot">
            <span>{site.name}</span>
            <span className="pre-count">{String(count).padStart(3, '0')}</span>
          </div>
          <div className="pre-bar" style={{ transform: `scaleX(${count / 100})` }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
