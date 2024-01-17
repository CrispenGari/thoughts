import { EventEmitter } from "stream";
import {
  delSchema,
  getSchema,
  onDeleteSchema,
  onReadSchema,
  readSchema,
} from "../../schema/notification.schema";
import { Notification } from "../../sequelize/notification.model";
import { publicProcedure, router } from "../../trpc";
import { NotificationType } from "../../types";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import * as lodash from "lodash";
import { Thought } from "../../sequelize/thought.model";

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

  get: publicProcedure.input(getSchema).query(async ({ input: { id } }) => {
    try {
      const notification = await Notification.findByPk(id);

      if (!!!notification)
        return {
          thoughtOwner: null,
          notification: null,
        };
      const thought = await Thought.findByPk(notification?.toJSON().thoughtId, {
        include: ["user"],
      });
      if (!!!thought) {
        return {
          thoughtOwner: null,
          notification: notification.toJSON(),
        };
      }

      return {
        thoughtOwner: thought.toJSON().user,
        notification: notification.toJSON(),
      };
    } catch (error) {
      return {
        thoughtOwner: null,
        notification: null,
      };
    }
  }),
  all: publicProcedure.query(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return { read: [], unread: [] };
      const notifications = await Notification.findAll({
        where: {
          userId: me.id,
        },
        order: [["createdAt", "DESC"]],
      });

      const n: { read?: NotificationType[]; unread?: NotificationType[] } =
        lodash.groupBy(
          notifications.map((n) => n.toJSON()),
          (notification) => (notification.read ? "read" : "unread")
        );
      return n;
    } catch (error) {
      return { read: [], unread: [] };
    }
  }),
  read: publicProcedure
    .input(readSchema)
    .mutation(async ({ ctx: { me }, input: { type, thoughtId } }) => {
      try {
        if (!!!me) return { success: false };
        const notification = await Notification.findOne({
          where: { userId: me.id, type, thoughtId },
        });
        if (!!!notification) return { success: false };
        await Notification.update(
          {
            read: true,
          },
          { where: { userId: me.id, type, thoughtId } }
        );
        ee.emit(Events.ON_READ_NOTIFICATION, notification.toJSON());
        return {
          success: true,
        };
      } catch (error) {
        return { success: false };
      }
    }),

  del: publicProcedure
    .input(delSchema)
    .mutation(async ({ ctx: { me }, input: { type, thoughtId } }) => {
      try {
        if (!!!me) return { success: false };
        const notification = await Notification.findOne({
          where: { userId: me.id, type, thoughtId },
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
