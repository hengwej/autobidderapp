const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const router = express.Router();
const prisma = new PrismaClient();


router.get('/allCar', async (req, res) => {
    const allCars = await prisma.car.findMany();
    res.json(allCars);
});

router.post('/addCar', async (req, res) => {
    const newCar = await prisma.car.create({
        data: req.body,
    });
    res.json(newCar);
});

router.post('/sellCar', async (req, res) => {
    const token = req.cookies.token;
    console.log(req.body.formData);

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //Perform Database calls here
        //Find account associated with the token by accountID
        const account = await prisma.account.findUnique({
            where: {
                accountID: payload.accountID, // Use accountID from token payload
            },
            //Add in include to add new car to account

        });


        //Return JSON object
        //Return bidding history
        res.status(200).json({ message: 'Car successfully sold' });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;