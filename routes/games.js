const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
let games = require('../data/games');
const Game = require('../models/Game');
const {verifyToken} = require('../middleware/auth');


const router = express.Router();

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
        
        const filter = {};
        if (name) filter.name = {$regex: name, $options: 'i'};

        const games = await Game.find(filter);
        
        res.json(games.map(g => ({...g._doc, id: g._id})));

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