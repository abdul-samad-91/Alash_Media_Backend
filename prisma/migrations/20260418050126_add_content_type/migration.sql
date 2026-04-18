/*
  Warnings:

  - You are about to alter the column `contentType` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `authors` MODIFY `photo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `blogs` MODIFY `featuredImage` VARCHAR(191) NOT NULL,
    MODIFY `contentType` VARCHAR(50) NOT NULL DEFAULT 'blog';
