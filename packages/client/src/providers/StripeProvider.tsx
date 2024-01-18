import React from "react";
import { PUBLISHABLE_KEY } from "../keys";
import { StripeProvider as Provider } from "@stripe/stripe-react-native";
interface Props {
  children: React.ReactElement;
}
const StripeProvider: React.FunctionComponent<Props> = ({ children }) => {
  return <Provider publishableKey={PUBLISHABLE_KEY}>{children}</Provider>;
};

export default StripeProvider;
