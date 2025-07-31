const mongoose = require('mongoose'); 
const dotenv = require('dotenv'); 
const Game = require('./models/Game');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas'); 
        return Game.insertMany([
            {name: "Hollow Knight", genres: ["platform", "metroidvania", "souls-like"], platform:["xbox", "playstation", "PC", "Nintendo Switch"], review: 4.5},
            {name: "Octopath Traveler", genres: ["JRPG", "Turn-based", "Role-playing"], platform:["xbox", "playstation", "PC", "Nintendo Switch"], review: 4.6},
            {name: "Minecraft", genres: ["Sandbox", "Builder"], platform:["xbox", "playstation", "PC", "Nintendo Switch"], review: 4.1},
            {name: "Octopath Traveler 2", genres: ["JRPG", "Turn-based", "Role-playing"], platform:["xbox", "playstation", "PC", "Nintendo Switch"], review: 4.3},
            {name: "Minecraft Dungeons", genres: ["Dungeon Crawler", "Adventure"], platform:["xbox", "playstation", "PC", "Nintendo Switch"], review: 3.9},
        ]);
    })
    .then(() => { 
        console.log('Seeded game data'); 
        mongoose.disconnect(); 
    })
    .catch(err => { 
        console.error(err); 
        mongoose.disconnect(); 
    });