/*
  Warnings:

  - The primary key for the `authors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `banners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blog_content_blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blog_sections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blog_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `galleries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `gallery_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vote_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `votes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `blog_content_blocks` DROP FOREIGN KEY `blog_content_blocks_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_sections` DROP FOREIGN KEY `blog_sections_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blog_tags` DROP FOREIGN KEY `blog_tags_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_parentCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `gallery_items` DROP FOREIGN KEY `gallery_items_galleryId_fkey`;

-- DropForeignKey
ALTER TABLE `vote_options` DROP FOREIGN KEY `vote_options_voteId_fkey`;

-- AlterTable
ALTER TABLE `authors` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `banners` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `blog_content_blocks` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `blogId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `blog_sections` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `blogId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `blog_tags` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `blogId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `blogs` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `authorId` VARCHAR(191) NOT NULL,
    MODIFY `categoryId` VARCHAR(191) NOT NULL,
    MODIFY `createdById` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `parentCategoryId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `galleries` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `gallery_items` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `galleryId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vote_options` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `voteId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `votes` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parentCategoryId_fkey` FOREIGN KEY (`parentCategoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `authors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_tags` ADD CONSTRAINT `blog_tags_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_content_blocks` ADD CONSTRAINT `blog_content_blocks_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_sections` ADD CONSTRAINT `blog_sections_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gallery_items` ADD CONSTRAINT `gallery_items_galleryId_fkey` FOREIGN KEY (`galleryId`) REFERENCES `galleries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vote_options` ADD CONSTRAINT `vote_options_voteId_fkey` FOREIGN KEY (`voteId`) REFERENCES `votes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
