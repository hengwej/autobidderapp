const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/getAllRequests', controller.getAllRequests);
router.get('/viewRequestDetails/:requestID', controller.viewRequestDetails); // New route for viewing a single request
router.delete('/deleteRequest/:requestID', controller.deleteRequest); // Use DELETE for deletion
module.exports = router;
