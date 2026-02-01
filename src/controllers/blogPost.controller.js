import * as blogService from "../services/blogPost.service.js";

export const createBlogPost = async (req, res, next) => {
  try {
    const blogPost = await blogService.createBlogPost(req.body);
    res.status(201).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const getBlogPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const result = await blogService.getBlogPosts(filter, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBlogPostById = async (req, res, next) => {
  try {
    const blogPost = await blogService.getBlogPostById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const blogPost = await blogService.getBlogPostBySlug(req.params.slug);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const blogPost = await blogService.updateBlogPost(req.params.id, req.body);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const blogPost = await blogService.deleteBlogPost(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

