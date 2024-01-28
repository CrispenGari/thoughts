import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { PrettifyType, SettingType } from "../types";

export const Setting: ModelDefined<
  PrettifyType<Required<SettingType>>,
  PrettifyType<SettingType>
> = sequelize.define(
  "settings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    activeStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);
