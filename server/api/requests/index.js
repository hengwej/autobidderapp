const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/getAllRequests', controller.getAllRequests);
router.get('/viewRequestDetails/:requestID', controller.viewRequestDetails); // New route for viewing a single request
router.delete('/rejectRequest/:requestID', controller.rejectRequest); // Use DELETE for deletion
router.post('/approveRequest/:requestID', controller.approveRequest); //approve button

module.exports = router;
