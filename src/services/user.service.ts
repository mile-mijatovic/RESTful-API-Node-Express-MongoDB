import User from '../models/user.model';
import { ILogin, IUser } from '../types/user';
import messages from '../assets/json/messages.json';
import { AuthenticationError, NotFoundError, TokenError } from '../errors';
import { generateRandomString, generateToken, verifyPassword } from '../utils';
import config from '../config/env';
import Token from '../models/token.model';
import { EmailService } from '.';

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
}

export default UserService;
