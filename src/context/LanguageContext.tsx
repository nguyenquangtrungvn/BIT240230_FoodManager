import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PREFIX } from "../constants/config";
import { Lang, TKey, translations } from "../i18n/translations";

const STORAGE_KEY = `${PREFIX}language`;

type Ctx = {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TKey) => string;
  // Dịch mã lỗi (ERR_..., NETWORK_ERROR...). Nếu không có thì trả lại nguyên mã
  tError: (code: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en"); // mặc định English

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "en" || saved === "vi") setLang(saved);
      })
      .catch(() => {});
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "vi" : "en";
    setLang(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const t = (key: TKey) => translations[lang][key];
  const tError = (code: string) =>
    (translations[lang] as Record<string, string>)[code] ?? code;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, tError }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}