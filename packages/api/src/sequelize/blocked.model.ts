import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { BlockedType, PrettifyType } from "../types";

export const Blocked: ModelDefined<
  PrettifyType<Required<BlockedType>>,
  PrettifyType<BlockedType>
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
