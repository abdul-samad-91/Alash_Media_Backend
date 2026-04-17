-- Add blog/news content type support
ALTER TABLE `blogs`
ADD COLUMN `contentType` VARCHAR(191) NOT NULL DEFAULT 'blog';
