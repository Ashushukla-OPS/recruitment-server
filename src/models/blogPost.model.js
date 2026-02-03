import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  subtitle: {
    type: String,
    trim: true,
    default: ""
  },

  readingTime: {
    type: String,
    default: "0 min read"
  },

  category: {
    type: [String],
    default: []
  },

  hero: {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    altText: { type: String, default: "" }
  },

  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  seo: {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: "" }
  },

  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },

  isPublished: {
    type: Boolean,
    default: false
  },

  allowNewsletter: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;

