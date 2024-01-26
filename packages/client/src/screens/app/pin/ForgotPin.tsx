import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { COLORS, FONTS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../../styles";
import Ripple from "../../../components/Ripple/Ripple";
import { useMeStore } from "../../../store";
import { trpc } from "../../../utils/trpc";

const ForgotPin: React.FunctionComponent<AppNavProps<"ForgotPin">> = ({
  navigation,
}) => {
  const [state, setState] = React.useState({ error: "", passkey: "" });
  const { os } = usePlatform();
  const { me } = useMeStore();
  const { mutateAsync, isLoading: verifying } =
    trpc.user.verifyPasskey.useMutation();

  const validateOldPasskey = () => {
    mutateAsync({ passkey: state.passkey }).then((res) => {
      if (res.error) {
        setState((state) => ({ ...state, error: res.error, passkey: "" }));
      } else {
        setState((state) => ({ ...state, error: "", passkey: "" }));
        navigation.navigate("NewPin");
      }
    });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Forgot Pin",
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
              {me?.passkeyQuestion}
            </Text>
            <TextInput
              style={{
                padding: 10,
                backgroundColor: COLORS.white,
                width: "100%",
                marginBottom: 5,
                borderRadius: 5,
                fontFamily: FONTS.regular,
                fontSize: 16,
                paddingTop: 10,
                marginTop: 10,
              }}
              selectionColor={COLORS.black}
              value={state.passkey}
              onChangeText={(text) =>
                setState((state) => ({ ...state, passkey: text }))
              }
              onSubmitEditing={validateOldPasskey}
              placeholder={`Type your passkey answer...`}
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
              onPress={validateOldPasskey}
              disabled={!!!state.passkey}
              style={{
                backgroundColor: !!state.passkey
                  ? COLORS.tertiary
                  : COLORS.gray,
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

export default ForgotPin;
