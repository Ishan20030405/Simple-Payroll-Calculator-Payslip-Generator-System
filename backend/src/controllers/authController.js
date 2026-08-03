// src/controllers/authController.js
const User = require('../models/User');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create user
        const userId = await User.create(username, password, role || 'EMPLOYEE');

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [userId, 'USER_REGISTERED', `User ${username} registered`]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log activity
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [user.id, 'USER_LOGIN', `User ${username} logged in`]
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

// Logout (client side will remove token)
exports.logout = async (req, res) => {
    try {
        await db.execute(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [req.user.id, 'USER_LOGOUT', `User ${req.user.username} logged out`]
        );
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

// backend/src/controllers/authController.js

// Register user from employee creation
exports.registerUserFromEmployee = async (req, res) => {
  try {
    const { username, password, role, employeeId, fullName } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Username, password and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
// Pass the raw NIC password.
// User.create() will hash it.
const userId = await User.create(username, password, role);

    // Link employee to user
    if (employeeId) {
      await db.execute(
        'UPDATE employees SET user_id = ? WHERE employee_id = ?',
        [userId, employeeId]
      );
    }

    // Log activity
    await db.execute(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [userId, 'USER_CREATED_FROM_EMPLOYEE', `User ${username} created from employee ${fullName}`]
    );

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      userId,
      credentials: {
        username: username,
        password: password // NIC number (show only once)
      }
    });

  } catch (error) {
    console.error('Register user from employee error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user account'
    });
  }
};