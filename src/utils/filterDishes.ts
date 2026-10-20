import { Dish } from "../types";

export type SortKey = "none" | "priceAsc" | "priceDesc" | "timeAsc";

export interface Filters {
  search: string;
  categoryId: string; // "all" = không lọc
  onlyAvailable: boolean;
  minPrice: string;
  maxPrice: string;
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  categoryId: "all",
  onlyAvailable: false,
  minPrice: "",
  maxPrice: "",
  sort: "none",
};

export function applyFilters(
  dishes: Dish[],
  f: Filters,
  rangeValid: boolean
): Dish[] {
  const keyword = f.search.trim().toLowerCase();
  const min = f.minPrice.trim() === "" ? null : Number(f.minPrice);
  const max = f.maxPrice.trim() === "" ? null : Number(f.maxPrice);

  let result = dishes.filter((d) => {
    if (keyword && !d.BIT240230_Name.toLowerCase().includes(keyword)) return false;
    if (f.categoryId !== "all" && d.BIT240230_DishCategoryId !== f.categoryId) return false;
    if (f.onlyAvailable && !d.BIT240230_IsAvailable) return false;
    if (rangeValid) {
      if (min !== null && d.BIT240230_Price < min) return false;
      if (max !== null && d.BIT240230_Price > max) return false;
    }
    return true;
  });

  result = [...result];
  if (f.sort === "priceAsc") result.sort((a, b) => a.BIT240230_Price - b.BIT240230_Price);
  if (f.sort === "priceDesc") result.sort((a, b) => b.BIT240230_Price - a.BIT240230_Price);
  if (f.sort === "timeAsc")
    result.sort((a, b) => a.BIT240230_PreparationTime - b.BIT240230_PreparationTime);
  return result;
}