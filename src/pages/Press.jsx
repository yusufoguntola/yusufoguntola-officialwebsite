import Section from "../components/Section";
import { interviews } from "../data/interviews";

export default function Press() {
  return (
    <Section eyebrow="Press" title="Interviews & features">
      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted">
        A collection of interviews and features where I've talked publicly about the work,
        the teams, and the thinking behind it.
      </p>

      <div className="space-y-5">
        {interviews.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green hover:shadow-md"
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brown-soft px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-brown-deep">
                {item.publication}
              </span>
              <span className="font-mono text-xs text-muted">{item.date}</span>
            </div>
            <h3 className="mb-2 font-display text-lg font-medium text-ink group-hover:text-green-deep">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{item.excerpt}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}
