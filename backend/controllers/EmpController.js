const { Create, GetAll, GetById, GetByEmpresaId, Update, getConfigs } = require('../services/EmpresaService');

async function GetAllC(req,res) {
    try {
        const response = await GetAll();
        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        
    }
}

async function CreateC(req, res) {
    const {
        nome,
        cnpj,
        telefone,
        email,
        endereco
    } = req.body;
    
    if(!nome || !cnpj || !telefone || !email || !endereco) {
        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos'
        });
    }

    const dados = {nome, cnpj, telefone, email, endereco};
    try {
        const response = await Create(dados);
        res.status(201).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function GetByIdC(req, res) {
    // http://localhost:3500/api/emp/getByEmpresaId?id=1
    
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an id'
        });
    }
    try {
        const response = await GetById(id);
        
        res.status(200).json({
            success: true,
            empresa: response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching empresa data' + error.message
        });

    }
}

async function UpdateC(req, res) {
    const {id, nome, email, telefone, rua, numero, bairro, cidade, estado, cep} = req.body;
    
    if(!id){
        return res.status(400).json({
            success: false,
            message: 'ID é obrigatório'
        });
    }

    if(!nome || !email || !telefone) {
        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos obrigatórios'
        });
    }

    if(!rua || !numero || !bairro || !cidade || !estado || !cep) {
        return res.status(400).json({
            success: false,
            message: 'Preencha todos os campos de endereço'
        });
    }

    const dados = {id, nome, email, telefone};
    const endereco = {rua, numero, bairro, cidade, estado, cep};
    try {
        const response = await Update(dados, endereco);
        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating empresa: ' + error.message
        });
    }
}

async function getConfigsC(req, res) {
    const id = req.query.id;

    if(!id){
        return res.status(400).json({
            success: false,
            message: 'ID é obrigatório'
        });
    }

    try {
        const response = await getConfigs(id);
        res.status(200).json({
            success: true,
            data: response
        });

        
    } catch (error) {
        console.error(error);

         res.status(500).json({
            success: false,
            message: 'Error getting settings: ' + error.message
        });
    }
    
}

async function GetByEmpresaIdC(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an id'
        });
    }
    try {
        const response = await GetByEmpresaId(id);
        
        res.status(200).json({
            success: true,
            funcionarios: response
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
    GetAllC,
    CreateC,
    GetByEmpresaIdC,
    GetByIdC,
    UpdateC,
    getConfigsC
}