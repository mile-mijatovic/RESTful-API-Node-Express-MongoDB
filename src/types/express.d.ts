import { ObjectId } from "mongoose";
import { Session } from "express-session";

declare module "express-serve-static-core" {
  export interface Request {
    user: { id: ObjectId };
  }
}

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}
