import { NextFunction, Request, Response } from "express";
import messages from "../assets/json/messages.json";
import { ApiError } from "../errors";
import Joi, { ValidationErrorItem } from "joi";
import { HttpStatusCode } from "../types/enums";

const getJoiMessage = (error: ValidationErrorItem) => {
  switch (error.type) {
    case "string.empty":
      return messages.validation.required;
    case "string.email":
      return messages.validation.email.invalid;
    case "string.pattern.base":
      if (error.context?.key === "email") {
        return messages.validation.email.invalid;
      } else if (
        error.context?.key === "password" ||
        error.context?.key === "newPassword"
      ) {
        return messages.validation.password.invalid;
      } else if (error.context?.key === "contactId") {
        return messages.validation.objectId.invalid;
      } else if (error.context?.key === "contentType") {
        return messages.validation.contentType.invalid;
      }
    case "date.base":
      return messages.validation.date.format;
    case "date.max":
      return messages.validation.date.invalid;
    case "any.only":
      return messages.validation.anyOnly.invalid;
    case "binary.max":
      return messages.validation.binaryMax.invalid;
    default:
      return error.message;
  }
};

interface ErrorResponse {
  statusCode: HttpStatusCode;
  message: string[] | string;
}

const parseJoiErrors = (error: Joi.ValidationError) => {
  return error.details.map((detail: ValidationErrorItem) => ({
    message: getJoiMessage(detail),
    label: detail.context?.label as string,
  }));
};

const generateErrorMessage = (
  error: Joi.ValidationError | ApiError | Error
): ErrorResponse => {
  if (error instanceof Joi.ValidationError) {
    const parsedErrors = parseJoiErrors(error);
    const message = parsedErrors.map(
      (error) => `${error.label} ${error.message}`
    );

    return { statusCode: HttpStatusCode.BAD_REQUEST, message };
  }

  if (error instanceof ApiError) {
    return { statusCode: error.status, message: error.message };
  }

  return {
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: error.message,
  };
};

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message } = generateErrorMessage(error);

  return res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
