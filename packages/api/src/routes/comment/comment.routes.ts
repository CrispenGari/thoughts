import EventEmitter from "events";
import {
  createSchema,
  getCommentSchema,
  getReplySchema,
  onCreateSchema,
  onNewCommentNotificationSchema,
  onReplySchema,
  replySchema,
} from "../../schema/comment.schema";
import { Comment } from "../../sequelize/comment.model";
import { Thought } from "../../sequelize/thought.model";
import { publicProcedure, router } from "../../trpc";
import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";
import { CommentType, NotificationType } from "../../types";
import { Notification } from "../../sequelize/notification.model";
import { User } from "../../sequelize/user.model";

const ee = new EventEmitter();
export const commentRouter = router({
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
  onCreate: publicProcedure
    .input(onCreateSchema)
    .subscription(async ({ input: { userId, thoughtId } }) => {
      return observable<CommentType>((emit) => {
        const handler = (payload: CommentType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
          if (payload.id === thoughtId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_CREATE_COMMENT, handler);
        return () => {
          ee.off(Events.ON_CREATE_COMMENT, handler);
        };
      });
    }),
  onReply: publicProcedure
    .input(onReplySchema)
    .subscription(async ({ input: { commentId } }) => {
      return observable<CommentType>((emit) => {
        const handler = (payload: CommentType) => {
          if (payload.commentId === commentId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_COMMENT_REPLY, handler);
        return () => {
          ee.off(Events.ON_COMMENT_REPLY, handler);
        };
      });
    }),
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ ctx: { me }, input: { thoughtId, text } }) => {
      try {
        if (!!!text.trim()) return { success: false };
        if (!!!me) return { success: false };
        const thought = await Thought.findByPk(thoughtId);
        if (!!!thought) return { success: false };
        const comment = await Comment.create({
          text: text.trim(),
          thoughtId: thought.toJSON().id,
          userId: me.id,
        });
        const notification = await Notification.create({
          title: `comment(s) on your thought.`,
          thoughtId: thought.toJSON().id,
          userId: thought.toJSON().userId,
          read: false,
          type: "comment",
        });

        ee.emit(Events.ON_NEW_NOTIFICATION, notification.toJSON());
        ee.emit(Events.ON_CREATE_COMMENT, comment.toJSON());
        return { success: true };
      } catch (error) {
        console.log(error);
        return { success: false };
      }
    }),
  reply: publicProcedure
    .input(replySchema)
    .mutation(async ({ ctx: { me }, input: { commentId, text, mentions } }) => {
      try {
        if (!!!text.trim()) return { success: false };
        if (!!!me) return { success: false };
        const cmt = await Comment.findByPk(commentId);
        if (!!!cmt) return { success: false };
        const reply = await Comment.create({
          text: text.trim(),
          thoughtId: cmt.toJSON().thoughtId,
          userId: me.id,
          commentId: cmt.toJSON().id,
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

        ee.emit(Events.ON_COMMENT_REPLY, reply.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
  getComment: publicProcedure
    .input(getCommentSchema)
    .query(async ({ input: { id } }) => {
      try {
        const payload = await Comment.findByPk(id, {
          include: [
            {
              model: User,
            },
            {
              model: Comment,
              attributes: ["id"],
              as: "replies",
            },
          ],
        });
        return !!payload ? payload.toJSON() : null;
      } catch (error) {
        return null;
      }
    }),
  getReply: publicProcedure
    .input(getReplySchema)
    .query(async ({ input: { id } }) => {
      try {
        const payload = await Comment.findByPk(id, {
          include: [
            {
              model: User,
            },
          ],
        });
        return !!payload ? payload.toJSON() : null;
      } catch (error) {
        console.log({ error });
        return null;
      }
    }),
});
