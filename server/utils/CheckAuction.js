const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

let auctionQueue = []; // This will hold our queue of auction IDs

function scheduleAuctionClose(auction) {
    const endDate = new Date(auction.endDate); // EC TO CHANGE CONESOLE LOG TO LOGGING
    const auctionIdStr = auction.auctionID.toString();

    // Check if the auction is already in the queue
    if (!auctionQueue.includes(auction.auctionID)) {
        // Schedule the job if it's not already in the queue
        const job = schedule.scheduleJob(auctionIdStr, endDate, async function () {
            await closeAuction(auction.auctionID);
            // Remove from the queue after the job has been executed
            auctionQueue = auctionQueue.filter(id => id !== auction.auctionID);
            console.log('Auction closed and removed from the queue:', auction.auctionID);
        });

        // Add the auction ID to the queue
        auctionQueue.push(auction.auctionID);
        console.log(`Scheduled and added to queue: Auction ${auction.auctionID} at ${endDate}`);
        logAuctionQueue()
    } else {
        console.log(`Auction ${auction.auctionID} is already in the queue.`);
    }
}



// Function to log the auction queue
function logAuctionQueue() {
    console.log('Current auction queue:', auctionQueue);
}


// Function to close the auction
async function closeAuction(auctionID) {
    try {
        await prisma.auction.update({
            where: { auctionID },
            data: { auctionStatus: 'CLOSED' },
        });
        console.log(`Auction ${auctionID} closed.`);

        // Query 1: Retrieve details from the Auction table
        const auctionDetails = await prisma.auction.findUnique({
            where: {
                auctionID: auctionID,
            },
            select: {
                currentHighestBid: true,
                carID: true,
                accountID: true,
            },
        });

        if (!auctionDetails) {
            throw new Error('Auction not found');
        }

        const { currentHighestBid, carID, accountID } = auctionDetails;

        // Query 2: Retrieve details from the Car table using the carID
        const carDetails = await prisma.car.findUnique({
            where: {
                carID: carID,
            },
            select: {
                vehicleNumber: true,
                make: true,
                model: true,
            },
        });

        if (!carDetails) {
            throw new Error('Car not found');
        }

        // Query 3: Retrieve emailAddress from the Account table using the accountID
        const accountDetails = await prisma.account.findUnique({
            where: {
                accountID: accountID,
            },
            select: {
                user: {
                    select: {
                        emailAddress: true,
                    },
                },
            },
        });

        if (!accountDetails) {
            throw new Error('Account not found');
        }

        const { emailAddress } = accountDetails.user;

        // Change Bidding history of users

        // Query to set bidStatus to "Winner" for the winning bid
        await prisma.biddingHistory.updateMany({
            where: {
                accountID: accountID,
                auctionID: auctionID,
            },
            data: {
                bidStatus: 'Winner',
            },
        });

        // Query to set bidStatus to "Ended" for all other bids in the auction
        await prisma.biddingHistory.updateMany({
            where: {
                auctionID: auctionID,
                NOT: {
                    accountID: accountID,
                },
            },
            data: {
                bidStatus: 'Ended',
            },
        });


        emailWinner(auctionDetails, carDetails, accountDetails);
    } catch (error) {
        console.error(`Failed to close auction ${auctionID}: ${error}`);
    }
}


// Function to query the database and schedule the top 10 closest endDates
async function findAndScheduleAuctions() {
    try {
        const closestAuctions = await prisma.auction.findMany({
            where: {
                auctionStatus: {
                    not: 'CLOSED',
                },
                endDate: {
                    gt: new Date(),
                },
            },
            orderBy: {
                endDate: 'asc',
            },
            take: 10,
        });

        closestAuctions.forEach(auction => {
            // Check if a job has already been scheduled for this auction
            const existingJob = schedule.scheduledJobs[auction.auctionID.toString()];
            if (!existingJob) {
                scheduleAuctionClose(auction);
            }
        });
    } catch (error) {
        console.error('Error in findAndScheduleAuctions:', error);
    }
}

setInterval(logAuctionQueue, 60000);

// Schedule findAndScheduleAuctions to run every minute
schedule.scheduleJob('* * * * *', findAndScheduleAuctions);


// Function to send email to winner
async function emailWinner(auctionDetails, carDetails, accountDetails) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: accountDetails.user.emailAddress,
        subject: 'Autobidder Bid Winner!',
        html: `
        <div style="font-family: 'Arial', sans-serif; text-align: center; padding: 20px; background-color: #f2f4f6;">
            <h1 style="color: #333;">🎉 Congratulations! 🎉</h1>
            <h2>You've won the auction!</h2>
            <div style="border: 1px solid #ddd; padding: 20px; background: white; margin: 20px;">
                <h3>${carDetails.make} ${carDetails.model}</h3>
                <p style="color: #555;">Vehicle Number: <strong>${carDetails.vehicleNumber}</strong></p>
                <p style="color: #555;">Winning Bid: <strong>$${auctionDetails.currentHighestBid}</strong></p>
                <p>We are thrilled to inform you that you've won the bid for this beautiful car.</p>
                <p>Please contact us to arrange for collection of your new vehicle.</p>
            </div>
            <footer style="color: #777; padding-top: 10px;">
                Thank you for using Autobidder.
            </footer>
        </div>
    `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.log.error(`Error sending OTP: ${error}`);  // Log error sending OTP 
            return res.status(500).json({ error: 'Error sending OTP' });
        }
        req.log.info(`Congratulations! you have won the bid ${info.response}`);
    });
}


module.exports = { findAndScheduleAuctions };

// ... rest of your Express.js application setup
