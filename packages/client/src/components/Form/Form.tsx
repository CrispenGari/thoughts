import { View, Text, Alert, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { APP_NAME, COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";

const Form = () => {
  const [state, setState] = React.useState({ thought: "", error: "" });
  const { mutateAsync, isLoading } = trpc.thought.create.useMutation();

  const save = () => {
    if (isLoading) return;
    mutateAsync({ thought: state.thought }).then((res) => {
      if (res.error) {
        return Alert.alert(APP_NAME, res.error);
      }
      console.log({ res });
    });
  };
  return (
    <View
      style={{
        margin: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: -10,
          backgroundColor: COLORS.white,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 999,
        }}
      >
        <Text style={[styles.h1]}>What are you thinking?</Text>
      </View>
      <Text
        style={[
          styles.p,
          { marginTop: 20, alignSelf: "flex-end", fontSize: 14 },
        ]}
      >
        {state.thought.trim().length}/200
      </Text>
      <TextInput
        maxLength={200}
        multiline={true}
        style={{
          padding: 10,
          backgroundColor: COLORS.white,
          width: "100%",

          marginBottom: 10,
          borderRadius: 5,
          fontFamily: FONTS.regular,
        }}
        selectionColor={COLORS.black}
        value={state.thought}
        onChangeText={(text) =>
          setState((state) => ({ ...state, thought: text }))
        }
        placeholder="Say your thought out..."
        onSubmitEditing={save}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={save}
        disabled={isLoading}
        style={[
          styles.button,
          {
            backgroundColor: COLORS.tertiary,
            borderRadius: 5,
            paddingVertical: 10,
            maxWidth: 100,
            alignSelf: "flex-start",
          },
        ]}
      >
        <Text style={[styles.button__text, { color: COLORS.white }]}>add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
