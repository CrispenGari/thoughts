import React from "react";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import * as Notifications from "expo-notifications";
import MyThought from "../../../components/MyThought/MyThought";
import Contacts from "../../../components/Contacts/Contacts";
import { AppNavProps } from "../../../params";
import AppHeader from "../../../components/AppHeader/AppHeader";
import { TNotificationData } from "../../../types";

const Home: React.FunctionComponent<AppNavProps<"Home">> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => <AppHeader {...props} navigation={navigation} />,
    });
  }, [navigation]);

  React.useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (_notification) => {}
    );
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        ({
          notification: {
            request: {
              content: { data },
            },
          },
        }) => {
          const d = data as TNotificationData;
          if (d.to === "Profile") {
            navigation.navigate(d.to, {
              from: d.from,
              userId: d.userId,
              isMe: false,
            });
          }
          if (d.to === "Thought") {
            navigation.navigate(d.to, {
              from: d.from,
              id: d.thoughtId!,
              notificationId: d.notificationId!,
              read: d.read!,
              type: d.type!,
              userId: d.userId,
            });
          }

          // navigation.navigate("Thought", {
          //   from: response.notification.request.content.data.from,
          //   userId: response.notification.request.content.data.userId,
          //   isMe: false,
          // });
        }
      );
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  return (
    <LinearGradientProvider>
      <MyThought />
      <Contacts navigation={navigation} />
    </LinearGradientProvider>
  );
};

export default Home;
