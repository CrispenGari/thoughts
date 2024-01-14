import EventEmitter from "events";
import {
  createSchema,
  delSchema,
  editSchema,
  getCommentSchema,
  getCommentsSchema,
  onCreateSchema,
  onDeleteSchema,
  onEditedSchema,
  onNewCommentNotificationSchema,
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
  onEdited: publicProcedure
    .input(onEditedSchema)
    .subscription(async ({ input: { commentId } }) => {
      return observable<CommentType>((emit) => {
        const handler = (payload: CommentType) => {
          if (payload.id === commentId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_COMMENT_UPDATE, handler);
        return () => {
          ee.off(Events.ON_COMMENT_UPDATE, handler);
        };
      });
    }),
  onDelete: publicProcedure
    .input(onDeleteSchema)
    .subscription(async ({ input: { thoughtId } }) => {
      return observable<CommentType>((emit) => {
        const handler = (payload: CommentType) => {
          if (payload.thoughtId === thoughtId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_COMMENT_DELETE, handler);
        return () => {
          ee.off(Events.ON_COMMENT_DELETE, handler);
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
  getComment: publicProcedure
    .input(getCommentSchema)
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
        return null;
      }
    }),
  getComments: publicProcedure
    .input(getCommentsSchema)
    .query(async ({ input: { thoughtId, limit, cursor } }) => {
      try {
        const offset = cursor ? cursor : 0;
        const payload = await Comment.findAll({
          where: { thoughtId },
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
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
          comments: payload.map((c) => c.toJSON()),
        };
      } catch (error) {
        return {
          nextCursor: undefined,
          comments: [],
        };
      }
    }),
  edit: publicProcedure
    .input(editSchema)
    .mutation(async ({ input: { commentId, text }, ctx: { me } }) => {
      try {
        if (!!!me) return { success: false };
        if (!!!text.trim()) return { success: false };
        const comment = await Comment.findByPk(commentId);
        if (!!!comment) return { success: false };
        await comment.update({ text: text.trim() });
        ee.emit(Events.ON_COMMENT_UPDATE, comment.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),

  del: publicProcedure
    .input(delSchema)
    .mutation(async ({ input: { commentId }, ctx: { me } }) => {
      try {
        if (!!!me) return { success: false };
        const comment = await Comment.findByPk(commentId);
        if (!!!comment) return { success: false };
        await comment.destroy({ force: true });
        ee.emit(Events.ON_COMMENT_DELETE, comment.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
});
