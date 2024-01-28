import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { BlockedType } from "@thoughts/api/src/types";
import { trpc } from "../../utils/trpc";
import { COLORS, profile, serverBaseHttpURL } from "../../constants";
import { styles } from "../../styles";
import ContentLoader from "../ContentLoader/ContentLoader";
import BlockedContactControls from "./BlockedContactControls";
import { useContactName } from "../../hooks";

interface Props {
  blocked: BlockedType;
}
const BlockedContact: React.FunctionComponent<Props> = ({ blocked }) => {
  const [loaded, setLoaded] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((state) => !state);
  const { isLoading: fetching, data: user } = trpc.blocked.get.useQuery({
    id: blocked.id!,
  });
  const { contactName } = useContactName({
    user,
  });
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggle}
      disabled={fetching}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
        paddingRight: 20,
        marginBottom: 2,
        marginHorizontal: 3,
        borderRadius: 5,
      }}
    >
      {!!!user ? null : (
        <BlockedContactControls user={user} open={open} toggle={toggle} />
      )}
      <View>
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

        {fetching ? (
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
        ) : (
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
              display: loaded ? "flex" : "none",
            }}
            source={{
              uri: !!user?.avatar
                ? serverBaseHttpURL.concat(user.avatar)
                : Image.resolveAssetSource(profile).uri,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        {fetching ? (
          <ContentLoader
            style={{
              backgroundColor: COLORS.gray,
              borderRadius: 2,
              width: "50%",
              padding: 7,
              marginTop: 3,
              overflow: "hidden",
            }}
          />
        ) : (
          <Text style={[styles.h1, { fontSize: 18, marginBottom: 4 }]}>
            {contactName}
          </Text>
        )}
        {fetching ? (
          <ContentLoader
            style={{
              backgroundColor: COLORS.gray,
              borderRadius: 2,
              width: "30%",
              padding: 7,
              marginTop: 3,
              overflow: "hidden",
            }}
          />
        ) : (
          <Text style={[styles.p, { color: COLORS.tertiary }]}>
            {user?.phoneNumber}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BlockedContact;
