import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { PaymentType, PrettifyType } from "../types";

export const Payment: ModelDefined<
  PrettifyType<Required<PaymentType>>,
  PrettifyType<PaymentType>
> = sequelize.define(
  "payments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.ENUM("active_status", "general"),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("e-payment", "cash"),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);
