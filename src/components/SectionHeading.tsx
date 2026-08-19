export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="section-heading" data-reveal>
      <h2 className="section-heading__title">{title}</h2>
      <span className="section-heading__rule" aria-hidden />
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </div>
  )
}
