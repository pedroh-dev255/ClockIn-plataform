const Empresa = require('../models/Empresa.js')

async function GetAll() {
    const [rows] = await Empresa.getAll();

    return rows;
}

async function GetById(id) {
    const [rows] = await Empresa.getById(id);

    return rows;
}

async function Create(dados) {
    const result = await Empresa.Create(dados);
    return result;
}

module.exports = {
    GetAll,
    GetById,
    Create

};