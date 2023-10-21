const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/getAllRequests', controller.getAllRequests);
router.get('/viewRequestDetails/:requestID', controller.viewRequestDetails); // New route for viewing a single request

module.exports = router;
