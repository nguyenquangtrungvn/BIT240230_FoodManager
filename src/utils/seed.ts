import { categoryApi } from "../api/categoryApi";
import { dishApi } from "../api/dishApi";

const img = (seed: string, thumb = false) => ({
  BIT240230_ImageUrl: `https://picsum.photos/seed/${seed}/600/400`,
  BIT240230_IsThumbnail: thumb,
});

export async function seedIfEmpty() {
  const existing = await categoryApi.getAll();
  if (existing.length > 0) return;

  const [main, drink, dessert] = await Promise.all([
    categoryApi.create({ BIT240230_Name: "Main course", BIT240230_Description: "Rice, noodles, grilled dishes" }),
    categoryApi.create({ BIT240230_Name: "Drinks", BIT240230_Description: "Coffee, tea, juice" }),
    categoryApi.create({ BIT240230_Name: "Dessert", BIT240230_Description: "Sweet dishes" }),
  ]);

  const mk = (name: string, price: number, time: number, cat: string, avail: boolean, seed: string) =>
    dishApi.create({
      BIT240230_Name: name,
      BIT240230_Price: price,
      BIT240230_PreparationTime: time,
      BIT240230_IsAvailable: avail,
      BIT240230_Description: `${name} - sample dish`,
      BIT240230_DishCategoryId: cat,
      BIT240230_DishImage: [img(seed + "1", true), img(seed + "2")],
    });

  await mk("Pho bo", 60000, 20, main.id, true, "pho");
  await mk("Com tam", 45000, 15, main.id, true, "comtam");
  await mk("Ca phe sua", 25000, 5, drink.id, true, "caphe");
  await mk("Tra dao", 30000, 10, drink.id, false, "tradao"); // món ngừng bán
  await mk("Che ba mau", 28000, 12, dessert.id, true, "che");
}