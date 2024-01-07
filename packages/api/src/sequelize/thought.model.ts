import { ModelDefined, DataTypes } from "sequelize";
import { sequelize } from ".";
import { ThoughtType } from "../types";
import { Comment } from "./comment.model";
import { User } from "./user.model";

export const Thought: ModelDefined<
  Required<ThoughtType>,
  ThoughtType
> = sequelize.define(
  "thoughts",
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

Thought.belongsTo(User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});
Thought.hasMany(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "commentId",
});
