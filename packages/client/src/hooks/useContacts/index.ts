import React from "react";

import * as Contacts from "expo-contacts";
export const useContacts = () => {
  const [state, setState] = React.useState<{
    contacts: {
      contactName: string | undefined;
      phoneNumbers:
        | {
            phoneNumber: string | undefined;
            countryCode: string | undefined;
          }[]
        | undefined;
    }[];
    granted: boolean;
    loading: boolean;
  }>({
    contacts: [],
    granted: false,
    loading: true,
  });
  React.useEffect(() => {
    (async () => {
      const { granted } = await Contacts.requestPermissionsAsync();
      if (granted) {
        const { data } = await Contacts.getContactsAsync({
          fields: ["phoneNumbers", "name", "lastName", "firstName"],
        });

        const _d = data.map((contact) => {
          return {
            contactName:
              contact.name ||
              contact.firstName
                ?.concat(" ")
                .concat(contact?.lastName || "")
                .trim(),
            phoneNumbers: contact.phoneNumbers?.map((number) => ({
              phoneNumber: number.number,
              countryCode: number.countryCode,
            })),
          };
        });
        setState({ granted, contacts: _d, loading: false });
      } else {
        setState({ granted, contacts: [], loading: false });
      }
    })();
  }, []);
  return {
    ...state,
  };
};
