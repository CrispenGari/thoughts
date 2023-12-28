import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { BottomSheet } from "react-native-btr";
import { logo, APP_NAME, COLORS, FONTS } from "../../../constants";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import { AuthNavProps } from "../../../params";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Register: React.FunctionComponent<AuthNavProps<"Register">> = ({
  navigation,
}) => {
  const [state, setState] = React.useState({
    error: "",
    pin: "",
    name: "",
  });

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <LinearGradientProvider>
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: Image.resolveAssetSource(logo).uri,
            }}
            style={{
              width: 100,
              height: 100,
              marginBottom: 10,
              resizeMode: "contain",
              marginTop: 30,
            }}
          />
          <Text
            style={[
              styles.p,
              {
                textAlign: "center",
                height: 100,
              },
            ]}
          >
            Welcome to {APP_NAME}.
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: 500,
            padding: 10,
            alignSelf: "center",
          }}
        ></View>
      </LinearGradientProvider>
    </KeyboardAwareScrollView>
  );
};

export default Register;
