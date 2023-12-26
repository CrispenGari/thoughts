import { router } from "../trpc";

import { helloRouter } from "./hello/hello.routes";

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
