export const APP_NAME = "thoughts";

export const domain: string = "7137-213-172-134-183.ngrok-free.app";
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
  gray: "#f5f5f5",
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
