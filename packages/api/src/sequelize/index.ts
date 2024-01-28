import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "thoughts",
  process.env.PG_USER,
  process.env.PG_PASS,
  {
    dialect: "postgres",
    logging: false,
  }
);
