import { FlatList, SafeAreaView, Text, View } from "react-native";
import React from "react";
import { useContacts } from "../../hooks/useContacts";
import Contact from "../Contact/Contact";
import { getContactNumbers } from "../../utils";
import { COLORS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";
import { useMeStore } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import ContactSkeleton from "../Contact/ContactSkeleton";
import { useMediaQuery } from "../../hooks";

interface Props {
  navigation: StackNavigationProp<AppParamList, "Home">;
}
const Contacts: React.FunctionComponent<Props> = ({ navigation }) => {
  const { contacts } = useContacts();
  const {
    dimension: { width },
  } = useMediaQuery();
  const contactNumbers = getContactNumbers(contacts);
  const { me } = useMeStore();
  const { data, refetch, isLoading } = trpc.user.all.useQuery();

  trpc.register.onNewUser.useSubscription(
    {
      userId: me?.id || 0,
    },
    {
      onData: async (data) => {
        await refetch();
      },
    }
  );

  if (isLoading)
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.primary,
          width: "100%",
          maxWidth: 600,
          alignSelf: "center",
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
        }}
      >
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
            style={{ width: "100%", flexDirection: "row" }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            data={
              width < 600
                ? Array.from([{ id: 2 }, { id: 3 }])
                : Array.from([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }])
            }
            keyExtractor={({ id }) => id.toString()}
            horizontal
            renderItem={({ item }) => {
              return <ContactSkeleton last={item.id === 3} />;
            }}
          />
        </View>
      </SafeAreaView>
    );

  if (data?.users.length === 0 && !isLoading) {
    <SafeAreaView
      style={{
        backgroundColor: COLORS.primary,
        width: "100%",
        maxWidth: 600,
        alignSelf: "center",
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
      }}
    >
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
          <Text style={[styles.h1]}>No contacts with thoughts account?</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", flexDirection: "row" }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={
            width < 600
              ? Array.from([{ id: 2 }, { id: 3 }])
              : Array.from([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }])
          }
          keyExtractor={({ id }) => id.toString()}
          horizontal
          renderItem={({ item }) => {
            return <ContactSkeleton last={item.id === 3} />;
          }}
        />
      </View>
    </SafeAreaView>;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.primary,
        width: "100%",
        maxWidth: 600,
        alignSelf: "center",
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
      }}
    >
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
            return (
              <Contact
                contact={item}
                onPress={() => {
                  navigation.navigate("Profile", {
                    isMe: false,
                    userId: item.id,
                    from: "Home",
                  });
                }}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Contacts;
