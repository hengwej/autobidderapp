const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allCar = async (req, res) => {
    const allCars = await prisma.car.findMany();
    res.json(allCars);
};


exports.addCar = async (req, res) => {
    const newCar = await prisma.car.create({
        data: req.body,
    });
    res.json(newCar);
};
