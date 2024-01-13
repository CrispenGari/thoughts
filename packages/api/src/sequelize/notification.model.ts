import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { NotificationType } from "../types";

export const Notification: ModelDefined<
  Required<NotificationType>,
  NotificationType
> = sequelize.define(
  "notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    type: {
      allowNull: false,
      type: DataTypes.ENUM("comment", "reaction", "reply"),
    },
  },
  { freezeTableName: true, timestamps: true }
);
