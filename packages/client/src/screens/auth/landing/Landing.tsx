import { View, Text } from "react-native";
import React from "react";
import { trpc } from "../../../utils/trpc";

const Landing = () => {
  const { data, isFetched, isLoading } = trpc.user.all.useQuery();
  return (
    <View style={{ flex: 1 }}>
      <Text>{JSON.stringify({ data, isFetched, isLoading }, null, 2)}</Text>
    </View>
  );
};

export default Landing;
