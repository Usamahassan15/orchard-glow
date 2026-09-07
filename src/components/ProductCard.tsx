import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Zap, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { type Product, type Weight, discountedPrice, priceFor } from "@/data/products";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const WEIGHTS: Weight[] = ["5 KG", "8 KG", "10 KG"];

export function ProductCard({ product, onBuyNow }: { product: Product; onBuyNow: () => void }) {
  const [weight, setWeight] = useState<Weight>("5 KG");
  const [qty, setQty] = useState(1);
  const [hover, setHover] = useState(false);
  const add = useCart((s) => s.add);
  const wishlist = useCart((s) => s.wishlist);
  const toggleWishlist = useCart((s) => s.toggleWishlist);
  const wished = wishlist.includes(product.id);

  const unit = discountedPrice(product, weight);
  const original = priceFor(product, weight);

  const handleAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      image: product.image,
      weight,
      qty,
      unitPrice: unit,
    });
    toast.success(`${product.name} added to cart`, { description: `${weight} × ${qty}` });
  };

  const handleBuy = () => {
    handleAdd();
    onBuyNow();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_10px_40px_-20px_oklch(0.4_0.1_148/0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_oklch(0.4_0.1_148/0.25)] sm:rounded-3xl"
    >
      <div
        className="relative aspect-square overflow-hidden bg-secondary"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-700",
            hover ? "opacity-0 scale-110" : "opacity-100 scale-100",
          )}
        />
        <img
          src={product.hoverImage}
          alt=""
          aria-hidden
          width={800}
          height={800}
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-700",
            hover ? "opacity-100 scale-100" : "opacity-0 scale-110",
          )}
        />

        {product.discount && (
          <span className="absolute left-2 top-2 rounded-full bg-mango px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-leaf-deep shadow-md sm:left-3 sm:top-3 sm:px-3 sm:text-[11px]">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className={cn(
            "absolute right-2 top-2 grid size-8 place-items-center rounded-full backdrop-blur transition-all sm:right-3 sm:top-3 sm:size-9",
            wished ? "bg-mango text-leaf-deep" : "bg-white/80 text-foreground hover:bg-white",
          )}
        >
          <Heart className={cn("size-4", wished && "fill-current")} />
        </button>

        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium backdrop-blur sm:gap-1.5 sm:px-3 sm:text-[11px]",
              product.availability === "In Stock" && "bg-leaf/90 text-cream",
              product.availability === "Limited" && "bg-mango-deep/90 text-cream",
              product.availability === "Pre-Order" && "bg-foreground/80 text-cream",
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {product.availability}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {product.category}
        </div>
        <h3 className="mt-1 font-display text-sm font-bold leading-tight sm:text-lg">{product.name}</h3>
        <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{product.tagline}</p>

        <div className="mt-2 flex min-w-0 flex-col gap-0 sm:mt-3 sm:flex-row sm:items-baseline sm:gap-2">
          <span className="font-display text-base font-bold text-leaf-deep sm:text-2xl">
            PKR {unit.toLocaleString()}
          </span>
          {product.discount && (
            <span className="text-[10px] text-muted-foreground line-through sm:text-sm">
              PKR {original.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1 sm:mt-4 sm:gap-1.5">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              onClick={() => setWeight(w)}
              className={cn(
                "rounded-md border px-0.5 py-1 text-[9px] font-semibold transition-all sm:rounded-full sm:px-2 sm:py-1.5 sm:text-xs",
                weight === w
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-foreground hover:border-primary/50",
              )}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1 sm:mt-3 sm:gap-2">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-7 place-items-center rounded-full hover:bg-secondary sm:size-8"
              aria-label="Decrease"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-5 text-center text-xs font-semibold tabular-nums sm:w-6 sm:text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid size-7 place-items-center rounded-full hover:bg-secondary sm:size-8"
              aria-label="Increase"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">Qty</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4 sm:gap-2">
          <button
            onClick={handleAdd}
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-md border border-primary bg-transparent px-1 py-2 text-[9px] font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:gap-1.5 sm:rounded-full sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <ShoppingBag className="size-3.5" />
            Add to Cart
          </button>
          <button
            onClick={handleBuy}
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-md bg-mango px-1 py-2 text-[9px] font-semibold text-leaf-deep transition-all hover:bg-mango-deep hover:text-cream sm:gap-1.5 sm:rounded-full sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <Zap className="size-3.5" />
            Buy Now
          </button>
        </div>
      </div>
    </motion.article>
  );
}
