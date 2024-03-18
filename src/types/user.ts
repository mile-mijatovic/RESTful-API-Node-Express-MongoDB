import { Document, Model, ObjectId } from "mongoose";

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
  authenticateWithToken(credentials: ILogin): Promise<string>;
  register(user: IUser): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  uploadImage(userId: ObjectId, filename: string): Promise<void>;
  changePassword(id: ObjectId, payload: IChangePassword): Promise<void>;
  resetImage(id: ObjectId): Promise<void>;
  delete(id: ObjectId): Promise<number>;
}
