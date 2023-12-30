import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Divider from "../../../components/Divider/Divider";
import Ripple from "../../../components/Ripple/Ripple";
import { logo, APP_NAME, COLORS } from "../../../constants";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import { AuthNavProps } from "../../../params";
import PinInput from "../../../components/PinInput/PinInput";
import { trpc } from "../../../utils/trpc";

const ConfirmPin: React.FunctionComponent<AuthNavProps<"ConfirmPin">> = ({
  navigation,
  route,
}) => {
  const [pin, setPin] = React.useState<string>("");
  const [state, setState] = React.useState({
    error: "",
    pin2: "",
    pin1: route.params.pin1,
    phoneNumber: route.params.phoneNumber,
  });
  const { mutateAsync, isLoading } = trpc.register.validatePin.useMutation();
  const validatePin = () => {
    mutateAsync({ pin1: state.pin1, pin2: state.pin2 })
      .then((res) => {
        if (res.error) {
          setState((state) => ({ ...state, error: res.error }));
          Alert.alert(
            APP_NAME,
            res.error,
            res.retry
              ? [
                  {
                    text: "Retry",
                    onPress: () => {
                      setPin("");
                      setState((state) => ({
                        ...state,
                        pin2: "",
                      }));
                    },
                    style: "destructive",
                  },
                ]
              : [
                  {
                    text: "OK",
                    onPress: () => {
                      setPin("");
                      setState((state) => ({ ...state, pin2: "" }));
                      navigation.replace("SetPin", {
                        phoneNumber: state.phoneNumber,
                      });
                    },
                  },
                ]
          );
        } else {
          setState({ error: "", phoneNumber: "", pin1: "", pin2: "" });
          navigation.replace("SetProfile", {
            phoneNumber: state.phoneNumber,
            pin: res.pin!,
          });
        }
      })
      .catch((error) =>
        setState((state) => ({
          ...state,
          error: "Unknown request error. Try Again.",
        }))
      );
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <LinearGradientProvider>
          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: Image.resolveAssetSource(logo).uri,
              }}
              style={{
                width: 100,
                height: 100,
                marginBottom: 10,
                resizeMode: "contain",
                marginTop: 30,
              }}
            />
            <Text
              style={[
                styles.p,
                {
                  textAlign: "center",
                  height: 100,
                },
              ]}
            >
              Welcome to {APP_NAME}.
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
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
                  textAlign: "center",
                  marginBottom: 50,
                  fontSize: 20,
                },
              ]}
            >
              Confirm Pin
            </Text>
            <PinInput
              pin={pin}
              setPin={setPin}
              onComplete={(pin) => {
                setState((state) => ({ ...state, pin2: pin }));
              }}
              length={5}
              placeholder="0"
              inputStyle={{
                borderColor: !!state.error ? COLORS.red : COLORS.tertiary,
              }}
            />

            <Text
              style={[
                styles.p,
                {
                  color: COLORS.red,
                  marginTop: 5,
                },
              ]}
            >
              {state.error}
            </Text>
            {!!state.pin2 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isLoading}
                onPress={validatePin}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 5,
                    alignSelf: "flex-end",
                    marginTop: 10,
                    marginBottom: 20,
                    maxWidth: 200,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.button__text,
                    {
                      marginRight: isLoading ? 10 : 0,
                    },
                  ]}
                >
                  NEXT
                </Text>
                {isLoading ? <Ripple color={COLORS.tertiary} size={5} /> : null}
              </TouchableOpacity>
            ) : null}
            <Divider color={COLORS.black} title="Already registered?" />
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isLoading}
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.secondary,
                  padding: 10,
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  marginTop: 10,
                  maxWidth: 200,
                },
              ]}
            >
              <Text style={[styles.button__text]}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </LinearGradientProvider>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ConfirmPin;
