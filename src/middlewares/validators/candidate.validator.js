import Joi from "joi";


const candidateSchema = Joi.object({
     name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email:Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    skills: Joi.array()
      .items(Joi.string())
      .min(1)
      .required(),
    yearOfExperience:Joi.number()
      .integer()
      .min(0)
      .required(),
    preferredRole: Joi.array()
      .items(Joi.string())
      .min(1)
      .required(),
    resume: Joi.string()
      .uri()
      .optional()
}).options({ stripUnknown: true })
export default candidateSchema