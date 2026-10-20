import { ENDPOINTS } from "../constants/config";
import { CategoryInput, Dish, DishCategory } from "../types";
import { http, ApiError } from "./client";

export const categoryApi = {
  getAll: () => http.get<DishCategory[]>(ENDPOINTS.CATEGORIES),
  getById: (id: string) => http.get<DishCategory>(`${ENDPOINTS.CATEGORIES}/${id}`),
  create: (data: CategoryInput) => http.post<DishCategory>(ENDPOINTS.CATEGORIES, data),

  // Ràng buộc: không xóa loại đang được món ăn sử dụng
  async remove(id: string) {
    const dishes = await http.get<Dish[]>(ENDPOINTS.DISHES);
    const inUse = dishes.some((d) => d.BIT240230_DishCategoryId === id);
    if (inUse) throw new ApiError("CATEGORY_IN_USE");
    return http.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
  },
};