import { onAuthStateChangedSchema } from "../../schema/logout.schema";
import { User } from "../../sequelize/user.model";
import { publicProcedure, router } from "../../trpc";
import crypto from "crypto";
import { UserType } from "../../types";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { Events } from "../../constants";

const ee = new EventEmitter();
export const logoutRouter = router({
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
  logout: publicProcedure.mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return false;
      const newToken = crypto.randomInt(1, 10_000_000);
      const [uu] = await User.update(
        { online: false, tokenVersion: newToken },
        {
          where: {
            id: me.id,
          },
        }
      );

      ee.emit(Events.ON_AUTH_STATE_CHANGED, {
        user: me,
        payload: null,
      });
      return !!uu;
    } catch (error: any) {
      return false;
    }
  }),
});
