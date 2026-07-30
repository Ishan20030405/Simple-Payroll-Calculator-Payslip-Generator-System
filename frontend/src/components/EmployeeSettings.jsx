// src/components/EmployeeSettings.jsx
import React, { useState } from 'react';
import { 
  User, Mail, Phone, Lock, Save, 
  AlertCircle, CheckCircle, Eye, EyeOff
} from 'lucide-react';

const EmployeeSettings = ({ employee }) => {
  const [formData, setFormData] = useState({
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    emergencyContact: employee?.emergencyContact || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters!');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="employee-settings">
      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="settings-card">
          <h3><User size={18} /> Profile Settings</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label><User size={14} /> Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label><Phone size={14} /> Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label><Phone size={14} /> Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Enter emergency contact"
              />
            </div>
            <button type="submit" className="settings-btn primary" disabled={loading}>
              {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="settings-card">
          <h3><Lock size={18} /> Change Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="settings-btn primary" disabled={loading}>
              {loading ? 'Updating...' : <><Lock size={16} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="message success">
          <CheckCircle size={18} /> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="message error">
          <AlertCircle size={18} /> {errorMessage}
        </div>
      )}
    </div>
  );
};

export default EmployeeSettings;