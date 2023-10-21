const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/allBidHistory', controller.allBidHistory);
router.post('/createBidHistory', controller.createBidHistory);

module.exports = router;
