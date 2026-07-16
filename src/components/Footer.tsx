import { Facebook, Instagram, Youtube, Music2 } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="relative bg-leaf-deep text-cream">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Sunwood" width={40} height={40} className="size-10" />
              <div>
                <div className="font-display text-xl font-bold">Sunwood</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Mango Farm</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-cream/70">
              Tree-ripened mangoes, delivered from our family orchard in Multan since 1978.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-mango">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li><a href="#home" className="hover:text-mango">Home</a></li>
              <li><a href="#shop" className="hover:text-mango">Shop</a></li>
              <li><a href="#story" className="hover:text-mango">Our Story</a></li>
              <li><a href="#contact" className="hover:text-mango">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-mango">Categories</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>Chaunsa</li>
              <li>Sindhri</li>
              <li>Anwar Ratol</li>
              <li>Langra</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-mango">Newsletter</h4>
            <p className="mt-4 text-sm text-cream/70">Get seasonal alerts and 10% off your first order.</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex gap-2 rounded-full border border-cream/20 bg-cream/5 p-1"
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none"
              />
              <button className="rounded-full bg-mango px-4 py-2 text-xs font-bold text-leaf-deep">
                Join
              </button>
            </form>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Music2, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="grid size-9 place-items-center rounded-full border border-cream/20 text-cream/80 transition-all hover:border-mango hover:text-mango"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-cream/10 pt-6 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Sunwood Mango Farm. All rights reserved.</p>
          <p>Handcrafted with care in Multan, Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
