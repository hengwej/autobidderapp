const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/addUser', controller.addUser);
router.get('/getAllUsers', controller.getAllUsers);

// Add a route for deleting a user by ID
router.delete('/deleteUser/:id', controller.deleteUser);

module.exports = router;
