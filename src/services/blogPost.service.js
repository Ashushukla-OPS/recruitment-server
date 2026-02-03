import { AppError } from "../utils/errors.js";
import MongoBlogPostRepository from "../repositories/implementations/mongoBlogPostRepository.js";
import logger from "../utils/logger.js";

class BlogPostService {
  constructor() {
    this.blogRepo = new MongoBlogPostRepository();
  }

   async createBlogPost(data) {
    const blogData = {
    title: data.title,
    slug: data.slug,
    author: data.author,

    subtitle: data.subtitle ?? "",
    readingTime: data.readingTime ?? "0 min read",
    category: data.category ?? [],

    hero: {
      imageUrl: data.hero?.imageUrl,
      caption: data.hero?.caption ?? "",
      altText: data.hero?.altText ?? ""
    },

    content: data.content ?? {},

    seo: {
      metaTitle: data.seo?.metaTitle ?? data.title,
      metaDescription: data.seo?.metaDescription ?? "",
      keywords: data.seo?.keywords ?? [],
      ogImage: data.seo?.ogImage ?? ""
    },

    isPublished: data.isPublished ?? false,
    allowNewsletter: data.allowNewsletter ?? true,
    publishedAt: data.isPublished ? new Date() : null
  };

  return await this.blogRepo.create(blogData);
}

  async getBlogPosts(query) {
  const { page, limit, category } = query;

  
  const filter = {
    isPublished: true,
    ...(category && { category })
  };

  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    this.blogRepo.findPaginated(filter, skip, limit),
    this.blogRepo.count(filter)
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
      
      logger.warn("Failed to update blog view count", {
        blogId: blogPost._id,
        error: error.message
      });
    }

    return blogPost;
  }

  async updateBlogPost(id, data) {
  const existingBlog = await this.blogRepo.findById(id);
  if (!existingBlog) {
    throw new AppError("Blog not found", 404);
  }

  const ALLOWED_FIELDS = [
    "title",
    "subtitle",
    "content",
    "category",
    "hero",
    "seo",
    "isPublished"
  ];

  const updates = {};
  for (const key of ALLOWED_FIELDS) {
    if (data[key] !== undefined) {
      updates[key] = data[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  if (updates.isPublished === true && !existingBlog.publishedAt) {
    updates.publishedAt = new Date();
  }

  if (updates.isPublished === false) {
    updates.publishedAt = null;
  }

  return await this.blogRepo.updateById(id, updates);
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



