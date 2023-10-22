const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/addAccount', controller.addAccount);
router.get('/allAccount', controller.allAccount);

// Route to get a specific user's account details by account ID
router.get('/getUserAccountDetails/:id', controller.getUserAccountDetails);

// Route to delete an account by account ID
router.delete('/deleteAccount/:id', controller.deleteAccount);

module.exports = router;




