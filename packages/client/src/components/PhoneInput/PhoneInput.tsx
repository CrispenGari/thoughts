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
import ModalSelector from "react-native-modal-selector";
import { styles } from "../../styles";

const formatPhoneNumber = (num: string) => {
  const groups = num.replace(/\s/g, "").match(/.{1,3}/g);
  return groups ? groups.join(" ") : "";
};

interface PhoneInputStateType {
  country:
    | {
        name: string;
        code: string;
        emoji: string;
        flag: {
          image: string;
          unicode: string;
        };
        phone: {
          code: string;
        };
      }
    | undefined;
  number: string;
}
interface Props {
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  state: PhoneInputStateType;
  setState: React.Dispatch<React.SetStateAction<PhoneInputStateType>>;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  countrySelectorTextStyle?: StyleProp<TextStyle>;
  defaultPhoneNumber?: string;
  defaultPhoneCountryCode?: string;
}
const PhoneInput: React.FunctionComponent<Props> = ({
  containerStyle,
  inputStyle,
  countrySelectorTextStyle,
  state,
  setState,
  placeholder,
  onSubmitEditing,
}) => {
  const selectorRef = React.createRef<ModalSelector>();
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
              {state.country?.emoji}
            </Text>
            <Text
              style={[
                { marginLeft: 5, fontFamily: FONTS.regularBold, fontSize: 25 },
                countrySelectorTextStyle,
              ]}
            >
              {state.country?.phone.code}
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
