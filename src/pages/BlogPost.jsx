import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "../lib/blog";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

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
    <article className="mx-auto max-w-3xl px-6 py-16">
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
