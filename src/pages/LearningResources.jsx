import Section from "../components/Section";
import { learningResources } from "../data/learningResources";

export default function LearningResources() {
  return (
    <Section
      eyebrow="Learning resources"
      title="Things I've made that might help you learn"
    >
      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted">
        A running list of projects, write-ups and tools I've personally built and shared
        publicly — code you can read, fork, or learn a specific skill from.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {learningResources.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-brown-soft px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-brown-deep">
                {r.type}
              </span>
              <span className="text-xs text-muted">{r.skill}</span>
            </div>
            <h3 className="mb-2 font-display text-base font-medium text-ink group-hover:text-green-deep">
              {r.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{r.description}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}
