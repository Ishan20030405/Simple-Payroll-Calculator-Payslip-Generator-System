// backend/src/controllers/employeeController.js
const Employee = require('../models/Employee');
const db = require('../config/db');

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.getAll();
        res.json(employees);
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
};

// Create new employee - FIXED
exports.createEmployee = async (req, res) => {
    try {
        const employeeData = req.body;

        // Validate required fields
        if (!employeeData.fullName || !employeeData.email) {
            return res.status(400).json({ 
                error: 'Full name and email are required' 
            });
        }

        // Generate employee ID
        const count = await Employee.getCount();
        const employeeId = `E${String(count + 1).padStart(3, '0')}`;
        employeeData.employee_id = employeeId;

        // Check if email exists
        const existingEmployee = await Employee.findByEmployeeId(employeeData.employee_id);
        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee ID already exists' });
        }

        // Clean data - remove undefined values
        const cleanData = {
            employee_id: employeeData.employee_id,
            full_name: employeeData.fullName || null,
            email: employeeData.email || null,
            phone: employeeData.phone || null,
            department: employeeData.department || null,
            designation: employeeData.designation || null,
            status: employeeData.status || 'Active',
            dob: employeeData.dob || null,
            nic: employeeData.nic || null,
            gender: employeeData.gender || null,
            marital_status: employeeData.maritalStatus || null,
            address: employeeData.address || null,
            emergency_contact: employeeData.emergencyContact || null,
            join_date: employeeData.joinDate || null,
            basic_salary: employeeData.basicSalary || 0
        };

        const employeeIdResult = await Employee.create(cleanData);

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [req.user.id, 'EMPLOYEE_CREATED', `Employee ${cleanData.full_name} created`]
        );

        res.status(201).json({
            message: 'Employee created successfully',
            id: employeeIdResult,
            employee_id: employeeId
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

// Update employee - FIXED
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employeeData = req.body;

        const existingEmployee = await Employee.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Clean data - remove undefined values
        const cleanData = {
            fullName: employeeData.fullName || null,
            email: employeeData.email || null,
            phone: employeeData.phone || null,
            department: employeeData.department || null,
            designation: employeeData.designation || null,
            status: employeeData.status || 'Active',
            dob: employeeData.dob || null,
            nic: employeeData.nic || null,
            gender: employeeData.gender || null,
            maritalStatus: employeeData.maritalStatus || null,
            address: employeeData.address || null,
            emergencyContact: employeeData.emergencyContact || null,
            joinDate: employeeData.joinDate || null,
            basicSalary: employeeData.basicSalary || 0
        };

        const updated = await Employee.update(id, cleanData);

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [req.user.id, 'EMPLOYEE_UPDATED', `Employee ${existingEmployee.full_name} updated`]
        );

        res.json({
            message: 'Employee updated successfully',
            updated
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const existingEmployee = await Employee.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const deleted = await Employee.delete(id);

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [req.user.id, 'EMPLOYEE_DELETED', `Employee ${existingEmployee.full_name} deleted`]
        );

        res.json({
            message: 'Employee deleted successfully',
            deleted
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};

// Search employees
exports.searchEmployees = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        const employees = await Employee.search(q);
        res.json(employees);
    } catch (error) {
        console.error('Search employees error:', error);
        res.status(500).json({ error: 'Failed to search employees' });
    }
};

// Get employee stats
exports.getEmployeeStats = async (req, res) => {
    try {
        const total = await Employee.getCount();
        const active = await Employee.getActiveCount();

        res.json({
            total,
            active,
            inactive: total - active
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
};