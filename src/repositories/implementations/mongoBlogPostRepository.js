import BlogPostRepository from "../contracts/IBlogPostRepository.js";
import BlogPostModel from "../../models/blogPost.model.js";

class MongoBlogPostRepository extends BlogPostRepository {

  async create(data) {
    const blogPost = new BlogPostModel(data);
    return await blogPost.save();
  }

  async findPaginated(filter, skip, limit) {
  
  const finalSkip = Number(skip) || 0;
  const finalLimit = Number(limit) || 10;

  
  return await BlogPostModel.find(filter)
    .populate({
      path: "author",
      select: "firstName lastName email"
    })
    .sort({ createdAt: -1 })
    .skip(finalSkip)   
    .limit(finalLimit) 
    .lean(); 
}

  async count(filter) {
    return await BlogPostModel.countDocuments(filter);
  }

  async findById(id) {
    return await BlogPostModel.findById(id)
      .populate("author", "firstName lastName email");
  }

  async findBySlug(slug) {
    return await BlogPostModel.findOne({ slug })
      .populate("author", "firstName lastName email");
  }

  async updateById(id, data) {
    return await BlogPostModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  async deleteById(id) {
    return await BlogPostModel.findByIdAndDelete(id);
  }
}

export default MongoBlogPostRepository;

