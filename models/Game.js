const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    genres: {type: [String], required: true},
    platform: {type: [String], required: true},
    review: {type: Number, required: false}
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;