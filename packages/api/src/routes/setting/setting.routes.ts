import EventEmitter from "events";
import { publicProcedure, router } from "../../trpc";
import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";
import {
  onSettingsUpdateSchema,
  onUserSettingsUpdateSchema,
} from "../../schema/setting.schema";
import { Setting } from "../../sequelize/setting.model";
import { UserType } from "../../types";
import { User } from "../../sequelize/user.model";
const ee = new EventEmitter();
export const settingRouter = router({
  onSettingsUpdate: publicProcedure
    .input(onSettingsUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_SETTINGS_UPDATE, handler);
        return () => {
          ee.off(Events.ON_SETTINGS_UPDATE, handler);
        };
      });
    }),
  onUserSettingsUpdate: publicProcedure
    .input(onUserSettingsUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_SETTINGS_UPDATE, handler);
        return () => {
          ee.off(Events.ON_USER_SETTINGS_UPDATE, handler);
        };
      });
    }),
  updateVisibility: publicProcedure.mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return { success: false };
      const setting = await Setting.findOne({ where: { userId: me.id } });
      if (!!!setting) {
        await Setting.create({
          activeStatus: true,
          notifications: true,
          userId: me.id,
        });
      } else {
        await setting.update({
          activeStatus: !!!setting.toJSON().activeStatus,
        });
      }
      const user = await User.findByPk(me.id, {
        include: ["country", "setting", "payments"],
      });
      if (!!!user) {
        return { success: false };
      }
      ee.emit(Events.ON_SETTINGS_UPDATE, user.toJSON());
      ee.emit(Events.ON_USER_SETTINGS_UPDATE, user.toJSON());
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }),
  updateNotifications: publicProcedure.mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return { success: false };
      const setting = await Setting.findOne({ where: { userId: me.id } });
      if (!!!setting) {
        await Setting.create({
          activeStatus: true,
          notifications: true,
          userId: me.id,
        });
      } else {
        await setting.update({
          notifications: !!!setting.toJSON().notifications,
        });
      }
      const user = await User.findByPk(me.id, {
        include: ["country", "setting", "payments"],
      });
      if (!!!user) {
        return { success: false };
      }
      ee.emit(Events.ON_SETTINGS_UPDATE, user.toJSON());
      ee.emit(Events.ON_USER_SETTINGS_UPDATE, user.toJSON());
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }),
});
