import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "../lib/blog";
import remarkTableStyle from "../lib/remarkTableStyle";
import usePageMeta from "../lib/usePageMeta";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "../lib/siteConfig";

// Tables keep their own horizontal scroll so a wide one never widens the page.
// External reference links open in a new tab; an in-page anchor (#section) or a
// future relative link stays in the same tab.
const markdownComponents = {
  table: ({ node: _node, ...props }) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ node: _node, href, ...props }) => {
    const isExternal = /^https?:\/\//i.test(href || "");
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  },
  img: ({ node: _node, ...props }) => <img loading="lazy" {...props} />,
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  const postImage = post?.image ? `${SITE_URL}${post.image}` : DEFAULT_OG_IMAGE;
  const postUrl = post ? `${SITE_URL}/blog/${post.slug}` : undefined;

  usePageMeta(
    post
      ? {
          title: `${post.title} — Yusuf Oguntola`,
          description: post.excerpt,
          type: "article",
          image: postImage,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: SITE_NAME,
            },
            image: postImage,
            url: postUrl,
          },
        }
      : { title: "Post not found — Yusuf Oguntola", noindex: true }
  );

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-4 font-display text-2xl font-semibold text-ink">Post not found</h1>
        <Link to="/blog" className="text-green hover:underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:max-w-4xl">
      <Link to="/blog" className="mb-8 inline-block text-sm font-medium text-green hover:text-green-deep hover:underline">
        ← Back to blog
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <p className="font-mono text-xs text-muted">{post.date}</p>
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-green-soft px-2.5 py-0.5 text-xs text-green-deep">
            {t}
          </span>
        ))}
      </div>

      <h1 className="mb-8 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
        {post.title}
      </h1>

      <div className="prose-blog">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkTableStyle]} components={markdownComponents}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
