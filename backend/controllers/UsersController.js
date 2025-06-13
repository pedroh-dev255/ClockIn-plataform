const { getUserId, getAllUsers } = require('../services/UsersService.js');


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
    getUserById
};