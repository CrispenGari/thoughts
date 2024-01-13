import { View, Animated, type StyleProp, type ViewStyle } from "react-native";
import React from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
interface Props {
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  outputRange?: number[];
  children?: React.ReactNode;
}
const ContentLoader: React.FunctionComponent<Props> = ({
  style,
  duration,
  delay,
  outputRange,
  children,
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();
  const skeletonAnimation = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(skeletonAnimation, {
        toValue: 1,
        delay: delay ? delay : 0,
        duration: duration ? duration : 2000,
        useNativeDriver: false,
      })
    ).start();
  }, [duration]);
  const translateX = skeletonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: outputRange ? outputRange : [-200, 200],
  });

  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <Animated.View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          width: "20%",
          height,
          transform: [{ rotate: "10deg" }, { translateX }],
          position: "absolute",
        }}
      />
      {children}
    </View>
  );
};

export default ContentLoader;
