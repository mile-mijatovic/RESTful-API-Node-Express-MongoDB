import { NextFunction, Request, Response } from "express";
import messages from "../assets/json/messages.json";
import { AuthenticationError } from "../errors";
import config from "../config/env";
import { verifyToken } from "../utils";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session || !req.session.token) {
      return next(new AuthenticationError(messages.auth.unauthorized));
    }

    const decodedToken = await verifyToken(
      req.session.token,
      config.jwt.secret
    );

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
