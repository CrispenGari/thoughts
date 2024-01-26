import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { AuthNavProps } from "../../../params";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { APP_NAME, COLORS, logo } from "../../../constants";
import { styles } from "../../../styles";
import PinInput from "../../../components/PinInput/PinInput";
import Divider from "../../../components/Divider/Divider";

const SetNewLoginPin: React.FunctionComponent<
  AuthNavProps<"SetNewLoginPin">
> = ({ navigation, route }) => {
  const [pin, setPin] = React.useState<string>("");
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
              flex: 0.4,
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
                },
              ]}
            >
              Hey user welcome back to {APP_NAME}, it seems like you are trying
              to set a new pin on your account.
            </Text>
          </View>
          <View
            style={{
              flex: 0.6,
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
              Set New Pin Code
            </Text>
            <PinInput
              pin={pin}
              setPin={setPin}
              onComplete={(pin) => {
                navigation.replace("ConfirmPinAndLogin", {
                  country: route.params.country,
                  user: { ...route.params.user, pin1: pin },
                });
              }}
              length={5}
              placeholder="0"
            />
            <Divider color={COLORS.black} title="New to thoughts?" />
            <TouchableOpacity
              activeOpacity={0.7}
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

export default SetNewLoginPin;
