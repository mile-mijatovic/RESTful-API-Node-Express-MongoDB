import { HttpStatusCode } from '../types/enums';
import { ApiError } from './api.error';

export class TokenError extends ApiError {
  constructor(message = '') {
    super(message, HttpStatusCode.INVALID_TOKEN);
    this.name = 'InvalidTokenError';
  }
}
