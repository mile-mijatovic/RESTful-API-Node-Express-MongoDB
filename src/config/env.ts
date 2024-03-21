import "dotenv/config";
import { envVarsSchema } from "../validation";
import { ValidationError } from "../errors";

const { value: envVars, error } = envVarsSchema.unknown().validate(process.env);

if (error)
  throw new ValidationError(`Config validation error: ${error.message}`);

const {
  PORT,
  SALT,
  MONGODB_URL,
  JWT_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  COOKIE_EXPIRATION_MINUTES,
  SESSION_NAME,
  SESSION_COLLECTION_NAME,
  SESSION_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  EMAIL_FROM,
  CLIENT_URL,
} = envVars;

const config = {
  port: PORT,
  salt: SALT,
  mongoose: {
    url: MONGODB_URL,
  },
  jwt: {
    secret: JWT_SECRET,
    accessExpirationMinutes: JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  },
  session: {
    name: SESSION_NAME,
    collectionName: SESSION_COLLECTION_NAME,
    secret: SESSION_SECRET,
    cookie: {
      expiration: COOKIE_EXPIRATION_MINUTES,
    },
  },
  email: {
    smtp: {
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    },
    from: EMAIL_FROM,
  },
  clientUrl: CLIENT_URL,
};

export default config;
