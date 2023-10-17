/*
  Warnings:

  - Added the required column `token2fa` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `token2fa` VARCHAR(191) NOT NULL;
