const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/addAccount', controller.addAccount);
router.get('/allAccount', controller.allAccount);

module.exports = router;




