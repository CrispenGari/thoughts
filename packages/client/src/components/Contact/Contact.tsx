import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Contact as CT } from "expo-contacts";
import { COLORS, profile } from "../../constants";
import { styles } from "../../styles";
import Ripple from "../Ripple/Ripple";
import { trpc } from "../../utils/trpc";
import { getContactNumber } from "../../utils";

const Contact: React.FunctionComponent<{
  contact: CT;
}> = ({ contact }) => {
  const { data } = trpc.user.contact.useQuery({
    input: getContactNumber(contact),
  });
  if (!!!data?.user) return null;
  return (
    <View
      style={{
        width: 100,
        alignItems: "center",
        marginLeft: 5,
        height: 150,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          height: 50,
          zIndex: 5,
          width: "100%",
          position: "absolute",
          top: 0,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            minHeight: 35,
            maxHeight: 35,
          }}
        >
          <Text style={[styles.p]} numberOfLines={2}>
            I'm thinking of dying.
          </Text>
        </View>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            backgroundColor: COLORS.white,
            position: "absolute",
            bottom: 2,
            zIndex: 2,
            left: 3,
          }}
        />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 7,
            backgroundColor: COLORS.white,
            position: "absolute",
            bottom: 0,
            zIndex: 2,
            left: 18,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <View style={{ position: "relative" }}>
          {data.user.online ? (
            <View style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
              <Ripple color={COLORS.tertiary} size={5} />
            </View>
          ) : null}
          <Image
            style={{ width: 50, height: 50, borderRadius: 50, marginBottom: 3 }}
            source={{ uri: Image.resolveAssetSource(profile).uri }}
          />
        </View>
        <Text numberOfLines={1} style={[styles.h1]}>
          {data.contactName || data.user.name}
        </Text>
      </View>
    </View>
  );
};
export default React.memo(Contact);
