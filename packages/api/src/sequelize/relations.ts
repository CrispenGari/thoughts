import { Comment } from "./comment.model";
import { Country } from "./country.model";
import { Notification } from "./notification.model";
import { Thought } from "./thought.model";
import { User } from "./user.model";

// user and thought
User.hasOne(Thought, {});
Thought.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});
// COUNTRY AND USER
Country.belongsTo(User, {});
User.belongsTo(Country, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "countryId",
});

// COMMENT AND THOUGHT

Thought.hasMany(Comment, {});
Comment.belongsTo(Thought, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "thoughtId",
});

// COMMENT AND USER

User.hasMany(Comment, {});
Comment.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});

// NOTIFICATION AND USER
User.hasMany(Notification, {});
Notification.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});

// NOTIFICATION AND THOUGHT
Thought.hasMany(Notification, {});
Notification.belongsTo(Thought, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "thoughtId",
});
// COMMENT TO COMMENT
Comment.hasMany(Comment, { as: "replies" });
