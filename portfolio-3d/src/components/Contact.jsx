import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { contact, site } from '../content'
import { asset } from '../lib'
import Magnetic from './Magnetic'

const { provider, formspreeId, whatsappNumber } = contact.form
const canFormspree = provider === 'formspree' && !!formspreeId

export default function Contact() {
  const [vals, setVals] = useState({ name: '', email: '', message: '' })
  const [channel, setChannel] = useState(provider === 'whatsapp' ? 'whatsapp' : 'email')
  const [status, setStatus] = useState('idle') // idle | sending | sent | handoff | error
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!vals.name.trim()) e.name = 'Please add your name.'
    if (!/^\S+@\S+\.\S+$/.test(vals.email)) e.email = 'Please add a valid email.'
    if (vals.message.trim().length < 10) e.message = 'A sentence or two helps (10+ characters).'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const body = `${vals.message}\n\n— ${vals.name} (${vals.email})`
    if (canFormspree) {
      setStatus('sending')
      try {
        const r = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(vals),
        })
        setStatus(r.ok ? 'sent' : 'error')
      } catch {
        setStatus('error')
      }
      return
    }
    // No server endpoint: hand the message to the visitor's own email app / WhatsApp. Nothing is sent from here.
    const url =
      channel === 'whatsapp'
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`
        : `mailto:${contact.email}?subject=${encodeURIComponent(`Hello from ${vals.name}`)}&body=${encodeURIComponent(body)}`
    window.open(url, channel === 'whatsapp' ? '_blank' : '_self')
    setStatus('handoff')
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="kicker mono">Contact</p>
        <h2 id="contact-title" className="contact-title">
          Let's build your <span className="hand">next app.</span>
        </h2>
        <div className="contact-grid">
          <div className="contact-side">
            <p className="contact-lede">
              Open to full-time roles and collaborative projects — remote or with relocation. Tell me about the product and
              I'll get back to you.
            </p>
            <Magnetic href={`mailto:${contact.email}`} className="contact-mail">
              {contact.email}
            </Magnetic>
            <ul className="contact-links">
              <li><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>
              <li><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
              <li><a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
              <li><a href={asset(site.resume)} target="_blank" rel="noopener" download>Resume (PDF) ↓</a></li>
            </ul>
          </div>

          <div className="form-wrap">
            <AnimatePresence mode="wait">
              {status === 'sent' || status === 'handoff' ? (
                <motion.div
                  key="done"
                  className="form-done"
                  role="status"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="done-mark" aria-hidden="true">{status === 'sent' ? '✓' : '↗'}</span>
                  {status === 'sent' ? (
                    <>
                      <h3>Message sent.</h3>
                      <p>Thanks, {vals.name.split(' ')[0]} — it's in my inbox. I'll reply to {vals.email}.</p>
                    </>
                  ) : (
                    <>
                      <h3>Almost there — press send.</h3>
                      <p>
                        Your {channel === 'whatsapp' ? 'WhatsApp' : 'email app'} should have opened with your message filled in.
                        <strong> Nothing has been sent yet</strong> — hit send there. If nothing opened, email me at{' '}
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                      </p>
                    </>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => setStatus('idle')}>
                    Write another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" className="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={`field ${errors.name ? 'bad' : ''}`}>
                    <label htmlFor="f-name">Your name</label>
                    <input id="f-name" name="name" autoComplete="name" value={vals.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                    {errors.name && <p className="err" id="e-name">{errors.name}</p>}
                  </div>
                  <div className={`field ${errors.email ? 'bad' : ''}`}>
                    <label htmlFor="f-email">Email</label>
                    <input id="f-email" name="email" type="email" autoComplete="email" value={vals.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
                    {errors.email && <p className="err" id="e-email">{errors.email}</p>}
                  </div>
                  <div className={`field ${errors.message ? 'bad' : ''}`}>
                    <label htmlFor="f-msg">What are you building?</label>
                    <textarea id="f-msg" name="message" rows="5" value={vals.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-msg' : undefined} />
                    {errors.message && <p className="err" id="e-msg">{errors.message}</p>}
                  </div>
                  {!canFormspree && (
                    <fieldset className="channel">
                      <legend className="mono">Send via</legend>
                      {['email', 'whatsapp'].map((c) => (
                        <label key={c} className={channel === c ? 'on' : ''}>
                          <input type="radio" name="channel" value={c} checked={channel === c} onChange={() => setChannel(c)} />
                          {c === 'email' ? 'Email app' : 'WhatsApp'}
                        </label>
                      ))}
                    </fieldset>
                  )}
                  <div className="form-foot">
                    <Magnetic as="button" type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : canFormspree ? 'Send message' : `Open ${channel === 'whatsapp' ? 'WhatsApp' : 'email'} →`}
                    </Magnetic>
                    {status === 'error' && (
                      <p className="err" role="alert">
                        Couldn't send right now. Please email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                      </p>
                    )}
                    {!canFormspree && <p className="form-note">Opens your own app with the message ready — you press send.</p>}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
