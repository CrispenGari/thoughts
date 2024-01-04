import { FlatList, SafeAreaView } from "react-native";
import React from "react";
import { useContacts } from "../../hooks/useContacts";
import Contact from "../Contact/Contact";
import { getContactNumbers } from "../../utils";

const Contacts = () => {
  const { contacts } = useContacts();
  const contactNumbers = getContactNumbers(contacts);
  return (
    <SafeAreaView style={{ flex: 0.4 }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={contacts}
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
