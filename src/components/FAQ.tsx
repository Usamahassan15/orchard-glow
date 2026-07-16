import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "How fresh are the mangoes?", a: "We hand-pick every mango at peak ripeness and ship the same day. Most orders arrive within 48 hours of harvest." },
  { q: "Which varieties do you offer?", a: "This season we're carrying Chaunsa, Sindhri, Anwar Ratol, and Langra — all export-grade." },
  { q: "What are the delivery charges?", a: "Flat PKR 500 across Pakistan. Free delivery on orders above PKR 8,000." },
  { q: "Do you ship internationally?", a: "Yes — we export to UAE, UK, and select EU countries. Please contact us for a quote." },
  { q: "How do I pay?", a: "You can pay Cash on Delivery, or advance via bank transfer / EasyPaisa (0317-5817400)." },
  { q: "What if my mangoes arrive damaged?", a: "Very rare, but we replace or refund any damaged fruit — just send us a photo on WhatsApp within 24 hours." },
];

export function FAQ() {
  return (
    <section className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-x max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            FAQ
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Frequently <span className="italic text-gradient-sun">asked</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="overflow-hidden rounded-2xl border border-border bg-card px-6"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
