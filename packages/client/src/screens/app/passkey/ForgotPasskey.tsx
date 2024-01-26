import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../../styles";
import { COLORS, FONTS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import PinInput from "../../../components/PinInput/PinInput";
import { trpc } from "../../../utils/trpc";
import Ripple from "../../../components/Ripple/Ripple";

const ForgotPasskey: React.FunctionComponent<AppNavProps<"ForgotPasskey">> = ({
  navigation,
}) => {
  const { os } = usePlatform();
  const [state, setState] = React.useState({ error: "", pin: "" });
  const [pin, setPin] = React.useState<string>("");
  const { isLoading: verifying, mutateAsync: mutateVerifyPin } =
    trpc.user.verifyPin.useMutation();
  const validateOldPin = () => {
    mutateVerifyPin({ pin: state.pin }).then((res) => {
      if (!!res.error) {
        setState((state) => ({ ...state, error: res.error, pin: "" }));
        setPin("");
        return;
      } else {
        setState((state) => ({ ...state, error: "" }));
        setPin("");
        navigation.navigate("NewPasskey");
      }
    });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Forgot Passkey",
      headerShown: true,
      headerTitleStyle: {
        fontFamily: FONTS.regularBold,
        color: COLORS.main,
      },
      headerStyle: {
        backgroundColor: COLORS.tertiary,
        height: 100,
      },
      headerLeft: () => (
        <AppStackBackButton
          label={os === "ios" ? "Settings" : ""}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);
  return (
    <LinearGradientProvider>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 500,
              padding: 10,
              alignSelf: "center",
            }}
          >
            <Text
              style={[
                styles.h1,
                {
                  marginBottom: 10,
                  fontSize: 20,
                  marginTop: 20,
                },
              ]}
            >
              Current Account Pin
            </Text>
            <PinInput
              pin={pin}
              setPin={setPin}
              onComplete={(pin) => {
                setState((state) => ({
                  ...state,
                  pin,
                }));
              }}
              length={5}
              placeholder="0"
            />
            <Text
              style={[
                styles.p,
                {
                  color: COLORS.red,
                  marginVertical: 5,
                },
              ]}
            >
              {state.error}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={validateOldPin}
              disabled={!!!state.pin}
              style={{
                backgroundColor: !!state.pin ? COLORS.tertiary : COLORS.gray,
                padding: 10,
                width: 200,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                marginTop: 10,
                flexDirection: "row",
                alignSelf: "flex-end",
              }}
            >
              <Text
                style={[
                  styles.button__text,
                  {
                    color: COLORS.white,
                    marginRight: verifying ? 10 : 0,
                  },
                ]}
              >
                Next
              </Text>
              {verifying ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default ForgotPasskey;
