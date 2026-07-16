import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/mango-chaunsa.jpg";
import g5 from "@/assets/mango-sindhri.jpg";
import g6 from "@/assets/story-crate.jpg";

const images = [g1, g2, g3, g4, g5, g6];

export function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <section className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            Gallery
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            From the <span className="italic text-gradient-sun">orchard</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {images.map((src, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setIndex(i); setOpen(true); }}
              className={
                "group relative overflow-hidden rounded-2xl bg-secondary " +
                (i === 0 ? "row-span-2 col-span-2 md:col-span-2" : i === 3 ? "row-span-2" : "")
              }
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-leaf-deep/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
      />
    </section>
  );
}
