import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contact } from "expo-contacts";
import { countries } from "../constants/countries";

export const getContactNumbers = (contacts: Contact[]) =>
  contacts
    .map((contact) =>
      contact.phoneNumbers
        ?.map((phoneNumber) => {
          const country = countries.find(
            (c) =>
              c.code.toLowerCase() === phoneNumber.countryCode?.toLowerCase()
          );
          if (!!!country) return null;
          const number = phoneNumber.number?.startsWith("+")
            ? phoneNumber.number
            : country.phone.code.concat(
                phoneNumber.number?.replace(/\D/g, "") || ""
              );
          return number;
        })
        .filter(Boolean)
    )
    .filter(Boolean);

export const store = async (key: string, value: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    console.log(error);
    return true;
  }
};

export const retrieve = async (key: string): Promise<string | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (error: any) {
    console.log(error);
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
