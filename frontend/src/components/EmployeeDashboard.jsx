// src/components/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, FileText, Settings, 
  LogOut, Search, Bell, ChevronDown,
  Download, Printer, Calendar, DollarSign,
  Home, CreditCard, UserCheck
} from 'lucide-react';
import EmployeeProfile from './EmployeeProfile';
import EmployeePayslip from './EmployeePayslip';
import EmployeeSettings from './EmployeeSettings';
import './EmployeeLayout.css';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load employee data
    const loadEmployeeData = () => {
      // This would come from API in production
      setEmployeeData({
        id: 'E001',
        employee_id: 'EMP001',
        fullName: 'Nimal Perera',
        email: 'nimal.perera@example.com',
        phone: '077 123 4567',
        department: 'Administration',
        designation: 'Manager',
        joinDate: '2020-01-15',
        basicSalary: 120000,
        status: 'Active',
        dob: '1990-05-15',
        nic: '900123456V',
        gender: 'Male',
        maritalStatus: 'Married',
        address: '123, Main Street, Colombo 07',
        emergencyContact: '071 987 6543'
      });
      setLoading(false);
    };
    loadEmployeeData();
  }, []);

  // ✅ Fixed: Single click logout
  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return <EmployeeProfile employee={employeeData} />;
      case 'payslip':
        return <EmployeePayslip employee={employeeData} />;
      case 'settings':
        return <EmployeeSettings employee={employeeData} />;
      default:
        return <EmployeeProfile employee={employeeData} />;
    }
  };

  if (loading) {
    return (
      <div className="employee-dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard-container">
      {/* Sidebar */}
      <aside className="employee-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">N</span>
          Northfield
        </div>
        
        <nav className="sidebar-nav">
          {/* Profile Tab */}
          <div 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile
          </div>
          
          {/* Payslip Tab */}
          <div 
            className={`nav-item ${activeTab === 'payslip' ? 'active' : ''}`}
            onClick={() => setActiveTab('payslip')}
          >
            <FileText size={18} /> Payslip
          </div>

          {/* Settings Tab */}
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </div>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <div 
            className="nav-item logout-btn" 
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                logout();
                navigate('/login');
              }
            }}
          >
            <LogOut size={18} /> Log out
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="employee-main-wrapper">
        {/* Topbar */}
        <header className="employee-topbar">
          <div className="topbar-left">
            <h2 className="page-title">
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'payslip' && 'My Payslips'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
          </div>
          
          <div className="topbar-actions">
            <Bell size={20} className="bell-icon" />
            <div className="user-profile">
              <div className="user-avatar">
                {user?.fullName ? getInitials(user.fullName) : 'E'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.fullName || user?.username || 'Employee'}</span>
                <span className="user-role">Employee</span>
              </div>
              <ChevronDown size={16} color="#6b7280" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="employee-page-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;