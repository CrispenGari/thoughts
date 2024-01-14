import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { APP_NAME, COLORS, FONTS, relativeTimeObject } from "../../constants";
import { styles } from "../../styles";
import { CommentType, ThoughtType } from "@thoughts/api/src/types";
import { trpc } from "../../utils/trpc";
import Ripple from "../Ripple/Ripple";
import { useMeStore } from "../../store";

interface Props {
  comment: CommentType;
  toggle: () => void;
  toggleParentModal: () => void;
}
const EditComment: React.FunctionComponent<Props> = ({
  toggleParentModal,
  comment,
  toggle,
}) => {
  const [state, setState] = React.useState({
    text: comment.text || "",
    error: "",
  });

  const { isLoading: editing, mutateAsync } = trpc.comment.edit.useMutation();
  const save = () => {
    if (!!!comment.id) return;
    mutateAsync({ commentId: comment.id, text: state.text }).then((res) => {
      if (res.success) {
        toggle();
        toggleParentModal();
        setState((state) => ({ ...state, error: "" }));
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
            paddingVertical: 5,
            borderRadius: 999,
            maxHeight: 30,
          }}
        >
          <Text style={[styles.h1]}>UPDATE YOUR COMMENT</Text>
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
            marginTop: 20,
          }}
          selectionColor={COLORS.black}
          value={state.text}
          onChangeText={(text) => setState((state) => ({ ...state, text }))}
          placeholder={`Edit your comment...`}
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
          disabled={editing}
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
              { color: COLORS.white, marginRight: editing ? 10 : 0 },
            ]}
          >
            save
          </Text>
          {editing ? <Ripple color={COLORS.white} size={5} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditComment;
