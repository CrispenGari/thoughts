import { View, Text } from "react-native";
import React from "react";
import { COLORS, relativeTimeObject } from "../../constants";
import { countries } from "../../constants/countries";
import { styles } from "../../styles";
import ContentLoader from "../ContentLoader/ContentLoader";
import { UserType } from "@thoughts/api/src/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useMeStore } from "../../store";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface Props {
  gettingUser: boolean;
  user: UserType | null | undefined;
  isBlocked: boolean;
}
const PublicDetails: React.FunctionComponent<Props> = ({
  gettingUser,
  user,
  isBlocked,
}) => {
  const { me } = useMeStore();

  return (
    <>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 5,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        <Text style={[styles.h1]}>Biography</Text>
        {gettingUser ? (
          <>
            {Array(2)
              .fill(null)
              .map((_e, i) => (
                <ContentLoader
                  key={i}
                  style={{
                    backgroundColor: COLORS.gray,
                    borderRadius: 2,
                    width: "100%",
                    padding: 5,
                    marginTop: 3,
                    overflow: "hidden",
                  }}
                />
              ))}

            <ContentLoader
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 2,
                width: "50%",
                padding: 5,
                marginTop: 3,
                overflow: "hidden",
              }}
            />
          </>
        ) : (
          <Text style={[styles.p, { color: COLORS.tertiary }]}>
            {user?.bio}
          </Text>
        )}
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 5,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        <Text style={[styles.h1]}>Gender</Text>
        {gettingUser ? (
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
            {user?.gender.toLowerCase()}
          </Text>
        )}
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 5,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        <Text style={[styles.h1]}>Phone Number</Text>
        {gettingUser ? (
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
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 5,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        <Text style={[styles.h1]}>Country</Text>
        {gettingUser ? (
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
            {
              countries.find(
                (c) =>
                  c.code.toLowerCase() ===
                  user?.country?.countryCode.toLowerCase()
              )?.emoji
            }{" "}
            {user?.country?.name}
          </Text>
        )}
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 5,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        <Text style={[styles.h1]}>Joined</Text>

        {gettingUser ? (
          <ContentLoader
            style={{
              backgroundColor: COLORS.gray,
              borderRadius: 2,
              width: "25%",
              padding: 7,
              marginTop: 3,
              overflow: "hidden",
            }}
          />
        ) : (
          <Text
            style={[
              styles.p,
              {
                color: user?.online ? COLORS.tertiary : COLORS.red,
              },
            ]}
          >
            {isBlocked ? "hidden" : `${dayjs(user?.createdAt).fromNow()} ago`}
          </Text>
        )}
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 5,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        <Text style={[styles.h1]}>Last Seen</Text>
        {me?.setting?.activeStatus && user?.setting?.activeStatus ? (
          <>
            {gettingUser ? (
              <ContentLoader
                style={{
                  backgroundColor: COLORS.gray,
                  borderRadius: 2,
                  width: "25%",
                  padding: 7,
                  marginTop: 3,
                  overflow: "hidden",
                }}
              />
            ) : (
              <Text
                style={[
                  styles.p,
                  {
                    color: user?.online ? COLORS.tertiary : COLORS.red,
                  },
                ]}
              >
                {isBlocked
                  ? "hidden"
                  : user?.online
                  ? "online"
                  : `${dayjs(user?.updatedAt).fromNow()} ago`}
              </Text>
            )}
          </>
        ) : (
          <Text
            style={[
              styles.p,
              {
                color: COLORS.red,
              },
            ]}
          >
            {me?.id === user?.id ? "online" : "hidden"}
          </Text>
        )}
      </View>
    </>
  );
};

export default PublicDetails;
