import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { BlockedType } from "../types";

export const Blocked: ModelDefined<
  Required<BlockedType>,
  BlockedType
> = sequelize.define(
  "blocked",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  { freezeTableName: true, timestamps: true }
);
