import { Document, Model, ObjectId } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
  image: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export interface IUserDoc extends IUser, Document {}

export interface IUploadRequest extends Request {
  user: IUser;
  file: Express.Multer.File;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailExists(email: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<IUserDoc | null>;
  getUserById(id: ObjectId): Promise<IUserDoc | null>;
  uploadImage(userId: ObjectId, image: string | null): Promise<void | null>;
  deleteUser(userId: ObjectId): Promise<number>;
}
