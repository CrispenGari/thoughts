import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import ContentLoader from "../ContentLoader/ContentLoader";
import {
  COLORS,
  FONTS,
  genders,
  profile,
  serverBaseHttpURL,
} from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Circular from "../Circular/Circular";
import { styles } from "../../styles";
import { UserType } from "@thoughts/api/src/types";
import DropdownSelect from "react-native-input-select";
import { useContactName } from "../../hooks";
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
      gender: "MALE" | "FEMALE" | "TRANS-GENDER";
      bio: string;
    }>
  >;
  state: {
    error: string;
    image: ImagePicker.ImagePickerAsset | null;
    name: string;
    imageUrl: string;
    loaded: boolean;
    gender: "MALE" | "FEMALE" | "TRANS-GENDER";
    bio: string;
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
  const changeGender = (gender: "MALE" | "FEMALE" | "TRANS-GENDER") => {
    setState((state) => ({ ...state, gender }));
  };
  const { contactName } = useContactName({ user });
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
                onError={(_error) => {
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
                          : !!state.imageUrl.length
                          ? serverBaseHttpURL.concat(state.imageUrl)
                          : Image.resolveAssetSource(profile).uri,
                      }
                    : {
                        uri: isBlocked
                          ? Image.resolveAssetSource(profile).uri
                          : !!user?.avatar
                          ? serverBaseHttpURL.concat(user.avatar)
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
            <>
              <TextInput
                style={{
                  padding: 10,
                  backgroundColor: COLORS.white,
                  width: "100%",
                  borderRadius: 5,
                  fontFamily: FONTS.regular,
                  fontSize: 16,
                  paddingTop: 10,
                  marginBottom: 3,
                }}
                value={state.name}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, name: text }))
                }
                placeholder="Name"
              />
              <TextInput
                multiline
                maxLength={200}
                style={{
                  padding: 10,
                  backgroundColor: COLORS.white,
                  width: "100%",
                  marginBottom: 5,
                  borderRadius: 5,
                  fontFamily: FONTS.regular,
                  fontSize: 16,
                  paddingTop: 10,

                  height: 50,
                }}
                selectionColor={COLORS.black}
                value={state.bio}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, bio: text }))
                }
                placeholder={`Type biography...`}
              />
              <DropdownSelect
                placeholder="Change Theme."
                options={genders}
                optionLabel={"name"}
                optionValue={"value"}
                selectedValue={state.gender}
                isMultiple={false}
                dropdownContainerStyle={{
                  maxWidth: 500,
                }}
                dropdownIconStyle={{ top: 15, right: 15 }}
                dropdownStyle={{
                  borderWidth: 0.5,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  minHeight: 45,
                  maxWidth: 500,
                  backgroundColor: COLORS.main,
                  borderColor: COLORS.primary,
                  minWidth: "100%",
                }}
                selectedItemStyle={{
                  color: COLORS.black,
                  fontFamily: FONTS.regular,
                  fontSize: 16,
                }}
                placeholderStyle={{
                  fontFamily: FONTS.regular,
                  fontSize: 16,
                }}
                onValueChange={changeGender}
                labelStyle={{ fontFamily: FONTS.regularBold, fontSize: 20 }}
                primaryColor={COLORS.primary}
                dropdownHelperTextStyle={{
                  color: COLORS.black,
                  fontFamily: FONTS.regular,
                  fontSize: 15,
                }}
                modalOptionsContainerStyle={{
                  padding: 10,
                  backgroundColor: COLORS.main,
                }}
                checkboxComponentStyles={{
                  checkboxSize: 10,
                  checkboxStyle: {
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                    padding: 5,
                    borderColor: COLORS.tertiary,
                  },
                  checkboxLabelStyle: {
                    color: COLORS.black,
                    fontSize: 18,
                    fontFamily: FONTS.regular,
                  },
                }}
              />
            </>
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
                <Text style={[styles.h1, { fontSize: 18 }]}>{contactName}</Text>
              )}
            </>
          )}
          <Text style={[styles.p, { marginTop: isMe ? -20 : 5 }]}>
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
