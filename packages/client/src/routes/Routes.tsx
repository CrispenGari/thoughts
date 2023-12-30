import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppTabs } from "./app";
import { AuthStack } from "./auth";
import * as Linking from "expo-linking";
import { useMeStore } from "../store";

const Routes = () => {
  const { me } = useMeStore();
  const prefix = Linking.createURL("/");
  return (
    <NavigationContainer
      linking={{
        prefixes: [
          prefix,
          "thoughts://",
          "https://thoughts.com",
          "https://*.thoughts.com",
        ],
        config: {
          screens: {},
        },
      }}
    >
      {!!me ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
