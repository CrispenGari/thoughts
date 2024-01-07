import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { UserType } from "../types";
import { Country } from "./country.model";

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
      type: DataTypes.NUMBER,
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
  },
  { freezeTableName: true, timestamps: true }
);

User.belongsTo(Country, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "countryId",
});
