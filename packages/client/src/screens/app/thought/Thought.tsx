import { View, Text, RefreshControl, ScrollView, Image } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import {
  COLORS,
  FONTS,
  profile,
  relativeTimeObject,
  serverBaseHttpURL,
} from "../../../constants";
import { usePlatform } from "../../../hooks";
import { trpc } from "../../../utils/trpc";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import Divider from "../../../components/Divider/Divider";
import { styles } from "../../../styles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import Comment from "../../../components/Comment/Comment";
import ContentLoader from "../../../components/ContentLoader/ContentLoader";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Thought: React.FunctionComponent<AppNavProps<"Thought">> = ({
  navigation,
  route: { params },
}) => {
  const [loaded, setLoaded] = React.useState(true);
  const { mutateAsync: read, isLoading } = trpc.notification.read.useMutation();
  const {
    data: thought,
    isFetching: fetching,
    refetch: refetchThought,
  } = trpc.thought.getById.useQuery({
    id: params.id,
  });
  const { os } = usePlatform();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Thought",
      headerShown: true,
      headerStyle: {
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 0.5,
        backgroundColor: COLORS.tertiary,
        height: 100,
      },
      headerTitleStyle: {
        fontFamily: FONTS.regularBold,
        color: COLORS.main,
      },
      headerLeft: () => (
        <AppStackBackButton
          label={os === "ios" ? "Notifications" : ""}
          onPress={() => {
            if (!isLoading) {
              navigation.goBack();
            }
          }}
        />
      ),
    });
  }, [navigation, isLoading]);

  React.useEffect(() => {
    if (params.notificationId && !params.read) {
      read();
    }
  }, [params]);

  if (!!!thought)
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            shouldRasterizeIOS={true}
            refreshing={fetching}
            onRefresh={async () => {
              await refetchThought();
            }}
          />
        }
      >
        <View style={{ flex: 1 }}>
          <LinearGradientProvider>
            <Text
              style={[styles.h1, { textAlign: "center", marginVertical: 50 }]}
            >
              No thought...
            </Text>
          </LinearGradientProvider>
        </View>
      </KeyboardAwareScrollView>
    );
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          shouldRasterizeIOS={true}
          refreshing={fetching}
          onRefresh={async () => {
            await refetchThought();
          }}
        />
      }
    >
      <View style={{ flex: 1 }}>
        <LinearGradientProvider>
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 500,
              padding: 10,
              alignSelf: "center",
              minHeight: 100,
            }}
          >
            <View
              style={{
                marginTop: 20,
                marginBottom: 10,
                borderRadius: 5,
                backgroundColor: COLORS.white,
                padding: 10,
                width: "100%",
                minHeight: 80,
              }}
            >
              {!loaded ? (
                <ContentLoader
                  style={{
                    bottom: -20,
                    right: 5,
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                    zIndex: 1,
                    backgroundColor: COLORS.gray,
                    overflow: "hidden",
                    position: "absolute",
                  }}
                />
              ) : null}
              <Image
                style={{
                  zIndex: 1,
                  position: "absolute",
                  bottom: -20,
                  right: 5,
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  display: loaded ? "flex" : "none",
                }}
                source={{
                  uri: !!thought.user.avatar
                    ? serverBaseHttpURL.concat(thought.user.avatar)
                    : Image.resolveAssetSource(profile).uri,
                }}
                onError={(error) => {
                  setLoaded(true);
                }}
                onLoadEnd={() => {
                  setLoaded(true);
                }}
                onLoadStart={() => {
                  setLoaded(false);
                }}
                onLoad={() => {
                  setLoaded(true);
                }}
              />
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
                <Text
                  style={[styles.p, { color: COLORS.tertiary, fontSize: 14 }]}
                >
                  {dayjs(thought.createdAt).fromNow()} ago
                </Text>
              </View>
              <Text style={[styles.h1, { fontSize: 18, marginBottom: 20 }]}>
                {thought.text}
              </Text>
            </View>
            <Divider color={COLORS.black} title="USER COMMENTS" />

            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              style={{ flex: 1 }}
            >
              {!!!thought?.comments || thought.comments.length === 0 ? (
                <Text style={[styles.h1, { marginVertical: 10 }]}>
                  No comments.
                </Text>
              ) : (
                thought.comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              )}
            </ScrollView>
          </View>
        </LinearGradientProvider>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Thought;
