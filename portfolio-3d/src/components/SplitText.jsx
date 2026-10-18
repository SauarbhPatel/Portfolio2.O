// Splits text into per-letter spans for animation while keeping it readable to screen readers.
export default function SplitText({ text, as: Tag = 'span', className = '', charClass = 'char' }) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, wi, arr) => (
        <span className="word" aria-hidden="true" key={wi}>
          {[...word].map((ch, ci) => (
            <span className="char-mask" key={ci}>
              <span className={charClass}>{ch}</span>
            </span>
          ))}
          {wi < arr.length - 1 && <span className="space">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}
