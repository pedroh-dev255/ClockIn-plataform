const { getUserId, getAllUsers, login } = require('../services/UsersService.js');
const jwt = require('jsonwebtoken');


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
            message: 'Please enter both login and password'
        });
    }

    try {
        const user = await login(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha Incorretos'
            });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            success: true,
            userData: user,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
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
    loginController
};