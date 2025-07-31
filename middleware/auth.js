const jwt = require('jsonwebtoken');
const JWT_Secret = process.env.JWT_Secret;

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({error: 'Missing token'});

    try {
        const decoded = jwt.verify(token, JWT_Secret);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({error: 'Invalid token'});
    }
}

module.exports = {verifyToken};