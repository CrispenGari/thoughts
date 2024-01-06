import { FlatList, SafeAreaView, Text, View } from "react-native";
import React from "react";
import { useContacts } from "../../hooks/useContacts";
import Contact from "../Contact/Contact";
import { getContactNumbers } from "../../utils";
import { COLORS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";

const Contacts = () => {
  const { contacts } = useContacts();
  const contactNumbers = getContactNumbers(contacts);

  const { data } = trpc.user.all.useQuery();
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
      <View
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 600,
          alignItems: "center",
          paddingTop: 20,
          backgroundColor: COLORS.primary,
          alignSelf: "center",
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -20,
            backgroundColor: COLORS.white,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 999,
            zIndex: 10,
          }}
        >
          <Text style={[styles.h1]}>What your contacts are thinking?</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={data?.users!}
          keyExtractor={({ id }) => id.toString()}
          horizontal
          renderItem={({ item }) => {
            return <Contact contact={item} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Contacts;
