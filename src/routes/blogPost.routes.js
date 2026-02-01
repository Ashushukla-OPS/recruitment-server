import { Router } from 'express';
import * as blogController from '../controllers/blogPost.controller.js';
import authhenticateJWT from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/role.middleware.js';


const router = Router();

router.post('/', authhenticateJWT, authorizeRoles('ADMIN'), blogController.createBlogPost);
router.get('/', blogController.getBlogPosts);
router.get('/slug/:slug', blogController.getBlogPostBySlug);
router.get('/:id', blogController.getBlogPostById);
router.put('/:id', authhenticateJWT, authorizeRoles('ADMIN'), blogController.updateBlogPost);
router.delete('/:id', authhenticateJWT, authorizeRoles('ADMIN'), blogController.deleteBlogPost);

export default router;