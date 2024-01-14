import { router } from "../trpc";
import { loginRouter } from "./auth/login.routes";
import { logoutRouter } from "./auth/logout.routes";
import { registerRouter } from "./auth/register.routes";
import { blockedRouter } from "./blocked/blocked.routes";
import { commentRouter } from "./comment/comment.routes";
import { downvoteRouter } from "./downvote/downvote.routes";
import { helloRouter } from "./hello/hello.routes";
import { notificationRoute } from "./notification/notification.routes";
import { replyRouter } from "./reply/reply.routes";
import { thoughtRouter } from "./thought/thought.routes";
import { upvoteRouter } from "./upvote/upvote.routes";
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
  upvote: upvoteRouter,
  downvote: downvoteRouter,
  reply: replyRouter,
  blocked: blockedRouter,
});

export type AppRouter = typeof appRouter;
