import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../errors";
import User from "../models/user.model";
import { IUser } from "../types/user";
import { asyncHandler } from "../utils";
import messages from "../assets/json/messages.json";

// Register new user
export const register = asyncHandler(
  async (req: Request<IUser>, res: Response) => {
    await User.register(req.body);

    return res
      .status(200)
      .json({ success: true, message: messages.auth.registered });
  }
);

// Login with email and password
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = await User.authenticateWithToken(req.body);

    req.session.token = token;

    return res
      .status(200)
      .json({ success: true, message: messages.auth.loggedIn });
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await User.forgotPassword(req.body.email);

    return res.status(200).json({
      success: true,
      message: messages.auth.resetPassword,
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    await User.resetPassword(token as string, newPassword);

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
