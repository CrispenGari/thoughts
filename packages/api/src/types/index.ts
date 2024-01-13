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

  type?: "comment" | "reply" | "reaction";
  createdAt?: Date;
  updatedAt?: Date;
  // relations
  user?: UserType;
  thought?: ThoughtType;
}

export interface CommentType {
  id?: number;
  text: string;
  userId?: number;
  commentId?: number;
  thoughtId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  user?: UserType;
  replies?: CommentType[];
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

  // relations
  country?: CountryType;
}
