import Joi from "joi";

export const createBlogPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .required(),

  subtitle: Joi.string().allow("").optional(),

  readingTime: Joi.string().optional(),

  category: Joi.array().items(Joi.string()).default([]),

  hero: Joi.object({
    imageUrl: Joi.string().uri().required(),
    caption: Joi.string().allow("").optional(),
    altText: Joi.string().allow("").optional()
  }).required(),

  content: Joi.object().required(),

  seo: Joi.object({
    metaTitle: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    keywords: Joi.array().items(Joi.string()).default([]),
    ogImage: Joi.string().uri().allow("").optional()
  }).optional(),

  isPublished: Joi.boolean().default(false),
  allowNewsletter: Joi.boolean().default(true)
});