import { DataTypes, ModelDefined } from "sequelize";
import { sequelize } from ".";
import { UserType, ThoughtType } from "../types";

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

Thought.belongsTo(User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});

User.hasOne(Thought, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "thoughtId",
});
Comment.hasOne(User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});

Thought.hasMany(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "commentId",
});
