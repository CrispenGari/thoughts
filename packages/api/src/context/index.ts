import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { inferAsyncReturnType } from "@trpc/server";
import { UserType } from "../types";
import { verifyJwt } from "../utils/jwt";
import { User } from "../sequelize/user.model";
import { Op } from "sequelize";

const getMe = async (jwt: string | undefined): Promise<UserType | null> => {
  if (!!!jwt) return null;
  try {
    const { id, tokenVersion } = await verifyJwt(jwt);
    const me = await User.findByPk(id, { include: ["country"] });
    if (!!!me) return null;
    const _me = me.toJSON();
    if (_me.tokenVersion !== tokenVersion) return null;
    return _me;
  } catch (error) {
    return null;
  }
};

const getBlockedNumbers = async (me: UserType | null): Promise<number[]> => {
  if (!!!me) return [];
  try {
    const blocked = await User.findByPk(me.id, { include: ["blocked"] });
    if (!!!blocked) return [];
    const numbers = blocked.toJSON().blocked.map((b) => b.phoneNumber);
    const users = await User.findAll({
      where: {
        phoneNumber: {
          [Op.in]: numbers,
        },
      },
    });
    return users.map((u) => u.toJSON().id);
  } catch (error) {
    return [];
  }
};

export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  const jwt = req.headers.authorization?.split(/\s/)[1];
  const me = await getMe(jwt);
  const blocked = await getBlockedNumbers(me);
  return {
    req,
    res,
    me,
    blocked,
  };
};

export type CtxType = inferAsyncReturnType<typeof createContext>;
