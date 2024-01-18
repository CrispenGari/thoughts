import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../../styles";

import { COLORS } from "../../constants";
import { CardFieldInput } from "@stripe/stripe-react-native";
import { useMeStore } from "../../store";

interface Props {
  setState: React.Dispatch<
    React.SetStateAction<{
      details: CardFieldInput.Details | null;
      email: string;
      height: number;
      category: "active_status" | "general";
    }>
  >;
  state: {
    details: CardFieldInput.Details | null;
    email: string;
    height: number;
    category: "active_status" | "general";
  };
}
const PaymentPricing: React.FunctionComponent<Props> = ({
  setState,
  state,
}) => {
  const { me } = useMeStore();
  return (
    <View
      style={{
        marginTop: 30,
        width: "100%",
        maxWidth: 400,
        shadowColor: COLORS.secondary,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          setState((state) => ({ ...state, category: "active_status" }))
        }
        style={{
          width: 100,
          height: 100,
          justifyContent: "center",
          padding: 10,
          alignItems: "center",
          borderRadius: 5,
          backgroundColor:
            state.category === "active_status" ? COLORS.tertiary : COLORS.main,
        }}
      >
        <Text
          style={[
            styles.h1,
            {
              color:
                state.category === "active_status"
                  ? COLORS.white
                  : COLORS.black,
              textAlign: "center",
              fontSize: 16,
            },
          ]}
        >
          INVISIBLE MODE
        </Text>
        <View
          style={{
            marginTop: 20,
            width: "100%",
            borderRadius: 999,
            backgroundColor:
              state.category === "active_status" ? COLORS.red : COLORS.tertiary,
            paddingVertical: 5,
            alignItems: "center",
          }}
        >
          <Text style={[styles.h1, { color: COLORS.white }]}>{`${
            me?.payments?.find((p) => p.category === "active_status")
              ? "PAID"
              : "$15.99/pm"
          }`}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setState((state) => ({ ...state, category: "general" }))}
        style={{
          width: 100,
          height: 100,
          justifyContent: "center",
          padding: 10,
          alignItems: "center",
          borderRadius: 5,
          backgroundColor:
            state.category === "general" ? COLORS.tertiary : COLORS.main,
        }}
      >
        <Text
          style={[
            styles.h1,
            {
              color: state.category === "general" ? COLORS.white : COLORS.black,
              textAlign: "center",
              fontSize: 16,
            },
          ]}
        >
          GENERAL
        </Text>
        <View
          style={{
            marginTop: 20,
            width: "100%",
            borderRadius: 999,
            backgroundColor:
              state.category === "general" ? COLORS.red : COLORS.tertiary,
            paddingVertical: 5,
            alignItems: "center",
          }}
        >
          <Text style={[styles.h1, { color: COLORS.white }]}>
            <Text style={[styles.h1, { color: COLORS.white }]}>{`${
              me?.payments?.find((p) => p.category === "general")
                ? "PAID"
                : "$21.99/pm"
            }`}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentPricing;
