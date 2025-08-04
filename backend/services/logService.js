const db = require('../config/database');

async function registrarLoginTentativa(ip, email, sucesso, userAgent) {
    try {
        await db.query(
            'INSERT INTO login_logs (ip, email, tentativa_sucesso, user_agent) VALUES (?, ?, ?, ?)',
            [ip, email || null, sucesso, userAgent || null]
        );
    } catch (err) {
        console.error('Erro ao registrar log de login:', err);
    }
}

module.exports = {
    registrarLoginTentativa
};
