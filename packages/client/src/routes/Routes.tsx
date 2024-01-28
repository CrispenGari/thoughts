import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppTabs } from "./app";
import { AuthStack } from "./auth";
import * as Linking from "expo-linking";
import { useMeStore } from "../store";
import { trpc } from "../utils/trpc";
import { del, reloadApp } from "../utils";
import { KEYS } from "../constants";
import { UserType } from "@thoughts/api/src/types";

const Routes = () => {
  const { me } = useMeStore();
  const [user, setUser] = React.useState<UserType | null>(null);
  const prefix = Linking.createURL("/");
  trpc.logout.onAuthStateChanged.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        if (data === null) {
          const res = await del(KEYS.TOKEN_KEY);
          if (res) {
            setUser(data);
            reloadApp();
          }
        }
      },
    }
  );
  trpc.user.onAuthStateChanged.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        if (data === null) {
          await del(KEYS.TOKEN_KEY);
        }
        setUser(data);
      },
    }
  );
  trpc.user.onDeleteAccount.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        const res = await del(KEYS.TOKEN_KEY);
        if (res) {
          setUser(data);
        }
      },
    }
  );
  React.useEffect(() => {
    setUser(me);
  }, [me]);

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
          screens: {
            Profile: "profile",
            Thought: "thought",
          },
        },
      }}
    >
      {!!user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
