import chaunsa from "@/assets/mango-chaunsa.jpg";
import sindhri from "@/assets/mango-sindhri.jpg";
import anwar from "@/assets/mango-anwar.jpg";
import langra from "@/assets/mango-langra.jpg";

export const PRODUCT_IMAGES: Record<string, string> = {
  chaunsa,
  sindhri,
  anwar,
  langra,
};

export const IMAGE_KEYS = ["chaunsa", "sindhri", "anwar", "langra"] as const;

export function imageFor(key: string | null | undefined) {
  return PRODUCT_IMAGES[key ?? "chaunsa"] ?? chaunsa;
}
