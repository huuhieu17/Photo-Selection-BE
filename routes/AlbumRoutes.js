const express = require('express');
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, albumController.createAlbum);
router.get('/', authMiddleware, albumController.getListAlbumByUser)
router.get('/:albumId', albumController.getAlbum);

module.exports = router;