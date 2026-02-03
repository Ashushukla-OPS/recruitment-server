import { AppError } from "../utils/errors.js";
import MongoBlogPostRepository from "../repositories/implementations/mongoBlogPostRepository.js";
import logger from "../utils/logger.js";

class BlogPostService {
  constructor() {
    this.blogRepo = new MongoBlogPostRepository();
  }

    async createBlogPost(data) {
    return await this.blogRepo.create(data);
  }

  async getBlogPosts(filter = {}, page = 1, limit = 10) {
    const MAX_LIMIT = 50;

    page = Number(page);
    limit = Number(limit);

    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const skip = (page - 1) * limit;

    const finalFilter = {
      isPublished: true,
      ...filter
    };

    const [blogs, total] = await Promise.all([
      this.blogRepo.findPaginated(finalFilter, skip, limit),
      this.blogRepo.count(finalFilter)
    ]);

    return {
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    };
  }

  
  async getBlogPostById(id) {
    const blog = await this.blogRepo.findById(id);
    if (!blog) throw new AppError("Blog not found", 404);
    return blog;
  }

 
  async getBlogPostBySlug(slug) {
    const blogPost = await this.blogRepo.findBySlug(slug);

    if (!blogPost) {
      throw new AppError("Blog not found", 404);
    }

    try {
      await this.blogRepo.updateById(blogPost._id, {
        views: (blogPost.views || 0) + 1
      });
    } catch (error) {
      // view count failure should NOT break API
      logger.warn("Failed to update blog view count", {
        blogId: blogPost._id,
        error: error.message
      });
    }

    return blogPost;
  }

  
  async updateBlogPost(id, data) {
    const blog = await this.blogRepo.updateById(id, data);//check implement karne ga
    if (!blog) throw new AppError("Blog not found", 404);
    return blog;
  }

 
  async deleteBlogPost(id) {
    const blog = await this.blogRepo.deleteById(id);
    if (!blog) throw new AppError("Blog not found", 404);
    return {
      success: true,
      message: "Blog deleted successfully"
    };
  }
}

export default new BlogPostService();



