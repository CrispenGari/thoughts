import EventEmitter from "events";
import {
  contactSchema,
  getSchema,
  onStatusSchema,
  statusUpdateSchema,
  updatePhoneNumberSchema,
  updateProfileSchema,
  onUserDeleteAccountSchema,
  deleteAccountSchema,
  changePinSchema,
  verifyPinSchema,
  onAuthStateChangedSchema,
  onUserProfileUpdateSchema,
  onProfileUpdateSchema,
  onUserUpdateSchema,
} from "../../schema/user.schema";
import { publicProcedure, router } from "../../trpc";
import { Events } from "../../constants";
import { observable } from "@trpc/server/observable";
import { UserType } from "../../types";
import { Op } from "sequelize";
import { isValidPhoneNumber } from "../../utils/regexp";
import { User } from "../../sequelize/user.model";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { Blocked } from "../../sequelize/blocked.model";
import { Country } from "../../sequelize/country.model";
import { Survey } from "../../sequelize/survey.model";
import { hash, verify } from "argon2";
import { signJwt } from "../../utils/jwt";
const storagePath = path.resolve(
  path.join(__dirname.replace(`\\src\\routes\\user`, ""), "storage", "images")
);

const ee = new EventEmitter();
export const userRouter = router({
  onAuthStateChanged: publicProcedure
    .input(onAuthStateChangedSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType | null>((emit) => {
        const handler = (payload: {
          user: UserType;
          payload: UserType | null;
        }) => {
          if (payload.user?.id === userId) {
            emit.next(payload.payload);
          }
        };
        ee.on(Events.ON_AUTH_STATE_CHANGED, handler);
        return () => {
          ee.off(Events.ON_AUTH_STATE_CHANGED, handler);
        };
      });
    }),
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
  onUserProfileUpdate: publicProcedure
    .input(onUserProfileUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_PROFILE_UPDATE, handler);
        return () => {
          ee.off(Events.ON_USER_PROFILE_UPDATE, handler);
        };
      });
    }),

  onUserUpdate: publicProcedure
    .input(onUserUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_USER_UPDATE, handler);
        return () => {
          ee.off(Events.ON_USER_UPDATE, handler);
        };
      });
    }),
  onProfileUpdate: publicProcedure
    .input(onProfileUpdateSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_PROFILE_UPDATE, handler);
        return () => {
          ee.off(Events.ON_PROFILE_UPDATE, handler);
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
        ee.emit(Events.ON_USER_UPDATE, { ...me, ...payload.toJSON() });
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
        const __user = await User.findByPk(me.id);
        const uu = await __user!.update({ phoneNumber: phoneNumber.trim() });
        ee.emit(Events.ON_USER_UPDATE, {
          ...me,
          ...uu.toJSON(),
        });
        return { phoneNumber: phoneNumber.trim() };
      } catch (error: any) {
        return {
          error: "Failed to update phone number for whatever reason.",
        };
      }
    }),
  updateProfile: publicProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input: { name, image, gender, bio }, ctx: { me } }) => {
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
        if (me.avatar !== image) {
          const imageName = me.avatar?.replace("/api/storage/images/", "");
          if (!!imageName) {
            const absPath = path.resolve(path.join(storagePath, imageName));
            const exists = existsSync(absPath);
            if (exists) {
              await fs.unlink(absPath);
            }
          }
        }
        const user = await User.findByPk(me.id);
        const uu = await user!.update({
          name: name.trim(),
          avatar: image ? image : "",
          gender,
          bio,
        });
        ee.emit(Events.ON_PROFILE_UPDATE, uu.toJSON());
        ee.emit(Events.ON_USER_PROFILE_UPDATE, uu.toJSON());
        ee.emit(Events.ON_USER_UPDATE, {
          ...me,
          ...uu.toJSON(),
        });
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
  verifyPin: publicProcedure
    .input(verifyPinSchema)
    .mutation(async ({ input: { pin }, ctx: { me } }) => {
      try {
        if (!!!me)
          return { success: false, error: "You are not authenticated." };
        const user = await User.findByPk(me.id);
        if (!!!user) {
          return {
            error: "You are not authenticated.",
            success: false,
          };
        }
        const __me = user.toJSON();
        if (__me.pinTrials === 5) {
          return {
            error:
              "You have exceeded the pin trials, your account has been blocked.",
            success: false,
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
        await user.update({
          pinTrials: 0,
        });
        return {
          success: true,
          error: null,
        };
      } catch (error) {
        return { success: false, error: "Internal server error." };
      }
    }),
  changePin: publicProcedure
    .input(changePinSchema)
    .mutation(async ({ input: { pin1, pin2 }, ctx: { me } }) => {
      try {
        if (!!!me)
          return {
            retry: true,
            success: false,
            error: "You are not authenticated.",
          };
        const user = await User.findByPk(me.id);
        if (!!!user) {
          return {
            error: "You are not authenticated.",
            success: false,
            retry: true,
          };
        }

        if (pin1.trim().length !== 5) {
          return {
            retry: true,
            error: "The pin code can only be 5 digits.",
            success: false,
          };
        }
        if (pin1.trim() !== pin2.trim()) {
          return {
            retry: true,
            error: "Pin miss match try again.",
            success: false,
          };
        }
        const __me = user.toJSON();
        const valid = await verify(__me.pin, pin1);
        if (valid) {
          return {
            retry: true,
            error: "You can not change your pin code to the old pin.",
            success: false,
          };
        }
        const hashedPin = await hash(pin1);
        const newToken = crypto.randomInt(1, 10_000_000);
        await user.update({
          pin: hashedPin,
          tokenVersion: newToken,
          online: false,
          pinTrials: 0,
        });
        const u = await user.save();
        const jwt = await signJwt(u.toJSON());
        return {
          success: true,
          error: null,
          retry: false,
          jwt,
        };
      } catch (error) {
        return { success: false, error: "Internal server error.", retry: true };
      }
    }),
});
