import { Request, Response, NextFunction } from "express";
import Joi, { ObjectPropertiesSchema } from "joi";
import pick from "lodash.pick";
import { ValidationSchema } from "../types/enums";

const validation =
  (schema: ObjectPropertiesSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, [
      ValidationSchema.PARAMS,
      ValidationSchema.QUERY,
      ValidationSchema.BODY,
    ]);
    const object = pick(req, Object.keys(validSchema));

    const { error, value } = Joi.compile(validSchema).validate(object, {
      abortEarly: false,
    });

    if (error) {
      return next(error);
    }
    Object.assign(req, value);
    next();
  };

export default validation;
