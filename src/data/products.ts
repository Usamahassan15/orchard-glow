import chaunsa from "@/assets/mango-chaunsa.jpg";
import sindhri from "@/assets/mango-sindhri.jpg";
import anwar from "@/assets/mango-anwar.jpg";
import langra from "@/assets/mango-langra.jpg";

export type Weight = "5 KG" | "8 KG" | "10 KG";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // PKR for 5KG base
  image: string;
  hoverImage: string;
  availability: "In Stock" | "Limited" | "Pre-Order";
  discount?: number;
  category: "Chaunsa" | "Sindhri" | "Anwar Ratol" | "Langra";
  createdAt: number;
};

const IMAGES = [chaunsa, sindhri, anwar, langra];

const seed: Omit<Product, "id" | "createdAt">[] = [
  { name: "Royal Chaunsa", tagline: "King of mangoes, honey-sweet", price: 2200, image: chaunsa, hoverImage: anwar, availability: "In Stock", discount: 15, category: "Chaunsa" },
  { name: "Sindhri Gold", tagline: "Fiber-free, buttery flesh", price: 1900, image: sindhri, hoverImage: chaunsa, availability: "In Stock", discount: 10, category: "Sindhri" },
  { name: "Anwar Ratol", tagline: "Small, aromatic, legendary", price: 2400, image: anwar, hoverImage: sindhri, availability: "Limited", discount: 20, category: "Anwar Ratol" },
  { name: "Langra Premium", tagline: "Tangy-sweet heirloom", price: 1750, image: langra, hoverImage: chaunsa, availability: "In Stock", category: "Langra" },
  { name: "Chaunsa Reserve", tagline: "Hand-picked, tree-ripened", price: 2600, image: chaunsa, hoverImage: sindhri, availability: "In Stock", discount: 12, category: "Chaunsa" },
  { name: "Sindhri Classic", tagline: "Golden, juicy, generous", price: 1650, image: sindhri, hoverImage: anwar, availability: "In Stock", category: "Sindhri" },
  { name: "White Chaunsa", tagline: "Delicate, pale, perfumed", price: 2800, image: chaunsa, hoverImage: langra, availability: "Pre-Order", discount: 8, category: "Chaunsa" },
  { name: "Anwar Ratol Export", tagline: "Export-grade selection", price: 2900, image: anwar, hoverImage: chaunsa, availability: "Limited", discount: 18, category: "Anwar Ratol" },
  { name: "Langra Heirloom", tagline: "From century-old orchards", price: 1850, image: langra, hoverImage: sindhri, availability: "In Stock", category: "Langra" },
  { name: "Chaunsa Signature", tagline: "Our farm's signature crop", price: 2500, image: chaunsa, hoverImage: anwar, availability: "In Stock", discount: 10, category: "Chaunsa" },
  { name: "Sindhri Reserve", tagline: "Aged perfectly on tree", price: 2100, image: sindhri, hoverImage: langra, availability: "In Stock", category: "Sindhri" },
  { name: "Ratol Petite", tagline: "Small size, big flavor", price: 2300, image: anwar, hoverImage: chaunsa, availability: "In Stock", discount: 15, category: "Anwar Ratol" },
  { name: "Langra Classic", tagline: "The tangy favorite", price: 1700, image: langra, hoverImage: anwar, availability: "In Stock", category: "Langra" },
  { name: "Chaunsa Sunrise", tagline: "Early season harvest", price: 2350, image: chaunsa, hoverImage: sindhri, availability: "Limited", category: "Chaunsa" },
  { name: "Sindhri Sunset", tagline: "Late season, deep sweet", price: 1950, image: sindhri, hoverImage: chaunsa, availability: "In Stock", discount: 12, category: "Sindhri" },
  { name: "Anwar Aroma", tagline: "Intensely fragrant", price: 2700, image: anwar, hoverImage: langra, availability: "Limited", discount: 10, category: "Anwar Ratol" },
  { name: "Langra Gold", tagline: "Golden-green heritage", price: 1800, image: langra, hoverImage: chaunsa, availability: "In Stock", category: "Langra" },
  { name: "Chaunsa Elite", tagline: "Top 1% of harvest", price: 3200, image: chaunsa, hoverImage: anwar, availability: "Pre-Order", discount: 5, category: "Chaunsa" },
  { name: "Farm Mixed Box", tagline: "Curator's selection", price: 2400, image: sindhri, hoverImage: anwar, availability: "In Stock", discount: 20, category: "Sindhri" },
];

export const PRODUCTS: Product[] = seed.map((p, i) => ({
  ...p,
  id: `mango-${i + 1}`,
  createdAt: Date.now() - i * 86400000,
}));

export const WEIGHT_MULTIPLIER: Record<Weight, number> = {
  "5 KG": 1,
  "8 KG": 1.55,
  "10 KG": 1.9,
};

export function priceFor(p: Product, weight: Weight) {
  const base = p.price * WEIGHT_MULTIPLIER[weight];
  return Math.round(base / 10) * 10;
}

export function discountedPrice(p: Product, weight: Weight) {
  const base = priceFor(p, weight);
  if (!p.discount) return base;
  return Math.round((base * (100 - p.discount)) / 10) * 10 / 10;
}
