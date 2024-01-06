import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contact } from "expo-contacts";
import { countries } from "../constants/countries";

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
