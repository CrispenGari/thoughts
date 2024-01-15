import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import React from "react";
import { UserType } from "@thoughts/api/src/types";
import {
  COLORS,
  FONTS,
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
import Ripple from "../Ripple/Ripple";
import { trpc } from "../../utils/trpc";
import { useMeStore } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppParamList } from "../../params";
import Replies from "../Replies/Replies";
import Modal from "../Modal/Modal";
import CommentControls from "./CommentControls";
import CommentSkeleton from "./CommentSkeleton";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface Props {
  comment: {
    id: number;
  };
  navigation: StackNavigationProp<AppParamList, "Thought">;
}
const Comment: React.FunctionComponent<Props> = ({ comment, navigation }) => {
  const { me } = useMeStore();
  const {
    data: cmt,
    isFetching: fetchingComment,
    refetch: refetchComment,
  } = trpc.comment.getComment.useQuery({
    id: comment.id!,
  });
  const { mutateAsync: mutateVote, isLoading: voting } =
    trpc.vote.commentVote.useMutation();

  const inputRef = React.useRef<TextInput>(null);
  const [loaded, setLoaded] = React.useState(true);
  const [state, setState] = React.useState({ text: "", reply: false });
  const [replyTo, setReplyTo] = React.useState<UserType | undefined>(undefined);
  const { isLoading: replying, mutateAsync: mutateReplyComment } =
    trpc.reply.reply.useMutation();

  const [openControls, setOpenControls] = React.useState(false);
  const toggleOpenControls = () => setOpenControls((state) => !state);

  const reply = () => {
    if (cmt?.comment?.id) {
      mutateReplyComment({
        commentId: cmt.comment.id,
        text: state.text.trim(),
        mentions: replyTo ? [replyTo.id!] : [],
      }).then((res) => {
        if (res.success) {
          setState((state) => ({ ...state, reply: false, text: "" }));
          setReplyTo(undefined);
        }
      });
    }
  };

  const vote = () => {
    if (!!cmt?.comment?.id) {
      mutateVote({ commentId: cmt.comment.id });
    }
  };

  // subscriptions
  trpc.comment.onEdited.useSubscription(
    { commentId: cmt?.comment?.id || 0 },
    {
      onData: async (data) => {
        await refetchComment();
      },
    }
  );
  trpc.vote.onCommentVote.useSubscription(
    { commentId: cmt?.comment?.id || 0 },
    {
      onData: async (data) => {
        await refetchComment();
      },
    }
  );

  if (fetchingComment && !!!cmt) return <CommentSkeleton />;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ width: "100%", marginVertical: 10 }}
      onLongPress={toggleOpenControls}
    >
      {!!cmt?.comment ? (
        <Modal open={openControls} toggle={toggleOpenControls}>
          <CommentControls toggle={toggleOpenControls} comment={cmt.comment} />
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
              zIndex: 1,
              position: "absolute",
              top: -10,
              right: 0,
              width: 20,
              height: 20,
              borderRadius: 20,
              display: loaded ? "flex" : "none",
              backgroundColor: COLORS.gray,
              overflow: "hidden",
            }}
          />
        ) : null}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              isMe: me?.id === cmt?.comment?.userId,
              userId: cmt?.comment?.userId!,
              from: "Thought",
            })
          }
          activeOpacity={0.7}
          style={{
            position: "absolute",
            top: -10,
            right: 0,
          }}
        >
          <Image
            style={{
              zIndex: 1,
              width: 20,
              height: 20,
              borderRadius: 20,
              display: loaded ? "flex" : "none",
            }}
            source={{
              uri: !!cmt?.comment?.user?.avatar
                ? serverBaseHttpURL.concat(cmt?.comment?.user?.avatar)
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

        <Text style={[styles.h1, {}]}>{cmt?.comment?.text}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {dayjs(cmt?.comment?.createdAt).fromNow()} ago
          </Text>
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {" • "}
          </Text>
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {cmt?.comment?.userId === me?.id ? "you" : cmt?.comment?.user?.name}
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
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={voting}
            onPress={vote}
            style={{}}
          >
            <Ionicons
              name={cmt?.voted ? "heart" : "heart-outline"}
              size={20}
              color={COLORS.tertiary}
            />
          </TouchableOpacity>
          <Text style={[styles.h1, { marginLeft: 5, fontSize: 14 }]}>
            {cmt?.comment?.voteCount}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setState((state) => ({ ...state, reply: true }));
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            style={{}}
          >
            <Ionicons name="arrow-undo" size={20} color={COLORS.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
      {cmt?.comment?.id ? (
        <Replies
          commentId={cmt.comment.id}
          navigation={navigation}
          inputRef={inputRef}
          setReplyTo={setReplyTo}
        />
      ) : null}

      <View style={{ maxWidth: "90%", marginTop: 5, alignSelf: "flex-end" }}>
        {!!replyTo ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text style={[styles.h1]}>RE: {replyTo?.name}</Text>
            <TouchableOpacity
              onPress={() => {
                setReplyTo(undefined);
                Keyboard.dismiss();
              }}
              activeOpacity={0.7}
              style={{
                marginLeft: 10,
                width: 20,
                height: 20,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.red,
              }}
            >
              <Ionicons name="close" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <TextInput
            maxLength={200}
            multiline={true}
            style={{
              padding: 5,
              backgroundColor: COLORS.white,
              width: "100%",
              marginBottom: 5,
              borderRadius: 5,
              fontFamily: FONTS.regular,
              fontSize: 14,
              flex: 1,
            }}
            selectionColor={COLORS.black}
            value={state.text}
            onChangeText={(text) => setState((state) => ({ ...state, text }))}
            placeholder={`Reply on this comment thread...`}
            onSubmitEditing={reply}
            ref={inputRef}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={reply}
            disabled={replying}
            style={[
              styles.button,
              {
                backgroundColor: COLORS.tertiary,
                borderRadius: 5,
                paddingVertical: 5,
                maxWidth: 85,
                marginLeft: 5,
              },
            ]}
          >
            <Text
              style={[
                styles.button__text,
                { color: COLORS.white, marginRight: replying ? 10 : 0 },
              ]}
            >
              reply
            </Text>
            {replying ? <Ripple color={COLORS.white} size={5} /> : null}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Comment;
