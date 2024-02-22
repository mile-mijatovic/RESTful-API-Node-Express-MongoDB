import Joi from "joi";
import { image } from "./regexPatterns";

const uploadSchema = Joi.object({
  image: Joi.object({
    data: Joi.binary()
      .max(5 * 1024 * 1024)
      .required()
      .label("Image"),
    contentType: Joi.string().regex(image).label(".jpeg, .jpg, .png, .gif"),
  }),
});

export default uploadSchema;
