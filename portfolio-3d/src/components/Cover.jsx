import { asset } from '../lib'

// Project image, or a generated typographic cover when no screenshot is provided yet.
export default function Cover({ project, className = '' }) {
  if (project.image) {
    return <img className={className} src={asset(project.image)} alt={`${project.name} app screens`} loading="lazy" decoding="async" width="1280" height="800" />
  }
  return (
    <div className={`cover-gen ${className}`} style={{ '--c': project.accent }} role="img" aria-label={`${project.name} cover`}>
      <span className="cover-word">{project.name}</span>
      <span className="cover-chips">
        {project.links
          .filter((l) => l.label !== 'Website')
          .map((l) => (
            <span key={l.label}>{l.label}</span>
          ))}
      </span>
    </div>
  )
}
