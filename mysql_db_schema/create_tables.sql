USE autobiddata;

CREATE TABLE IF NOT EXISTS User (
    userID INT AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    phoneNumber VARCHAR(20) NOT NULL,
    emailAddress VARCHAR(255) NOT NULL,
    PRIMARY KEY (userID)
);

CREATE TABLE IF NOT EXISTS Account (
    accountID INT AUTO_INCREMENT NOT NULL,
    accountType VARCHAR(20) NOT NULL,
    accountStatus VARCHAR(20) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    userID INT,
    PRIMARY KEY (accountID),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Car (
    carID INT AUTO_INCREMENT NOT NULL,
    vehicleNumber VARCHAR(20) NOT NULL,
    carImage BLOB NOT NULL,
    highlights TEXT,
    equipment TEXT,
    modifications TEXT,
    knownFlaws TEXT,
    make VARCHAR (50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    interiorColor VARCHAR(50),
    exteriorColor VARCHAR(50),
    startingBid DECIMAL(10, 2) NOT NULL,
    reservePrice DECIMAL(10, 2) NOT NULL,
    accountID INT,
    PRIMARY KEY (carID),
    FOREIGN KEY (accountID) REFERENCES Account(accountID) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS Auction (
    auctionID INT AUTO_INCREMENT NOT NULL,
    auctionStatus VARCHAR(20) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    currentHighestBid DECIMAL(10, 2) NOT NULL,
    auctionCreationTime DATETIME NOT NULL,
    auctionCreatorID INT,
    carID INT,
    PRIMARY KEY (auctionID),
    FOREIGN KEY (auctionCreatorID) REFERENCES Account(accountID) ON DELETE CASCADE,
    FOREIGN KEY (carID) REFERENCES Car(carID) ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS Comment (
    commentID INT AUTO_INCREMENT NOT NULL,
    commentDetails VARCHAR(255) NOT NULL,
    accountID INT,
    auctionID INT,
    PRIMARY KEY (commentID),
    FOREIGN KEY (accountID) REFERENCES Account(accountID) ON DELETE CASCADE,
    FOREIGN KEY (auctionID) REFERENCES Auction(auctionID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Orders (
    orderID INT AUTO_INCREMENT NOT NULL,
    orderStatus VARCHAR(20) NOT NULL,
    paymentDeadline DATETIME NOT NULL,
    deliveryType VARCHAR(20) NOT NULL,
    shippingAddress VARCHAR(255),
    orderCreationTime DATETIME NOT NULL,
    orderCompletionTime DateTime,
    orderCreatorID INT,
    auctionID INT,
    PRIMARY KEY (orderID),
    FOREIGN KEY (orderCreatorID) REFERENCES Account(accountID) ON DELETE CASCADE,
    FOREIGN KEY (auctionID) REFERENCES Auction(auctionID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SellingHistory (
    saleID INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (saleID),
    orderID INT,
    accountID INT,
    FOREIGN KEY (orderID) REFERENCES Order(orderID) ON DELETE CASCADE,
    FOREIGN KEY (accountID) REFERENCES Account(accountID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BiddingHistory (
    bidID INT AUTO_INCREMENT NOT NULL,
    bidAmount DECIMAL(10, 2) NOT NULL,
    bidTimestamp DATETIME NOT NULL,
    bidStatus VARCHAR(20) NOT NULL,
    accountID INT,
    auctionID INT,
    PRIMARY KEY (bidID),
    FOREIGN KEY (accountID) REFERENCES Account(accountID) ON DELETE CASCADE,
    FOREIGN KEY (auctionID) REFERENCES Auction(auctionID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Request (
    requestID INT AUTO_INCREMENT NOT NULL,
    requestStatus VARCHAR(20) NOT NULL,
    requestSubmissionTime DATETIME NOT NULL,
    vehicleNumber VARCHAR(20) NOT NULL,
    carImage BLOB NOT NULL,
    highlights TEXT,
    equipment TEXT,
    modifications TEXT,
    knownFlaws TEXT,
    make VARCHAR (50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    interiorColor VARCHAR(50),
    exteriorColor VARCHAR(50),
    startingBid DECIMAL(10, 2) NOT NULL,
    reservePrice DECIMAL(10, 2) NOT NULL,
    accountID INT,
    PRIMARY KEY (requestID),
    FOREIGN KEY (accountID) REFERENCES Account(accountID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS FAQ (
    questionID INT AUTO_INCREMENT NOT NULL,
    questionType VARCHAR(50) NOT NULL,
    questionAns VARCHAR(255) NOT NULL,
    PRIMARY KEY (questionID)
);
