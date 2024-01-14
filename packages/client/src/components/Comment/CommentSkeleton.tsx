import { View } from "react-native";
import React, { Component } from "react";
import { COLORS } from "../../constants";
import ContentLoader from "../ContentLoader/ContentLoader";

export class CommentSkeleton extends Component {
  render() {
    return (
      <View style={{ width: "100%", marginVertical: 10 }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            position: "relative",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <ContentLoader
            style={{
              zIndex: 1,
              position: "absolute",
              top: -10,
              right: 0,
              width: 20,
              height: 20,
              borderRadius: 20,
              backgroundColor: COLORS.gray,
              overflow: "hidden",
            }}
          />

          <ContentLoader
            style={{
              width: "100%",
              padding: 5,
              borderRadius: 2,
              backgroundColor: COLORS.gray,
              marginBottom: 2,
            }}
          />
          <ContentLoader
            style={{
              width: "80%",
              padding: 5,
              borderRadius: 2,
              backgroundColor: COLORS.gray,
              marginBottom: 3,
            }}
          />

          <ContentLoader
            style={{
              width: "40%",
              padding: 5,
              borderRadius: 2,
              backgroundColor: COLORS.gray,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 3,
          }}
        >
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <ContentLoader
                key={i}
                style={{
                  width: 30,
                  height: 15,
                  borderRadius: 10,
                  backgroundColor: COLORS.gray,
                  marginRight: 10,
                }}
              />
            ))}
        </View>
      </View>
    );
  }
}

export default CommentSkeleton;
