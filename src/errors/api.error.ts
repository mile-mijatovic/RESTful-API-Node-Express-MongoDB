import { HttpStatusCode } from "../types/enums";

export class ApiError extends Error {
  status: HttpStatusCode;

  constructor(errorMessage: string, status: HttpStatusCode) {
    super(errorMessage);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
