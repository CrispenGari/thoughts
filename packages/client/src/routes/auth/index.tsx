import { createStackNavigator } from "@react-navigation/stack";
import {
  ConfirmPin,
  Landing,
  Login,
  SetPhoneNumber,
  SetPin,
  SetProfile,
} from "../../screens/auth";
import type { AuthParamList } from "../../params";
const Stack = createStackNavigator<AuthParamList>();
export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SetPhoneNumber"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SetPhoneNumber" component={SetPhoneNumber} />
      <Stack.Screen name="SetPin" component={SetPin} />
      <Stack.Screen name="SetProfile" component={SetProfile} />
    </Stack.Navigator>
  );
};
