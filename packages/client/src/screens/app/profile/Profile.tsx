import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import LinearGradientProvider from "../../../providers/LinearGradientProvider";
import { AppNavProps } from "../../../params";
import { useImagePickerPermission, usePlatform } from "../../../hooks";
import {
  APP_NAME,
  COLORS,
  FONTS,
  KEYS,
  serverBaseHttpURL,
} from "../../../constants";
import AppStackBackButton from "../../../components/AppStackBackButton/AppStackBackButton";
import Divider from "../../../components/Divider/Divider";
import Ripple from "../../../components/Ripple/Ripple";
import { styles } from "../../../styles";
import { trpc } from "../../../utils/trpc";
import { useMutation } from "react-query";
import { ReactNativeFile } from "apollo-upload-client";
import * as ImagePicker from "expo-image-picker";
import { del, generateRNFile } from "../../../utils";
import PictureSelectionModal from "../../../components/Modal/PictureSelectionModal";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMeStore } from "../../../store";

import PublicDetails from "../../../components/ProfileComponents/PublicDetails";
import UserProfile from "../../../components/ProfileComponents/UserProfile";
import Modal from "../../../components/Modal/Modal";
import ImageViewer from "../../../components/ImageViewer/ImageViewer";
import UserCurrentThought from "../../../components/UserCurrentThought/UserCurrentThought";

const Profile: React.FunctionComponent<AppNavProps<"Profile">> = ({
  navigation,
  route,
}) => {
  const { me, setMe } = useMeStore();
  const { mutateAsync: mutateLogout, isLoading: loggingOut } =
    trpc.logout.logout.useMutation();
  const { data: user, isFetching: gettingUser } = trpc.user.get.useQuery({
    id: route.params.userId,
  });
  const { os } = usePlatform();
  const [open, setOpen] = React.useState(false);
  const [openImageViewer, setOpenImageViewer] = React.useState(false);
  const toggle = () => setOpen((state) => !state);
  const toggleImageViewer = () => setOpenImageViewer((state) => !state);
  const [state, setState] = React.useState<{
    error: string;
    image: ImagePicker.ImagePickerAsset | null;
    name: string;
    imageUrl: string;
    loaded: boolean;
  }>({
    error: "",
    image: null,
    name: "",
    imageUrl: "",
    loaded: true,
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
  const { mutateAsync, isLoading } = trpc.user.updateProfile.useMutation();

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

  const logout = () => {
    mutateLogout().then(async (res) => {
      if (res) {
        await del(KEYS.TOKEN_KEY);
        setMe(null);
      }
    });
  };
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
                name: state.name,
                image: data.image,
              }).then(async (res) => {
                if (!!res.error) {
                  setState((state) => ({ ...state, error: res.error }));
                } else {
                  setState((state) => ({
                    ...state,
                    error: "",
                    image: null,
                  }));
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
        image: state.imageUrl ? state.imageUrl : null,
        name: state.name,
      }).then(async (res) => {
        if (!!res.error) {
          setState((state) => ({ ...state, error: res.error }));
        } else {
          setState((state) => ({
            ...state,
            error: "",
            image: null,
            imageUrl: "",
          }));
        }
      });
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile",
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
          label={os === "ios" ? "Home" : ""}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    if (route.params.isMe && !!me) {
      setState((state) => ({
        ...state,
        imageUrl: me.avatar || "",
        name: me.name,
      }));
    }
  }, [me, route]);

  React.useEffect(() => {
    if (!!state.error) {
      Alert.alert(APP_NAME, state.error);
    }
  }, [state]);
  return (
    <LinearGradientProvider>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              width: "100%",
              maxWidth: 500,
            }}
          >
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
                      setState((state) => ({
                        ...state,
                        image: null,
                        imageUrl: "",
                      }));
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

            <Modal
              open={openImageViewer}
              toggle={toggleImageViewer}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageViewer user={user} isMe={route.params.isMe} />
            </Modal>
            <View
              style={{
                flex: 1,
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
                {route.params.isMe ? "Your Profile" : "User Profile"}
              </Text>

              <UserProfile
                user={user}
                isMe={route.params.isMe}
                state={state}
                setState={setState}
                gettingUser={gettingUser}
                toggle={toggle}
                openProfile={toggleImageViewer}
              />

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
              {route.params.isMe ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={saveProfile}
                  disabled={isLoading || uploading}
                  style={[
                    styles.button,
                    {
                      backgroundColor: COLORS.tertiary,
                      padding: 10,
                      borderRadius: 5,
                      alignSelf: "flex-start",
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
                        color: COLORS.white,
                      },
                    ]}
                  >
                    UPDATE
                  </Text>
                  {isLoading || uploading ? (
                    <Ripple color={COLORS.white} size={5} />
                  ) : null}
                </TouchableOpacity>
              ) : null}
              <Divider
                color={COLORS.tertiary}
                title={
                  route.params.isMe
                    ? "YOUR CURRENT THOUGHT"
                    : "USER'S CURRENT THOUGHT"
                }
              />
              <UserCurrentThought
                isMe={route.params.isMe}
                user={user}
                gettingUser={gettingUser}
              />
              <Divider color={COLORS.tertiary} title="PUBLIC DETAILS" />
              <PublicDetails user={user} gettingUser={gettingUser} />
              {route.params.isMe ? (
                <>
                  <Divider color={COLORS.tertiary} title="SIGN OUT" />
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor: COLORS.tertiary,
                        marginVertical: 10,
                        padding: 10,
                        borderRadius: 5,
                        maxWidth: 200,
                      },
                    ]}
                    disabled={loggingOut}
                    onPress={logout}
                  >
                    <Text
                      style={[
                        styles.button__text,
                        {
                          color: COLORS.white,
                          marginRight: loggingOut ? 10 : 0,
                        },
                      ]}
                    >
                      LOGOUT
                    </Text>
                    {loggingOut ? (
                      <Ripple size={5} color={COLORS.white} />
                    ) : null}
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradientProvider>
  );
};

export default Profile;
