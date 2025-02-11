const express = require('express');
const googleDriveController = require('../controllers/GoogleDriveController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/auth', authMiddleware, googleDriveController.getAuthUrl);
router.get('/check-login', authMiddleware, googleDriveController.checkLogin);
router.get('/callback',authMiddleware, googleDriveController.handleCallback);
router.get('/folders',authMiddleware, googleDriveController.getListDriveFolder);
router.get('/:albumId/photos', googleDriveController.getPhotoFolder)

module.exports = router;