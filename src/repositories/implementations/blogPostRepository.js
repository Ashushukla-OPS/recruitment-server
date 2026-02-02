import BlogPostRepository from '../../repositories/contracts/blogPost.Repository.js';
import BlogPostModel from '../../models/blogPost.model.js';

class BlogPostRepositoryImpl extends BlogPostRepository {
    async create(data){
        const blogPost = new BlogPostModel(data);
        return await blogPost.save();
    }

    async findPaginated(filter, skip, limit){
        return await BlogPostModel.find(filter)
        .populate('author','name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    async count(filter){
        return await BlogPostModel.countDocuments(filter);
    }

    async findById(id){
        return await BlogPostModel.findById(id)
        .populate('author','name email');
    }

    async findBySlug(slug){
        return await BlogPostModel.findOne({ slug})
        .populate('author','name');
    }

    async updateById(id, data){
        return await BlogPostModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async deleteById(id){
        return await BlogPostModel.findByIdAndDelete(id);
    }
}

const blogPostRepository = new BlogPostRepositoryImpl();
export default blogPostRepository;

