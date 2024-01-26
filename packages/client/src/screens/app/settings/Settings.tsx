import { View, Linking, ScrollView } from "react-native";
import React from "react";
import type { AppNavProps } from "../../../params";
import { COLORS, FONTS } from "../../../constants";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { usePlatform } from "../../../hooks";
import Divider from "../../../components/Divider/Divider";
import { useMeStore } from "../../../store";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { onFetchUpdateAsync, rateApp } from "../../../utils";
import { trpc } from "../../../utils/trpc";
import SettingItem from "../../../components/SettingItem/SettingItem";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";

import PaymentBottomSheet from "../../../components/PaymentBottomSheet/PaymentBottomSheet";

const Settings: React.FunctionComponent<AppNavProps<"Settings">> = ({
  navigation,
}) => {
  const { os } = usePlatform();
  const { mutateAsync: mutateLogout, isLoading: loggingOut } =
    trpc.logout.logout.useMutation();
  const { me } = useMeStore();
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((state) => !state);
  const { isLoading: updatingVisibility, mutateAsync: mutateUpdateVisibility } =
    trpc.setting.updateVisibility.useMutation();
  const {
    isLoading: updatingNotifications,
    mutateAsync: mutateUpdateNotifications,
  } = trpc.setting.updateNotifications.useMutation();

  const logout = () => {
    mutateLogout();
  };
  const toggleInvisibleMode = () => {
    if (updatingVisibility) return;
    mutateUpdateVisibility();
  };
  const toggleNotifications = () => {
    if (updatingNotifications) return;
    mutateUpdateNotifications();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Settings",
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
      <PaymentBottomSheet open={open} toggle={toggle} />
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          width: "100%",
          maxWidth: 500,
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Divider color={COLORS.tertiary} title="MISC" />
          <SettingItem
            titleColor={COLORS.tertiary}
            title={"Rate invitee"}
            Icon={
              <MaterialIcons
                name="star-rate"
                size={18}
                color={COLORS.tertiary}
              />
            }
            onPress={async () => {
              await rateApp();
            }}
          />
          <SettingItem
            titleColor={COLORS.tertiary}
            title={"Check for Updates"}
            Icon={
              <MaterialIcons
                name="system-update"
                size={18}
                color={COLORS.tertiary}
              />
            }
            onPress={async () => {
              await onFetchUpdateAsync();
            }}
          />
          <SettingItem
            titleColor={COLORS.tertiary}
            title={"Terms of Use"}
            Icon={
              <Ionicons
                name="document-text-outline"
                size={18}
                color={COLORS.tertiary}
              />
            }
            onPress={() =>
              navigation.navigate("AppTermsOfUse", {
                from: "Settings",
              })
            }
          />
          <SettingItem
            titleColor={COLORS.tertiary}
            title={"Privacy Policy"}
            Icon={
              <MaterialIcons
                name="privacy-tip"
                size={18}
                color={COLORS.tertiary}
              />
            }
            onPress={() =>
              navigation.navigate("AppPrivacyPolicy", {
                from: "Settings",
              })
            }
          />
          <Divider color={COLORS.tertiary} title="PUSH NOTIFICATIONS" />
          <SettingItem
            title={
              !!!me?.setting?.notifications
                ? "Enable Notifications"
                : "Disable Notifications"
            }
            Icon={
              <Ionicons
                name={
                  !!!me?.setting?.notifications
                    ? "notifications-off"
                    : "notifications"
                }
                size={18}
                color={COLORS.tertiary}
              />
            }
            onPress={() => {
              toggleNotifications();
            }}
          />
          <Divider color={COLORS.tertiary} title="USER PRIVACY" />
          <SettingItem
            title={
              !!!me?.setting?.activeStatus
                ? "Show Active Status"
                : "Hide Active Status"
            }
            Icon={
              <Ionicons
                name={!!!me?.setting?.activeStatus ? "eye-off" : "eye"}
                size={18}
                color={COLORS.tertiary}
              />
            }
            onPress={() => {
              if (
                !!!me?.payments?.find((p) => p.category === "active_status")
              ) {
                toggle();
                return;
              }
              toggleInvisibleMode();
            }}
          />
          <SettingItem
            title={"Blocked Contacts"}
            Icon={
              <MaterialIcons name="block" size={18} color={COLORS.tertiary} />
            }
            onPress={() => navigation.navigate("BlockedContact")}
          />
          <Divider color={COLORS.tertiary} title="PHONE MANAGEMENT" />
          <SettingItem
            title={"Update Phone Number"}
            Icon={<Ionicons name="keypad" size={18} color={COLORS.tertiary} />}
            onPress={() => navigation.navigate("UpdatePhoneNumber")}
          />
          <Divider color={COLORS.tertiary} title="PIN & PASSKEY MANAGEMENT" />
          <SettingItem
            title={"Change Pin"}
            Icon={<Ionicons name="key" size={18} color={COLORS.tertiary} />}
            onPress={() => navigation.navigate("ChangePin")}
          />
          <SettingItem
            title={"Change Passkey"}
            Icon={
              <MaterialIcons name="lock" size={18} color={COLORS.tertiary} />
            }
            onPress={() => navigation.navigate("OldPasskey")}
          />
          <SettingItem
            title={"Forgot Pin"}
            titleColor={COLORS.red}
            Icon={<Ionicons name="key" size={18} color={COLORS.red} />}
            onPress={() => navigation.navigate("ForgotPin")}
          />
          <SettingItem
            title={"Forgot Passkey"}
            titleColor={COLORS.red}
            Icon={<MaterialIcons name="lock" size={18} color={COLORS.red} />}
            onPress={() => navigation.navigate("ForgotPasskey")}
          />

          <Divider color={COLORS.tertiary} title="ISSUES & BUGS" />
          <SettingItem
            title="Report an Issue"
            titleColor={COLORS.red}
            Icon={
              <MaterialIcons name="sync-problem" size={18} color={COLORS.red} />
            }
            onPress={async () => {
              await Linking.openURL(
                "https://github.com/CrispenGari/thoughts/issues"
              );
            }}
          />
          <Divider color={COLORS.tertiary} title="MANAGE ACCOUNT" />

          <SettingItem
            title="Logout"
            titleColor={COLORS.tertiary}
            Icon={<Ionicons name="log-in" size={18} color={COLORS.tertiary} />}
            onPress={() => {
              if (loggingOut) return;
              logout();
            }}
          />
          <SettingItem
            title="Delete Account"
            titleColor={COLORS.red}
            Icon={<MaterialIcons name="delete" size={18} color={COLORS.red} />}
            onPress={() => navigation.navigate("DeleteAccount")}
          />
        </ScrollView>
      </View>
    </LinearGradientProvider>
  );
};

export default Settings;
