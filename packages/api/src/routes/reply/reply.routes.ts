import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";
import { publicProcedure, router } from "../../trpc";
import { NotificationType, ReplyType } from "../../types";
import EventEmitter from "events";
import {
  delSchema,
  editSchema,
  getRepliesSchema,
  getReplySchema,
  onDeleteReplySchema,
  onEditReplySchema,
  onNewCommentNotificationSchema,
  onReplySchema,
  replySchema,
} from "../../schema/reply.schema";
import { Reply } from "../../sequelize/reply.model";
import { Notification } from "../../sequelize/notification.model";
import { Comment } from "../../sequelize/comment.model";
import { User } from "../../sequelize/user.model";

import { Vote } from "../../sequelize/vote.model";
import { Blocked } from "../../sequelize/blocked.model";

const ee = new EventEmitter();
export const replyRouter = router({
  onEdited: publicProcedure
    .input(onEditReplySchema)
    .subscription(async ({ input: { replyId } }) => {
      return observable<ReplyType>((emit) => {
        const handler = (payload: ReplyType) => {
          if (payload.id === replyId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_REPLY_UPDATE, handler);
        return () => {
          ee.off(Events.ON_REPLY_UPDATE, handler);
        };
      });
    }),
  onDelete: publicProcedure
    .input(onDeleteReplySchema)
    .subscription(async ({ input: { commentId } }) => {
      return observable<ReplyType>((emit) => {
        const handler = (payload: ReplyType) => {
          if (payload.commentId === commentId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_REPLY_DELETE, handler);
        return () => {
          ee.off(Events.ON_REPLY_DELETE, handler);
        };
      });
    }),
  onNewCommentNotification: publicProcedure
    .input(onNewCommentNotificationSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<NotificationType>((emit) => {
        const handler = (payload: NotificationType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_NEW_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_NEW_NOTIFICATION, handler);
        };
      });
    }),
  onReply: publicProcedure
    .input(onReplySchema)
    .subscription(async ({ input: { commentId } }) => {
      return observable<ReplyType>((emit) => {
        const handler = (payload: ReplyType) => {
          if (payload.commentId === commentId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_REPLY_CREATE, handler);
        return () => {
          ee.off(Events.ON_REPLY_CREATE, handler);
        };
      });
    }),
  reply: publicProcedure
    .input(replySchema)
    .mutation(async ({ ctx: { me }, input: { commentId, text, mentions } }) => {
      try {
        if (!!!text.trim())
          return {
            success: false,
            error: "You are not authenticated or the reply has been deleted.",
          };
        const cmt = await Comment.findByPk(commentId);

        if (!!!me || !!!cmt)
          return {
            success: false,
            error: "You are not authenticated or the reply has been deleted.",
          };

        const user = await User.findByPk(cmt.toJSON().userId, {
          include: [
            {
              model: Blocked,
              where: {
                phoneNumber: me.phoneNumber,
              },
              as: "blocked",
            },
          ],
        });
        const blocked = !!user?.toJSON().blocked.length;
        if (blocked) {
          return { success: false, error: "You are blocked by this user." };
        }

        const reply = await Reply.create({
          text: text.trim(),
          commentId,
          userId: me.id!,
        });
        mentions.forEach(async (mention) => {
          const notification = await Notification.create({
            title: `reply on your comment.`,
            thoughtId: cmt.toJSON().thoughtId,
            userId: mention,
            read: false,
            type: "reply",
          });
          ee.emit(Events.ON_NEW_NOTIFICATION, notification.toJSON());
        });
        const notification = await Notification.create({
          title: `reply on your comment.`,
          thoughtId: cmt.toJSON().thoughtId,
          userId: cmt.toJSON().userId,
          read: false,
          type: "reply",
        });
        ee.emit(Events.ON_NEW_NOTIFICATION, notification.toJSON());
        ee.emit(Events.ON_REPLY_CREATE, reply.toJSON());
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: "Internal server error." };
      }
    }),
  getReplies: publicProcedure
    .input(getRepliesSchema)
    .query(async ({ input: { commentId, limit, cursor } }) => {
      try {
        const offset = cursor ? cursor : 0;
        const payload = await Reply.findAll({
          where: { commentId },
          attributes: ["id"],
          order: [["createdAt", "ASC"]],
          limit: limit + 1,
          offset,
        });
        let nextCursor: typeof offset | undefined = undefined;
        if (payload.length > limit) {
          payload.pop();
          nextCursor = offset + limit;
        }
        return {
          nextCursor,
          replies: payload.map((c) => c.toJSON()),
        };
      } catch (error) {
        return {
          nextCursor: undefined,
          replies: [],
        };
      }
    }),
  getReply: publicProcedure
    .input(getReplySchema)
    .query(async ({ input: { id }, ctx: { me } }) => {
      try {
        if (!!!me) return null;
        const payload = await Reply.findByPk(id, {
          include: [
            {
              model: User,
            },
          ],
        });
        if (!!!payload) return null;
        const voted = await Vote.findOne({
          where: {
            userId: me?.id,
            replyId: payload.toJSON().id,
          },
        });
        return {
          reply: payload.toJSON(),
          voted: !!voted,
        };
      } catch (error) {
        return null;
      }
    }),
  edit: publicProcedure
    .input(editSchema)
    .mutation(async ({ input: { replyId, text }, ctx: { me } }) => {
      try {
        if (!!!me) return { success: false };
        if (!!!text.trim()) return { success: false };
        const reply = await Reply.findByPk(replyId);
        if (!!!reply) return { success: false };
        await reply.update({ text: text.trim() });
        ee.emit(Events.ON_REPLY_UPDATE, reply.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
  del: publicProcedure
    .input(delSchema)
    .mutation(async ({ input: { replyId }, ctx: { me } }) => {
      try {
        if (!!!me) return { success: false };
        const reply = await Reply.findByPk(replyId);
        if (!!!reply) return { success: false };
        await reply.destroy({ force: true });
        ee.emit(Events.ON_REPLY_DELETE, reply.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
});
