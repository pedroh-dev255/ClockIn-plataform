const User = require('../models/users.js')

async function getUserId(id) {
    if(id === null) {
        return null;
    }
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function logoutService(token) {
    try {

        const result = await User.removeToken(token);
        return result;
    } catch (error) {
        console.error('Erro ao realizar logout:', error);
        return null;
    }
}


async function updateToken(id, token, expiresAt) {
    try {
        const user = await User.updateToken(id, token, expiresAt);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAllUsers(){
    try {
        const users = await User.getAll();
        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function login(email, password) {
    try {
        const user = await User.LoginModel(email, password);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}

async function createUser(user) {
    try {
        const newUser = await User.create(user);

        return newUser;
    }
    catch (error) {
        console.error(error);
        throw new Error(error.message || 'Erro ao criar usuário');
    }
}

async function desligamentoUser(userId, dataDemissao) {
    try {
        const result = await User.desligamento(userId, dataDemissao);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Erro ao desligar usuário');
    }
    
}

async function ResetSenha(id, senha) {
    const result = await User.resetarSenha(id,senha);
    return result;
    
}

module.exports = {
    getUserId,
    getAllUsers,
    login,
    logoutService,
    createUser,
    ResetSenha,
    desligamentoUser,
    updateToken
};