import EventEmitter from "events";
import {
  createSchema,
  onCreateSchema,
  onDeleteSchema,
  onUpdateSchema,
  updateSchema,
  getUserThoughtSchema,
  getByIdSchema,
  onCreateNotificationSchema,
} from "../../schema/thought.schema";
import { publicProcedure, router } from "../../trpc";
import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";
import { TContact, ThoughtType } from "../../types";
import { Thought } from "../../sequelize/thought.model";
import { User } from "../../sequelize/user.model";
import { Blocked } from "../../sequelize/blocked.model";
import { decompressJSON } from "@crispengari/utils";
import { Op } from "sequelize";

const ee = new EventEmitter();
export const thoughtRouter = router({
  onCreate: publicProcedure
    .input(onCreateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<ThoughtType>((emit) => {
        const handler = (payload: ThoughtType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          } else {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_CREATE_THOUGHT, handler);
        return () => {
          ee.off(Events.ON_CREATE_THOUGHT, handler);
        };
      });
    }),
  onCreateNotification: publicProcedure
    .input(onCreateNotificationSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<ThoughtType>((emit) => {
        const handler = (payload: ThoughtType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_CREATE_THOUGHT_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_CREATE_THOUGHT_NOTIFICATION, handler);
        };
      });
    }),

  onDelete: publicProcedure
    .input(onDeleteSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<ThoughtType>((emit) => {
        const handler = (payload: ThoughtType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          } else {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_DELETE_THOUGHT, handler);
        return () => {
          ee.off(Events.ON_DELETE_THOUGHT, handler);
        };
      });
    }),
  onUpdate: publicProcedure
    .input(onUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<ThoughtType>((emit) => {
        const handler = (payload: ThoughtType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          } else {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_UPDATE_THOUGHT, handler);
        return () => {
          ee.off(Events.ON_UPDATE_THOUGHT, handler);
        };
      });
    }),
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ input: { thought, contacts }, ctx: { me } }) => {
      try {
        if (!!!me)
          return {
            error: "You are not logged in.",
          };
        if (thought.trim().length < 3)
          return {
            error: "The thought text should be having at least 3 characters",
          };
        const payload = await Thought.create({
          text: thought.trim(),
          userId: me.id!,
        });

        const allNumbers = decompressJSON<TContact[]>(contacts)
          .map(({ phoneNumbers }) => {
            if (typeof phoneNumbers === "undefined") return [];
            return phoneNumbers
              .map((p) => (p.phoneNumber.startsWith("+") ? p.phoneNumber : ""))
              .filter(Boolean);
          })
          .flat(1);
        const audience = await User.findAll({
          where: {
            phoneNumber: {
              [Op.in]: allNumbers,
            },
          },
        });
        audience.forEach((user) => {
          if (user.toJSON().id !== me.id) {
            ee.emit(Events.ON_CREATE_THOUGHT_NOTIFICATION, {
              ...payload.toJSON(),
              userId: user.toJSON().id,
              user: me,
            });
          }
        });
        ee.emit(Events.ON_CREATE_THOUGHT, payload.toJSON());
        return { thought: payload.toJSON() };
      } catch (error) {
        return {
          error: "Something went wrong on the server.",
        };
      }
    }),
  update: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input: { thought }, ctx: { me } }) => {
      try {
        if (!!!me)
          return {
            error: "You are not logged in.",
          };
        if (thought.trim().length < 3)
          return {
            error: "The thought text should be having at least 3 characters",
          };
        const [payload] = await Thought.update(
          { text: thought.trim() },
          {
            where: {
              userId: me.id,
            },
          }
        );
        const _thought = await Thought.findOne({ where: { userId: me.id } });
        if (_thought) {
          ee.emit(Events.ON_UPDATE_THOUGHT, _thought.toJSON());
        }
        return { success: !!payload };
      } catch (error) {
        return {
          error: "Something went wrong on the server.",
        };
      }
    }),

  del: publicProcedure.mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return false;
      const payload = await Thought.findOne({
        where: {
          userId: me.id,
        },
      });
      const thought_ = payload?.toJSON();
      if (!!!thought_) return false;
      ee.emit(Events.ON_DELETE_THOUGHT, thought_);
      await payload?.destroy({ force: true });
      return true;
    } catch (error) {
      return false;
    }
  }),
  getById: publicProcedure
    .input(getByIdSchema)
    .query(async ({ input: { id }, ctx: { me } }) => {
      try {
        if (!!!me)
          return {
            error: "You are not authenticated.",
            thought: null,
          };
        const payload = await Thought.findByPk(id, {
          include: [
            {
              model: User,
            },
          ],
        });
        if (!!!payload) {
          return {
            error: "The thought might have been deleted",
            thought: null,
          };
        }
        const user = await User.findByPk(payload.toJSON().userId, {
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
          return { thought: null, error: "You are blocked by this user." };
        }

        return {
          error: null,
          thought: payload.toJSON(),
        };
      } catch (error) {
        return {
          error: "Internal server Error",
          thought: null,
        };
      }
    }),
  get: publicProcedure.query(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return null;
      const payload = await Thought.findOne({
        where: { userId: me.id },
        include: ["user"],
      });
      return !!payload ? payload.toJSON() : null;
    } catch (error) {
      return null;
    }
  }),
  getUserThought: publicProcedure
    .input(getUserThoughtSchema)
    .query(async ({ input: { userId } }) => {
      try {
        const payload = await Thought.findOne({
          where: { userId },
          include: ["user"],
        });
        return !!payload ? payload.toJSON() : null;
      } catch (error) {
        return null;
      }
    }),
  all: publicProcedure.query(async ({ ctx: {} }) => {
    try {
      const thoughts = await Thought.findAll({
        include: User,
      });
      return thoughts;
    } catch (error) {
      return [];
    }
  }),
});
