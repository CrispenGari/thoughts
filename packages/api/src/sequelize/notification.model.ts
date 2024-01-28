import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { NotificationType, PrettifyType } from "../types";

export const Notification: ModelDefined<
  PrettifyType<Required<NotificationType>>,
  PrettifyType<NotificationType>
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
    thoughtId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM(
        "comment",
        "reaction",
        "reply",
        "comment_reaction",
        "reply_reaction"
      ),
    },
  },
  { freezeTableName: true, timestamps: true }
);
