const db = require('../config/database.js');
const bcrypt = require('bcrypt');

const User = {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
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
        const [rows] = await db.query('SELECT id, cpf, email, nome, tipo, cargo, status, data_cadastro, data_demissao FROM users WHERE id_empresa = ?', [id]);
        return rows;
    },

    async create(user) {
        const { id_empresa, nome, tipo, cargo, email, cpf, data_cadastro, telefone } = user;
        try {
            const [result] = await db.query(
                'INSERT INTO users (id_empresa, nome, status, tipo, cargo, email, cpf, data_cadastro, telefone) VALUES (?, ?, "ativo", ?, ?, ?, ?, ?, ?)',
                [id_empresa, nome, tipo, cargo, email, cpf, data_cadastro, telefone]
            );
            
            return { id: result.insertId, ...user };
            
        } catch (error) {
            console.error('Error creating user:', error);

            throw new Error(error.message || 'Erro ao criar usuário');
            
        }
        
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
        // Remove password before returning user object
        const { password: _, senha: __, ...userWithoutPassword } = user;
        return userWithoutPassword;
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