import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "../Modal/Modal";
import { styles } from "../../styles";
import { COLORS } from "../../constants";
import { trpc } from "../../utils/trpc";
import { UserType } from "@thoughts/api/src/types";
import Ripple from "../Ripple/Ripple";

interface Props {
  open: boolean;
  toggle: () => void;
  user: UserType;
}
const BlockedContactControls: React.FunctionComponent<Props> = ({
  open,
  toggle,
  user,
}) => {
  const { isLoading: unblocking, mutateAsync: mutateUnBlockUser } =
    trpc.blocked.unblock.useMutation();
  const unblock = () => {
    if (user?.id) {
      mutateUnBlockUser({ phoneNumber: user.phoneNumber }).then((res) => {
        if (res.success) {
          toggle();
        }
      });
    }
  };
  return (
    <Modal toggle={toggle} open={open}>
      <View
        style={{
          width: "100%",
          maxWidth: 400,
          marginBottom: 80,
          margin: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            padding: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: "100%",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -10,
              backgroundColor: COLORS.white,
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 999,
              maxHeight: 30,
            }}
          >
            <Text style={[styles.h1]}>UNBLOCK ACTION</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: COLORS.red,
                marginVertical: 10,
                padding: 10,
                borderRadius: 5,
                maxWidth: "100%",
                marginTop: 30,
              },
            ]}
            disabled={unblocking}
            onPress={unblock}
          >
            <Text
              style={[
                styles.button__text,
                {
                  color: COLORS.white,
                  marginRight: unblocking ? 10 : 0,
                },
              ]}
            >
              UNBLOCK {user.name}
            </Text>
            {unblocking ? <Ripple size={5} color={COLORS.white} /> : null}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BlockedContactControls;
