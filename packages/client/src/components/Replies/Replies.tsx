import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { trpc } from "../../utils/trpc";
import { useMeStore } from "../../store";
import Reply from "../Reply/Reply";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserType } from "@thoughts/api/src/types";
import { AppParamList } from "../../params";
import { styles } from "../../styles";
import { COLORS } from "../../constants";
import Ripple from "../Ripple/Ripple";
import ContentLoader from "../ContentLoader/ContentLoader";

interface Props {
  commentId: number;
  navigation: StackNavigationProp<AppParamList, "Thought">;
  setReplyTo: React.Dispatch<React.SetStateAction<UserType | undefined>>;
  inputRef: React.RefObject<TextInput>;
}
const Replies: React.FunctionComponent<Props> = ({
  commentId,
  navigation,
  setReplyTo,
  inputRef,
}) => {
  const [replies, setReplies] = React.useState<{ id: number }[]>([]);
  const { me } = useMeStore();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch: refetchNewReplies,
    isFetchingNextPage,
  } = trpc.reply.getReplies.useInfiniteQuery(
    {
      limit: 2,
      commentId,
    },
    {
      keepPreviousData: true,
      getNextPageParam: ({ nextCursor }) => nextCursor,
    }
  );
  trpc.reply.onReply.useSubscription(
    { commentId },
    {
      onData: async () => {
        await refetchNewReplies();
      },
    }
  );
  trpc.reply.onDelete.useSubscription(
    { commentId },
    {
      onData: async () => {
        await refetchNewReplies();
      },
    }
  );

  React.useEffect(() => {
    if (!!data?.pages) {
      setReplies(data.pages.flatMap((page) => page.replies));
    }
  }, [data]);

  if (!isLoading) {
    <>
      {Array(2)
        .fill(null)
        .map((_, i) => (
          <View
            key={i}
            style={{ width: "90%", marginVertical: 10, alignSelf: "flex-end" }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                position: "relative",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <ContentLoader
                style={{
                  zIndex: 1,
                  position: "absolute",
                  top: -10,
                  right: 0,
                  width: 20,
                  height: 20,
                  borderRadius: 20,

                  backgroundColor: COLORS.gray,
                  overflow: "hidden",
                }}
              />

              <ContentLoader
                style={{
                  width: "100%",
                  padding: 5,
                  borderRadius: 2,
                  backgroundColor: COLORS.gray,
                  marginBottom: 2,
                }}
              />
              <ContentLoader
                style={{
                  width: "80%",
                  padding: 5,
                  borderRadius: 2,
                  backgroundColor: COLORS.gray,
                  marginBottom: 3,
                }}
              />

              <ContentLoader
                style={{
                  width: "40%",
                  padding: 5,
                  borderRadius: 2,
                  backgroundColor: COLORS.gray,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <ContentLoader
                    key={i}
                    style={{
                      width: 30,
                      height: 15,
                      borderRadius: 10,
                      backgroundColor: COLORS.gray,
                      marginRight: 10,
                    }}
                  />
                ))}
            </View>
          </View>
        ))}
    </>;
  }

  return (
    <>
      {replies?.map((reply) => (
        <Reply
          setReplyTo={setReplyTo}
          reply={reply}
          key={reply.id}
          navigation={navigation}
          inputRef={inputRef as any}
        />
      ))}

      {hasNextPage && !isFetchingNextPage ? (
        <TouchableOpacity
          onPress={async () => {
            await fetchNextPage();
          }}
          activeOpacity={0.7}
          style={{ alignSelf: "center", marginVertical: 10 }}
        >
          <Text style={[styles.h1, { fontSize: 16, color: COLORS.tertiary }]}>
            Read more replies.
          </Text>
        </TouchableOpacity>
      ) : null}
      {isFetchingNextPage ? (
        <View style={{ alignSelf: "center", marginVertical: 10 }}>
          <Ripple size={10} color={COLORS.tertiary} />
        </View>
      ) : null}
    </>
  );
};

export default Replies;
