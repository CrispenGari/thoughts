import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { PrettifyType, ReplyType } from "../types";

export const Reply: ModelDefined<
  PrettifyType<Required<ReplyType>>,
  PrettifyType<ReplyType>
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
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },

  { freezeTableName: true, timestamps: true }
);
