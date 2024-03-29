import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { CommentType, PrettifyType } from "../types";

export const Comment: ModelDefined<
  PrettifyType<Required<CommentType>>,
  PrettifyType<CommentType>
> = sequelize.define(
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
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },

  { freezeTableName: true, timestamps: true }
);
