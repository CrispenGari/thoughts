import { View, Text } from "react-native";
import React from "react";
import { trpc } from "../../utils/trpc";
import { styles } from "../../styles";
import Comment from "../Comment/Comment";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../constants";
import Ripple from "../Ripple/Ripple";
import { useMeStore } from "../../store";
import ContentLoader from "../ContentLoader/ContentLoader";

interface Props {
  thoughtId: number;
  navigation: StackNavigationProp<AppParamList, "Thought">;
}
const Comments: React.FunctionComponent<Props> = ({
  thoughtId,
  navigation,
}) => {
  const { me } = useMeStore();
  const [comments, setComments] = React.useState<
    {
      id: number;
    }[]
  >([]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch: refetchNewComments,
    isFetchingNextPage,
  } = trpc.comment.getComments.useInfiniteQuery(
    {
      limit: 2,
      thoughtId,
    },
    {
      keepPreviousData: true,
      getNextPageParam: ({ nextCursor }) => nextCursor,
    }
  );

  trpc.comment.onCreate.useSubscription(
    { thoughtId, userId: me?.id || 0 },
    {
      onData: async () => {
        await refetchNewComments();
      },
    }
  );

  React.useEffect(() => {
    if (!!data?.pages) {
      setComments(data.pages.flatMap((page) => page.comments));
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <View key={i} style={{ width: "100%", marginVertical: 10 }}>
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
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      {comments.length === 0 ? (
        <Text style={[styles.h1, { marginVertical: 10 }]}>No comments.</Text>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} navigation={navigation} />
        ))
      )}
      {hasNextPage && !isFetchingNextPage ? (
        <TouchableOpacity
          onPress={async () => {
            await fetchNextPage();
          }}
          activeOpacity={0.7}
          style={{ alignSelf: "center", marginVertical: 10 }}
        >
          <Text style={[styles.h1, { fontSize: 16, color: COLORS.tertiary }]}>
            Read more comments.
          </Text>
        </TouchableOpacity>
      ) : null}
      {isFetchingNextPage ? (
        <View style={{ alignSelf: "center", marginVertical: 10 }}>
          <Ripple size={10} color={COLORS.tertiary} />
        </View>
      ) : null}
    </View>
  );
};

export default Comments;
