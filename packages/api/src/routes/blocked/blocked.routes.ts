import EventEmitter from "events";
import {
  blockSchema,
  getSchema,
  onBlockedSchema,
  unblockSchema,
} from "../../schema/blocked.schema";
import { Blocked } from "../../sequelize/blocked.model";
import { User } from "../../sequelize/user.model";
import { publicProcedure, router } from "../../trpc";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import { BlockedType } from "../../types";

const ee = new EventEmitter();
export const blockedRouter = router({
  onBlocked: publicProcedure
    .input(onBlockedSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<BlockedType>((emit) => {
        const handler = (payload: BlockedType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_BLOCK, handler);
        return () => {
          ee.off(Events.ON_USER_BLOCK, handler);
        };
      });
    }),
  onUnBlocked: publicProcedure
    .input(onBlockedSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<BlockedType>((emit) => {
        const handler = (payload: BlockedType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_UN_BLOCK, handler);
        return () => {
          ee.off(Events.ON_USER_UN_BLOCK, handler);
        };
      });
    }),
  block: publicProcedure
    .input(blockSchema)
    .mutation(async ({ ctx: { me }, input: { id } }) => {
      try {
        if (!!!me) return { success: false };
        const user = await User.findByPk(id);
        if (!!!user) return { success: false };
        const blocked = await Blocked.create({
          phoneNumber: user.toJSON().phoneNumber,
          userId: me.id!,
        });
        ee.emit(Events.ON_USER_BLOCK, blocked.toJSON());
        return { success: true };
      } catch (error) {
        return {
          success: false,
        };
      }
    }),
  unblock: publicProcedure
    .input(unblockSchema)
    .mutation(async ({ ctx: { me }, input: { phoneNumber } }) => {
      try {
        if (!!!me) return { success: false };
        const user = await Blocked.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });
        if (!!!user) return { success: false };
        await user.destroy();
        ee.emit(Events.ON_USER_BLOCK, user.toJSON());
        return { success: true };
      } catch (error) {
        return {
          success: false,
        };
      }
    }),
  all: publicProcedure.query(async ({ ctx: { me } }) => {
    try {
      if (!!!me)
        return {
          count: 0,
          blocked: [],
        };
      const user = await User.findByPk(me.id, {
        include: ["blocked"],
      });

      if (!!!user)
        return {
          count: 0,
          blocked: [],
        };
      return {
        blocked: user.toJSON().blocked,
        count: user.toJSON().blocked.length,
      };
    } catch (error) {
      return {
        count: 0,
        blocked: [],
      };
    }
  }),
  get: publicProcedure.input(getSchema).query(async ({ input: { id } }) => {
    try {
      const b = await Blocked.findByPk(id);
      if (!!!b) return null;
      const user = await User.findOne({
        where: { phoneNumber: b.toJSON().phoneNumber },
      });

      if (!!!user) return null;
      return user.toJSON();
    } catch (error) {
      return null;
    }
  }),
});
