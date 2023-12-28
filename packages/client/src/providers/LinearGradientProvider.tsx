import { View, Text } from "react-native";
import React from "react";
import { COLORS } from "../constants";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children: React.ReactNode;
}
const LinearGradientProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  return (
    <LinearGradient
      colors={[COLORS.main, COLORS.primary]}
      style={{
        flex: 1,
      }}
      start={{
        x: 0,
        y: 1,
      }}
      end={{
        x: 0,
        y: 0,
      }}
    >
      {children}
    </LinearGradient>
  );
};

export default LinearGradientProvider;
