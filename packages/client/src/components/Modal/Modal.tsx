import {
  Text,
  Modal as M,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { styles } from "../../styles";
import { COLORS } from "../../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Modal: React.FunctionComponent<Props> = ({
  open,
  toggle,
  children,
  style,
}) => {
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggle}
          style={[
            {
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, .3)",
              padding: 5,
            },
            style,
          ]}
        >
          {children}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggle}
            style={[
              styles.button,
              {
                position: "absolute",
                bottom: 30,
                backgroundColor: COLORS.red,
                borderRadius: 5,
                padding: 10,
                maxWidth: 360,
              },
            ]}
          >
            <Text style={[styles.button__text, { color: COLORS.white }]}>
              close
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </M>
  );
};

export default Modal;
