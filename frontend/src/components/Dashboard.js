// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Table, Button, Badge, 
  Nav, Navbar, Dropdown, Modal, Form, InputGroup, Pagination,
  Tab, Alert
} from 'react-bootstrap';
import { 
  FiMenu, FiUsers, FiCreditCard, FiCalendar, FiDollarSign,
  FiFileText, FiSettings, FiUser, FiBell, FiLogOut,
  FiPrinter, FiDownload, FiPlus, FiAlertCircle,
  FiSearch, FiEdit, FiTrash2, FiEye, FiMail, FiPhone,
  FiBriefcase, FiClock, FiHome
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [entriesPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeStats, setEmployeeStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [error, setError] = useState('');

  // New Employee Form State
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    basicSalary: '',
    status: 'Active'
  });

  const [editEmployee, setEditEmployee] = useState(null);

  // Sample Payroll Data
  const recentPayrolls = [
    { id: 1, month: 'May 2026', employees: 120, gross: '1,245,000', net: '967,500', status: 'Completed' },
    { id: 2, month: 'April 2026', employees: 118, gross: '1,198,000', net: '928,300', status: 'Completed' },
    { id: 3, month: 'March 2026', employees: 115, gross: '1,150,000', net: '890,200', status: 'Completed' },
    { id: 4, month: 'February 2026', employees: 113, gross: '1,102,000', net: '856,400', status: 'Completed' },
    { id: 5, month: 'January 2026', employees: 110, gross: '1,080,000', net: '840,100', status: 'Completed' },
  ];

  const alerts = [
    { id: 1, message: '5 employees attendance not updated', type: 'warning' },
    { id: 2, message: 'Tax configuration not updated for 2026', type: 'danger' },
    { id: 3, message: 'Generate May 2026 payroll', type: 'info' }
  ];

  // Payslip data
  const payslip = {
    company: 'ABC (Pvt) Ltd',
    address: '123, Main Street, Colombo 07',
    phone: 'Tel: 011 234 5678',
    employeeId: 'E001',
    employeeName: 'Nimal Perera',
    designation: 'Manager',
    department: 'Administration',
    month: 'May 2026',
    earnings: [
      { description: 'Basic Salary', amount: 80000 },
      { description: 'Housing Allowance', amount: 10000 },
      { description: 'Transport Allowance', amount: 6000 },
      { description: 'Meal Allowance', amount: 4000 },
    ],
    deductions: [
      { description: 'EPF (8%)', amount: 8000 },
      { description: 'ETF (3%)', amount: 3000 },
      { description: 'Tax (PAYE)', amount: 13500 },
    ],
    netPay: 75500,
    amountInWords: 'Seventy Five Thousand Five Hundred Only'
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/employees/stats');
      setEmployeeStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateToEmployees = () => {
    setActiveTab('employees');
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await api.delete(`/employees/${employeeToDelete.id}`);
        await fetchEmployees();
        await fetchStats();
        setShowDeleteConfirm(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete employee');
      }
    }
  };

  const handleEditEmployee = (employee) => {
    setEditEmployee(employee);
    setNewEmployee({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      basicSalary: employee.basicSalary,
      status: employee.status
    });
    setShowAddEmployee(true);
  };

  const handleAddEmployee = async () => {
    try {
      if (editEmployee) {
        await api.put(`/employees/${editEmployee.id}`, newEmployee);
      } else {
        await api.post('/employees', newEmployee);
      }

      await fetchEmployees();
      await fetchStats();

      setShowAddEmployee(false);
      setEditEmployee(null);
      setNewEmployee({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        basicSalary: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save employee');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? <Badge bg="success">Active</Badge>
      : <Badge bg="secondary">Inactive</Badge>;
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone?.includes(searchTerm)
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEmployees.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render Dashboard Content
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'employees':
        return renderEmployees();
      default:
        return renderDashboard();
    }
  };

  // Dashboard View
  const renderDashboard = () => (
    <>
      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Employees</h6>
                  <h2 className="mb-0">{employeeStats.total || employees.length}</h2>
                </div>
                <div className="stats-icon bg-primary">
                  <FiUsers size={24} color="white" />
                </div>
              </div>
              <Button 
                variant="link" 
                className="p-0 mt-2 text-decoration-none"
                onClick={handleNavigateToEmployees}
              >
                View all employees →
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Gross Pay</h6>
                  <h2 className="mb-0">Rs. 1.2M</h2>
                </div>
                <div className="stats-icon bg-success">
                  <FiCreditCard size={24} color="white" />
                </div>
              </div>
              <small className="text-muted">Monthly payroll</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Net Pay</h6>
                  <h2 className="mb-0">Rs. 967.5K</h2>
                </div>
                <div className="stats-icon bg-info">
                  <FiDollarSign size={24} color="white" />
                </div>
              </div>
              <small className="text-muted">May 2026</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Pending Payroll</h6>
                  <h2 className="mb-0">{alerts.length}</h2>
                </div>
                <div className="stats-icon bg-warning">
                  <FiAlertCircle size={24} color="white" />
                </div>
              </div>
              <Button variant="link" className="p-0 mt-2 text-decoration-none">
                View all alerts →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Payroll Runs & Alerts */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Payroll Runs</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Payroll Month</th>
                    <th>Employees</th>
                    <th>Total Gross Pay</th>
                    <th>Total Net Pay</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayrolls.map((payroll, index) => (
                    <tr key={payroll.id}>
                      <td>{index + 1}</td>
                      <td>{payroll.month}</td>
                      <td>{payroll.employees}</td>
                      <td>Rs. {payroll.gross}</td>
                      <td>Rs. {payroll.net}</td>
                      <td>
                        <Badge bg="success">{payroll.status}</Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <FiFileText size={14} />
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <FiPrinter size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">⚠️ Alerts / Reminders</h5>
            </Card.Header>
            <Card.Body>
              {alerts.map((alert) => (
                <Alert key={alert.id} variant={alert.type} className="mb-2">
                  {alert.message}
                </Alert>
              ))}
              <Button variant="outline-primary" size="sm" className="w-100">
                View all alerts →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payslip Preview */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm payslip-card">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">📄 Payslip Preview</h5>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FiPrinter className="me-1" /> Print
                  </Button>
                  <Button variant="primary" size="sm">
                    <FiDownload className="me-1" /> Download PDF
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="payslip-content">
                <div className="text-center mb-4">
                  <h4 className="mb-1">{payslip.company}</h4>
                  <p className="text-muted mb-0">{payslip.address}</p>
                  <p className="text-muted">{payslip.phone}</p>
                  <h5 className="mt-3">PAYSLIP - {payslip.month}</h5>
                </div>

                <Row className="mb-4">
                  <Col md={6}>
                    <table className="table table-borderless table-sm">
                      <tbody>
                        <tr><td><strong>Employee ID:</strong></td><td>{payslip.employeeId}</td></tr>
                        <tr><td><strong>Employee Name:</strong></td><td>{payslip.employeeName}</td></tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <table className="table table-borderless table-sm">
                      <tbody>
                        <tr><td><strong>Designation:</strong></td><td>{payslip.designation}</td></tr>
                        <tr><td><strong>Department:</strong></td><td>{payslip.department}</td></tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <h6 className="text-success">EARNINGS</h6>
                    <Table bordered size="sm">
                      <thead><tr><th>Description</th><th className="text-end">Amount (Rs.)</th></tr></thead>
                      <tbody>
                        {payslip.earnings.map((item, index) => (
                          <tr key={index}>
                            <td>{item.description}</td>
                            <td className="text-end">{item.amount.toLocaleString()}.00</td>
                          </tr>
                        ))}
                        <tr className="table-success">
                          <td><strong>Total Earnings</strong></td>
                          <td className="text-end">
                            <strong>
                              {payslip.earnings.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}.00
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-danger">DEDUCTIONS</h6>
                    <Table bordered size="sm">
                      <thead><tr><th>Description</th><th className="text-end">Amount (Rs.)</th></tr></thead>
                      <tbody>
                        {payslip.deductions.map((item, index) => (
                          <tr key={index}>
                            <td>{item.description}</td>
                            <td className="text-end">{item.amount.toLocaleString()}.00</td>
                          </tr>
                        ))}
                        <tr className="table-danger">
                          <td><strong>Total Deductions</strong></td>
                          <td className="text-end">
                            <strong>
                              {payslip.deductions.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}.00
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <div className="net-pay-box p-3 bg-light rounded">
                      <div className="row">
                        <div className="col-md-6">
                          <h5 className="text-primary">NET PAY</h5>
                          <h2 className="text-success">Rs. {payslip.netPay.toLocaleString()}.00</h2>
                        </div>
                        <div className="col-md-6">
                          <h6>Amount in Words:</h6>
                          <p className="fw-bold">{payslip.amountInWords}</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="text-center mt-3 text-muted">
                  <small>Payer: May 2026 - {payslip.employeeName} ({payslip.employeeId})</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Employees View
  const renderEmployees = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">👥 Employees</h4>
          <p className="text-muted mb-0">Manage your employee database</p>
        </div>
        <Button variant="primary" onClick={() => {
          setEditEmployee(null);
          setNewEmployee({
            fullName: '',
            email: '',
            phone: '',
            department: '',
            designation: '',
            basicSalary: '',
            status: 'Active'
          });
          setShowAddEmployee(true);
        }}>
          <FiPlus className="me-2" /> Add Employee
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text><FiSearch /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, ID, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>All Departments</option>
                <option>Administration</option>
                <option>Finance</option>
                <option>HR</option>
                <option>IT</option>
                <option>Operations</option>
                <option>Sales</option>
                <option>Production</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((employee) => (
                    <tr key={employee.id}>
                      <td><span className="fw-bold">{employee.employee_id}</span></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="employee-avatar me-2">
                            <div className="avatar-placeholder">
                              {employee.fullName?.charAt(0) || '?'}
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold">{employee.fullName}</div>
                            <small className="text-muted">{employee.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td>{employee.phone}</td>
                      <td>{getStatusBadge(employee.status)}</td>
                      <td className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewDetails(employee)}
                        >
                          <FiEye size={14} />
                        </Button>
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <FiEdit size={14} />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee)}
                        >
                          <FiTrash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {loading ? 'Loading...' : 'No employees found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {filteredEmployees.length > 0 && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top">
              <div className="text-muted">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredEmployees.length)} of {filteredEmployees.length} entries
              </div>
              <Pagination>
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h4 className="text-white mb-0">🏢 Payroll</h4>
          <Button 
            variant="outline-light" 
            size="sm" 
            className="d-md-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </Button>
        </div>
        <nav className="sidebar-nav">
          <Nav className="flex-column">
            <Nav.Link 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => {
                setActiveTab('dashboard');
                navigate('/dashboard');
              }}
            >
              <FiHome className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'employees' ? 'active' : ''}
              onClick={() => {
                setActiveTab('employees');
                navigate('/employees');
              }}
            >
              <FiUsers className="me-2" /> Employees
            </Nav.Link>
            <Nav.Link><FiCreditCard className="me-2" /> Payroll</Nav.Link>
            <Nav.Link><FiCalendar className="me-2" /> Attendance</Nav.Link>
            <Nav.Link><FiDollarSign className="me-2" /> Allowances</Nav.Link>
            <Nav.Link><FiDollarSign className="me-2" /> Deductions</Nav.Link>
            <Nav.Link><FiFileText className="me-2" /> Reports</Nav.Link>
            <Nav.Link><FiFileText className="me-2" /> Payslips</Nav.Link>
            <Nav.Link><FiSettings className="me-2" /> Settings</Nav.Link>
            <Nav.Link><FiUser className="me-2" /> Users</Nav.Link>
          </Nav>
        </nav>
        <div className="sidebar-footer">
          <Button variant="outline-light" size="sm" className="w-100" onClick={handleLogout}>
            <FiLogOut className="me-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Navbar */}
        <Navbar bg="white" className="shadow-sm px-4 py-2">
          <Navbar.Brand>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="me-3 d-md-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </Button>
            <span className="fw-bold">Simple Payroll System</span>
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="me-2"
              onClick={() => {
                setEditEmployee(null);
                setNewEmployee({
                  fullName: '',
                  email: '',
                  phone: '',
                  department: '',
                  designation: '',
                  basicSalary: '',
                  status: 'Active'
                });
                setShowAddEmployee(true);
              }}
            >
              <FiPlus className="me-1" /> Add Employee
            </Button>
            <Button variant="outline-secondary" size="sm" className="me-3">
              <FiBell /> <span className="badge bg-danger ms-1">3</span>
            </Button>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                <FiUser className="me-1" /> {user?.username || 'Admin'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item><FiUser className="me-2" /> Profile</Dropdown.Item>
                <Dropdown.Item><FiSettings className="me-2" /> Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FiLogOut className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar>

        <Container fluid className="p-4">
          {renderContent()}
        </Container>

        {/* Footer */}
        <footer className="text-center text-muted mt-4 pt-3 border-top">
          <small>© 2026 Simple Payroll System. All rights reserved.</small>
        </footer>
      </div>

      {/* Employee Details Modal */}
      <Modal 
        show={showDetails} 
        onHide={handleCloseDetails}
        size="lg"
        className="employee-details-modal"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <div className="d-flex align-items-center">
              <div className="employee-avatar-lg me-3">
                <div className="avatar-placeholder-lg">
                  {selectedEmployee?.fullName?.charAt(0) || '?'}
                </div>
              </div>
              <div>
                <h5 className="mb-0">{selectedEmployee?.fullName}</h5>
                <span className="text-muted">
                  {selectedEmployee?.employee_id} | {selectedEmployee?.designation}
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <Tab.Container defaultActiveKey="personal">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="personal">
                    <FiUser className="me-1" /> Personal Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="job">
                    <FiBriefcase className="me-1" /> Job Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="salary">
                    <FiFileText className="me-1" /> Salary Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="documents">
                    <FiFileText className="me-1" /> Documents
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="history">
                    <FiClock className="me-1" /> History
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="personal">
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Personal Information</h6>
                      <div className="info-item">
                        <label>Full Name</label>
                        <p className="fw-bold">{selectedEmployee.fullName}</p>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <p><FiMail className="me-2" />{selectedEmployee.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Phone</label>
                        <p><FiPhone className="me-2" />{selectedEmployee.phone}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Job Information</h6>
                      <div className="info-item">
                        <label>Department</label>
                        <p>{selectedEmployee.department}</p>
                      </div>
                      <div className="info-item">
                        <label>Designation</label>
                        <p>{selectedEmployee.designation}</p>
                      </div>
                      <div className="info-item">
                        <label>Status</label>
                        <p>{getStatusBadge(selectedEmployee.status)}</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="salary">
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Salary Information</h6>
                      <div className="info-item">
                        <label>Basic Salary</label>
                        <p className="fw-bold">Rs. {selectedEmployee.basicSalary?.toLocaleString() || 0}.00</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="documents">
                  <div className="text-center py-4">
                    <FiFileText size={48} className="text-muted mb-3" />
                    <p className="text-muted">No documents uploaded yet</p>
                    <Button variant="outline-primary">
                      <FiDownload className="me-2" /> Upload Documents
                    </Button>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="history">
                  <div className="text-center py-4">
                    <FiClock size={48} className="text-muted mb-3" />
                    <p className="text-muted">No history available</p>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseDetails}>
            Close
          </Button>
          <Button variant="primary">
            <FiEdit className="me-2" /> Edit Employee
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Employee Modal */}
      <Modal 
        show={showAddEmployee} 
        onHide={() => {
          setShowAddEmployee(false);
          setEditEmployee(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editEmployee ? '✏️ Edit Employee' : '➕ Add New Employee'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={newEmployee.fullName}
                    onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Production">Production</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Designation *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter designation"
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Basic Salary (Rs.) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter basic salary"
                    value={newEmployee.basicSalary}
                    onChange={(e) => setNewEmployee({...newEmployee, basicSalary: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowAddEmployee(false);
            setEditEmployee(null);
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEmployee}>
            {editEmployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete employee <strong>{employeeToDelete?.fullName}</strong> (ID: {employeeToDelete?.employee_id})?</p>
          <p className="text-danger">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;