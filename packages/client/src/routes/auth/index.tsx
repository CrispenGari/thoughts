import { createStackNavigator } from "@react-navigation/stack";

import { Landing, Login, Register } from "../../screens/auth";
import type { AuthParamList } from "../../params";

const Stack = createStackNavigator<AuthParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={Landing} />

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};
