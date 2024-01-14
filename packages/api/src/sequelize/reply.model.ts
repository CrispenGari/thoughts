import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { ReplyType } from "../types";

export const Reply: ModelDefined<
  Required<ReplyType>,
  ReplyType
> = sequelize.define(
  "replies",
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
