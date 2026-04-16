import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide blog title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short description'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Please provide full content'],
    },
    // Detailed content sections
    mainContent: {
      contentOne: String,
      contentTwo: String,
    },
    // Structured content blocks
    contentBlocks: [
      {
        id: Number,
        heading: String,
        text: String,
      },
    ],
    // Content sections
    sections: [
      {
        id: Number,
        heading: String,
        text: String,
      },
    ],
    featuredImage: {
      type: String,
      required: [true, 'Please provide featured image'],
    },
    imageCaption: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Please provide author'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide category'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedDate: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: null,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text' });
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });

export default mongoose.model('Blog', blogSchema);
