// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);
// ... existing routes ...

// ✅ Register user from employee (Admin only)
router.post('/register-user', authenticate, authController.registerUserFromEmployee);

module.exports = router;




