import { ENDPOINTS } from "../constants/config";
import { Dish, DishInput } from "../types";
import { http } from "./client";

export const dishApi = {
  getAll: () => http.get<Dish[]>(ENDPOINTS.DISHES),
  getById: (id: string) => http.get<Dish>(`${ENDPOINTS.DISHES}/${id}`),
  create: (data: DishInput) => http.post<Dish>(ENDPOINTS.DISHES, data),
  update: (id: string, data: DishInput) =>
    http.put<Dish>(`${ENDPOINTS.DISHES}/${id}`, data),
  remove: (id: string) => http.delete(`${ENDPOINTS.DISHES}/${id}`),
};