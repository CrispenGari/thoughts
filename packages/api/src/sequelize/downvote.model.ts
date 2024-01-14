import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { DownVoteType } from "../types";

export const DownVote: ModelDefined<
  Required<DownVoteType>,
  DownVoteType
> = sequelize.define(
  "up_votes",
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
