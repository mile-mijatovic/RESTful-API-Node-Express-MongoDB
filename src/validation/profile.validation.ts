import Joi from 'joi';
import { image, passwordRegex } from './regexPatterns';
import { ValidationSchema } from '../types/enums';

export const uploadSchema = {
  [ValidationSchema.FORM_DATA]: Joi.object().keys({
    image: Joi.object({
      data: Joi.binary()
        .max(5 * 1024 * 1024)
        .required()
        .label('Image'),
      contentType: Joi.string().regex(image).label('.jpeg, .jpg, .png, .gif'),
    }),
  }),
};

export const changePasswordSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    oldPassword: Joi.string().required().label('Old password'),
    newPassword: Joi.string()
      .regex(passwordRegex)
      .required()
      .label('New password'),
    repeatPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .label('Repeated password'),
  }),
};
