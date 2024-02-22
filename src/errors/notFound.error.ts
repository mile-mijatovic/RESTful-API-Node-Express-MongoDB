import { HttpStatusCode } from "../types/enums";
import { ApiError } from "./api.error";

export class NotFoundError extends ApiError {
  constructor(message = "") {
    super(message, HttpStatusCode.NOT_FOUND);
    this.name = "NotFound";
  }
}
