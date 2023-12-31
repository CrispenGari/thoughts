import { View, Text, TouchableOpacity, Button } from "react-native";
import React from "react";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { del } from "../../../utils";
import { KEYS } from "../../../constants";
import { useMeStore } from "../../../store";
import { trpc } from "../../../utils/trpc";

const Home = () => {
  const { setMe } = useMeStore();
  const { mutateAsync, isLoading } = trpc.logout.logout.useMutation();
  return (
    <LinearGradientProvider>
      <Text>{JSON.stringify({ isLoading }, null, 2)}</Text>
      <Button
        title="logout"
        onPress={() => {
          setMe(null);
          mutateAsync().then(async (res) => {
            if (res) {
              await del(KEYS.TOKEN_KEY).then(() => {});
            } else {
              alert("Fail");
            }
          });
        }}
      />
    </LinearGradientProvider>
  );
};

export default Home;
