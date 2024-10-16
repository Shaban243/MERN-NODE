const express = require('express');
const { 
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById 
} = require('../controllers/userController.js');


const router = express.Router();

router.route('/users')
.get(getAllUsers)
.post(createUser);

router.route('/users/:id')
.get(getUserById)
.put(updateUserById)
.delete(deleteUserById);


module.exports = router;