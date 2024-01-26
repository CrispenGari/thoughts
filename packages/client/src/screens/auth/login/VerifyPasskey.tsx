import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { AuthNavProps } from "../../../params";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { APP_NAME, COLORS, FONTS, logo } from "../../../constants";
import { styles } from "../../../styles";
import Ripple from "../../../components/Ripple/Ripple";
import Divider from "../../../components/Divider/Divider";
import { trpc } from "../../../utils/trpc";

const VerifyPasskey: React.FunctionComponent<AuthNavProps<"VerifyPasskey">> = ({
  navigation,
  route,
}) => {
  const [state, setState] = React.useState({
    error: "",
    passkey: "",
  });
  const { data: passkeyQuestion, isLoading: loading } =
    trpc.login.getPassKeyQuestion.useQuery({
      user: route.params.user,
      country: route.params.country,
    });
  const { mutateAsync, isLoading: verifying } =
    trpc.login.verifyPasskey.useMutation();

  const validateOldPasskey = () => {
    mutateAsync({
      user: {
        ...route.params.user,
        passkey: state.passkey,
      },
      country: route.params.country,
    }).then((res) => {
      if (res.error) {
        setState((state) => ({ ...state, error: res.error, passkey: "" }));
      } else {
        setState((state) => ({ ...state, error: "", passkey: "" }));
        navigation.navigate("SetNewLoginPin", {
          user: route.params.user,
          country: route.params.country,
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
                },
              ]}
            >
              Hey user welcome back to {APP_NAME} , it seems like you don't
              remember your pin.
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
                  marginBottom: 0,
                  fontSize: 18,
                  textAlign: "left",
                  width: "100%",
                },
              ]}
            >
              {loading || !!!passkeyQuestion
                ? "Loading your passkey question..."
                : passkeyQuestion.passkeyQuestion}
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
            <Divider color={COLORS.black} title="New to thoughts?" />
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={verifying}
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

export default VerifyPasskey;
