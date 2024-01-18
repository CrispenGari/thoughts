import { View, Text, Image } from "react-native";
import React from "react";
import { CardField, CardFieldInput } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, mastercard, paywave, simcard } from "../../constants";
import { styles } from "../../styles";

interface CProps {
  setState: React.Dispatch<
    React.SetStateAction<{
      details: CardFieldInput.Details | null;
      email: string;
      height: number;
      category: "active_status" | "general";
    }>
  >;
}
const PaymentCard: React.FunctionComponent<CProps> = ({ setState }) => {
  return (
    <LinearGradient
      colors={[COLORS.black, COLORS.tertiary]}
      style={{
        backgroundColor: COLORS.black,
        width: "100%",
        maxWidth: 400,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        height: 200,
      }}
      start={{
        x: 0,
        y: 1,
      }}
      end={{
        x: 1,
        y: 1,
      }}
    >
      <Text
        style={[
          styles.h1,
          {
            color: COLORS.white,
            marginBottom: 10,
            fontSize: 20,
            letterSpacing: 1,
          },
        ]}
      >
        VISA CLASSIC
      </Text>
      <CardField
        postalCodeEnabled={true}
        cardStyle={{
          backgroundColor: COLORS.main,
          textColor: COLORS.black,
          textErrorColor: COLORS.red,
          cursorColor: COLORS.black,
        }}
        style={{ padding: 20, marginVertical: 5 }}
        placeholders={{
          number: "4242 4242 4242 4242",
          expiration: "exp",
          cvc: "cvc",
          postalCode: "pcode",
        }}
        onCardChange={(cardDetails) =>
          setState((state) => ({ ...state, details: cardDetails }))
        }
      />
      <View
        style={{ padding: 10, flex: 1, flexDirection: "row", paddingTop: 20 }}
      >
        <Image
          style={{
            width: 80,
            height: 50,
            resizeMode: "contain",
          }}
          source={{ uri: Image.resolveAssetSource(simcard).uri }}
        />
        <Image
          style={{
            width: 100,
            height: 80,
            resizeMode: "contain",
          }}
          tintColor={COLORS.main}
          source={{ uri: Image.resolveAssetSource(paywave).uri }}
        />
      </View>
      <Image
        style={{
          width: 80,
          height: 50,
          resizeMode: "contain",
          position: "absolute",
          bottom: 10,
          right: 10,
        }}
        source={{ uri: Image.resolveAssetSource(mastercard).uri }}
      />
    </LinearGradient>
  );
};

export default PaymentCard;
