import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { inferAsyncReturnType } from "@trpc/server";

// const getMe = async (jwt: string | undefined): Promise<User | null> => {
//   if (!!!jwt) return null;
//   try {
//     const { id } = await verifyJwt(jwt);
//     const me = await prisma.user.findFirst({ where: { id } });
//     return me;
//   } catch (error) {
//     return null;
//   }
// };
export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  //   const jwt = req.headers.authorization?.split(/\s/)[1];
  //   const me = await getMe(jwt);
  return {
    req,
    res,
  };
};

export type CtxType = inferAsyncReturnType<typeof createContext>;
