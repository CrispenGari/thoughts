export interface ThoughtType {
  id?: number;
  text: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  // relations
  user?: UserType;
  comments?: CommentType[];
}
export interface NotificationType {
  id?: number;
  title: string;
  thoughtId: number;
  userId: number;
  read: boolean;

  type?: "comment" | "reply" | "comment_reaction" | "reply_reaction";
  createdAt?: Date;
  updatedAt?: Date;
  // relations
  user?: UserType;
  thought?: ThoughtType;
}

export interface ReplyType {
  id?: number;
  text: string;
  commentId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;

  // relations
  user?: UserType;
}
export interface BlockedType {
  id?: number;
  phoneNumber: string;
  userId: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpVoteType {
  id?: number;
  commentId?: number;
  replyId?: number;
  userId: number;

  createdAt?: Date;
  updatedAt?: Date;
}
export type DownVoteType = UpVoteType;
export interface CommentType {
  id?: number;
  text: string;
  userId?: number;
  thoughtId: number;
  createdAt?: Date;
  updatedAt?: Date;

  // relations
  upvotes?: UpVoteType[];
  downvotes?: DownVoteType[];
  user?: UserType;
  replies?: ReplyType[];
}

export interface CountryType {
  id?: number;
  name: string;
  phoneCode: string;
  flag: string;
  countryCode: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserType {
  id?: number;
  name: string;
  avatar?: string;
  pin: string;
  phoneNumber: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  countryId?: number;
  pinTrials?: number;
  tokenVersion: number;

  // relations
  country?: CountryType;
  blocked?: UserType[];
}
