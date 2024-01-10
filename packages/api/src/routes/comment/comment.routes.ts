import EventEmitter from "events";
import {
  createSchema,
  onCreateSchema,
  onNewCommentNotificationSchema,
} from "../../schema/comment.schema";
import { Comment } from "../../sequelize/comment.model";
import { Thought } from "../../sequelize/thought.model";
import { publicProcedure, router } from "../../trpc";
import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";
import { CommentType, NotificationType } from "../../types";
import { Notification } from "../../sequelize/notification.model";

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
          title: `${me.name} commented on your thought.`,
          thoughtId: thought.toJSON().id,
          userId: thought.toJSON().userId,
          read: false,
        });

        ee.emit(Events.ON_NEW_NOTIFICATION, notification);
        ee.emit(Events.ON_CREATE_COMMENT, comment);
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
});
