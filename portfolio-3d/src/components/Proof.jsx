import { nav } from '../lib'
import { testimonials, site } from '../content'
import Magnetic from './Magnetic'

// Shows real testimonials when there are any; otherwise an honest "work with me" prompt.
export default function Proof() {
  if (testimonials.length) {
    return (
      <section className="proof" aria-labelledby="proof-title">
        <div className="wrap">
          <p className="kicker mono">Kind words</p>
          <h2 id="proof-title" className="section-title">What people say</h2>
          <ul className="quotes">
            {testimonials.map((t) => (
              <li key={t.name}>
                <blockquote>“{t.quote}”</blockquote>
                <p className="mono">{t.name} — {t.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }
  return (
    <section className="proof proof-empty" aria-labelledby="proof-title">
      <div className="wrap proof-box">
        <p className="kicker mono">No testimonials here — yet</p>
        <h2 id="proof-title" className="proof-title">
          I'd rather you see the work <span className="hand">than read about it.</span>
        </h2>
        <p className="proof-text">
          {site.stats[1].value} of my apps are live right now — open any of them on your phone. For the full history,
          see my LinkedIn or download my resume.
        </p>
        <Magnetic
          href="#contact"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault()
            nav.goTo('contact')
          }}
        >
          Work with me
        </Magnetic>
      </div>
    </section>
  )
}
