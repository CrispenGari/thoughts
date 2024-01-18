import EventEmitter from "events";
import { paySchema, onPaySchema } from "../../schema/payment.schema";
import { Payment } from "../../sequelize/payment.model";
import { User } from "../../sequelize/user.model";
import { stripe } from "../../stripe";
import { publicProcedure, router } from "../../trpc";
import { UserType } from "../../types";
import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";

const prices = {
  general: 21.99,
  active_status: 15.99,
};
const ee = new EventEmitter();
export const paymentRouter = router({
  onPay: publicProcedure
    .input(onPaySchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_PAY, handler);
        return () => {
          ee.off(Events.ON_PAY, handler);
        };
      });
    }),
  pay: publicProcedure
    .input(paySchema)
    .mutation(async ({ ctx: { me }, input: { category, type } }) => {
      try {
        if (!!!me)
          return {
            success: false,
            error: "You are not authenticated.",
            secrete: null,
          };
        const user = await User.findByPk(me.id, { include: ["payments"] });
        if (!!!user)
          return {
            success: false,
            error: "You are not authenticated.",
            secrete: null,
          };

        const payments = user.toJSON().payments;
        const paid = payments.find((p) => p.category === category);
        if (!!paid) {
          return {
            success: false,
            error: "You have already paid for this service.",
            secrete: null,
          };
        }
        const intent = await stripe.paymentIntents.create({
          payment_method_types: type === "e-payment" ? ["card"] : undefined,
          amount: prices[category] * 100, // converting to cents
          currency: "usd",
        });
        const secrete = intent.client_secret;

        if (!!!secrete)
          return {
            error: "Payment failed",
            secrete,
            success: false,
          };
        await Payment.create({
          category,
          type,
          price: prices[category],
          currency: "usd",
          userId: me.id,
        });
        ee.emit(Events.ON_PAY, me);
        return {
          success: true,
          error: null,
          secrete,
        };
      } catch (error) {
        return {
          success: false,
          error: "Internal server error",
        };
      }
    }),
});
