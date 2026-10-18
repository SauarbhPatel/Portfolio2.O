import { asset } from '../lib'

// Consistent project banner: the original artwork shown whole (never cropped),
// floating in a frame on a backdrop tinted with the project's accent colour.
export default function Banner({ project, size = 'card', className = '' }) {
  const p = project
  return (
    <div className={`banner banner-${size} ${className}`} style={{ '--c': p.accent }}>
      <span className="banner-glow" aria-hidden="true" />
      <span className="banner-grid" aria-hidden="true" />
      {p.image ? (
        <div className="banner-frame">
          <img
            src={asset(p.image)}
            alt={`${p.name} — app screens`}
            loading="lazy"
            decoding="async"
            width="1280"
            height="800"
          />
        </div>
      ) : (
        <div className="banner-type" role="img" aria-label={`${p.name} cover`}>
          <span className="banner-word">{p.name}</span>
          <span className="banner-chips">
            {p.links
              .filter((l) => l.label !== 'Website')
              .map((l) => (
                <span key={l.label}>{l.label}</span>
              ))}
          </span>
        </div>
      )}
      <span className="banner-tag mono" aria-hidden="true">
        {p.kind}
      </span>
    </div>
  )
}
