const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { body } = require('express-validator');


router.post('/signUp', controller.signUp);

module.exports = router;




