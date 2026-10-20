import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LanguageProvider } from "./src/context/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { seedIfEmpty } from "./src/utils/seed";

export default function App() {
  useEffect(() => {
    seedIfEmpty().catch(() => {}); // lỗi mạng sẽ hiện ở màn hình danh sách
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}