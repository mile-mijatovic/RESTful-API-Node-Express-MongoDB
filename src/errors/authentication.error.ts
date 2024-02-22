import { HttpStatusCode } from "../types/enums";
import { ApiError } from "./api.error";

export class AuthenticationError extends ApiError {
  constructor(message = "") {
    super(message, HttpStatusCode.UNAUTHORIZED);
    this.name = "AuthenticationError";
  }
}
