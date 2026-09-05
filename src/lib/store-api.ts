import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";
import { imageFor } from "./product-images";

export type DbProduct = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: string;
  availability: string;
  discount: number;
  image_key: string;
  hover_key: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export function toProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    image: imageFor(row.image_key),
    hoverImage: imageFor(row.hover_key),
    availability: row.availability as Product["availability"],
    discount: row.discount || undefined,
    category: row.category as Product["category"],
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function fetchStoreProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as DbProduct[]).map(toProduct);
}

export async function fetchAllProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as DbProduct[];
}
