import { NotificationType } from "@thoughts/api/src/types";

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
