import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Shop } from "@/components/Shop";
import { OurStory } from "@/components/OurStory";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutDialog } from "@/components/CheckoutDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunwood Mango Farm — Tree-Ripened Chaunsa, Sindhri & Anwar Ratol" },
      { name: "description", content: "Premium, tree-ripened mangoes from our family orchard in Multan. Farm-direct Chaunsa, Sindhri, Anwar Ratol and Langra — delivered nationwide within 48 hours." },
      { property: "og:title", content: "Sunwood Mango Farm" },
      { property: "og:description", content: "Farm-direct premium Pakistani mangoes. Hand-picked, tree-ripened, delivered in 48h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (
    <main className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <Shop onBuyNow={() => setCheckoutOpen(true)} />
      <OurStory />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingButtons />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <Toaster position="top-center" richColors />
    </main>
  );
}
