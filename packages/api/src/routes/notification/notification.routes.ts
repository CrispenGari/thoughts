import { EventEmitter } from "stream";
import {
  delSchema,
  onDeleteSchema,
  onReadSchema,
  onUnReadSchema,
  readSchema,
  unReadSchema,
} from "../../schema/notification.schema";
import { Notification } from "../../sequelize/notification.model";
import { publicProcedure, router } from "../../trpc";
import { NotificationType } from "../../types";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";

const ee = new EventEmitter();
export const notificationRoute = router({
  onDelete: publicProcedure
    .input(onDeleteSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<NotificationType>((emit) => {
        const handler = (payload: NotificationType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_DELETE_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_DELETE_NOTIFICATION, handler);
        };
      });
    }),
  onRead: publicProcedure
    .input(onReadSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<NotificationType>((emit) => {
        const handler = (payload: NotificationType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_READ_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_READ_NOTIFICATION, handler);
        };
      });
    }),
  onUnRead: publicProcedure
    .input(onUnReadSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<NotificationType>((emit) => {
        const handler = (payload: NotificationType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_UNREAD_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_UNREAD_NOTIFICATION, handler);
        };
      });
    }),
  all: publicProcedure.query(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return [];
      const notifications = await Notification.findAll({
        where: {
          userId: me.id,
        },
        include: ["thought"],
      });
      return notifications.map((n) => n.toJSON());
    } catch (error) {
      return [];
    }
  }),
  read: publicProcedure.input(readSchema).mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return { success: false };
      const notification = await Notification.findOne({
        where: { userId: me.id },
      });
      if (!!!notification) return { success: false };
      const n = await notification.update({ read: true });
      ee.emit(Events.ON_READ_NOTIFICATION, n.toJSON());
      return {
        success: true,
      };
    } catch (error) {
      return { success: false };
    }
  }),
  unRead: publicProcedure
    .input(unReadSchema)
    .mutation(async ({ ctx: { me } }) => {
      try {
        if (!!!me) return { success: false };
        const notification = await Notification.findOne({
          where: { userId: me.id },
        });
        if (!!!notification) return { success: false };
        const n = await notification.update({ read: false });
        ee.emit(Events.ON_UNREAD_NOTIFICATION, n.toJSON());
        return {
          success: true,
        };
      } catch (error) {
        return { success: false };
      }
    }),
  del: publicProcedure.input(delSchema).mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return { success: false };
      const notification = await Notification.findOne({
        where: { userId: me.id },
      });
      if (!!!notification) return { success: false };
      await notification.destroy();
      ee.emit(Events.ON_DELETE_NOTIFICATION, notification.toJSON());
      return {
        success: true,
      };
    } catch (error) {
      return { success: false };
    }
  }),
});
