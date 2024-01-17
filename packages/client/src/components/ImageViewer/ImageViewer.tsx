import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { UserType } from "@thoughts/api/src/types";
import { COLORS, profile, serverBaseHttpURL } from "../../constants";
import ContentLoader from "../ContentLoader/ContentLoader";
import Circular from "../Circular/Circular";
import { styles } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  user: UserType | undefined | null;
  isMe: boolean;
  isBlocked: boolean;
}
const ImageViewer: React.FunctionComponent<Props> = ({
  user,
  isMe,
  isBlocked,
}) => {
  const [state, setState] = React.useState({ loaded: true });

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: COLORS.black,
        alignSelf: "center",
        width: "100%",
        maxWidth: 500,
        borderRadius: 5,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          paddingVertical: 20,
          marginHorizontal: 10,
        }}
      >
        <Text style={[styles.h1, { color: COLORS.main, fontSize: 18 }]}>
          {isMe ? "You" : user?.name}
        </Text>

        <TouchableOpacity
          style={{
            marginHorizontal: 20,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-down-circle" size={30} color={COLORS.main} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {!state.loaded ? (
          <ContentLoader
            style={{
              width: "100%",
              height: "80%",
              borderRadius: 5,
              backgroundColor: COLORS.gray,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Circular
              size={30}
              trackColor={COLORS.primary}
              color={COLORS.tertiary}
            />
          </ContentLoader>
        ) : null}
        <Image
          onError={(error) => {
            setState((state) => ({ ...state, loaded: true }));
          }}
          onLoadEnd={() => {
            setState((state) => ({ ...state, loaded: true }));
          }}
          onLoadStart={() => {
            setState((state) => ({ ...state, loaded: false }));
          }}
          onLoad={() => {
            setState((state) => ({ ...state, loaded: true }));
          }}
          source={{
            uri: isBlocked
              ? Image.resolveAssetSource(profile).uri
              : user?.avatar
              ? serverBaseHttpURL.concat(user.avatar)
              : Image.resolveAssetSource(profile).uri,
          }}
          style={{
            width: "100%",
            height: "80%",
            marginBottom: 10,
            resizeMode: "cover",
            borderRadius: 5,
            display: state.loaded ? "flex" : "none",
          }}
        />
      </View>
    </View>
  );
};

export default ImageViewer;
