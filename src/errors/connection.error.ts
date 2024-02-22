import { HttpStatusCode } from "../types/enums";
import { ApiError } from "./api.error";

export class ConnectionError extends ApiError {
  constructor(message = "") {
    super(message, HttpStatusCode.SERVICE_UNAVAILABLE);
    this.name = "ConnectionError";
  }
}
