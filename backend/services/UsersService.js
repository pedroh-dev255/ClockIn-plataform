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

module.exports = {
    getUserId,
    getAllUsers,
    login
};