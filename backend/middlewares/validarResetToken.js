const User = require('../models/users');

async function validarResetToken(req, res, next) {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token é obrigatório.' });
    }

    try {
        const usuario = await User.getByResetToken(token);

        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Token inválido.' });
        }

        if (usuario.tokenExpira < Date.now()) {
            return res.status(410).json({ success: false, message: 'Token expirado.' });
        }

        // anexar o usuário na request para uso posterior
        req.usuarioParaReset = usuario;
        next();

    } catch (err) {
        console.error('Erro ao validar token:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
}

module.exports = validarResetToken;
