import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: null,
    },
    shortBio: {
      type: String,
      required: [true, 'Please provide short bio'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Populate related blogs virtually
authorSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
});

authorSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Author', authorSchema);
