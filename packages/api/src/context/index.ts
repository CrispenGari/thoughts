import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { inferAsyncReturnType } from "@trpc/server";
import { UserType } from "../types";
import { verifyJwt } from "../utils/jwt";
import { User } from "../sequelize/models";

const getMe = async (jwt: string | undefined): Promise<UserType | null> => {
  if (!!!jwt) return null;
  try {
    const { id } = await verifyJwt(jwt);
    const me = await User.findByPk(id);
    return !!me ? me.toJSON() : null;
  } catch (error) {
    return null;
  }
};
export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  const jwt = req.headers.authorization?.split(/\s/)[1];
  const me = await getMe(jwt);
  return {
    req,
    res,
    me,
  };
};

export type CtxType = inferAsyncReturnType<typeof createContext>;
