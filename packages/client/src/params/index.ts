import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

// Auth Stack
export type AuthParamList = {
  Landing: undefined;
  NewPin: { phoneNumber: string };
  PhoneNumber: undefined;
  PinCode: { phoneNumber: string };
  SetPhoneNumber: undefined;
  SetPin: { phoneNumber: string };
  ConfirmPin: { phoneNumber: string; pin1: string };
  SetProfile: { pin: string; phoneNumber: string };
  AuthTermsOfUse: {
    from: keyof AuthParamList;
  };
  AuthPrivacyPolicy: {
    from: keyof AuthParamList;
  };
};

export type AuthNavProps<T extends keyof AuthParamList> = {
  navigation: StackNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};

// App Stack
export type AppParamList = {
  Home: undefined;
  Settings: undefined;

  Notifications: undefined;
  Profile: undefined;
  AppTermsOfUse: {
    from: keyof AppParamList;
  };
  AppPrivacyPolicy: {
    from: keyof AppParamList;
  };
};

export type AppNavProps<T extends keyof AppParamList> = {
  navigation: StackNavigationProp<AppParamList, T>;
  route: RouteProp<AppParamList, T>;
};
