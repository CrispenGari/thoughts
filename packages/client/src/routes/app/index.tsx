import { COLORS } from "../../constants";
import type { AppParamList } from "../../params";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  AppPrivacyPolicy,
  AppTermsOfUse,
  Home,
  Settings,
  Notifications,
  Profile,
  BlockedContacts,
  ChangePin,
  UpdatePhoneNumber,
  Thought,
  DeleteAccount,
  ConfirmDeleteAccount,
  ConfirmNewPin,
  ForgotPin,
  NewPin,
  OldPassKey,
  NewPassKey,
  ForgotPasskey,
} from "../../screens/app";
import { AppState } from "react-native";
import { trpc } from "../../utils/trpc";
import {
  useContactsStore,
  useMeStore,
  useNotificationsStore,
  useSubscriptionsStore,
} from "../../store";
import { getContactName, schedulePushNotification } from "../../utils";
import { useNotificationsToken } from "../../hooks";

const Stack = createStackNavigator<AppParamList>();

export const AppTabs = () => {
  const { me, setMe } = useMeStore();
  const { contacts } = useContactsStore();
  const { token } = useNotificationsToken();
  const { setUser, setThought, setBlock } = useSubscriptionsStore();
  const { setNotifications } = useNotificationsStore();
  const { data: notifications, refetch: refetchNotifications } =
    trpc.notification.all.useQuery();

  // listen to all subscriptions here
  trpc.register.onNewUserNotification.useSubscription(
    { userId: me?.id || 0, contacts },
    {
      onData: async (data) => {
        if (!!token && !!me?.setting?.notifications && !!data.id) {
          const contactName = getContactName({ user: data });
          await schedulePushNotification({
            data: {
              from: "Home",
              userId: data.id,
              to: "Profile",
              thoughtId: undefined,
              read: undefined,
              notificationId: undefined,
              type: undefined,
            },
            body: `${contactName} has joined thought.`,
            title: `thoughts:new user 👋`,
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.thought.onCreateNotification.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        if (!!token && !!me?.setting?.notifications && !!data.id) {
          const contactName = getContactName({ user: data.user! });
          await schedulePushNotification({
            data: {
              from: "Home",
              userId: data.id,
              to: "Thought",
              thoughtId: data.id,
              read: false,
              notificationId: undefined,
              type: undefined,
            },
            body: `${contactName} created a new thought.`,
            title: `thoughts:new thought 💭`,
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.blocked.onBlockedOrUnBlocked.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        if (data.id) {
          setBlock(data.id);
        }
      },
    }
  );
  trpc.thought.onCreate.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        setThought({ thoughtId: data.id || 0, userId: data.userId || 0 });
      },
    }
  );
  trpc.thought.onDelete.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        setThought({ thoughtId: data.id || 0, userId: data.userId || 0 });
      },
    }
  );
  trpc.user.onStatus.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        if (data.online && !!token && !!me?.setting?.notifications) {
          const contactName = getContactName({ user: data });
          await schedulePushNotification({
            data: {
              from: "Home",
              userId: data.id!,
              to: "Profile",
              thoughtId: undefined,
              read: undefined,
              notificationId: undefined,
              type: undefined,
            },
            body: `${contactName} is now online.`,
            title: `thoughts:active status 🔥`,
            badge: notifications?.unread?.length || undefined,
          });
        }
        setUser(data.id || 0);
      },
    }
  );
  trpc.payment.onPay.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        if (data.id === me?.id) {
          setMe(data);
        }
      },
    }
  );
  trpc.setting.onSettingsUpdate.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        if (data.id === me?.id) {
          setMe(data);
        }
      },
    }
  );
  trpc.user.onUserUpdate.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: (data) => {
        if (data.id === me?.id) {
          setMe(data);
        }
      },
    }
  );
  trpc.comment.onNewCommentNotification.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        await refetchNotifications();
        if (!!token && !!me?.setting?.notifications) {
          const contactName = getContactName({ user: data.user! });
          await schedulePushNotification({
            data: {
              from: "Notifications",
              userId: data.userId,
              to: "Thought",
              thoughtId: data.thoughtId,
              read: data.read,
              notificationId: data.id,
              type: data.type,
            },
            body: `${contactName} commented on your thought.`,
            title: `thoughts:${data.type} 💭`.replace(/(_)/g, (_s) => " "),
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.vote.onNewCommentVoteNotification.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        await refetchNotifications();
        if (!!token && !!me?.setting?.notifications) {
          const contactName = getContactName({ user: data.user! });
          await schedulePushNotification({
            data: {
              from: "Notifications",
              userId: data.userId,
              to: "Thought",
              thoughtId: data.thoughtId,
              read: data.read,
              notificationId: data.id,
              type: data.type,
            },
            body: `${contactName} reacted on your comment.`,
            title: `thoughts:${data.type} 🤎`.replace(/(_)/g, (_s) => " "),
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.reply.onNewCommentReplyNotification.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        await refetchNotifications();
        if (!!token && !!me?.setting?.notifications) {
          const contactName = getContactName({ user: data.user! });
          await schedulePushNotification({
            data: {
              from: "Notifications",
              userId: data.userId,
              to: "Thought",
              thoughtId: data.thoughtId,
              read: data.read,
              notificationId: data.id,
              type: data.type,
            },
            body: `${contactName} replied to your comment.`,
            title: `thoughts:${data.type} 💭`.replace(/(_)/g, (_s) => " "),
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.reply.onNewCommentReplyMentionNotification.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        await refetchNotifications();
        if (!!token && !!me?.setting?.notifications) {
          const contactName = getContactName({ user: data.user! });
          await schedulePushNotification({
            data: {
              from: "Notifications",
              userId: data.userId,
              to: "Thought",
              thoughtId: data.thoughtId,
              read: data.read,
              notificationId: data.id,
              type: data.type,
            },
            body: `${contactName} ${data.title}`,
            title: `thoughts:${data.type} 💭`.replace(/(_)/g, (_s) => " "),
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.vote.onNewReplyVoteNotification.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (data) => {
        await refetchNotifications();
        if (!!token && !!me?.setting?.notifications) {
          const contactName = getContactName({ user: data.user! });
          await schedulePushNotification({
            data: {
              from: "Notifications",
              userId: data.userId,
              to: "Thought",
              thoughtId: data.thoughtId,
              read: data.read,
              notificationId: data.id,
              type: data.type,
            },
            body: `${contactName} reacted to your reply.`,
            title: `thoughts:${data.type} 🤎`.replace(/(_)/g, (_s) => " "),
            badge: notifications?.unread?.length || undefined,
          });
        }
      },
    }
  );
  trpc.notification.onRead.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (_data) => {
        await refetchNotifications();
      },
    }
  );
  trpc.notification.onDelete.useSubscription(
    { userId: me?.id || 0 },
    {
      onData: async (_data) => {
        await refetchNotifications();
      },
    }
  );

  const { mutateAsync } = trpc.user.statusUpdate.useMutation();
  const appState = React.useRef(AppState.currentState);
  const [isOnline, setIsOnline] = React.useState<boolean>(
    appState.current === "active"
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsOnline(nextAppState === "active");
    });
    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    if (!!contacts.length) {
      mutateAsync({ status: isOnline, contacts }).then((_res) => {});
    }
  }, [isOnline, contacts]);

  React.useEffect(() => {
    if (!!notifications) {
      setNotifications(notifications);
    }
  }, [notifications, setNotifications]);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          borderColor: "transparent",
          backgroundColor: COLORS.tertiary,
          height: 100,
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Thought" component={Thought} />
      <Stack.Screen name="OldPasskey" component={OldPassKey} />
      <Stack.Screen name="NewPasskey" component={NewPassKey} />
      <Stack.Screen name="ForgotPasskey" component={ForgotPasskey} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
      <Stack.Screen
        name="ConfirmDeleteAccount"
        component={ConfirmDeleteAccount}
      />
      <Stack.Screen name="ForgotPin" component={ForgotPin} />
      <Stack.Screen name="ConfirmNewPin" component={ConfirmNewPin} />
      <Stack.Screen name="NewPin" component={NewPin} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="AppPrivacyPolicy" component={AppPrivacyPolicy} />
      <Stack.Screen name="AppTermsOfUse" component={AppTermsOfUse} />
      <Stack.Screen name="UpdatePhoneNumber" component={UpdatePhoneNumber} />
      <Stack.Screen name="ChangePin" component={ChangePin} />
      <Stack.Screen name="BlockedContact" component={BlockedContacts} />
    </Stack.Navigator>
  );
};
