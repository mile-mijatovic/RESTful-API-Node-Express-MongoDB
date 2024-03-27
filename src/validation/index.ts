import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from './auth.validation';
import contactSchema from './contact.validation';
import envVarsSchema from './env.validation';
import { uploadSchema, changePasswordSchema } from './profile.validation';
import objectIdSchema from './objectId.validation';

export {
  contactSchema,
  envVarsSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
  registerSchema,
  uploadSchema,
  changePasswordSchema,
  objectIdSchema,
};
