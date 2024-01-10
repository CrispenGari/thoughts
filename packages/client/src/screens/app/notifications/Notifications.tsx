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

const Notifications: React.FunctionComponent<AppNavProps<"Notifications">> = ({
  navigation,
}) => {
  const { os } = usePlatform();
  const { setNotifications } = useNotificationsStore();
  const {
    data: notifications,
    isFetching: fetching,
    refetch: refetchNotifications,
  } = trpc.notification.all.useQuery();

  React.useEffect(() => {
    if (!!notifications) {
      setNotifications(notifications, fetching);
    }
  }, [notifications, fetching]);

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

          {notifications?.filter((n) => !n.read).length === 0 ? (
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
            notifications
              ?.filter((n) => !n.read)
              .map((not) => (
                <Notification
                  key={not.id}
                  navigation={navigation}
                  notification={not}
                  refetchNotifications={refetchNotifications}
                />
              ))
          )}
          <Divider color={COLORS.tertiary} title="OLD NOTIFICATIONS" />
          {notifications?.filter((n) => n.read).length === 0 ? (
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
            notifications
              ?.filter((n) => n.read)
              .map((not) => (
                <Notification
                  key={not.id}
                  navigation={navigation}
                  notification={not}
                  refetchNotifications={refetchNotifications}
                />
              ))
          )}
        </ScrollView>
      </View>
    </LinearGradientProvider>
  );
};

export default Notifications;
