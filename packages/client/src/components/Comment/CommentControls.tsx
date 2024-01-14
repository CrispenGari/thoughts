import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import { styles } from "../../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { CommentType } from "@thoughts/api/src/types";
import EditComment from "../Form/EditComment";
import Modal from "../Modal/Modal";
import { trpc } from "../../utils/trpc";
import { useMeStore } from "../../store";

interface Props {
  toggle: () => void;
  comment: CommentType;
}
const CommentControls: React.FunctionComponent<Props> = ({
  comment,
  toggle,
}) => {
  const { me } = useMeStore();
  const [editComment, setEditComment] = React.useState(false);
  const toggleEditComment = () => setEditComment((state) => !state);

  const { mutateAsync: mutateDeleteComment, isLoading: deleting } =
    trpc.comment.del.useMutation();

  const blockUser = () => {};
  const deleteComment = () => {
    if (!!!comment.id) return;
    mutateDeleteComment({ commentId: comment.id }).then((res) => {
      if (res.success) {
        toggle();
      }
    });
  };
  return (
    <>
      <Modal toggle={toggleEditComment} open={editComment}>
        <EditComment
          toggleParentModal={toggle}
          toggle={toggleEditComment}
          comment={comment}
        />
      </Modal>

      <View
        style={{
          maxWidth: 500,
          backgroundColor: COLORS.white,
          borderRadius: 5,
          padding: 10,
          width: "100%",
          alignItems: "center",
          marginBottom: 90,
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
          }}
        >
          <Text style={[styles.h1]}>COMMENT ACTIONS</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleEditComment}
          disabled={comment.userId !== me?.id}
          style={[
            styles.button,
            {
              borderRadius: 5,
              paddingVertical: 10,
              width: "100%",
              marginTop: 10,
              maxWidth: "100%",
              borderBlockColor: COLORS.black,
              borderBottomWidth: 0.5,
              justifyContent: "space-between",
            },
          ]}
        >
          <Text
            style={[
              styles.p,
              {
                color:
                  comment.userId !== me?.id ? COLORS.gray : COLORS.tertiary,
              },
            ]}
          >
            EDIT COMMENT
          </Text>
          <MaterialIcons
            name="edit"
            size={24}
            color={comment.userId !== me?.id ? COLORS.gray : COLORS.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={deleteComment}
          disabled={comment.userId !== me?.id}
          style={[
            styles.button,
            {
              borderRadius: 5,
              paddingVertical: 5,
              width: "100%",
              marginTop: 10,
              maxWidth: "100%",
              borderBlockColor: COLORS.black,
              borderBottomWidth: 0.5,
              justifyContent: "space-between",
            },
          ]}
        >
          <Text
            style={[
              styles.p,
              {
                color:
                  comment.userId !== me?.id ? COLORS.gray : COLORS.tertiary,
              },
            ]}
          >
            DELETE COMMENT
          </Text>
          <MaterialIcons
            name="delete"
            size={24}
            color={comment.userId !== me?.id ? COLORS.gray : COLORS.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {}}
          disabled={comment.userId === me?.id}
          style={[
            styles.button,
            {
              borderRadius: 5,
              paddingVertical: 5,
              width: "100%",
              marginTop: 10,
              maxWidth: "100%",
              borderBlockColor: COLORS.black,
              justifyContent: "space-between",
            },
          ]}
        >
          <Text
            style={[
              styles.p,
              { color: comment.userId === me?.id ? COLORS.gray : COLORS.red },
            ]}
          >
            BLOCK COMMENTER
          </Text>
          <MaterialIcons
            name="block"
            size={24}
            color={comment.userId === me?.id ? COLORS.gray : COLORS.red}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CommentControls;
