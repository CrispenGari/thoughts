import { View, Text, TouchableOpacity, Button } from "react-native";
import React from "react";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { del } from "../../../utils";
import { KEYS } from "../../../constants";
import { useMeStore } from "../../../store";
import { trpc } from "../../../utils/trpc";
import { useContacts } from "../../../hooks/useContacts";
import MyThought from "../../../components/MyThought/MyThought";
import Contacts from "../../../components/Contacts/Contacts";

const Home = () => {
  const { setMe } = useMeStore();
  const { mutateAsync, isLoading } = trpc.logout.logout.useMutation();
  const { contacts } = useContacts();

  return (
    <LinearGradientProvider>
      {/* Form */}
      <MyThought />
      <Contacts />
    </LinearGradientProvider>
  );
};

export default Home;
