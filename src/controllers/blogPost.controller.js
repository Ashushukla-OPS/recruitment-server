import BlogPostService from "../services/blogPost.service.js";
import { successResponse } from "../utils/apiResponse.js";

class BlogPostController {
  constructor() {
    this.blogService = BlogPostService;
  }

  createBlogPost = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.createBlogPost(req.body);
      successResponse(res, blogPost, "Blog created successfully", 201);
    } catch (error) {
      next(error);
    }
  };

  getBlogPosts = async (req, res, next) => {
  try {
    const query = req.validatedQuery || req.query;
    
    
    const options = {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      ...query
    };

    const result = await this.blogService.getBlogPosts(options);
    successResponse(res, result, "Blog posts retrieved successfully");
  } catch (error) {
    next(error);
  }
};

  
  getBlogPostById = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.getBlogPostById(req.params.id);
      successResponse(res, blogPost, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  getBlogPostBySlug = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.getBlogPostBySlug(req.params.slug);
      successResponse(res, blogPost, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  updateBlogPost = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.updateBlogPost(req.params.id, req.body);
      successResponse(res, blogPost, "Blog updated successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteBlogPost = async (req, res, next) => {
    try {
      const result = await this.blogService.deleteBlogPost(req.params.id);
      successResponse(res, result, "Blog deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}

export default new BlogPostController();




