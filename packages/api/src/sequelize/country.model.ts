import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { CountryType } from "../types";

export const Country: ModelDefined<
  Required<CountryType>,
  CountryType
> = sequelize.define(
  "countries",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);
