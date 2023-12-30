import { router } from "../trpc";
import { loginRouter } from "./auth/login.routes";
import { registerRouter } from "./auth/register.routes";
import { helloRouter } from "./hello/hello.routes";
import { userRouter } from "./user/user.routes";

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  login: loginRouter,
  register: registerRouter,
});

export type AppRouter = typeof appRouter;
