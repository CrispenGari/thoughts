import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { UserType } from "@thoughts/api/src/types";
import { COLORS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";
import { useSubscriptionsStore } from "../../store";
import ContentLoader from "../ContentLoader/ContentLoader";
import EditThought from "../Form/EditThought";
import Form from "../Form/Form";
import CommentThought from "../Form/CommentThought";
import Modal from "../Modal/Modal";

interface Props {
  gettingUser: boolean;
  user: UserType | null | undefined;
  isMe: boolean;
  isBlocked: boolean;
}
const UserCurrentThought: React.FunctionComponent<Props> = ({
  user,
  isMe,
  isBlocked,
}) => {
  const { setThought, thought: thoughtPayload } = useSubscriptionsStore();
  const {
    data: thought,
    refetch: refetchUserThought,
    isLoading,
  } = trpc.thought.getUserThought.useQuery({ userId: user?.id! });
  const [openCommentThought, setOpenCommentThought] = React.useState(false);
  const toggleCommentThought = () => setOpenCommentThought((state) => !state);

  const [openCreateForm, setOpenCreateForm] = React.useState(false);
  const toggleCreateForm = () => setOpenCreateForm((state) => !state);
  const [openEditThought, setOpenEditThought] = React.useState(false);
  const toggleEditThought = () => setOpenEditThought((state) => !state);

  React.useEffect(() => {
    if (!!thoughtPayload) {
      if (thoughtPayload.userId === user?.id) {
        refetchUserThought().then(({ data }) => {
          if (data?.text) {
            setThought(null);
          }
        });
      }
    }
  }, [thoughtPayload, setThought, user]);

  if (!!!thought)
    return (
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.white,
          padding: 10,
          marginBottom: 5,
          borderRadius: 5,
          minHeight: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={0.7}
        onPress={() => {
          if (isMe) {
            toggleCreateForm();
          }
        }}
      >
        <Text
          style={[
            styles.h1,
            {
              fontSize: 16,
              textAlign: "center",
              color: isBlocked ? COLORS.gray : COLORS.tertiary,
            },
          ]}
        >
          {isMe
            ? "Create a new thought..."
            : "This user is not thinking anything."}
        </Text>
      </TouchableOpacity>
    );

  if (isLoading)
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 10,
          marginBottom: 5,
          borderRadius: 5,
          minHeight: 80,
        }}
      >
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <ContentLoader
              style={{
                width: "100%",
                padding: 5,
                borderRadius: 2,
                backgroundColor: COLORS.gray,
                marginBottom: 2,
              }}
              key={i}
            />
          ))}
        <ContentLoader
          style={{
            width: "80%",
            padding: 5,
            borderRadius: 2,
            backgroundColor: COLORS.gray,
            marginBottom: 3,
          }}
        />
      </View>
    );

  return (
    <>
      <Modal open={openCommentThought} toggle={toggleCommentThought}>
        <CommentThought thought={thought} toggle={toggleCommentThought} />
      </Modal>
      <Modal open={openEditThought} toggle={toggleEditThought}>
        <EditThought thought={thought} toggle={toggleEditThought} />
      </Modal>
      <Modal open={openCreateForm} toggle={toggleCreateForm}>
        <Form toggle={toggleCreateForm} />
      </Modal>

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (isMe) {
            toggleEditThought();
          } else {
            toggleCommentThought();
          }
        }}
        style={{
          backgroundColor: COLORS.white,
          padding: 10,
          marginBottom: 5,
          borderRadius: 5,
          minHeight: 80,
        }}
      >
        <Text style={[styles.h1, { fontSize: 16 }]}>{thought.text}</Text>
      </TouchableOpacity>
    </>
  );
};

export default UserCurrentThought;
