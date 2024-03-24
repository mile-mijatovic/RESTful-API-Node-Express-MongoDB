import Joi from 'joi';
import { passwordRegex } from './regexPatterns';
import { ValidationSchema } from '../types/enums';

export const changePasswordSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    oldPassword: Joi.string().required().label('Old password'),
    newPassword: Joi.string()
      .regex(passwordRegex)
      .required()
      .label('New password'),
    repeatPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .label('Repeated password'),
  }),
};
