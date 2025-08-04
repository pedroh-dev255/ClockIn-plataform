const db = require('../config/database.js');
const bcrypt = require('bcrypt');

const User = {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },

    async getUserByToken(token){
        const [rows] = await db.query('SELECT * FROM users WHERE token = ?', [token]);
        return rows[0];
    },

    async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    async getById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    async getByEmpresaId(id) {
        const [rows] = await db.query('SELECT id, cpf, email, nome, tipo, telefone, cargo, status, data_cadastro, data_demissao FROM users WHERE id_empresa = ?', [id]);
        return rows;
    },

    async create(user) {
        const { id_empresa, nome, tipo, cargo, email, cpf, dt_inicio, telefone } = user;
        try {
            const [result] = await db.query(
                'INSERT INTO users (id_empresa, nome, status, tipo, cargo, email, cpf, data_cadastro, telefone) VALUES (?, ?, "ativo", ?, ?, ?, ?, ?, ?)',
                [id_empresa, nome, tipo, cargo, email, cpf, dt_inicio, telefone]
            );
            
            return result.insertId ? { id: result.insertId, ...user } : null;

        } catch (error) {
            console.error('Error creating user:', error);

            throw new Error(error.message || 'Erro ao criar usuário');
            
        }
        
    },

    async findToken(token){
        const [rows] = await db.query('SELECT * FROM login_tokens WHERE token = ?', [token]);
        if(rows[0]){
            return true;
        }
        return false;
    },

    async getByResetToken(token) {
        const [result] = await db.query(
            'SELECT * FROM users WHERE resetToken = ?',
            [token]
        );
        return result[0] || null;
    },

    async setResetToken(email, token, tokenExpira) {
        const [result] = await db.query(
            'UPDATE users SET resetToken = ?, tokenExpira = ? WHERE email = ?',
            [token, tokenExpira, email]
        );
        return result;
    },

    async resetarSenha(id, senha) {
        const [result] = await db.query('UPDATE users SET senha = ?, resetToken = NULL, tokenExpira = NULL WHERE id = ?', [senha, id]);
        return result;
    },

    async desligamento(id, data_demissao) {
        const [rows] = await db.query('SELECT id, status FROM users WHERE id = ?', [id]);
        const user = rows[0];   
        if (!user) {
            throw new Error('Erro usuario não existe');;
        }
        if (user.status !== 'ativo') {
            throw new Error('Erro usuario já desligado');
        }
        
        await db.query('UPDATE users SET status = "desligado", data_demissao = ? WHERE id = ?', [data_demissao, id]);
        await db.query('UPDATE registros SET status = "Fechado" WHERE id_usuario = ?', [id]);
        await db.query('UPDATE saldo_diario SET mode = "Fechado" WHERE id_usuario = ?', [id]);
        return { id, data_demissao };
    },


    async update(id, user) {
        const { name, email, password } = user;
        await db.query(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, password, id]
        );
        return { id, ...user };
    },


    async delete(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        return { id };
    },


    async LoginModel(email, password) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            return null;
        }
        // Ajuste: senha salva como $2y$... deve ser convertida para $2a$... para bcrypt do Node.js
        let hashedPassword = user.senha || user.password;
        if (hashedPassword && hashedPassword.startsWith('$2y$')) {
            hashedPassword = '$2a$' + hashedPassword.slice(4);
        }
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatch) {
            return null;
        }

        
        // Remove password and token before returning user object
        const { senha, ...userWithoutPasswordAndToken } = user;
        
        return userWithoutPasswordAndToken;
    },

    async updateToken(id, token, expiresAt) {
        // expiresIn padrão "6h"
        

        console.log('Updating token for user:', id, 'with expiration:', expiresAt);

        const result = await db.query('INSERT INTO login_tokens(id_usuario,token) values (?, ?)', [id, token]);
        if (result[0].affectedRows === 0) {
            return null;
        }
        return { id, token };

    },

    async UpdateSenha(id, password) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        const user = rows[0];
        if (!user) {
            return null;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.query('UPDATE users SET senha = ? WHERE id = ?', [hashedPassword, id]);
        return { id };
    }


};

module.exports = User;