const express = require('express');
const cors = require('cors');
const gamesRouter = require('./routes/games');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/games', gamesRouter);
app.use('/api/auth', authRoutes);
app.listen(4000, () => {
    console.log('REST API running at http://localhost:4000');
});