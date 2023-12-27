import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@thoughts/api";

export const trpc = createTRPCReact<AppRouter>();
