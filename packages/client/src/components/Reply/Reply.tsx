import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { CommentType } from "@thoughts/api/src/types";

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
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

interface Props {
  reply: CommentType;
}

const Reply: React.FunctionComponent<Props> = ({ reply }) => {
  const [loaded, setLoaded] = React.useState(true);
  return (
    <View style={{ width: "90%", marginVertical: 10, alignSelf: "flex-end" }}>
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
              bottom: -20,
              right: 5,
              width: 40,
              height: 40,
              borderRadius: 40,
              zIndex: 1,
              backgroundColor: COLORS.gray,
              overflow: "hidden",
              position: "absolute",
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
            uri: !!reply?.user?.avatar
              ? serverBaseHttpURL.concat(reply?.user?.avatar)
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

        <Text style={[styles.h1, {}]}>{reply.text}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <Text style={[styles.p, { fontSize: 15, color: COLORS.gray }]}>
            {dayjs(reply.createdAt).fromNow()} ago
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
          <TouchableOpacity activeOpacity={0.7} style={{}}>
            <Ionicons name="arrow-undo" size={20} color={COLORS.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Reply;
