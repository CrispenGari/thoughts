import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { LogBox, View, StatusBar } from "react-native";
import TRPCProvider from "./src/providers/TRPCProvider";
import { useFonts } from "expo-font";
import Routes from "./src/routes/Routes";
import { COLORS, Fonts } from "./src/constants";
import * as Notifications from "expo-notifications";
import Loading from "./src/components/Loading/Loading";
import { LinearGradient } from "expo-linear-gradient";

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
  return (
    <TRPCProvider>
      <LinearGradient
        colors={[COLORS.main, COLORS.primary]}
        style={{
          flex: 1,
        }}
        start={{
          x: 0,
          y: 1,
        }}
        end={{
          x: 0,
          y: 0,
        }}
      >
        {!loaded ? (
          <Loading />
        ) : (
          <>
            <StatusBar barStyle={"light-content"} />
            <Routes />
          </>
        )}
      </LinearGradient>
    </TRPCProvider>
  );
};

registerRootComponent(App);
