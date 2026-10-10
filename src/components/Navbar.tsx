import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/#home" },
  { label: "Shop", href: "/#shop" },
  { label: "Our Story", href: "/#story" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const setOpenCart = useCart((s) => s.setOpen);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const [email, setEmail] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-[0_4px_24px_-8px_oklch(0.4_0.1_148/0.15)]"
          : "bg-transparent",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="/#home" className="flex items-center gap-2">
          <img src={logo} alt="Sunwood Mango Farm" width={40} height={40} className="size-9 md:size-10" />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight md:text-xl">Sunwood</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Mango Farm</div>
          </div>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="relative">
            {email ? (
              <button onClick={() => setMenu((m) => !m)} aria-label="Account" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card">
                <User className="size-4" />
              </button>
            ) : (
              <Link to="/auth" className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium" aria-label="Sign in or sign up">
                <User className="size-4" /><span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
            {email && menu && (
              <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl">
                <div className="truncate px-3 py-2 text-xs text-muted-foreground">{email}</div>
                <Link to="/admin" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                  <LayoutDashboard className="size-4" /> Admin panel
                </Link>
                <button onClick={async () => { setMenu(false); await supabase.auth.signOut(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                  <LogOut className="size-4" /> Sign out
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setOpenCart(true)}
            className="relative inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-mango text-[10px] font-bold text-leaf-deep">
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden inline-flex size-10 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
