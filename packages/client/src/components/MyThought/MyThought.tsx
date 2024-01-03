import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, profile } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles";

const MyThought = () => {
  const [thought, setThought] = React.useState("Niphi?");
  return (
    <View
      style={{
        flex: 0.9,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "relative",
          height: 200,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!!thought ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              height: 50,
              zIndex: 5,
              width: "100%",
              position: "absolute",
              top: 0,
              maxWidth: 150,
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
        ) : null}
        <View style={{ width: 60, alignItems: "center" }}>
          {!!!thought ? (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: -20,
                backgroundColor: COLORS.tertiary,
                zIndex: 1,
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color={COLORS.white} />
            </TouchableOpacity>
          ) : null}
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              marginBottom: 3,
              resizeMode: "contain",
            }}
            source={{ uri: Image.resolveAssetSource(profile).uri }}
          />
        </View>
      </View>
    </View>
  );
};

export default MyThought;
