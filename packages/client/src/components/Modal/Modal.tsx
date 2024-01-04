import { View, Text, Modal as M, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../../styles";
import { COLORS } from "../../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}

const Modal: React.FunctionComponent<Props> = ({ open, toggle, children }) => {
  return (
    <M
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={toggle}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
            backgroundColor: "rgba(0, 0, 0, .3)",
          }}
        >
          {children}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggle}
            style={[
              styles.button,
              {
                position: "absolute",
                bottom: 20,
                backgroundColor: COLORS.red,
                borderRadius: 5,
              },
            ]}
          >
            <Text
              style={[
                styles.button__text,
                { color: COLORS.white, textTransform: "uppercase" },
              ]}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </M>
  );
};

export default Modal;