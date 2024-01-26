import { View } from "react-native";
import React, { Component } from "react";
import { COLORS } from "../../constants";
import ContentLoader from "../ContentLoader/ContentLoader";

export class NotificationSkeleton extends Component<{ read: boolean }, {}> {
  render() {
    const { read } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingHorizontal: 10,
          backgroundColor: read ? COLORS.secondary : COLORS.white,
          paddingRight: 20,
          marginBottom: 2,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ContentLoader
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 2,
                width: "50%",
                padding: 7,
                marginTop: 3,
                overflow: "hidden",
              }}
            />
            <ContentLoader
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 2,
                width: 50,
                padding: 7,
                marginTop: 3,
                overflow: "hidden",
              }}
            />
          </View>
          <ContentLoader
            style={{
              backgroundColor: COLORS.gray,
              borderRadius: 2,
              width: "80%",
              padding: 3,
              marginTop: 3,
              overflow: "hidden",
            }}
          />
        </View>
      </View>
    );
  }
}

export default NotificationSkeleton;
