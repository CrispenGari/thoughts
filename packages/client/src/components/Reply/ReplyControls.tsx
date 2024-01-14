import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import { styles } from "../../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { ReplyType } from "@thoughts/api/src/types";
import EditReply from "../Form/EditReply";
import Modal from "../Modal/Modal";
import { trpc } from "../../utils/trpc";
import { useMeStore } from "../../store";

interface Props {
  toggle: () => void;
  reply: ReplyType;
}
const ReplyControls: React.FunctionComponent<Props> = ({ reply, toggle }) => {
  const { me } = useMeStore();
  const [editComment, setEditComment] = React.useState(false);
  const toggleEditComment = () => setEditComment((state) => !state);

  const { mutateAsync: mutateDeleteComment, isLoading: deleting } =
    trpc.reply.del.useMutation();

  const blockUser = () => {};
  const deleteComment = () => {
    if (!!!reply.id) return;
    mutateDeleteComment({ replyId: reply.id }).then((res) => {
      if (res.success) {
        toggle();
      }
    });
  };
  return (
    <>
      <Modal toggle={toggleEditComment} open={editComment}>
        <EditReply
          toggleParentModal={toggle}
          toggle={toggleEditComment}
          reply={reply}
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
          <Text style={[styles.h1]}>REPLY ACTIONS</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleEditComment}
          disabled={reply.userId !== me?.id}
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
                color: reply.userId !== me?.id ? COLORS.gray : COLORS.tertiary,
              },
            ]}
          >
            EDIT COMMENT
          </Text>
          <MaterialIcons
            name="edit"
            size={24}
            color={reply.userId !== me?.id ? COLORS.gray : COLORS.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={deleteComment}
          disabled={reply.userId !== me?.id}
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
                color: reply.userId !== me?.id ? COLORS.gray : COLORS.tertiary,
              },
            ]}
          >
            DELETE COMMENT
          </Text>
          <MaterialIcons
            name="delete"
            size={24}
            color={reply.userId !== me?.id ? COLORS.gray : COLORS.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {}}
          disabled={reply.userId === me?.id}
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
              { color: reply.userId === me?.id ? COLORS.gray : COLORS.red },
            ]}
          >
            BLOCK COMMENTER
          </Text>
          <MaterialIcons
            name="block"
            size={24}
            color={reply.userId === me?.id ? COLORS.gray : COLORS.red}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ReplyControls;
