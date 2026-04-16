import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Upload single file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folderName - Cloudinary folder name
 * @param {string} resourceType - Type of resource (image, video, auto)
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (filePath, folderName = 'alash-media', resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: resourceType,
      overwrite: false,
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes,
    };
  } catch (error) {
    throw new Error(`Image upload to Cloudinary failed: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {string} resourceType - Type of resource (image, video, auto)
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

/**
 * Upload file from buffer
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - File name
 * @param {string} folderName - Cloudinary folder name
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadBufferToCloudinary = async (buffer, fileName, folderName = 'alash-media') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: 'auto',
          public_id: fileName.split('.')[0],
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Buffer upload failed: ${error.message}`));
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              size: result.bytes,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error(`Buffer upload to Cloudinary failed: ${error.message}`);
  }
};
