import { useState, type FormEvent } from 'react'
import { contactEndpoint, site, socials } from '../data/site'
import { revealDelay } from '../hooks/useReveal'
import { MailIcon, MapPinIcon, socialIcons } from './Icons'
import { SectionHeading } from './SectionHeading'

type Fields = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'

const emptyFields: Fields = { name: '', email: '', subject: '', message: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields: Fields): Errors {
  const errors: Errors = {}
  if (!fields.name.trim()) errors.name = 'Please enter your name.'
  if (!fields.email.trim()) errors.email = 'Please enter your email.'
  else if (!emailPattern.test(fields.email.trim())) errors.email = 'That email does not look right.'
  if (!fields.subject.trim()) errors.subject = 'Please add a subject.'
  if (fields.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

export function Contact() {
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(fields)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // No endpoint configured — hand off to the visitor's mail client.
    if (!contactEndpoint) {
      const body = `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        fields.subject,
      )}&body=${encodeURIComponent(body)}`
      setStatus('sent')
      setFields(emptyFields)
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!response.ok) throw new Error(`Request failed with ${response.status}`)
      setStatus('sent')
      setFields(emptyFields)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact">
      <div className="container" id="contact">
        <SectionHeading title="Contact" subtitle="Have a project in mind? Let's talk." />

        <div className="contact__grid">
          <div className="contact__info" data-reveal>
            <h3 className="contact__heading">Let's build something together</h3>
            <p className="contact__text">
              I'm open to freelance work, full-time roles, and interesting collaborations. Send a
              message and I'll get back to you as soon as I can.
            </p>

            <ul className="contact__details">
              <li>
                <span className="contact__icon" aria-hidden>
                  <MailIcon />
                </span>
                <div>
                  <span className="contact__label">Email</span>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </li>
              <li>
                <span className="contact__icon" aria-hidden>
                  <MapPinIcon />
                </span>
                <div>
                  <span className="contact__label">Location</span>
                  <span>{site.location}</span>
                </div>
              </li>
            </ul>

            <div className="contact__socials">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon]
                return (
                  <a
                    key={social.label}
                    className="social-link"
                    href={social.href}
                    aria-label={social.label}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          <form
            className="contact__form card"
            onSubmit={onSubmit}
            noValidate
            data-reveal
            style={revealDelay(1)}
          >
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={fields.name}
                  onChange={update('name')}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <span className="field__error">{errors.name}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <span className="field__error">{errors.email}</span> : null}
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={fields.subject}
                onChange={update('subject')}
                placeholder="Project inquiry"
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject ? <span className="field__error">{errors.subject}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={fields.message}
                onChange={update('message')}
                placeholder="Your message"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? <span className="field__error">{errors.message}</span> : null}
            </div>

            <button className="button button--primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            <p className="contact__status" role="status">
              {status === 'sent' ? 'Thanks! Your message is on its way.' : null}
              {status === 'error' ? 'Something went wrong. Please email me directly.' : null}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
