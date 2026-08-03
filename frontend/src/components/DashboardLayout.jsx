// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Calculator, 
  FileText, BarChart2, LogOut, 
  Search, Bell, ChevronDown,
  Plus, Download, Printer,
  AlertCircle, DollarSign,
  TrendingUp, UserCheck
} from 'lucide-react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();
  const [employeeStats, setEmployeeStats] = useState({ 
    total: 0, 
    active: 0, 
    inactive: 0 
  });
  const [recentPayrolls, setRecentPayrolls] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsResponse = await api.get('/employees/stats');
      setEmployeeStats(statsResponse.data);
      const payrollResponse = await api.get('/payrolls/recent');
      setRecentPayrolls(payrollResponse.data);
      const alertsResponse = await api.get('/alerts');
      setAlerts(alertsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setEmployeeStats({ total: 120, active: 112, inactive: 8 });
      setRecentPayrolls([
        { id: 1, month: 'May 2026', employees: 120, gross: '1,245,000', net: '967,500', status: 'Completed' },
        { id: 2, month: 'April 2026', employees: 118, gross: '1,198,000', net: '928,300', status: 'Completed' },
        { id: 3, month: 'March 2026', employees: 115, gross: '1,150,000', net: '890,200', status: 'Completed' },
      ]);
      setAlerts([
        { id: 1, message: '5 employees attendance not updated', type: 'warning' },
        { id: 2, message: 'Tax configuration not updated for 2026', type: 'danger' },
        { id: 3, message: 'Generate May 2026 payroll', type: 'info' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">N</span>
          Northfield
        </div>
        
        <nav className="sidebar-nav">
          {/* ✅ Dashboard Link */}
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          
          {/* ✅ Employees Link - FIXED */}
          <NavLink 
            to="/employees" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <Users size={18} /> Employees
          </NavLink>

          <NavLink to="/payroll" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Calculator size={18} /> Payroll
          </NavLink>

          <NavLink to="/payslips" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={18} /> Payslips
          </NavLink>          

          <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <BarChart2 size={18} /> Reports
          </NavLink>
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
      <div className="main-wrapper">
        <header className="topbar">
          <div className="global-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search employees, payslips..." />
          </div>
          
          <div className="topbar-actions">
            <Bell size={20} className="bell-icon" />
            <div className="user-profile">
              <div className="user-avatar">
                {user?.fullName ? getInitials(user.fullName) : 'A'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.fullName || user?.username || 'Admin'}</span>
                <span className="user-role">{user?.role || 'Admin'}</span>
              </div>
              <ChevronDown size={16} color="#6b7280" />
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;