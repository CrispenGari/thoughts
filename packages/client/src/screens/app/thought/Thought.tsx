import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
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
import { useMeStore } from "../../../store";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Thought: React.FunctionComponent<AppNavProps<"Thought">> = ({
  navigation,
  route: { params },
}) => {
  const { me } = useMeStore();
  const [loaded, setLoaded] = React.useState(true);
  const { mutateAsync: read, isLoading } = trpc.notification.read.useMutation();
  const {
    data: thought,
    isFetching: fetching,
    refetch: refetchThought,
    isLoading: isLoadingThought,
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
    if (params.notificationId) {
      read();
    }
  }, [params]);

  if (!!!thought)
    return (
      <LinearGradientProvider>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
          bounces={false}
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
            <Text
              style={[styles.h1, { textAlign: "center", marginVertical: 50 }]}
            >
              No thought...
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradientProvider>
    );

  if (isLoadingThought) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradientProvider>
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
            <ContentLoader
              style={{
                zIndex: 1,
                position: "absolute",
                bottom: -20,
                right: 5,
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: COLORS.gray,
              }}
            />

            <ContentLoader
              style={{
                width: 50,
                padding: 5,
                position: "absolute",
                borderRadius: 999,
                backgroundColor: COLORS.gray,
                marginBottom: 3,
                top: -5,
                right: 0,
                height: 10,
              }}
            />

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
        </LinearGradientProvider>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
      bounces={false}
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
      <LinearGradientProvider>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
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
              <TouchableOpacity
                onPress={() => {
                  if (thought) {
                    navigation.navigate("Profile", {
                      from: "Thought",
                      isMe: me?.id === thought?.userId,
                      userId: thought.userId!,
                    });
                  }
                }}
                activeOpacity={0.7}
                style={{
                  zIndex: 1,
                  position: "absolute",
                  bottom: -20,
                  right: 5,
                  display: loaded ? "flex" : "none",
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                  }}
                  source={{
                    uri: !!thought?.user.avatar
                      ? serverBaseHttpURL.concat(thought?.user.avatar)
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
              </TouchableOpacity>

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
                  {dayjs(thought?.createdAt).fromNow()} ago
                </Text>
              </View>
              <Text style={[styles.h1, { fontSize: 18, marginBottom: 20 }]}>
                {thought?.text}
              </Text>
            </View>

            <Divider color={COLORS.black} title="USER COMMENTS" />

            <View style={{ flex: 1 }}>
              {!!!thought?.comments || thought.comments.length === 0 ? (
                <Text style={[styles.h1, { marginVertical: 10 }]}>
                  No comments.
                </Text>
              ) : (
                thought.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    navigation={navigation}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradientProvider>
    </KeyboardAwareScrollView>
  );
};

export default Thought;
