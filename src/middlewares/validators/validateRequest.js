import { AppError } from "../../utils/errors.js";

const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,      // collect all errors
      stripUnknown: true      // remove unwanted fields
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    // overwrite request with validated & sanitized data
    req[property] = value;
    next();
  };
};

export default validateRequest;

