const db = require('../config/database.js');
const Config = require('./Configs.js');


const Empresa = {
    async getAll() {
        const rows = await db.query('SELECT * FROM empresa');
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query('SELECT *, (select count(*) from clockin.users where users.id_empresa = empresa.id AND status = "ativo") as n_funcionarios FROM empresa INNER JOIN endereco ON endereco.id_empresa = empresa.id WHERE empresa.id = ?', [id]);
        return rows[0];
    },

    async updateById(dados) {
        const { id, ...fields } = dados;
        if (!id) throw new Error('ID é obrigatório');

        // Remove campos indefinidos ou nulos
        const validFields = Object.entries(fields).filter(([_, v]) => v !== undefined && v !== null);

        if (validFields.length === 0) throw new Error('Nenhum dado para atualizar');

        const setClause = validFields.map(([key]) => `${key} = ?`).join(', ');
        const values = validFields.map(([_, value]) => value);

        const [result] = await db.query(
            `UPDATE empresa SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        return result;
    },

    async Create(dados) {
        const { nome, cnpj, telefone, email, endereco } = dados;

        if(!nome || !cnpj || !telefone || !email || !endereco) {
            throw new Error('Todos os campos são obrigatórios');
        }
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction(); 

            const [result] = await conn.query('INSERT INTO empresa SET ?', { nome, cnpj, telefone, email, endereco });
            const id = result.insertId;

            // Passa a conexão para o Config.Create
            // Definição da configuração padrao para o sistema.
            await Config.Create(conn, id, "toleranciaPonto", "5");
            await Config.Create(conn, id, "toleranciaGeral", "10");
            await Config.Create(conn, id, "maximo50", "180");
            await Config.Create(conn, id, "dtFechamento", "25");
            await Config.Create(conn, id, "fotoEnable", "0");
            
            await conn.commit();
            return "Empresa Criada e Configurações padões definidas";

            
        } catch (error) {
            await conn.rollback();
            throw new Error('Erro ao criar empresa: ' + error.message);
        } finally {
            conn.release();
        }
    },

    async Update(dados) {
        const { id, nome, telefone, email } = dados;
        if (!id) {
            throw new Error('ID é obrigatório');
        }
        try {
            const response = await db.query(
                'UPDATE empresa SET nome = ?, telefone = ?, email = ? WHERE id = ?',
                [nome, telefone, email, id]);
            return response;
        } catch (error) {
            throw new Error('Erro ao atualizar empresa: ' + error.message);
        }

    },

    async UpdateEndereco(id, endereco){
        if (!id) {
            throw new Error('ID é obrigatório');
        }
        const { rua, numero, bairro, cidade, estado, cep } = endereco;
        if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
            throw new Error('Todos os campos de endereço são obrigatórios');
        }
        try {
            const response = await db.query(
                'UPDATE endereco SET rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ? WHERE id_empresa = ?',
                [rua, numero, bairro, cidade, estado, cep, id]);
            return response;
        } catch (error) {
            throw new Error('Erro ao atualizar endereço: ' + error.message);
        }

    },

    async getConfigs (id) {
        if (!id) {
            throw new Error('ID é obrigatório');
        }
        try {
            const [response] = await db.query('SELECT * FROM configs WHERE id_empresa = ?', [id]);
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    },

};

module.exports = Empresa;

