// src/features/team/EmployeeList.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';
import './EmployeeList.css';

const EmployeeList = ({ onAddClick, onEditClick, refreshKey }) => {
  const { api } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch employees from database
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
      setEmployees(getSampleEmployees());
    } finally {
      setLoading(false);
    }
  };

  // Sample data as fallback
  const getSampleEmployees = () => {
    return [
      { 
        id: 1,
        employee_id: 'EMP-1001',
        full_name: 'Yuki Tanaka',
        department: 'Engineering',
        designation: 'Staff Engineer',
        basic_salary: 210000,
        phone: '+1 415 555 0187',
        email: 'yuki.tanaka@example.com',
        status: 'Active',
        join_date: '2023-01-15',
        address: '123 Tech Street, San Francisco, CA 94105'
      },
      { 
        id: 2,
        employee_id: 'EMP-1002',
        full_name: 'Sofia Marchetti',
        department: 'Sales',
        designation: 'Sales Director',
        basic_salary: 155000,
        phone: '+1 415 555 0161',
        email: 'sofia.marchetti@example.com',
        status: 'Active',
        join_date: '2022-06-20',
        address: '456 Market Street, San Francisco, CA 94103'
      },
      { 
        id: 3,
        employee_id: 'EMP-1003',
        full_name: 'Devon Okafor',
        department: 'Finance',
        designation: 'Controller',
        basic_salary: 142000,
        phone: '+1 415 555 0109',
        email: 'devon.okafor@example.com',
        status: 'Inactive',
        join_date: '2021-11-01',
        address: '789 Financial Blvd, San Francisco, CA 94104'
      },
    ];
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey]);

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => {
    const name = emp.full_name || '';
    const id = emp.employee_id || '';
    const email = emp.email || '';
    const dept = emp.department || '';
    const searchLower = searchTerm.toLowerCase();
    
    return name.toLowerCase().includes(searchLower) ||
      id.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      dept.toLowerCase().includes(searchLower);
  });

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get avatar color class
  const getAvatarColor = (name) => {
    const colors = ['bg-blue', 'bg-purple', 'bg-pink', 'bg-green', 'bg-orange', 'bg-teal'];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Rs. 0';
    return `Rs. ${Number(salary).toLocaleString()}`;
  };

  // Handle delete
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    setDeleting(true);
    try {
      await api.delete(`/employees/${employeeToDelete.id}`);
      setSuccessMessage('Employee deleted successfully!');
      await fetchEmployees();
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  // Handle view
  const handleViewClick = (employee) => {
    setViewingEmployee(employee);
    setShowViewModal(true);
  };

  // Handle edit
  const handleEditClick = (employee) => {
    if (onEditClick) {
      onEditClick(employee);
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  };

  return (
    <>
      {/* Main Container */}
      <div className="employees-list-container">
        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" className="mb-3" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        {/* Header */}
        <div className="employees-header">
          <div className="employees-title">
            <h1>Employees</h1>
            <p>{employees.length} people across the organization</p>
          </div>
          <button className="add-employee-btn" onClick={onAddClick}>
            <Plus size={16} /> Add Employee
          </button>
        </div>

        {/* Table Container */}
        <div className="table-container">
          <div className="table-controls">
            <div className="local-search">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, ID, department..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="table-info">
              <span className="text-muted">
                Showing {filteredEmployees.length} of {employees.length} employees
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading employees...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Basic Salary</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td className="fw-medium">{emp.employee_id || `EMP-${String(emp.id).padStart(4, '0')}`}</td>
                        <td>
                          <div className="employee-name-cell">
                            <span className={`emp-avatar ${getAvatarColor(emp.full_name)}`}>
                              {getInitials(emp.full_name)}
                            </span>
                            <div>
                              <div className="fw-medium">{emp.full_name}</div>
                              <div className="text-muted small">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{emp.department || 'N/A'}</td>
                        <td>{emp.designation || 'N/A'}</td>
                        <td className="fw-medium">{formatSalary(emp.basic_salary)}</td>
                        <td>{emp.phone || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(emp.status)}`}>
                            {emp.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button 
                              className="action-btn" 
                              onClick={() => handleViewClick(emp)}
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="action-btn" 
                              onClick={() => handleEditClick(emp)}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDeleteClick(emp)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <p className="text-muted">No employees found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ✅ CUSTOM DELETE CONFIRMATION MODAL - CENTERED */}
      {showDeleteModal && (
        <div 
          className="custom-modal-overlay" 
          onClick={() => {
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
          }}
        >
          <div className="custom-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-content delete-modal">
              <div className="custom-modal-header delete-modal-header">
                <div className="custom-modal-title">
                  <AlertTriangle size={20} className="text-danger me-2" /> 
                  Confirm Delete
                </div>
                <button 
                  className="custom-modal-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEmployeeToDelete(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="custom-modal-body delete-modal-body">
                <div className="delete-content">
                  <AlertTriangle size={48} className="delete-icon" />
                  <p className="delete-question">
                    Are you sure you want to delete
                  </p>
                  <p className="employee-name">
                    {employeeToDelete?.full_name}?
                  </p>
                  <p className="warning-text">
                    ⚠️ This action cannot be undone!
                  </p>
                </div>
              </div>
              <div className="custom-modal-footer delete-modal-footer">
                <button 
                  className="btn-delete"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEmployeeToDelete(null);
                  }}
                >
                  Cancel
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CUSTOM VIEW EMPLOYEE MODAL */}
      {showViewModal && viewingEmployee && (
        <div 
          className="custom-modal-overlay" 
          onClick={() => setShowViewModal(false)}
        >
          <div className="custom-modal-container view-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-content view-modal">
              <div className="custom-modal-header view-modal-header">
                <div className="custom-modal-title">
                  <span className="view-title-icon"></span> Employee Details
                </div>
                <button 
                  className="custom-modal-close"
                  onClick={() => setShowViewModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="custom-modal-body view-modal-body">
                <div className="view-employee-content">
                  <div className="view-header">
                    <div className="view-avatar-lg">
                      {getInitials(viewingEmployee.full_name)}
                    </div>
                    <div className="view-info">
                      <h3>{viewingEmployee.full_name}</h3>
                      <p>{viewingEmployee.designation} • {viewingEmployee.department}</p>
                      <span className={`status-badge ${getStatusClass(viewingEmployee.status)}`}>
                        {viewingEmployee.status}
                      </span>
                    </div>
                  </div>
                  <div className="view-details-grid">
                    <div className="view-item">
                      <label>Employee ID</label>
                      <p>{viewingEmployee.employee_id}</p>
                    </div>
                    <div className="view-item">
                      <label>Email</label>
                      <p>{viewingEmployee.email || 'N/A'}</p>
                    </div>
                    <div className="view-item">
                      <label>Phone</label>
                      <p>{viewingEmployee.phone || 'N/A'}</p>
                    </div>
                    <div className="view-item">
                      <label>Basic Salary</label>
                      <p>{formatSalary(viewingEmployee.basic_salary)}</p>
                    </div>
                    <div className="view-item">
                      <label>Date of Joining</label>
                      <p>{viewingEmployee.join_date || 'N/A'}</p>
                    </div>
                    <div className="view-item">
                      <label>Address</label>
                      <p>{viewingEmployee.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="custom-modal-footer view-modal-footer">
                <button 
                  className="btn-edit"
                  onClick={() => {
                    handleEditClick(viewingEmployee);
                    setShowViewModal(false);
                  }}
                >
                  <Edit2 size={14} className="me-1" /> Edit Employee
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;