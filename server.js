const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/AuthRoutes');
const albumRoutes = require('./routes/AlbumRoutes');
const googleDriveRoutes = require('./routes/GoogleDriveRoutes');

dotenv.config();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Định tuyến API
app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/google-drive', googleDriveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));