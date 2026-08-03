// src/features/team/AddEmployeeForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';
import './AddEmployeeForm.css';

const AddEmployeeForm = ({ onCancel, onSuccess, editData }) => {
  const { api } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    basicSalary: '',
    joinDate: '',
    address: '',
    status: 'Active',
    dob: '',
    nic: '',
    gender: '',
    maritalStatus: '',
    emergencyContact: '',
    userRole: 'EMPLOYEE'
  });

  const isEditing = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({
        fullName: editData.full_name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        department: editData.department || '',
        designation: editData.designation || '',
        basicSalary: editData.basic_salary || '',
        joinDate: editData.join_date || '',
        address: editData.address || '',
        status: editData.status || 'Active',
        dob: editData.dob || '',
        nic: editData.nic || '',
        gender: editData.gender || '',
        maritalStatus: editData.marital_status || '',
        emergencyContact: editData.emergency_contact || '',
        userRole: editData.user_role || 'EMPLOYEE'
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🚀 Form submitted:', formData); // ✅ Debug log

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email) {
        setError('Full name and email are required');
        setLoading(false);
        return;
      }

      if (!formData.nic) {
        setError('NIC number is required for user account creation');
        setLoading(false);
        return;
      }

      // Prepare employee data
      const employeeData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone || null,
        department: formData.department || null,
        designation: formData.designation || null,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        joinDate: formData.joinDate || null,
        address: formData.address || null,
        status: formData.status || 'Active',
        dob: formData.dob || null,
        nic: formData.nic.trim(),
        gender: formData.gender || null,
        maritalStatus: formData.maritalStatus || null,
        emergencyContact: formData.emergencyContact || null,
        userRole: formData.userRole || 'EMPLOYEE'
      };

      console.log('📤 Sending employee data:', employeeData); // ✅ Debug log

      let employeeResponse;
      if (isEditing) {
        // Update employee
        employeeResponse = await api.put(`/employees/${editData.id}`, employeeData);
        console.log('✅ Employee updated:', employeeResponse.data);
        setSuccess('Employee updated successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        // Create new employee
        employeeResponse = await api.post('/employees', employeeData);
        console.log('✅ Employee created:', employeeResponse.data);
        setSuccess('Employee added successfully!');

        // ✅ Create user account for new employee
        if (employeeResponse.data && employeeResponse.data.employee_id) {
          const userData = {
            username: formData.email.trim(),
            password: formData.nic.trim(),
            role: formData.userRole || 'EMPLOYEE',
            employeeId: employeeResponse.data.employee_id,
            fullName: formData.fullName.trim()
          };

          console.log('📤 Creating user account:', userData); // ✅ Debug log

          try {
            const userResponse = await api.post('/auth/register-user', userData);
            console.log('✅ User created:', userResponse.data);
            setSuccess(prev => prev + ' ✅ User account created successfully!');
            setSuccess(prev => prev + ` (Username: ${formData.email}, Password: ${formData.nic})`);
          } catch (userError) {
            console.error('❌ User creation error:', userError);
            setError('Employee created but user account creation failed. Please create manually.');
            setLoading(false);
            return;
          }
        }

        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      }

    } catch (err) {
      console.error('❌ Save error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 409) {
        setError(err.response?.data?.error || 'Duplicate entry. Please check email or NIC.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Please check your input.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.error || 'Failed to save employee. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (isEditing) {
      setFormData({
        fullName: editData.full_name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        department: editData.department || '',
        designation: editData.designation || '',
        basicSalary: editData.basic_salary || '',
        joinDate: editData.join_date || '',
        address: editData.address || '',
        status: editData.status || 'Active',
        dob: editData.dob || '',
        nic: editData.nic || '',
        gender: editData.gender || '',
        maritalStatus: editData.marital_status || '',
        emergencyContact: editData.emergency_contact || '',
        userRole: editData.user_role || 'EMPLOYEE'
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        basicSalary: '',
        joinDate: '',
        address: '',
        status: 'Active',
        dob: '',
        nic: '',
        gender: '',
        maritalStatus: '',
        emergencyContact: '',
        userRole: 'EMPLOYEE'
      });
    }
    setError('');
    setSuccess('');
  };

  return (
    <div className="add-employee-container">
      <div className="add-employee-header">
        <h2>
          {isEditing ? '✏️ Edit Employee' : '➕ Add Employee'}
          {!isEditing && <span className="badge bg-info ms-2">Auto-create User</span>}
        </h2>
        <button className="close-btn" onClick={onCancel} type="button">
          <X size={18} />
        </button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Row 1 */}
          <div className="form-group">
            <label>Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              name="fullName"
              placeholder="e.g. Jordan Blake" 
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email <span className="text-danger">*</span></label>
            <input 
              type="email" 
              className="form-control" 
              name="email"
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="phone"
              placeholder="+1 415 555 0100" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              className="form-control" 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Row 3 */}
          <div className="form-group">
            <label>NIC Number <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              name="nic"
              placeholder="e.g. 900123456V" 
              value={formData.nic}
              onChange={handleChange}
              required
            />
            <small className="text-muted">Used as default password for user account</small>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select 
              className="form-control" 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 4 */}
          <div className="form-group">
            <label>Department</label>
            <select 
              className="form-control" 
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="Administration">Administration</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="IT">IT</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Production">Production</option>
            </select>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input 
              type="text" 
              className="form-control" 
              name="designation"
              placeholder="e.g. Product Designer" 
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          {/* Row 5 */}
          <div className="form-group">
            <label>Basic Salary (Annual)</label>
            <input 
              type="number" 
              className="form-control" 
              name="basicSalary"
              placeholder="100000" 
              value={formData.basicSalary}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Joining Date</label>
            <input 
              type="date" 
              className="form-control" 
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
            />
          </div>

          {/* Row 6 */}
          <div className="form-group">
            <label>Marital Status</label>
            <select 
              className="form-control" 
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Emergency Contact</label>
            <input 
              type="text" 
              className="form-control" 
              name="emergencyContact"
              placeholder="Emergency contact details" 
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>

          {/* Row 7 */}
          <div className="form-group">
            <label>Address</label>
            <textarea 
              className="form-control" 
              name="address"
              placeholder="Street, city, state" 
              value={formData.address}
              onChange={handleChange}
              rows="2"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select 
              className="form-control" 
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* User Account Type */}
          <div className="form-group full-width">
            <label>
              <UserPlus size={16} className="me-1" /> User Account Type <span className="text-danger">*</span>
            </label>
            <select 
              className="form-control" 
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              required
            >
              <option value="EMPLOYEE">👤 Employee</option>
              <option value="HR">👔 HR</option>
              <option value="ADMIN">👑 Admin</option>
            </select>
            <small className="text-muted">
              Username = Email | Password = NIC Number
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-1" /> {isEditing ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save size={16} className="me-1" /> {isEditing ? 'Update Employee' : 'Save Employee'}
              </>
            )}
          </button>
          <button type="reset" className="btn-secondary" onClick={handleReset}>
            <RefreshCw size={14} className="me-1" /> Reset
          </button>
          <button type="button" className="btn-text" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;