import Joi from "joi";

const envSchema = Joi.object({
  PORT: Joi.number().default(8000).messages({
    "number.base": "PORT must be a number",
    "number.integer": "PORT must be an integer",
  }),
  JWT_SECRET: Joi.string().required().messages({
    "any.required": "JWT_SECRET is a required field",
  }),
  SALT: Joi.number().messages({
    "number.base": "SALT must be a number",
    "number.integer": "SALT must be an integer",
  }),
  DATABASE_URL: Joi.string().uri().messages({
    "string.uri": "DATABASE_URL must be a valid URI",
  }),
  BCRYPT_SALT: Joi.number().messages({
    "number.base": "BCRYPT_SALT must be a number",
    "number.integer": "BCRYPT_SALT must be an integer",
  }),
  MONGODB_URL: Joi.string().uri().required().messages({
    "string.uri": "MONGODB_URL must be a valid URI",
    "any.required": "MONGODB_URL is a required field",
  }),
  SESSION_NAME: Joi.string().required().messages({
    "any.required": "SESSION_NAME is a required field",
  }),
  SESSION_COLLECTION_NAME: Joi.string().required().messages({
    "any.required": "SESSION_COLLECTION_NAME is a required field",
  }),
  SESSION_SECRET: Joi.string().required().messages({
    "any.required": "SESSION_SECRET is a required field",
  }),
  SMTP_HOST: Joi.string().required().messages({
    "any.required": "SMTP_HOST is a required field",
  }),
  SMTP_USERNAME: Joi.string().required().messages({
    "any.required": "SMTP_USERNAME is a required field",
  }),
  SMTP_PASSWORD: Joi.string().required().messages({
    "any.required": "SMTP_PASSWORD is a required field",
  }),
  EMAIL_FROM: Joi.string().required().messages({
    "any.required": "EMAIL_FROM is a required field",
  }),
  CLIENT_URL: Joi.string().required().messages({
    "any.required": "CLIENT_ID is a required field.",
  }),
}).options({ abortEarly: false });

export default envSchema;
