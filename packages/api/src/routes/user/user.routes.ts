import EventEmitter from "events";
import {
  contactSchema,
  getSchema,
  onStatusSchema,
  statusUpdateSchema,
} from "../../schema/user.schema";
import { Thought, User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import { UserType } from "../../types";
import { Op } from "sequelize";

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
          model: Thought,
          required: false,
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
});
