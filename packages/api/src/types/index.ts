export interface UserType {
  id?: number;
  name: string;
  avatar?: string;
  pin: string;
  phoneNumber: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  thoughtId?: number;
  countryId?: number;
  commentId?: number;
  pinTrials?: number;
}

export interface ThoughtType {
  id?: number;
  text: string;
  userId?: number;
}

export interface CountryType {
  id?: number;
  name: string;
  phoneCode: string;
  flag: string;
  countryCode: string;
}
