import { Modal as M, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}

const PictureSelectionModal: React.FunctionComponent<Props> = ({
  open,
  toggle,
  children,
}) => {
  return (
    <M
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={toggle}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, .3)",
          padding: 5,
        }}
        activeOpacity={0.7}
        onPress={toggle}
      >
        {children}
      </TouchableOpacity>
    </M>
  );
};

export default PictureSelectionModal;
