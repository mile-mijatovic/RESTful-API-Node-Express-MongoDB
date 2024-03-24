import User from '../models/user.model';
import { IChangePassword, ILogin, IUser } from '../types/user';
import messages from '../assets/json/messages.json';
import {
  AuthenticationError,
  NotFoundError,
  TokenError,
  ValidationError,
} from '../errors';
import {
  deleteFile,
  generateRandomString,
  generateToken,
  getFileSize,
  hashPassword,
  joinPaths,
  readFile,
  verifyPassword,
} from '../utils';
import config from '../config/env';
import Token from '../models/token.model';
import { EmailService } from '.';
import { ObjectId } from 'mongoose';

class UserService extends EmailService {
  /**
   * Register new user
   * @param user firstName, lastName, birthDate, email, password,
   */
  static async register(user: IUser): Promise<void> {
    const existingUser = await User.getUserByEmail(user.email);
    if (existingUser) {
      throw new Error(messages.validation.email.exists);
    }

    await User.create(user);
  }

  /**
   * User authentication (login)
   * @param credentials email and password
   * @returns jwt token
   */
  static async authenticate(credentials: ILogin): Promise<string> {
    const { email, password } = credentials;
    const user = await User.getUserByEmail(email);

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

  /**
   * Get profile information
   * @param userId objectId
   * @returns information about logged in user without excluded fields
   */
  static async getUserInfo(userId: ObjectId) {
    const excludedFields = '-createdAt -updatedAt -__v -_id -password';
    return await User.findById(userId).select(excludedFields);
  }

  /**
   * Send password reset email
   * @param email valid email address
   */
  static async sendPasswordResetEmail(email: string) {
    const user = await User.getUserByEmail(email);

    if (user) {
      const resetToken = await generateRandomString();
      const expires = Date.now() + 3600000;

      await Token.generateToken(resetToken, user._id, expires);

      await EmailService.sendResetPasswordEmail(email, resetToken);
    }
  }

  /**
   * Reset user password
   * @param token generated token with node crypto.randomBytes
   * @param newPassword new password
   */
  static async resetPassword(token: string, newPassword: string) {
    const tokenRecord = await Token.getToken(token);

    if (!tokenRecord) throw new TokenError(messages.auth.invalidToken);

    const user = await User.getUserById(tokenRecord.userId);

    if (!user) throw new NotFoundError(messages.user.notFound);

    user.password = newPassword;
    await user.save();
    await Token.deleteToken(tokenRecord._id);
  }

  /**
   * Change user password
   * @param userId id of logged in user
   * @param password new password
   */
  static async changePassword(userId: ObjectId, password: IChangePassword) {
    const { newPassword, oldPassword, repeatPassword } = password;

    if (newPassword !== repeatPassword) {
      throw new ValidationError(messages.validation.password.notMatch);
    }

    const user = await User.getUserById(userId);

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

  /**
   * Delete existing one and update user avatar image
   * @param userId ObjectId (id of logged in user)
   * @param file Express.Multer.File | null image file or null to reset image
   */
  static async updateUserImage(userId: ObjectId, file?: Express.Multer.File) {
    const existingUser = await User.getUserById(userId);

    if (existingUser && existingUser.image) {
      await deleteFile(joinPaths(existingUser.image));
    }

    await User.uploadImage(userId, file ? file.filename : null);
  }

  /**
   * Delete your profile
   * @param userId id of logged in user
   * @returns deletion count (1 if successful, 0 if it's not)
   */
  static async deleteProfile(userId: ObjectId): Promise<number> {
    return await User.deleteUser(userId);
  }
}

export default UserService;
