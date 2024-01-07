import EventEmitter from "events";
import {
  contactSchema,
  getSchema,
  onStatusSchema,
  onUserUpdateSchema,
  statusUpdateSchema,
  updatePhoneNumberSchema,
} from "../../schema/user.schema";
import { publicProcedure, router } from "../../trpc";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import { UserType } from "../../types";
import { Op } from "sequelize";
import { isValidPhoneNumber } from "../../utils/regexp";
import { User } from "../../sequelize/user.model";

const ee = new EventEmitter();
export const userRouter = router({
  onStatus: publicProcedure
    .input(onStatusSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id !== userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_STATUS, handler);
        return () => {
          ee.off(Events.ON_STATUS, handler);
        };
      });
    }),

  onUserUpdate: publicProcedure
    .input(onUserUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id !== userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_UPDATE, handler);
        return () => {
          ee.off(Events.ON_USER_UPDATE, handler);
        };
      });
    }),
  statusUpdate: publicProcedure
    .input(statusUpdateSchema)
    .mutation(async ({ ctx: { me }, input: { status } }) => {
      try {
        if (!!!me) return { success: false };
        const payload = await User.findByPk(me.id);
        if (!!!payload) return { success: false };
        await payload.update({ online: status });
        await payload.save();
        ee.emit(Events.ON_STATUS, payload.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
  me: publicProcedure.query(({ ctx: { me } }) => {
    return { me };
  }),
  contact: publicProcedure
    .input(contactSchema)
    .query(async ({ input: { id } }) => {
      const user = await User.findByPk(id);
      return {
        user: user ? user.toJSON() : null,
      };
    }),
  get: publicProcedure.input(getSchema).query(async ({ input: { id } }) => {
    try {
      const u = await User.findByPk(id, {
        include: { all: true },
      });
      return !!u ? u.toJSON() : null;
    } catch (error) {
      return null;
    }
  }),
  all: publicProcedure.query(async ({ ctx: { me } }) => {
    try {
      const users = await User.findAll({
        where: {
          [Op.not]: [{ id: [me?.id || 0] }],
        },
        include: {
          all: true,
        },
        order: [
          ["createdAt", "DESC"],
          ["online", "DESC"],
        ],
        attributes: ["id", "phoneNumber"],
      });
      return {
        users: users.map((u) => ({
          id: u.toJSON().id,
          phoneNumber: u.toJSON().phoneNumber,
        })),
      };
    } catch (error: any) {
      return {
        users: [],
      };
    }
  }),

  updatePhoneNumber: publicProcedure
    .input(updatePhoneNumberSchema)
    .mutation(async ({ ctx: { me }, input: { phoneNumber } }) => {
      try {
        if (!!!me) return { error: "You are not authenticated." };
        if (!isValidPhoneNumber(phoneNumber.trim())) {
          return {
            error: "Invalid phone number.",
          };
        }
        if (me.phoneNumber === phoneNumber.trim())
          return {
            phoneNumber: me.phoneNumber,
          };
        const user = await User.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });

        if (!!user) {
          return {
            error: "The phone number is taken.",
          };
        }
        await User.update(
          { phoneNumber: phoneNumber.trim() },
          { where: { id: me.id } }
        );
        ee.emit(Events.ON_USER_UPDATE, {
          ...me,
          phoneNumber: phoneNumber.trim(),
        } as UserType);
        return { phoneNumber: phoneNumber.trim() };
      } catch (error: any) {
        return {
          error: "Failed to update phone number for whatever reason.",
        };
      }
    }),
});
