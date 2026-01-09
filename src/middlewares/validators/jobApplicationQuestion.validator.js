import Joi from "joi";
import mongoose from "mongoose";
import { AppError } from "../../utils/errors.js";



/**
 * Job Application Question Joi Schema
 */
const jobApplicationQuestionSchema = Joi.object({
  jobId: objectId.required().messages({
    "any.required": "Job ID is required",
  }),

  title: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Question title is required",
      "string.min": "Question title must be at least 5 characters",
      "string.max": "Question title cannot exceed 500 characters",
    }),

  inputType: Joi.string()
    .valid(
      "text",
      "textarea",
      "radio",
      "checkbox",
      "dropdown",
      "yes-no",
      "file",
      "date",
      "number",
      "rating"
    )
    .required()
    .messages({
      "any.only": "Invalid input type",
      "any.required": "Input type is required",
    }),

  description: Joi.string()
    .max(1000)
    .allow("", null)
    .messages({
      "string.max": "Description cannot exceed 1000 characters",
    }),

  options: Joi.when("inputType", {
    is: Joi.valid("radio", "checkbox", "dropdown"),
    then: Joi.array()
      .items(Joi.string().trim().min(1))
      .min(1)
      .required()
      .messages({
        "array.base": "Options must be an array",
        "array.min":
          "Options are required for radio, checkbox, or dropdown questions",
        "any.required":
          "Options are required for radio, checkbox, or dropdown questions",
      }),
    otherwise: Joi.array().items(Joi.string()).default([]),
  }),

  isRequired: Joi.boolean().default(false),

  isKnockout: Joi.boolean().default(false),

  knockoutValue: Joi.when("isKnockout", {
    is: true,
    then: Joi.string().required().messages({
      "any.required": "Knockout value is required when isKnockout is true",
    }),
    otherwise: Joi.string().allow(null),
  }),

  order: Joi.number().integer().min(0).default(0),

  placeholder: Joi.string().allow("", null),

  maxLength: Joi.number().integer().min(1),
});

/**
 * Helper for MongoDB ObjectId validation
 */
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid Job ID");
  }
  return value;
});


