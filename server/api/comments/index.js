const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/allComment', controller.allComment);

module.exports = router;
