import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
 {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    subtitle: {
        type: String,
        trim: true,
    },

    readingTime: {
        type: String,
    },

    category:[{
        type: String,
        trim: true,
    }],

    hero: {
      imageUrl: {
        type: String,
        required: true
      },
      caption: String,
      altText: String
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ FIXED
      required: true
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    tableOfContents: [{
      text: String,
      anchorId: String,
      level: Number
    }],

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String
    },

    relatedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost"
    }],

    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },

    allowNewsletter: {
      type: Boolean,
      default: true
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    publishedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

//text search 

BlogPostSchema.index({ title: 'text', subtitle: 'text'});

const BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);
export default BlogPostModel;

