import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import ContentLoader from "../ContentLoader/ContentLoader";
import { COLORS, profile, serverBaseHttpURL } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Circular from "../Circular/Circular";
import { styles } from "../../styles";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { UserType } from "@thoughts/api/src/types";
interface Props {
  user: undefined | null | UserType;

  gettingUser: boolean;
  toggle: () => void;
  isMe: boolean;
  setState: React.Dispatch<
    React.SetStateAction<{
      error: string;
      image: ImagePicker.ImagePickerAsset | null;
      name: string;
      imageUrl: string;
      loaded: boolean;
    }>
  >;
  state: {
    error: string;
    image: ImagePicker.ImagePickerAsset | null;
    name: string;
    imageUrl: string;
    loaded: boolean;
  };
  openProfile: () => void;
  isBlocked: boolean;
}
const UserProfile: React.FunctionComponent<Props> = ({
  gettingUser,
  toggle,
  openProfile,
  isMe,
  setState,
  state,
  user,
  isBlocked,
}) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 10,
        }}
      >
        {!state.loaded || gettingUser ? (
          <ContentLoader
            style={{
              width: 130,
              height: 130,
              marginBottom: 10,
              borderRadius: 130,
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
        {!gettingUser ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: state.loaded ? "flex" : "none",
            }}
          >
            {isMe ? (
              <TouchableOpacity
                onPress={toggle}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(23, 107, 135, .6)",
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 1,
                }}
              >
                <Ionicons name="image" size={24} color={COLORS.white} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity activeOpacity={0.7} onPress={openProfile}>
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
                source={
                  isMe
                    ? {
                        uri: !!state.image
                          ? state.image.uri
                          : !!state.imageUrl
                          ? serverBaseHttpURL.concat(state.imageUrl)
                          : Image.resolveAssetSource(profile).uri,
                      }
                    : {
                        uri: isBlocked
                          ? Image.resolveAssetSource(profile).uri
                          : !!user
                          ? serverBaseHttpURL.concat(user?.avatar || "")
                          : Image.resolveAssetSource(profile).uri,
                      }
                }
                style={{
                  width: 130,
                  height: 130,
                  marginBottom: 10,
                  resizeMode: "contain",
                  borderRadius: 130,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <View
          style={{
            paddingLeft: 5,
            flex: 1,
            justifyContent: "flex-start",
          }}
        >
          {isMe ? (
            <CustomTextInput
              text={state.name}
              onChangeText={(text) =>
                setState((state) => ({ ...state, name: text }))
              }
              placeholder="Name"
            />
          ) : (
            <>
              {gettingUser ? (
                <ContentLoader
                  style={{
                    backgroundColor: COLORS.gray,
                    borderRadius: 2,
                    width: 100,
                    padding: 10,
                    marginTop: 3,
                    overflow: "hidden",
                  }}
                />
              ) : (
                <Text style={[styles.h1, { fontSize: 18 }]}>{user?.name}</Text>
              )}
            </>
          )}
          <Text style={[styles.p]}>
            {isMe
              ? "Note that this profile will be public to your contacts."
              : "This name is public to all of this user's contacts"}
          </Text>
        </View>
      </View>
    </>
  );
};

export default UserProfile;
