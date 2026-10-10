import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Zap, Leaf } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { fetchProductById } from "@/lib/store-api";
import { type Weight, discountedPrice, priceFor } from "@/data/products";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Mango Details — Sunwood Mango Farm" },
      { name: "description", content: "Tree-ripened premium mangoes from Sunwood Mango Farm. See weights, prices and delivery details." },
      { property: "og:title", content: "Mango Details — Sunwood Mango Farm" },
      { property: "og:description", content: "Farm-direct premium Pakistani mangoes delivered in 48 hours." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

const WEIGHTS: Weight[] = ["5 KG", "8 KG", "10 KG"];

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", id], queryFn: () => fetchProductById(id) });
  const [weight, setWeight] = useState<Weight>("5 KG");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);

  return (
    <SiteShell>
      {(openCheckout) => (
        <section className="container-x py-10 md:py-16">
          <Link to="/" hash="shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to shop
          </Link>
          {isLoading && <p className="mt-10 text-muted-foreground">Loading…</p>}
          {!isLoading && !product && <p className="mt-10 text-muted-foreground">This product could not be found.</p>}
          {product && (() => {
            const imgs = [product.image, product.hoverImage].filter((v, i, a) => a.indexOf(v) === i);
            const unit = discountedPrice(product, weight);
            const original = priceFor(product, weight);
            const addToCart = () => {
              add({ productId: product.id, name: product.name, image: product.image, weight, qty, unitPrice: unit });
              toast.success(`${product.name} added to cart`, { description: `${weight} × ${qty}` });
            };
            return (
              <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <div className="aspect-square overflow-hidden rounded-3xl bg-secondary">
                    <img src={imgs[active] ?? imgs[0]} alt={product.name} width={900} height={900} className="h-full w-full object-cover" />
                  </div>
                  {imgs.length > 1 && (
                    <div className="mt-3 flex gap-3">
                      {imgs.map((src, i) => (
                        <button key={i} onClick={() => setActive(i)} className={cn("size-20 overflow-hidden rounded-2xl border-2", active === i ? "border-primary" : "border-transparent")}>
                          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.category}</div>
                  <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">{product.name}</h1>
                  <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold text-leaf-deep">PKR {unit.toLocaleString()}</span>
                    {product.discount && <span className="text-muted-foreground line-through">PKR {original.toLocaleString()}</span>}
                    {product.discount && <span className="rounded-full bg-mango px-3 py-1 text-xs font-bold text-leaf-deep">-{product.discount}%</span>}
                  </div>
                  <div className="mt-2 text-sm"><span className="font-semibold">Availability:</span> {product.availability}</div>

                  <div className="mt-6">
                    <div className="text-sm font-semibold">Box weight</div>
                    <div className="mt-2 flex gap-2">
                      {WEIGHTS.map((w) => (
                        <button key={w} onClick={() => setWeight(w)} className={cn("rounded-full border px-5 py-2 text-sm font-semibold", weight === w ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{w}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center rounded-full border border-border">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-10 place-items-center" aria-label="Decrease"><Minus className="size-4" /></button>
                    <span className="w-8 text-center font-semibold">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="grid size-10 place-items-center" aria-label="Increase"><Plus className="size-4" /></button>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button onClick={() => { addToCart(); setOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-full border border-primary py-3 text-sm font-semibold text-primary">
                      <ShoppingBag className="size-4" /> Add to Cart
                    </button>
                    <button onClick={() => { addToCart(); openCheckout(); }} className="inline-flex items-center justify-center gap-2 rounded-full bg-mango py-3 text-sm font-semibold text-leaf-deep">
                      <Zap className="size-4" /> Buy Now
                    </button>
                  </div>

                  <div className="mt-8 rounded-3xl border border-border bg-card p-6">
                    <h2 className="font-display text-lg font-bold">Description</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {product.description || `${product.name} — ${product.tagline}. Hand-picked at peak ripeness from our family orchards in Multan, naturally ripened without chemicals and packed in ventilated boxes so every mango arrives sweet, juicy and fragrant.`}
                    </p>
                  </div>
                  <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                    <li className="flex items-center gap-2"><Leaf className="size-4 text-primary" /> Naturally ripened</li>
                    <li className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Delivery in 48h · PKR 500</li>
                    <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Damage replacement</li>
                  </ul>
                </div>
              </div>
            );
          })()}
        </section>
      )}
    </SiteShell>
  );
}
