import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PRODUCTS, priceFor } from "@/data/products";
import { fetchStoreProducts } from "@/lib/store-api";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

type Sort = "az" | "za" | "low" | "high" | "new";

const PAGE_SIZE = 9;

export function Shop({ onBuyNow }: { onBuyNow: () => void }) {
  const [sort, setSort] = useState<Sort>("new");
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1500, 3500]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: products = PRODUCTS } = useQuery({
    queryKey: ["store-products"],
    queryFn: fetchStoreProducts,
    staleTime: 60_000,
  });

  const filtered = useMemo(() => {
    let list = products.filter((p) => {

      const base = priceFor(p, "5 KG");
      if (base < priceRange[0] || base > priceRange[1]) return false;
      if (availability.length && !availability.includes(p.availability)) return false;
      return true;
    });

    switch (sort) {
      case "az": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "za": list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case "low": list = [...list].sort((a, b) => a.price - b.price); break;
      case "high": list = [...list].sort((a, b) => b.price - a.price); break;
      case "new": list = [...list].sort((a, b) => b.createdAt - a.createdAt); break;
    }
    return list;
  }, [products, sort, availability, priceRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleAvailability = (v: string) =>
    setAvailability((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Availability
        </h4>
        <div className="space-y-2">
          {["In Stock", "Limited", "Pre-Order"].map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={availability.includes(v)}
                onChange={() => toggleAvailability(v)}
                className="size-4 accent-primary"
              />
              {v}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Price (PKR)
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min={1500}
            max={3500}
            step={100}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm">
            <span>PKR {priceRange[0].toLocaleString()}</span>
            <span>PKR {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="shop" className="relative py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            Our Harvest
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Shop the <span className="italic text-gradient-sun">season</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            {filtered.length} products · picked at peak ripeness, packed same day.
          </p>
        </motion.div>

        <div id="catalog" className="mt-12 flex flex-col gap-8 lg:flex-row">
          {/* Filter sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28 rounded-3xl border border-border bg-card p-6">
              <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
                <SlidersHorizontal className="size-4" /> Filters
              </h3>
              {FilterPanel}
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"
              >
                <SlidersHorizontal className="size-4" /> Filters
              </button>
              <div className="relative ml-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="new">Newest</option>
                  <option value="az">Alphabetically A–Z</option>
                  <option value="za">Alphabetically Z–A</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} onBuyNow={onBuyNow} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "size-10 rounded-full text-sm font-semibold transition-all",
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card hover:border-primary",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </section>
  );
}
