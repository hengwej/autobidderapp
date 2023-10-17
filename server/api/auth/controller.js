const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


const saltRounds = 10;



exports.signUp = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userData, accountData } = req.body;

    console.log("userData:", userData);
    console.log("accountData:", accountData);


    try {
        // Create the user
        const user = await prisma.user.create({
            data: userData
        });

        // Link the user to the account
        accountData.userID = user.userID;

        // Set accountType and accountStatus
        accountData.accountType = "Bidder";
        accountData.accountStatus = "Active";

        // Hash the password
        const hashedPassword = await bcrypt.hash(accountData.password, saltRounds);
        accountData.password = hashedPassword;

        // Create the account linked to the user
        const account = await prisma.account.create({
            data: accountData
        });

        res.json({ message: 'Signup successful!', user, account });
    } catch (error) {
        console.error("Error processing signup:", error);
        res.status(500).json({ message: 'Internal server error' });
    }



};




