import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import React from "react";
import { countries } from "../../constants/countries";
import { COLORS, FONTS } from "../../constants";
import * as Location from "expo-location";
import ModalSelector from "react-native-modal-selector";
import { styles } from "../../styles";
import { useLocationPermission } from "../../hooks";

const formatPhoneNumber = (num: string) => {
  const groups = num.replace(/\s/g, "").match(/.{1,3}/g);
  return groups ? groups.join(" ") : "";
};

interface Props {
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;

  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  countrySelectorTextStyle?: StyleProp<TextStyle>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}
const PhoneInput: React.FunctionComponent<Props> = ({
  containerStyle,
  inputStyle,
  countrySelectorTextStyle,
  setPhoneNumber,
  placeholder,
  onSubmitEditing,
}) => {
  const [state, setState] = React.useState({
    country: countries[0],
    number: "",
  });
  const { granted } = useLocationPermission();
  const selectorRef = React.createRef<ModalSelector>();
  React.useLayoutEffect(() => {
    if (granted) {
      Location.getCurrentPositionAsync().then(
        ({ coords: { latitude, longitude } }) => {
          Location.reverseGeocodeAsync({
            latitude,
            longitude,
          }).then((loc) => {
            const curr = loc[0];
            setState((state) => ({
              ...state,
              country: countries.find(
                (c) =>
                  c.code.toLowerCase() === curr.isoCountryCode?.toLowerCase()
              )!,
            }));
          });
        }
      );
    }
  }, [granted]);
  React.useEffect(() => {
    setPhoneNumber(
      `${state.country.phone.code}
      ${
        state.number.startsWith("0")
          ? state.number.slice(1).replace(/\s/g, "")
          : state.number.replace(/\s/g, "")
      }`
    );
  }, [state]);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          width: "100%",
          maxWidth: 400,
          alignItems: "center",
          backgroundColor: COLORS.white,
          paddingHorizontal: 20,
          paddingVertical: 5,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "transparent",
        },
        containerStyle,
      ]}
    >
      <ModalSelector
        onChange={(value: any) =>
          setState((state) => ({ ...state, country: value }))
        }
        optionContainerStyle={{ backgroundColor: COLORS.main }}
        data={countries.map((c) => ({
          ...c,
          key: c.code,
          label: `${c.emoji}   ${c.name} (${c.phone.code})`,
        }))}
        ref={selectorRef}
        keyExtractor={(item) => item.code}
        optionStyle={{ alignItems: "flex-start" }}
        optionTextStyle={{ ...styles.h1, color: COLORS.black }}
        cancelStyle={{ backgroundColor: COLORS.red }}
        cancelTextStyle={{ ...styles.h1, color: COLORS.white, fontSize: 20 }}
        customSelector={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => selectorRef.current?.open()}
            style={{ flexDirection: "row" }}
          >
            <Text
              style={[
                { fontFamily: FONTS.regularBold, fontSize: 25 },
                countrySelectorTextStyle,
              ]}
            >
              {state.country.emoji}
            </Text>
            <Text
              style={[
                { marginLeft: 5, fontFamily: FONTS.regularBold, fontSize: 25 },
                countrySelectorTextStyle,
              ]}
            >
              {state.country.phone.code}
            </Text>
          </TouchableOpacity>
        }
      />

      <TextInput
        keyboardType="phone-pad"
        selectionColor={COLORS.black}
        style={[
          {
            backgroundColor: COLORS.white,
            flex: 1,
            fontFamily: FONTS.regularBold,
            fontSize: 25,
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderLeftWidth: 1,
            marginLeft: 10,
            letterSpacing: 2,
          },
          inputStyle,
        ]}
        maxLength={13}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        value={state.number}
        onChangeText={(text) => {
          setState((state) => ({ ...state, number: formatPhoneNumber(text) }));
        }}
      />
    </View>
  );
};

export default PhoneInput;
