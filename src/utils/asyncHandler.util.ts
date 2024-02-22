import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (func: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(func(req, res, next));
    } catch (error) {
      next(error);
    }
  };

export default asyncHandler;
