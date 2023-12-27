import { COLORS } from "../../constants";
import type { AppParamList } from "../../params";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Home, Settings } from "../../screens/app";
const Stack = createStackNavigator<AppParamList>();

export const AppTabs = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          borderColor: "transparent",
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};
