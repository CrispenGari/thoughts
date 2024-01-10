import { View, Text } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { COLORS, FONTS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import { trpc } from "../../../utils/trpc";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";

const Thought: React.FunctionComponent<AppNavProps<"Thought">> = ({
  navigation,
  route: { params },
}) => {
  const { mutateAsync: read, isLoading } = trpc.notification.read.useMutation();

  const { os } = usePlatform();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Thought",
      headerShown: true,
      headerStyle: {
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 0.5,
        backgroundColor: COLORS.tertiary,
        height: 100,
      },
      headerTitleStyle: {
        fontFamily: FONTS.regularBold,
        color: COLORS.main,
      },
      headerLeft: () => (
        <AppStackBackButton
          label={os === "ios" ? "Notifications" : ""}
          onPress={() => {
            if (!isLoading) {
              navigation.goBack();
            }
          }}
        />
      ),
    });
  }, [navigation, isLoading]);

  React.useEffect(() => {
    if (params.notificationId && !params.read) {
      read({ id: params.notificationId });
    }
  }, [params]);
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <LinearGradientProvider>
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 500,
              padding: 10,
              alignSelf: "center",
            }}
          ></View>
        </LinearGradientProvider>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Thought;
