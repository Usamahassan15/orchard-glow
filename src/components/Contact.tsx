import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const text = encodeURIComponent(
      `Hi Sunwood!\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.open(`https://wa.me/923175817400?text=${text}`, "_blank");
    toast.success("Opening WhatsApp…");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            Contact
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Let's <span className="italic text-gradient-sun">talk mangoes</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-border">
              <iframe
                title="Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=71.44%2C30.15%2C71.55%2C30.25&layer=mapnik"
                width="100%"
                height="280"
                loading="lazy"
                className="h-72 w-full"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: MapPin, label: "Farm", value: "Multan, Punjab, Pakistan" },
                { icon: Phone, label: "Phone", value: "+92 317 5817400" },
                { icon: Mail, label: "Email", value: "hello@sunwoodmango.pk" },
                { icon: MessageCircle, label: "WhatsApp", value: "0317-5817400" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
                      <div className="text-sm font-semibold">{c.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold">Send a message</h3>
            <p className="mt-1 text-sm text-muted-foreground">We reply on WhatsApp within an hour.</p>
            <div className="mt-6 space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                maxLength={100}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Your email"
                maxLength={255}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                rows={5}
                maxLength={1000}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-leaf-deep"
              >
                Send via WhatsApp
                <Send className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
