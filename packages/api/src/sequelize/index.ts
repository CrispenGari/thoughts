import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("thoughts", "postgres", "root", {
  dialect: "postgres",
  logging: false,
});
