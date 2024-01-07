import { ModelDefined, DataTypes } from "sequelize";
import { sequelize } from ".";
import { ThoughtType } from "../types";

export const Thought: ModelDefined<
  Required<ThoughtType>,
  ThoughtType
> = sequelize.define(
  "thoughts",
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
