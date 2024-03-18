import Joi from "joi";
import { ValidationSchema } from "../types/enums";

const contactSchema = {
  [ValidationSchema.BODY]: Joi.object().keys({
    firstName: Joi.string().required().label("First name"),
    lastName: Joi.string().required().label("Last name"),
    contact: Joi.object({
      email: Joi.string().email().required().label("Email"),
      telephoneNumber: Joi.string().allow(null).label("Telephone number"),
      mobileNumber: Joi.string().allow(null).label("Mobile number"),
      fax: Joi.string().allow(null).label("Fax"),
      image: Joi.string().allow(null).label("Image"),
    }),
    address: Joi.object({
      street: Joi.string().required().label("Street"),
      city: Joi.string().required().label("City"),
      zipCode: Joi.number().required().label("Zip Code"),
    }),
    additionalInfo: Joi.object({
      birthDate: Joi.date().label("Birth date"),
      companyName: Joi.string().label("Company name"),
      position: Joi.string().label("Position"),
      companyAddress: Joi.string().label("Company address"),
      additionalDetails: Joi.string().label("Additional details"),
    }),
    social: Joi.object({
      facebook: Joi.string().allow(null).label("Facebook"),
      twitter: Joi.string().allow(null).label("Twitter"),
      instagram: Joi.string().allow(null).label("Instagram"),
      linkedin: Joi.string().allow(null).label("Linkedin"),
      slack: Joi.string().allow(null).label("Slack"),
      skype: Joi.string().allow(null).label("Skype"),
    }),
  }),
};

export default contactSchema;
