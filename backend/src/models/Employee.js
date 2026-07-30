// src/models/Employee.js
const db = require('../config/db');

class Employee {
    // Get all employees
    static async getAll() {
        const query = 'SELECT * FROM employees ORDER BY id DESC';
        const [rows] = await db.execute(query);
        return rows;
    }

    // Get employee by ID
    static async findById(id) {
        const query = 'SELECT * FROM employees WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // Get employee by employee_id
    static async findByEmployeeId(employeeId) {
        const query = 'SELECT * FROM employees WHERE employee_id = ?';
        const [rows] = await db.execute(query, [employeeId]);
        return rows[0];
    }

    // Create new employee
    static async create(data) {
        const {
            employee_id, full_name, email, phone, department,
            designation, status, dob, nic, gender, marital_status,
            address, emergency_contact, join_date, basic_salary
        } = data;

        const query = `
            INSERT INTO employees (
                employee_id, full_name, email, phone, department,
                designation, status, dob, nic, gender, marital_status,
                address, emergency_contact, join_date, basic_salary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            employee_id, full_name, email, phone, department,
            designation, status || 'Active', dob, nic, gender,
            marital_status, address, emergency_contact, join_date, basic_salary
        ]);

        return result.insertId;
    }

    // Update employee
    static async update(id, data) {
        const fields = [];
        const values = [];

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });

        values.push(id);
        const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }

    // Delete employee
    static async delete(id) {
        const query = 'DELETE FROM employees WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    }

    // Search employees
    static async search(searchTerm) {
        const query = `
            SELECT * FROM employees 
            WHERE full_name LIKE ? 
            OR employee_id LIKE ? 
            OR email LIKE ? 
            OR phone LIKE ?
            ORDER BY id DESC
        `;
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await db.execute(query, [
            searchPattern, searchPattern, searchPattern, searchPattern
        ]);
        return rows;
    }

    // Get employees by department
    static async getByDepartment(department) {
        const query = 'SELECT * FROM employees WHERE department = ?';
        const [rows] = await db.execute(query, [department]);
        return rows;
    }

    // Get employee count
    static async getCount() {
        const query = 'SELECT COUNT(*) as count FROM employees';
        const [rows] = await db.execute(query);
        return rows[0].count;
    }

    // Get active employees count
    static async getActiveCount() {
        const query = "SELECT COUNT(*) as count FROM employees WHERE status = 'Active'";
        const [rows] = await db.execute(query);
        return rows[0].count;
    }
}

module.exports = Employee;