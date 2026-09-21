import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import { posts } from "../lib/blog";
import usePageMeta from "../lib/usePageMeta";

const stats = [
  { value: "10+", label: "years in technology leadership", accent: "text-green-soft" },
  { value: "60+", label: "engineers led", accent: "text-accent-soft" },
  { value: "24/7", label: "always-on exchange engine, built from scratch", accent: "text-green-soft" },
  { value: "3", label: "industry & academic awards", accent: "text-accent-soft" },
];

function StackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M2 13l10 5 10-5" />
      <path d="M2 18l10 5 10-5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" />
      <circle cx="18" cy="8" r="2.5" />
      <path d="M22 21v-1.5a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

function StrategyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

const pillars = [
  {
    icon: StackIcon,
    tone: "green",
    title: "Infrastructure at scale",
    body: "Built the continent's first 24/7 commodities exchange engine — order matching, validation and settlement running around the clock, designed for markets where connectivity can't be assumed.",
  },
  {
    icon: StrategyIcon,
    tone: "accent",
    title: "Business strategy",
    body: "Grounded in Stanford Graduate School of Business's LEAD program, I've helped technology-driven organizations turn business strategy into plans their engineering teams can actually execute — and I take on strategy consulting engagements.",
  },
  {
    icon: PhoneIcon,
    tone: "green",
    title: "Financial inclusion",
    body: "Built a USSD-based financial wallet so farmers without smartphones can settle trades and payments directly from a basic feature phone.",
  },
  {
    icon: TeamIcon,
    tone: "accent",
    title: "Engineering leadership",
    body: "Lead cross-functional engineering, product, data and design teams end-to-end, aligning technology strategy with business objectives.",
  },
];

export default function Home() {
  usePageMeta({
    title: "Yusuf Oguntola — Information Technology Leader",
    description:
      "Yusuf Olawale Oguntola — a seasoned technology leader driving innovation at the intersection of technology and business in Africa. Technology leadership, System Architecture Design, and Business Strategy.",
  });

  const latestPosts = posts.slice(0, 2);

  return (
    <div>
      <section className="bg-grain relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-20 md:pt-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1 font-mono text-xs text-green-deep">
            <span aria-hidden="true">👋</span>
            Hi, I'm {profile.name.split(" ")[0]}
          </p>
          <h1 className="mb-6 font-display text-4xl font-semibold leading-[1.1] text-ink md:text-6xl">
            Driving <span className="text-green">innovation</span> at the intersection of
            technology and business in Africa.
          </h1>
          <p className="mb-9 text-base leading-relaxed text-muted">{profile.tagline}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/experience"
              className="rounded-full bg-green px-6 py-3 text-sm font-medium text-cream shadow-sm shadow-green/20 transition-colors hover:bg-green-deep"
            >
              See my experience
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-line bg-card px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent-deep"
            >
              About me
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-14 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`font-display text-3xl font-semibold md:text-4xl ${s.accent}`}>{s.value}</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-wide text-cream/55">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-line/70">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Where I focus</p>
          <h2 className="mb-10 font-display text-2xl font-semibold text-ink md:text-3xl">
            What I bring to the table
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((p) => {
              const Icon = p.icon;
              const badgeClass = p.tone === "green" ? "bg-green-soft text-green-deep" : "bg-accent-soft text-accent-deep";
              return (
                <div key={p.title} className="rounded-2xl border border-line bg-card p-6 shadow-sm">
                  <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${badgeClass}`}>
                    <Icon />
                  </span>
                  <h3 className="mb-2 font-display text-lg font-medium text-ink">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">From the blog</h2>
            <Link to="/blog" className="text-sm font-medium text-green hover:text-green-deep hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green hover:shadow-md"
              >
                <p className="mb-2 font-mono text-xs text-muted">{post.date}</p>
                <h3 className="mb-2 font-display text-lg font-medium text-ink group-hover:text-green-deep">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line/70 bg-cream-2/60">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 font-display text-2xl font-semibold text-ink md:text-3xl">
              Open to new opportunities.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              If you're building something ambitious in technology leadership, business
              strategy, or digital infrastructure — or looking for a strategy consulting
              partner — I'd like to hear about it.
            </p>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="flex-shrink-0 rounded-full bg-green px-6 py-3 text-sm font-medium text-cream shadow-sm shadow-green/20 transition-colors hover:bg-green-deep"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  );
}
