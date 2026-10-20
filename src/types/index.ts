export interface DishImage {
  BIT240230_ImageUrl: string;
  BIT240230_IsThumbnail: boolean;
}

export interface DishCategory {
  id: string;
  BIT240230_Name: string;
  BIT240230_Description: string;
}

export interface Dish {
  id: string;
  BIT240230_Name: string;
  BIT240230_Price: number;
  BIT240230_PreparationTime: number;
  BIT240230_IsAvailable: boolean;
  BIT240230_Description: string;
  BIT240230_DishCategoryId: string;
  BIT240230_DishImage: DishImage[];
}
export type DishInput = Omit<Dish, "id">;
export type CategoryInput = Omit<DishCategory, "id">;