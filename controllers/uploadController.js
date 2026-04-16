import { uploadToCloudinary, uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

/**
 * Upload single file to Cloudinary
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const { folder = 'alash-media' } = req.body;

    // Upload to Cloudinary using buffer
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      folder
    );

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided',
      });
    }

    const { folder = 'alash-media' } = req.body;
    const results = [];

    for (const file of req.files) {
      try {
        const result = await uploadBufferToCloudinary(
          file.buffer,
          file.originalname,
          folder
        );
        results.push(result);
      } catch (error) {
        results.push({
          file: file.originalname,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Files uploaded',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    await deleteFromCloudinary(publicId, resourceType);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
