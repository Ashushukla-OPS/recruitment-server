import joi from "joi";  

const candidateSchema = joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    phone:joi.string().required(),
    skills:joi.array().required(),
    yearOfExperience:joi.number().required(),
    preferredRole:joi.array().required(),
    resume:joi.string()
})  
export default candidateSchema