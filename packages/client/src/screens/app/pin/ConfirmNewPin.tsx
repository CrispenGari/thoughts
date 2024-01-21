import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { FONTS, COLORS, APP_NAME, KEYS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import PinInput from "../../../components/PinInput/PinInput";
import { trpc } from "../../../utils/trpc";
import Ripple from "../../../components/Ripple/Ripple";
import { del, reloadApp } from "../../../utils";

const ConfirmNewPin: React.FunctionComponent<AppNavProps<"ConfirmNewPin">> = ({
  navigation,
  route,
}) => {
  const { os } = usePlatform();
  const [state, setState] = React.useState({ error: "", pin: "" });
  const [pin, setPin] = React.useState<string>("");
  const { mutateAsync: mutateChangePin, isLoading: changing } =
    trpc.user.changePin.useMutation();

  const changePin = () => {
    mutateChangePin({
      pin1: route.params.pin1,
      pin2: state.pin,
    }).then(async (res) => {
      if (res.error) {
        setState((state) => ({ ...state, error: res.error, pin: "" }));
        setPin("");
      }
      if (res.retry && res.error) {
        Alert.alert(APP_NAME, res.error, [
          {
            text: "OK",
            onPress: () => {
              navigation.replace("NewPin");
            },
          },
        ]);
      }

      if (res.success && !!res.jwt && !!!res.error) {
        await del(KEYS.TOKEN_KEY);
        reloadApp();
      }
    });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Confirm Pin",
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
          label={os === "ios" ? "New Pin" : ""}
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
              Current New Pin
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
              disabled={!!!state.pin || changing}
              style={{
                backgroundColor: !!state.pin ? COLORS.red : COLORS.gray,
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
                    marginRight: changing ? 10 : 0,
                  },
                ]}
              >
                Confirm
              </Text>
              {changing ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default ConfirmNewPin;
