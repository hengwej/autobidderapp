const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/addUser', controller.addUser);

module.exports = router;




