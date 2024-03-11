import { Request, Response } from "express";
import { ValidationError } from "../errors";
import User from "../models/user.model";
import { asyncHandler } from "../utils";
import messages from "../utils/messages.json";

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  const user = await User.findById({
    _id: id,
  }).select("-createdAt -updatedAt -__v -_id -password");

  return res.status(200).json({ success: true, user });
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  if (!req.file) {
    throw new ValidationError(messages.image.notProvided);
  }

  const { path: imagePath, filename, mimetype } = req.file;

  await User.uploadImage(id, imagePath, filename, mimetype);

  return res.status(200).json({
    success: true,
    message: messages.image.uploaded,
  });
});

export const resetImage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  await User.resetImage(id);

  return res.status(200).json({
    success: true,
    message: messages.image.reset,
  });
});

export const closeProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.user;

    const deletedCount = await User.delete(id);

    if (deletedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: messages.auth.deletedProfile });
    }
  }
);
