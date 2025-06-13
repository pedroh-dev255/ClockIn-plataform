const db = require('../config/database.js');

// User model with basic CRUD operations
const User = {
    // Get all users
    async getAll() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },

    // Get user by ID
    async getById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    // Create new user
    async create(user) {
        const { name, email, password } = user;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return { id: result.insertId, ...user };
    },

    // Update user by ID
    async update(id, user) {
        const { name, email, password } = user;
        await db.query(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, password, id]
        );
        return { id, ...user };
    },

    // Delete user by ID
    async delete(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        return { id };
    }
};

module.exports = User;