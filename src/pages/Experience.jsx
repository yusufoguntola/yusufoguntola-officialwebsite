import Section from "../components/Section";
import { experience } from "../data/profile";

export default function Experience() {
  return (
    <Section eyebrow="Career" title="Experience">
      <div className="relative space-y-10 border-l-2 border-line pl-8">
        {experience.map((job) => (
          <div key={`${job.org}-${job.start}`} className="relative">
            <span className="absolute -left-[calc(2rem+7px)] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cream bg-green" />
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-lg font-medium text-ink">{job.title}</h3>
              <p className="font-mono text-xs text-muted">
                {job.start} — {job.end}
              </p>
            </div>
            <p className="mb-3 text-sm font-medium text-brown-deep">
              {job.org} · {job.location}
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink/75">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-1 text-green">·</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
