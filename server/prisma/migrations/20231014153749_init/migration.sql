-- CreateTable
CREATE TABLE `User` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `emailAddress` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `accountID` INTEGER NOT NULL AUTO_INCREMENT,
    `accountType` VARCHAR(191) NOT NULL,
    `accountStatus` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `userID` INTEGER NULL,

    PRIMARY KEY (`accountID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `carID` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleNumber` VARCHAR(191) NOT NULL,
    `carImage` LONGBLOB NOT NULL,
    `highlights` VARCHAR(191) NULL,
    `equipment` VARCHAR(191) NULL,
    `modifications` VARCHAR(191) NULL,
    `knownFlaws` VARCHAR(191) NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `interiorColor` VARCHAR(191) NULL,
    `exteriorColor` VARCHAR(191) NULL,
    `startingBid` DOUBLE NOT NULL,
    `reservePrice` DOUBLE NOT NULL,
    `accountID` INTEGER NOT NULL,

    PRIMARY KEY (`carID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Auction` (
    `auctionID` INTEGER NOT NULL AUTO_INCREMENT,
    `auctionStatus` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `currentHighestBid` DOUBLE NOT NULL,
    `auctionCreationTime` DATETIME(3) NOT NULL,
    `auctionCreatorID` INTEGER NOT NULL,
    `carID` INTEGER NOT NULL,

    PRIMARY KEY (`auctionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `commentID` INTEGER NOT NULL AUTO_INCREMENT,
    `commentDetails` VARCHAR(191) NOT NULL,
    `accountID` INTEGER NOT NULL,
    `auctionID` INTEGER NOT NULL,

    PRIMARY KEY (`commentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `orderID` INTEGER NOT NULL AUTO_INCREMENT,
    `orderStatus` VARCHAR(191) NOT NULL,
    `paymentDeadline` DATETIME(3) NOT NULL,
    `deliveryType` VARCHAR(191) NOT NULL,
    `shippingAddress` VARCHAR(191) NULL,
    `orderCreationTime` DATETIME(3) NOT NULL,
    `orderCompletionTime` DATETIME(3) NULL,
    `orderCreatorID` INTEGER NOT NULL,
    `auctionID` INTEGER NOT NULL,

    PRIMARY KEY (`orderID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellingHistory` (
    `saleID` INTEGER NOT NULL AUTO_INCREMENT,
    `orderID` INTEGER NOT NULL,
    `accountID` INTEGER NOT NULL,

    PRIMARY KEY (`saleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BiddingHistory` (
    `bidID` INTEGER NOT NULL AUTO_INCREMENT,
    `bidAmount` DOUBLE NOT NULL,
    `bidTimestamp` DATETIME(3) NOT NULL,
    `bidStatus` VARCHAR(191) NOT NULL,
    `accountID` INTEGER NOT NULL,
    `auctionID` INTEGER NOT NULL,

    PRIMARY KEY (`bidID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `requestID` INTEGER NOT NULL AUTO_INCREMENT,
    `requestStatus` VARCHAR(191) NOT NULL,
    `requestSubmissionTime` DATETIME(3) NOT NULL,
    `vehicleNumber` VARCHAR(191) NOT NULL,
    `carImage` LONGBLOB NOT NULL,
    `highlights` VARCHAR(191) NULL,
    `equipment` VARCHAR(191) NULL,
    `modifications` VARCHAR(191) NULL,
    `knownFlaws` VARCHAR(191) NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `interiorColor` VARCHAR(191) NULL,
    `exteriorColor` VARCHAR(191) NULL,
    `startingBid` DOUBLE NOT NULL,
    `reservePrice` DOUBLE NOT NULL,
    `accountID` INTEGER NOT NULL,

    PRIMARY KEY (`requestID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `questionID` INTEGER NOT NULL AUTO_INCREMENT,
    `questionType` VARCHAR(191) NOT NULL,
    `questionAns` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`questionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_auctionCreatorID_fkey` FOREIGN KEY (`auctionCreatorID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_carID_fkey` FOREIGN KEY (`carID`) REFERENCES `Car`(`carID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_auctionID_fkey` FOREIGN KEY (`auctionID`) REFERENCES `Auction`(`auctionID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_orderCreatorID_fkey` FOREIGN KEY (`orderCreatorID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_auctionID_fkey` FOREIGN KEY (`auctionID`) REFERENCES `Auction`(`auctionID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellingHistory` ADD CONSTRAINT `SellingHistory_orderID_fkey` FOREIGN KEY (`orderID`) REFERENCES `Orders`(`orderID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellingHistory` ADD CONSTRAINT `SellingHistory_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiddingHistory` ADD CONSTRAINT `BiddingHistory_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiddingHistory` ADD CONSTRAINT `BiddingHistory_auctionID_fkey` FOREIGN KEY (`auctionID`) REFERENCES `Auction`(`auctionID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`accountID`) ON DELETE CASCADE ON UPDATE CASCADE;
