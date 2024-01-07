import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Divider from "../../../components/Divider/Divider";
import Ripple from "../../../components/Ripple/Ripple";
import {
  logo,
  APP_NAME,
  COLORS,
  profile,
  KEYS,
  serverBaseHttpURL,
} from "../../../constants";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { styles } from "../../../styles";
import { AuthNavProps } from "../../../params";
import CustomTextInput from "../../../components/CustomTextInput/CustomTextInput";
import { trpc } from "../../../utils/trpc";
import { generateRNFile, store } from "../../../utils";
import { Ionicons } from "@expo/vector-icons";
import PictureSelectionModal from "../../../components/Modal/PictureSelectionModal";
import * as ImagePicker from "expo-image-picker";
import { useImagePickerPermission } from "../../../hooks";
import { ReactNativeFile } from "apollo-upload-client";
import { useMutation } from "react-query";

const SetProfile: React.FunctionComponent<AuthNavProps<"SetProfile">> = ({
  navigation,
  route,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((state) => !state);
  const [state, setState] = React.useState<{
    error: string;
    image: ImagePicker.ImagePickerAsset | null;
    name: string;
  }>({
    error: "",
    image: null,
    name: "",
  });
  const { camera, gallery } = useImagePickerPermission();
  const takeImage = async () => {
    if (camera) {
      const images = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });
      if (images.canceled) {
        toggle();
        return;
      }

      setState((state) => ({ ...state, image: images.assets[0] }));
      toggle();
    }
  };
  const selectImage = async () => {
    if (gallery) {
      const images = await ImagePicker.launchImageLibraryAsync({
        aspect: [1, 1],
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
      });
      if (images.canceled) {
        toggle();
        return;
      }
      setState((state) => ({ ...state, image: images.assets[0] }));
      toggle();
    }
  };
  const { mutateAsync, isLoading } =
    trpc.register.createUserOrFail.useMutation();

  const { isLoading: uploading, mutateAsync: mutateUploadPicture } =
    useMutation({
      mutationKey: ["upload"],
      mutationFn: async (variables: { image: ReactNativeFile | null }) => {
        const formData = new FormData();
        formData.append("image", variables.image as any);
        const res = await fetch(`${serverBaseHttpURL}/api/upload/images`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        return data as {
          success: boolean;
          image?: string;
        };
      },
    });
  const saveProfile = async () => {
    if (state.image) {
      mutateUploadPicture(
        {
          image: generateRNFile({
            name: state.image.fileName || "image.jpg",
            uri: state.image.uri,
          }),
        },
        {
          onSuccess: (data, variables, context) => {
            if (data.success && !!data.image) {
              mutateAsync({
                country: route.params.country,
                user: {
                  image: data.image,
                  name: state.name,
                  phoneNumber: route.params.user.phoneNumber,
                  pin: route.params.user.pin,
                },
              }).then(async (res) => {
                if (!!res.error) {
                  setState((state) => ({ ...state, error: res.error }));
                } else {
                  setState((state) => ({
                    ...state,
                    error: "",
                    pin: "",
                    phoneNumber: "",
                  }));
                  await store(KEYS.TOKEN_KEY, res.jwt!).then(() => {
                    navigation.replace("Landing");
                  });
                }
              });
            } else {
              setState((state) => ({
                ...state,
                error: "Failed to upload the profile avatar to the server.",
              }));
            }
          },
        }
      );
    } else {
      mutateAsync({
        country: route.params.country,
        user: {
          image: null,
          name: state.name,
          phoneNumber: route.params.user.phoneNumber,
          pin: route.params.user.pin,
        },
      }).then(async (res) => {
        if (!!res.error) {
          setState((state) => ({ ...state, error: res.error }));
        } else {
          setState((state) => ({
            ...state,
            error: "",
            pin: "",
            phoneNumber: "",
          }));
          await store(KEYS.TOKEN_KEY, res.jwt!).then(() => {
            navigation.replace("Landing");
          });
        }
      });
    }
  };
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <LinearGradientProvider>
          <PictureSelectionModal open={open} toggle={toggle}>
            <View
              style={{
                backgroundColor: COLORS.main,
                padding: 10,
                maxWidth: 400,
                width: "100%",
                position: "absolute",
                borderRadius: 10,
                alignItems: "center",
                paddingTop: 20,
                bottom: 25,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  backgroundColor: COLORS.white,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 999,
                }}
              >
                <Text style={[styles.h1]}>You want an avatar?</Text>
              </View>

              <View
                style={{
                  marginVertical: 20,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={selectImage}
                  style={{
                    backgroundColor: COLORS.tertiary,
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 30,
                  }}
                >
                  <Ionicons
                    name="images-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={takeImage}
                  style={{
                    backgroundColor: COLORS.secondary,
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 30,
                  }}
                >
                  <Ionicons name="camera" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setState((state) => ({ ...state, image: null }));
                    toggle();
                  }}
                  style={{
                    backgroundColor: COLORS.red,
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 30,
                  }}
                >
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggle}
                style={[
                  styles.button,
                  {
                    backgroundColor: COLORS.red,
                    borderRadius: 5,
                    padding: 10,
                    width: "100%",
                    minWidth: "100%",
                  },
                ]}
              >
                <Text style={[styles.button__text, { color: COLORS.white }]}>
                  close
                </Text>
              </TouchableOpacity>
            </View>
          </PictureSelectionModal>
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
              flex: 0.6,
              width: "100%",
              maxWidth: 500,
              padding: 10,
              alignSelf: "center",
            }}
          >
            <Text
              style={[
                styles.h1,
                {
                  fontSize: 20,
                },
              ]}
            >
              Your Profile
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
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
                <Image
                  source={{
                    uri: !!state.image
                      ? state.image.uri
                      : Image.resolveAssetSource(profile).uri,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    marginBottom: 10,
                    resizeMode: "contain",
                    borderRadius: 100,
                  }}
                />
              </View>

              <View
                style={{
                  paddingLeft: 5,
                  flex: 1,
                  justifyContent: "flex-start",
                }}
              >
                <CustomTextInput
                  text={state.name}
                  onChangeText={(text) =>
                    setState((state) => ({ ...state, name: text }))
                  }
                  placeholder="Name"
                />
                <Text style={[styles.p]}>
                  Note that this profile will be public to your contacts.
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.p,
                {
                  color: COLORS.red,
                  marginTop: 5,
                },
              ]}
            >
              {state.error}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={saveProfile}
              disabled={isLoading || uploading}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.primary,
                  padding: 10,
                  borderRadius: 5,
                  alignSelf: "flex-end",
                  marginTop: 10,
                  marginBottom: 20,
                  maxWidth: 200,
                },
              ]}
            >
              <Text
                style={[
                  styles.button__text,
                  {
                    marginRight: isLoading || uploading ? 10 : 0,
                  },
                ]}
              >
                SAVE
              </Text>
              {isLoading || uploading ? (
                <Ripple color={COLORS.tertiary} size={5} />
              ) : null}
            </TouchableOpacity>
            <Divider color={COLORS.black} title="Already registered?" />
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isLoading || uploading}
              onPress={() => {
                navigation.navigate("PhoneNumber");
              }}
              style={[
                styles.button,
                {
                  backgroundColor: COLORS.secondary,
                  padding: 10,
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  marginTop: 10,
                  maxWidth: 200,
                },
              ]}
            >
              <Text style={[styles.button__text]}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </LinearGradientProvider>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SetProfile;
