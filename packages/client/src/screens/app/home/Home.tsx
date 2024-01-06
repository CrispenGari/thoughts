import React from "react";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";

import MyThought from "../../../components/MyThought/MyThought";
import Contacts from "../../../components/Contacts/Contacts";
import { AppNavProps } from "../../../params";
import AppHeader from "../../../components/AppHeader/AppHeader";

const Home = ({ navigation }: AppNavProps<"Home">) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => <AppHeader {...props} navigation={navigation} />,
    });
  }, [navigation]);
  return (
    <LinearGradientProvider>
      <MyThought />
      <Contacts />
    </LinearGradientProvider>
  );
};

export default Home;
