const db = require('../config/database.js');
const Config = require('./Configs.js');


const Empresa = {
    async getAll() {
        const rows = await db.query('SELECT * FROM empresa');
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query('SELECT * FROM empresa WHERE id = ?', [id]);
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
            
            await conn.commit();
            return "Empresa Criada e Configurações padões definidas";

            
        } catch (error) {
            await conn.rollback();
            throw new Error('Erro ao criar empresa: ' + error.message);
        } finally {
            conn.release();
        }
    }

};

module.exports = Empresa;

