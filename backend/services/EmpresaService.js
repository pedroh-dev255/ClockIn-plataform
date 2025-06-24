const Empresa = require('../models/Empresa.js');
const User = require('../models/users.js');

async function GetAll() {
    const [rows] = await Empresa.getAll();

    return rows;
}

async function GetById(id) {
    const rows = await Empresa.getById(id);

    return rows;
}

async function Create(dados) {
    const result = await Empresa.Create(dados);
    return result;
}

async function GetByEmpresaId(id) {
    const rows = await User.getByEmpresaId(id);
    return rows;
}

async function Update(dados) {
    const result = await Empresa.Update(dados);
    return result;
}


module.exports = {
    GetAll,
    GetById,
    Create,
    GetByEmpresaId,
    Update

};