import { motion } from "framer-motion";
import { Sprout, Package, Shield, Truck, Globe, Users, Trees, Sparkles } from "lucide-react";
import storyFarm from "@/assets/story-farm.jpg";
import storyCrate from "@/assets/story-crate.jpg";

const pillars = [
  { icon: Trees, title: "Our Farm", copy: "45 hectares of heirloom orchards in the mango belt of Multan." },
  { icon: Sprout, title: "Fresh Mangoes", copy: "Picked at dawn, shipped by dusk. Never chemically ripened." },
  { icon: Shield, title: "Quality Assurance", copy: "Every crate hand-graded by our master pickers." },
  { icon: Truck, title: "National Delivery", copy: "48-hour delivery across Pakistan, temperature-controlled." },
  { icon: Package, title: "Wholesale", copy: "Bulk orders for hotels, restaurants, and gift boxes." },
  { icon: Globe, title: "International Export", copy: "Export-grade Chaunsa flying to UAE, UK, and EU." },
  { icon: Users, title: "Family Business", copy: "Three generations, one obsession — the perfect mango." },
  { icon: Sparkles, title: "Organic Farming", copy: "Certified organic. No pesticides, only sun and patience." },
];

export function OurStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-secondary/40 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_oklch(0.4_0.1_148/0.3)]">
              <img src={storyFarm} alt="Farmer holding mango" width={1200} height={900} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-56 overflow-hidden rounded-3xl border-8 border-background shadow-xl md:block">
              <img src={storyCrate} alt="Crate of mangoes" width={1200} height={900} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
              Our Story
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] md:text-5xl">
              A family orchard, since <span className="italic text-gradient-sun">1978</span>.
            </h2>
            <p className="mt-5 text-muted-foreground">
              What started as a modest grove planted by our grandfather has grown into
              one of Pakistan's most trusted mango names. We still hand-pick every
              fruit. We still refuse chemical ripeners. And we still deliver mangoes
              the way they were meant to arrive — warm from the sun.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {pillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold">{p.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.copy}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
