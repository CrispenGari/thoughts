import { View, Modal as M } from "react-native";
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
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, .3)",
          padding: 5,
        }}
      >
        {children}
      </View>
    </M>
  );
};

export default PictureSelectionModal;
