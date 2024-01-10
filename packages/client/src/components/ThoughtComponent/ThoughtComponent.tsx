import { TouchableOpacity, View, Text } from "react-native";
import { COLORS } from "../../constants";
import { styles } from "../../styles";
import { trpc } from "../../utils/trpc";
import React from "react";
import { useSubscriptionsStore } from "../../store";
import Modal from "../Modal/Modal";
import CommentThought from "../Form/CommentThought";

const ThoughtComponent = ({ userId }: { userId: number }) => {
  const { setThought, thought: thoughtPayload } = useSubscriptionsStore();
  const { data: thought, refetch: refetchUserThought } =
    trpc.thought.getUserThought.useQuery({ userId });
  const [openCommentThought, setOpenCommentThought] = React.useState(false);
  const toggleCommentThought = () => setOpenCommentThought((state) => !state);

  React.useEffect(() => {
    if (!!thoughtPayload) {
      if (thoughtPayload.userId === userId) {
        refetchUserThought().then(({ data }) => {
          if (data?.text) {
            setThought(null);
          }
        });
      }
    }
  }, [thoughtPayload, setThought, userId]);

  if (!!!thought) return null;

  return (
    <>
      <Modal open={openCommentThought} toggle={toggleCommentThought}>
        <CommentThought thought={thought} toggle={toggleCommentThought} />
      </Modal>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleCommentThought}
        style={{
          height: 50,
          zIndex: 5,
          width: "100%",
          position: "absolute",
          top: 5,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            minHeight: 35,
            maxHeight: 35,
            borderColor: COLORS.tertiary,
            borderWidth: 0.5,
            zIndex: 3,
          }}
        >
          <Text style={[styles.p]} numberOfLines={2}>
            {thought.text}
          </Text>
        </View>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            backgroundColor: COLORS.white,
            position: "absolute",
            bottom: 2,
            zIndex: 2,
            left: 3,
            borderColor: COLORS.tertiary,
            borderWidth: 0.5,
          }}
        />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 7,
            backgroundColor: COLORS.white,
            position: "absolute",
            bottom: 0,
            zIndex: 2,
            left: 18,
            borderColor: COLORS.tertiary,
            borderWidth: 0.5,
          }}
        />
      </TouchableOpacity>
    </>
  );
};

export default ThoughtComponent;
