import { Color } from "~~/types/types";

export const useColors = () => useState("colors", () => [] as Color[]);
export const useCartCount = () => useState("cartCount", () => null as number);
