import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet,
  Switch, Text, TextInput, View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { categoryApi } from "../api/categoryApi";
import { dishApi } from "../api/dishApi";
import DishCard from "../components/DishCard";
import { useLanguage } from "../context/LanguageContext";
import { Dish, DishCategory } from "../types";
import { applyFilters, DEFAULT_FILTERS, Filters, SortKey } from "../utils/filterDishes";
import { validatePriceRange } from "../utils/validation";
import { TKey } from "../i18n/translations";

const SORTS: { key: SortKey; label: TKey }[] = [
  { key: "none", label: "sortNone" },
  { key: "priceAsc", label: "sortPriceAsc" },
  { key: "priceDesc", label: "sortPriceDesc" },
  { key: "timeAsc", label: "sortTimeAsc" },
];

export default function DishListScreen() {
  const { t, tError } = useLanguage();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<DishCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, c] = await Promise.all([dishApi.getAll(), categoryApi.getAll()]);
      setDishes(d);
      setCategories(c);
    } catch (e: any) {
      setError(e?.message ?? "NETWORK_ERROR");
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải lại mỗi khi màn hình được focus (vd: quay về sau khi thêm/sửa/xóa)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const rangeError = validatePriceRange(filters.minPrice, filters.maxPrice);
  const categoryName = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => (map[c.id] = c.BIT240230_Name));
    return map;
  }, [categories]);

  const visible = useMemo(
    () => applyFilters(dishes, filters, rangeError === null),
    [dishes, filters, rangeError]
  );

  const header = (
    <View style={styles.filters}>
      <TextInput
        style={styles.input}
        placeholder={t("searchPlaceholder")}
        value={filters.search}
        onChangeText={(v) => set("search", v)}
      />

      <Text style={styles.label}>{t("category")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label={t("all")} active={filters.categoryId === "all"} onPress={() => set("categoryId", "all")} />
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.BIT240230_Name}
            active={filters.categoryId === c.id}
            onPress={() => set("categoryId", c.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.switchRow}>
        <Text>{t("availableOnly")}</Text>
        <Switch value={filters.onlyAvailable} onValueChange={(v) => set("onlyAvailable", v)} />
      </View>

      <View style={styles.rangeRow}>
        <TextInput
          style={[styles.input, styles.half]}
          placeholder={t("priceFrom")}
          keyboardType="numeric"
          value={filters.minPrice}
          onChangeText={(v) => set("minPrice", v)}
        />
        <TextInput
          style={[styles.input, styles.half]}
          placeholder={t("priceTo")}
          keyboardType="numeric"
          value={filters.maxPrice}
          onChangeText={(v) => set("maxPrice", v)}
        />
      </View>
      {rangeError && <Text style={styles.error}>{tError(rangeError)}</Text>}

      <Text style={styles.label}>{t("sortBy")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {SORTS.map((s) => (
          <Chip key={s.key} label={t(s.label)} active={filters.sort === s.key} onPress={() => set("sort", s.key)} />
        ))}
      </ScrollView>

      <Pressable onPress={() => setFilters(DEFAULT_FILTERS)}>
        <Text style={styles.reset}>{t("resetFilters")}</Text>
      </Pressable>
    </View>
  );

  if (loading && dishes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>{t("loading")}</Text>
      </View>
    );
  }

  if (error && dishes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{tError(error)}</Text>
        <Pressable style={styles.retryBtn} onPress={load}>
          <Text style={{ color: "#fff" }}>{t("retry")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={{ padding: 12 }}
      data={visible}
      keyExtractor={(d) => d.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={header}
      ListEmptyComponent={
        <Text style={styles.empty}>{dishes.length === 0 ? t("emptyList") : t("noResults")}</Text>
      }
      renderItem={({ item }) => (
        <DishCard
          dish={item}
          categoryName={categoryName[item.BIT240230_DishCategoryId] ?? "?"}
          // onPress sẽ nối sang màn hình chi tiết ở giai đoạn sau
        />
      )}
    />
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: "#f4f6f8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  filters: { marginBottom: 8 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#ddd" },
  label: { marginTop: 10, marginBottom: 4, fontWeight: "600" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  rangeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  half: { flex: 1 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#e5e8eb", marginRight: 8 },
  chipActive: { backgroundColor: "#2980b9" },
  chipText: { color: "#333" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  error: { color: "#c0392b", marginTop: 4 },
  reset: { color: "#2980b9", marginTop: 10, fontWeight: "600" },
  empty: { textAlign: "center", color: "#777", marginTop: 30 },
  retryBtn: { marginTop: 12, backgroundColor: "#2980b9", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});