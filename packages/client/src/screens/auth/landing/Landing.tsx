import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { trpc } from "../../../utils/trpc";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { AuthNavProps } from "../../../params";
import { APP_NAME, COLORS, FONTS, logo } from "../../../constants";
import { styles } from "../../../styles";
import { BottomSheet, CheckBox } from "react-native-btr";
import { useLocationPermission, useMediaQuery } from "../../../hooks";
import Loading from "../../../components/Loading/Loading";
import { useCountryCodeStore, useMeStore } from "../../../store";
import * as Location from "expo-location";

const Landing: React.FunctionComponent<AuthNavProps<"Landing">> = ({
  navigation,
}) => {
  const { granted } = useLocationPermission();
  const { setCode } = useCountryCodeStore();
  const [agree, setAgree] = React.useState(false);
  const { data, isFetching } = trpc.user.me.useQuery();
  const { setMe } = useMeStore();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const toggle = () => setOpen((state) => !state);
  const {
    dimension: { height },
  } = useMediaQuery();
  React.useEffect(() => {
    if (!!data?.me) {
      setMe(data.me);
    } else {
      setMe(null);
    }
  }, [data]);

  React.useEffect(() => {
    if (granted) {
      setLoading(true);
      Location.getCurrentPositionAsync()
        .then(({ coords: { latitude, longitude } }) => {
          Location.reverseGeocodeAsync({ latitude, longitude }).then((res) => {
            if (!!res.length) {
              setCode(res[0].isoCountryCode?.toLowerCase() || null);
            }
          });
        })
        .finally(() => setLoading(false));
    } else {
      setCode(null);
    }
  }, [setCode, granted]);

  if (isFetching || loading) return <Loading />;

  return (
    <LinearGradientProvider>
      <View
        style={{ flex: 0.6, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={{
            uri: Image.resolveAssetSource(logo).uri,
          }}
          style={{
            width: 150,
            height: 150,
            resizeMode: "contain",
          }}
        />
        <Text
          style={[
            styles.h1,
            {
              marginTop: 30,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontSize: 20,
            },
          ]}
        >
          {APP_NAME}
        </Text>
      </View>
      <View
        style={{
          flex: 0.4,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          padding: 10,
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          disabled={!agree}
          onPress={toggle}
          activeOpacity={0.7}
          style={[
            styles.button,
            {
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              maxWidth: 200,
            },
          ]}
        >
          <Text style={[styles.button__text, { color: COLORS.black }]}>
            GET STARTED
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 400,
            marginTop: 20,
          }}
        >
          <CheckBox
            color={COLORS.tertiary}
            checked={agree}
            onPress={() => setAgree((state) => !state)}
          />
          <Text style={[styles.p, { marginLeft: 10 }]}>
            I've agreed with the
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AuthTermsOfUse", { from: "Landing" });
            }}
            activeOpacity={0.7}
            style={{}}
          >
            <Text
              style={[
                styles.p,
                {
                  color: COLORS.tertiary,
                  textDecorationStyle: "solid",
                  textDecorationColor: COLORS.tertiary,
                  textDecorationLine: "underline",
                },
              ]}
            >
              Terms and Conditions
            </Text>
          </TouchableOpacity>
          <Text style={[styles.p]}> and </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AuthPrivacyPolicy", { from: "Landing" });
            }}
            activeOpacity={0.7}
            style={{}}
          >
            <Text
              style={[
                styles.p,
                {
                  color: COLORS.tertiary,
                  textDecorationStyle: "solid",
                  textDecorationColor: COLORS.tertiary,
                  textDecorationLine: "underline",
                },
              ]}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <Text style={[styles.p, { fontFamily: FONTS.regularBold }]}>
            {" "}
            of {APP_NAME}.
          </Text>
        </View>
      </View>
      <BottomSheet
        visible={!!open}
        onBackButtonPress={toggle}
        onBackdropPress={toggle}
      >
        <View
          style={{
            height: height / 2,
            backgroundColor: COLORS.main,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          }}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: COLORS.main,
              paddingHorizontal: 15,
              top: -10,
              shadowRadius: 2,
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.5,
              alignSelf: "center",
              paddingVertical: 5,
              shadowColor: COLORS.tertiary,
              borderRadius: 999,
            }}
          >
            <Text
              style={[
                styles.h1,
                {
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                },
              ]}
            >
              {APP_NAME}
            </Text>
          </View>
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                maxWidth: 400,
              }}
            >
              <Text style={[styles.p]}>
                By using {APP_NAME} you are agreeing with our
              </Text>
              <TouchableOpacity
                onPress={() => {
                  toggle();
                  navigation.navigate("AuthTermsOfUse", { from: "Landing" });
                }}
                activeOpacity={0.7}
                style={{}}
              >
                <Text
                  style={[
                    styles.p,
                    {
                      color: COLORS.tertiary,
                      textDecorationStyle: "solid",
                      textDecorationColor: COLORS.tertiary,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  Terms and Conditions
                </Text>
              </TouchableOpacity>
              <Text style={[styles.p]}> and you are inline with our </Text>
              <TouchableOpacity
                onPress={() => {
                  toggle();
                  navigation.navigate("AuthPrivacyPolicy", { from: "Landing" });
                }}
                activeOpacity={0.7}
                style={{}}
              >
                <Text
                  style={[
                    styles.p,
                    {
                      color: COLORS.tertiary,
                      textDecorationStyle: "solid",
                      textDecorationColor: COLORS.tertiary,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <Text style={[styles.p, { fontFamily: FONTS.regularBold }]}>
                .
              </Text>
            </View>
            <Image
              source={{
                uri: Image.resolveAssetSource(logo).uri,
              }}
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                marginTop: 20,
              }}
            />
          </View>
          <View
            style={{
              flex: 0.4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                toggle();
                navigation.replace("PhoneNumber");
              }}
              activeOpacity={0.7}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.secondary,
                  padding: 10,
                  marginTop: 10,
                },
              ]}
            >
              <Text style={[styles.button__text]}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.replace("SetPhoneNumber");
              }}
              activeOpacity={0.7}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.primary,
                  padding: 10,
                  marginTop: 10,
                },
              ]}
            >
              <Text style={[styles.button__text]}>REGISTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </LinearGradientProvider>
  );
};

export default Landing;
