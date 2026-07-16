import { motion } from "framer-motion";
import { Leaf, Sprout, Award, Truck, Plane, Heart } from "lucide-react";

const features = [
  { icon: Leaf, title: "Fresh Mangoes", copy: "Picked at peak, never cold-stored beyond 48 hours." },
  { icon: Sprout, title: "Farm Direct", copy: "No middlemen. From our orchard to your kitchen." },
  { icon: Award, title: "Premium Quality", copy: "Hand-graded — only the top 30% ships." },
  { icon: Truck, title: "Fast Delivery", copy: "48-hour nationwide, tracked door-to-door." },
  { icon: Plane, title: "Export Quality", copy: "The same fruit we ship to London and Dubai." },
  { icon: Heart, title: "100% Natural", copy: "Sun-ripened, chemical-free, small-batch." },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            Why Sunwood
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Six reasons families come <span className="italic text-gradient-sun">back</span> every summer.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_oklch(0.4_0.1_148/0.2)]"
              >
                <div
                  className="absolute inset-0 -z-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "var(--gradient-glow)" }}
                />
                <div className="relative">
                  <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-mango group-hover:text-leaf-deep">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
