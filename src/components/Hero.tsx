import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import hero from "@/assets/hero-orchard.jpg";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt="Mango orchard at golden hour"
          width={1920}
          height={1200}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-leaf-deep/85 via-leaf-deep/55 to-mango-deep/40" />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-glow)" }} />
      </div>

      <div className="container-x relative flex min-h-[92vh] flex-col justify-center py-24 text-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] backdrop-blur"
        >
          <Leaf className="size-3.5 text-mango" />
          Season 2026 — Fresh Harvest
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          Tree-ripened{" "}
          <span className="italic text-mango">mangoes</span>,
          <br />
          straight from our farm.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-xl text-base text-cream/85 sm:text-lg"
        >
          Three generations of orchard craft. Hand-picked Chaunsa, Sindhri, Anwar Ratol
          and Langra — delivered to your door within 48 hours of harvest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#shop"
            className="group inline-flex items-center gap-2 rounded-full bg-mango px-7 py-3.5 text-sm font-semibold text-leaf-deep shadow-[0_20px_60px_-20px_oklch(0.85_0.18_82/0.7)] transition-all hover:scale-[1.02]"
          >
            Shop Now
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 rounded-full border border-cream/40 bg-cream/5 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur transition-all hover:bg-cream/15"
          >
            View Catalog
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-cream/20 pt-8"
        >
          {[
            { k: "45+", v: "Years of craft" },
            { k: "48h", v: "Farm to door" },
            { k: "100%", v: "Organic" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl font-bold text-mango md:text-4xl">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-cream/70">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
