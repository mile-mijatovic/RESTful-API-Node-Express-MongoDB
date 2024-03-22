import { NextFunction, Request, Response } from 'express';
import { AuthenticationError } from '../errors';
import { IUser } from '../types/user';
import { asyncHandler } from '../utils';
import messages from '../assets/json/messages.json';
import { UserService } from '../services';

// Register new user
export const register = asyncHandler(
  async (req: Request<IUser>, res: Response) => {
    await UserService.register(req.body);

    return res
      .status(201)
      .json({ success: true, message: messages.auth.registered });
  }
);

// Login with email and password
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = await UserService.authenticate(req.body);

    req.session.token = token;

    return res
      .status(200)
      .json({ success: true, message: messages.auth.loggedIn });
  }
);

// Send password reset email
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.sendPasswordResetEmail(req.body.email);

    return res.status(200).json({
      success: true,
      message: messages.auth.resetPassword,
    });
  }
);

// Reset password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    await UserService.resetPassword(token as string, newPassword);

    return res.status(200).json({
      success: true,
      message: messages.auth.successfullyResetPassword,
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) return next(new AuthenticationError(err.message));

      return res
        .status(200)
        .json({ success: true, message: messages.auth.loggedOut });
    });
  }
);
