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
  description: string;
  image_url: string;
  hover_image_url: string;
};

export function toProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    image: row.image_url || imageFor(row.image_key),
    hoverImage: row.hover_image_url || row.image_url || imageFor(row.hover_key),
    description: row.description,
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

export async function fetchProductById(id: string): Promise<Product | null> {
  const { PRODUCTS } = await import("@/data/products");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return PRODUCTS.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toProduct(data as unknown as DbProduct) : null;
}

export type FaqRow = { id: string; question: string; answer: string; sort_order: number; is_active: boolean };
export async function fetchFaqs(): Promise<FaqRow[]> {
  const { data, error } = await supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return data as FaqRow[];
}

export type PostRow = {
  id: string; title: string; slug: string; excerpt: string; content: string; category: string;
  tags: string[]; author: string; cover_image_url: string; image_alt: string; reading_minutes: number;
  status: string; featured: boolean; publish_date: string; tagline: string; seo_title: string;
  seo_description: string; canonical_url: string; created_at: string;
};
export async function fetchPublishedPosts(): Promise<PostRow[]> {
  const { data, error } = await supabase.from("posts").select("*").eq("status", "published")
    .order("featured", { ascending: false }).order("publish_date", { ascending: false });
  if (error) throw error;
  return data as PostRow[];
}
export async function fetchPostBySlug(slug: string): Promise<PostRow | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as PostRow) ?? null;
}
