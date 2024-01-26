import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contact } from "expo-contacts";
import * as StoreReview from "expo-store-review";
import * as Updates from "expo-updates";
import { countries } from "../constants/countries";
import { Alert } from "react-native";
import { APP_NAME, COLORS } from "../constants";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";
import * as Notifications from "expo-notifications";
import { TNotificationData } from "../types";

export const reloadApp = () => {
  Updates.reloadAsync();
};
export const generateRNFile = ({
  uri,
  name,
}: {
  uri: string;
  name: string;
}) => {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || "image",
        name,
      })
    : null;
};

export const getContactNumber = (contact: Contact) => {
  const phoneNumbers = contact.phoneNumbers
    ?.map((phoneNumber) => {
      const country = countries.find(
        (c) => c.code.toLowerCase() === phoneNumber.countryCode?.toLowerCase()
      );
      if (!!!country) return phoneNumber.number || "";
      const number = phoneNumber.number?.startsWith("+")
        ? phoneNumber.number
        : country.phone.code.concat(
            phoneNumber.number?.substring(1)?.replace(/\D/g, "") || ""
          );
      return number;
    })

    .filter(Boolean);
  const contactName = contact.name || "";
  return {
    contactName,
    phoneNumbers: !!phoneNumbers ? phoneNumbers : [],
  };
};
export const getContactNumbers = (contacts: Contact[]) =>
  contacts
    .map((contact) => {
      const phoneNumbers = contact.phoneNumbers
        ?.map((phoneNumber) => {
          const country = countries.find(
            (c) =>
              c.code.toLowerCase() === phoneNumber.countryCode?.toLowerCase()
          );
          if (!!!country) return phoneNumber.number || "";
          const number = phoneNumber.number?.startsWith("+")
            ? phoneNumber.number
            : country.phone.code.concat(
                phoneNumber.number?.substring(1)?.replace(/\D/g, "") || ""
              );
          return number;
        })

        .filter(Boolean);
      const contactName = contact.name;
      return {
        phoneNumbers: phoneNumbers?.length ? phoneNumbers : [],
        contactName,
      };
    })
    .filter(Boolean);

export const store = async (key: string, value: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    return true;
  }
};

export const retrieve = async (key: string): Promise<string | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (error: any) {
    return null;
  }
};

export const del = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error: any) {
    return false;
  }
};

export const rateApp = async () => {
  const available = await StoreReview.isAvailableAsync();
  if (available) {
    const hasAction = await StoreReview.hasAction();
    if (hasAction) {
      await StoreReview.requestReview();
    }
  }
};

export const onFetchUpdateAsync = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    Alert.alert(
      APP_NAME,
      error as any,
      [{ text: "OK", style: "destructive" }],
      { cancelable: false }
    );
  }
};

export const schedulePushNotification = async <
  TData extends TNotificationData
>({
  title,
  body,
  data,
  badge,
  subtitle,
}: {
  title: string;
  body: string;
  data: TData;
  badge?: number;
  subtitle?: string;
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      badge,
      color: COLORS.tertiary,
      subtitle,
    },
    trigger: { seconds: 1 },
  });
};
