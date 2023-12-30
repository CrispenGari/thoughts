import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Divider from "../../../components/Divider/Divider";
import Ripple from "../../../components/Ripple/Ripple";
import { logo, APP_NAME, COLORS, profile, KEYS } from "../../../constants";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import { AuthNavProps } from "../../../params";
import CustomTextInput from "../../../components/CustomTextInput/CustomTextInput";
import { trpc } from "../../../utils/trpc";
import { store } from "../../../utils";

const SetProfile: React.FunctionComponent<AuthNavProps<"SetProfile">> = ({
  navigation,
  route,
}) => {
  const [state, setState] = React.useState({
    error: "",
    pin: route.params.pin,
    phoneNumber: route.params.phoneNumber,
    name: "",
  });
  const { mutateAsync, isLoading } =
    trpc.register.createUserOrFail.useMutation();
  const saveProfile = () => {
    mutateAsync({
      name: state.name,
      phoneNumber: state.phoneNumber,
      pin: state.pin,
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
              flex: 0.6,
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
                  fontSize: 20,
                },
              ]}
            >
              Your Profile
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <Image
                source={{
                  uri: Image.resolveAssetSource(profile).uri,
                }}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  resizeMode: "contain",
                  borderRadius: 100,
                }}
              />
              <View
                style={{
                  paddingLeft: 5,
                  flex: 1,
                  justifyContent: "flex-start",
                }}
              >
                <CustomTextInput
                  text={state.name}
                  onChangeText={(text) =>
                    setState((state) => ({ ...state, name: text }))
                  }
                  placeholder="Name"
                />
                <Text style={[styles.p]}>
                  Note that this profile will be public to your contacts.
                </Text>
              </View>
            </View>

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
              onPress={saveProfile}
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
                SAVE
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

export default SetProfile;
