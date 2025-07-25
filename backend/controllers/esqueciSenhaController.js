const crypto = require('crypto');
const sendEmail = require('../services/emailService.js');
const User = require('../models/users.js');

async function esqueciSenhaController(req, res) {
    const { email } = req.body;

    if (!email) {

        return res.status(400).json({
            success: false,
            message: 'Email é obrigatório'
        });
    }
    
    const usuario = await User.getByEmail(email);

    if (!usuario){
        return res.status(404).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }

    if (usuario.status !== 'ativo') {
        return res.status(403).json({
            success: false,
            message: 'Usuário inativo, não é possível redefinir a senha'
        });
    }

    if (usuario.tokenExpira && usuario.tokenExpira > Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'Já existe um token de redefinição de senha ativo. Por favor, aguarde até que ele expire.'
        });
    }

    if (usuario.tipo !== 'admin') {
        return res.status(403).json({   
            success: false,
            message: 'Apenas usuários administradores podem redefinir a senha'
        });
    }

    const token = crypto.randomBytes(32).toString('hex');

    usuario.resetToken = token;
    usuario.tokenExpira = Date.now() + 3600000;

    try{
        const result = await User.setResetToken(email, token, usuario.tokenExpira);
        if (result.affectedRows === 0) {
            throw new Error('Erro ao atualizar o token do usuário');
        }
    } catch (error) {
        console.error('Erro ao atualizar token:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao atualizar token'
        });
    }

    const link = `${process.env.FRONTEND_URL}/resetar-senha/${token}`;

    const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <style>
                body {
                background-color: #f4f4f7;
                font-family: Arial, sans-serif;
                color: #333333;
                margin: 0;
                padding: 0;
                }
                .container {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .header {
                background-color: #7130FF;
                padding: 30px 20px;
                text-align: center;
                }
                .header img {
                width: 120px;
                height: auto;
                }
                .content {
                padding: 30px 20px;
                }
                .content h1 {
                font-size: 24px;
                margin-bottom: 20px;
                color: #111827;
                }
                .content p {
                font-size: 16px;
                margin-bottom: 20px;
                }
                .buttonLink {
                display: inline-block;
                background-color: #7130FF;
                color: white !important;
                padding: 15px 25px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                transition: background-color 0.3s ease;
                }
                .button:hover {
                background-color:rgb(89, 38, 201);
                }
                .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #6b7280;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <img src="https://i.imgur.com/LWO6bhy.png" alt="Logo do App">
                </div>
                <div class="content">
                <h1>Recuperação de Senha</h1>
                <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para continuar com o processo:</p>
                <p style="text-align: center;">
                    <a href="${link}" class="buttonLink">Redefinir Senha</a>
                </p>
                <p>Se você não solicitou essa alteração, ignore este e-mail. O link é válido por 1 hora.</p>
                </div>
                <div class="footer">
                <p>Por favor, não responda a este e-mail. Esta caixa de entrada não é monitorada.</p>
                <p>&copy; ${new Date().getFullYear()} ClockIn - Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
            </html>
            `;
    try {
        const result = await sendEmail(email, 'Recupere sua senha', html);
        if (result !== true) {
            console.error('Erro ao enviar email:', result.message);
            await User.setResetToken(email, null, null); // Limpa o token se falhar no envio
            throw new Error('Erro ao enviar email');
        }

        res.json({
            success: true,
            message: 'Email enviado com instruções'
        });
        
    } catch (error) {
        console.error('Erro ao enviar email:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao enviar email'
        });
    }
    
}

module.exports = {
    esqueciSenhaController
};