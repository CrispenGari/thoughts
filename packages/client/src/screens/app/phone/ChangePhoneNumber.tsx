import { View, Text } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { FONTS, COLORS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../../styles";
import PhoneInput from "../../../components/PhoneInput/PhoneInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ripple from "../../../components/Ripple/Ripple";
import { trpc } from "../../../utils/trpc";
import { useMeStore } from "../../../store";
import parsePhoneNumber from "libphonenumber-js";
import { countries } from "../../../constants/countries";

const ChangePhoneNumber: React.FunctionComponent<
  AppNavProps<"UpdatePhoneNumber">
> = ({ navigation }) => {
  const { me, setMe } = useMeStore();
  const { os } = usePlatform();

  const [phoneInputState, setPhoneInputState] = React.useState({
    country:
      countries.find(
        (c) => c.code.toLowerCase() === me?.country?.countryCode.toLowerCase()
      ) || countries[0],
    number: !!me
      ? (parsePhoneNumber(me.phoneNumber)?.nationalNumber as string)
      : "",
  });
  const [state, setState] = React.useState({
    error: "",
    defaultPhoneCountryCode: "",
  });
  const { isLoading, mutateAsync } = trpc.user.updatePhoneNumber.useMutation();
  const updatePhoneNumber = () => {
    mutateAsync({
      user: {
        phoneNumber: phoneInputState.number,
      },
      country: {
        countryCode: phoneInputState.country.code,
        phoneCode: phoneInputState.country.phone.code,
        flag: phoneInputState.country.emoji,
        name: phoneInputState.country.name,
      },
    }).then((res) => {
      if (!!res.error) {
        setState((state) => ({ ...state, error: res.error }));
      } else {
        setState((state) => ({ ...state, error: "" }));
        if (!!res.phoneNumber && !!me) {
          setMe({ ...me, phoneNumber: res.phoneNumber });
        }
        navigation.goBack();
      }
    });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Update Phone Number",
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
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
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
            }}
          >
            <Text
              style={[
                styles.h1,
                {
                  marginBottom: 10,
                  fontSize: 20,
                  marginTop: 20,
                },
              ]}
            >
              Phone Number
            </Text>
            <PhoneInput
              placeholder="123 456 789"
              setState={setPhoneInputState}
              state={phoneInputState}
              containerStyle={{
                borderColor: state.error ? COLORS.red : "transparent",
              }}
              onSubmitEditing={updatePhoneNumber}
            />
            <Text
              style={[
                styles.p,
                {
                  color: COLORS.red,
                  marginVertical: 5,
                },
              ]}
            >
              {state.error}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={updatePhoneNumber}
              disabled={isLoading}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.tertiary,
                  padding: 10,
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  marginBottom: 20,
                  maxWidth: 200,
                },
              ]}
            >
              <Text
                style={[
                  styles.button__text,
                  {
                    color: COLORS.white,
                    marginRight: isLoading ? 10 : 0,
                  },
                ]}
              >
                UPDATE
              </Text>
              {isLoading ? <Ripple color={COLORS.white} size={5} /> : null}
            </TouchableOpacity>
          </View>
        </LinearGradientProvider>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ChangePhoneNumber;
