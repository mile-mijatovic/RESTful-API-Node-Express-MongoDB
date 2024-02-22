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
  uploadImage(
    userId: ObjectId,
    imagePath: string,
    filename: string,
    mimetype: string
  ): Promise<void>;
  resetImage(id: ObjectId): Promise<void>;
  delete(id: ObjectId): Promise<number>;
}
