const dotenv = require('dotenv');
const { registrarLoginTentativa } = require('../services/logService');

dotenv.config();

const attempts = new Map(); // IP -> { count, lastAttempt, blockedUntil }
const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

function loginRateLimiter(req, res, next) {
    const ip = req.ip;

    const entry = attempts.get(ip) || { count: 0, lastAttempt: Date.now(), blockedUntil: null };

    const now = Date.now();

    if (entry.blockedUntil && entry.blockedUntil > now) {
        const wait = Math.ceil((entry.blockedUntil - now) / 1000);

        registrarLoginTentativa(ip, req.body.email, 'Lock', req.headers['user-agent']);

        return res.status(429).json({
            success: false,
            message: `Muitas tentativas. Tente novamente em ${wait} segundos.`
        });
    }

    // Se passou o tempo de bloqueio ou é uma nova tentativa válida
    entry.lastAttempt = now;
    attempts.set(ip, entry);
    next();
}

// Após o loginController, registrar sucesso/falha
function registerLoginAttempt(req, success) {
    const ip = req.ip;
    const email = req.body?.email;
    const userAgent = req.headers['user-agent'];

    registrarLoginTentativa(ip, email, success, userAgent);

    const entry = attempts.get(ip) || { count: 0, lastAttempt: Date.now(), blockedUntil: null };

    if (success == 'true') {
        // Zera em caso de sucesso
        attempts.delete(ip);
    } else {
        entry.count += 1;
        if (entry.count >= MAX_ATTEMPTS) {
            entry.blockedUntil = Date.now() + BLOCK_TIME_MS;
        }
        attempts.set(ip, entry);
    }
}

module.exports = {
    loginRateLimiter,
    registerLoginAttempt
};
