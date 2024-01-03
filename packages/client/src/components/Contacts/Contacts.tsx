import { Text, FlatList, SafeAreaView } from "react-native";
import React from "react";
import { useContacts } from "../../hooks/useContacts";

import { styles } from "../../styles";
import Contact from "../Contact/Contact";
import { countries } from "../../constants/countries";
import { getContactNumbers } from "../../utils";

const Contacts = () => {
  const { contacts } = useContacts();

  const numbers = getContactNumbers(contacts);
  console.log(JSON.stringify(numbers, null, 2));
  return (
    <SafeAreaView style={{ flex: 0.4 }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={contacts.slice(0, 10)}
        keyExtractor={({ id }) => id}
        horizontal
        renderItem={({ item }) => {
          return <Contact contact={item} />;
        }}
      />
    </SafeAreaView>
  );
};

export default Contacts;
