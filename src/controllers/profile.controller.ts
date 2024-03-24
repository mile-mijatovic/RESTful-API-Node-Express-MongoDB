import { NextFunction, Request, Response } from 'express';
import messages from '../assets/json/messages.json';
import { ValidationError } from '../errors';
import { UserService } from '../services';
import { IChangePassword } from '../types/user';
import { asyncHandler, deleteFile } from '../utils';

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  const user = await UserService.getUserInfo(id);

  return res.status(200).json({ success: true, user });
});

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;

  try {
    if (!req.file) {
      throw new ValidationError(messages.image.notProvided);
    }

    await UserService.updateUserImage(id, req.file);
    res.status(200).json({ success: true, message: messages.image.uploaded });
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.path);
    }
    next(error);
  }
};

export const resetImage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  await UserService.updateUserImage(id);

  return res.status(200).json({
    success: true,
    message: messages.image.reset,
  });
});

export const changePassword = asyncHandler(
  async (req: Request<IChangePassword>, res: Response) => {
    const { id } = req.user;
    await UserService.changePassword(id, req.body);

    return res.status(200).json({
      success: true,
      message: messages.auth.successfullyResetPassword,
    });
  }
);

export const deleteProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.user;

    const deletedCount = await UserService.deleteProfile(id);

    if (deletedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: messages.auth.deletedProfile });
    } else {
      return res.status(404).json({
        success: false,
        message: messages.auth.noFoundProfileToDelete,
      });
    }
  }
);
