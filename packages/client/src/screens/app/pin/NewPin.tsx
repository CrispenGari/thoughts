import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { FONTS, COLORS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import PinInput from "../../../components/PinInput/PinInput";

const NewPin: React.FunctionComponent<AppNavProps<"NewPin">> = ({
  navigation,
}) => {
  const { os } = usePlatform();
  const [state, setState] = React.useState({ error: "", pin: "" });
  const [pin, setPin] = React.useState<string>("");

  const changePin = () => {
    navigation.navigate("ConfirmNewPin", { pin1: state.pin });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "New Pin",
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
          label={os === "ios" ? "Current Pin" : ""}
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
              Enter New Pin
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
              onPress={changePin}
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
                  },
                ]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default NewPin;
