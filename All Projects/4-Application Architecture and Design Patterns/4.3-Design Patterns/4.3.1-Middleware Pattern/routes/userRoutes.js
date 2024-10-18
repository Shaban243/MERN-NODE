const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const userController = require('../controllers/userController.js');

router.route('/profile', auth, userController.getProfile);

module.exports = router;