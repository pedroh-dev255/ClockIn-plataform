const db = require('../config/database.js');

const Registros = {
    async getAllReg() {
        try {
            const [rows] = await db.query('SELECT * FROM registros ORDER BY data Desc');
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getAllByUserId(id) {
        try {
            const [rows] = await db.query('SELECT * FROM registros where id_usuario = ? ORDER BY data Desc',[id]);
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getRegByUserDate(id_user, date) {
        try {
            const [rows] = await db.query('SELECT * FROM registros where id_usuario = ? AND data = ? ORDER BY date Desc',[id_user,date]);
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getRegByDate(date) {
        try {
            const [rows] = await db.query('SELECT * FROM registros where date = ? ORDER BY data Desc',[date]);
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getRegById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM registros where id = ? ORDER BY data Desc',[id]);
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

};

module.exports = Registros;