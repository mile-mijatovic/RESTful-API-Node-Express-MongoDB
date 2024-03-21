import { Model, ObjectId, Schema, model } from "mongoose";
import config from "../config/env";
import {
  AuthenticationError,
  NotFoundError,
  TokenError,
  ValidationError,
} from "../errors";
import emailService from "../services/email.service";
import {
  IChangePassword,
  ILogin,
  IUser,
  IUserDoc,
  IUserModel,
} from "../types/user";
import {
  deleteFile,
  generateRandomString,
  generateToken,
  hashPassword,
  joinPaths,
  verifyPassword,
} from "../utils";
import messages from "../assets/json/messages.json";
import Token from "./token.model";

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
    },
    email: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

class UserClass extends Model<IUserModel> {
  private static async isEmailExists(email: string): Promise<boolean> {
    return !!(await this.findOne({ email }));
  }

  private static async getUserByEmail(email: string): Promise<IUserDoc | null> {
    return await this.findOne({ email });
  }

  private static async updateUserImage(userId: ObjectId, image: string | null) {
    return this.findByIdAndUpdate(userId, {
      $set: {
        image,
      },
    });
  }

  static async getUserById(id: ObjectId): Promise<IUserDoc | null> {
    return await this.findById(id);
  }

  static async authenticateWithToken(credentials: ILogin): Promise<string> {
    const { email, password } = credentials;

    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new AuthenticationError(messages.auth.incorrectCredentials);
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      throw new AuthenticationError(messages.auth.incorrectCredentials);
    }

    const token = generateToken({ userId: user._id }, config.jwt.secret, {
      expiresIn: config.jwt.accessExpirationMinutes,
    });

    return token;
  }

  static async register(user: IUser): Promise<void> {
    const exists = await this.isEmailExists(user.email);

    if (exists) throw new ValidationError(messages.validation.email.exists);

    await this.create(user);
  }

  static async delete(id: string): Promise<number> {
    const count = await this.countDocuments({ _id: id });

    if (count > 0) {
      const { deletedCount } = await this.deleteOne({ _id: id });
      return deletedCount;
    } else {
      throw new NotFoundError(messages.user.notFound);
    }
  }

  static async forgotPassword(email: string) {
    const user = await this.getUserByEmail(email);

    if (user) {
      const resetToken = await generateRandomString();
      const expires = Date.now() + 3600000;

      await Token.generateToken(resetToken, user._id, expires);

      await emailService.sendResetPasswordEmail(email, resetToken);
    }
  }

  static async resetPassword(token: string, newPassword: string) {
    const tokenRecord = await Token.getToken(token);

    if (!tokenRecord) throw new TokenError(messages.auth.invalidToken);

    const user = await this.getUserById(tokenRecord.userId);

    if (!user) throw new NotFoundError(messages.user.notFound);

    (user as IUserDoc).password = newPassword;
    await user.save();
    await Token.deleteToken(tokenRecord._id);
  }

  static async changePassword(userId: ObjectId, password: IChangePassword) {
    const { newPassword, oldPassword, repeatPassword } = password;

    if (newPassword !== repeatPassword) {
      throw new ValidationError(messages.validation.password.notMatch);
    }

    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundError(messages.user.notFound);
    }

    const passwordMatch = await verifyPassword(oldPassword, user.password);

    if (!passwordMatch) {
      throw new ValidationError(messages.validation.password.incorrect);
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();
  }

  static async uploadImage(userId: ObjectId, filename: string): Promise<void> {
    await this.resetImage(userId);
    await this.updateUserImage(userId, filename);
  }

  static async resetImage(userId: ObjectId): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundError(messages.user.notFound);
    }

    const { image } = user;

    if (image) {
      const imagePath = joinPaths(image);
      await deleteFile(imagePath);
    }

    await this.updateUserImage(userId, null);
  }
}

userSchema.loadClass(UserClass);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = model<IUserDoc, IUserModel>("User", userSchema, "users");

export default User;
