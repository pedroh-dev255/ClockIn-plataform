const { Create, GetAll, GetById } = require('../services/EmpresaService');

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

module.exports = {
    GetAllC,
    CreateC
}