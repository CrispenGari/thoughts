import { Image, StatusBar, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, logo } from "../../constants";
import * as Animatable from "react-native-animatable";
const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar hidden />
      <Animatable.View
        iterationCount={"infinite"}
        iterationDelay={500}
        animation={"zoomIn"}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={{ uri: Image.resolveAssetSource(logo).uri }}
        />
      </Animatable.View>
    </View>
  );
};

export default Loading;
