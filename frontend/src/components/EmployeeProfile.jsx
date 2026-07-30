// src/components/EmployeeProfile.jsx
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, UserCheck } from 'lucide-react';

const EmployeeProfile = ({ employee }) => {
  if (!employee) {
    return <div className="text-center">No employee data available</div>;
  }

  return (
    <div className="employee-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          {employee.fullName?.charAt(0) || 'E'}
        </div>
        <div className="profile-info">
          <h2>{employee.fullName}</h2>
          <p className="employee-designation">{employee.designation}</p>
          <div className="employee-status-badge">
            <span className={`status-badge ${employee.status?.toLowerCase()}`}>
              {employee.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details-grid">
        {/* Personal Information */}
        <div className="profile-card">
          <h3><User size={18} /> Personal Information</h3>
          <div className="profile-field">
            <label>Full Name</label>
            <p>{employee.fullName}</p>
          </div>
          <div className="profile-field">
            <label>Date of Birth</label>
            <p>{employee.dob || 'Not provided'}</p>
          </div>
          <div className="profile-field">
            <label>NIC Number</label>
            <p>{employee.nic || 'Not provided'}</p>
          </div>
          <div className="profile-field">
            <label>Gender</label>
            <p>{employee.gender || 'Not provided'}</p>
          </div>
          <div className="profile-field">
            <label>Marital Status</label>
            <p>{employee.maritalStatus || 'Not provided'}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="profile-card">
          <h3><Mail size={18} /> Contact Information</h3>
          <div className="profile-field">
            <label><Mail size={14} /> Email</label>
            <p>{employee.email}</p>
          </div>
          <div className="profile-field">
            <label><Phone size={14} /> Phone</label>
            <p>{employee.phone}</p>
          </div>
          <div className="profile-field">
            <label><MapPin size={14} /> Address</label>
            <p>{employee.address || 'Not provided'}</p>
          </div>
          <div className="profile-field">
            <label><Phone size={14} /> Emergency Contact</label>
            <p>{employee.emergencyContact || 'Not provided'}</p>
          </div>
        </div>

        {/* Job Information */}
        <div className="profile-card">
          <h3><Briefcase size={18} /> Job Information</h3>
          <div className="profile-field">
            <label>Employee ID</label>
            <p>{employee.employee_id}</p>
          </div>
          <div className="profile-field">
            <label>Department</label>
            <p>{employee.department}</p>
          </div>
          <div className="profile-field">
            <label>Designation</label>
            <p>{employee.designation}</p>
          </div>
          <div className="profile-field">
            <label><Calendar size={14} /> Date of Joining</label>
            <p>{employee.joinDate || 'Not provided'}</p>
          </div>
        </div>

        {/* Salary Information */}
        <div className="profile-card salary-card">
          <h3><DollarSign size={18} /> Salary Information</h3>
          <div className="profile-field">
            <label>Basic Salary</label>
            <p className="salary-amount">
              Rs. {employee.basicSalary?.toLocaleString() || 0}.00
            </p>
          </div>
          <div className="profile-field">
            <label><UserCheck size={14} /> Status</label>
            <p>
              <span className={`status-badge ${employee.status?.toLowerCase()}`}>
                {employee.status || 'Active'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;