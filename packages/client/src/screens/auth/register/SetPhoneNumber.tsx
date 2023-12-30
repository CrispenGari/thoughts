import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "../../../components/PhoneInput/PhoneInput";
import { logo, APP_NAME, COLORS } from "../../../constants";
import { AuthNavProps } from "../../../params";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import Divider from "../../../components/Divider/Divider";
import Ripple from "../../../components/Ripple/Ripple";
import { trpc } from "../../../utils/trpc";

const SetPhoneNumber: React.FunctionComponent<
  AuthNavProps<"SetPhoneNumber">
> = ({ navigation }) => {
  const [state, setState] = React.useState({
    error: "",
  });
  const { mutateAsync, isLoading } =
    trpc.register.validatePhoneNumber.useMutation();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const validateNumber = () => {
    mutateAsync({ phoneNumber })
      .then((res) => {
        if (!!res.error) {
          setState((state) => ({
            ...state,
            error: res.error,
          }));
        } else {
          setState((state) => ({
            ...state,
            error: "",
          }));
          setPhoneNumber("");
          navigation.navigate("SetPin", { phoneNumber: res.phoneNumber! });
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
              Phone Number
            </Text>
            <PhoneInput
              placeholder="123 456 789"
              setPhoneNumber={setPhoneNumber}
              containerStyle={{
                borderColor: state.error ? COLORS.red : "transparent",
              }}
              onSubmitEditing={validateNumber}
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={validateNumber}
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

export default SetPhoneNumber;
