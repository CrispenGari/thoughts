import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { FONTS, COLORS, reasons } from "../../../constants";
import { usePlatform } from "../../../hooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { CheckBox } from "react-native-btr";
import { styles } from "../../../styles";

const DeleteAccount: React.FunctionComponent<AppNavProps<"DeleteAccount">> = ({
  navigation,
}) => {
  const [state, setState] = React.useState({
    reason: {
      title: "",
      id: "",
    },
    text: "",
  });
  const { os } = usePlatform();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Delete Account",
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
        contentContainerStyle={{ flex: 1, paddingBottom: 50 }}
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
              styles.h1,
              {
                marginVertical: 20,
                fontSize: 20,
              },
            ]}
          >
            State the reason for deleting thoughts account.
          </Text>
          <View style={{ marginBottom: 10 }}>
            {reasons.map((item) => (
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
                    reason: item,
                    text:
                      item.id === (reasons.length - 1).toString()
                        ? ""
                        : item.title,
                  }));
                }}
              >
                <CheckBox
                  checked={item.id == state.reason.id}
                  color={COLORS.tertiary}
                  borderRadius={10}
                  onPress={() => {
                    setState((state) => ({
                      ...state,
                      reason: item,
                      text:
                        item.id === (reasons.length - 1).toString()
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
          </View>
          {state.reason.id === (reasons.length - 1).toString() ? (
            <TextInput
              maxLength={200}
              multiline={true}
              style={{
                padding: 10,
                backgroundColor: COLORS.white,
                width: "100%",
                marginBottom: 5,
                borderRadius: 5,
                fontFamily: FONTS.regular,
                fontSize: 16,
                height: 80,
                paddingTop: 10,
              }}
              selectionColor={COLORS.black}
              value={state.text}
              onChangeText={(text) => setState((state) => ({ ...state, text }))}
              placeholder={`Reply on this comment thread...`}
            />
          ) : null}
          {!!state.text ? (
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.red,
                padding: 10,
                width: 120,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                marginTop: 10,
                flexDirection: "row",
              }}
              activeOpacity={0.7}
              disabled={!!!state.text}
              onPress={() =>
                navigation.navigate("ConfirmDeleteAccount", {
                  reason: state.text,
                })
              }
            >
              <Text style={[styles.p, { color: COLORS.white }]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default DeleteAccount;
