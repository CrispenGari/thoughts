import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { CountryType } from "@thoughts/api/src/types";

// Auth Stack
export type AuthParamList = {
  Landing: undefined;
  PhoneNumber: undefined;
  VerifyPasskey: { user: { phoneNumber: string }; country: CountryType };
  SetNewLoginPin: { user: { phoneNumber: string }; country: CountryType };
  ConfirmPinAndLogin: {
    user: { phoneNumber: string; pin1: string };
    country: CountryType;
  };
  PinCode: { user: { phoneNumber: string }; country: CountryType };
  SetPhoneNumber: undefined;
  SetPassKey: {
    user: { phoneNumber: string; pin: string };
    country: CountryType;
  };
  SetPin: { user: { phoneNumber: string }; country: CountryType };
  ConfirmPin: {
    user: { phoneNumber: string; pin1: string };
    country: CountryType;
  };
  SetProfile: {
    user: {
      phoneNumber: string;
      pin: string;
      passkeyQuestion: string;
      passkey: string;
    };
    country: CountryType;
  };
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
  DeleteAccount: undefined;
  ConfirmDeleteAccount: { reason: string };
  ConfirmNewPin: { pin1: string };
  NewPin: undefined;
  ForgotPin: undefined;
  Home: undefined;
  Settings: undefined;
  UpdatePhoneNumber: undefined;
  BlockedContact: undefined;
  ChangePin: undefined;
  Notifications: undefined;
  Profile: {
    userId: number;
    isMe: boolean;
    from: keyof AppParamList;
  };
  AppTermsOfUse: {
    from: keyof AppParamList;
  };
  AppPrivacyPolicy: {
    from: keyof AppParamList;
  };
  Thought: {
    id: number;
    notificationId: number;
    read: boolean;
    type: "comment" | "reply" | "comment_reaction" | "reply_reaction";
    userId: number;
    from: keyof AppParamList;
  };
  OldPasskey: undefined;
  NewPasskey: undefined;
  ForgotPasskey: undefined;
};

export type AppNavProps<T extends keyof AppParamList> = {
  navigation: StackNavigationProp<AppParamList, T>;
  route: RouteProp<AppParamList, T>;
};
