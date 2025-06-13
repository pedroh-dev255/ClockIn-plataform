const db = require('../config/database.js');


const Empresa = {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM empresa');
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query('SELECT * FROM empresa WHERE id = ?', [id]);
        return rows[0];
    },

};

module.exports = Empresa;