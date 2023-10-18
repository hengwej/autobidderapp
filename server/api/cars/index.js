const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/allCar', controller.allCar);
router.post('/addCar', controller.addCar);

module.exports = router;
