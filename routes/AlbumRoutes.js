const express = require('express');
const {
  createAlbum,
  getListAlbumByUser,
  getAlbum,
} = require("../controllers/AlbumController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createAlbum);
router.get('/', authMiddleware, getListAlbumByUser)
router.get('/:albumId', getAlbum);

module.exports = router;