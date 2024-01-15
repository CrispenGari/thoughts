import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { VoteType } from "../types";

export const Vote: ModelDefined<
  Required<VoteType>,
  VoteType
> = sequelize.define(
  "votes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);
