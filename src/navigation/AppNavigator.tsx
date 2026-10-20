import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";
import DishListScreen from "../screens/DishListScreen";

export type RootStackParamList = {
  DishList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { t } = useLanguage();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="DishList"
          component={DishListScreen}
          options={{
            title: t("appTitle"),
            headerRight: () => <LanguageToggle />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}