import {
  View,
  Linking,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import type { AppNavProps } from "../../../params";
import { COLORS, FONTS, KEYS } from "../../../constants";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { usePlatform } from "../../../hooks";
import Divider from "../../../components/Divider/Divider";
import { useMeStore } from "../../../store";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { del, onFetchUpdateAsync, rateApp } from "../../../utils";
import { trpc } from "../../../utils/trpc";
import SettingItem from "../../../components/SettingItem/SettingItem";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import Ripple from "../../../components/Ripple/Ripple";
import PaymentBottomSheet from "../../../components/PaymentBottomSheet/PaymentBottomSheet";

const Settings: React.FunctionComponent<AppNavProps<"Settings">> = ({
  navigation,
}) => {
  const { os } = usePlatform();
  const { mutateAsync: mutateLogout, isLoading: loggingOut } =
    trpc.logout.logout.useMutation();
  const { me, setMe } = useMeStore();
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((state) => !state);

  const logout = () => {
    mutateLogout().then(async (res) => {
      if (res) {
        await del(KEYS.TOKEN_KEY);
        setMe(null);
      }
    });
  };

  const toggleInvisibleMode = () => {};

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
          <Divider color={COLORS.tertiary} title="USER PRIVACY" />
          <SettingItem
            title={"Show Active Status"}
            Icon={<Ionicons name="eye" size={18} color={COLORS.tertiary} />}
            onPress={() => {
              if (
                !!!me?.payments?.find((p) => p.category === "active_status")
              ) {
                toggle();
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
          <Divider color={COLORS.tertiary} title="PIN MANAGEMENT" />
          <SettingItem
            title={"Change Pin"}
            Icon={<Ionicons name="key" size={18} color={COLORS.tertiary} />}
            onPress={() => navigation.navigate("ChangePin")}
          />
          <SettingItem
            title={"Forgot Pin"}
            Icon={<Ionicons name="key" size={18} color={COLORS.red} />}
            onPress={() => {}}
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
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.secondary,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                },
              ]}
              disabled={loggingOut}
              onPress={logout}
            >
              <Text
                style={[
                  styles.button__text,
                  { color: COLORS.black, marginRight: loggingOut ? 10 : 0 },
                ]}
              >
                LOGOUT
              </Text>
              {loggingOut ? <Ripple size={5} color={COLORS.tertiary} /> : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.red,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  marginLeft: 10,
                },
              ]}
            >
              <Text style={[styles.button__text, { color: COLORS.white }]}>
                DELETE ACCOUNT
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradientProvider>
  );
};

export default Settings;
