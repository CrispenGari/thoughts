import { router } from "../trpc";
import { loginRouter } from "./auth/login.routes";
import { logoutRouter } from "./auth/logout.routes";
import { registerRouter } from "./auth/register.routes";
import { blockedRouter } from "./blocked/blocked.routes";
import { commentRouter } from "./comment/comment.routes";
import { helloRouter } from "./hello/hello.routes";
import { notificationRoute } from "./notification/notification.routes";
import { replyRouter } from "./reply/reply.routes";
import { thoughtRouter } from "./thought/thought.routes";
import { voteRouter } from "./vote/vote.routes";
import { userRouter } from "./user/user.routes";
import { paymentRouter } from "./payment/payment.routes";
import { settingRouter } from "./setting/setting.routes";
import { surveyRouter } from "./survey/survey.routes";

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  login: loginRouter,
  register: registerRouter,
  logout: logoutRouter,
  thought: thoughtRouter,
  comment: commentRouter,
  notification: notificationRoute,
  vote: voteRouter,
  payment: paymentRouter,
  setting: settingRouter,
  reply: replyRouter,
  blocked: blockedRouter,
  survey: surveyRouter,
});

export type AppRouter = typeof appRouter;
