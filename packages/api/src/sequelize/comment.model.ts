import { DataTypes } from "sequelize";
import { sequelize } from ".";
import { User } from "./user.model";

export const Comment = sequelize.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);

Comment.belongsTo(User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});
