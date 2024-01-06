import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, profile } from "../../constants";
import { styles } from "../../styles";
import Ripple from "../Ripple/Ripple";
import { trpc } from "../../utils/trpc";
import ThoughtComponent from "../ThoughtComponent/ThoughtComponent";
import { useSubscriptionsStore } from "../../store";

const Contact: React.FunctionComponent<{
  contact: {
    phoneNumber: string;
    id: number;
  };
}> = ({ contact }) => {
  const { user, setUser } = useSubscriptionsStore();
  const { data, refetch: refetchUser } = trpc.user.contact.useQuery({
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
  if (!!!data?.user) return null;

  return (
    <View
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
      <ThoughtComponent userId={data.user.id} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <View style={{ position: "relative", marginTop: 30 }}>
          {data.user.online ? (
            <View style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
              <Ripple color={COLORS.tertiary} size={5} />
            </View>
          ) : null}
          <Image
            style={{ width: 50, height: 50, borderRadius: 50, marginBottom: 3 }}
            source={{ uri: Image.resolveAssetSource(profile).uri }}
          />
        </View>
        <Text numberOfLines={1} style={[styles.h1]}>
          {data.user.name}
        </Text>
      </View>
    </View>
  );
};
export default React.memo(Contact);
