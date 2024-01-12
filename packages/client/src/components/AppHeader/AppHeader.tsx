import { View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, logo } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppParamList } from "../../params";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMeStore, useNotificationsStore } from "../../store";

const AppHeader = ({
  navigation,
}: {
  navigation: StackNavigationProp<AppParamList, "Home">;
}) => {
  const { me } = useMeStore();
  const { notifications } = useNotificationsStore();

  return (
    <View
      style={{
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
        borderColor: "transparent",
        backgroundColor: COLORS.tertiary,
        paddingTop: 40,
        paddingHorizontal: 10,
        paddingBottom: 20,
        height: 130,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Image
        source={{ uri: Image.resolveAssetSource(logo).uri }}
        style={{ width: 30, height: 30 }}
        tintColor={COLORS.main}
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            if (!!!me) return;
            navigation.navigate("Profile", {
              userId: me.id!,
              isMe: true,
            });
          }}
          activeOpacity={0.7}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            borderRadius: 30,
            marginLeft: 10,
            backgroundColor: COLORS.tertiary,
          }}
        >
          <Ionicons name="person" size={24} color={COLORS.main} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          activeOpacity={0.7}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            borderRadius: 30,
            marginLeft: 10,
            backgroundColor: COLORS.tertiary,
          }}
        >
          {notifications.unread?.length ? (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                zIndex: 1,
                top: 5,
                right: 3,
                backgroundColor: COLORS.red,
                position: "absolute",
              }}
            />
          ) : null}
          <Ionicons name="notifications" size={24} color={COLORS.main} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Settings")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            borderRadius: 30,
            marginLeft: 10,
            backgroundColor: COLORS.tertiary,
          }}
        >
          <Ionicons name="settings" size={24} color={COLORS.main} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppHeader;
