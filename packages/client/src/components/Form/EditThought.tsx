import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { APP_NAME, COLORS, FONTS } from "../../constants";
import { styles } from "../../styles";
import { ThoughtType } from "@thoughts/api/src/types";
import { trpc } from "../../utils/trpc";
import Ripple from "../Ripple/Ripple";

interface Props {
  thought: ThoughtType;
  toggle: () => void;
}
const EditThought: React.FunctionComponent<Props> = ({ thought, toggle }) => {
  const [state, setState] = React.useState({
    thought: thought.text,
    error: "",
  });
  const { mutateAsync: mutateDeleteThought, isLoading: deleting } =
    trpc.thought.del.useMutation();
  const { mutateAsync: mutateUpdateThought, isLoading: updating } =
    trpc.thought.update.useMutation();
  const save = () => {
    mutateUpdateThought({ thought: state.thought }).then((res) => {
      if (!!res.error) {
        Alert.alert(APP_NAME, res.error);
      } else {
        toggle();
      }
    });
  };
  const del = () => {
    mutateDeleteThought().then((res) => {
      if (res) {
        setState({ error: "", thought: thought.text });
        toggle();
      }
    });
  };

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 400,
        marginBottom: 100,
        margin: 20,
        padding: 10,
      }}
    >
      <View
        style={{
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
            marginBottom: 5,
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
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={save}
          disabled={deleting || updating}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.tertiary,
              borderRadius: 5,
              paddingVertical: 10,
              maxWidth: 100,
            },
          ]}
        >
          <Text
            style={[
              styles.button__text,
              { color: COLORS.white, marginRight: updating ? 10 : 0 },
            ]}
          >
            update
          </Text>
          {updating ? <Ripple color={COLORS.white} size={5} /> : null}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={del}
          disabled={deleting || updating}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.red,
              borderRadius: 5,
              paddingVertical: 10,
              maxWidth: 100,
              marginLeft: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.button__text,
              { color: COLORS.white, marginRight: deleting ? 10 : 0 },
            ]}
          >
            delete
          </Text>
          {deleting ? <Ripple color={COLORS.white} size={5} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditThought;
