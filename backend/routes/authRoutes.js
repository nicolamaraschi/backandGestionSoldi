const express = require('express');
const router = express.Router();
const { register, login,logout } = require('../controllers/authController');

// Route per la registrazione
router.post('/register', register);

// Route per il login
router.post('/login', login);

router.post('/logout', logout);

module.exports = router;
