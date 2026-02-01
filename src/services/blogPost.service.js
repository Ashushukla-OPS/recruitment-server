import blogRepo  from "../repositories/implementations/blogPostRepository.js"

export const createBlogPost = async (data) => {
    return await blogRepo.create(data);
};

export const getBlogPosts = async (filter, page, limit) => {
    const skip = (page - 1) * limit;
    const finalfilter = { isPublished: true, ...filter };

    const [blogs, total] = await Promise.all([
        blogRepo.findPaginated(finalfilter, skip, limit),
        blogRepo.count(filter)
    ]);

    return {
        blogs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };

};

export const getBlogPostById = async (id) => {
    return await blogRepo.findById(id);
};

export const getBlogPostBySlug = async (slug) => {
    const blogPost = await blogRepo.findBySlug(slug);
    if (blogPost) {
        blogPost.views += 1;
        await blogRepo.updateById(blogPost._id, { views: blogPost.views });
    }
    return blogPost;
};

export const updateBlogPost = async (id, data) => {
    return await blogRepo.updateById(id, data);
};

export const deleteBlogPost = async (id) => {
    return await blogRepo.deleteById(id);
};


