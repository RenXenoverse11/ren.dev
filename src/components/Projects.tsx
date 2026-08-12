import { projects } from '../data/site'
import { ExternalLinkIcon, GitHubIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

export function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <SectionHeading title="Projects" subtitle="A few things I've designed and built" />

        <div className="projects__grid">
          {projects.map((project) => (
            <article key={project.title} className="project card">
              <div className="project__cover" aria-hidden>
                <span>{project.cover}</span>
              </div>

              <div className="project__body">
                <h3 className="project__title">{project.title}</h3>
                <p className="project__description">{project.description}</p>

                <ul className="project__tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="project__links">
                  {project.demo ? (
                    <a className="project__link" href={project.demo}>
                      <ExternalLinkIcon /> Live Demo
                    </a>
                  ) : null}
                  {project.repo ? (
                    <a className="project__link" href={project.repo}>
                      <GitHubIcon /> Source
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
