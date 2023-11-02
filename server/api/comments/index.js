const express = require('express');
const router = express.Router();
const controller = require('./controller');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sanitiseStr, sanitiseObj } = require('../../utils/Validator');
const prisma = new PrismaClient();

router.get('/allComment', controller.allComment);

router.post('/addComment', async (req, res) => {
    console.log("access comment");
    const token = req.cookies.token;
    console.log("token" + token);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        let { newComment } = req.body;
        //sanitisation
        newComment = sanitiseObj(newComment);
        
        console.log("Sanitised comment" + newComment);
        //Perform Database calls here
        //Find account associated with the token by accountID
        const comment = await prisma.comment.create({
            data: {
                accountID: payload.accountID, // Use accountID from token payload
                commentDetails: newComment.comment,
                auctionID: newComment.auctionID,
            }
        });

        res.json(comment);

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;