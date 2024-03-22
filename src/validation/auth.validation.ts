import Joi from 'joi';
import { passwordRegex } from './regexPatterns';
import { ValidationSchema } from '../types/enums';

export const loginSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  }),
};

export const registerSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    firstName: Joi.string().required().label('First name'),
    lastName: Joi.string().required().label('Last name'),
    birthDate: Joi.date().max(new Date()).label('Date of birth'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().regex(passwordRegex).required().label('Password'),
    repeatPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .label('Repeated password'),
  }),
};

export const forgotPasswordSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    email: Joi.string().email().required().label('Email'),
  }),
};

export const resetPasswordSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    newPassword: Joi.string()
      .regex(passwordRegex)
      .required()
      .label('New password'),
  }),
  [ValidationSchema.QUERY]: Joi.object().keys({
    token: Joi.string().required().label('Token'),
  }),
};
