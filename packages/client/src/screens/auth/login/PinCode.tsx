import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "../../../components/PhoneInput/PhoneInput";
import { logo, APP_NAME, COLORS, KEYS } from "../../../constants";
import { AuthNavProps } from "../../../params";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import Divider from "../../../components/Divider/Divider";
import Ripple from "../../../components/Ripple/Ripple";
import { trpc } from "../../../utils/trpc";
import PinInput from "../../../components/PinInput/PinInput";
import { store } from "../../../utils";

const PinCode: React.FunctionComponent<AuthNavProps<"PinCode">> = ({
  navigation,
  route,
}) => {
  const [state, setState] = React.useState({
    error: "",
    pin: "",
  });
  const [pin, setPin] = React.useState<string>("");
  const { mutateAsync, isLoading } = trpc.login.loginOrFail.useMutation();
  const login = () => {
    mutateAsync({
      user: { phoneNumber: route.params.user.phoneNumber, pin: state.pin },
      country: route.params.country,
    }).then(async (res) => {
      if (!!res.error) {
        setState((state) => ({ ...state, error: res.error }));
      } else {
        setState((state) => ({
          ...state,
          error: "",
          pin: "",
          phoneNumber: "",
        }));
        await store(KEYS.TOKEN_KEY, res.jwt!).then(() => {
          navigation.replace("Landing");
        });
      }
    });
  };
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
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
              Hey user welcome back to {APP_NAME}.
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
              Pin Code
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
                  marginTop: 5,
                },
              ]}
            >
              {state.error}
            </Text>
            {!!state.pin ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={login}
                disabled={isLoading}
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
            <Divider color={COLORS.black} title="New to thoughts?" />
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isLoading}
              onPress={() => {
                navigation.navigate("SetPhoneNumber");
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
              <Text style={[styles.button__text]}>REGISTER</Text>
            </TouchableOpacity>
          </View>
        </LinearGradientProvider>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PinCode;
