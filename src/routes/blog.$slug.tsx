import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { fetchPostBySlug } from "@/lib/store-api";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article — Sunwood Mango Farm Journal" },
      { name: "description", content: "Read the latest from the Sunwood Mango Farm journal." },
      { property: "og:title", content: "Sunwood Mango Farm Journal" },
      { property: "og:description", content: "Stories and tips from our mango orchards." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({ queryKey: ["post", slug], queryFn: () => fetchPostBySlug(slug) });

  useEffect(() => {
    if (!post) return;
    document.title = post.seo_title || post.title;
    const set = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    if (post.seo_description || post.excerpt) set("description", post.seo_description || post.excerpt);
    if (post.canonical_url) {
      let l = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!l) { l = document.createElement("link"); l.rel = "canonical"; document.head.appendChild(l); }
      l.href = post.canonical_url;
    }
  }, [post]);

  return (
    <SiteShell>
      {() => (
        <article className="container-x max-w-3xl py-10 md:py-16">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> All posts
          </Link>
          {isLoading && <p className="mt-8 text-muted-foreground">Loading…</p>}
          {!isLoading && !post && <p className="mt-8 text-muted-foreground">Post not found.</p>}
          {post && (
            <>
              <div className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">{post.category}</div>
              <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{post.title}</h1>
              {post.tagline && <p className="mt-3 text-lg text-muted-foreground">{post.tagline}</p>}
              <div className="mt-4 text-sm text-muted-foreground">
                {post.author && <>By {post.author} · </>}{new Date(post.publish_date).toLocaleDateString()} · {post.reading_minutes} min read
              </div>
              {post.cover_image_url && <img src={post.cover_image_url} alt={post.image_alt || post.title} className="mt-8 w-full rounded-3xl object-cover" />}
              <div className="prose-content mt-8 space-y-4 leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs">#{t}</span>)}
                </div>
              )}
            </>
          )}
        </article>
      )}
    </SiteShell>
  );
}
