const express = require('express');
const rateLimit = require('express-rate-limit');
const Game = require('../models/Game');
const {verifyToken} = require('../middleware/auth');

require('dotenv').config();

const router = express.Router();

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const USE_LOCAL_DB = process.env.USE_LOCAL_DB === 'true'; // toggle this in .env

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, try again later.'
});

router.use(limiter);

// // GET /games
// router.get('/', (req, res) => { 
//     res.json(games);
// });

// GET /games?name=Hollow&page=1&limit=5
router.get('/', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ error: 'Missing game name' });
        
        // 🔌 If demo mode: try local DB
        if (USE_LOCAL_DB) {
            const games = await Game.find({ name: { $regex: name, $options: 'i' } });
            if (games.length > 0) {
                return res.json(games.map(g => ({ ...g._doc, id: g._id })));
            }
        }

        // 🌐 Fetch from RAWG
        const rawgUrl = `https://api.rawg.io/api/games?search=${name}&key=${RAWG_API_KEY}`;
        const rawgRes = await fetch(`${rawgUrl}`);
        const rawgData = await rawgRes.json();

        if (!rawgData.results || rawgData.results.length === 0) {
            return res.status(404).json({ error: 'No games found from RAWG' });
        }

        // console.log(rawgData);

        // Format the result for frontend
        const games = rawgData.results.map(game => ({
            id: game.id,
            name: game.name,
            description: game.slug,
            image: game.background_image,
            released: game.released,
            rating: game.rating,
            genres: game.genres.map(g => g.name),
            platforms: game.platforms.map(g => g.platform.name),
        }));

        console.log(games);

        return res.json(games);

        
    } catch(err) {
        console.error('GET /games error:', err.message);
        res.status(500).json({error: 'Failed to fetch games'});
    }    
});



// GET /games/1
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const g = await Game.findById(req.params.id);
        g ? res.json({...g._doc, id: g._id}) :
            res.status(404).json({error: 'Game not found'});
    } catch {
        res.status(400).json({error: 'Invalid ID'});
    }
});

// POST /games
router.post('/', async(req, res) => {
    try {
        const newGame = new Game(req.body);
        const saved = await newGame.save();
        res.status(201).json({...saved._doc, id: saved._id});
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(400).json({ error: error.message });
    }
});

//DELETE game

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Game.findByIdAndDelete(req.params.id);
        deleted ? res.json({message: 'Game deleted'}) :
                res.status(404).json({error: 'Not found'});
    } catch {
        res.status(400).json({error: 'Invalid ID'});
    }
});

module.exports = router;