const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;

router.post('', async (req, res) => { 

});

module.exports = router;