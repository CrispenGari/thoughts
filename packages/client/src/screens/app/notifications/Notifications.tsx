import { View, Text, ScrollView } from "react-native";
import React from "react";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { COLORS, FONTS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import { useNotificationsStore } from "../../../store";
import Divider from "../../../components/Divider/Divider";
import Notification from "../../../components/Notification/Notification";
import { RefreshControl } from "react-native-gesture-handler";
import { trpc } from "../../../utils/trpc";
import { styles } from "../../../styles";
import { GroupType } from "../../../types";

const Notifications: React.FunctionComponent<AppNavProps<"Notifications">> = ({
  navigation,
}) => {
  const [groups, setGroups] = React.useState<GroupType>({
    read: {
      comment: [],
      reply: [],
      comment_reaction: [],
      reply_reaction: [],
    },
    unread: {
      comment: [],
      reply: [],
      comment_reaction: [],
      reply_reaction: [],
    },
  });
  const { os } = usePlatform();
  const { setNotifications } = useNotificationsStore();
  const {
    data: notifications,
    isFetching: fetching,
    refetch: refetchNotifications,
  } = trpc.notification.all.useQuery();

  React.useEffect(() => {
    if (!!notifications) {
      setNotifications(notifications);
    }
  }, [notifications]);

  React.useEffect(() => {
    if (!!notifications) {
      setGroups((state) => ({
        ...state,
        read: {
          ...state.read,
          comment:
            notifications?.read?.filter((n) => n?.type === "comment") ||
            state.read.comment,
          comment_reaction:
            notifications?.read?.filter(
              (n) => n?.type === "comment_reaction"
            ) || state.read.comment_reaction,
          reply:
            notifications?.read?.filter((n) => n?.type === "reply") ||
            state.read.reply,
          reply_reaction:
            notifications?.read?.filter((n) => n?.type === "reply_reaction") ||
            state.read.reply_reaction,
        },
        unread: {
          ...state.unread,
          comment:
            notifications?.unread?.filter((n) => n?.type === "comment") ||
            state.unread.comment,
          comment_reaction:
            notifications?.unread?.filter(
              (n) => n?.type === "comment_reaction"
            ) || state.unread.comment_reaction,
          reply:
            notifications?.unread?.filter((n) => n?.type === "reply") ||
            state.unread.reply,
          reply_reaction:
            notifications?.unread?.filter(
              (n) => n?.type === "reply_reaction"
            ) || state.unread.reply_reaction,
        },
      }));
    }
  }, [notifications]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Notifications",
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
          label={os === "ios" ? "Home" : ""}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <LinearGradientProvider>
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          width: "100%",
          maxWidth: 500,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              shouldRasterizeIOS={true}
              refreshing={fetching}
              onRefresh={async () => {
                await refetchNotifications();
              }}
            />
          }
        >
          <Divider color={COLORS.tertiary} title="UNREAD NOTIFICATIONS" />

          {!!!notifications?.unread || notifications.unread.length === 0 ? (
            <View
              style={{
                justifyContent: "center",
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text style={[styles.p, { fontSize: 14 }]}>
                No unread notifications.
              </Text>
            </View>
          ) : (
            Object.entries(groups.unread)
              .map(([name, noti]) => ({ name, noti }))
              .map((not) => {
                if (not.noti.length === 0) return null;
                return (
                  <Notification
                    key={not.name}
                    navigation={navigation}
                    notifications={not.noti}
                    refetchNotifications={refetchNotifications}
                  />
                );
              })
          )}
          <Divider color={COLORS.tertiary} title="OLD NOTIFICATIONS" />
          {!!!notifications?.read || notifications.read.length === 0 ? (
            <View
              style={{
                justifyContent: "center",
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text style={[styles.p, { fontSize: 14 }]}>
                No old notifications.
              </Text>
            </View>
          ) : (
            Object.entries(groups.read)
              .map(([name, noti]) => ({ name, noti }))
              .map((not) => {
                if (not.noti.length === 0) return null;
                return (
                  <Notification
                    key={not.name}
                    navigation={navigation}
                    notifications={not.noti}
                    refetchNotifications={refetchNotifications}
                  />
                );
              })
          )}
        </ScrollView>
      </View>
    </LinearGradientProvider>
  );
};

export default Notifications;
