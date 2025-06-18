const db = require('../config/database.js');


const Configs = {
    async getConf() {
        try {
            const [rows] = await db.query('SELECT * FROM configs');
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async config(id, conf){
        try {
            const [rows] = await db.query(`SELECT * FROM configs WHERE id_empresa = ? AND nome = ?`, [id, conf]);
            return rows;
        } catch (error) {
            console.error(error);   
            return [];
        }
    },

    async Create(conn, id, nome, value){
        try {
            const [rows] = await conn.query(`INSERT INTO configs(id_empresa, nome, valor) VALUES (?,?,?)`, [id, nome, value]);
            return rows;
        } catch (error) {
            console.error(error);   
            return [];
        }
    }

}

module.exports = Configs;