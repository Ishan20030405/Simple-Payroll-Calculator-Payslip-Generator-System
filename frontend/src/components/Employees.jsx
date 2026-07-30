// src/components/Employees.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, Row, Col, Card, Table, Button, Badge, 
  Form, InputGroup, Pagination, Modal, Nav, Tab,
  Navbar, Dropdown, Alert, Spinner
} from 'react-bootstrap';
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, FiEye, 
  FiUser, FiMail, FiPhone, FiUsers, 
  FiBriefcase, FiFileText, FiClock, FiDownload, 
  FiHome, FiCreditCard, FiSettings, FiLogOut, 
  FiBell, FiMenu, FiDollarSign, FiCalendar,
  FiMapPin, FiUserCheck, FiUserX, FiAward
} from 'react-icons/fi';
import '../styles/Employees.css';

const Employees = () => {
  const navigate = useNavigate();
  const { user, logout, api } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(8);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    nic: '',
    gender: '',
    maritalStatus: '',
    address: '',
    emergencyContact: '',
    department: '',
    designation: '',
    joinDate: '',
    basicSalary: '',
    status: 'Active'
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
      setEmployees(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => {
    return [
      {
        id: 1,
        employee_id: 'E001',
        full_name: 'Nimal Perera',
        department: 'Administration',
        designation: 'Manager',
        phone: '077 123 4567',
        email: 'nimal.perera@example.com',
        status: 'Active',
        dob: '1990-05-15',
        nic: '900123456V',
        gender: 'Male',
        marital_status: 'Married',
        address: '123, Main Street, Colombo 07',
        emergency_contact: '071 987 6543 (Kamal Perera)',
        join_date: '2020-01-15',
        basic_salary: 120000
      },
      {
        id: 2,
        employee_id: 'E002',
        full_name: 'Kavindu Silva',
        department: 'Finance',
        designation: 'Executive',
        phone: '077 234 5678',
        email: 'kavindu.silva@example.com',
        status: 'Active',
        dob: '1988-08-20',
        nic: '880820123V',
        gender: 'Male',
        marital_status: 'Single',
        address: '45, Galle Road, Colombo 03',
        emergency_contact: '077 345 6789 (Saman Silva)',
        join_date: '2021-03-10',
        basic_salary: 85000
      }
    ];
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      nic: '',
      gender: '',
      maritalStatus: '',
      address: '',
      emergencyContact: '',
      department: '',
      designation: '',
      joinDate: '',
      basicSalary: '',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (employee) => {
    setIsEditing(true);
    setFormData({
      id: employee.id,
      fullName: employee.full_name || employee.fullName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      dob: employee.dob || '',
      nic: employee.nic || '',
      gender: employee.gender || '',
      maritalStatus: employee.marital_status || employee.maritalStatus || '',
      address: employee.address || '',
      emergencyContact: employee.emergency_contact || employee.emergencyContact || '',
      department: employee.department || '',
      designation: employee.designation || '',
      joinDate: employee.join_date || employee.joinDate || '',
      basicSalary: employee.basic_salary || employee.basicSalary || '',
      status: employee.status || 'Active'
    });
    setShowAddModal(true);
  };

  const handleSaveEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const data = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob || null,
        nic: formData.nic || null,
        gender: formData.gender || null,
        maritalStatus: formData.maritalStatus || null,
        address: formData.address || null,
        emergencyContact: formData.emergencyContact || null,
        department: formData.department,
        designation: formData.designation,
        joinDate: formData.joinDate || null,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        status: formData.status || 'Active'
      };

      if (isEditing) {
        await api.put(`/employees/${formData.id}`, data);
        setSuccess('Employee updated successfully!');
      } else {
        await api.post('/employees', data);
        setSuccess('Employee added successfully!');
      }

      await fetchEmployees();
      setShowAddModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      if (err.response?.status === 409) {
        setError(err.response?.data?.error || 'Duplicate entry');
      } else {
        setError(err.response?.data?.error || 'Failed to save employee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    setLoading(true);
    setError('');
    try {
      await api.delete(`/employees/${employeeToDelete.id}`);
      setSuccess('Employee deleted successfully!');
      await fetchEmployees();
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const filteredEmployees = employees.filter(emp => {
    const name = emp.full_name || emp.fullName || '';
    const id = emp.employee_id || emp.id || '';
    const email = emp.email || '';
    const phone = emp.phone || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEmployees.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedEmployee(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? <Badge bg="success">Active</Badge>
      : <Badge bg="secondary">Inactive</Badge>;
  };

  const getEmployeeName = (emp) => {
    return emp.full_name || emp.fullName || '';
  };

  const getEmployeeId = (emp) => {
    return emp.employee_id || emp.id || '';
  };

  const getBasicSalary = (emp) => {
    return emp.basic_salary || emp.basicSalary || 0;
  };

  return (
    <div className="employees-wrapper">
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
            <Nav.Link onClick={() => navigate('/dashboard')}>
              <FiHome className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link active className="active">
              <FiUsers className="me-2" /> Employees
            </Nav.Link>
            <Nav.Link>
              <FiCreditCard className="me-2" /> Payroll
            </Nav.Link>
            <Nav.Link>
              <FiCalendar className="me-2" /> Attendance
            </Nav.Link>
            <Nav.Link>
              <FiDollarSign className="me-2" /> Allowances
            </Nav.Link>
            <Nav.Link>
              <FiDollarSign className="me-2" /> Deductions
            </Nav.Link>
            <Nav.Link>
              <FiFileText className="me-2" /> Reports
            </Nav.Link>
            <Nav.Link>
              <FiFileText className="me-2" /> Payslips
            </Nav.Link>
            <Nav.Link>
              <FiSettings className="me-2" /> Settings
            </Nav.Link>
            <Nav.Link>
              <FiUser className="me-2" /> Users
            </Nav.Link>
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
              onClick={handleOpenAddModal}
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
          {success && (
            <Alert variant="success" className="mb-4" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">👥 Employees</h4>
              <p className="text-muted mb-0">Manage your employee database</p>
            </div>
            <Button variant="primary" onClick={handleOpenAddModal}>
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
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading employees...</p>
                </div>
              ) : (
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
                            <td><span className="fw-bold">{getEmployeeId(employee)}</span></td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="employee-avatar me-2">
                                  <div className="avatar-placeholder">
                                    {getEmployeeName(employee).charAt(0) || '?'}
                                  </div>
                                </div>
                                <div>
                                  <div className="fw-bold">{getEmployeeName(employee)}</div>
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
                                onClick={() => handleOpenEditModal(employee)}
                              >
                                <FiEdit size={14} />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleOpenDeleteModal(employee)}
                              >
                                <FiTrash2 size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <p className="text-muted mb-0">No employees found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}

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

          <footer className="text-center text-muted mt-4 pt-3 border-top">
            <small>© 2026 Simple Payroll System. All rights reserved.</small>
          </footer>
        </Container>
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
                  {selectedEmployee ? getEmployeeName(selectedEmployee).charAt(0) : '?'}
                </div>
              </div>
              <div>
                <h5 className="mb-0">{selectedEmployee ? getEmployeeName(selectedEmployee) : ''}</h5>
                <span className="text-muted">
                  {selectedEmployee ? `${getEmployeeId(selectedEmployee)} | ${selectedEmployee.designation}` : ''}
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
                  <Nav.Link eventKey="personal"><FiUser className="me-1" /> Personal Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="job"><FiBriefcase className="me-1" /> Job Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="salary"><FiFileText className="me-1" /> Salary Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="documents"><FiFileText className="me-1" /> Documents</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="history"><FiClock className="me-1" /> History</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="personal">
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Personal Information</h6>
                      <div className="info-item">
                        <label>Full Name</label>
                        <p className="fw-bold">{getEmployeeName(selectedEmployee)}</p>
                      </div>
                      <div className="info-item">
                        <label>Date of Birth</label>
                        <p>{selectedEmployee.dob || 'Not provided'}</p>
                      </div>
                      <div className="info-item">
                        <label>NIC Number</label>
                        <p>{selectedEmployee.nic || 'Not provided'}</p>
                      </div>
                      <div className="info-item">
                        <label>Gender</label>
                        <p>{selectedEmployee.gender || 'Not provided'}</p>
                      </div>
                      <div className="info-item">
                        <label>Marital Status</label>
                        <p>{selectedEmployee.marital_status || 'Not provided'}</p>
                      </div>
                      <div className="info-item">
                        <label>Address</label>
                        <p>{selectedEmployee.address || 'Not provided'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Contact Information</h6>
                      <div className="info-item">
                        <label>Email</label>
                        <p><FiMail className="me-2" />{selectedEmployee.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Phone</label>
                        <p><FiPhone className="me-2" />{selectedEmployee.phone}</p>
                      </div>
                      <div className="info-item">
                        <label>Emergency Contact</label>
                        <p><FiPhone className="me-2" />{selectedEmployee.emergency_contact || 'Not provided'}</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="job">
                  <Row>
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
                        <label>Date of Joining</label>
                        <p>{selectedEmployee.join_date || 'Not provided'}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Status</h6>
                      <div className="info-item">
                        <label>Current Status</label>
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
                        <p className="fw-bold">Rs. {getBasicSalary(selectedEmployee).toLocaleString()}.00</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="documents">
                  <div className="text-center py-4">
                    <FiFileText size={48} className="text-muted mb-3" />
                    <p className="text-muted">No documents uploaded yet</p>
                    <Button variant="outline-primary"><FiDownload className="me-2" /> Upload Documents</Button>
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
          <Button variant="outline-secondary" onClick={handleCloseDetails}>Close</Button>
          <Button variant="primary" onClick={() => {
            if (selectedEmployee) {
              handleOpenEditModal(selectedEmployee);
              handleCloseDetails();
            }
          }}>
            <FiEdit className="me-2" /> Edit Employee
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Employee Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        size="lg"
        className="employee-form-modal"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {isEditing ? '✏️ Edit Employee' : '➕ Add New Employee'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Personal Information Section */}
            <div className="form-section mb-4">
              <h6 className="text-primary border-bottom pb-2 mb-3">
                <FiUser className="me-2" /> Personal Information
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>NIC Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="nic"
                      placeholder="Enter NIC number"
                      value={formData.nic}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Marital Status</Form.Label>
                    <Form.Select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Marital Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContact"
                      placeholder="Enter emergency contact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  placeholder="Enter residential address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>

            {/* Job Information Section */}
            <div className="form-section mb-4">
              <h6 className="text-primary border-bottom pb-2 mb-3">
                <FiBriefcase className="me-2" /> Job Information
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Administration">Administration</option>
                      <option value="Finance">Finance</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Production">Production</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Designation <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      placeholder="Enter job title"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Joining</Form.Label>
                    <Form.Control
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Basic Salary (Rs.) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      name="basicSalary"
                      placeholder="Enter basic salary"
                      value={formData.basicSalary}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </div>

            {/* Summary Section */}
            <div className="form-section">
              <h6 className="text-primary border-bottom pb-2 mb-3">
                <FiAward className="me-2" /> Summary
              </h6>
              <div className="bg-light p-3 rounded">
                <Row>
                  <Col md={4}>
                    <small className="text-muted">Full Name</small>
                    <p className="fw-bold mb-0">{formData.fullName || 'Not provided'}</p>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted">Department</small>
                    <p className="fw-bold mb-0">{formData.department || 'Not provided'}</p>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted">Status</small>
                    <p className="fw-bold mb-0">
                      {formData.status === 'Active' 
                        ? <Badge bg="success">Active</Badge>
                        : <Badge bg="secondary">Inactive</Badge>
                      }
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveEmployee}
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Employee' : 'Add Employee')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete employee <strong>{employeeToDelete ? getEmployeeName(employeeToDelete) : ''}</strong> (ID: {employeeToDelete ? getEmployeeId(employeeToDelete) : ''})?</p>
          <p className="text-danger">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteEmployee}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Employees;