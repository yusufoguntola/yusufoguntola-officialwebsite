import { Link } from "react-router-dom";
import Section from "../components/Section";
import { posts } from "../lib/blog";

export default function Blog() {
  return (
    <Section eyebrow="Writing" title="Blog">
      {posts.length === 0 ? (
        <p className="text-sm text-muted">
          No posts yet — add markdown files to{" "}
          <code className="rounded bg-cream-2 px-1.5 py-0.5 font-mono text-brown-deep">
            blog_content/
          </code>{" "}
          to get started.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green hover:shadow-md"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs text-muted">{post.date}</p>
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full bg-green-soft px-2.5 py-0.5 text-xs text-green-deep">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="mb-2 font-display text-xl font-medium text-ink group-hover:text-green-deep">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
