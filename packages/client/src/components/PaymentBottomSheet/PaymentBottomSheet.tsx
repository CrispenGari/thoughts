import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React from "react";
import { BottomSheet } from "react-native-btr";
import { useMediaQuery } from "../../hooks";
import { APP_NAME, COLORS } from "../../constants";
import { styles } from "../../styles";
import { CardFieldInput, confirmPayment } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import PaymentCard from "./PaymentCard";
import PaymentPricing from "./PaymentPricing";

import Ripple from "../Ripple/Ripple";
import { trpc } from "../../utils/trpc";
import CustomTextInput from "../CustomTextInput/CustomTextInput";

interface Props {
  toggle: () => void;
  open: boolean;
}
const PaymentBottomSheet: React.FunctionComponent<Props> = ({
  open,
  toggle,
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();

  const { isLoading: paying, mutateAsync } = trpc.payment.pay.useMutation();

  const [state, setState] = React.useState<{
    details: CardFieldInput.Details | null;
    email: string;
    height: number;
    category: "active_status" | "general";
  }>({
    email: "",
    details: null,
    height: height * 0.7,
    category: "active_status",
  });

  const pay = () => {
    const { email, details } = state;
    if (!details || !email || !details.complete) {
      Alert.alert(APP_NAME, "Please enter Complete card details and Email", [
        { style: "destructive", text: "OK" },
      ]);
      return;
    }
    mutateAsync({ category: state.category, type: "e-payment" }).then(
      async (res) => {
        if (res.error || !!!res.secrete) {
          Alert.alert(APP_NAME, res?.error ?? "Payment failed", [
            { style: "destructive", text: "OK" },
          ]);
          return;
        }
        const { paymentIntent, error: e } = await confirmPayment(res.secrete, {
          paymentMethodType: "Card",
          paymentMethodData: {
            cvc: state.details?.cvc,
            billingDetails: {
              email: state.email,
            },
          },
        });
        if (e) {
          Alert.alert(APP_NAME, e.message, [
            { style: "destructive", text: "OK" },
          ]);
          return;
        } else if (paymentIntent) {
          Alert.alert(APP_NAME, "You have paid our for the service.", [
            {
              style: "default",
              text: "OK",
              onPress: () => {
                setState((state) => ({
                  ...state,
                  details: null,
                  email: "",
                  category: "active_status",
                  height: height * 0.7,
                }));
                toggle();
              },
            },
          ]);
        }
      }
    );
  };
  React.useEffect(() => {
    const showEvent = Keyboard.addListener("keyboardDidShow", ({}) => {
      setState((state) => ({ ...state, height: height * 0.9 }));
    });
    return () => {
      showEvent.remove();
    };
  }, []);
  React.useEffect(() => {
    const hideEvent = Keyboard.addListener("keyboardWillHide", ({}) => {
      setState((state) => ({ ...state, height: height * 0.7 }));
    });
    return () => {
      hideEvent.remove();
    };
  }, []);

  return (
    <BottomSheet
      visible={!!open}
      onBackButtonPress={toggle}
      onBackdropPress={toggle}
    >
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View
          style={{
            height: state.height,
            backgroundColor: COLORS.main,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            padding: 10,
          }}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: COLORS.main,
              paddingHorizontal: 15,
              top: -10,
              shadowRadius: 2,
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.5,
              alignSelf: "center",
              paddingVertical: 5,
              shadowColor: COLORS.tertiary,
              borderRadius: 999,
            }}
          >
            <Text
              style={[
                styles.h1,
                {
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                },
              ]}
            >
              PAYMENT CHECKOUT
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <PaymentPricing state={state} setState={setState} />
            <View style={{ width: "100%", maxWidth: 400, marginTop: 15 }}>
              <CustomTextInput
                placeholderTextColor={COLORS.black}
                text={state.email}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, email: text }))
                }
                keyboardType="email-address"
                placeholder="Email Address"
                inputStyle={{
                  fontSize: 18,
                  paddingVertical: 10,
                  flex: 1,
                  color: COLORS.black,
                }}
              />
            </View>
            <PaymentCard setState={setState} />
            <View
              style={{ width: "100%", maxWidth: 400, flexDirection: "row" }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.red,
                  padding: 10,
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: 10,
                  flexDirection: "row",
                }}
                activeOpacity={0.7}
                disabled={paying}
                onPress={pay}
              >
                <Text
                  style={[
                    styles.p,
                    { color: COLORS.white, marginRight: paying ? 10 : 0 },
                  ]}
                >
                  Pay
                </Text>
                {paying ? <Ripple size={5} color={COLORS.white} /> : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.tertiary,
                  padding: 10,
                  width: 120,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: 10,
                  marginLeft: 10,
                  flexDirection: "row",
                }}
                activeOpacity={0.7}
                onPress={toggle}
              >
                <Text style={[styles.p, { color: COLORS.white }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

export default PaymentBottomSheet;
