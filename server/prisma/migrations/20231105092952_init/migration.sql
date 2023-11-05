/*
  Warnings:

  - You are about to drop the column `deliveryType` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderCompletionTime` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderCreationTime` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderCreatorID` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDeadline` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `accountID` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountID` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_orderCreatorID_fkey`;

-- AlterTable
ALTER TABLE `Auction` ADD COLUMN `accountID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `deliveryType`,
    DROP COLUMN `orderCompletionTime`,
    DROP COLUMN `orderCreationTime`,
    DROP COLUMN `orderCreatorID`,
    DROP COLUMN `paymentDeadline`,
    DROP COLUMN `shippingAddress`,
    ADD COLUMN `accountID` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenId` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(191) NOT NULL,
    `accountID` INTEGER NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Session_tokenId_key`(`tokenId`),
    INDEX `Session_accountID_fkey`(`accountID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Auction_accountID_fkey` ON `Auction`(`accountID`);

-- CreateIndex
CREATE INDEX `Orders_accountID_fkey_idx` ON `Orders`(`accountID`);

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`accountID`) ON DELETE SET NULL ON UPDATE CASCADE;
