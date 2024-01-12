import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { CommentType } from "@thoughts/api/src/types";
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
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface Props {
  comment: CommentType;
}
const Comment: React.FunctionComponent<Props> = ({ comment }) => {
  const [loaded, setLoaded] = React.useState(true);
  const [state, setState] = React.useState({ text: "", reply: false });
  const replying = false;
  const reply = () => {};
  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
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
        <Image
          style={{
            zIndex: 1,
            position: "absolute",
            top: -10,
            right: 0,
            width: 20,
            height: 20,
            borderRadius: 20,
            display: loaded ? "flex" : "none",
          }}
          source={{
            uri: !!comment?.user?.avatar
              ? serverBaseHttpURL.concat(comment?.user?.avatar)
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

        <Text style={[styles.h1, {}]}>{comment.text}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {dayjs(comment.createdAt).fromNow()} ago
          </Text>
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {" • "}
          </Text>
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            me
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setState((state) => ({ ...state, reply: true }))}
            style={{}}
          >
            <Ionicons name="arrow-undo" size={20} color={COLORS.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
      {/* replies */}

      {state.reply ? (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            maxWidth: "90%",
            marginTop: 5,
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
      ) : null}
    </View>
  );
};

export default Comment;
