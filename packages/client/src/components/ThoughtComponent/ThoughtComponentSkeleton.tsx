import React, { Component } from "react";
import ContentLoader from "../ContentLoader/ContentLoader";
import { COLORS } from "../../constants";
import { View } from "react-native-animatable";

export class ThoughtComponentSkeleton extends Component {
  render() {
    return (
      <ContentLoader
        style={{
          height: 50,
          zIndex: 5,
          width: "100%",
          position: "absolute",
          top: 5,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.main,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            minHeight: 35,
            maxHeight: 35,
            borderColor: COLORS.tertiary,
            borderWidth: 0.5,
            zIndex: 3,
          }}
        >
          <ContentLoader />
        </View>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 14,
            backgroundColor: COLORS.main,
            position: "absolute",
            bottom: 2,
            zIndex: 2,
            left: 3,
            borderColor: COLORS.tertiary,
            borderWidth: 0.5,
          }}
        />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 7,
            backgroundColor: COLORS.main,
            position: "absolute",
            bottom: 0,
            zIndex: 2,
            left: 18,
            borderColor: COLORS.tertiary,
            borderWidth: 0.5,
          }}
        />
      </ContentLoader>
    );
  }
}

export default ThoughtComponentSkeleton;
