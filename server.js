const express = require('express');
const cors = require('cors');
const gamesRouter = require('./routes/games');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // local origin
    // origin: 'https://my-gaming-list-tau.vercel.app', // render origin
    credentials: true
}));
app.use(express.json());
app.use('/games', gamesRouter);
app.use('/api/auth', authRoutes);
app.listen(process.env.PORT || 4000, () => {
    console.log('REST API running at http://localhost:4000');
});