import { NotificationType } from "@thoughts/api/src/types";
import { AppParamList } from "../params";

export interface GroupType {
  read: {
    comment: NotificationType[];
    reply: NotificationType[];
    comment_reaction: NotificationType[];
    reply_reaction: NotificationType[];
  };
  unread: {
    comment: NotificationType[];
    reply: NotificationType[];
    comment_reaction: NotificationType[];
    reply_reaction: NotificationType[];
  };
}

export type TNotificationData = {
  from: keyof AppParamList;
  to: keyof AppParamList;
  userId: number;
  thoughtId: number | undefined;
  notificationId: number | undefined;
  read: boolean | undefined;
  type: "comment" | "reply" | "comment_reaction" | "reply_reaction" | undefined;
};
