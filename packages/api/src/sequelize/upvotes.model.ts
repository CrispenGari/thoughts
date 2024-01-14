import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { UpVoteType } from "../types";

export const UpVote: ModelDefined<
  Required<UpVoteType>,
  UpVoteType
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
