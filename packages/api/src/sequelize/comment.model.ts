import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { CommentType } from "../types";

export const Comment: ModelDefined<
  Required<CommentType>,
  CommentType
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
  },

  { freezeTableName: true, timestamps: true }
);
