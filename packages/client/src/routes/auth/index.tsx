import { createStackNavigator } from "@react-navigation/stack";
import {
  AuthPrivacyPolicy,
  AuthTermsOfUse,
  ConfirmPin,
  Landing,
  SetNewLoginPin,
  PhoneNumber,
  PinCode,
  SetPassKey,
  SetPhoneNumber,
  SetPin,
  SetProfile,
  VerifyPasskey,
  ConfirmPinAndLogin,
} from "../../screens/auth";
import type { AuthParamList } from "../../params";
const Stack = createStackNavigator<AuthParamList>();
export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="SetPassKey" component={SetPassKey} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      <Stack.Screen name="PinCode" component={PinCode} />
      <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
      <Stack.Screen name="SetNewLoginPin" component={SetNewLoginPin} />
      <Stack.Screen name="ConfirmPinAndLogin" component={ConfirmPinAndLogin} />
      <Stack.Screen name="VerifyPasskey" component={VerifyPasskey} />
      <Stack.Screen name="SetPhoneNumber" component={SetPhoneNumber} />
      <Stack.Screen name="SetPin" component={SetPin} />
      <Stack.Screen name="SetProfile" component={SetProfile} />
      <Stack.Screen name="AuthPrivacyPolicy" component={AuthPrivacyPolicy} />
      <Stack.Screen name="AuthTermsOfUse" component={AuthTermsOfUse} />
    </Stack.Navigator>
  );
};
