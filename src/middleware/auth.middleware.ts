import { NextFunction, Request, Response } from "express";
import messages from "../utils/messages.json";
import { AuthenticationError } from "../errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/env";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session || !req.session.token) {
      return next(new AuthenticationError(messages.auth.unauthorized));
    }

    const decodedToken = jwt.verify(
      req.session.token,
      config.jwt.secret
    ) as JwtPayload;

    if (!decodedToken) {
      return next(new AuthenticationError(messages.auth.unauthorized));
    }

    req.user = { id: decodedToken.userId };

    next();
  } catch (error) {
    return next(new AuthenticationError(messages.auth.unauthorized));
  }
};

export default requireAuth;
