export default function Section({ eyebrow, title, children, wrapperClassName = "" }) {
  return (
    <section className={wrapperClassName}>
      <div className="mx-auto max-w-5xl px-6 py-16">
        {eyebrow && (
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brown">{eyebrow}</p>
        )}
        {title && (
          <h2 className="mb-8 font-display text-2xl font-semibold text-ink md:text-3xl">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}
