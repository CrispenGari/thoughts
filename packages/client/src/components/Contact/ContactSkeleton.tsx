import { View } from "react-native";
import React, { Component } from "react";
import ContentLoader from "../ContentLoader/ContentLoader";
import { COLORS } from "../../constants";
import ThoughtComponentSkeleton from "../ThoughtComponent/ThoughtComponentSkeleton";

export class ContactSkeleton extends Component<{ last: boolean }, {}> {
  render() {
    const { last } = this.props;
    const width = 120;
    return (
      <ContentLoader
        style={{
          alignItems: "center",
          marginLeft: 5,
          height: 130,
          justifyContent: "center",
          backgroundColor: COLORS.gray,
          padding: 10,
          borderRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          shadowColor: COLORS.secondary,
          shadowOpacity: 0.7,
          width: last ? width * 2 : width,
        }}
      >
        {last ? null : <ThoughtComponentSkeleton />}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {last ? null : (
            <ContentLoader
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginBottom: 5,
                backgroundColor: COLORS.main,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            />
          )}
          {last ? null : (
            <ContentLoader
              style={{
                backgroundColor: COLORS.main,
                borderRadius: 3,
                padding: 5,
                width: 80,
              }}
            />
          )}
        </View>
      </ContentLoader>
    );
  }
}

export default ContactSkeleton;
