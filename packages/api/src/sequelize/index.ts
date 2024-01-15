import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("thoughts", "root", "root", {
  dialect: "mysql",
  logging: false,
});
