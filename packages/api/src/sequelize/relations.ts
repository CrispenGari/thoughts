import { Blocked } from "./blocked.model";
import { Comment } from "./comment.model";
import { Country } from "./country.model";
import { Notification } from "./notification.model";
import { Reply } from "./reply.model";
import { Thought } from "./thought.model";

import { User } from "./user.model";
import { Vote } from "./vote.model";

// USER AND THOUGHT
User.hasOne(Thought, {});
Thought.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});
// COUNTRY AND USER
Country.belongsTo(User, {});
User.belongsTo(Country, {
  onDelete: "RESTRICT",
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

// REPLY AND USER
User.hasMany(Reply, {});
Reply.belongsTo(User, {
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

// COMMENT TO REPLY
Comment.hasMany(Reply, {});
Reply.belongsTo(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "commentId",
});

// USER TO BLOCKED
User.hasMany(Blocked, {});
Blocked.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "userId",
});

// COMMENT TO REACTIONS
Comment.hasMany(Vote, {});
Vote.belongsTo(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "commentId",
});

// REPLY TO REACTIONS
Reply.hasMany(Vote, {});
Vote.belongsTo(Reply, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "replyId",
});
