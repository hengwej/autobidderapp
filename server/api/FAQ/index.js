const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/getAllFAQs', controller.getAllFAQs);
module.exports = router;