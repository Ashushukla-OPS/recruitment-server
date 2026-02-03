import { Router } from "express";
import BlogPostController from "../controllers/blogPost.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import {createBlogPostSchema} from "../middlewares/validators/blogPost.validator.js";
import {blogListQuerySchema} from "../middlewares/validators/blogPost.query.validator.js";


const router = Router();

router.use(authenticateJWT);


router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin"),
  validateRequest(createBlogPostSchema),
  BlogPostController.createBlogPost
);


router.get("/",
  validateRequest(blogListQuerySchema, "query"),
  BlogPostController.getBlogPosts
);

router.get("/slug/:slug", BlogPostController.getBlogPostBySlug);
router.get("/:id", BlogPostController.getBlogPostById);


router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  BlogPostController.updateBlogPost
);


router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  BlogPostController.deleteBlogPost
);

export default router;
