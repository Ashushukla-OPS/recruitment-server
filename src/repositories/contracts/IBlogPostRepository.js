class BlogPostRepository {
  async create(data) {}

  async findPaginated(filter, skip, limit) {}

  async searchBlogs(filters, options) {}

  async count(filter) {}

  async findById(id) {}

  async findBySlug(slug) {}

  async updateById(id, data) {}

  async deleteById(id) {}
}

export default BlogPostRepository;