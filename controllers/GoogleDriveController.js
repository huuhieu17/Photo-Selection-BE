const { google } = require('googleapis');
const User = require('../models/User');
const Album = require('../models/Album');


const getAuthUrl = (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
    prompt: "consent",
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI
  });
  res.json({ url });
};

const handleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    const { tokens } = await oauth2Client.getToken(code);
    console.log({tokens});
    
    oauth2Client.setCredentials(tokens);

    // Lưu refresh token vào database
    const user = await User.findById(req.user.userId);
    if (user) {
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
    }
    await user.save();

    res.json({ access_token: tokens.access_token, message: "Login successful" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const getListDriveFolder = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  const user = await User.findById(req.user.userId);

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  oauth2Client.setCredentials({ access_token: user.accessToken });

  try {
    const folders = [];
    let pageToken = null;
    do {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and 'me' in owners",
        fields: "nextPageToken, files(id, name, parents, createdTime)",
        pageToken: pageToken
      });
    
      folders.push(...response.data.files);
      pageToken = response.nextPageToken;
    } while (pageToken);
    const rootFolders = folders
    res.json(rootFolders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getPhotoFolder = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
    
    const album = await Album.findOne({ folderId: req.params.albumId});
    if (!album) return res.status(404).json({ message: "Album not found" });
  
    const user = await User.findById(album.userId);
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    });

    oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        user.refreshToken = tokens.refresh_token;
        user.save();
      }
      user.accessToken = tokens.access_token;
      user.save();
    });
  
    try {
      const drive = google.drive({ version: "v3", auth: oauth2Client });
    
      const response = await drive.files.list({
        q: `'${album.folderId}' in parents and mimeType contains 'image/'`,
        fields: "files(id, name, webContentLink)"
      });
      res.json(response.data.files);
    } catch (error) {
      res.status(400).json({ message: error });
    }
}

const checkLogin = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  const user = await User.findById(req.user.userId);
  if (!user || !user.accessToken) {
    return res.json({ isLoggedIn: false });
  }

  oauth2Client.setCredentials({ access_token: user.accessToken });

  try {
    // Kiểm tra token có hợp lệ không
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    await drive.files.list({ pageSize: 1 });
    res.json({ isLoggedIn: true });
  } catch (error) {
    res.json({ isLoggedIn: false });
  }
}
module.exports = { getAuthUrl, handleCallback, getListDriveFolder, getPhotoFolder, checkLogin };