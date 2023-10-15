require('express-async-errors');

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const allCars = await prisma.car.findMany();
  res.json(allCars);
});

app.post("/addCar", async (req, res) => {
  const newCar = await prisma.car.create({
    data: req.body,
  });
  res.json(newCar);
});

app.post("/adduser", async (req, res) => {
  const newUser = await prisma.user.create({
    data: req.body,
  });
  res.json(newUser);
});

app.post("/addAccount", async (req, res) => {
  const newAccount = await prisma.account.create({
    data: req.body,
  });
  res.json(newAccount);
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});