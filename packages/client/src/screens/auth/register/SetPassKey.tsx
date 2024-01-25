import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { AuthNavProps } from "../../../params";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import {
  APP_NAME,
  COLORS,
  FONTS,
  logo,
  passkeyQuestions,
} from "../../../constants";
import { styles } from "../../../styles";
import Divider from "../../../components/Divider/Divider";
import { CheckBox } from "react-native-btr";

const SetPassKey: React.FunctionComponent<AuthNavProps<"SetPassKey">> = ({
  navigation,
  route,
}) => {
  const [state, setState] = React.useState({
    error: "",
    passkey: "",
    passkeyQuestion: "",
    question: {
      title: "",
      id: "",
    },
  });

  const next = () => {
    navigation.replace("SetProfile", {
      user: {
        phoneNumber: route.params.user.phoneNumber,
        pin: route.params.user.pin,
        passkeyQuestion: state.passkeyQuestion,
        passkey: state.passkey,
      },
      country: route.params.country,
    });
  };
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
              flex: 0.3,
              justifyContent: "center",
              alignItems: "center",
              maxWidth: 500,
              alignSelf: "center",
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
                  marginBottom: 20,
                },
              ]}
            >
              Welcome to {APP_NAME}.
            </Text>

            <Text
              style={[
                styles.p,
                {
                  textAlign: "center",
                  color: COLORS.red,
                  paddingHorizontal: 10,
                },
              ]}
            >
              We use your passkey for security purposes incase you forgot your
              pin, or your pin has been blocked you can use this pin to recover
              your {APP_NAME} account.
            </Text>
          </View>
          <View
            style={{
              flex: 0.7,
              width: "100%",
              maxWidth: 500,
              padding: 10,
              alignSelf: "center",
            }}
          >
            <Text
              style={[
                styles.p,
                {
                  fontSize: 16,
                  marginBottom: 5,
                },
              ]}
            >
              Select a Passkey Question
            </Text>
            {passkeyQuestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  padding: 10,
                  marginBottom: 1,
                  backgroundColor: COLORS.white,
                  alignItems: "center",
                }}
                activeOpacity={0.7}
                onPress={() => {
                  setState((state) => ({
                    ...state,
                    question: item,
                    passkeyQuestion:
                      item.id === (passkeyQuestions.length - 1).toString()
                        ? ""
                        : item.title,
                  }));
                }}
              >
                <CheckBox
                  checked={item.id == state.question.id}
                  color={COLORS.tertiary}
                  borderRadius={10}
                  onPress={() => {
                    setState((state) => ({
                      ...state,
                      question: item,
                      passkeyQuestion:
                        item.id === (passkeyQuestions.length - 1).toString()
                          ? ""
                          : item.title,
                    }));
                  }}
                />
                <Text
                  style={[
                    styles.h1,
                    { flex: 1, marginLeft: 10, color: COLORS.tertiary },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}

            {!!state.question.id.length ? (
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
                onSubmitEditing={next}
                placeholder={`Type your passkey answer...`}
              />
            ) : null}
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
              disabled={state.passkey.trim().length < 3}
              activeOpacity={0.7}
              onPress={next}
              style={[
                styles.button,
                {
                  backgroundColor:
                    state.passkey.trim().length >= 3
                      ? COLORS.primary
                      : COLORS.gray,
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
                    color:
                      state.passkey.length < 3 ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                NEXT
              </Text>
            </TouchableOpacity>

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
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default SetPassKey;
