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

async function Update(dados, endereco) {
    const result = await Empresa.Update(dados);
    const resultEndereco = await Empresa.UpdateEndereco(dados.id,endereco);

    if (result && resultEndereco) {
        return result && resultEndereco;
    }

    return result || resultEndereco;
}

async function getConfigs(id) {
    try {
        const configs = await Empresa.getConfigs(id);
        return configs;
    } catch (error) {
        throw new Error('Erro ao buscar configurações da empresa: ' + error.message);
    }
}

module.exports = {
    GetAll,
    GetById,
    Create,
    GetByEmpresaId,
    Update,
    getConfigs

};