import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { t, toggleLang } = useLanguage();
  return (
    <Pressable onPress={toggleLang} style={styles.btn}>
      <Text style={styles.text}>{t("language")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, backgroundColor: "#2980b9" },
  text: { color: "#fff", fontWeight: "700" },
});