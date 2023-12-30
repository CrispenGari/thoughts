import React from "react";
import { View, TextInput, StyleProp, TextStyle, ViewStyle } from "react-native";
import { COLORS, FONTS } from "../../constants";

interface Props {
  length?: number;
  onComplete: (pin: string) => void;
  mask?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
}

const PinInput: React.FunctionComponent<Props> = ({
  length = 4,
  onComplete,
  mask = "*",
  placeholder,
  containerStyle,
  inputStyle,
  pin,
  setPin,
}) => {
  const inputRefs: any[] = Array.from({ length }, () => null);
  const focusInput = (index: number) => {
    if (inputRefs[index]) {
      inputRefs[index].focus();
    }
  };

  const handlePinChange = (index: number, value: string) => {
    const newPin = pin.split("");
    newPin[index] = value;
    setPin(newPin.join(""));

    if (value !== "" && index < length - 1) {
      focusInput(index + 1);
    }

    if (newPin.join("").length === length) {
      onComplete(newPin.join(""));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && index > 0) {
      focusInput(index - 1);
    }
  };
  const maskedPin = mask.repeat(pin.length);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          padding: 10,
          maxWidth: 400,
        },
        containerStyle,
      ]}
    >
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs[index] = ref)}
          placeholder={placeholder}
          style={[
            {
              width: 40,
              height: 40,
              borderWidth: 1,
              borderRadius: 8,
              margin: 5,
              textAlign: "center",
              fontSize: 20,
              backgroundColor: COLORS.white,
              fontFamily: FONTS.regularBold,
              borderColor: COLORS.tertiary,
            },
            inputStyle,
          ]}
          keyboardType="numeric"
          maxLength={1}
          selectionColor={COLORS.black}
          secureTextEntry
          value={maskedPin[index]}
          onChangeText={(value) => handlePinChange(index, value)}
          onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
        />
      ))}
    </View>
  );
};

export default PinInput;
