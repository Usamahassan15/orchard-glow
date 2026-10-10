import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutDialog } from "@/components/CheckoutDialog";

export function SiteShell({ children }: { children: (openCheckout: () => void) => ReactNode }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {children(() => setCheckoutOpen(true))}
      <Footer />
      <FloatingButtons />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <Toaster position="top-center" richColors />
    </main>
  );
}
