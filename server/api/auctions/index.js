const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/allAuction', controller.allAuction);
router.post('/addAuction', controller.addAuction);
router.post('/addBid', controller.addBid);

module.exports = router;
