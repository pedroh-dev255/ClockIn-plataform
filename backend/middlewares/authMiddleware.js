const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    const find = User.findToken(token);
    if (!find) {
        return res.status(401).json({ message: 'Token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

module.exports = authMiddleware;