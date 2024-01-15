import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { UserType } from "../types";

export const User: ModelDefined<
  Required<UserType>,
  UserType
> = sequelize.define(
  "users",
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
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin: {
      type: DataTypes.STRING,
    },
    pinTrials: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    online: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { freezeTableName: true, timestamps: true }
);
