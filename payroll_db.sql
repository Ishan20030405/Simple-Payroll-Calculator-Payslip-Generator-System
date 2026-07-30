-- ============================================
-- DATABASE: payroll_db
-- ============================================
CREATE DATABASE IF NOT EXISTS payroll_db;
USE payroll_db;

-- ============================================
-- TABLE: users (Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'EMPLOYEE') DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: employees
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(10) UNIQUE NOT NULL,
    user_id INT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(50),
    designation VARCHAR(50),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    dob DATE,
    nic VARCHAR(15),
    gender VARCHAR(10),
    marital_status VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(100),
    join_date DATE,
    basic_salary DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: payrolls
-- ============================================
CREATE TABLE IF NOT EXISTS payrolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    month_year DATE NOT NULL,
    working_days INT DEFAULT 22,
    days_present INT DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    allowances DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    gross_salary DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) DEFAULT 0,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: payslips
-- ============================================
CREATE TABLE IF NOT EXISTS payslips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_id INT NOT NULL,
    employee_id INT NOT NULL,
    file_path VARCHAR(255),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: attendance
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('Present', 'Absent', 'Leave', 'Holiday') DEFAULT 'Absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employee_id, date)
);

-- ============================================
-- TABLE: activity_logs (Logging)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2b$10$G8j5zP5sKq5X5Z5Z5Z5Z5uL5L5L5L5L5L5L5L5L5L5L5', 'ADMIN');

-- ============================================
-- INSERT SAMPLE EMPLOYEES
-- ============================================
INSERT INTO employees (employee_id, full_name, email, phone, department, designation, status, basic_salary) VALUES
('E001', 'Nimal Perera', 'nimal.perera@example.com', '077 123 4567', 'Administration', 'Manager', 'Active', 120000.00),
('E002', 'Kavindu Silva', 'kavindu.silva@example.com', '077 234 5678', 'Finance', 'Executive', 'Active', 85000.00),
('E003', 'Chathuri Fernando', 'chathuri.fernando@example.com', '077 345 6789', 'HR', 'Executive', 'Active', 78000.00),
('E004', 'Sameera Jayawardena', 'sameera.j@example.com', '077 456 7890', 'Operations', 'Assistant', 'Active', 65000.00),
('E005', 'Hasitha De Silva', 'hasitha.desilva@example.com', '077 567 8901', 'IT', 'Officer', 'Active', 95000.00),
('E006', 'Dinithi Rajapaksha', 'dinithi.r@example.com', '077 678 9012', 'Sales', 'Executive', 'Inactive', 72000.00),
('E007', 'Supun Bandara', 'supun.bandara@example.com', '077 789 0123', 'Production', 'Technician', 'Active', 68000.00),
('E008', 'Tharushi Abeysekara', 'tharushi.a@example.com', '077 890 1234', 'Finance', 'Assistant', 'Active', 55000.00);

-- ============================================
-- INSERT SAMPLE PAYROLLS
-- ============================================
INSERT INTO payrolls (employee_id, month_year, days_present, gross_salary, net_salary, status) VALUES
(1, '2026-05-01', 22, 120000.00, 96750.00, 'Completed'),
(2, '2026-05-01', 20, 85000.00, 68500.00, 'Completed'),
(3, '2026-05-01', 22, 78000.00, 62800.00, 'Completed');