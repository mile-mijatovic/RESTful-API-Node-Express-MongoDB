export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  UNPROCESSABLE_ENTITY = 422,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INVALID_TOKEN = 498,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ValidationSchema {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
}
