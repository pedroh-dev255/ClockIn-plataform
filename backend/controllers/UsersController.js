const { getUserId, getAllUsers, login, createUser, desligamentoUser, ResetSenha } = require('../services/UsersService.js');
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

async function loginController(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'missing_credentials'
        });
    }

    try {
        const user = await login(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'incorrect_credentials'
            });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '6h' } 
        );


        res.status(200).json({
            success: true,
            userData: user,
            resetPassword: false,
            token
        });
        

    } catch (error) {
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
    loginController,
    Register,
    resetSenhaController,
    desligamento
};