const express = require('express');
const router = express.Router();
const { login, register, logout, verifyToken } = require('../controller/loginController');

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

// router.use(verifyToken);

module.exports = router;