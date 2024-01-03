import React from "react";

import * as Contacts from "expo-contacts";
export const useContacts = () => {
  const [state, setState] = React.useState<{
    contacts: Contacts.Contact[];
    granted: boolean;
  }>({
    contacts: [],
    granted: false,
  });
  React.useEffect(() => {
    (async () => {
      const { granted } = await Contacts.requestPermissionsAsync();
      if (granted) {
        const { data } = await Contacts.getContactsAsync({});
        setState({ granted, contacts: data });
      } else {
        setState({ granted, contacts: [] });
      }
    })();
  }, []);
  return {
    ...state,
  };
};
