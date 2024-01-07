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
  userId?: string;
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
