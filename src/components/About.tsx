import { useState } from 'react'
import { about, site } from '../data/site'
import { GraduationCapIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

export function About() {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = Boolean(about.featured.logo) && !logoFailed

  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeading title={about.heading} subtitle={about.subheading} />

        <div className="about__layout">
          <div className="about__body">
            <p className="about__lead">{about.lead}</p>

            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="about__paragraph">
                {paragraph}
              </p>
            ))}

            <p className="about__education">
              <GraduationCapIcon className="about__education-icon" />
              <span>
                <strong>{about.education.degree}</strong> — {about.education.school}
                {about.education.year ? `, ${about.education.year}` : ''}
              </span>
            </p>
          </div>

          <aside className="about__featured card">
            <span
              className={`about__featured-icon${showLogo ? ' about__featured-icon--logo' : ''}`}
              aria-hidden
            >
              {showLogo ? (
                <img
                  src={about.featured.logo}
                  alt=""
                  loading="lazy"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                about.featured.icon
              )}
            </span>
            <span className="about__featured-label">{about.featured.label}</span>
            <h3 className="about__featured-title">{about.featured.title}</h3>
            <p className="about__featured-body">{about.featured.body}</p>
          </aside>
        </div>

        <div className="about__actions">
          <a className="button button--primary" href="#contact">
            Let's Work Together
          </a>
          <a className="button button--ghost" href={site.resume} download>
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}
