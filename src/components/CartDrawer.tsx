import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, subtotal, DELIVERY_CHARGES } from "@/store/cart";

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { items, isOpen, setOpen, updateQty, remove } = useCart();
  const sub = subtotal(items);
  const total = items.length ? sub + DELIVERY_CHARGES : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-leaf-deep/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-border p-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5" />
                <h3 className="font-display text-xl font-bold">Your Cart</h3>
                <span className="text-sm text-muted-foreground">({items.length})</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-secondary">
                    <ShoppingBag className="size-6 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-display text-lg font-bold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Add some fresh mangoes to get started.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                      <img src={it.image} alt={it.name} className="size-20 rounded-xl object-cover" />
                      <div className="flex flex-1 min-w-0 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="truncate font-semibold">{it.name}</h4>
                            <p className="text-xs text-muted-foreground">{it.weight}</p>
                          </div>
                          <button
                            onClick={() => remove(it.id)}
                            aria-label="Remove"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button onClick={() => updateQty(it.id, it.qty - 1)} className="grid size-7 place-items-center" aria-label="Decrease">
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold">{it.qty}</span>
                            <button onClick={() => updateQty(it.id, it.qty + 1)} className="grid size-7 place-items-center" aria-label="Increase">
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <div className="text-sm font-bold">PKR {(it.unitPrice * it.qty).toLocaleString()}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">PKR {sub.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold">PKR {DELIVERY_CHARGES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-display text-lg font-bold">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setOpen(false); onCheckout(); }}
                  className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-leaf-deep"
                >
                  Checkout
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
