import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.route) {
    return next(new NotFoundError('Page is not found'));
  }
};

export default notFoundHandler;
