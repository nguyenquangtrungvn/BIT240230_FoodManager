import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { Dish } from "../types";
import { isQuick } from "../utils/validation";

interface Props {
  dish: Dish;
  categoryName: string;
  onPress?: () => void;
}

export default function DishCard({ dish, categoryName, onPress }: Props) {
  const { t } = useLanguage();
  const images = dish.BIT240230_DishImage ?? [];
  const thumb = images.find((i) => i.BIT240230_IsThumbnail) ?? images[0];
  const quick = isQuick(dish.BIT240230_PreparationTime);
  const available = dish.BIT240230_IsAvailable;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {thumb ? (
        <Image source={{ uri: thumb.BIT240230_ImageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={{ color: "#999" }}>—</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {dish.BIT240230_Name}
        </Text>
        <Text style={styles.sub}>{categoryName}</Text>
        <Text style={styles.price}>{dish.BIT240230_Price.toLocaleString()} đ</Text>
        <View style={styles.row}>
          <Text style={[styles.badge, quick ? styles.quick : styles.regular]}>
            {quick ? t("quick") : t("regular")} · {dish.BIT240230_PreparationTime} {t("minutes")}
          </Text>
          <Text style={[styles.badge, available ? styles.ok : styles.off]}>
            {available ? t("available") : t("unavailable")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  image: { width: 88, height: 88, borderRadius: 8, backgroundColor: "#eee" },
  noImage: { alignItems: "center", justifyContent: "center" },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  sub: { color: "#666", marginTop: 2 },
  price: { marginTop: 2, fontWeight: "600", color: "#d35400" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 6 },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: "hidden" },
  quick: { backgroundColor: "#d5f5e3", color: "#1e8449" },
  regular: { backgroundColor: "#fdebd0", color: "#b9770e" },
  ok: { backgroundColor: "#d6eaf8", color: "#21618c" },
  off: { backgroundColor: "#f2d7d5", color: "#922b21" },
});