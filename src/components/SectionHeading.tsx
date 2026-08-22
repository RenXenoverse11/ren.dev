type SectionHeadingProps = {
  title: string
  subtitle?: string
  /**
   * Heading level. Sections on the home page sit under the hero's <h1>, so
   * they default to <h2>. A routed page that has no hero needs its own <h1>,
   * or the document has no top-level heading at all: screen-reader users lose
   * the "what is this page" landmark, and it fails axe's page-has-heading-one.
   *
   * Only the tag changes; the styling is identical either way.
   */
  as?: 'h1' | 'h2'
}

export function SectionHeading({ title, subtitle, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className="section-heading" data-reveal>
      <Tag className="section-heading__title">{title}</Tag>
      <span className="section-heading__rule" aria-hidden />
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </div>
  )
}
