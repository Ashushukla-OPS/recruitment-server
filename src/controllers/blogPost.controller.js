import BlogPostService from "../services/blogPost.service.js";

class BlogPostController {
  constructor() {
    this.blogService = BlogPostService; 
  }

  createBlogPost = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.createBlogPost(req.body);
      res.status(201).json(blogPost);
    } catch (error) {
      next(error);
    }
  };

  getBlogPosts = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const filter = {};

      if (req.query.category) {
        filter.category = req.query.category;
      }

      const result = await this.blogService.getBlogPosts(filter, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBlogPostById = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.getBlogPostById(req.params.id);
      res.status(200).json(blogPost);
    } catch (error) {
      next(error);
    }
  };

  getBlogPostBySlug = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.getBlogPostBySlug(req.params.slug);
      res.status(200).json(blogPost);
    } catch (error) {
      next(error);
    }
  };

  updateBlogPost = async (req, res, next) => {
    try {
      const blogPost = await this.blogService.updateBlogPost(
        req.params.id,
        req.body// data is not directly
      );
      res.status(200).json(blogPost);
    } catch (error) {
      next(error);
    }
  };

  deleteBlogPost = async (req, res, next) => {
    try {
      const result = await this.blogService.deleteBlogPost(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new BlogPostController();




