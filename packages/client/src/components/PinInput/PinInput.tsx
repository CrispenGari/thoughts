import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

interface Props {
  length?: number;
  onComplete: (pin: string) => void;
}

const PinInput: React.FC<Props> = ({ length = 4, onComplete }) => {
  const [pin, setPin] = useState<string>("");
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
  const maskedPin = "*".repeat(pin.length);

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs[index] = ref)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          secureTextEntry
          value={maskedPin[index]}
          onChangeText={(value) => handlePinChange(index, value)}
          onKeyPress={({
            nativeEvent: { key },
          }: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
            handleKeyPress(index, key)
          }
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    margin: 5,
    textAlign: "center",
    fontSize: 18,
  },
});

export default PinInput;
