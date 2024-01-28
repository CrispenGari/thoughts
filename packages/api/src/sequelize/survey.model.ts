import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { PrettifyType, SurveyType } from "../types";

export const Survey: ModelDefined<
  PrettifyType<Required<SurveyType>>,
  PrettifyType<SurveyType>
> = sequelize.define(
  "survey",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);
