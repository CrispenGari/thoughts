export type TContact = {
  contactName: string;
  phoneNumbers: {
    phoneNumber: string;
    countryCode: string;
  }[];
};

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};

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

export interface SurveyType {
  id?: number;
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentType {
  id?: number;
  category: "active_status" | "general";
  type: "e-payment" | "cash";
  currency: string;
  price: number;
  userId?: number;

  createdAt?: Date;
  updatedAt?: Date;
  // relations
  user?: UserType;
}

export interface SettingType {
  id?: number;
  activeStatus: boolean;
  notifications: boolean;
  userId?: number;

  createdAt?: Date;
  updatedAt?: Date;
  // relations
  user?: UserType;
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
}

export interface ReplyType {
  id?: number;
  text: string;
  commentId: number;
  userId: number;
  voteCount?: number;

  createdAt?: Date;
  updatedAt?: Date;

  // relations
  user?: UserType;
  comment?: CommentType;
}
export interface BlockedType {
  id?: number;
  phoneNumber: string;
  userId: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface VoteType {
  id?: number;
  commentId?: number;
  replyId?: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CommentType {
  id?: number;

  text: string;
  userId?: number;
  thoughtId: number;
  voteCount?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // relations
  votes?: VoteType[];
  user?: UserType;
  replies?: ReplyType[];
}

export interface CountryType {
  id?: number;
  name: string;
  phoneCode: string;
  flag: string;
  countryCode: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserType {
  id?: number;
  name: string;
  avatar?: string;
  pin: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE" | "TRANS-GENDER";
  passkey: string;
  passkeyQuestion: string;
  bio: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  pinTrials?: number;
  tokenVersion: number;

  // relations
  country?: CountryType;
  blocked?: BlockedType[];
  setting?: SettingType;
  payments?: PaymentType[];
}
