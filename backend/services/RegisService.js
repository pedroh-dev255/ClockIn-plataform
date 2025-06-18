const Registros = require('../models/Registros');

async function getAll() {
    try {
        const registros = await Registros.getAllReg();
        return registros;
        
    } catch (error) {
        console.error(error);
        return
    }
    
}

async function getAllByUserId(id_user) {
    try {
        const registros = await Registros.getAllByUserId(id_user);
        return registros;
        
    } catch (error) {
        console.error(error);
        return
    }
    
}

async function getRegById(id) {
    try {
        const registros = await Registros.getRegById(id);
        return registros;
        
    } catch (error) {
        console.error(error);
        return
    }
    
}

async function getRegByDate(date) {
    try {
        const registros = await Registros.getRegByDate(date);
        return registros;
        
    } catch (error) {
        console.error(error);
        return
    }
    
}

async function getRegByUserDate(id_user, date) {
    try {
        const registros = await Registros.getRegByUserDate(id_user, date);
        return registros;
        
    } catch (error) {
        console.error(error);
        return
    }
    
}

module.exports = {
    getAll,
    getAllByUserId,
    getRegById,
    getRegByDate,
    getRegByUserDate
}