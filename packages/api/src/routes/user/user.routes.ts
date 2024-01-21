import EventEmitter from "events";
import {
  contactSchema,
  getSchema,
  onStatusSchema,
  onUserUpdateSchema,
  statusUpdateSchema,
  updatePhoneNumberSchema,
  updateProfileSchema,
  onUserDeleteAccountSchema,
  deleteAccountSchema,
} from "../../schema/user.schema";
import { publicProcedure, router } from "../../trpc";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import { UserType } from "../../types";
import { Op } from "sequelize";
import { isValidPhoneNumber } from "../../utils/regexp";
import { User } from "../../sequelize/user.model";

import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { Blocked } from "../../sequelize/blocked.model";
import { Country } from "../../sequelize/country.model";
import { Survey } from "../../sequelize/survey.model";
import { verify } from "argon2";
const storagePath = path.resolve(
  path.join(__dirname.replace(`\\src\\routes\\user`, ""), "storage", "images")
);

const ee = new EventEmitter();
export const userRouter = router({
  onDeleteAccount: publicProcedure
    .input(onUserDeleteAccountSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<null>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(null);
          }
        };
        ee.on(Events.ON_DELETE_ACCOUNT, handler);
        return () => {
          ee.off(Events.ON_DELETE_ACCOUNT, handler);
        };
      });
    }),
  onUserDeleteAccount: publicProcedure
    .input(onUserDeleteAccountSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_DELETE, handler);
        return () => {
          ee.off(Events.ON_USER_DELETE, handler);
        };
      });
    }),
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
    .query(async ({ input: { id }, ctx: { me } }) => {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Blocked,
            where: {
              phoneNumber: me?.phoneNumber,
            },
            as: "blocked",
            required: false,
          },
          "setting",
        ],
      });
      const blocked = !!user?.toJSON().blocked.length;
      return {
        user: user ? user.toJSON() : null,
        blocked,
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
            blockedYou: false,
          };
        const u = await User.findByPk(id, {
          include: [
            "setting",
            "country",
            {
              model: Blocked,
              where: {
                phoneNumber: me?.phoneNumber,
              },
              as: "blocked",
              required: false,
            },
          ],
        });

        if (!!!u) return { user: null, blocked: false, blockedYou: false };
        const b = await Blocked.findOne({
          where: {
            userId: me.id,
            phoneNumber: u.toJSON().phoneNumber,
          },
        });
        const blocked = !!u?.toJSON().blocked.length;
        return {
          user: u.toJSON(),
          blocked: !!b,
          blockedYou: blocked,
        };
      } catch (error) {
        return {
          user: null,
          blocked: false,
          blockedYou: false,
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
          { where: { userId: me.id } }
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

  deleteAccount: publicProcedure
    .input(deleteAccountSchema)
    .mutation(async ({ ctx: { me }, input: { reason, pin } }) => {
      try {
        if (!!!me)
          return {
            success: false,
            error: "You are not authenticated",
          };
        const user = await User.findByPk(me.id);
        if (!!!user)
          return {
            success: false,
            error: "The user might have been deleted",
          };

        const __me = user.toJSON();
        if (__me.pinTrials === 5) {
          return {
            success: false,
            error:
              "You have exceeded the pin trials, your account has been blocked.",
          };
        }
        const valid = await verify(__me.pin, pin);
        if (!valid) {
          await user.increment("pinTrials", { by: 1 });
          const uu = await user.save();
          return {
            error: `Invalid pin code, try again ${
              4 - uu.toJSON().pinTrials
            } left!`,
            success: false,
          };
        }
        const imageURL = user.toJSON().avatar;
        if (!!imageURL) {
          // delete the image
          const imageName = imageURL.replace("/api/storage/images/", "");
          if (!!imageName) {
            const absPath = path.resolve(path.join(storagePath, imageName));
            const exists = existsSync(absPath);
            if (exists) {
              await fs.unlink(absPath);
            }
          }
        }
        await user.destroy();
        await Survey.create({
          reason,
        });
        ee.emit(Events.ON_USER_DELETE, me);
        ee.emit(Events.ON_DELETE_ACCOUNT, me);
        return {
          success: true,
          error: null,
        };
      } catch (error) {
        return {
          success: false,
          error: "Internal server error.",
        };
      }
    }),
});
