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

  
  async getBlogPosts(options = {}) {

  let {
    limit = 10,
    skip = 0,
    category,
    isPublished
  } = options;

  
  const filter = {};

  if (category) filter.category = category;
  if (isPublished !== undefined) filter.isPublished = isPublished;

  const [blogs, total] = await Promise.all([
    this.blogRepo.findPaginated(filter, skip, limit),
    this.blogRepo.count(filter)
  ]);

  return {
    blogs,
    pagination: {
      total,
      skip,
      limit,
      hasNext: skip + limit < total,
      hasPrev: skip > 0
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
    if (!blogPost) throw new AppError("Blog not found", 404);

    
    this.blogRepo.updateById(blogPost._id, {
      $inc: { "stats.views": 1 } 
    }).catch(err => logger.warn("Failed to update view count", { error: err.message }));

    return blogPost;
  }

  async updateBlogPost(id, data) {

  const existingBlog = await this.blogRepo.findById(id);
  if (!existingBlog) {
    throw new AppError("Blog not found", 404);
  }

  
  if (data.createdAt || data.updatedAt) {
    throw new AppError("Immutable fields cannot be updated", 400);
  }

  const updates = {};

  
  const flatFields = [
    "title",
    "subtitle",
    "readingTime",
    "category",
    "content",
    "isPublished"
  ];

  for (const field of flatFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  
  if (data.hero) {
    for (const key in data.hero) {
      updates[`hero.${key}`] = data.hero[key];
    }
  }

  
  if (data.seo) {
    for (const key in data.seo) {
      updates[`seo.${key}`] = data.seo[key];
    }
  }

  
  if (data.isPublished === true && !existingBlog.publishedAt) {
    updates.publishedAt = new Date();
  }

  if (data.isPublished === false) {
    updates.publishedAt = null;
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided", 400);
  }

  return await this.blogRepo.updateById(
    id,
    { $set: updates }
  );
}


  async deleteBlogPost(id) {
    const blog = await this.blogRepo.deleteById(id);
    if (!blog) throw new AppError("Blog not found", 404);
    return { success: true, message: "Blog deleted successfully" };
  }
}

export default new BlogPostService();
