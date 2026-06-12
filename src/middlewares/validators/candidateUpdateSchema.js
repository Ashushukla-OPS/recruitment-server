import Joi from "joi";

const updateCandidateSchema= Joi.object({
   name: Joi.string().min(3).max(50),

   email: Joi.string().email(),

   phone: Joi.string()
      .pattern(/^[0-9]{10}$/),

   skills: Joi.array()
      .items(Joi.string())
      .min(1),

   yearOfExperience: Joi.number()
      .min(0),

   preferredRole: Joi.array()
      .items(Joi.string())
      .min(1)
}).options({stripUnknown:true})
export default updateCandidateSchema


