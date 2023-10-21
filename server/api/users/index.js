const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/addUser', controller.addUser);
router.get('/getAllUsers', controller.getAllUsers);

// Add a route for deleting a user by ID
router.delete('/deleteUser/:id', controller.deleteUser);
// Add a route for viewing a user by ID
router.get('/viewUser/:userID', controller.viewUser);


module.exports = router;
