const Album = require("../models/Album");

const createAlbum = async (req, res) => {
  const { folderId, name } = req.body;
  const randAlbumId = Date.now();
  try {
    const album = new Album({
      userId: req.user.userId,
      folderId,
      randAlbumId,
      name,
    });
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAlbum = async (req, res) => {
  const { albumId } = req.params;
  try {
    const album = await Album.findOne({ _id: albumId }).select('-userId');
    if (!album) return res.status(404).json({ message: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getListAlbumByUser = async (req, res) => {
  try {
    const { user } = req;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit); // Tính số bản ghi cần bỏ qua

    // Lấy danh sách album theo userId có phân trang
    const albums = await Album.find({ userId: user.userId }).select('-userId')
      .skip(skip)
      .limit(parseInt(limit));

    // Tổng số album của user để tính tổng số trang
    const totalAlbums = await Album.countDocuments({ userId: user.userId });

    res.json({
      data: albums,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAlbums / parseInt(limit)),
        totalItems: totalAlbums,
      },
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createAlbum, getAlbum, getListAlbumByUser };
