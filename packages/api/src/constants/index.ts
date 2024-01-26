export const enum Events {
  ON_HI = "ON_HI",
  // user related
  ON_STATUS = "ON_STATUS",
  ON_NEW_USER = "ON_NEW_USER",
  ON_USER_DELETE = "ON_USER_DELETE",
  ON_AUTH_STATE_CHANGED = "ON_AUTH_STATE_CHANGED",
  ON_DELETE_ACCOUNT = "ON_DELETE_ACCOUNT",
  ON_USER_UPDATE = "ON_USER_UPDATE",
  ON_USER_PROFILE_UPDATE = "ON_USER_PROFILE_UPDATE",
  ON_PROFILE_UPDATE = "ON_PROFILE_UPDATE",

  // thought related
  ON_DELETE_THOUGHT = "ON_DELETE_THOUGHT",
  ON_UPDATE_THOUGHT = "ON_UPDATE_THOUGHT",
  ON_CREATE_THOUGHT = "ON_CREATE_THOUGHT",

  // notifications related
  ON_NEW_COMMENT_REPLY_MENTION_NOTIFICATION = "ON_NEW_COMMENT_REPLY_MENTION_NOTIFICATION",
  ON_NEW_COMMENT_REPLY_NOTIFICATION = "ON_NEW_COMMENT_REPLY_NOTIFICATION",
  ON_NEW_COMMENT_NOTIFICATION = "ON_NEW_COMMENT_NOTIFICATION",
  ON_DELETE_NOTIFICATION = "ON_DELETE_NOTIFICATION",
  ON_READ_NOTIFICATION = "ON_READ_NOTIFICATION",
  ON_UNREAD_NOTIFICATION = "ON_UNREAD_NOTIFICATION",
  ON_NEW_COMMENT_VOTE_NOTIFICATION = "ON_NEW_COMMENT_VOTE_NOTIFICATION",
  ON_NEW_REPLY_VOTE_NOTIFICATION = "ON_NEW_REPLY_VOTE_NOTIFICATION",

  // comment related

  ON_COMMENT_DELETE = "ON_COMMENT_DELETE",
  ON_COMMENT_UPDATE = "ON_COMMENT_UPDATE",
  ON_CREATE_COMMENT = "ON_CREATE_COMMENT",

  // reply related
  ON_REPLY_UPDATE = "ON_REPLY_UPDATE",
  ON_REPLY_DELETE = "ON_REPLY_DELETE",
  ON_REPLY_CREATE = "ON_REPLY_CREATE",

  // blocks related
  ON_USER_BLOCKED_UNBLOCKED = "ON_USER_BLOCKED_UNBLOCKED",
  ON_USER_BLOCKED_ME_OR_UNBLOCKED_ME = "ON_USER_BLOCKED_ME_OR_UNBLOCKED_ME",

  // reaction related
  ON_COMMENT_VOTE = "ON_COMMENT_VOTE",
  ON_REPLY_VOTE = "ON_REPLY_VOTE",

  // payment related
  ON_PAY = "ON_PAY",

  // settings

  ON_USER_SETTINGS_UPDATE = "ON_USER_SETTINGS_UPDATE",
  ON_SETTINGS_UPDATE = "ON_SETTINGS_UPDATE",
}

export const serverURL = new URL("http://localhost:3001/");
