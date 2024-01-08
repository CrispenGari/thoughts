import { Animated, View } from "react-native";
import React from "react";

interface Props {
  size: number;
  color: string;
  trackColor: string;
}

const Circular: React.FunctionComponent<Props> = ({
  size,
  color,
  trackColor,
}) => {
  const indicatorAnimation = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(indicatorAnimation, {
        toValue: 1,
        delay: 0,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
  }, []);
  const rotate = indicatorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View
      style={[
        {
          borderWidth: 3,
          borderLeftColor: trackColor,
          borderRightColor: trackColor,
          borderBottomColor: trackColor,
          width: size,
          height: size,
          transform: [{ rotate }],
          borderRadius: size,
        },
        { borderTopColor: color },
      ]}
    />
  );
};

export default Circular;
