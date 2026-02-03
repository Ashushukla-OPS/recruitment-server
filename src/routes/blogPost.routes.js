import { Router } from "express";
import BlogPostController from "../controllers/blogPost.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();


router.post(
  "/",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  BlogPostController.createBlogPost
);


router.get("/", BlogPostController.getBlogPosts);
router.get("/slug/:slug", BlogPostController.getBlogPostBySlug);
router.get("/:id", BlogPostController.getBlogPostById);


router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  BlogPostController.updateBlogPost
);


router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  BlogPostController.deleteBlogPost
);

export default router;
