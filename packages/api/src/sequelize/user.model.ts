import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { PrettifyType, UserType } from "../types";

export const User: ModelDefined<
  PrettifyType<Required<UserType>>,
  PrettifyType<UserType>
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "TRANS-GENDER"),
      allowNull: false,
    },
    passkey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Hey there, I am using thoughts.",
    },
    passkeyQuestion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { freezeTableName: true, timestamps: true }
);
