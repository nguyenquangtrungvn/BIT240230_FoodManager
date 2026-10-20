import { Dish, DishCategory, DishInput } from "../types";

export type DishErrors = Partial<
  Record<"name" | "price" | "time" | "category" | "thumbnail" | "image", string>
>;

export function validateDish(
  input: DishInput,
  categories: DishCategory[],
  allDishes: Dish[],
  editingId?: string
): DishErrors {
  const errors: DishErrors = {};
  const name = input.BIT240230_Name.trim();

  if (!name) errors.name = "ERR_NAME_REQUIRED";

  if (!(input.BIT240230_Price > 0)) errors.price = "ERR_PRICE_INVALID";
  if (!(input.BIT240230_PreparationTime > 0)) errors.time = "ERR_TIME_INVALID";

  if (!categories.some((c) => c.id === input.BIT240230_DishCategoryId))
    errors.category = "ERR_CATEGORY_INVALID";

  // Trùng tên trong cùng một loại (bỏ qua chính món đang sửa)
  const duplicated = allDishes.some(
    (d) =>
      d.id !== editingId &&
      d.BIT240230_DishCategoryId === input.BIT240230_DishCategoryId &&
      d.BIT240230_Name.trim().toLowerCase() === name.toLowerCase()
  );
  if (name && duplicated) errors.name = "ERR_NAME_DUPLICATE";

  // Tối đa 1 ảnh đại diện
  const thumbs = input.BIT240230_DishImage.filter((i) => i.BIT240230_IsThumbnail);
  if (thumbs.length > 1) errors.thumbnail = "ERR_THUMBNAIL_MAX_ONE";

  // Ảnh phải có URL hợp lệ
  if (input.BIT240230_DishImage.some((i) => !/^https?:\/\/\S+/i.test(i.BIT240230_ImageUrl.trim())))
    errors.image = "ERR_IMAGE_URL_INVALID";

  return errors;
}

export function validatePriceRange(min: string, max: string): string | null {
  const a = min.trim() === "" ? null : Number(min);
  const b = max.trim() === "" ? null : Number(max);
  if ((a !== null && (isNaN(a) || a < 0)) || (b !== null && (isNaN(b) || b < 0)))
    return "ERR_RANGE_INVALID";
  if (a !== null && b !== null && a > b) return "ERR_RANGE_INVALID";
  return null;
}

export const isQuick = (minutes: number) => minutes <= 15;