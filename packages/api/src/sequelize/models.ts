import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { UserType } from "../types";

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

export const Thought = sequelize.define(
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
    password: {
      type: DataTypes.STRING,
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

Thought.hasOne(User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Comment.hasOne(User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Thought.hasMany(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
