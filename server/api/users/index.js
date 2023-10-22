const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/addUser', controller.addUser);
router.get('/getAllUsers', controller.getAllUsers);

// Add a route for deleting a user by ID
router.delete('/deleteUser/:id', controller.deleteUser);
// Add a route for viewing a user by ID
router.get('/viewUser/:userID', controller.viewUser);

// Route to get a specific user's details by account ID
router.get('/getUserProfileDetails/:id', controller.getUserProfileDetails);

// Route to get a specific user's bidding history by account ID
router.get('/getUserBiddingHistory/:id', controller.getUserBiddingHistory);

// Route to get a specific user's selling history by account ID
router.get('/getUserSellingHistory/:id', controller.getUserSellingHistory);

// Route to update a specific user's profile details by account ID
router.put('/updateUserProfileDetails/:id', controller.updateUserProfileDetails);

module.exports = router;
