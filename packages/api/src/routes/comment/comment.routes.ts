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
import { Vote } from "../../sequelize/vote.model";
import { Blocked } from "../../sequelize/blocked.model";

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
    .subscription(async ({ input: { thoughtId } }) => {
      return observable<CommentType>((emit) => {
        const handler = (payload: CommentType) => {
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
        if (!!!text.trim())
          return { success: false, error: "The text is required." };
        if (!!!me)
          return { success: false, error: "You are not authenticated" };
        const thought = await Thought.findByPk(thoughtId);
        if (!!!thought)
          return {
            success: false,
            error: "The thought might have been deleted or expired.",
          };

        const user = await User.findByPk(thought.toJSON().userId, {
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
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: "Internal server error." };
      }
    }),
  getComment: publicProcedure
    .input(getCommentSchema)
    .query(async ({ input: { id }, ctx: { me } }) => {
      try {
        if (!!!me) return null;
        const payload = await Comment.findByPk(id, {
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
            commentId: payload.toJSON().id,
          },
        });

        return {
          comment: payload.toJSON(),
          voted: !!voted,
        };
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
