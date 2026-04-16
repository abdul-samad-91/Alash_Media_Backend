import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide gallery title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['photo', 'video'],
      required: [true, 'Please specify gallery type'],
    },
    items: [
      {
        title: String,
        url: {
          type: String,
          required: true,
        },
        thumbnail: String,
        description: String,
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],
    category: {
      type: String,
      default: 'general',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);
