import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/SiteShell";
import { fetchPublishedPosts } from "@/lib/store-api";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Mango Journal — Sunwood Mango Farm Blog" },
      { name: "description", content: "Stories, recipes and growing tips from the Sunwood Mango Farm orchards in Multan." },
      { property: "og:title", content: "Mango Journal — Sunwood Mango Farm" },
      { property: "og:description", content: "Stories, recipes and tips from our mango orchards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data = [], isLoading } = useQuery({ queryKey: ["posts"], queryFn: fetchPublishedPosts });
  return (
    <SiteShell>
      {() => (
        <section className="container-x py-12 md:py-20">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Mango <span className="italic text-gradient-sun">Journal</span></h1>
          <p className="mt-2 text-muted-foreground">Stories and tips from our orchards.</p>
          {isLoading && <p className="mt-8 text-muted-foreground">Loading…</p>}
          {!isLoading && data.length === 0 && <p className="mt-8 text-muted-foreground">No posts yet — check back soon.</p>}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1">
                {p.cover_image_url && <img src={p.cover_image_url} alt={p.image_alt || p.title} loading="lazy" className="aspect-video w-full object-cover" />}
                <div className="p-5">
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {p.featured && <span className="rounded-full bg-mango px-2 font-bold text-leaf-deep">Featured</span>}
                    <span>{p.category}</span><span>· {p.reading_minutes} min read</span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold group-hover:text-primary">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
