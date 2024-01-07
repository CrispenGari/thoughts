import { COLORS } from "../../constants";
import type { AppParamList } from "../../params";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  AppPrivacyPolicy,
  AppTermsOfUse,
  Home,
  Settings,
  Notifications,
  Profile,
  BlockedContacts,
  ChangePin,
  UpdatePhoneNumber,
} from "../../screens/app";
import { AppState } from "react-native";
import { trpc } from "../../utils/trpc";
import { useMeStore, useSubscriptionsStore } from "../../store";

const Stack = createStackNavigator<AppParamList>();

export const AppTabs = () => {
  const { me } = useMeStore();
  const { setUser, setThought } = useSubscriptionsStore();
  // listen to all subscriptions here
  trpc.thought.onUpdate.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        if (data) {
          setThought({ thoughtId: data.id || 0, userId: data.userId || 0 });
        }
      },
    }
  );
  trpc.thought.onCreate.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        setThought({ thoughtId: data.id || 0, userId: data.userId || 0 });
      },
    }
  );
  trpc.thought.onDelete.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        setThought({ thoughtId: data.id || 0, userId: data.userId || 0 });
      },
    }
  );
  trpc.user.onStatus.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        setUser(data.id || 0);
      },
    }
  );

  const { mutateAsync } = trpc.user.statusUpdate.useMutation();
  const appState = React.useRef(AppState.currentState);
  const [isOnline, setIsOnline] = React.useState<boolean>(
    appState.current === "active"
  );
  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsOnline(nextAppState === "active");
    });
    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    mutateAsync({ status: isOnline }).then((res) => {});
  }, [isOnline]);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          borderColor: "transparent",
          backgroundColor: COLORS.tertiary,
          height: 100,
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="AppPrivacyPolicy" component={AppPrivacyPolicy} />
      <Stack.Screen name="AppTermsOfUse" component={AppTermsOfUse} />
      <Stack.Screen name="UpdatePhoneNumber" component={UpdatePhoneNumber} />
      <Stack.Screen name="ChangePin" component={ChangePin} />
      <Stack.Screen name="BlockedContact" component={BlockedContacts} />
    </Stack.Navigator>
  );
};
