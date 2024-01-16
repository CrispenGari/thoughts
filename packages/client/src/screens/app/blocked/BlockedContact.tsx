import { View, Text, ScrollView, RefreshControl } from "react-native";
import React from "react";
import { AppNavProps } from "../../../params";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { trpc } from "../../../utils/trpc";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import { COLORS, FONTS } from "../../../constants";
import { usePlatform } from "../../../hooks";
import BlockedContactComponent from "../../../components/BlockedContact/BlockedContact";
import { styles } from "../../../styles";
import { useSubscriptionsStore } from "../../../store";

const BlockedContact: React.FunctionComponent<
  AppNavProps<"BlockedContact">
> = ({ navigation }) => {
  const { os } = usePlatform();
  const { block: blockedId, setBlock } = useSubscriptionsStore();
  const {
    isFetching: fetching,
    data: blocked,
    refetch: refetchBlocked,
  } = trpc.blocked.all.useQuery();

  React.useEffect(() => {
    if (!!blockedId) {
      refetchBlocked().then((res) => {
        if (!!res.data) {
          setBlock(null);
        }
      });
    }
  }, [blockedId, setBlock]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Blocked Contacts",
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
          label={os === "ios" ? "Settings" : ""}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <LinearGradientProvider>
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          width: "100%",
          maxWidth: 500,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              shouldRasterizeIOS={true}
              refreshing={fetching}
              onRefresh={async () => {
                await refetchBlocked();
              }}
            />
          }
        >
          <Text
            style={[styles.h1, { paddingVertical: 20, textAlign: "center" }]}
          >
            {!!!blocked?.count
              ? "No blocked contacts."
              : `${blocked?.count} contact(s) blocked.`}
          </Text>
          {blocked?.blocked?.map((blocked) => (
            <BlockedContactComponent key={blocked.id} blocked={blocked} />
          ))}
        </ScrollView>
      </View>
    </LinearGradientProvider>
  );
};

export default BlockedContact;
