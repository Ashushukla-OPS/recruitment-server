import BlogPostRepository from "../contracts/IBlogPostRepository.js";
import BlogPostModel from "../../models/blogPost.model.js";
import { AppError } from "../../utils/errors.js";

class MongoBlogPostRepository extends BlogPostRepository {

  async create(data) {
    try {
      const blogPost = new BlogPostModel(data);
      return await blogPost.save();
    } catch (error) {
      throw new AppError("Failed to create blog post", 500);
    }
  }

  async findPaginated(filter, skip, limit) {
    // 🔒 ENFORCE LIMIT: 1–10
    limit = Number(limit);
    if (!limit || limit < 1) limit = 1;
    if (limit > 10) limit = 10;

    try {
      return await BlogPostModel.find(filter)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      throw new AppError("Failed to fetch blog posts", 500);
    }
  }

  async count(filter) {
    try {
      return await BlogPostModel.countDocuments(filter);
    } catch (error) {
      throw new AppError("Failed to count blog posts", 500);
    }
  }

  async findById(id) {
    try {
      return await BlogPostModel.findById(id)
        .populate("author", "name email");
    } catch (error) {
      throw new AppError("Failed to find blog post", 500);
    }
  }

  async findBySlug(slug) {
    try {
      return await BlogPostModel.findOne({ slug })
        .populate("author", "name");
    } catch (error) {
      throw new AppError("Failed to find blog post", 500);
    }
  }

  async updateById(id, data) {
    try {
      return await BlogPostModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new AppError("Failed to update blog post", 500);
    }
  }

  async deleteById(id) {
    try {
      return await BlogPostModel.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete blog post", 500);
    }
  }
}

export default MongoBlogPostRepository;


