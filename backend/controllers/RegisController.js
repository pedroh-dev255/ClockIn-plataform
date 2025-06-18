const { getAll, getAllByUserId } = require('../services/RegisService.js');



async function getAllController(req, res) {
    try {
        const response = await getAll();
        
        res.status(200).json({
            success: true,
            registros: response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });

    } 
}

async function getAllByUser(req, res) {
    const { id } = req.body;
    try {
        const response = await getAllByUserId(id);
        
        res.status(200).json({
            success: true,
            registros: response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });

    } 
}


module.exports = {
    getAllController,
    getAllByUser
}