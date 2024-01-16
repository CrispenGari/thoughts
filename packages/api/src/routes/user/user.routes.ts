import EventEmitter from "events";
import {
  contactSchema,
  getSchema,
  onStatusSchema,
  onUserUpdateSchema,
  statusUpdateSchema,
  updatePhoneNumberSchema,
  updateProfileSchema,
} from "../../schema/user.schema";
import { publicProcedure, router } from "../../trpc";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import { UserType } from "../../types";
import { Op } from "sequelize";
import { isValidPhoneNumber } from "../../utils/regexp";
import { User } from "../../sequelize/user.model";
import { Country } from "../../sequelize/country.model";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { Blocked } from "../../sequelize/blocked.model";
const storagePath = path.resolve(
  path.join(__dirname.replace(`\\src\\routes\\user`, ""), "storage", "images")
);

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
          } else {
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
  get: publicProcedure
    .input(getSchema)
    .query(async ({ input: { id }, ctx: { me } }) => {
      try {
        if (!!!me)
          return {
            user: null,
            blocked: false,
          };
        const u = await User.findByPk(id, {
          include: ["country"],
        });
        if (!!!u) return { user: null, blocked: false };
        const b = await Blocked.findOne({
          where: {
            userId: me.id,
            phoneNumber: u.toJSON().phoneNumber,
          },
        });
        return {
          user: u.toJSON(),
          blocked: !!b,
        };
      } catch (error) {
        return {
          user: null,
          blocked: false,
        };
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
    .mutation(async ({ ctx: { me }, input: { user, country } }) => {
      try {
        const phoneNumber = user.phoneNumber.startsWith("+")
          ? user.phoneNumber
          : `${country.phoneCode}${
              user.phoneNumber.startsWith("0")
                ? user.phoneNumber.substring(1)
                : user.phoneNumber
            }`.replace(/\s/g, "");

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
        const _user = await User.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });

        if (!!_user) {
          return {
            error: "The phone number is taken.",
          };
        }
        await Country.update(
          {
            ...country,
          },
          { where: { id: me.country?.id } }
        );
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

  updateProfile: publicProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input: { name, image }, ctx: { me } }) => {
      try {
        if (!!!me) {
          return {
            error: "You are not authenticated.",
            success: false,
          };
        }
        if (name.trim().length < 3 || name.trim().length >= 20) {
          return {
            success: false,
            error:
              "The name must have a minimum of 3 characters and a maximum of 20 characters.",
          };
        }
        // delete the old image
        if (me.avatar !== image || !!!image) {
          const imageName = me.avatar?.replace("/api/storage/images/", "");
          if (!!imageName) {
            const absPath = path.resolve(path.join(storagePath, imageName));
            const exists = existsSync(absPath);
            if (exists) {
              await fs.unlink(absPath);
            }
          }
        }
        await User.update(
          {
            name: name.trim(),
            avatar: image ? image : undefined,
          },
          { where: { id: me.id } }
        );

        ee.emit(Events.ON_USER_UPDATE, { ...me, avatar: image });
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),
});
