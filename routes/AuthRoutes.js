const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authController.register);
router.get('/current-user', authMiddleware, authController.getCurrentUser);
router.post('/login', authController.login);

module.exports = router;