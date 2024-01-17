import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { SettingType } from "../types";

export const Setting: ModelDefined<
  Required<SettingType>,
  SettingType
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
  },
  { freezeTableName: true, timestamps: true }
);
