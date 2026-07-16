import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X, ChevronDown, Upload, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useCart, subtotal, DELIVERY_CHARGES } from "@/store/cart";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(10, "Enter a valid phone").max(20),
  address: z.string().trim().min(5, "Enter your address").max(300),
  city: z.string().trim().min(2).max(60),
  province: z.string().trim().min(2).max(60),
  postal: z.string().trim().max(15).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

const WHATSAPP = "923175817400";
const EASYPAISA = "03175817400";

export function CheckoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, clear } = useCart();
  const [form, setForm] = useState({
    fullName: "", phone: "", address: "", city: "", province: "", postal: "", notes: "",
  });
  const [payment, setPayment] = useState<"cod" | "advance">("cod");
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [screenshotName, setScreenshotName] = useState("");

  const sub = subtotal(items);
  const grand = sub + DELIVERY_CHARGES;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handlePayment = (p: "cod" | "advance") => {
    setPayment(p);
    if (p === "advance") setAdvanceOpen(true);
  };

  const submit = () => {
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

    const lines = [
      `*New Order — Sunwood Mango Farm*`,
      ``,
      `*Customer*`,
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      `City: ${form.city}, ${form.province}${form.postal ? " — " + form.postal : ""}`,
      form.notes ? `Notes: ${form.notes}` : null,
      ``,
      `*Order*`,
      ...items.map((i) => `• ${i.name} — ${i.weight} × ${i.qty} = PKR ${(i.unitPrice * i.qty).toLocaleString()}`),
      ``,
      `Subtotal: PKR ${sub.toLocaleString()}`,
      `Delivery: PKR ${DELIVERY_CHARGES.toLocaleString()}`,
      `*Grand Total: PKR ${grand.toLocaleString()}*`,
      ``,
      `Payment: ${payment === "cod" ? "Cash on Delivery" : "Advance Payment (screenshot to follow)"}`,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    toast.success("Order sent to WhatsApp!", { description: "We'll confirm shortly." });
    clear();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-leaf-deep/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          >
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl my-8">
              <header className="flex items-center justify-between border-b border-border p-6">
                <h3 className="font-display text-2xl font-bold">Checkout</h3>
                <button onClick={onClose} aria-label="Close"><X className="size-5" /></button>
              </header>

              <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
                <section>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Customer Information
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Full Name" v={form.fullName} on={set("fullName")} />
                    <Field label="Phone Number" v={form.phone} on={set("phone")} />
                    <div className="sm:col-span-2">
                      <Field label="Complete Address" v={form.address} on={set("address")} />
                    </div>
                    <Field label="City" v={form.city} on={set("city")} />
                    <Field label="Province" v={form.province} on={set("province")} />
                    <Field label="Postal Code" v={form.postal} on={set("postal")} />
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                      <textarea
                        value={form.notes}
                        onChange={set("notes")}
                        rows={2}
                        maxLength={500}
                        className="mt-1 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Payment Method
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PaymentOption
                      selected={payment === "cod"}
                      onClick={() => handlePayment("cod")}
                      title="Cash on Delivery"
                      copy="Pay when your mangoes arrive."
                    />
                    <PaymentOption
                      selected={payment === "advance"}
                      onClick={() => handlePayment("advance")}
                      title="Advance Payment"
                      copy="Bank / EasyPaisa transfer."
                    />
                  </div>

                  <AnimatePresence>
                    {payment === "advance" && advanceOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="rounded-2xl border border-mango/30 bg-mango/5 p-5">
                          <div className="flex items-center justify-between">
                            <h5 className="font-display font-bold">Transfer Details</h5>
                            <button onClick={() => setAdvanceOpen(false)} aria-label="Collapse">
                              <ChevronDown className="size-4 rotate-180" />
                            </button>
                          </div>
                          <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">EasyPaisa</dt>
                              <dd className="font-mono font-bold">{EASYPAISA}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Bank Transfer</dt>
                              <dd className="font-mono font-bold">Meezan · 0100-1234-5678</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Account Title</dt>
                              <dd className="font-bold">Sunwood Mango Farm</dd>
                            </div>
                          </dl>
                          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-mango/40 bg-background p-4 text-sm">
                            <span className="flex items-center gap-2">
                              <Upload className="size-4 text-mango-deep" />
                              {screenshotName || "Upload payment screenshot"}
                            </span>
                            {screenshotName && <CheckCircle2 className="size-4 text-leaf" />}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setScreenshotName(e.target.files?.[0]?.name || "")}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                <section className="rounded-2xl bg-secondary/50 p-5">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span><span className="font-semibold">PKR {sub.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span>Delivery</span><span className="font-semibold">PKR {DELIVERY_CHARGES.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-display text-xl font-bold">
                    <span>Grand Total</span><span>PKR {grand.toLocaleString()}</span>
                  </div>
                </section>
              </div>

              <footer className="border-t border-border p-6">
                <button
                  onClick={submit}
                  className="w-full rounded-full bg-mango py-4 text-sm font-bold uppercase tracking-wider text-leaf-deep shadow-[0_20px_50px_-15px_oklch(0.85_0.18_82/0.7)] transition hover:bg-mango-deep hover:text-cream"
                >
                  Confirm Order via WhatsApp
                </button>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, v, on }: { label: string; v: string; on: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        value={v}
        onChange={on}
        maxLength={300}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

function PaymentOption({ selected, onClick, title, copy }: { selected: boolean; onClick: () => void; title: string; copy: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col rounded-2xl border-2 p-4 text-left transition-all",
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold">{title}</span>
        <span className={cn("grid size-5 place-items-center rounded-full border-2", selected ? "border-primary bg-primary" : "border-border")}>
          {selected && <span className="size-2 rounded-full bg-primary-foreground" />}
        </span>
      </div>
      <span className="mt-1 text-xs text-muted-foreground">{copy}</span>
    </button>
  );
}
