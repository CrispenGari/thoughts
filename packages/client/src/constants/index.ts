export const APP_NAME = "thoughts";

export const domain: string = "8a39-213-172-134-231.ngrok-free.app";
export const serverBaseHttpURL: string = `https://${domain}`;
export const serverBaseWsURL: string = `wss://${domain}`;
export const clientHttpURL: string = `${serverBaseHttpURL}/api/trpc`;
export const clientWsURL: string = `${serverBaseWsURL}/api/trpc`;

export const KEYS = {
  APP_SETTINGS: "set:",
  TOKEN_KEY: "uid:",
};
export const COLORS = {
  main: "#EEF5FF",
  primary: "#B4D4FF",
  secondary: "#86B6F6",
  tertiary: "#176B87",
  white: "white",
  red: "#FF3953",
  black: "#000000",
  gray: "#9D9C9D",
};
export const Fonts = {
  PhilosopherItalic: require("../../assets/fonts/Philosopher-Italic.ttf"),
  PhilosopherRegular: require("../../assets/fonts/Philosopher-Regular.ttf"),
  PhilosopherBold: require("../../assets/fonts/Philosopher-Bold.ttf"),
  PhilosopherBoldItalic: require("../../assets/fonts/Philosopher-BoldItalic.ttf"),
};
export const FONTS = {
  regular: "PhilosopherRegular",
  italic: "PhilosopherItalic",
  italicBold: "PhilosopherBoldItalic",
  regularBold: "PhilosopherBold",
};

export const logo = require("../../assets/logo.png");
export const profile = require("../../assets/profile.png");
export const simcard = require("../../assets/simcard.png");
export const paywave = require("../../assets/paywave.png");
export const mastercard = require("../../assets/mastercard.png");

export const relativeTimeObject = {
  future: "in %s",
  past: "%s",
  s: "now",
  m: "1m",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "1d",
  dd: "%dd",
  M: "1M",
  MM: "%dM",
  y: "1y",
  yy: "%dy",
};
export const reasons = [
  "This app was too time-consuming.",
  "Privacy concerns influenced my decision.",
  "I experienced negative impacts on my mental health.",
  "Encountered cyber-bullying or harassment on this app.",
  "Dissatisfaction with platform policies or changes.",
  "Life events or changes in priorities prompted me to delete.",
  "Perceived a negative impact on my self-esteem.",
  "I have my own reason.",
].map((r, index) => ({ title: r, id: index.toString() }));
