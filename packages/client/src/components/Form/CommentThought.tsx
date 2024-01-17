import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { APP_NAME, COLORS, FONTS, relativeTimeObject } from "../../constants";
import { styles } from "../../styles";
import { ThoughtType } from "@thoughts/api/src/types";
import { trpc } from "../../utils/trpc";
import Ripple from "../Ripple/Ripple";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface Props {
  thought: ThoughtType;
  toggle: () => void;
}
const CommentThought: React.FunctionComponent<Props> = ({
  thought,
  toggle,
}) => {
  const [state, setState] = React.useState({
    text: "",
    error: "",
  });

  const { mutateAsync: mutateCommentThought, isLoading: commenting } =
    trpc.comment.create.useMutation();
  const comment = () => {
    mutateCommentThought({ text: state.text, thoughtId: thought.id! }).then(
      (res) => {
        if (res.success) {
          toggle();
        } else {
          Alert.alert(
            APP_NAME,
            res?.error || "There was an error commenting on this thought."
          );
        }
      }
    );
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
            paddingVertical: 5,
            borderRadius: 999,
            maxHeight: 30,
          }}
        >
          <Text style={[styles.h1]}>{thought.user?.name} is thinking...</Text>
        </View>

        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 5,
            backgroundColor: COLORS.white,
            padding: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -5,
              backgroundColor: COLORS.white,
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 999,
              maxHeight: 30,
              right: 0,
            }}
          >
            <Text style={[styles.p, { color: COLORS.tertiary, fontSize: 14 }]}>
              {dayjs(thought.createdAt).fromNow()} ago
            </Text>
          </View>

          <Text style={[styles.p, {}]}>{thought.text}</Text>
        </View>
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
            fontSize: 18,
          }}
          selectionColor={COLORS.black}
          value={state.text}
          onChangeText={(text) => setState((state) => ({ ...state, text }))}
          placeholder={`Comment on ${thought.user?.name}'s thought...`}
          onSubmitEditing={comment}
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
          onPress={comment}
          disabled={commenting}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.tertiary,
              borderRadius: 5,
              paddingVertical: 10,
              maxWidth: 130,
            },
          ]}
        >
          <Text
            style={[
              styles.button__text,
              { color: COLORS.white, marginRight: commenting ? 10 : 0 },
            ]}
          >
            comment
          </Text>
          {commenting ? <Ripple color={COLORS.white} size={5} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentThought;
