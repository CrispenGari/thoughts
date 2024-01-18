import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { LogBox, View, StatusBar } from "react-native";
import TRPCProvider from "./src/providers/TRPCProvider";
import { useFonts } from "expo-font";
import Routes from "./src/routes/Routes";
import { Fonts } from "./src/constants";
import * as Notifications from "expo-notifications";
import Loading from "./src/components/Loading/Loading";
import LinearGradientProvider from "./src/providers/LinearGradientProvider";
import ReactQueryProvider from "./src/providers/ReactQueryProvider";
import StripeProvider from "./src/providers/StripeProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

LogBox.ignoreLogs;
LogBox.ignoreAllLogs();

const App = () => {
  const [loaded] = useFonts(Fonts);
  if (!loaded)
    return (
      <LinearGradientProvider>
        <Loading />
      </LinearGradientProvider>
    );
  return (
    <TRPCProvider>
      <StripeProvider>
        <LinearGradientProvider>
          <StatusBar barStyle={"light-content"} />
          <ReactQueryProvider>
            <Routes />
          </ReactQueryProvider>
        </LinearGradientProvider>
      </StripeProvider>
    </TRPCProvider>
  );
};

registerRootComponent(App);
