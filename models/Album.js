const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: String, required: true },
  name: { type: String, required: true },
  randAlbumId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Album', albumSchema);