import { router } from "../trpc";
import { loginRouter } from "./auth/login.routes";
import { logoutRouter } from "./auth/logout.routes";
import { registerRouter } from "./auth/register.routes";
import { commentRouter } from "./comment/comment.routes";
import { helloRouter } from "./hello/hello.routes";
import { notificationRoute } from "./notification/notification.routes";
import { thoughtRouter } from "./thought/thought.routes";
import { userRouter } from "./user/user.routes";

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  login: loginRouter,
  register: registerRouter,
  logout: logoutRouter,
  thought: thoughtRouter,
  comment: commentRouter,
  notification: notificationRoute,
});

export type AppRouter = typeof appRouter;
