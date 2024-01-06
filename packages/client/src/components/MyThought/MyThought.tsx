import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, profile } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles";
import Modal from "../Modal/Modal";
import { trpc } from "../../utils/trpc";
import Form from "../Form/Form";
import EditThought from "../Form/EditThought";
import { useMeStore, useSubscriptionsStore } from "../../store";

const MyThought = () => {
  const { thought: thoughtPayload, setThought } = useSubscriptionsStore();
  const { me } = useMeStore();
  const [openCreateForm, setOpenCreateForm] = React.useState(false);
  const toggleCreateForm = () => setOpenCreateForm((state) => !state);
  const [openEditThought, setOpenEditThought] = React.useState(false);
  const toggleEditThought = () => setOpenEditThought((state) => !state);
  const { data: thought, refetch: refetchMyThought } =
    trpc.thought.get.useQuery();

  React.useEffect(() => {
    if (!!thoughtPayload && !!me) {
      if (thoughtPayload.userId === me.id) {
        refetchMyThought().then(({ data }) => {
          if (data?.text) {
            setThought(null);
          }
        });
      }
    }
  }, [thoughtPayload, setThought, me]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {thought ? (
        <Modal open={openEditThought} toggle={toggleEditThought}>
          <EditThought thought={thought} toggle={toggleEditThought} />
        </Modal>
      ) : (
        <Modal open={openCreateForm} toggle={toggleCreateForm}>
          <Form toggle={toggleCreateForm} />
        </Modal>
      )}
      <View
        style={{
          position: "relative",
          height: 200,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!!thought ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              height: 50,
              zIndex: 5,
              width: "100%",
              position: "absolute",
              top: 0,
              maxWidth: 150,
            }}
            onPress={toggleEditThought}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                minHeight: 35,
                maxHeight: 35,
              }}
            >
              <Text style={[styles.p]} numberOfLines={2}>
                {thought.text}
              </Text>
            </View>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 14,
                backgroundColor: COLORS.white,
                position: "absolute",
                bottom: 2,
                zIndex: 2,
                left: 3,
              }}
            />
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 7,
                backgroundColor: COLORS.white,
                position: "absolute",
                bottom: 0,
                zIndex: 2,
                left: 18,
              }}
            />
          </TouchableOpacity>
        ) : null}
        <View style={{ width: 60, alignItems: "center" }}>
          {!!!thought ? (
            <TouchableOpacity
              onPress={toggleCreateForm}
              style={{
                position: "absolute",
                top: 0,
                left: -20,
                backgroundColor: COLORS.tertiary,
                zIndex: 1,
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color={COLORS.white} />
            </TouchableOpacity>
          ) : null}
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              marginBottom: 3,
              resizeMode: "contain",
            }}
            source={{ uri: Image.resolveAssetSource(profile).uri }}
          />
        </View>
      </View>
    </View>
  );
};

export default MyThought;
