import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Divider from "../../../components/Divider/Divider";
import { logo, APP_NAME, COLORS } from "../../../constants";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import { AuthNavProps } from "../../../params";
import PinInput from "../../../components/PinInput/PinInput";

const SetPin: React.FunctionComponent<AuthNavProps<"SetPin">> = ({
  navigation,
  route,
}) => {
  const [pin, setPin] = React.useState<string>("");
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
              Set Pin Code
            </Text>
            <PinInput
              pin={pin}
              setPin={setPin}
              onComplete={(pin) => {
                navigation.replace("ConfirmPin", {
                  phoneNumber: route.params.phoneNumber,
                  pin1: pin,
                });
              }}
              length={5}
              placeholder="0"
            />
            <Divider color={COLORS.black} title="Already registered?" />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate("PhoneNumber");
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

export default SetPin;
