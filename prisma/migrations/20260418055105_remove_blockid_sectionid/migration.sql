/*
  Warnings:

  - You are about to drop the column `blockId` on the `blog_content_blocks` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `blog_sections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog_content_blocks` DROP COLUMN `blockId`;

-- AlterTable
ALTER TABLE `blog_sections` DROP COLUMN `sectionId`;
