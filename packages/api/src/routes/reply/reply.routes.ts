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
        if (!!!text.trim()) return { success: false };
        const cmt = await Comment.findByPk(commentId);
        if (!!!me || !!!cmt) return { success: false };
        const reply = await Reply.create({
          text: text.trim(),
          commentId,
          userId: me.id!,
        });
        mentions.forEach(async (mention) => {
          const notification = await Notification.create({
            title: `reply on your comment.`,
            thoughtId: cmt.toJSON().id,
            userId: mention,
            read: false,
            type: "reply",
          });
          ee.emit(Events.ON_NEW_NOTIFICATION, notification.toJSON());
        });
        const notification = await Notification.create({
          title: `reply on your comment.`,
          thoughtId: cmt.toJSON().id,
          userId: cmt.toJSON().userId,
          read: false,
          type: "reply",
        });
        ee.emit(Events.ON_NEW_NOTIFICATION, notification.toJSON());
        ee.emit(Events.ON_REPLY_CREATE, reply.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
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
    .query(async ({ input: { id } }) => {
      try {
        const payload = await Reply.findByPk(id, {
          include: [
            {
              model: User,
            },
          ],
        });
        return !!payload ? payload.toJSON() : null;
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
