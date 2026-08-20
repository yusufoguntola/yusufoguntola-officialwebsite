import Section from "../components/Section";
import { profile, qualifications, skillGroups, education, awards } from "../data/profile";

export default function About() {
  return (
    <div>
      <Section eyebrow="About" title="A bit about me">
        <div className="mb-8 flex items-center gap-4">
          <img
            src="/profile_img.jpg"
            alt="Yusuf Oguntola's profile picture, used across his social and professional profiles"
            className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-card object-cover shadow-sm"
          />
          <p className="text-sm text-muted">
            The avatar I go by everywhere online — LinkedIn, GitHub, you name it.
          </p>
        </div>

        <p className="max-w-3xl text-base leading-relaxed text-ink/80">{profile.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {qualifications.map((q) => (
            <span
              key={q}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-sm text-ink/80 shadow-sm"
            >
              {q}
            </span>
          ))}
        </div>

        <blockquote className="mt-8 max-w-2xl rounded-2xl border border-line bg-card p-6 font-display text-lg italic text-ink/90 shadow-sm">
          "{profile.quote.text}"
          <footer className="mt-3 font-mono text-xs not-italic text-muted">
            —{" "}
            <a href={profile.quote.sourceUrl} target="_blank" rel="noreferrer" className="text-green hover:text-green-deep">
              {profile.quote.source}
            </a>
          </footer>
        </blockquote>
      </Section>

      <Section eyebrow="Toolbox" title="Skills" wrapperClassName="border-y border-line/70 bg-cream-2/50">
        <div className="grid gap-8 md:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.label} className="rounded-2xl border border-line bg-card p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-brown">
                {group.label}
              </h3>
              <ul className="space-y-2 text-sm text-ink/80">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Background" title="Education">
        <div className="space-y-5">
          {education.map((e) => (
            <div key={e.program} className="flex flex-col justify-between gap-1 border-b border-line/60 pb-5 md:flex-row">
              <div>
                <p className="font-medium text-ink">{e.program}</p>
                <p className="text-sm text-muted">{e.org}</p>
              </div>
              <p className="font-mono text-sm text-brown-deep">{e.date}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Recognition" title="Awards" wrapperClassName="border-y border-line/70 bg-cream-2/50">
        <ul className="space-y-3 text-sm text-ink/80">
          {awards.map((a) => (
            <li key={a} className="flex gap-3">
              <span className="text-brown">—</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
