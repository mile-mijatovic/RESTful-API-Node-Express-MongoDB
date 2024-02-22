import { HttpStatusCode } from "../types/enums";
import { ApiError } from "./api.error";

export class ValidationError extends ApiError {
  constructor(message = "") {
    super(message, HttpStatusCode.BAD_REQUEST);
    this.name = "ValidationError";
  }
}
