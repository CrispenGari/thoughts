import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { CommentType, UserType } from "@thoughts/api/src/types";

import {
  COLORS,
  profile,
  relativeTimeObject,
  serverBaseHttpURL,
} from "../../constants";
import { styles } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import ContentLoader from "../ContentLoader/ContentLoader";
import { trpc } from "../../utils/trpc";
import { useMeStore } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import { TextInput } from "react-native-gesture-handler";
import ReplySkeleton from "./ReplySkeleton";
import Modal from "../Modal/Modal";
import ReplyControls from "./ReplyControls";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface Props {
  reply: {
    id: number;
  };
  navigation: StackNavigationProp<AppParamList, "Thought">;
  setReplyTo: React.Dispatch<React.SetStateAction<UserType | undefined>>;
  inputRef: React.RefObject<TextInput>;
}

const Reply: React.FunctionComponent<Props> = ({
  reply,
  navigation,
  setReplyTo,
  inputRef,
}) => {
  const [loaded, setLoaded] = React.useState(true);
  const { me } = useMeStore();
  const {
    data: response,
    isFetching: fetchingResponse,
    refetch: refetchReply,
  } = trpc.reply.getReply.useQuery({
    id: reply.id!,
  });
  const [openControls, setOpenControls] = React.useState(false);
  const toggleOpenControls = () => setOpenControls((state) => !state);
  // subscriptions
  trpc.reply.onEdited.useSubscription(
    { replyId: reply.id! },
    {
      onData: async () => {
        await refetchReply();
      },
    }
  );
  if (fetchingResponse) return <ReplySkeleton />;

  return (
    <TouchableOpacity
      onPress={toggleOpenControls}
      activeOpacity={0.7}
      style={{ width: "90%", marginVertical: 10, alignSelf: "flex-end" }}
    >
      {!!response ? (
        <Modal open={openControls} toggle={toggleOpenControls}>
          <ReplyControls toggle={toggleOpenControls} reply={response} />
        </Modal>
      ) : null}
      <View
        style={{
          backgroundColor: COLORS.white,
          position: "relative",
          padding: 10,
          borderRadius: 5,
        }}
      >
        {!loaded ? (
          <ContentLoader
            style={{
              top: -10,
              right: 0,
              width: 20,
              height: 20,
              borderRadius: 20,
              zIndex: 1,
              backgroundColor: COLORS.gray,
              overflow: "hidden",
              position: "absolute",
            }}
          />
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("Profile", {
              isMe: me?.id === response?.userId,
              userId: response?.userId!,
              from: "Thought",
            })
          }
          style={{
            display: loaded ? "flex" : "none",
            zIndex: 1,
            position: "absolute",
            top: -10,
            right: 0,
          }}
        >
          <Image
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
            }}
            source={{
              uri: !!response?.user?.avatar
                ? serverBaseHttpURL.concat(response?.user?.avatar)
                : Image.resolveAssetSource(profile).uri,
            }}
            onError={(error) => {
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
          />
        </TouchableOpacity>

        <Text style={[styles.h1, {}]}>{response?.text}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {dayjs(response?.createdAt).fromNow()} ago
          </Text>
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {" • "}
          </Text>
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {response?.userId === me?.id ? "you" : response?.user.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <TouchableOpacity activeOpacity={0.7} style={{}}>
            <Ionicons name="heart" size={20} color={COLORS.tertiary} />
          </TouchableOpacity>
          <Text style={[styles.p, { marginLeft: 5, fontSize: 14 }]}>0</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <TouchableOpacity activeOpacity={0.7} style={{}}>
            <Ionicons name="heart-dislike" size={20} color={COLORS.tertiary} />
          </TouchableOpacity>
          <Text style={[styles.p, { marginLeft: 5, fontSize: 14 }]}>0</Text>
        </View>

        {response?.userId !== me?.id ? (
          <TouchableOpacity
            onPress={() => {
              setReplyTo(response?.user || undefined);
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            activeOpacity={0.7}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="arrow-undo" size={20} color={COLORS.tertiary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default Reply;
