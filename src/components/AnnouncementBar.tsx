import { Sparkles, Truck, Percent } from "lucide-react";

const items = [
  { icon: Percent, text: "20% OFF on first order — use code MANGO20" },
  { icon: Truck, text: "Free delivery on orders above PKR 8,000" },
  { icon: Sparkles, text: "Seasonal alert: Chaunsa harvest is live" },
];

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden border-b border-leaf-deep/20 bg-leaf-deep text-cream">
      <div className="flex whitespace-nowrap py-2 text-xs sm:text-sm">
        <div className="flex shrink-0 animate-marquee gap-12 pr-12">
          {[...items, ...items, ...items].map((it, idx) => {
            const Icon = it.icon;
            return (
              <span key={idx} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-mango" />
                <span>{it.text}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
