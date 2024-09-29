// routes/auth.js
const express = require('express');
const router = express.Router();
const { login,signUp,logout } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', signUp);
router.get('/logout', logout);

module.exports = router;
