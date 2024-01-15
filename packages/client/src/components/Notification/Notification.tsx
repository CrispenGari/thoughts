import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import { NotificationType } from "@thoughts/api/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, relativeTimeObject } from "../../constants";
import { styles } from "../../styles";
import dayjs from "dayjs";
import Swipeable from "react-native-gesture-handler/Swipeable";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";

import { trpc } from "../../utils/trpc";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface Props {
  refetchNotifications: () => Promise<any>;
  notifications: NotificationType[];
  navigation: StackNavigationProp<AppParamList, "Notifications">;
}
const Notification: React.FunctionComponent<Props> = ({
  navigation,
  notifications,
  refetchNotifications,
}) => {
  const swipeableRef = React.useRef<Swipeable | undefined>();
  const { mutateAsync: del } = trpc.notification.del.useMutation();
  const notification = notifications[0];
  const open = () => {
    if (!!notification.thoughtId) {
      navigation.navigate("Thought", {
        id: notification.thoughtId,
        notificationId: notification.id!,
        read: notification.read,
        type: notification.type!,
      });
    }
  };

  const deleteNotification = () => {
    if (notification.id) {
      del({ thoughtId: notification.thoughtId, type: notification.type! }).then(
        async (res) => {
          if (res.success) {
            await refetchNotifications();
          }
        }
      );
    }
  };

  return (
    <Swipeable
      ref={swipeableRef as any}
      renderRightActions={(_progress, _dragX) => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                justifyContent: "center",
                alignItems: "center",
                minWidth: 50,
                backgroundColor: COLORS.red,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: "100%",
              }}
              onPress={deleteNotification}
            >
              <MaterialIcons name="delete" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        );
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingHorizontal: 10,
          backgroundColor: !notification.read ? COLORS.secondary : COLORS.white,
          paddingRight: 20,
          marginBottom: 2,
        }}
        activeOpacity={0.7}
        onPress={open}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.h1, { fontSize: 16 }]} numberOfLines={1}>
              {notification.type}
            </Text>
            <Text style={[styles.p, { fontSize: 16 }]}>
              {" • "}
              {dayjs(notification.createdAt).fromNow()}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.p,
              {
                fontSize: 14,
                color: !notification.read ? COLORS.white : COLORS.tertiary,
              },
            ]}
          >
            {`${notifications.length} ${notification.read ? "old" : "new"}`}{" "}
            {notification.title}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default Notification;
