const { getUserId, getAllUsers, login, createUser, desligamentoUser, ResetSenha, updateToken, logoutService } = require('../services/UsersService.js');
const { registerLoginAttempt } = require('../middlewares/loginRateLimiter');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


async function getAll(req, res) {
    try {
        const users = await getAllUsers()
        res.status(200).json({
            success: true,
            return: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
}

async function logout(req, res) {
    if (!req.headers.authorization) {
        return res.status(400).json({
            success: false,
            message: 'Authorization header is missing'
        });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token não fornecido'
        });
    }

    try {
        const result = await logoutService(token);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao deslogar'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao realizar logout:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar logout'
        });
    }
}

async function loginController(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        registerLoginAttempt(req, 'false');
        return res.status(400).json({
            success: false,
            message: 'missing_credentials'
        });
    }

    try {
        const user = await login(email, password);

        if (!user) {
            registerLoginAttempt(req, 'false');
            return res.status(401).json({
                success: false,
                message: 'incorrect_credentials'
            });
        }

        const expiresIn = parseInt(process.env.EXPIRATION_TIME, 10);
        const expiresAt = new Date(Date.now() + expiresIn * 1000); 
        console.log('Token expires at:', expiresAt);
        console.log('horario atual:', new Date());
        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        // Passa o novo token para o usuário
        const updatedUser = await updateToken(user.id, token, expiresAt);

        if (!updatedUser) {
            
            return res.status(500).json({
                success: false,
                message: 'error_updating_token'
            });
        }

        registerLoginAttempt(req, 'true');

        res.status(200).json({
            success: true,
            userData: user,
            resetPassword: false,
            token
        });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'error_fetching'
        });
    }
}

async function Register(req, res) {
    const {id_empresa, nome, tipo, cargo, email, cpf, dt_inicio, telefone} = req.body;

    if (!id_empresa || !nome || !tipo || !cargo || !email || !cpf || !dt_inicio || !telefone) {
        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos obrigatórios'
        });
    }

    try {
        const newUser = await createUser({id_empresa, nome, tipo, cargo, email, cpf, dt_inicio, telefone});

        res.status(201).json({
            success: true,
            userData: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar usuário: ' + error.message
        });
    }
}

async function resetSenhaController(req, res) {
    const { senha } = req.body;
    
    if (!senha || senha.length < 8) {
        return res.status(400).json({ success: false, message: 'invalid_password' });
    }


    try {
        
        const hashed = await bcrypt.hash(senha, 10);

        const result = await ResetSenha(req.usuarioParaReset.id, hashed);
        if (result.affectedRows === 0) {
            throw new Error('Erro ao redefinir a senha do usuário');
        }

        return res.status(200).json({
            success: true,
            message:'Senha redefinida com sucesso!'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Erro ao redefinir senha' });
    }
}

async function desligamento(req, res) {
    const {id_funcionario, desligamento} = req.body;

    if (!id_funcionario || !desligamento) {
        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos obrigatórios'
        });
    }

    try {
        const result = await desligamentoUser(id_funcionario, desligamento);
        res.status(200).json({
            success: true,
            return: result
        });
    } catch (error) {
        console.error('Error desligando usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao desligar usuário: ' + error.message
        });
    }
    
}


async function getUserById(req, res) {
    const {id} = req.body;

    if(!id){
        res.status(500).json({
            success: false,
            message: 'Envie todos os elementos'
        });
    }
    
    try {
        const users = await getUserId(id);
        res.status(200).json({
            success: true,
            return: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
}


module.exports = {
    getAll,
    getUserById,
    logout,
    loginController,
    Register,
    resetSenhaController,
    desligamento

};