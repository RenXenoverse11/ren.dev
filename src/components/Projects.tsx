import { useState } from 'react'
import { projects, type Project } from '../data/site'
import { Contributions } from './Contributions'
import { ExternalLinkIcon, GitHubIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

/** Screenshot when one is present, gradient + emoji until then. */
function ProjectCover({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)

  if (project.image && !failed) {
    return (
      <div className="project__cover project__cover--image">
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className="project__cover" aria-hidden>
      <span>{project.cover}</span>
    </div>
  )
}

export function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <SectionHeading title="Projects" subtitle="A few things I've designed and built" />

        <div className="projects__grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <Contributions />
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = Array.isArray(project.description)
    ? project.description
    : [project.description]

  // Only offer the toggle when there is more than the clamp will show.
  const isLong = paragraphs.length > 1 || paragraphs[0].length > 190

  return (
    <article className="project card">
      <ProjectCover project={project} />

      <div className="project__body">
        <h3 className="project__title">{project.title}</h3>

        <div className={`project__copy${isLong && !expanded ? ' project__copy--clamped' : ''}`}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="project__description">
              {paragraph}
            </p>
          ))}
        </div>

        {isLong ? (
          <button type="button" className="project__more" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        ) : null}

        <ul className="project__tags">
          {project.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>

        <div className="project__links">
          {project.demo ? (
            <a className="project__link" href={project.demo} target="_blank" rel="noreferrer">
              <ExternalLinkIcon /> Live Demo
            </a>
          ) : null}
          {project.repo ? (
            <a className="project__link" href={project.repo} target="_blank" rel="noreferrer">
              <GitHubIcon /> Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
