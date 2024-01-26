import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import { styles } from "../../../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { useMeStore } from "../../../store";
import { COLORS, FONTS, profile, serverBaseHttpURL } from "../../../constants";
import PinInput from "../../../components/PinInput/PinInput";
import Ripple from "../../../components/Ripple/Ripple";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { usePlatform } from "../../../hooks";
import Circular from "../../../components/Circular/Circular";
import ContentLoader from "../../../components/ContentLoader/ContentLoader";
import PublicDetails from "../../../components/ProfileComponents/PublicDetails";
import { trpc } from "../../../utils/trpc";

const ConfirmDeleteAccount: React.FunctionComponent<
  AppNavProps<"ConfirmDeleteAccount">
> = ({ navigation, route }) => {
  const { os } = usePlatform();
  const [loaded, setLoaded] = React.useState(true);
  const [state, setState] = React.useState({
    error: "",
    pin: "",
  });
  const [pin, setPin] = React.useState<string>("");
  const { me } = useMeStore();
  const { mutateAsync, isLoading: deleting } =
    trpc.user.deleteAccount.useMutation();

  const deleteAccount = () => {
    if (!!pin) {
      mutateAsync({
        pin,
        reason: route.params.reason,
      }).then((res) => {
        if (!!res.error) {
          setState((state) => ({ ...state, error: res.error }));
          setPin("");
        } else {
          setState((state) => ({
            ...state,
            error: "",
          }));
          setPin("");
        }
      });
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Delete Account",
      headerShown: true,
      headerTitleStyle: {
        fontFamily: FONTS.regularBold,
        color: COLORS.main,
      },
      headerStyle: {
        backgroundColor: COLORS.tertiary,
        height: 100,
      },
      headerLeft: () => (
        <AppStackBackButton
          label={os === "ios" ? "Settings" : ""}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);
  return (
    <LinearGradientProvider>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 500,
            padding: 10,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.h1,
                {
                  textAlign: "center",
                  fontSize: 20,
                  marginBottom: 20,
                },
              ]}
            >
              Hey {me?.name} confirm delete account with your account pin.
            </Text>
            {!loaded ? (
              <ContentLoader
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  marginBottom: 3,
                  backgroundColor: COLORS.gray,
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Circular
                  size={20}
                  trackColor={COLORS.primary}
                  color={COLORS.tertiary}
                />
              </ContentLoader>
            ) : null}
            <TouchableOpacity
              style={{
                display: loaded ? "flex" : "none",
              }}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  marginBottom: 3,
                  resizeMode: "contain",
                }}
                onError={(_error) => {
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
                source={{
                  uri: !!me?.avatar
                    ? serverBaseHttpURL.concat(me.avatar)
                    : Image.resolveAssetSource(profile).uri,
                }}
              />
            </TouchableOpacity>
            <View style={{ width: "100%" }}>
              <PublicDetails gettingUser={false} isBlocked={false} user={me} />
            </View>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "center",
              width: "100%",
              maxWidth: 500,
              padding: 10,
              alignSelf: "center",
            }}
          >
            <PinInput
              pin={pin}
              setPin={setPin}
              onComplete={(pin) => {
                setState((state) => ({
                  ...state,
                  pin,
                }));
              }}
              length={5}
              placeholder="0"
            />
            <Text
              style={[
                styles.p,
                {
                  color: COLORS.red,
                  marginTop: 5,
                },
              ]}
            >
              {state.error}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={deleteAccount}
              disabled={deleting || !!!pin}
              style={{
                backgroundColor: !!pin ? COLORS.red : COLORS.gray,
                padding: 10,
                width: 200,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                marginTop: 10,
                flexDirection: "row",
                alignSelf: "flex-end",
              }}
            >
              <Text
                style={[
                  styles.button__text,
                  {
                    marginRight: deleting ? 10 : 0,
                    color: COLORS.white,
                  },
                ]}
              >
                DELETE ACCOUNT
              </Text>
              {deleting ? <Ripple color={COLORS.white} size={5} /> : null}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default ConfirmDeleteAccount;
