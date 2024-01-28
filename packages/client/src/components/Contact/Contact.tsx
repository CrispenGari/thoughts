import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  COLORS,
  profile,
  relativeTimeObject,
  serverBaseHttpURL,
} from "../../constants";
import { styles } from "../../styles";
import Ripple from "../Ripple/Ripple";
import { trpc } from "../../utils/trpc";
import ThoughtComponent from "../ThoughtComponent/ThoughtComponent";
import { useMeStore, useSubscriptionsStore } from "../../store";
import ContentLoader from "../ContentLoader/ContentLoader";
import Modal from "../Modal/Modal";
import ImageViewer from "../ImageViewer/ImageViewer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import ContactSkeleton from "./ContactSkeleton";
import { UserType } from "@thoughts/api/src/types";
import { useContactName } from "../../hooks";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Contact: React.FunctionComponent<{
  contact: {
    phoneNumber: string;
    id: number;
  };
  onPress: () => void;
}> = ({ contact, onPress }) => {
  const { user, setUser } = useSubscriptionsStore();
  const {
    data,
    refetch: refetchUser,
    isLoading,
  } = trpc.user.contact.useQuery({
    id: contact.id,
  });
  React.useEffect(() => {
    if (!!data?.user?.id && !!user) {
      if (data.user.id === user) {
        refetchUser().then((res) => {
          if (!!res.data?.user) {
            setUser(null);
          }
        });
      }
    }
  }, [user, data, setUser]);

  if (isLoading) return <ContactSkeleton last={false} />;
  if (!!!data?.user) return <ContactSkeleton last={false} />;
  return (
    <UserContact
      onPress={onPress}
      blocked={data.blocked}
      user={data.user}
      triggerRefetch={async () => {
        await refetchUser();
      }}
    />
  );
};
export default React.memo(Contact);

interface UserProps {
  onPress: () => void;
  user: UserType;
  blocked: boolean;
  triggerRefetch: () => Promise<void>;
}

const UserContact: React.FunctionComponent<UserProps> = ({
  user,
  onPress,
  blocked,
  triggerRefetch,
}) => {
  const [openImageViewer, setOpenImageViewer] = React.useState(false);
  const toggleImageViewer = () => setOpenImageViewer((state) => !state);
  const [loaded, setLoaded] = React.useState(true);
  const { me } = useMeStore();
  const { contactName } = useContactName({ user });

  trpc.blocked.onBlocker.useSubscription(
    {
      userId: user.id!,
    },
    {
      onData: async (_data) => {
        await triggerRefetch();
      },
    }
  );
  trpc.setting.onUserSettingsUpdate.useSubscription(
    {
      userId: user.id!,
    },
    {
      onData: async (_data) => {
        await triggerRefetch();
      },
    }
  );

  trpc.user.onUserDeleteAccount.useSubscription(
    { userId: user.id! },
    {
      onData: async (_data) => {
        await triggerRefetch();
      },
    }
  );

  trpc.user.onUserProfileUpdate.useSubscription(
    {
      userId: user.id!,
    },
    {
      onData: async (_data) => {
        await triggerRefetch();
      },
    }
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: 120,
        alignItems: "center",
        marginLeft: 5,
        height: 130,
        justifyContent: "center",
        backgroundColor: COLORS.main,
        padding: 10,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: COLORS.secondary,
        shadowOpacity: 0.7,
      }}
    >
      <Modal
        open={openImageViewer}
        toggle={toggleImageViewer}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageViewer user={user} isMe={true} isBlocked={blocked} />
      </Modal>
      {blocked ? null : <ThoughtComponent userId={user.id!} />}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <View style={{ position: "relative", marginTop: 30 }}>
          {me?.setting?.activeStatus && user?.setting?.activeStatus ? (
            <>
              {user.online ? (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 1,
                    display: blocked ? "none" : "flex",
                  }}
                >
                  <Ripple color={COLORS.tertiary} size={5} />
                </View>
              ) : (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -30,
                    zIndex: 1,
                    backgroundColor: COLORS.white,
                    width: 40,
                    alignItems: "center",
                    borderRadius: 999,
                    display: blocked ? "none" : "flex",
                  }}
                >
                  <Text
                    style={[
                      styles.p,
                      {
                        color: COLORS.red,
                        fontSize: 14,
                      },
                    ]}
                  >
                    {dayjs(user.updatedAt).fromNow()}
                  </Text>
                </View>
              )}
            </>
          ) : null}
          {!loaded ? (
            <ContentLoader
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginBottom: 3,
                backgroundColor: COLORS.gray,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ) : null}

          <TouchableOpacity
            style={{
              display: loaded ? "flex" : "none",
            }}
            activeOpacity={0.7}
            onPress={toggleImageViewer}
          >
            <Image
              onError={(_error) => {
                setLoaded(true);
              }}
              onLoadEnd={() => {
                setLoaded(true);
              }}
              onLoadStart={() => {
                setLoaded(false);
              }}
              onLoad={() => {
                setLoaded(true);
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginBottom: 3,
              }}
              source={{
                uri: blocked
                  ? Image.resolveAssetSource(profile).uri
                  : !!user.avatar
                  ? serverBaseHttpURL.concat(user.avatar)
                  : Image.resolveAssetSource(profile).uri,
              }}
            />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} style={[styles.h1]}>
          {contactName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
