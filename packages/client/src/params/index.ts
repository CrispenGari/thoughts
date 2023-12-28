import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

// Auth Stack
export type AuthParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
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
};

export type AppNavProps<T extends keyof AppParamList> = {
  navigation: StackNavigationProp<AppParamList, T>;
  route: RouteProp<AppParamList, T>;
};
