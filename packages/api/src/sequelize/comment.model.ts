import { DataTypes } from "sequelize";
import { sequelize } from ".";

export const Comment = sequelize.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);
