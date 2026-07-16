import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Ayesha K.", city: "Karachi", rating: 5, text: "Best Chaunsa I've had in years. Arrived perfectly ripe, smelled like childhood." },
  { name: "Bilal R.", city: "Lahore", rating: 5, text: "Sindhri box arrived in 36 hours, every mango flawless. The family is hooked." },
  { name: "Sana M.", city: "Islamabad", rating: 5, text: "Packaging was beautiful, mangoes buttery. Worth every rupee — ordering again." },
  { name: "Umer H.", city: "Multan", rating: 5, text: "I grew up around orchards, and these still surprised me. Real farm freshness." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            Reviews
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Loved across <span className="italic text-gradient-sun">Pakistan</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <Quote className="mx-auto size-10 text-mango" />
          <div className="relative mt-6 h-52">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 text-center"
              >
                <p className="font-display text-2xl leading-relaxed md:text-3xl">
                  "{reviews[i].text}"
                </p>
                <div className="mt-6 flex items-center justify-center gap-1">
                  {Array.from({ length: reviews[i].rating }).map((_, k) => (
                    <Star key={k} className="size-4 fill-mango text-mango" />
                  ))}
                </div>
                <div className="mt-3 text-sm font-semibold">
                  {reviews[i].name} · <span className="text-muted-foreground font-normal">{reviews[i].city}</span>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {reviews.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Review ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
