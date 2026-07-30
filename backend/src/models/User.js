// src/models/User.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // Create new user
    static async create(username, password, role = 'EMPLOYEE') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [username, hashedPassword, role]);
        return result.insertId;
    }

    // Find user by username
    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(query, [username]);
        return rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const query = 'SELECT id, username, role, created_at FROM users WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Get all users
    static async getAll() {
        const query = 'SELECT id, username, role, created_at FROM users ORDER BY id DESC';
        const [rows] = await db.execute(query);
        return rows;
    }

    // Delete user
    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;