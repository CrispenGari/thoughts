export interface UserType {
  id?: number;
  name: string;
  avatar?: string;
  password: string;
  phoneNumber: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  thoughtId?: number;
  commentId?: number;
}
