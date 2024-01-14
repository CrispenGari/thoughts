import jwt from "jsonwebtoken";
import { UserType } from "../../types";

export const signJwt = async ({
  id,
  tokenVersion,
}: UserType): Promise<string> => {
  return await jwt.sign(
    {
      id,
      tokenVersion,
    },
    process.env.JWT_SECRETE
  );
};
export const verifyJwt = async (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRETE) as {
    id: string;
    tokenVersion: number;
  };
};
