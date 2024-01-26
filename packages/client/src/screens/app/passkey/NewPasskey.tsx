import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { COLORS, FONTS, passkeyQuestions } from "../../../constants";
import { usePlatform } from "../../../hooks";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../../styles";
import Ripple from "../../../components/Ripple/Ripple";
import { CheckBox } from "react-native-btr";
import { useMeStore } from "../../../store";
import { trpc } from "../../../utils/trpc";
import { reloadApp } from "../../../utils";

const NewPasskey: React.FunctionComponent<AppNavProps<"NewPasskey">> = ({
  navigation,
}) => {
  const { me } = useMeStore();
  const [state, setState] = React.useState({
    error: "",
    passkey: "",
    passkeyQuestion: "",
    question: {
      title: "",
      id: "",
    },
  });
  const { os } = usePlatform();
  const { mutateAsync, isLoading: verifying } =
    trpc.user.changePasskey.useMutation();
  const next = () => {
    if (!!!state.passkeyQuestion.length) return;
    mutateAsync({
      passkey: state.passkey,
      passkeyQuestion: state.passkeyQuestion,
    }).then((res) => {
      if (res.error) {
        setState((state) => ({ ...state, error: res.error, passkey: "" }));
      } else {
        setState((state) => ({ ...state, error: "", passkey: "" }));
        reloadApp();
      }
    });
  };

  React.useEffect(() => {
    if (!!me) {
      const question = passkeyQuestions.find(
        (q) => q.title === me.passkeyQuestion
      );
      setState((state) => ({
        ...state,
        passkeyQuestion: me.passkeyQuestion,
        question: question || state.question,
      }));
    }
  }, [me]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "New Passkey",
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
                  passkeyQuestion: item.title,
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
                    passkeyQuestion: item.title,
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
            disabled={state.passkey.trim().length < 3 || verifying}
            activeOpacity={0.7}
            onPress={next}
            style={[
              styles.button,
              {
                backgroundColor:
                  state.passkey.trim().length >= 3 ? COLORS.red : COLORS.gray,
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
                  color: COLORS.white,
                  marginRight: verifying ? 10 : 0,
                },
              ]}
            >
              NEXT
            </Text>
            {verifying ? <Ripple size={5} color={COLORS.white} /> : null}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default NewPasskey;
