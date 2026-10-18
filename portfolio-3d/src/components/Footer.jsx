import { nav } from '../lib'
import { site, contact } from '../content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <p className="footer-big" aria-hidden="true">
          {site.initials}
          <span className="dot" />
        </p>
        <div className="footer-cols">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p className="mono">{site.city} · {site.timezone}</p>
          <p>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> ·{' '}
            <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a> ·{' '}
            <a href={`mailto:${contact.email}`}>Email</a>
          </p>
          <a
            href="#home"
            className="to-top"
            onClick={(e) => {
              e.preventDefault()
              nav.goTo('home')
            }}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
